import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, X, Zap, Wifi, Shield, PawPrint, FileText, Maximize, Square, Waves, Trees, Wind, Lock } from "lucide-react"
import type { Property } from "@/lib/types"

interface PropertyFeaturesProps {
  property: Property
}

export function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* SA-Specific Features */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Load-Shedding & Connectivity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              {property.has_solar ? (
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Solar Power</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {property.has_inverter ? (
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Inverter Backup</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {property.has_fiber ? (
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Fiber Internet</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {property.pet_friendly ? (
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Pet Friendly</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Amenities */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Security & Amenities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {property.features?.security_24h !== undefined && (
              <div className="flex items-center gap-3">
                {property.features.security_24h ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">24h Security</span>
                </div>
              </div>
            )}
            {property.features?.pool !== undefined && (
              <div className="flex items-center gap-3">
                {property.features.pool ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Swimming Pool</span>
                </div>
              </div>
            )}
            {property.features?.garden !== undefined && (
              <div className="flex items-center gap-3">
                {property.features.garden ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex items-center gap-2">
                  <Trees className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Garden</span>
                </div>
              </div>
            )}
            {property.features?.air_conditioning !== undefined && (
              <div className="flex items-center gap-3">
                {property.features.air_conditioning ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Air Conditioning</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Property Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Maximize className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Floor Size</p>
                <p className="font-semibold">{property.floor_size} m²</p>
              </div>
            </div>
            {property.erf_size > 0 && (
              <div className="flex items-center gap-3">
                <Square className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Erf Size</p>
                  <p className="font-semibold">{property.erf_size} m²</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Title Type</p>
                <p className="font-semibold">
                  {property.sectional_title ? "Sectional Title" : property.freehold ? "Freehold" : "N/A"}
                </p>
              </div>
            </div>
            {property.in_estate && (
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Estate</p>
                  <p className="font-semibold">{property.estate_name || "Yes"}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Load-Shedding Resilience Badge */}
      {(property.has_solar || property.has_inverter) && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-success">Load-Shedding Ready</p>
              <p className="text-sm text-muted-foreground mt-1">
                This property has backup power systems to keep your lights on during load-shedding.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
