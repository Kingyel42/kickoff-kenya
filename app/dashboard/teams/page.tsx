import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { TeamCard } from "@/components/teams/team-card";
import { TeamSearch } from "@/components/teams/team-search";

export default async function TeamsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's teams
  const { data: myTeamMemberships } = await supabase
    .from("team_members")
    .select(`
      *,
      team:teams(
        *,
        captain:profiles!teams_captain_id_fkey(id, full_name, avatar_url, username)
      )
    `)
    .eq("player_id", user?.id);

  const myTeams = myTeamMemberships?.map((m) => ({
    ...m.team,
    memberRole: m.role,
  })) || [];

  // Get all recruiting teams
  const { data: recruitingTeams } = await supabase
    .from("teams")
    .select(`
      *,
      captain:profiles!teams_captain_id_fkey(id, full_name, avatar_url, username),
      members:team_members(player_id)
    `)
    .eq("is_recruiting", true)
    .order("rating", { ascending: false })
    .limit(12);

  // Filter out teams user is already in
  const myTeamIds = new Set(myTeams.map((t) => t.id));
  const availableTeams = recruitingTeams?.filter((t) => !myTeamIds.has(t.id)) || [];

  return (
    <div className="pt-14 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Teams</h1>
          <p className="text-muted-foreground">Create or join a team to compete together</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teams/create">
            <Plus className="mr-2 w-4 h-4" />
            Create Team
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-teams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-teams">My Teams</TabsTrigger>
          <TabsTrigger value="browse">Browse Teams</TabsTrigger>
        </TabsList>

        {/* My Teams Tab */}
        <TabsContent value="my-teams" className="space-y-6">
          {myTeams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTeams.map((team: any) => (
                <TeamCard 
                  key={team.id} 
                  team={team}
                  isMember={true}
                  role={team.memberRole}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Teams Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your own team or join an existing one to start playing together.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/dashboard/teams/create">Create a Team</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="#browse">Browse Teams</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Browse Teams Tab */}
        <TabsContent value="browse" className="space-y-6" id="browse">
          <TeamSearch
            teams={availableTeams}
            emptyLabel="No teams currently recruiting"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
