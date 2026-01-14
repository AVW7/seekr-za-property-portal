import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch properties for market data aggregation
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "active")

    if (propertiesError) {
      throw propertiesError
    }

    // Calculate market trends by month (last 12 months)
    const marketData = calculateMarketTrends(properties || [])

    // Calculate property type performance
    const propertyTypeData = calculatePropertyTypePerformance(properties || [])

    return NextResponse.json({
      marketData,
      propertyTypeData,
    })
  } catch (error) {
    console.error("Error fetching market insights:", error)
    return NextResponse.json(
      { error: "Failed to fetch market insights" },
      { status: 500 }
    )
  }
}

function calculateMarketTrends(properties: any[]) {
  // Group properties by month (using created_at as proxy for listing date)
  const monthlyData: { [key: string]: { total: number; count: number } } = {}

  properties.forEach((property) => {
    const date = new Date(property.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { total: 0, count: 0 }
    }

    monthlyData[monthKey].total += Number(property.price)
    monthlyData[monthKey].count += 1
  })

  // Convert to array and calculate average prices
  const trends = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-ZA", {
        month: "short",
        year: "numeric",
      }),
      price: Math.round(data.total / data.count),
      sales: data.count,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(-12) // Last 12 months

  return trends
}

function calculatePropertyTypePerformance(properties: any[]) {
  const typeData: {
    [key: string]: { total: number; count: number; oldTotal: number; oldCount: number }
  } = {}

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  properties.forEach((property) => {
    const type = property.property_type
    const date = new Date(property.created_at)

    if (!typeData[type]) {
      typeData[type] = { total: 0, count: 0, oldTotal: 0, oldCount: 0 }
    }

    if (date >= sixMonthsAgo) {
      typeData[type].total += Number(property.price)
      typeData[type].count += 1
    } else {
      typeData[type].oldTotal += Number(property.price)
      typeData[type].oldCount += 1
    }
  })

  // Convert to array and calculate average prices with changes
  return Object.entries(typeData)
    .map(([type, data]) => {
      const currentAvg = data.count > 0 ? data.total / data.count : 0
      const oldAvg = data.oldCount > 0 ? data.oldTotal / data.oldCount : currentAvg
      const change = oldAvg > 0 ? ((currentAvg - oldAvg) / oldAvg) * 100 : 0

      return {
        type: type.charAt(0).toUpperCase() + type.slice(1),
        averagePrice: Math.round(currentAvg),
        count: data.count,
        change: Math.round(change * 10) / 10,
      }
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.averagePrice - a.averagePrice)
}
