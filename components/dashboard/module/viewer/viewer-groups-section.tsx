"use client"

import { useState, useEffect } from "react"
import type { Module, Pin } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Power } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ViewerPinCard } from "./viewer-pin-card"

interface ViewerGroupsSectionProps {
  module: Module
}

export function ViewerGroupsSection({ module: initialModule }: ViewerGroupsSectionProps) {
  const { getModuleById } = useAuth()
  const [module, setModule] = useState<Module>(initialModule)

  useEffect(() => {
    const latestModuleData = getModuleById(initialModule.module_id)
    if (latestModuleData) {
      setModule(latestModuleData)
    }
  }, [initialModule, getModuleById])

  const getPinsInGroup = (groupId?: string): Pin[] => {
    return (module.pins || []).filter((p) => p.assignedGroupId === groupId)
  }

  const unassignedPins = module.pins.filter((p) => !p.assignedGroupId)
  const groupsWithPins = module.groups.filter((group) => getPinsInGroup(group.id).length > 0)

  if (module.pins.length === 0) {
    return (
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
        <CardContent className="pt-6 text-center">
          <Power className="mx-auto h-16 w-16 text-wave-lightBlue/50 mb-4" />
          <h3 className="text-xl font-semibold text-wave-sand mb-2">No Pins Configured</h3>
          <p className="text-wave-sand/70">The module owner hasn't configured any pins yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
        <CardHeader>
          <CardTitle className="text-wave-lightBlue flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Pin Groups & Status (Read Only)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-2">
            {/* Grouped Pins */}
            {groupsWithPins.map((group) => {
              const pinsInGroup = getPinsInGroup(group.id)

              return (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="bg-wave-deepBlue/30 border border-wave-lightBlue/20 rounded-md px-1"
                >
                  <AccordionTrigger className="hover:no-underline px-3 py-3 text-wave-sand hover:bg-wave-lightBlue/10 rounded-t-md">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-wave-sand">{group.name}</span>
                      </div>
                      <span className="text-xs text-wave-sand/60 px-2 py-0.5 bg-wave-midBlue/40 rounded-full">
                        {pinsInGroup.length} pins
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pt-2 pb-3 border-t border-wave-lightBlue/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {pinsInGroup.map((pin) => (
                        <ViewerPinCard key={pin.id} pin={pin} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}

            {/* Unassigned Pins */}
            {unassignedPins.length > 0 && (
              <AccordionItem
                value="unassigned-pins"
                className="bg-wave-deepBlue/30 border border-wave-lightBlue/20 rounded-md px-1"
              >
                <AccordionTrigger className="hover:no-underline px-3 py-3 text-wave-sand hover:bg-wave-lightBlue/10 rounded-t-md">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-wave-sand/80 italic">Unassigned Pins</span>
                    </div>
                    <span className="text-xs text-wave-sand/60 px-2 py-0.5 bg-wave-midBlue/40 rounded-full">
                      {unassignedPins.length} pins
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pt-2 pb-3 border-t border-wave-lightBlue/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {unassignedPins.map((pin) => (
                      <ViewerPinCard key={pin.id} pin={pin} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
