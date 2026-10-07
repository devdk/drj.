/* ==========================================================================
   ASK CORPUS — GENERATED. DO NOT EDIT.

   Written by scripts/build-lab-data.ts (see the ASK CORPUS section there for
   the reasoning). Run `npm run build:lab` to rebuild.

   This is the corpus lib/retrieval.ts scores with BM25 and quotes verbatim.
   Two halves, and the difference matters:

      25 chunks  of the 33 in the embedded RAG index, imported from
                ./lab-data rather than copied — the Lab already ships that text
                on the same page. 8 are excluded; the reasons are listed
                against each id below.
     156 chunks  cut here from the site's own current content: the about
                page and the 12 case studies. 48524 characters of prose
                that is published on a route a visitor can open and check.

   Nothing in here is written by the build. One chunk is TEMPLATED from
   structured fields (location, timezone, availability, role, email) and it is
   marked as such below; everything else is prose lifted intact.
   ========================================================================== */

import { LAB_POINTS } from '@/content/lab-data'

export type AskChunk = {
  /** Stable id. `idx-*` came from the embedded index; the rest were cut here. */
  id: string
  /** Which document it came from — shown on the citation chip. */
  source: string
  /** Human label for the chip, so a citation reads as a place. */
  label: string
  /** Route where this text can be read in context, or null if it has no page. */
  href: string | null
  /** The text, whitespace collapsed. Quoted verbatim; never paraphrased. */
  text: string
}

/* Where each embedded chunk can be read. The index predates the current routes,
   so this mapping is stated rather than derived. */
const INDEX_HREF: Record<string, string> = {
  "cv": "/#cv",
  "faq": "/about",
  "intros": "/about"
}

/* Chunks the Lab plots but this system will not quote. A picture of a corpus is
   not a claim about the world; an answer is. Reason per id:
     c9   FAQ answer describing WebLLM streaming inference on this site — the shipped site runs no model
     c14  engineer intro claiming a static export with transformers.js retrieval and WebLLM inference
     c15  founder intro citing "the in-browser LLM answering questions on this page"
     c16  the portfolio-RAG write-up: Qwen2.5-1.5B on WebGPU, an architecture that was never shipped
     c17  CRM outline with unanswered questions and empty metrics — superseded by /work/crm
     c18  lead-engine outline, questions to self — superseded by /work/leadhouse
     c19  ads-analyser outline, questions to self — superseded by /work/ads-analyser
     c20  voiceover-platform outline, questions to self — superseded by /work/studio
*/
const SUPERSEDED = new Set(["c9","c14","c15","c16","c17","c18","c19","c20"])

/** The embedded index, minus the superseded chunks, as retrieval chunks. */
const INDEXED: AskChunk[] = LAB_POINTS.filter((point) => !SUPERSEDED.has(point.id)).map(
  (point) => ({
    id: `idx-${point.id}`,
    source: point.source,
    label: point.label,
    href: INDEX_HREF[point.source] ?? null,
    text: point.text,
  }),
)

