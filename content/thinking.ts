import type { Decision, Incident, Principle } from '@/lib/schema'

/* ==========================================================================
   /thinking — THE DIFFERENTIATOR

   Almost every developer portfolio has projects, skills and a contact form.
   Almost none has a decision log or a failure archive. These two sections
   are worth more than every animation on the site combined, because they
   are the only content a senior engineer cannot fake.

   Everything below is mined out of the case studies in content/projects.ts,
   plus two decisions about this site itself.

   The CRM (SATCHEL) has no entries here, deliberately: it is a private client
   system, and its engineering detail is covered on a call rather than
   published. See the note on the CRM entry in content/projects.ts.

   Nothing here is written to fill a slot — where a real incident has no measured
   before-and-after, the `result` field is absent rather than estimated.

   Tone (spec §18): confident and honest. Not self-deprecating.
   ========================================================================== */

export const decisions: Decision[] = [
  /* ---- Companies House Lead Engine ------------------------------------- */
  {
    id: 'bulk-csv-over-streaming-api',
    question:
      'Why the 2.9GB bulk register and REST verification, and not the Companies House Streaming API?',
    context:
      'The lead engine has to find UK companies whose accounts are due. Companies House offers a Streaming API — the modern, event-driven, obviously-correct-looking option — and a monthly bulk CSV of the whole register, around five million rows and 2.9GB. Reaching for the streaming API first was the instinct.',
    options: [
      {
        name: 'Streaming API',
        pros: [
          'Real-time, so the data is never stale',
          'Event-driven and cheap to keep running once connected',
        ],
        cons: [
          'It answers "what changed", and the business question is "who is due" — a company sitting quietly with an overdue filing generates no event',
          'Building a full-register picture from a change feed means waiting for the register to describe itself, which could take months',
        ],
      },
      {
        name: 'Monthly bulk CSV, with live REST verification before contact',
        pros: [
          'Whole-register coverage on day one, with no API calls at all',
          'The expensive API budget gets spent only on the few hundred candidates that survive filtering',
        ],
        cons: [
          'The snapshot is up to a month stale, so a "due" flag cannot be trusted',
          'Processing 2.9GB and five million rows needs chunked ingest and somewhere to put it',
        ],
      },
    ],
    chose: 'Monthly bulk CSV, with live REST verification before contact',
    because:
      'The shape of the question decided it. "Who is due" is a scan across every company, not a subscription to changes. The bulk file answers it for free, and the REST API — which does have a per-company profile endpoint — is the right tool for confirming the handful that matter rather than discovering them.',
    tradeoff:
      'Monthly staleness, which is a real defect and had to be handled rather than accepted: nothing downstream may treat the bulk flag as truth, so every candidate is verified live before anyone contacts it. That is an extra stage, a cache, and a rate limiter that would not exist otherwise.',
    outcome:
      'Whole-register coverage on a fraction of the API budget, with staleness contained at the verification stage where it is visible.',
    wouldRepeat: 'yes',
    projects: ['leadhouse'],
  },

  {
    id: 'half-the-rate-ceiling',
    question: 'Why run the verifier at half the published rate limit instead of maxing it out?',
    context:
      'Companies House publishes a rate limit of 600 requests per five minutes. Verification is the slow stage of the pipeline, so the tempting move is to sit as close to the ceiling as the limiter allows and get runs finished faster.',
    options: [
      {
        name: 'Run near the published ceiling',
        pros: [
          'Verification runs finish materially faster',
          'The published limit is the contract, and staying inside it is technically compliant',
        ],
        cons: [
          'No headroom for retries — a burst of 429s or 5xx responses pushes you over exactly when you can least afford it',
          'A ban on a free public API run by a regulator would end the project, and there is no appeal process worth relying on',
        ],
      },
      {
        name: 'Run at half the ceiling',
        pros: [
          'Retries, backoff and any other consumer of the same key all fit in the remaining headroom',
          'The failure mode becomes "slower than ideal" rather than "locked out"',
        ],
        cons: ['Verification runs take roughly twice as long as they could'],
      },
    ],
    chose: 'Run at half the ceiling',
    because:
      'The asymmetry is not close. Being twice as slow costs minutes; being banned from the register costs the entire product, on a data source with no commercial alternative that is not also a per-lead bill.',
    tradeoff:
      'Verification is deliberately the slow stage of the pipeline, and it is the stage users wait on. That is paid for by keeping the free bulk scan fast, so the slow part only ever touches candidates that already passed filtering.',
    outcome:
      'Zero rate-limit incidents across 22 production scrape jobs, with an eight-step backoff honouring Retry-After for the failures that still happen.',
    wouldRepeat: 'yes',
    projects: ['leadhouse'],
  },

  {
    id: 'python-over-node-for-bulk-data',
    question: 'Why Python and FastAPI for this, when Node is the main stack?',
    context:
      'Everything else in this portfolio of systems is TypeScript on Node. Introducing a second language means a second toolchain, a second deployment story and a second set of habits to keep sharp — so it needed to earn its place.',
    options: [
      {
        name: 'Node.js and TypeScript',
        pros: [
          'One language across every system I maintain, so no context switch',
          'Shared deployment, tooling and type conventions with the CRM',
        ],
        cons: [
          'Chunked processing of a 2.9GB, five-million-row CSV means hand-rolling what pandas already does well',
          'The streaming and dataframe ergonomics are simply worse for this specific job',
        ],
      },
      {
        name: 'Python with pandas and FastAPI',
        pros: [
          'pandas handles chunked ingest of the full register on a modest VPS without a memory ceiling',
          'FastAPI keeps the dashboard API thin and typed, sitting next to the code doing the real work',
        ],
        cons: [
          'A second language, toolchain and deployment path to maintain',
          'No code sharing with the TypeScript systems',
        ],
      },
    ],
    chose: 'Python with pandas and FastAPI',
    because:
      'The hard part of this system is a 2.9GB CSV, and pandas is the right tool for a 2.9GB CSV. Choosing the stack to match the portfolio rather than the problem would have meant rebuilding chunked dataframe processing badly, in order to keep a consistency that nobody benefits from.',
    tradeoff:
      'A second language to keep current, and no shared code with the TypeScript systems. The mitigation is that the boundary is clean — Python owns data processing, and the only thing crossing it is JSON over HTTP.',
    outcome:
      '25,000-row chunked ingest that a single modest VPS handles comfortably, over the whole register.',
    wouldRepeat: 'yes',
    projects: ['leadhouse'],
  },

  /* ---- Competitive Ads Extractor ---------------------------------------- */
  {
    id: 'rule-based-over-llm',
    question: 'Why classify ads with rules, and not an LLM?',
    context:
      'The ads extractor pulls every live Facebook and Instagram ad for a set of competitors and has to cluster them into hooks, offers and unclaimed angles. Handing each ad to a model for classification is the modern default, and it would have been the shorter path to a first version.',
    options: [
      {
        name: 'LLM classification per ad',
        pros: [
          'Handles creative phrasing the taxonomy has not seen, without maintenance',
          'Faster to a first working version, and easier to extend to new dimensions',
        ],
        cons: [
          'A per-ad cost on a tool built under a zero-budget constraint',
          'Non-deterministic, so the same run can produce different clusters and a client cannot be shown why an ad landed where it did',
        ],
      },
      {
        name: 'Rule-based clustering',
        pros: [
          'Free, instant and deterministic — the same input always produces the same report',
          'Every cluster is explainable, which is what the person receiving a gap map actually needs',
          'At a few hundred ads per run, near-duplicate folding and set operations are sufficient',
        ],
        cons: [
          'The 11-type hook taxonomy and 9-offer matrix are hand-maintained',
          'Genuinely novel phrasing can fall outside the taxonomy until it is added',
        ],
      },
    ],
    chose: 'Rule-based clustering',
    because:
      '361 ads is regex-and-set-theory territory, not a machine learning problem. Determinism and explainability are worth more than coverage here: the output is a report a client makes spending decisions from, and "the model said so" is a worse answer than a rule you can point at.',
    tradeoff:
      'The hook taxonomy is hand-maintained, so the tool needs occasional attention as ad language shifts. An optional LLM summary layer sitting on top of the deterministic clusters is the obvious v2 — on top, not instead of.',
    outcome:
      'Zero analysis cost across 23 real runs, explainable clusters, and reports that generate instantly.',
    wouldRepeat: 'yes',
    projects: ['ads-analyser'],
  },

  {
    id: 'filesystem-runs-over-database',
    question: 'Why are analysis runs folders on disk, and not rows in a database?',
    context:
      'Each run of the ads extractor produces a dashboard, a Markdown report, a CSV, a JSON export and a PDF. Persisting that in SQLite or Postgres is the reflex, and it would have made cross-run analysis possible.',
    options: [
      {
        name: 'SQLite or PostgreSQL',
        pros: [
          'Cross-run queries: how a competitor’s hooks changed over six months',
          'Deduplication and history come free',
        ],
        cons: [
          'A dependency and a migration story on a tool whose selling point is that it installs anywhere with three packages',
          'Producing a client deliverable becomes an export step rather than the natural output',
        ],
      },
      {
        name: 'Timestamped folders as the datastore',
        pros: [
          'Each run is a self-contained folder that can be handed to a client as-is',
          'No database, no migrations, no export step — three dependencies total',
        ],
        cons: [
          'No cross-run queries, so trends over time have to be assembled by hand',
          'Disk organisation is the only index',
        ],
      },
    ],
    chose: 'Timestamped folders as the datastore',
    because:
      'The unit of value is a run, and a run is a deliverable. Making the deliverable the storage format meant there was never an export step, and the tool stayed installable anywhere on a runtime that is already present.',
    tradeoff:
      'No cross-run queries. Comparing a competitor’s hooks across six months means opening two folders, which is fine at 23 runs and would not be at 500 — that is the point at which SQLite earns its place.',
    outcome:
      'A three-dependency tool that installs anywhere and emits client-ready reports with no export step. It stayed that way until the tool was put behind a hosted console — at which point accounts, admin approval and saved run history all needed somewhere to live, and a real database went in. The command-line tool is unchanged; the console is a second artefact with a different constraint.',
    wouldRepeat: 'yes',
    revisitedAt: '2026-09',
    projects: ['ads-analyser'],
  },

  /* ---- Mirasphere Studio ------------------------------------------------- */
  {
    id: 'real-stt-timestamps',
    question: 'Why transcribe generated narration for timing, instead of estimating word positions?',
    context:
      'Studio drives a Remotion timeline from a script: captions have to appear on the word, and scene changes have to land on the beat. Word positions can be estimated from a words-per-minute figure for free, or measured by running the synthesised narration back through speech-to-text for the price of one more API call.',
    options: [
      {
        name: 'Estimate from words per minute',
        pros: [
          'Free, instant, and no extra dependency in the chain',
          'Close enough for a rough cut',
        ],
        cons: [
          'Error accumulates across a 30-second narration, so the drift is worst at the end',
          'Captions that miss by 300 milliseconds do not read as slightly off, they read as broken',
        ],
      },
      {
        name: 'Transcribe the generated audio with Scribe for word-level timestamps',
        pros: [
          'Exact word start times, taken from the audio that will actually ship',
          'Scene cuts and captions can both be driven from one source of truth',
        ],
        cons: [
          'One more paid API call per video',
          'Another third-party step that can be slow or fail',
        ],
      },
    ],
    chose: 'Transcribe the generated audio with Scribe for word-level timestamps',
    because:
      'Timing is the difference between a video that looks produced and one that looks automated, and it is the first thing a viewer notices. Guessing at it to save one API call on a pipeline that already pays for text-to-speech, image-to-video and lip-sync is a false economy.',
    tradeoff:
      'One additional paid call per video — mitigated by the fact that it checkpoints like every other paid step, so it is paid once even across retries.',
    outcome: 'Karaoke-precise captions and scene cuts, driven from the audio that actually ships.',
    wouldRepeat: 'yes',
    projects: ['studio'],
  },

  {
    id: 'checkpoint-every-paid-step',
    question: 'Why checkpoint every paid step, rather than retrying a failed job from the start?',
    context:
      'One Studio render chains text-to-speech, speech-to-text, image-to-video and lip-sync, each billed per call, and the presenter step alone polls a third-party render for roughly an hour. Restart-on-failure is the simpler design, and for a cheap, fast job it would be the right one.',
    options: [
      {
        name: 'Retry the whole job on failure',
        pros: [
          'Far less state to manage — a job is either done or not',
          'No partial-result correctness questions',
        ],
        cons: [
          'One flake anywhere in the chain re-bills every step that had already succeeded',
          'With an hour-long presenter render in the middle, a late failure costs the whole hour again',
        ],
      },
      {
        name: 'Checkpoint each completed step',
        pros: [
          'A retry resumes from the last completed step, so a failure costs nothing extra',
          'Slow, flaky third-party APIs stop being a reliability problem and become a latency problem',
        ],
        cons: [
          'More state management, and every intermediate artefact needs a defined shape and a place to live',
          'Checkpoints can go stale if an earlier input changes, which has to be reasoned about',
        ],
      },
    ],
    chose: 'Checkpoint each completed step',
    because:
      'When every step in a chain bills per call and one of them takes an hour, retry semantics are the architecture. The design assumption was that the vendors will be slow and occasionally fail, and the job of the pipeline is to make that cost nothing.',
    tradeoff:
      'Noticeably more state to manage, and a job table that is now the reliability story of the whole product rather than a queue.',
    outcome:
      'Retries resume from the last completed step, so failures cost time and never money — which is what made the pipeline usable rather than merely working.',
    wouldRepeat: 'yes',
    projects: ['studio'],
  },

  /* A decision about THIS site. Cheap to write, and it demonstrates the
     format applied to something the reader can inspect directly. */
  {
    id: 'typed-data-vs-mdx',
    question: 'Why typed data files for this portfolio, and not MDX frontmatter?',
    context:
      'Every project on this site carries around twenty fields, several of them nested arrays — a stack with a required rationale per item, ten case-study sections, architecture nodes with failure modes. That content had to be authored somewhere, and the obvious default was MDX with YAML frontmatter.',
    options: [
      {
        name: 'MDX with YAML frontmatter',
        pros: [
          'Prose and metadata live in one file',
          'Conventional, and easy to move to a hosted CMS later',
        ],
        cons: [
          'YAML has no types, so a mistyped field fails at render rather than in the editor',
          'Deeply nested arrays in YAML are error-prone to hand-author',
          'No autocomplete for twenty field names',
        ],
      },
      {
        name: 'Typed TypeScript modules validated with Zod',
        pros: [
          'Editor autocomplete for every field, and compile-time errors on typos',
          'Zod refinements can encode rules YAML cannot — such as requiring exactly one of `client` or `clientDescriptor`',
          'The honesty rules become build failures instead of good intentions',
        ],
        cons: [
          'Content is coupled to the codebase, so a non-technical editor cannot update it',
          'Long prose in template literals is less pleasant to write than Markdown',
        ],
      },
    ],
    chose: 'Typed TypeScript modules validated with Zod',
    because:
      'The most important requirement for this content was that invented metrics and unfilled placeholders could not reach production. That is a validation problem, and validation wants a type system. Zod refinements enforce rules — one of `client` or `clientDescriptor`, a capture date on every metric, a real reason on every technology — that YAML would let through silently.',
    tradeoff:
      'The site now has no CMS, and content changes require a commit and a deploy. For a single-author portfolio that is a fair exchange; for a team or a client site it would be the wrong call, and I would reach for a hosted CMS with the same schema enforced at the edge.',
    outcome:
      'Long-form prose can still migrate to MDX bodies without changing this shape, because the schema describes structure rather than storage.',
    wouldRepeat: 'yes',
    projects: [],
  },

  /* A second decision about this site, and the more interesting one, because
     it went against the plan. Real numbers, measured on this codebase. */
  {
    id: 'dropping-gsap',
    question: 'Why does this site not use GSAP, when the plan specified it?',
    context:
      'The build plan for this portfolio named GSAP with ScrollTrigger as the animation layer, and it was installed and wired up first. Then the performance budget gate was written, and it failed: first-load JavaScript came to 220 KB gzipped. Attributing that weight chunk by chunk showed GSAP core plus ScrollTrigger accounted for 43.5 KB gzipped — and, because the reveal logic lived in the root layout, it was being shipped on every single route.',
    options: [
      {
        name: 'Keep GSAP, raise the budget',
        pros: [
          'No rework, and the timeline API is genuinely excellent',
          'Already integrated and working',
        ],
        cons: [
          'A budget that moves whenever it is inconvenient is not a budget',
          '43.5 KB on every route to do fade-up-on-scroll is a bad exchange',
          'A portfolio arguing for performance while paying that is arguing against itself',
        ],
      },
      {
        name: 'Keep GSAP, but load it lazily',
        pros: [
          'Off the critical path, and the API stays available',
          'Smaller change than removing it',
        ],
        cons: [
          'Still downloads for nearly every visitor, just slightly later',
          'Reveal animations are the first thing a visitor scrolls into, so deferring them either delays the effect or causes a visible jump',
        ],
      },
      {
        name: 'IntersectionObserver plus CSS keyframes',
        pros: [
          'Roughly 1 KB instead of 43.5 KB, for a visually identical result',
          'Animations become CSS, so they honour prefers-reduced-motion natively',
          'The hero and the flow diagram become server components, since they no longer need a JS runtime at all',
        ],
        cons: [
          'No timeline sequencing, so complex choreography would be painful',
          'Hand-rolled staggering, which is a small amount of code to own',
        ],
      },
    ],
    chose: 'IntersectionObserver plus CSS keyframes',
    because:
      'Everything V1 actually animates is a fade-up on scroll, a hero entrance and a breathing SVG. All three are CSS keyframes triggered by an observer. Paying 43.5 KB on every route for a timeline API that nothing was using is not a trade-off, it is an oversight — and the project rule was already written down: if an effect costs performance, remove the effect. The corollary is that if a library is not earning its bytes, remove the library.',
    tradeoff:
      'There is now no timeline sequencing available. The moment the V2 work needs the pinned Work transition or an animated architecture diagram, GSAP earns its place again — and it will come back as a dynamic import scoped to those components, never in the root layout. Hand-rolled staggering and a small magnetic-hover helper are also now this codebase’s to maintain rather than a vendor’s.',
    outcome:
      'First-load JavaScript went from 220 KB to 186 KB gzipped. More usefully, once the framework floor is subtracted — a bare Next 16.3 and React 19 route with zero client components measures 182 KB on its own — the code this project actually wrote is 4.2 KB on the heaviest route. Six of the eight routes ship no page-specific client JavaScript at all. The budget gate itself was rewritten to measure that delta rather than an absolute number, because an absolute budget dominated by a framework constant fails on day one and then gets ignored.',
    wouldRepeat: 'yes',
    revisitedAt: '2026-08',
    projects: [],
  },

]

