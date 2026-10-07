'use client'

import { useRef } from 'react'

/* ==========================================================================
   FOOTER WORDMARK — the name, set as large as the page is wide

   Two copies of the same word, stacked. The base is barely there — ink at a
   few percent, the way a watermark sits in paper. The top copy is the accent
   colour and is masked to a soft circle that follows the pointer, so moving
   across the footer finds the letters with a torch. Nothing happens on
   touch or under reduced motion; the base word is the design, the torch is
   a reward for the curious.

   ── WHY SVG TEXT ──────────────────────────────────────────────────────────

   The word has to run exactly edge to edge at every width. In CSS that means
   a font-size in vw tuned by eye for one font and one word, and it drifts
   the moment either changes. An SVG <text> with `textLength` is told the
   width it must fill and the browser fits it — letter-spacing only, so the
   glyph shapes stay true.
   ========================================================================== */

function Word({ word, className }: { word: string; className?: string }) {
  return (
    <svg viewBox="0 0 1000 190" preserveAspectRatio="xMidYMid meet" className={className}>
      <text
        x="0"
        y="168"
        textLength="1000"
        lengthAdjust="spacing"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-sans)', fontSize: 214, fontWeight: 700, letterSpacing: '-0.02em' }}
      >
        {word}
      </text>
    </svg>
  )
}

export function FooterWordmark({ word }: { word: string }) {
  const ref = useRef<HTMLDivElement>(null)

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || event.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--wx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--wy', `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      className="footer-wordmark group relative mx-auto w-full max-w-[var(--container-content)] select-none px-[var(--spacing-gutter)]"
    >
      <Word word={word} className="block w-full text-[color-mix(in_oklab,var(--color-ink)_6%,transparent)]" />
      <div className="footer-wordmark-torch pointer-events-none absolute inset-0 px-[var(--spacing-gutter)] text-accent-bright">
        <Word word={word} className="block w-full" />
      </div>
    </div>
  )
}
