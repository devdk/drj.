import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import '@/styles/theme.css'

import { build, site } from '@/lib/site.config'
import { PAGE_SEO } from '@/content/seo'
import { ORIGIN, PERSON_ID, WEBSITE_ID, jsonLdScript } from '@/lib/seo'
import { buildSearchIndex } from '@/lib/content'
import { Background } from '@/components/layout/Background'
import { StatusBar } from '@/components/layout/StatusBar'
import { Beam } from '@/components/layout/Beam'
import { ChapterNarrative } from '@/components/layout/ChapterNarrative'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Cursor } from '@/components/layout/Cursor'
import { CommandPaletteLoader } from '@/components/layout/CommandPaletteLoader'
import { MotionProvider } from '@/components/layout/MotionProvider'
import { Analytics } from '@/components/layout/Analytics'

const canonical = site.url.includes('[') ? undefined : site.url

export const metadata: Metadata = {
  ...(canonical ? { metadataBase: new URL(canonical) } : {}),
  /* Pages set their own title, description, canonical and share card through
     lib/seo.ts (pageMetadata). These are only the fallbacks, so a page that
     forgets cannot inherit the home page's canonical — there deliberately is
     no `alternates` here. */
  title: {
    default: PAGE_SEO.home.title,
    template: `%s | ${site.name}`,
  },
  description: PAGE_SEO.home.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'technology',
  formatDetection: { email: false, address: false, telephone: false },
  /* Derived from the build, never hardcoded true. A preview deploy carrying
     placeholders must not tell crawlers to index it — and this is the signal
     that actually keeps a page out of the index, since robots.txt only stops
     the crawl, not the listing of a URL someone else linked to. */
  robots: build.indexable
    ? {
        index: true,
        follow: true,
        /* Let search and answer engines show full snippets and large image
           previews — the default caps both. */
        googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
      }
    : { index: false, follow: false, nocache: true },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export const viewport: Viewport = {
  themeColor: '#08090A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

/* JSON-LD. Person + WebSite, per spec §45. Emitted server-side so it costs
   nothing at runtime and is present for crawlers on first byte. */
function StructuredData() {
  const cv = site.cv
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: site.name,
      givenName: 'Dheeraj',
      familyName: 'Kumar',
      alternateName: 'drj',
      jobTitle: 'Full Stack Developer',
      description: PAGE_SEO.home.description,
      url: ORIGIN,
      email: `mailto:${site.email}`,
      image: `${ORIGIN}/opengraph-image`,
      address: { '@type': 'PostalAddress', addressLocality: 'Gurugram', addressRegion: 'Haryana', addressCountry: 'IN' },
      worksFor: { '@type': 'Organization', name: 'Mirasphere Digital', url: 'https://mirasphere.digital/' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'K.R. Mangalam University' },
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: cv.education[0]?.qualification,
      },
      knowsAbout: [
        'Full stack web development',
        'TypeScript',
        'React',
        'Next.js',
        'Node.js',
        'PostgreSQL',
        'Shopify theme development',
        'WordPress development',
        'Technical SEO',
        'Core Web Vitals',
        'Business automation',
      ],
      sameAs: [site.links.linkedin, site.links.github],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: site.name,
      alternateName: 'drj.',
      url: ORIGIN,
      description: PAGE_SEO.home.description,
      inLanguage: 'en-GB',
      publisher: { '@id': PERSON_ID },
      author: { '@id': PERSON_ID },
    },
  ]

  return (
    <script
      type="application/ld+json"
      // Server-rendered from static data — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }}
    />
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = buildSearchIndex()

  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <StructuredData />
        {/* Marks JS as present so CSS can safely pre-hide elements that the
            IntersectionObserver will reveal. Without this, a script failure
            would leave content permanently invisible. Inlined and synchronous
            by design — it must run before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[600] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-accent-ink"
        >
          Skip to content
        </a>

        <Background />
        <Cursor />
        <MotionProvider />

        {/* The chapter hue system. ChapterNarrative writes the active hue onto
            <html>; because those three custom properties are registered with
            @property in theme.css, the browser interpolates them and the whole
            interface re-tints together. StatusBar and Beam are the two most
            visible carriers of that colour. */}
        <ChapterNarrative />
        <StatusBar />
        <Beam />

        <Nav />

        <main id="main" className="relative">
          {children}
        </main>

        <Footer />

        <CommandPaletteLoader entries={searchIndex} />
        <Analytics />
      </body>
    </html>
  )
}
