// Full Code for: app/dashboard/module/[[...slug]]/page.tsx (Final, Corrected Version)

"use client";

import { useAuth } from "@/contexts/auth-context";
import { useParams, notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Module } from "@/lib/types";

// Import your dashboard UI container components
import { OwnerDashboard } from "@/components/dashboard/module/owner/owner-dashboard";
import { ProgrammerDashboard } from "@/components/dashboard/module/programmer/programmer-dashboard";
import { OperatorDashboard } from "@/components/dashboard/module/operator/operator-dashboard";
import { ViewerDashboard } from "@/components/dashboard/module/viewer/viewer-dashboard";

function FullScreenLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col h-[80vh] w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
      {message && <p className="mt-4 text-gray-400">{message}</p>}
    </div>
  );
}

export default function CatchAllModulePage() {
  const params = useParams();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // --- THIS IS THE CRITICAL FIX ---
  // The 'slug' from useParams is an array of strings, e.g., ['MOD001', 'owner']
  const slug = params.slug || [];
  const moduleId = slug[0]; // The first part is the module ID
  const roleFromUrl = slug[1]; // The second part is the role
  
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We must wait for the main auth check to finish and have a user and a valid moduleId
    if (!isAuthLoading && user && moduleId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          // Note: We no longer need NEXT_PUBLIC_BASE_PATH because this is a server-relative URL.
          // The browser will correctly prepend the domain and the /wave basePath.
          const response = await fetch(`/wave/api/get-module-details.php?module_id=${moduleId}&user_id=${user.id}`);
          const data = await response.json();

          if (response.ok && data.success) {
            // Security check: Does the role from the fetched data match the URL?
            if (data.module.role.toLowerCase() === roleFromUrl.toLowerCase()) {
              setModule(data.module);
            } else {
              // User has access, but is trying to access via the wrong role URL.
              setModule(null); 
            }
          } else {
            setModule(null);
          }
        } catch (error) {
          console.error("Failed to fetch module details:", error);
          setModule(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    } else if (!isAuthLoading) {
      // If auth is loaded but there's no user or moduleId, stop loading.
      setIsLoading(false);
    }
  }, [user, moduleId, roleFromUrl, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return <FullScreenLoader message="Loading Module..." />;
  }

  // If fetching is done but we have no module, it means access was denied or the ID is invalid.
  if (!module) {
    return notFound(); // Render the standard 404 page
  }

  // Render the correct dashboard based on the role from the fetched data
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