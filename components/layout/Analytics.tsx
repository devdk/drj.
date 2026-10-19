'use client'

import { useEffect, useState } from 'react'

/* ==========================================================================
   ANALYTICS — Google Analytics 4, only with the visitor's consent

   Off entirely unless NEXT_PUBLIC_GA_ID is set at build time (Render →
   Environment), so local builds, previews and the test suite never load it.

   UK and EU visitors are a large part of who this site is for, and analytics
   cookies need consent under UK GDPR / PECR. So nothing from Google loads
   until the visitor says yes: no script, no cookie, no ping. "No thanks" is
   remembered and the banner does not come back; "Allow" is remembered and
   GA loads on every later visit without asking again.

   The choice lives in localStorage on this device only. Clearing site data
   brings the question back, which is the correct behaviour.
   ========================================================================== */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const KEY = 'drj-analytics-consent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function loadGa(id: string) {
  if (window.gtag) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { anonymize_ip: true })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)
}

function readChoice(): 'granted' | 'denied' | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

function saveChoice(v: 'granted' | 'denied') {
  try {
    localStorage.setItem(KEY, v)
  } catch {
    /* Private mode: the choice holds for this page view only. */
  }
}

export function Analytics() {
  const [ask, setAsk] = useState(false)

  useEffect(() => {
    if (!GA_ID) return
    const choice = readChoice()
    if (choice === 'granted') loadGa(GA_ID)
    else if (choice === null) setAsk(true)
  }, [])

  if (!GA_ID || !ask) return null

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className="fixed inset-x-3 bottom-3 z-[550] mx-auto flex max-w-xl flex-col gap-3 rounded-[var(--radius-lg)] border border-hairline-strong bg-canvas-2/95 p-4 text-[0.875rem] leading-relaxed text-ink-2 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur sm:flex-row sm:items-center sm:gap-4"
    >
      <p className="flex-1">
        Can I count your visit with Google Analytics? It helps me see which work people read. No ads, nothing
        sold.
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => {
            saveChoice('denied')
            setAsk(false)
          }}
          className="rounded-full border border-hairline px-4 py-2 text-ink-2 transition-colors hover:text-ink"
        >
          No thanks
        </button>
        <button
          type="button"
          onClick={() => {
            saveChoice('granted')
            setAsk(false)
            if (GA_ID) loadGa(GA_ID)
          }}
          className="rounded-full bg-accent px-4 py-2 font-medium text-accent-ink"
        >
          Allow
        </button>
      </div>
    </div>
  )
}
