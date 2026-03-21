export type Position = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';
export type MatchStatus = 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';
export type MatchType = 'pickup' | 'challenge' | 'tournament';
export type TransactionType = 'deposit' | 'withdrawal' | 'match_fee' | 'refund' | 'prize';
export type ChallengeStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  phone_number: string | null;
  location: string | null;
  preferred_position: Position;
  skill_level: SkillLevel;
  bio: string | null;
  matches_played: number;
  matches_won: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  average_rating: number;
  total_ratings: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  captain_id: string;
  location: string | null;
  matches_played: number;
  matches_won: number;
  goals_scored: number;
  goals_conceded: number;
  rating: number;
  is_recruiting: boolean;
  created_at: string;
  captain?: Profile;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  player_id: string;
  role: 'captain' | 'vice_captain' | 'member';
  jersey_number: number | null;
  joined_at: string;
  player?: Profile;
  team?: Team;
}

export interface Turf {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string | null;
  image_url: string | null;
  price_per_hour: number;
  amenities: string[];
  capacity: number;
  rating: number;
  total_reviews: number;
  contact_phone: string | null;
  contact_email: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TurfSlot {
  id: string;
  turf_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  booked_by: string | null;
  match_id: string | null;
  turf?: Turf;
}

export interface Match {
  id: string;
  title: string;
  description: string | null;
  organizer_id: string;
  turf_id: string | null;
  slot_id: string | null;
  match_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_players: number;
  current_players: number;
  entry_fee: number;
  prize_pool: number;
  match_type: MatchType;
  status: MatchStatus;
  skill_level_required: SkillLevel | null;
  team_a_id: string | null;
  team_b_id: string | null;
  team_a_score: number | null;
  team_b_score: number | null;
  mvp_id: string | null;
  created_at: string;
  organizer?: Profile;
  turf?: Turf;
  slot?: TurfSlot;
  team_a?: Team;
  team_b?: Team;
  mvp?: Profile;
  players?: MatchPlayer[];
}

export interface MatchPlayer {
  id: string;
  match_id: string;
  player_id: string;
  team_side: 'A' | 'B' | null;
  position_played: Position | null;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  is_mvp: boolean;
  joined_at: string;
  player?: Profile;
  match?: Match;
}

export interface PlayerRating {
  id: string;
  rater_id: string;
  rated_player_id: string;
  match_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  rater?: Profile;
  rated_player?: Profile;
  match?: Match;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface TeamChallenge {
  id: string;
  challenger_team_id: string;
  challenged_team_id: string;
  match_id: string | null;
  proposed_date: string;
  proposed_time: string;
  proposed_location: string | null;
  stake_amount: number;
  message: string | null;
  status: ChallengeStatus;
  created_at: string;
  challenger_team?: Team;
  challenged_team?: Team;
  match?: Match;
}

export interface Achievement {
  id: string;
  player_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string | null;
  icon_url: string | null;
  earned_at: string;
  player?: Profile;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  profile: Profile;
  value: number;
}

export interface MatchWithDetails extends Match {
  organizer: Profile;
  players: (MatchPlayer & { player: Profile })[];
  turf?: Turf;
}

export interface TeamWithMembers extends Team {
  captain: Profile;
  members: (TeamMember & { player: Profile })[];
}

// ─── Pricing & Match Lifecycle (from 004_turf_pricing.sql) ───────────────────

export type MatchFormat = '5aside' | '6aside' | '7aside' | '8aside' | '11aside';
export type AccountStatus = 'active' | 'warned' | 'restricted' | 'banned';
export type RefundStatus = 'none' | 'pending' | 'processed';

export interface TurfPricing {
  id: string;
  turf_id: string;
  format: MatchFormat;
  price_per_slot: number;    // total KES for the full slot
  max_players: number;
  duration_minutes: number;
  created_at: string;
  turf?: Turf;
}

/** Pricing breakdown shown to users before they pay */
export interface MatchPricingBreakdown {
  total_turf_price: number;   // e.g. 1000
  max_players: number;         // e.g. 10
  cost_per_player: number;     // 1000 / 10 = 100
  platform_fee: number;        // 10% = 10
  player_pays: number;         // 110
  currency: 'KES';
}

export interface MatchWaitlist {
  id: string;
  match_id: string;
  player_id: string;
  position: number;
  notified_at: string | null;
  joined_at: string;
  player?: Profile;
}

export interface BehaviourTag {
  id: string;
  match_id: string;
  rater_id: string;
  rated_player_id: string;
  thumbs_up: boolean;
  tags: string[];
  created_at: string;
  rater?: Profile;
  rated_player?: Profile;
}

/** Reliability tier derived from score */
export interface ReliabilityTier {
  score: number;
  tier: 'Elite' | 'Good' | 'Caution' | 'Restricted';
  badge_colour: string;
  can_join_paid: boolean;
}

export function getReliabilityTier(score: number): ReliabilityTier {
  if (score >= 90) return { score, tier: 'Elite',      badge_colour: '#186637', can_join_paid: true };
  if (score >= 70) return { score, tier: 'Good',       badge_colour: '#2a8c4a', can_join_paid: true };
  if (score >= 50) return { score, tier: 'Caution',    badge_colour: '#b07d1a', can_join_paid: true };
  return              { score, tier: 'Restricted',  badge_colour: '#c0392b', can_join_paid: false };
}

/** Cancellation refund policy — time-based tiers */
export interface CancellationTier {
  label: string;
  description: string;
  refund_pct: number;  // 0-100
}

export const CANCELLATION_POLICY: CancellationTier[] = [
  { label: '>24 hours',        description: 'More than 24 hours before match',  refund_pct: 100 },
  { label: '2–24 hours',       description: '2 to 24 hours before match',        refund_pct: 50  },
  { label: '<2 hours',         description: 'Less than 2 hours before match',    refund_pct: 0   },
  { label: 'No-show',          description: 'Did not check in',                  refund_pct: 0   },
];

/** Positive and negative behaviour tags for post-match rating */
export const POSITIVE_TAGS = [
  'Great attitude',
  'Always on time',
  'Good communicator',
  'Skilled player',
  'Fair play',
  'Reliable',
] as const;

export const NEGATIVE_TAGS = [
  'Late arrival',
  'No-show',
  'Poor attitude',
  'Rough play',
  'Ball hog',
  'Poor communication',
] as const;

export type PositiveTag = typeof POSITIVE_TAGS[number];
export type NegativeTag = typeof NEGATIVE_TAGS[number];
