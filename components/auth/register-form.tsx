// Full Code for: components/auth/register-form.tsx

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phoneNumber: z.string().optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Add the new prop to the function signature
export function RegisterForm({ onShowLogin }: { onShowLogin: () => void }) {
  const { register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true)
    try {
      await register({
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password_DO_NOT_USE: values.password,
      })
      toast({
        title: "Registration Successful!",
        description: "Please log in to continue.",
        className: "bg-wave-seafoam text-wave-deepBlue",
      })
      // Instead of routing, we now just switch the view
      onShowLogin();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred.",
        className: "bg-wave-coral text-white",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-wave-sand/90">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
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
                <FormLabel className="text-wave-sand/90">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-wave-sand/90">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-wave-sand/90">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand focus:ring-wave-lightBlue"
                  />
                </FormControl>
                <FormMessage className="text-wave-coral/90" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-wave-lightBlue hover:bg-wave-lightBlue/90 text-wave-deepBlue font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>
        </form>
      </Form>
      
      {/* --- THIS IS THE MODIFIED PART --- */}
      <p className="mt-6 text-center text-sm text-wave-sand/80">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onShowLogin}
          className="font-medium text-wave-lightBlue hover:underline focus:outline-none"
        >
          Login here
        </button>
      </p>
    </>
  )
}