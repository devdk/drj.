import { jsonLdScript } from '@/lib/seo'

/** Server-rendered JSON-LD. Built from static content, never from user input. */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] | Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />
}
