"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Layers, Lock } from "lucide-react"
import { ProgrammerPinCard } from "./programmer-pin-card"

interface ProgrammerGroupsSectionProps {
  module: any
}

export function ProgrammerGroupsSection({ module }: ProgrammerGroupsSectionProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  // Get pins that don't belong to any group
  const unassignedPins = module.pins.filter((pin: any) => !pin.group)

  return (
    <div className="space-y-6">
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-wave-lightBlue flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Module Groups
            </span>
            <Badge variant="outline" className="bg-wave-deepBlue/50 text-wave-sand border-wave-lightBlue/30">
              <Lock className="h-3 w-3 mr-1" />
              View Only
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" value={expandedGroups} className="space-y-2">
            {module.groups.map((group: any) => {
              const groupPins = module.pins.filter((pin: any) => pin.group === group.name)
              const activeCount = groupPins.filter((pin: any) => pin.status === "active").length
              const autoCount = groupPins.filter((pin: any) => pin.status === "auto").length

              return (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="border border-wave-lightBlue/20 rounded-md overflow-hidden bg-wave-deepBlue/30 backdrop-blur-sm"
                >
                  <AccordionTrigger
                    onClick={() => toggleGroup(group.id)}
                    className="px-4 py-2 hover:bg-wave-deepBlue/50 hover:no-underline"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-wave-sand">{group.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-wave-deepBlue/50 text-wave-sand border-wave-lightBlue/30"
                        >
                          {groupPins.length} Pins
                        </Badge>
                        {activeCount > 0 && (
                          <Badge className="bg-wave-buttonOn/20 text-wave-buttonOn border-wave-buttonOn/30">
                            {activeCount} Active
                          </Badge>
                        )}
                        {autoCount > 0 && (
                          <Badge className="bg-wave-buttonAuto/20 text-wave-buttonAuto border-wave-buttonAuto/30">
                            {autoCount} Auto
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-wave-deepBlue/20 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {groupPins.map((pin: any) => (
                        <ProgrammerPinCard key={pin.id} pin={pin} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}

            {unassignedPins.length > 0 && (
              <AccordionItem
                value="unassigned"
                className="border border-wave-lightBlue/20 rounded-md overflow-hidden bg-wave-deepBlue/30 backdrop-blur-sm"
              >
                <AccordionTrigger
                  onClick={() => toggleGroup("unassigned")}
                  className="px-4 py-2 hover:bg-wave-deepBlue/50 hover:no-underline"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-wave-sand">Unassigned Pins</span>
                    <Badge variant="outline" className="bg-wave-deepBlue/50 text-wave-sand border-wave-lightBlue/30">
                      {unassignedPins.length} Pins
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-wave-deepBlue/20 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {unassignedPins.map((pin: any) => (
                      <ProgrammerPinCard key={pin.id} pin={pin} />
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
