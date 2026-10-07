import Link from 'next/link'
import { Container, Meta, Section } from '@/components/primitives'
import { AskConsole } from '@/components/sections/AskConsole'
import { CONFIDENCE_FLOOR, RETRIEVAL_STATS } from '@/lib/retrieval'

/* ==========================================================================
   ASK — the section around the island

   ── THE CLAIM THIS SECTION MAKES, AND WHY IT LEADS ────────────────────────

   "No model. No hallucination."

   Every portfolio chatbot shipped in the last two years is a wrapper around a
   hosted model, and every one of them will, given the right question,
   confidently invent a client name or a number. This one cannot: it scores the
   question against the site's own sentences and quotes one, or it declines.
   There is no generator in the page to invent with.

   That is rare, it is checkable, and — unusually for an engineering property —
   a non-technical visitor understands it immediately. So it is the headline
   rather than a footnote, and the mechanism that earns it is one click away
   rather than printed over the top of it.

   It is also a COMMITMENT. The day a language model is added to this feature,
   the claim stops being true and has to come down with it.

   ── WHY THE PIPELINE IS BEHIND A DISCLOSURE ───────────────────────────────

   `your question → tokenise → BM25 over N chunks → best sentences → cited
   answer` used to sit above the input, permanently. It is a good sentence and
   the right people love it — but it is a diagram, and a diagram in front of a
   question box tells most visitors this is a tool for somebody else. Behind
   "How this works" it reaches everyone who wants it and nobody who does not.

   That disclosure is also the Lab's door, which is the right place for it: the
   people who open a panel about BM25 are exactly the people who want to see a
   tokeniser and a vector projection.
   ========================================================================== */

export function AskPortfolio() {
  /* The mechanism — BM25, the floor, the specificity gate — used to sit here
     behind a disclosure. It moved to /dev, which exists for exactly the
     visitor who wants it. Here the section makes its claim and hands over the
     tool; anyone who doubts the claim is one link from the proof. */
  return (
    <Section id="ask" aria-labelledby="ask-heading">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <Meta className="mb-5 block">Ask the site</Meta>
            <h2
              id="ask-heading"
              className="text-[clamp(2.25rem,1.4rem+3.2vw,4rem)] font-medium leading-[1] tracking-[-0.035em] text-ink"
            >
              No model. <span className="hl">No</span> hallucination.
            </h2>
            <p className="text-body-lg mt-6 max-w-md text-ink-2">
              It answers by quoting this site, and says so when the answer isn&rsquo;t here.
              Try it on anything a call would cover.
            </p>
            <Link
              href="/dev"
              className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] text-ink-2 transition-colors duration-[var(--duration-micro)] hover:text-ink"
            >
              How it works
              <span aria-hidden="true" className="transition-transform duration-[var(--duration-micro)] group-hover:translate-x-0.5">
                &rarr;
              </span>
            </Link>
          </div>

          <div data-reveal className="frame-glow min-w-0 rounded-[var(--radius-xl)] p-5 sm:p-8">
            <AskConsole chunks={RETRIEVAL_STATS.chunks} floor={CONFIDENCE_FLOOR} />
          </div>
        </div>
      </Container>
    </Section>
  )
}
