/* `cn` — the class joiner the components in components/ui expect.

   Aceternity and shadcn components import `cn` from "@/lib/utils", where it
   is usually twMerge(clsx(...)). This one only joins: tailwind-merge is ~7 KB
   gzipped on every page that uses it, and the components here were adapted
   so their defaults never collide with what a caller passes in — the job
   tailwind-merge exists to clean up after. If you paste a new component in
   that relies on overriding its own defaults (say `h-96` by passing `h-auto`),
   that is the moment to add tailwind-merge, not before. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
