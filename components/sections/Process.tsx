import { site } from '@/lib/site.config'
import { Container } from '@/components/primitives'
import { ProcessJourney } from '@/components/interactive/ProcessJourney'

/* ==========================================================================
   PROCESS — how a project runs

   ── WHY IT IS NO LONGER WHITE ─────────────────────────────────────────────

   This used to be the one paper-white section, to mark the change of subject
   from proof to process. It marked it too hard: a full-bleed white slab in a
   dark page reads as a different site for a moment, and the eye has to
   re-adjust twice, going in and coming out.

   It is now set apart by light rather than by inversion — the dark page
   warms into a slow aurora in the section's own chapter colour and fades
   back out at both edges, so there is no seam to cross. Distinct, but the
   same room.

   The stages themselves became a route: the four names set large in a
   sticky column, lit one at a time as you read down the cards beside them.
   See ProcessJourney.

   `overflow-clip`, not `overflow-hidden`, to contain the aurora: hidden makes
   the section a scroll container, and a sticky child then sticks to the
   section instead of the page — which silently turns the sticky column off.
   ========================================================================== */

export function Process() {
  return (
    <section
      id="chapter-process"
      aria-labelledby="process-heading"
      className="process-aurora relative isolate overflow-clip py-[calc(var(--spacing-section)*1.25)]"
    >
      <Container className="relative">
        <ProcessJourney stages={[...site.process]} />
      </Container>
    </section>
  )
}
