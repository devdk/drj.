import Link from 'next/link'
import { site, build, CV_PDF } from '@/lib/site.config'
import { Container } from '@/components/primitives'
import { LocalClock } from './LocalClock'
import { FooterWordmark } from './FooterWordmark'
import { CvViewer } from '@/components/interactive/CvViewer'

/* ==========================================================================
   FOOTER

   Brand and copyright on the left, plain columns of links on the right, and
   the name set edge to edge underneath — the shape people already know from
   product sites, so nobody has to learn the footer before using it.

   What stays from the old footer, and why:

   1. THE CV. The one thing on the site someone takes away with them, and the
      footer is where a visitor who has finished reading goes looking for it.
      It sits under the brand, where the eye lands first.

   2. THE LOCAL CLOCK. A small, honest signal that a real person in a real
      timezone is on the other end — which matters to a client in another
      country deciding whether replies will come during their working day.

   3. THE BUILD STAMP. Making the last-updated date visible is what keeps the
      pressure on to keep the site current.

   4. THE DEV DOOR. Quiet on purpose — it is for the visitor who already
      wants to look underneath, and that visitor goes looking.
   ========================================================================== */

/** Formats the build-time constant. Not a live clock — see LocalClock for
    that, which is client-only precisely because it IS live. */
function formatBuildDate(iso: string): string {
  if (!iso) return 'unknown'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'unknown'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const PAGES: [string, string][] = [
  ['Work', '/#chapter-work'],
  ['How it works', '/#working-together'],
  ['Ask the site', '/#ask'],
  ['Start a project', '/#chapter-contact'],
]

const linkClass =
  'text-[0.9375rem] text-ink-2 transition-colors duration-[var(--duration-micro)] hover:text-ink'

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-5 text-[0.9375rem] font-medium text-ink">{title}</h2>
      {children}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline">
      <Container className="pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          {/* ── Brand ─────────────────────────────────────────────────── */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-[10px] bg-ink font-mono text-[0.9375rem] font-bold text-canvas"
              >
                D
              </span>
              <span className="text-[1rem] font-medium text-ink">{site.name}</span>
            </Link>
            <p className="mt-5 text-[0.9375rem] text-ink-3">
              © {build.year} {site.name}. All rights reserved.
            </p>

            <div className="mt-8">
              <CvViewer
                href={CV_PDF.href}
                fileName={CV_PDF.fileName}
                bytes={CV_PDF.bytes}
                name={site.name}
              />
            </div>
          </div>

          {/* ── Columns ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3 sm:gap-x-16">
            <nav aria-label="Footer">
              <Column title="Pages">
                <ul className="space-y-3.5">
                  {PAGES.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className={linkClass}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Column>
            </nav>

            <Column title="Elsewhere">
              <ul className="space-y-3.5">
                <li>
                  <a href={site.links.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className={linkClass}>
                    Email
                  </a>
                </li>
              </ul>
            </Column>

            <Column title="Local time">
              <LocalClock />
              <p className="mt-1.5 text-[0.875rem] text-ink-3">{site.location}</p>
            </Column>
          </div>
        </div>

        {/* ── Small print ──────────────────────────────────────────────── */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dev"
            className="group inline-flex items-center gap-2 rounded-full border border-hairline px-3.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3 transition-colors duration-[var(--duration-micro)] hover:border-hairline-strong hover:text-ink-2"
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent-dim transition-colors duration-[var(--duration-micro)] group-hover:bg-accent"
            />
            Dev
          </Link>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
            Last updated {formatBuildDate(build.builtAt)}
            <span aria-hidden="true"> · </span>
            {build.sha}
          </p>
        </div>
      </Container>

      {/* ── The name, edge to edge ─────────────────────────────────────── */}
      <div className="pb-6">
        <FooterWordmark word={site.shortName.toUpperCase()} />
      </div>
    </footer>
  )
}
