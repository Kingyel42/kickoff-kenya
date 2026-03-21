"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamCard } from "@/components/teams/team-card";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface TeamSearchProps {
  teams: any[];
  emptyLabel?: string;
}

export function TeamSearch({ teams, emptyLabel = "No teams found" }: TeamSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return teams;
    const q = query.toLowerCase();
    return teams.filter(
      (team) =>
        team.name?.toLowerCase().includes(q) ||
        team.description?.toLowerCase().includes(q) ||
        team.location?.toLowerCase().includes(q) ||
        team.captain?.full_name?.toLowerCase().includes(q)
    );
  }, [teams, query]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teams by name, location or captain…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-input"
          />
        </div>
        {query && (
          <Button variant="ghost" size="icon" onClick={() => setQuery("")}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {query && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} team{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((team: any) => (
            <TeamCard
              key={team.id}
              team={team}
              memberCount={team.members?.length || 0}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{emptyLabel}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
