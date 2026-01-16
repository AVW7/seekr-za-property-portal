"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AccountNav } from "@/components/account/account-nav"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/utils/trpc"
import { useAuth } from "@/lib/auth-context"
import { ArrowRight, Bell, BellOff, ExternalLink, Heart, Sparkles, Search } from "lucide-react"
import Link from "next/link"
import type { SearchParams } from "@/lib/types"
import { PersonaOnboarding } from "@/components/persona-onboarding"

export default function ForYouPage() {
  const { user } = useAuth()
  const { data: personaFeeds, isLoading, refetch } = trpc.account.getPersonaFeeds.useQuery(
    { propertiesPerPersona: 6 },
    { enabled: !!user }
  )

  // Get filter badge display text
  const getFilterBadges = (searchParams: SearchParams) => {
    const badges: string[] = []

    if (searchParams.listingType) {
      badges.push(searchParams.listingType === "for_sale" ? "For Sale" : "To Rent")
    }
    if (searchParams.propertyType) {
      badges.push(searchParams.propertyType.replace("_", " "))
    }
    if (searchParams.city) badges.push(searchParams.city)
    if (searchParams.suburb) badges.push(searchParams.suburb)
    if (searchParams.bedrooms) badges.push(`${searchParams.bedrooms}+ beds`)
    if (searchParams.priceMin || searchParams.priceMax) {
      const min = searchParams.priceMin
        ? `R${(searchParams.priceMin / 1000).toFixed(0)}k`
        : ""
      const max = searchParams.priceMax
        ? `R${(searchParams.priceMax / 1000).toFixed(0)}k`
        : ""
      badges.push(min && max ? `${min} - ${max}` : min || max)
    }

    return badges.slice(0, 4) // Limit to 4 badges
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Please sign in</h1>
            <p className="text-muted-foreground">
              You need to be signed in to view your personalized property feeds.
            </p>
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 shrink-0">
              <AccountNav />
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Page Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">Seekr for You</h1>
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="mr-1 h-3 w-3" />
                    AI-Powered
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Your personalized property feeds based on your saved search personas
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {[1, 2, 3].map((j) => (
                            <Skeleton key={j} className="h-80 w-full" />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && (!personaFeeds || personaFeeds.length === 0) && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center space-y-2 max-w-md">
                      <h3 className="text-xl font-semibold">Create Your First Persona</h3>
                      <p className="text-muted-foreground">
                        Get started by creating a search persona. Examples: "Potential Airbnb in
                        Cape Town CBD", "Office Space in Rosebank JHB", or "Storefront in Durban".
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <PersonaOnboarding
                        trigger={
                          <Button>
                            <Search className="mr-2 h-4 w-4" />
                            Create Persona
                          </Button>
                        }
                        onSuccess={refetch}
                      />
                      <Button variant="outline" asChild>
                        <Link href="/account/personas">Manage Personas</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Persona Feeds */}
              {!isLoading &&
                personaFeeds &&
                personaFeeds.map((feed) => {
                  const badges = getFilterBadges(feed.persona.search_params as SearchParams)

                  return (
                    <Card key={feed.persona.id} className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-xl">{feed.persona.name}</CardTitle>
                              {feed.persona.alert_enabled && (
                                <Badge variant="default" className="text-xs">
                                  <Bell className="mr-1 h-3 w-3" />
                                  Alerts On
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {badges.map((badge, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                            <CardDescription>
                              {feed.matchCount} {feed.matchCount === 1 ? "property" : "properties"}{" "}
                              match{feed.matchCount === 1 ? "es" : ""} your criteria
                            </CardDescription>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/search?persona=${feed.persona.id}`}
                                className="whitespace-nowrap"
                              >
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-6">
                        {feed.properties.length === 0 ? (
                          <div className="text-center py-12 space-y-3">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                              <Search className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-medium">No matches yet</h4>
                              <p className="text-sm text-muted-foreground">
                                We'll notify you when properties matching this persona become
                                available
                              </p>
                            </div>
                            {!feed.persona.alert_enabled && (
                              <Button variant="outline" size="sm">
                                <Bell className="mr-2 h-4 w-4" />
                                Enable Alerts
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {feed.properties.map((property) => (
                              <PropertyCard key={property.id} property={property as any} />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}

              {/* Quick Actions */}
              {!isLoading && personaFeeds && personaFeeds.length > 0 && (
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="py-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Want to add more personas?</h3>
                        <p className="text-sm text-muted-foreground">
                          Create more search personas to discover properties tailored to your needs
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" asChild>
                          <Link href="/account/personas">Manage Personas</Link>
                        </Button>
                        <PersonaOnboarding
                          trigger={
                            <Button>
                              <Search className="mr-2 h-4 w-4" />
                              New Persona
                            </Button>
                          }
                          onSuccess={refetch}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
