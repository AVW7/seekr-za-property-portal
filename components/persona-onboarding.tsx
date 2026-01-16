"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { SearchParams } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sparkles,
  MapPin,
  DollarSign,
  Home,
  Bed,
  Bath,
  Car,
  Waves,
  Trees,
  Sun,
  Wifi,
  Shield,
  Wind,
  Zap,
  Building2,
  Search,
  ChevronRight,
  Check,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { SavedSearch } from "@/lib/types"

interface PersonaOnboardingProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
  editPersona?: SavedSearch | null
}

type OnboardingStep = "template" | "basic" | "details" | "features" | "review"

const PERSONA_TEMPLATES = [
  {
    id: "airbnb-cbd",
    name: "Airbnb Investment",
    description: "Income-generating property in prime CBD location",
    icon: Building2,
    defaults: {
      listingType: "for_sale" as const,
      propertyType: "apartment_flat" as const,
      city: "Cape Town",
      bedrooms: 1,
      priceMin: 800000,
      priceMax: 2000000,
    },
  },
  {
    id: "office-space",
    name: "Office Space",
    description: "Commercial office space for business",
    icon: Building2,
    defaults: {
      listingType: "to_rent" as const,
      propertyType: "commercial" as const,
      floorSizeMin: 50,
    },
  },
  {
    id: "retail-storefront",
    name: "Retail Storefront",
    description: "High-traffic retail space for business",
    icon: Building2,
    defaults: {
      listingType: "to_rent" as const,
      propertyType: "commercial" as const,
      location: "street-facing",
    },
  },
  {
    id: "family-home",
    name: "Family Home",
    description: "Spacious residential property for family living",
    icon: Home,
    defaults: {
      listingType: "for_sale" as const,
      propertyType: "house" as const,
      bedrooms: 3,
      bathrooms: 2,
      garages: 2,
    },
  },
  {
    id: "student-rental",
    name: "Student Rental",
    description: "Affordable rental near universities",
    icon: Bed,
    defaults: {
      listingType: "to_rent" as const,
      propertyType: "apartment_flat" as const,
      bedrooms: 1,
      priceMax: 8000,
    },
  },
  {
    id: "custom",
    name: "Custom Search",
    description: "Build your own search from scratch",
    icon: Sparkles,
    defaults: {},
  },
]

const SA_PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
]

const MAJOR_CITIES: Record<string, string[]> = {
  Gauteng: ["Johannesburg", "Pretoria", "Sandton", "Rosebank", "Centurion"],
  "Western Cape": ["Cape Town", "Stellenbosch", "Paarl", "Somerset West"],
  "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Umhlanga", "Ballito"],
}

