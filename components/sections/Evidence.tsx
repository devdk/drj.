import { INVENTORY, PROJECT_GROUP } from '@/content/inventory'
import { hasProjectPage, projects } from '@/lib/content'
import { Container, Meta } from '@/components/primitives'
import { EvidenceRows, type Cell, type Row } from '@/components/interactive/EvidenceRows'

/* ==========================================================================
   EVIDENCE — the server half, and the section around it

   Joins the CV's counts (content/inventory.ts) to the real projects
   (content/projects.ts) and hands the interactive rows exactly the fields the
   picture needs. Prose, architecture and metrics stay on the server; the
   island receives eleven small objects.

   This was a fragment inside the hero until the hero was cut back to one
   screen. It is a section in its own right now — same position in the page,
   but with the room the rows need to be read rather than glimpsed at the fold.
   ========================================================================== */

export function Evidence() {
  const rows: Row[] = INVENTORY.map((group) => {
    const named: Cell[] = projects
      .filter((project) => PROJECT_GROUP[project.slug] === group.id)
      /* Newest first within a row, so the eye lands on current work. */
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
      .map((project) => ({
        slug: project.slug,
        title: project.title,
        /* Exactly one of these exists — the schema refuses both and neither —
           so an anonymised client shows its descriptor rather than a blank. */
        client: project.client ?? project.clientDescriptor ?? 'Undisclosed client',
        year: project.year,
        ...(project.clientIndustry ? { sector: project.clientIndustry } : {}),
        ...(hasProjectPage(project) ? { href: `/work/${project.slug}` } : {}),
      }))

    return {
      id: group.id,
      label: group.label,
      count: group.count,
      approximate: group.approximate,
      note: group.note,
      named,
    }
  })

  return (
    /* It used to sit straight under the hero with almost no top padding, so
       its label could peek above the fold as the scroll affordance. The hero
       now has a stage of real screenshots doing that job far better, so this
       moved to after the work — where "everything shipped" reads as the
       totals underneath the five examples just shown. */
    <section id="chapter-evidence" className="py-[var(--spacing-section)]">
      <Container>
        <div className="mb-8">
          <Meta>Everything shipped so far</Meta>
        </div>
        <EvidenceRows rows={rows} />
      </Container>
    </section>
  )
}