export const incidents: Incident[] = [
  {
    id: 'leadhouse-stale-register',
    title: 'Half the leads were not leads',
    symptom:
      'The bulk register flagged a cohort of companies as having accounts due. Verifying them live against the Companies House REST API showed that roughly half were not overdue at all.',
    impact:
      'Every one of those would have been a call to a company that had already filed — wasted outreach, and worse, an immediate credibility problem, because the entire pitch is knowing something specific and correct about the company being contacted.',
    cause:
      'The bulk company register is a monthly snapshot. A company that filed the day after the snapshot was taken still reads as due for up to a month, and the file gives no indication that it is out of date.',
    investigation: [
      'Spot-checked flagged companies against their live Companies House profile, expecting a small discrepancy rate.',
      'The discrepancy was not small, so the check was widened to the whole cohort of 162 flagged companies rather than a sample.',
      'Confirmed the pattern was recency rather than parsing: the mismatches were companies that had filed since the snapshot, not companies the ingest had misread.',
    ],
    fix:
      'Made live verification a mandatory stage rather than an optional one. Nothing downstream may treat the bulk flag as truth — the bulk file now produces candidates only, and a live REST profile check decides, with verdicts cached for 30 days so the API budget is spent on companies nobody has looked at yet.',
    result: {
      before: '162 companies flagged as due by the bulk snapshot',
      after: '83 confirmed actually overdue by live verification',
      source: 'self-measured',
      capturedAt: '2026-08-01',
    },
    lesson:
      'A cheap data source is allowed to be wrong as long as the system never forgets that it might be. Bulk data generates hypotheses; the authoritative source confirms them. The mistake would have been trusting a field because it was convenient to trust.',
    projects: ['leadhouse'],
  },

  {
    id: 'leadhouse-jobs-dying-mid-batch',
    title: 'The scan that had to start again',
    symptom:
      'Long scrape jobs died mid-batch whenever the process restarted — a deploy, a crash, a reboot — and lost their position entirely, along with any job rows left marked as running.',
    impact:
      'Hours of scanning discarded, and a queue containing orphaned jobs that would never complete and never fail. Since verification runs deliberately at half the published rate ceiling, redoing work is not just slow, it is spending a limited API budget twice.',
    cause:
      'Progress lived in the running process rather than in the database. A batch was an in-memory loop, so nothing outside that process knew how far it had got, and nothing on startup knew that a job claiming to be running no longer had anything running it.',
    investigation: [
      'Correlated the dead jobs with deploy times and confirmed the trigger was process lifecycle rather than any specific input row.',
      'Checked whether a row was the problem by resuming from the last known position by hand — it completed, which ruled out bad data and pointed at lost state.',
      'Established that the missing piece was durable progress plus a way to detect jobs abandoned by a previous process.',
    ],
    fix:
      'Moved progress into Postgres: slice-and-continue batches with an auto-advancing cursor, so a killed job resumes from its last committed position instead of restarting, plus an orphan-job sweep on boot that reclaims anything the previous process left mid-flight.',
    result: {
      before: 'A restart lost the whole batch',
      after: '42,119 rows completed across 5 resumed runs',
      source: 'self-measured',
      capturedAt: '2026-08-01',
    },
    lesson:
      'If a job takes longer than a deploy cycle, its progress belongs in the database, not in the process. And a queue needs to be able to tell the difference between "running" and "was running when something died" — otherwise the state is a lie the moment the process is.',
    projects: ['leadhouse'],
  },

  {
    id: 'virtuoso-post-event-bugs',
    title: 'The dashboards that only broke at events',
    symptom:
      'The artist, asset and event-management dashboards behaved correctly in development and then produced a steady stream of defects during live event trials — more than ten of them reaching production.',
    impact:
      'Failures landed during the trials the platform existed for, in front of the people running them, on the flows that mattered most: asset creation, purchase and profile management.',
    cause:
      'Not one root cause. What every one of them shared is that none of them appeared before the event — the dashboards had been exercised in development, but not under a live trial, and the defects lived in the gap between those two conditions.',
    investigation: [
      'Reports arrived out of live event trials rather than a test plan, so triage happened in the sprint cycles that followed — four of them.',
      'The surface was bounded, which helped: three dashboards and the five REST endpoints behind them, so every report landed somewhere in that set.',
      'Treated the pattern as the finding rather than any individual bug — the interesting question was not what broke, but why nothing had broken before the event.',
    ],
    fix:
      'Fixed them as they came in — more than ten defects resolved across four sprint cycles, in the dashboards and the endpoints behind them.',
    lesson:
      'A feature that has only been exercised against seeded data is untested, not tested. Since then the default is to get real conditions in front of the code as early as it will survive them — which is why the CRM went live with real client data in week one rather than after a staging phase.',
    projects: [],
  },
]

