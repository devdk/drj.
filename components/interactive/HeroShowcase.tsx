'use client'

import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Container, cx } from '@/components/primitives'
import { Tilt } from './Tilt'
import { CanvasText } from '@/components/ui/canvas-text'
import { WORD_BASE, WORD_LINES } from '@/components/ui/highlight-word'

/* ==========================================================================
   HERO SHOWCASE — the headline and the work as one object

   "I build the [CRM] your business runs on."

   The framed word changes, and the stage shows the real project behind it.
   The previous hero had a sentence AND a picture; this has a sentence that
   is the caption of the picture. Every word in the frame is a project on
   the page, and the frame is what moves the stage.

   ── THREE DETAILS THAT ARE THE WHOLE POINT ────────────────────────────────

   1. The word is drawn in moving light (components/ui/canvas-text), and its
      slot resizes to each word — measured, not guessed. Width is measured
      once the webfont has loaded, because measuring the fallback font
      produces a slot that is wrong by a few pixels on every word, which is
      the kind of wrong people feel without being able to name. This took
      over from the selection-box chip: one highlight treatment per word,
      never two.

   2. The tabs ARE the pause control. WCAG 2.2.2 requires that anything that
      moves on its own for more than five seconds can be paused. A separate
      pause button would be correct and ugly; here the tabs carry a progress
      line, hovering the TABS pauses it, and choosing a tab stops the cycle
      for good. The control is the content. Hovering the stage does not
      pause: the stage fills most of the first screen, so a resting pointer
      would otherwise stop the deck for nearly every desktop visitor.

   3. It never runs where it should not: not under reduced motion, not while
      the hero is off-screen. The cycle is driven by the CSS progress
      animation's own `animationend`, so pausing the animation pauses the
      cycle with it — there is no second timer to drift out of sync.
   ========================================================================== */

export type HeroItem = {
  /** The word in the frame: "CRM", "store". */
  word: string
  slug: string
  title: string
  /** "Shopify store · 2026" */
  meta: string
  href?: string
  /** Server-rendered screenshot or scope diagram. */
  visual: ReactNode
}

type Mode = 'idle' | 'auto' | 'stopped'

/* "platform, store, website, CRM" → "platforms, stores, websites and CRMs":
   the stable sentence the moving headline stands for, written as a person
   would say it. */