/** Cut from lib/site.config.ts and content/projects.ts at build time. */
export const ASK_SUPPLEMENT: AskChunk[] = [
  {
    "id": "about-01",
    "source": "about",
    "href": "/about",
    "label": "Where I started",
    "text": "Where I started. I started in Patna in 2022, shipping websites to clients three time zones away — WordPress, WooCommerce and Shopify, mostly for people in Canada, the US and the UK. No team and no safety net, which meant scoping, building, deploying and supporting each project myself. That is also where I learned performance properly, because a slow page loses a client money and they tell you about it."
  },
  {
    "id": "about-02",
    "source": "about",
    "href": "/about",
    "label": "What I build now",
    "text": "What I build now. Products with real users. I moved to Gurgaon in 2023 for an MCA and spent those years building web apps alongside it — including the store, event pages and dashboards of Virtuoso.live, on contract. Since July 2025 I have been at Mirasphere Digital doing agency delivery in React, Shopify and WordPress, and, as sole developer, building three products there: a practice CRM that Fordham Finance Group now runs its business on, a lead engine that reads the entire UK company register, and a pipeline that turns a script into a finished voiceover video."
  },
  {
    "id": "about-03",
    "source": "about",
    "href": "/about",
    "label": "What I have learned",
    "text": "What I have learned. Two things, both the expensive way. First, a rule that has to be remembered everywhere it applies will eventually be forgotten somewhere — so the rules that matter most are enforced in one place, structurally, rather than trusted to memory. Second, for anything that touches historical data, the failure mode to design against is not an error but a silent success: an import that looks like it worked is far more dangerous than one that stops, which is why the importers I build default to a dry run."
  },
  {
    "id": "about-04",
    "source": "about",
    "href": "/about",
    "label": "What I am exploring",
    "text": "What I am exploring. LLM engineering, from the practical end: RAG pipelines, embeddings with transformers.js, and in-browser inference with WebLLM and WebGPU. What interests me is the judgement rather than the novelty — my Meta ads analyser is deliberately rule-based, because at a few hundred ads deterministic clustering beats a model on cost, speed and being able to explain the answer. Alongside that, TypeScript and Next.js in depth, which is what this site is built in."
  },
  {
    "id": "about-05",
    "source": "about",
    "href": "/about",
    "label": "Timeline",
    "text": "Timeline. 2022: Patna. First freelance clients — WordPress, WooCommerce, Shopify — for businesses in Canada, the US and the UK. 2023: Gurgaon. Started an MCA at K.R. Mangalam University while continuing to deliver freelance and agency work. 2024: Frontend developer on contract at Virtuoso.live — the web app of an immersive live-events platform. 2025: Website developer at Mirasphere Digital, and the start of building products of my own."
  },
  {
    "id": "profile-06",
    "source": "profile",
    "href": "/about",
    "label": "Location and availability",
    "text": "Location and availability. Dheeraj Kumar is based in Gurgaon, India, and works in the Asia/Kolkata time zone (IST). His role is Web & Software Developer. Current status: Available for new projects. He can be reached by email at okkdheeraj@gmail.com."
  },
  {
    "id": "work/virtuoso-07",
    "source": "work/virtuoso",
    "href": "/work/virtuoso",
    "label": "Virtuoso",
    "text": "Virtuoso. The web app behind an immersive events platform — its marketplace, event pages and artist pages. Role: Frontend developer on the web application, in a small team — the backend services were other people’s work. Status: live, 2025, 12 months, July 2024 to June 2025. Built for Virtuoso. Stack: TypeScript, AWS S3 and Cloudflare."
  },
  {
    "id": "work/virtuoso-08",
    "source": "work/virtuoso",
    "href": "/work/virtuoso",
    "label": "Virtuoso — context",
    "text": "Virtuoso is an immersive experience platform for artists, businesses and creatives — live events streamed into 3D venues, a digital replica of the Earth, and a creator marketplace, built on Unreal Engine 5 and shipping to desktop, mobile, Quest and console. The 3D client is one half of that product. The other half is the web application everyone arrives through: where an artist has a page, an event has a listing, and a creator has a storefront."
  },
  {
    "id": "work/virtuoso-09",
    "source": "work/virtuoso",
    "href": "/work/virtuoso",
    "label": "Virtuoso — the problem",
    "text": "The platform had one developer and a web surface that had to exist before any of the commercial features could: without artist pages, event listings and a store, a 3D world has nothing for anyone to find, attend or buy. Partway through, the infrastructure underneath moved, so the web app had to keep working against services that were themselves being replaced."
  },
  {
    "id": "work/virtuoso-10",
    "source": "work/virtuoso",
    "href": "/work/virtuoso",
    "label": "Virtuoso — approach",
    "text": "Build the web application feature by feature rather than as one launch — store, event pages, artist pages, and the community layer — so each surface could go live as the platform around it settled. The community platform was the hardest of them: a social layer with its own accounts, sessions and permissions, sitting alongside a 3D client that has its own idea of who a user is. Getting authentication to agree across both was the real work, and it is the part that would have been invisible if it had gone well and fatal if it had not."
  },
  {
    "id": "work/virtuoso-11",
    "source": "work/virtuoso",
    "href": "/work/virtuoso",
    "label": "Virtuoso — outcome",
    "text": "The platform scaled, a role-based access problem that had been open for a long time was closed, and storage stopped being a cost nobody had looked at. The access-control fix is the one worth naming: a 3D client and a web application that disagree about who a user is produce a bug you cannot reason about from either side alone, and it had survived long enough to be treated as a fact of the system rather than a defect."
  },
  {
    "id": "work/crm-12",
    "source": "work/crm",
    "href": "/work/crm",
    "label": "SATCHEL — Practice CRM",
    "text": "SATCHEL — Practice CRM. The practice-management software Fordham Finance Group runs on, every working day. Role: Sole developer, end to end — at Mirasphere Digital, for an agency client. Status: live, 2026, ~8 weeks from first line to production. Built for Fordham Finance Group. Stack: TypeScript, React, Fastify, PostgreSQL, Redis, Docker."
  },
  {
    "id": "work/crm-13",
    "source": "work/crm",
    "href": "/work/crm",
    "label": "SATCHEL — Practice CRM — context",
    "text": "Fordham Finance Group, a UK accountancy practice, had outgrown the off-the-shelf practice-management subscription it ran on. The cost was not really the subscription — it was the work that kept happening outside the software, because the software would not bend to the way the firm actually works. Fordham came to Mirasphere Digital, and I was the only developer on the project, from the data model through to deployment and support."
  },
  {
    "id": "work/crm-14",
    "source": "work/crm",
    "href": "/work/crm",
    "label": "SATCHEL — Practice CRM — the problem",
    "text": "Replace the firm’s core operating software — client records, UK compliance deadlines, documents and the client-facing side — without losing a single record, and without the firm stopping work while it happened."
  },
  {
    "id": "work/crm-15",
    "source": "work/crm",
    "href": "/work/crm",
    "label": "SATCHEL — Practice CRM — approach",
    "text": "Prove the data model before building on it: a one-day prototype, tested against the firm’s real workflows, and only then the production build. The firm’s live data was in it from the first week, which made two rules non-negotiable — every database change additive, never destructive, and every import a dry run that reports what it would change before it changes anything."
  },
  {
    "id": "work/crm-16",
    "source": "work/crm",
    "href": "/work/crm",
    "label": "SATCHEL — Practice CRM — outcome",
    "text": "The firm runs on it every working day. Years of client history moved across without losing a record, the team works in software shaped around how they actually work rather than around a vendor’s template, and there are no per-user subscription fees."
  },
  {
    "id": "work/leadhouse-17",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine",
    "text": "Companies House Lead Engine. The UK’s entire public company register, turned into pre-qualified leads at zero cost per lead. Role: Sole developer, end to end — at Mirasphere Digital, for an agency client. Status: live, 2026. Built for Swann Bookkeeping & Accountancy. Stack: Python, pandas, FastAPI, PostgreSQL, React, Docker, Caddy."
  },
  {
    "id": "work/leadhouse-18",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — context",
    "text": "Accountants win clients whose filing deadlines are close. Companies House publishes every company’s accounts due date and offers no way to query for it, and the paid lead platforms that fill that gap charge per lead for data that is already public."
  },
  {
    "id": "work/leadhouse-19",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — the problem",
    "text": "Turn the UK’s public company register into a pipeline of pre-qualified, contactable leads — at zero marginal cost per lead."
  },
  {
    "id": "work/leadhouse-20",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — approach",
    "text": "Hybrid by design. Source offline from the full bulk register with pandas in 25,000-row chunks, verify online through the rate-limited REST API, and make every long job restart-survivable: resumable batches with an auto-advancing cursor, and an orphan-job sweep on boot. The bulk file answers \"who might be due\" for free; the API answers \"who actually is\" for the few hundred that matter."
  },
  {
    "id": "work/leadhouse-21",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — implementation",
    "text": "Ingest reads the monthly register in 25,000-row chunks, so memory stays flat whatever the file does. Filtering happens locally against Postgres, which makes the definition of a good lead cheap to change. Verification is the expensive stage and is treated as such: a sliding-window limiter pinned at half the published ceiling, an eight-step backoff that honours Retry-After, and separate handling for 429, 404, 5xx and TLS failures, because retrying a 404 forever is how you get banned for a company that does not exist. Verdicts cache for 30 days. Enrichment scores matches on evidence rather than similarity — a registered company number in a site footer scores 95, a postcode match 80 — and Hunter fills the contact gap only after a match is trusted."
  },
  {
    "id": "work/leadhouse-22",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — implementation (cont.)",
    "text": "Nine Postgres tables hold jobs, cursors, the verdict cache and the suppression list; the cursor auto-advances so a batch killed by a deploy resumes rather than restarts, and an orphan-job sweep on boot cleans up whatever the last restart left mid-flight."
  },
  {
    "id": "work/leadhouse-23",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — what was hard (1/3)",
    "text": "Long jobs died mid-batch on deploys and restarts, losing hours of scanning"
  },
  {
    "id": "work/leadhouse-24",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — what was hard (2/3)",
    "text": "The bulk snapshot flagged companies as due that were not: live verification found only 83 of 162 flagged companies were actually overdue"
  },
  {
    "id": "work/leadhouse-25",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — what was hard (3/3)",
    "text": "Distinguishing 429, 404, 5xx and TLS failures so each got the correct retry behaviour rather than a generic one"
  },
  {
    "id": "work/leadhouse-26",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — how it was solved",
    "text": "Resumability was solved with slice-and-continue batches and an auto-advancing cursor, plus an orphan-job sweep on boot — one 42,119-row batch was processed across five resumed runs without losing position. Staleness was solved by refusing to trust the snapshot: the bulk file produces candidates, and the live REST profile decides. Retry behaviour was solved by classifying failures properly and building an eight-step backoff that honours Retry-After, which is why 22 production scrape jobs have run without a single rate-limit incident."
  },
  {
    "id": "work/leadhouse-27",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — outcome",
    "text": "It fills the firm’s outreach pipeline at zero cost per lead, with every lead pre-qualified by a live-verified filing deadline rather than a stale flag — and it does it from data that was already public."
  },
  {
    "id": "work/leadhouse-28",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — in hindsight",
    "text": "Rejecting the Streaming API was right, and it was the decision the whole design rests on: streaming answers \"what changed\", and the business question is \"who is due\", which is a full-register scan. The next leap is not more coverage but better ranking — scoring leads by likelihood to switch accountants rather than by deadline alone, because a deadline tells you who is under pressure and not who is unhappy."
  },
  {
    "id": "work/leadhouse-29",
    "source": "work/leadhouse",
    "href": "/work/leadhouse",
    "label": "Companies House Lead Engine — measured results",
    "text": "Measured results. Register cohort scanned: 171,876 companies in ~6 minutes — self-measured, measured 2026-08-01. Companies matched in one imported batch: 8,668 from 42,119 rows — self-measured, measured 2026-08-01. Rate-limit incidents: 0 across 22 production jobs — self-measured, measured 2026-08-01."
  },
  {
    "id": "work/ads-analyser-30",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor",
    "text": "Competitive Ads Extractor. A competitor list in, every live Facebook and Instagram ad out — clustered into hooks, offers and gaps. Role: Sole developer. Status: live, 2026. Built for marketing work where competitor ad research was being done by hand, one ad at a time. Stack: Node.js, Meta Ad Library API, PDFKit."
  },
  {
    "id": "work/ads-analyser-31",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — context",
    "text": "Knowing what competitors are running on Facebook and Instagram means manually trawling the Meta Ad Library, ad by ad — a job that is tedious at ten ads and impossible at three hundred."
  },
  {
    "id": "work/ads-analyser-32",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — the problem",
    "text": "One command in: a competitor list. One report out: every live ad, clustered into hooks, offers, and the angles nobody in the market has claimed."
  },
  {
    "id": "work/ads-analyser-33",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — approach",
    "text": "Deliberately dependency-light: three packages, no framework, no database, and a rule-based analysis pipeline that is deterministic, free and auditable. The hard engineering went somewhere less glamorous — three-tier competitor resolution that accepts a page URL, a brand name, or a bare domain, because that is the input a real user actually has. That describes the command-line tool, and it is still what the tool is. The hosted console that now wraps it is a second artefact with a different constraint: once other people could run analyses, it needed accounts, admin approval and a database to hold them. The no-database decision was right for a tool with one user and stopped being right the moment there were several — which is the trigger the decision itself predicted, arriving for a reason it did not."
  },
  {
    "id": "work/ads-analyser-34",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — implementation",
    "text": "Resolution runs twelve patterns across three user-agent identities, because Facebook shows a link-preview crawler things it will not show a browser without a session — that is the difference between the tool working on a bare domain and asking the user to go and find a page ID. The fetcher pages through Ad Library API v21 with backoff, and treats EU DSA data caveats as annotations on the result rather than errors. 9 Jaccard similarity before anything is counted, then creative is classified into 11 hook types and a 9-offer matrix, and the interesting output falls out of the negative space — a 10-angle gap map naming the emotional angles nobody in a market has claimed. Every run writes a timestamped folder containing a single-file dashboard, Markdown, CSV, JSON and a PDF, so in the command-line tool there is no database and no export step. Token redaction is applied on every error path, because the fastest way to leak an API token is a stack trace nobody expected to see."
  },
  {
    "id": "work/ads-analyser-35",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — what was hard (1/3)",
    "text": "Facebook page-ID resolution behind login walls, where a plain request returns nothing useful"
  },
  {
    "id": "work/ads-analyser-36",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — what was hard (2/3)",
    "text": "Near-duplicate ads polluting the clusters, making a single creative look like a campaign trend"
  },
  {
    "id": "work/ads-analyser-37",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — what was hard (3/3)",
    "text": "Keeping the API token out of every error path, including the ones that only fire when something else has already gone wrong"
  },
  {
    "id": "work/ads-analyser-38",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — how it was solved",
    "text": "Resolution was solved with a user-agent strategy and pattern redundancy rather than a headless browser — twelve patterns and three identities, so no single markup change takes the tool down. Duplicate pollution was solved by folding at 0.9 Jaccard similarity before classification, so clusters count distinct creative rather than repeats. Token leakage was solved by treating redaction as a discipline applied at the logging boundary, not a filter added to individual handlers."
  },
  {
    "id": "work/ads-analyser-39",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — outcome",
    "text": "Twenty-three real analysis runs across six verticals, 361 ads analysed, and gap maps that name the emotional angles nobody in a market has claimed — produced at zero analysis cost by a tool that installs with three dependencies — and a hosted console on top of it for the people who are not going to install anything."
  },
  {
    "id": "work/ads-analyser-40",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — in hindsight",
    "text": "Choosing not to use an LLM was the engineering decision here. At this scale deterministic rules beat a model on cost, speed and auditability, and being able to explain why an ad landed in a cluster is worth more to the person reading the report than a better-sounding summary. An optional LLM layer on top of the clusters is the obvious v2 — on top, not instead of."
  },
  {
    "id": "work/ads-analyser-41",
    "source": "work/ads-analyser",
    "href": "/work/ads-analyser",
    "label": "Competitive Ads Extractor — measured results",
    "text": "Measured results. Real analysis runs: 23 across 6 verticals — self-measured, measured 2026-08-01. Ads analysed: 361 — self-measured, measured 2026-08-01. Runtime dependencies: 3 — self-measured, measured 2026-08-01. The command-line tool: no framework, no database. The hosted console adds both an auth layer and a database."
  },
  {
    "id": "work/studio-42",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio",
    "text": "Mirasphere Studio. Script in, finished voiceover video out — including a lip-synced presenter built from one still photo. Role: Sole developer, end to end — an in-house product at Mirasphere Digital. Status: live, 2026. Built for Mirasphere Digital, as its own product rather than for a client. Stack: Next.js, TypeScript, Remotion, ElevenLabs, Kling, ffmpeg, Prisma."
  },
  {
    "id": "work/studio-43",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — context",
    "text": "A short marketing video normally needs an editor, a voice artist and days of turnaround, which puts it out of reach for exactly the work that needs it most — many small variations rather than one polished film."
  },
  {
    "id": "work/studio-44",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — the problem",
    "text": "Make video production a form submission: script in, finished voiceover video out — including a lip-synced AI presenter."
  },
  {
    "id": "work/studio-45",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — approach",
    "text": "An orchestration pipeline where every paid step — text-to-speech, speech-to-text, image-to-video, lip-sync — checkpoints its output, and Remotion’s timeline is driven by real word-level timestamps taken from the narration rather than estimated from a words-per-minute figure. The pipeline assumes third-party APIs will be slow and flaky, and is built so that being slow and flaky costs nothing."
  },
  {
    "id": "work/studio-46",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — implementation",
    "text": "The wizard captures a script as structured beats and previews them without touching an API, so writing is free and only rendering costs money. A render then walks a fixed chain: ElevenLabs generates narration in a cloned voice, Scribe transcribes that same audio back to word-level timestamps, Kling turns a still photo into presenter footage, Latent Sync applies lip-sync, and ffmpeg ping-pong loops the clip to narration length. Remotion composes the result from four compositions that produce six output styles, with beat durations scaled proportionally against the real audio length and largest-remainder rounding so the frame count always reconciles. Every one of those steps writes a checkpoint row through Prisma before the next begins, which is the difference between a flaky vendor costing a retry and costing the whole video — the presenter step alone polls for around an hour."
  },
  {
    "id": "work/studio-47",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — implementation (cont.)",
    "text": "The whole thing is local-first: no S3, no Redis, no render farm, and the Claude-powered convenience features self-disable when no key is present rather than failing the pipeline."
  },
  {
    "id": "work/studio-48",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — what was hard (1/3)",
    "text": "Third-party render polling dominates wall-clock — the presenter step takes around an hour, and anything that interrupted it lost the money as well as the time"
  },
  {
    "id": "work/studio-49",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — what was hard (2/3)",
    "text": "Audio duration and the visual timeline disagreed, so captions and scene cuts drifted off the narration"
  },
  {
    "id": "work/studio-50",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — what was hard (3/3)",
    "text": "The lip-sync API required publicly reachable URLs, and the constraint was no object storage"
  },
  {
    "id": "work/studio-51",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — how it was solved",
    "text": "The long-poll problem was solved by checkpointing every paid step, so a retry resumes from the last completed one and a failure costs nothing extra. The timeline mismatch was solved by driving durations from the audio: proportional scaling of beat lengths with largest-remainder rounding, so the frame counts reconcile exactly and captions land on the word. The public-URL requirement was solved without buying storage, keeping the local-first constraint intact."
  },
  {
    "id": "work/studio-52",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — outcome",
    "text": "It works end to end: a script becomes a branded 30-second video in around eight minutes, including cloned-voice presenter videos built from a single still photo, with the core path consuming zero LLM credits."
  },
  {
    "id": "work/studio-53",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — in hindsight",
    "text": "Checkpoint-everything was the best call in the codebase — it turned a chain of flaky, per-call-billed third-party APIs into a pipeline that can be retried without thinking about it. The next moves are structural rather than clever: renders belong on a queue-fed worker box rather than the app host, and the 9:16 remix flow is the output people ask for most."
  },
  {
    "id": "work/studio-54",
    "source": "work/studio",
    "href": "/work/studio",
    "label": "Mirasphere Studio — measured results",
    "text": "Measured results. Wall-clock for a branded 30-second video: ~8 minutes — self-measured, measured 2026-08-01. Output styles from 4 Remotion compositions: 6 — self-measured, measured 2026-08-01. TypeScript in the pipeline: ~5,300 lines — self-measured, measured 2026-08-01."
  },
  {
    "id": "work/chefs-and-homes-55",
    "source": "work/chefs-and-homes",
    "href": "/work/chefs-and-homes",
    "label": "Chefs and Homes",
    "text": "Chefs and Homes. A Malta retailer with physical shops, taking its first step into selling direct. Role: Consultant on approach and design, then developer alongside the client’s in-house team. Status: live, 2026. Built for RECC, Malta. Stack: Shopify, Liquid."
  },
  {
    "id": "work/chefs-and-homes-56",
    "source": "work/chefs-and-homes",
    "href": "/work/chefs-and-homes",
    "label": "Chefs and Homes — context",
    "text": "RECC is an established Malta retailer with malls and shops across the island. Chefs and Homes is the same business stepping into direct-to-consumer for the first time, starting deliberately small: kitchen and tableware products chosen to introduce the brand to customers who currently only meet it in person."
  },
  {
    "id": "work/chefs-and-homes-57",
    "source": "work/chefs-and-homes",
    "href": "/work/chefs-and-homes",
    "label": "Chefs and Homes — the problem",
    "text": "Give a business that has only ever sold face to face a first online storefront — and leave it in a state its own team can run, extend and load products into without external help."
  },
  {
    "id": "work/chefs-and-homes-58",
    "source": "work/chefs-and-homes",
    "href": "/work/chefs-and-homes",
    "label": "Chefs and Homes — approach",
    "text": "Consultancy before code. The first work was with their development team on the shape of the thing: what the store needed to be, how to structure it, and what to deliberately leave out of a first version. Only then the build, done end to end with their team rather than delivered over the wall to them."
  },
  {
    "id": "work/chefs-and-homes-59",
    "source": "work/chefs-and-homes",
    "href": "/work/chefs-and-homes",
    "label": "Chefs and Homes — outcome",
    "text": "The store is live and the client’s team is loading listings into it themselves, which was the actual point — the handover is the deliverable, not the launch."
  },
  {
    "id": "work/zyvren-60",
    "source": "work/zyvren",
    "href": "/work/zyvren",
    "label": "Zyvren",
    "text": "Zyvren. A US clothing store whose product page was quietly spending its ad budget on bounces. Role: Developer, then performance and technical SEO. Status: live, 2026. Built for Zyvren. Stack: Shopify, Liquid."
  },
  {
    "id": "work/zyvren-61",
    "source": "work/zyvren",
    "href": "/work/zyvren",
    "label": "Zyvren — context",
    "text": "A US-focused clothing and accessories brand, trading internationally with multi-currency pricing and paid traffic as its main acquisition channel."
  },
  {
    "id": "work/zyvren-62",
    "source": "work/zyvren",
    "href": "/work/zyvren",
    "label": "Zyvren — the problem",
    "text": "The store launched and the ads went live, and the bounce rate came back high enough to be an expense rather than a metric. Paid traffic was arriving and leaving, which is the worst combination available: you are paying full price for people who never see the product."
  },
  {
    "id": "work/zyvren-63",
    "source": "work/zyvren",
    "href": "/work/zyvren",
    "label": "Zyvren — approach",
    "text": "Work backwards from the bounce rather than guessing at the funnel. Isolating it by page put the problem on the featured single-product template — the exact page every ad pointed at. Lighthouse put the largest contentful paint on that template somewhere between twelve and sixteen seconds, which is long past the point where a visitor concludes the site is broken. The fix was in the template’s custom Liquid, guided by what Lighthouse said was blocking the render rather than by a general tidy-up."
  },
  {
    "id": "work/zyvren-64",
    "source": "work/zyvren",
    "href": "/work/zyvren",
    "label": "Zyvren — outcome",
    "text": "The product template was rebuilt and the page now renders in a fraction of the time it did. The client is running paid traffic against it and trading normally."
  },
  {
    "id": "work/women-wellness-first-65",
    "source": "work/women-wellness-first",
    "href": "/work/women-wellness-first",
    "label": "Women Wellness First",
    "text": "Women Wellness First. A first storefront for a women’s health brand, rebuilt section by section to a strict spec. Role: Shopify developer — theme architecture and Liquid build, working to the client’s in-house design team. Status: live, 2025. Built for Women Wellness First. Stack: Shopify, Liquid, Free Shopify theme."
  },
  {
    "id": "work/women-wellness-first-66",
    "source": "work/women-wellness-first",
    "href": "/work/women-wellness-first",
    "label": "Women Wellness First — context",
    "text": "A Gurugram-based women’s health brand with an in-house design team, no website, and firm rules about type, spacing and visual identity. This was the first site the business had ever had. The store sells medical products directly, and courses through a third-party LMS the site hands off to."
  },
  {
    "id": "work/women-wellness-first-67",
    "source": "work/women-wellness-first",
    "href": "/work/women-wellness-first",
    "label": "Women Wellness First — the problem",
    "text": "Build a first storefront that matched an exacting design specification, and hand it over in a state where the client’s own team could keep running it — without either of those two goals eating the other."
  },
  {
    "id": "work/women-wellness-first-68",
    "source": "work/women-wellness-first",
    "href": "/work/women-wellness-first",
    "label": "Women Wellness First — approach",
    "text": "A free theme as a plain base, then every section rebuilt in Liquid with its own schema. Several rounds of iteration with their design team on the way, because design fidelity is not something you achieve once and hold — it is what the iterations are for. The schema work is what makes the result survive: each element is exposed as a setting in the theme editor, so the team can change what a section says without being able to change what it looks like."
  },
  {
    "id": "work/women-wellness-first-69",
    "source": "work/women-wellness-first",
    "href": "/work/women-wellness-first",
    "label": "Women Wellness First — outcome",
    "text": "The brand’s first website went live and is edited by the client’s own team from the theme editor."
  },
  {
    "id": "work/allure-dental-70",
    "source": "work/allure-dental",
    "href": "/work/allure-dental",
    "label": "Allure Dental Care",
    "text": "Allure Dental Care. A Barnet dental and facial-aesthetics practice, rebuilt and then made findable. Role: Developer, then the performance, schema and local-search work after launch. Status: live, 2025. Built for Allure Dental Care. Stack: WordPress, Divi, Technical SEO."
  },
  {
    "id": "work/allure-dental-71",
    "source": "work/allure-dental",
    "href": "/work/allure-dental",
    "label": "Allure Dental Care — context",
    "text": "An established dental and facial-aesthetics practice in Barnet, north London, offering general dentistry, orthodontics and implants alongside a growing aesthetics list — anti-wrinkle treatments, fillers, HydraFacial, microneedling. They already had a website."
  },
  {
    "id": "work/allure-dental-72",
    "source": "work/allure-dental",
    "href": "/work/allure-dental",
    "label": "Allure Dental Care — the problem",
    "text": "The site they had was not doing the two jobs a practice website has: convincing someone who lands on it, and being found by someone searching three miles away. Replacing it was only half the work — the other half was the part that has nothing to do with how the site looks."
  },
  {
    "id": "work/allure-dental-73",
    "source": "work/allure-dental",
    "href": "/work/allure-dental",
    "label": "Allure Dental Care — approach",
    "text": "Rebuild first, then everything that makes the rebuild worth having: structured data so search engines can read the treatments as treatments, a Google Business Profile aligned with the site so the local pack and the pages agree with each other, and speed work on the pages that actually receive traffic."
  },
  {
    "id": "work/allure-dental-74",
    "source": "work/allure-dental",
    "href": "/work/allure-dental",
    "label": "Allure Dental Care — outcome",
    "text": "The practice runs on it, adds its own treatment pages, and is set up to be found locally rather than only to be looked at once someone arrives."
  },
  {
    "id": "work/mariforce-75",
    "source": "work/mariforce",
    "href": "/work/mariforce",
    "label": "Mariforce Crewing",
    "text": "Mariforce Crewing. Offshore crew recruitment, where every CV lands in the system the team already works in. Role: Sole developer, end to end — at Mirasphere Digital, for an agency client. Status: live, 2025. Built for Mariforce Crewing. Stack: WordPress, Elementor."
  },
  {
    "id": "work/mariforce-76",
    "source": "work/mariforce",
    "href": "/work/mariforce",
    "label": "Mariforce Crewing — context",
    "text": "Mariforce Crewing recruits for the offshore energy and maritime sector — ROV and trenching crews, cables and pipelines, subsea operations, oil and gas, offshore renewables. The roles run from deck hands and stewards to geotechnical surveyors, ROV operators and party chiefs."
  },
  {
    "id": "work/mariforce-77",
    "source": "work/mariforce",
    "href": "/work/mariforce",
    "label": "Mariforce Crewing — the problem",
    "text": "A recruitment website’s real output is not visits, it is candidates who reach the recruiter in a usable form. A CV arriving as an email attachment is a candidate the team has to re-type into whatever system they actually work in — which is where applications get lost."
  },
  {
    "id": "work/mariforce-78",
    "source": "work/mariforce",
    "href": "/work/mariforce",
    "label": "Mariforce Crewing — approach",
    "text": "Build the site so that submitting a CV puts the candidate directly into the platform the recruitment team already uses, rather than into an inbox. The site is the front door; the applicant tracking system is where the work happens, and the handoff between them is the part worth engineering. It runs in both directions: a CV submitted on the site is created as a candidate in Zoho Recruit for the recruitment team to pick up, and the careers page is driven from Zoho Recruit rather than maintained by hand."
  },
  {
    "id": "work/mariforce-79",
    "source": "work/mariforce",
    "href": "/work/mariforce",
    "label": "Mariforce Crewing — outcome",
    "text": "Candidates reach the team as records they can act on rather than as attachments someone has to process by hand."
  },
  {
    "id": "work/swann-bookkeeping-80",
    "source": "work/swann-bookkeeping",
    "href": "/work/swann-bookkeeping",
    "label": "Swann Bookkeeping — Website",
    "text": "Swann Bookkeeping — Website. A London accountancy firm’s services, made legible to the businesses that need them. Role: Sole developer, end to end — at Mirasphere Digital, for an agency client. Status: live, 2025. Built for Swann Bookkeeping & Accountancy. Stack: WordPress, Elementor, Slider Revolution."
  },
  {
    "id": "work/swann-bookkeeping-81",
    "source": "work/swann-bookkeeping",
    "href": "/work/swann-bookkeeping",
    "label": "Swann Bookkeeping — Website — context",
    "text": "Swann is a London bookkeeping and accountancy firm serving sole traders, limited companies and charities — bookkeeping, self-assessment, payroll, CIS and PAYE, VAT registration, corporation tax and tax planning. They positioned themselves as their clients’ behind-the-scenes finance team, and they already had a site."
  },
  {
    "id": "work/swann-bookkeeping-82",
    "source": "work/swann-bookkeeping",
    "href": "/work/swann-bookkeeping",
    "label": "Swann Bookkeeping — Website — the problem",
    "text": "Accountancy services are hard to tell apart from the outside. A small business owner cannot easily work out which of seven overlapping services they need, and a site that lists them without explaining them loses the enquiry to whoever explains it better."
  },
  {
    "id": "work/swann-bookkeeping-83",
    "source": "work/swann-bookkeeping",
    "href": "/work/swann-bookkeeping",
    "label": "Swann Bookkeeping — Website — approach",
    "text": "Rebuild around the services as the spine of the site: each one given its own explanation rather than a line in a list, a four-step process section so a prospective client can see what working together actually looks like, and testimonials in the path rather than parked on a separate page."
  },
  {
    "id": "work/swann-bookkeeping-84",
    "source": "work/swann-bookkeeping",
    "href": "/work/swann-bookkeeping",
    "label": "Swann Bookkeeping — Website — outcome",
    "text": "The firm’s services are legible to a non-accountant, and the enquiry path from a service page to a booked consultation is one click."
  },
  {
    "id": "work/mirasphere-site-85",
    "source": "work/mirasphere-site",
    "href": "/work/mirasphere-site",
    "label": "Mirasphere Digital — Agency Site",
    "text": "Mirasphere Digital — Agency Site. The agency’s own site — the one where the work has to argue for itself. Role: Developer and technical SEO — the agency’s own site, built in-house. Status: live, 2025. Built for Mirasphere Digital, as the agency’s own site rather than a client project. Stack: WordPress, Elementor, Technical SEO."
  },
  {
    "id": "work/mirasphere-site-86",
    "source": "work/mirasphere-site",
    "href": "/work/mirasphere-site",
    "label": "Mirasphere Digital — Agency Site — context",
    "text": "Mirasphere Digital is the agency I have worked at since July 2025, running social, PPC, SEO, email, web and influencer work out of London and Gurugram. This is their own website."
  },
  {
    "id": "work/mirasphere-site-87",
    "source": "work/mirasphere-site",
    "href": "/work/mirasphere-site",
    "label": "Mirasphere Digital — Agency Site — the problem",
    "text": "An agency site is the one build where the audience is professionally sceptical. It has to demonstrate the services rather than describe them — and an agency selling search cannot afford a site that underperforms on search."
  },
  {
    "id": "work/mirasphere-site-88",
    "source": "work/mirasphere-site",
    "href": "/work/mirasphere-site",
    "label": "Mirasphere Digital — Agency Site — approach",
    "text": "Interaction per service rather than a shared template: each service page carries a before-and-after comparison that shows the difference the work makes, which is a demonstration rather than a claim. Then the technical SEO on the site itself, on the principle that an agency’s own site is the first sample of its work anyone sees."
  },
  {
    "id": "work/mirasphere-site-89",
    "source": "work/mirasphere-site",
    "href": "/work/mirasphere-site",
    "label": "Mirasphere Digital — Agency Site — outcome",
    "text": "It is the agency’s live site, carrying their services, their client roster and their free-audit offer as the conversion path."
  },
  {
    "id": "thinking/bulk-csv-over-streaming-api-90",
    "source": "thinking/bulk-csv-over-streaming-api",
    "href": "/thinking#bulk-csv-over-streaming-api",
    "label": "Why the 2.9GB bulk register and REST verification, and not the Companies House Streaming API?",
    "text": "Why the 2.9GB bulk register and REST verification, and not the Companies House Streaming API? The lead engine has to find UK companies whose accounts are due. Companies House offers a Streaming API — the modern, event-driven, obviously-correct-looking option — and a monthly bulk CSV of the whole register, around five million rows and 2.9GB. Reaching for the streaming API first was the instinct. This decision is about Companies House Lead Engine."
  },
  {
    "id": "thinking/bulk-csv-over-streaming-api-91",
    "source": "thinking/bulk-csv-over-streaming-api",
    "href": "/thinking#bulk-csv-over-streaming-api",
    "label": "Why the 2.9GB bulk register and REST verification, and not the Companies House Streaming API? — what was chosen",
    "text": "Chose: Monthly bulk CSV, with live REST verification before contact. The shape of the question decided it. \"Who is due\" is a scan across every company, not a subscription to changes. The bulk file answers it for free, and the REST API — which does have a per-company profile endpoint — is the right tool for confirming the handful that matter rather than discovering them. This decision is about Companies House Lead Engine."
  },
  {
    "id": "thinking/bulk-csv-over-streaming-api-92",
    "source": "thinking/bulk-csv-over-streaming-api",
    "href": "/thinking#bulk-csv-over-streaming-api",
    "label": "Why the 2.9GB bulk register and REST verification, and not the Companies House Streaming API? — the trade-off",
    "text": "Monthly staleness, which is a real defect and had to be handled rather than accepted: nothing downstream may treat the bulk flag as truth, so every candidate is verified live before anyone contacts it. That is an extra stage, a cache, and a rate limiter that would not exist otherwise."
  },
  {
    "id": "thinking/bulk-csv-over-streaming-api-93",
    "source": "thinking/bulk-csv-over-streaming-api",
    "href": "/thinking#bulk-csv-over-streaming-api",
    "label": "Why the 2.9GB bulk register and REST verification, and not the Companies House Streaming API? — outcome",
    "text": "Whole-register coverage on a fraction of the API budget, with staleness contained at the verification stage where it is visible. Would do it again: yes."
  },
  {
    "id": "thinking/bulk-csv-over-streaming-api-94",
    "source": "thinking/bulk-csv-over-streaming-api",
    "href": "/thinking#bulk-csv-over-streaming-api",
    "label": "Why the 2.9GB bulk register and REST verification, and not the Companies House Streaming API? — option considered: Streaming API",
    "text": "Streaming API. In favour: Real-time, so the data is never stale. Event-driven and cheap to keep running once connected. Against: It answers \"what changed\", and the business question is \"who is due\" — a company sitting quietly with an overdue filing generates no event. Building a full-register picture from a change feed means waiting for the register to describe itself, which could take months."
  },
  {
    "id": "thinking/bulk-csv-over-streaming-api-95",
    "source": "thinking/bulk-csv-over-streaming-api",
    "href": "/thinking#bulk-csv-over-streaming-api",
    "label": "Why the 2.9GB bulk register and REST verification, and not the Companies House Streaming API? — option considered: Monthly bulk CSV, with live REST verification before contact",
    "text": "Monthly bulk CSV, with live REST verification before contact. In favour: Whole-register coverage on day one, with no API calls at all. The expensive API budget gets spent only on the few hundred candidates that survive filtering. Against: The snapshot is up to a month stale, so a \"due\" flag cannot be trusted. Processing 2.9GB and five million rows needs chunked ingest and somewhere to put it."
  },
  {
    "id": "thinking/half-the-rate-ceiling-96",
    "source": "thinking/half-the-rate-ceiling",
    "href": "/thinking#half-the-rate-ceiling",
    "label": "Why run the verifier at half the published rate limit instead of maxing it out?",
    "text": "Why run the verifier at half the published rate limit instead of maxing it out? Companies House publishes a rate limit of 600 requests per five minutes. Verification is the slow stage of the pipeline, so the tempting move is to sit as close to the ceiling as the limiter allows and get runs finished faster. This decision is about Companies House Lead Engine."
  },
  {
    "id": "thinking/half-the-rate-ceiling-97",
    "source": "thinking/half-the-rate-ceiling",
    "href": "/thinking#half-the-rate-ceiling",
    "label": "Why run the verifier at half the published rate limit instead of maxing it out? — what was chosen",
    "text": "Chose: Run at half the ceiling. The asymmetry is not close. Being twice as slow costs minutes; being banned from the register costs the entire product, on a data source with no commercial alternative that is not also a per-lead bill. This decision is about Companies House Lead Engine."
  },
  {
    "id": "thinking/half-the-rate-ceiling-98",
    "source": "thinking/half-the-rate-ceiling",
    "href": "/thinking#half-the-rate-ceiling",
    "label": "Why run the verifier at half the published rate limit instead of maxing it out? — the trade-off",
    "text": "Verification is deliberately the slow stage of the pipeline, and it is the stage users wait on. That is paid for by keeping the free bulk scan fast, so the slow part only ever touches candidates that already passed filtering."
  },
  {
    "id": "thinking/half-the-rate-ceiling-99",
    "source": "thinking/half-the-rate-ceiling",
    "href": "/thinking#half-the-rate-ceiling",
    "label": "Why run the verifier at half the published rate limit instead of maxing it out? — outcome",
    "text": "Zero rate-limit incidents across 22 production scrape jobs, with an eight-step backoff honouring Retry-After for the failures that still happen. Would do it again: yes."
  },
  {
    "id": "thinking/half-the-rate-ceiling-100",
    "source": "thinking/half-the-rate-ceiling",
    "href": "/thinking#half-the-rate-ceiling",
    "label": "Why run the verifier at half the published rate limit instead of maxing it out? — option considered: Run near the published ceiling",
    "text": "Run near the published ceiling. In favour: Verification runs finish materially faster. The published limit is the contract, and staying inside it is technically compliant. Against: No headroom for retries — a burst of 429s or 5xx responses pushes you over exactly when you can least afford it. A ban on a free public API run by a regulator would end the project, and there is no appeal process worth relying on."
  },
  {
    "id": "thinking/half-the-rate-ceiling-101",
    "source": "thinking/half-the-rate-ceiling",
    "href": "/thinking#half-the-rate-ceiling",
    "label": "Why run the verifier at half the published rate limit instead of maxing it out? — option considered: Run at half the ceiling",
    "text": "Run at half the ceiling. In favour: Retries, backoff and any other consumer of the same key all fit in the remaining headroom. The failure mode becomes \"slower than ideal\" rather than \"locked out\". Against: Verification runs take roughly twice as long as they could."
  },
  {
    "id": "thinking/python-over-node-for-bulk-data-102",
    "source": "thinking/python-over-node-for-bulk-data",
    "href": "/thinking#python-over-node-for-bulk-data",
    "label": "Why Python and FastAPI for this, when Node is the main stack?",
    "text": "Why Python and FastAPI for this, when Node is the main stack? Everything else in this portfolio of systems is TypeScript on Node. Introducing a second language means a second toolchain, a second deployment story and a second set of habits to keep sharp — so it needed to earn its place. This decision is about Companies House Lead Engine."
  },
  {
    "id": "thinking/python-over-node-for-bulk-data-103",
    "source": "thinking/python-over-node-for-bulk-data",
    "href": "/thinking#python-over-node-for-bulk-data",
    "label": "Why Python and FastAPI for this, when Node is the main stack? — what was chosen",
    "text": "Chose: Python with pandas and FastAPI. The hard part of this system is a 2.9GB CSV, and pandas is the right tool for a 2.9GB CSV. Choosing the stack to match the portfolio rather than the problem would have meant rebuilding chunked dataframe processing badly, in order to keep a consistency that nobody benefits from. This decision is about Companies House Lead Engine."
  },
  {
    "id": "thinking/python-over-node-for-bulk-data-104",
    "source": "thinking/python-over-node-for-bulk-data",
    "href": "/thinking#python-over-node-for-bulk-data",
    "label": "Why Python and FastAPI for this, when Node is the main stack? — the trade-off",
    "text": "A second language to keep current, and no shared code with the TypeScript systems. The mitigation is that the boundary is clean — Python owns data processing, and the only thing crossing it is JSON over HTTP."
  },
  {
    "id": "thinking/python-over-node-for-bulk-data-105",
    "source": "thinking/python-over-node-for-bulk-data",
    "href": "/thinking#python-over-node-for-bulk-data",
    "label": "Why Python and FastAPI for this, when Node is the main stack? — outcome",
    "text": "25,000-row chunked ingest that a single modest VPS handles comfortably, over the whole register. Would do it again: yes."
  },
  {
    "id": "thinking/python-over-node-for-bulk-data-106",
    "source": "thinking/python-over-node-for-bulk-data",
    "href": "/thinking#python-over-node-for-bulk-data",
    "label": "Why Python and FastAPI for this, when Node is the main stack? — option considered: Node.js and TypeScript",
    "text": "Node.js and TypeScript. In favour: One language across every system I maintain, so no context switch. Shared deployment, tooling and type conventions with the CRM. Against: Chunked processing of a 2.9GB, five-million-row CSV means hand-rolling what pandas already does well. The streaming and dataframe ergonomics are simply worse for this specific job."
  },
  {
    "id": "thinking/python-over-node-for-bulk-data-107",
    "source": "thinking/python-over-node-for-bulk-data",
    "href": "/thinking#python-over-node-for-bulk-data",
    "label": "Why Python and FastAPI for this, when Node is the main stack? — option considered: Python with pandas and FastAPI",
    "text": "Python with pandas and FastAPI. In favour: pandas handles chunked ingest of the full register on a modest VPS without a memory ceiling. FastAPI keeps the dashboard API thin and typed, sitting next to the code doing the real work. Against: A second language, toolchain and deployment path to maintain. No code sharing with the TypeScript systems."
  },
  {
    "id": "thinking/rule-based-over-llm-108",
    "source": "thinking/rule-based-over-llm",
    "href": "/thinking#rule-based-over-llm",
    "label": "Why classify ads with rules, and not an LLM?",
    "text": "Why classify ads with rules, and not an LLM? The ads extractor pulls every live Facebook and Instagram ad for a set of competitors and has to cluster them into hooks, offers and unclaimed angles. Handing each ad to a model for classification is the modern default, and it would have been the shorter path to a first version. This decision is about Competitive Ads Extractor."
  },
  {
    "id": "thinking/rule-based-over-llm-109",
    "source": "thinking/rule-based-over-llm",
    "href": "/thinking#rule-based-over-llm",
    "label": "Why classify ads with rules, and not an LLM? — what was chosen",
    "text": "Chose: Rule-based clustering. 361 ads is regex-and-set-theory territory, not a machine learning problem. Determinism and explainability are worth more than coverage here: the output is a report a client makes spending decisions from, and \"the model said so\" is a worse answer than a rule you can point at. This decision is about Competitive Ads Extractor."
  },
  {
    "id": "thinking/rule-based-over-llm-110",
    "source": "thinking/rule-based-over-llm",
    "href": "/thinking#rule-based-over-llm",
    "label": "Why classify ads with rules, and not an LLM? — the trade-off",
    "text": "The hook taxonomy is hand-maintained, so the tool needs occasional attention as ad language shifts. An optional LLM summary layer sitting on top of the deterministic clusters is the obvious v2 — on top, not instead of."
  },
  {
    "id": "thinking/rule-based-over-llm-111",
    "source": "thinking/rule-based-over-llm",
    "href": "/thinking#rule-based-over-llm",
    "label": "Why classify ads with rules, and not an LLM? — outcome",
    "text": "Zero analysis cost across 23 real runs, explainable clusters, and reports that generate instantly. Would do it again: yes."
  },
  {
    "id": "thinking/rule-based-over-llm-112",
    "source": "thinking/rule-based-over-llm",
    "href": "/thinking#rule-based-over-llm",
    "label": "Why classify ads with rules, and not an LLM? — option considered: LLM classification per ad",
    "text": "LLM classification per ad. In favour: Handles creative phrasing the taxonomy has not seen, without maintenance. Faster to a first working version, and easier to extend to new dimensions. Against: A per-ad cost on a tool built under a zero-budget constraint. Non-deterministic, so the same run can produce different clusters and a client cannot be shown why an ad landed where it did."
  },
  {
    "id": "thinking/rule-based-over-llm-113",
    "source": "thinking/rule-based-over-llm",
    "href": "/thinking#rule-based-over-llm",
    "label": "Why classify ads with rules, and not an LLM? — option considered: Rule-based clustering",
    "text": "Rule-based clustering. In favour: Free, instant and deterministic — the same input always produces the same report. Every cluster is explainable, which is what the person receiving a gap map actually needs. At a few hundred ads per run, near-duplicate folding and set operations are sufficient. Against: The 11-type hook taxonomy and 9-offer matrix are hand-maintained. Genuinely novel phrasing can fall outside the taxonomy until it is added."
  },
  {
    "id": "thinking/filesystem-runs-over-database-114",
    "source": "thinking/filesystem-runs-over-database",
    "href": "/thinking#filesystem-runs-over-database",
    "label": "Why are analysis runs folders on disk, and not rows in a database?",
    "text": "Why are analysis runs folders on disk, and not rows in a database? Each run of the ads extractor produces a dashboard, a Markdown report, a CSV, a JSON export and a PDF. Persisting that in SQLite or Postgres is the reflex, and it would have made cross-run analysis possible. This decision is about Competitive Ads Extractor."
  },
  {
    "id": "thinking/filesystem-runs-over-database-115",
    "source": "thinking/filesystem-runs-over-database",
    "href": "/thinking#filesystem-runs-over-database",
    "label": "Why are analysis runs folders on disk, and not rows in a database? — what was chosen",
    "text": "Chose: Timestamped folders as the datastore. The unit of value is a run, and a run is a deliverable. Making the deliverable the storage format meant there was never an export step, and the tool stayed installable anywhere on a runtime that is already present. This decision is about Competitive Ads Extractor."
  },
  {
    "id": "thinking/filesystem-runs-over-database-116",
    "source": "thinking/filesystem-runs-over-database",
    "href": "/thinking#filesystem-runs-over-database",
    "label": "Why are analysis runs folders on disk, and not rows in a database? — the trade-off",
    "text": "No cross-run queries. Comparing a competitor’s hooks across six months means opening two folders, which is fine at 23 runs and would not be at 500 — that is the point at which SQLite earns its place."
  },
  {
    "id": "thinking/filesystem-runs-over-database-117",
    "source": "thinking/filesystem-runs-over-database",
    "href": "/thinking#filesystem-runs-over-database",
    "label": "Why are analysis runs folders on disk, and not rows in a database? — outcome",
    "text": "A three-dependency tool that installs anywhere and emits client-ready reports with no export step. It stayed that way until the tool was put behind a hosted console — at which point accounts, admin approval and saved run history all needed somewhere to live, and a real database went in. The command-line tool is unchanged; the console is a second artefact with a different constraint. Would do it again: yes."
  },
  {
    "id": "thinking/filesystem-runs-over-database-118",
    "source": "thinking/filesystem-runs-over-database",
    "href": "/thinking#filesystem-runs-over-database",
    "label": "Why are analysis runs folders on disk, and not rows in a database? — option considered: SQLite or PostgreSQL",
    "text": "SQLite or PostgreSQL. In favour: Cross-run queries: how a competitor’s hooks changed over six months. Deduplication and history come free. Against: A dependency and a migration story on a tool whose selling point is that it installs anywhere with three packages. Producing a client deliverable becomes an export step rather than the natural output."
  },
  {
    "id": "thinking/filesystem-runs-over-database-119",
    "source": "thinking/filesystem-runs-over-database",
    "href": "/thinking#filesystem-runs-over-database",
    "label": "Why are analysis runs folders on disk, and not rows in a database? — option considered: Timestamped folders as the datastore",
    "text": "Timestamped folders as the datastore. In favour: Each run is a self-contained folder that can be handed to a client as-is. No database, no migrations, no export step — three dependencies total. Against: No cross-run queries, so trends over time have to be assembled by hand. Disk organisation is the only index."
  },
  {
    "id": "thinking/real-stt-timestamps-120",
    "source": "thinking/real-stt-timestamps",
    "href": "/thinking#real-stt-timestamps",
    "label": "Why transcribe generated narration for timing, instead of estimating word positions?",
    "text": "Why transcribe generated narration for timing, instead of estimating word positions? Studio drives a Remotion timeline from a script: captions have to appear on the word, and scene changes have to land on the beat. Word positions can be estimated from a words-per-minute figure for free, or measured by running the synthesised narration back through speech-to-text for the price of one more API call. This decision is about Mirasphere Studio."
  },
  {
    "id": "thinking/real-stt-timestamps-121",
    "source": "thinking/real-stt-timestamps",
    "href": "/thinking#real-stt-timestamps",
    "label": "Why transcribe generated narration for timing, instead of estimating word positions? — what was chosen",
    "text": "Chose: Transcribe the generated audio with Scribe for word-level timestamps. Timing is the difference between a video that looks produced and one that looks automated, and it is the first thing a viewer notices. Guessing at it to save one API call on a pipeline that already pays for text-to-speech, image-to-video and lip-sync is a false economy. This decision is about Mirasphere Studio."
  },
  {
    "id": "thinking/real-stt-timestamps-122",
    "source": "thinking/real-stt-timestamps",
    "href": "/thinking#real-stt-timestamps",
    "label": "Why transcribe generated narration for timing, instead of estimating word positions? — the trade-off",
    "text": "One additional paid call per video — mitigated by the fact that it checkpoints like every other paid step, so it is paid once even across retries."
  },
  {
    "id": "thinking/real-stt-timestamps-123",
    "source": "thinking/real-stt-timestamps",
    "href": "/thinking#real-stt-timestamps",
    "label": "Why transcribe generated narration for timing, instead of estimating word positions? — outcome",
    "text": "Karaoke-precise captions and scene cuts, driven from the audio that actually ships. Would do it again: yes."
  },
  {
    "id": "thinking/real-stt-timestamps-124",
    "source": "thinking/real-stt-timestamps",
    "href": "/thinking#real-stt-timestamps",
    "label": "Why transcribe generated narration for timing, instead of estimating word positions? — option considered: Estimate from words per minute",
    "text": "Estimate from words per minute. In favour: Free, instant, and no extra dependency in the chain. Close enough for a rough cut. Against: Error accumulates across a 30-second narration, so the drift is worst at the end. Captions that miss by 300 milliseconds do not read as slightly off, they read as broken."
  },
  {
    "id": "thinking/real-stt-timestamps-125",
    "source": "thinking/real-stt-timestamps",
    "href": "/thinking#real-stt-timestamps",
    "label": "Why transcribe generated narration for timing, instead of estimating word positions? — option considered: Transcribe the generated audio with Scribe for word-level timestamps",
    "text": "Transcribe the generated audio with Scribe for word-level timestamps. In favour: Exact word start times, taken from the audio that will actually ship. Scene cuts and captions can both be driven from one source of truth. Against: One more paid API call per video. Another third-party step that can be slow or fail."
  },
  {
    "id": "thinking/checkpoint-every-paid-step-126",
    "source": "thinking/checkpoint-every-paid-step",
    "href": "/thinking#checkpoint-every-paid-step",
    "label": "Why checkpoint every paid step, rather than retrying a failed job from the start?",
    "text": "Why checkpoint every paid step, rather than retrying a failed job from the start? One Studio render chains text-to-speech, speech-to-text, image-to-video and lip-sync, each billed per call, and the presenter step alone polls a third-party render for roughly an hour. Restart-on-failure is the simpler design, and for a cheap, fast job it would be the right one. This decision is about Mirasphere Studio."
  },
  {
    "id": "thinking/checkpoint-every-paid-step-127",
    "source": "thinking/checkpoint-every-paid-step",
    "href": "/thinking#checkpoint-every-paid-step",
    "label": "Why checkpoint every paid step, rather than retrying a failed job from the start? — what was chosen",
    "text": "Chose: Checkpoint each completed step. When every step in a chain bills per call and one of them takes an hour, retry semantics are the architecture. The design assumption was that the vendors will be slow and occasionally fail, and the job of the pipeline is to make that cost nothing. This decision is about Mirasphere Studio."
  },
  {
    "id": "thinking/checkpoint-every-paid-step-128",
    "source": "thinking/checkpoint-every-paid-step",
    "href": "/thinking#checkpoint-every-paid-step",
    "label": "Why checkpoint every paid step, rather than retrying a failed job from the start? — the trade-off",
    "text": "Noticeably more state to manage, and a job table that is now the reliability story of the whole product rather than a queue."
  },
  {
    "id": "thinking/checkpoint-every-paid-step-129",
    "source": "thinking/checkpoint-every-paid-step",
    "href": "/thinking#checkpoint-every-paid-step",
    "label": "Why checkpoint every paid step, rather than retrying a failed job from the start? — outcome",
    "text": "Retries resume from the last completed step, so failures cost time and never money — which is what made the pipeline usable rather than merely working. Would do it again: yes."
  },
  {
    "id": "thinking/checkpoint-every-paid-step-130",
    "source": "thinking/checkpoint-every-paid-step",
    "href": "/thinking#checkpoint-every-paid-step",
    "label": "Why checkpoint every paid step, rather than retrying a failed job from the start? — option considered: Retry the whole job on failure",
    "text": "Retry the whole job on failure. In favour: Far less state to manage — a job is either done or not. No partial-result correctness questions. Against: One flake anywhere in the chain re-bills every step that had already succeeded. With an hour-long presenter render in the middle, a late failure costs the whole hour again."
  },
  {
    "id": "thinking/checkpoint-every-paid-step-131",
    "source": "thinking/checkpoint-every-paid-step",
    "href": "/thinking#checkpoint-every-paid-step",
    "label": "Why checkpoint every paid step, rather than retrying a failed job from the start? — option considered: Checkpoint each completed step",
    "text": "Checkpoint each completed step. In favour: A retry resumes from the last completed step, so a failure costs nothing extra. Slow, flaky third-party APIs stop being a reliability problem and become a latency problem. Against: More state management, and every intermediate artefact needs a defined shape and a place to live. Checkpoints can go stale if an earlier input changes, which has to be reasoned about."
  },
  {
    "id": "thinking/typed-data-vs-mdx-132",
    "source": "thinking/typed-data-vs-mdx",
    "href": "/thinking#typed-data-vs-mdx",
    "label": "Why typed data files for this portfolio, and not MDX frontmatter?",
    "text": "Why typed data files for this portfolio, and not MDX frontmatter? Every project on this site carries around twenty fields, several of them nested arrays — a stack with a required rationale per item, ten case-study sections, architecture nodes with failure modes. That content had to be authored somewhere, and the obvious default was MDX with YAML frontmatter."
  },
  {
    "id": "thinking/typed-data-vs-mdx-133",
    "source": "thinking/typed-data-vs-mdx",
    "href": "/thinking#typed-data-vs-mdx",
    "label": "Why typed data files for this portfolio, and not MDX frontmatter? — what was chosen",
    "text": "Chose: Typed TypeScript modules validated with Zod. The most important requirement for this content was that invented metrics and unfilled placeholders could not reach production. That is a validation problem, and validation wants a type system. Zod refinements enforce rules — one of `client` or `clientDescriptor`, a capture date on every metric, a real reason on every technology — that YAML would let through silently."
  },
  {
    "id": "thinking/typed-data-vs-mdx-134",
    "source": "thinking/typed-data-vs-mdx",
    "href": "/thinking#typed-data-vs-mdx",
    "label": "Why typed data files for this portfolio, and not MDX frontmatter? — the trade-off",
    "text": "The site now has no CMS, and content changes require a commit and a deploy. For a single-author portfolio that is a fair exchange; for a team or a client site it would be the wrong call, and I would reach for a hosted CMS with the same schema enforced at the edge."
  },
  {
    "id": "thinking/typed-data-vs-mdx-135",
    "source": "thinking/typed-data-vs-mdx",
    "href": "/thinking#typed-data-vs-mdx",
    "label": "Why typed data files for this portfolio, and not MDX frontmatter? — outcome",
    "text": "Long-form prose can still migrate to MDX bodies without changing this shape, because the schema describes structure rather than storage. Would do it again: yes."
  },
  {
    "id": "thinking/typed-data-vs-mdx-136",
    "source": "thinking/typed-data-vs-mdx",
    "href": "/thinking#typed-data-vs-mdx",
    "label": "Why typed data files for this portfolio, and not MDX frontmatter? — option considered: MDX with YAML frontmatter",
    "text": "MDX with YAML frontmatter. In favour: Prose and metadata live in one file. Conventional, and easy to move to a hosted CMS later. Against: YAML has no types, so a mistyped field fails at render rather than in the editor. Deeply nested arrays in YAML are error-prone to hand-author. No autocomplete for twenty field names."
  },
  {
    "id": "thinking/typed-data-vs-mdx-137",
    "source": "thinking/typed-data-vs-mdx",
    "href": "/thinking#typed-data-vs-mdx",
    "label": "Why typed data files for this portfolio, and not MDX frontmatter? — option considered: Typed TypeScript modules validated with Zod",
    "text": "Typed TypeScript modules validated with Zod. In favour: Editor autocomplete for every field, and compile-time errors on typos. Zod refinements can encode rules YAML cannot — such as requiring exactly one of `client` or `clientDescriptor`. The honesty rules become build failures instead of good intentions. Against: Content is coupled to the codebase, so a non-technical editor cannot update it. Long prose in template literals is less pleasant to write than Markdown."
  },
  {
    "id": "thinking/dropping-gsap-138",
    "source": "thinking/dropping-gsap",
    "href": "/thinking#dropping-gsap",
    "label": "Why does this site not use GSAP, when the plan specified it?",
    "text": "Why does this site not use GSAP, when the plan specified it? The build plan for this portfolio named GSAP with ScrollTrigger as the animation layer, and it was installed and wired up first. Then the performance budget gate was written, and it failed: first-load JavaScript came to 220 KB gzipped. Attributing that weight chunk by chunk showed GSAP core plus ScrollTrigger accounted for 43.5 KB gzipped — and, because the reveal logic lived in the root layout, it was being shipped on every single route."
  },
  {
    "id": "thinking/dropping-gsap-139",
    "source": "thinking/dropping-gsap",
    "href": "/thinking#dropping-gsap",
    "label": "Why does this site not use GSAP, when the plan specified it? — what was chosen",
    "text": "Chose: IntersectionObserver plus CSS keyframes. Everything V1 actually animates is a fade-up on scroll, a hero entrance and a breathing SVG. All three are CSS keyframes triggered by an observer. Paying 43.5 KB on every route for a timeline API that nothing was using is not a trade-off, it is an oversight — and the project rule was already written down: if an effect costs performance, remove the effect. The corollary is that if a library is not earning its bytes, remove the library."
  },
  {
    "id": "thinking/dropping-gsap-140",
    "source": "thinking/dropping-gsap",
    "href": "/thinking#dropping-gsap",
    "label": "Why does this site not use GSAP, when the plan specified it? — the trade-off",
    "text": "There is now no timeline sequencing available. The moment the V2 work needs the pinned Work transition or an animated architecture diagram, GSAP earns its place again — and it will come back as a dynamic import scoped to those components, never in the root layout. Hand-rolled staggering and a small magnetic-hover helper are also now this codebase’s to maintain rather than a vendor’s."
  },
  {
    "id": "thinking/dropping-gsap-141",
    "source": "thinking/dropping-gsap",
    "href": "/thinking#dropping-gsap",
    "label": "Why does this site not use GSAP, when the plan specified it? — outcome",
    "text": "First-load JavaScript went from 220 KB to 186 KB gzipped. More usefully, once the framework floor is subtracted — a bare Next 16.3 and React 19 route with zero client components measures 182 KB on its own — the code this project actually wrote is 4.2 KB on the heaviest route. Six of the eight routes ship no page-specific client JavaScript at all. The budget gate itself was rewritten to measure that delta rather than an absolute number, because an absolute budget dominated by a framework constant fails on day one and then gets ignored. Would do it again: yes."
  },
  {
    "id": "thinking/dropping-gsap-142",
    "source": "thinking/dropping-gsap",
    "href": "/thinking#dropping-gsap",
    "label": "Why does this site not use GSAP, when the plan specified it? — option considered: Keep GSAP, raise the budget",
    "text": "Keep GSAP, raise the budget. In favour: No rework, and the timeline API is genuinely excellent. Already integrated and working. Against: A budget that moves whenever it is inconvenient is not a budget. 43.5 KB on every route to do fade-up-on-scroll is a bad exchange. A portfolio arguing for performance while paying that is arguing against itself."
  },
  {
    "id": "thinking/dropping-gsap-143",
    "source": "thinking/dropping-gsap",
    "href": "/thinking#dropping-gsap",
    "label": "Why does this site not use GSAP, when the plan specified it? — option considered: Keep GSAP, but load it lazily",
    "text": "Keep GSAP, but load it lazily. In favour: Off the critical path, and the API stays available. Smaller change than removing it. Against: Still downloads for nearly every visitor, just slightly later. Reveal animations are the first thing a visitor scrolls into, so deferring them either delays the effect or causes a visible jump."
  },
  {
    "id": "thinking/dropping-gsap-144",
    "source": "thinking/dropping-gsap",
    "href": "/thinking#dropping-gsap",
    "label": "Why does this site not use GSAP, when the plan specified it? — option considered: IntersectionObserver plus CSS keyframes",
    "text": "IntersectionObserver plus CSS keyframes. In favour: Roughly 1 KB instead of 43.5 KB, for a visually identical result. Animations become CSS, so they honour prefers-reduced-motion natively. The hero and the flow diagram become server components, since they no longer need a JS runtime at all. Against: No timeline sequencing, so complex choreography would be painful. Hand-rolled staggering, which is a small amount of code to own."
  },
  {
    "id": "failures/leadhouse-stale-register-145",
    "source": "failures/leadhouse-stale-register",
    "href": "/thinking#leadhouse-stale-register",
    "label": "Half the leads were not leads — what happened",
    "text": "The bulk register flagged a cohort of companies as having accounts due. Verifying them live against the Companies House REST API showed that roughly half were not overdue at all. Every one of those would have been a call to a company that had already filed — wasted outreach, and worse, an immediate credibility problem, because the entire pitch is knowing something specific and correct about the company being contacted."
  },
  {
    "id": "failures/leadhouse-stale-register-146",
    "source": "failures/leadhouse-stale-register",
    "href": "/thinking#leadhouse-stale-register",
    "label": "Half the leads were not leads — cause",
    "text": "The bulk company register is a monthly snapshot. A company that filed the day after the snapshot was taken still reads as due for up to a month, and the file gives no indication that it is out of date."
  },
  {
    "id": "failures/leadhouse-stale-register-147",
    "source": "failures/leadhouse-stale-register",
    "href": "/thinking#leadhouse-stale-register",
    "label": "Half the leads were not leads — the fix",
    "text": "Made live verification a mandatory stage rather than an optional one. Nothing downstream may treat the bulk flag as truth — the bulk file now produces candidates only, and a live REST profile check decides, with verdicts cached for 30 days so the API budget is spent on companies nobody has looked at yet."
  },
  {
    "id": "failures/leadhouse-stale-register-148",
    "source": "failures/leadhouse-stale-register",
    "href": "/thinking#leadhouse-stale-register",
    "label": "Half the leads were not leads — what it taught",
    "text": "A cheap data source is allowed to be wrong as long as the system never forgets that it might be. Bulk data generates hypotheses; the authoritative source confirms them. The mistake would have been trusting a field because it was convenient to trust."
  },
  {
    "id": "failures/leadhouse-jobs-dying-mid-batch-149",
    "source": "failures/leadhouse-jobs-dying-mid-batch",
    "href": "/thinking#leadhouse-jobs-dying-mid-batch",
    "label": "The scan that had to start again — what happened",
    "text": "Long scrape jobs died mid-batch whenever the process restarted — a deploy, a crash, a reboot — and lost their position entirely, along with any job rows left marked as running. Hours of scanning discarded, and a queue containing orphaned jobs that would never complete and never fail. Since verification runs deliberately at half the published rate ceiling, redoing work is not just slow, it is spending a limited API budget twice."
  },
  {
    "id": "failures/leadhouse-jobs-dying-mid-batch-150",
    "source": "failures/leadhouse-jobs-dying-mid-batch",
    "href": "/thinking#leadhouse-jobs-dying-mid-batch",
    "label": "The scan that had to start again — cause",
    "text": "Progress lived in the running process rather than in the database. A batch was an in-memory loop, so nothing outside that process knew how far it had got, and nothing on startup knew that a job claiming to be running no longer had anything running it."
  },
  {
    "id": "failures/leadhouse-jobs-dying-mid-batch-151",
    "source": "failures/leadhouse-jobs-dying-mid-batch",
    "href": "/thinking#leadhouse-jobs-dying-mid-batch",
    "label": "The scan that had to start again — the fix",
    "text": "Moved progress into Postgres: slice-and-continue batches with an auto-advancing cursor, so a killed job resumes from its last committed position instead of restarting, plus an orphan-job sweep on boot that reclaims anything the previous process left mid-flight."
  },
  {
    "id": "failures/leadhouse-jobs-dying-mid-batch-152",
    "source": "failures/leadhouse-jobs-dying-mid-batch",
    "href": "/thinking#leadhouse-jobs-dying-mid-batch",
    "label": "The scan that had to start again — what it taught",
    "text": "If a job takes longer than a deploy cycle, its progress belongs in the database, not in the process. And a queue needs to be able to tell the difference between \"running\" and \"was running when something died\" — otherwise the state is a lie the moment the process is."
  },
  {
    "id": "failures/virtuoso-post-event-bugs-153",
    "source": "failures/virtuoso-post-event-bugs",
    "href": "/thinking#virtuoso-post-event-bugs",
    "label": "The dashboards that only broke at events — what happened",
    "text": "The artist, asset and event-management dashboards behaved correctly in development and then produced a steady stream of defects during live event trials — more than ten of them reaching production. Failures landed during the trials the platform existed for, in front of the people running them, on the flows that mattered most: asset creation, purchase and profile management."
  },
  {
    "id": "failures/virtuoso-post-event-bugs-154",
    "source": "failures/virtuoso-post-event-bugs",
    "href": "/thinking#virtuoso-post-event-bugs",
    "label": "The dashboards that only broke at events — cause",
    "text": "Not one root cause. What every one of them shared is that none of them appeared before the event — the dashboards had been exercised in development, but not under a live trial, and the defects lived in the gap between those two conditions."
  },
  {
    "id": "failures/virtuoso-post-event-bugs-155",
    "source": "failures/virtuoso-post-event-bugs",
    "href": "/thinking#virtuoso-post-event-bugs",
    "label": "The dashboards that only broke at events — the fix",
    "text": "Fixed them as they came in — more than ten defects resolved across four sprint cycles, in the dashboards and the endpoints behind them."
  },
  {
    "id": "failures/virtuoso-post-event-bugs-156",
    "source": "failures/virtuoso-post-event-bugs",
    "href": "/thinking#virtuoso-post-event-bugs",
    "label": "The dashboards that only broke at events — what it taught",
    "text": "A feature that has only been exercised against seeded data is untested, not tested. Since then the default is to get real conditions in front of the code as early as it will survive them — which is why the CRM went live with real client data in week one rather than after a staging phase."
  }
]

