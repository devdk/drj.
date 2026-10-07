"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@/components/primitives";

/* ==========================================================================
   CV VIEWER — the footer's CV button, and the sheet it opens

   The CV used to be a page. A page is the wrong shape for it: the people who
   want it — a recruiter, an HR lead, a project lead forwarding it upward —
   want the DOCUMENT, to read, download or pass on, and a web page is a thing
   they then have to turn back into a document. So the CV is the real PDF,
   opened over whatever page you were on.

   ── THE ANIMATION ─────────────────────────────────────────────────────────

   The sheet grows out of the button that opened it, so the eye never loses
   track of where it came from, and shrinks back into it on close. Uniform
   scale only — a non-uniform scale would squash the text mid-flight — then
   the paper settles a beat later, and the PDF fades up once it has actually
   loaded rather than flashing in half-drawn. Under reduced motion it is a
   short fade and nothing moves.

   ── WHERE THE PDF CANNOT BE FRAMED ────────────────────────────────────────

   `navigator.pdfViewerEnabled` is false where the browser has no inline PDF
   viewer — Chrome on Android, most notably. Framing it there shows a blank
   box or triggers a download nobody asked for, so those browsers get the
   same sheet with an "Open the PDF" button that hands it to the system
   viewer, which is what they are good at.

   ── SHARE ─────────────────────────────────────────────────────────────────

   The native share sheet, with the FILE when the platform can take one —
   that is what lets someone send the CV itself in a chat or an email rather
   than a link to a portfolio. The file is fetched when the sheet opens, not
   when Share is pressed, because share() must run inside the click's user
   activation and a network wait in between can spend it. Where there is no
   share sheet at all, the button copies a link that reopens this viewer.

   ── ACCESSIBILITY ─────────────────────────────────────────────────────────

   A native <dialog> opened with showModal(): the rest of the page becomes
   inert, focus is contained, and Escape is a `cancel` event — intercepted so
   it plays the close animation rather than vanishing. Focus goes to Close on
   open and back to the button that opened it on close. Status messages
   ("Link copied") are announced through a polite live region.

   ── OPENING IT FROM ELSEWHERE ─────────────────────────────────────────────

   Any link to `#cv` opens it — the command palette, an Ask citation, an old
   /cv link (redirected in next.config.ts) or a link someone was sent. Links
   are intercepted rather than left to `hashchange`, because client-side
   navigation pushes history without firing it.
   ========================================================================== */

type Props = {
  href: string;
  fileName: string;
  /** 0 when the file is missing from /public — a placeholder build. */
  bytes: number;
  /** The person, for the dialog title and the share text. */
  name: string;
};

/* Slower out of the gate than the site's UI ease, so the flight from the
   button is actually seen rather than over in the first frame. */
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* The paper: a few ruled lines that read as "a document" at a glance. Purely
   decorative — the button and the dialog say in words what it is. */
function SheetLines({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx("flex flex-col gap-[0.32em]", className)}
    >
      <span className="h-[0.5em] w-[46%] rounded-full bg-current opacity-80" />
      <span className="h-[0.22em] w-[70%] rounded-full bg-current opacity-35" />
      <span className="mt-[0.4em] h-[0.22em] w-full rounded-full bg-current opacity-25" />
      <span className="h-[0.22em] w-[88%] rounded-full bg-current opacity-25" />
      <span className="h-[0.22em] w-[94%] rounded-full bg-current opacity-25" />
      <span className="mt-[0.4em] h-[0.22em] w-[60%] rounded-full bg-current opacity-35" />
      <span className="h-[0.22em] w-full rounded-full bg-current opacity-25" />
      <span className="h-[0.22em] w-[82%] rounded-full bg-current opacity-25" />
    </span>
  );
}

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cx("size-[1.125rem] shrink-0", className)}
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICON = {
  download: "M10 3v10m0 0-4-4m4 4 4-4M4 16h12",
  share: "M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M5 10H4v7h12v-7h-1",
  external: "M11 4h5v5m0-5-7 7M8 5H4v11h11v-4",
  close: "M5 5l10 10M15 5 5 15",
};

