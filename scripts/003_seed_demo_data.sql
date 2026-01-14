-- Temporary script to seed demo data
-- This bypasses the auth.users foreign key by temporarily disabling the constraint

-- First, let's drop the foreign key constraint temporarily
ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS agents_id_fkey;

-- Now insert sample agents without needing auth.users
INSERT INTO public.agents (
  id, company_name, phone, whatsapp_number, bio, profile_image_url, verified
) VALUES
('a1111111-1111-1111-1111-111111111111',
 'Cape Town Properties',
 '+27 82 123 4567',
 '+27821234567',
 'Experienced estate agent specializing in Cape Town residential properties. Over 10 years in the industry.',
 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
 true),
 
('a2222222-2222-2222-2222-222222222222',
 'Gauteng Properties',
 '+27 83 234 5678',
 '+27832345678',
 'Specialist in Johannesburg and Pretoria luxury estates and commercial properties.',
 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
 true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample properties with real Unsplash images
INSERT INTO public.properties (
  agent_id, title, description, price, property_type, listing_type,
  bedrooms, bathrooms, parking_spaces, floor_size, erf_size,
  monthly_levy, monthly_rates, sectional_title, freehold,
  has_solar, has_inverter, has_fiber, pet_friendly, in_estate, estate_name,
  address, suburb, city, province, postal_code, latitude, longitude,
  images, verified, status
) VALUES
-- Cape Town Properties
('a1111111-1111-1111-1111-111111111111', 
 'Stunning 3 Bedroom Home in Constantia', 
 'Beautiful family home with mountain views, solar panels, and inverter backup. Perfect for families seeking a peaceful lifestyle in one of Cape Town''s most sought-after suburbs. Features include modern kitchen, spacious garden, and double garage.',
 4750000.00, 'house', 'sale', 3, 2.5, 2, 185.00, 650.00,
 0, 1850.00, false, true,
 true, true, true, true, true, 'Silvermist Estate',
 '15 Mountain View Drive', 'Constantia', 'Cape Town', 'Western Cape', '7806', -34.0245, 18.4692,
 '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"]'::jsonb,
 true, 'active'),

('a1111111-1111-1111-1111-111111111111',
 'Modern 2 Bed Apartment - Sea Point',
 'Chic 2-bedroom apartment with ocean views and fiber connectivity. Walking distance to beaches, restaurants, and cafes. Secure building with 24/7 security. Perfect for professionals or as an investment.',
 2950000.00, 'apartment', 'sale', 2, 2.0, 1, 95.00, 0,
 2100.00, 0, true, false,
 false, false, true, true, false, '',
 '42 Beach Road', 'Sea Point', 'Cape Town', 'Western Cape', '8005', -33.9249, 18.3870,
 '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]'::jsonb,
 true, 'active'),

('a1111111-1111-1111-1111-111111111111',
 'Family Home with Solar - Durbanville',
 'Spacious 4-bedroom family home with complete solar system and load-shedding backup. Large garden, entertainment area with braai, and triple garage. Close to excellent schools.',
 3200000.00, 'house', 'sale', 4, 3.0, 3, 220.00, 850.00,
 0, 1650.00, false, true,
 true, true, true, true, false, '',
 '28 Oak Avenue', 'Durbanville', 'Cape Town', 'Western Cape', '7550', -33.8350, 18.6486,
 '["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800"]'::jsonb,
 true, 'active'),

-- Johannesburg Properties
('a2222222-2222-2222-2222-222222222222',
 'Luxury Estate Home - Sandton',
 'Magnificent 5-bedroom home in prestigious Dainfern Estate. Features include cinema room, gym, wine cellar, and staff quarters. Complete solar system with battery backup. 24/7 estate security.',
 12500000.00, 'house', 'sale', 5, 4.5, 4, 450.00, 1200.00,
 4500.00, 2800.00, false, true,
 true, true, true, true, true, 'Dainfern Estate',
 '7 Fairway Drive', 'Dainfern', 'Johannesburg', 'Gauteng', '2055', -26.0285, 27.9972,
 '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"]'::jsonb,
 true, 'active'),

('a2222222-2222-2222-2222-222222222222',
 'Penthouse Apartment - Rosebank',
 'Stunning 3-bedroom penthouse with panoramic city views. Smart home automation, fiber, and backup power. Walking distance to Gautrain, Mall of Rosebank, and business district.',
 5800000.00, 'apartment', 'sale', 3, 2.5, 2, 180.00, 0,
 3200.00, 0, true, false,
 false, true, true, false, false, '',
 'The Zone, 120 Oxford Road', 'Rosebank', 'Johannesburg', 'Gauteng', '2196', -26.1467, 28.0436,
 '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800"]'::jsonb,
 true, 'active'),

('a2222222-2222-2222-2222-222222222222',
 'Secure Townhouse - Fourways',
 'Modern 3-bedroom townhouse in secure estate with excellent amenities. Fiber ready, prepaid electricity, and pet-friendly. Close to Fourways Mall and top schools.',
 2150000.00, 'townhouse', 'sale', 3, 2.5, 2, 165.00, 220.00,
 1850.00, 0, true, false,
 false, false, true, true, true, 'Cedar Creek Estate',
 '14 Cedar Lane', 'Fourways', 'Johannesburg', 'Gauteng', '2055', -26.0147, 28.0038,
 '["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]'::jsonb,
 true, 'active'),

-- Rental Properties
('a1111111-1111-1111-1111-111111111111',
 'Stylish 1 Bed Flat - Gardens, Cape Town',
 'Trendy 1-bedroom flat in the heart of Gardens. Fiber installed, modern finishes, and close to city center. Perfect for young professionals. Available immediately.',
 15000.00, 'apartment', 'rent', 1, 1.0, 1, 55.00, 0,
 800.00, 0, true, false,
 false, false, true, false, false, '',
 '88 Kloof Street', 'Gardens', 'Cape Town', 'Western Cape', '8001', -33.9391, 18.4094,
 '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"]'::jsonb,
 false, 'active'),

('a2222222-2222-2222-2222-222222222222',
 'Family Home to Rent - Pretoria East',
 '4-bedroom home with solar backup, large garden, and pool. Close to excellent schools and shopping centers. Pet-friendly with secure yard.',
 22000.00, 'house', 'rent', 4, 3.0, 2, 250.00, 900.00,
 0, 2100.00, false, true,
 true, true, true, true, false, '',
 '42 Jacaranda Avenue', 'Waterkloof', 'Pretoria', 'Gauteng', '0181', -25.7832, 28.2385,
 '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800"]'::jsonb,
 true, 'active');

-- Seed neighborhoods data for market insights
INSERT INTO public.neighborhoods (
  id, name, city, province, description, average_price, price_change,
  highlights, walk_score, crime_rate, schools, restaurants, population, median_age,
  price_history, amenities, demographics, transport_links, local_insights
) VALUES
-- Cape Town Neighborhoods
('11111111-1111-1111-1111-111111111111',
 'Camps Bay',
 'Cape Town',
 'Western Cape',
 'Luxury beachfront suburb with stunning ocean views and world-class restaurants.',
 'R8.5M',
 '+8.2%',
 ARRAY['Beach', 'Luxury', 'Views', 'Dining'],
 80,
 'Low',
 3,
 30,
 4200,
 35,
 '[
   {"year": 2020, "price": "R6.8M"},
   {"year": 2021, "price": "R7.2M"},
   {"year": 2022, "price": "R7.8M"},
   {"year": 2023, "price": "R8.1M"},
   {"year": 2024, "price": "R8.5M"}
 ]'::jsonb,
 '[
   {"name": "Camps Bay Beach", "distance": "0.1km", "type": "Recreation"},
   {"name": "V&A Waterfront", "distance": "8.5km", "type": "Shopping"},
   {"name": "Table Mountain", "distance": "12km", "type": "Nature"},
   {"name": "Clifton Beaches", "distance": "2.1km", "type": "Recreation"}
 ]'::jsonb,
 '{"families": 35, "young_professionals": 45, "retirees": 20}'::jsonb,
 '[
   {"name": "MyCiTi Bus", "type": "Public Transport", "distance": "0.3km"},
   {"name": "Cape Town CBD", "type": "Business District", "distance": "8km"},
   {"name": "Cape Town Airport", "type": "Airport", "distance": "25km"}
 ]'::jsonb,
 '[
   {"title": "Best Time to Visit", "content": "Summer months offer perfect beach weather", "rating": 5},
   {"title": "Dining Scene", "content": "World-class restaurants with ocean views", "rating": 5},
   {"title": "Parking", "content": "Limited street parking, use private lots", "rating": 3},
   {"title": "Nightlife", "content": "Vibrant sunset bars and cocktail lounges", "rating": 4}
 ]'::jsonb),

