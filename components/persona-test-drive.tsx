"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchParams } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Building2,
  Store,
  Briefcase,
  GraduationCap,
  Users,
  Sparkles,
  Search,
  ChevronRight,
} from "lucide-react"

// Persona Templates
const PERSONA_TEMPLATES = [
  {
    id: "airbnb",
    name: "Airbnb Investment",
    description: "Properties suitable for short-term rentals",
    icon: Home,
    defaults: {
      propertyType: "apartment" as const,
      minBeds: 1,
      maxBeds: 2,
      furnished: true,
    },
  },
  {
    id: "office",
    name: "Office Space",
    description: "Commercial office properties",
    icon: Briefcase,
    defaults: {
      propertyType: "commercial" as const,
      minSize: 50,
      maxSize: 500,
    },
  },
  {
    id: "retail",
    name: "Retail/Storefront",
    description: "Street-level retail spaces",
    icon: Store,
    defaults: {
      propertyType: "commercial" as const,
      minSize: 30,
      maxSize: 200,
    },
  },
  {
    id: "family",
    name: "Family Home",
    description: "Spacious homes for families",
    icon: Users,
    defaults: {
      propertyType: "house" as const,
      minBeds: 3,
      minBaths: 2,
      garden: true,
    },
  },
  {
    id: "student",
    name: "Student Accommodation",
    description: "Affordable rentals near universities",
    icon: GraduationCap,
    defaults: {
      propertyType: "apartment" as const,
      maxBeds: 2,
      listingType: "rent" as const,
    },
  },
  {
    id: "custom",
    name: "Custom Search",
    description: "Build your own criteria",
    icon: Sparkles,
    defaults: {},
  },
]

// SA Provinces and Cities
const PROVINCES = [
  { value: "western-cape", label: "Western Cape" },
  { value: "gauteng", label: "Gauteng" },
  { value: "kwazulu-natal", label: "KwaZulu-Natal" },
  { value: "eastern-cape", label: "Eastern Cape" },
]

const CITIES_BY_PROVINCE: Record<string, Array<{ value: string; label: string }>> = {
  "western-cape": [
    { value: "cape-town", label: "Cape Town" },
    { value: "stellenbosch", label: "Stellenbosch" },
  ],
  gauteng: [
    { value: "johannesburg", label: "Johannesburg" },
    { value: "pretoria", label: "Pretoria" },
    { value: "sandton", label: "Sandton" },
    { value: "rosebank", label: "Rosebank" },
  ],
  "kwazulu-natal": [
    { value: "durban", label: "Durban" },
    { value: "umhlanga", label: "Umhlanga" },
  ],
  "eastern-cape": [
    { value: "port-elizabeth", label: "Port Elizabeth" },
    { value: "east-london", label: "East London" },
  ],
}

interface PersonaTestDriveProps {
  variant?: "default" | "large"
}

