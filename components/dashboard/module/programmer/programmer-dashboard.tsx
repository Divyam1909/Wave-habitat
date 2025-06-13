"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Module } from "@/lib/types";
import { Eye, Layers, Sliders, Users } from "lucide-react";

// Import the section components for the programmer
import { ProgrammerPinsSection } from './programmer-pins-section';
import { ProgrammerGroupsSection } from './programmer-groups-section';
import { ProgrammerRolesSection } from './programmer-roles-section';
import { ProgrammerCalibrateSection } from './programmer-calibrate-section';

export function ProgrammerDashboard({ module }: { module: Module }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{module.name}</h1>
        <p className="text-gray-400">Programmer Dashboard (ID: {module.module_id})</p>
      </div>

      <Tabs defaultValue="calibrate" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 p-1 h-auto">
          <TabsTrigger value="calibrate"><Sliders className="mr-2 h-4 w-4" />Calibrate</TabsTrigger>
          <TabsTrigger value="groups"><Layers className="mr-2 h-4 w-4" />View Groups</TabsTrigger>
          <TabsTrigger value="pins"><Eye className="mr-2 h-4 w-4" />View Pins</TabsTrigger>
          <TabsTrigger value="roles"><Users className="mr-2 h-4 w-4" />View Roles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calibrate" className="mt-6">
          <ProgrammerCalibrateSection module={module} />
        </TabsContent>
        <TabsContent value="groups" className="mt-6">
          <ProgrammerGroupsSection module={module} />
        </TabsContent>
        <TabsContent value="pins" className="mt-6">
          <ProgrammerPinsSection module={module} />
        </TabsContent>
        <TabsContent value="roles" className="mt-6">
          <ProgrammerRolesSection module={module} />
        </TabsContent>
      </Tabs>
    </div>
  );
}       