"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Module, Pin, ButtonState } from "@/lib/types"
import { OperatorPinCard } from "./operator-pin-card"
import { PinAutoConfigDialog } from "./pin-auto-config-dialog"
import { Power } from "lucide-react"

interface OperatorGroupsSectionProps {
  module: Module
  onUpdatePin?: (pinId: string, updates: Partial<Pin>) => void
}

export function OperatorGroupsSection({ module, onUpdatePin }: OperatorGroupsSectionProps) {
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [isAutoConfigOpen, setIsAutoConfigOpen] = useState(false)

  // Group pins by operator group
  const groupedPins = module.pins.reduce((acc: { [key: string]: Pin[] }, pin) => {
    const groupName = pin.assignedGroupId || "Unassigned"
    if (!acc[groupName]) {
      acc[groupName] = []
    }
    acc[groupName].push(pin)
    return acc
  }, {})

  // Extract unassigned pins
  const unassignedPins = groupedPins["Unassigned"] || []
  delete groupedPins["Unassigned"]

  // Get pins in a specific group
  const getPinsInGroup = (groupId?: string): Pin[] => {
    return module.pins.filter((p) => p.assignedGroupId === groupId)
  }

  // Convert groupedPins object to an array of { name: string, pins: Pin[] }
  const groups = module.groups.filter((group) => getPinsInGroup(group.id).length > 0)

  const handlePinStateChange = (pinId: string, newState: ButtonState) => {
    if (onUpdatePin) {
      onUpdatePin(pinId, { state: newState })
    }
  }

  const handleConfigureAuto = (pinId: string) => {
    const pin = module.pins.find((p) => p.id === pinId)
    if (pin) {
      setSelectedPin(pin)
      setIsAutoConfigOpen(true)
    }
  }

  const handleSaveAutoConfig = (pinId: string, config: any) => {
    if (onUpdatePin) {
      onUpdatePin(pinId, { autoConfig: config })
    }
    setIsAutoConfigOpen(false)
  }

  if (module.pins.length === 0) {
    return (
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
        <CardContent className="pt-6 text-center">
          <Power className="mx-auto h-16 w-16 text-wave-lightBlue/50 mb-4" />
          <h3 className="text-xl font-semibold text-wave-sand mb-2">No Pins Configured</h3>
          <p className="text-wave-sand/70">You haven't configured any pins for this module yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
        <CardHeader>
          <CardTitle className="text-wave-lightBlue flex items-center gap-2">
            <Power className="h-5 w-5" />
            Pin Groups & Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-2">
            {/* Grouped Pins */}
            {groups.map((group) => {
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
                        <OperatorPinCard 
                          key={pin.id} 
                          pin={pin} 
                          onStateChange={handlePinStateChange}
                          onConfigureAuto={handleConfigureAuto}
                        />
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
                      <OperatorPinCard 
                        key={pin.id} 
                        pin={pin} 
                        onStateChange={handlePinStateChange}
                        onConfigureAuto={handleConfigureAuto}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>

      {/* Auto Configuration Dialog */}
      {selectedPin && (
        <PinAutoConfigDialog
          pin={selectedPin}
          isOpen={isAutoConfigOpen}
          onClose={() => setIsAutoConfigOpen(false)}
          onSave={handleSaveAutoConfig}
        />
      )}
    </div>
  )
}
