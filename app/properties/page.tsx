import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import PropertyCard from "@/components/property-card"
import { MobilePropertyFilters } from "@/components/mobile-property-filters"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

  const listingTypeParam = typeof params.listing_type === "string" ? params.listing_type : undefined
  const legacyListingType = typeof params.type === "string" ? params.type : undefined
  const propertyTypeParam = typeof params.property_type === "string" ? params.property_type : undefined
  const cityParam = typeof params.city === "string" ? params.city : undefined
  const provinceParam = typeof params.province === "string" ? params.province : undefined
  const minPriceParam = typeof params.min_price === "string" ? Number(params.min_price) : undefined
  const maxPriceParam = typeof params.max_price === "string" ? Number(params.max_price) : undefined
  const bedroomsMinParam = typeof params.bedrooms_min === "string" ? Number(params.bedrooms_min) : undefined

  // Apply filters based on search params
  const listingTypeValue = listingTypeParam ?? legacyListingType
  if (listingTypeValue) {
    query = query.eq("listing_type", listingTypeValue)
  }
  if (propertyTypeParam) {
    query = query.eq("property_type", propertyTypeParam)
  }
  if (cityParam) {
    query = query.ilike("city", `%${cityParam}%`)
  }
  if (provinceParam) {
    query = query.eq("province", provinceParam)
  }
  if (Number.isFinite(minPriceParam)) {
    query = query.gte("price", minPriceParam as number)
  }
  if (Number.isFinite(maxPriceParam)) {
    query = query.lte("price", maxPriceParam as number)
  }
  if (Number.isFinite(bedroomsMinParam)) {
    query = query.gte("bedrooms", bedroomsMinParam as number)
  }

  const featureChecks: Array<[string, string]> = [
    ["solar", "solar"],
    ["inverter", "inverter"],
    ["fiber", "fiber"],
    ["pet_friendly", "pet_friendly"],
    ["furnished", "furnished"],
    ["garden", "garden"],
    ["pool", "pool"],
    ["security", "security"],
    ["estate", "in_estate"],
  ]

  featureChecks.forEach(([paramKey, featureKey]) => {
    const value = params[paramKey]
    if (value === "1" || value === "true") {
      query = query.contains("features", { [featureKey]: true })
    }
  })

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
              <form method="get" className="sticky top-20 space-y-6 border rounded-lg p-5 md:p-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" placeholder="Cape Town" defaultValue={cityParam || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Input id="province" name="province" placeholder="Western Cape" defaultValue={provinceParam || ""} />
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="flex gap-2">
                    <Input name="min_price" placeholder="Min" type="number" defaultValue={params.min_price as string | undefined} />
                    <Input name="max_price" placeholder="Max" type="number" defaultValue={params.max_price as string | undefined} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listing_type">Listing Type</Label>
                  <select
                    id="listing_type"
                    name="listing_type"
                    defaultValue={listingTypeParam || legacyListingType || ""}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="for_sale">For Sale</option>
                    <option value="to_rent">To Rent</option>
                    <option value="sold">Sold</option>
                    <option value="leased">Leased</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <select
                    id="property_type"
                    name="property_type"
                    defaultValue={propertyTypeParam || ""}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All types</option>
                    <option value="house">House</option>
                    <option value="apartment_flat">Apartment/Flat</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms_min">Bedrooms</Label>
                  <select
                    id="bedrooms_min"
                    name="bedrooms_min"
                    defaultValue={params.bedrooms_min as string | undefined}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label>Features</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input id="solar" name="solar" type="checkbox" value="1" defaultChecked={params.solar === "1" || params.solar === "true"} />
                      <label htmlFor="solar" className="text-sm cursor-pointer">
                        Solar Power
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="inverter" name="inverter" type="checkbox" value="1" defaultChecked={params.inverter === "1" || params.inverter === "true"} />
                      <label htmlFor="inverter" className="text-sm cursor-pointer">
                        Inverter Backup
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="fiber" name="fiber" type="checkbox" value="1" defaultChecked={params.fiber === "1" || params.fiber === "true"} />
                      <label htmlFor="fiber" className="text-sm cursor-pointer">
                        Fiber Internet
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="pet_friendly" name="pet_friendly" type="checkbox" value="1" defaultChecked={params.pet_friendly === "1" || params.pet_friendly === "true"} />
                      <label htmlFor="pet_friendly" className="text-sm cursor-pointer">
                        Pet Friendly
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="furnished" name="furnished" type="checkbox" value="1" defaultChecked={params.furnished === "1" || params.furnished === "true"} />
                      <label htmlFor="furnished" className="text-sm cursor-pointer">
                        Furnished
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="garden" name="garden" type="checkbox" value="1" defaultChecked={params.garden === "1" || params.garden === "true"} />
                      <label htmlFor="garden" className="text-sm cursor-pointer">
                        Garden
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="pool" name="pool" type="checkbox" value="1" defaultChecked={params.pool === "1" || params.pool === "true"} />
                      <label htmlFor="pool" className="text-sm cursor-pointer">
                        Pool
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="security" name="security" type="checkbox" value="1" defaultChecked={params.security === "1" || params.security === "true"} />
                      <label htmlFor="security" className="text-sm cursor-pointer">
                        Security
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="estate" name="estate" type="checkbox" value="1" defaultChecked={params.estate === "1" || params.estate === "true"} />
                      <label htmlFor="estate" className="text-sm cursor-pointer">
                        In Estate
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="w-full">Apply Filters</Button>
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <a href="/properties">Reset</a>
                  </Button>
                </div>
              </form>
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