('22222222-2222-2222-2222-222222222222',
 'Constantia',
 'Cape Town',
 'Western Cape',
 'Prestigious wine estate area known for family homes, excellent schools, and vineyards.',
 'R6.2M',
 '+6.5%',
 ARRAY['Wine Estates', 'Schools', 'Family-Friendly', 'Nature'],
 65,
 'Low',
 8,
 15,
 12000,
 42,
 '[
   {"year": 2020, "price": "R5.1M"},
   {"year": 2021, "price": "R5.4M"},
   {"year": 2022, "price": "R5.8M"},
   {"year": 2023, "price": "R6.0M"},
   {"year": 2024, "price": "R6.2M"}
 ]'::jsonb,
 '[
   {"name": "Constantia Wine Route", "distance": "2km", "type": "Recreation"},
   {"name": "Kirstenbosch Gardens", "distance": "5km", "type": "Nature"},
   {"name": "Constantia Village", "distance": "1km", "type": "Shopping"},
   {"name": "Silvermist Estate", "distance": "3km", "type": "Nature"}
 ]'::jsonb,
 '{"families": 60, "young_professionals": 25, "retirees": 15}'::jsonb,
 '[
   {"name": "Main Road Bus Route", "type": "Public Transport", "distance": "0.5km"},
   {"name": "Southern Suburbs Rail", "type": "Train Station", "distance": "4km"},
   {"name": "Cape Town CBD", "type": "Business District", "distance": "15km"}
 ]'::jsonb,
 '[
   {"title": "Schools", "content": "Home to some of Cape Towns best private schools", "rating": 5},
   {"title": "Wine Culture", "content": "Perfect for wine enthusiasts with estates nearby", "rating": 5},
   {"title": "Traffic", "content": "Can be congested during school hours", "rating": 3},
   {"title": "Nature Access", "content": "Mountain trails and green spaces abundant", "rating": 5}
 ]'::jsonb),

