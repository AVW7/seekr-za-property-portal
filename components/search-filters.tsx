"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronDown, Sparkles, Save, Bookmark } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type FilterTier = "basic" | "intermediate" | "advanced"

export function SearchFilters() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [intent, setIntent] = useState("buy")
  const [filterTier, setFilterTier] = useState<FilterTier>("basic")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [personaName, setPersonaName] = useState('')
  const [enableAlerts, setEnableAlerts] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleSavePersona = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save search personas",
        variant: "destructive"
      })
      return
    }

    if (!personaName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your persona",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      
      // Gather current filter values
      const searchParams = {
        location: '', // Would come from the search input
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        listingType: intent,
        // Add more filter values as needed
      }

      const { error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user.id,
          name: personaName,
          search_params: searchParams,
          alert_enabled: enableAlerts
        })

      if (error) {
        console.error('Error saving persona:', error)
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
        toast({
          title: "Success",
          description: "Search persona saved successfully"
        })

        setShowSaveDialog(false)
        setPersonaName('')
      }
    } catch (error: any) {
      console.error('Error saving persona:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save persona",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Tier Selector */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Search Persona Level</span>
          </div>
          <Tabs value={filterTier} onValueChange={(v) => setFilterTier(v as FilterTier)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
              <TabsTrigger value="intermediate" className="text-xs">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            {filterTier === "basic" && "Start with essential filters like location, price, and property type"}
            {filterTier === "intermediate" && "Add amenities, neighborhood features, and property details"}
            {filterTier === "advanced" && "Fine-tune with energy efficiency, accessibility, and legal considerations"}
          </p>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Suburb, City, Street, or Landmark..."
          className="pl-8"
        />
      </div>

      {/* Intent Switch (Buy/Rent) - BASIC */}
      <Tabs defaultValue="buy" onValueChange={setIntent} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="rent">Rent</TabsTrigger>
        </TabsList>
      </Tabs>

      <Accordion type="multiple" defaultValue={["price", "specs", "type"]} className="w-full">
        {/* BASIC FILTERS */}
        
        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <span>Price Range</span>
              <Badge variant="outline" className="text-xs">Basic</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
               <div className="flex items-center justify-between text-sm">
                  <span>R {priceRange[0].toLocaleString()}</span>
                  <span>R {priceRange[1].toLocaleString()}+</span>
               </div>
               <Slider
                  defaultValue={[0, 5000000]}
                  max={intent === 'rent' ? 100000 : 20000000}
                  step={intent === 'rent' ? 1000 : 50000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
               <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Min Price</Label>
                    <Input 
                      type="number" 
                      value={priceRange[0]} 
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} 
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max Price</Label>
                    <Input 
                      type="number" 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="h-8 text-xs" 
                    />
                  </div>
               </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Specs Filter */}
        <AccordionItem value="specs">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <span>Bedrooms & Bathrooms</span>
              <Badge variant="outline" className="text-xs">Basic</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Bedrooms</Label>
                <div className="flex flex-wrap gap-2">
                  {["Any", "1+", "2+", "3+", "4+", "5+"].map((opt) => (
                    <Badge key={`bed-${opt}`} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {opt}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Bathrooms</Label>
                <div className="flex flex-wrap gap-2">
                  {["Any", "1+", "2+", "3+"].map((opt) => (
                    <Badge key={`bath-${opt}`} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {opt}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Property Type */}
        <AccordionItem value="type">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <span>Property Type</span>
              <Badge variant="outline" className="text-xs">Basic</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {[
                "House", "Apartment", "Townhouse", 
                "Sectional Title", "Duplex", "Farm", "Vacant Land"
              ].map((type) => (
                 <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={`type-${type}`} />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* INTERMEDIATE FILTERS */}
        {(filterTier === "intermediate" || filterTier === "advanced") && (
          <>
            {/* Amenities */}
            <AccordionItem value="amenities">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span>Amenities & Features</span>
                  <Badge variant="secondary" className="text-xs">Intermediate</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {[
                    "Swimming Pool", "Garden", "Garage", "Parking",
                    "Pet Friendly", "Security Estate", "Balcony", "Study"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`amenity-${item}`} />
                      <label
                        htmlFor={`amenity-${item}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Property Age */}
            <AccordionItem value="age">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span>Property Age & Condition</span>
                  <Badge variant="secondary" className="text-xs">Intermediate</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {[
                    "New Development", "Under 5 Years", "5-10 Years",
                    "10-20 Years", "Over 20 Years", "Renovated"
                  ].map((age) => (
                    <div key={age} className="flex items-center space-x-2">
                      <Checkbox id={`age-${age}`} />
                      <label
                        htmlFor={`age-${age}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {age}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Fees */}
            <AccordionItem value="fees">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span>Levies & Rates</span>
                  <Badge variant="secondary" className="text-xs">Intermediate</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Max Monthly Levies</Label>
                    <Input type="number" placeholder="Enter max amount" className="h-8 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Max Monthly Rates</Label>
                    <Input type="number" placeholder="Enter max amount" className="h-8 text-xs" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </>
        )}

        {/* ADVANCED FILTERS */}
        {filterTier === "advanced" && (
          <>
            {/* Energy Efficiency */}
            <AccordionItem value="energy">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span>Energy & Load-Shedding</span>
                  <Badge variant="default" className="text-xs">Advanced</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {[
                    "Solar Panels", "Inverter", "Backup Battery",
                    "Generator", "Gas Stove", "Solar Geyser"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`energy-${item}`} />
                      <label
                        htmlFor={`energy-${item}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Connectivity */}
            <AccordionItem value="connectivity">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span>Connectivity</span>
                  <Badge variant="default" className="text-xs">Advanced</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {[
                    "Fiber Ready", "Fiber Installed", "Good Cell Coverage"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`conn-${item}`} />
                      <label
                        htmlFor={`conn-${item}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Accessibility */}
            <AccordionItem value="accessibility">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span>Accessibility Features</span>
                  <Badge variant="default" className="text-xs">Advanced</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {[
                    "Wheelchair Accessible", "Ground Floor", "Elevator",
                    "Wide Doorways", "Ramps"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`access-${item}`} />
                      <label
                        htmlFor={`access-${item}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Legal */}
            <AccordionItem value="legal">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <span>Legal & Ownership</span>
                  <Badge variant="default" className="text-xs">Advanced</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {[
                    "Freehold", "Sectional Title", "Life Rights",
                    "Clear Title Deed", "No Transfer Issues"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`legal-${item}`} />
                      <label
                        htmlFor={`legal-${item}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </>
        )}
      </Accordion>
      
      <div className="pt-4 space-y-2">
        <div className="flex gap-2">
          <Button className="flex-1">
            <Sparkles className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          <Button variant="outline">Reset</Button>
        </div>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => setShowSaveDialog(true)}
        >
          <Bookmark className="mr-2 h-4 w-4" />
          Save as Persona
        </Button>
      </div>

      {/* Save Persona Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search Persona</DialogTitle>
            <DialogDescription>
              Save your current filters as a search persona for quick access later
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="persona-name">Persona Name</Label>
              <Input
                id="persona-name"
                value={personaName}
                onChange={(e) => setPersonaName(e.target.value)}
                placeholder="e.g., Family Home in Sandton"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-alerts">Enable Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new properties match this search
                </p>
              </div>
              <Checkbox
                id="enable-alerts"
                checked={enableAlerts}
                onCheckedChange={(checked) => setEnableAlerts(checked as boolean)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePersona} disabled={saving}>
              {saving ? 'Saving...' : 'Save Persona'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

