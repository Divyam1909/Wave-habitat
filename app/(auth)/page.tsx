// In app/(auth)/page.tsx

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Waves } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export default function AuthenticationPage() {
  const [view, setView] = useState<"login" | "register">("login")

  const formVariants = {
    initial: { opacity: 0, x: view === 'login' ? -100 : 100 },
    animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
    exit: { opacity: 0, x: view === 'login' ? 100 : -100, transition: { duration: 0.2 } },
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        {/* Main App Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-wave-lightBlue transition-colors">
            <Waves className="h-10 w-10 text-wave-lightBlue" />
            <h1 className="text-4xl font-bold">Wave Habitat</h1>
          </Link>
          <p className="text-wave-sand/70 mt-2">Dive into seamless module management.</p>
        </div>

        {/* Card Container */}
        <div className="relative w-full h-[480px] overflow-hidden rounded-xl bg-wave-midBlue/70 backdrop-blur-lg shadow-2xl border border-wave-lightBlue/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full p-8"
            >
              {view === "login" ? (
                <LoginForm onShowRegister={() => setView("register")} />
              ) : (
                <RegisterForm onShowLogin={() => setView("login")} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}