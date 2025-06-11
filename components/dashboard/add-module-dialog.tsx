"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import type { Module } from "@/lib/types"

interface AddModuleDialogProps {
  isOpen: boolean
  onClose: () => void
  onModuleAdded: (module: Module) => void
}

export function AddModuleDialog({ isOpen, onClose, onModuleAdded }: AddModuleDialogProps) {
  const [moduleId, setModuleId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { addModule } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!moduleId.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Module ID cannot be empty.",
        className: "bg-wave-coral text-white",
      })
      return
    }
    setIsLoading(true)
    try {
      const newModule = await addModule(moduleId)
      if (newModule) {
        onModuleAdded(newModule)
        toast({
          title: "Module Added!",
          description: `Module ${newModule.name} has been successfully added.`,
          className: "bg-wave-seafoam text-wave-deepBlue",
        })
        onClose()
        setModuleId("")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Add Module",
        description: error.message || "Could not find or add the module.",
        className: "bg-wave-coral text-white",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
        <DialogHeader>
          <DialogTitle className="text-2xl text-wave-lightBlue">Add New Module</DialogTitle>
          <DialogDescription className="text-wave-sand/80">
            Enter the ID of the Wave Habitat module you want to add.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="moduleId" className="text-wave-sand/90">
              Module ID
            </Label>
            <Input
              id="moduleId"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              placeholder="Enter module ID (e.g., WHM-123XYZ)"
              className="mt-1 bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-wave-coral text-wave-coral hover:bg-wave-coral/10 hover:text-wave-coral"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Module"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
