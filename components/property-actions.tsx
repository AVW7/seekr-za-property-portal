"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface PropertyActionsProps {
  propertyId: string
  propertyTitle: string
  propertyPrice: number
  className?: string
}

export function PropertyActions({
  propertyId,
  propertyTitle,
  propertyPrice,
  className,
}: PropertyActionsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      checkIfSaved()
    }
  }, [user, propertyId])

  const checkIfSaved = async () => {
    if (!user) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("saved_properties")
        .select("id")
        .eq("user_id", user.id)
        .eq("property_id", propertyId)
        .maybeSingle()

      if (!error && data) {
        setIsSaved(true)
      }
    } catch (error) {
      console.error("Error checking saved status:", error)
    }
  }

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save properties",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from("saved_properties")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", propertyId)

        if (error) throw error

        setIsSaved(false)
        toast({
          title: "Removed from saved",
          description: "Property removed from your saved list",
        })
      } else {
        // Add to saved
        const { error } = await supabase.from("saved_properties").insert({
          user_id: user.id,
          property_id: propertyId,
        })

        if (error) throw error

        setIsSaved(true)
        toast({
          title: "Saved!",
          description: "Property added to your saved list",
        })
      }
    } catch (error: any) {
      console.error("Error toggling save:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save property",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    const url = window.location.href

    // Check if Web Share API is available (mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          text: `Check out this property: ${propertyTitle} - R${propertyPrice.toLocaleString()}`,
          url: url,
        })
        
        toast({
          title: "Shared!",
          description: "Property shared successfully",
        })
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error)
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Property link copied to clipboard",
        })
      } catch (error) {
        console.error("Error copying to clipboard:", error)
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        className="flex-1 md:flex-none bg-transparent"
        onClick={handleSave}
        disabled={isLoading}
        aria-label={isSaved ? "Remove from saved" : "Save property"}
      >
        <Heart
          className={cn("h-4 w-4", isSaved && "fill-current text-destructive")}
        />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="flex-1 md:flex-none bg-transparent"
        onClick={handleShare}
        aria-label="Share property"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
