import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import PropertyCard from "@/components/property-card"
import { MobilePropertyFilters } from "@/components/mobile-property-filters"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter } from "lucide-react"
import type { Property } from "@/lib/types"

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Fetch properties from Supabase
  let query = supabase.from("properties").select("*").eq("status", "active").order("created_at", { ascending: false })

  // Apply filters based on search params
  if (params.type && typeof params.type === 'string') {
    query = query.eq("listing_type", params.type)
  }
  if (params.city && typeof params.city === 'string') {
    query = query.ilike("city", `%${params.city}%`)
  }

  const { data, error } = await query
  const properties = (data || []) as unknown as Property[]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Browse Properties</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{properties?.length || 0} properties found</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20 space-y-6 border rounded-lg p-5 md:p-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" type="number" />
                    <Input placeholder="Max" type="number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="plot">Land & Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Features</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="solar" />
                      <label htmlFor="solar" className="text-sm cursor-pointer">
                        Solar Power
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="inverter" />
                      <label htmlFor="inverter" className="text-sm cursor-pointer">
                        Inverter Backup
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="fiber" />
                      <label htmlFor="fiber" className="text-sm cursor-pointer">
                        Fiber Internet
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="verified" />
                      <label htmlFor="verified" className="text-sm cursor-pointer">
                        Verified Only
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="estate" />
                      <label htmlFor="estate" className="text-sm cursor-pointer">
                        In Estate
                      </label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </aside>

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              <MobilePropertyFilters />

              {error && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Error loading properties. Please try again.</p>
                </div>
              )}

              {!error && properties && properties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No properties found matching your criteria.</p>
                </div>
              )}

              {!error && properties && properties.length > 0 && (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
