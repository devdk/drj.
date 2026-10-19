import { site } from '@/lib/site.config'
import { PAGE_SEO } from '@/content/seo'
import { getCaseStudySlugs, getProject, CATEGORY_LABELS } from '@/lib/content'
import { projectSeo } from '@/lib/seo'

/* /llms.txt — the site in a form answer engines and LLM agents can read in one
   request (https://llmstxt.org): who this is, what he builds, and a link to
   every page worth citing, each with a one-line description. Generated from
   the same content as the pages, so it cannot drift from them. */

export function GET() {
  const base = site.url.replace(/\/$/, '')
  const projects = getCaseStudySlugs()
    .map((slug) => getProject(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const line = (title: string, path: string, desc: string) => `- [${title}](${base}${path}): ${desc}`

  const body = `# ${site.name}

> ${site.name} is a full stack developer based in Gurugram, India, building web apps, Shopify stores, WordPress sites and business automation for clients in the UK, the US and Canada since 2022. Website Developer at Mirasphere Digital; sole developer of SATCHEL, practice-management software for UK accountancy firms.

- Contact: ${site.email}
- LinkedIn: ${site.links.linkedin}
- GitHub: ${site.links.github}
- CV (PDF): ${base}${site.links.resume}

## Pages

${line('Home', '/', PAGE_SEO.home.description)}
${line('Work', '/work', PAGE_SEO.work.description)}
${line('About', '/about', PAGE_SEO.about.description)}
${line('Contact', '/contact', PAGE_SEO.contact.description)}
${line('Thinking', '/thinking', PAGE_SEO.thinking.description)}

## Case studies

${projects.map((p) => line(`${p.title} (${CATEGORY_LABELS[p.category]})`, `/work/${p.slug}`, projectSeo(p).description)).join('\n')}

## Optional

${line('Lab', '/lab', PAGE_SEO.lab.description)}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
