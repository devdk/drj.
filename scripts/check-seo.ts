/* check:seo — the measurable half of content/seo.ts's rules.

   Every indexable page and case study has its own title and description;
   none repeats another (two pages chasing one query is how neither ranks);
   descriptions sit where Google shows them whole; and every case study with
   an image says in words what the image shows. */
import { PAGE_SEO, PROJECT_SEO } from '../content/seo'
import { getCaseStudySlugs } from '../lib/content'
import { featuredFor } from '../content/featured'

const problems: string[] = []
const entries: [string, { title: string; description: string }][] = [
  ...Object.entries(PAGE_SEO),
  ...getCaseStudySlugs().map((slug) => {
    const e = PROJECT_SEO[slug]
    if (!e) problems.push(`work/${slug}: no entry in content/seo.ts`)
    return [`work/${slug}`, e ?? { title: '', description: '' }] as [string, { title: string; description: string }]
  }),
]

const seenT = new Map<string, string>()
const seenD = new Map<string, string>()
for (const [key, { title, description }] of entries) {
  if (!title) continue
  const t = title.toLowerCase()
  const d = description.toLowerCase()
  if (seenT.has(t)) problems.push(`${key}: same title as ${seenT.get(t)}`)
  if (seenD.has(d)) problems.push(`${key}: same description as ${seenD.get(d)}`)
  seenT.set(t, key)
  seenD.set(d, key)
  const max = key === 'home' ? 70 : 60
  if (title.length > max) problems.push(`${key}: title ${title.length} chars (max ${max})`)
  if (description.length < 110 || description.length > 165)
    problems.push(`${key}: description ${description.length} chars (want 110–165)`)
}

for (const slug of getCaseStudySlugs()) {
  if (featuredFor(slug) && !PROJECT_SEO[slug]?.imageAlt) problems.push(`work/${slug}: has an image but no imageAlt`)
}

if (problems.length) {
  console.log(`\n✗ check:seo — ${problems.length} problem(s):\n`)
  console.log(problems.map((p) => `  ${p}`).join('\n'))
  process.exit(1)
}
console.log(`✓ check:seo — ${entries.length} pages, unique titles and descriptions, every image described.`)
