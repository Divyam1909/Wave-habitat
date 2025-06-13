"use client";

import { useAuth } from "@/contexts/auth-context";
import { useParams, notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Module } from "@/lib/types";

// Import your main dashboard container components
// Note: You must create these files as we discussed previously
import OwnerDashboard from "@/app/dashboard/module/[moduleId]/owner/page";
import ProgrammerDashboard from "@/app/dashboard/module/[moduleId]/programmer/page"; 
import OperatorDashboard from "@/app/dashboard/module/[moduleId]/operator/page";
import ViewerDashboard from "@/app/dashboard/module/[moduleId]/viewer/page";

function ModuleLoader() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
    </div>
  );
}

export default function ModulePage() {
  const params = useParams();
  const { modules, isLoading } = useAuth();
  
  const moduleId = Array.isArray(params.moduleId) ? params.moduleId[0] : params.moduleId;
  const roleFromUrl = Array.isArray(params.role) ? params.role[0] : params.role;

  const [module, setModule] = useState<Module | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && modules.length > 0 && roleFromUrl) {
      const foundModule = modules.find(m => m.module_id === moduleId);
      if (foundModule && foundModule.role.toLowerCase() === roleFromUrl.toLowerCase()) {
        setModule(foundModule);
      } else {
        setModule(null); // Set to null if not found or role mismatch
      }
    }
  }, [modules, isLoading, moduleId, roleFromUrl]);

  if (module === undefined || isLoading) {
    return <ModuleLoader />;
  }

  if (module === null) {
    return notFound(); // Renders the not-found page if access is denied
  }

  // --- This is the core routing logic ---
  switch (module.role) {
    case 'owner':
      return <OwnerDashboard moduleId={moduleId!} />;
    case 'programmer':
      return <ProgrammerDashboard moduleId={moduleId!} />;
    case 'operator':
      return <OperatorDashboard moduleId={moduleId!} />;
    case 'viewer':
      return <ViewerDashboard moduleId={moduleId!} />;
    default:
      return notFound();
  }
}