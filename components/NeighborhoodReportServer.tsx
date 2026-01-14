'use client'

import { NeighborhoodReport } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  TrendingUp,
  Users,
  School,
  UtensilsCrossed,
  Bus,
  Star,
  AlertTriangle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface NeighborhoodReportServerProps {
  neighborhood: NeighborhoodReport
}

export default function NeighborhoodReportServer({ neighborhood }: NeighborhoodReportServerProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5" />
          <span>
            {neighborhood.city}
            {neighborhood.province && `, ${neighborhood.province}`}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">{neighborhood.name}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{neighborhood.description}</p>

        {/* Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {neighborhood.highlights.map((highlight) => (
            <Badge key={highlight} variant="secondary" className="text-sm">
              {highlight}
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{neighborhood.average_price}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">{neighborhood.price_change}</span> vs last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Walk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{neighborhood.walk_score}/100</div>
            <Progress value={neighborhood.walk_score} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Crime Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {neighborhood.crime_rate}
              {neighborhood.crime_rate === "Low" && <AlertTriangle className="h-5 w-5 text-green-500" />}
              {neighborhood.crime_rate === "Medium" && (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              {neighborhood.crime_rate === "High" && <AlertTriangle className="h-5 w-5 text-red-500" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Population</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{neighborhood.population.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Median age: {neighborhood.median_age}</p>
          </CardContent>
        </Card>
      </div>

      {/* Price History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={neighborhood.price_history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Demographics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Families</span>
                <span className="text-sm font-semibold">{neighborhood.demographics.families}%</span>
              </div>
              <Progress value={neighborhood.demographics.families} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Young Professionals</span>
                <span className="text-sm font-semibold">
                  {neighborhood.demographics.young_professionals}%
                </span>
              </div>
              <Progress value={neighborhood.demographics.young_professionals} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Retirees</span>
                <span className="text-sm font-semibold">{neighborhood.demographics.retirees}%</span>
              </div>
              <Progress value={neighborhood.demographics.retirees} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {neighborhood.amenities.map((amenity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{amenity.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="outline" className="text-xs">
                      {amenity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{amenity.distance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <School className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{neighborhood.schools}</p>
                <p className="text-xs text-muted-foreground">Schools</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{neighborhood.restaurants}</p>
                <p className="text-xs text-muted-foreground">Restaurants</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transport Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Transport Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {neighborhood.transport_links.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{link.name}</p>
                  <p className="text-sm text-muted-foreground">{link.type}</p>
                </div>
                <Badge variant="secondary">{link.distance}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Local Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Local Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {neighborhood.local_insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{insight.title}</h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < insight.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{insight.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
