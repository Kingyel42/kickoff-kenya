import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  MapPin, 
  Star,
  Shield,
  UserPlus,
  Swords,
  Calendar
} from "lucide-react";
import { JoinTeamButton } from "@/components/teams/join-team-button";
import { LeaveTeamButton } from "@/components/teams/leave-team-button";

export default async function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get team details
  const { data: team } = await supabase
    .from("teams")
    .select(`
      *,
      captain:profiles!teams_captain_id_fkey(id, full_name, avatar_url, username, skill_level),
      members:team_members(
        id,
        player_id,
        role,
        jersey_number,
        joined_at,
        player:profiles(id, full_name, avatar_url, username, preferred_position, skill_level)
      )
    `)
    .eq("id", id)
    .single();

  if (!team) {
    notFound();
  }

  const isCaptain = team.captain_id === user?.id;
  const membership = team.members?.find((m: any) => m.player_id === user?.id);
  const isMember = !!membership;
  const winRate = team.matches_played > 0 
    ? Math.round((team.matches_won / team.matches_played) * 100) 
    : 0;

  // Get recent team matches
  const { data: recentMatches } = await supabase
    .from("matches")
    .select("*")
    .or(`team_a_id.eq.${id},team_b_id.eq.${id}`)
    .order("match_date", { ascending: false })
    .limit(5);

  // Get pending challenges
  const { data: challenges } = await supabase
    .from("team_challenges")
    .select(`
      *,
      challenger_team:teams!team_challenges_challenger_team_id_fkey(id, name, logo_url),
      challenged_team:teams!team_challenges_challenged_team_id_fkey(id, name, logo_url)
    `)
    .or(`challenger_team_id.eq.${id},challenged_team_id.eq.${id}`)
    .eq("status", "pending")
    .limit(5);

  return (
    <div className="pt-14 space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/dashboard/teams">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Teams
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Header */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={team.logo_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {team.name?.[0] || "T"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{team.name}</h1>
                    <div className="flex items-center gap-2">
                      {team.is_recruiting && (
                        <Badge>Recruiting</Badge>
                      )}
                      {isMember && (
                        <Badge variant="secondary" className="capitalize">
                          {membership.role}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {team.description && (
                    <p className="text-muted-foreground mt-2">{team.description}</p>
                  )}

                  {team.location && (
                    <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{team.location}</span>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-6 p-4 rounded-lg bg-secondary/50">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{team.matches_played || 0}</p>
                      <p className="text-xs text-muted-foreground">Matches</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{team.matches_won || 0}</p>
                      <p className="text-xs text-muted-foreground">Wins</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{winRate}%</p>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-2xl font-bold text-foreground">{team.rating?.toFixed(1) || "0.0"}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {isCaptain && (
                  <>
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/teams/${id}/edit`}>
                        Edit Team
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/teams/${id}/challenge`}>
                        <Swords className="mr-2 w-4 h-4" />
                        Challenge a Team
                      </Link>
                    </Button>
                  </>
                )}
                {!isMember && team.is_recruiting && (
                  <JoinTeamButton teamId={team.id} />
                )}
                {isMember && !isCaptain && (
                  <LeaveTeamButton teamId={team.id} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Team Members ({team.members?.length || 0})</CardTitle>
              <CardDescription>Players in this team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {team.members?.map((member: any) => (
                  <Link
                    key={member.id}
                    href={`/dashboard/players/${member.player_id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.player?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.player?.full_name?.[0] || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">
                          {member.player?.full_name}
                        </p>
                        {member.role === "captain" && (
                          <Shield className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {member.player?.preferred_position || "Player"}
                      </p>
                    </div>
                    {member.jersey_number && (
                      <span className="text-lg font-bold text-muted-foreground">
                        #{member.jersey_number}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {(!team.members || team.members.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No members yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Matches */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {recentMatches && recentMatches.length > 0 ? (
                <div className="space-y-3">
                  {recentMatches.map((match: any) => {
                    const isTeamA = match.team_a_id === id;
                    const teamScore = isTeamA ? match.team_a_score : match.team_b_score;
                    const opponentScore = isTeamA ? match.team_b_score : match.team_a_score;
                    const won = teamScore > opponentScore;
                    const draw = teamScore === opponentScore;

                    return (
                      <Link
                        key={match.id}
                        href={`/dashboard/matches/${match.id}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{match.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(match.match_date).toLocaleDateString("en-KE", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        {match.status === "completed" && teamScore !== null && (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {teamScore} - {opponentScore}
                            </span>
                            <Badge variant={won ? "default" : draw ? "secondary" : "destructive"}>
                              {won ? "W" : draw ? "D" : "L"}
                            </Badge>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No matches played yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Captain Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Team Captain</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/dashboard/players/${team.captain?.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={team.captain?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {team.captain?.full_name?.[0] || "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{team.captain?.full_name}</p>
                  <p className="text-sm text-muted-foreground">@{team.captain?.username}</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Pending Challenges */}
          {challenges && challenges.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Pending Challenges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {challenges.map((challenge: any) => {
                  const isChallenger = challenge.challenger_team_id === id;
                  const otherTeam = isChallenger ? challenge.challenged_team : challenge.challenger_team;

                  return (
                    <div key={challenge.id} className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={otherTeam?.logo_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {otherTeam?.name?.[0] || "T"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {isChallenger ? `vs ${otherTeam?.name}` : `from ${otherTeam?.name}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(challenge.proposed_date).toLocaleDateString("en-KE", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Team Stats */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Team Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Goals Scored</span>
                <span className="font-bold text-foreground">{team.goals_scored || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Goals Conceded</span>
                <span className="font-bold text-foreground">{team.goals_conceded || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Goal Difference</span>
                <span className={`font-bold ${(team.goals_scored - team.goals_conceded) >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {(team.goals_scored || 0) - (team.goals_conceded || 0) >= 0 ? '+' : ''}
                  {(team.goals_scored || 0) - (team.goals_conceded || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
