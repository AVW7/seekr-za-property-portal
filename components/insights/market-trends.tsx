"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MarketData } from "@/lib/types"

interface MarketTrendsProps {
  data: MarketData[]
}

export function MarketTrends({ data }: MarketTrendsProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Market Price Trends</CardTitle>
        <CardDescription>Average property prices over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => `R${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                    minimumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No market data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
