import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sequoia-platform.vercel.app'

  const routes = [
    '',
    '/about',
    '/solutions',
    '/solutions/real-estate',
    '/solutions/business-funding',
    '/solutions/clean-energy',
    '/solutions/wellness',
    '/apply',
    '/contact',
    '/opportunity',
    '/enroll',
    '/resources',
    '/partner',
    '/reactivation',
    '/login',
    '/terms',
    '/privacy',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route.startsWith('/solutions') ? 0.9 : 0.7,
  }))
}
