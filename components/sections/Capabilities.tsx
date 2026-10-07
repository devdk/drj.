import { site } from '@/lib/site.config'
import { Container, Section, cx } from '@/components/primitives'

/* ==========================================================================
   WHAT I BUILD

   Four cards, each with a small working drawing of what the buyer gets.

   ── WHY DRAWINGS, AND WHY THESE ARE ALLOWED ───────────────────────────────

   The site has a firm rule against mocked-up interfaces: a fake screenshot
   is an invented claim about what a client's software looks like. These are
   not that. They depict a KIND of deliverable — "a site your team can edit",
   "a store that sells", "software a business runs on", "work that runs
   itself" — and none of them is labelled as, or resembles, any client's
   product. They are diagrams that happen to be drawn as interfaces, because
   an interface is the clearest way to show a non-technical buyer what each
   word on the card means.

   Each one moves on hover to make its single point: the site's heading gets
   selected for editing, the cart fills, the dashboard's figures update, the
   pipeline runs. Every drawing is aria-hidden; the card's text carries the
   meaning on its own.
   ========================================================================== */

/* --- Shared bits ---------------------------------------------------------- */

function Bar({ className }: { className?: string }) {
  return <span className={cx('block rounded-full bg-ink-3/40', className)} />
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-52 overflow-hidden border-b border-hairline bg-canvas"
      style={{
        backgroundImage:
          'linear-gradient(var(--color-hairline) 1px, transparent 1px), linear-gradient(90deg, var(--color-hairline) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: '-1px -1px',
      }}
    >
      {/* Vignette, so the grid recedes towards the edges. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-canvas)_100%)]" />
      <div className="relative flex h-full items-center justify-center p-6">{children}</div>
    </div>
  )
}

/* --- 1. A site whose heading your team can select and edit --------------- */

function WebsiteArt() {
  return (
    <div className="w-full max-w-[300px] overflow-hidden rounded-[10px] border border-hairline-strong bg-canvas-2 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.7)] transition-transform duration-500 ease-[var(--ease-ui)] group-hover:-translate-y-1">
      <div className="flex items-center gap-1.5 border-b border-hairline px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-ink-3/50" />
        ))}
        <span className="ml-2 h-2 w-24 rounded-full bg-ink-3/25" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="h-2 w-10 rounded-full bg-accent" />
          <div className="flex gap-1.5">
            <Bar className="h-1.5 w-6" />
            <Bar className="h-1.5 w-6" />
            <Bar className="h-1.5 w-6" />
          </div>
        </div>
        {/* The heading — selected for editing on hover. */}
        <div className="relative pt-1">
          <span className="block h-3.5 w-[78%] rounded-sm bg-ink/80" />
          <span className="mt-1.5 block h-3.5 w-[52%] rounded-sm bg-ink/80" />
          <span className="pointer-events-none absolute -inset-x-1.5 -inset-y-1 scale-95 opacity-0 shadow-[inset_0_0_0_1px_var(--color-accent-bright)] transition-all duration-300 ease-[var(--ease-ui)] group-hover:scale-100 group-hover:opacity-100">
            {['-left-[3px] -top-[3px]', '-right-[3px] -top-[3px]', '-left-[3px] -bottom-[3px]', '-right-[3px] -bottom-[3px]'].map(
              (pos) => (
                <span key={pos} className={cx('absolute size-1.5 bg-accent-bright', pos)} />
              ),
            )}
          </span>
          <span className="absolute -right-2 -top-6 translate-y-1 rounded-[4px] bg-accent-bright px-1.5 py-0.5 font-mono text-[9px] font-medium text-accent-ink opacity-0 transition-all delay-100 duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Edit
          </span>
        </div>
        <div className="space-y-1.5">
          <Bar className="h-1.5 w-full" />
          <Bar className="h-1.5 w-[86%]" />
        </div>
        <span className="block h-5 w-20 rounded-full bg-ink/80" />
      </div>
    </div>
  )
}

/* --- 2. A product, and a cart that fills ---------------------------------- */

