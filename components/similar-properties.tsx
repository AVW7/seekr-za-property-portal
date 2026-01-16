"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/property-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Property } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface SimilarPropertiesProps {
  currentPropertyId: string
  suburb: string
  city: string
  propertyType: string
  price: number
  listingType: string
}

export function SimilarProperties({
  currentPropertyId,
  suburb,
  city,
  propertyType,
  price,
  listingType,
}: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    fetchSimilarProperties()
  }, [currentPropertyId])

  const fetchSimilarProperties = async () => {
    try {
      const supabase = createClient()
      const priceRange = price * 0.2 // 20% price variance

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .eq("listing_type", listingType)
        .neq("id", currentPropertyId)
        .or(`suburb.eq.${suburb},city.eq.${city}`)
        .gte("price", price - priceRange)
        .lte("price", price + priceRange)
        .limit(6)

      if (error) throw error
      setProperties((data || []) as Property[])
    } catch (error) {
      console.error("Error fetching similar properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("similar-properties-scroll")
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (properties.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Similar Properties</h2>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Desktop: Horizontal scroll */}
        <div className="hidden md:block relative">
          <div
            id="similar-properties-scroll"
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "thin" }}
          >
            {properties.map((property) => (
              <div key={property.id} className="flex-none w-[350px] snap-start">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Grid */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {properties.slice(0, 4).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
