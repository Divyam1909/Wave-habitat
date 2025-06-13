"use client"

import { useState, useEffect } from "react"
import type { Module, ModuleMetric } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, BarChart3, Gauge, Eye } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ViewerMetricsSectionProps {
  module: Module
}

interface MetricCardProps {
  name: string
  metric: ModuleMetric
  isLive: boolean
}

function MetricCard({ name, metric, isLive }: MetricCardProps) {
  const [currentValue, setCurrentValue] = useState(metric.current)
  const [history, setHistory] = useState(metric.history)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate live data updates
      const variation = (Math.random() - 0.5) * (metric.max - metric.min) * 0.05
      const newValue = Math.max(metric.min, Math.min(metric.max, currentValue + variation))
      const newDataPoint = {
        timestamp: Date.now(),
        value: Number(newValue.toFixed(2)),
      }

      setCurrentValue(newValue)
      setHistory((prev) => [...prev.slice(-19), newDataPoint])
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive, currentValue, metric.min, metric.max])

  // Format data for chart
  const chartData = history.map((point, index) => ({
    time: index,
    value: point.value,
    timestamp: new Date(point.timestamp).toLocaleTimeString(),
  }))

  // Calculate percentage for radial gauge
  const percentage = ((currentValue - metric.min) / (metric.max - metric.min)) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Determine color based on value range
  const getValueColor = () => {
    const normalizedValue = (currentValue - metric.min) / (metric.max - metric.min)
    if (normalizedValue < 0.3) return "text-wave-coral"
    if (normalizedValue > 0.7) return "text-wave-buttonAuto"
    return "text-wave-seafoam"
  }

  const getStrokeColor = () => {
    const normalizedValue = (currentValue - metric.min) / (metric.max - metric.min)
    if (normalizedValue < 0.3) return "stroke-wave-coral"
    if (normalizedValue > 0.7) return "stroke-wave-buttonAuto"
    return "stroke-wave-seafoam"
  }

  return (
    <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40 relative">
      {/* Read-only indicator */}
      <div className="absolute top-3 right-3 z-10">
        <Eye className="h-3 w-3 text-wave-sand/50" />
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-wave-lightBlue capitalize flex items-center justify-between pr-6">
          <span className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {name}
          </span>
          <div className={`flex items-center gap-1 ${isLive ? "text-wave-seafoam" : "text-wave-sand/50"}`}>
            <div
              className={`w-2 h-2 rounded-full ${isLive ? "bg-wave-seafoam status-glow-active" : "bg-wave-sand/50"}`}
            />
            <span className="text-xs">{isLive ? "LIVE" : "PAUSED"}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Value Display */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getValueColor()}`}>
            {currentValue.toFixed(2)}
            <span className="text-sm text-wave-sand/70 ml-1">{metric.unit}</span>
          </div>
          <div className="text-xs text-wave-sand/60 mt-1">
            Range: {metric.min} - {metric.max} {metric.unit}
          </div>
        </div>

        {/* Radial Gauge */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-wave-deepBlue/50"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-500 ${getStrokeColor()}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Gauge className={`h-6 w-6 ${getValueColor()}`} />
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--wave-light-blue) / 0.2)" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--wave-sand) / 0.7)" }}
              />
              <YAxis
                domain={[metric.min, metric.max]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--wave-sand) / 0.7)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--wave-mid-blue))",
                  border: "1px solid hsl(var(--wave-light-blue) / 0.5)",
                  borderRadius: "6px",
                  color: "hsl(var(--wave-sand))",
                }}
                labelFormatter={(value, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.timestamp
                  }
                  return ""
                }}
                formatter={(value: number) => [`${value.toFixed(2)} ${metric.unit}`, name]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={`hsl(var(--wave-${(currentValue - metric.min) / (metric.max - metric.min) < 0.3 ? "coral" : (currentValue - metric.min) / (metric.max - metric.min) > 0.7 ? "button-auto" : "seafoam"}))`}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: `hsl(var(--wave-${(currentValue - metric.min) / (metric.max - metric.min) < 0.3 ? "coral" : (currentValue - metric.min) / (metric.max - metric.min) > 0.7 ? "button-auto" : "seafoam"}))`,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function ViewerMetricsSection({ module }: ViewerMetricsSectionProps) {
  const [isLive, setIsLive] = useState(true)

  if (!module.metrics || Object.keys(module.metrics).length === 0) {
    return (
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
        <CardContent className="pt-6 text-center">
          <BarChart3 className="mx-auto h-16 w-16 text-wave-lightBlue/50 mb-4" />
          <h3 className="text-xl font-semibold text-wave-sand mb-2">No Metrics Available</h3>
          <p className="text-wave-sand/70">This module doesn't have any configured sensors or metrics.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-wave-midBlue/70 border-wave-lightBlue/40">
        <CardHeader>
          <CardTitle className="text-wave-lightBlue flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Metrics Dashboard (View Only)
            </span>
            <Button
              onClick={() => setIsLive(!isLive)}
              className={`${
                isLive
                  ? "bg-wave-coral hover:bg-wave-coral/90 text-white"
                  : "bg-wave-seafoam hover:bg-wave-seafoam/90 text-wave-deepBlue"
              }`}
            >
              {isLive ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(module.metrics).map(([name, metric]) => (
          <MetricCard key={name} name={name} metric={metric} isLive={isLive} />
        ))}
      </div>
    </div>
  )
}