/* Principles (spec §24). Engineering principles, not motivational quotes.
   The four statements below came from the brief. `evidence` points at
   something real in the projects or the decision log — a principle with no
   evidence is a slogan, which is why the schema requires the field. */
export const principles: Principle[] = [
  {
    id: 'problem-first',
    statement: 'Start with the problem, not the technology.',
    explanation:
      'Choosing a stack before understanding the problem means the problem gets reshaped to fit the tools. The interesting constraints — who maintains this, what the budget rules out, what the data actually looks like — only surface when you start from the problem.',
    evidence:
      'On the lead engine, the obvious technology was the Companies House Streaming API: real-time, event-driven, modern. It answers "what changed". The business question was "who is due", and a company sitting quietly with an overdue filing generates no event. Starting from the question produced a 2.9GB bulk-CSV pipeline with live verification instead — the less fashionable answer, and the only one that covers the whole register on day one.',
    projects: ['leadhouse'],
  },
  {
    id: 'simplest-surviving-architecture',
    statement: 'The simplest architecture that survives the constraints usually wins.',
    explanation:
      'Not the simplest architecture — the simplest one that survives. Constraints include traffic, but also the team that inherits it and the budget that maintains it. Most over-engineering is a failure to enumerate the constraints, and most under-engineering is the same failure.',
    evidence:
      'The ads extractor runs on three dependencies, with no framework and no database, because at a few hundred ads per run timestamped folders survive the constraints and a database would only have added a migration story. That held until the tool was hosted for other people, and the constraint that broke it was not volume but multi-user access — which is the useful half of the lesson, because it is the one the original reasoning did not see coming.',
    projects: ['ads-analyser'],
  },
  {
    id: 'clarity-over-beauty',
    statement: 'A beautiful interface is useless if nobody understands what to do next.',
    explanation:
      'Visual quality and clarity are usually complementary, but when they conflict, clarity wins. An interface that photographs well and confuses users has failed at the only thing it was for.',
    evidence:
      'The CRM’s data importer defaults to a dry run. One button and one confirmation would have been the cleaner screen, and it would have been the wrong one: the person using it is migrating years of an accounting firm’s history, and what they need is to see exactly what will change before anything changes. The extra step exists because silent success is the failure mode of a migration, and an interface that hides that is not simpler, it is just quieter.',
    projects: ['crm'],
  },
  {
    id: 'every-decision-trades',
    statement: 'Every technical decision creates a trade-off.',
    explanation:
      'If a decision appears to have no downside, the downside has not been found yet. Naming the trade-off at the time of the decision is what makes it possible to revisit later, and it is the difference between a choice and a habit.',
    evidence:
      'Every entry in the decision log above names what it cost. Classifying ads with rules rather than an LLM bought deterministic, explainable reports at zero analysis cost, and paid for it with a hand-maintained taxonomy that needs attention as ad language shifts. Running the Companies House verifier at half the published rate ceiling bought zero rate-limit incidents across 22 production jobs and paid for it by making verification the deliberately slow stage of the pipeline. Both were the right call; neither was free.',
    projects: ['ads-analyser', 'leadhouse'],
  },
]
