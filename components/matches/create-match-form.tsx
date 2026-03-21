"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CreateMatchFormProps {
  turfs: { id: string; name: string; location: string; price_per_hour: number }[];
}

const skillLevels = [
  { value: "any",          label: "Any Level" },
  { value: "beginner",     label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced" },
  { value: "pro",          label: "Pro" },
];
const matchTypes = [
  { value: "pickup",     label: "Pickup Game" },
  { value: "challenge",  label: "Team Challenge" },
  { value: "tournament", label: "Tournament" },
];
const FORMATS: { value: string; label: string; players: number }[] = [
  { value: "5aside",  label: "5-a-side (10 players)",  players: 10 },
  { value: "6aside",  label: "6-a-side (12 players)",  players: 12 },
  { value: "7aside",  label: "7-a-side (14 players)",  players: 14 },
  { value: "8aside",  label: "8-a-side (16 players)",  players: 16 },
  { value: "11aside", label: "11-a-side (22 players)", players: 22 },
];
const PLATFORM_FEE_PCT = 0.10;

export function CreateMatchForm({ turfs }: CreateMatchFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading]           = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [totalTurfPrice, setTotalTurfPrice] = useState(0);
  const [maxPlayers, setMaxPlayers]         = useState(10);
  const [format, setFormat]                 = useState("5aside");

  // Derived pricing — locked at creation, based on max_players ALWAYS
  const costPerPlayer = maxPlayers > 0 ? Math.floor(totalTurfPrice / maxPlayers) : 0;
  const platformFee   = Math.round(costPerPlayer * PLATFORM_FEE_PCT);
  const playerPays    = costPerPlayer + platformFee;

  // When format changes, update max players
  function handleFormatChange(val: string) {
    setFormat(val);
    const f = FORMATS.find(f => f.value === val);
    if (f) setMaxPlayers(f.players);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true); setError(null);
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("You must be logged in to create a match"); setIsLoading(false); return; }

    const turfId     = formData.get("turfId") as string;
    const skillLevel = formData.get("skillLevel") as string;

    const matchData = {
      title:               formData.get("title") as string,
      description:         formData.get("description") as string || null,
      organizer_id:        user.id,
      turf_id:             turfId && turfId !== "custom" ? turfId : null,
      match_date:          formData.get("matchDate") as string,
      start_time:          formData.get("startTime") as string,
      end_time:            formData.get("endTime") as string,
      location:            turfId === "custom"
                            ? formData.get("customLocation") as string
                            : turfs.find(t => t.id === turfId)?.location || "",
      max_players:         maxPlayers,
      current_players:     1,
      entry_fee:           totalTurfPrice,
      cost_per_player:     costPerPlayer,
      platform_fee:        platformFee,
      player_pays:         playerPays,
      min_players:         Math.ceil(maxPlayers * 0.6),
      match_type:          formData.get("matchType") as string,
      format:              format,
      skill_level_required: skillLevel === "any" ? null : skillLevel,
      status:              "open",
    };

    const { data: match, error: matchError } = await supabase.from("matches").insert(matchData).select().single();
    if (matchError) { setError(matchError.message); setIsLoading(false); return; }

    // Add creator as first player
    await supabase.from("match_players").insert({ match_id: match.id, player_id: user.id, checked_in: false });
    router.push(`/dashboard/matches/${match.id}`);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="title" className="font-600">Match Title</Label>
        <Input id="title" name="title" placeholder="e.g., Saturday Morning Kickabout" required className="bg-secondary border-border" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description" className="font-600">Description (Optional)</Label>
        <Textarea id="description" name="description" placeholder="Any details about the match..." className="bg-secondary border-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="font-600">Format</Label>
          <Select name="format" value={format} onValueChange={handleFormatChange}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>{FORMATS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="font-600">Match Type</Label>
          <Select name="matchType" defaultValue="pickup">
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>{matchTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="font-600">Skill Level</Label>
          <Select name="skillLevel" defaultValue="any">
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>{skillLevels.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="turfId" className="font-600">Location / Turf</Label>
          <Select name="turfId" onValueChange={v => setUseCustomLocation(v === "custom")}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select turf or location" /></SelectTrigger>
            <SelectContent>
              {turfs.map(t => <SelectItem key={t.id} value={t.id}>{t.name} — {t.location}</SelectItem>)}
              <SelectItem value="custom">Enter Custom Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {useCustomLocation && (
        <div className="space-y-1.5">
          <Label htmlFor="customLocation" className="font-600">Custom Location</Label>
          <Input id="customLocation" name="customLocation" placeholder="e.g., City Park Football Grounds, Nairobi" required className="bg-secondary border-border" />
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="matchDate" className="font-600">Date</Label>
          <Input id="matchDate" name="matchDate" type="date" min={minDate} required className="bg-secondary border-border" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="startTime" className="font-600">Start Time</Label>
          <Input id="startTime" name="startTime" type="time" required className="bg-secondary border-border" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endTime" className="font-600">End Time</Label>
          <Input id="endTime" name="endTime" type="time" required className="bg-secondary border-border" />
        </div>
      </div>

      {/* Total turf price input */}
      <div className="space-y-1.5">
        <Label htmlFor="turfCost" className="font-600">Total Turf Cost (KES)</Label>
        <Input
          id="turfCost" name="turfCost" type="number" min="0" step="100"
          value={totalTurfPrice}
          onChange={e => setTotalTurfPrice(parseInt(e.target.value) || 0)}
          placeholder="0 for free match"
          className="bg-secondary border-border"
        />
      </div>

      {/* Pricing breakdown — auto-calculated, clearly displayed */}
      <div className="bg-accent border border-[oklch(0.78_0.07_148)] rounded-[10px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-sm font-700 text-primary">Pricing Breakdown</span>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Total turf cost</span><span>KES {totalTurfPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Max players ({format})</span><span>{maxPlayers}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Cost per player</span><span>KES {costPerPlayer.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Platform fee (10%)</span><span>KES {platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-700 text-foreground border-t border-[oklch(0.78_0.07_148)] pt-2 mt-2">
            <span>Each player pays</span>
            <span className="text-primary">KES {playerPays.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Price is locked at creation and <strong className="text-foreground">never changes</strong> regardless of how many players join.
        </p>
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground font-700" disabled={isLoading}>
        {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Match...</>) : "Create Match"}
      </Button>
    </form>
  );
}
