"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Sliders,
  BarChart3,
  Thermometer,
  Droplets,
  Gauge,
  Sun,
  Cloud,
  Volume2,
  Activity,
  FlaskConical,
  Zap,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from "recharts"
import { motion, AnimatePresence } from "framer-motion"

interface ProgrammerCalibrateSectionProps {
  module: any
}

// List of sensors as shown in the image
const SENSOR_LIST = [
  { id: "temperature", name: "Temperature Sensor", type: "Temperature", location: "Main Tank" },
  { id: "humidity", name: "Humidity Sensor", type: "Humidity", location: "Main Tank" },
  { id: "pressure", name: "Pressure Sensor", type: "Pressure", location: "Main Tank" },
  { id: "light", name: "Light Sensor", type: "Light", location: "Main Tank" },
  { id: "co2", name: "CO2 Sensor", type: "CO2", location: "Main Tank" },
  { id: "sound", name: "Sound Sensor", type: "Sound", location: "Main Tank" },
  { id: "vibration", name: "Vibration Sensor", type: "Vibration", location: "Main Tank" },
  { id: "custom", name: "Custom Sensor", type: "Custom", location: "Main Tank" },
  { id: "orp", name: "ORP Sensor", type: "ORP", location: "Main Tank" },
]

// Mock probe list
const MOCK_PROBES = [
  { name: "Probe A", deviceId: "probe_A" },
  { name: "Probe B", deviceId: "probe_B" },
]

// Helper mock for sensor display info
const sensorDisplayMock = {
  temperature: { value: 19.12, unit: "°C", range: "-20 - 100 °C", lastUpdated: "10:07:12 AM" },
  humidity: { value: 1.37, unit: "%", range: "0 - 100 %", lastUpdated: "10:07:12 AM" },
  pressure: { value: 867.16, unit: "hPa", range: "800 - 1200 hPa", lastUpdated: "10:07:12 AM" },
  light: { value: 592.2, unit: "lux", range: "0 - 1000 lux", lastUpdated: "10:07:12 AM" },
  co2: { value: 1227.32, unit: "ppm", range: "0 - 2000 ppm", lastUpdated: "10:07:12 AM" },
  sound: { value: 93.37, unit: "dB", range: "0 - 100 dB", lastUpdated: "10:07:12 AM" },
  vibration: { value: 0.56, unit: "g", range: "0 - 10 g", lastUpdated: "10:07:12 AM" },
  custom: { value: 55.61, unit: "units", range: "0 - 100 units", lastUpdated: "10:07:12 AM" },
  orp: { value: 590.24, unit: "mV", range: "0 - 2500 mV", lastUpdated: "10:07:12 AM" },
}

