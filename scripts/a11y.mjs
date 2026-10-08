import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const BASE = process.env.BASE ?? 'http://localhost:3000'

/* Project routes are DISCOVERED rather than listed here.

   This list used to name '/work/crm' and nothing else, which meant every
   project added after it shipped untested — and the supporting-tier pages are
   exactly where an untested regression would land, because they render a
   different set of sections from the flagships. A hardcoded list of routes on
   a site that grows is a check that quietly stops checking.

   ── WHY NOT THE SITEMAP ───────────────────────────────────────────────────

   It used to read the sitemap, and that was wrong for a reason worth writing
   down. The sitemap is an SEO artefact: app/sitemap.ts returns an EMPTY list
   whenever the build is non-indexable, which is exactly what a build
   containing [BRACKETED] placeholders is. So the moment a project was added
   with a gap in it — the one time you most want every page exercised —
   coverage silently fell from twenty routes to ten and the run still printed
   a green tick. A test harness must not inherit a policy decision about
   crawlers.

   The work index is the right source: it lists every project that has a page,
   for the same reason the pages exist, and it does not care about indexing.
   A drop to zero is now a hard failure rather than a quiet fallback. */
async function projectRoutes() {
  const html = await (await fetch(`${BASE}/work`)).text()
  const found = [...html.matchAll(/href="(\/work\/[a-z0-9-]+)"/g)].map((m) => m[1])
  const unique = [...new Set(found)]
  if (unique.length === 0) {
    console.error(
      '\n\u2717 a11y: found no project routes on /work.\n' +
        '  Either the index is broken or the link markup changed. Refusing to\n' +
        '  run a reduced suite and report it as a pass.',
    )
    process.exit(1)
  }
  return unique.sort()
}

const ROUTES = [
  '/',
  '/work',
  '/work?view=map',
  '/thinking',
  '/about',
  '/contact',
  '/lab',
  '/dev',
  ...(await projectRoutes()),
  '/nope',
]

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' })

let totalViolations = 0
let totalBroken = 0

/* Routes that are SUPPOSED to 404. Everything else must actually resolve.

   This assertion exists because of a real miss: three new project pages
   returned 404 while this script printed "clean" for all of them. It was not
   lying — a 404 page IS accessible — but "axe found nothing" had been quietly
   standing in for "the page works", and those are different claims. A check
   that passes on a broken page is worse than no check, because it is trusted.

   So each route now asserts three things: the HTTP status is what it should
   be, the page is not the not-found template in disguise, and there is exactly
   one h1. Then axe runs on top of that. */
const EXPECT_404 = new Set(['/nope'])

for (const route of ROUTES) {
  const page = await ctx.newPage()
  const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })

  const status = response?.status() ?? 0
  const wantsError = EXPECT_404.has(route)
  const h1s = await page.$$eval('h1', (els) => els.map((e) => e.textContent?.trim() ?? ''))

  const problems = []
  if (wantsError) {
    if (status !== 404) problems.push(`expected 404, got ${status}`)
  } else {
    if (status !== 200) problems.push(`expected 200, got ${status}`)
    if (h1s.some((h) => /doesn’t exist|does not exist|not found/i.test(h))) {
      problems.push('rendered the not-found page')
    }
    if (h1s.length !== 1) problems.push(`${h1s.length} h1 elements, expected 1`)
  }

  if (problems.length > 0) {
    totalBroken += 1
    console.log(`${route.padEnd(28)} BROKEN — ${problems.join('; ')}`)
    await page.close()
    continue
  }
  // Reveal everything so axe sees real content, not opacity-0 elements.
  const h = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < h; y += 800) { await page.evaluate(y => window.scrollTo(0,y), y); await page.waitForTimeout(60) }
  await page.waitForTimeout(800)

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  const v = results.violations
  totalViolations += v.length
  console.log(`${route.padEnd(28)} ${v.length === 0 ? 'clean' : `${v.length} violation(s)`}`)
  for (const item of v) {
    console.log(`   [${item.impact}] ${item.id}: ${item.help}`)
    for (const node of item.nodes.slice(0, 2)) {
      console.log(`      ${node.html.slice(0, 120)}`)
    }
  }
  await page.close()
}

