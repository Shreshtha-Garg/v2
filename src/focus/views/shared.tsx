// Small pieces the zoomed views share: chips, ink buttons, stamps, photos that enlarge.
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { ExternalLink, Fact, Shot } from '../../data/caseFile'

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="chip">
          {item}
        </li>
      ))}
    </ul>
  )
}

export function Links({ links }: { links: ExternalLink[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="ink-btn">
          {l.label} ↗
        </a>
      ))}
    </div>
  )
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((b) => (
        <li key={b} className="flex gap-3 text-[16px] leading-relaxed text-ink">
          <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-string" aria-hidden="true" />
          {b}
        </li>
      ))}
    </ul>
  )
}

export function Stamp({
  children,
  tone = 'red',
  className = '',
}: {
  children: ReactNode
  tone?: 'red' | 'amber' | 'green'
  className?: string
}) {
  const toneClass = tone === 'amber' ? ' stamp-amber' : tone === 'green' ? ' stamp-green' : ''
  return <span className={`stamp${toneClass} ${className}`}>{children}</span>
}

export function FactBox({ facts, title = 'At a glance' }: { facts: Fact[]; title?: string }) {
  return (
    <div className="factbox">
      <p className="factbox-title">{title}</p>
      <div className={`mt-3 grid gap-x-6 gap-y-4 ${facts.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
        {facts.map((f) => (
          <div key={f.label}>
            <p className="font-serif text-[30px] font-black leading-none text-ink">{f.value}</p>
            <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PaperClip({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 64" className={className} aria-hidden="true">
      <path
        d="M8 52 V14 a6 6 0 0 1 12 0 V50 a9 9 0 0 1 -18 0 V18"
        fill="none"
        stroke="#8d939b"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A screenshot in a newspaper photo frame. Click to see it full size. */
export function Photo({ shot, className = '', showCaption = true }: { shot: Shot; className?: string; showCaption?: boolean }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const close = () => {
    setOpen(false)
    buttonRef.current?.focus({ preventScroll: true })
  }

  return (
    <figure className={className}>
      <button
        ref={buttonRef}
        type="button"
        className="photo-frame block w-full cursor-zoom-in"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge screenshot: ${shot.alt}`}
      >
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          decoding="async"
          className="block h-auto w-full"
        />
      </button>
      {showCaption && <figcaption className="caption mt-2">{shot.caption}</figcaption>}
      <Lightbox shot={shot} open={open} onClose={close} />
    </figure>
  )
}

function Lightbox({ shot, open, onClose }: { shot: Shot; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    // Capture phase on window runs before the app's own Esc handler, so Esc closes only the photo.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      e.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label={shot.alt}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/85 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <m.img
            src={shot.src}
            alt={shot.alt}
            className="max-h-[80vh] max-w-full rounded-[2px] shadow-2xl"
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
          />
          <p className="mt-4 max-w-3xl text-center font-text text-[16px] italic text-wall">{shot.caption}</p>
          <button type="button" autoFocus className="hud-link absolute right-5 top-5" onClick={onClose}>
            Close ✕
          </button>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
