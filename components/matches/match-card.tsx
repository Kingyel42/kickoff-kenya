"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, Banknote } from "lucide-react";

interface MatchCardProps {
  match: any;
  isJoined?: boolean;
  isOrganizer?: boolean;
  currentUserId?: string;
}

export function MatchCard({ match, isJoined, isOrganizer, currentUserId }: MatchCardProps) {
  const isFull = match.current_players >= match.max_players;
  const matchDate = new Date(match.match_date);
  const isToday = matchDate.toDateString() === new Date().toDateString();
  const isTomorrow = matchDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
  const dateLabel = isToday ? "Today" : isTomorrow ? "Tomorrow"
    : matchDate.toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" });
  const fillPct = Math.round((match.current_players / match.max_players) * 100);

  // Pricing breakdown — cost_per_player locked at creation
  const costPerPlayer = match.cost_per_player ?? (match.entry_fee ?? 0);
  const platformFee = match.platform_fee ?? Math.round(costPerPlayer * 0.1);
  const playerPays = match.player_pays ?? (costPerPlayer + platformFee);

  const statusBadge = () => {
    if (match.status === "completed")   return <Badge variant="secondary">Completed</Badge>;
    if (match.status === "cancelled")   return <Badge variant="destructive">Cancelled</Badge>;
    if (match.status === "in_progress") return <Badge className="bg-amber-100 text-amber-700 border-amber-200">In Progress</Badge>;
    if (isFull) return <Badge variant="secondary">Full</Badge>;
    return <Badge className="bg-accent text-primary border-[oklch(0.78_0.07_148)]">Open</Badge>;
  };

  return (
    <Card className="bg-card border-border hover:border-[oklch(0.78_0.07_148)] hover:shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-700 text-[15px] text-foreground truncate">{match.title}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Avatar className="w-4 h-4">
                <AvatarImage src={match.organizer?.avatar_url || undefined} />
                <AvatarFallback className="text-[8px] bg-accent text-primary">{match.organizer?.full_name?.[0] || "O"}</AvatarFallback>
              </Avatar>
              <span className="text-[11px] text-muted-foreground">by {match.organizer?.full_name || "Anonymous"}</span>
            </div>
          </div>
          {statusBadge()}
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-[12px]">{match.turf?.name || match.location}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[12px]">{dateLabel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[12px]">{match.start_time?.slice(0, 5)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[12px]">{match.current_players}/{match.max_players} players</span>
            </div>
            {playerPays > 0 && (
              <div className="flex items-center gap-1 text-primary font-600 text-[12px]">
                <Banknote className="w-3.5 h-3.5" />
                KES {playerPays}
              </div>
            )}
          </div>
        </div>

        {/* Player fill bar */}
        <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${fillPct}%` }} />
        </div>

        {/* Pricing breakdown — shown when there's a cost */}
        {costPerPlayer > 0 && (
          <div className="mt-3 bg-secondary rounded-[8px] px-3 py-2 text-[11px]">
            <div className="flex justify-between text-muted-foreground">
              <span>Cost per player</span><span>KES {costPerPlayer}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Platform fee (10%)</span><span>KES {platformFee}</span>
            </div>
            <div className="flex justify-between font-700 text-foreground border-t border-border mt-1.5 pt-1.5">
              <span>You pay</span><span className="text-primary">KES {playerPays}</span>
            </div>
          </div>
        )}

        {match.skill_level_required && (
          <Badge variant="outline" className="mt-2 capitalize text-[10px]">{match.skill_level_required} level</Badge>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link
          href={`/dashboard/matches/${match.id}`}
          className="w-full bg-primary text-primary-foreground text-center py-2 rounded-[8px] text-[13px] font-700 hover:opacity-88 transition-opacity block"
        >
          {isOrganizer ? "Manage Match" : isJoined ? "View Details" : "Join Match"}
        </Link>
      </CardFooter>
    </Card>
  );
}
