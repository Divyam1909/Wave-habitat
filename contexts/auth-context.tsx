"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import type {
  User,
  Module,
  Pin,
  ModuleGroup,
  AssignedUser,
  ButtonState,
  ButtonConfig,
  ModuleMetric,
  MetricDataPoint,
} from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

// --- MOCK USERS --- (Same as before)
const MOCK_USERS: User[] = [
  { id: "user-alice", name: "Alice Owner", email: "alice@example.com", phoneNumber: "123-456-7890" },
  { id: "user-bob", name: "Bob Operator", email: "bob@example.com", phoneNumber: "234-567-8901" },
  { id: "user-charlie", name: "Charlie Programmer", email: "charlie@example.com", phoneNumber: "345-678-9012" },
  { id: "user-diana", name: "Diana Viewer", email: "diana@example.com", phoneNumber: "456-789-0123" },
  { id: "user-eve", name: "Eve MultiRole", email: "eve@example.com", phoneNumber: "567-890-1234" },
]

// --- MOCK MODULES (DATABASE REPRESENTATION) ---
interface MockModuleSeedData
  extends Omit<Module, "role" | "status" | "pins" | "groups" | "assignedUsers" | "metrics" | "pinCount"> {
  maxPins: number // Max pins for this module type
  initialPinCount?: number
  initialPins?: Omit<Pin, "id" | "state" | "autoConfig">[] // Names and group assignments
  initialGroups?: Omit<ModuleGroup, "id">[]
  initialAssignedUsers?: Omit<AssignedUser, "username">[]
  metricTemplates?: {
    [key: string]: { min: number; max: number; unit: string; initial: number }
  }
}

const MOCK_MODULES_SEED_DB: MockModuleSeedData[] = [
  {
    id: "WHM-AQUA001",
    name: "Main Reef Tank",
    description: "Primary 200-gallon reef display with advanced life support.",
    maxPins: 20,
    initialPinCount: 5,
    initialPins: [
      { name: "Main Skimmer", assignedGroupId: "group-ls" },
      { name: "Return Pump", assignedGroupId: "group-ls" },
      { name: "Blue LEDs", assignedGroupId: "group-lt" },
      { name: "White LEDs", assignedGroupId: "group-lt" },
      { name: "Heater Array", assignedGroupId: "group-temp" },
    ],
    initialGroups: [
      { name: "Life Support" },
      { name: "Lighting" },
      { name: "Temperature Control" },
      { name: "Dosing Pumps" },
    ],
    initialAssignedUsers: [
      { userId: "user-bob", role: "operator" },
      { userId: "user-charlie", role: "programmer" },
      { userId: "user-diana", role: "viewer" },
    ],
    metricTemplates: {
      temperature: { min: 24, max: 27, unit: "°C", initial: 25.5 },
      salinity: { min: 33, max: 36, unit: "ppt", initial: 35 },
      pH: { min: 7.8, max: 8.4, unit: "", initial: 8.1 },
    },
  },
  {
    id: "WHM-FRAG002",
    name: "Frag Tank Alpha",
    description: "Coral fragging and grow-out system.",
    maxPins: 12,
    initialPinCount: 3,
    initialPins: [{ name: "Frag Light 1" }, { name: "Flow Pump A" }, { name: "Auto Top Off" }],
    initialAssignedUsers: [{ userId: "user-eve", role: "operator" }],
    metricTemplates: {
      par: { min: 150, max: 350, unit: "µmol/m²/s", initial: 250 },
    },
  },
]

