import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import NeighborhoodReportServer, { NeighborhoodReport } from "@/components/NeighborhoodReportServer"

export default async function NeighborhoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch neighborhood data from database
  const { data: neighborhood, error } = await supabase
    .from("neighborhoods")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !neighborhood) {
    notFound()
  }

  // Transform database data to match NeighborhoodReport interface
  const neighborhoodData: NeighborhoodReport = {
    id: parseInt(id),
    name: neighborhood.name,
    city: neighborhood.city,
    province: neighborhood.province,
    description: neighborhood.description || "",
    average_price: neighborhood.average_price || "N/A",
    price_change: neighborhood.price_change || "N/A",
    highlights: neighborhood.highlights || [],
    walk_score: neighborhood.walk_score || 0,
    crime_rate: neighborhood.crime_rate || "N/A",
    schools: neighborhood.schools || 0,
    restaurants: neighborhood.restaurants || 0,
    population: neighborhood.population || 0,
    median_age: neighborhood.median_age || 0,
    price_history: neighborhood.price_history || [],
    amenities: neighborhood.amenities || [],
    demographics: neighborhood.demographics || { families: 0, young_professionals: 0, retirees: 0 },
    transport_links: neighborhood.transport_links || [],
    local_insights: neighborhood.local_insights || [],
    created_at: neighborhood.created_at,
    updated_at: neighborhood.updated_at,
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
