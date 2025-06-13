"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Module } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

// Import the section components
import { OwnerPinsSection } from './owner-pins-section';
import { OwnerGroupsSection } from './owner-groups-section';
import { OwnerRolesSection } from './owner-roles-section';

export function OwnerDashboard({ module }: { module: Module }) {
  const { user } = useAuth();
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && module) {
      const fetchModuleDetails = async () => {
        setIsLoading(true);
        try {
          const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
          const response = await fetch(`${basePath}/api/get-module-details.php?module_id=${module}&user_id=${user.id}`);
          const data = await response.json();
          if (response.ok && data.success) {
            setModuleData(data.module);
          } else {
            setModuleData(null); // Set to null on error
          }
        } catch (error) {
          setModuleData(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchModuleDetails();
    }
  }, [user, module]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>;
  }

  if (!moduleData) {
    return <div>Error: Could not load module details or access denied.</div>;
  }

  // Now we are GUARANTEED to have the full moduleData object with pins, groups, etc.
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{moduleData.name}</h1>
        <p className="text-gray-400">Owner Dashboard (ID: {moduleData.module_id})</p>
      </div>
      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="groups">Manage Groups</TabsTrigger>
          <TabsTrigger value="pins">Configure Pins</TabsTrigger>
          <TabsTrigger value="roles">Assign Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="groups" className="mt-6"><OwnerGroupsSection module={moduleData} /></TabsContent>
        <TabsContent value="pins" className="mt-6"><OwnerPinsSection module={moduleData} /></TabsContent>
        <TabsContent value="roles" className="mt-6"><OwnerRolesSection module={moduleData} /></TabsContent>
      </Tabs>
    </div>
  );
}