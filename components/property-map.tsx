"use client"

import { useEffect, useRef } from "react"

interface PropertyMapProps {
  latitude: number
  longitude: number
  title: string
}

export function PropertyMap({ latitude, longitude, title }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Dynamically import mapbox-gl
    import("mapbox-gl").then((mapboxgl) => {
      if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        console.warn("[v0] Mapbox token not found. Add NEXT_PUBLIC_MAPBOX_TOKEN to environment variables.")
        return
      }

      mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [longitude, latitude],
        zoom: 14,
      })

      // Add marker
      new mapboxgl.default.Marker({ color: "#10b981" })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.default.Popup().setHTML(`<strong>${title}</strong>`))
        .addTo(map.current)

      // Add navigation controls
      map.current.addControl(new mapboxgl.default.NavigationControl(), "top-right")
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [latitude, longitude, title])

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />
}
