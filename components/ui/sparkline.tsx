"use client"

import { useEffect, useRef } from "react"

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  strokeWidth?: number
  className?: string
}

export function Sparkline({ data, width = 100, height = 40, strokeWidth = 1.5, className = "" }: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length < 2) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Find min and max values
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1 // Avoid division by zero

    // Calculate x and y coordinates
    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * width,
      y: height - ((value - min) / range) * (height - 10) - 5, // Leave 5px margin top and bottom
    }))

    // Draw line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = "hsl(150, 60%, 55%)"
    ctx.stroke()

    // Draw gradient area under the line
    ctx.lineTo(points[points.length - 1].x, height)
    ctx.lineTo(points[0].x, height)
    ctx.closePath()
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "hsla(150, 60%, 55%, 0.3)")
    gradient.addColorStop(1, "hsla(150, 60%, 55%, 0)")
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw dots at data points
    ctx.fillStyle = "hsl(150, 60%, 55%)"
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw the last point with a larger dot
    const lastPoint = points[points.length - 1]
    ctx.beginPath()
    ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2)
    ctx.fillStyle = "hsl(195, 60%, 65%)"
    ctx.fill()
    ctx.strokeStyle = "hsl(220, 60%, 15%)"
    ctx.lineWidth = 1
    ctx.stroke()
  }, [data, width, height, strokeWidth])

  return (
    <div className={`inline-block ${className}`}>
      <canvas ref={canvasRef} style={{ width: `${width}px`, height: `${height}px` }} className="rounded" />
    </div>
  )
}
