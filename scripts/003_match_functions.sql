-- Function to increment match player count
create or replace function increment_match_players(match_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update matches
  set current_players = current_players + 1
  where id = match_id;
end;
$$;

-- Function to decrement match player count
create or replace function decrement_match_players(match_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update matches
  set current_players = greatest(current_players - 1, 0)
  where id = match_id;
end;
$$;

-- Function to get match player count
create or replace function get_match_player_count(match_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  player_count integer;
begin
  select count(*) into player_count
  from match_players
  where match_players.match_id = $1;
  
  return player_count;
end;
$$;

-- Grant execute permissions
grant execute on function increment_match_players(uuid) to authenticated;
grant execute on function decrement_match_players(uuid) to authenticated;
grant execute on function get_match_player_count(uuid) to authenticated;
