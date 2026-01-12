import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchFilters } from "@/components/search-filters"
import { BuyAbilityInline } from "@/components/buy-ability-inline"
import { SearchMap } from "@/components/search-map"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/server"
import { MobilePropertyFilters } from "@/components/mobile-property-filters"

export const metadata = {
  title: "Search Properties | SeekrZA",
  description: "Search verified properties across South Africa with SA-specific filters and BuyAbility.",
}

export default async function SearchPage() {
  const supabase = await createClient()

  // Fetch some initial properties (mocking the search results for now)
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .limit(10)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
             {/* Left Panel: Filters & List */}
             <div className="w-full lg:w-[600px] xl:w-[700px] flex flex-col border-r bg-background overflow-y-auto">
                <div className="p-4 border-b space-y-4">
                   <div className="flex items-center justify-between">
                      <h1 className="text-xl font-bold">Search Properties</h1>
                      <div className="flex items-center gap-2">
                         <div className="lg:hidden">
                            <MobilePropertyFilters />
                         </div>
                         <Select defaultValue="relevance">
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="relevance">Best Match</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                            <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                   </div>
                   
                   {/* Mobile Filter Toggle would go here visually if not in header */}
                </div>

                <div className="p-4 space-y-6">
                    {/* Desktop Filters (Collapsible or just visible) */}
                    <div className="hidden lg:block">
                        <SearchFilters />
                    </div>
                    
                    {/* BuyAbility Inline */}
                    <BuyAbilityInline />

                    {/* Results Count & Tags */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{properties?.length || 0} results</span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs">Clear all</Button>
                        </div>
                    </div>

                    {/* Property List */}
                    <div className="space-y-4">
                        {properties && properties.length > 0 ? (
                            properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))
                        ) : (
                            <div className="text-center py-10 space-y-2">
                                <h3 className="font-semibold">No results found</h3>
                                <p className="text-sm text-muted-foreground"> Try broadening your details or adjusting filters.</p>
                            </div>
                        )}
                        
                        {/* Example Placeholder if no DB connection/data yet */}
                        {(!properties || properties.length === 0) && (
                           <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
                              (Properties will appear here when connected to Supabase)
                           </div>
                        )}
                    </div>
                </div>
                
                <div className="p-4 mt-auto">
                    <div className="border-t pt-4">
                        <Footer />
                    </div>
                </div>
             </div>

             {/* Right Panel: Map */}
             <div className="hidden lg:block flex-1 relative bg-slate-100">
                <SearchMap />
                
                {/* Floating Map Actions could go here */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                   <Button variant="secondary" size="sm" className="shadow-sm">Draw Area</Button>
                </div>
             </div>
        </div>
      </main>
    </div>
  )
}
