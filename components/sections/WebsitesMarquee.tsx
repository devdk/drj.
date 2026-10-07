import Link from 'next/link'
import { getProject, hasProjectPage, CATEGORY_LABELS } from '@/lib/content'
import type { Project } from '@/lib/schema'
import { Arrow, Container, Section } from '@/components/primitives'
import { ThreeDMarquee, type MarqueeImage } from '@/components/ui/3d-marquee'

/* ==========================================================================
   WEBSITES & STORES

   Every Shopify and WordPress site, as one wall of real screenshots — the
   first screen of each live site, desktop and phone — laid back in 3D and
   drifting. Selected work argues depth with five projects; this argues
   volume, and lets a business owner see in one glance whether the work
   looks like the kind of site they want.

   The wall is decoration to assistive tech (see 3d-marquee.tsx). The list
   under it is the content: each site once, with its platform, linking to
   its case study.

   Tiles are built by scripts/build-marquee.mjs from the captures in
   captures/raw. Keep this list in step with SLUGS there.
   ========================================================================== */

const WEBSITE_SLUGS = [
  'zyvren',
  'allure-dental',
  'women-wellness-first',
  'mariforce',
  'chefs-and-homes',
  'swann-bookkeeping',
  'mirasphere-site',
]

/* 4 columns × 8 tiles — enough to run past the bottom-right of the frame
   once the wall is rotated. Fourteen distinct tiles (a desktop and a phone tile
   per site) are dealt so that no column shows the same site twice in a row
   and neighbouring columns start on different sites. */
const PER_COLUMN = 8

function tilesFor(sites: Project[]): MarqueeImage[] {
  const n = sites.length
  const deck: MarqueeImage[] = []
  sites.forEach((site, i) => {
    const phoneSite = sites[(i + 3) % n]!
    deck.push(tile(site, 'desktop'), tile(phoneSite, 'mobile'))
  })
  const out: MarqueeImage[] = []
  for (let col = 0; col < 4; col++) {
    for (let k = 0; k < PER_COLUMN; k++) out.push(deck[(col * 5 + k) % deck.length]!)
  }
  return out
}

function tile(site: Project, kind: 'desktop' | 'mobile'): MarqueeImage {
  return {
    src: `/shots/marquee/${site.slug}-${kind}.webp`,
    avif: `/shots/marquee/${site.slug}-${kind}.avif`,
    ...(hasProjectPage(site) ? { href: `/work/${site.slug}` } : {}),
  }
}

function domain(url?: string): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function WebsitesMarquee() {
  const sites = WEBSITE_SLUGS.map(getProject).filter((p): p is Project => Boolean(p))
  if (sites.length === 0) return null

  return (
    <Section id="websites" aria-labelledby="websites-heading">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <h2 id="websites-heading" className="text-h2 font-medium text-ink">
            Websites &amp; stores
          </h2>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-2">
            {sites.length} live sites on Shopify and WordPress.
          </p>
        </div>

        <div
          data-reveal
          className="relative overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-canvas-2 p-2"
        >
          <ThreeDMarquee images={tilesFor(sites)} className="marquee3d-fade rounded-[calc(var(--radius-xl)-0.5rem)]" />
        </div>

        {/* The content of the section — each site once. */}
        <ul className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {sites.map((site) => {
            const href = hasProjectPage(site) ? `/work/${site.slug}` : site.url
            const host = domain(site.url)
            const body = (
              <>
                <span className="block text-[0.9375rem] font-medium text-ink">{site.client ?? site.title}</span>
                <span className="mt-1 block font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
                  {CATEGORY_LABELS[site.category]}
                  {host ? ` · ${host}` : ''}
                </span>
              </>
            )
            return (
              <li key={site.slug} className="bg-canvas">
                {href ? (
                  <Link
                    href={href}
                    className="group flex h-full items-center justify-between gap-4 px-5 py-4 transition-colors duration-[var(--duration-micro)] hover:bg-canvas-2"
                  >
                    <span>{body}</span>
                    <span className="text-ink-3 transition-[color,transform] duration-[var(--duration-micro)] group-hover:translate-x-0.5 group-hover:text-ink">
                      <Arrow />
                    </span>
                  </Link>
                ) : (
                  <div className="px-5 py-4">{body}</div>
                )}
              </li>
            )
          })}
          {/* Seven sites leave the eighth cell of the grid empty; it is the
              natural place for the next one. */}
          <li className="bg-canvas">
            <Link
              href="/#chapter-contact"
              className="group flex h-full items-center justify-between gap-4 px-5 py-4 transition-colors duration-[var(--duration-micro)] hover:bg-canvas-2"
            >
              <span>
                <span className="block text-[0.9375rem] font-medium text-accent">Yours next</span>
                <span className="mt-1 block font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
                  Start a project
                </span>
              </span>
              <span className="text-accent transition-transform duration-[var(--duration-micro)] group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </Link>
          </li>
        </ul>
      </Container>
    </Section>
  )
}
