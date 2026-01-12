import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Bed, Bath, Car, CheckCircle2, Zap, Wifi } from "lucide-react"
import type { Property } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

export function PropertyCard({ property }: { property: Property }) {
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
            src={property.images[0] || "/placeholder.svg"}
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
          <Button size="icon" variant="secondary" className="absolute top-3 right-3">
            <Heart className="h-4 w-4" />
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
