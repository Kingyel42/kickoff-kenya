"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Users, MapPin, Trophy, User, Wallet, Plus } from "lucide-react";

const navItems = [
  { title: "Dashboard",  href: "/dashboard",             icon: LayoutDashboard },
  { title: "Matches",    href: "/dashboard/matches",      icon: Calendar },
  { title: "My Teams",   href: "/dashboard/teams",        icon: Users },
  { title: "Find Turfs", href: "/dashboard/turfs",        icon: MapPin },
  { title: "Leaderboard",href: "/dashboard/leaderboards", icon: Trophy },
  { title: "Profile",    href: "/dashboard/profile",      icon: User },
  { title: "Wallet",     href: "/dashboard/wallet",       icon: Wallet },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-56 border-r border-border bg-card hidden md:flex flex-col overflow-y-auto">
      <div className="p-3 flex-1">
        {/* Create match CTA */}
        <Link
          href="/dashboard/matches/create"
          className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-[9px] text-[13px] font-700 mb-4 hover:opacity-88 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Match
        </Link>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-500 transition-all",
                  isActive
                    ? "bg-accent text-primary border border-[oklch(0.78_0.07_148)] font-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom branding */}
      <div className="p-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center font-500">KickOff Kenya © 2025</p>
      </div>
    </aside>
  );
}
