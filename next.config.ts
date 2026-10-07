import type { NextConfig } from 'next'
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

/* Build-time constants.

   Next.js 16.3's Cache Components correctly refuses to prerender an unstable
   `new Date()` — the value would differ between build and request. The build
   stamp and the copyright year are genuinely build-time facts, so they are
   resolved here (next.config runs once, in Node, at build time) and inlined
   as string literals. No Date call survives into the rendered output. */
const BUILD_TIME = new Date().toISOString()

/* Where this build thinks it lives, and whether it may be indexed.

   Both are inlined here rather than read at render time for the same reason
   BUILD_TIME is: they are facts about the build, they are needed in client
   components as well as server ones, and `process.env` is not available in the
   browser unless it is inlined.

   SITE_ORIGIN lets a preview deploy on onrender.com emit canonical URLs and a
   sitemap that point at ITSELF rather than at the production domain. Without
   it, a staging deploy publishes a sitemap full of production URLs, which is
   how a preview environment ends up competing with the real site in search.

   ALLOW_PLACEHOLDERS is the escape hatch for deploying a site that still has
   [BRACKETED] content — useful for showing someone work in progress. It is
   deliberately wired to indexability: you may preview a site with holes in
   it, but a site with holes is never indexable. See app/robots.ts. */
const SITE_ORIGIN = process.env.SITE_ORIGIN ?? ''
const ALLOW_PLACEHOLDERS = process.env.ALLOW_PLACEHOLDERS === '1' ? '1' : ''

/* The CV is a real PDF dropped into /public, not a page generated from data.
   Whether it is there, and how big it is, are build-time facts like the stamp
   above — read once here so the footer button can say "PDF · 184 KB" without
   a server round-trip, and so a build without the file is caught by
   check:content rather than shipping a viewer that opens onto a 404.
   Keep this path in step with CV_PDF in lib/site.config.ts. */
const CV_FILE = join(process.cwd(), 'public', 'dheeraj-kumar-cv.pdf')
const CV_BYTES = existsSync(CV_FILE) ? String(statSync(CV_FILE).size) : ''

const nextConfig: NextConfig = {
  env: {
    BUILD_TIME,
    BUILD_YEAR: String(new Date().getFullYear()),
    SITE_ORIGIN,
    ALLOW_PLACEHOLDERS,
    CV_BYTES,
    /* Render exposes the commit and branch under its own names. Mapped here so
       the footer's build stamp works on Render as well as Vercel instead of
       silently reading "local / dev" on a real deployment. */
    COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.RENDER_GIT_COMMIT ?? '',
    COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF ?? process.env.RENDER_GIT_BRANCH ?? '',
  },

  /* Next.js 16.3 Instant Navigations. The plan's ruling was to lean on the
     framework making navigations instant rather than adding an artificial
     transition curtain.

     MEASURED, not assumed: with these flags the zero-client-component
     baseline is 178.3 KB gzip; with them off it is 181.4 KB. They are
     marginally CHEAPER as well as faster to navigate, so they stay on. */
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers. Kept here rather than in middleware so they apply to
  // static assets too and cost nothing at request time.
  /* /cv was a page; the CV is now a viewer that opens over whatever page you
     are on. Old links and printed QR codes still land somewhere real. */
  async redirects() {
    return [{ source: '/cv', destination: '/#cv', permanent: false }]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        /* Declared AFTER the catch-all so it wins for this one file: the CV
           viewer frames the PDF from the same origin, which DENY forbids.
           SAMEORIGIN still refuses every other site. `inline` makes "open"
           open it, while the viewer's download link carries its own
           filename via the `download` attribute. */
        source: '/dheeraj-kumar-cv.pdf',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Disposition', value: 'inline; filename="Dheeraj-Kumar-CV.pdf"' },
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
        ],
      },
    ]
  },
}

export default nextConfig
