-- Seed Data: SA Real Estate Context
-- Agencies, Agents, Properties (Sale & Rent), Area Stats

-- ============================================================================
-- 1. AGENCIES
-- ============================================================================

INSERT INTO agencies (id, name, brand_name, office_name, email, phone, website_url, address, bbee_level)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Pam Golding Properties - Sea Point', 'Pam Golding Properties', 'Sea Point', 'seapoint@pamgolding.co.za', '+27 21 439 1234', 'https://www.pamgolding.co.za', '{"line1": "123 Main Road", "suburb": "Sea Point", "city": "Cape Town", "province": "Western Cape", "postal_code": "8005", "country": "South Africa"}', 'Level 2'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Seeff Sandton', 'Seeff', 'Sandton', 'sandton@seeff.com', '+27 11 784 1234', 'https://www.seeff.com', '{"line1": "45 Grayston Drive", "suburb": "Sandton", "city": "Johannesburg", "province": "Gauteng", "postal_code": "2196", "country": "South Africa"}', 'Level 4'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Rawson Properties - Umhlanga', 'Rawson Properties', 'Umhlanga', 'umhlanga@rawson.co.za', '+27 31 561 1234', 'https://www.rawson.co.za', '{"line1": "12 Chartwell Drive", "suburb": "Umhlanga Rocks", "city": "Durban", "province": "KwaZulu-Natal", "postal_code": "4320", "country": "South Africa"}', 'Level 3');

-- ============================================================================
-- 2. AGENTS (Linked to Auth Users if possible, otherwise placeholders)
-- Note: In a real scenario, these IDs should match actual auth.users(id). 
-- For seeding, we might need to rely on existing users or create placeholders if auth constraints allow.
-- Since the migration has CASCADE on delete for auth.users, we need valid user IDs.
-- We will use the IDs from the previous demo data if they exist, or generate new ones 
-- and hope the constraint checks are permissive or we insert into auth.users (which we can't easily do via SQL here safety).
-- WORKAROUND: We assume the '00000000-0000-0000-0000-000000000000' user exists or we use the current user's ID if known.
-- For this script, I'll use placeholders and assume the user runs this in a context where they can map it.
-- However, strict FKs might fail. 
-- Let's try to insert assuming some test users exist or use a known ID from logs: '45e3672d-e489-4411-9410-0fca81795abf' (seen in logs).
-- ============================================================================

INSERT INTO agents (id, full_name, email, phone, whatsapp_number, profile_image_url, bio, agency_id, focus_areas, focus_property_types, handles_rentals, handles_sales, eaab_ppra_ffc_number, verified)
VALUES
  ('45e3672d-e489-4411-9410-0fca81795abf', 'James Warne', 'james.warne@pamgolding.co.za', '+27 82 555 0001', '+27 82 555 0001', 'https://images.unsplash.com/photo-1560250097-0b93528c311a', 'Top performing agent in the Atlantic Seaboard. Specializing in luxury apartments.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', ARRAY['Sea Point', 'Green Point', 'Three Anchor Bay'], ARRAY['apartment_flat', 'house'], true, true, '2023123456', true);
  
-- ============================================================================
-- 3. PROPERTIES
-- ============================================================================

-- 3.1 Luxury Apartment in Sea Point (Sale)
INSERT INTO properties (
  title, description, price, listing_type, property_type, status,
  street_address, complex_or_building_name, suburb, city, province, postal_code, latitude, longitude,
  bedrooms, bathrooms, garages, parking_bays, floor_size_sqm, 
  features, agent_id, agency_id,
  image_urls, cover_image_url,
  created_at
) VALUES (
  'Stunning Ocean View Apartment in Sea Point',
  'Experience luxury living in this renovated 3-bedroom apartment on the promenade. Features expansive ocean views, modern finishes, and 24-hour security. The open-plan living area flows onto a spacious balcony perfect for sunsets.',
  8500000, 'for_sale', 'apartment_flat', 'active',
  '123 Beach Road', 'The Ocean View', 'Sea Point', 'Cape Town', 'Western Cape', '8005', -33.9125, 18.3850,
  3, 2, 1, 1, 145,
  '{"sea_view": true, "balcony": true, "security_24h": true, "has_inverter": true, "has_fibre": true, "pets_allowed": false}',
  '45e3672d-e489-4411-9410-0fca81795abf', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d'],
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  NOW() - INTERVAL '2 days'
);

-- 3.2 Family Home in Sandton (Rent)
INSERT INTO properties (
  title, description, price, listing_type, property_type, status,
  price_period, available_from,
  street_address, suburb, city, province, postal_code, latitude, longitude,
  bedrooms, bathrooms, garages, land_size_sqm, floor_size_sqm,
  features, agent_id, agency_id,
  image_urls, cover_image_url,
  created_at
) VALUES (
  'Spacious 4 Bed Family Home in Secure Boom',
  'Beautiful family home available for rent in a quiet gated community. Features a large garden, pool, and staff accommodation. Close to major schools and Sandton City.',
  45000, 'to_rent', 'house', 'active',
  'per_month', NOW() + INTERVAL '1 month',
  '45 Willow Lane', 'Bryanston', 'Johannesburg', 'Gauteng', '2191', -26.0560, 28.0250,
  4, 3, 2, 1200, 350,
  '{"pool": true, "garden": true, "pet_friendly": true, "has_solar": true, "security_24h": true, "maid_included_in_rent": true}',
  '45e3672d-e489-4411-9410-0fca81795abf', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', -- Using same agent for simplicity, normally would be different
  ARRAY['https://images.unsplash.com/photo-1600596542815-6ad4c721c210', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'],
  'https://images.unsplash.com/photo-1600596542815-6ad4c721c210',
  NOW() - INTERVAL '5 days'
);

-- 3.3 Modern Townhouse in Umhlanga (Sale)
INSERT INTO properties (
  title, description, price, listing_type, property_type, status,
  complex_or_building_name, suburb, city, province, postal_code, latitude, longitude,
  bedrooms, bathrooms, garages, floor_size_sqm,
  features, agent_id, agency_id,
  image_urls, cover_image_url,
  created_at
) VALUES (
  'Modern 2 Bed Townhouse in Secure Estate',
  'Perfect lock-up-and-go investment. Modern finishes, private garden, and estate amenities including pool and gym. Walking distance to the beach.',
  2250000, 'for_sale', 'townhouse', 'active',
  'The Palms', 'Umhlanga Rocks', 'Durban', 'KwaZulu-Natal', '4320', -29.7280, 31.0850,
  2, 2, 1, 98,
  '{"in_estate": true, "pool": true, "garden": true, "has_fibre": true, "security_24h": true}',
  '45e3672d-e489-4411-9410-0fca81795abf', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b91d', 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f'],
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d',
  NOW() - INTERVAL '1 week'
);
