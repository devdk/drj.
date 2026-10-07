'use client'

import { useEffect, useRef, useState } from 'react'
import { cx } from '@/components/primitives'

/* ==========================================================================
   PROCESS JOURNEY — the four stages as a route you scroll along

   Left: the four stage names, set large, with the one you are reading lit
   and a rail beside them filling as you go. It stays put (sticky) while the
   right column scrolls, so the visitor always knows where in the project
   they are reading — "this is stage 2 of 4" — without a heading saying so.

   Right: one card per stage. The card in the middle of the screen is the
   active one; the others dim back a step.

   ── WITHOUT JAVASCRIPT, OR ON A PHONE ─────────────────────────────────────

   Every card is fully readable at all times; "active" only adds emphasis.
   On a phone there is no sticky column — the cards stack, each with its own
   number, which already says "in order".

   The state is one IntersectionObserver deciding which card crosses the
   middle band of the viewport. No scroll listener, nothing per frame.
   ========================================================================== */

export type Stage = {
  stage: string
  what: string
  youGet: string
  watchFor: string
}

export function ProcessJourney({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0)
  const cardRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const i = cardRefs.current.indexOf(entry.target as HTMLLIElement)
          if (i >= 0) setActive(i)
        }
      },
      // A thin band across the middle of the viewport: whichever card is in
      // it is the one being read.
      { rootMargin: '-45% 0px -45% 0px' },
    )
    cardRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const progress = (active + 1) / stages.length

  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
      {/* ── The route ─────────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 id="process-heading" className="text-h2 max-w-md font-medium text-ink">
          How a project runs
        </h2>
        <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-ink-2">
          Four stages, the same on every project.
        </p>

        <div aria-hidden="true" className="relative mt-12 hidden pl-8 lg:block">
          {/* Rail, and its fill. */}
          <span className="absolute bottom-2 left-0 top-2 w-px bg-hairline-strong" />
          <span
            className="process-rail-fill absolute left-0 top-2 w-px origin-top bg-accent-bright"
            style={{ height: 'calc(100% - 1rem)', transform: `scaleY(${progress})` }}
          />
          <span
            className="process-rail-dot absolute -left-[5px] size-[11px] rounded-full bg-accent-bright"
            style={{ top: `calc(0.5rem + (100% - 1rem) * ${progress} - 5px)` }}
          />

          <ol className="space-y-1">
            {stages.map((stage, i) => (
              <li key={stage.stage} className="flex items-baseline gap-4">
                <span
                  className={cx(
                    'w-7 font-mono text-[0.75rem] tabular-nums transition-colors duration-500',
                    i === active ? 'text-accent-bright' : 'text-ink-3',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cx(
                    'process-stage-name text-[clamp(2.5rem,1.6rem+2.4vw,4rem)] font-medium leading-[1.08] tracking-[-0.04em] transition-[color,opacity,transform] duration-500 ease-[var(--ease-ui)]',
                    i === active ? 'is-active translate-x-1' : i < active ? 'opacity-60' : 'opacity-30',
                  )}
                >
                  {stage.stage}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── The stages ────────────────────────────────────────────────── */}
      <ol className="space-y-5">
        {stages.map((stage, i) => {
          const isActive = i === active
          return (
            <li
              key={stage.stage}
              ref={(node) => {
                cardRefs.current[i] = node
              }}
              className={cx(
                'process-card relative overflow-hidden rounded-[var(--radius-xl)] border p-7 transition-[border-color,background-color,opacity,transform] duration-500 ease-[var(--ease-ui)] sm:p-9',
                isActive
                  ? 'is-active border-[color-mix(in_oklab,var(--color-accent-bright)_45%,transparent)]'
                  : 'border-hairline lg:opacity-70',
              )}
            >
              {/* The stage number, set huge and faint behind the card. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[9rem] font-bold leading-none tracking-[-0.06em] text-[color-mix(in_oklab,var(--color-ink)_5%,transparent)]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-3">
                  Stage {String(i + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
                </p>
                {/* Large on a phone, where it is the only place the stage is
                    named; smaller beside the big list on a desktop. */}
                <h3 className="mt-3 text-[1.875rem] font-medium leading-none tracking-[-0.03em] text-ink lg:text-[1.5rem] lg:leading-tight lg:tracking-[-0.02em]">
                  {stage.stage}
                </h3>
                <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink">{stage.what}</p>

                <dl className="mt-8 grid gap-6 border-t border-hairline pt-6 sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">You get</dt>
                    <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink">{stage.youGet}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-accent">Watch for</dt>
                    <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{stage.watchFor}</dd>
                  </div>
                </dl>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
