"use client"

import { useState, useEffect } from "react"
import type { Module, ModuleMetric } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, BarChart3, Gauge } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface OperatorMetricsSectionProps {
  module: Module
}

interface MetricCardProps {
  name: string
  metric: ModuleMetric
  isLive: boolean
  onToggleLive: () => void
}

function MetricCard({ name, metric, isLive, onToggleLive }: MetricCardProps) {
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
      <CardHeader className="pb-3">
        <CardTitle className="text-wave-lightBlue capitalize flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {name}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-wave-sand/60 hover:text-wave-sand hover:bg-wave-lightBlue/10"
            onClick={onToggleLive}
          >
            {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </Button>
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
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#233047" />
              <XAxis
                dataKey="timestamp"
                tick={{ fill: "#b6c6e3", fontSize: 13 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={{ stroke: "#334155" }}
              />
              <YAxis
                tick={{ fill: "#b6c6e3", fontSize: 13 }}
                domain={[metric.min, metric.max]}
                axisLine={{ stroke: "#334155" }}
                tickLine={{ stroke: "#334155" }}
              />
              <Tooltip contentStyle={{ background: "#1e293b", border: "none", color: "#f1f5f9" }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#colorValue)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function OperatorMetricsSection({ module }: OperatorMetricsSectionProps) {
  const [isLive, setIsLive] = useState(true)

  if (!module || !module.metrics || Object.keys(module.metrics).length === 0) {
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(module.metrics).map(([name, metric]) => (
          <MetricCard key={name} name={name} metric={metric} isLive={isLive} onToggleLive={() => setIsLive(!isLive)} />
        ))}
      </div>
    </div>
  )
}
