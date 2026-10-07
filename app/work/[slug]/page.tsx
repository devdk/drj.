import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import {
  CATEGORY_LABELS,
  getCaseStudySlugs,
  getDecisionsForProject,
  getIncidentsForProject,
  getProject,
  hasProjectPage,
} from '@/lib/content'
import {
  isPlaceholder,
  metricPresentation,
  presentParts,
  type CaseStudyPartKey,
  type Metric,
  type Project,
} from '@/lib/schema'
import {
  Arrow,
  ButtonLink,
  Container,
  EmptyState,
  Meta,
  Pill,
  Section,
  SectionHeading,
  Surface,
  cx,
} from '@/components/primitives'
import { ArchitectureScene } from '@/components/interactive/ArchitectureScene'
import { WebVitals } from '@/components/sections/WebVitals'
import { PageHero } from '@/components/sections/PageHero'
import { FeaturedImage, hasFeaturedImage } from '@/components/sections/FeaturedImage'

/* ==========================================================================
   CASE STUDY — the ten-part structure (spec §14), numbered.

   Two parts of this file carry the whole argument of the site, and both are
   written to be honest by construction rather than by good intentions:

   09 Results  — `metrics` is frequently an empty array, and stays that way
                 until a real number exists with a source and a capture date.
                 Empty renders a stated absence. It never renders a zero, a
                 range, an "up to", or a percentage with no provenance. When
                 metrics do exist, presentation is DERIVED from the source via
                 metricPresentation(), so a self-measured figure cannot be
                 dressed up as an independently verified one.

   05 Architecture — components/interactive/ArchitectureScene.tsx. On a wide
                 viewport with motion allowed, the diagram assembles one
                 component at a time as you scroll past it; everywhere else it
                 is the complete diagram at once. In BOTH cases the substance
                 is the same ordered list of nodes it always was — label, tech,
                 purpose, rationale, failure mode and outgoing connections, all
                 in the DOM on first paint at full contrast. The SVG is
                 aria-hidden decoration precisely because that list is never
                 conditional on it. This remains the deliberate replacement for
                 the spec's §16 "break this project" simulator: written failure
                 modes, no physics, nothing behind a hover.
   ========================================================================== */

/** Flagship and supporting projects have pages; archive entries do not. This
    is the complete set of valid slugs — anything else must 404 rather than
    render a thin page. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getCaseStudySlugs().map((slug) => ({ slug }))
}

/* `export const dynamicParams = false` would be the natural companion here —
   the slug set is fully known at build time — but Next 16.3 rejects that
   segment config when cacheComponents is enabled (see next.config.ts). Unknown
   slugs are therefore handled by notFound() in the page body instead, which is
   correct but streams inside the prerendered shell. */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)

  /* Flagship AND supporting projects have pages — hasProjectPage owns that
     rule, so this guard cannot drift away from generateStaticParams. Testing
     `tier !== 'flagship'` here is what made every supporting page 404 while
     the build happily prerendered it. */
  if (!project || !hasProjectPage(project)) {
    return { title: 'Project not found', robots: { index: false, follow: false } }
  }

  return {
    title: project.title,
    /* The tagline is the description verbatim. If it is still a bracketed
       placeholder it ships as one — visible, and caught by check:content. */
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.tagline,
    },
  }
}

const STATUS_LABELS: Record<Project['status'], string> = {
  live: 'Live',
  archived: 'Archived',
  nda: 'Under NDA',
  'in-progress': 'In progress',
}

/* --- Small building blocks ------------------------------------------------ */

/** One numbered part of the case study. A real <section> with its heading as
    the accessible name, so the ten parts are navigable as landmarks rather
    than being ten visually separated divs. */
function Part({
  index,
  title,
  id,
  lead,
  children,
}: {
  index: string
  title: string
  id: string
  lead?: string
  children: ReactNode
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-hairline pt-10 first:border-t-0 first:pt-0 md:pt-14"
    >
      <SectionHeading
        title={`${index} · ${title}`}
        id={id}
        lead={lead}
        className="mb-6 md:mb-8"
      />
      {children}
    </section>
  )
}

