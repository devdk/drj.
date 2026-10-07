import { CanvasText } from '@/components/ui/canvas-text'

/* ==========================================================================
   HIGHLIGHT WORD — the hero's "light moving through the word", reusable

   One treatment for the one word in a heading that carries the claim, used
   by the home hero and every page hero, so the site has a single emphasis
   device rather than one per page.

   The word's base is a deep version of the chapter accent and the lines are
   the bright accent lifted towards white, fading line by line — so it reads
   as one colour with light moving through it, not as stripes. (Base and lines
   at the same brightness, the first try, made the lines all but invisible.)

   ── WRAPPING AND READING ──────────────────────────────────────────────────

   A canvas cannot wrap, so a phrase is drawn word by word with real spaces
   between: "doesn't exist" can break onto two lines on a phone like the
   heading around it. The canvases are decoration; the phrase itself is
   carried as visually hidden text, so the heading's accessible name is the
   plain sentence and nothing announces "image".
   ========================================================================== */

export const WORD_BASE = 'bg-[color-mix(in_oklab,var(--color-accent)_58%,var(--color-canvas))]'
export const WORD_LINES = [100, 90, 78, 66, 54, 42, 32, 22, 14, 8].map(
  (pct) => `color-mix(in oklab, color-mix(in oklab, var(--color-accent-bright) 72%, white) ${pct}%, transparent)`,
)

export function HighlightWord({ children }: { children: string }) {
  const words = children.split(/\s+/).filter(Boolean)
  return (
    <>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            {i > 0 ? ' ' : null}
            <CanvasText
              text={word}
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
    </>
  )
}
