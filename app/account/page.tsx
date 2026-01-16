'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { Heart, Search, Calculator, Settings, TrendingUp, Bell, Home, AlertCircle } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BackButton } from '@/components/back-button'
import { AccountNav } from '@/components/account/account-nav'
import { trpc } from '@/utils/trpc'

export default function AccountDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Use tRPC to fetch dashboard data
  const { data: dashboardData, isLoading: loading, error } = trpc.account.getDashboardData.useQuery(
    undefined,
    {
      enabled: !!user,
      retry: false,
    }
  )

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const savedPropertiesCount = dashboardData?.stats.savedPropertiesCount || 0
  const savedSearchesCount = dashboardData?.stats.savedSearchesCount || 0
  const activeAlertsCount = dashboardData?.stats.activeAlertsCount || 0
  const recentProperties = dashboardData?.recentProperties || []
  const recentSearches = dashboardData?.recentSearches || []

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Skeleton className="h-10 w-48 mb-6" />
            <Separator className="mb-8" />
            <Skeleton className="h-12 w-64 mb-2" />
            <Skeleton className="h-4 w-96 mb-8" />
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-64 mb-8" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <BackButton fallbackUrl="/" label="Back to SeekrZA" />
            <AccountNav />
          </div>

          <Separator className="mb-8" />

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle>Failed to load dashboard data</AlertTitle>
              <AlertDescription>
                We couldn&rsquo;t retrieve your account information. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Dashboard</h1>
            <p className="text-muted-foreground">
              View your saved properties, manage search personas, and configure account settings
            </p>
          </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-12" /> : savedPropertiesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Properties you&rsquo;ve liked</p>
            <Link href="/saved">
              <Button variant="link" className="px-0 mt-2">
                View all &rarr;
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Personas</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-12" /> : savedSearchesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Saved search profiles</p>
            <Link href="/account/personas">
              <Button variant="link" className="px-0 mt-2">
                Manage personas &rarr;
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-12" /> : activeAlertsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Search alerts enabled</p>
            <Link href="/account/settings">
              <Button variant="link" className="px-0 mt-2">
                Settings &rarr;
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/search">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors">
                <Search className="h-5 w-5" aria-hidden="true" />
                <span>Search Properties</span>
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors">
                <Calculator className="h-5 w-5" aria-hidden="true" />
                <span>BuyAbility Calculator</span>
              </Button>
            </Link>
            <Link href="/account/buyability">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
                <span>My BuyAbility</span>
              </Button>
            </Link>
            <Link href="/account/settings">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors">
                <Settings className="h-5 w-5" aria-hidden="true" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Saved Properties */}
      {recentProperties.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recently Saved Properties</CardTitle>
                <CardDescription>Your latest liked properties</CardDescription>
              </div>
              <Link href="/saved">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((saved) => (
                <Link
                  key={saved.id}
                  href={`/properties/${saved.property_id}`}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors"
                >
                  {saved.property?.image_urls?.[0] ? (
                    <div className="relative w-20 h-20 shrink-0">
                      <Image
                        src={saved.property.image_urls[0]}
                        alt={`${saved.property.title || 'Property'} in ${saved.property?.suburb}, ${saved.property?.city}`}
                        fill
                        sizes="80px"
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 shrink-0 bg-muted rounded flex items-center justify-center">
                      <Home className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{saved.property?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {saved.property?.suburb}, {saved.property?.city}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      R&nbsp;{saved.property?.price?.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {saved.property?.bedrooms} bed &bull; {saved.property?.bathrooms} bath
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Search Personas */}
      {recentSearches.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Search Personas</CardTitle>
                <CardDescription>Saved search profiles for quick access</CardDescription>
              </div>
              <Link href="/account/personas">
                <Button variant="ghost" size="sm">Manage all</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSearches.slice(0, 5).map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div>
                      <h4 className="font-medium">{search.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(search.updated_at ?? search.created_at ?? Date.now()).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {search.alert_enabled && (
                      <Badge variant="default" className="text-xs">
                        <Bell className="h-3 w-3 mr-1" aria-hidden="true" />
                        Alert ON
                      </Badge>
                    )}
                    <Link href={`/search?persona=${search.id}`}>
                      <Button variant="ghost" size="sm">Load</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && savedPropertiesCount === 0 && savedSearchesCount === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-2">Start Your Property Journey</h3>
            <p className="text-muted-foreground mb-6">
              Save properties you like and create search personas to find your dream home faster.
            </p>
            <Link href="/search">
              <Button>Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
