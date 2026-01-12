-- Insert sample agents first, then reference them in properties

-- Insert sample agents (these will be linked to auth.users when agents sign up)
-- For demo purposes, we create agents with placeholder IDs
INSERT INTO public.agents (
  id, name, email, phone, whatsapp, agency_name, license_number, bio, profile_image, verified, active
) VALUES
('a1111111-1111-1111-1111-111111111111',
 'Sarah Johnson',
 'sarah@seekrza.co.za',
 '+27 82 123 4567',
 '+27821234567',
 'Cape Town Properties',
 'CPT2023001',
 'Experienced estate agent specializing in Cape Town residential properties. Over 10 years in the industry.',
 '/placeholder.svg?height=200&width=200',
 true,
 true),
 
('a2222222-2222-2222-2222-222222222222',
 'Thabo Mbeki',
 'thabo@gautengproperties.co.za',
 '+27 83 234 5678',
 '+27832345678',
 'Gauteng Properties',
 'GP2023002',
 'Specialist in Johannesburg and Pretoria luxury estates and commercial properties.',
 '/placeholder.svg?height=200&width=200',
 true,
 true);

-- Insert sample properties for Cape Town
INSERT INTO public.properties (
  agent_id, title, description, price, property_type, listing_type,
  bedrooms, bathrooms, parking_spaces, floor_size, erf_size,
  monthly_levy, monthly_rates, sectional_title, freehold,
  has_solar, has_inverter, has_fiber, pet_friendly, in_estate, estate_name,
  address, suburb, city, province, postal_code, latitude, longitude,
  images, verified, status
) VALUES
-- Cape Town Properties (using Sarah Johnson's agent_id)
('a1111111-1111-1111-1111-111111111111', 
 'Stunning 3 Bedroom Home in Constantia', 
 'Beautiful family home with mountain views, solar panels, and inverter backup. Perfect for families seeking a peaceful lifestyle in one of Cape Town''s most sought-after suburbs. Features include modern kitchen, spacious garden, and double garage.',
 4750000.00, 'house', 'sale', 3, 2.5, 2, 185.00, 650.00,
 0, 1850.00, false, true,
 true, true, true, true, true, 'Silvermist Estate',
 '15 Mountain View Drive', 'Constantia', 'Cape Town', 'Western Cape', '7806', -34.0245, 18.4692,
 '["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]'::jsonb,
 true, 'active'),

('a1111111-1111-1111-1111-111111111111',
 'Modern 2 Bed Apartment - Sea Point',
 'Chic 2-bedroom apartment with ocean views and fiber connectivity. Walking distance to beaches, restaurants, and cafes. Secure building with 24/7 security. Perfect for professionals or as an investment.',
 2950000.00, 'apartment', 'sale', 2, 2.0, 1, 95.00, 0,
 2100.00, 0, true, false,
 false, false, true, true, false, '',
 '42 Beach Road', 'Sea Point', 'Cape Town', 'Western Cape', '8005', -33.9249, 18.3870,
 '["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]'::jsonb,
 true, 'active'),

('a1111111-1111-1111-1111-111111111111',
 'Family Home with Solar - Durbanville',
 'Spacious 4-bedroom family home with complete solar system and load-shedding backup. Large garden, entertainment area with braai, and triple garage. Close to excellent schools.',
 3200000.00, 'house', 'sale', 4, 3.0, 3, 220.00, 850.00,
 0, 1650.00, false, true,
 true, true, true, true, false, '',
 '28 Oak Avenue', 'Durbanville', 'Cape Town', 'Western Cape', '7550', -33.8350, 18.6486,
 '["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]'::jsonb,
 true, 'active'),

-- Johannesburg Properties (using Thabo's agent_id)
('a2222222-2222-2222-2222-222222222222',
 'Luxury Estate Home - Sandton',
 'Magnificent 5-bedroom home in prestigious Dainfern Estate. Features include cinema room, gym, wine cellar, and staff quarters. Complete solar system with battery backup. 24/7 estate security.',
 12500000.00, 'house', 'sale', 5, 4.5, 4, 450.00, 1200.00,
 4500.00, 2800.00, false, true,
 true, true, true, true, true, 'Dainfern Estate',
 '7 Fairway Drive', 'Dainfern', 'Johannesburg', 'Gauteng', '2055', -26.0285, 27.9972,
 '["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]'::jsonb,
 true, 'active'),

('a2222222-2222-2222-2222-222222222222',
 'Penthouse Apartment - Rosebank',
 'Stunning 3-bedroom penthouse with panoramic city views. Smart home automation, fiber, and backup power. Walking distance to Gautrain, Mall of Rosebank, and business district.',
 5800000.00, 'apartment', 'sale', 3, 2.5, 2, 180.00, 0,
 3200.00, 0, true, false,
 false, true, true, false, false, '',
 'The Zone, 120 Oxford Road', 'Rosebank', 'Johannesburg', 'Gauteng', '2196', -26.1467, 28.0436,
 '["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]'::jsonb,
 true, 'active'),

('a2222222-2222-2222-2222-222222222222',
 'Secure Townhouse - Fourways',
 'Modern 3-bedroom townhouse in secure estate with excellent amenities. Fiber ready, prepaid electricity, and pet-friendly. Close to Fourways Mall and top schools.',
 2150000.00, 'townhouse', 'sale', 3, 2.5, 2, 165.00, 220.00,
 1850.00, 0, true, false,
 false, false, true, true, true, 'Cedar Creek Estate',
 '14 Cedar Lane', 'Fourways', 'Johannesburg', 'Gauteng', '2055', -26.0147, 28.0038,
 '["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]'::jsonb,
 true, 'active'),

-- Rental Properties
('a1111111-1111-1111-1111-111111111111',
 'Stylish 1 Bed Flat - Gardens, Cape Town',
 'Trendy 1-bedroom flat in the heart of Gardens. Fiber installed, modern finishes, and close to city center. Perfect for young professionals. Available immediately.',
 15000.00, 'apartment', 'rent', 1, 1.0, 1, 55.00, 0,
 800.00, 0, true, false,
 false, false, true, false, false, '',
 '88 Kloof Street', 'Gardens', 'Cape Town', 'Western Cape', '8001', -33.9391, 18.4094,
 '["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]'::jsonb,
 false, 'active'),

('a2222222-2222-2222-2222-222222222222',
 'Family Home to Rent - Pretoria East',
 '4-bedroom home with solar backup, large garden, and pool. Close to excellent schools and shopping centers. Pet-friendly with secure yard.',
 22000.00, 'house', 'rent', 4, 3.0, 2, 250.00, 900.00,
 0, 2100.00, false, true,
 true, true, true, true, false, '',
 '42 Jacaranda Avenue', 'Waterkloof', 'Pretoria', 'Gauteng', '0181', -25.7832, 28.2385,
 '["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"]'::jsonb,
 true, 'active');