-- Johannesburg Neighborhoods
('33333333-3333-3333-3333-333333333333',
 'Sandton',
 'Johannesburg',
 'Gauteng',
 'Premier business and residential hub with luxury apartments, shopping, and dining.',
 'R4.8M',
 '+9.8%',
 ARRAY['Business District', 'Luxury', 'Shopping', 'Security'],
 85,
 'Low',
 12,
 150,
 35000,
 33,
 '[
   {"year": 2020, "price": "R3.8M"},
   {"year": 2021, "price": "R4.1M"},
   {"year": 2022, "price": "R4.3M"},
   {"year": 2023, "price": "R4.5M"},
   {"year": 2024, "price": "R4.8M"}
 ]'::jsonb,
 '[
   {"name": "Sandton City Mall", "distance": "1km", "type": "Shopping"},
   {"name": "Nelson Mandela Square", "distance": "0.8km", "type": "Shopping"},
   {"name": "Gautrain Station", "distance": "0.5km", "type": "Transport"},
   {"name": "Hyde Park Corner", "distance": "3km", "type": "Shopping"}
 ]'::jsonb,
 '{"families": 30, "young_professionals": 55, "retirees": 15}'::jsonb,
 '[
   {"name": "Gautrain", "type": "Rapid Transit", "distance": "0.5km"},
   {"name": "Johannesburg CBD", "type": "Business District", "distance": "12km"},
   {"name": "OR Tambo Airport", "type": "Airport", "distance": "22km"}
 ]'::jsonb,
 '[
   {"title": "Business Hub", "content": "Heart of Johannesburgs business district", "rating": 5},
   {"title": "Shopping", "content": "World-class malls and boutiques", "rating": 5},
   {"title": "Security", "content": "Excellent security with gated complexes", "rating": 5},
   {"title": "Cost of Living", "content": "Premium pricing reflects exclusive location", "rating": 3}
 ]'::jsonb),

-- Durban Neighborhoods
('44444444-4444-4444-4444-444444444444',
 'Umhlanga',
 'Durban',
 'KwaZulu-Natal',
 'Coastal suburb with beachfront living, modern developments, and business centers.',
 'R3.2M',
 '+7.5%',
 ARRAY['Beachfront', 'Modern', 'Business', 'Entertainment'],
 75,
 'Medium',
 5,
 45,
 18000,
 36,
 '[
   {"year": 2020, "price": "R2.6M"},
   {"year": 2021, "price": "R2.8M"},
   {"year": 2022, "price": "R2.9M"},
   {"year": 2023, "price": "R3.0M"},
   {"year": 2024, "price": "R3.2M"}
 ]'::jsonb,
 '[
   {"name": "Umhlanga Beach", "distance": "0.5km", "type": "Recreation"},
   {"name": "Gateway Theatre of Shopping", "distance": "2km", "type": "Shopping"},
   {"name": "Umhlanga Rocks Promenade", "distance": "1km", "type": "Recreation"},
   {"name": "Sibaya Casino", "distance": "4km", "type": "Entertainment"}
 ]'::jsonb,
 '{"families": 40, "young_professionals": 45, "retirees": 15}'::jsonb,
 '[
   {"name": "M4 Highway", "type": "Highway Access", "distance": "1km"},
   {"name": "King Shaka Airport", "type": "Airport", "distance": "18km"},
   {"name": "Durban CBD", "type": "Business District", "distance": "15km"}
 ]'::jsonb,
 '[
   {"title": "Beach Lifestyle", "content": "Year-round warm weather and beach access", "rating": 5},
   {"title": "Business Access", "content": "Growing business hub with office parks", "rating": 4},
   {"title": "Entertainment", "content": "Restaurants, bars, and shopping nearby", "rating": 5},
   {"title": "Humidity", "content": "Subtropical climate can be humid", "rating": 3}
 ]'::jsonb),

