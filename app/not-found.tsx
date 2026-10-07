import { ButtonLink } from '@/components/primitives'
import { PageHero } from '@/components/sections/PageHero'

/* Error copy per spec §50 — subtle and professional, not jokey. */
export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      before="You found a page that"
      highlight="doesn’t exist"
      after="."
      lead="Either it moved, or the link was wrong. Both are recoverable."
      width="md"
      actions={
        <>
          <ButtonLink href="/" variant="primary">
            Back to the start
          </ButtonLink>
          <ButtonLink href="/#chapter-work" variant="ghost">
            See the work
          </ButtonLink>
        </>
      }
    >
      <p className="mt-10 font-mono text-[0.8125rem] text-ink-3">
        Or press <kbd className="text-ink-2">⌘K</kbd> to search everything.
      </p>
    </PageHero>
  )
}
