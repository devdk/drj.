/* ==========================================================================
   SEO COPY — the keyword map, in one place

   Every indexable page owns ONE search intent, and only that page targets
   it. Writing them side by side is how repetition gets caught: if two
   titles here start to say the same thing, two pages are competing for the
   same query and neither wins it.

     /            Dheeraj Kumar + full stack developer (brand and role)
     /work        web development portfolio, case studies
     /about       who he is, where he is (Gurugram), since when
     /contact     hiring intent: website, Shopify store, custom software
     /thinking    engineering decisions, lessons from real projects
     /lab         how language models work, interactive
     /work/<slug> the client or product + what was built + "case study"

   Rules the copy follows (scripts/check-seo.ts enforces the measurable ones):
   - Titles lead with the words people search; the brand comes last, added
     by the layout template ("%s | Dheeraj Kumar"). Under ~60 characters
     before the template where possible, so nothing important is truncated.
   - Descriptions 110–160 characters, each one unique, written as the answer
     to the query the page owns — it is the snippet Google and answer engines
     quote.
   - Every claim is one the page itself makes. No figure appears here that is
     not on the page it describes.
   ========================================================================== */

export type PageSeo = { title: string; description: string }

export const PAGE_SEO = {
  home: {
    /* Absolute: the home page carries the brand first. */
    title: 'Dheeraj Kumar — Full Stack Developer | Web Apps, Shopify, WordPress',
    description:
      'Full stack developer building web apps, Shopify stores and WordPress sites for businesses in the UK, US and Canada. Real case studies with architecture and results.',
  },
  work: {
    title: 'Web Development Portfolio and Case Studies',
    description:
      'Case studies of web apps, Shopify stores, WordPress sites and automation tools, each with the stack chosen, the architecture and what changed for the client.',
  },
  about: {
    title: 'About Dheeraj Kumar — Developer in Gurugram, India',
    description:
      'Dheeraj Kumar is a Gurugram-based developer who has shipped websites and software for clients in the UK, US and Canada since 2022, from WordPress builds to a CRM.',
  },
  contact: {
    title: 'Hire a Developer for Your Website or Software',
    description:
      'Planning a website, Shopify store or custom software? Answer four quick questions and get a recommended approach and timeline before you send anything.',
  },
  thinking: {
    title: 'Engineering Decisions and Lessons Learned',
    description:
      'A decision log and failure archive from real client projects: why each technical choice was made, what it cost, what broke and what changed afterwards.',
  },
  lab: {
    title: 'LLM Lab: Tokeniser, Embeddings and Sampling',
    description:
      'Interactive demos of how language models work: a byte-pair tokeniser, a PCA map of real embeddings and temperature and top-p sampling, all in your browser.',
  },
} satisfies Record<string, PageSeo>

/* Per case study: the title and description for search, and the alt text for
   its image. Alt text describes what the image shows, for someone who cannot
   see it — it is not a second place to put keywords. */
/* `heading`: what the thing is, shown after the project's name in its H1
   when the project title alone does not say ("Zyvren" → "Zyvren — Shopify
   store"). Visible text, not a hidden keyword. */
export const PROJECT_SEO: Record<string, PageSeo & { imageAlt?: string; heading?: string }> = {
  virtuoso: {
    heading: 'live-events web app',
    title: 'Virtuoso Web App: Live-Events Platform Case Study',
    description:
      'Building the web app for Virtuoso, an immersive live-events platform: the store, event and artist pages, dashboards and accounts, in TypeScript on AWS.',
    imageAlt: 'The Virtuoso web app’s events page, with featured live-music events',
  },
  crm: {
    title: 'SATCHEL: Practice Management CRM for Accountants',
    description:
      'How SATCHEL, practice-management software for UK accountancy firms, was built for Fordham Finance Group in about eight weeks with TypeScript, React and PostgreSQL.',
    imageAlt:
      'SATCHEL feature overview: compliance deadlines, engagement letters, a client portal and team workload, shown as cards around a phone',
  },
  leadhouse: {
    title: 'Companies House Lead Generation Engine Case Study',
    description:
      'A lead engine that scans the UK Companies House register for upcoming filing deadlines and turns them into pre-qualified leads for an accountancy firm.',
  },
  'ads-analyser': {
    title: 'Competitive Ads Extractor: Meta Ad Library Tool',
    description:
      'A Node.js tool that pulls every live Facebook and Instagram ad for a list of competitors from the Meta Ad Library and groups them into hooks, offers and gaps.',
  },
  studio: {
    heading: 'AI voiceover video pipeline',
    title: 'AI Voiceover Video Pipeline: Mirasphere Studio',
    description:
      'Mirasphere Studio turns a written script into a branded voiceover video with a lip-synced presenter, built with ElevenLabs, Remotion and Next.js.',
  },
  'chefs-and-homes': {
    heading: 'Shopify store',
    title: 'Chefs and Homes: Shopify Store for a Malta Retailer',
    description:
      'A Shopify store with custom Liquid sections for Chefs and Homes, a Malta kitchenware retailer taking its first step from physical shops into selling online.',
    imageAlt: 'The Chefs and Homes Shopify store home page on desktop and mobile',
  },
  zyvren: {
    heading: 'Shopify store',
    title: 'Zyvren: Shopify Product Page Speed Case Study',
    description:
      'Rebuilding a US clothing brand’s Shopify product template after Lighthouse measured its LCP at 12–16 seconds, on the page every paid ad landed on.',
    imageAlt: 'The Zyvren Shopify clothing store home page on desktop and mobile',
  },
  'women-wellness-first': {
    heading: 'Shopify store',
    title: 'Women Wellness First: Shopify Store Build',
    description:
      'The first online store for a Gurugram women’s health brand: a Shopify build with custom sections matched to the in-house design team’s spec.',
    imageAlt: 'The Women Wellness First Shopify store home page on desktop and mobile',
  },
  'allure-dental': {
    heading: 'dental practice website',
    title: 'Allure Dental Care: WordPress Website and Local SEO',
    description:
      'Rebuilding the WordPress website of a Barnet dental and facial-aesthetics practice in north London, then making it findable with technical and local SEO.',
    imageAlt: 'The Allure Dental Care website home page on desktop and mobile',
  },
  mariforce: {
    heading: 'recruitment website',
    title: 'Mariforce Crewing: WordPress Recruitment Website',
    description:
      'A WordPress website for an offshore crew recruiter, where every CV sent through the careers page arrives in Zoho Recruit as a candidate record.',
    imageAlt: 'The Mariforce Crewing recruitment website home page on desktop and mobile',
  },
  'swann-bookkeeping': {
    title: 'Swann Bookkeeping: Accountancy Firm Website',
    description:
      'A WordPress website for a London bookkeeping and accountancy firm, with service pages that explain payroll, VAT, CIS and tax planning to small businesses.',
    imageAlt: 'The Swann Bookkeeping website home page on desktop and mobile',
  },
  'mirasphere-site': {
    title: 'Mirasphere Digital: Agency Website on WordPress',
    description:
      'The WordPress website for Mirasphere Digital, a London and Gurugram marketing agency, built with Elementor and technical SEO so the agency’s own work sells it.',
    imageAlt: 'The Mirasphere Digital agency website home page on desktop and mobile',
  },
}
