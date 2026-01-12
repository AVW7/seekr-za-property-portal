export interface Property {
  id: string
  agent_id: string
  title: string
  description: string
  price: number
  property_type: string
  listing_type: string
  bedrooms: number
  bathrooms: number
  parking_spaces: number
  floor_size: number
  erf_size: number
  monthly_levy: number
  monthly_rates: number
  sectional_title: boolean
  freehold: boolean
  has_solar: boolean
  has_inverter: boolean
  has_fiber: boolean
  pet_friendly: boolean
  in_estate: boolean
  estate_name: string
  address: string
  suburb: string
  city: string
  province: string
  postal_code: string
  latitude: number
  longitude: number
  images: string[]
  verified: boolean
  verification_date: string
  views: number
  status: string
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  company_name: string
  phone: string
  whatsapp_number: string
  bio: string
  profile_image_url: string
  verified: boolean
  created_at: string
}

export interface Lead {
  id: string
  property_id: string
  agent_id: string
  name: string
  email: string
  phone: string
  message: string
  lead_type: string
  status: string
  created_at: string
}
