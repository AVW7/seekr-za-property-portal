"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  listing_type: z.enum(["for_sale", "to_rent"]),
  property_type: z.enum(["house", "apartment_flat", "townhouse", "commercial", "land", "other"]),
  status: z.enum(["active", "draft", "archived", "sold", "leased"]).default("active"),
  price: z.coerce.number().min(1, "Price is required"),
  price_period: z.enum(["total", "per_month", "per_week"]).default("total"),
  
  // Location
  street_address: z.string().optional(),
  suburb: z.string().min(1, "Suburb is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postal_code: z.string().optional(),
  
  // Details
  bedrooms: z.coerce.number().min(0).default(0),
  bathrooms: z.coerce.number().min(0).default(0),
  garages: z.coerce.number().min(0).default(0),
  parking_bays: z.coerce.number().min(0).default(0),
  floor_size_sqm: z.coerce.number().optional(),
  land_size_sqm: z.coerce.number().optional(),
  
  // Features
  features: z.object({
    pet_friendly: z.boolean().default(false),
    garden: z.boolean().default(false),
    pool: z.boolean().default(false),
    security: z.boolean().default(false),
    solar: z.boolean().default(false),
    furnished: z.boolean().default(false),
  }).optional(),
})

type PropertyFormValues = z.infer<typeof propertySchema>

interface PropertyFormProps {
  initialData?: any
  propertyId?: string // If editing
}

export function PropertyForm({ initialData, propertyId }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Transform initial data features from jsonb if necessary
  const defaultValues: Partial<PropertyFormValues> = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    listing_type: initialData?.listing_type || "for_sale",
    property_type: initialData?.property_type || "house",
    status: initialData?.status || "active",
    price: initialData?.price || 0,
    price_period: initialData?.price_period || "total",
    street_address: initialData?.street_address || "",
    suburb: initialData?.suburb || "",
    city: initialData?.city || "",
    province: initialData?.province || "",
    postal_code: initialData?.postal_code || "",
    bedrooms: initialData?.bedrooms || 0,
    bathrooms: initialData?.bathrooms || 0,
    garages: initialData?.garages || 0,
    parking_bays: initialData?.parking_bays || 0,
    floor_size_sqm: initialData?.floor_size_sqm || undefined,
    land_size_sqm: initialData?.land_size_sqm || undefined,
    features: {
      pet_friendly: initialData?.features?.pet_friendly || false,
      garden: initialData?.features?.garden || false,
      pool: initialData?.features?.pool || false,
      security: initialData?.features?.security || false,
      solar: initialData?.features?.solar || false,
      furnished: initialData?.features?.furnished || false,
    },
  }

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues,
  })

  const onSubmit = async (data: PropertyFormValues) => {
    setLoading(true)
    const supabase = createClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error("Authentication required")

      // Construct payload specifically mapping features differently if needed
      // but here we just pass the object as jsonb
      
      const payload = {
        ...data,
        agent_id: user.id,
        // Ensure numeric explicitly for nullable fields if blank string came through
        floor_size_sqm: data.floor_size_sqm || null,
        land_size_sqm: data.land_size_sqm || null,
      }

      if (propertyId) {
        // Update
        const { error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", propertyId)
        
        if (error) throw error
        toast.success("Property updated successfully")
      } else {
        // Create
        const { error } = await supabase
          .from("properties")
          .insert(payload)
        
        if (error) throw error
        toast.success("Property listed successfully")
      }
      
      router.push("/agent")
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to save property")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Modern 3-bed Family Home" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="listing_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Listing Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="for_sale">For Sale</SelectItem>
                                            <SelectItem value="to_rent">To Rent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="property_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="house">House</SelectItem>
                                            <SelectItem value="apartment_flat">Apartment</SelectItem>
                                            <SelectItem value="townhouse">Townhouse</SelectItem>
                                            <SelectItem value="commercial">Commercial</SelectItem>
                                            <SelectItem value="land">Land</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price (ZAR)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price_period"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Per</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Period" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="total">Total Purchase Price</SelectItem>
                                            <SelectItem value="per_month">Per Month</SelectItem>
                                            <SelectItem value="per_week">Per Week</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                     </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="street_address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="suburb"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Suburb</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sea Point" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Cape Town" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Province</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Western Cape" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="postal_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="8005" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bedrooms</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bathrooms</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="garages"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Garages</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="parking_bays"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parking Bays</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="floor_size_sqm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Floor Size (m²)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="land_size_sqm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Land Size (m²)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Features & Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea className="min-h-[100px]" placeholder="Describe the property..." {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="features.pet_friendly"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-normal">Pet Friendly</FormLabel>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="features.garden"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-normal">Garden</FormLabel>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="features.pool"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-normal">Pool</FormLabel>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="features.security"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-normal">Security</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="flex justify-end gap-4">
             <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
             <Button type="submit" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {propertyId ? "Update Listing" : "Create Listing"}
             </Button>
        </div>
      </form>
    </Form>
  )
}