/** The corpus. Index first, so ids stay stable as case studies are added. */
export const ASK_CHUNKS: AskChunk[] = [...INDEXED, ...ASK_SUPPLEMENT]

/* Topics the site itself declines to answer, derived from the unfilled
   `[TO CONFIRM]` placeholders in site.config's logistics block — the same
   placeholders `npm run check:content` reports. A withheld topic fires only
   when a query names EVERY word of the field, because one word of overlap is
   far too blunt: "roles" alone must not refuse a question about his role at
   Virtuoso, which the corpus answers perfectly well. */
export const ASK_WITHHELD: { topic: string; terms: string[]; reason: string }[] = [
  {
    "topic": "rates",
    "terms": [
      "charge"
    ],
    "reason": "Rates are not published here — they depend on scope, and a number quoted without knowing yours would be a guess. Tell Dheeraj what you need and you will get a real one."
  },
  {
    "topic": "rates",
    "terms": [
      "rate"
    ],
    "reason": "Rates are not published here — they depend on scope, and a number quoted without knowing yours would be a guess. Tell Dheeraj what you need and you will get a real one."
  },
  {
    "topic": "rates",
    "terms": [
      "rates"
    ],
    "reason": "Rates are not published here — they depend on scope, and a number quoted without knowing yours would be a guess. Tell Dheeraj what you need and you will get a real one."
  },
  {
    "topic": "rates",
    "terms": [
      "price"
    ],
    "reason": "Rates are not published here — they depend on scope, and a number quoted without knowing yours would be a guess. Tell Dheeraj what you need and you will get a real one."
  },
  {
    "topic": "rates",
    "terms": [
      "pricing"
    ],
    "reason": "Rates are not published here — they depend on scope, and a number quoted without knowing yours would be a guess. Tell Dheeraj what you need and you will get a real one."
  },
  {
    "topic": "rates",
    "terms": [
      "cost"
    ],
    "reason": "Rates are not published here — they depend on scope, and a number quoted without knowing yours would be a guess. Tell Dheeraj what you need and you will get a real one."
  },
  {
    "topic": "rates",
    "terms": [
      "quote"
    ],
    "reason": "Rates are not published here — they depend on scope, and a number quoted without knowing yours would be a guess. Tell Dheeraj what you need and you will get a real one."
  },
  {
    "topic": "rates",
    "terms": [
      "hourly"
    ],
    "reason": "Rates are not published here — they depend on scope, and a number quoted without knowing yours would be a guess. Tell Dheeraj what you need and you will get a real one."
  },
  {
    "topic": "rates",
    "terms": [
      "budget"
    ],
    "reason": "Rates are not published here — they depend on scope, and a number quoted without knowing yours would be a guess. Tell Dheeraj what you need and you will get a real one."
  },
  {
    "topic": "leading a team",
    "terms": [
      "led",
      "team"
    ],
    "reason": "Nothing on this site describes leading a team. The projects here are sole-developer work, built end to end, and several were delivered alongside a client’s own developers and designers — which is collaboration rather than management. If team leadership is what you need, ask him directly rather than reading it into this."
  },
  {
    "topic": "leading a team",
    "terms": [
      "lead",
      "team"
    ],
    "reason": "Nothing on this site describes leading a team. The projects here are sole-developer work, built end to end, and several were delivered alongside a client’s own developers and designers — which is collaboration rather than management. If team leadership is what you need, ask him directly rather than reading it into this."
  },
  {
    "topic": "leading a team",
    "terms": [
      "leading",
      "team"
    ],
    "reason": "Nothing on this site describes leading a team. The projects here are sole-developer work, built end to end, and several were delivered alongside a client’s own developers and designers — which is collaboration rather than management. If team leadership is what you need, ask him directly rather than reading it into this."
  },
  {
    "topic": "leading a team",
    "terms": [
      "manage",
      "team"
    ],
    "reason": "Nothing on this site describes leading a team. The projects here are sole-developer work, built end to end, and several were delivered alongside a client’s own developers and designers — which is collaboration rather than management. If team leadership is what you need, ask him directly rather than reading it into this."
  },
  {
    "topic": "leading a team",
    "terms": [
      "managed",
      "team"
    ],
    "reason": "Nothing on this site describes leading a team. The projects here are sole-developer work, built end to end, and several were delivered alongside a client’s own developers and designers — which is collaboration rather than management. If team leadership is what you need, ask him directly rather than reading it into this."
  },
  {
    "topic": "leading a team",
    "terms": [
      "team",
      "size"
    ],
    "reason": "Nothing on this site describes leading a team. The projects here are sole-developer work, built end to end, and several were delivered alongside a client’s own developers and designers — which is collaboration rather than management. If team leadership is what you need, ask him directly rather than reading it into this."
  },
  {
    "topic": "work preference",
    "terms": [
      "work",
      "preference"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "work preference",
    "terms": [
      "remote",
      "hybrid"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "relocation",
    "terms": [
      "relocate"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "relocation",
    "terms": [
      "relocation"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "visa / work authorisation",
    "terms": [
      "visa"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "visa / work authorisation",
    "terms": [
      "authorisation"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "visa / work authorisation",
    "terms": [
      "authorization"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "visa / work authorisation",
    "terms": [
      "sponsorship"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "notice period",
    "terms": [
      "notice",
      "period"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "notice period",
    "terms": [
      "notice"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "salary expectations",
    "terms": [
      "salary"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "salary expectations",
    "terms": [
      "ctc"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "preferred roles",
    "terms": [
      "role",
      "looking"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  },
  {
    "topic": "preferred roles",
    "terms": [
      "roles",
      "open"
    ],
    "reason": "That is discussed directly rather than published here. Email okkdheeraj@gmail.com and Dheeraj will tell you himself."
  }
]

/** Measured at build time, for the interface to cite honestly. */
export const ASK_STATS = {
  /** Chunks taken from the embedded index. */
  indexed: 25,
  /** Chunks in the embedded index that this system will not quote. */
  superseded: 8,
  /** Chunks cut from the site's current content. */
  supplement: 156,
  /** The corpus. This is the number the interface is allowed to state. */
  chunks: 181,
  supplementChars: 48524,
} as const
