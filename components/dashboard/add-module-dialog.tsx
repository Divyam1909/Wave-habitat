"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const addModuleSchema = z.object({
  moduleId: z.string().min(1, { message: "Module ID cannot be empty." }),
  password: z.string().min(1, { message: "Module password is required." }),
});

interface AddModuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddModuleDialog({ isOpen, onClose }: AddModuleDialogProps) {
  const { addModule } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof addModuleSchema>>({
    resolver: zodResolver(addModuleSchema),
    defaultValues: { moduleId: "", password: "" },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: z.infer<typeof addModuleSchema>) => {
    try {
      await addModule(values.moduleId, values.password);
      toast({
        title: "Module Added!",
        description: `Module ${values.moduleId} has been successfully added to your dashboard.`,
        className: "bg-green-600 text-white",
      });
      onClose();
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Add Module",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { form.reset(); onClose(); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Module</DialogTitle>
          <DialogDescription>
            Enter the Module ID and its password to claim it and add it to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="moduleId" render={({ field }) => (
              <FormItem>
                <FormLabel>Module ID</FormLabel>
                <FormControl><Input placeholder="e.g., WHM-XYZ123" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Module Password</FormLabel>
                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Module"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}