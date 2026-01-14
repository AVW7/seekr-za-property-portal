import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import NeighborhoodReportServer from "@/components/NeighborhoodReportServer"
import { NeighborhoodReport } from "@/lib/types"

// Mock neighborhood data - replace with actual database query when neighborhoods table is created
const mockNeighborhoods: Record<string, NeighborhoodReport> = {
  "1": {
    id: 1,
    name: "Sandton",
    city: "Johannesburg",
    province: "Gauteng",
    description: "Sandton is Johannesburg's premier business and residential district, known for its upscale shopping, world-class restaurants, and luxury accommodations.",
    average_price: "R 4,500,000",
    price_change: "+12%",
    highlights: ["Business Hub", "Luxury Living", "Shopping Center", "Safe Neighborhood"],
    walk_score: 75,
    crime_rate: "Low",
    schools: 15,
    restaurants: 200,
    population: 85000,
    median_age: 35,
    price_history: [
      { year: 2020, price: "R 3,500,000" },
      { year: 2021, price: "R 3,800,000" },
      { year: 2022, price: "R 4,000,000" },
      { year: 2023, price: "R 4,200,000" },
      { year: 2024, price: "R 4,500,000" },
    ],
    amenities: [
      { name: "Sandton City", type: "Shopping Mall", distance: "1.2 km" },
      { name: "Nelson Mandela Square", type: "Shopping & Dining", distance: "1.5 km" },
      { name: "Sandton Clinic", type: "Hospital", distance: "2.0 km" },
      { name: "Morningside Mediclinic", type: "Hospital", distance: "3.5 km" },
    ],
    demographics: {
      families: 45,
      young_professionals: 40,
      retirees: 15,
    },
    transport_links: [
      { name: "Sandton Gautrain Station", type: "Train", distance: "800m" },
      { name: "Sandton Bus Terminal", type: "Bus", distance: "1.2 km" },
    ],
    local_insights: [
      {
        title: "Excellent for Business Professionals",
        content: "Perfect location for those working in Johannesburg's financial district. Close to major offices and business centers.",
        rating: 5,
      },
      {
        title: "Great Amenities",
        content: "World-class shopping, dining, and entertainment options within walking distance.",
        rating: 5,
      },
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
}

export default async function NeighborhoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Get neighborhood from mock data
  const neighborhoodData = mockNeighborhoods[id]

  if (!neighborhoodData) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container px-4 py-8 mx-auto max-w-6xl">
          <BackButton />
          <div className="mt-6">
            <NeighborhoodReportServer neighborhood={neighborhoodData} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
