import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { ProfileStats } from "@/components/dashboard/profile-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Shield } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Get user's achievements
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .eq("player_id", user?.id)
    .order("earned_at", { ascending: false })
    .limit(6);

  // Get user's teams
  const { data: teamMemberships } = await supabase
    .from("team_members")
    .select(`
      *,
      team:teams(id, name, logo_url)
    `)
    .eq("player_id", user?.id);

  const initials = profile?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="pt-14 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Your Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-foreground">{profile?.full_name || "Player"}</h2>
                <p className="text-muted-foreground">@{profile?.username || "username"}</p>
                
                <div className="flex items-center gap-2 mt-3">
                  <Badge className="capitalize">{profile?.preferred_position || "midfielder"}</Badge>
                  <Badge variant="outline" className="capitalize">{profile?.skill_level || "intermediate"}</Badge>
                  {profile?.is_verified && (
                    <Badge variant="secondary">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {profile?.location && (
                  <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}

                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {profile?.created_at
                    ? `Joined ${new Date(profile.created_at).toLocaleDateString("en-KE", {
                        month: "long",
                        year: "numeric",
                      })}`
                    : ""}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary/10">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="text-lg font-bold text-primary">
                    {profile?.average_rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({profile?.total_ratings || 0} ratings)
                  </span>
                </div>
              </div>

              {profile?.bio && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teams */}
          {teamMemberships && teamMemberships.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Teams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamMemberships.map((tm: any) => (
                  <div key={tm.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={tm.team?.logo_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {tm.team?.name?.[0] || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{tm.team?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{tm.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <ProfileStats profile={profile} />

          {/* Edit Profile Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your player information</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges and milestones you&apos;ve earned</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements && achievements.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {achievements.map((achievement: any) => (
                    <div
                      key={achievement.id}
                      className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <p className="font-medium text-foreground text-sm">{achievement.achievement_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No achievements yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Play more matches to unlock achievements!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
