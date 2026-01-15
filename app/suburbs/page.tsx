import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { MapPin } from "lucide-react"

export const metadata = {
  title: "Browse Suburbs | SeekrZA",
  description: "Explore property trends, prices and listings across South Africa's most popular suburbs.",
}

const regions = [
  {
    name: "Western Cape",
    cities: ["Cape Town", "Somerset West", "Stellenbosch", "Paarl", "George"]
  },
  {
    name: "Gauteng",
    cities: ["Johannesburg", "Sandton", "Pretoria", "Midrand", "Centurion"]
  },
  {
    name: "KwaZulu-Natal",
    cities: ["Durban", "Umhlanga", "Ballito", "Richards Bay"]
  }
]

export default function SuburbsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Browse Suburbs</h1>
            <p className="text-muted-foreground text-lg">
              Discover neighborhoods, compare property prices, and find your perfect location across South Africa.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regions.map((region) => (
              <div key={region.name} className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">{region.name}</h2>
                <ul className="space-y-2">
                  {region.cities.map((city) => (
                    <li key={city}>
                      <Link 
                        href={`/suburbs/${region.name.toLowerCase().replace(" ", "-")}/${city.toLowerCase().replace(" ", "-")}`}
                        className="flex items-center text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <MapPin className="h-4 w-4 mr-2 opacity-50 group-hover:opacity-100" />
                        {city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
