import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"
import { createClient } from "@/lib/supabase/server"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyMap } from "@/components/property-map"
import { PropertyContact } from "@/components/property-contact"
import { PropertyFeatures } from "@/components/property-features"
import { PropertyActions } from "@/components/property-actions"
import { PropertyStats } from "@/components/property-stats"
import { SimilarProperties } from "@/components/similar-properties"
import { ViewingScheduler } from "@/components/viewing-scheduler"
import { AgentCard } from "@/components/agent-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, MapPin, Bed, Bath, Car, Maximize, DollarSign, Calculator } from "lucide-react"
import { notFound } from "next/navigation"

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch property details
  const { data: property, error: propertyError } = await supabase.from("properties").select("*").eq("id", id).single()

  if (propertyError || !property) {
    notFound()
  }

  // Fetch agent details
  const { data: agent } = await supabase.from("agents").select("*").eq("id", property.agent_id).single()

  // Increment views
  await supabase
    .from("properties")
    .update({ views_count: (property.views_count || 0) + 1 })
    .eq("id", id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Mobile-first Gallery - Full width on mobile */}
        <div className="w-full">
          <PropertyGallery
            images={property.image_urls?.length ? property.image_urls : property.cover_image_url ? [property.cover_image_url] : []}
            title={property.title}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <div className="mb-4">
            <BackButton fallbackUrl="/properties" label="Back to Properties" />
          </div>

          {/* Header Section - Responsive layout */}
          <div className="flex flex-col gap-4 sm:gap-5 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline">{property.listing_type?.replace(/_/g, " ")}</Badge>
                  <Badge variant="outline">{property.property_type?.replace(/_/g, " ")}</Badge>
                  {property.status && <Badge variant="secondary">{property.status}</Badge>}
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-balance">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm md:text-base">
                    {property.street_address ? `${property.street_address}, ` : ""}{property.suburb}, {property.city}
                  </span>
                </div>
                <PropertyStats propertyId={property.id} views={property.views_count || 0} listDate={property.list_date} />
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <p className="text-3xl md:text-4xl font-bold text-primary">{formatPrice(property.price)}</p>
                <PropertyActions
                  propertyId={property.id}
                  propertyTitle={property.title}
                  propertyPrice={property.price}
                  className="w-full md:w-auto"
                />
              </div>
            </div>

            {/* Quick Stats - Responsive grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <Bed className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <p className="text-xl md:text-2xl font-bold">{property.bedrooms}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Bedrooms</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <Bath className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <p className="text-xl md:text-2xl font-bold">{property.bathrooms}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Bathrooms</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <Car className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <p className="text-xl md:text-2xl font-bold">{property.parking_bays ?? 0}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Parking</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <Maximize className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <p className="text-xl md:text-2xl font-bold">{property.floor_size_sqm ?? 0}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">m² Floor</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Responsive two-column layout */}
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {/* Left Column - Main content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Tabs for mobile-friendly organization */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="costs">Costs</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl md:text-2xl font-bold mb-4">About This Property</h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {property.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <PropertyFeatures property={property} />
                </TabsContent>

                <TabsContent value="costs" className="mt-6">
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <h2 className="text-xl md:text-2xl font-bold mb-4">Monthly Costs</h2>
                      <div className="space-y-3">
                        {property.monthly_levy && property.monthly_levy > 0 && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Monthly Levy</span>
                            <span className="font-semibold">{formatCurrency(property.monthly_levy)}</span>
                          </div>
                        )}
                        {property.monthly_rates && property.monthly_rates > 0 && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Municipal Rates & Taxes</span>
                            <span className="font-semibold">{formatCurrency(property.monthly_rates)}</span>
                          </div>
                        )}
                        {(!property.monthly_levy || property.monthly_levy === 0) && (!property.monthly_rates || property.monthly_rates === 0) && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Costs</span>
                            <span className="font-semibold">Contact agent for levies & rates</span>
                          </div>
                        )}
                        <div className="bg-muted/50 p-4 rounded-lg mt-4">
                          <p className="text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4 inline mr-1" />
                            Additional costs may include insurance, utilities, and estate security fees
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Mortgage Calculator CTA */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Can You Afford This Property?</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Use our SA-specific calculator to see your affordability, monthly repayments, and
                        transfer costs including transfer duty and legal fees.
                      </p>
                    </div>
                    <Button asChild size="lg" className="w-full md:w-auto">
                      <a href={`/calculator?price=${property.price}`}>Calculate Affordability</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Neighborhood Insights */}
              {property.suburb && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Explore {property.suburb}</h3>
                        <p className="text-sm text-muted-foreground">
                          View detailed neighborhood reports including demographics, amenities, schools,
                          safety ratings, and local market trends.
                        </p>
                      </div>
                      <Button variant="outline" asChild size="lg" className="w-full md:w-auto">
                        <a href={`/neighborhoods/${property.suburb.toLowerCase().replace(/\s+/g, '-')}`}>
                          View Neighborhood Report
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Map Section - Responsive */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">Location</h2>
                  <div className="h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                    <PropertyMap latitude={property.latitude} longitude={property.longitude} title={property.title} />
                  </div>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="font-semibold mb-1">{property.suburb}</p>
                    <p className="text-sm text-muted-foreground">
                      {property.city}, {property.province} {property.postal_code}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact & Agent - Sticky on desktop */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Contact Form */}
                <PropertyContact property={property} agent={agent} />

                {/* Viewing Scheduler */}
                <ViewingScheduler
                  propertyId={property.id}
                  propertyTitle={property.title}
                  agentId={property.agent_id}
                />

                {/* Agent Card */}
                {agent && <AgentCard agent={agent} />}
              </div>
            </div>
          </div>

          {/* Similar Properties Section */}
          <div className="mt-12">
            <SimilarProperties
              currentPropertyId={property.id}
              suburb={property.suburb}
              city={property.city}
              propertyType={property.property_type}
              price={property.price}
              listingType={property.listing_type}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
