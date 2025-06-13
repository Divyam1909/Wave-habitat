export interface User {
  id: string
  name: string
  email: string
  phoneNumber?: string
}

export interface Pin {
  id: string // Unique ID for the pin, e.g., moduleId-pin-1
  name: string // User-defined label, e.g., "Main Pump"
  description?: string // Optional description of the pin's purpose
  // For Operator/Programmer/Viewer - actual state and config
  state?: ButtonState
  autoConfig?: ButtonConfig
  assignedGroupId?: string // ID of the group this pin belongs to
}

export interface ModuleGroup {
  id: string // Unique ID for the group, e.g., moduleId-group-lights
  name: string // User-defined name, e.g., "Lighting System"
}

export interface AssignedUser {
  userId: string // ID of the User
  username: string // Name of the User (for display)
  role: "operator" | "viewer" | "programmer"
}

// For Operator Dashboard button states
export type ButtonState = "on" | "off" | "auto"

export interface ButtonConfig {
  mode: "time" | "limit" | "sensor"
  timeDuration?: { value: number; unit: "hours" | "minutes" | "seconds" }
  timeLimit?: { startTime: string; endTime: string } // e.g., "10:00", "12:00"
  sensorThreshold?: { sensorId: string; condition: "above" | "below"; value: number }
}

export interface MetricDataPoint {
  timestamp: number
  value: number
}

export interface ModuleMetric {
  current: number
  min: number
  max: number
  unit: string
  history: MetricDataPoint[]
}

export interface Module {
  id: string
  name: string
  description?: string
  status: "active" | "inactive"
  role: "owner" | "operator" | "viewer" | "programmer" // Role of the current user for this module

  // --- Owner Configurable ---
  pinCount?: number // Number of pins configured by owner (max 120)
  pins: Pin[] // Array of configured pins
  groups: ModuleGroup[]
  assignedUsers: AssignedUser[]

  // --- Operational Data (for Operator, Programmer, Viewer) ---
  metrics?: {
    [key: string]: ModuleMetric // e.g., temperature, pH
  }
}