/* --------------------------------------------------------------------------
   THE PARTS, AS DATA

   Titles and leads live here rather than inline at each call site, because
   the page no longer knows in advance which parts it is rendering — that
   comes from presentParts(), which reads the project.
   -------------------------------------------------------------------------- */
const PART_META: Record<CaseStudyPartKey, { title: string; lead?: string }> = {
  context: { title: 'Context' },
  problem: { title: 'Problem' },
  constraints: {
    title: 'Constraints',
    lead: 'What was fixed before the work started, and what each constraint ruled out.',
  },
  approach: { title: 'Approach' },
  architecture: {
    title: 'Architecture',
    lead: 'Each component, why it beat the alternative, and where it gives way first.',
  },
  implementation: { title: 'Implementation' },
  challenges: {
    title: 'Challenges',
    lead: 'What resisted, with the specific symptoms.',
  },
  solution: { title: 'Solution' },
  results: {
    title: 'Results',
    lead: 'The outcome in the client’s terms, then any measurement, with its source and date.',
  },
  performance: {
    title: 'Performance',
    lead: 'Core Web Vitals, with the URL measured and the date — verifiable yourself.',
  },
  reflection: { title: 'Reflection', lead: 'What I would do differently now, and why.' },
}

/** The body of one part. Every optional field is bound to a const and checked
    before use: with the depth ladder these are `string | undefined` at the
    type level, and presentParts() having filtered them is not something the
    compiler can know. */
function PartBody({ partKey, project }: { partKey: CaseStudyPartKey; project: Project }) {
  switch (partKey) {
    case 'context':
      return (
        <div className="prose-editorial">
          <p>{project.context}</p>
        </div>
      )

    case 'problem':
      return (
        <div className="prose-editorial">
          <p>{project.problem}</p>
        </div>
      )

    case 'constraints': {
      const constraints = project.constraints ?? []
      return (
        <ul className="prose-editorial flex flex-col gap-4">
          {constraints.map((constraint) => (
            <li key={constraint} className="border-l-2 border-hairline-strong pl-4">
              {constraint}
            </li>
          ))}
        </ul>
      )
    }

    case 'approach':
      return (
        <div className="prose-editorial">
          <p>{project.approach}</p>
        </div>
      )

    case 'architecture': {
      const architecture = project.architecture
      if (!architecture) {
        return (
          <EmptyState>
            No architecture diagram for this project. It has not been documented to node level, and a
            sketch drawn after the fact would describe the diagram rather than the system.
          </EmptyState>
        )
      }
      return <ArchitectureScene architecture={architecture} projectTitle={project.title} />
    }

    case 'implementation':
      return (
        <div className="prose-editorial">
          <p>{project.implementation}</p>
        </div>
      )

    case 'challenges': {
      const challenges = project.challenges ?? []
      return (
        <ol className="prose-editorial flex flex-col gap-5">
          {challenges.map((challenge, i) => (
            <li key={challenge} className="list-none">
              <Meta className="mb-1.5 block">Challenge {String(i + 1).padStart(2, '0')}</Meta>
              {challenge}
            </li>
          ))}
        </ol>
      )
    }

    case 'solution':
      return (
        <div className="prose-editorial">
          <p>{project.solution}</p>
        </div>
      )

    case 'results':
      return (
        <>
          <div className="prose-editorial mb-8">
            <p>{project.outcome}</p>
          </div>
          <Results project={project} />
        </>
      )

    case 'performance':
      return <WebVitals vitals={project.vitals} />

    case 'reflection':
      return (
        <div className="prose-editorial">
          <p>{project.reflection}</p>
        </div>
      )
  }
}

/** A labelled fact. Used for the header facts and inside architecture nodes,
    where a definition list is the honest markup: each label genuinely defines
    the value beside it. */
function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div>
      <Meta as="dt" className="mb-1.5">
        {term}
      </Meta>
      <dd className="text-[0.9375rem] leading-relaxed text-ink-2">{children}</dd>
    </div>
  )
}

/** A URL that may still be a [BRACKETED PLACEHOLDER]. A placeholder renders as
    stated-unavailable text rather than a link to nowhere: a dead external link
    is worse than an admitted gap. */