// --- HELPER TO BUILD FULL MODULE DATA FOR A USER ---
function buildUserModule(seedData: MockModuleSeedData, userRole: Module["role"], currentUser: User): Module {
  const pinCount = seedData.initialPinCount || 0
  const pins: Pin[] = []
  for (let i = 0; i < pinCount; i++) {
    const seedPin = seedData.initialPins?.[i]
    pins.push({
      id: `${seedData.id}-pin-${i + 1}`,
      name: seedPin?.name || `Pin ${i + 1}`,
      assignedGroupId: seedPin?.assignedGroupId ? `${seedData.id}-${seedPin.assignedGroupId}` : undefined,
      state: i % 3 === 0 ? "on" : i % 3 === 1 ? "off" : "auto", // Example states
      autoConfig: i % 3 === 2 ? { mode: "time", timeLimit: { startTime: "09:00", endTime: "17:00" } } : undefined,
    })
  }

  const groups: ModuleGroup[] = (seedData.initialGroups || []).map((g, i) => ({
    id: `${seedData.id}-${g.name.toLowerCase().replace(/\s+/g, "-") || `group-${i}`}`, // more robust group id
    name: g.name,
  }))

  // Ensure initialPins assignedGroupId matches generated group IDs
  pins.forEach((pin) => {
    if (pin.assignedGroupId) {
      // e.g. was "group-ls"
      const originalGroupName = pin.assignedGroupId.replace(`${seedData.id}-`, "") // get "group-ls"
      const groupSeed = seedData.initialGroups?.find(
        (g) => g.name.toLowerCase().replace(/\s+/g, "-") === originalGroupName || g.name === originalGroupName,
      )
      if (groupSeed) {
        pin.assignedGroupId = groups.find((g) => g.name === groupSeed.name)?.id
      } else {
        pin.assignedGroupId = undefined // Group not found
      }
    }
  })

  const assignedUsers: AssignedUser[] = (seedData.initialAssignedUsers || []).map((au) => {
    const assignedUserDetails = MOCK_USERS.find((u) => u.id === au.userId)
    return {
      ...au,
      username: assignedUserDetails?.name || "Unknown User",
    }
  })

  const metrics: { [key: string]: ModuleMetric } = {}
  if (seedData.metricTemplates) {
    Object.entries(seedData.metricTemplates).forEach(([key, template]) => {
      const history: MetricDataPoint[] = Array.from({ length: 20 }, (_, i) => ({
        timestamp: Date.now() - (20 - i) * 60000,
        value: Number.parseFloat(
          (template.initial + (Math.random() - 0.5) * (template.max - template.min) * 0.1).toFixed(2),
        ),
      }))
      metrics[key] = {
        current: history[history.length - 1].value,
        min: template.min,
        max: template.max,
        unit: template.unit,
        history,
      }
    })
  }

  return {
    id: seedData.id,
    name: seedData.name,
    description: seedData.description,
    role: userRole,
    status: Math.random() > 0.2 ? "active" : "inactive",
    pinCount,
    pins,
    groups,
    assignedUsers,
    metrics,
  }
}

