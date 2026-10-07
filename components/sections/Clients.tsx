import { projects } from '@/lib/content'
import { Container } from '@/components/primitives'

/* ==========================================================================
   CLIENTS — a moving line of names

   ── WHY NOT LOGOS ─────────────────────────────────────────────────────────

   A logo wall is the convention and it would be a lie here. There are no
   usage rights to these brands' marks, several are small businesses whose
   logo would not survive 40px, and a row of mismatched PNGs looks like what
   it is. Names set in the site's own type are honest and legible at every
   size.

   ── WHY IT MOVES ──────────────────────────────────────────────────────────

   A static row of eight names is a list. Moving, it becomes the one thing on
   the screen in motion while the visitor reads the hero, which is what makes
   it read as "a body of clients" rather than "some words". It pauses under
   the pointer so a name can be read, and stops entirely under reduced
   motion — where the duplicate copy is removed and the names wrap.

   ── WHERE THE NAMES COME FROM ─────────────────────────────────────────────

   Derived from the project data, never typed out. Every name is a client on
   a project with a page behind it, so the line cannot drift from the work or
   quietly acquire a client who was never engaged. Anonymised clients are
   absent by construction: they have a descriptor instead of a `client`.
   ========================================================================== */

export function Clients() {
  const names = [
    ...new Set(
      [...projects]
        .sort((a, b) => b.year - a.year)
        .map((project) => project.client)
        .filter((client): client is string => Boolean(client)),
    ),
  ]

  if (names.length === 0) return null

  /* Rendered twice: the track slides by exactly half its width, so the
     second copy is what makes the loop seamless. */
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <ul
      aria-hidden={hidden ? 'true' : undefined}
      className="flex shrink-0 items-center gap-x-14 pr-14 sm:gap-x-20 sm:pr-20"
    >
      {names.map((name) => (
        <li key={name} className="flex items-center gap-x-14 sm:gap-x-20">
          <span className="whitespace-nowrap text-[clamp(1.25rem,2.6vw,2rem)] font-medium tracking-[-0.02em] text-ink-2 transition-colors duration-[var(--duration-micro)] hover:text-ink">
            {name}
          </span>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-dim" />
        </li>
      ))}
    </ul>
  )

  return (
    <section aria-labelledby="clients-heading" className="relative border-y border-hairline py-10 sm:py-12">
      <Container>
        <h2
          id="clients-heading"
          className="mb-7 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-3"
        >
          Built for
        </h2>
      </Container>
      <div className="marquee" style={{ '--marquee-duration': '48s' } as React.CSSProperties}>
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  )
}