function ProjectLink({
  href,
  label,
  pendingLabel,
}: {
  href: string | undefined
  label: string
  pendingLabel: string
}) {
  if (!href) return null

  if (isPlaceholder(href)) {
    return (
      <span className="inline-flex h-9 items-center rounded-full border border-dashed border-hairline-strong px-4 font-mono text-[0.75rem] tracking-[0.02em] text-ink-3">
        {pendingLabel}
      </span>
    )
  }

  return (
    <ButtonLink href={href} external variant="secondary" size="sm">
      {label}
      <Arrow />
    </ButtonLink>
  )
}

/* --- 09 Results ----------------------------------------------------------- */

function MetricCard({ metric }: { metric: Metric }) {
  const { claimable, label } = metricPresentation(metric)

  /* A non-claimable metric drops a surface level so it visibly sits behind the
     verified ones. Border STYLE is deliberately not used to signal it: the
     surface-* utilities set the `border` shorthand and are emitted after
     Tailwind's border-style utilities, so a `border-dashed` here would be dead
     CSS. The muting is reinforced by the disclosure at the foot of the card,
     which is the part that actually carries the meaning. */
  return (
    <Surface as="li" level={claimable ? 2 : 1} className="p-5 sm:p-6">
      <Meta className="block">{metric.label}</Meta>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {metric.before ? (
          <>
            <span className="text-h3 font-medium text-ink-3 line-through decoration-1">
              {metric.before}
            </span>
            <Arrow className="text-ink-3" />
          </>
        ) : null}
        {/* A non-claimable figure is muted by dropping to ink-2 rather than by
            lowering opacity: opacity would take the contrast below AA and make
            the honest disclosure the hardest thing on the card to read. */}
        <span className={cx('text-h2 font-medium', claimable ? 'text-ink' : 'text-ink-2')}>
          {metric.after}
        </span>
      </p>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <Fact term="Source">{label}</Fact>
        {/* Always shown. A metric with no capture date is not a metric. */}
        <Fact term="Captured">
          <time dateTime={metric.capturedAt}>{metric.capturedAt}</time>
        </Fact>
      </dl>

      {metric.note ? (
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">{metric.note}</p>
      ) : null}

      {!claimable ? (
        <p className="mt-4 border-t border-hairline pt-3 text-[0.875rem] leading-relaxed text-ink-3">
          Self-measured: my own measurement under my own conditions, not independently verified.
          Treat it as an indication, not evidence.
        </p>
      ) : null}
    </Surface>
  )
}

