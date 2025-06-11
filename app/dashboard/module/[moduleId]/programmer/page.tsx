import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgrammerGroupsSection } from "@/components/dashboard/module/programmer/programmer-groups-section"
import { ProgrammerPinsSection } from "@/components/dashboard/module/programmer/programmer-pins-section"
import { ProgrammerRolesSection } from "@/components/dashboard/module/programmer/programmer-roles-section"
import { ProgrammerCalibrateSection } from "@/components/dashboard/module/programmer/programmer-calibrate-section"
import { Loader2 } from "lucide-react"

// Mock data - in a real app, this would come from an API or database
const mockModule = {
  id: "module-123",
  name: "Wave Controller X1",
  pins: [
    { id: "pin1", name: "Pump 1", status: "inactive", group: "Pumps" },
    { id: "pin2", name: "Pump 2", status: "active", group: "Pumps" },
    { id: "pin3", name: "Light 1", status: "inactive", group: "Lighting" },
    { id: "pin4", name: "Light 2", status: "auto", group: "Lighting" },
    { id: "pin5", name: "Filter 1", status: "active", group: null },
    { id: "pin6", name: "Filter 2", status: "inactive", group: null },
  ],
  groups: [
    { id: "group1", name: "Pumps", pins: ["pin1", "pin2"] },
    { id: "group2", name: "Lighting", pins: ["pin3", "pin4"] },
  ],
  roles: [
    { userId: "user1", username: "john_doe", role: "owner" },
    { userId: "user2", username: "jane_smith", role: "programmer" },
    { userId: "user3", username: "bob_johnson", role: "operator" },
    { userId: "user4", username: "alice_williams", role: "viewer" },
  ],
  sensors: [
    {
      id: "sensor1",
      name: "Temperature Sensor 1",
      type: "temperature",
      location: "Main Tank",
      calibration: {
        offset: 0.5,
        multiplier: 1.02,
        lastCalibrated: "2023-06-10T14:30:00Z",
        calibratedBy: "jane_smith",
      },
      readings: [
        { timestamp: Date.now() - 3600000 * 24, value: 25.2 },
        { timestamp: Date.now() - 3600000 * 20, value: 25.4 },
        { timestamp: Date.now() - 3600000 * 16, value: 25.6 },
        { timestamp: Date.now() - 3600000 * 12, value: 25.8 },
        { timestamp: Date.now() - 3600000 * 8, value: 26.0 },
        { timestamp: Date.now() - 3600000 * 4, value: 25.9 },
        { timestamp: Date.now(), value: 25.7 },
      ],
    },
    {
      id: "sensor2",
      name: "pH Sensor 1",
      type: "ph",
      location: "Main Tank",
      calibration: {
        offset: -0.2,
        multiplier: 1.0,
        lastCalibrated: "2023-06-05T10:15:00Z",
        calibratedBy: "jane_smith",
      },
      readings: [
        { timestamp: Date.now() - 3600000 * 24, value: 7.2 },
        { timestamp: Date.now() - 3600000 * 20, value: 7.3 },
        { timestamp: Date.now() - 3600000 * 16, value: 7.1 },
        { timestamp: Date.now() - 3600000 * 12, value: 7.0 },
        { timestamp: Date.now() - 3600000 * 8, value: 7.2 },
        { timestamp: Date.now() - 3600000 * 4, value: 7.3 },
        { timestamp: Date.now(), value: 7.2 },
      ],
    },
    {
      id: "sensor3",
      name: "Salinity Sensor 1",
      type: "salinity",
      location: "Main Tank",
      calibration: {
        offset: 0.0,
        multiplier: 0.98,
        lastCalibrated: "2023-06-01T09:45:00Z",
        calibratedBy: "jane_smith",
      },
      readings: [
        { timestamp: Date.now() - 3600000 * 24, value: 35.1 },
        { timestamp: Date.now() - 3600000 * 20, value: 35.2 },
        { timestamp: Date.now() - 3600000 * 16, value: 35.0 },
        { timestamp: Date.now() - 3600000 * 12, value: 34.9 },
        { timestamp: Date.now() - 3600000 * 8, value: 35.0 },
        { timestamp: Date.now() - 3600000 * 4, value: 35.1 },
        { timestamp: Date.now(), value: 35.2 },
      ],
    },
  ],
  metrics: {
    temperature: {
      current: 25.7,
      min: 20,
      max: 30,
      unit: "°C",
      history: [
        { timestamp: Date.now() - 3600000 * 24, value: 25.2 },
        { timestamp: Date.now() - 3600000 * 20, value: 25.4 },
        { timestamp: Date.now() - 3600000 * 16, value: 25.6 },
        { timestamp: Date.now() - 3600000 * 12, value: 25.8 },
        { timestamp: Date.now() - 3600000 * 8, value: 26.0 },
        { timestamp: Date.now() - 3600000 * 4, value: 25.9 },
        { timestamp: Date.now(), value: 25.7 },
      ],
    },
    ph: {
      current: 7.2,
      min: 6.5,
      max: 8.5,
      unit: "",
      history: [
        { timestamp: Date.now() - 3600000 * 24, value: 7.2 },
        { timestamp: Date.now() - 3600000 * 20, value: 7.3 },
        { timestamp: Date.now() - 3600000 * 16, value: 7.1 },
        { timestamp: Date.now() - 3600000 * 12, value: 7.0 },
        { timestamp: Date.now() - 3600000 * 8, value: 7.2 },
        { timestamp: Date.now() - 3600000 * 4, value: 7.3 },
        { timestamp: Date.now(), value: 7.2 },
      ],
    },
    salinity: {
      current: 35.2,
      min: 30,
      max: 40,
      unit: "ppt",
      history: [
        { timestamp: Date.now() - 3600000 * 24, value: 35.1 },
        { timestamp: Date.now() - 3600000 * 20, value: 35.2 },
        { timestamp: Date.now() - 3600000 * 16, value: 35.0 },
        { timestamp: Date.now() - 3600000 * 12, value: 34.9 },
        { timestamp: Date.now() - 3600000 * 8, value: 35.0 },
        { timestamp: Date.now() - 3600000 * 4, value: 35.1 },
        { timestamp: Date.now(), value: 35.2 },
      ],
    },
  },
}