interface AuthContextType {
  user: User | null
  modules: Module[]
  isLoading: boolean
  login: (email: string, password_DO_NOT_USE: string) => Promise<User | null>
  logout: () => void
  register: (details: Omit<User, "id"> & { password_DO_NOT_USE: string }) => Promise<User | null>
  verifyToken: (email: string, token_DO_NOT_USE: string) => Promise<User | null>
  addModule: (moduleId: string) => Promise<Module | null> // User adds a module they own
  updateUserProfile: (updatedDetails: Partial<User>) => Promise<User | null>
  getModuleById: (moduleId: string) => Module | undefined
  // --- New Module Management Functions ---
  updateModulePinCount: (moduleId: string, newPinCount: number) => Promise<boolean>
  updateModulePinDetails: (moduleId: string, pinId: string, updates: Partial<Omit<Pin, "id">>) => Promise<boolean>
  addModuleGroup: (moduleId: string, groupName: string) => Promise<ModuleGroup | null>
  updateModuleGroup: (moduleId: string, groupId: string, newName: string) => Promise<boolean>
  deleteModuleGroup: (moduleId: string, groupId: string) => Promise<boolean>
  assignUserToModule: (
    moduleId: string,
    targetUserId: string,
    role: AssignedUser["role"],
  ) => Promise<AssignedUser | null>
  removeUserFromModule: (moduleId: string, targetUserId: string) => Promise<boolean>
  updatePinState: (moduleId: string, pinId: string, newState: ButtonState, newConfig?: ButtonConfig) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const loadUserData = useCallback((loggedInUser: User) => {
    const userModules: Module[] = []
    MOCK_MODULES_SEED_DB.forEach((seed) => {
      // Check if user is explicitly assigned a role in this seed
      const explicitAssignment = seed.initialAssignedUsers?.find((au) => au.userId === loggedInUser.id)
      if (explicitAssignment) {
        userModules.push(buildUserModule(seed, explicitAssignment.role, loggedInUser))
      }
      // Alice is owner of all modules if not explicitly assigned another role
      else if (loggedInUser.id === "user-alice") {
        userModules.push(buildUserModule(seed, "owner", loggedInUser))
      }
      // Eve is owner of Lab003 if not explicitly assigned
      else if (loggedInUser.id === "user-eve" && seed.id === "WHM-LAB003") {
        userModules.push(buildUserModule(seed, "owner", loggedInUser))
      }
    })
    setModules(userModules)
  }, [])

