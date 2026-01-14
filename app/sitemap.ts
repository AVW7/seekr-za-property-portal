import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seekr-za.com'

  // Static routes
  const staticRoutes = [
    '',
    '/account',
    '/account/buyability',
    '/account/personas',
    '/account/settings',
    '/agent',
    '/auth/login',
    '/auth/sign-up',
    '/auth/sign-up-success',
    '/calculator',
    '/insights',
    '/list-property',
    '/login',
    '/properties',
    '/saved',
    '/search',
  ]

  // Fetch dynamic property IDs
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .order('created_at', { ascending: false })

  const propertyRoutes = properties?.map((property) => `/properties/${property.id}`) || []

  // Fetch dynamic neighborhood IDs
  const { data: neighborhoods } = await supabase
    .from('neighborhoods')
    .select('id')
    .order('created_at', { ascending: false })

  const neighborhoodRoutes = neighborhoods?.map((neighborhood) => `/neighborhoods/${neighborhood.id}`) || []

  // Combine all routes
  const allRoutes = [
    ...staticRoutes,
    ...propertyRoutes,
    ...neighborhoodRoutes,
  ]

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}