const plural = (word: string) => `${word}s`
const listOf = (words: string[]) =>
  words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`

const HOLD_MS = 5200

export function HeroShowcase({
  items,
  pill,
  actions,
}: {
  items: HeroItem[]
  pill: ReactNode
  actions: ReactNode
}) {
  const n = items.length
  const [active, setActive] = useState(0)
  /* `idle` on the server and on first paint: nothing animates until the
     client has checked the motion preference. Starting in `auto` would let
     the global reduced-motion rule shorten the progress animation to 0.01ms
     and spin the cycle before the preference could be read. */
  const [mode, setMode] = useState<Mode>('idle')
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(true)
  const [cycle, setCycle] = useState(0)
  /* The card that just left the front. It is dealt off the top of the deck
     (forward and down, fading) instead of jumping to the back, then settles
     into the back slot while invisible. */
  const [leaving, setLeaving] = useState<number | null>(null)
  const leaveTimer = useRef<number | undefined>(undefined)

  const sectionRef = useRef<HTMLElement>(null)
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([])
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [widths, setWidths] = useState<number[] | null>(null)

  /* ── Motion preference and visibility ─────────────────────────────────── */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMode(reduce ? 'stopped' : 'auto')

    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      threshold: 0.15,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* ── Measure every word, in the real font ─────────────────────────────── */
  const measure = useCallback(() => {
    const next = measureRefs.current.map((node) => node?.getBoundingClientRect().width ?? 0)
    if (next.every((w) => w > 0)) setWidths(next)
  }, [])

  useLayoutEffect(() => {
    measure()
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })
    const ro = new ResizeObserver(measure)
    if (sectionRef.current) ro.observe(sectionRef.current)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [measure])

  /* ── Navigation ───────────────────────────────────────────────────────── */
  const markLeaving = useCallback((i: number) => {
    setLeaving(i)
    window.clearTimeout(leaveTimer.current)
    leaveTimer.current = window.setTimeout(() => setLeaving(null), 950)
  }, [])

  useEffect(() => () => window.clearTimeout(leaveTimer.current), [])

  const advance = useCallback(() => {
    markLeaving(active)
    setActive((active + 1) % n)
    setCycle((c) => c + 1)
  }, [active, n, markLeaving])

  function choose(i: number, focus = false) {
    if (i !== active) markLeaving(active)
    setActive(i)
    setMode('stopped')
    if (focus) tabRefs.current[i]?.focus()
  }

  function onTabKey(event: React.KeyboardEvent) {
    let next: number | null = null
    if (event.key === 'ArrowRight') next = (active + 1) % n
    if (event.key === 'ArrowLeft') next = (active - 1 + n) % n
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = n - 1
    if (next === null) return
    event.preventDefault()
    choose(next, true)
  }

  /* ── The spotlight follows the pointer across the whole hero ──────────── */
  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--px', `${event.clientX - rect.left}px`)
    el.style.setProperty('--py', `${event.clientY - rect.top}px`)
  }

  const running = mode === 'auto' && !hovering && visible
  const current = items[active]!

  return (
    <section
      ref={sectionRef}
      id="chapter-identity"
      onPointerMove={onPointerMove}
      className="hero-section relative overflow-hidden pt-28 sm:pt-36"
    >
      <div aria-hidden="true" className="hero-spotlight pointer-events-none absolute inset-0" />

      <Container className="relative">
        <div data-hero-fade style={{ '--hero-index': 0 } as React.CSSProperties} className="mb-9">
          {pill}
        </div>

        {/* One stable sentence for assistive tech; the moving version is
            presentation only, so a screen reader is never read a headline
            that changes underneath it. */}
        <h1 className="sr-only">
          I build the {listOf(items.map((it) => plural(it.word)))} businesses run on.
        </h1>

        <p
          aria-hidden="true"
          className="relative font-medium text-ink"
          style={{
            /* The minimum is set by the longest framed word on a 390px phone:
               "I build the platform" must fit one line, because line one is
               nowrap — wrapping would make the headline jump every time the
               word changed. */
            fontSize: 'clamp(2rem, 0.6rem + 6vw, 6.25rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.045em',
          }}
        >
          {/* Each line in its own mask, so it rises into place. Padded so the
              frame's corner handles are not clipped by the mask. */}
          <span data-hero-line className="block overflow-hidden px-1 pb-[0.09em] pt-[0.14em]" style={{ '--hero-index': 0 } as React.CSSProperties}>
            <span className="block whitespace-nowrap">
              <span className="text-ink-2">I build the </span>
              <span
                className="relative inline-block align-baseline text-ink transition-[width] duration-[650ms] ease-[var(--ease-cinematic)]"
                style={widths ? { width: `${widths[active]}px` } : undefined}
              >
                {/* Holds the line height and, before measurement, the width. */}
                <span className="invisible">{current.word}</span>
                {items.map((it, i) => (
                  <span
                    key={it.word}
                    className={cx(
                      'absolute left-0 top-0 whitespace-nowrap transition-[opacity,transform,filter] duration-[650ms] ease-[var(--ease-cinematic)]',
                      i === active
                        ? 'translate-y-0 opacity-100 blur-0'
                        : 'translate-y-[0.32em] opacity-0 blur-[6px]',
                    )}
                  >
                    {/* Only the word on show animates; the rest hold a still
                        frame, so four canvases never run at once. */}
                    <CanvasText
                      text={it.word}
                      paused={i !== active}
                      backgroundClassName={WORD_BASE}
                      colors={WORD_LINES}
                      lineGap={5}
                      lineWidth={1.5}
                      curveIntensity={42}
                      animationDuration={14}
                    />
                  </span>
                ))}
              </span>
            </span>
          </span>
          <span data-hero-line className="block overflow-hidden px-1 pb-[0.1em]" style={{ '--hero-index': 1 } as React.CSSProperties}>
            <span className="block text-ink-2">
              your business <span className="text-ink">runs on.</span>
            </span>
          </span>

          {/* The measurer: every word, in the headline's own font, invisible. */}
          <span className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap">
            {items.map((it, i) => (
              <span
                key={it.word}
                ref={(node) => {
                  measureRefs.current[i] = node
                }}
                className="inline-block"
              >
                {it.word}
              </span>
            ))}
          </span>
        </p>

        <div
          data-hero-fade
          style={{ '--hero-index': 2 } as React.CSSProperties}
          className="mt-11 flex flex-wrap items-end justify-between gap-x-10 gap-y-8"
        >
          <div className="flex flex-wrap items-center gap-3">{actions}</div>

          {/* ── Tabs: which project, how long until the next ───────────── */}
          <div
            role="tablist"
            aria-label="Featured projects"
            onKeyDown={onTabKey}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            className="flex w-full items-stretch gap-1 sm:w-auto"
          >
            {items.map((it, i) => {
              const selected = i === active
              return (
                <button
                  key={it.slug}
                  ref={(node) => {
                    tabRefs.current[i] = node
                  }}
                  type="button"
                  role="tab"
                  id={`hero-tab-${it.slug}`}
                  aria-selected={selected}
                  aria-controls="hero-stage"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(i)}
                  className="group relative min-w-0 flex-1 px-3 pb-3.5 pt-1 text-left sm:w-[8.5rem] sm:flex-none"
                >
                  <span
                    className={cx(
                      'block truncate font-mono text-[0.625rem] uppercase tracking-[0.12em] transition-colors duration-300',
                      selected ? 'text-accent-bright' : 'text-ink-3',
                    )}
                  >
                    {it.word}
                  </span>
                  <span
                    className={cx(
                      'mt-0.5 block text-[0.8125rem] leading-snug transition-colors duration-300 sm:truncate sm:text-[0.875rem]',
                      selected ? 'text-ink' : 'text-ink-2 group-hover:text-ink',
                    )}
                  >
                    {it.title}
                  </span>
                  <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-0.5 overflow-hidden rounded-full bg-hairline-strong">
                    {selected ? (
                      mode === 'auto' ? (
                        <span
                          key={cycle}
                          onAnimationEnd={advance}
                          className="hero-progress block h-full rounded-full bg-accent-bright"
                          style={
                            {
                              '--hold': `${HOLD_MS}ms`,
                              animationPlayState: running ? 'running' : 'paused',
                            } as React.CSSProperties
                          }
                        />
                      ) : (
                        <span className="block h-full rounded-full bg-accent-bright" />
                      )
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </Container>

      {/* ── The stage: a deck, the chosen project in front ──────────────── */}
      <div
        data-hero-fade
        style={{ '--hero-index': 3 } as React.CSSProperties}
        className="relative mx-auto mt-14 max-w-[1240px] px-4 sm:mt-16 sm:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[8%] top-[6%] h-[75%] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in oklab, var(--color-accent) 42%, transparent), transparent)',
          }}
        />

        <div
          id="hero-stage"
          role="tabpanel"
          aria-labelledby={`hero-tab-${current.slug}`}
          className="relative mt-[7%] aspect-[16/10] [perspective:2200px]"
        >
          {items.map((it, i) => {
            const depth = (i - active + n) % n
            const front = depth === 0
            return (
              <div
                key={it.slug}
                data-depth={depth}
                data-leaving={leaving === i && !front ? '' : undefined}
                aria-hidden={!front}
                inert={!front}
                className="hero-card absolute inset-0"
              >
                <Tilt className="h-full rounded-[var(--radius-xl)]">
                  <Link
                    href={it.href ?? '/#chapter-work'}
                    aria-label={`${it.title} — ${it.meta}. Read the case study`}
                    className="block h-full overflow-hidden rounded-[var(--radius-xl)] border border-hairline-strong bg-canvas-2 shadow-[0_50px_140px_-40px_rgb(0_0_0/0.95)]"
                  >
                    {it.visual}
                  </Link>
                </Tilt>
              </div>
            )
          })}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-48 bg-gradient-to-b from-transparent to-canvas"
        />
      </div>
    </section>
  )
}
