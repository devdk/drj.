import { site } from '@/lib/site.config'
import { getProject, hasProjectPage, CATEGORY_LABELS } from '@/lib/content'
import { ButtonLink, StatusDot } from '@/components/primitives'
import { MagneticCta } from '@/components/interactive/MagneticCta'
import { HeroShowcase, type HeroItem } from '@/components/interactive/HeroShowcase'
import { ProjectVisual } from '@/components/sections/ProjectVisual'

/* ==========================================================================
   HERO — chapter 01

   "I build the [CRM] your business runs on."

   ── WHAT WAS CUT, AND WHY ─────────────────────────────────────────────────

   The name, role and location line: the nav carries the name, the CV carries
   the rest, and a hero that opens with a byline is a hero that opens with the
   least interesting fact about the work.

   The fifteen-word rotating sentence ("I've built everything from X to Y")
   is now seven. It argued range by listing it; this argues range by SHOWING
   it — four kinds of software, each a real project on the stage — and leaves
   the sentence to make one promise: what you get runs your business.

   ── WHY THESE FOUR, IN THIS ORDER ─────────────────────────────────────────

   Each is a different kind of thing a buyer might need, and each is real and
   on this page. The order alternates surfaces — a light app, a dark
   storefront, a light site, a dark platform — so every change of word is
   also a visible change on the stage, rather than one screenshot fading into
   a near-identical one. (Virtuoso moved last when its diagram became a real
   screenshot: two dark frames in a row read as one.)

   It opens on the CRM because it is the strongest claim: software a firm
   runs its practice on, in place of a subscription. If a visitor reads one
   frame and leaves, that is the frame to have read.
   ========================================================================== */

/* `label` is what the tab shows — the product's own name where it has one,
   because "SATCHEL" is the thing that was built and "Fordham Finance Group"
   is who it was built for, and a tab has room for one of them. */
const SEQUENCE: { word: string; slug: string; label: string }[] = [
  { word: 'CRM', slug: 'crm', label: 'SATCHEL' },
  { word: 'store', slug: 'zyvren', label: 'Zyvren' },
  { word: 'website', slug: 'allure-dental', label: 'Allure Dental' },
  { word: 'platform', slug: 'virtuoso', label: 'Virtuoso' },
]

export function Hero() {
  const items: HeroItem[] = SEQUENCE.flatMap(({ word, slug, label }, i) => {
    const project = getProject(slug)
    if (!project) return []
    return [
      {
        word,
        slug,
        title: label,
        meta: `${CATEGORY_LABELS[project.category]} · ${project.year}`,
        ...(hasProjectPage(project) ? { href: `/work/${slug}` } : {}),
        visual: (
          <ProjectVisual
            project={project}
            /* The first frame is the largest thing above the fold, so it is
               the one image that must not be lazy. */
            priority={i === 0}
            stage
            sizes="(min-width: 1280px) 1180px, 100vw"
          />
        ),
      },
    ]
  })

  return (
    <HeroShowcase
      items={items}
      pill={
        <span className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-canvas-2/60 py-1.5 pl-3 pr-4 text-[0.8125rem] text-ink-2 backdrop-blur-[2px]">
          <StatusDot />
          {site.availability}
        </span>
      }
      actions={
        <>
          <MagneticCta>
            <ButtonLink href="/#chapter-contact" variant="primary" size="lg" data-cursor="START">
              Start a project
            </ButtonLink>
          </MagneticCta>
          <ButtonLink href="/#chapter-work" variant="secondary" size="lg">
            See the work
          </ButtonLink>
        </>
      }
    />
  )
}
