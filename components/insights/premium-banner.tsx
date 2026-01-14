import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, TrendingUp, BarChart3, Globe } from "lucide-react"
import Link from "next/link"

export function PremiumBanner() {
  return (
    <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Unlock Premium Insights</CardTitle>
              <Badge variant="default" className="ml-2">
                Pro
              </Badge>
            </div>
            <CardDescription className="text-base max-w-2xl">
              Get access to advanced market analytics, AI-powered price predictions, and exclusive suburb
              reports to make smarter property decisions.
            </CardDescription>
          </div>
          <Button size="lg" className="hidden md:flex">
            Upgrade Now
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Price Predictions</p>
              <p className="text-sm text-muted-foreground">AI-powered forecasts for your target areas</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Advanced Analytics</p>
              <p className="text-sm text-muted-foreground">Deep dive into market trends and patterns</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-semibold">Suburb Reports</p>
              <p className="text-sm text-muted-foreground">Comprehensive neighborhood analysis</p>
            </div>
          </div>
        </div>
        <Button size="lg" className="w-full md:hidden">
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  )
}
