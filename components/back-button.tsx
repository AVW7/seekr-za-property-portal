"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  fallbackUrl?: string
  label?: string
  variant?: "default" | "outline" | "ghost" | "link"
  className?: string
}

export function BackButton({ fallbackUrl = "/", label = "Back", variant = "ghost", className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to a specific URL if no history
      router.push(fallbackUrl)
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleBack}
      className={`gap-2 ${className}`}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )
}
