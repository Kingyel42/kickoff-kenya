import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Calendar, 
  Trophy, 
  Target, 
  Star,
  ArrowRight,
  MapPin,
  Clock,
  Users
} from "lucide-react";
import type { Profile, Match } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Get upcoming matches
  const { data: upcomingMatches } = await supabase
    .from("matches")
    .select(`
      *,
      organizer:profiles!matches_organizer_id_fkey(id, full_name, avatar_url),
      turf:turfs(name, location)
    `)
    .gte("match_date", new Date().toISOString().split("T")[0])
    .eq("status", "open")
    .order("match_date", { ascending: true })
    .limit(3);

  // Get recent activity (matches played)
  const { data: recentMatches } = await supabase
    .from("match_players")
    .select(`
      *,
      match:matches(id, title, match_date, status, team_a_score, team_b_score)
    `)
    .eq("player_id", user?.id)
    .order("joined_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Matches Played", value: profile?.matches_played || 0, icon: Calendar },
    { label: "Matches Won", value: profile?.matches_won || 0, icon: Trophy },
    { label: "Goals Scored", value: profile?.goals_scored || 0, icon: Target },
    { label: "Rating", value: profile?.average_rating?.toFixed(1) || "0.0", icon: Star },
  ];

  return (
    <div className="pt-14 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Player"}!
          </h1>
          <p className="text-muted-foreground">
            Ready for your next match? Here&apos;s what&apos;s happening.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/matches">
              Find Matches
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/matches/create">
              Create Match
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Matches */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Upcoming Matches</CardTitle>
              <CardDescription>Games happening near you</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/matches">
                View all
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMatches && upcomingMatches.length > 0 ? (
              upcomingMatches.map((match: any) => (
                <Link
                  key={match.id}
                  href={`/dashboard/matches/${match.id}`}
                  className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{match.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{match.turf?.name || match.location}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(match.match_date).toLocaleDateString("en-KE", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {match.start_time?.slice(0, 5)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {match.current_players}/{match.max_players}
                        </span>
                      </div>
                    </div>
                    <Badge variant={match.current_players >= match.max_players ? "secondary" : "default"}>
                      {match.current_players >= match.max_players ? "Full" : "Open"}
                    </Badge>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming matches found</p>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/matches/create">Create a Match</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Player Profile Card */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Your Profile</CardTitle>
              <CardDescription>Your player stats at a glance</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/profile">
                Edit
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {profile?.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-foreground">{profile?.full_name || "Player"}</h3>
                <p className="text-sm text-muted-foreground">@{profile?.username || "username"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {profile?.preferred_position || "midfielder"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {profile?.skill_level || "intermediate"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-secondary/50">
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{profile?.goals_scored || 0}</p>
                <p className="text-xs text-muted-foreground">Goals</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{profile?.assists || 0}</p>
                <p className="text-xs text-muted-foreground">Assists</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{profile?.clean_sheets || 0}</p>
                <p className="text-xs text-muted-foreground">Clean Sheets</p>
              </div>
            </div>

            {/* Location */}
            {profile?.location && (
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Your match history and performance</CardDescription>
        </CardHeader>
        <CardContent>
          {recentMatches && recentMatches.length > 0 ? (
            <div className="space-y-3">
              {recentMatches.map((mp: any) => (
                <div
                  key={mp.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{mp.match?.title || "Match"}</p>
                    <p className="text-sm text-muted-foreground">
                      {mp.match?.match_date
                        ? new Date(mp.match.match_date).toLocaleDateString("en-KE", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    {mp.match?.status === "completed" ? (
                      <p className="text-sm font-medium text-foreground">
                        {mp.match?.team_a_score} - {mp.match?.team_b_score}
                      </p>
                    ) : (
                      <Badge variant="outline">{mp.match?.status}</Badge>
                    )}
                    {mp.goals > 0 && (
                      <p className="text-xs text-primary">{mp.goals} goal{mp.goals > 1 ? "s" : ""}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity yet</p>
              <p className="text-sm text-muted-foreground mt-1">Join a match to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
