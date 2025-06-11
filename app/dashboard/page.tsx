"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Settings, Eye, Zap, Wrench, ShieldQuestion, Waves } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AddModuleDialog } from "@/components/dashboard/add-module-dialog"
import { useState } from "react"

const roleIcons: { [key: string]: React.ElementType } = {
  owner: Settings,
  operator: Zap,
  viewer: Eye,
  programmer: Wrench,
  unknown: ShieldQuestion,
}

export default function DashboardPage() {
  const { user, modules } = useAuth()
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-wave-lightBlue text-xl">Loading user data...</div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-wave-lightBlue">My Modules</h1>
          <p className="text-wave-sand/80">Access and manage your Wave Habitat modules.</p>
        </div>
        <Button
          onClick={() => setIsAddModuleOpen(true)}
          className="bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
        <Card className="bg-wave-midBlue border-wave-lightBlue/30 shadow-lg">
          <CardContent className="pt-6 text-center">
            <Waves className="mx-auto h-16 w-16 text-wave-lightBlue/50 mb-4" />
            <h3 className="text-xl font-semibold text-wave-sand mb-2">No Modules Yet</h3>
            <p className="text-wave-sand/70 mb-4">Click "Add Module" to connect your first Wave Habitat device.</p>
            <Button
              onClick={() => setIsAddModuleOpen(true)}
              className="bg-wave-lightBlue hover:bg-wave-lightBlue/80 text-wave-deepBlue"
            >
              Add Your First Module
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const RoleIcon = roleIcons[module.role.toLowerCase()] || roleIcons.unknown
            return (
              <Card
                key={module.id}
                className="bg-wave-midBlue border-wave-lightBlue/40 shadow-xl hover:shadow-wave-lightBlue/20 hover:border-wave-lightBlue transition-all duration-300 flex flex-col"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-wave-lightBlue">{module.name}</CardTitle>
                    <div
                      className={`p-1.5 rounded-full ${module.status === "active" ? "status-glow-active" : "status-glow-inactive"}`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${module.status === "active" ? "bg-wave-seafoam" : "bg-wave-coral"}`}
                      />
                    </div>
                  </div>
                  <CardDescription className="text-wave-sand/70">ID: {module.id}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center space-x-2 text-wave-sand/90">
                    <RoleIcon className="h-5 w-5 text-wave-seafoam" />
                    <span>
                      Role: <span className="font-semibold capitalize">{module.role}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-wave-sand/70 line-clamp-2">
                    {module.description || "No description available for this module."}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-wave-lightBlue/20 pt-4">
                  <Link href={`/dashboard/module/${module.id}/${module.role.toLowerCase()}`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-wave-lightBlue text-wave-lightBlue hover:bg-wave-lightBlue/10 hover:text-wave-lightBlue"
                    >
                      Access Module
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
      <AddModuleDialog isOpen={isAddModuleOpen} onClose={() => setIsAddModuleOpen(false)} onModuleAdded={() => {}} />
    </div>
  )
}
