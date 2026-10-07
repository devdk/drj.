'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

/* ==========================================================================
   3D CARD — a card that tilts towards the pointer while its layers lift off
   it at different depths

   Adapted from Aceternity UI's 3D Card. Same three parts and props
   (CardContainer › CardBody › CardItem with translateZ etc.), so their demo
   pastes in, with these differences:

   1. NO LAYOUT DEFAULTS. The original's container carries `py-20` and the
      body `h-96 w-96`, which only a class-merging `cn` lets a caller undo.
      Here the caller sizes the card; the component only does the 3D.

   2. MOUSE ONLY, AND NEVER UNDER REDUCED MOTION. Pointer events filtered to
      `mouse`, so a tap on a phone does not leave a card stuck mid-tilt, and
      nothing moves for someone who has asked for less motion.

   3. A GENTLER TILT. The original divides the offset by 25, which turns a
      400px card ~8° at the edge; `intensity` keeps that as the default and
      lets a grid of cards use less.

   4. TRANSFORMS, NOT `transition-all`. Animating every property on every
      pointer move also animates anything else that changes — colours,
      borders — on a 200ms linear lag.
   ========================================================================== */

const MouseEnterContext = createContext<[boolean, (value: boolean) => void] | undefined>(undefined)

function motionAllowed(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function CardContainer({
  children,
  className,
  containerClassName,
  /** Pixels of pointer offset per degree of tilt. Higher is subtler. */
  intensity = 25,
}: {
  children?: ReactNode
  className?: string
  containerClassName?: string
  intensity?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = containerRef.current
    if (!el || event.pointerType !== 'mouse' || !isMouseEntered) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (event.clientX - left - width / 2) / intensity
    const y = (event.clientY - top - height / 2) / intensity
    el.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
  }

  function onPointerEnter(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || !motionAllowed()) return
    setIsMouseEntered(true)
  }

  function onPointerLeave() {
    setIsMouseEntered(false)
    if (containerRef.current) containerRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)'
  }

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div className={cn('flex items-center justify-center', containerClassName)} style={{ perspective: '1000px' }}>
        <div
          ref={containerRef}
          onPointerEnter={onPointerEnter}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className={cn(
            'relative flex items-center justify-center transition-transform duration-200 ease-linear',
            className,
          )}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  )
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]', className)}>
      {children}
    </div>
  )
}

type CardItemProps<T extends ElementType> = {
  as?: T
  children?: ReactNode
  className?: string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function CardItem<T extends ElementType = 'div'>({
  as,
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: CardItemProps<T>) {
  const Tag: ElementType = as ?? 'div'
  const ref = useRef<HTMLElement>(null)
  const [isMouseEntered] = useMouseEnter()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = isMouseEntered
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : ''
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ])

  return (
    <Tag ref={ref} className={cn('transition-transform duration-200 ease-linear', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function useMouseEnter() {
  const context = useContext(MouseEnterContext)
  if (context === undefined) throw new Error('useMouseEnter must be used within a CardContainer')
  return context
}
