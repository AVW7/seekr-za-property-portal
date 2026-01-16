'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Bed, Bath, Car, CheckCircle2, Zap, Wifi, ChevronLeft, ChevronRight } from "lucide-react"
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const images = (property.image_urls && property.image_urls.length > 0) 
    ? property.image_urls 
    : ["/placeholder.svg"]

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  return (
    <Card className="property-card overflow-hidden hover:shadow-lg transition-shadow flex h-full flex-col">
      <Link href={`/properties/${property.id}`}>
        <div className="relative aspect-[16/10] overflow-hidden group">
          <Image
            src={images[currentImageIndex]}
            alt={property.title || "Property image"}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          
          {/* Image Navigation - only show if multiple images */}
          {images.length > 1 && (
            <>
              <Button
                size="icon"
                variant="secondary"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={goToImage(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'w-6 bg-white' 
                        : 'w-1.5 bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          
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
      <CardContent className="p-4 space-y-3 flex-1">
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
