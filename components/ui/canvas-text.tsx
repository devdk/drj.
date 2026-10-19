'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/* ==========================================================================
   CANVAS TEXT — text filled with slowly flowing lines

   Adapted from Aceternity UI's Canvas Text. The API is the original's, so
   their demos paste in unchanged:

     <CanvasText text="Lightning Speed" backgroundClassName="bg-blue-600"
       colors={[...]} lineGap={4} animationDuration={20} />

   ── WHAT CHANGED FROM THE ORIGINAL, AND WHY ───────────────────────────────

   1. BASELINE FROM THE FONT, NOT THE GLYPHS. The original centred each word
      on its own ink box, so "CRM" and "platform" (which has a descender)
      sat at different heights — a jump every time the word changed. The
      baseline now comes from the font's ascent/descent, which is how CSS
      lays text out, so the canvas lines up with the text it replaces.

   2. NO CLIPPED GLYPHS. A canvas the exact size of a tight-leading span cuts
      off descenders and overshoot. It is drawn with a margin and offset back.

   3. THE REAL FONT. It measures again once webfonts have loaded, and copies
      letter-spacing across where the canvas supports it — otherwise a
      negatively tracked headline comes out wider than its slot.

   4. COLOURS RESOLVE WHERE THE COMPONENT IS. The original read CSS variables
      off <html>; this site redefines tokens per section (paper, panels), so
      colours are resolved by a probe inside the component and accept
      anything CSS does — var(), color-mix(), oklch().

   5. IT STOPS. Under reduced motion it draws one still frame. Off-screen, or
      with `paused`, the loop stops instead of burning a core forever.
   ========================================================================== */

interface CanvasTextProps {
  text: string
  className?: string
  /** A background utility whose colour becomes the text's base fill. */
  backgroundClassName?: string
  colors?: string[]
  /** Seconds per full swing of the lines. */
  animationDuration?: number
  lineWidth?: number
  lineGap?: number
  curveIntensity?: number
  overlay?: boolean
  /** Hold the current frame — for a word that is not on show. */
  paused?: boolean
}

type Metrics = { width: number; height: number; font: string; spacing: string; size: number }

export function CanvasText({
  text,
  className = '',
  backgroundClassName = 'bg-white dark:bg-neutral-950',
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'],
  animationDuration = 5,
  lineWidth = 1.5,
  lineGap = 10,
  curveIntensity = 60,
  overlay = false,
  paused = false,
}: CanvasTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const bgRef = useRef<HTMLSpanElement>(null)
  const probeRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef(0)
  /* Elapsed time survives pauses, so resuming continues the motion rather
     than snapping back to the first frame. */
  const elapsedRef = useRef(0)

  const [bgColor, setBgColor] = useState('')
  const [resolvedColors, setResolvedColors] = useState<string[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [onScreen, setOnScreen] = useState(true)
  const [reduced, setReduced] = useState(false)

  const colorKey = colors.join('|')

  const updateColors = useCallback(() => {
    if (bgRef.current) setBgColor(getComputedStyle(bgRef.current).backgroundColor)
    const probe = probeRef.current
    if (!probe) return
    setResolvedColors(
      colorKey.split('|').map((color) => {
        probe.style.color = ''
        probe.style.color = color
        return getComputedStyle(probe).color || color
      }),
    )
  }, [colorKey])

  useEffect(() => {
    updateColors()
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
    return () => observer.disconnect()
  }, [updateColors])

  /* ── Measure, in the font that will actually be drawn ─────────────────── */
  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      if (rect.width === 0) return
      setMetrics({
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
        font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
        spacing: cs.letterSpacing,
        size: parseFloat(cs.fontSize) || 16,
      })
    }
    measure()
    let live = true
    document.fonts?.ready.then(() => live && measure())
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      live = false
      ro.disconnect()
    }
  }, [text, className])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)

    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return () => mq.removeEventListener('change', sync)
    const io = new IntersectionObserver(([entry]) => setOnScreen(Boolean(entry?.isIntersecting)))
    io.observe(el)
    return () => {
      mq.removeEventListener('change', sync)
      io.disconnect()
    }
  }, [])

  /* ── Draw ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !metrics || resolvedColors.length === 0 || !bgColor) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const { width, height, font, spacing, size } = metrics
    const padX = Math.ceil(size * 0.12)
    const padY = Math.ceil(size * 0.28)
    const W = width + padX * 2
    const H = height + padY * 2
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    canvas.style.left = `${-padX}px`
    canvas.style.top = `${-padY}px`

    ctx.font = font
    if ('letterSpacing' in ctx && spacing !== 'normal') {
      ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = spacing
    }
    const m = ctx.measureText(text)
    const ascent = m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent
    const descent = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent
    // Half-leading, as CSS does it: the font's box centred in the line box.
    const baseline = padY + (height - (ascent + descent)) / 2 + ascent

    const numLines = Math.floor(H / lineGap) + 10

    const draw = (seconds: number) => {
      const phase = (seconds / animationDuration) * Math.PI * 2
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      ctx.globalCompositeOperation = 'source-over'
      ctx.textBaseline = 'alphabetic'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#000'
      ctx.fillText(text, padX, baseline)

      ctx.globalCompositeOperation = 'source-in'
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, W, H)

      ctx.globalCompositeOperation = 'source-atop'
      ctx.lineWidth = lineWidth
      const curve1 = Math.sin(phase) * curveIntensity
      const curve2 = Math.sin(phase + 0.5) * curveIntensity * 0.6
      for (let i = 0; i < numLines; i++) {
        const y = i * lineGap - lineGap * 4
        ctx.strokeStyle = resolvedColors[i % resolvedColors.length]!
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.bezierCurveTo(W * 0.33, y + curve1, W * 0.66, y + curve2, W, y)
        ctx.stroke()
      }
    }

    const still = reduced || paused || !onScreen
    if (still) {
      draw(reduced ? animationDuration * 0.15 : elapsedRef.current)
      return
    }

    let last = performance.now()
    const tick = (now: number) => {
      elapsedRef.current += (now - last) / 1000
      last = now
      draw(elapsedRef.current)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [text, metrics, bgColor, resolvedColors, animationDuration, lineWidth, lineGap, curveIntensity, reduced, paused, onScreen])

  return (
    <span ref={rootRef} className={cn('relative inline-block', overlay && 'absolute inset-0', className)}>
      <span
        ref={bgRef}
        aria-hidden="true"
        className={cn('pointer-events-none absolute h-0 w-0 opacity-0', backgroundClassName)}
      />
      <span ref={probeRef} aria-hidden="true" className="pointer-events-none absolute h-0 w-0 opacity-0" />
      {/* Holds the layout: the word is drawn by a pseudo-element from
          data-text, so it sizes the box exactly as text would but is not in
          the DOM's text. Every use of this component sits beside the real
          words (a visually hidden copy, or an sr-only heading); a second,
          invisible copy as a text node made crawlers read headings twice —
          "VirtuosoVirtuoso". */}
      <span
        ref={textRef}
        aria-hidden="true"
        data-text={text}
        className="invisible inline-block whitespace-nowrap before:content-[attr(data-text)]"
      />
      <canvas ref={canvasRef} role="img" aria-label={text} className="pointer-events-none absolute" />
    </span>
  )
}
