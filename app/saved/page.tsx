'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { SavedProperty, Property } from '@/lib/types'
import PropertyCard from '@/components/property-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, Home, SortAsc, Search, TrendingUp, Settings } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BackButton } from '@/components/back-button'
import { Separator } from '@/components/ui/separator'

type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'title'

export default function SavedPropertiesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [savedProperties, setSavedProperties] = useState<(SavedProperty & { property: Property })[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('recent')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadSavedProperties()
    }
  }, [user])

  const loadSavedProperties = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          id,
          user_id,
          property_id,
          created_at,
          property:properties(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading saved properties:', error)
        // If table doesn't exist, show empty state
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('saved_properties table not found - database setup needed')
          setSavedProperties([])
        } else {
          throw error
        }
      } else {
        setSavedProperties((data as any) || [])
      }
    } catch (error) {
      console.error('Error loading saved properties:', error)
      setSavedProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleUnsave = async (savedPropertyId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('id', savedPropertyId)

      if (error) throw error

      // Update local state
      setSavedProperties(prev => prev.filter(sp => sp.id !== savedPropertyId))
    } catch (error) {
      console.error('Error removing saved property:', error)
    }
  }

  const sortedProperties = [...savedProperties].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'price-asc':
        return (a.property?.price || 0) - (b.property?.price || 0)
      case 'price-desc':
        return (b.property?.price || 0) - (a.property?.price || 0)
      case 'title':
        return (a.property?.title || '').localeCompare(b.property?.title || '')
      default:
        return 0
    }
  })

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
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
            <BackButton fallbackUrl="/account" label="Back to Dashboard" />
            <div className="flex items-center gap-2">
              <Link href="/account">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/saved">
                <Button variant="ghost" size="sm" className="font-medium">
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Heart className="h-8 w-8 text-primary fill-primary" />
                Saved Properties
              </h1>
              <p className="text-muted-foreground">
                {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>

        {savedProperties.length > 0 && (
          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Saved</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      ) : savedProperties.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent className="pt-6">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Saved Properties Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start exploring properties and click the heart icon to save your favorites.
              They'll appear here for easy access.
            </p>
            <Link href="/search">
              <Button size="lg">
                <Home className="h-4 w-4 mr-2" />
                Browse Properties
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedProperties.map((saved) => (
            saved.property && (
              <div key={saved.id} className="relative">
                <PropertyCard
                  property={saved.property}
                  isSaved={true}
                  onSaveToggle={() => handleUnsave(saved.id)}
                />
              </div>
            )
          ))}
        </div>
      )}

      {/* Call to Action */}
      {!loading && savedProperties.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Looking for something different?
          </p>
          <Link href="/search">
            <Button variant="outline" size="lg">
              Continue Searching
            </Button>
          </Link>
        </div>
      )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
