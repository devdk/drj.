'use client'

import Link from 'next/link'
import { Logo } from './Logo'
import { useEffect, useRef, useState } from 'react'
import { cx } from '@/components/primitives'
import { site } from '@/lib/site.config'
import { requestCommandPalette } from './CommandPaletteLoader'

/* ==========================================================================
   NAVIGATION

   Matches spec §8, plus the primary CTA it was missing.

   No audience-router modal. The spec wanted an interstitial asking "what
   brings you here?" — that gates content behind a decision the visitor
   cannot make yet, and reordering sections from session state produces URLs
   that do not reproduce what you saw. Instead the audiences are served by
   persistent, linkable routes, and by the command palette.

   This is one of the three permitted surface-4 (backdrop-filter) elements.
   ========================================================================== */

/* ── NO LINKS AT ALL ───────────────────────────────────────────────────────

   The nav used to carry "Work" and "How it works". Both only scrolled the
   home page, and the hero already has those two exits as its buttons ("See
   the work", "Start a project") — so the nav was repeating the first screen
   back at the visitor. It is now the name, search, and the one action that
   matters from anywhere on the site.

   With nothing left to list, the mobile menu went too: a hamburger that
   opens onto one button is a tap spent finding out there was nothing behind
   it. Both actions sit in the bar at every width instead.

   The CV is in the footer (CvViewer); everything else is reachable from the
   command palette. */

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  /* Hide on scroll down, show on scroll up. Read-only scroll handling with
     no layout writes, so it cannot thrash. */
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > 320 && y > lastY.current)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-print-hide
      className={cx(
        'fixed inset-x-0 top-8 z-[200] transition-transform duration-[var(--duration-ui)] ease-[var(--ease-ui)]',
        hidden ? '-translate-y-full' : 'translate-y-0',
      )}
    >
      <div
        className={cx(
          'transition-colors duration-[var(--duration-ui)] ease-[var(--ease-ui)]',
          scrolled ? 'surface-4 border-x-0 border-t-0' : 'border-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-[var(--container-content)] items-center justify-between gap-4 px-[var(--spacing-gutter)]"
        >
          <Link href="/" className="-m-2 inline-flex items-center p-2 text-ink">
            <Logo className="h-[1.375rem] w-auto" />
            <span className="sr-only">{site.name}, home</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Command palette trigger. The keyboard shortcut is the real
                interface; this button exists so it is discoverable — and on
                a phone, where there is no ⌘K, it is the only way in. */}
            <button
              type="button"
              onClick={requestCommandPalette}
              className="flex size-10 items-center justify-center gap-2 rounded-full border border-hairline bg-white/[0.03] text-ink-3 transition-colors duration-[var(--duration-micro)] hover:border-hairline-strong hover:text-ink-2 sm:size-auto sm:px-3 sm:py-1.5"
              aria-label="Search the site. Keyboard shortcut: Control or Command K"
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5">
                <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <kbd aria-hidden="true" className="hidden font-mono text-[0.6875rem] tracking-wider sm:inline">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/#chapter-contact"
              className="rounded-full bg-accent px-4 py-2 text-[0.875rem] font-medium text-accent-ink transition-colors duration-[var(--duration-micro)] hover:bg-[#5af0f2]"
            >
              Start a project
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
