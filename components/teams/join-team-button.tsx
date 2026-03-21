"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface JoinTeamButtonProps {
  teamId: string;
}

export function JoinTeamButton({ teamId }: JoinTeamButtonProps) {
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

    const { error } = await supabase
      .from("team_members")
      .insert({
        team_id: teamId,
        player_id: user.id,
        role: "member",
      });

    if (error) {
      setError(
        error.code === "23505"
          ? "You are already a member of this team."
          : "Failed to join team. Please try again."
      );
      setIsLoading(false);
      return;
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
      <Button onClick={handleJoin} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 w-4 h-4" />
            Join Team
          </>
        )}
      </Button>
    </div>
  );
}
