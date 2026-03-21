-- Auto-create profile and wallet on user signup

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create wallet
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update player stats after a match
CREATE OR REPLACE FUNCTION public.update_player_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  -- Calculate new average rating for the rated player
  SELECT 
    ROUND(AVG((passing_rating + teamwork_rating + finishing_rating + defense_rating) / 4.0), 2)
  INTO avg_rating
  FROM public.player_ratings
  WHERE rated_player_id = NEW.rated_player_id;

  -- Update player profile with new rating
  UPDATE public.profiles
  SET 
    overall_rating = COALESCE(avg_rating, 0),
    updated_at = NOW()
  WHERE id = NEW.rated_player_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_rating_created ON public.player_ratings;

CREATE TRIGGER on_rating_created
  AFTER INSERT ON public.player_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_player_stats();

-- Function to update match player count
CREATE OR REPLACE FUNCTION public.update_match_player_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.matches
    SET 
      current_players = current_players + 1,
      status = CASE WHEN current_players + 1 >= max_players THEN 'full' ELSE status END,
      updated_at = NOW()
    WHERE id = NEW.match_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.matches
    SET 
      current_players = GREATEST(current_players - 1, 0),
      status = CASE WHEN status = 'full' THEN 'open' ELSE status END,
      updated_at = NOW()
    WHERE id = OLD.match_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS on_match_player_change ON public.match_players;

CREATE TRIGGER on_match_player_change
  AFTER INSERT OR DELETE ON public.match_players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_match_player_count();

-- Function to update reliability score
CREATE OR REPLACE FUNCTION public.update_reliability_score(
  p_player_id UUID,
  p_change INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    reliability_score = GREATEST(0, LEAST(100, reliability_score + p_change)),
    updated_at = NOW()
  WHERE id = p_player_id;
END;
$$;

-- Function to increment matches played
CREATE OR REPLACE FUNCTION public.increment_matches_played(p_player_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    matches_played = matches_played + 1,
    updated_at = NOW()
  WHERE id = p_player_id;
END;
$$;
