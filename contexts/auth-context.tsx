"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import type { User, Module } from "@/lib/types";

// --- TYPE DEFINITIONS ---
//interface User {
 // id: number;
 // name: string;
  //email: string;
 // phone?: string;
 // username?: string;
//}

// This interface now perfectly matches the data returned by the PHP API
//interface Module {
  //module_id: string;
  //name: string;
  //description: string | null;
  //alloted_pins: number;
  //used_pins: number;
  //pins_left: number;
  //module_status: number; // 0 or 1
  //role: 'owner' | 'operator' | 'programmer' | 'viewer';
//}

interface ModuleGroup {
  id: string;
  name: string;
}

interface Pin {
  id: string;
  name: string;
  assignedGroupId?: string;
  state?: 'on' | 'off' | 'auto';
  autoConfig?: any;
}

interface AssignedUser {
  userId: string;
  username: string;
  role: 'owner' | 'operator' | 'programmer' | 'viewer';
}

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
  // Module management functions
  addModuleGroup: (moduleId: string, groupName: string) => Promise<any>;
  updateModuleGroup: (moduleId: string, groupId: string, newName: string) => Promise<boolean>;
  deleteModuleGroup: (moduleId: string, groupId: string) => Promise<boolean>;
  updateModulePinCount: (moduleId: string, pinCount: number) => Promise<boolean>;
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

    if (response.ok && result.success) {
      return result;
    } else {
      throw new Error(result.error || "Registration failed.");
    }
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

  // Mock implementations for module management (replace with actual API calls)
  const addModuleGroup = useCallback(async (moduleId: string, groupName: string) => {
    // Mock implementation - replace with actual API call
    const newGroup = { id: `group-${Date.now()}`, name: groupName };
    return newGroup;
  }, []);

  const updateModuleGroup = useCallback(async (moduleId: string, groupId: string, newName: string): Promise<boolean> => {
    // Mock implementation - replace with actual API call
    return true;
  }, []);

  const deleteModuleGroup = useCallback(async (moduleId: string, groupId: string): Promise<boolean> => {
    // Mock implementation - replace with actual API call
    return true;
  }, []);

  const updateModulePinCount = useCallback(async (moduleId: string, pinCount: number): Promise<boolean> => {
    // Mock implementation - replace with actual API call
    return true;
  }, []);

  const updateModulePinDetails = useCallback(async (moduleId: string, pinId: string, details: any): Promise<boolean> => {
    // Mock implementation - replace with actual API call
    return true;
  }, []);

  const assignUserToModule = useCallback(async (moduleId: string, userEmail: string, role: string) => {
    // Mock implementation - replace with actual API call
    const newAssignment = { userId: `user-${Date.now()}`, username: userEmail, role };
    return newAssignment;
  }, []);

  const removeUserFromModule = useCallback(async (moduleId: string, userId: string): Promise<boolean> => {
    // Mock implementation - replace with actual API call
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

  const value = { 
    user, 
    isLoading, 
    modules, 
    login, 
    logout, 
    addModule, 
    register,
    updateUserProfile,
    getModuleById,
    addModuleGroup,
    updateModuleGroup,
    deleteModuleGroup,
    updateModulePinCount,
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