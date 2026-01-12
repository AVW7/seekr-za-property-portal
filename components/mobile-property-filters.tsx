"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter } from "lucide-react"
import { useState } from "react"

export function MobilePropertyFilters() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full lg:hidden mb-4 bg-transparent">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 pb-6">
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex gap-2">
              <Input placeholder="Min" type="number" />
              <Input placeholder="Max" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="plot">Land & Plot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Features</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox id="mobile-solar" />
                <label htmlFor="mobile-solar" className="text-sm cursor-pointer">
                  Solar Power
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="mobile-inverter" />
                <label htmlFor="mobile-inverter" className="text-sm cursor-pointer">
                  Inverter Backup
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="mobile-fiber" />
                <label htmlFor="mobile-fiber" className="text-sm cursor-pointer">
                  Fiber Internet
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="mobile-verified" />
                <label htmlFor="mobile-verified" className="text-sm cursor-pointer">
                  Verified Only
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="mobile-estate" />
                <label htmlFor="mobile-estate" className="text-sm cursor-pointer">
                  In Estate
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsOpen(false)}>
              Clear
            </Button>
            <Button className="flex-1" onClick={() => setIsOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
