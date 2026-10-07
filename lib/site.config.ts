/* ==========================================================================
   SINGLE SOURCE OF TRUTH FOR ALL PERSONAL DATA (spec §48)

   Everything a human needs to change lives in this file. No component
   hardcodes a name, a URL, a headline or a contact detail.

   Anything wrapped in [SQUARE BRACKETS] is an unfilled placeholder.
   `npm run check:content` fails the build if any remain, so placeholders
   cannot reach production by accident.
   ========================================================================== */

export const site = {
  name: 'Dheeraj Kumar',
  shortName: 'Dheeraj',
  /** Positioning. Deliberately NOT "Full Stack Developer". */
  role: 'Web & Software Developer',

  /* The hero statement. The master prompt's own suggestion, which was also
     the strongest of the options considered. Three lines, present tense,
     no hedging. */
  heroLines: ['I build', 'digital', 'products.'],
  heroSupport:
    'Websites, e-commerce experiences and custom software built around real problems.',

  /** One sentence, used in metadata and the AI-readable summary. */
  positioning:
    'I turn ideas, problems and business requirements into working digital products.',

  location: 'Gurgaon, India',
  timezone: 'Asia/Kolkata',
  timezoneLabel: 'IST',

  availability: 'Available for new projects',

  /* ---- Contact. -------------------------------------------------------- */
  email: 'okkdheeraj@gmail.com',
  links: {
    /* The CV lists no GitHub profile, so this sat as a placeholder rather than
       being inferred from the repo link on the Studio project — guessing a
       profile URL from a repo URL is still guessing. Confirmed directly when
       Dheeraj pushed this codebase to github.com/devdk, which also matches the
       Voiceover-Video-Generator repo already linked from that case study. */
    github: 'https://github.com/devdk',
    linkedin: 'https://linkedin.com/in/dheerajheree',
    resume: '/dheeraj-kumar-cv.pdf',
  },

  /* ---- Deployment. Affects canonicals, OG, sitemap and schema. ---------- */
  url: 'https://dheerajdrive.com',

  /* ---- Capabilities. Categorised, never percentages (spec §21). --------- */
  /* ---- What I build — written for the person hiring, not the person
     reviewing the code. Each description says what the buyer GETS; the proof
     line names a real project where it happened, so no capability on the
     page is a claim without a referent. Tech is kept but demoted: a business
     owner does not choose a developer by framework, and leading with one
     signals the section is written for somebody else. ------------------- */
  capabilities: [
    {
      title: 'Websites',
      description:
        'Fast marketing sites your own team can edit — new pages without a support ticket.',
      proof: 'Allure Dental · Swann Bookkeeping · Mariforce',
      tech: ['WordPress', 'Next.js', 'Technical SEO'],
    },
    {
      title: 'Online stores',
      description:
        'Shopify stores built to sell, including the slow product page quietly spending your ad budget on bounces.',
      proof: 'Zyvren · Chefs and Homes · Women Wellness First',
      tech: ['Shopify', 'Liquid', 'WooCommerce'],
    },
    {
      title: 'Web applications',
      description:
        'The software a business runs on — client records, documents and the day-to-day workflow — instead of renting it.',
      proof: 'SATCHEL · Virtuoso',
      tech: ['TypeScript', 'React', 'PostgreSQL'],
    },
    {
      title: 'Automation',
      description:
        'Systems that do the repetitive work: lead lists built from public data, competitor ads collected and sorted.',
      proof: 'Lead Engine · Ads Extractor',
      tech: ['Node.js', 'APIs', 'Queues'],
    },
  ],

  /* ---- Add-ons — sold on top of a build, not as a build. --------------
     SEO is offered as an add-on to any website or store rather than as a
     fifth kind of work: the buyer's question is "will people find it?",
     which is asked about a site, not instead of one. Every item listed is
     work that was actually done on a named project (the proof line). */
  addons: [
    {
      title: 'SEO and performance',
      label: 'Add-on to any website or store',
      description:
        'So the site gets found, not just finished — and loads fast enough that the people who find it stay.',
      includes: [
        'Technical SEO audit and fixes',
        'Structured data for services and products',
        'Google Business Profile, aligned with the site',
        'Page speed on the pages that get the traffic',
      ],
      proof: 'Allure Dental · Zyvren · Mirasphere Digital',
    },
  ],

  /* ---- Process — four stages, consolidated from the original seven.
     Seven tabs was a developer's view of a project. A buyer needs to know
     what happens, what they get, and what to watch for — so each of the
     four keeps the "watch for" line, which is the part that signals
     experience rather than process theatre. Every line is either from the
     original published process or from Dheeraj's own description of how he
     engages; nothing new is promised here. -------------------------------- */
  process: [
    {
      stage: 'Scope',
      what: 'Two calls, thirty to forty-five minutes each — first the business, then exactly what is being built.',
      youGet: 'A written scope, a timeline and a technology recommendation.',
      watchFor: 'Starting from a feature list instead of a problem.',
    },
    {
      stage: 'Build',
      what: 'Content and structure first, then the interface, built in reviewable slices.',
      youGet: 'A preview link that updates as the work does, not a status report.',
      watchFor: 'Disappearing for six weeks and coming back with a reveal.',
    },
    {
      stage: 'Launch',
      what: 'Tested on real devices and real network conditions, then deployed and handed over.',
      youGet: 'The live site, its documentation, and credentials you own.',
      watchFor: 'Treating the handover as an afterthought.',
    },
    {
      stage: 'Support',
      what: 'Three rounds of revisions in the first month, for what only shows up once real people use it.',
      youGet: 'The things you notice after launch fixed, rather than logged.',
      watchFor: 'Treating launch as the finish line.',
    },
  ],

  /* ---- About (spec §30). Concrete story, no "passionate developer". ----- */
  about: {
    intro:
      'I build digital products — websites, stores and custom software. Mostly for people who have a business problem rather than a technical specification.',
    sections: [
      {
        heading: 'Where I started',
        body: 'I started in Patna in 2022, shipping websites to clients three time zones away — WordPress, WooCommerce and Shopify, mostly for people in Canada, the US and the UK. No team and no safety net, which meant scoping, building, deploying and supporting each project myself. That is also where I learned performance properly, because a slow page loses a client money and they tell you about it.',
      },
      {
        heading: 'What I build now',
        body: 'Products with real users. I moved to Gurgaon in 2023 for an MCA and spent those years building web apps alongside it — including the store, event pages and dashboards of Virtuoso.live, on contract. Since July 2025 I have been at Mirasphere Digital doing agency delivery in React, Shopify and WordPress, and, as sole developer, building three products there: a practice CRM that Fordham Finance Group now runs its business on, a lead engine that reads the entire UK company register, and a pipeline that turns a script into a finished voiceover video.',
      },
      {
        heading: 'What I have learned',
        body: 'Two things, both the expensive way. First, a rule that has to be remembered everywhere it applies will eventually be forgotten somewhere — so the rules that matter most are enforced in one place, structurally, rather than trusted to memory. Second, for anything that touches historical data, the failure mode to design against is not an error but a silent success: an import that looks like it worked is far more dangerous than one that stops, which is why the importers I build default to a dry run.',
      },
      {
        heading: 'What I am exploring',
        body: 'LLM engineering, from the practical end: RAG pipelines, embeddings with transformers.js, and in-browser inference with WebLLM and WebGPU. What interests me is the judgement rather than the novelty — my Meta ads analyser is deliberately rule-based, because at a few hundred ads deterministic clustering beats a model on cost, speed and being able to explain the answer. Alongside that, TypeScript and Next.js in depth, which is what this site is built in.',
      },
    ],
    timeline: [
      {
        year: '2022',
        event: 'Patna. First freelance clients — WordPress, WooCommerce, Shopify — for businesses in Canada, the US and the UK.',
      },
      {
        year: '2023',
        event: 'Gurgaon. Started an MCA at K.R. Mangalam University while continuing to deliver freelance and agency work.',
      },
      {
        year: '2024',
        event: 'Frontend developer on contract at Virtuoso.live — the web app of an immersive live-events platform.',
      },
      {
        year: '2025',
        event: 'Website developer at Mirasphere Digital, and the start of building products of my own.',
      },
    ],
  },

  /* ---- CV (spec §28). Served as a real route at /cv, not a mode. -------- */
  cv: {
    summary:
      'Full-stack developer who builds production software end to end: a practice-management CRM a UK accountancy firm runs on every working day, a lead-generation engine and a video pipeline, alongside Shopify and WordPress builds for clients in the UK, the USA and Canada. Works in TypeScript, React and Node.js.',
    experience: [
      {
        role: 'Website Developer',
        org: 'Mirasphere Digital — onsite, Gurugram',
        period: 'Jul 2025 — Present',
        points: [
          'Delivered 7+ client websites and stores on WordPress, Shopify and React, from build to post-launch support.',
          'Built Shopify themes from Liquid sections clients edit themselves; rebuilt a product template measured at 12–16 seconds LCP.',
          'Connected a recruitment site’s CV form to Zoho Recruit, so applications land as candidate records, not email attachments.',
          'Sole developer, from design to deployment, on three products built at the company: SATCHEL (a practice CRM in daily use at Fordham Finance Group), the Companies House Lead Engine and the Mirasphere Studio video pipeline.',
        ],
      },
      {
        role: 'Frontend Developer (Contract)',
        org: 'Virtuoso.live — remote',
        period: 'Jul 2024 — Jun 2025',
        points: [
          'Built the store, event and artist pages and dashboards of a live-events web app in TypeScript and React.',
          'Built accounts, sessions and permissions for the community layer, and fixed a long-standing role-based access bug.',
          'Kept the app running through a mid-project move to AWS (S3, RDS PostgreSQL); fixed 10+ production bugs in 4 sprints.',
        ],
      },
      {
        role: 'Freelance Web Developer',
        org: 'Self-employed — remote',
        period: 'Jun 2022 — Apr 2025',
        points: [
          'Delivered 16+ projects and 12+ agency collaborations on WordPress and Shopify for UK, US and Canadian clients.',
          'Raised Lighthouse performance from about 40 to 85+ on several client sites by fixing LCP, layout shift and asset weight.',
        ],
      },
    ],
    education: [
      {
        qualification: 'Master of Computer Applications (MCA)',
        org: 'K.R. Mangalam University, Gurugram',
        period: '2023 — 2025',
      },
    ],
    skillGroups: [
      { group: 'Languages', items: ['TypeScript', 'JavaScript'] },
      { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS'] },
      {
        group: 'Backend & data',
        items: ['Node.js', 'Express', 'Fastify', 'PostgreSQL', 'MongoDB', 'Redis'],
      },
      {
        group: 'CMS & e-commerce',
        items: ['WordPress (ACF)', 'Shopify (Liquid)', 'WooCommerce'],
      },
      { group: 'Cloud & tools', items: ['AWS (S3, RDS)', 'Docker', 'Git'] },
      {
        group: 'Web performance & SEO',
        items: ['Core Web Vitals', 'Technical SEO', 'Structured data'],
      },
    ],

    /* ---- Logistics ------------------------------------------------------
       Only what is a fact goes here. Work preference, visa status, notice
       period, salary and role focus are discussed directly, so they are not
       fields at all; the Ask index declines them by name (CURATED_WITHHELD
       in scripts/build-lab-data.ts) and points to email instead. Not rendered
       on the site; read only by the Ask index. */
    logistics: [{ label: 'Current location', value: 'Gurgaon, India' }],
  },

  /* ---- Build With Me qualifier (spec §26) ------------------------------- */
  qualifier: {
    productTypes: [
      'Website',
      'E-commerce',
      'Web application',
      'Shopify',
      'WordPress',
      'AI product',
      'Automation',
      'Something else',
    ],
    challenges: [
      'Speed',
      'Design',
      'Conversion',
      'Scalability',
      'Development capacity',
      'A legacy system',
      'Not sure yet',
    ],
    stages: ['An idea', 'Planning', 'An existing product', 'A redesign', 'Broken, needs fixing'],
    timelines: ['As soon as possible', '1–2 months', '3–6 months', 'Flexible'],
  },
} as const

export type Site = typeof site

/* Build stamp. This is what makes staleness VISIBLE, which is the mitigation
   for the single highest-likelihood risk on this project.

   Every value is a build-time constant inlined by next.config.ts. Nothing
   here calls `new Date()` at render time — under Cache Components that would
   be an unstable value and would (correctly) fail the prerender. */
export const build = {
  sha: (process.env.COMMIT_SHA || 'local').slice(0, 7),
  ref: process.env.COMMIT_REF || 'dev',
  /** ISO string, stamped when the bundle was built. */
  builtAt: process.env.BUILD_TIME ?? '',
  /** Copyright year, from the build. */
  year: process.env.BUILD_YEAR ?? '',

  /* The origin this build is actually served from. Falls back to the
     production domain, so a local build behaves exactly as production does. */
  origin: (process.env.SITE_ORIGIN || site.url).replace(/\/$/, ''),

  /* False when this build was allowed to ship with [BRACKETED] placeholders.
     Every indexing signal on the site derives from this one flag rather than
     each being remembered separately — robots.txt, the sitemap and the root
     metadata all read it, so they cannot disagree with each other. */
  indexable: process.env.ALLOW_PLACEHOLDERS !== '1',
} as const

/* The CV, as the real PDF rather than a page rendered from data.

   `bytes` is 0 when the file is missing. The viewer still opens in a
   placeholder build and says plainly what is missing; check:content fails a
   real build, so a visitor never gets a viewer framing a 404. */
export const CV_PDF = {
  /** Served from /public. Keep in step with CV_FILE in next.config.ts. */
  href: '/dheeraj-kumar-cv.pdf',
  /** What the file is called once it lands in someone's Downloads folder. */
  fileName: 'Dheeraj-Kumar-CV.pdf',
  bytes: Number(process.env.CV_BYTES || 0),
} as const
