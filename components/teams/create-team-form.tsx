"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const locations = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Malindi",
  "Kitale",
  "Garissa",
  "Other",
];

export function CreateTeamForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecruiting, setIsRecruiting] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in to create a team");
      setIsLoading(false);
      return;
    }

    const teamData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || null,
      captain_id: user.id,
      location: formData.get("location") as string || null,
      is_recruiting: isRecruiting,
    };

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert(teamData)
      .select()
      .single();

    if (teamError) {
      setError(teamError.message);
      setIsLoading(false);
      return;
    }

    // Add creator as captain
    const { error: memberError } = await supabase
      .from("team_members")
      .insert({
        team_id: team.id,
        player_id: user.id,
        role: "captain",
      });

    if (memberError) {
      console.error("Failed to add captain:", memberError);
    }

    router.push(`/dashboard/teams/${team.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Team Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Nairobi United FC"
          required
          className="bg-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Tell others about your team..."
          className="bg-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select name="location">
          <SelectTrigger className="bg-input">
            <SelectValue placeholder="Select your city" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
        <div>
          <Label htmlFor="recruiting" className="font-medium">Open for Recruitment</Label>
          <p className="text-sm text-muted-foreground">
            Allow other players to request to join your team
          </p>
        </div>
        <Switch
          id="recruiting"
          checked={isRecruiting}
          onCheckedChange={setIsRecruiting}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Team...
          </>
        ) : (
          "Create Team"
        )}
      </Button>
    </form>
  );
}
