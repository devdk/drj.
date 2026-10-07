/* ==========================================================================
   PLACEHOLDER GATE

   Spec §48: never ship invented achievements, client names, metrics or
   outcomes. The convention is that unfilled content is wrapped in
   [SQUARE BRACKETS]. This script fails the build if any survive, so a
   half-finished case study cannot go live by accident.

   Run:  npm run check:content
   CI:   part of `npm run verify`, before `next build`

   Use --warn to list placeholders without failing (useful while writing).
   ========================================================================== */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIRS = ['content', 'lib']
const SCAN_FILES = ['lib/site.config.ts']
const EXTENSIONS = ['.ts', '.tsx', '.mdx', '.md']

/** Matches [ANYTHING IN CAPS], the placeholder convention. Deliberately
    narrow so it cannot match array indexing, generics or JSX. */
const PLACEHOLDER = /\[[A-Z][A-Z0-9 ',.—/&-]{2,}\]/g

/**
 * Blanks out comments and regex literals, preserving line count and column
 * positions so reported line numbers stay accurate.
 *
 * This matters more than it looks. Without it the gate flags its own
 * documentation — the sentence explaining the [BRACKETS] convention, and the
 * character class `[A-Z0-9 ...]` in the pattern above. A gate that cries wolf
 * gets ignored, at which point it is worse than no gate, so the scanner only
 * ever looks at executable string content.
 */
function stripNonContent(source: string): string {
  let out = ''
  let i = 0
  const n = source.length

  type State = 'code' | 'line-comment' | 'block-comment' | 'single' | 'double' | 'template' | 'regex'
  let state: State = 'code'

  while (i < n) {
    const c = source[i]!
    const next = source[i + 1]

    if (state === 'code') {
      if (c === '/' && next === '/') {
        state = 'line-comment'
        out += '  '
        i += 2
        continue
      }
      if (c === '/' && next === '*') {
        state = 'block-comment'
        out += '  '
        i += 2
        continue
      }
      // A '/' after these characters starts a regex literal, not division.
      if (c === '/') {
        const prev = out.replace(/\s+$/, '').slice(-1)
        if (prev === '' || '=(,:[!&|?{};+-*%~^'.includes(prev)) {
          state = 'regex'
          out += ' '
          i += 1
          continue
        }
      }
      if (c === "'") state = 'single'
      else if (c === '"') state = 'double'
      else if (c === '`') state = 'template'
      out += c
      i += 1
      continue
    }

    if (state === 'line-comment') {
      if (c === '\n') {
        state = 'code'
        out += '\n'
      } else {
        out += ' '
      }
      i += 1
      continue
    }

    if (state === 'block-comment') {
      if (c === '*' && next === '/') {
        state = 'code'
        out += '  '
        i += 2
      } else {
        out += c === '\n' ? '\n' : ' '
        i += 1
      }
      continue
    }

    if (state === 'regex') {
      if (c === '\\') {
        out += '  '
        i += 2
        continue
      }
      if (c === '/' || c === '\n') {
        state = 'code'
        out += c === '\n' ? '\n' : ' '
        i += 1
        continue
      }
      out += ' '
      i += 1
      continue
    }

    // Inside a string: keep the content, it is what we are checking.
    if (c === '\\') {
      out += source.slice(i, i + 2)
      i += 2
      continue
    }
    if (
      (state === 'single' && c === "'") ||
      (state === 'double' && c === '"') ||
      (state === 'template' && c === '`')
    ) {
      state = 'code'
    }
    out += c
    i += 1
  }

  return out
}

/* --warn on the command line, or ALLOW_PLACEHOLDERS=1 in the environment.

   The env form exists so a deploy can opt into shipping placeholders using the
   SAME variable that turns indexing off (see next.config.ts and app/robots.ts).
   One flag, two consequences, and no way to get one without the other: a build
   allowed to carry holes is a build no crawler should see. */
const warnOnly = process.argv.includes('--warn') || process.env.ALLOW_PLACEHOLDERS === '1'

type Hit = { file: string; line: number; text: string; placeholder: string }

function walk(dir: string, acc: string[] = []): string[] {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return acc
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full, acc)
    } else if (EXTENSIONS.some((e) => full.endsWith(e))) {
      acc.push(full)
    }
  }
  return acc
}

const files = new Set<string>([
  ...SCAN_DIRS.flatMap((d) => walk(join(ROOT, d))),
  ...SCAN_FILES.map((f) => join(ROOT, f)),
])

const hits: Hit[] = []

