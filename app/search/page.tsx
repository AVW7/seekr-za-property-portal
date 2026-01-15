import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchFilters } from "@/components/search-filters"
import { BuyAbilityInline } from "@/components/buy-ability-inline"
import { SearchMap } from "@/components/search-map"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { createClient } from "@/lib/supabase/server"
import { MobilePropertyFilters } from "@/components/mobile-property-filters"
import { SearchWithPersona } from "@/components/search-with-persona"
import { Brain, Sparkles, Save, Bell, SlidersHorizontal, ChevronDown } from "lucide-react"

export const metadata = {
  title: "AI-Powered Property Search | SeekrZA",
  description: "Find your perfect property with AI-powered smart search, personalized personas, and tiered filters.",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Start with base query
  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Apply filters based on search params
  
  // 1. Intent (Buy vs Rent)
  // properly map URL params to database enum values ("for_sale", "to_rent")
  const intent = typeof params.intent === 'string' ? params.intent : 'buy'
  const listingType = intent === 'rent' ? 'to_rent' : 'for_sale'
  
  query = query.eq("listing_type", listingType)

  // 2. Property Type / Development
  if (params.type) {
    // If specifically looking for developments
    if (params.type === 'development') {
      // Search for developments in likely fields since it might not be a strict property_type
      // Using text search on description/title if strictly 'development' type doesn't exist
      query = query.ilike('description', '%development%')
    } else {
      query = query.eq("property_type", params.type)
    }
  }

  // 3. Special Filters (On Show, Bank Assisted, FSBO)
  if (params.filter) {
    const filter = params.filter
    if (filter === 'on-show') {
      // This would ideally check a dedicated column or features JSON
      // For now, we'll check if description mentions "on show" if no structured data
      query = query.ilike('description', '%on show%') 
    } else if (filter === 'bank-assisted') {
      // Using or to combine conditions might be tricky with simple chaining in some clients, 
      // but let's try a broad ilike matches or just one common term for now to be safe.
      // Since we can't easily do OR on the same column with ilike in one chain without filter(), 
      // we will search for the most common term.
      query = query.ilike('description', '%bank%')
    } else if (filter === 'owner-listed') {
      // FSBO
      query = query.ilike('description', '%private%')
    }
  }

  // Execute query
  const { data: properties } = await query.limit(20)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Top Bar with Title and Actions */}
        <div className="border-b bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">Smart Search</h1>
                    <Badge variant="secondary" className="text-xs">
                      <Brain className="mr-1 h-3 w-3" />
                      AI-Powered
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {properties?.length || 0} properties matched to your preferences
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save Persona
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Set Alerts
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
             {/* Left Panel: Property Results */}
             <div className="w-full lg:w-[500px] xl:w-[600px] flex flex-col border-r bg-background overflow-y-auto">
                {/* Active Persona Banner */}
                <SearchWithPersona />
                
                {/* Results Header Bar */}
                <div className="p-4 border-b space-y-3 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                    {/* Filters Toggle & Sort */}
                    <div className="flex items-center justify-between gap-4">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                              <SlidersHorizontal className="mr-2 h-4 w-4" />
                              Filters
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="left" className="w-[350px] sm:w-[400px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Search Filters</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                              <SearchFilters />
                            </div>
                          </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-2">
                          <Select defaultValue="relevance">
                            <SelectTrigger className="w-[140px] h-9">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="relevance">
                                <div className="flex items-center gap-2">
                                  <Brain className="h-3 w-3" />
                                  Best Match
                                </div>
                              </SelectItem>
                              <SelectItem value="newest">Newest First</SelectItem>
                              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                    </div>

                    {/* BuyAbility Calculator - Collapsible */}
                    <Collapsible defaultOpen={false}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full justify-between">
                          <span className="text-sm font-medium">BuyAbility™ Calculator</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-3">
                        <BuyAbilityInline />
                      </CollapsibleContent>
                    </Collapsible>
                </div>

                {/* Property List */}
                <div className="p-4 space-y-4">
                        {properties && properties.length > 0 ? (
                            properties.map((property, index) => (
                              <div key={property.id} className="relative">
                                {index === 0 && (
                                  <Badge 
                                    variant="default" 
                                    className="absolute -top-2 right-2 z-10 shadow-md"
                                  >
                                    <Sparkles className="mr-1 h-3 w-3" />
                                    Top Match
                                  </Badge>
                                )}
                                <PropertyCard property={property as any} />
                              </div>
                            ))
                        ) : (
                            <div className="text-center py-12 space-y-4">
                                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                  <Brain className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                  <h3 className="font-semibold text-lg">No results found</h3>
                                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                    Try adjusting your filters or broaden your search criteria. Our AI will learn your preferences over time.
                                  </p>
                                </div>
                                <Button variant="outline">
                                  Reset Filters
                                </Button>
                            </div>
                        )}
                        
                        {/* Placeholder for no data */}
                        {(!properties || properties.length === 0) && (
                           <div className="p-6 border-2 border-dashed rounded-lg text-center space-y-2">
                              <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Properties will appear here when connected to Supabase
                              </p>
                           </div>
                        )}
                </div>
                
                <div className="p-4 mt-auto border-t">
                    <Footer />
                </div>
             </div>

             {/* Right Panel: Map */}
             <div className="hidden lg:block flex-1 relative bg-slate-100">
                <SearchMap />
                
                {/* Floating Map Controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                   <Button variant="secondary" size="sm" className="shadow-lg">
                     <Sparkles className="mr-2 h-4 w-4" />
                     Draw Search Area
                   </Button>
                   <Button variant="secondary" size="sm" className="shadow-lg">
                     View Insights
                   </Button>
                </div>
                
                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 z-10 bg-card rounded-lg shadow-lg p-3 space-y-2 text-xs">
                  <div className="font-semibold mb-2">Map Legend</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Top Matches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span>Good Matches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                    <span>Other Properties</span>
                  </div>
                </div>
             </div>
        </div>
      </main>
    </div>
  )
}
