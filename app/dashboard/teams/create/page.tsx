import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreateTeamForm } from "@/components/teams/create-team-form";

export default function CreateTeamPage() {
  return (
    <div className="pt-14 space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/dashboard/teams">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Teams
        </Link>
      </Button>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Create a Team</CardTitle>
          <CardDescription>
            Start your own team and invite players to join
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTeamForm />
        </CardContent>
      </Card>
    </div>
  );
}
