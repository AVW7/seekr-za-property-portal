import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, TrendingUp, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PricePredictions() {
  const predictions = [
    { area: "Cape Town CBD", prediction: "+12.5%", confidence: "High", locked: false },
    { area: "Sandton", prediction: "+9.8%", confidence: "High", locked: false },
    { area: "Umhlanga", prediction: "+8.2%", confidence: "Medium", locked: true },
    { area: "Stellenbosch", prediction: "+7.1%", confidence: "Medium", locked: true },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Price Predictions
            </CardTitle>
            <CardDescription>12-month growth forecasts</CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Pro
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {predictions.map((prediction) => (
            <div
              key={prediction.area}
              className={`p-4 border rounded-lg ${prediction.locked ? "opacity-50 relative" : ""}`}
            >
              {prediction.locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{prediction.area}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {prediction.confidence} confidence
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    {prediction.prediction}
                  </div>
                  <p className="text-xs text-muted-foreground">next 12 months</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4">
          <Lock className="mr-2 h-4 w-4" />
          Unlock All Predictions
        </Button>
      </CardContent>
    </Card>
  )
}
