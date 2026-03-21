import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MatchSearch } from "@/components/matches/match-search";
import { MatchCard } from "@/components/matches/match-card";

export default async function MatchesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  // Get all open matches
  const { data: openMatches } = await supabase
    .from("matches")
    .select(`
      *,
      organizer:profiles!matches_organizer_id_fkey(id, full_name, avatar_url, username),
      turf:turfs(id, name, location),
      players:match_players(player_id)
    `)
    .gte("match_date", today)
    .eq("status", "open")
    .order("match_date", { ascending: true });

  // Get user's matches
  const { data: myMatchIds } = await supabase
    .from("match_players")
    .select("match_id")
    .eq("player_id", user?.id);

  const myMatchIdSet = new Set(myMatchIds?.map((m) => m.match_id) || []);

  // Get matches organized by user
  const { data: myOrganizedMatches } = await supabase
    .from("matches")
    .select(`
      *,
      organizer:profiles!matches_organizer_id_fkey(id, full_name, avatar_url, username),
      turf:turfs(id, name, location),
      players:match_players(player_id)
    `)
    .eq("organizer_id", user?.id)
    .order("match_date", { ascending: false });

  // Get my joined matches (guard against empty set — .in([]) causes a Supabase error)
  const myMatchIdArray = Array.from(myMatchIdSet);
  const joinedMatchesQuery = myMatchIdArray.length > 0
    ? await supabase
        .from("matches")
        .select(`
          *,
          organizer:profiles!matches_organizer_id_fkey(id, full_name, avatar_url, username),
          turf:turfs(id, name, location),
          players:match_players(player_id)
        `)
        .in("id", myMatchIdArray)
        .neq("organizer_id", user?.id)
        .order("match_date", { ascending: false })
    : { data: [] };
  const joinedMatches = joinedMatchesQuery.data;

  return (
    <div className="pt-14 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Matches</h1>
          <p className="text-muted-foreground">Find games near you or create your own</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/matches/create">
            <Plus className="mr-2 w-4 h-4" />
            Create Match
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Matches</TabsTrigger>
          <TabsTrigger value="joined">My Matches</TabsTrigger>
          <TabsTrigger value="organized">Organized by Me</TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          <MatchSearch
            matches={openMatches || []}
            myMatchIdSet={myMatchIdSet}
            currentUserId={user?.id}
            emptyLabel="No open matches found"
          />
        </TabsContent>

        {/* My Matches Tab */}
        <TabsContent value="joined" className="space-y-6">
          {joinedMatches && joinedMatches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedMatches.map((match: any) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  isJoined={true}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">You haven&apos;t joined any matches yet</p>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/matches">Browse Matches</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Organized Tab */}
        <TabsContent value="organized" className="space-y-6">
          {myOrganizedMatches && myOrganizedMatches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myOrganizedMatches.map((match: any) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  isJoined={true}
                  isOrganizer={true}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">You haven&apos;t organized any matches yet</p>
                <Button asChild>
                  <Link href="/dashboard/matches/create">Create Your First Match</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
