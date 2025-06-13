"use client"

import { Button } from "@/components/ui/button"
import { Bell, UserCircle, SettingsIcon, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-wave-lightBlue/20 bg-wave-deepBlue/80 backdrop-blur-md px-6">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-wave-lightBlue">Welcome, {user?.name || "User"}!</h1>
        <p className="text-sm text-wave-sand/70">Manage your aquatic environments.</p>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-wave-sand hover:bg-wave-lightBlue/10 hover:text-wave-lightBlue"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-wave-midBlue border-wave-lightBlue/50 text-wave-sand">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-wave-lightBlue/30" />
            <DropdownMenuItem className="hover:bg-wave-lightBlue/20 focus:bg-wave-lightBlue/20">
              No new notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-wave-sand hover:bg-wave-lightBlue/10 hover:text-wave-lightBlue"
            >
              <UserCircle className="h-6 w-6" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-wave-midBlue border-wave-lightBlue/50 text-wave-sand">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-wave-sand/70">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-wave-lightBlue/30" />
            <DropdownMenuItem asChild className="hover:bg-wave-lightBlue/20 focus:bg-wave-lightBlue/20 cursor-pointer">
              <Link href="/dashboard/profile" className="flex items-center">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-wave-lightBlue/30" />
            <DropdownMenuItem
              onClick={logout}
              className="text-wave-coral hover:!bg-wave-coral/20 hover:!text-wave-coral focus:!bg-wave-coral/20 focus:!text-wave-coral cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
