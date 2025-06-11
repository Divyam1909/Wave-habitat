// In app/login/page.tsx (Corrected)

import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <Card className="w-full max-w-md bg-card/80 dark:bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Sign in to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </>
  );
}