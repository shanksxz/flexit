"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Calendar, Trophy, Users, BarChart2, Settings } from 'lucide-react'

const sidebarItems = [
  {
    title: "Home",
    href: "/",
    icon: Home
  },
  {
    title: "Daily Challenge",
    href: "/daily-challenge",
    icon: Calendar
  },
  {
    title: "All Challenges",
    href: "/challenges",
    icon: Trophy
  },
  {
    title: "Community",
    href: "/community",
    icon: Users
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: BarChart2
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Trophy className="h-6 w-6 text-primary" />
          <span>Fit Challenge</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