export function PersonaTestDrive({ variant = "default" }: PersonaTestDriveProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"template" | "basic" | "details" | "features">("template")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Basic Filters
  const [province, setProvince] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [listingType, setListingType] = useState<"sale" | "rent" | "">("")
  const [propertyType, setPropertyType] = useState<"house" | "apartment" | "townhouse" | "land" | "commercial" | "">("")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")

  // Details Filters
  const [minBeds, setMinBeds] = useState<string>("")
  const [maxBeds, setMaxBeds] = useState<string>("")
  const [minBaths, setMinBaths] = useState<string>("")
  const [maxBaths, setMaxBaths] = useState<string>("")
  const [minSize, setMinSize] = useState<string>("")
  const [maxSize, setMaxSize] = useState<string>("")

  // Features
  const [pool, setPool] = useState(false)
  const [garden, setGarden] = useState(false)
  const [garage, setGarage] = useState(false)
  const [petFriendly, setPetFriendly] = useState(false)
  const [solar, setSolar] = useState(false)
  const [fibre, setFibre] = useState(false)
  const [furnished, setFurnished] = useState(false)

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = PERSONA_TEMPLATES.find((t) => t.id === templateId)
    if (template && template.defaults) {
      // Apply template defaults
      if (template.defaults.propertyType) setPropertyType(template.defaults.propertyType)
      if (template.defaults.listingType) setListingType(template.defaults.listingType)
      if (template.defaults.minBeds) setMinBeds(template.defaults.minBeds.toString())
      if (template.defaults.maxBeds) setMaxBeds(template.defaults.maxBeds.toString())
      if (template.defaults.minBaths) setMinBaths(template.defaults.minBaths.toString())
      if (template.defaults.minSize) setMinSize(template.defaults.minSize.toString())
      if (template.defaults.maxSize) setMaxSize(template.defaults.maxSize.toString())
      if (template.defaults.garden) setGarden(true)
      if (template.defaults.furnished) setFurnished(true)
    }
    setStep("basic")
  }

  const handleSearch = () => {
    // Build search params
    const params: SearchParams = {}

    if (province) params.province = province
    if (city) params.city = city
    if (listingType) params.listingType = listingType === "rent" ? "to_rent" : "for_sale"
    if (propertyType) params.propertyType = propertyType === "apartment" ? "apartment_flat" : propertyType as any
    if (minPrice) params.priceMin = parseInt(minPrice)
    if (maxPrice) params.priceMax = parseInt(maxPrice)
    if (minBeds) params.bedrooms = parseInt(minBeds)
    if (maxBeds) params.bedrooms = Math.max(params.bedrooms || 0, parseInt(maxBeds))
    if (minBaths) params.bathrooms = parseInt(minBaths)
    if (maxBaths) params.bathrooms = Math.max(params.bathrooms || 0, parseInt(maxBaths))
    if (minSize) params.floorSizeMin = parseInt(minSize)
    if (maxSize) params.floorSizeMax = parseInt(maxSize)
    if (pool) params.hasPool = true
    if (garden) params.hasGarden = true
    if (garage) params.garages = 1
    if (petFriendly) params.petFriendly = true
    if (solar) params.hasSolar = true
    if (fibre) params.hasFibre = true
    if (furnished) params.furnished = true

    // Convert to URL params
    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.set(key, value.toString())
      }
    })

    // Navigate to search page with params
    router.push(`/search?${urlParams.toString()}`)
    setOpen(false)
  }

  const availableCities = province ? CITIES_BY_PROVINCE[province] || [] : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "large" ? (
          <Button size="lg" className="text-lg px-8 py-6">
            <Sparkles className="mr-2 h-5 w-5" />
            Try Persona Search
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Try Persona Search
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Test Drive Persona Search
          </DialogTitle>
          <DialogDescription>
            No account needed—create a search persona and see results instantly
          </DialogDescription>
        </DialogHeader>

        <Tabs value={step} onValueChange={(v) => setStep(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="template" disabled={step !== "template"}>
              Template
            </TabsTrigger>
            <TabsTrigger value="basic" disabled={!selectedTemplate}>
              Basic
            </TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedTemplate}>
              Details
            </TabsTrigger>
            <TabsTrigger value="features" disabled={!selectedTemplate}>
              Features
            </TabsTrigger>
          </TabsList>

          {/* Template Selection */}
          <TabsContent value="template" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              {PERSONA_TEMPLATES.map((template) => {
                const Icon = template.icon
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="flex flex-col items-start gap-3 p-4 border-2 rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </TabsContent>

          {/* Basic Filters */}
          <TabsContent value="basic" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Province</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Select value={city} onValueChange={setCity} disabled={!province}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Listing Type</Label>
                <Select value={listingType} onValueChange={(v) => setListingType(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sale or Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">To Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select value={propertyType} onValueChange={(v) => setPropertyType(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Min Price</Label>
                <Input
                  type="number"
                  placeholder="R 0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Price</Label>
                <Input
                  type="number"
                  placeholder="R 10,000,000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setStep("template")}>
                Back
              </Button>
              <Button onClick={() => setStep("details")}>
                Next: Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Details Filters */}
          <TabsContent value="details" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Bedrooms</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={minBeds}
                  onChange={(e) => setMinBeds(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Bedrooms</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={maxBeds}
                  onChange={(e) => setMaxBeds(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Min Bathrooms</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={minBaths}
                  onChange={(e) => setMinBaths(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Bathrooms</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={maxBaths}
                  onChange={(e) => setMaxBaths(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Min Size (m²)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Size (m²)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setStep("basic")}>
                Back
              </Button>
              <Button onClick={() => setStep("features")}>
                Next: Features
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Swimming Pool</Label>
                  <p className="text-sm text-muted-foreground">Has a pool</p>
                </div>
                <Switch checked={pool} onCheckedChange={setPool} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Garden</Label>
                  <p className="text-sm text-muted-foreground">Has a garden</p>
                </div>
                <Switch checked={garden} onCheckedChange={setGarden} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Garage/Parking</Label>
                  <p className="text-sm text-muted-foreground">Covered parking</p>
                </div>
                <Switch checked={garage} onCheckedChange={setGarage} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Pet-Friendly</Label>
                  <p className="text-sm text-muted-foreground">Allows pets</p>
                </div>
                <Switch checked={petFriendly} onCheckedChange={setPetFriendly} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Solar Power</Label>
                  <p className="text-sm text-muted-foreground">Load-shedding ready</p>
                </div>
                <Switch checked={solar} onCheckedChange={setSolar} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Fibre Internet</Label>
                  <p className="text-sm text-muted-foreground">Fibre connectivity</p>
                </div>
                <Switch checked={fibre} onCheckedChange={setFibre} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Furnished</Label>
                  <p className="text-sm text-muted-foreground">Comes furnished</p>
                </div>
                <Switch checked={furnished} onCheckedChange={setFurnished} />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button onClick={handleSearch} size="lg">
                <Search className="mr-2 h-4 w-4" />
                Search Properties
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
