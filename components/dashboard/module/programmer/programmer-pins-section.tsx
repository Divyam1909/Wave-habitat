"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircuitBoard, Lock } from "lucide-react"
import { ProgrammerPinCard } from "./programmer-pin-card"

interface ProgrammerPinsSectionProps {
  module: any
}

export function ProgrammerPinsSection({ module }: ProgrammerPinsSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-wave-lightBlue flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CircuitBoard className="h-5 w-5" />
              Module Pins
            </span>
            <Badge variant="outline" className="bg-wave-deepBlue/50 text-wave-sand border-wave-lightBlue/30">
              <Lock className="h-3 w-3 mr-1" />
              View Only
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {module.pins.map((pin: any) => (
              <ProgrammerPinCard key={pin.id} pin={pin} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
