"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { Module } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, BarChart3 } from 'lucide-react'
import { ViewerGroupsSection } from "@/components/dashboard/module/viewer/viewer-groups-section"
import { ViewerMetricsSection } from "@/components/dashboard/module/viewer/viewer-metrics-section"

export default function ViewerModulePage() {
  const params = useParams()
  const { getModuleById } = useAuth()
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)

  const moduleId = params.moduleId as string

  useEffect(() => {
    const moduleData = getModuleById(moduleId)
    if (moduleData) {
      setModule(moduleData)
    }
    setLoading(false)
  }, [moduleId, getModuleById])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wave-deepBlue via-wave-midBlue to-wave-deepBlue p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-wave-lightBlue/20 rounded w-1/3"></div>
            <div className="h-64 bg-wave-lightBlue/20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wave-deepBlue via-wave-midBlue to-wave-deepBlue p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
            <CardContent className="pt-6 text-center">
              <Eye className="mx-auto h-16 w-16 text-wave-lightBlue/50 mb-4" />
              <h2 className="text-2xl font-bold text-wave-sand mb-2">Module Not Found</h2>
              <p className="text-wave-sand/70">The requested module could not be found or you don't have access to it.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wave-deepBlue via-wave-midBlue to-wave-deepBlue p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-wave-sand mb-2">{module.name}</h1>
            <div className="flex items-center gap-2 text-wave-lightBlue">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Viewer Access</span>
              <span className="text-xs px-2 py-1 bg-wave-lightBlue/20 rounded-full border border-wave-lightBlue/30">
                Read Only
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-wave-sand/70">Module Status</div>
            <div className={`text-lg font-semibold ${module.status === "active" ? "text-wave-seafoam" : "text-wave-coral"}`}>
              {module.status === "active" ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="bg-wave-deepBlue/50 border border-wave-lightBlue/30">
            <TabsTrigger 
              value="groups" 
              className="data-[state=active]:bg-wave-lightBlue/20 data-[state=active]:text-wave-sand text-wave-sand/70"
            >
              <Users className="mr-2 h-4 w-4" />
              Groups & Status
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="data-[state=active]:bg-wave-lightBlue/20 data-[state=active]:text-wave-sand text-wave-sand/70"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6">
            <ViewerGroupsSection module={module} />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <ViewerMetricsSection module={module} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
