import type { ReactNode } from 'react'
import { Container, cx } from '@/components/primitives'
import { HighlightWord } from '@/components/ui/highlight-word'

/* ==========================================================================
   PAGE HERO — the top of every page that is not the home page

   The home hero set the language: a pill, a large heading with one word in
   moving light, the same spotlight wash, lines that rise into place. Every
   other page used to open on a small grey label and a plain heading, which
   made the rest of the site feel like a different, older build the moment
   you clicked through. This is that language as one component, so a case
   study, the contact page and a 404 all open the same way.

   The heading is passed in three parts — before, highlight, after — so the
   emphasised phrase is chosen per page and written in the copy, not
   guessed from it. Keep it to the word that carries the claim.

   It renders no motion of its own beyond the shared entrance (theme.css,
   `data-hero-line` / `data-hero-fade`), which is already off under reduced
   motion; the highlight's own loop stops there too.
   ========================================================================== */

type Props = {
  /** The line above the heading: a short label, or any node (e.g. pills). */
  eyebrow?: ReactNode
  before?: string
  highlight?: string
  after?: string
  headingId?: string
  lead?: ReactNode
  /** Buttons, links. */
  actions?: ReactNode
  /** Anything else that belongs in the header (facts, notes). */
  children?: ReactNode
  /** Above the eyebrow — a back link, say. */
  top?: ReactNode
  className?: string
  /** Narrower measure for short headings. */
  width?: 'md' | 'lg'
  /** No bottom padding — for a page whose next section supplies its own. */
  flush?: boolean
}

export function PageHero({
  eyebrow,
  before,
  highlight,
  after,
  headingId,
  lead,
  actions,
  children,
  top,
  className,
  width = 'lg',
  flush = false,
}: Props) {
  return (
    <section
      aria-labelledby={headingId}
      className={cx('page-hero relative overflow-clip pt-32 sm:pt-40', !flush && 'pb-16 sm:pb-20', className)}
    >
      <div aria-hidden="true" className="page-hero-glow pointer-events-none absolute inset-0" />

      <Container className="relative">
        {top ? (
          <div data-hero-fade style={{ '--hero-index': 0 } as React.CSSProperties} className="mb-10">
            {top}
          </div>
        ) : null}

        {eyebrow ? (
          <div data-hero-fade style={{ '--hero-index': 0 } as React.CSSProperties} className="mb-8">
            {typeof eyebrow === 'string' ? (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-canvas-2/60 py-1.5 pl-3 pr-4 text-[0.8125rem] text-ink-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-bright" />
                {eyebrow}
              </span>
            ) : (
              eyebrow
            )}
          </div>
        ) : null}

        <h1
          id={headingId}
          className={cx('text-h1 font-medium text-ink', width === 'md' ? 'max-w-3xl' : 'max-w-4xl')}
        >
          <span data-hero-line className="block overflow-hidden pb-[0.12em] pt-[0.04em]" style={{ '--hero-index': 1 } as React.CSSProperties}>
            <span className="block">
              {before ? <span className="text-ink-2">{before}</span> : null}
              {before && highlight ? ' ' : null}
              {highlight ? <HighlightWord>{highlight}</HighlightWord> : null}
              {/* Rendered exactly as given: pass " behind each one." with its
                  leading space, or "?" without one. */}
              {after ? <span className={highlight ? 'text-ink-2' : undefined}>{after}</span> : null}
            </span>
          </span>
        </h1>

        {lead ? (
          <div
            data-hero-fade
            style={{ '--hero-index': 2 } as React.CSSProperties}
            className="text-body-lg mt-6 max-w-2xl text-ink-2"
          >
            {lead}
          </div>
        ) : null}

        {actions ? (
          <div data-hero-fade style={{ '--hero-index': 3 } as React.CSSProperties} className="mt-10 flex flex-wrap items-center gap-3">
            {actions}
          </div>
        ) : null}

        {children ? (
          <div data-hero-fade style={{ '--hero-index': 4 } as React.CSSProperties}>
            {children}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
