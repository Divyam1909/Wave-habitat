import type React from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { AnimatedBackground } from "@/components/ui/animated-background"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AnimatedBackground className="bg-background text-foreground">
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background/70 backdrop-blur-sm">
            {/* Removed bg-wave-midBlue/30 to let AnimatedBackground show through */}
            {children}
          </main>
        </div>
      </div>
    </AnimatedBackground>
  )
}
