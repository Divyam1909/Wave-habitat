// Full Code for: components/auth/login-form.tsx

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

const verificationSchema = z.object({
  token: z.string().length(6, { message: "Token must be 6 digits." }),
})

// Add the new prop to the function signature
export function LoginForm({ onShowRegister }: { onShowRegister: () => void }) {
  const { login, verifyToken } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [userEmailForVerification, setUserEmailForVerification] = useState("")

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { token: "" },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    try {
      await login(values.email, values.password)
      setUserEmailForVerification(values.email)
      setShowVerification(true)
      toast({
        title: "Verification Required",
        description: "A verification code has been sent to your email (simulated: 123456).",
        className: "bg-wave-seafoam text-wave-deepBlue",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
        className: "bg-wave-coral text-white",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onVerify(values: z.infer<typeof verificationSchema>) {
    setIsLoading(true)
    try {
      await verifyToken(userEmailForVerification, values.token)
      toast({
        title: "Login Successful!",
        description: "Redirecting to dashboard...",
        className: "bg-wave-seafoam text-wave-deepBlue",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Invalid token.",
        className: "bg-wave-coral text-white",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <Button
            type="submit"
            className="w-full bg-wave-lightBlue hover:bg-wave-lightBlue/90 text-wave-deepBlue font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
          </Button>
        </form>
      </Form>
      
      {/* --- THIS IS THE MODIFIED PART --- */}
      <p className="mt-6 text-center text-sm text-wave-sand/80">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onShowRegister}
          className="font-medium text-wave-lightBlue hover:underline focus:outline-none"
        >
          Register here
        </button>
      </p>

      <Dialog
        open={showVerification}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowVerification(false)
            verificationForm.reset()
          }
        }}
      >
        <DialogContent className="bg-wave-midBlue border-wave-lightBlue text-wave-sand">
          <DialogHeader>
            <DialogTitle className="text-2xl text-wave-lightBlue">Enter Verification Code</DialogTitle>
            <DialogDescription className="text-wave-sand/80">
              A 6-digit code was (simulated) sent to {userEmailForVerification}.
            </DialogDescription>
          </DialogHeader>
          <Form {...verificationForm}>
            <form onSubmit={verificationForm.handleSubmit(onVerify)} className="space-y-4 pt-4">
              <FormField
                control={verificationForm.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-wave-sand/90 sr-only">Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        {...field}
                        className="bg-wave-deepBlue/50 border-wave-lightBlue/50 text-wave-sand text-center text-2xl tracking-[0.3em]"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage className="text-wave-coral/90" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Login"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}