"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { BackButton } from "@/components/back-button"
import { Building2, AlertCircle, CheckCircle2, Upload, FileText, Camera, Send } from "lucide-react"

const provinces = [
  "Western Cape",
  "Gauteng",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
]

const propertyTypes = ["house", "apartment_flat", "townhouse", "land", "commercial", "other"]

export default function ListPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    price_period: "total",
    property_type: "house",
    listing_type: "for_sale",
    status: "active",
    agency_id: "",
    bedrooms: "3",
    bathrooms: "2",
    garages: "0",
    parking_bays: "1",
    floor_size_sqm: "",
    land_size_sqm: "",
    monthly_levy: "0",
    monthly_rates: "0",
    sectional_title: false,
    freehold: true,
    has_solar: false,
    has_inverter: false,
    has_fiber: false,
    pet_friendly: false,
    furnished: false,
    garden: false,
    pool: false,
    security: false,
    in_estate: false,
    estate_name: "",
    street_address: "",
    complex_or_building_name: "",
    suburb: "",
    city: "",
    province: "Western Cape",
    country: "South Africa",
    postal_code: "",
    latitude: "",
    longitude: "",
    zoning: "",
    available_from: "",
    image_urls: [] as string[],
    video_urls: [] as string[],
    portal_listing_id: "",
    portal_name: "",
    portal_urls: "",
    tenant_screening: "",
    area_stats: "",
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // router.push("/login")
    } else {
      setUser(user)
    }
    setCheckingAuth(false)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      const parseJsonField = (value: string, label: string) => {
        if (!value) return null
        try {
          return JSON.parse(value)
        } catch {
          setError(`${label} must be valid JSON`)
          throw new Error(`${label} must be valid JSON`)
        }
      }

      // Get agent ID from user
      const agentId = user?.id

      if (!agentId) {
        throw new Error("You must be logged in as an agent to list a property")
      }

      const propertyData = {
        agent_id: agentId,
        agency_id: formData.agency_id || null,
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        price_currency: "ZAR",
        price_period: formData.price_period,
        listing_type: formData.listing_type,
        property_type: formData.property_type,
        status: formData.status,
        available_from: formData.available_from || null,
        street_address: formData.street_address,
        complex_or_building_name: formData.complex_or_building_name || null,
        suburb: formData.suburb,
        city: formData.city,
        province: formData.province,
        country: formData.country,
        postal_code: formData.postal_code,
        latitude: Number.parseFloat(formData.latitude) || 0,
        longitude: Number.parseFloat(formData.longitude) || 0,
        bedrooms: Number.parseInt(formData.bedrooms),
        bathrooms: Number.parseInt(formData.bathrooms),
        garages: Number.parseInt(formData.garages),
        parking_bays: Number.parseInt(formData.parking_bays),
        floor_size_sqm: Number.parseFloat(formData.floor_size_sqm) || null,
        land_size_sqm: Number.parseFloat(formData.land_size_sqm) || null,
        zoning: formData.zoning || null,
        furnished: formData.furnished,
        monthly_levy: Number.parseFloat(formData.monthly_levy) || null,
        monthly_rates: Number.parseFloat(formData.monthly_rates) || null,
        features: {
          pet_friendly: formData.pet_friendly,
          solar: formData.has_solar,
          security: formData.security,
          garden: formData.garden,
          pool: formData.pool,
          furnished: formData.furnished,
          sectional_title: formData.sectional_title,
          freehold: formData.freehold,
          in_estate: formData.in_estate,
          estate_name: formData.estate_name || "",
          inverter: formData.has_inverter,
          fiber: formData.has_fiber,
        },
        image_urls:
          formData.image_urls.length > 0
            ? formData.image_urls
            : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
        cover_image_url:
          formData.image_urls.length > 0
            ? formData.image_urls[0]
            : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        video_urls: formData.video_urls,
        portal_listing_id: formData.portal_listing_id || null,
        portal_name: formData.portal_name || null,
        portal_urls: parseJsonField(formData.portal_urls, "Portal URLs"),
        tenant_screening: parseJsonField(formData.tenant_screening, "Tenant Screening"),
        area_stats: parseJsonField(formData.area_stats, "Area Stats"),
      }

      const { error: insertError } = await supabase.from("properties").insert([propertyData]).select()

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push("/properties")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to list property. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  if (checkingAuth) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <BackButton fallbackUrl="/properties" className="mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">List with Seekr</h1>
          <p className="text-muted-foreground text-lg">Follow these simple steps to get your property in front of thousands of buyers.</p>
        
          {/* Process Highlight Steps */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card className="bg-card/50 border-muted">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">1. Property Details</h3>
                <p className="text-sm text-muted-foreground">Enter the essential features and description.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border-muted">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">2. Visuals</h3>
                <p className="text-sm text-muted-foreground">Upload high-quality images to showcase your space.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-muted">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">3. Publish</h3>
                <p className="text-sm text-muted-foreground">Review your listing and go live instantly.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {!user ? (
          <Card className="bg-slate-50 border-dashed border-2 mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <Building2 className="h-16 w-16 text-muted-foreground/50" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Ready to list your property?</h3>
                <p className="text-muted-foreground max-w-md">
                  Sign in or create an account to start listing your properties on SeekrZA today.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={() => router.push("/login")} size="lg">
                  Log In
                </Button>
                <Button onClick={() => router.push("/auth/sign-up")} variant="outline" size="lg">
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-success/10 text-success border-success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Property listed successfully! Redirecting to properties page...</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Stunning 3 Bedroom Home in Constantia"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, its features, and what makes it special..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={5}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type *</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => handleInputChange("property_type", value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="property_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "apartment_flat" ? "Apartment/Flat" : type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listing_type">Listing Type *</Label>
                  <Select
                    value={formData.listing_type}
                    onValueChange={(value) => handleInputChange("listing_type", value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="listing_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="for_sale">For Sale</SelectItem>
                      <SelectItem value="to_rent">For Rent</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="leased">Leased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency_id">Agency ID</Label>
                  <Input
                    id="agency_id"
                    placeholder="Agency UUID (optional)"
                    value={formData.agency_id}
                    onChange={(e) => handleInputChange("agency_id", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{formData.listing_type === "for_sale" ? "Price (R) *" : "Monthly Rent (R) *"}</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder={formData.listing_type === "for_sale" ? "2950000" : "15000"}
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_period">Price Period</Label>
                  <Select
                    value={formData.price_period}
                    onValueChange={(value) => handleInputChange("price_period", value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="price_period">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">Total</SelectItem>
                      <SelectItem value="per_month">Per Month</SelectItem>
                      <SelectItem value="per_week">Per Week</SelectItem>
                      <SelectItem value="per_day">Per Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="available_from">Available From</Label>
                  <Input
                    id="available_from"
                    type="date"
                    value={formData.available_from}
                    onChange={(e) => handleInputChange("available_from", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Size and configuration information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="1"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parking_bays">Parking Bays *</Label>
                  <Input
                    id="parking_bays"
                    type="number"
                    value={formData.parking_bays}
                    onChange={(e) => handleInputChange("parking_bays", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="garages">Garages</Label>
                  <Input
                    id="garages"
                    type="number"
                    value={formData.garages}
                    onChange={(e) => handleInputChange("garages", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor_size_sqm">Floor Size (m²)</Label>
                  <Input
                    id="floor_size_sqm"
                    type="number"
                    placeholder="185"
                    value={formData.floor_size_sqm}
                    onChange={(e) => handleInputChange("floor_size_sqm", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="land_size_sqm">Land Size (m²)</Label>
                  <Input
                    id="land_size_sqm"
                    type="number"
                    placeholder="650"
                    value={formData.land_size_sqm}
                    onChange={(e) => handleInputChange("land_size_sqm", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_levy">Monthly Levy (R)</Label>
                  <Input
                    id="monthly_levy"
                    type="number"
                    placeholder="2100"
                    value={formData.monthly_levy}
                    onChange={(e) => handleInputChange("monthly_levy", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_rates">Monthly Rates (R)</Label>
                  <Input
                    id="monthly_rates"
                    type="number"
                    placeholder="1850"
                    value={formData.monthly_rates}
                    onChange={(e) => handleInputChange("monthly_rates", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zoning">Zoning</Label>
                  <Input
                    id="zoning"
                    placeholder="Residential"
                    value={formData.zoning}
                    onChange={(e) => handleInputChange("zoning", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features & Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
              <CardDescription>Select all that apply to your property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_solar"
                    checked={formData.has_solar}
                    onCheckedChange={(checked) => handleInputChange("has_solar", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="has_solar" className="cursor-pointer">
                    Solar Panels
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_inverter"
                    checked={formData.has_inverter}
                    onCheckedChange={(checked) => handleInputChange("has_inverter", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="has_inverter" className="cursor-pointer">
                    Inverter/Backup Power
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_fiber"
                    checked={formData.has_fiber}
                    onCheckedChange={(checked) => handleInputChange("has_fiber", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="has_fiber" className="cursor-pointer">
                    Fiber Internet
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pet_friendly"
                    checked={formData.pet_friendly}
                    onCheckedChange={(checked) => handleInputChange("pet_friendly", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="pet_friendly" className="cursor-pointer">
                    Pet Friendly
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="garden"
                    checked={formData.garden}
                    onCheckedChange={(checked) => handleInputChange("garden", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="garden" className="cursor-pointer">
                    Garden
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pool"
                    checked={formData.pool}
                    onCheckedChange={(checked) => handleInputChange("pool", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="pool" className="cursor-pointer">
                    Pool
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="security"
                    checked={formData.security}
                    onCheckedChange={(checked) => handleInputChange("security", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="security" className="cursor-pointer">
                    Security
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sectional_title"
                    checked={formData.sectional_title}
                    onCheckedChange={(checked) => {
                      handleInputChange("sectional_title", checked)
                      if (checked) handleInputChange("freehold", false)
                    }}
                    disabled={loading}
                  />
                  <Label htmlFor="sectional_title" className="cursor-pointer">
                    Sectional Title
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="freehold"
                    checked={formData.freehold}
                    onCheckedChange={(checked) => {
                      handleInputChange("freehold", checked)
                      if (checked) handleInputChange("sectional_title", false)
                    }}
                    disabled={loading}
                  />
                  <Label htmlFor="freehold" className="cursor-pointer">
                    Freehold
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in_estate"
                    checked={formData.in_estate}
                    onCheckedChange={(checked) => handleInputChange("in_estate", checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="in_estate" className="cursor-pointer">
                    In Estate
                  </Label>
                </div>
              </div>

              {formData.in_estate && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="estate_name">Estate Name</Label>
                  <Input
                    id="estate_name"
                    placeholder="e.g., Silvermist Estate"
                    value={formData.estate_name}
                    onChange={(e) => handleInputChange("estate_name", e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>Where is your property located?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street_address">Street Address *</Label>
                <Input
                  id="street_address"
                  placeholder="15 Mountain View Drive"
                  value={formData.street_address}
                  onChange={(e) => handleInputChange("street_address", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complex_or_building_name">Complex/Building Name</Label>
                <Input
                  id="complex_or_building_name"
                  placeholder="e.g., Silvermist Estate"
                  value={formData.complex_or_building_name}
                  onChange={(e) => handleInputChange("complex_or_building_name", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="suburb">Suburb *</Label>
                  <Input
                    id="suburb"
                    placeholder="Constantia"
                    value={formData.suburb}
                    onChange={(e) => handleInputChange("suburb", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Cape Town"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => handleInputChange("province", value)}
                    disabled={loading}
                  >
                    <SelectTrigger id="province">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code *</Label>
                  <Input
                    id="postal_code"
                    placeholder="7806"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange("postal_code", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="South Africa"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="-34.0245"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="18.4692"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <CardDescription>
                Add image URLs for your property (optional - default image will be used if none provided)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <div className="flex gap-2">
                  <Input id="image_url" placeholder="https://example.com/image.jpg" disabled={loading} />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById("image_url") as HTMLInputElement
                      if (input.value) {
                        handleInputChange("image_urls", [...formData.image_urls, input.value])
                        input.value = ""
                      }
                    }}
                    disabled={loading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              {formData.image_urls.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Images ({formData.image_urls.length})</Label>
                  <div className="space-y-1">
                    {formData.image_urls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate text-muted-foreground">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleInputChange(
                              "image_urls",
                              formData.image_urls.filter((_, i) => i !== index),
                            )
                          }}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Property Videos</CardTitle>
              <CardDescription>Add video URLs (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL</Label>
                <div className="flex gap-2">
                  <Input id="video_url" placeholder="https://example.com/video.mp4" disabled={loading} />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById("video_url") as HTMLInputElement
                      if (input.value) {
                        handleInputChange("video_urls", [...formData.video_urls, input.value])
                        input.value = ""
                      }
                    }}
                    disabled={loading}
                  >
                    Add
                  </Button>
                </div>
              </div>
              {formData.video_urls.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Videos ({formData.video_urls.length})</Label>
                  <div className="space-y-1">
                    {formData.video_urls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate text-muted-foreground">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleInputChange(
                              "video_urls",
                              formData.video_urls.filter((_, i) => i !== index),
                            )
                          }}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portal & Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Portal & Analytics</CardTitle>
              <CardDescription>Optional portal metadata and analytics in JSON format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portal_listing_id">Portal Listing ID</Label>
                  <Input
                    id="portal_listing_id"
                    placeholder="Portal listing id"
                    value={formData.portal_listing_id}
                    onChange={(e) => handleInputChange("portal_listing_id", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portal_name">Portal Name</Label>
                  <Input
                    id="portal_name"
                    placeholder="e.g. ExamplePortal"
                    value={formData.portal_name}
                    onChange={(e) => handleInputChange("portal_name", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portal_urls">Portal URLs (JSON)</Label>
                <Textarea
                  id="portal_urls"
                  placeholder='{"example": "https://..."}'
                  value={formData.portal_urls}
                  onChange={(e) => handleInputChange("portal_urls", e.target.value)}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenant_screening">Tenant Screening (JSON)</Label>
                <Textarea
                  id="tenant_screening"
                  placeholder='{"score": 720}'
                  value={formData.tenant_screening}
                  onChange={(e) => handleInputChange("tenant_screening", e.target.value)}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area_stats">Area Stats (JSON)</Label>
                <Textarea
                  id="area_stats"
                  placeholder='{"median_price": 2500000}'
                  value={formData.area_stats}
                  onChange={(e) => handleInputChange("area_stats", e.target.value)}
                  rows={4}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1" disabled={loading}>
              {loading ? "Listing Property..." : "List Property"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}
