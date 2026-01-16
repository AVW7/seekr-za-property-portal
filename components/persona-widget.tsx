"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, Search as SearchIcon, Bell, BellOff, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { trpc } from "@/utils/trpc"
import { SearchParams } from "@/lib/types"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// Media query hook for responsive behavior
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query)
      setMatches(media.matches)
      
      const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
      media.addEventListener('change', listener)
      
      return () => media.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}

export function PersonaWidget() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [personaName, setPersonaName] = useState('')
  const [enableAlerts, setEnableAlerts] = useState(true)
  const [saving, setSaving] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Fetch recent personas
  const { data: personas, isLoading, refetch } = trpc.account.getRecentSavedSearches.useQuery(
    { limit: 10 },
    { enabled: !!user }
  )

  const handleToggleAlert = async (personaId: string, currentState: boolean, personaName: string) => {
    if (!user) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_searches')
        .update({
          alert_enabled: !currentState,
          updated_at: new Date().toISOString()
        })
        .eq('id', personaId)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Alert ${!currentState ? 'enabled' : 'disabled'} for ${personaName}`
      })

      // Refetch personas
      refetch()
    } catch (error: any) {
      console.error('Error toggling alert:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to toggle alert',
        variant: 'destructive'
      })
    }
  }

  const handleLoadSearch = (personaId: string) => {
    setOpen(false)
    router.push(`/search?persona=${personaId}`)
  }

  const handleSaveCurrentSearch = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save search personas",
        variant: "destructive"
      })
      router.push('/auth/login')
      return
    }

    if (!personaName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for this persona",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      
      // Gather current search params from URL
      const currentParams: any = {}
      searchParams.forEach((value, key) => {
        // Parse search params back into SearchParams format
        if (key !== 'persona') {
          try {
            // Try to parse as number for numeric fields
            const numValue = Number(value)
            currentParams[key] = isNaN(numValue) ? value : numValue
          } catch {
            currentParams[key] = value
          }
        }
      })

      const { error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user.id,
          name: personaName.trim(),
          search_params: currentParams as any,
          alert_enabled: enableAlerts,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Search persona saved successfully'
      })

      setShowSaveDialog(false)
      setPersonaName('')
      setEnableAlerts(true)
      refetch()
    } catch (error: any) {
      console.error('Error saving persona:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save persona',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const renderFilterBadges = (params: SearchParams) => {
    const badges: { label: string; icon?: string }[] = []

    if (params.location) badges.push({ label: params.location, icon: '📍' })
    if (params.priceMin || params.priceMax) {
      const priceRange = `R${params.priceMin?.toLocaleString() || '0'}-${params.priceMax?.toLocaleString() || '∞'}`
      badges.push({ label: priceRange, icon: '💰' })
    }
    if (params.propertyType) badges.push({ label: params.propertyType.replace('_', ' '), icon: '🏠' })
    if (params.bedrooms) badges.push({ label: `${params.bedrooms}+ beds`, icon: '🛏️' })
    if (params.bathrooms) badges.push({ label: `${params.bathrooms}+ baths`, icon: '🚿' })

    // SA-specific features
    if (params.hasSolar) badges.push({ label: 'Solar', icon: '☀️' })
    if (params.hasFibre) badges.push({ label: 'Fiber', icon: '📡' })
    if (params.petFriendly) badges.push({ label: 'Pet Friendly', icon: '🐾' })

    return badges.slice(0, 5) // Show max 5 badges
  }

  const PersonaList = () => {
    if (!user) {
      return (
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Sparkles className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Sign in to use Personas</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save and manage your search preferences
            </p>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (!personas || personas.length === 0) {
      return (
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Sparkles className="h-12 w-12 text-muted-foreground animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">No Personas Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first search persona to get started
            </p>
            <Button 
              onClick={() => {
                setOpen(false)
                router.push('/search')
              }} 
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Persona
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-1">
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Your Personas
            </h3>
            <Badge variant="secondary">{personas.length}</Badge>
          </div>
        </div>

        {/* Persona List */}
        <div className="max-h-100 overflow-y-auto">
          {personas.map((persona, index) => {
            const badges = renderFilterBadges(persona.search_params as SearchParams)
            
            return (
              <div
                key={persona.id}
                className="px-4 py-3 hover:bg-accent/50 transition-colors border-b last:border-b-0"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="space-y-2">
                  {/* Persona Name & Alert Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm line-clamp-1">{persona.name}</h4>
                    {persona.alert_enabled && (
                      <Badge variant="default" className="text-xs shrink-0">
                        Alert ON
                      </Badge>
                    )}
                  </div>

                  {/* Filter Badges */}
                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {badges.map((badge, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {badge.icon && <span className="mr-1">{badge.icon}</span>}
                          {badge.label}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => handleLoadSearch(persona.id)}
                      className="flex-1"
                    >
                      <SearchIcon className="mr-1.5 h-3.5 w-3.5" />
                      Load Search
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAlert(persona.id, persona.alert_enabled || false, persona.name)}
                      className="shrink-0"
                    >
                      {persona.alert_enabled ? (
                        <BellOff className="h-3.5 w-3.5" />
                      ) : (
                        <Bell className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-muted/30 space-y-2">
          {/* Save Current Search Button */}
          {user && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => {
                setOpen(false)
                setShowSaveDialog(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Save Current Search
            </Button>
          )}
          
          <Link href="/account/personas" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Sparkles className="mr-2 h-4 w-4" />
              Manage All Personas
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Desktop: Popover
  if (!isMobile) {
    return (
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Sparkles className="h-5 w-5" />
              {personas && personas.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                >
                  {personas.length}
                </Badge>
              )}
              <span className="sr-only">Search Personas</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-95 p-0" 
            align="end"
            sideOffset={8}
          >
            <PersonaList />
          </PopoverContent>
        </Popover>

        {/* Save Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Save Search Persona
              </DialogTitle>
              <DialogDescription>
                Create a persona from your current search to quickly access these filters later
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="persona-name">Persona Name</Label>
                <Input
                  id="persona-name"
                  placeholder="e.g., Family Home in Constantia"
                  value={personaName}
                  onChange={(e) => setPersonaName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && personaName.trim()) {
                      handleSaveCurrentSearch()
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-alerts">Enable Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified of new matches
                  </p>
                </div>
                <Switch
                  id="enable-alerts"
                  checked={enableAlerts}
                  onCheckedChange={setEnableAlerts}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSaveCurrentSearch} disabled={saving || !personaName.trim()}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Persona
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Mobile: Drawer
  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Sparkles className="h-5 w-5" />
            {personas && personas.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
              >
                {personas.length}
              </Badge>
            )}
            <span className="sr-only">Search Personas</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Search Personas</DrawerTitle>
          </DrawerHeader>
          <PersonaList />
        </DrawerContent>
      </Drawer>

      {/* Save Dialog for Mobile */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Save Search Persona
            </DialogTitle>
            <DialogDescription>
              Create a persona from your current search to quickly access these filters later
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="persona-name-mobile">Persona Name</Label>
              <Input
                id="persona-name-mobile"
                placeholder="e.g., Family Home in Constantia"
                value={personaName}
                onChange={(e) => setPersonaName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && personaName.trim()) {
                    handleSaveCurrentSearch()
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-alerts-mobile">Enable Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified of new matches
                </p>
              </div>
              <Switch
                id="enable-alerts-mobile"
                checked={enableAlerts}
                onCheckedChange={setEnableAlerts}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveCurrentSearch} disabled={saving || !personaName.trim()}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Persona
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
