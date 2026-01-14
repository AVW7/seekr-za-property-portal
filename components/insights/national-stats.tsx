import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Home, DollarSign } from "lucide-react"

export function NationalStats() {
  const stats = [
    {
      label: "Average Property Price",
      value: "R2.85M",
      change: "+6.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      label: "Properties on Market",
      value: "45,231",
      change: "+3.4%",
      trend: "up",
      icon: Home,
    },
    {
      label: "Average Days Listed",
      value: "42 days",
      change: "-8.1%",
      trend: "down",
      icon: TrendingDown,
    },
    {
      label: "Market Growth (YoY)",
      value: "+7.8%",
      change: "+1.2%",
      trend: "up",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">South African Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <stat.icon className="h-4 w-4" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs flex items-center gap-1 mt-1 ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change} vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
