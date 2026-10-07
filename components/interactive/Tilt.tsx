'use client'

import { useRef, type ReactNode } from 'react'
import { cx } from '@/components/primitives'

/* ==========================================================================
   TILT — pointer-driven perspective on a card

   Writes four custom properties and nothing else. The look — the angles, the
   easing back to rest, the sheen that follows the pointer — lives in the
   `.tilt` rules in styles/theme.css, so a designer can tune it without
   touching this file.

   ── WHEN IT DOES NOTHING ──────────────────────────────────────────────────

   On a coarse pointer, and under reduced motion. Both are checked at the
   moment of interaction rather than once at mount, because either can change
   while the page is open (a tablet gains a trackpad; a user flips the OS
   setting) and a stale answer would tilt for someone who asked it not to.

   No requestAnimationFrame loop and no state: pointermove writes straight to
   the element's style, so a card at rest costs nothing and a card in motion
   triggers no React render at all.
   ========================================================================== */

const MAX_DEG = 7

function allowed(): boolean {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function Tilt({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || !allowed()) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--ry', `${(x - 0.5) * 2 * MAX_DEG}deg`)
    el.style.setProperty('--rx', `${(0.5 - y) * 2 * MAX_DEG}deg`)
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.classList.add('is-tilting')
  }

  function onLeave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.classList.remove('is-tilting')
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cx('tilt relative', className)}
    >
      {children}
      <span aria-hidden="true" className="tilt-sheen rounded-[inherit]" />
    </div>
  )
}
