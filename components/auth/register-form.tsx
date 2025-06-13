// Full Code for: components/auth/register-form.tsx (Corrected)

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context"; // <-- 1. IMPORT THE AUTH HOOK

const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(10, { message: "Please enter a valid phone number." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    terms: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions.",
    }),
});

export function RegisterForm() {
  const { toast } = useToast();
  const { register } = useAuth(); // <-- 2. GET THE REGISTER FUNCTION FROM THE CONTEXT
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", terms: false },
  });

  // --- 3. THIS IS THE NEW, CORRECT onSubmit FUNCTION ---
  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      // Call the register function from the context. It handles the API call.
      const result = await register(values); 
      
      // Show the success pop-up from the API's response
      toast({
        title: "Registration Submitted!",
        description: result.message,
        className: "bg-blue-600 text-white border-blue-600",
      });
      form.reset(); // Clear the form on success
    } catch (error: any) {
      // Catch any errors thrown by the context function and show a failure pop-up
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-8 md:p-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        Explore with us!
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 font-medium">Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} className="bg-white/10 border-0 text-white placeholder:text-gray-400 focus:bg-white/20 focus:ring-1 focus:ring-cyan-400 transition" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 font-medium">Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} className="bg-white/10 border-0 text-white placeholder:text-gray-400 focus:bg-white/20 focus:ring-1 focus:ring-cyan-400 transition" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 font-medium">Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(123) 456-7890" {...field} className="bg-white/10 border-0 text-white placeholder:text-gray-400 focus:bg-white/20 focus:ring-1 focus:ring-cyan-400 transition" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 font-medium">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="bg-white/10 border-0 text-white placeholder:text-gray-400 focus:bg-white/20 focus:ring-1 focus:ring-cyan-400 transition" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="terms" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 border-gray-400 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-gray-400">
                  I agree to the <Link href="#" className="font-semibold text-cyan-400 hover:underline">Terms and Conditions</Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
           )} />
          <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-base py-6 transition transform hover:-translate-y-1" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}