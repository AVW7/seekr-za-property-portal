import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seekr-za.com'

  // Static routes
  const staticRoutes = [
    // Core pages
    '',
    '/search',
    '/properties',
    '/saved',
    
    // Tools & calculators
    '/calculator',
    '/buyability',
    '/insights',
    
    // Suburbs/neighborhoods
    '/suburbs',
    '/suburbs/western-cape/cape-town',
    '/suburbs/western-cape/somerset-west',
    '/suburbs/western-cape/stellenbosch',
    '/suburbs/gauteng/sandton',
    '/suburbs/gauteng/fourways',
    '/suburbs/gauteng/centurion',
    '/suburbs/gauteng/johannesburg',
    '/suburbs/gauteng/pretoria',
    '/suburbs/kzn/durban-north',
    '/suburbs/kzn/umhlanga',
    '/suburbs/kzn/ballito',
    '/suburbs/kzn/durban',
    
    // Market insights
    '/market/sold-prices',
    '/market/trends',
    '/market/comps',
    
    // Agents
    '/agents',
    '/agents/onboard',
    '/agents/login',
    '/agents/feeds',
    '/agents/pricing',
    '/agent',
    '/agent/listings',
    '/agent/listings/new',
    '/agent/leads',
    '/agent/agency',
    '/agent/profile',
    '/list-property',
    
    // User account
    '/account',
    '/account/buyability',
    '/account/personas',
    '/account/settings',
    
    // Authentication
    '/auth/login',
    '/auth/sign-up',
    '/auth/sign-up-success',
    '/login',
    
    // User features
    '/alerts',
    
    // Support & help
    '/help',
    '/contact',
    '/faq',
    
    // Legal
    '/privacy',
    '/terms',
    '/cookies',
    '/accessibility',
  ]

  // Fetch dynamic property IDs
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .order('created_at', { ascending: false })

  const propertyRoutes = properties?.map((property) => `/properties/${property.id}`) || []

  // Note: Neighborhoods table not yet implemented in schema
  // Uncomment when table is created:
  // const { data: neighborhoods } = await supabase
  //   .from('neighborhoods')
  //   .select('id')
  //   .order('created_at', { ascending: false })
  // const neighborhoodRoutes = neighborhoods?.map((neighborhood) => `/neighborhoods/${neighborhood.id}`) || []

  // Combine all routes
  const allRoutes = [
    ...staticRoutes,
    ...propertyRoutes,
  ]

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}