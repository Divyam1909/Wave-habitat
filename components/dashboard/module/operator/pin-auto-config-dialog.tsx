"use client"

import { useState, useEffect } from "react"
import type { Pin, ButtonConfig } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Timer, Gauge, Save } from "lucide-react"

interface PinAutoConfigDialogProps {
  pin: Pin
  isOpen: boolean
  onClose: () => void
  onSave: (pinId: string, config: ButtonConfig) => void
}

export function PinAutoConfigDialog({ pin, isOpen, onClose, onSave }: PinAutoConfigDialogProps) {
  const [mode, setMode] = useState<ButtonConfig["mode"]>("time")
  const [timeValue, setTimeValue] = useState(1)
  const [timeUnit, setTimeUnit] = useState<"hours" | "minutes" | "seconds">("hours")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [sensorId, setSensorId] = useState("")
  const [sensorCondition, setSensorCondition] = useState<"above" | "below">("above")
  const [sensorValue, setSensorValue] = useState(0)

  useEffect(() => {
    if (pin.autoConfig) {
      setMode(pin.autoConfig.mode)
      if (pin.autoConfig.timeDuration) {
        setTimeValue(pin.autoConfig.timeDuration.value)
        setTimeUnit(pin.autoConfig.timeDuration.unit)
      }
      if (pin.autoConfig.timeLimit) {
        setStartTime(pin.autoConfig.timeLimit.startTime)
        setEndTime(pin.autoConfig.timeLimit.endTime)
      }
      if (pin.autoConfig.sensorThreshold) {
        setSensorId(pin.autoConfig.sensorThreshold.sensorId)
        setSensorCondition(pin.autoConfig.sensorThreshold.condition)
        setSensorValue(pin.autoConfig.sensorThreshold.value)
      }
    }
  }, [pin.autoConfig])

  const handleSave = () => {
    const config: ButtonConfig = { mode }

    switch (mode) {
      case "time":
        config.timeDuration = { value: timeValue, unit: timeUnit }
        break
      case "limit":
        config.timeLimit = { startTime, endTime }
        break
      case "sensor":
        config.sensorThreshold = { sensorId, condition: sensorCondition, value: sensorValue }
        break
    }

    onSave(pin.id, config)
  }

  const isValid = () => {
    switch (mode) {
      case "time":
        return timeValue > 0
      case "limit":
        return startTime && endTime && startTime !== endTime
      case "sensor":
        return sensorId.trim() !== "" && sensorValue >= 0
      default:
        return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand max-w-md">
        <DialogHeader>
          <DialogTitle className="text-wave-lightBlue flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configure Auto Mode: {pin.name}
          </DialogTitle>
          <DialogDescription className="text-wave-sand/80">
            Set up automatic control parameters for this pin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mode Selection */}
          <div>
            <Label className="text-wave-sand/90 mb-2 block">Auto Mode Type</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as ButtonConfig["mode"])}>
              <SelectTrigger className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
                <SelectItem value="time" className="flex items-center">
                  <Timer className="mr-2 h-4 w-4" />
                  Duration Based
                </SelectItem>
                <SelectItem value="limit" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Time Window
                </SelectItem>
                <SelectItem value="sensor" className="flex items-center">
                  <Gauge className="mr-2 h-4 w-4" />
                  Sensor Based
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Duration Mode */}
          {mode === "time" && (
            <div className="space-y-3">
              <Label className="text-wave-sand/90">Run Duration</Label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min="1"
                  value={timeValue}
                  onChange={(e) => setTimeValue(Number(e.target.value))}
                  className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
                />
                <Select value={timeUnit} onValueChange={(value) => setTimeUnit(value as typeof timeUnit)}>
                  <SelectTrigger className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-wave-sand/60">Pin will turn on for the specified duration, then turn off.</p>
            </div>
          )}

          {/* Time Limit Mode */}
          {mode === "limit" && (
            <div className="space-y-3">
              <Label className="text-wave-sand/90">Active Time Window</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-wave-sand/70">Start Time</Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
                  />
                </div>
                <div>
                  <Label className="text-xs text-wave-sand/70">End Time</Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
                  />
                </div>
              </div>
              <p className="text-xs text-wave-sand/60">Pin will be active only during the specified time window.</p>
            </div>
          )}

          {/* Sensor Mode */}
          {mode === "sensor" && (
            <div className="space-y-3">
              <div>
                <Label className="text-wave-sand/90">Sensor ID</Label>
                <Input
                  value={sensorId}
                  onChange={(e) => setSensorId(e.target.value)}
                  placeholder="e.g., temp-sensor-1"
                  className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-wave-sand/90">Condition</Label>
                  <Select
                    value={sensorCondition}
                    onValueChange={(value) => setSensorCondition(value as typeof sensorCondition)}
                  >
                    <SelectTrigger className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-wave-sand/90">Threshold</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={sensorValue}
                    onChange={(e) => setSensorValue(Number(e.target.value))}
                    className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
                  />
                </div>
              </div>
              <p className="text-xs text-wave-sand/60">Pin will activate when sensor reading meets the condition.</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-wave-coral text-wave-coral hover:bg-wave-coral/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid()}
            className="bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
