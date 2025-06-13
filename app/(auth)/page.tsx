// Create file at: app/page.tsx

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/dashboard")
      } else {
        // This will now work again because app/login/page.tsx exists
        router.replace("/login")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-wave-deepBlue">
      <Loader2 className="h-12 w-12 animate-spin text-wave-lightBlue" />
    </div>
  )
}