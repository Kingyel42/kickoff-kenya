import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Construction } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="pt-14 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Construction className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Account settings are currently under development
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <p className="text-muted-foreground max-w-md mx-auto">
            Soon you&apos;ll be able to manage your notification preferences, 
            privacy settings, connected accounts, and security options here.
            In the meantime, use the <strong className="text-foreground">Profile</strong> page to update your player information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