function Results({ project }: { project: Project }) {
  /* Private work keeps its figures off the page on purpose, and says so in
     the walkthrough panel below — so "no metrics yet" would be untrue here. */
  if (project.metrics.length === 0 && project.walkthrough) return null
  if (project.metrics.length === 0) {
    /* The most important branch in this file. No estimate, no "up to", no
       placeholder number — the absence is the content. */
    return (
      <EmptyState>
        No metrics yet. Numbers appear here only once they exist with a named source and a capture
        date; until this project has been measured properly there is nothing to report, and an
        estimate would be an invented figure with a label on it.
      </EmptyState>
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {project.metrics.map((metric) => (
        <MetricCard key={`${metric.label}-${metric.capturedAt}`} metric={metric} />
      ))}
    </ul>
  )
}

/* --- Page ----------------------------------------------------------------- */

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)

  /* A non-flagship project has no ten-part write-up, so this route must 404 for
     it rather than render a case study made of gaps. */
  if (!project || !hasProjectPage(project)) notFound()

  const decisions = getDecisionsForProject(project.slug)
  const incidents = getIncidentsForProject(project.slug)
  const hasCrossLinks = decisions.length > 0 || incidents.length > 0

  /* A real URL that a visitor cannot reach. The host is still printed — it is
     the evidence that the system is deployed and running under a client's own
     domain — but nothing on the page turns it into a click. */
  const hasRealUrl = Boolean(project.url && !isPlaceholder(project.url))
  const isPrivate = hasRealUrl && project.urlAccess === 'private'
  const liveHost = hasRealUrl ? new URL(project.url!).host.replace(/^www\./, '') : ''

  /* "SATCHEL — Practice CRM": the name before the dash is what gets the
     highlight; what it is stays plain beside it. */
  const [titleName, ...titleRestParts] = project.title.split(' — ')
  const titleRest = titleRestParts.join(' — ')

  return (
    <article>
      {/* ---- Header — the same opening as every page (PageHero): the
              project's name in moving light, the rest of the title plain. ---- */}
      <PageHero
        headingId="case-study-title"
        top={
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink-2 transition-colors duration-[var(--duration-micro)] hover:text-ink"
          >
            <Arrow className="rotate-180 transition-transform duration-[var(--duration-micro)] group-hover:-translate-x-0.5" />
            All work
          </Link>
        }
        eyebrow={
          <div className="flex flex-wrap items-center gap-2">
            <Pill>{CATEGORY_LABELS[project.category]}</Pill>
            <Pill>{project.statusLabel ?? STATUS_LABELS[project.status]}</Pill>
            <Pill>{project.year}</Pill>
          </div>
        }
        highlight={titleName}
        after={titleRest ? ` — ${titleRest}` : undefined}
        lead={project.tagline}
        flush
      >
        <dl className="mt-12 grid gap-6 border-t border-hairline pt-8 sm:grid-cols-2 md:grid-cols-4">
          <Fact term="Role">{project.role}</Fact>
          {/* Exactly one of client / clientDescriptor exists — the schema
              refuses both and neither — so this renders the named client when
              permission was given and the anonymised descriptor when it was
              not. It never implies a name we are not allowed to state. */}
          <Fact term="Client">{project.client ?? project.clientDescriptor}</Fact>
          <Fact term="Year">{project.year}</Fact>
          {project.duration ? <Fact term="Duration">{project.duration}</Fact> : null}
        </dl>

        {/* A button is a promise that there is somewhere to go. For software
            that is live but invite-only, there is not — so the URL renders
            as a stated fact instead, and the visitor learns why before they
            click rather than after. See `urlAccess` in lib/schema.ts. */}
        {isPrivate ? (
          <p className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-hairline px-4 py-2 text-[0.8125rem] text-ink-3">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-2">
              Private
            </span>
            <span>
              {liveHost} is invite-only — it holds a client&rsquo;s live records.
            </span>
          </p>
        ) : null}

        {(project.url && !isPrivate) || project.repo ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isPrivate ? null : (
              <ProjectLink href={project.url} label="Visit live site" pendingLabel="Live URL pending" />
            )}
            <ProjectLink href={project.repo} label="Source code" pendingLabel="Repository pending" />
          </div>
        ) : null}
      </PageHero>
      <div className="h-14 sm:h-16" aria-hidden="true" />

      {/* ---- The live site, photographed. Above the stack because a visitor
              deciding whether to read 4,000 words wants to see the thing
              first. `priority` is set here and nowhere else: on a case study
              this is the largest contentful paint, so it must not be lazy —
              while on /work eleven cards are all below the fold and every one
              of them must be. ---- */}
      {hasFeaturedImage(project.slug) ? (
        <Container>
          <figure className="mb-4">
            <FeaturedImage
              slug={project.slug}
              alt={`Screenshot of the live ${project.title} site`}
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="aspect-[8/5] w-full rounded-[var(--radius-lg)] border border-hairline"
            />
            <figcaption className="mt-3 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-3">
              {isPrivate || project.walkthrough ? 'The running system' : 'The live site'}
              {liveHost ? ` — ${liveHost}` : ''}
            </figcaption>
          </figure>
        </Container>
      ) : null}

      {/* ---- Stack. Each entry carries its own justification: `why` is
              required by the schema precisely so it can be read here, which is
              what turns a technology list into a set of decisions. ---- */}
      <Section band aria-labelledby="stack-heading">
        <Container>
          <SectionHeading
            id="stack-heading"
            title="Stack"
            lead="Each choice with the reason for it."
            className="mb-8 md:mb-10"
          />
          <ul className="grid gap-4 md:grid-cols-2">
            {project.stack.map((item) => (
              <Surface as="li" key={item.name} level={1} className="p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <h3 className="text-[1.125rem] font-medium text-ink">{item.name}</h3>
                  <Meta>{item.category}</Meta>
                </div>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{item.why}</p>
              </Surface>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ---- The ten parts. Each carries its own <section> and heading, so this
              wrapper deliberately has no accessible name of its own. ---- */}
      <Section>
        <Container>
          <div className="flex flex-col gap-10 md:gap-14">
            {/* Numbered from what the project HAS, not from a fixed list of
                ten. A flagship still reads 01–10; a supporting project reads
                01–05 with no gaps. The alternative — hardcoded numbers with
                empty states in the holes — prints "03 Constraints" over
                nothing and makes a short honest page look like a broken long
                one. */}
            {presentParts(project).map((key, i) => (
              <Part
                key={key}
                index={String(i + 1).padStart(2, '0')}
                title={PART_META[key].title}
                id={`part-${key}`}
                lead={key === 'architecture' && !project.architecture ? undefined : PART_META[key].lead}
              >
                <PartBody partKey={key} project={project} />
              </Part>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---- What is held back, and the offer to cover it. Private work is
              published at outcome level only; this panel is what turns the
              missing half into a stated choice with a next step, rather than a
              short page that looks like it ran out of things to say. ---- */}
      {project.walkthrough ? (
        <section aria-labelledby="walkthrough-heading" className="pb-[var(--spacing-section)]">
          <Container>
            <div className="frame-glow grid gap-8 rounded-[var(--radius-xl)] p-7 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-accent">
                  Private client system
                </p>
                <h2 id="walkthrough-heading" className="text-h3 mt-4 max-w-xl font-medium text-ink">
                  The rest is a conversation
                </h2>
                <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-ink-2">{project.walkthrough}</p>
              </div>
              <ButtonLink href="/#chapter-contact" variant="primary" size="lg">
                Book a walkthrough
              </ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---- Cross-links. Rendered only when there is something behind them:
              a "related thinking" heading over an empty list promises depth the
              content does not have. ---- */}
      {hasCrossLinks ? (
        <Section band aria-labelledby="related-heading">
          <Container>
            <SectionHeading
              id="related-heading"
              title="Decisions and failures"
              className="mb-8 md:mb-10"
            />

            {decisions.length > 0 ? (
              <div className="mb-10">
                <h3 className="mb-4">
                  <Meta>Decisions</Meta>
                </h3>
                <ul className="grid gap-3 md:grid-cols-2">
                  {decisions.map((decision) => (
                    <li key={decision.id}>
                      <Link
                        href={`/thinking#${decision.id}`}
                        className="group surface-1 surface-interactive flex items-start justify-between gap-4 rounded-[var(--radius-md)] p-5"
                      >
                        <span>
                          <span className="block font-medium text-ink">{decision.question}</span>
                          <span className="mt-1.5 block text-[0.9375rem] text-ink-3">
                            Chose {decision.chose}
                          </span>
                        </span>
                        <span className="mt-1 shrink-0 text-ink-3 transition-colors duration-[var(--duration-micro)] group-hover:text-accent">
                          <Arrow />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {incidents.length > 0 ? (
              <div>
                <h3 className="mb-4">
                  <Meta>Failures</Meta>
                </h3>
                <ul className="grid gap-3 md:grid-cols-2">
                  {incidents.map((incident) => (
                    <li key={incident.id}>
                      <Link
                        href={`/thinking#${incident.id}`}
                        className="group surface-1 surface-interactive flex items-start justify-between gap-4 rounded-[var(--radius-md)] p-5"
                      >
                        <span>
                          <span className="block font-medium text-ink">{incident.title}</span>
                          <span className="mt-1.5 block text-[0.9375rem] text-ink-3">
                            {incident.symptom}
                          </span>
                        </span>
                        <span className="mt-1 shrink-0 text-ink-3 transition-colors duration-[var(--duration-micro)] group-hover:text-accent">
                          <Arrow />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Container>
        </Section>
      ) : null}
    </article>
  )
}
