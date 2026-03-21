import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Star, Target, Trophy, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: player } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!player) {
    notFound();
  }

  const winRate =
    player.matches_played > 0
      ? Math.round((player.matches_won / player.matches_played) * 100)
      : 0;

  const initials = player.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "P";

  // Get the player's teams
  const { data: teamMemberships } = await supabase
    .from("team_members")
    .select(`
      *,
      team:teams(id, name, logo_url)
    `)
    .eq("player_id", id);

  return (
    <div className="pt-16 space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={player.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-foreground">{player.full_name}</h2>
                <p className="text-muted-foreground">@{player.username}</p>

                <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                  <Badge className="capitalize">{player.preferred_position}</Badge>
                  <Badge variant="outline" className="capitalize">{player.skill_level}</Badge>
                  {player.is_verified && (
                    <Badge variant="secondary">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {player.location && (
                  <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {player.location}
                  </div>
                )}

                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined{" "}
                  {new Date(player.created_at).toLocaleDateString("en-KE", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary/10">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="text-lg font-bold text-primary">
                    {player.average_rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({player.total_ratings || 0} ratings)
                  </span>
                </div>
              </div>

              {player.bio && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">{player.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teams */}
          {teamMemberships && teamMemberships.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Teams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamMemberships.map((tm: any) => (
                  <Link
                    key={tm.id}
                    href={`/dashboard/teams/${tm.team?.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={tm.team?.logo_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {tm.team?.name?.[0] || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{tm.team?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{tm.role}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Career Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: "Matches Played", value: player.matches_played || 0 },
                  { label: "Matches Won", value: player.matches_won || 0 },
                  { label: "Win Rate", value: `${winRate}%` },
                  { label: "Goals Scored", value: player.goals_scored || 0 },
                  { label: "Assists", value: player.assists || 0 },
                  { label: "Clean Sheets", value: player.clean_sheets || 0 },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-4 rounded-lg bg-secondary/50"
                  >
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Win Rate</span>
                  <span className="text-sm text-primary font-bold">{winRate}%</span>
                </div>
                <Progress value={winRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