// Enhanced SensorCard with animation, icon, and professional style
function SensorCard({ sensor, isSelected, onClick, value, unit, range, lastUpdated }: any) {
  // Icon mapping for each sensor type
  const iconMap: Record<string, React.ReactNode> = {
    temperature: <Thermometer className="h-6 w-6 text-wave-coral" />,
    humidity: <Droplets className="h-6 w-6 text-wave-seafoam" />,
    pressure: <Gauge className="h-6 w-6 text-wave-lightBlue" />,
    light: <Sun className="h-6 w-6 text-yellow-400" />,
    co2: <Cloud className="h-6 w-6 text-green-500" />,
    sound: <Volume2 className="h-6 w-6 text-pink-500" />,
    vibration: <Activity className="h-6 w-6 text-purple-400" />,
    custom: <FlaskConical className="h-6 w-6 text-blue-400" />,
    orp: <Zap className="h-6 w-6 text-orange-400" />,
  }
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.04, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
      whileTap={{ scale: 0.98 }}
      animate={{
        borderColor: isSelected ? "hsl(var(--wave-coral))" : "hsl(var(--wave-light-blue) / 0.4)",
        boxShadow: isSelected ? "0 0 0 2px hsl(var(--wave-coral))" : "0 2px 8px 0 rgba(0,0,0,0.06)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative cursor-pointer rounded-xl border-2 bg-white/90 dark:bg-wave-midBlue/70 backdrop-blur-sm p-0 overflow-hidden group ${isSelected ? "ring-2 ring-wave-coral" : ""}`}
      onClick={onClick}
    >
      <div
        className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
        style={{ background: isSelected ? "hsl(var(--wave-coral))" : "hsl(var(--wave-light-blue) / 0.4)" }}
      />
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <div className="flex-shrink-0">{iconMap[sensor.id]}</div>
        <CardTitle className="text-wave-sand text-base flex-1 truncate">{sensor.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-0 pb-2">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-extrabold text-wave-lightBlue drop-shadow-sm">{value}</span>
          <span className="text-base text-wave-sand/70 font-semibold">{unit}</span>
        </div>
        <div className="text-xs text-wave-sand/70">Range: {range}</div>
        <div className="w-full h-2 bg-wave-deepBlue/20 rounded mt-1 mb-1">
          <motion.div
            className="h-2 rounded bg-wave-lightBlue"
            style={{
              width: `${Math.min(100, ((value - (sensor.min ?? 0)) / ((sensor.max ?? 100) - (sensor.min ?? 0))) * 100)}%`,
            }}
            layout
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-xs text-wave-sand/50">Last updated: {lastUpdated}</div>
      </CardContent>
      <motion.div
        className="absolute inset-0 rounded-xl border-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isSelected ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ borderColor: "hsl(var(--wave-coral))" }}
      />
    </motion.div>
  )
}

// Modal for chart/calibration
function SensorModal({ open, onClose, sensor, chartData, calibrationWizard, selectedTab, setSelectedTab }: any) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/90 dark:bg-wave-deepBlue/90 backdrop-blur-md rounded-2xl shadow-2xl p-0 w-full max-w-2xl mx-2 relative"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <button
              className="absolute top-3 right-3 z-10 bg-wave-coral/90 hover:bg-wave-coral text-white rounded-full p-1 shadow"
              onClick={onClose}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex flex-col gap-0">
              <div className="flex items-center gap-3 px-6 pt-6 pb-2">
                <span className="text-2xl font-bold text-wave-lightBlue flex items-center gap-2">
                  <Sliders className="h-6 w-6" /> {sensor.name}
                </span>
                <span className="ml-auto text-xs text-wave-sand/60">{sensor.type}</span>
              </div>
              <div className="px-6">
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="bg-wave-deepBlue/70 border border-wave-lightBlue/20 mb-2">
                    <TabsTrigger value="chart">Readings Chart</TabsTrigger>
                    <TabsTrigger value="calibration">Calibration</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="px-6 pb-6">
                {selectedTab === "chart" && (
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--wave-light-blue) / 0.2)" />
                        <XAxis
                          dataKey="time"
                          stroke="hsl(var(--wave-sand) / 0.7)"
                          tick={{ fill: "hsl(var(--wave-sand) / 0.7)" }}
                        />
                        <YAxis stroke="hsl(var(--wave-sand) / 0.7)" tick={{ fill: "hsl(var(--wave-sand) / 0.7)" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--wave-deep-blue))",
                            border: "1px solid hsl(var(--wave-light-blue) / 0.5)",
                            borderRadius: "6px",
                            color: "hsl(var(--wave-sand))",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="raw"
                          name="Raw Reading"
                          stroke="hsl(var(--wave-coral))"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="calibrated"
                          name="Calibrated"
                          stroke="hsl(var(--wave-seafoam))"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {selectedTab === "calibration" && calibrationWizard}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StandardCalibrationWizard({
  isOpen,
  onClose,
  sensorName,
}: { isOpen: boolean; onClose: () => void; sensorName: string }) {
  const [step, setStep] = useState(1)
  const [selectedProbe, setSelectedProbe] = useState<string | null>(null)
  const [readingSettled, setReadingSettled] = useState(false)
  const [timer, setTimer] = useState(198)
  const [activePoint, setActivePoint] = useState<"7.00" | "4.00">("7.00")
  const [calibrating, setCalibrating] = useState(false)

  // Reset wizard state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setSelectedProbe(null)
      setReadingSettled(false)
      setTimer(198)
      setActivePoint("7.00")
      setCalibrating(false)
    }
  }, [isOpen])

  // Step 5/7: handle reading settled and timer
  useEffect(() => {
    let settleTimeout: any
    let countdown: any
    if ((step === 5 || step === 7) && calibrating) {
      setReadingSettled(false)
      settleTimeout = setTimeout(() => setReadingSettled(true), 5000)
      setTimer(198)
      countdown = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000)
    }
    return () => {
      clearTimeout(settleTimeout)
      clearInterval(countdown)
    }
  }, [step, calibrating])

  // Step content
  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Calibrating {sensorName}</h2>
            <p>Ensure that the probe is plugged into the Apex.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Calibrating {sensorName}</h2>
            <p>Select a probe to calibrate:</p>
            <div className="space-y-2">
              {MOCK_PROBES.map((probe) => (
                <Button
                  key={probe.deviceId}
                  variant={selectedProbe === probe.deviceId ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedProbe(probe.deviceId)}
                >
                  {probe.name}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep(3)} disabled={!selectedProbe}>
                Next
              </Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Calibrating {sensorName}</h2>
            <div className="bg-red-100 border border-red-500 text-red-900 rounded p-3">
              <strong>Note:</strong> Quinhydrone powder is annoying to source, and safety precautions must be
              observed... we recommend against it.
            </div>
            <p>Pressing Cancel would be a great idea.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep(4)}>Next</Button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Calibrating {sensorName}</h2>
            <p>
              Place the probe in <b>7.00 Quinhydrone solution</b>.
            </p>
            <p>When ready, press Calibrate.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setCalibrating(true)
                  setStep(5)
                }}
              >
                Calibrate
              </Button>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Calibrating {sensorName} in 7.00 Quinhydrone solution</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✔</span> Range acceptable
              </li>
              <li className="flex items-center gap-2">
                {readingSettled ? (
                  <span className="text-green-600">✔</span>
                ) : (
                  <span className="text-yellow-500">⚠</span>
                )}{" "}
                Reading settled
              </li>
              <li className="flex items-center gap-2">
                <span role="img" aria-label="clock">
                  ⏰
                </span>{" "}
                Time remaining: {timer}s
              </li>
            </ul>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setCalibrating(false)
                  setStep(6)
                }}
                disabled={!readingSettled}
              >
                Next
              </Button>
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Calibrating {sensorName}</h2>
            <p>Rinse the probe thoroughly with RO/DI water.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setStep(5)}>
                Back
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setActivePoint("4.00")
                  setStep(7)
                  setCalibrating(true)
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Calibrating {sensorName} in 4.00 Quinhydrone solution</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✔</span> Range acceptable
              </li>
              <li className="flex items-center gap-2">
                {readingSettled ? (
                  <span className="text-green-600">✔</span>
                ) : (
                  <span className="text-yellow-500">⚠</span>
                )}{" "}
                Reading settled
              </li>
              <li className="flex items-center gap-2">
                <span role="img" aria-label="clock">
                  ⏰
                </span>{" "}
                Time remaining: {timer}s
              </li>
            </ul>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setCalibrating(false)
                  setStep(8)
                }}
                disabled={!readingSettled}
              >
                Next
              </Button>
            </div>
          </div>
        )
      case 8:
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center mb-4">
              <span className="text-6xl text-green-600">✔</span>
            </div>
            <h2 className="text-xl font-bold">Calibration Successful!</h2>
            <Button className="mt-4" onClick={onClose}>
              Finish
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white/90 dark:bg-wave-deepBlue/90 backdrop-blur-md rounded-lg shadow-lg p-6 min-w-[350px] max-w-full w-[95vw] sm:w-[400px]">
        {renderStep()}
      </div>
    </div>
  )
}

