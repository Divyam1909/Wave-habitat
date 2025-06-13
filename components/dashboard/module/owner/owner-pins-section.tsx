// Full Code for: components/dashboard/module/owner/owner-pins-section.tsx (Final, Real Backend)

"use client";
import { useState, useEffect } from "react";
import type { Module, Pin } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface OwnerPinsSectionProps {
  module: Module;
}

export function OwnerPinsSection({ module }: OwnerPinsSectionProps) {
  const { updateModulePinCount } = useAuth(); // Get the REAL function from the context
  const { toast } = useToast();
  // State for the input field, initialized from the module prop
  const [pinCountInput, setPinCountInput] = useState<number>(module.alloted_pins ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  
  // This effect ensures the form updates if the module data changes from above
  useEffect(() => {
    setPinCountInput(module.alloted_pins ?? 0);
  }, [module.alloted_pins]);

  // For now, we assume a hardcoded max, but this could come from the module data
  const maxPinsForModule = 120;

  const handlePinCountChange = async () => {
    if (pinCountInput < 0 || pinCountInput > maxPinsForModule) {
      toast({
        variant: "destructive",
        title: "Invalid Pin Count",
        description: `Pin count must be between 0 and ${maxPinsForModule}.`,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Call the real function from our context
      await updateModulePinCount(module.module_id, pinCountInput);
      toast({
        title: "Success!",
        description: `Pin count has been updated to ${pinCountInput}.`,
        className: "bg-green-600 text-white"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update pin count.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-slate-800/70 border-slate-700">
      <CardHeader>
        <CardTitle>Configure Pins</CardTitle>
        <CardDescription>
          Specify the number of pins to activate for this module (max {maxPinsForModule}).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-3 p-4 border border-slate-700 rounded-lg bg-slate-900/50">
          <div className="flex-grow">
            <Label htmlFor="pinCount" className="text-gray-300">Number of Allotted Pins</Label>
            <Input
              id="pinCount"
              type="number"
              min="0"
              max={maxPinsForModule}
              value={pinCountInput}
              onChange={(e) => setPinCountInput(Number(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handlePinCountChange}
            disabled={isSaving || pinCountInput === module.alloted_pins}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set Pin Count"}
          </Button>
        </div>

        {/* This section will display the list of pins to edit. We will build this next. */}
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="mx-auto h-10 w-10 mb-2" />
          <p>Editing individual pin details will be implemented next.</p>
        </div>
      </CardContent>
    </Card>
  );
}