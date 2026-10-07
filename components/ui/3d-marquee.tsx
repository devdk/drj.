import Link from 'next/link'
import { cn } from '@/lib/utils'

/* ==========================================================================
   3D MARQUEE — a wall of screenshots laid back in perspective, its columns
   drifting up and down against each other

   Adapted from Aceternity UI's 3D Marquee. `images` still takes plain URL
   strings, so their demo pastes in; it also takes objects, for a tile that
   has an AVIF source and somewhere to link to.

   ── WHAT CHANGED FROM THE ORIGINAL, AND WHY ───────────────────────────────

   1. NO JAVASCRIPT. The original animates each column and each hover with
      `motion` — a client component and ~35 KB, to move four columns up and
      down forever. Both are CSS here (theme.css, "3D MARQUEE"), so this is a
      server component and adds nothing to the page's JS.

   2. IT SITS STILL when someone has asked for reduced motion.

   3. LAZY, AND THE RIGHT FORMAT. Every tile is below the fold, so every
      tile loads lazily; AVIF where the browser takes it.

   4. DECORATIVE TO ASSISTIVE TECH. A wall of repeated tiles is a picture of
      a body of work, not a list of it — a screen reader would hear the same
      seven sites three times over. The wall is aria-hidden and its links
      untabbable; the section that uses it carries the real, single list.
   ========================================================================== */

export type MarqueeImage = {
  /** Fallback source (webp / png / jpg). */
  src: string
  /** Optional AVIF source, tried first. */
  avif?: string
  alt?: string
  href?: string
}

type Props = {
  images: (string | MarqueeImage)[]
  className?: string
}

export function ThreeDMarquee({ images, className }: Props) {
  const tiles: MarqueeImage[] = images.map((image) => (typeof image === 'string' ? { src: image } : image))

  // Split into four columns, as the original does.
  const chunkSize = Math.ceil(tiles.length / 4)
  const chunks = Array.from({ length: 4 }, (_, col) => tiles.slice(col * chunkSize, col * chunkSize + chunkSize))

  return (
    <div aria-hidden="true" className={cn('marquee3d mx-auto block overflow-hidden', className)}>
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={{ transform: 'rotateX(55deg) rotateY(0deg) rotateZ(-45deg)' }}
            className="relative right-[50%] top-96 grid size-full origin-top-left grid-cols-4 gap-8 [transform-style:preserve-3d]"
          >
            {chunks.map((column, col) => (
              <div
                key={col}
                className={cn('marquee3d-col relative flex flex-col items-start gap-8', col % 2 === 0 ? 'is-down' : 'is-up')}
              >
                <GridLineVertical className="-left-4" offset="80px" />
                {column.map((tile, i) => {
                  const picture = (
                    <picture>
                      {tile.avif ? <source srcSet={tile.avif} type="image/avif" /> : null}
                      <img
                        src={tile.src}
                        alt=""
                        width={970}
                        height={700}
                        loading="lazy"
                        decoding="async"
                        className="marquee3d-tile aspect-[970/700] w-full rounded-lg object-cover ring-1 ring-white/10"
                      />
                    </picture>
                  )
                  return (
                    <div className="relative w-full" key={`${col}-${i}-${tile.src}`}>
                      <GridLineHorizontal className="-top-4" offset="20px" />
                      {tile.href ? (
                        <Link href={tile.href} tabIndex={-1} className="block">
                          {picture}
                        </Link>
                      ) : (
                        picture
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* The dashed guide lines between tiles — the original's, with the light
   theme variant dropped (this site is dark) and the colour taken from ink. */
function GridLineHorizontal({ className, offset }: { className?: string; offset?: string }) {
  return (
    <div
      style={
        {
          '--background': '#ffffff',
          '--color': 'color-mix(in oklab, var(--color-ink) 20%, transparent)',
          '--height': '1px',
          '--width': '5px',
          '--fade-stop': '90%',
          '--offset': offset || '200px',
          maskComposite: 'exclude',
        } as React.CSSProperties
      }
      className={cn(
        'absolute left-[calc(var(--offset)/2*-1)] z-30 h-[var(--height)] w-[calc(100%+var(--offset))]',
        'bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]',
        '[background-size:var(--width)_var(--height)]',
        '[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]',
        '[mask-composite:exclude]',
        className,
      )}
    />
  )
}

function GridLineVertical({ className, offset }: { className?: string; offset?: string }) {
  return (
    <div
      style={
        {
          '--background': '#ffffff',
          '--color': 'color-mix(in oklab, var(--color-ink) 20%, transparent)',
          '--height': '5px',
          '--width': '1px',
          '--fade-stop': '90%',
          '--offset': offset || '150px',
          maskComposite: 'exclude',
        } as React.CSSProperties
      }
      className={cn(
        'absolute top-[calc(var(--offset)/2*-1)] z-30 h-[calc(100%+var(--offset))] w-[var(--width)]',
        'bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]',
        '[background-size:var(--width)_var(--height)]',
        '[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]',
        '[mask-composite:exclude]',
        className,
      )}
    />
  )
}
