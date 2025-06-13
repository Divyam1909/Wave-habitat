"use client"

import { useState, useEffect } from "react"
import type { Pin, ButtonState } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Power, Clock, Zap, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"

interface OperatorPinCardProps {
  pin: Pin
  onStateChange?: (pinId: string, newState: ButtonState) => void
  onConfigureAuto?: (pinId: string) => void
}

export function OperatorPinCard({ pin, onStateChange, onConfigureAuto }: OperatorPinCardProps) {
  const [currentState, setCurrentState] = useState<ButtonState>(pin.state || "off")

  const [autoTimer, setAutoTimer] = useState<NodeJS.Timeout | null>(null)

  // Handle auto mode functionality
  useEffect(() => {
    // Clear any existing timers when state changes or component unmounts
    if (autoTimer) {
      clearTimeout(autoTimer)
      setAutoTimer(null)
    }

    // Only proceed if in auto mode and has auto configuration
    if (currentState === "auto" && pin.autoConfig) {
      switch (pin.autoConfig.mode) {
        case "time":
          // Duration based: Turn on for specified duration, then turn off
          if (pin.autoConfig.timeDuration) {
            const { value, unit } = pin.autoConfig.timeDuration
            let durationMs = value * 1000 // Convert to milliseconds
            
            if (unit === "minutes") durationMs *= 60
            if (unit === "hours") durationMs *= 3600
            
            // Set pin to active state
            handleStateChange("on")
            
            // Set timer to turn off after duration
            const timer = setTimeout(() => {
              handleStateChange("off")
            }, durationMs)
            
            setAutoTimer(timer)
          }
          break
          
        case "limit":
          // Time window: Check if current time is within the specified window
          if (pin.autoConfig.timeLimit) {
            const { startTime, endTime } = pin.autoConfig.timeLimit
            const now = new Date()
            const currentHours = now.getHours()
            const currentMinutes = now.getMinutes()
            const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`
            
            // Check if current time is within the window
            if (currentTimeStr >= startTime && currentTimeStr <= endTime) {
              handleStateChange("on")
            } else {
              handleStateChange("off")
            }
            
            // Set timer to check again in 1 minute
            const timer = setInterval(() => {
              const now = new Date()
              const currentHours = now.getHours()
              const currentMinutes = now.getMinutes()
              const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`
              
              if (currentTimeStr >= startTime && currentTimeStr <= endTime) {
                handleStateChange("on")
              } else {
                handleStateChange("off")
              }
            }, 60000) // Check every minute
            
            setAutoTimer(timer)
          }
          break
          
        // Note: Sensor mode would require actual sensor data integration
        // This is a placeholder for future implementation
        case "sensor":
          // For demo purposes, we'll simulate sensor behavior with random values
          if (pin.autoConfig.sensorThreshold) {
            const { condition, value } = pin.autoConfig.sensorThreshold
            
            // Set timer to simulate sensor readings every 5 seconds
            const timer = setInterval(() => {
              // Generate random sensor value between 0 and 100
              const sensorReading = Math.random() * 100
              
              // Check condition and update state
              if (condition === "above" && sensorReading > value) {
                handleStateChange("on")
              } else if (condition === "below" && sensorReading < value) {
                handleStateChange("on")
              } else {
                handleStateChange("off")
              }
            }, 5000) // Check every 5 seconds
            
            setAutoTimer(timer)
          }
          break
      }
    }
    
    // Cleanup function
    return () => {
      if (autoTimer) {
        clearTimeout(autoTimer)
        clearInterval(autoTimer)
      }
    }
  }, [currentState, pin.autoConfig, autoTimer, pin.id, onStateChange])

  const handleStateChange = (newState: ButtonState) => {
    setCurrentState(newState)
    if (onStateChange) {
      onStateChange(pin.id, newState)
    }
  }

  const handleConfigureAuto = () => {
    if (onConfigureAuto) {
      onConfigureAuto(pin.id)
    }
  }

  const getStateIcon = () => {
    switch (currentState) {
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
    switch (currentState) {
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
        currentState === "on" &&
          "border-wave-seafoam/50 bg-wave-seafoam/5 shadow-glow-sm [--glow-color:hsl(var(--wave-seafoam))]",
        currentState === "auto" &&
          "border-wave-buttonAuto/50 bg-wave-buttonAuto/5 shadow-glow-sm [--glow-color:hsl(var(--wave-button-auto))]",
        currentState === "off" && "border-wave-coral/30 bg-wave-deepBlue/30",
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-wave-sand truncate">{pin.name}</span>
            <div className="flex items-center">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  currentState === "on" && "bg-wave-seafoam status-glow-active",
                  currentState === "auto" && "bg-wave-buttonAuto status-glow-auto",
                  currentState === "off" && "bg-wave-coral/50",
                )}
              />
              <span className={cn("ml-1 text-xs font-medium capitalize", getStateColor())}>
                {currentState === "on" || currentState === "auto" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Control Buttons */}
        <div className="flex space-x-1 mb-3">
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "flex-1 h-8 px-2 text-xs font-medium rounded-md",
              currentState === "on"
                ? "bg-wave-seafoam/20 border-wave-seafoam/50 text-wave-seafoam hover:bg-wave-seafoam/30 hover:text-wave-seafoam"
                : "border-wave-seafoam/20 text-wave-seafoam/50 hover:bg-wave-seafoam/10 hover:text-wave-seafoam/80",
            )}
            onClick={() => handleStateChange("on")}
          >
            ON
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "flex-1 h-8 px-2 text-xs font-medium rounded-md",
              currentState === "auto"
                ? "bg-wave-buttonAuto/20 border-wave-buttonAuto/50 text-wave-buttonAuto hover:bg-wave-buttonAuto/30 hover:text-wave-buttonAuto"
                : "border-wave-buttonAuto/20 text-wave-buttonAuto/50 hover:bg-wave-buttonAuto/10 hover:text-wave-buttonAuto/80",
            )}
            onClick={() => handleStateChange("auto")}
          >
            AUTO
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "flex-1 h-8 px-2 text-xs font-medium rounded-md",
              currentState === "off"
                ? "bg-wave-coral/20 border-wave-coral/50 text-wave-coral hover:bg-wave-coral/30 hover:text-wave-coral"
                : "border-wave-coral/20 text-wave-coral/50 hover:bg-wave-coral/10 hover:text-wave-coral/80",
            )}
            onClick={() => handleStateChange("off")}
          >
            OFF
          </Button>
        </div>

        {/* Auto Config Summary */}
        {currentState === "auto" && (
          <div className="text-xs text-wave-sand/70 bg-wave-deepBlue/50 p-2 rounded border border-wave-lightBlue/20 flex justify-between items-center">
            <div>
              <span className="font-medium">Auto Config:</span> {getAutoConfigSummary()}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-wave-sand/60 hover:text-wave-sand hover:bg-wave-lightBlue/10"
              onClick={handleConfigureAuto}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}