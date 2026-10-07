import Link from 'next/link'
import { featuredProjects, projects, CATEGORY_LABELS, hasProjectPage } from '@/lib/content'
import type { Project } from '@/lib/schema'
import { Arrow, ButtonLink, Container, Section, cx } from '@/components/primitives'
import { ProjectVisual } from './ProjectVisual'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'

/* ==========================================================================
   SELECTED WORK

   One lead project as a split feature, then four cards with real screenshots
   that lean towards the pointer.

   ── WHY THE LEAD IS A SPLIT AND NOT A BIG CARD ────────────────────────────

   A card says "one of several". The lead project is the one that should be
   read, so it gets the layout of a page — copy, what was built, two ways in —
   beside a visual large enough to look at. Everything else is a card,
   because everything else is a choice.

   ── PROJECTS WITHOUT A SCREENSHOT ─────────────────────────────────────────

   One of the five has no interface that can be photographed: the lead
   engine has no UI at all. (Virtuoso used to be the second — its public
   events page is now captured instead.)
   They used to fall back to a generated dot pattern, which read as an image
   that had failed to load.

   They now get a SCOPE DIAGRAM: the parts that were built, drawn as labelled
   blocks on a colour panel. It is unmistakably a diagram, it says something
   true, and it says more than a screenshot would — a screenshot shows what a
   thing looks like, the diagram shows what it does.
   ========================================================================== */

function Chips({ project, limit = 3 }: { project: Project; limit?: number }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {project.stack.slice(0, limit).map((item) => (
        <li
          key={item.name}
          className="rounded-full border border-hairline-strong px-2.5 py-1 font-mono text-[0.6875rem] text-ink-2"
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}

/* --- The lead ------------------------------------------------------------- */

function Lead({ project }: { project: Project }) {
  const href = hasProjectPage(project) ? `/work/${project.slug}` : undefined
  return (
    <article className="surface-2 grid overflow-hidden rounded-[var(--radius-xl)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="flex flex-col p-7 sm:p-10">
        <p className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-3">
          {CATEGORY_LABELS[project.category]} · {project.year}
          {project.client ? ` · ${project.client}` : ''}
        </p>
        <h3 className="mt-5 text-[clamp(1.875rem,1.2rem+2.2vw,3rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink">
          {project.title}
        </h3>
        <p className="text-body-lg mt-5 max-w-md text-ink-2">{project.tagline}</p>
        <div className="mt-7">
          <Chips project={project} limit={4} />
        </div>
        <div className="mt-auto flex flex-wrap gap-3 pt-10">
          {href ? (
            <ButtonLink href={href} variant="primary" size="md">
              Read the case study
            </ButtonLink>
          ) : null}
          {project.url && project.urlAccess !== 'private' ? (
            <ButtonLink href={project.url} external variant="secondary" size="md">
              Visit the site
              <Arrow />
            </ButtonLink>
          ) : null}
        </div>
      </div>
      <div className="relative min-h-[320px] border-t border-hairline lg:border-l lg:border-t-0">
        <ProjectVisual project={project} priority sizes="(min-width: 1024px) 60vw, 100vw" />
      </div>
    </article>
  )
}

/* --- The cards ------------------------------------------------------------ */

function WorkCard({ project, position }: { project: Project; position: number }) {
  const href = hasProjectPage(project) ? `/work/${project.slug}` : undefined
  return (
    /* 3D card: the card tilts towards the pointer and its layers lift off it
       at different depths — screenshot furthest forward, then the title, the
       arrow, the copy. Mouse only; flat on touch and under reduced motion.
       No overflow-hidden on the body: clipping flattens 3D, so the
       screenshot clips itself instead. */
    <CardContainer containerClassName="h-full" className="h-full w-full" intensity={36}>
      <CardBody className="surface-2 group/card relative flex h-full w-full flex-col rounded-[var(--radius-lg)]">
        <CardItem translateZ={34} className="relative w-full">
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-[var(--radius-lg)] border-b border-hairline">
            <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-ui)] group-hover/card:scale-[1.035]">
              <ProjectVisual project={project} sizes="(min-width: 768px) 45vw, 100vw" />
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-canvas/80 px-2.5 py-1 font-mono text-[0.6875rem] text-ink backdrop-blur-[2px]">
              {String(position).padStart(2, '0')}
            </span>
          </div>
        </CardItem>

        <div className="flex flex-1 flex-col p-6 [transform-style:preserve-3d]">
          <CardItem as="p" translateZ={18} className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
            {CATEGORY_LABELS[project.category]} · {project.year}
          </CardItem>
          <CardItem as="h3" translateZ={30} className="mt-3 text-[1.375rem] font-medium leading-tight tracking-[-0.015em] text-ink">
            {href ? (
              <Link href={href} className="focus-visible:outline-none">
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </CardItem>
          <CardItem as="p" translateZ={24} className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">
            {project.tagline}
          </CardItem>
          <div className="mt-6 flex items-end justify-between gap-4 [transform-style:preserve-3d]">
            <CardItem translateZ={14}>
              <Chips project={project} />
            </CardItem>
            {href ? (
              <CardItem
                translateZ={42}
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-hairline-strong text-ink-2 transition-[background-color,border-color,color] duration-300 group-hover/card:border-transparent group-hover/card:bg-accent-bright group-hover/card:text-accent-ink"
              >
                <Arrow />
              </CardItem>
            ) : null}
          </div>
        </div>

        {/* The whole card is the pointer target. In 3D, z-index loses to
            depth, so this sits furthest forward of all while lifted;
            otherwise a click on a raised layer would miss the link. The
            title link is the one keyboard and screen-reader users get —
            this one is invisible to both. */}
        {href ? (
          <CardItem translateZ={64} aria-hidden="true" className="absolute inset-0 z-[3]">
            <Link href={href} tabIndex={-1} className="block size-full rounded-[var(--radius-lg)]" />
          </CardItem>
        ) : null}
      </CardBody>
    </CardContainer>
  )
}

export function WorkShowcase() {
  const [lead, ...rest] = featuredProjects

  return (
    <Section id="chapter-work" aria-labelledby="work-heading">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <h2 id="work-heading" className="text-h2 font-medium text-ink">
            Selected work
          </h2>
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink-2 transition-colors duration-[var(--duration-micro)] hover:text-ink"
          >
            All {projects.length} projects
            <span className="transition-transform duration-[var(--duration-micro)] group-hover:translate-x-0.5">
              <Arrow />
            </span>
          </Link>
        </div>

        {lead ? (
          <div data-reveal>
            <Lead project={lead} />
          </div>
        ) : null}

        <div data-reveal-group className="mt-4 grid gap-4 md:grid-cols-2">
          {rest.map((project, i) => (
            <div key={project.slug} data-reveal className="h-full">
              <WorkCard project={project} position={i + 2} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
