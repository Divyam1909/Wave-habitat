import type React from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { LottieBackground } from "@/components/ui/lottie-background"; // <-- Import the new component

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The main container is now a simple div.
    // The background is handled by the self-contained LottieBackground component.
    <div>
      <LottieBackground />
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          {/* 
            The main content area is now fully transparent,
            allowing the Lottie animation from the layout to be visible behind it.
          */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}