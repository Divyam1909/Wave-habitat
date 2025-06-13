"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// --- TYPE DEFINITIONS ---
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  username?: string;
}

// This interface now perfectly matches the data returned by the PHP API
interface Module {
  module_id: string;
  name: string;
  description: string | null;
  alloted_pins: number;
  used_pins: number;
  pins_left: number;
  module_status: number; // 0 or 1
  role: 'owner' | 'operator' | 'programmer' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  modules: Module[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addModule: (moduleId: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const fetchUserModules = useCallback(async (userId: number) => {
    try {
        const response = await fetch(`/wave/api/get-modules.php?user_id=${userId}`);
        const data = await response.json();
        if (response.ok && data.success) {
            setModules(data.modules || []);
        } else {
            console.error("Failed to fetch modules:", data.error);
            setModules([]);
        }
    } catch (error) {
        console.error("Error fetching modules:", error);
        setModules([]);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const response = await fetch('/wave/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (response.ok && result.success) {
      const loggedInUser: User = result.user;
      setUser(loggedInUser);
      localStorage.setItem("waveUserSession", JSON.stringify(loggedInUser));
      await fetchUserModules(loggedInUser.id);
      toast({ title: "Login Successful!", description: `Welcome back, ${loggedInUser.name}!` });
    } else {
      throw new Error(result.error || "An unknown login error occurred.");
    }
  }, [toast, fetchUserModules]);
  
  const addModule = useCallback(async (moduleId: string, password: string): Promise<void> => {
    if (!user) throw new Error("You must be logged in to add a module.");

    const response = await fetch('/wave/api/claim-module.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_id: moduleId, password, user_id: user.id }),
    });
    const result = await response.json();

    if (response.ok && result.success) {
      setModules(result.modules);
    } else {
      throw new Error(result.error || "Failed to add module.");
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setModules([]);
    localStorage.removeItem("waveUserSession");
    toast({ title: "Logged Out" });
    router.push("/login");
  }, [router, toast]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("waveUserSession");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          await fetchUserModules(parsedUser.id);
        }
      } catch (e) {
        localStorage.removeItem("waveUserSession");
      }
      setIsLoading(false);
    };
    checkSession();
  }, [fetchUserModules]);

  useEffect(() => {
    if (isLoading) return;
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    if (!user && !isAuthPage) router.push("/login");
    if (user && isAuthPage) router.push("/dashboard");
  }, [user, isLoading, pathname, router]);

  const value = { user, isLoading, modules, login, logout, addModule };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}