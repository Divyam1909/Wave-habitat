"use client"
import { useState, useEffect } from "react"
import type { Module, Pin } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Edit3, Save, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast" // Import useToast

// This is a placeholder. In a real app, this data would come from your backend or context.
const MOCK_MODULES_SEED_DB: { id: string; maxPins: number }[] = [
  { id: "WHM-AQUA001", maxPins: 20 },
  { id: "WHM-FRAG002", maxPins: 12 },
  { id: "WHM-LAB003", maxPins: 120 },
]

interface OwnerPinsSectionProps {
  module: Module
}

interface EditablePin extends Pin {
  isEditing?: boolean
  tempName?: string
  tempAssignedGroupId?: string
}

export function OwnerPinsSection({ module: initialModule }: OwnerPinsSectionProps) {
  const { updateModulePinCount, updateModulePinDetails, getModuleById } = useAuth()
  const { toast } = useToast() // Declare useToast
  const [module, setModule] = useState<Module>(initialModule)
  const [pinCountInput, setPinCountInput] = useState<number>(initialModule.pinCount || 0)
  const [editablePins, setEditablePins] = useState<EditablePin[]>(
    initialModule.pins.map((p) => ({
      ...p,
      isEditing: false,
      tempName: p.name,
      tempAssignedGroupId: p.assignedGroupId,
    })),
  )
  const [isSavingPinCount, setIsSavingPinCount] = useState(false)

  useEffect(() => {
    const latestModuleData = getModuleById(initialModule.id)
    if (latestModuleData) {
      setModule(latestModuleData)
      setPinCountInput(latestModuleData.pinCount || 0)
      setEditablePins(
        latestModuleData.pins.map((p) => ({
          ...p,
          isEditing: false,
          tempName: p.name,
          tempAssignedGroupId: p.assignedGroupId,
        })),
      )
    }
  }, [initialModule, getModuleById])

  const maxPinsForModule = MOCK_MODULES_SEED_DB.find((seed) => seed.id === module.id)?.maxPins || 120

  const handlePinCountChange = async () => {
    if (pinCountInput < 0 || pinCountInput > maxPinsForModule) {
      toast({
        variant: "destructive",
        title: "Invalid Pin Count",
        description: `Pin count must be between 0 and ${maxPinsForModule}.`,
      })
      return
    }
    setIsSavingPinCount(true)
    const success = await updateModulePinCount(module.id, pinCountInput)
    if (success) {
      toast({ title: "Pin Count Updated", description: `Module now configured for ${pinCountInput} pins.` })
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update pin count." })
    }
    setIsSavingPinCount(false)
  }

  const toggleEditPin = (pinId: string) => {
    setEditablePins((pins) =>
      pins.map((p) =>
        p.id === pinId
          ? { ...p, isEditing: !p.isEditing, tempName: p.name, tempAssignedGroupId: p.assignedGroupId }
          : { ...p, isEditing: false },
      ),
    )
  }

  const handlePinDetailChange = (pinId: string, field: "tempName" | "tempAssignedGroupId", value: string) => {
    setEditablePins((pins) => pins.map((p) => (p.id === pinId ? { ...p, [field]: value } : p)))
  }

  const savePinDetails = async (pin: EditablePin) => {
    if (!pin.tempName?.trim()) {
      toast({ variant: "destructive", title: "Invalid Name", description: "Pin name cannot be empty." })
      return
    }
    const success = await updateModulePinDetails(module.id, pin.id, {
      name: pin.tempName,
      assignedGroupId: pin.tempAssignedGroupId === "none" ? undefined : pin.tempAssignedGroupId,
    })
    if (success) {
      toast({ title: "Pin Updated", description: `Details for ${pin.tempName} saved.` })
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save pin details." })
    }
  }

  return (
    <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
      <CardHeader>
        <CardTitle className="text-wave-lightBlue">Configure Pins</CardTitle>
        <CardDescription className="text-wave-sand/80">
          Specify the number of pins to activate for this module (max {maxPinsForModule}). Each pin can be labeled and
          assigned to a group.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-3 p-4 border border-wave-lightBlue/30 rounded-lg bg-wave-deepBlue/30">
          <div className="flex-grow">
            <Label htmlFor="pinCount" className="text-wave-sand/90">
              Number of Pins
            </Label>
            <Input
              id="pinCount"
              type="number"
              min="0"
              max={maxPinsForModule}
              value={pinCountInput}
              onChange={(e) => setPinCountInput(Number.parseInt(e.target.value, 10))}
              className="mt-1 bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
            />
          </div>
          <Button
            onClick={handlePinCountChange}
            disabled={isSavingPinCount || pinCountInput === module.pinCount}
            className="bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
          >
            {isSavingPinCount ? "Saving..." : "Set Pin Count"}
          </Button>
        </div>

        {editablePins.length === 0 && module.pinCount > 0 && (
          <div className="text-center py-8 text-wave-sand/70">
            <AlertTriangle className="mx-auto h-10 w-10 mb-2" />
            <p>No pins currently configured. Set the pin count and save to start adding details.</p>
          </div>
        )}

        {editablePins.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-wave-sand">Pin Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {editablePins.map((pin) => (
                <Card
                  key={pin.id}
                  className={`border-wave-lightBlue/30 ${pin.isEditing ? "bg-wave-deepBlue/50 ring-2 ring-wave-seafoam" : "bg-wave-deepBlue/30"}`}
                >
                  <CardHeader className="pb-2">
                    {pin.isEditing ? (
                      <Input
                        value={pin.tempName}
                        onChange={(e) => handlePinDetailChange(pin.id, "tempName", e.target.value)}
                        className="text-lg font-semibold bg-wave-midBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
                      />
                    ) : (
                      <CardTitle className="text-wave-sand text-lg">{pin.name}</CardTitle>
                    )}
                    <CardDescription className="text-xs text-wave-sand/60">ID: {pin.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2 pb-4">
                    {pin.isEditing ? (
                      <div>
                        <Label className="text-xs text-wave-sand/70">Assign to Group</Label>
                        <Select
                          value={pin.tempAssignedGroupId || "none"}
                          onValueChange={(value) => handlePinDetailChange(pin.id, "tempAssignedGroupId", value)}
                        >
                          <SelectTrigger className="bg-wave-midBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue">
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                          <SelectContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
                            <SelectItem value="none" className="text-wave-sand/70">
                              Unassigned
                            </SelectItem>
                            {module.groups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <p className="text-sm text-wave-sand/80">
                        Group:{" "}
                        {module.groups.find((g) => g.id === pin.assignedGroupId)?.name || (
                          <span className="italic text-wave-sand/60">Unassigned</span>
                        )}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t border-wave-lightBlue/20 pt-3">
                    {pin.isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEditPin(pin.id)}
                          className="text-wave-sand/70 hover:text-wave-sand"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => savePinDetails(pin)}
                          className="bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
                        >
                          <Save className="mr-1 h-4 w-4" /> Save
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEditPin(pin.id)}
                        className="border-wave-lightBlue text-wave-lightBlue hover:bg-wave-lightBlue/10"
                      >
                        <Edit3 className="mr-1 h-4 w-4" /> Edit
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
