export interface User {
  phone: string
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

// In lib/types.ts

// This is the "shallow" module object we get from our main get-modules.php
export interface Module {
  module_id: string;
  name: string;
  description: string | null;
  role: 'owner' | 'operator' | 'programmer' | 'viewer';
  
  // These are now optional because they will only exist on the "deep" detail object
  alloted_pins?: number;
  used_pins?: number;
  pins_left?: number;
  module_status?: number;
  pins?: Pin[];
  groups?: ModuleGroup[];
  assignedUsers?: AssignedUser[];
  metrics?: { [key: string]: ModuleMetric };
}