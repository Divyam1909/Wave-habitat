"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
})

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
      })
    }
  }, [user, form])

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true)
    try {
      await updateUserProfile(values)
      toast({
        title: "Profile Updated",
        description: "Your details have been successfully saved.",
        className: "bg-wave-seafoam text-wave-deepBlue",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not save your profile.",
        className: "bg-wave-coral text-white",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-wave-lightBlue">Profile</h1>
        <p className="text-wave-sand/80">View and edit your personal details.</p>
      </div>
      <Card className="bg-wave-midBlue border-wave-lightBlue/30 shadow-lg">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
                      />
                    </FormControl>
                    <FormMessage className="text-wave-coral/90" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        className="bg-wave-deepBlue/80 border-wave-lightBlue/30 text-wave-sand/70"
                      />
                    </FormControl>
                    <FormMessage className="text-wave-coral/90" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
                      />
                    </FormControl>
                    <FormMessage className="text-wave-coral/90" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
