"use client"

import { useState, useEffect } from "react"
import { PremiumBanner } from "@/components/insights/premium-banner"
import { NationalStats } from "@/components/insights/national-stats"
import { MarketTrends } from "@/components/insights/market-trends"
import { PropertyTypePerformance } from "@/components/insights/property-type-performance"
import { PricePredictions } from "@/components/insights/price-predictions"
import { MarketReports } from "@/components/insights/market-reports"
import { MapVisualization } from "@/components/insights/map-visualization"
import { AnimatedWrapper } from "@/components/insights/animated-wrapper"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function InsightsPage() {
  const [marketData, setMarketData] = useState([])
  const [propertyTypeData, setPropertyTypeData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/market-insights")
        const data = await res.json()
        setMarketData(data.marketData)
        setPropertyTypeData(data.propertyTypeData)
      } catch (error) {
        console.error("Failed to fetch market insights:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-2xl font-semibold">Loading Market Insights...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container px-4 py-12 mx-auto">
          {/* Header */}
          <AnimatedWrapper index={1}>
            <div className="text-center mb-12">
              <h1 className="text-5xl font-extrabold tracking-tight mb-4">Market Insights</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your comprehensive guide to the South African property market.
              </p>
            </div>
          </AnimatedWrapper>

          <AnimatedWrapper index={2}>
            <PremiumBanner />
          </AnimatedWrapper>

          <AnimatedWrapper index={3}>
            <NationalStats />
          </AnimatedWrapper>

          <AnimatedWrapper index={4}>
            <MarketTrends data={marketData} />
          </AnimatedWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <AnimatedWrapper index={5}>
                <PropertyTypePerformance data={propertyTypeData} />
              </AnimatedWrapper>
            </div>
            <div className="lg:col-span-2">
              <AnimatedWrapper index={6}>
                <PricePredictions />
              </AnimatedWrapper>
            </div>
          </div>

          <AnimatedWrapper index={7}>
            <MarketReports />
          </AnimatedWrapper>

          <AnimatedWrapper index={8}>
            <MapVisualization />
          </AnimatedWrapper>
        </div>
      </main>
      <Footer />
    </div>
  )
}
