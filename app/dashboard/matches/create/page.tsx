import { createClient } from "@/lib/supabase/server";
import { CreateMatchForm } from "@/components/matches/create-match-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateMatchPage() {
  const supabase = await createClient();

  // Get available turfs
  const { data: turfs } = await supabase
    .from("turfs")
    .select("id, name, location, price_per_hour")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="pt-14 space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/dashboard/matches">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Matches
        </Link>
      </Button>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Create a Match</CardTitle>
          <CardDescription>
            Set up a new pickup game and invite players to join
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateMatchForm turfs={turfs || []} />
        </CardContent>
      </Card>
    </div>
  );
}
