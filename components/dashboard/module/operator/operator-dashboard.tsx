"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Module } from "@/lib/types";
import { Zap, BarChart3 } from "lucide-react";

// Import the section components for the operator
import { OperatorGroupsSection } from './operator-groups-section';
import { OperatorMetricsSection } from './operator-metrics-section';

export function OperatorDashboard({ module }: { module: Module }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{module.name}</h1>
        <p className="text-gray-400">Operator Dashboard (ID: {module.module_id})</p>
      </div>

      <Tabs defaultValue="controls" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1 h-auto">
          <TabsTrigger value="controls"><Zap className="mr-2 h-4 w-4" />Pin Controls</TabsTrigger>
          <TabsTrigger value="metrics"><BarChart3 className="mr-2 h-4 w-4" />Live Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="controls" className="mt-6">
            <OperatorGroupsSection module={module} />
        </TabsContent>
        <TabsContent value="metrics" className="mt-6">
            <OperatorMetricsSection module={module} />
        </TabsContent>
      </Tabs>
    </div>
  );
}