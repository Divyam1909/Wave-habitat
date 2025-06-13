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
import { useAuth } from "@/contexts/auth-context";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export function LoginForm() {
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      // The login function from the context now handles everything.
      await login(values.email, values.password);
      // Success is handled inside the context (toast and redirect)
    } catch (error: any) {
      // Any error thrown from the login function is caught here.
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // The JSX for your form remains the same as before.
  return (
    <div className="w-full max-w-md bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-8 md:p-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        Welcome Back!
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 font-medium">Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} className="bg-white/10 border-0 text-white placeholder:text-gray-400 focus:bg-white/20 focus:ring-1 focus:ring-cyan-400 transition" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 font-medium">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} className="bg-white/10 border-0 text-white placeholder:text-gray-400 focus:bg-white/20 focus:ring-1 focus:ring-cyan-400 transition" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-base py-6 transition transform hover:-translate-y-1" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}