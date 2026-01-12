"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("[v0] Theme system mounted. Current theme:", theme, "Resolved theme:", resolvedTheme)
  }, [theme, resolvedTheme])

  const handleToggle = () => {
    const currentTheme = resolvedTheme || theme || "light"
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    console.log("[v0] Toggling theme from", currentTheme, "to", newTheme)
    setTheme(newTheme)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative"
    >
      <Sun className={`h-5 w-5 transition-all ${isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
      <Moon className={`absolute h-5 w-5 transition-all ${isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
    </Button>
  )
}
