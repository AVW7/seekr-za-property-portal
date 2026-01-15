import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, Home, TrendingUp } from "lucide-react"

interface PageProps {
  params: Promise<{
    province: string
    city: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const { city, province } = await params
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const provinceName = province.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  
  return {
    title: `Property in ${cityName}, ${provinceName} | SeekrZA`,
    description: `Find properties for sale and rent in ${cityName}. View market trends, sold prices and neighborhood insights.`,
  }
}

export default async function SuburbCityPage({ params }: PageProps) {
  const { city, province } = await params
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const provinceName = province.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/suburbs" className="hover:text-foreground">Suburbs</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="capitalize">{province.replace(/-/g, ' ')}</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="font-medium text-foreground">{cityName}</span>
          </div>

          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">{cityName} Property Market</h1>
            <p className="text-xl text-muted-foreground">
              Explore listings, market trends, and neighborhood insights for {cityName}, {provinceName}.
            </p>
            
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href={`/search?location=${city}`}>
                  <Home className="mr-2 h-4 w-4" />
                  View Properties
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/market/trends">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Market Trends
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-2">Average Price</h3>
                <div className="text-2xl font-bold">R 2.4m</div>
                <p className="text-sm text-muted-foreground mt-1">+3.2% from last year</p>
            </div>
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-2">Active Listings</h3>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-sm text-muted-foreground mt-1">124 new this week</p>
            </div>
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-2">Average Days on Market</h3>
                <div className="text-2xl font-bold">45</div>
                <p className="text-sm text-muted-foreground mt-1 text-green-600">-5 days faster</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
