import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Target, 
  Star,
  Medal,
  Crown,
  TrendingUp
} from "lucide-react";
import type { Profile } from "@/lib/types";

export default async function LeaderboardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Top scorers
  const { data: topScorers } = await supabase
    .from("profiles")
    .select("*")
    .order("goals_scored", { ascending: false })
    .limit(10);

  // Most wins
  const { data: topWinners } = await supabase
    .from("profiles")
    .select("*")
    .order("matches_won", { ascending: false })
    .limit(10);

  // Highest rated
  const { data: topRated } = await supabase
    .from("profiles")
    .select("*")
    .gt("total_ratings", 0)
    .order("average_rating", { ascending: false })
    .limit(10);

  // Most assists
  const { data: topAssisters } = await supabase
    .from("profiles")
    .select("*")
    .order("assists", { ascending: false })
    .limit(10);

  // Get current user's rank
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="pt-14 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          Leaderboards
        </h1>
        <p className="text-muted-foreground">See who&apos;s dominating the pitch</p>
      </div>

      {/* User Quick Stats */}
      {userProfile && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={userProfile.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {userProfile.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{userProfile.full_name}</h3>
                  <p className="text-sm text-muted-foreground">Your Stats</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userProfile.goals_scored}</p>
                  <p className="text-xs text-muted-foreground">Goals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userProfile.assists}</p>
                  <p className="text-xs text-muted-foreground">Assists</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userProfile.matches_won}</p>
                  <p className="text-xs text-muted-foreground">Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {userProfile.average_rating?.toFixed(1) || "0.0"}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="scorers" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="scorers" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Top Scorers</span>
            <span className="sm:hidden">Scorers</span>
          </TabsTrigger>
          <TabsTrigger value="winners" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Most Wins</span>
            <span className="sm:hidden">Wins</span>
          </TabsTrigger>
          <TabsTrigger value="rated" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Highest Rated</span>
            <span className="sm:hidden">Rating</span>
          </TabsTrigger>
          <TabsTrigger value="assists" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Top Assists</span>
            <span className="sm:hidden">Assists</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scorers">
          <LeaderboardTable
            title="Top Scorers"
            description="Players with the most goals"
            players={topScorers || []}
            valueKey="goals_scored"
            valueLabel="Goals"
            currentUserId={user?.id}
          />
        </TabsContent>

        <TabsContent value="winners">
          <LeaderboardTable
            title="Most Wins"
            description="Players with the most match victories"
            players={topWinners || []}
            valueKey="matches_won"
            valueLabel="Wins"
            currentUserId={user?.id}
          />
        </TabsContent>

        <TabsContent value="rated">
          <LeaderboardTable
            title="Highest Rated"
            description="Players with the best community ratings"
            players={topRated || []}
            valueKey="average_rating"
            valueLabel="Rating"
            isRating
            currentUserId={user?.id}
          />
        </TabsContent>

        <TabsContent value="assists">
          <LeaderboardTable
            title="Top Assists"
            description="Players with the most assists"
            players={topAssisters || []}
            valueKey="assists"
            valueLabel="Assists"
            currentUserId={user?.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeaderboardTable({
  title,
  description,
  players,
  valueKey,
  valueLabel,
  isRating = false,
  currentUserId,
}: {
  title: string;
  description: string;
  players: Profile[];
  valueKey: keyof Profile;
  valueLabel: string;
  isRating?: boolean;
  currentUserId?: string;
}) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-medium">{rank}</span>;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {players.length > 0 ? (
          <div className="space-y-3">
            {players.map((player, index) => {
              const rank = index + 1;
              const isCurrentUser = player.id === currentUserId;
              const value = player[valueKey];
              const displayValue = isRating 
                ? (typeof value === 'number' ? value.toFixed(1) : "0.0")
                : value;

              return (
                <div
                  key={player.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                    isCurrentUser 
                      ? "bg-primary/10 border border-primary/20" 
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  <div className="w-8 flex justify-center">
                    {getRankIcon(rank)}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={player.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {player.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground truncate">
                        {player.full_name}
                      </h4>
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      @{player.username} · {player.location || "Kenya"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{displayValue}</p>
                    <p className="text-xs text-muted-foreground">{valueLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No data available yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Play more matches to appear on the leaderboard!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
