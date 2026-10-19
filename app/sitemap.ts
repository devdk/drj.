import type { MetadataRoute } from 'next'
import { build } from '@/lib/site.config'
import { getCaseStudySlugs, getProject } from '@/lib/content'
import { featuredFor } from '@/content/featured'

/* Sitemap (spec §45).

   Every indexable page is listed; /dev is noindex and so is left out
   (listing a noindex URL sends contradictory signals). Case studies carry
   their card image, so the images are discoverable for image search.

   lastModified uses the build stamp rather than `new Date()` — the same
   build-time constant the footer uses, so the two can never disagree. */
export default function sitemap(): MetadataRoute.Sitemap {
  /* No sitemap for a build that is not indexable. Returning an empty array is
     the honest answer: robots.txt already disallows everything, and a sitemap
     listing pages that robots forbids is a contradiction crawlers log as an
     error. */
  if (!build.indexable) return []

  /* The origin this build is served from, not the production domain — see
     app/robots.ts. A preview deploy's sitemap must describe the preview. */
  const base = build.origin
  const lastModified = build.builtAt ? new Date(build.builtAt) : undefined

  type Route = { path: string; priority: number; changeFrequency: 'monthly' | 'yearly'; images?: string[] }
  const routes: Route[] = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/work', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/thinking', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
    { path: '/lab', priority: 0.5, changeFrequency: 'yearly' },
  ]

  const caseStudies: Route[] = getCaseStudySlugs().map((slug) => ({
    path: `/work/${slug}`,
    priority: getProject(slug)?.tier === 'flagship' ? 0.8 : 0.7,
    changeFrequency: 'yearly' as const,
    images: featuredFor(slug) ? [`${base}/shots/${slug}-card.webp`] : undefined,
  }))

  return [...routes, ...caseStudies].map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(route.images ? { images: route.images } : {}),
  }))
}
