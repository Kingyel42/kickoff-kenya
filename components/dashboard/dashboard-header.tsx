"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, User as UserIcon } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import type { Profile } from "@/lib/types";
import { getReliabilityTier } from "@/lib/types";

interface DashboardHeaderProps {
  user: User;
  profile: Profile | null;
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const initials = profile?.full_name
    ?.split(" ").map(n => n[0]).join("").toUpperCase()
    || user.email?.[0].toUpperCase() || "U";

  const score = (profile as any)?.reliability_score ?? 80;
  const tier = getReliabilityTier(score);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between h-full px-5">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a10 10 0 0 1 0 20M12 2C9.5 6 8 9 8 12s1.5 6 4 10M12 2c2.5 4 4 7 4 10s-1.5 6-4 10M2 12h20"/>
            </svg>
          </div>
          <span className="font-800 text-[16px] text-foreground hidden md:block">
            KickOff <span className="text-primary">Kenya</span>
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 h-8">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-accent text-primary text-xs font-700">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-500">{profile?.full_name || user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-card border-border shadow-md">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="font-700">{profile?.full_name || "Player"}</span>
                  <span className="text-xs text-muted-foreground font-400">@{(profile as any)?.username || "username"}</span>
                  {/* Reliability score chip */}
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-700 w-fit px-2 py-0.5 rounded-full"
                    style={{ background: `${tier.badge_colour}18`, color: tier.badge_colour }}>
                    ● {tier.tier} · {score}/100
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 w-4 h-4" /> View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 w-4 h-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={signOut}>
                  <button type="submit" className="flex items-center w-full text-destructive">
                    <LogOut className="mr-2 w-4 h-4" /> Sign Out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
