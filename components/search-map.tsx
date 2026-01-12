"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SearchMapProps {
  className?: string
  center?: [number, number] // [lng, lat]
  zoom?: number
}

export function SearchMap({ className, center = [28.0473, -26.2041], zoom = 11 }: SearchMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    import("mapbox-gl").then((mapboxgl) => {
      if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        // Fallback or warning
        return
      }

      mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11", // Using light style as requested
        center: center,
        zoom: zoom,
      })
      
      map.current.addControl(new mapboxgl.default.NavigationControl(), "top-right")

      // Mock data for clustering - in a real app this comes from props/API
      // This is just initializing the map view
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [center, zoom])

  return (
    <div className={cn("relative w-full h-full bg-slate-100 overflow-hidden rounded-lg", className)}>
        {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-slate-100">
                <p>Mapbox Token Required</p>
            </div>
        )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
