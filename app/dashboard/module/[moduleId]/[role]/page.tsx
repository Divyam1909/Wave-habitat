"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"

interface ModuleRolePageProps {
  params: {
    moduleId: string
    role: string
  }
}

export default function ModuleRolePage({ params }: ModuleRolePageProps) {
  const { moduleId, role } = params
  const validRoles = ["owner", "operator", "programmer", "viewer"]

  if (!validRoles.includes(role)) {
    notFound()
  }

  // In a real app, you would fetch module data based on moduleId
  // and verify the user's role for this specific module.

  const renderDashboard = () => {
    switch (role) {
      case "owner":
        return <div>Owner Dashboard for Module {moduleId}</div>
      case "operator":
        return <div>Operator Dashboard for Module {moduleId}</div>
      case "programmer":
        return <div>Programmer Dashboard for Module {moduleId}</div>
      case "viewer":
        return <div>Viewer Dashboard for Module {moduleId}</div>
      default:
        return <div>Unknown role.</div>
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-wave-lightBlue capitalize">{role} Dashboard</h1>
        <p className="text-wave-sand/80">Managing Module ID: {moduleId}</p>
      </div>
      <Card className="bg-wave-midBlue border-wave-lightBlue/30 shadow-lg">
        <CardHeader>
          <CardTitle className="capitalize">{role} Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center text-wave-sand/70">
            {/* Placeholder for the detailed dashboard UI */}
            {renderDashboard()}
            <p className="ml-2">UI to be implemented here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