export function ProgrammerCalibrateSection({ module }: ProgrammerCalibrateSectionProps) {
  // State for selected sensor and modal
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("chart")

  // Find the selected sensor from module.sensors by id
  const selectedSensor = module.sensors.find((s: any) => s.id === selectedSensorId) || module.sensors[0]
  const chartData = selectedSensor.readings.map((reading: any) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    raw: reading.value,
    calibrated: reading.value * selectedSensor.calibration.multiplier + selectedSensor.calibration.offset,
    timestamp: reading.timestamp,
  }))

  // Helper to get sensor display info (mocked for now)
  function getSensorDisplay(sensor: { id: keyof typeof sensorDisplayMock }) {
    return (
      sensorDisplayMock[sensor.id as keyof typeof sensorDisplayMock] || {
        value: "--",
        unit: "",
        range: "",
        lastUpdated: "",
      }
    )
  }

  // Inline calibration wizard (not modal)
  function InlineCalibrationWizard({ sensorName }: { sensorName: string }) {
    // Copy the StandardCalibrationWizard logic, but render inline and use showCalibrationWizard state
    const [step, setStep] = useState(1)
    const [selectedProbe, setSelectedProbe] = useState<string | null>(null)
    const [readingSettled, setReadingSettled] = useState(false)
    const [timer, setTimer] = useState(198)
    const [activePoint, setActivePoint] = useState<"7.00" | "4.00">("7.00")
    const [calibrating, setCalibrating] = useState(false)

    useEffect(() => {
      setStep(1)
      setSelectedProbe(null)
      setReadingSettled(false)
      setTimer(198)
      setActivePoint("7.00")
      setCalibrating(false)
    }, [sensorName])

    useEffect(() => {
      let settleTimeout: any
      let countdown: any
      if ((step === 5 || step === 7) && calibrating) {
        setReadingSettled(false)
        settleTimeout = setTimeout(() => setReadingSettled(true), 5000)
        setTimer(198)
        countdown = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000)
      }
      return () => {
        clearTimeout(settleTimeout)
        clearInterval(countdown)
      }
    }, [step, calibrating])

    function renderStep() {
      switch (step) {
        case 1:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{sensorName} Calibration</h2>
              <p>Please confirm the probe is securely connected to the Apex system before proceeding.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setStep(2)}>Continue</Button>
              </div>
            </div>
          )
        case 2:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{sensorName} Calibration</h2>
              <p>Choose which probe you want to calibrate:</p>
              <div className="space-y-2">
                {MOCK_PROBES.map((probe) => (
                  <Button
                    key={probe.deviceId}
                    variant={selectedProbe === probe.deviceId ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedProbe(probe.deviceId)}
                  >
                    {probe.name}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setStep(3)} disabled={!selectedProbe}>
                  Next
                </Button>
              </div>
            </div>
          )
        case 3:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{sensorName} Calibration</h2>
              <div className="bg-red-100 border border-red-500 text-red-900 rounded p-3">
                <strong>Important:</strong> Handling Quinhydrone powder requires caution and is not always easy to
                obtain. Please follow all safety guidelines. We suggest considering alternatives if possible.
              </div>
              <p>If you wish to stop, press Cancel below.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setStep(4)}>Continue</Button>
              </div>
            </div>
          )
        case 4:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{sensorName} Calibration</h2>
              <p>Immerse the probe in a 7.00 Quinhydrone solution.</p>
              <p>When you are ready, click the Calibrate button.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setCalibrating(true)
                    setStep(5)
                  }}
                >
                  Calibrate
                </Button>
              </div>
            </div>
          )
        case 5:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{sensorName} - 7.00 Solution</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✔</span> Value is within expected range
                </li>
                <li className="flex items-center gap-2">
                  {readingSettled ? (
                    <span className="text-green-600">✔</span>
                  ) : (
                    <span className="text-yellow-500">⚠</span>
                  )}{" "}
                  Reading is stable
                </li>
                <li className="flex items-center gap-2">
                  <span role="img" aria-label="clock">
                    ⏰
                  </span>{" "}
                  Time left: {timer}s
                </li>
              </ul>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setCalibrating(false)
                    setStep(6)
                  }}
                  disabled={!readingSettled}
                >
                  Next
                </Button>
              </div>
            </div>
          )
        case 6:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{sensorName} Calibration</h2>
              <p>Rinse the probe thoroughly with purified water before continuing.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setStep(5)}>
                  Back
                </Button>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setActivePoint("4.00")
                    setStep(7)
                    setCalibrating(true)
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )
        case 7:
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{sensorName} - 4.00 Solution</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✔</span> Value is within expected range
                </li>
                <li className="flex items-center gap-2">
                  {readingSettled ? (
                    <span className="text-green-600">✔</span>
                  ) : (
                    <span className="text-yellow-500">⚠</span>
                  )}{" "}
                  Reading is stable
                </li>
                <li className="flex items-center gap-2">
                  <span role="img" aria-label="clock">
                    ⏰
                  </span>{" "}
                  Time left: {timer}s
                </li>
              </ul>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setCalibrating(false)
                    setStep(8)
                  }}
                  disabled={!readingSettled}
                >
                  Next
                </Button>
              </div>
            </div>
          )
        case 8:
          return (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <span className="text-6xl text-green-600">✔</span>
              </div>
              <h2 className="text-xl font-bold">Calibration Complete!</h2>
              <p>Your sensor has been successfully calibrated and is ready for use.</p>
              <Button className="mt-4" onClick={() => setModalOpen(false)}>
                Finish
              </Button>
            </div>
          )
        default:
          return null
      }
    }
    return (
      <div className="p-2 bg-wave-midBlue/30 backdrop-blur-sm rounded-lg border border-wave-lightBlue/20 mt-2">
        {renderStep()}
      </div>
    )
  }

  // Sensor toggles for interactive legend
  const sensorTypes = useMemo(() => {
    const types = new Set<string>()
    module.sensors.forEach((s: any) => types.add(s.type))
    return Array.from(types)
  }, [module.sensors])
  const [visibleSensors, setVisibleSensors] = useState<string[]>(sensorTypes)
  // Prepare data for multi-sensor chart
  const analysisData = useMemo(() => {
    // Flatten readings and group by timestamp for multi-line chart
    const allReadings: any[] = []
    module.sensors.forEach((sensor: any) => {
      if (visibleSensors.includes(sensor.type)) {
        sensor.readings.forEach((reading: any) => {
          allReadings.push({
            ...reading,
            sensorType: sensor.type,
            sensorName: sensor.name,
          })
        })
      }
    })
    // Sort by timestamp
    return allReadings.sort((a, b) => a.timestamp - b.timestamp)
  }, [module.sensors, visibleSensors])
  // Color map for lines
  const colorMap: Record<string, string> = {
    Temperature: "hsl(var(--wave-coral))",
    Humidity: "hsl(var(--wave-seafoam))",
    Pressure: "hsl(var(--wave-light-blue))",
    Light: "hsl(var(--wave-sand))",
    CO2: "hsl(var(--wave-buttonAuto))",
    Sound: "hsl(var(--wave-coral) / 0.7)",
    Vibration: "hsl(var(--wave-seafoam) / 0.7)",
    Custom: "hsl(var(--wave-light-blue) / 0.7)",
    ORP: "hsl(var(--wave-coral) / 0.5)",
  }
  // Custom tooltip
  function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
      const d = payload[0].payload
      return (
        <div className="rounded-lg bg-wave-midBlue/90 border border-wave-lightBlue/40 p-3 text-xs text-wave-sand shadow-lg">
          <div className="font-bold mb-1">{d.sensorName}</div>
          <div>
            Value: <span className="font-mono text-wave-lightBlue">{d.value}</span>
          </div>
          <div>Time: {new Date(d.timestamp).toLocaleString()}</div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-wave-lightBlue flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Sensor Calibration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 3-column grid for sensor cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SENSOR_LIST.map((sensor) => {
              const { value, unit, range, lastUpdated } = getSensorDisplay({
                id: sensor.id as keyof typeof sensorDisplayMock,
              })
              return (
                <SensorCard
                  key={sensor.id}
                  sensor={sensor}
                  isSelected={selectedSensorId === sensor.id}
                  onClick={() => {
                    setSelectedSensorId(sensor.id)
                    setModalOpen(true)
                    setSelectedTab("chart")
                  }}
                  value={value}
                  unit={unit}
                  range={range}
                  lastUpdated={lastUpdated}
                />
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal for chart/calibration */}
      <SensorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sensor={selectedSensor}
        chartData={chartData}
        calibrationWizard={<InlineCalibrationWizard sensorName={selectedSensor.name} />}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {/* Sensor Data Analysis (clean, live, no glow, shaded area) */}
      <Card className="bg-[#0a1a24]/90 border-none shadow-none backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-wave-lightBlue flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sensor Data Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="h-[400px] rounded-xl overflow-hidden"
            style={{ background: "linear-gradient(180deg, #0a1a24 60%, #18344a 100%)" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={module.sensors.flatMap((sensor: any) => sensor.readings)}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4fd1ff" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#0a1a24" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a4152" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                  stroke="#b6c9d6"
                  tick={{ fill: "#b6c9d6", fontSize: 13 }}
                  axisLine={{ stroke: "#2a4152" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#b6c9d6"
                  tick={{ fill: "#b6c9d6", fontSize: 13 }}
                  axisLine={{ stroke: "#2a4152" }}
                  tickLine={false}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{ background: "#18344a", border: "1px solid #4fd1ff", borderRadius: 8, color: "#fff" }}
                  labelStyle={{ color: "#4fd1ff" }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value: any) => [value, "Value"]}
                  labelFormatter={(v) => new Date(v).toLocaleString()}
                />
                <Line
                  type="monotone"
                  dataKey={(d) => d.value}
                  stroke="#4fd1ff"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={true}
                />
                <Area
                  type="monotone"
                  dataKey={(d) => d.value}
                  stroke={"none"}
                  fill="url(#areaGradient)"
                  fillOpacity={1}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
