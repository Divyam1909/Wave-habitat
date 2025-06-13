"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Waves, LayoutDashboard, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "My Modules", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="sticky top-0 flex h-screen w-16 flex-col items-center border-r border-wave-lightBlue/20 bg-wave-deepBlue py-8 transition-all duration-300 ease-in-out hover:w-64 group">
      <Link href="/dashboard" className="mb-10 flex items-center gap-2 px-4 self-start group-hover:self-center">
        <Waves className="h-10 w-10 text-wave-lightBlue flex-shrink-0" />
        <span className="text-2xl font-bold text-wave-sand opacity-0 transition-opacity duration-200 group-hover:opacity-100 delay-100">
          WaveHabitat
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-3 w-full px-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 text-wave-sand/70 transition-all hover:bg-wave-lightBlue/10 hover:text-wave-lightBlue",
              pathname.startsWith(item.href) && item.href !== "/dashboard"
                ? "bg-wave-lightBlue/20 text-wave-lightBlue shadow-glow-sm [--glow-color:hsl(var(--wave-light-blue))]"
                : pathname === "/dashboard" && item.href === "/dashboard"
                  ? "bg-wave-lightBlue/20 text-wave-lightBlue shadow-glow-sm [--glow-color:hsl(var(--wave-light-blue))]"
                  : "",
              "group-hover:justify-start justify-center",
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 delay-100 truncate">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 w-full px-2">
        <Button
          variant="ghost"
          onClick={logout}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-wave-sand/70 transition-all hover:bg-wave-coral/20 hover:text-wave-coral group-hover:justify-start justify-center"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 delay-100">Logout</span>
        </Button>
      </div>
    </aside>
  )
}
