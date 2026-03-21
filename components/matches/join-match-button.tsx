"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface JoinMatchButtonProps {
  matchId: string;
}

export function JoinMatchButton({ matchId }: JoinMatchButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Add player to match
    const { error: joinError } = await supabase
      .from("match_players")
      .insert({
        match_id: matchId,
        player_id: user.id,
      });

    if (joinError) {
      setError(
        joinError.code === "23505"
          ? "You have already joined this match."
          : "Failed to join match. Please try again."
      );
      setIsLoading(false);
      return;
    }

    // Update match player count
    const { error: updateError } = await supabase.rpc("increment_match_players", {
      match_id: matchId,
    });

    if (updateError) {
      // Fallback: fetch current count and increment manually
      const { data: matchData } = await supabase
        .from("matches")
        .select("current_players")
        .eq("id", matchId)
        .single();

      if (matchData) {
        await supabase
          .from("matches")
          .update({ current_players: matchData.current_players + 1 })
          .eq("id", matchId);
      }
    }

    router.refresh();
    setIsLoading(false);
  }

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleJoin} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Join This Match"
        )}
      </Button>
    </div>
  );
}
