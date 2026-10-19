# Dheeraj Kumar — Portfolio

The source of [dheerajdrive.com](https://dheerajdrive.com): case studies for every project, a 3D wall of the live websites, an Ask box that answers from the site's own sentences, and a small Lab of language-model instruments.

Next.js 16.3, React 19, TypeScript (strict), Tailwind v4. Node 20.9 or later.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

## Checks

```bash
npm run typecheck        # tsc --noEmit
npm run check:content    # content gate: placeholders, sources, withheld details
npm run check:retrieval  # probe questions the Ask box must answer, and ones it must refuse
npm run check:graph      # the knowledge graph is connected and every query resolves
npm run build            # production build
npm run verify:live      # typecheck, content, retrieval and build, then JS budget and axe (WCAG A/AA) on every route
```

## How the content stays honest

Content is validated with Zod at build time (`lib/schema.ts`), and some rules are deliberately strict:

- **Every metric needs a source and a capture date.** There is no "estimate" source. A project with no measured result shows an empty state, never a zero or an approximation.
- **Every technology needs a reason it was chosen.** A stack can't be listed without one.
- **A client is either named (with permission) or described, never both and never neither.**
- **A `[BRACKETED]` placeholder fails the build.** Setting `ALLOW_PLACEHOLDERS=1` lets a preview build anyway, but also marks it noindex, so a half-finished page can't reach a search engine.

The Ask box is not a language model. It is BM25 retrieval over the published sentences, with a confidence floor, so it quotes what the site says or says it doesn't know.

## Deploy

`render.yaml` deploys it as a Node web service on Render (New → Blueprint). It needs a Node process rather than static hosting because the contact form posts to `/api/contact` and `/work` uses partial prerendering.

Set these in the host's dashboard:

| Variable | Purpose |
|---|---|
| `SITE_ORIGIN` | The origin the site is served from, e.g. `https://dheerajdrive.com`. Drives canonical URLs, the sitemap and robots.txt. |
| `CONTACT_WEBHOOK_URL` | Where contact-form submissions are sent (Resend, Formspark, Zapier, any JSON webhook). |
| `ALLOW_PLACEHOLDERS` | `1` only for previews with unfinished content. Leave unset in production. |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID. When set, a consent banner appears and Google Analytics loads only after the visitor allows it. Read at build time. |
| `GOOGLE_SITE_VERIFICATION` | Optional: the Search Console HTML-tag token. Not needed when the domain is verified by DNS. |

## Search

Titles, descriptions and image alt text live in one place, `content/seo.ts`, with one search intent per page; `npm run check:seo` fails on duplicates or lengths Google would truncate. Every page has its own canonical URL and share image (`lib/seo.ts`), structured data (Person, WebSite, FAQPage, ProfilePage, Article and BreadcrumbList), an image sitemap at `/sitemap.xml`, and a plain-text summary for answer engines at `/llms.txt`.

## Images

The composed images in `public/shots` are committed and are what the site serves. They are built from raw screenshots kept outside the repo:

```bash
node scripts/capture-live.mjs     # screenshot the live sites into captures/raw
node scripts/build-featured.mjs   # project cards
node scripts/build-marquee.mjs    # the websites wall
```

---

© Dheeraj Kumar. The code for client projects described here belongs to those clients; this repository contains only the portfolio.
