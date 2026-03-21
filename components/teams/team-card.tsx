"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Trophy, MapPin, Star, Shield } from "lucide-react";

interface TeamCardProps {
  team: any;
  isMember?: boolean;
  role?: string;
  memberCount?: number;
}

export function TeamCard({ team, isMember, role, memberCount }: TeamCardProps) {
  const winRate = team.matches_played > 0 
    ? Math.round((team.matches_won / team.matches_played) * 100) 
    : 0;

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={team.logo_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
              {team.name?.[0] || "T"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{team.name}</h3>
              {isMember && role === "captain" && (
                <Badge variant="secondary" className="text-[10px]">
                  <Shield className="w-3 h-3 mr-1" />
                  Captain
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>by {team.captain?.full_name || "Unknown"}</span>
            </div>
          </div>
        </div>

        {team.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {team.description}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-secondary/50">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{team.matches_played || 0}</p>
            <p className="text-[10px] text-muted-foreground">Matches</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{winRate}%</p>
            <p className="text-[10px] text-muted-foreground">Win Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span className="text-lg font-bold text-foreground">{team.rating?.toFixed(1) || "0.0"}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Rating</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {team.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{team.location}</span>
            </div>
          )}
          {team.is_recruiting && !isMember && (
            <Badge>Recruiting</Badge>
          )}
          {memberCount !== undefined && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{memberCount} members</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          variant={isMember ? "outline" : "default"}
          asChild
        >
          <Link href={`/dashboard/teams/${team.id}`}>
            {isMember ? "Manage Team" : "View Team"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
