"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [intent, setIntent] = useState("buy")

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Suburb, City, or School..."
          className="pl-8"
        />
      </div>

      {/* Intent Switch (Buy/Rent) */}
      <Tabs defaultValue="buy" onValueChange={setIntent} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="rent">Rent</TabsTrigger>
        </TabsList>
      </Tabs>

      <Accordion type="multiple" defaultValue={["price", "specs", "type"]} className="w-full">
        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range ({intent === 'rent' ? 'Monthly' : 'Total'})</AccordionTrigger>
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
          <AccordionTrigger>Bedrooms & Bathrooms</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Bedrooms</Label>
                <div className="flex flex-wrap gap-2">
                  {["Any", "1+", "2+", "3+", "4+", "5+"].map((opt) => (
                    <Badge key={`bed-${opt}`} variant="outline" className="cursor-pointer hover:bg-slate-100">
                      {opt}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Bathrooms</Label>
                <div className="flex flex-wrap gap-2">
                  {["Any", "1+", "2+", "3+"].map((opt) => (
                    <Badge key={`bath-${opt}`} variant="outline" className="cursor-pointer hover:bg-slate-100">
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
          <AccordionTrigger>Property Type</AccordionTrigger>
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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Resilience */}
        <AccordionItem value="resilience">
          <AccordionTrigger>Resilience & Connectivity</AccordionTrigger>
          <AccordionContent>
             <div className="space-y-2 pt-2">
              {[
                "Solar/Inverter", "Backup Power", "Fiber Available"
              ].map((item) => (
                 <div key={item} className="flex items-center space-x-2">
                  <Checkbox id={`res-${item}`} />
                  <label
                    htmlFor={`res-${item}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

         {/* Fees */}
        <AccordionItem value="fees">
          <AccordionTrigger>Levies & Rates</AccordionTrigger>
          <AccordionContent>
             <div className="space-y-4 pt-2">
                <div className="space-y-2">
                   <Label className="text-xs">Max Levies</Label>
                   <Input type="number" placeholder="Enter max amount" className="h-8 text-xs" />
                </div>
                 <div className="space-y-2">
                   <Label className="text-xs">Max Rates</Label>
                   <Input type="number" placeholder="Enter max amount" className="h-8 text-xs" />
                </div>
             </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="pt-4 flex gap-2">
        <Button className="flex-1">Apply Filters</Button>
        <Button variant="outline">Reset</Button>
      </div>
    </div>
  )
}
