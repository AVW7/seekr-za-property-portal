"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PropertyTypeData } from "@/lib/types"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PropertyTypePerformanceProps {
  data: PropertyTypeData[]
}

export function PropertyTypePerformance({ data }: PropertyTypePerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Type Performance</CardTitle>
        <CardDescription>Average prices by property type (last 6 months)</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis tickFormatter={(value) => `R${(value / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value: number) =>
                    new Intl.NumberFormat("en-ZA", {
                      style: "currency",
                      currency: "ZAR",
                      minimumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Bar dataKey="averagePrice" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              {data.map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.count} listings</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">
                      {new Intl.NumberFormat("en-ZA", {
                        style: "currency",
                        currency: "ZAR",
                        minimumFractionDigits: 0,
                      }).format(item.averagePrice)}
                    </p>
                    <Badge
                      variant={item.change >= 0 ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {item.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(item.change)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No property type data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
