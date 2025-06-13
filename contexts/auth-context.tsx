"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import type { User, Module } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  modules: Module[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addModule: (moduleId: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<any>;
  updateUserProfile: (userData: any) => Promise<void>;
  getModuleById: (moduleId: string) => Module | undefined;
  updateModulePinCount: (moduleId: string, pinCount: number) => Promise<void>;
  addModuleGroup: (moduleId: string, groupName: string) => Promise<any>;
  updateModuleGroup: (moduleId: string, groupId: string, newName: string) => Promise<boolean>;
  deleteModuleGroup: (moduleId: string, groupId: string) => Promise<boolean>;
  updateModulePinDetails: (moduleId: string, pinId: string, details: any) => Promise<boolean>;
  assignUserToModule: (moduleId: string, userEmail: string, role: string) => Promise<any>;
  removeUserFromModule: (moduleId: string, userId: string) => Promise<boolean>;
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
      await fetchUserModules(Number(loggedInUser.id));
      toast({ title: "Login Successful!", description: `Welcome back, ${loggedInUser.name}!` });
      router.push("/dashboard");
    } else {
      throw new Error(result.error || "An unknown login error occurred.");
    }
  }, [toast, fetchUserModules, router]);

  const register = useCallback(async (userData: any): Promise<any> => {
    const response = await fetch('/wave/api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Registration failed.");
    }
    return result;
  }, []);

  const updateUserProfile = useCallback(async (userData: any): Promise<void> => {
    if (!user) throw new Error("You must be logged in to update profile.");

    const response = await fetch('/wave/api/update-profile.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, id: user.id }),
    });
    const result = await response.json();

    if (response.ok && result.success) {
      setUser(result.user);
      localStorage.setItem("waveUserSession", JSON.stringify(result.user));
    } else {
      throw new Error(result.error || "Profile update failed.");
    }
  }, [user]);

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

  const getModuleById = useCallback((moduleId: string): Module | undefined => {
    return modules.find(m => m.module_id === moduleId);
  }, [modules]);

  const updateModulePinCount = useCallback(async (moduleId: string, pinCount: number): Promise<void> => {
    if (!user) throw new Error("User not authenticated.");

    const response = await fetch('/wave/api/update-pin-count.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_id: moduleId, pin_count: pinCount, user_id: user.id }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to update pin count.");
    }

    setModules(prevModules =>
      prevModules.map(m =>
        m.module_id === moduleId ? { ...m, alloted_pins: pinCount } : m
      )
    );
  }, [user]);

  // Placeholder/mock APIs
  const addModuleGroup = useCallback(async (moduleId: string, groupName: string) => {
    return { id: `group-${Date.now()}`, name: groupName };
  }, []);

  const updateModuleGroup = useCallback(async (moduleId: string, groupId: string, newName: string): Promise<boolean> => {
    return true;
  }, []);

  const deleteModuleGroup = useCallback(async (moduleId: string, groupId: string): Promise<boolean> => {
    return true;
  }, []);

  const updateModulePinDetails = useCallback(async (moduleId: string, pinId: string, details: any): Promise<boolean> => {
    return true;
  }, []);

  const assignUserToModule = useCallback(async (moduleId: string, userEmail: string, role: string) => {
    return { userId: `user-${Date.now()}`, username: userEmail, role };
  }, []);

  const removeUserFromModule = useCallback(async (moduleId: string, userId: string): Promise<boolean> => {
    return true;
  }, []);

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
      } catch {
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

  const value: AuthContextType = {
    user,
    isLoading,
    modules,
    login,
    logout,
    addModule,
    register,
    updateUserProfile,
    getModuleById,
    updateModulePinCount,
    addModuleGroup,
    updateModuleGroup,
    deleteModuleGroup,
    updateModulePinDetails,
    assignUserToModule,
    removeUserFromModule
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
