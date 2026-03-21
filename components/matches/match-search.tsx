"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MatchCard } from "@/components/matches/match-card";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import Link from "next/link";

interface MatchSearchProps {
  matches: any[];
  myMatchIdSet: Set<string>;
  currentUserId?: string;
  emptyLabel?: string;
  isOrganizer?: boolean;
}

export function MatchSearch({
  matches,
  myMatchIdSet,
  currentUserId,
  emptyLabel = "No matches found",
  isOrganizer = false,
}: MatchSearchProps) {
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return matches.filter((match) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        match.title?.toLowerCase().includes(q) ||
        match.location?.toLowerCase().includes(q) ||
        match.turf?.name?.toLowerCase().includes(q) ||
        match.turf?.location?.toLowerCase().includes(q);

      const matchesSkill =
        skillFilter === "all" ||
        !match.skill_level_required ||
        match.skill_level_required === skillFilter;

      const matchesType =
        typeFilter === "all" || match.match_type === typeFilter;

      return matchesQuery && matchesSkill && matchesType;
    });
  }, [matches, query, skillFilter, typeFilter]);

  const hasActiveFilters = skillFilter !== "all" || typeFilter !== "all";

  function clearFilters() {
    setQuery("");
    setSkillFilter("all");
    setTypeFilter("all");
  }

  return (
    <div className="space-y-4">
      {/* Search bar row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, location or turf…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-input"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters((v) => !v)}
          className={hasActiveFilters ? "border-primary text-primary" : ""}
        >
          <Filter className="mr-2 w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 w-2 h-2 rounded-full bg-primary inline-block" />
          )}
        </Button>
        {(query || hasActiveFilters) && (
          <Button variant="ghost" onClick={clearFilters} size="icon">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filter dropdowns */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Skill Level</p>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Level</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Match Type</p>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pickup">Pickup Game</SelectItem>
                <SelectItem value="challenge">Team Challenge</SelectItem>
                <SelectItem value="tournament">Tournament</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Result count */}
      {(query || hasActiveFilters) && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} match{filtered.length !== 1 ? "es" : ""} found
        </p>
      )}

      {/* Match grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isJoined={myMatchIdSet.has(match.id)}
              isOrganizer={isOrganizer}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">{emptyLabel}</p>
            {!query && !hasActiveFilters && (
              <Button asChild>
                <Link href="/dashboard/matches/create">Create the First Match</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
