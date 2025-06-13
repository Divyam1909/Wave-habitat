"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Module } from "@/lib/types";
import { Settings, ListChecks, Users } from "lucide-react";
import { OwnerPinsSection } from './owner-pins-section';
import { OwnerGroupsSection } from './owner-groups-section';
import { OwnerRolesSection } from './owner-roles-section';

// This component receives the 'module' object as a prop from the router page
export function OwnerDashboard({ module }: { module: Module }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{module.name}</h1>
        <p className="text-gray-400">Owner Dashboard (ID: {module.module_id})</p>
      </div>

      {/* Tab Navigation */}
      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1 h-auto">
          <TabsTrigger value="groups"><ListChecks className="mr-2 h-4 w-4" />Manage Groups</TabsTrigger>
          <TabsTrigger value="pins"><Settings className="mr-2 h-4 w-4" />Configure Pins</TabsTrigger>
          <TabsTrigger value="roles"><Users className="mr-2 h-4 w-4" />Assign Roles</TabsTrigger>
        </TabsList>
        
        {/* Tab Content Panes */}
        <TabsContent value="groups" className="mt-6">
          <OwnerGroupsSection module={module} />
        </TabsContent>
        <TabsContent value="pins" className="mt-6">
          <OwnerPinsSection module={module} />
        </TabsContent>
        <TabsContent value="roles" className="mt-6">
          <OwnerRolesSection module={module} />
        </TabsContent>
      </Tabs>
    </div>
  );
}