export default function ProgrammerModulePage({ params }: { params: { moduleId: string } }) {
  // In a real app, fetch the module data based on moduleId
  const module = mockModule

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-wave-sand">
          {module.name} <span className="text-wave-lightBlue">(Programmer)</span>
        </h1>
      </div>

      <Tabs defaultValue="calibrate" className="w-full">
        <TabsList className="bg-wave-deepBlue/50 border border-wave-lightBlue/20">
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="pins">Pins</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="calibrate">Calibrate</TabsTrigger>
        </TabsList>
        <TabsContent value="groups" className="mt-6">
          <Suspense
            fallback={
              <Card>
                <CardContent className="pt-6 flex justify-center">
                  <Loader2 className="h-6 w-6 text-wave-lightBlue animate-spin" />
                </CardContent>
              </Card>
            }
          >
            <ProgrammerGroupsSection module={module} />
          </Suspense>
        </TabsContent>
        <TabsContent value="pins" className="mt-6">
          <Suspense
            fallback={
              <Card>
                <CardContent className="pt-6 flex justify-center">
                  <Loader2 className="h-6 w-6 text-wave-lightBlue animate-spin" />
                </CardContent>
              </Card>
            }
          >
            <ProgrammerPinsSection module={module} />
          </Suspense>
        </TabsContent>
        <TabsContent value="roles" className="mt-6">
          <Suspense
            fallback={
              <Card>
                <CardContent className="pt-6 flex justify-center">
                  <Loader2 className="h-6 w-6 text-wave-lightBlue animate-spin" />
                </CardContent>
              </Card>
            }
          >
            <ProgrammerRolesSection module={module} />
          </Suspense>
        </TabsContent>
        <TabsContent value="calibrate" className="mt-6">
          <Suspense
            fallback={
              <Card>
                <CardContent className="pt-6 flex justify-center">
                  <Loader2 className="h-6 w-6 text-wave-lightBlue animate-spin" />
                </CardContent>
              </Card>
            }
          >
            <ProgrammerCalibrateSection module={module} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