export function CvViewer({ href, fileName, bytes, name }: Props) {
  const available = bytes > 0;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<File | null>(null);
  const closingRef = useRef(false);

  /* Mounted once, on first open, then kept — reopening should be instant. */
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [canFrame, setCanFrame] = useState(true);
  const [canShare, setCanShare] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    /* Undefined in older browsers — treat that as "can frame", which is what
       every desktop browser without the property does anyway. */
    setCanFrame(navigator.pdfViewerEnabled !== false);
    setCanShare(typeof navigator.share === "function");
  }, []);

  const open = useCallback(
    (fromTrigger: boolean) => {
      const dialog = dialogRef.current;
      const panel = panelRef.current;
      if (!dialog || !panel || dialog.open) return;
      closingRef.current = false;
      setMounted(true);
      setStatus("");
      dialog.showModal();
      closeRef.current?.focus();

      if (available && !fileRef.current) {
        fetch(href)
          .then((res) =>
            res.ok ? res.blob() : Promise.reject(new Error(String(res.status))),
          )
          .then((blob) => {
            fileRef.current = new File([blob], fileName, {
              type: "application/pdf",
            });
          })
          .catch(() => {
            /* Share falls back to sharing the link. */
          });
      }

      if (prefersReducedMotion()) {
        panel.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 180,
          easing: "linear",
        });
        return;
      }

      /* Grow out of the button. Without one (opened from a link), rise from
         just below where the sheet will sit. */
      const to = panel.getBoundingClientRect();
      const trigger = triggerRef.current;
      let from = "translate3d(0, 6vh, 0) scale(0.94)";
      if (fromTrigger && trigger) {
        const rect = trigger.getBoundingClientRect();
        const scale = Math.min(0.9, Math.max(0.12, rect.width / to.width));
        const dx = rect.left + rect.width / 2 - (to.left + to.width / 2);
        const dy = rect.top + rect.height / 2 - (to.top + to.height / 2);
        from = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
      }
      panel.animate(
        [
          { transform: from, opacity: 0, borderRadius: "2rem" },
          { opacity: 1, offset: 0.35 },
          { transform: "none", opacity: 1, borderRadius: "var(--radius-xl)" },
        ],
        { duration: 680, easing: EASE },
      );
    },
    [available, fileName, href],
  );

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog?.open || closingRef.current) return;
    closingRef.current = true;

    const finish = () => {
      dialog.removeAttribute("data-closing");
      dialog.close();
      closingRef.current = false;
      triggerRef.current?.focus({ preventScroll: true });
      if (window.location.hash === "#cv") {
        history.replaceState(
          history.state,
          "",
          window.location.pathname + window.location.search,
        );
      }
    };

    if (!panel) return finish();
    dialog.setAttribute("data-closing", "");

    let to = "translate3d(0, 4vh, 0) scale(0.96)";
    const trigger = triggerRef.current;
    const rect = trigger?.getBoundingClientRect();
    /* Only shrink back into the button if it is on screen to receive it. */
    if (rect && rect.bottom > 0 && rect.top < window.innerHeight) {
      const from = panel.getBoundingClientRect();
      const scale = Math.min(0.9, Math.max(0.12, rect.width / from.width));
      const dx = rect.left + rect.width / 2 - (from.left + from.width / 2);
      const dy = rect.top + rect.height / 2 - (from.top + from.height / 2);
      to = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
    }

    const animation = prefersReducedMotion()
      ? panel.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 140,
          fill: "forwards",
        })
      : panel.animate(
          [
            { transform: "none", opacity: 1 },
            { opacity: 1, offset: 0.6 },
            { transform: to, opacity: 0 },
          ],
          {
            duration: 420,
            easing: "cubic-bezier(0.55, 0, 0.75, 0.2)",
            fill: "forwards",
          },
        );
    animation.onfinish = () => {
      finish();
      animation.cancel();
    };
  }, []);

  /* #cv anywhere opens it: on arrival, on hash changes, and on any in-page
     link pointing at it. */
  useEffect(() => {
    if (window.location.hash === "#cv") open(false);

    function onHash() {
      if (window.location.hash === "#cv") open(false);
    }
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor) return;
      const url = new URL(
        (anchor as HTMLAnchorElement).href,
        window.location.href,
      );
      if (url.hash !== "#cv" || url.origin !== window.location.origin) return;
      event.preventDefault();
      event.stopPropagation();
      open(false);
    }

    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick, true);
    };
  }, [open]);

  async function share() {
    const link = `${window.location.origin}/#cv`;
    const title = `${name} — CV`;
    try {
      const file = fileRef.current;
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title, text: title });
        return;
      }
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      setStatus("Link copied");
    } catch (error) {
      /* Dismissing the share sheet is not a failure. */
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(link);
        setStatus("Link copied");
      } catch {
        setStatus("Could not share — the link is " + link);
      }
    }
  }

  const meta = available ? `PDF · ${formatBytes(bytes)}` : "PDF";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => open(true)}
        className="cv-trigger group inline-flex items-center gap-4 rounded-[var(--radius-md)] border border-hairline bg-canvas-2/50 py-3 pl-3 pr-5 text-left transition-colors duration-300 hover:border-hairline-strong"
      >
        <span
          aria-hidden="true"
          className="cv-sheets relative block h-14 w-11 shrink-0"
        >
          <span className="cv-sheet-back absolute inset-0 rounded-[3px] bg-[color-mix(in_oklab,#f1efea_55%,transparent)]" />
          <span className="cv-sheet-front absolute inset-0 overflow-hidden rounded-[3px] bg-[#f1efea] p-[0.4rem] text-[5px] text-[#0c0d0f] shadow-[0_6px_18px_-6px_rgb(0_0_0/0.55)]">
            <SheetLines />
          </span>
        </span>
        <span className="flex flex-col">
          <span className="text-[0.9375rem] font-medium text-ink">
            Curriculum vitae
          </span>
          <span className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
            {meta} · view, download, share
          </span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="cv-title"
        className="cv-dialog"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          /* A click on the dialog itself is a click on the margin around the
             sheet — the backdrop, as far as the visitor can tell. */
          if (event.target === dialogRef.current) close();
        }}
      >
        <div
          ref={panelRef}
          className="surface-2 cv-panel mx-auto flex h-full w-full max-w-[60rem] origin-center flex-col overflow-hidden rounded-[var(--radius-xl)] shadow-[0_40px_120px_-30px_rgb(0_0_0/0.75)]"
        >
          {/* ── Toolbar ─────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3 border-b border-hairline px-4 py-3 sm:px-6">
            <div className="order-1 mr-auto min-w-0">
              <h2
                id="cv-title"
                className="truncate text-[1rem] font-medium text-ink"
              >
                {name} — CV
              </h2>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
                {meta}
              </p>
            </div>

            {/* Below sm the actions take their own row and Close stays beside
                the title, where a thumb expects it. */}
            <div className="order-3 flex w-full items-center gap-2 sm:order-2 sm:w-auto">
              {available ? (
                <>
                  <a
                    href={href}
                    download={fileName}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 sm:flex-none text-[0.875rem] font-medium text-accent-ink transition-transform duration-[var(--duration-micro)] active:scale-[0.97]"
                  >
                    <Icon d={ICON.download} />
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={share}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-hairline-strong px-4 sm:flex-none text-[0.875rem] font-medium text-ink transition-colors duration-[var(--duration-micro)] hover:bg-[color-mix(in_oklab,var(--color-ink)_6%,transparent)]"
                  >
                    <Icon d={ICON.share} />
                    {canShare ? "Share" : "Copy link"}
                  </button>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className="hidden size-10 place-items-center rounded-full border border-hairline-strong text-ink-2 transition-colors duration-[var(--duration-micro)] hover:text-ink sm:grid"
                  >
                    <Icon d={ICON.external} />
                    <span className="sr-only">Open the PDF in a new tab</span>
                  </a>
                </>
              ) : null}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="order-2 grid size-10 shrink-0 place-items-center rounded-full border border-hairline-strong text-ink-2 transition-colors duration-[var(--duration-micro)] hover:text-ink sm:order-3"
            >
              <Icon d={ICON.close} />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            {status}
          </p>
          {status ? (
            <p
              aria-hidden="true"
              className="border-b border-hairline bg-[color-mix(in_oklab,var(--color-accent)_10%,transparent)] px-6 py-2 text-[0.8125rem] text-ink"
            >
              {status}
            </p>
          ) : null}

          {/* ── The sheet ───────────────────────────────────────────── */}
          <div className="cv-stage relative min-h-0 flex-1 overflow-hidden p-3 sm:p-6">
            <div className="cv-paper relative mx-auto h-full w-full max-w-[52rem] overflow-hidden rounded-[var(--radius-md)] bg-[#f1efea] text-[#0c0d0f]">
              {/* Shown until the PDF has drawn, and as the face of the sheet
                  where it cannot be framed. */}
              <div
                aria-hidden={available && canFrame ? "true" : undefined}
                className={cx(
                  "absolute inset-0 flex flex-col p-[8%] transition-opacity duration-500",
                  loaded && canFrame && available ? "opacity-0" : "opacity-100",
                )}
              >
                <SheetLines
                  className={cx(
                    "text-[clamp(9px,1.6vw,15px)]",
                    available && canFrame && "cv-shimmer",
                  )}
                />
                <SheetLines className="mt-[2em] text-[clamp(9px,1.6vw,15px)] opacity-70" />

                {!available ? (
                  <p className="mt-auto max-w-md font-mono text-[0.8125rem] leading-relaxed">
                    [CV PDF not added yet — save it as
                    public/dheeraj-kumar-cv.pdf]
                  </p>
                ) : !canFrame ? (
                  <div className="mt-auto">
                    <p className="max-w-sm text-[0.9375rem] leading-relaxed">
                      This browser opens PDFs in its own viewer.
                    </p>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener"
                      className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-[#0c0d0f] px-5 text-[0.9375rem] font-medium text-[#f1efea]"
                    >
                      Open the PDF
                      <Icon d={ICON.external} />
                    </a>
                  </div>
                ) : null}
              </div>

              {mounted && available && canFrame ? (
                <iframe
                  src={`${href}#toolbar=0&navpanes=0&view=FitH`}
                  title={`${name} — CV (PDF)`}
                  onLoad={() => setLoaded(true)}
                  className={cx(
                    "absolute inset-0 h-full w-full border-0 transition-opacity duration-500",
                    loaded ? "opacity-100" : "opacity-0",
                  )}
                />
              ) : null}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
