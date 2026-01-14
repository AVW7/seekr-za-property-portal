-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table with SA-specific fields
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  property_type TEXT NOT NULL, -- house, apartment, townhouse, plot, farm
  listing_type TEXT NOT NULL, -- sale, rent
  bedrooms INTEGER NOT NULL,
  bathrooms DECIMAL(3, 1) NOT NULL,
  parking_spaces INTEGER DEFAULT 0,
  floor_size DECIMAL(10, 2), -- square meters
  erf_size DECIMAL(10, 2), -- square meters for land
  
  -- SA-specific fields
  monthly_levy DECIMAL(10, 2) DEFAULT 0,
  monthly_rates DECIMAL(10, 2) DEFAULT 0,
  sectional_title BOOLEAN DEFAULT false,
  freehold BOOLEAN DEFAULT true,
  has_solar BOOLEAN DEFAULT false,
  has_inverter BOOLEAN DEFAULT false,
  has_fiber BOOLEAN DEFAULT false,
  pet_friendly BOOLEAN DEFAULT false,
  in_estate BOOLEAN DEFAULT false,
  estate_name TEXT,
  
  -- Location
  address TEXT NOT NULL,
  suburb TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  
  -- Media
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  
  -- Metadata
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, pending, sold, rented
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  lead_type TEXT DEFAULT 'inquiry', -- inquiry, viewing, offer
  status TEXT DEFAULT 'new', -- new, contacted, converted, closed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_searches table
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_params JSONB NOT NULL,
  alert_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_properties table
CREATE TABLE IF NOT EXISTS public.saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Agents policies
CREATE POLICY "Agents can view their own profile"
  ON public.agents FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Agents can update their own profile"
  ON public.agents FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Anyone can view agent profiles"
  ON public.agents FOR SELECT
  USING (true);

-- Properties policies
CREATE POLICY "Anyone can view active properties"
  ON public.properties FOR SELECT
  USING (status = 'active' OR agent_id = auth.uid());

CREATE POLICY "Agents can insert their own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update their own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete their own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = agent_id);

-- Leads policies
CREATE POLICY "Agents can view their own leads"
  ON public.leads FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Agents can update their own leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() = agent_id);

-- Saved searches policies
CREATE POLICY "Users can view their own saved searches"
  ON public.saved_searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved searches"
  ON public.saved_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved searches"
  ON public.saved_searches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches"
  ON public.saved_searches FOR DELETE
  USING (auth.uid() = user_id);

-- Saved properties policies
CREATE POLICY "Users can view their own saved properties"
  ON public.saved_properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved properties"
  ON public.saved_properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved properties"
  ON public.saved_properties FOR DELETE
  USING (auth.uid() = user_id);

-- Create neighborhoods table for market insights
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  description TEXT,
  average_price TEXT, -- e.g., "R8.5M"
  price_change TEXT, -- e.g., "+8.2%"
  highlights TEXT[], -- e.g., ["Beach", "Luxury", "Views"]
  walk_score INTEGER,
  crime_rate TEXT, -- e.g., "Low", "Medium", "High"
  schools INTEGER,
  restaurants INTEGER,
  population INTEGER,
  median_age INTEGER,
  price_history JSONB DEFAULT '[]'::jsonb, -- [{year: 2024, price: "R8.5M"}]
  amenities JSONB DEFAULT '[]'::jsonb, -- [{name: "", distance: "", type: ""}]
  demographics JSONB DEFAULT '{}'::jsonb, -- {families: 35, young_professionals: 45}
  transport_links JSONB DEFAULT '[]'::jsonb, -- [{name: "", type: "", distance: ""}]
  local_insights JSONB DEFAULT '[]'::jsonb, -- [{title: "", content: "", rating: 5}]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, city)
);

-- Enable RLS for neighborhoods
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;

-- Anyone can view neighborhoods
CREATE POLICY "Anyone can view neighborhoods"
  ON public.neighborhoods FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_properties_suburb ON public.properties(suburb);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_agent_id ON public.properties(agent_id);
CREATE INDEX idx_properties_location ON public.properties(latitude, longitude);
CREATE INDEX idx_leads_agent_id ON public.leads(agent_id);
CREATE INDEX idx_leads_property_id ON public.leads(property_id);
CREATE INDEX idx_neighborhoods_city ON public.neighborhoods(city);
CREATE INDEX idx_neighborhoods_name ON public.neighborhoods(name);