for (const file of files) {
  const source = readFileSync(file, 'utf8')
  const scannable = stripNonContent(source).split('\n')
  const original = source.split('\n')

  scannable.forEach((text, i) => {
    const matches = text.match(PLACEHOLDER)
    if (!matches) return
    for (const placeholder of matches) {
      hits.push({
        file: relative(ROOT, file),
        line: i + 1,
        text: (original[i] ?? '').trim().slice(0, 100),
        placeholder,
      })
    }
  })
}

/* ── DISCLOSURE GATE ──────────────────────────────────────────────────────

   Some projects are client systems published at outcome level only. This
   gate keeps the withheld specifics out of every file that can reach a
   visitor — including the generated Ask corpus, where a removed sentence
   would otherwise quietly survive — and fails regardless of
   ALLOW_PLACEHOLDERS, because unlike a placeholder this is never acceptable
   to ship.

   The terms themselves live in scripts/disclosure.local.json, which is
   gitignored: a public list of what must not be published would publish it.
   Format: [{ "pattern": "regex source", "flags": "i", "what": "label" }].
   Without the file (a fresh clone, a CI box) the gate is skipped with a note. */
const DISCLOSURE_FILE = join(ROOT, 'scripts/disclosure.local.json')
const DISCLOSURE_PATTERNS: [RegExp, string][] = (() => {
  try {
    const raw = JSON.parse(readFileSync(DISCLOSURE_FILE, 'utf8')) as {
      pattern: string
      flags?: string
      what: string
    }[]
    return raw.map((r) => [new RegExp(r.pattern, r.flags ?? ''), r.what])
  } catch {
    console.log('  (disclosure gate skipped: scripts/disclosure.local.json not present)')
    return []
  }
})()
const DISCLOSURE_DIRS = ['content', 'lib', 'components', 'app', 'public']
const DISCLOSURE_EXT = ['.ts', '.tsx', '.md', '.mdx', '.json', '.txt', '.xml']

const leaks: string[] = []
function scanForLeaks(dir: string) {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      scanForLeaks(full)
      continue
    }
    if (!DISCLOSURE_EXT.some((e) => full.endsWith(e))) continue
    readFileSync(full, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        for (const [pattern, what] of DISCLOSURE_PATTERNS) {
          if (pattern.test(line)) leaks.push(`  ${relative(ROOT, full)}:${i + 1}  ${what}`)
        }
      })
  }
}
DISCLOSURE_DIRS.forEach((d) => scanForLeaks(join(ROOT, d)))
if (leaks.length > 0) {
  console.log(`\n✗ check:content — ${leaks.length} private CRM detail(s) found in published files:\n`)
  console.log(leaks.join('\n'))
  console.log('\nThe CRM is published at outcome level only. See the note on its entry in content/projects.ts.\n')
  process.exit(1)
}

/* The CV is a file, not text, so the placeholder regex cannot see it. A missing
   PDF is the same kind of hole as a [BRACKET]: the footer offers a CV, and the
   offer has to be true. */
if (!existsSync(join(ROOT, 'public', 'dheeraj-kumar-cv.pdf'))) {
  hits.push({
    file: 'public/dheeraj-kumar-cv.pdf',
    line: 0,
    text: 'missing',
    placeholder: '[CV PDF — add your real CV as public/dheeraj-kumar-cv.pdf]',
  })
}

if (hits.length === 0) {
  console.log('✓ check:content — no unfilled placeholders.')
  process.exit(0)
}

const byFile = new Map<string, Hit[]>()
for (const hit of hits) {
  byFile.set(hit.file, [...(byFile.get(hit.file) ?? []), hit])
}

const heading = warnOnly
  ? `\n⚠  ${hits.length} unfilled placeholder${hits.length === 1 ? '' : 's'} remaining:\n`
  : `\n✗ check:content failed — ${hits.length} unfilled placeholder${hits.length === 1 ? '' : 's'}.\n`

console.log(heading)

for (const [file, fileHits] of byFile) {
  console.log(`  ${file}`)
  for (const hit of fileHits) {
    console.log(`    ${String(hit.line).padStart(4)}  ${hit.placeholder}`)
  }
  console.log('')
}

if (warnOnly) {
  console.log('Run without --warn (and without ALLOW_PLACEHOLDERS=1) to make these a build failure.\n')
  process.exit(0)
}

console.log(
  'These are real content gaps, not lint noise. Fill them with true\n' +
    'information, or delete the field. Never substitute a plausible number.\n' +
    'While drafting, use `tsx scripts/check-content.ts --warn`.\n',
)
process.exit(1)
