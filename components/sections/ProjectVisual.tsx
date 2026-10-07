import type { Project } from '@/lib/schema'
import { cx } from '@/components/primitives'
import { FeaturedImage } from './FeaturedImage'

/* ==========================================================================
   PROJECT VISUAL — one way to draw a project, used everywhere it is drawn

   A real screenshot where one exists; a scope diagram on a colour panel
   where the software has no public interface to photograph. Virtuoso used
   to be a diagram; it now shows its real, public events page, because a
   live product photographed beats any drawing of one. Shared by the
   hero and Selected work, so a project looks the same wherever it appears
   on the page — the hero is a preview of the cards below, and a preview that
   disagreed with what it previews would undo the point of having one.

   See the comment above DIAGRAMS for why a diagram and not a mock-up.
   ========================================================================== */

/* --- Scope diagrams ------------------------------------------------------- */

export const DIAGRAMS: Record<string, { panel: string; render: (stage: boolean) => React.ReactElement }> = {
  leadhouse: {
    panel: 'panel-cyan',
    render: (stage) => (
      <div className={cx('flex h-full flex-col gap-6 p-6 sm:p-8', stage ? 'justify-start pt-[9%] sm:px-[8%]' : 'justify-center')}>
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em]">How it works</span>
        <div className="flex items-center gap-2">
          {['Public register', 'Qualify', 'Leads'].map((step, i) => (
            <div key={step} className="flex flex-1 items-center gap-2">
              <span
                className={cx(
                  'flex-1 rounded-[12px] border px-3 py-3 text-center text-[0.875rem] font-medium leading-tight',
                  i === 2 ? 'border-transparent bg-[#04070a] text-white' : 'border-hairline-strong bg-white/35',
                )}
              >
                {step}
              </span>
              {i < 2 ? (
                <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
        <span className="self-start rounded-full bg-[#04070a] px-3 py-1 font-mono text-[0.75rem] text-white">
          £0 per lead
        </span>
      </div>
    ),
  },
}

export function ProjectVisual({
  project,
  priority = false,
  sizes,
  stage = false,
}: {
  project: Project
  priority?: boolean
  sizes: string
  /* The hero stage is cut by the fold, so a diagram centred in it would put
     its content below the fold and show an empty slab of colour. On the
     stage it sits at the top, where it is seen. */
  stage?: boolean
}) {
  const diagram = DIAGRAMS[project.slug]
  if (diagram) {
    return (
      <div aria-hidden="true" className={cx('panel h-full w-full rounded-none', diagram.panel)}>
        {diagram.render(stage)}
      </div>
    )
  }
  return (
    <FeaturedImage
      slug={project.slug}
      alt={`Screenshot of the ${project.title} site`}
      priority={priority}
      sizes={sizes}
      className="h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover"
    />
  )
}

