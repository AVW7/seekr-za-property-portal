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
import { Loader2, Upload, X, GripVertical, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { trpc } from "@/utils/trpc"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  listing_type: z.enum(["for_sale", "to_rent", "sold", "leased"]),
  property_type: z.enum(["house", "apartment_flat", "townhouse", "commercial", "land", "other"]),
  status: z.enum(["active", "inactive", "draft", "archived"]).default("active"),
  price: z.coerce.number().min(1, "Price is required"),
  price_period: z.enum(["total", "per_month", "per_week", "per_day"]).default("total"),
  monthly_levy: z.coerce.number().optional(),
  monthly_rates: z.coerce.number().optional(),
  available_from: z.string().optional(),
  
  // Location
  street_address: z.string().optional(),
  complex_or_building_name: z.string().optional(),
  suburb: z.string().min(1, "Suburb is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  
  // Details
  bedrooms: z.coerce.number().int().min(0).default(0),
  bathrooms: z.coerce.number().int().min(0).default(0),
  garages: z.coerce.number().int().min(0).default(0),
  parking_bays: z.coerce.number().int().min(0).default(0),
  floor_size_sqm: z.coerce.number().optional(),
  land_size_sqm: z.coerce.number().optional(),
  zoning: z.string().optional(),
  video_urls: z.array(z.string()).optional(),
  agency_id: z.string().optional(),
  portal_listing_id: z.string().optional(),
  portal_name: z.string().optional(),
  portal_urls: z.string().optional(),
  tenant_screening: z.string().optional(),
  area_stats: z.string().optional(),
  
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

function SortableImage({ url, onRemove }: { url: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group border rounded-lg overflow-hidden bg-muted"
    >
      <img 
        src={url} 
        alt="Property image" 
        className="w-full h-32 object-cover" 
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-white" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 bg-red-500/80 rounded-full hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Remove image"
        >
          <X className="h-4 w-4 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function formatSupabaseError(error: any, fallback: string) {
  const message = error?.message || error?.details || fallback
  const code = error?.code ? ` (${error.code})` : ""
  return `${message}${code}`
}

export function PropertyForm({ initialData, propertyId }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(initialData?.image_urls || [])
  const [buildingPlans, setBuildingPlans] = useState<string[]>(initialData?.building_plans_urls || [])
  const [videoUrls, setVideoUrls] = useState<string[]>(initialData?.video_urls || [])
  const [uploading, setUploading] = useState(false)
  const updatePropertyMutation = trpc.agent.updateProperty.useMutation()
  const updateMediaMutation = trpc.agent.updatePropertyMedia.useMutation()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Transform initial data features from jsonb if necessary
  const defaultValues: Partial<PropertyFormValues> = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    listing_type: initialData?.listing_type || "for_sale",
    property_type: initialData?.property_type || "house",
    status: initialData?.status || "active",
    price: initialData?.price || 0,
    price_period: initialData?.price_period || "total",
    monthly_levy: initialData?.monthly_levy || undefined,
    monthly_rates: initialData?.monthly_rates || undefined,
    available_from: initialData?.available_from ? String(initialData.available_from).split("T")[0] : "",
    street_address: initialData?.street_address || "",
    complex_or_building_name: initialData?.complex_or_building_name || "",
    suburb: initialData?.suburb || "",
    city: initialData?.city || "",
    province: initialData?.province || "",
    country: initialData?.country || "South Africa",
    postal_code: initialData?.postal_code || "",
    bedrooms: initialData?.bedrooms || 0,
    bathrooms: initialData?.bathrooms || 0,
    garages: initialData?.garages || 0,
    parking_bays: initialData?.parking_bays || 0,
    floor_size_sqm: initialData?.floor_size_sqm || undefined,
    land_size_sqm: initialData?.land_size_sqm || undefined,
    zoning: initialData?.zoning || "",
    video_urls: initialData?.video_urls || [],
    agency_id: initialData?.agency_id || "",
    portal_listing_id: initialData?.portal_listing_id || "",
    portal_name: initialData?.portal_name || "",
    portal_urls: initialData?.portal_urls ? JSON.stringify(initialData.portal_urls, null, 2) : "",
    tenant_screening: initialData?.tenant_screening ? JSON.stringify(initialData.tenant_screening, null, 2) : "",
    area_stats: initialData?.area_stats ? JSON.stringify(initialData.area_stats, null, 2) : "",
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

  const uploadImages = async (files: FileList, isBuildingPlans = false) => {
    if (!files || files.length === 0) return

    // Validate file types and sizes
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      
      if (!isImage) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 10MB size limit`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    const uploadToast = toast.loading("Uploading images...")
    const supabase = createClient()
    const uploadedUrls: string[] = []
    let successCount = 0
    let failCount = 0

    try {
      for (const file of validFiles) {
        try {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `${isBuildingPlans ? 'plans' : 'images'}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type
            })

          if (uploadError) {
            console.error('Upload error:', uploadError)
            toast.error(`Failed to upload ${file.name}: ${formatSupabaseError(uploadError, "Upload failed")}`)
            failCount++
            continue
          }

          const { data } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath)

          uploadedUrls.push(data.publicUrl)
          successCount++
        } catch (err: any) {
          console.error('Error uploading file:', file.name, err)
          toast.error(`Upload error for ${file.name}: ${formatSupabaseError(err, "Unknown upload error")}`)
          failCount++
        }
      }

      if (uploadedUrls.length > 0) {
        const updatedImages = isBuildingPlans ? images : [...images, ...uploadedUrls]
        const updatedPlans = isBuildingPlans ? [...buildingPlans, ...uploadedUrls] : buildingPlans

        if (isBuildingPlans) {
          setBuildingPlans(updatedPlans)
          console.log('Building plans updated:', updatedPlans)
        } else {
          setImages(updatedImages)
          console.log('Images updated:', updatedImages)
        }

        if (propertyId) {
          try {
            await updateMediaMutation.mutateAsync({
              id: propertyId,
              image_urls: updatedImages,
              cover_image_url: updatedImages.length > 0 ? updatedImages[0] : null,
              building_plans_urls: updatedPlans,
            })
            toast.success('Images saved to listing')
          } catch (error: any) {
            console.error('Image save error:', error)
            toast.error(`Images uploaded but failed to save to listing: ${formatSupabaseError(error, "Save failed")}`)
          }
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} ${successCount === 1 ? 'image' : 'images'} uploaded successfully`)
      }
      if (failCount > 0) {
        toast.error(`Failed to upload ${failCount} ${failCount === 1 ? 'image' : 'images'}`)
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(formatSupabaseError(error, 'Failed to upload images. Please try again.'))
    } finally {
      setUploading(false)
      toast.dismiss(uploadToast)
    }
  }

  const handleDragEnd = (event: DragEndEvent, isBuildingPlans = false) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = isBuildingPlans 
        ? buildingPlans.findIndex(url => url === active.id)
        : images.findIndex(url => url === active.id)
      const newIndex = isBuildingPlans
        ? buildingPlans.findIndex(url => url === over.id)
        : images.findIndex(url => url === over.id)

      if (isBuildingPlans) {
        setBuildingPlans(arrayMove(buildingPlans, oldIndex, newIndex))
      } else {
        setImages(arrayMove(images, oldIndex, newIndex))
      }
    }
  }

  const removeImage = (url: string, isBuildingPlans = false) => {
    if (isBuildingPlans) {
      setBuildingPlans(prev => prev.filter(img => img !== url))
    } else {
      setImages(prev => prev.filter(img => img !== url))
    }
  }

  const onSubmit = async (data: PropertyFormValues) => {
    setLoading(true)
    const supabase = createClient()
    
    try {
      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error:', authError)
        toast.error(formatSupabaseError(authError, 'Authentication failed. Please log in again.'))
        return
      }
      
      if (!user) {
        toast.error('You must be logged in to save properties')
        return
      }

      // Validate required fields
      if (!data.title || data.title.length < 5) {
        toast.error('Title must be at least 5 characters')
        return
      }
      if (!data.suburb || !data.city || !data.province) {
        toast.error('Location fields (suburb, city, province) are required')
        return
      }
      if (!data.price || data.price < 1) {
        toast.error('Valid price is required')
        return
      }

      const parseJsonField = (value: string | undefined, label: string) => {
        if (!value) return null
        try {
          return JSON.parse(value)
        } catch {
          toast.error(`${label} must be valid JSON`)
          throw new Error(`${label} must be valid JSON`)
        }
      }

      // Log current state BEFORE constructing payload
      console.log('Current state before payload:', {
        imagesState: images,
        imagesLength: images.length,
        buildingPlansState: buildingPlans,
        buildingPlansLength: buildingPlans.length
      })

      // Construct payload with current images and building plans state
      const updatePayload = {
        title: data.title,
        description: data.description || null,
        listing_type: data.listing_type,
        property_type: data.property_type,
        status: data.status,
        price: data.price,
        price_currency: 'ZAR',
        price_period: data.price_period,
        monthly_levy: data.monthly_levy || null,
        monthly_rates: data.monthly_rates || null,
        available_from: data.available_from || null,
        street_address: data.street_address || null,
        complex_or_building_name: data.complex_or_building_name || null,
        suburb: data.suburb,
        city: data.city,
        province: data.province,
        country: data.country || 'South Africa',
        postal_code: data.postal_code || null,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        garages: data.garages,
        parking_bays: data.parking_bays,
        floor_size_sqm: data.floor_size_sqm || null,
        land_size_sqm: data.land_size_sqm || null,
        zoning: data.zoning || null,
        features: data.features || {},
        furnished: data.features?.furnished ?? false,
        image_urls: images,
        cover_image_url: images.length > 0 ? images[0] : null,
        building_plans_urls: buildingPlans,
        video_urls: videoUrls,
        agency_id: data.agency_id || null,
        portal_listing_id: data.portal_listing_id || null,
        portal_name: data.portal_name || null,
        portal_urls: parseJsonField(data.portal_urls, "Portal URLs"),
        tenant_screening: parseJsonField(data.tenant_screening, "Tenant Screening"),
        area_stats: parseJsonField(data.area_stats, "Area Stats"),
      }

      console.log('Submitting payload:', { 
        propertyId, 
        userId: user.id, 
        imageCount: images.length,
        buildingPlansCount: buildingPlans.length,
        images: images,
        buildingPlans: buildingPlans,
        payloadImageUrls: updatePayload.image_urls,
        payloadCoverImage: updatePayload.cover_image_url,
        payloadBuildingPlans: updatePayload.building_plans_urls
      })

      if (propertyId) {
        try {
          const savingToast = toast.loading("Saving changes...")
          const updatedData = await updatePropertyMutation.mutateAsync({
            id: propertyId,
            data: updatePayload,
          })

          console.log('Update successful:', updatedData)
          toast.success('Property updated successfully')
          
          // Navigate away immediately
          router.replace('/agent/listings')
          router.refresh()
          toast.dismiss(savingToast)
        } catch (error: any) {
          console.error('Update error:', error)
          toast.error(formatSupabaseError(error, 'Update failed. Please try again.'))
          return
        }
      } else {
        // Create new property
        const creatingToast = toast.loading("Creating listing...")
        const insertPayload = {
          ...updatePayload,
          agent_id: user.id,
        }
        const { data: insertedData, error: insertError } = await supabase
          .from('properties')
          .insert(insertPayload)
          .select()
          .single()
        
        if (insertError) {
          console.error('Insert error:', insertError)
          
          if (insertError.code === '23505') {
            toast.error('A property with these details already exists')
          } else if (insertError.message.includes('violates check')) {
            toast.error('Invalid data: Please check all required fields')
          } else {
            toast.error(`Creation failed: ${formatSupabaseError(insertError, 'Create failed')}`)
          }
          toast.dismiss(creatingToast)
          return
        }

        console.log('Insert successful:', insertedData)
        toast.success('Property listed successfully')
        
        // Navigate away immediately
        router.replace('/agent/listings')
        router.refresh()
        toast.dismiss(creatingToast)
      }
    } catch (error: any) {
      console.error('Unexpected error:', error)
      toast.error(formatSupabaseError(error, 'An unexpected error occurred. Please try again.'))
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
                    <FormField
                      control={form.control}
                      name="monthly_levy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Levy (Optional)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthly_rates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Rates & Taxes (Optional)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} value={field.value ?? ""} />
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
                                          <SelectItem value="sold">Sold</SelectItem>
                                          <SelectItem value="leased">Leased</SelectItem>
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
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                     </div>
                               <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Status</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="active">Active</SelectItem>
                                          <SelectItem value="inactive">Inactive</SelectItem>
                                          <SelectItem value="draft">Draft</SelectItem>
                                          <SelectItem value="archived">Archived</SelectItem>
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
                                            <SelectItem value="per_day">Per Day</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                                <FormField
                                  control={form.control}
                                  name="agency_id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Agency ID</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Agency UUID (optional)" {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="available_from"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available From</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
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
                  <FormField
                    control={form.control}
                    name="complex_or_building_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complex/Building Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Building or complex name" {...field} />
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
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="South Africa" {...field} />
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
                                  <Input type="number" {...field} value={field.value ?? ""} />
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
                                  <Input type="number" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                          control={form.control}
                          name="zoning"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zoning</FormLabel>
                              <FormControl>
                                <Input placeholder="Residential" {...field} />
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
                                    <Textarea className="min-h-25" placeholder="Describe the property..." {...field} />
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
                        name="features.furnished"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal">Furnished</FormLabel>
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

        {/* Property Images */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
            <CardDescription>
              Upload high-quality images of your property. The first image will be the main display image. Drag to reorder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/heic"
                onChange={(e) => {
                  if (e.target.files) {
                    uploadImages(e.target.files)
                    e.target.value = '' // Reset input
                  }
                }}
                className="hidden"
                id="image-upload"
                disabled={uploading}
                aria-label="Upload property images"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Button type="button" variant="outline" disabled={uploading} asChild>
                  <span>
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
                        Upload Images
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground">
                Max 10MB per image. Supported: JPEG, PNG, WebP, HEIC
              </p>
            </div>

            {images.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GripVertical className="h-4 w-4" aria-hidden="true" />
                  <span>{images.length} {images.length === 1 ? 'image' : 'images'} • Drag to reorder</span>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e)}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <SortableContext items={images} strategy={verticalListSortingStrategy}>
                      {images.map((url, index) => (
                        <div key={url} className="relative">
                          <SortableImage
                            url={url}
                            onRemove={() => removeImage(url)}
                          />
                          {index === 0 && (
                            <Badge className="absolute -top-2 -right-2 z-10" variant="default">
                              Main
                            </Badge>
                          )}
                        </div>
                      ))}
                    </SortableContext>
                  </div>
                </DndContext>
              </>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium">No images uploaded yet</p>
                <p className="text-sm text-muted-foreground">Click "Upload Images" to add photos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Building Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Building Plans (Optional)</CardTitle>
            <CardDescription>
              Upload floor plans, architectural drawings, or site plans to help buyers visualize the layout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  if (e.target.files) {
                    uploadImages(e.target.files, true)
                    e.target.value = '' // Reset input
                  }
                }}
                className="hidden"
                id="plans-upload"
                disabled={uploading}
                aria-label="Upload building plans"
              />
              <label htmlFor="plans-upload" className="cursor-pointer">
                <Button type="button" variant="outline" disabled={uploading} asChild>
                  <span>
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                        Upload Plans
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground">
                Upload images of floor plans and architectural drawings
              </p>
            </div>

            {buildingPlans.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span>{buildingPlans.length} {buildingPlans.length === 1 ? 'plan' : 'plans'} uploaded</span>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, true)}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <SortableContext items={buildingPlans} strategy={verticalListSortingStrategy}>
                      {buildingPlans.map((url) => (
                        <SortableImage
                          key={url}
                          url={url}
                          onRemove={() => removeImage(url, true)}
                        />
                      ))}
                    </SortableContext>
                  </div>
                </DndContext>
              </>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium">No building plans uploaded</p>
                <p className="text-sm text-muted-foreground">Optional: Add floor plans to showcase the property layout</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Video URLs (Optional)</CardTitle>
            <CardDescription>Add video links to showcase the property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="video_url">Video URL</FormLabel>
              <div className="flex gap-2">
                <Input id="video_url" placeholder="https://example.com/video.mp4" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById("video_url") as HTMLInputElement
                    if (input?.value) {
                      setVideoUrls((prev) => [...prev, input.value])
                      input.value = ""
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            {videoUrls.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Added Videos ({videoUrls.length})</FormLabel>
                <div className="space-y-1">
                  {videoUrls.map((url, index) => (
                    <div key={url} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 truncate text-muted-foreground">{url}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setVideoUrls((prev) => prev.filter((_, i) => i !== index))}
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
            <CardTitle>Portal & Analytics (Optional)</CardTitle>
            <CardDescription>Additional portal metadata and analytics in JSON format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="portal_listing_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portal Listing ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Portal listing id" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portal_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ExamplePortal" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="portal_urls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portal URLs (JSON)</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-25" placeholder='{"example": "https://..."}' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tenant_screening"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Screening (JSON)</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-25" placeholder='{"score": 720}' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area_stats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area Stats (JSON)</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-25" placeholder='{"median_price": 2500000}' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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
