"use client"

import type React from "react"

import { motion } from "framer-motion"

export const AnimatedBackground = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={className}>
      <motion.div
        className="absolute inset-0 bg-wave-deepBlue pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, hsl(var(--wave-deep-blue)), hsl(var(--wave-mid-blue)))",
          zIndex: -1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, transparent 20%, hsl(var(--wave-mid-blue)) 70%),
                      radial-gradient(circle at top right, transparent 20%, hsl(var(--wave-deep-blue)) 70%)`,
          zIndex: -1,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" }}
      />
      {children}
    </div>
  )
}