  // ... (useEffect for checkAuthStatus, route protection - same as before, ensure loadUserData is called)
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true)
      try {
        const storedUser = localStorage.getItem("waveHabitatUser")
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser)
          setUser(parsedUser)
          loadUserData(parsedUser)
        }
      } catch (error) {
        console.error("Failed to check auth status:", error)
        setUser(null)
        setModules([])
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthStatus()
  }, [loadUserData])

  useEffect(() => {
    if (!isLoading && !user && !pathname.startsWith("/login") && !pathname.startsWith("/register")) {
      router.push("/login")
    }
  }, [user, isLoading, router, pathname])

  // --- Auth Functions (login, verifyToken, register, logout, updateUserProfile - mostly same) ---
  const login = useCallback(async (email: string, _password_DO_NOT_USE: string): Promise<User | null> => {
    setIsLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find((u) => u.email === email)
        if (foundUser) {
          resolve(foundUser)
        } else {
          setIsLoading(false)
          reject(new Error("User not found."))
        }
      }, 500)
    })
  }, [])

  const verifyToken = useCallback(
    async (email: string, token_DO_NOT_USE: string): Promise<User | null> => {
      setIsLoading(true)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const foundUser = MOCK_USERS.find((u) => u.email === email)
          if (foundUser && token_DO_NOT_USE === "123456") {
            setUser(foundUser)
            localStorage.setItem("waveHabitatUser", JSON.stringify(foundUser))
            loadUserData(foundUser) // Load modules specific to this user
            setIsLoading(false)
            resolve(foundUser)
          } else {
            setIsLoading(false)
            reject(new Error("Invalid verification token."))
          }
        }, 500)
      })
    },
    [loadUserData],
  )

  const register = useCallback(
    async (details: Omit<User, "id"> & { password_DO_NOT_USE: string }): Promise<User | null> => {
      setIsLoading(true)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (MOCK_USERS.find((u) => u.email === details.email)) {
            setIsLoading(false)
            reject(new Error("Email already exists."))
            return
          }
          const newUser: User = { ...details, id: `user-${Date.now()}` }
          MOCK_USERS.push(newUser) // In real app, save to DB
          setIsLoading(false)
          resolve(newUser) // Proceed to verification
        }, 500)
      })
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    setModules([])
    localStorage.removeItem("waveHabitatUser")
    router.push("/login")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      className: "bg-card text-card-foreground border-border",
    })
  }, [router, toast])

  const updateUserProfile = useCallback(
    async (updatedDetails: Partial<User>): Promise<User | null> => {
      if (!user) return null
      setIsLoading(true)
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedUser = { ...user, ...updatedDetails }
          setUser(updatedUser)
          localStorage.setItem("waveHabitatUser", JSON.stringify(updatedUser))
          const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id)
          if (userIndex !== -1) MOCK_USERS[userIndex] = updatedUser
          setIsLoading(false)
          resolve(updatedUser)
        }, 500)
      })
    },
    [user],
  )

  const addModule = useCallback(
    // This is for a user "claiming" or "registering" a new physical module
    async (moduleIdFromInput: string): Promise<Module | null> => {
      if (!user) return null
      setIsLoading(true)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if user already has this module
          if (modules.find((m) => m.id === moduleIdFromInput)) {
            setIsLoading(false)
            reject(new Error("You already manage this module."))
            return
          }
          // Find the seed data for this module ID
          const seedData = MOCK_MODULES_SEED_DB.find((m) => m.id === moduleIdFromInput)
          if (seedData) {
            // User adding it becomes the owner
            const newModuleForUser = buildUserModule(seedData, "owner", user)
            setModules((prevModules) => [...prevModules, newModuleForUser])
            setIsLoading(false)
            resolve(newModuleForUser)
          } else {
            setIsLoading(false)
            reject(new Error("Module ID not found in our database. Please check the ID."))
          }
        }, 500)
      })
    },
    [modules, user],
  )

  const getModuleById = useCallback(
    (moduleId: string): Module | undefined => {
      return modules.find((m) => m.id === moduleId)
    },
    [modules],
  )

  // --- NEW MOCK MODULE MANAGEMENT FUNCTIONS ---
  const updateModulePinCount = useCallback(async (moduleId: string, newPinCount: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setModules((prev) =>
        prev.map((m) => {
          if (m.id === moduleId && m.role === "owner") {
            const currentPins = m.pins || []
            const updatedPins: Pin[] = []
            const maxPinsForModule = MOCK_MODULES_SEED_DB.find((seed) => seed.id === moduleId)?.maxPins || 120
            const count = Math.min(Math.max(0, newPinCount), maxPinsForModule)

            for (let i = 0; i < count; i++) {
              updatedPins.push(
                currentPins[i] || {
                  id: `${moduleId}-pin-${i + 1}`,
                  name: `Pin ${i + 1}`,
                },
              )
            }
            return { ...m, pinCount: count, pins: updatedPins }
          }
          return m
        }),
      )
      resolve(true)
    })
  }, [])

  const updateModulePinDetails = useCallback(
    async (moduleId: string, pinId: string, updates: Partial<Omit<Pin, "id">>): Promise<boolean> => {
      return new Promise((resolve) => {
        setModules((prev) =>
          prev.map((m) => {
            if (m.id === moduleId) {
              return { ...m, pins: m.pins.map((p) => (p.id === pinId ? { ...p, ...updates } : p)) }
            }
            return m
          }),
        )
        resolve(true)
      })
    },
    [],
  )

  const addModuleGroup = useCallback(
    async (moduleId: string, groupName: string): Promise<ModuleGroup | null> => {
      return new Promise((resolve) => {
        let newGroup: ModuleGroup | null = null
        setModules((prev) =>
          prev.map((m) => {
            if (m.id === moduleId && m.role === "owner") {
              if (m.groups.find((g) => g.name.toLowerCase() === groupName.toLowerCase())) {
                toast({ variant: "destructive", title: "Group already exists" })
                return m // Group name exists
              }
              newGroup = { id: `${moduleId}-group-${Date.now()}`, name: groupName }
              return { ...m, groups: [...m.groups, newGroup] }
            }
            return m
          }),
        )
        resolve(newGroup)
      })
    },
    [toast],
  )

  const updateModuleGroup = useCallback(
    async (moduleId: string, groupId: string, newName: string): Promise<boolean> => {
      return new Promise((resolve) => {
        setModules((prev) =>
          prev.map((m) => {
            if (m.id === moduleId && m.role === "owner") {
              if (m.groups.find((g) => g.id !== groupId && g.name.toLowerCase() === newName.toLowerCase())) {
                toast({ variant: "destructive", title: "Another group with this name already exists" })
                return m
              }
              return { ...m, groups: m.groups.map((g) => (g.id === groupId ? { ...g, name: newName } : g)) }
            }
            return m
          }),
        )
        resolve(true)
      })
    },
    [toast],
  )

  const deleteModuleGroup = useCallback(async (moduleId: string, groupId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModules((prev) =>
        prev.map((m) => {
          if (m.id === moduleId && m.role === "owner") {
            // Also unassign pins from this group
            const updatedPins = m.pins.map((p) =>
              p.assignedGroupId === groupId ? { ...p, assignedGroupId: undefined } : p,
            )
            return { ...m, pins: updatedPins, groups: m.groups.filter((g) => g.id !== groupId) }
          }
          return m
        }),
      )
      resolve(true)
    })
  }, [])

  const assignUserToModule = useCallback(
    async (moduleId: string, targetUserEmail: string, role: AssignedUser["role"]): Promise<AssignedUser | null> => {
      return new Promise((resolve, reject) => {
        const targetUser = MOCK_USERS.find((u) => u.email.toLowerCase() === targetUserEmail.toLowerCase())
        if (!targetUser) {
          reject(new Error("User with that email not found."))
          return
        }
        if (targetUser.id === user?.id) {
          reject(new Error("You cannot assign a role to yourself."))
          return
        }

        let newAssignment: AssignedUser | null = null
        setModules((prev) =>
          prev.map((m) => {
            if (m.id === moduleId && m.role === "owner") {
              if (m.assignedUsers.find((au) => au.userId === targetUser.id)) {
                // Update role if user already assigned
                m.assignedUsers = m.assignedUsers.map((au) => (au.userId === targetUser.id ? { ...au, role } : au))
                newAssignment = m.assignedUsers.find((au) => au.userId === targetUser.id)!
              } else {
                newAssignment = { userId: targetUser.id, username: targetUser.name, role }
                m.assignedUsers = [...m.assignedUsers, newAssignment]
              }
              return { ...m }
            }
            return m
          }),
        )
        if (newAssignment) resolve(newAssignment)
        else reject(new Error("Failed to assign role. Ensure you are the module owner."))
      })
    },
    [user],
  )

  const removeUserFromModule = useCallback(async (moduleId: string, targetUserId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModules((prev) =>
        prev.map((m) => {
          if (m.id === moduleId && m.role === "owner") {
            return { ...m, assignedUsers: m.assignedUsers.filter((au) => au.userId !== targetUserId) }
          }
          return m
        }),
      )
      resolve(true)
    })
  }, [])

  const updatePinState = useCallback(
    async (moduleId: string, pinId: string, newState: ButtonState, newConfig?: ButtonConfig): Promise<boolean> => {
      return new Promise((resolve) => {
        setModules((prev) =>
          prev.map((m) => {
            if (m.id === moduleId && (m.role === "operator" || m.role === "owner" || m.role === "programmer")) {
              return {
                ...m,
                pins: m.pins.map((p) =>
                  p.id === pinId
                    ? { ...p, state: newState, autoConfig: newState === "auto" ? newConfig : p.autoConfig }
                    : p,
                ),
              }
            }
            return m
          }),
        )
        resolve(true)
      })
    },
    [setModules]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        modules,
        isLoading,
        login,
        logout,
        register,
        verifyToken,
        addModule,
        updateUserProfile,
        getModuleById,
        updateModulePinCount,
        updateModulePinDetails,
        addModuleGroup,
        updateModuleGroup,
        deleteModuleGroup,
        assignUserToModule,
        removeUserFromModule,
        updatePinState,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
