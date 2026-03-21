-- KickOff Kenya Database Schema
-- Full-stack pickup football platform for Kenya

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PROFILES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  preferred_position TEXT CHECK (preferred_position IN ('Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Any')),
  skill_level TEXT CHECK (skill_level IN ('Beginner', 'Casual', 'Intermediate', 'Competitive', 'Elite')) DEFAULT 'Casual',
  phone TEXT,
  location TEXT,
  bio TEXT,
  -- Computed stats (updated via triggers)
  matches_played INTEGER DEFAULT 0,
  overall_rating DECIMAL(3,2) DEFAULT 0.00,
  reliability_score INTEGER DEFAULT 100,
  -- Premium subscription
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- =====================
-- TEAMS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  location TEXT,
  skill_level TEXT CHECK (skill_level IN ('Beginner', 'Casual', 'Intermediate', 'Competitive', 'Elite')),
  matches_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teams_select_all" ON public.teams FOR SELECT USING (true);
CREATE POLICY "teams_insert_auth" ON public.teams FOR INSERT WITH CHECK (auth.uid() = captain_id);
CREATE POLICY "teams_update_captain" ON public.teams FOR UPDATE USING (auth.uid() = captain_id);
CREATE POLICY "teams_delete_captain" ON public.teams FOR DELETE USING (auth.uid() = captain_id);

-- =====================
-- TEAM MEMBERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('Captain', 'Vice-Captain', 'Member')) DEFAULT 'Member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, player_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_members_select_all" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "team_members_insert" ON public.team_members FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT captain_id FROM public.teams WHERE id = team_id) OR auth.uid() = player_id
);
CREATE POLICY "team_members_delete" ON public.team_members FOR DELETE USING (
  auth.uid() IN (SELECT captain_id FROM public.teams WHERE id = team_id) OR auth.uid() = player_id
);

-- =====================
-- TURFS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.turfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photos TEXT[], -- Array of photo URLs
  pitch_sizes TEXT[] CHECK (pitch_sizes <@ ARRAY['5-aside', '6-aside', '7-aside', '8-aside']),
  amenities TEXT[], -- e.g., ['Parking', 'Changing rooms', 'Floodlights', 'Refreshments']
  price_per_hour INTEGER NOT NULL, -- In KES
  opening_time TIME DEFAULT '06:00',
  closing_time TIME DEFAULT '22:00',
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.turfs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "turfs_select_all" ON public.turfs FOR SELECT USING (true);
CREATE POLICY "turfs_insert_auth" ON public.turfs FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "turfs_update_owner" ON public.turfs FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "turfs_delete_owner" ON public.turfs FOR DELETE USING (auth.uid() = owner_id);

-- =====================
-- TURF TIME SLOTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.turf_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turf_id UUID NOT NULL REFERENCES public.turfs(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price INTEGER NOT NULL, -- Price for this specific slot
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(turf_id, date, start_time)
);

ALTER TABLE public.turf_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "turf_slots_select_all" ON public.turf_slots FOR SELECT USING (true);
CREATE POLICY "turf_slots_insert" ON public.turf_slots FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT owner_id FROM public.turfs WHERE id = turf_id)
);
CREATE POLICY "turf_slots_update" ON public.turf_slots FOR UPDATE USING (
  auth.uid() IN (SELECT owner_id FROM public.turfs WHERE id = turf_id)
);

