import Link from 'next/link'
import { ENGAGEMENT, FAQ } from '@/content/engagement'
import { Arrow, Container, Section, cx } from '@/components/primitives'
import { FaqAccordion } from '@/components/interactive/FaqAccordion'

/* ==========================================================================
   WORKING TOGETHER — the terms, the timelines, the questions

   Three parts, three treatments, because they are three kinds of
   information and the old version set all of them as grey paragraphs:

     COMMITMENTS  colour panels with one large figure each. These are the
                  numbers someone decides on, so they are set to be seen
                  from across a room.
     TIMELINES    bars on a real week axis. A duration is a length; drawn as
                  a length it is understood before it is read.
     QUESTIONS    an accordion beside a sticky column — every question
                  visible, one answer at a time with room to breathe.
   ========================================================================== */

const AXIS_WEEKS = 9

function Timelines() {
  return (
    <div data-reveal className="surface-2 overflow-hidden rounded-[var(--radius-lg)]">
      <div className="flex items-baseline justify-between gap-4 border-b border-hairline px-6 py-5 sm:px-8">
        <h3 className="text-[1.125rem] font-medium text-ink">How long it takes</h3>
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
          weeks
        </span>
      </div>

      <div className="px-6 pb-7 pt-6 sm:px-8">
        {/* The axis. */}
        <div aria-hidden="true" className="mb-3 ml-0 grid sm:ml-[14.5rem]" style={{ gridTemplateColumns: `repeat(${AXIS_WEEKS}, minmax(0, 1fr))` }}>
          {Array.from({ length: AXIS_WEEKS }).map((_, w) => (
            <span key={w} className="font-mono text-[0.6875rem] tabular-nums text-ink-3">
              {w}
            </span>
          ))}
        </div>

        <dl className="space-y-5">
          {ENGAGEMENT.timelines.map((timeline, i) => {
            const pct = (w: number) => `${(w / AXIS_WEEKS) * 100}%`
            return (
              <div
                key={timeline.kind}
                className="grid items-center gap-x-6 gap-y-2 sm:grid-cols-[13rem_minmax(0,1fr)]"
                style={{ '--grow-delay': `${i * 160}ms` } as React.CSSProperties}
              >
                <dt className="text-[0.9375rem] font-medium leading-snug text-ink">{timeline.kind}</dt>
                <dd>
                  {timeline.weeks ? (
                    <>
                      <span className="sr-only">{timeline.typical}</span>
                      <div aria-hidden="true" className="relative h-9 rounded-full bg-[color-mix(in_oklab,var(--color-ink)_6%,transparent)]">
                        {/* Lead-in to the minimum, then the range itself. */}
                        <span
                          className="grow-x absolute inset-y-0 left-0 rounded-full bg-[color-mix(in_oklab,var(--color-accent)_28%,transparent)]"
                          style={{ width: pct(timeline.weeks[1]) }}
                        />
                        <span
                          className="grow-x absolute inset-y-1 rounded-full bg-accent-bright"
                          style={{ left: pct(timeline.weeks[0]), width: `calc(${pct(timeline.weeks[1] - timeline.weeks[0])} - 4px)` }}
                        />
                        <span
                          className="absolute inset-y-0 flex items-center pl-3 font-mono text-[0.75rem] font-medium text-ink"
                          style={{ left: pct(timeline.weeks[1]) }}
                        >
                          {timeline.weeks[0]}–{timeline.weeks[1]}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="sr-only">{timeline.typical}</span>
                      <div aria-hidden="true" className="relative h-9 rounded-full border border-dashed border-hairline-strong">
                        <span className="absolute inset-y-0 left-4 flex items-center font-mono text-[0.75rem] text-ink-3">
                          scoped per project
                        </span>
                        {timeline.example ? (
                          <span
                            className="absolute inset-y-0 flex -translate-x-full items-center gap-2 pr-1"
                            style={{ left: pct(timeline.example.weeks) }}
                          >
                            <span className="whitespace-nowrap font-mono text-[0.6875rem] text-ink-2">
                              {timeline.example.label}: {timeline.example.weeks} weeks
                            </span>
                            <span className="size-3 rounded-full border-2 border-canvas bg-accent-bright shadow-[0_0_0_1px_var(--color-accent-bright)]" />
                          </span>
                        ) : null}
                      </div>
                    </>
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </div>
  )
}

export function WorkingTogether() {
  return (
    <Section id="working-together" aria-labelledby="working-heading">
      <Container>
        <div className="mb-12 md:mb-16">
          <h2 id="working-heading" className="text-h2 max-w-2xl font-medium text-ink">
            How working together goes
          </h2>
        </div>

        {/* ── Commitments ────────────────────────────────────────────── */}
        <div data-reveal-group className="grid gap-4 md:grid-cols-3">
          {[
            { panel: 'panel-cyan', figure: 'Fixed', label: 'scope, priced per project', note: 'No hourly billing and no retainers. You know the number before work starts.' },
            { panel: 'panel-violet', figure: '40%', label: 'up front to start', note: 'After two short calls and an agreed scope — not before.' },
            { panel: 'panel-pink', figure: '3', label: 'rounds of revisions', note: 'Included in the first month after launch, for what only shows up live.' },
          ].map((item) => (
            <div
              key={item.figure}
              data-reveal
              className={cx('panel flex flex-col p-7 transition-transform md:min-h-[15rem] duration-500 ease-[var(--ease-ui)] hover:-translate-y-1', item.panel)}
            >
              <span className="text-[clamp(3.25rem,2rem+4vw,5rem)] font-medium leading-[0.9] tracking-[-0.045em]">
                {item.figure}
              </span>
              <span className="mt-3 text-[1.125rem] font-medium leading-tight">{item.label}</span>
              <span className="mt-auto pt-6 text-[0.875rem] leading-relaxed md:pt-8">{item.note}</span>
            </div>
          ))}
        </div>

        {/* ── Timelines ──────────────────────────────────────────────── */}
        <div className="mt-4">
          <Timelines />
        </div>

        {/* ── Questions ──────────────────────────────────────────────── */}
        <div className="mt-24 grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h3 className="text-h2 font-medium text-ink">
              Questions people ask
            </h3>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-ink-2">
              The ones that usually come up in the first call, answered before it.
            </p>

            {/* The FAQ cannot hold every question, and the site has a tool that
                answers the rest from what is published. This is the one place
                the two meet. */}
            <a
              href="#ask"
              className="group mt-8 block max-w-sm rounded-[var(--radius-md)] border border-hairline p-5 transition-colors duration-300 hover:border-hairline-strong"
            >
              <span className="block text-[0.9375rem] font-medium text-ink">Not on the list?</span>
              <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-ink-2">
                Ask the site. It answers from what is published here, and says so when it
                cannot.
              </span>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-[0.75rem] text-accent">
                Ask a question
                <span aria-hidden="true" className="transition-transform duration-[var(--duration-micro)] group-hover:translate-x-0.5">&rarr;</span>
              </span>
            </a>

            <Link
              href="/#chapter-contact"
              className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
            >
              Start a project
              <span className="transition-transform duration-[var(--duration-micro)] group-hover:translate-x-0.5">
                <Arrow />
              </span>
            </Link>
          </div>

          <FaqAccordion items={FAQ} />
        </div>
      </Container>
    </Section>
  )
}
