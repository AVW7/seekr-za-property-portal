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
import { Building2, AlertCircle, CheckCircle2, Upload } from "lucide-react"

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

const propertyTypes = ["house", "apartment", "townhouse", "land", "farm", "commercial"]

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
    property_type: "house",
    listing_type: "sale",
    bedrooms: "3",
    bathrooms: "2",
    parking_spaces: "1",
    floor_size: "",
    erf_size: "",
    monthly_levy: "0",
    monthly_rates: "0",
    sectional_title: false,
    freehold: true,
    has_solar: false,
    has_inverter: false,
    has_fiber: false,
    pet_friendly: false,
    in_estate: false,
    estate_name: "",
    address: "",
    suburb: "",
    city: "",
    province: "Western Cape",
    postal_code: "",
    latitude: "",
    longitude: "",
    images: [] as string[],
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
      router.push("/login")
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

      // Get agent ID from user
      const agentId = user?.id

      if (!agentId) {
        throw new Error("You must be logged in as an agent to list a property")
      }

      // Prepare property data
      const propertyData = {
        agent_id: agentId,
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        bedrooms: Number.parseInt(formData.bedrooms),
        bathrooms: Number.parseFloat(formData.bathrooms),
        parking_spaces: Number.parseInt(formData.parking_spaces),
        floor_size: Number.parseFloat(formData.floor_size) || 0,
        erf_size: Number.parseFloat(formData.erf_size) || 0,
        monthly_levy: Number.parseFloat(formData.monthly_levy) || 0,
        monthly_rates: Number.parseFloat(formData.monthly_rates) || 0,
        sectional_title: formData.sectional_title,
        freehold: formData.freehold,
        has_solar: formData.has_solar,
        has_inverter: formData.has_inverter,
        has_fiber: formData.has_fiber,
        pet_friendly: formData.pet_friendly,
        in_estate: formData.in_estate,
        estate_name: formData.estate_name || "",
        address: formData.address,
        suburb: formData.suburb,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postal_code,
        latitude: Number.parseFloat(formData.latitude) || 0,
        longitude: Number.parseFloat(formData.longitude) || 0,
        images:
          formData.images.length > 0
            ? formData.images
            : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
        verified: false,
        status: "active",
      }

      const { data, error: insertError } = await supabase.from("properties").insert([propertyData]).select()

      if (insertError) throw insertError

      setSuccess(true)
      // Reset form after successful submission
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
        <div className="mb-6">
          <BackButton fallbackUrl="/properties" className="mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">List Your Property</h1>
          <p className="text-muted-foreground">Fill in the details below to create a new property listing on SeekrZA</p>
        </div>

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
                          {type.charAt(0).toUpperCase() + type.slice(1)}
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
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{formData.listing_type === "sale" ? "Price (R) *" : "Monthly Rent (R) *"}</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder={formData.listing_type === "sale" ? "2950000" : "15000"}
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                  disabled={loading}
                />
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
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parking_spaces">Parking Spaces *</Label>
                  <Input
                    id="parking_spaces"
                    type="number"
                    value={formData.parking_spaces}
                    onChange={(e) => handleInputChange("parking_spaces", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor_size">Floor Size (m²)</Label>
                  <Input
                    id="floor_size"
                    type="number"
                    placeholder="185"
                    value={formData.floor_size}
                    onChange={(e) => handleInputChange("floor_size", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="erf_size">Erf Size (m²)</Label>
                  <Input
                    id="erf_size"
                    type="number"
                    placeholder="650"
                    value={formData.erf_size}
                    onChange={(e) => handleInputChange("erf_size", e.target.value)}
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
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  placeholder="15 Mountain View Drive"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
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
                        handleInputChange("images", [...formData.images, input.value])
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
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Images ({formData.images.length})</Label>
                  <div className="space-y-1">
                    {formData.images.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate text-muted-foreground">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleInputChange(
                              "images",
                              formData.images.filter((_, i) => i !== index),
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
      </div>
    </div>
  )
}
