"use client"

import type { Pin } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Power, Clock, Zap, Lock } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ViewerPinCardProps {
  pin: Pin
}

export function ViewerPinCard({ pin }: ViewerPinCardProps) {
  const getStateIcon = () => {
    switch (pin.state) {
      case "on":
        return <Power className="h-4 w-4" />
      case "auto":
        return <Clock className="h-4 w-4" />
      case "off":
      default:
        return <Zap className="h-4 w-4 opacity-50" />
    }
  }

  const getStateColor = () => {
    switch (pin.state) {
      case "on":
        return "text-wave-seafoam"
      case "auto":
        return "text-wave-buttonAuto"
      case "off":
      default:
        return "text-wave-coral"
    }
  }

  const getAutoConfigSummary = () => {
    if (!pin.autoConfig) return "Not configured"

    switch (pin.autoConfig.mode) {
      case "time":
        return `${pin.autoConfig.timeDuration?.value} ${pin.autoConfig.timeDuration?.unit}`
      case "limit":
        return `${pin.autoConfig.timeLimit?.startTime} - ${pin.autoConfig.timeLimit?.endTime}`
      case "sensor":
        return `Sensor: ${pin.autoConfig.sensorThreshold?.sensorId}`
      default:
        return "Not configured"
    }
  }

  return (
    <Card
      className={cn(
        "transition-all duration-300 border-2 relative",
        pin.state === "on" &&
          "border-wave-seafoam/50 bg-wave-seafoam/5 shadow-glow-sm [--glow-color:hsl(var(--wave-seafoam))]",
        pin.state === "auto" &&
          "border-wave-buttonAuto/50 bg-wave-buttonAuto/5 shadow-glow-sm [--glow-color:hsl(var(--wave-button-auto))]",
        pin.state === "off" && "border-wave-coral/30 bg-wave-deepBlue/30",
      )}
    >
      {/* Read-only indicator */}
      <div className="absolute top-2 right-2 z-10">
        <Lock className="h-3 w-3 text-wave-sand/50" />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between pr-6">
          <div className="flex items-center gap-2">
            <span className={getStateColor()}>{getStateIcon()}</span>
            <span className="text-wave-sand truncate">{pin.name}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* State Display (Read-only) */}
        <div className="grid grid-cols-3 gap-1">
          <div
            className={cn(
              "text-xs h-7 rounded border flex items-center justify-center font-medium",
              pin.state === "on"
                ? "bg-wave-seafoam/20 border-wave-seafoam/50 text-wave-seafoam"
                : "border-wave-seafoam/20 text-wave-seafoam/50",
            )}
          >
            ON
          </div>
          <div
            className={cn(
              "text-xs h-7 rounded border flex items-center justify-center font-medium",
              pin.state === "auto"
                ? "bg-wave-buttonAuto/20 border-wave-buttonAuto/50 text-wave-buttonAuto"
                : "border-wave-buttonAuto/20 text-wave-buttonAuto/50",
            )}
          >
            AUTO
          </div>
          <div
            className={cn(
              "text-xs h-7 rounded border flex items-center justify-center font-medium",
              pin.state === "off"
                ? "bg-wave-coral/20 border-wave-coral/50 text-wave-coral"
                : "border-wave-coral/20 text-wave-coral/50",
            )}
          >
            OFF
          </div>
        </div>

        {/* Auto Config Summary */}
        {pin.state === "auto" && (
          <div className="text-xs text-wave-sand/70 bg-wave-deepBlue/50 p-2 rounded border border-wave-lightBlue/20">
            <span className="font-medium">Auto Config:</span> {getAutoConfigSummary()}
          </div>
        )}

        {/* Status Indicator */}
        <div className="flex items-center justify-center">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              pin.state === "on" && "bg-wave-seafoam status-glow-active",
              pin.state === "auto" && "bg-wave-buttonAuto status-glow-auto",
              pin.state === "off" && "bg-wave-coral/50",
            )}
          />
          <span className={cn("ml-2 text-xs font-medium capitalize", getStateColor())}>
            {pin.state === "on" ? "Active" : pin.state === "auto" ? "Auto" : "Inactive"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
