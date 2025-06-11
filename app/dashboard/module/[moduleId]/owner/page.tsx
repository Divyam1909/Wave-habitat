"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { Module } from "@/lib/types"
import { Loader2, Settings, ListChecks, Users, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OwnerPinsSection } from "@/components/dashboard/module/owner/owner-pins-section"
import { OwnerGroupsSection } from "@/components/dashboard/module/owner/owner-groups-section"
import { OwnerRolesSection } from "@/components/dashboard/module/owner/owner-roles-section"
import { Button } from "@/components/ui/button"

export default function OwnerModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.moduleId as string
  const { getModuleById, isLoading: authLoading, user } = useAuth()
  const [module, setModule] = useState<Module | undefined | null>(undefined) // null means not found/not owner

  useEffect(() => {
    if (!authLoading && user) {
      const fetchedModule = getModuleById(moduleId)
      if (fetchedModule && fetchedModule.role === "owner") {
        setModule(fetchedModule)
      } else if (fetchedModule) {
        // User has access but not as owner, redirect to their role's page or dashboard
        toast({ title: "Access Denied", description: "You are not the owner of this module.", variant: "destructive" })
        router.replace(`/dashboard/module/${moduleId}/${fetchedModule.role}`)
      } else {
        setModule(null) // Mark as not found or no access
      }
    }
  }, [moduleId, getModuleById, authLoading, user, router])

  if (authLoading || module === undefined) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-wave-lightBlue" />
      </div>
    )
  }

  if (module === null) {
    // Module not found for this user or user is not owner
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
        <AlertTriangle className="h-16 w-16 text-wave-coral mb-4" />
        <h2 className="text-2xl font-semibold text-wave-sand mb-2">Module Not Found or Access Denied</h2>
        <p className="text-wave-sand/80 mb-6">
          Either the module with ID "{moduleId}" does not exist, or you do not have owner privileges for it.
        </p>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-wave-lightBlue hover:bg-wave-lightBlue/90 text-wave-deepBlue"
        >
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-wave-lightBlue">{module.name}</h1>
          <p className="text-wave-sand/80">Owner Dashboard - Module ID: {moduleId}</p>
        </div>
        {/* Add any global module actions here if needed */}
      </div>

      <Tabs defaultValue="pins" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-wave-deepBlue/50 border border-wave-lightBlue/30">
          <TabsTrigger
            value="pins"
            className="data-[state=active]:bg-wave-lightBlue data-[state=active]:text-wave-deepBlue data-[state=active]:shadow-md"
          >
            <Settings className="mr-2 h-4 w-4" /> Pins Configuration
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-wave-lightBlue data-[state=active]:text-wave-deepBlue data-[state=active]:shadow-md"
          >
            <ListChecks className="mr-2 h-4 w-4" /> Manage Groups
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="data-[state=active]:bg-wave-lightBlue data-[state=active]:text-wave-deepBlue data-[state=active]:shadow-md"
          >
            <Users className="mr-2 h-4 w-4" /> Assign Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pins" className="mt-6">
          <OwnerPinsSection module={module} />
        </TabsContent>
        <TabsContent value="groups" className="mt-6">
          <OwnerGroupsSection module={module} />
        </TabsContent>
        <TabsContent value="roles" className="mt-6">
          <OwnerRolesSection module={module} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper for toast (if not already globally available in this context)
import { toast } from "@/components/ui/use-toast"