-- Pretoria Neighborhoods
('55555555-5555-5555-5555-555555555555',
 'Waterkloof',
 'Pretoria',
 'Gauteng',
 'Exclusive diplomatic and residential area with embassies and luxury homes.',
 'R5.5M',
 '+5.2%',
 ARRAY['Diplomatic', 'Luxury', 'Established', 'Green'],
 60,
 'Low',
 6,
 20,
 8000,
 45,
 '[
   {"year": 2020, "price": "R4.9M"},
   {"year": 2021, "price": "R5.1M"},
   {"year": 2022, "price": "R5.2M"},
   {"year": 2023, "price": "R5.4M"},
   {"year": 2024, "price": "R5.5M"}
 ]'::jsonb,
 '[
   {"name": "Brooklyn Mall", "distance": "5km", "type": "Shopping"},
   {"name": "Waterkloof Ridge", "distance": "2km", "type": "Nature"},
   {"name": "Union Buildings", "distance": "8km", "type": "Landmark"},
   {"name": "Menlyn Park Mall", "distance": "12km", "type": "Shopping"}
 ]'::jsonb,
 '{"families": 50, "young_professionals": 20, "retirees": 30}'::jsonb,
 '[
   {"name": "N1 Highway", "type": "Highway Access", "distance": "8km"},
   {"name": "Pretoria CBD", "type": "Business District", "distance": "10km"},
   {"name": "OR Tambo Airport", "type": "Airport", "distance": "55km"}
 ]'::jsonb,
 '[
   {"title": "Prestige", "content": "Most prestigious area in Pretoria with embassies", "rating": 5},
   {"title": "Established Area", "content": "Mature trees and well-maintained properties", "rating": 5},
   {"title": "Exclusivity", "content": "High property values and exclusive community", "rating": 4},
   {"title": "Distance", "content": "Further from main business hubs", "rating": 3}
 ]'::jsonb),

-- Stellenbosch
('66666666-6666-6666-6666-666666666666',
 'Stellenbosch Central',
 'Stellenbosch',
 'Western Cape',
 'Historic university town in the heart of wine country with vibrant culture.',
 'R3.8M',
 '+6.1%',
 ARRAY['University', 'Wine Country', 'Historic', 'Culture'],
 90,
 'Low',
 15,
 80,
 25000,
 28,
 '[
   {"year": 2020, "price": "R3.2M"},
   {"year": 2021, "price": "R3.4M"},
   {"year": 2022, "price": "R3.5M"},
   {"year": 2023, "price": "R3.7M"},
   {"year": 2024, "price": "R3.8M"}
 ]'::jsonb,
 '[
   {"name": "Stellenbosch University", "distance": "1km", "type": "Education"},
   {"name": "Eikestad Mall", "distance": "0.8km", "type": "Shopping"},
   {"name": "Dorp Street", "distance": "0.3km", "type": "Historic"},
   {"name": "Jonkershoek Valley", "distance": "5km", "type": "Nature"}
 ]'::jsonb,
 '{"families": 35, "young_professionals": 50, "retirees": 15}'::jsonb,
 '[
   {"name": "R44 Highway", "type": "Highway Access", "distance": "2km"},
   {"name": "Cape Town", "type": "City", "distance": "50km"},
   {"name": "Cape Town Airport", "type": "Airport", "distance": "35km"}
 ]'::jsonb,
 '[
   {"title": "University Town", "content": "Vibrant student culture and young energy", "rating": 5},
   {"title": "Wine Country", "content": "Surrounded by world-class wine estates", "rating": 5},
   {"title": "Walkability", "content": "Historic center is highly walkable", "rating": 5},
   {"title": "Seasonal Crowds", "content": "Busy during academic terms and tourist season", "rating": 3}
 ]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Re-add the foreign key constraint (but make it not enforced for demo)
-- In production, you would want to properly set this up with real auth.users
-- For now, we'll leave it without the constraint for demo purposes
