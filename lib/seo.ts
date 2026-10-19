import type { Metadata } from 'next'
import { site } from '@/lib/site.config'
import type { Project } from '@/lib/schema'
import { CATEGORY_LABELS } from '@/lib/content'
import { PROJECT_SEO, type PageSeo } from '@/content/seo'
import { featuredFor } from '@/content/featured'

/* ==========================================================================
   SEO HELPERS — metadata and JSON-LD built the same way on every page

   Two bugs this file exists to make impossible:

   1. A page inheriting the root layout's canonical. Next merges metadata
      shallowly, so a page that did not set `alternates` inherited
      `canonical: '/'` — /about, /contact and /thinking were each telling
      Google "I am a copy of the home page", which is how a page quietly
      never gets indexed. Every page now gets its own canonical from its path.

   2. A page that sets `openGraph` losing the inherited share image. Next
      replaces the whole openGraph object, images included, so case studies
      were shared with no picture at all. The image is now always set.
   ========================================================================== */

export const ORIGIN = site.url.replace(/\/$/, '')
export const PERSON_ID = `${ORIGIN}/#person`
export const WEBSITE_ID = `${ORIGIN}/#website`

/** The default share image: app/opengraph-image.tsx. */
const DEFAULT_OG = { url: '/opengraph-image', width: 1200, height: 630, alt: `${site.name} — Full Stack Developer` }

type MetaInput = PageSeo & {
  path: string
  /** Use the title as-is, without the "| Dheeraj Kumar" template. */
  absoluteTitle?: boolean
  type?: 'website' | 'article' | 'profile'
  image?: { url: string; width: number; height: number; alt: string }
  robots?: Metadata['robots']
}

export function pageMetadata({ title, description, path, absoluteTitle, type = 'website', image, robots }: MetaInput): Metadata {
  const img = image ?? DEFAULT_OG
  /* A title that already names him does not get the name appended again. */
  absoluteTitle = absoluteTitle || title.includes(site.name)
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: 'en_GB',
      title: fullTitle,
      description,
      images: [img],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [img.url],
    },
    ...(robots ? { robots } : {}),
  }
}

/** The card image for a project, when it has one, as an absolute-path share image. */
export function projectImage(project: Project) {
  if (!featuredFor(project.slug)) return undefined
  return {
    url: `/shots/${project.slug}-card.webp`,
    width: 2400,
    height: 1500,
    alt: projectImageAlt(project),
  }
}

export function projectImageAlt(project: Project): string {
  return PROJECT_SEO[project.slug]?.imageAlt ?? `${project.title}: ${project.tagline}`
}

export function projectSeo(project: Project): PageSeo {
  return PROJECT_SEO[project.slug] ?? { title: project.title, description: project.tagline }
}

/* --- JSON-LD ------------------------------------------------------------- */

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${ORIGIN}${item.path}`,
    })),
  }
}

export function webPage(type: string, path: string, seo: PageSeo, extra: Record<string, unknown> = {}) {
  return {
    '@type': type,
    '@id': `${ORIGIN}${path}#webpage`,
    url: `${ORIGIN}${path}`,
    name: seo.title,
    description: seo.description,
    inLanguage: 'en-GB',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    ...extra,
  }
}

/** A case study as an Article about the thing that was built. */
export function caseStudyGraph(project: Project) {
  const seo = projectSeo(project)
  const path = `/work/${project.slug}`
  const image = projectImage(project)
  const isSoftware = ['webapp', 'automation', 'ai'].includes(project.category)
  const subject: Record<string, unknown> = isSoftware
    ? {
        '@type': 'SoftwareApplication',
        name: project.title.split(' — ')[0],
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        ...(project.url && project.urlAccess !== 'private' ? { url: project.url } : {}),
      }
    : {
        '@type': 'WebSite',
        name: project.client ?? project.title,
        ...(project.url ? { url: project.url } : {}),
      }

  return [
    {
      '@type': 'Article',
      '@id': `${ORIGIN}${path}#article`,
      headline: seo.title,
      description: seo.description,
      url: `${ORIGIN}${path}`,
      mainEntityOfPage: `${ORIGIN}${path}`,
      inLanguage: 'en-GB',
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
      dateCreated: String(project.year),
      articleSection: `${CATEGORY_LABELS[project.category]} case study`,
      keywords: project.stack.map((s) => s.name).join(', '),
      ...(image ? { image: `${ORIGIN}${image.url}` } : {}),
      about: subject,
      isPartOf: { '@id': WEBSITE_ID },
    },
    breadcrumbs([
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/work' },
      { name: project.title, path },
    ]),
  ]
}

export function jsonLdScript(graph: Record<string, unknown>[] | Record<string, unknown>) {
  const nodes = Array.isArray(graph) ? graph : [graph]
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c')
}
