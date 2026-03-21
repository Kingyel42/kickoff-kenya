import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Banknote,
  Trophy,
  Share2,
  Shield
} from "lucide-react";
import { JoinMatchButton } from "@/components/matches/join-match-button";
import { LeaveMatchButton } from "@/components/matches/leave-match-button";

export default async function MatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get match details
  const { data: match } = await supabase
    .from("matches")
    .select(`
      *,
      organizer:profiles!matches_organizer_id_fkey(id, full_name, avatar_url, username, skill_level),
      turf:turfs(id, name, location, address, price_per_hour),
      players:match_players(
        id,
        player_id,
        team_side,
        position_played,
        goals,
        assists,
        player:profiles(id, full_name, avatar_url, username, preferred_position, skill_level)
      )
    `)
    .eq("id", id)
    .single();

  if (!match) {
    notFound();
  }

  const isOrganizer = match.organizer_id === user?.id;
  const hasJoined = match.players?.some((p: any) => p.player_id === user?.id);
  const isFull = match.current_players >= match.max_players;
  const matchDate = new Date(match.match_date);
  const isPast = matchDate < new Date();

  const teamAPlayers = match.players?.filter((p: any) => p.team_side === "A") || [];
  const teamBPlayers = match.players?.filter((p: any) => p.team_side === "B") || [];
  const unassignedPlayers = match.players?.filter((p: any) => !p.team_side) || [];

  return (
    <div className="pt-14 space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/dashboard/matches">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Matches
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Match Header */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={match.status === "open" ? "default" : "secondary"} className="capitalize">
                      {match.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {match.match_type}
                    </Badge>
                    {match.skill_level_required && (
                      <Badge variant="outline" className="capitalize">
                        {match.skill_level_required} level
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{match.title}</h1>
                  {match.description && (
                    <p className="text-muted-foreground mt-2">{match.description}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  {isOrganizer && (
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/matches/${id}/edit`}>
                        Edit Match
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Match Details */}
              <div className="grid sm:grid-cols-2 gap-4 mt-6 p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">
                      {matchDate.toLocaleDateString("en-KE", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">
                      {match.start_time?.slice(0, 5)} - {match.end_time?.slice(0, 5)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">
                      {match.turf?.name || match.location}
                    </p>
                    {match.turf?.address && (
                      <p className="text-xs text-muted-foreground">{match.turf.address}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Players</p>
                    <p className="font-medium text-foreground">
                      {match.current_players} / {match.max_players}
                    </p>
                  </div>
                </div>
              </div>

              {/* Entry Fee */}
              {match.entry_fee > 0 && (
                <div className="flex items-center gap-3 mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <Banknote className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">KES {match.entry_fee}</p>
                    <p className="text-sm text-muted-foreground">Entry fee per player</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isPast && match.status === "open" && (
                <div className="mt-6">
                  {!hasJoined && !isFull && (
                    <JoinMatchButton matchId={match.id} />
                  )}
                  {hasJoined && !isOrganizer && (
                    <LeaveMatchButton matchId={match.id} />
                  )}
                  {isFull && !hasJoined && (
                    <Button disabled className="w-full">Match is Full</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Players List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Players ({match.current_players}/{match.max_players})</CardTitle>
              <CardDescription>Players registered for this match</CardDescription>
            </CardHeader>
            <CardContent>
              {match.status === "completed" && (teamAPlayers.length > 0 || teamBPlayers.length > 0) ? (
                // Show teams for completed matches
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      Team A {match.team_a_score !== null && `(${match.team_a_score})`}
                    </h4>
                    <div className="space-y-2">
                      {teamAPlayers.map((mp: any) => (
                        <PlayerRow key={mp.id} matchPlayer={mp} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      Team B {match.team_b_score !== null && `(${match.team_b_score})`}
                    </h4>
                    <div className="space-y-2">
                      {teamBPlayers.map((mp: any) => (
                        <PlayerRow key={mp.id} matchPlayer={mp} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Show all players for open matches
                <div className="grid sm:grid-cols-2 gap-3">
                  {match.players?.map((mp: any) => (
                    <PlayerRow key={mp.id} matchPlayer={mp} isOrganizer={mp.player_id === match.organizer_id} />
                  ))}
                </div>
              )}

              {match.current_players === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No players have joined yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organizer */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                href={`/dashboard/players/${match.organizer?.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={match.organizer?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {match.organizer?.full_name?.[0] || "O"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{match.organizer?.full_name}</p>
                  <p className="text-sm text-muted-foreground">@{match.organizer?.username}</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Turf Info */}
          {match.turf && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Venue</CardTitle>
              </CardHeader>
              <CardContent>
                <Link 
                  href={`/dashboard/turfs/${match.turf.id}`}
                  className="block p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <p className="font-medium text-foreground">{match.turf.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{match.turf.location}</p>
                  {match.turf.address && (
                    <p className="text-xs text-muted-foreground mt-1">{match.turf.address}</p>
                  )}
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Match Score (for completed) */}
          {match.status === "completed" && match.team_a_score !== null && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Final Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-primary/5">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{match.team_a_score}</p>
                    <p className="text-sm text-muted-foreground">Team A</p>
                  </div>
                  <span className="text-2xl text-muted-foreground">-</span>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{match.team_b_score}</p>
                    <p className="text-sm text-muted-foreground">Team B</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerRow({ matchPlayer, isOrganizer }: { matchPlayer: any; isOrganizer?: boolean }) {
  const player = matchPlayer.player;
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
      <Avatar className="w-8 h-8">
        <AvatarImage src={player?.avatar_url || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {player?.full_name?.[0] || "P"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground text-sm truncate">{player?.full_name}</p>
          {isOrganizer && (
            <Badge variant="secondary" className="text-[10px]">Organizer</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground capitalize">
          {player?.preferred_position || "Player"}
        </p>
      </div>
      {matchPlayer.goals > 0 && (
        <span className="text-xs text-primary font-medium">{matchPlayer.goals}G</span>
      )}
      {matchPlayer.assists > 0 && (
        <span className="text-xs text-muted-foreground font-medium">{matchPlayer.assists}A</span>
      )}
    </div>
  );
}