// ---- Keyboard: command palette full operation ----
{
  const page = await ctx.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.keyboard.press('Control+k')
  // The palette is a lazy chunk; wait for it to mount rather than guessing.
  /* Generous: the palette is a lazy chunk and this is the first interaction in
     a cold context. A tight timeout here produced a "broken palette" report
     that was really a slow first fetch — measured at 380ms once warm. */
  await page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 20_000 })
  const dialogVisible = await page.locator('[role="dialog"]').isVisible()
  await page.waitForTimeout(200)
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName)
  await page.keyboard.type('think')
  await page.waitForTimeout(300)
  await page.keyboard.press('ArrowDown')
  const activeDesc = await page.evaluate(() =>
    document.querySelector('[role="combobox"]')?.getAttribute('aria-activedescendant'))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  const closed = (await page.locator('[role="dialog"]').count()) === 0
  console.log(`\nPalette keyboard: open=${dialogVisible} focus=${focusedTag} activedescendant=${Boolean(activeDesc)} escape-closes=${closed}`)

  // Enter navigates
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(600)
  await page.keyboard.type('thinking')
  await page.waitForTimeout(300)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(1200)
  console.log(`Palette Enter navigated to: ${new URL(page.url()).pathname}`)
  await page.close()
}

// ---- Keyboard: tablists ----
// Scoped per tablist by accessible name. The homepage has TWO of them now
// (Process and the Lab's act rail), so an unscoped [role="tab"] selector
// matches both and fails Playwright's strict mode.
/* Each tablist is tested WHERE IT LIVES. This list used to assume both were
   on the homepage, so removing the Lab block from `/` made the check time out
   against an element that had simply moved. A test that names a route is a
   test that survives the page being reorganised. */
/* The 'Instruments' tablist was removed with components/sections/Lab.tsx.
   That component was the PINNED, tab-switched version of the three lab
   instruments and existed only for the homepage block; /lab lays the same
   three out in full, with no tabs. Deleting the homepage block orphaned it,
   so the component went and this check went with it — a keyboard test for an
   interaction pattern the site no longer has is a test that can only fail or
   mislead. */
/* The 'Project stages' tablist went with the seven-stage Process: four
   stages now show side by side, so there is no tab interaction left to
   test. The homepage's keyboard-operated pattern is the FAQ disclosure, so
   that is what this checks — that Enter on a collapsed question expands it
   and the expanded state is exposed to assistive tech, not just painted. */
{
  const page = await ctx.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  const second = page.locator('#working-together button[aria-expanded]').nth(1)
  await second.focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(250)
  const expanded = await second.getAttribute('aria-expanded')
  const first = await page.locator('#working-together button[aria-expanded]').first().getAttribute('aria-expanded')
  console.log(`FAQ disclosure: Enter on #2 -> expanded=${expanded}, #1 collapsed=${first === 'false'}`)
  if (expanded !== 'true' || first !== 'false') {
    console.error('✗ FAQ disclosure did not respond to the keyboard as expected')
    process.exitCode = 1
  }
  await page.close()
}

/* The hero's project tabs: arrow keys move the selection AND stop the
   automatic cycle — choosing is the pause control (WCAG 2.2.2), so a test
   that only checked selection would miss the half that matters. */
{
  const page = await ctx.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  const tabs = page.getByRole('tablist', { name: 'Featured projects' })
  await tabs.getByRole('tab').first().focus()
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(200)
  const selected = await tabs.locator('[role="tab"][aria-selected="true"]').getAttribute('id')
  await page.waitForTimeout(6000)
  const after = await tabs.locator('[role="tab"][aria-selected="true"]').getAttribute('id')
  console.log(`Hero tabs: ArrowRight -> ${selected}; 6s later still ${after}`)
  if (selected !== 'hero-tab-zyvren' || after !== selected) {
    console.error('✗ hero tabs: keyboard selection did not select, or did not stop the cycle')
    process.exitCode = 1
  }
  await page.close()
}

