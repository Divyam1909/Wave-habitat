// Full Code for: app/dashboard/module/[[...slug]]/page.tsx (Corrected)

"use client";

import { useAuth } from "@/contexts/auth-context";
import { useParams, notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Module } from "@/lib/types";

// Import your main dashboard container components
import { OwnerDashboard } from "@/components/dashboard/module/owner/owner-dashboard";
import { ProgrammerDashboard } from "@/components/dashboard/module/programmer/programmer-dashboard";
import { OperatorDashboard } from "@/components/dashboard/module/operator/operator-dashboard";
import { ViewerDashboard } from "@/components/dashboard/module/viewer/viewer-dashboard";

function ModuleLoader() {
  // --- THIS IS THE CRITICAL FIX ---
  // We must explicitly return the JSX element.
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
    </div>
  );
}

export default function CatchAllModulePage() {
  const params = useParams();
  const { modules, isLoading } = useAuth();
  
  const slug = params.slug || [];
  const moduleId = slug[0];
  const roleFromUrl = slug[1];

  const [module, setModule] = useState<Module | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && modules && moduleId && roleFromUrl) {
      const foundModule = modules.find(m => m.module_id === moduleId);
      
      if (foundModule && foundModule.role.toLowerCase() === roleFromUrl.toLowerCase()) {
        setModule(foundModule);
      } else {
        setModule(null);
      }
    } else if (!isLoading) {
      setModule(null);
    }
  }, [modules, isLoading, moduleId, roleFromUrl]);

  if (module === undefined || isLoading) {
    return <ModuleLoader />;
  }

  if (module === null) {
    return notFound();
  }

  // Render the correct UI component, passing the module data as a prop
  switch (module.role) {
    case 'owner':
      return <OwnerDashboard module={module} />;
    case 'programmer':
      return <ProgrammerDashboard module={module} />;
    case 'operator':
      return <OperatorDashboard module={module} />;
    case 'viewer':
      return <ViewerDashboard module={module} />;
    default:
      return notFound();
  }
}