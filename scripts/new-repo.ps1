# Publish to a new GitHub repository, authored by you.
#
#   .\scripts\new-repo.ps1 -Email "12345678+devdk@users.noreply.github.com" `
#                          -RepoUrl "https://github.com/devdk/<new-repo>.git"
#
# What it does
#   1. Replaces .git with a fresh history — no trace of the old placeholder
#      identity ("Your Name <you@example.com>"), which is what put your name
#      on nothing.
#   2. Commits the tree in seven logical steps, all authored by YOU and only
#      you, so the repo's Contributors list and your GitHub graph show your
#      work and nothing else.
#   3. Points origin at the new repository.
#
# It does NOT push. Run the push yourself once you have checked the log.
#
# Run it from the repository root, in PowerShell.

[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$Email,

  [Parameter(Mandatory = $true)]
  [string]$RepoUrl,

  [string]$Name = 'Dheeraj Kumar',

  [string]$Branch = 'main'
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path 'package.json')) {
  throw 'Run this from the repository root (the folder holding package.json).'
}

# A real address here would be published in every commit for ever. The GitHub
# noreply form still links commits to your profile.
if ($Email -notmatch '^[^@\s]+@[^@\s]+\.[^@\s]+$') {
  throw "That does not look like an email address: $Email"
}

Write-Host ''
Write-Host "  author   $Name <$Email>"
Write-Host "  remote   $RepoUrl"
Write-Host "  branch   $Branch"
Write-Host ''
$answer = Read-Host '  This DELETES the current .git folder and starts a new history. Type YES to continue'
if ($answer -ne 'YES') { Write-Host '  Cancelled. Nothing changed.'; exit 1 }

# ---------------------------------------------------------------------------
# 1. Fresh history
# ---------------------------------------------------------------------------

if (Test-Path '.git') {
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $backup = "..\git-backup-$stamp"
  Write-Host "  Moving the old .git to $backup (delete it yourself once you are happy)"
  Move-Item '.git' $backup
}

git init --initial-branch=$Branch | Out-Null
git config user.name  $Name
git config user.email $Email

# ---------------------------------------------------------------------------
# 2. The commits
#
# Ordered the way the thing was actually built: the toolchain, then the design
# system everything else depends on, then the schema that guards the content,
# then the content, then the pages, then the machinery, then deployment.
#
# Paths that do not exist are skipped, and a final catch-all commits anything
# these groups missed — so a file can never be silently left out of the repo.
# ---------------------------------------------------------------------------

$commits = @(
  @{
    Paths   = @('.gitignore', '.env.example', 'package.json', 'package-lock.json',
                'tsconfig.json', 'next.config.ts', 'postcss.config.mjs',
                'README.md', 'SETUP-WINDOWS.md')
    Message = @'
Set up the toolchain

Next.js pinned to 16.3.1, React 19, TypeScript in strict mode with
noUncheckedIndexedAccess, and Tailwind v4 through PostCSS.

The Next version is pinned rather than ranged because Cache Components and
partial prefetching are both enabled, and those are the parts of the framework
most likely to move under a caret range.
'@
  },
  @{
    Paths   = @('styles', 'components/primitives', 'components/layout')
    Message = @'
Add the design system and layout primitives

Colour, type, spacing, easing and duration as CSS custom properties in an
@theme block, with every contrast ratio computed against the canvas rather
than eyeballed. The chapter hues are registered with @property so the whole
interface can interpolate between them as you scroll instead of snapping.
'@
  },
  @{
    Paths   = @('lib/schema.ts', 'lib/content.ts', 'lib/site.config.ts', 'lib/chapters.ts')
    Message = @'
Add the content schema — the honesty gate

Zod schemas that refuse content rather than rendering it badly. A metric
cannot exist without a source. A client is either named or described, never
both and never neither. A stack entry without a reason for being chosen will
not compile. Depth is required in proportion to the tier a project claims,
so a five-week build cannot be padded into a case study.

Bracketed placeholders are a legal value that fails the content check and
marks the build non-indexable, which makes a half-finished page impossible to
deploy by accident.
'@
  },
  @{
    Paths   = @('content')
    Message = @'
Add the project, decision and incident content

Every project across freelance, agency and product work, with the decision
log and failure archive that the thinking pages are built from.
'@
  },
  @{
    Paths   = @('app', 'components/sections', 'components/interactive', 'components/lab')
    Message = @'
Build the pages and sections

Home, work index and case studies, thinking, lab, about and contact, with
the CV opening from the footer. Server components throughout; the client
islands are the ones that need state — the command palette, the CV viewer,
the graph and the Ask box.
'@
  },
  @{
    Paths   = @('lib/graph.ts', 'lib/graph-layout.ts', 'lib/retrieval.ts', 'lib/reveal.ts')
    Message = @'
Add the knowledge graph and the retrieval engine

The graph is built at module load from validated content, so it cannot go
stale. Edges are typed as declared or computed, and there is deliberately no
value for "inferred from prose".

Retrieval is BM25 over the site's own sentences with a confidence floor and a
specificity gate, so the answerer quotes what is published and refuses what is
not. No model, so nothing to hallucinate with.
'@
  },
  @{
    Paths   = @('scripts', 'e2e', 'render.yaml', 'public')
    Message = @'
Add the verification harness and deploy config

Content gate, JS budget, retrieval probes, graph checks, and axe across every
route with project pages discovered from the work index rather than a
hardcoded list — a check that does not grow with the site is a check that
quietly stops checking.
'@
  }
)

foreach ($commit in $commits) {
  $present = $commit.Paths | Where-Object { Test-Path $_ }
  if (-not $present) { continue }

  git add -- $present
  # Everything in this group may already be ignored or unchanged.
  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { continue }

  $message = $commit.Message + "`n"
  $file = [System.IO.Path]::GetTempFileName()
  Set-Content -Path $file -Value $message -Encoding UTF8
  git commit --quiet -F $file
  Remove-Item $file
  Write-Host ("  committed  " + ($present -join ', '))
}

# Catch-all, so nothing is left out of the repository.
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  $message = @'
Add remaining project files

Everything the grouped commits did not cover. Present so the repository is
complete rather than tidy.
'@
  $file = [System.IO.Path]::GetTempFileName()
  Set-Content -Path $file -Value $message -Encoding UTF8
  git commit --quiet -F $file
  Remove-Item $file
  Write-Host '  committed  (remaining files)'
}

# ---------------------------------------------------------------------------
# 3. Remote
# ---------------------------------------------------------------------------

git remote add origin $RepoUrl

Write-Host ''
Write-Host '  Done. Every commit is authored by you, and only by you:'
Write-Host ''
git log --format='    %h  %an <%ae>  %s'
Write-Host ''
Write-Host '  Now push it yourself:'
Write-Host ''
Write-Host "      git push -u origin $Branch"
Write-Host ''
