"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Module } from "@/lib/types";
import { Eye, BarChart3 } from "lucide-react";

// Import the section components for the viewer
import { ViewerGroupsSection } from './viewer-groups-section';
import { ViewerMetricsSection } from './viewer-metrics-section';

export function ViewerDashboard({ module }: { module: Module }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{module.name}</h1>
        <p className="text-gray-400">Viewer Dashboard (ID: {module.module_id})</p>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1 h-auto">
          <TabsTrigger value="status"><Eye className="mr-2 h-4 w-4" />Pin Status</TabsTrigger>
          <TabsTrigger value="metrics"><BarChart3 className="mr-2 h-4 w-4" />View Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="status" className="mt-6">
            <ViewerGroupsSection module={module} />
        </TabsContent>
        <TabsContent value="metrics" className="mt-6">
            <ViewerMetricsSection module={module} />
        </TabsContent>
      </Tabs>
    </div>
  );
}