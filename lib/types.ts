// ============================================================================
// CORE LISTING & AGENT INTERFACES (SA Rental/Sales Portal Focus)
// ============================================================================

export interface Property {
  id: string
  
  // Portal integration
  portal_listing_id?: string
  portal_name?: string
  
  // Core classification
  listing_type: "for_sale" | "to_rent" | "sold" | "leased"
  property_type: "house" | "apartment_flat" | "townhouse" | "commercial" | "land" | "other"
  status: "active" | "inactive" | "draft" | "archived"
  
  // Commercial basics
  title: string
  description: string
  price: number
  price_currency: "ZAR"
  price_period?: "total" | "per_month" | "per_week" | "per_day"
  available_from?: string
  
  // Location (SA-specific)
  street_address?: string
  complex_or_building_name?: string
  suburb: string
  city: string
  province: string
  country: "South Africa"
  postal_code?: string
  latitude?: number
  longitude?: number
  
  // Physical details
  bedrooms?: number
  bathrooms?: number
  garages?: number
  parking_bays?: number
  floor_size_sqm?: number
  land_size_sqm?: number
  zoning?: string
  furnished?: boolean
  
  // Features / tags
  features: PropertyFeatures
  
  // Agent & agency references
  agent_id: string
  agency_id?: string
  
  // Media
  cover_image_url?: string
  image_urls: string[]
  video_urls?: string[]
  
  // Market / engagement stats
  list_date?: string
  last_updated?: string
  views_count?: number
  favourites_count?: number
  enquiries_count?: number
  
  // Area / median stats
  area_stats?: AreaStats
  
  // Portal links
  portal_urls?: PortalUrls
  
  // Tenant screening / SA specific
  tenant_screening?: TenantScreening
  
  created_at: string
  updated_at: string
}

export interface PropertyFeatures {
  sea_view?: boolean
  balcony?: boolean
  air_conditioning?: boolean
  jacuzzi_bath?: boolean
  security_24h?: boolean
  pets_allowed?: boolean
  maid_included_in_rent?: boolean
  dstv_included_in_rent?: boolean
  in_estate?: boolean
  estate_name?: string
  has_solar?: boolean
  has_inverter?: boolean
  has_fibre?: boolean
  pool?: boolean
  garden?: boolean
}

export interface AreaStats {
  suburb: string
  bedrooms?: number
  property_type?: string
  median_monthly_rent?: number
  median_sale_price?: number
}

export interface PortalUrls {
  listing_url?: string
  agent_profile_url?: string
  agency_profile_url?: string
  report_listing_url?: string
}

export interface TenantScreening {
  supports_property24_tenantplus?: boolean
  screening_provider?: "Property24TenantPlus" | "Preferental" | "TPN" | "Other"
}

export interface Agent {
  id: string
  full_name: string
  email?: string
  phone?: string
  whatsapp_number?: string
  profile_image_url?: string
  bio?: string
  agency_id?: string
  
  // Useful for search & display
  focus_areas?: string[]
  focus_property_types?: string[]
  handles_rentals?: boolean
  handles_sales?: boolean
  
  // Compliance (SA)
  eaab_ppra_ffc_number?: string
  verified: boolean
  
  created_at: string
  updated_at: string
}

export interface Agency {
  id: string
  name: string
  brand_name?: string
  office_name?: string
  email?: string
  phone?: string
  website_url?: string
  portal_profile_url?: string
  address?: AgencyAddress
  
  // BEE/compliance
  bbee_level?: string
  
  created_at: string
  updated_at: string
}

export interface AgencyAddress {
  line1?: string
  suburb?: string
  city?: string
  province?: string
  postal_code?: string
  country?: string
}

export interface Lead {
  id: string
  property_id: string
  agent_id: string
  channel: "email" | "phone" | "whatsapp" | "portal_form"
  name: string
  email?: string
  phone?: string
  message: string
  status: "new" | "contacted" | "in_progress" | "closed" | "lost"
  created_at: string
  updated_at: string
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
  suburb?: string
  city?: string
  province?: string
  priceMin?: number
  priceMax?: number
  propertyType?: "house" | "apartment_flat" | "townhouse" | "commercial" | "land" | "other"
  listingType?: "for_sale" | "to_rent" | "sold" | "leased"
  bedrooms?: number
  bathrooms?: number
  
  // Property features
  hasPool?: boolean
  hasGarden?: boolean
  petFriendly?: boolean
  inEstate?: boolean
  furnished?: boolean
  seaView?: boolean
  balcony?: boolean
  airConditioning?: boolean
  security24h?: boolean
  
  // SA-specific features
  hasSolar?: boolean
  hasInverter?: boolean
  hasFibre?: boolean
  dstvIncluded?: boolean
  
  // Size filters
  floorSizeMin?: number
  floorSizeMax?: number
  landSizeMin?: number
  landSizeMax?: number
  
  // Parking
  garages?: number
  parkingBays?: number
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

// Market Insights Types
export interface MarketData {
  month: string
  price: number
  sales: number
}

export interface PropertyTypeData {
  type: string
  averagePrice: number
  count: number
  change: number
}

export interface PriceHistory {
  year: number
  price: string
}

export interface Amenity {
  name: string
  distance: string
  type: string
}

export interface Demographics {
  families: number
  young_professionals: number
  retirees: number
}

export interface TransportLink {
  name: string
  type: string
  distance: string
}

export interface LocalInsight {
  title: string
  content: string
  rating: number
}

export interface NeighborhoodReport {
  id: number
  name: string
  city: string
  province?: string
  description: string
  average_price: string
  price_change: string
  highlights: string[]
  walk_score: number
  crime_rate: string
  schools: number
  restaurants: number
  population: number
  median_age: number
  price_history: PriceHistory[]
  amenities: Amenity[]
  demographics: Demographics
  transport_links: TransportLink[]
  local_insights: LocalInsight[]
  created_at?: string
  updated_at?: string
}
