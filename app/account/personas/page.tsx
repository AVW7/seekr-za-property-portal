'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { SavedSearch, SearchParams } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Search, Bell, Edit, Trash2, Plus, BellOff, Home, Heart, TrendingUp, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BackButton } from '@/components/back-button'

export default function PersonasPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [personas, setPersonas] = useState<SavedSearch[]>([])
  const [editingPersona, setEditingPersona] = useState<SavedSearch | null>(null)
  const [deletingPersonaId, setDeletingPersonaId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editAlertEnabled, setEditAlertEnabled] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadPersonas()
    }
  }, [user])

  const loadPersonas = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error loading personas:', error)
        // If table doesn't exist, show empty state
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('saved_searches table not found - database setup needed')
          setPersonas([])
        } else {
          throw error
        }
      } else {
        setPersonas(data || [])
      }
    } catch (error: any) {
      console.error('Error loading personas:', error)
      setPersonas([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (persona: SavedSearch) => {
    setEditingPersona(persona)
    setEditName(persona.name)
    setEditAlertEnabled(persona.alert_enabled)
  }

  const handleSaveEdit = async () => {
    if (!editingPersona) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_searches')
        .update({
          name: editName,
          alert_enabled: editAlertEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPersona.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Persona updated successfully'
      })

      setEditingPersona(null)
      loadPersonas()
    } catch (error: any) {
      console.error('Error updating persona:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update persona',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingPersonaId) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', deletingPersonaId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Persona deleted successfully'
      })

      setDeletingPersonaId(null)
      loadPersonas()
    } catch (error: any) {
      console.error('Error deleting persona:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete persona',
        variant: 'destructive'
      })
    }
  }

  const toggleAlert = async (persona: SavedSearch) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_searches')
        .update({
          alert_enabled: !persona.alert_enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', persona.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Alert ${!persona.alert_enabled ? 'enabled' : 'disabled'} for ${persona.name}`
      })

      loadPersonas()
    } catch (error: any) {
      console.error('Error toggling alert:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to toggle alert',
        variant: 'destructive'
      })
    }
  }

  const renderSearchParams = (params: SearchParams) => {
    const filters: string[] = []

    if (params.location) filters.push(`📍 ${params.location}`)
    if (params.priceMin || params.priceMax) {
      const priceRange = `💰 R${params.priceMin?.toLocaleString() || '0'} - R${params.priceMax?.toLocaleString() || '∞'}`
      filters.push(priceRange)
    }
    if (params.propertyType) filters.push(`🏠 ${params.propertyType}`)
    if (params.bedrooms) filters.push(`🛏️ ${params.bedrooms}+ beds`)
    if (params.bathrooms) filters.push(`🚿 ${params.bathrooms}+ baths`)
    if (params.hasSolar) filters.push('☀️ Solar')
    if (params.hasFiber) filters.push('📡 Fiber')
    if (params.petFriendly) filters.push('🐾 Pet Friendly')
    if (params.inEstate) filters.push('🏘️ Estate')

    return filters.slice(0, 5) // Show first 5 filters
  }

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
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
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved
                </Button>
              </Link>
              <Link href="/account/personas">
                <Button variant="ghost" size="sm" className="font-medium">
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
                <Search className="h-8 w-8 text-primary" />
                Search Personas
              </h1>
              <p className="text-muted-foreground">
                Manage your saved search profiles and alerts
              </p>
            </div>
            <Link href="/search">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>

      {/* Personas List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : personas.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent className="pt-6">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Search Personas Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create customized search profiles with your preferred filters to quickly find properties that match your needs.
            </p>
            <Link href="/search">
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Persona
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {personas.map((persona) => (
            <Card key={persona.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{persona.name}</CardTitle>
                      {persona.alert_enabled && (
                        <Badge variant="default" className="gap-1">
                          <Bell className="h-3 w-3" />
                          Alert ON
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Updated {new Date(persona.updated_at).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleAlert(persona)}
                      title={persona.alert_enabled ? 'Disable alert' : 'Enable alert'}
                    >
                      {persona.alert_enabled ? (
                        <Bell className="h-4 w-4" />
                      ) : (
                        <BellOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(persona)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingPersonaId(persona.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {renderSearchParams(persona.search_params).map((filter, index) => (
                    <Badge key={index} variant="secondary">
                      {filter}
                    </Badge>
                  ))}
                </div>
                <Link href={`/search?persona=${persona.id}`}>
                  <Button variant="outline" className="w-full">
                    Load & Search
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPersona} onOpenChange={() => setEditingPersona(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Search Persona</DialogTitle>
            <DialogDescription>
              Update the name and alert settings for this search persona
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Persona Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g., Family Home in Joburg"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alert">Enable Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new properties match this search
                </p>
              </div>
              <Switch
                id="alert"
                checked={editAlertEnabled}
                onCheckedChange={setEditAlertEnabled}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPersona(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingPersonaId} onOpenChange={() => setDeletingPersonaId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Search Persona?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your search persona
              and disable any associated alerts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
      </main>
      <Footer />
    </div>
  )
}