function StoreArt() {
  return (
    <div className="relative flex items-end gap-3">
      <div className="w-[150px] overflow-hidden rounded-[10px] border border-hairline-strong bg-canvas-2 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.7)]">
        <div className="relative h-24 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent)_55%,transparent),color-mix(in_oklab,var(--color-accent-dim)_70%,transparent))]">
          <span className="absolute left-2 top-2 rounded-full bg-canvas/70 px-1.5 py-0.5 font-mono text-[8px] text-ink">
            NEW
          </span>
        </div>
        <div className="space-y-2 p-3">
          <Bar className="h-2 w-[80%] bg-ink/70" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ink">£48</span>
            <span className="h-1.5 w-8 rounded-full bg-ink-3/30" />
          </div>
          <span className="flex h-6 items-center justify-center rounded-full border border-hairline-strong font-mono text-[8px] uppercase tracking-wider text-ink-2 transition-colors duration-300 group-hover:border-transparent group-hover:bg-accent-bright group-hover:text-accent-ink">
            Add to cart
          </span>
        </div>
      </div>
      <div className="relative mb-2 grid size-12 place-items-center rounded-full border border-hairline-strong bg-canvas-2">
        <svg viewBox="0 0 24 24" className="size-5 text-ink-2" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.5L20.5 8H6.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="20" r="1.3" />
          <circle cx="17" cy="20" r="1.3" />
        </svg>
        <span className="absolute -right-1 -top-1 grid size-5 scale-0 place-items-center rounded-full bg-accent-bright font-mono text-[10px] font-medium text-accent-ink transition-transform delay-150 duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:scale-100">
          1
        </span>
      </div>
    </div>
  )
}

/* --- 3. Software a business runs on --------------------------------------- */