export function PersonaOnboarding({ trigger, onSuccess, editPersona }: PersonaOnboardingProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<OnboardingStep>("template")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const isEditMode = !!editPersona

  // Persona details
  const [personaName, setPersonaName] = useState("")
  const [alertEnabled, setAlertEnabled] = useState(false)

  // Basic filters (Tier 1)
  const [listingType, setListingType] = useState<"for_sale" | "to_rent">("for_sale")
  const [propertyType, setPropertyType] = useState<string>("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [suburb, setSuburb] = useState("")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")

  // Details filters (Tier 2)
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [garages, setGarages] = useState("")
  const [parkingBays, setParkingBays] = useState("")
  const [floorSizeMin, setFloorSizeMin] = useState("")
  const [floorSizeMax, setFloorSizeMax] = useState("")
  const [landSizeMin, setLandSizeMin] = useState("")
  const [landSizeMax, setLandSizeMax] = useState("")
  const [furnished, setFurnished] = useState(false)

  // Feature filters (Tier 3)
  const [hasPool, setHasPool] = useState(false)
  const [hasGarden, setHasGarden] = useState(false)
  const [petFriendly, setPetFriendly] = useState(false)
  const [inEstate, setInEstate] = useState(false)
  const [seaView, setSeaView] = useState(false)
  const [balcony, setBalcony] = useState(false)
  const [airConditioning, setAirConditioning] = useState(false)
  const [security24h, setSecurity24h] = useState(false)
  const [hasSolar, setHasSolar] = useState(false)
  const [hasInverter, setHasInverter] = useState(false)
  const [hasFibre, setHasFibre] = useState(false)
  const [dstvIncluded, setDstvIncluded] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (editPersona && open) {
      const params = editPersona.search_params as SearchParams
      setPersonaName(editPersona.name)
      setAlertEnabled(editPersona.alert_enabled ?? false)
      
      if (params.listingType) setListingType(params.listingType)
      if (params.propertyType) setPropertyType(params.propertyType)
      if (params.province) setProvince(params.province)
      if (params.city) setCity(params.city)
      if (params.suburb) setSuburb(params.suburb)
      if (params.priceMin) setPriceMin(String(params.priceMin))
      if (params.priceMax) setPriceMax(String(params.priceMax))
      if (params.bedrooms) setBedrooms(String(params.bedrooms))
      if (params.bathrooms) setBathrooms(String(params.bathrooms))
      if (params.garages) setGarages(String(params.garages))
      if (params.parkingBays) setParkingBays(String(params.parkingBays))
      if (params.floorSizeMin) setFloorSizeMin(String(params.floorSizeMin))
      if (params.floorSizeMax) setFloorSizeMax(String(params.floorSizeMax))
      if (params.landSizeMin) setLandSizeMin(String(params.landSizeMin))
      if (params.landSizeMax) setLandSizeMax(String(params.landSizeMax))
      if (params.furnished) setFurnished(true)
      if (params.hasPool) setHasPool(true)
      if (params.hasGarden) setHasGarden(true)
      if (params.petFriendly) setPetFriendly(true)
      if (params.inEstate) setInEstate(true)
      if (params.seaView) setSeaView(true)
      if (params.balcony) setBalcony(true)
      if (params.airConditioning) setAirConditioning(true)
      if (params.security24h) setSecurity24h(true)
      if (params.hasSolar) setHasSolar(true)
      if (params.hasInverter) setHasInverter(true)
      if (params.hasFibre) setHasFibre(true)
      if (params.dstvIncluded) setDstvIncluded(true)
      
      // Skip template selection in edit mode
      setStep("basic")
    }
  }, [editPersona, open])

  const applyTemplate = (templateId: string) => {
    const template = PERSONA_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return

    setSelectedTemplate(templateId)
    setPersonaName(template.name)

    const defaults = template.defaults
    if (defaults.listingType) setListingType(defaults.listingType)
    if (defaults.propertyType) setPropertyType(defaults.propertyType)
    if (defaults.city) setCity(defaults.city)
    if (defaults.bedrooms) setBedrooms(String(defaults.bedrooms))
    if (defaults.bathrooms) setBathrooms(String(defaults.bathrooms))
    if (defaults.garages) setGarages(String(defaults.garages))
    if (defaults.priceMin) setPriceMin(String(defaults.priceMin))
    if (defaults.priceMax) setPriceMax(String(defaults.priceMax))
    if (defaults.floorSizeMin) setFloorSizeMin(String(defaults.floorSizeMin))

    setStep("basic")
  }

  const resetForm = () => {
    setStep("template")
    setSelectedTemplate(null)
    setPersonaName("")
    setAlertEnabled(false)
    setListingType("for_sale")
    setPropertyType("")
    setProvince("")
    setCity("")
    setSuburb("")
    setPriceMin("")
    setPriceMax("")
    setBedrooms("")
    setBathrooms("")
    setGarages("")
    setParkingBays("")
    setFloorSizeMin("")
    setFloorSizeMax("")
    setLandSizeMin("")
    setLandSizeMax("")
    setFurnished(false)
    setHasPool(false)
    setHasGarden(false)
    setPetFriendly(false)
    setInEstate(false)
    setSeaView(false)
    setBalcony(false)
    setAirConditioning(false)
    setSecurity24h(false)
    setHasSolar(false)
    setHasInverter(false)
    setHasFibre(false)
    setDstvIncluded(false)
  }

  const buildSearchParams = (): SearchParams => {
    const params: SearchParams = {
      listingType,
    }

    if (propertyType) params.propertyType = propertyType as any
    if (province) params.province = province
    if (city) params.city = city
    if (suburb) params.suburb = suburb
    if (priceMin) params.priceMin = parseFloat(priceMin)
    if (priceMax) params.priceMax = parseFloat(priceMax)
    if (bedrooms) params.bedrooms = parseInt(bedrooms)
    if (bathrooms) params.bathrooms = parseInt(bathrooms)
    if (garages) params.garages = parseInt(garages)
    if (parkingBays) params.parkingBays = parseInt(parkingBays)
    if (floorSizeMin) params.floorSizeMin = parseFloat(floorSizeMin)
    if (floorSizeMax) params.floorSizeMax = parseFloat(floorSizeMax)
    if (landSizeMin) params.landSizeMin = parseFloat(landSizeMin)
    if (landSizeMax) params.landSizeMax = parseFloat(landSizeMax)
    if (furnished) params.furnished = true
    if (hasPool) params.hasPool = true
    if (hasGarden) params.hasGarden = true
    if (petFriendly) params.petFriendly = true
    if (inEstate) params.inEstate = true
    if (seaView) params.seaView = true
    if (balcony) params.balcony = true
    if (airConditioning) params.airConditioning = true
    if (security24h) params.security24h = true
    if (hasSolar) params.hasSolar = true
    if (hasInverter) params.hasInverter = true
    if (hasFibre) params.hasFibre = true
    if (dstvIncluded) params.dstvIncluded = true

    return params
  }

  const getFilterCount = () => {
    let count = 0
    if (propertyType) count++
    if (province || city || suburb) count++
    if (priceMin || priceMax) count++
    if (bedrooms) count++
    if (bathrooms) count++
    if (garages || parkingBays) count++
    if (floorSizeMin || floorSizeMax) count++
    if (landSizeMin || landSizeMax) count++
    if (furnished) count++
    if (hasPool || hasGarden || petFriendly || inEstate) count++
    if (seaView || balcony || airConditioning || security24h) count++
    if (hasSolar || hasInverter || hasFibre || dstvIncluded) count++
    return count
  }

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a persona",
        variant: "destructive",
      })
      return
    }

    if (!personaName.trim()) {
      toast({
        title: "Name required",
        description: "Please give your persona a name",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const supabase = createClient()
      const searchParams = buildSearchParams()

      if (isEditMode && editPersona) {
        // Update existing persona
        const { error } = await supabase
          .from("saved_searches")
          .update({
            name: personaName,
            search_params: searchParams as any,
            alert_enabled: alertEnabled,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editPersona.id)

        if (error) throw error

        toast({
          title: "Success!",
          description: `Persona "${personaName}" updated successfully`,
        })
      } else {
        // Create new persona
        const { error } = await supabase.from("saved_searches").insert({
          user_id: user.id,
          name: personaName,
          search_params: searchParams as any,
          alert_enabled: alertEnabled,
        })

        if (error) throw error

        toast({
          title: "Success!",
          description: `Persona "${personaName}" created successfully`,
        })
      }

      setOpen(false)
      resetForm()
      onSuccess?.()
      if (!isEditMode) {
        router.push("/account/for-you")
      }
    } catch (error: any) {
      console.error("Error creating persona:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create persona",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Create Persona
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {isEditMode ? "Edit Search Persona" : "Create Your Search Persona"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your persona filters and preferences"
              : "Set up personalized property feeds tailored to your unique search needs"}
          </DialogDescription>
        </DialogHeader>

        {/* Template Selection */}
        {step === "template" && !isEditMode && (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Choose a template to get started</h3>
              <p className="text-sm text-muted-foreground">
                Select a preset to quickly configure your persona, or start from scratch
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERSONA_TEMPLATES.map((template) => {
                const Icon = template.icon
                return (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => applyTemplate(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Basic Filters (Tier 1) */}
        {step === "basic" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Basic Filters</h3>
                <p className="text-sm text-muted-foreground">Define the essentials of your search</p>
              </div>
              <Badge variant="outline">Tier 1</Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personaName">Persona Name *</Label>
                <Input
                  id="personaName"
                  value={personaName}
                  onChange={(e) => setPersonaName(e.target.value)}
                  placeholder="e.g., Airbnb in Cape Town CBD"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="listingType">Listing Type *</Label>
                  <Select value={listingType} onValueChange={(v: any) => setListingType(v)}>
                    <SelectTrigger id="listingType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="for_sale">For Sale</SelectItem>
                      <SelectItem value="to_rent">To Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment_flat">Apartment/Flat</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {SA_PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {province && MAJOR_CITIES[province] && (
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAJOR_CITIES[province].map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="suburb">Suburb (Optional)</Label>
                <Input
                  id="suburb"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="e.g., Cape Town CBD"
                />
              </div>

              <div className="space-y-2">
                <Label>Price Range ({listingType === "to_rent" ? "per month" : ""})</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="Min price"
                  />
                  <Input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Max price"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("template")}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("review")}>
                  Skip to Review
                </Button>
                <Button onClick={() => setStep("details")}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Details Filters (Tier 2) */}
        {step === "details" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Property Details</h3>
                <p className="text-sm text-muted-foreground">
                  Refine your search with specific requirements
                </p>
              </div>
              <Badge variant="outline">Tier 2</Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms (min)</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="Any"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms (min)</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="Any"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="garages">Garages (min)</Label>
                  <Input
                    id="garages"
                    type="number"
                    value={garages}
                    onChange={(e) => setGarages(e.target.value)}
                    placeholder="Any"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parkingBays">Parking Bays (min)</Label>
                  <Input
                    id="parkingBays"
                    type="number"
                    value={parkingBays}
                    onChange={(e) => setParkingBays(e.target.value)}
                    placeholder="Any"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Floor Size (sqm)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    value={floorSizeMin}
                    onChange={(e) => setFloorSizeMin(e.target.value)}
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    value={floorSizeMax}
                    onChange={(e) => setFloorSizeMax(e.target.value)}
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Land Size (sqm)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    value={landSizeMin}
                    onChange={(e) => setLandSizeMin(e.target.value)}
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    value={landSizeMax}
                    onChange={(e) => setLandSizeMax(e.target.value)}
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="furnished" className="cursor-pointer">
                    Furnished
                  </Label>
                </div>
                <Switch
                  id="furnished"
                  checked={furnished}
                  onCheckedChange={setFurnished}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("basic")}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("review")}>
                  Skip to Review
                </Button>
                <Button onClick={() => setStep("features")}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Features Filters (Tier 3) */}
        {step === "features" && (
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Property Features</h3>
                <p className="text-sm text-muted-foreground">
                  Select must-have features and amenities
                </p>
              </div>
              <Badge variant="outline">Tier 3</Badge>
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
                <TabsTrigger value="tech">Tech & Energy</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-3 mt-4">
                {[
                  { icon: Shield, label: "24h Security", state: security24h, setState: setSecurity24h },
                  { icon: Wind, label: "Air Conditioning", state: airConditioning, setState: setAirConditioning },
                  { icon: Building2, label: "In Estate", state: inEstate, setState: setInEstate },
                  { icon: Home, label: "Balcony", state: balcony, setState: setBalcony },
                  { icon: Waves, label: "Sea View", state: seaView, setState: setSeaView },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <feature.icon className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor={feature.label} className="cursor-pointer">
                        {feature.label}
                      </Label>
                    </div>
                    <Switch
                      id={feature.label}
                      checked={feature.state}
                      onCheckedChange={feature.setState}
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="outdoor" className="space-y-3 mt-4">
                {[
                  { icon: Waves, label: "Swimming Pool", state: hasPool, setState: setHasPool },
                  { icon: Trees, label: "Garden", state: hasGarden, setState: setHasGarden },
                  { icon: Home, label: "Pet Friendly", state: petFriendly, setState: setPetFriendly },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <feature.icon className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor={feature.label} className="cursor-pointer">
                        {feature.label}
                      </Label>
                    </div>
                    <Switch
                      id={feature.label}
                      checked={feature.state}
                      onCheckedChange={feature.setState}
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="tech" className="space-y-3 mt-4">
                {[
                  { icon: Sun, label: "Solar Panels", state: hasSolar, setState: setHasSolar },
                  { icon: Zap, label: "Inverter/Backup Power", state: hasInverter, setState: setHasInverter },
                  { icon: Wifi, label: "Fibre Internet", state: hasFibre, setState: setHasFibre },
                  { icon: Building2, label: "DSTV Included", state: dstvIncluded, setState: setDstvIncluded },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <feature.icon className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor={feature.label} className="cursor-pointer">
                        {feature.label}
                      </Label>
                    </div>
                    <Switch
                      id={feature.label}
                      checked={feature.state}
                      onCheckedChange={feature.setState}
                    />
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button onClick={() => setStep("review")}>
                Review & Save
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Review & Save */}
        {step === "review" && (
          <div className="py-4 space-y-6">
            <div>
              <h3 className="font-semibold">Review Your Persona</h3>
              <p className="text-sm text-muted-foreground">
                {getFilterCount()} filters applied • Double-check before saving
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{personaName || "Untitled Persona"}</CardTitle>
                <CardDescription>
                  {listingType === "for_sale" ? "For Sale" : "To Rent"} •{" "}
                  {propertyType ? propertyType.replace("_", " ") : "Any type"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(province || city || suburb) && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {province && <Badge variant="secondary">{province}</Badge>}
                      {city && <Badge variant="secondary">{city}</Badge>}
                      {suburb && <Badge variant="secondary">{suburb}</Badge>}
                    </div>
                  </div>
                )}

                {(priceMin || priceMax) && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Price Range
                    </h4>
                    <Badge variant="secondary">
                      {priceMin && `R${parseInt(priceMin).toLocaleString()}`}
                      {priceMin && priceMax && " - "}
                      {priceMax && `R${parseInt(priceMax).toLocaleString()}`}
                    </Badge>
                  </div>
                )}

                {(bedrooms || bathrooms || garages) && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Property Details
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {bedrooms && <Badge variant="secondary">{bedrooms}+ beds</Badge>}
                      {bathrooms && <Badge variant="secondary">{bathrooms}+ baths</Badge>}
                      {garages && <Badge variant="secondary">{garages}+ garages</Badge>}
                      {furnished && <Badge variant="secondary">Furnished</Badge>}
                    </div>
                  </div>
                )}

                {(hasPool || hasGarden || hasSolar || hasFibre || security24h) && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {hasPool && <Badge variant="secondary">Pool</Badge>}
                      {hasGarden && <Badge variant="secondary">Garden</Badge>}
                      {hasSolar && <Badge variant="secondary">Solar</Badge>}
                      {hasInverter && <Badge variant="secondary">Inverter</Badge>}
                      {hasFibre && <Badge variant="secondary">Fibre</Badge>}
                      {security24h && <Badge variant="secondary">24h Security</Badge>}
                      {petFriendly && <Badge variant="secondary">Pet Friendly</Badge>}
                      {seaView && <Badge variant="secondary">Sea View</Badge>}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <Label htmlFor="alertEnabled" className="cursor-pointer font-semibold">
                      Enable Alerts
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get notified when new properties match this persona
                    </p>
                  </div>
                  <Switch
                    id="alertEnabled"
                    checked={alertEnabled}
                    onCheckedChange={setAlertEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("features")}>
                Back
              </Button>
              <Button onClick={handleSave} disabled={saving || !personaName.trim()}>
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update Persona" : "Create Persona"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
