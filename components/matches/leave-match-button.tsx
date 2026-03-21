"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LeaveMatchButtonProps {
  matchId: string;
}

export function LeaveMatchButton({ matchId }: LeaveMatchButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLeave() {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Remove player from match
    const { error: leaveError } = await supabase
      .from("match_players")
      .delete()
      .eq("match_id", matchId)
      .eq("player_id", user.id);

    if (leaveError) {
      setError("Failed to leave match. Please try again.");
      setIsLoading(false);
      return;
    }

    // Update match player count
    await supabase.rpc("decrement_match_players", { match_id: matchId });

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
      <Button onClick={handleLeave} disabled={isLoading} variant="outline" className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Leaving...
          </>
        ) : (
          "Leave Match"
        )}
      </Button>
    </div>
  );
}