function AppArt() {
  const bars = ['h-[35%]', 'h-[55%]', 'h-[42%]', 'h-[70%]', 'h-[58%]', 'h-[88%]']
  return (
    <div className="flex w-full max-w-[320px] overflow-hidden rounded-[10px] border border-hairline-strong bg-canvas-2 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.7)]">
      <div className="w-14 space-y-2.5 border-r border-hairline p-3">
        <span className="block size-4 rounded-[5px] bg-accent" />
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} className={cx('h-1.5', i === 1 ? 'w-full bg-ink/60' : 'w-[70%]')} />
        ))}
      </div>
      <div className="flex-1 space-y-3 p-3">
        <div className="grid grid-cols-3 gap-1.5">
          {['Clients', 'Due', 'Signed'].map((label, i) => (
            <div key={label} className="rounded-[6px] border border-hairline p-1.5">
              <span className="block font-mono text-[7px] uppercase text-ink-3">{label}</span>
              {/* A bar, not a figure. A number here would read as a statistic
                  about some client's system, and it would be an invented one. */}
              <span
                className={cx(
                  'mt-1.5 block h-2 rounded-full bg-ink/70',
                  ['w-[70%]', 'w-[40%]', 'w-[85%]'][i],
                )}
              />
            </div>
          ))}
        </div>
        <div className="flex h-12 items-end gap-1 rounded-[6px] border border-hairline p-1.5">
          {bars.map((h, i) => (
            <span
              key={i}
              className={cx(
                'flex-1 origin-bottom rounded-[2px] transition-transform duration-500 ease-[var(--ease-ui)] group-hover:scale-y-110',
                h,
                i === bars.length - 1 ? 'bg-accent-bright' : 'bg-ink-3/40',
              )}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
        <div className="space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Bar className="h-1.5 flex-1" />
              <span
                className={cx(
                  'h-2.5 w-7 rounded-full',
                  i === 1 ? 'bg-[#fbbf24]/70' : 'bg-[#4ade80]/60',
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* --- 4. A pipeline that runs on its own ----------------------------------- */

function AutomationArt() {
  const Node = ({ label, accent }: { label: string; accent?: boolean }) => (
    <div
      className={cx(
        'relative z-10 flex h-14 w-[74px] flex-col items-center justify-center gap-1 rounded-[10px] border bg-canvas-2 shadow-[0_14px_30px_-16px_rgb(0_0_0/0.8)]',
        accent ? 'border-accent-bright' : 'border-hairline-strong',
      )}
    >
      <span className={cx('size-2 rounded-full', accent ? 'bg-accent-bright' : 'bg-ink-3/60')} />
      <span className="font-mono text-[8px] uppercase tracking-wider text-ink-2">{label}</span>
    </div>
  )
  const Wire = ({ delay }: { delay: string }) => (
    <div className="relative h-px flex-1 bg-hairline-strong">
      <span
        className="absolute -top-[3px] size-[7px] -translate-x-1/2 rounded-full bg-accent-bright opacity-0 shadow-[0_0_10px_var(--color-accent-bright)] group-hover:opacity-100 motion-safe:group-hover:[animation:travel-x_1.4s_linear_infinite]"
        style={{ animationDelay: delay }}
      />
    </div>
  )
  return (
    <div className="flex w-full max-w-[330px] items-center">
      <Node label="Source" />
      <Wire delay="0s" />
      <Node label="Filter" />
      <Wire delay="0.7s" />
      <Node label="Leads" accent />
    </div>
  )
}

const ART: Record<string, () => React.ReactElement> = {
  Websites: WebsiteArt,
  'Online stores': StoreArt,
  'Web applications': AppArt,
  Automation: AutomationArt,
}

/* -------------------------------------------------------------------------- */

/* --- The add-on: a results page where your site climbs to the top ------- */

function RankArt() {
  /* Three results; ours starts third and takes first place on hover. Bars,
     not invented text — it is a diagram of ranking, not a fake search page. */
  const row = 'absolute inset-x-0 h-[52px] rounded-[10px] border px-3.5 py-2.5 transition-[top,background-color,border-color] duration-500 ease-[var(--ease-ui)]'
  return (
    <div aria-hidden="true" className="relative w-full max-w-[320px]">
      <div className="mb-3 flex items-center gap-2 rounded-full border border-hairline-strong bg-canvas-2 px-3 py-2">
        <svg viewBox="0 0 16 16" fill="none" className="size-3.5 text-ink-3">
          <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="h-1.5 w-28 rounded-full bg-ink-3/40" />
      </div>
      <div className="relative h-[184px]">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={cx(row, 'border-hairline bg-canvas-2/60', i === 0 ? 'top-0 group-hover/addon:top-[66px]' : 'top-[66px] group-hover/addon:top-[132px]')}
          >
            <span className="block h-2 w-[55%] rounded-full bg-ink-3/45" />
            <span className="mt-2 block h-1.5 w-[80%] rounded-full bg-ink-3/25" />
          </div>
        ))}
        <div
          className={cx(
            row,
            'top-[132px] border-[color-mix(in_oklab,var(--color-accent-bright)_45%,transparent)] bg-[color-mix(in_oklab,var(--color-accent)_14%,transparent)] group-hover/addon:top-0',
          )}
        >
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent-bright" />
            <span className="block h-2 w-[50%] rounded-full bg-accent-bright" />
          </span>
          <span className="mt-2 block h-1.5 w-[75%] rounded-full bg-ink-3/40" />
        </div>
      </div>
    </div>
  )
}

export function Capabilities() {
  return (
    <Section id="chapter-craft" aria-labelledby="capabilities-heading">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <h2 id="capabilities-heading" className="text-h2 max-w-2xl font-medium text-ink">
            What I build
          </h2>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ink-2">
            Four kinds of work, and SEO on top of any of them. If yours is none of these, it
            is probably still worth a conversation.
          </p>
        </div>

        <div data-reveal-group className="grid gap-4 md:grid-cols-2">
          {site.capabilities.map((capability) => {
            const Art = ART[capability.title]
            return (
              <article
                key={capability.title}
                data-reveal
                className="surface-2 group overflow-hidden rounded-[var(--radius-lg)] transition-[border-color,transform] duration-300 ease-[var(--ease-ui)] hover:-translate-y-1 hover:border-hairline-strong"
              >
                {Art ? (
                  <Stage>
                    <Art />
                  </Stage>
                ) : null}
                <div className="p-6 sm:p-7">
                  <h3 className="text-[1.375rem] font-medium tracking-[-0.01em] text-ink">
                    {capability.title}
                  </h3>
                  <p className="mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-ink-2">
                    {capability.description}
                  </p>
                  <p className="mt-5 font-mono text-[0.75rem] tracking-[0.02em] text-ink-3">
                    {capability.proof}
                  </p>
                </div>
              </article>
            )
          })}
        </div>

        {/* ── Add-ons ─────────────────────────────────────────────────
            Sold on top of a build rather than as one, so it sits under the
            four kinds of work instead of beside them. */}
        {site.addons.map((addon) => (
          <article
            key={addon.title}
            data-reveal
            className="frame-glow group/addon mt-4 grid gap-8 overflow-hidden rounded-[var(--radius-lg)] p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_auto] lg:items-center lg:gap-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-accent-ink">
                <span aria-hidden="true">+</span> Add-on
              </span>
              <h3 className="mt-5 text-[1.625rem] font-medium leading-tight tracking-[-0.015em] text-ink">
                {addon.title}
              </h3>
              <p className="mt-1.5 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-3">
                {addon.label}
              </p>
              <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-2">
                {addon.description}
              </p>
              <p className="mt-5 font-mono text-[0.75rem] tracking-[0.02em] text-ink-3">{addon.proof}</p>
            </div>

            <ul className="space-y-3">
              {addon.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-snug text-ink">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-bright">
                    <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="hidden justify-center lg:flex">
              <RankArt />
            </div>
          </article>
        ))}
      </Container>
    </Section>
  )
}