-- =====================
-- MATCHES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  turf_id UUID REFERENCES public.turfs(id) ON DELETE SET NULL,
  turf_slot_id UUID REFERENCES public.turf_slots(id) ON DELETE SET NULL,
  
  -- Match details
  title TEXT NOT NULL,
  description TEXT,
  match_type TEXT CHECK (match_type IN ('individual', 'team_vs_team', 'king_of_pitch')) DEFAULT 'individual',
  pitch_size TEXT CHECK (pitch_size IN ('5-aside', '6-aside', '7-aside', '8-aside')) DEFAULT '5-aside',
  skill_level TEXT CHECK (skill_level IN ('Beginner', 'Casual', 'Intermediate', 'Competitive', 'Elite', 'Any')) DEFAULT 'Any',
  
  -- Scheduling
  match_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  
  -- Capacity
  max_players INTEGER NOT NULL,
  current_players INTEGER DEFAULT 0,
  
  -- Payment
  price_per_player INTEGER NOT NULL, -- In KES
  total_collected INTEGER DEFAULT 0,
  
  -- Status
  status TEXT CHECK (status IN ('open', 'full', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  check_in_open BOOLEAN DEFAULT FALSE,
  
  -- For team matches
  team_a_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  team_b_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  team_a_score INTEGER,
  team_b_score INTEGER,
  
  -- Location fallback if no turf
  custom_location TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches_select_all" ON public.matches FOR SELECT USING (true);
CREATE POLICY "matches_insert_auth" ON public.matches FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "matches_update_creator" ON public.matches FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "matches_delete_creator" ON public.matches FOR DELETE USING (auth.uid() = creator_id);

-- =====================
-- MATCH PLAYERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.match_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_assignment TEXT CHECK (team_assignment IN ('A', 'B', 'unassigned')) DEFAULT 'unassigned',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  check_in_status TEXT CHECK (check_in_status IN ('not_checked_in', 'checked_in', 'no_show')) DEFAULT 'not_checked_in',
  checked_in_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "match_players_select_all" ON public.match_players FOR SELECT USING (true);
CREATE POLICY "match_players_insert" ON public.match_players FOR INSERT WITH CHECK (auth.uid() = player_id);
CREATE POLICY "match_players_update" ON public.match_players FOR UPDATE USING (
  auth.uid() = player_id OR 
  auth.uid() IN (SELECT creator_id FROM public.matches WHERE id = match_id)
);
CREATE POLICY "match_players_delete" ON public.match_players FOR DELETE USING (
  auth.uid() = player_id OR 
  auth.uid() IN (SELECT creator_id FROM public.matches WHERE id = match_id)
);

-- =====================
-- PLAYER RATINGS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.player_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rated_player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  passing_rating INTEGER CHECK (passing_rating >= 1 AND passing_rating <= 5),
  teamwork_rating INTEGER CHECK (teamwork_rating >= 1 AND teamwork_rating <= 5),
  finishing_rating INTEGER CHECK (finishing_rating >= 1 AND finishing_rating <= 5),
  defense_rating INTEGER CHECK (defense_rating >= 1 AND defense_rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, rater_id, rated_player_id)
);

ALTER TABLE public.player_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ratings_select_all" ON public.player_ratings FOR SELECT USING (true);
CREATE POLICY "ratings_insert" ON public.player_ratings FOR INSERT WITH CHECK (
  auth.uid() = rater_id AND
  -- Ensure both rater and rated player were in the same match
  EXISTS (
    SELECT 1 FROM public.match_players WHERE match_id = player_ratings.match_id AND player_id = auth.uid()
  ) AND
  EXISTS (
    SELECT 1 FROM public.match_players WHERE match_id = player_ratings.match_id AND player_id = rated_player_id
  )
);

-- =====================
-- WALLET / TRANSACTIONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER DEFAULT 0, -- In KES
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallets_select_own" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wallets_insert_own" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wallets_update_own" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('deposit', 'withdrawal', 'match_payment', 'match_refund', 'match_payout', 'platform_fee')) NOT NULL,
  amount INTEGER NOT NULL, -- In KES
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  description TEXT,
  reference TEXT, -- External payment reference (e.g., M-Pesa code)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================
-- NOTIFICATIONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('match_full', 'match_starting', 'challenge_received', 'challenge_accepted', 'slot_opened', 'rating_received', 'payment', 'system')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- TEAM CHALLENGES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.team_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  challenged_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  proposed_date DATE,
  proposed_time TIME,
  proposed_turf_id UUID REFERENCES public.turfs(id),
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'expired')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

ALTER TABLE public.team_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenges_select" ON public.team_challenges FOR SELECT USING (
  auth.uid() IN (SELECT captain_id FROM public.teams WHERE id = challenger_team_id) OR
  auth.uid() IN (SELECT captain_id FROM public.teams WHERE id = challenged_team_id)
);
CREATE POLICY "challenges_insert" ON public.team_challenges FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT captain_id FROM public.teams WHERE id = challenger_team_id)
);
CREATE POLICY "challenges_update" ON public.team_challenges FOR UPDATE USING (
  auth.uid() IN (SELECT captain_id FROM public.teams WHERE id = challenged_team_id)
);

-- =====================
-- PLAYER ACHIEVEMENTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL, -- e.g., 'first_match', 'ten_matches', 'reliable_player', 'top_rated', 'captain'
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, badge_type)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements_select_all" ON public.achievements FOR SELECT USING (true);

-- =====================
-- INDEXES FOR PERFORMANCE
-- =====================
CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_location ON public.matches(turf_id);
CREATE INDEX IF NOT EXISTS idx_match_players_match ON public.match_players(match_id);
CREATE INDEX IF NOT EXISTS idx_match_players_player ON public.match_players(player_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_player ON public.team_members(player_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_turfs_location ON public.turfs(location);
CREATE INDEX IF NOT EXISTS idx_turf_slots_date ON public.turf_slots(turf_id, date);
