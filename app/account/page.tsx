'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { SavedProperty, SavedSearch, Property } from '@/lib/types'
import Link from 'next/link'
import { Heart, Search, Calculator, Settings, TrendingUp, Bell, Home } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BackButton } from '@/components/back-button'

export default function AccountDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [savedPropertiesCount, setSavedPropertiesCount] = useState(0)
  const [savedSearchesCount, setSavedSearchesCount] = useState(0)
  const [recentProperties, setRecentProperties] = useState<(SavedProperty & { property: Property })[]>([])
  const [recentSearches, setRecentSearches] = useState<SavedSearch[]>([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      const supabase = createClient()

      // Debug: Check if user is available
      if (!user?.id) {
        console.warn('No user ID available for dashboard data')
        return
      }

      console.log('Loading dashboard data for user:', user.id)

      // Load saved properties count and recent saved properties
      const { data: savedProps, error: savedPropsError } = await supabase
        .from('saved_properties')
        .select('*, property:properties(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      if (savedPropsError) {
        console.error('Error loading saved properties:', savedPropsError)
        // If table doesn't exist, show empty state instead of crashing
        if (savedPropsError.code === 'PGRST116' || 
            savedPropsError.message?.includes('relation') || 
            savedPropsError.message?.includes('does not exist') ||
            Object.keys(savedPropsError).length === 0) { // Handle empty error objects
          console.warn('saved_properties table not found or empty error - database setup needed')
          setSavedPropertiesCount(0)
          setRecentProperties([])
        } else {
          throw savedPropsError
        }
      } else {
        console.log('Loaded saved properties:', savedProps?.length || 0)
        setSavedPropertiesCount(savedProps?.length || 0)
        setRecentProperties(savedProps as any || [])
      }

      // Load saved searches count and recent searches
      const { data: savedSearchesData, error: savedSearchesError } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (savedSearchesError) {
        console.error('Error loading saved searches:', savedSearchesError)
        // If table doesn't exist, show empty state instead of crashing
        if (savedSearchesError.code === 'PGRST116' || 
            savedSearchesError.message?.includes('relation') || 
            savedSearchesError.message?.includes('does not exist') ||
            Object.keys(savedSearchesError).length === 0) { // Handle empty error objects
          console.warn('saved_searches table not found or empty error - database setup needed')
          setSavedSearchesCount(0)
          setRecentSearches([])
        } else {
          throw savedSearchesError
        }
      } else {
        console.log('Loaded saved searches:', savedSearchesData?.length || 0)
        setSavedSearchesCount(savedSearchesData?.length || 0)
        setRecentSearches(savedSearchesData || [])
      }
    } catch (error: any) {
      console.error('Error loading dashboard data:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        error
      })
      // Set empty state on any error to prevent crashes
      setSavedPropertiesCount(0)
      setRecentProperties([])
      setSavedSearchesCount(0)
      setRecentSearches([])
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <BackButton fallbackUrl="/" label="Back to SeekrZA" />
            <div className="flex items-center gap-2">
              <Link href="/account">
                <Button variant="ghost" size="sm" className="font-medium">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/saved">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved
                </Button>
              </Link>
              <Link href="/account/personas">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Personas
                </Button>
              </Link>
              <Link href="/account/buyability">
                <Button variant="ghost" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  BuyAbility
                </Button>
              </Link>
              <Link href="/account/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Manage your saved properties, search personas, and account settings
            </p>
          </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : savedPropertiesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Properties you've liked</p>
            <Link href="/saved">
              <Button variant="link" className="px-0 mt-2">
                View all →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Personas</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : savedSearchesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Saved search profiles</p>
            <Link href="/account/personas">
              <Button variant="link" className="px-0 mt-2">
                Manage personas →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : recentSearches.filter(s => s.alert_enabled).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Search alerts enabled</p>
            <Link href="/account/settings">
              <Button variant="link" className="px-0 mt-2">
                Settings →
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
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Search className="h-5 w-5" />
                <span>Search Properties</span>
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Calculator className="h-5 w-5" />
                <span>BuyAbility Calculator</span>
              </Button>
            </Link>
            <Link href="/account/buyability">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                <TrendingUp className="h-5 w-5" />
                <span>My BuyAbility</span>
              </Button>
            </Link>
            <Link href="/account/settings">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Settings className="h-5 w-5" />
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
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  {saved.property?.images?.[0] ? (
                    <img
                      src={saved.property.images[0]}
                      alt={saved.property.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                      <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{saved.property?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {saved.property?.suburb}, {saved.property?.city}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      R {saved.property?.price?.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {saved.property?.bedrooms} bed • {saved.property?.bathrooms} bath
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
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{search.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(search.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {search.alert_enabled && (
                      <Badge variant="default" className="text-xs">
                        <Bell className="h-3 w-3 mr-1" />
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
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Your Property Journey</h3>
            <p className="text-muted-foreground mb-6">
              Save properties you like and create search personas to find your dream home faster
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
