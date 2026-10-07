'use client'

import { useId, useState } from 'react'
import type { Faq } from '@/content/engagement'
import { cx } from '@/components/primitives'

/* ==========================================================================
   FAQ ACCORDION

   ── WHY AN ACCORDION AFTER ALL ────────────────────────────────────────────

   The previous version printed all seven answers in two columns on the
   reasoning that nothing should be hidden. It was right about the principle
   and wrong about the reader: seven paragraphs of equal weight is a wall, and
   a wall is read by nobody. The questions are the scannable part — they are
   what a visitor looks for — so they get the weight, and the one answer
   being read gets the space.

   Every question is visible without interaction, which was the only part of
   the old argument worth keeping. The first answer starts open, so the
   section shows what it is before anyone clicks.

   ── ACCESSIBILITY ─────────────────────────────────────────────────────────

   The disclosure pattern: each question is a real <button> with
   aria-expanded and aria-controls, each answer a region labelled by its
   question. The height animates with the grid-rows trick in theme.css, so
   there is no measuring and nothing for a screen reader to trip over —
   collapsed panels are `inert`, so their text is neither focusable nor read.
   ========================================================================== */

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()

  return (
    <div className="border-t border-hairline">
      {items.map((item, i) => {
        const isOpen = open === i
        const buttonId = `${base}-q-${i}`
        const panelId = `${base}-a-${i}`
        return (
          <div
            key={item.question}
            className={cx(
              'relative border-b border-hairline transition-colors duration-300',
              isOpen && 'bg-[color-mix(in_oklab,var(--color-accent)_5%,transparent)]',
            )}
          >
            {/* The accent spine of the open row. */}
            <span
              aria-hidden="true"
              className={cx(
                'absolute inset-y-0 left-0 w-0.5 origin-top bg-accent transition-transform duration-500 ease-[var(--ease-ui)]',
                isOpen ? 'scale-y-100' : 'scale-y-0',
              )}
            />
            {/* h4: these sit under the "Questions people ask" h3. */}
            <h4>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-5 px-5 py-6 text-left sm:px-6"
              >
                <span
                  className={cx(
                    'w-7 shrink-0 font-mono text-[0.75rem] tabular-nums transition-colors duration-300',
                    isOpen ? 'text-accent' : 'text-ink-3',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cx(
                    'flex-1 text-[clamp(1.0625rem,0.95rem+0.5vw,1.3125rem)] font-medium leading-snug tracking-[-0.01em] transition-colors duration-300',
                    isOpen ? 'text-ink' : 'text-ink-2 group-hover:text-ink',
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cx(
                    'grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ease-[var(--ease-ui)]',
                    isOpen
                      ? 'rotate-45 border-transparent bg-accent text-accent-ink'
                      : 'border-hairline-strong text-ink-2 group-hover:border-ink-3',
                  )}
                >
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h4>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              data-open={isOpen}
              inert={!isOpen}
              className="acc-panel"
            >
              <div>
                <p className="max-w-2xl pb-7 pl-[4.25rem] pr-14 text-[1rem] leading-relaxed text-ink-2 sm:pl-[4.5rem]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
