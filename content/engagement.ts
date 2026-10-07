import { z } from 'zod'

/* ==========================================================================
   ENGAGEMENT AND FAQ

   The questions a business owner asks before they contact anybody, and the
   answers in Dheeraj's own words rather than a developer's.

   ── WHY THIS FILE EXISTS AT ALL ───────────────────────────────────────────

   The site used to refuse every one of these. `scripts/ask-gaps.ts` ran 43
   realistic questions through the answerer and the recurring content gaps
   were not technical — they were "how long does it take", "what do you need
   from me", "what does it cost". A portfolio that answers how a tokeniser
   works and not how long a Shopify build takes is written for the wrong
   reader.

   ── WHAT IS DELIBERATELY NOT HERE ─────────────────────────────────────────

   Prices. The engagement model is fixed scope per project, and a project is
   quoted after it is understood — so a number on this page would either be
   invented or so hedged it tells nobody anything. The ADVANCE is here,
   because a percentage is a term rather than a price, and knowing a project
   starts at 40% up front is exactly the kind of thing someone wants before
   the first call rather than during it.

   Everything in this file is quotable by the Ask section, so these answers
   have to survive being read aloud out of context. No marketing voice, no
   hedging, no claim that is not Dheeraj's own.
   ========================================================================== */

export const timelineSchema = z.object({
  /** The kind of project, in the words a client would use. */
  kind: z.string().min(1),
  /** A real range, or an honest statement that there isn't one. */
  typical: z.string().min(1),
  /** The same range as numbers, so it can be drawn. Absent when there is no
      honest range to draw — the chart then shows a worked example instead. */
  weeks: z.tuple([z.number().positive(), z.number().positive()]).optional(),
  /** A real past project, for kinds of work too variable to range. */
  example: z.object({ label: z.string().min(1), weeks: z.number().positive() }).optional(),
})

export const engagementSchema = z.object({
  model: z.string().min(1),
  advance: z.string().min(1),
  revisions: z.string().min(1),
  timelines: z.array(timelineSchema).min(1),
  /** What the client has to bring, listed in the order it is needed. */
  needs: z.array(z.string().min(1)).min(1),
})

export const faqSchema = z
  .object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })
  /* A question is only worth printing if the answer says something. Two
     sentences of "it depends" is the FAQ equivalent of a stock photo. */
  .refine((entry) => entry.answer.length > 60, {
    message: 'An answer this short is not an answer — cut the question instead.',
  })

export type Engagement = z.infer<typeof engagementSchema>
export type Faq = z.infer<typeof faqSchema>

export const ENGAGEMENT: Engagement = engagementSchema.parse({
  model: 'Fixed scope, priced per project',
  /* Was "40% up front, the balance on delivery". The 40% is Dheeraj's; the
     second half was an inference about when the rest is paid, and an
     inference about money does not belong on a page someone will hold him
     to. Restore it only if it is the actual term. */
  advance: '40% up front',
  revisions: 'Three rounds of revisions, included, in the first month after launch',

  timelines: [
    { kind: 'WordPress site', typical: '3 to 4 weeks', weeks: [3, 4] },
    { kind: 'Shopify store', typical: '4 to 6 weeks', weeks: [4, 6] },
    {
      kind: 'Custom software, internal tools and web apps',
      /* Deliberately not a range. The CRM took eight weeks and a lead engine
         took rather less; averaging those into "6 to 10 weeks" would produce a
         number that describes neither and binds him to both. */
      typical: 'Scoped per project — the practice CRM took eight weeks from first line to production, and that is a large one',
      example: { label: 'SATCHEL', weeks: 8 },
    },
  ],

  needs: [
    'Two calls before anything starts, thirty to forty-five minutes each — one to understand the business, one to agree the scope',
    'Content: the words, the pages, the products',
    'Assets: logos, photography, anything already designed',
    'Brand guidelines, if they exist',
    'The 40% advance',
  ],
})

export const FAQ: Faq[] = [
  {
    question: 'How long does a project take?',
    answer:
      'A WordPress site is usually three to four weeks. A Shopify store, four to six. Custom software and web apps vary too much to quote a range before the scope exists — the practice CRM on this site took eight weeks from first line to production, and that is at the large end.',
  },
  {
    question: 'What do you need from me to start?',
    answer:
      'Two calls, thirty to forty-five minutes each: one to understand the business, one to agree what is being built. Then the content, the assets, and whatever brand guidelines already exist. Work starts on a 40% advance.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'Three rounds of revisions are included in the first month, so the things you only notice once the site is live get fixed rather than logged.',
  },
  {
    question: 'Can you work with my existing team or agency?',
    answer:
      'Yes. Twelve of the projects behind this site were delivered that way — alongside someone else’s designers and project managers, on their timelines rather than mine.',
  },
  {
    question: 'What if the scope changes halfway?',
    answer:
      'Small changes get absorbed. You should be able to say "actually, not like that" without it becoming a negotiation, and a project where the client stops asking is a project heading somewhere nobody wanted. A change that adds weeks of work is a change to the price, and you will hear that before the work starts rather than on the invoice.',
  },
  {
    question: 'Do you take over a site somebody else built?',
    answer:
      'Yes, several times. It is a different job from building new — the first week goes on finding out what is actually there — but inheriting a codebase is normal work rather than a reason to start again.',
  },
  {
    question: 'Do you use AI to write the code?',
    answer:
      'Yes, and not for everything. Repetitive components — the fifth variation of a form, a table that resembles four other tables — are quicker to generate than to type, and no worse for it. The parts where being wrong is expensive are not delegated: the data model, the architecture, and anything handling someone’s client records.',
  },
]
