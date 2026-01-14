"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp } from "lucide-react"
import Link from "next/link"

export function MapVisualization() {
  const hotspots = [
    { name: "Camps Bay", city: "Cape Town", growth: "+8.2%", color: "bg-red-500" },
    { name: "Sandton", city: "Johannesburg", growth: "+9.8%", color: "bg-orange-500" },
    { name: "Umhlanga", city: "Durban", growth: "+7.5%", color: "bg-yellow-500" },
    { name: "Stellenbosch", city: "Cape Winelands", growth: "+6.1%", color: "bg-green-500" },
    { name: "Waterfall", city: "Johannesburg", growth: "+11.2%", color: "bg-red-600" },
    { name: "Ballito", city: "KZN North Coast", growth: "+5.8%", color: "bg-green-400" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Regional Hotspots
        </CardTitle>
        <CardDescription>Top performing areas across South Africa</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder */}
        <div className="relative h-[400px] bg-muted/30 rounded-lg mb-6 flex items-center justify-center border-2 border-dashed">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Interactive map visualization</p>
            <p className="text-sm text-muted-foreground">Heat map showing property price growth by region</p>
          </div>
        </div>

        {/* Hotspot List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotspots.map((hotspot) => (
            <Link
              key={hotspot.name}
              href={`#${hotspot.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="block"
            >
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${hotspot.color}`} />
                      <p className="font-semibold">{hotspot.name}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {hotspot.growth}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{hotspot.city}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