/* The hero cycles on its own, including with the pointer resting on the
   stage — the stage fills most of the first screen, so pausing on stage
   hover would stop the deck for nearly every desktop visitor. */
{
  const page = await ctx.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  const stage = page.locator('#hero-stage')
  const box = await stage.boundingBox()
  if (box) await page.mouse.move(box.x + box.width / 2, box.y + Math.min(box.height / 2, 200))
  const tabs = page.getByRole('tablist', { name: 'Featured projects' })
  const first = await tabs.locator('[role="tab"][aria-selected="true"]').getAttribute('id')
  await page.waitForTimeout(6500)
  const later = await tabs.locator('[role="tab"][aria-selected="true"]').getAttribute('id')
  console.log(`Hero auto-cycle with pointer on stage: ${first} -> ${later}`)
  if (first === later) {
    console.error('✗ hero did not advance on its own with the pointer over the stage')
    process.exitCode = 1
  }
  await page.close()
}

/* The CV viewer: a modal, so the checks are the modal contract — opens from
   the keyboard, focus lands inside, axe is clean WITH it open (the dialog is
   only in the DOM tree axe sees once it is open), Escape closes it, focus
   returns to the button. Then the two other doors: /#cv on arrival, and the
   old /cv route redirecting to it. */
{
  const page = await ctx.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  const trigger = page.locator('footer button[aria-haspopup="dialog"]')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(900)
  const opened = await page.evaluate(() => document.querySelector('dialog.cv-dialog')?.open === true)
  const focusInside = await page.evaluate(() => !!document.activeElement?.closest('dialog.cv-dialog'))
  const axe = await new AxeBuilder({ page }).include('dialog.cv-dialog').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  totalViolations += axe.violations.length
  for (const item of axe.violations) console.log(`   [${item.impact}] cv dialog ${item.id}: ${item.help}`)
  await page.keyboard.press('Escape')
  /* The close is a 420 ms animation; wait for the result rather than a fixed
     time, so a slow machine is not reported as a broken dialog. */
  const closed = await page
    .waitForFunction(() => document.querySelector('dialog.cv-dialog')?.open === false, null, { timeout: 3000 })
    .then(() => true, () => false)
  const focusBack = await page.evaluate(() => document.activeElement?.getAttribute('aria-haspopup') === 'dialog')

  await page.goto(`${BASE}/#cv`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  const byHash = await page.evaluate(() => document.querySelector('dialog.cv-dialog')?.open === true)

  await page.goto(`${BASE}/cv`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  const byRedirect = await page.evaluate(() => document.querySelector('dialog.cv-dialog')?.open === true)

  console.log(
    `CV viewer: open=${opened} focusInside=${focusInside} axe=${axe.violations.length} escClosed=${closed} focusBack=${focusBack} #cv=${byHash} /cv=${byRedirect}`,
  )
  if (!opened || !focusInside || !closed || !focusBack || !byHash || !byRedirect) {
    console.error('✗ CV viewer did not honour the modal contract')
    process.exitCode = 1
  }
  await page.close()
}

// ---- Keyboard: skip link ----
{
  const page = await ctx.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
  console.log(`First Tab stop: "${first}"`)
  await page.close()
}

await browser.close()
console.log(
  `\n${totalBroken === 0 ? `✓ routes: all ${ROUTES.length} resolved as expected` : `✗ routes: ${totalBroken} broken`}`,
)
console.log(
  `${totalViolations === 0 ? '✓ axe: no WCAG A/AA violations across all routes' : `✗ axe: ${totalViolations} total violations`}`,
)
process.exit(totalViolations === 0 && totalBroken === 0 && !process.exitCode ? 0 : 1)
