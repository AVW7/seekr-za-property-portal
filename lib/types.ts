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

export interface SavedProperty {
  id: string
  user_id: string
  property_id: string
  created_at: string
  property?: Property
}

export interface SavedSearch {
  id: string
  user_id: string
  name: string
  search_params: SearchParams
  alert_enabled: boolean
  created_at: string
  updated_at: string
}

export interface SearchParams {
  // Basic filters
  location?: string
  priceMin?: number
  priceMax?: number
  propertyType?: string
  listingType?: string
  bedrooms?: number
  bathrooms?: number
  
  // Intermediate filters
  hasPool?: boolean
  hasGarden?: boolean
  petFriendly?: boolean
  inEstate?: boolean
  propertyAge?: string
  
  // Advanced filters
  hasSolar?: boolean
  hasInverter?: boolean
  hasFiber?: boolean
  sectionalTitle?: boolean
  freehold?: boolean
  floorSizeMin?: number
  floorSizeMax?: number
  erfSizeMin?: number
  erfSizeMax?: number
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  phone: string
  notification_preferences: NotificationPreferences
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  email_alerts: boolean
  sms_alerts: boolean
  new_listings: boolean
  price_changes: boolean
  saved_search_alerts: boolean
}

export interface AffordabilityProfile {
  id: string
  user_id: string
  name: string
  monthly_income: number
  monthly_expenses: number
  deposit_amount: number
  interest_rate: number
  loan_term_years: number
  max_affordable_price: number
  max_monthly_payment: number
  created_at: string
}
