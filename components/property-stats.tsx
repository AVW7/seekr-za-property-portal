"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Clock, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface PropertyStatsProps {
  propertyId: string
  views: number
  listDate?: string
}

export function PropertyStats({ propertyId, views, listDate }: PropertyStatsProps) {
  const [savedCount, setSavedCount] = useState(0)
  const [viewsToday, setViewsToday] = useState(0)

  useEffect(() => {
    fetchStats()
  }, [propertyId])

  const fetchStats = async () => {
    try {
      const supabase = createClient()

      // Get saved count
      const { count: savedCount } = await supabase
        .from("saved_properties")
        .select("*", { count: "exact", head: true })
        .eq("property_id", propertyId)

      setSavedCount(savedCount || 0)

      // Simulate views today (in production, this would track daily views)
      setViewsToday(Math.floor(views * 0.1) || Math.floor(Math.random() * 20) + 5)
    } catch (error) {
      console.error("Error fetching property stats:", error)
    }
  }

  const getDaysOnMarket = () => {
    if (!listDate) return null
    const listed = new Date(listDate)
    const today = new Date()
    const days = Math.floor((today.getTime() - listed.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const daysOnMarket = getDaysOnMarket()

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      {views > 0 && (
        <Badge variant="secondary" className="gap-1 text-xs">
          <Eye className="h-3 w-3" />
          {views.toLocaleString()} views
        </Badge>
      )}
      
      {viewsToday > 0 && (
        <Badge variant="secondary" className="gap-1 text-xs">
          <TrendingUp className="h-3 w-3" />
          {viewsToday} today
        </Badge>
      )}

      {savedCount > 0 && (
        <Badge variant="secondary" className="gap-1 text-xs">
          <Heart className="h-3 w-3" />
          {savedCount} saved
        </Badge>
      )}

      {daysOnMarket !== null && daysOnMarket >= 0 && (
        <Badge variant="outline" className="gap-1 text-xs">
          <Clock className="h-3 w-3" />
          {daysOnMarket === 0 ? "Listed today" : `${daysOnMarket} days on market`}
        </Badge>
      )}
    </div>
  )
}
