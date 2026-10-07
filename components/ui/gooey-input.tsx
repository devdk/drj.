'use client'

import { useCallback, useId, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ==========================================================================
   GOOEY INPUT — a search field that grows, and drops its icon off the side
   like a bead of liquid

   Adapted from Aceternity UI's Gooey Input. Same props (placeholder,
   collapsedWidth, expandedWidth, expandedOffset, gooeyBlur, value,
   onValueChange, onOpenChange, classNames…), so their demo pastes in. Three
   things are different, all on purpose:

   1. IT IS ALWAYS A REAL INPUT. The original's collapsed state is a <button>
      with a disabled <input> inside it — interactive content inside a button
      is invalid HTML, and a screen reader meets "button, Search" rather than
      a text field. Here the input is always there and always focusable;
      "collapsed" and "expanded" are only how it looks, and focus is what
      expands it.

   2. NO ANIMATION LIBRARY. The original pulls in `motion` for a width change
      and a scale — ~35 KB of JavaScript for two transitions CSS does
      natively. The spring is a cubic-bezier with overshoot.

   3. IT CAN SUBMIT. A `trailing` slot puts an action inside the pill (the
      Ask button), and every other input attribute passes through to the
      field, so it works inside a <form> like any input.

   The goo itself is the original's SVG filter: blur everything, then crush
   the alpha channel so two blurred shapes that touch fuse into one — that
   is the bridge you see as the bubble pulls away from the pill. The source
   graphic is composited back on top, so text inside stays sharp.
   ========================================================================== */

function GooeyFilter({ filterId, blur }: { filterId: string; blur: number }) {
  return (
    <svg className="absolute hidden h-0 w-0" aria-hidden="true">
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      aria-hidden="true"
      className={cn('size-4 shrink-0', className)}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

/* The original's spring (bounce 0.25, 0.4s), as a curve. */
const SPRING = 'cubic-bezier(0.34, 1.36, 0.64, 1)'

export interface GooeyInputClassNames {
  root?: string
  filterWrap?: string
  buttonRow?: string
  /** The pill. Named `trigger` for parity with the original. */
  trigger?: string
  input?: string
  bubble?: string
  bubbleSurface?: string
}

type Passthrough = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'className' | 'placeholder' | 'disabled'
>

export interface GooeyInputProps extends Passthrough {
  placeholder?: string
  className?: string
  classNames?: GooeyInputClassNames
  /** Width at rest — px as a number, or any CSS length ('62%'). */
  collapsedWidth?: number | string
  /** Width while in use. */
  expandedWidth?: number | string
  /** How far the pill slides right to make room for the bubble. */
  expandedOffset?: number | string
  /** Blur for the goo filter. Larger fuses from further away. */
  gooeyBlur?: number
  /** Height of the pill and diameter of the bubble, in px. */
  height?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  /** Rendered inside the pill, after the field — e.g. a submit button. */
  trailing?: ReactNode
}

const len = (v: number | string) => (typeof v === 'number' ? `${v}px` : v)

export function GooeyInput({
  placeholder = 'Type to search...',
  className,
  classNames,
  collapsedWidth = 115,
  expandedWidth = 200,
  expandedOffset = 50,
  gooeyBlur = 5,
  height = 40,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onOpenChange,
  disabled = false,
  trailing,
  onFocus,
  onBlur,
  'aria-label': ariaLabel,
  ...inputProps
}: GooeyInputProps) {
  const filterId = `gooey-filter-${useId().replace(/:/g, '')}`
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const [uncontrolled, setUncontrolled] = useState(defaultValue)

  const isControlled = valueProp !== undefined
  const text = isControlled ? valueProp : uncontrolled
  /* Open while in use or while holding text — a field that shrinks back
     over what you typed would hide it. */
  const open = focused || text.length > 0

  const setText = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const setFocus = (next: boolean) => {
    setFocused(next)
    if (next !== focused) onOpenChange?.(next || text.length > 0)
  }

  /* Defaults apply only when the caller has not styled that part — `cn`
     here joins rather than merges, so a default and an override would both
     land and the stylesheet order would pick the winner. */
  const pillSurface = classNames?.trigger ?? 'bg-ink text-canvas'
  const beadSurface = classNames?.bubbleSurface ?? 'bg-ink text-canvas'
  const ease = { transitionTimingFunction: SPRING }

  return (
    /* min-w-0 all the way down: the pill's width is a percentage, and inside a
       grid or flex parent a percentage counts as "as wide as the content"
       when the parent sizes itself — which pushed a phone layout sideways. */
    <div className={cn('relative flex min-w-0 items-center', className, classNames?.root)}>
      <GooeyFilter filterId={filterId} blur={gooeyBlur} />

      <div
        className={cn('relative flex w-full min-w-0 items-center', classNames?.filterWrap)}
        style={{ height, filter: `url(#${filterId})` }}
      >
        {/* The bead. */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute left-0 top-1/2 flex -translate-y-1/2 items-center justify-center transition-[transform,opacity] duration-[400ms] motion-reduce:transition-none',
            open ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
            classNames?.bubble,
          )}
          style={{ width: height, height, ...ease }}
        >
          <div className={cn('flex size-full items-center justify-center rounded-full', beadSurface)}>
            <SearchIcon />
          </div>
        </div>

        {/* The pill. Clicking anywhere on it lands in the field. */}
        <div
          onClick={() => inputRef.current?.focus()}
          className={cn(
            'flex cursor-text items-center gap-2 rounded-full px-4 transition-[width,margin] duration-[400ms] motion-reduce:transition-none',
            pillSurface,
            disabled && 'pointer-events-none opacity-50',
            classNames?.buttonRow,
          )}
          style={{
            height,
            width: open ? len(expandedWidth) : len(collapsedWidth),
            marginLeft: open ? len(expandedOffset) : '0px',
            ...ease,
          }}
        >
          <SearchIcon
            className={cn(
              'transition-[opacity,width,margin] duration-300 motion-reduce:transition-none',
              open && '-mr-2 w-0 opacity-0',
            )}
          />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            {...inputProps}
            aria-label={ariaLabel}
            value={text}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(event) => setText(event.target.value)}
            onFocus={(event) => {
              setFocus(true)
              onFocus?.(event)
            }}
            onBlur={(event) => {
              setFocus(false)
              onBlur?.(event)
            }}
            className={cn(
              'h-full min-w-0 flex-1 bg-transparent outline-none [&::-webkit-search-cancel-button]:hidden',
              classNames?.input ?? 'text-sm placeholder:opacity-60',
            )}
          />
          {trailing}
        </div>
      </div>
    </div>
  )
}
