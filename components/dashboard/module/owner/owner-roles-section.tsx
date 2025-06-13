"use client"
import { useState, useEffect } from "react"
import type { Module, AssignedUser } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserPlus, Trash2, Edit3, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface OwnerRolesSectionProps {
  module: Module
}

export function OwnerRolesSection({ module: initialModule }: OwnerRolesSectionProps) {
  const { assignUserToModule, removeUserFromModule, getModuleById, user: currentUser } = useAuth()
  const { toast } = useToast()

  const [module, setModule] = useState<Module>(initialModule)
  const [targetUserEmail, setTargetUserEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState<AssignedUser["role"]>("viewer")
  const [isAssigning, setIsAssigning] = useState(false)

  // For editing an existing user's role
  const [editingUser, setEditingUser] = useState<AssignedUser | null>(null)
  const [editingRole, setEditingRole] = useState<AssignedUser["role"]>("viewer")

  useEffect(() => {
    const latestModuleData = getModuleById(initialModule.id)
    if (latestModuleData) {
      setModule(latestModuleData)
    }
  }, [initialModule, getModuleById])

  const handleAssignRole = async () => {
    if (!targetUserEmail.trim()) {
      toast({ variant: "destructive", title: "Invalid Email", description: "User email cannot be empty." })
      return
    }
    if (targetUserEmail.toLowerCase() === currentUser?.email.toLowerCase()) {
      toast({
        variant: "destructive",
        title: "Cannot Assign Self",
        description: "You cannot assign a role to yourself.",
      })
      return
    }
    setIsAssigning(true)
    try {
      const newAssignment = await assignUserToModule(module.id, targetUserEmail, selectedRole)
      if (newAssignment) {
        toast({ title: "Role Assigned", description: `${newAssignment.username} is now a ${newAssignment.role}.` })
        setTargetUserEmail("")
        setSelectedRole("viewer")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Assignment Failed",
        description: error.message || "Could not assign role.",
      })
    }
    setIsAssigning(false)
  }

  const handleEditRole = (userToEdit: AssignedUser) => {
    setEditingUser(userToEdit)
    setEditingRole(userToEdit.role)
  }

  const handleSaveEditedRole = async () => {
    if (!editingUser) return
    setIsAssigning(true) // Reuse loading state
    try {
      await assignUserToModule(module.id, editingUser.username, editingRole) // Assuming username is email or unique identifier for lookup
      toast({ title: "Role Updated", description: `${editingUser.username}'s role updated to ${editingRole}.` })
      setEditingUser(null)
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message || "Could not update role." })
    }
    setIsAssigning(false)
  }

  const handleRemoveRole = async (userIdToRemove: string) => {
    const success = await removeUserFromModule(module.id, userIdToRemove)
    if (success) {
      toast({ title: "User Removed", description: "User's access has been revoked." })
    } else {
      toast({ variant: "destructive", title: "Removal Failed", description: "Could not remove user." })
    }
  }

  return (
    <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
      <CardHeader>
        <CardTitle className="text-wave-lightBlue">Assign User Roles</CardTitle>
        <CardDescription className="text-wave-sand/80">
          Grant other users access to this module with specific roles (Operator, Programmer, Viewer).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Assign New Role Form */}
        <div className="p-4 border border-wave-lightBlue/30 rounded-lg bg-wave-deepBlue/30 space-y-4">
          <h3 className="text-lg font-medium text-wave-sand">Add New User Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <Label htmlFor="userEmail" className="text-wave-sand/90">
                User's Email
              </Label>
              <Input
                id="userEmail"
                type="email"
                value={targetUserEmail}
                onChange={(e) => setTargetUserEmail(e.target.value)}
                placeholder="user@example.com"
                className="mt-1 bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
              />
            </div>
            <div>
              <Label htmlFor="userRole" className="text-wave-sand/90">
                Role
              </Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AssignedUser["role"])}>
                <SelectTrigger className="mt-1 bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="programmer">Programmer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleAssignRole}
            disabled={isAssigning || !targetUserEmail.trim()}
            className="bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue w-full md:w-auto"
          >
            <UserPlus className="mr-2 h-4 w-4" /> {isAssigning ? "Assigning..." : "Assign Role"}
          </Button>
        </div>

        {/* List of Assigned Users */}
        <div>
          <h3 className="text-lg font-medium text-wave-sand mb-3">Current User Roles</h3>
          {module.assignedUsers.length === 0 ? (
            <p className="text-sm text-wave-sand/70 italic">No users have been assigned roles for this module yet.</p>
          ) : (
            <div className="space-y-3">
              {module.assignedUsers.map((assigned) => (
                <Card key={assigned.userId} className="bg-wave-deepBlue/40 border-wave-lightBlue/20 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-wave-sand">{assigned.username}</p>
                      {editingUser?.userId === assigned.userId ? (
                        <Select
                          value={editingRole}
                          onValueChange={(value) => setEditingRole(value as AssignedUser["role"])}
                        >
                          <SelectTrigger className="mt-1 h-8 text-xs bg-wave-midBlue/60 border-wave-lightBlue/40 text-wave-sand focus:ring-wave-lightBlue">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
                            <SelectItem value="operator">Operator</SelectItem>
                            <SelectItem value="programmer">Programmer</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-xs text-wave-sand/70 capitalize bg-wave-lightBlue/10 px-2 py-0.5 rounded-full inline-block">
                          {assigned.role}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {editingUser?.userId === assigned.userId ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingUser(null)}
                            className="text-wave-sand/70 hover:text-wave-sand"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveEditedRole}
                            disabled={isAssigning}
                            className="bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
                          >
                            <Save className="mr-1 h-3 w-3" /> Save
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-wave-lightBlue/70 hover:text-wave-lightBlue"
                          onClick={() => handleEditRole(assigned)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-wave-coral/70 hover:text-wave-coral"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-wave-coral">Remove {assigned.username}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will revoke their {assigned.role} access to this module. Are you sure?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-wave-sand/50 text-wave-sand hover:bg-wave-sand/10">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveRole(assigned.userId)}
                              className="bg-wave-coral hover:bg-wave-coral/90 text-white"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
