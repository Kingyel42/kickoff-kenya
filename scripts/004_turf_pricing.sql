-- ============================================================
-- KickOff Kenya — Script 004: Turf Pricing & Match Lifecycle
-- Run AFTER scripts 001, 002, 003
-- ============================================================

-- Per-format pricing table (replaces single price_per_hour on turfs)
CREATE TABLE IF NOT EXISTS public.turf_pricing (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turf_id         UUID NOT NULL REFERENCES public.turfs(id) ON DELETE CASCADE,
  format          TEXT NOT NULL CHECK (format IN ('5aside','6aside','7aside','8aside','11aside')),
  price_per_slot  INTEGER NOT NULL,   -- total KES for the full slot
  max_players     INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(turf_id, format)
);

ALTER TABLE public.turf_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "turf_pricing_select_all" ON public.turf_pricing FOR SELECT USING (true);
CREATE POLICY "turf_pricing_insert_auth" ON public.turf_pricing FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Lock cost_per_player on matches at creation time (never recalculate)
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS cost_per_player  INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_fee     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS player_pays      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_players      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cancellation_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS check_in_open    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS check_in_close   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS format           TEXT CHECK (format IN ('5aside','6aside','7aside','8aside','11aside'));

-- Reliability score additions
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reliability_score   INTEGER DEFAULT 80,
  ADD COLUMN IF NOT EXISTS no_show_count_30d   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS account_status      TEXT DEFAULT 'active'
    CHECK (account_status IN ('active','warned','restricted','banned')),
  ADD COLUMN IF NOT EXISTS username            TEXT,
  ADD COLUMN IF NOT EXISTS full_name           TEXT,
  ADD COLUMN IF NOT EXISTS preferred_position  TEXT,
  ADD COLUMN IF NOT EXISTS skill_level         TEXT,
  ADD COLUMN IF NOT EXISTS matches_played      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS matches_won         INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS goals_scored        INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS assists             INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clean_sheets        INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_rating      NUMERIC(3,2) DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS total_ratings       INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_verified         BOOLEAN DEFAULT FALSE;

-- Match player additions: check-in and no-show tracking
ALTER TABLE public.match_players
  ADD COLUMN IF NOT EXISTS checked_in      BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS checked_in_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_no_show      BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS payment_id      TEXT,
  ADD COLUMN IF NOT EXISTS amount_paid     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS refund_amount   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS refund_status   TEXT DEFAULT 'none'
    CHECK (refund_status IN ('none','pending','processed'));

-- Behaviour tags for post-match ratings (replaces star ratings)
CREATE TABLE IF NOT EXISTS public.behaviour_tags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id        UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  rater_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rated_player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  thumbs_up       BOOLEAN NOT NULL,                    -- true = positive, false = negative
  tags            TEXT[] DEFAULT '{}',                 -- e.g. ARRAY['Great attitude','On time']
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, rater_id, rated_player_id)          -- one rating per player per match
);

ALTER TABLE public.behaviour_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_select_all"      ON public.behaviour_tags FOR SELECT USING (true);
CREATE POLICY "tags_insert_own"      ON public.behaviour_tags FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- Waitlist for full matches
CREATE TABLE IF NOT EXISTS public.match_waitlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  notified_at TIMESTAMPTZ,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

ALTER TABLE public.match_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "waitlist_select" ON public.match_waitlist FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "waitlist_insert" ON public.match_waitlist FOR INSERT WITH CHECK (auth.uid() = player_id);
CREATE POLICY "waitlist_delete" ON public.match_waitlist FOR DELETE USING (auth.uid() = player_id);

-- ============================================================
-- FUNCTION: Calculate locked pricing at match creation
-- cost_per_player = total_price / max_players (NEVER changes)
-- platform_fee    = cost_per_player * 10%
-- player_pays     = cost_per_player + platform_fee
-- ============================================================
CREATE OR REPLACE FUNCTION public.calculate_match_pricing(
  p_total_price INTEGER,
  p_max_players INTEGER
)
RETURNS TABLE (
  cost_per_player INTEGER,
  platform_fee    INTEGER,
  player_pays     INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_cost INTEGER;
  v_fee  INTEGER;
BEGIN
  IF p_max_players <= 0 THEN
    RAISE EXCEPTION 'max_players must be greater than 0';
  END IF;
  v_cost := p_total_price / p_max_players;
  v_fee  := ROUND(v_cost * 0.10);
  RETURN QUERY SELECT v_cost, v_fee, (v_cost + v_fee);
END;
$$;

GRANT EXECUTE ON FUNCTION public.calculate_match_pricing(INTEGER, INTEGER) TO authenticated;

-- ============================================================
-- FUNCTION: Update reliability score after match events
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_reliability_score(
  p_player_id UUID,
  p_delta     INTEGER,
  p_reason    TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET
    reliability_score = GREATEST(0, LEAST(100, reliability_score + p_delta)),
    account_status = CASE
      WHEN GREATEST(0, LEAST(100, reliability_score + p_delta)) < 50 THEN 'restricted'
      WHEN GREATEST(0, LEAST(100, reliability_score + p_delta)) < 70 THEN 'warned'
      ELSE 'active'
    END,
    updated_at = NOW()
  WHERE id = p_player_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_reliability_score(UUID, INTEGER, TEXT) TO authenticated;

-- ============================================================
-- FUNCTION: Flag no-shows after check-in window closes
-- Call this via a cron job or on-demand after match start + 10min
-- ============================================================
CREATE OR REPLACE FUNCTION public.process_no_shows(p_match_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_no_show_count INTEGER := 0;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT mp.player_id
    FROM   public.match_players mp
    WHERE  mp.match_id = p_match_id
      AND  mp.checked_in = FALSE
      AND  mp.is_no_show = FALSE
  LOOP
    UPDATE public.match_players
    SET is_no_show = TRUE
    WHERE match_id = p_match_id AND player_id = rec.player_id;

    -- Deduct reliability score: -15 for no-show
    PERFORM public.update_reliability_score(rec.player_id, -15, 'no_show');

    -- Track rolling 30-day no-show count
    UPDATE public.profiles
    SET no_show_count_30d = no_show_count_30d + 1
    WHERE id = rec.player_id;

    v_no_show_count := v_no_show_count + 1;
  END LOOP;

  RETURN v_no_show_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.process_no_shows(UUID) TO authenticated;

-- ============================================================
-- Sample turf pricing (replace turf IDs with real ones after insert)
-- INSERT INTO public.turf_pricing (turf_id, format, price_per_slot, max_players, duration_minutes)
-- VALUES
--   ('YOUR-TURF-UUID', '5aside',  1000, 10, 60),
--   ('YOUR-TURF-UUID', '7aside',  1500, 14, 60),
--   ('YOUR-TURF-UUID', '11aside', 2500, 22, 90);
-- ============================================================
