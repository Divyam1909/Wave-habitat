"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { Module } from "@/lib/types"
import { Loader2, BarChart3, AlertTriangle, Layers } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { OperatorGroupsSection } from "@/components/dashboard/module/operator/operator-groups-section"
import { OperatorMetricsSection } from "@/components/dashboard/module/operator/operator-metrics-section"
import { useToast } from "@/components/ui/use-toast"

export default function OperatorModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.moduleId as string
  const { getModuleById, isLoading: authLoading, user } = useAuth()
  const { toast } = useToast()
  const [module, setModule] = useState<Module | undefined | null>(undefined)

  useEffect(() => {
    if (!authLoading && user) {
      const fetchedModule = getModuleById(moduleId)
      if (fetchedModule && fetchedModule.role === "operator") {
        setModule(fetchedModule)
      } else if (fetchedModule) {
        toast({
          title: "Access Denied",
          description: "You are not an operator for this module.",
          variant: "destructive",
        })
        router.replace(`/dashboard/module/${moduleId}/${fetchedModule.role}`)
      } else {
        setModule(null)
      }
    }
  }, [moduleId, getModuleById, authLoading, user, router, toast])

  if (authLoading || module === undefined) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-wave-lightBlue" />
      </div>
    )
  }

  if (module === null) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center">
        <AlertTriangle className="h-16 w-16 text-wave-coral mb-4" />
        <h2 className="text-2xl font-semibold text-wave-sand mb-2">Module Not Found or Access Denied</h2>
        <p className="text-wave-sand/80 mb-6">
          Either the module with ID "{moduleId}" does not exist, or you do not have operator privileges for it.
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
          <p className="text-wave-sand/80">Operator Dashboard - Module ID: {moduleId}</p>
        </div>
      </div>

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 bg-wave-deepBlue/50 border border-wave-lightBlue/30">
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-wave-lightBlue data-[state=active]:text-wave-deepBlue data-[state=active]:shadow-md"
          >
            <Layers className="mr-2 h-4 w-4" /> Groups & Controls
          </TabsTrigger>
          <TabsTrigger
            value="metrics"
            className="data-[state=active]:bg-wave-lightBlue data-[state=active]:text-wave-deepBlue data-[state=active]:shadow-md"
          >
            <BarChart3 className="mr-2 h-4 w-4" /> Live Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-6">
          <OperatorGroupsSection module={module} />
        </TabsContent>
        <TabsContent value="metrics" className="mt-6">
          <OperatorMetricsSection module={module} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
