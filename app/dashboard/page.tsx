// Full Code for: app/dashboard/page.tsx (Final, Corrected Version)

"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Settings, Eye, Zap, Wrench, ShieldQuestion, Waves, Loader2, Cpu, Link2, BarChart2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { AddModuleDialog } from "@/components/dashboard/add-module-dialog";
import { useState } from "react";

// This interface must match the one in AuthContext
interface Module {
  module_id: string;
  name: string;
  description: string | null;
  alloted_pins: number;
  used_pins: number;
  pins_left: number;
  module_status: number;
  role: 'owner' | 'operator' | 'programmer' | 'viewer';
}

const roleIcons: { [key: string]: React.ElementType } = {
  owner: Settings, operator: Zap, programmer: Wrench, viewer: Eye, unknown: ShieldQuestion,
};

function FullScreenLoader({ message }: { message?: string }) {
  // --- THIS IS THE CRITICAL FIX ---
  // We must explicitly return the JSX element.
  return (
    <div className="flex flex-col h-[80vh] w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      {message && <p className="mt-4 text-gray-400">{message}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user, modules, isLoading } = useAuth();
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);

  if (isLoading || !user) {
    return <FullScreenLoader message="Loading Dashboard..." />;
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">My Modules</h1>
          <p className="text-gray-400">Welcome, {user.name}. Access and manage your modules.</p>
        </div>
        <Button onClick={() => setIsAddModuleOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
        <Card className="w-full max-w-lg mx-auto mt-10 bg-slate-800/70 border-slate-700">
          <CardContent className="pt-8 text-center">
            <Waves className="mx-auto h-16 w-16 text-cyan-400/50 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Modules Yet</h3>
            <p className="text-gray-400 mb-4">Click "Add Module" to connect your first Wave Habitat device.</p>
            <Button onClick={() => setIsAddModuleOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
              Add Your First Module
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module: Module) => {
            const status = module.module_status === 1 ? 'active' : 'inactive';
            const RoleIcon = roleIcons[module.role] || roleIcons.unknown;
            
            return (
              <Card key={module.module_id} className="bg-slate-800/70 border-slate-700 hover:border-cyan-400 transition-all duration-300 flex flex-col">
                 <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-white">{module.name}</CardTitle>
                    <div title={`Status: ${status}`} className={`w-3 h-3 mt-2 rounded-full ${status === "active" ? "bg-green-400 animate-pulse" : "bg-red-500"}`}/>
                  </div>
                  <CardDescription className="text-gray-400">ID: {module.module_id}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="flex items-center text-gray-300">
                    <RoleIcon className="h-5 w-5 mr-3 text-cyan-400" />
                    <span>Your Role: <span className="font-semibold capitalize">{module.role}</span></span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Cpu className="h-5 w-5 mr-3 text-cyan-400" />
                    <span>Total Pins: <span className="font-semibold">{module.alloted_pins}</span></span>
                  </div>
                   <div className="flex items-center text-gray-300">
                    <Link2 className="h-5 w-5 mr-3 text-cyan-400" />
                    <span>Used Pins: <span className="font-semibold">{module.used_pins}</span></span>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700 pt-4">
                  <Link href={`/dashboard/module/${module.module_id}/${module.role}`} className="w-full">
                    <Button variant="outline" className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-400">
                      Manage Module
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
      <AddModuleDialog isOpen={isAddModuleOpen} onClose={() => setIsAddModuleOpen(false)} />
    </div>
  )
}