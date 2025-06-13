"use client"
import { useState, useEffect } from "react"
import type { Module, ModuleGroup, Pin } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Edit3, Save, Trash2, PlusCircle, ListFilter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OwnerGroupsSectionProps {
  module: Module
}

interface EditableGroup extends ModuleGroup {
  isEditing?: boolean
  tempName?: string
}

export function OwnerGroupsSection({ module: initialModule }: OwnerGroupsSectionProps) {
  const { addModuleGroup, updateModuleGroup, deleteModuleGroup, getModuleById } = useAuth()
  const { toast } = useToast()

  const [module, setModule] = useState<Module>(initialModule)
  const [newGroupName, setNewGroupName] = useState("")
  const [editableGroups, setEditableGroups] = useState<EditableGroup[]>(
    initialModule.groups?.map((g) => ({ ...g, isEditing: false, tempName: g.name })) || []
  )
  const [isAddingGroup, setIsAddingGroup] = useState(false)

  useEffect(() => {
    const latestModuleData = getModuleById(initialModule.module_id)
    if (latestModuleData && latestModuleData.groups) {
      setModule(latestModuleData)
      setEditableGroups(latestModuleData.groups.map((g) => ({ ...g, isEditing: false, tempName: g.name })))
    }
  }, [initialModule, getModuleById])

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast({ variant: "destructive", title: "Invalid Name", description: "Group name cannot be empty." })
      return
    }
    setIsAddingGroup(true)
    const newGroup = await addModuleGroup(module.module_id, newGroupName)
    if (newGroup) {
      toast({ title: "Group Added", description: `Group "${newGroupName}" created.` })
      setNewGroupName("")
    } else {
      // Error toast is handled in context if name exists
    }
    setIsAddingGroup(false)
  }

  const toggleEditGroup = (groupId: string) => {
    setEditableGroups((groups) =>
      groups.map((g) =>
        g.id === groupId ? { ...g, isEditing: !g.isEditing, tempName: g.name } : { ...g, isEditing: false },
      ),
    )
  }

  const handleGroupNameChange = (groupId: string, value: string) => {
    setEditableGroups((groups) => groups.map((g) => (g.id === groupId ? { ...g, tempName: value } : g)))
  }

  const saveGroupName = async (group: EditableGroup) => {
    if (!group.tempName?.trim()) {
      toast({ variant: "destructive", title: "Invalid Name", description: "Group name cannot be empty." })
      return
    }
    const success = await updateModuleGroup(module.module_id, group.id, group.tempName)
    if (success) {
      toast({ title: "Group Updated", description: `Group renamed to "${group.tempName}".` })
    } // Error toast handled in context
  }

  const handleDeleteGroup = async (groupId: string) => {
    const success = await deleteModuleGroup(module.module_id, groupId)
    if (success) {
      toast({ title: "Group Deleted", description: "Group and its pin assignments removed." })
    } else {
      toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete group." })
    }
  }

  const getPinsInGroup = (groupId?: string): Pin[] => {
    return (module.pins || []).filter((p) => p.assignedGroupId === groupId)
  }
  const unassignedPins = (module.pins || []).filter((p) => !p.assignedGroupId)

  return (
    <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
      <CardHeader>
        <CardTitle className="text-wave-lightBlue">Manage Pin Groups</CardTitle>
        <CardDescription className="text-wave-sand/80">
          Organize your pins into logical groups for easier management and role assignment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-3 p-4 border border-wave-lightBlue/30 rounded-lg bg-wave-deepBlue/30">
          <div className="flex-grow">
            <Label htmlFor="newGroupName" className="text-wave-sand/90">
              New Group Name
            </Label>
            <Input
              id="newGroupName"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g., Lighting System"
              className="mt-1 bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
            />
          </div>
          <Button
            onClick={handleAddGroup}
            disabled={isAddingGroup || !newGroupName.trim()}
            className="bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> {isAddingGroup ? "Adding..." : "Add Group"}
          </Button>
        </div>

        {editableGroups.length === 0 && unassignedPins.length === 0 && (
          <div className="text-center py-8 text-wave-sand/70">
            <ListFilter className="mx-auto h-10 w-10 mb-2" />
            <p>No groups created yet. Add a group to start organizing your pins.</p>
          </div>
        )}

        {(editableGroups.length > 0 || unassignedPins.length > 0) && (
          <Accordion type="multiple" className="w-full space-y-2">
            {(editableGroups || []).map((group) => {
              const pinsInThisGroup = getPinsInGroup(group.id)
              return (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="bg-wave-deepBlue/30 border border-wave-lightBlue/20 rounded-md px-1"
                >
                  <AccordionTrigger className="hover:no-underline px-3 py-3 text-wave-sand hover:bg-wave-lightBlue/10 rounded-t-md">
                    <div className="flex items-center justify-between w-full">
                      {group.isEditing ? (
                        <Input
                          value={group.tempName}
                          onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
                          onChange={(e) => handleGroupNameChange(group.id, e.target.value)}
                          className="text-md font-semibold bg-wave-midBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue h-8"
                        />
                      ) : (
                        <span className="font-medium text-wave-sand">{group.name}</span>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-wave-sand/60 px-2 py-0.5 bg-wave-midBlue/40 rounded-full">
                          {pinsInThisGroup.length} pins
                        </span>
                        {group.isEditing ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-wave-sand/70 hover:text-wave-sand"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleEditGroup(group.id)
                              }}
                            >
                              <span className="text-xs">Cancel</span>
                            </Button>
                            <Button
                              size="icon"
                              className="h-7 w-7 bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
                              onClick={(e) => {
                                e.stopPropagation()
                                saveGroupName(group)
                              }}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-wave-lightBlue/70 hover:text-wave-lightBlue"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleEditGroup(group.id)
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-wave-coral/70 hover:text-wave-coral"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-wave-coral">
                                Delete Group "{group.name}"?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Pins in this group will become unassigned.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-wave-sand/50 text-wave-sand hover:bg-wave-sand/10">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteGroup(group.id)}
                                className="bg-wave-coral hover:bg-wave-coral/90 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pt-2 pb-3 border-t border-wave-lightBlue/10">
                    {pinsInThisGroup.length > 0 ? (
                      <ul className="space-y-1 list-disc list-inside pl-2 text-sm text-wave-sand/80">
                        {pinsInThisGroup.map((pin) => (
                          <li key={pin.id}>{pin.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-wave-sand/60 italic">No pins assigned to this group.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
            {/* Unassigned Pins Accordion */}
            {unassignedPins.length > 0 && (
              <AccordionItem
                value="unassigned-pins"
                className="bg-wave-deepBlue/30 border border-wave-lightBlue/20 rounded-md px-1"
              >
                <AccordionTrigger className="hover:no-underline px-3 py-3 text-wave-sand hover:bg-wave-lightBlue/10 rounded-t-md">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-wave-sand/80 italic">Unassigned Pins</span>
                    <span className="text-xs text-wave-sand/60 px-2 py-0.5 bg-wave-midBlue/40 rounded-full">
                      {unassignedPins.length} pins
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pt-2 pb-3 border-t border-wave-lightBlue/10">
                  <ul className="space-y-1 list-disc list-inside pl-2 text-sm text-wave-sand/80">
                    {unassignedPins.map((pin) => (
                      <li key={pin.id}>{pin.name}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
