-- Migration: Rebuild schema for SA rental/sales portal focus
-- Date: 2026-01-14
-- Description: Drop old schema, create new SA-focused tables with portal integrations, tenant screening, agencies

-- ============================================================================
-- PART 1: PRESERVE USER DATA & ADD MISSING TABLES
-- ============================================================================

-- Create user_profiles table (referenced in types but missing from schema)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  notification_preferences JSONB DEFAULT '{"email_alerts": true, "sms_alerts": false, "new_listings": true, "price_changes": true, "saved_search_alerts": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create affordability_profiles table (referenced in types but missing)
CREATE TABLE IF NOT EXISTS affordability_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  monthly_income NUMERIC(12,2) NOT NULL,
  monthly_expenses NUMERIC(12,2) NOT NULL,
  deposit_amount NUMERIC(12,2) NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,
  loan_term_years INTEGER NOT NULL,
  max_affordable_price NUMERIC(12,2),
  max_monthly_payment NUMERIC(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PART 2: DROP OLD TABLES (CASCADE will handle FKs)
-- ============================================================================

DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS agents CASCADE;

-- ============================================================================
-- PART 3: CREATE NEW SA-FOCUSED SCHEMA
-- ============================================================================

-- Agencies table (new - estate agencies/offices)
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_name TEXT,
  office_name TEXT,
  email TEXT,
  phone TEXT,
  website_url TEXT,
  portal_profile_url TEXT,
  address JSONB,
  bbee_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents table (rebuilt with SA compliance & focus)
CREATE TABLE agents (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  profile_image_url TEXT,
  bio TEXT,
  agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  focus_areas TEXT[],
  focus_property_types TEXT[],
  handles_rentals BOOLEAN DEFAULT true,
  handles_sales BOOLEAN DEFAULT true,
  eaab_ppra_ffc_number TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table (rebuilt for SA rental/sales portals)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Portal integration
  portal_listing_id TEXT,
  portal_name TEXT,
  
  -- Core classification
  listing_type TEXT NOT NULL CHECK (listing_type IN ('for_sale', 'to_rent', 'sold', 'leased')),
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment_flat', 'townhouse', 'commercial', 'land', 'other')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'archived')),
  
  -- Commercial basics
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  price_currency TEXT DEFAULT 'ZAR',
  price_period TEXT CHECK (price_period IN ('total', 'per_month', 'per_week', 'per_day')),
  available_from TIMESTAMPTZ,
  
  -- Location (SA-specific)
  street_address TEXT,
  complex_or_building_name TEXT,
  suburb TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  country TEXT DEFAULT 'South Africa',
  postal_code TEXT,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  
  -- Physical details
  bedrooms INTEGER,
  bathrooms INTEGER,
  garages INTEGER,
  parking_bays INTEGER,
  floor_size_sqm NUMERIC(10,2),
  land_size_sqm NUMERIC(10,2),
  zoning TEXT,
  furnished BOOLEAN DEFAULT false,
  
  -- Features (JSONB for flexibility)
  features JSONB DEFAULT '{}'::jsonb,
  
  -- Agent & agency references
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  
  -- Media
  cover_image_url TEXT,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Market / engagement stats
  list_date TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  views_count INTEGER DEFAULT 0,
  favourites_count INTEGER DEFAULT 0,
  enquiries_count INTEGER DEFAULT 0,
  
  -- Area stats (denormalized for performance)
  area_stats JSONB,
  
  -- Portal links
  portal_urls JSONB,
  
  -- Tenant screening
  tenant_screening JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table (rebuilt with channel tracking)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'phone', 'whatsapp', 'portal_form')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed', 'lost')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PART 4: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Properties indexes
CREATE INDEX idx_properties_listing_type ON properties(listing_type);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_agent_id ON properties(agent_id);
CREATE INDEX idx_properties_agency_id ON properties(agency_id);
CREATE INDEX idx_properties_suburb ON properties(suburb);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_province ON properties(province);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);
CREATE INDEX idx_properties_list_date ON properties(list_date);

-- Agents indexes
CREATE INDEX idx_agents_agency_id ON agents(agency_id);
CREATE INDEX idx_agents_verified ON agents(verified);

-- Leads indexes
CREATE INDEX idx_leads_agent_id ON leads(agent_id);
CREATE INDEX idx_leads_property_id ON leads(property_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_channel ON leads(channel);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- User profiles indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Affordability profiles indexes
CREATE INDEX idx_affordability_profiles_user_id ON affordability_profiles(user_id);

-- ============================================================================
-- PART 5: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE affordability_profiles ENABLE ROW LEVEL SECURITY;

-- Agencies policies
CREATE POLICY "Anyone can view agencies"
  ON agencies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert agencies"
  ON agencies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update agencies"
  ON agencies FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Agents policies
CREATE POLICY "Anyone can view agent profiles"
  ON agents FOR SELECT
  USING (true);

CREATE POLICY "Agents can view their own profile"
  ON agents FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Agents can update their own profile"
  ON agents FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Agents can insert their own profile"
  ON agents FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Properties policies
CREATE POLICY "Anyone can view active properties"
  ON properties FOR SELECT
  USING (status = 'active' OR agent_id = auth.uid());

CREATE POLICY "Agents can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = agent_id);

-- Leads policies
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Agents can view their own leads"
  ON leads FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can update their own leads"
  ON leads FOR UPDATE
  USING (auth.uid() = agent_id);

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Affordability profiles policies
CREATE POLICY "Users can view their own affordability profiles"
  ON affordability_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own affordability profiles"
  ON affordability_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affordability profiles"
  ON affordability_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own affordability profiles"
  ON affordability_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- PART 6: UPDATE TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 7: SAVED PROPERTIES FK UPDATE
-- ============================================================================

-- Drop and recreate saved_properties with proper FK to new properties table
ALTER TABLE IF EXISTS saved_properties DROP CONSTRAINT IF EXISTS saved_properties_property_id_fkey;
ALTER TABLE IF EXISTS saved_properties ADD CONSTRAINT saved_properties_property_id_fkey 
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. This migration will DELETE all existing properties, agents, and leads data
-- 2. saved_properties FKs will be updated but data will be preserved (though references will be broken)
-- 3. saved_searches and neighborhoods tables are preserved as-is
-- 4. New user_profiles and affordability_profiles tables added for account features
-- 5. Run 005_seed_new_schema.sql after this to populate with SA-specific demo data
