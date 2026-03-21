"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Profile } from "@/lib/types";
import { getReliabilityTier } from "@/lib/types";

interface ProfileStatsProps {
  profile: Profile | null;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const matchesPlayed = profile?.matches_played || 0;
  const matchesWon    = profile?.matches_won || 0;
  const winRate       = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;
  const score         = (profile as any)?.reliability_score ?? 80;
  const tier          = getReliabilityTier(score);

  const stats = [
    { label: "Matches Played", value: matchesPlayed },
    { label: "Matches Won",    value: matchesWon },
    { label: "Win Rate",       value: `${winRate}%` },
    { label: "Goals Scored",   value: profile?.goals_scored || 0 },
    { label: "Assists",        value: profile?.assists || 0 },
    { label: "Clean Sheets",   value: profile?.clean_sheets || 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Reliability score card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-700">Reliability Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-3xl font-900 tracking-tight" style={{ color: tier.badge_colour }}>{score}</span>
              <span className="text-muted-foreground text-sm ml-1">/100</span>
            </div>
            <span className="text-sm font-700 px-3 py-1 rounded-full"
              style={{ background: `${tier.badge_colour}18`, color: tier.badge_colour }}>
              {tier.tier}
            </span>
          </div>
          <Progress value={score} className="h-2 mb-3" />
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Elite",       range: "90–100", color: "#186637" },
              { label: "Good",        range: "70–89",  color: "#2a8c4a" },
              { label: "Caution",     range: "50–69",  color: "#b07d1a" },
              { label: "Restricted",  range: "<50",    color: "#c0392b" },
            ].map(t => (
              <div key={t.label} className="rounded-[7px] p-1.5 text-center"
                style={{ background: `${t.color}10`, border: `1px solid ${t.color}25` }}>
                <p className="text-[10px] font-700" style={{ color: t.color }}>{t.label}</p>
                <p className="text-[9px] text-muted-foreground">{t.range}</p>
              </div>
            ))}
          </div>
          {!tier.can_join_paid && (
            <p className="text-xs text-destructive mt-2 font-500">
              ⚠ Your score is below 50. You cannot join paid matches until it recovers.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Career stats */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-700">Career Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stats.map(stat => (
              <div key={stat.label} className="text-center p-3 rounded-[9px] bg-secondary">
                <p className="text-2xl font-900 text-primary tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-[9px] bg-secondary">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-600 text-foreground">Win Rate</span>
              <span className="text-sm text-primary font-700">{winRate}%</span>
            </div>
            <Progress value={winRate} className="h-1.5" />
          </div>

          {matchesPlayed > 0 && (
            <div className="mt-3 p-3 rounded-[9px] bg-secondary space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Goals per match</span>
                <span className="text-xs font-600 text-foreground">{((profile?.goals_scored || 0) / matchesPlayed).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Assists per match</span>
                <span className="text-xs font-600 text-foreground">{((profile?.assists || 0) / matchesPlayed).toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
