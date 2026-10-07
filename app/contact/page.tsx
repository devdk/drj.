import type { Metadata } from 'next'
import { site } from '@/lib/site.config'
import { isPlaceholder } from '@/lib/schema'
import { BuildWithMe } from '@/components/sections/BuildWithMe'
import { Container, Meta, Section, Surface } from '@/components/primitives'
import { PageHero } from '@/components/sections/PageHero'

export const metadata: Metadata = {
  title: 'Start a project',
  description:
    'Tell me what you are trying to build. Four questions, and you will get a recommended approach before you send anything.',
}

/* ==========================================================================
   CONTACT  (spec §31)

   The brief was right that "feel free to contact me" is a wasted ending.
   The qualifier does the real work, so this page is a strong statement plus
   the qualifier, and then the direct routes for people who would rather just
   email.
   ========================================================================== */

export default function ContactPage() {
  const emailReady = !isPlaceholder(site.email)

  return (
    <>
      {/* Not "What are you trying to build?" — the form right below asks
          exactly that, and two headings saying one thing is one too many. */}
      <PageHero
        eyebrow="Start a project"
        before="Every project starts with a"
        highlight="conversation"
        after="."
        lead="Answer four questions below, or write directly. Either way, the reply comes from me."
        flush
        width="md"
      />

      <BuildWithMe />

      <Section band aria-labelledby="direct-heading">
        <Container>
          <h2 id="direct-heading" className="text-h3 mb-8 font-medium text-ink">
            Or go direct
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <Surface level={2} className="p-6">
              <Meta className="mb-3 block">Email</Meta>
              {emailReady ? (
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.9375rem] text-accent underline decoration-1 underline-offset-4"
                >
                  {site.email}
                </a>
              ) : (
                <p className="text-[0.9375rem] text-ink-3">{site.email}</p>
              )}
            </Surface>

            {(
              [
                ['LinkedIn', site.links.linkedin],
                ['GitHub', site.links.github],
              ] as const
            ).map(([label, href]) => (
              <Surface key={label} level={2} className="p-6">
                <Meta className="mb-3 block">{label}</Meta>
                {isPlaceholder(href) ? (
                  <p className="text-[0.9375rem] text-ink-3">{href}</p>
                ) : (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.9375rem] text-accent underline decoration-1 underline-offset-4"
                  >
                    Open profile
                  </a>
                )}
              </Surface>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
