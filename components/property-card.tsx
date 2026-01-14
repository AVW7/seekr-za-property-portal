'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Bed, Bath, Car, CheckCircle2, Zap, Wifi } from "lucide-react"
import type { Property } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface PropertyCardProps {
  property: Property
  isSaved?: boolean
  onSaveToggle?: () => void
}

export default function PropertyCard({ property, isSaved: initialIsSaved = false, onSaveToggle }: PropertyCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && !initialIsSaved) {
      checkIfSaved()
    }
  }, [user, property.id])

  const checkIfSaved = async () => {
    if (!user) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', property.id)
        .maybeSingle()

      if (error) {
        console.error('Error checking saved status:', error)
        // If table doesn't exist, assume not saved
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('saved_properties table not found - database setup needed')
          setIsSaved(false)
        }
      } else {
        setIsSaved(!!data)
      }
    } catch (error) {
      console.error('Error checking saved status:', error)
      setIsSaved(false)
    }
  }

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save properties",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', property.id)

        if (error) {
          console.error('Error removing saved property:', error)
          // If table doesn't exist, show appropriate message
          if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
            toast({
              title: "Database setup required",
              description: "Please run the database setup scripts first",
              variant: "destructive"
            })
          } else {
            throw error
          }
        } else {
          setIsSaved(false)
          toast({
            title: "Property removed",
            description: "Removed from your saved properties"
          })

          // Call parent callback if provided
          if (onSaveToggle) onSaveToggle()
        }
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: property.id
          })

        if (error) {
          console.error('Error saving property:', error)
          // If table doesn't exist, show appropriate message
          if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
            toast({
              title: "Database setup required",
              description: "Please run the database setup scripts first",
              variant: "destructive"
            })
          } else {
            throw error
          }
        } else {
          setIsSaved(true)
          toast({
            title: "Property saved",
            description: "Added to your saved properties"
          })
        }
      }
    } catch (error: any) {
      console.error('Error toggling saved status:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update saved status",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/properties/${property.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={(property.image_urls && property.image_urls.length > 0) ? property.image_urls[0] : "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {property.verified && (
            <Badge className="absolute top-3 left-3 bg-success text-success-foreground">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          )}
          <Button 
            size="icon" 
            variant="secondary" 
            className="absolute top-3 right-3"
            onClick={handleSaveToggle}
            disabled={isLoading}
          >
            <Heart className={`h-4 w-4 transition-all ${isSaved ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>
      </Link>
      <CardContent className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">
              <Link href={`/properties/${property.id}`} className="hover:text-primary">
                {property.title}
              </Link>
            </h3>
            <p className="text-xl font-bold text-primary whitespace-nowrap">{formatPrice(property.price)}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {property.suburb}, {property.city}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            <span>{property.parking_spaces}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {property.has_solar && (
            <Badge variant="outline" className="text-xs">
              <Zap className="mr-1 h-3 w-3" />
              Solar
            </Badge>
          )}
          {property.has_fiber && (
            <Badge variant="outline" className="text-xs">
              <Wifi className="mr-1 h-3 w-3" />
              Fiber
            </Badge>
          )}
          {property.in_estate && (
            <Badge variant="outline" className="text-xs">
              Estate
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
