// Small pieces the zoomed views share: chips, ink buttons, stamps, photos that enlarge.
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { ExternalLink, Fact, Shot } from '../../data/caseFile'

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1">
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
    <div className="flex flex-wrap gap-1.5">
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
    <ul className="space-y-1.5">
      {items.map((b) => (
        <li key={b} className="flex gap-2.5 text-body leading-normal text-ink">
          <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-string" aria-hidden="true" />
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
      <div className={`mt-1.5 grid gap-x-4 gap-y-2 ${facts.length > 3 ? 'grid-cols-2 tab:grid-cols-4' : 'grid-cols-3'}`}>
        {facts.map((f) => (
          <div key={f.label}>
            <p className="font-serif text-[22px] font-black leading-tight text-ink">{f.value}</p>
            <p className="text-[12.5px] leading-snug text-ink-soft">{f.label}</p>
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

interface PhotoProps {
  shot: Shot
  /** Further screenshots, seen by paging through the enlarged view. */
  more?: Shot[]
  /** Crop to this aspect ratio, e.g. "16/9". The enlarged view always shows the whole image. */
  aspect?: string
  className?: string
  showCaption?: boolean
}

/** A screenshot in a newspaper photo frame. Click to see it full size. */
export function Photo({ shot, more = [], aspect, className = '', showCaption = true }: PhotoProps) {
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
        className="photo-frame relative block w-full cursor-zoom-in"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge screenshot: ${shot.alt}`}
      >
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          decoding="async"
          className={`block h-auto w-full${aspect ? ' object-cover' : ''}`}
          style={aspect ? { aspectRatio: aspect, objectPosition: shot.focus ?? '50% 0%' } : undefined}
        />
        {more.length > 0 && (
          <span className="absolute bottom-2 right-2 rounded-[3px] bg-ink/85 px-1.5 py-0.5 font-mono text-small text-paper">
            +{more.length} more
          </span>
        )}
      </button>
      {showCaption && <figcaption className="caption mt-1.5">{shot.caption}</figcaption>}
      <Lightbox shots={[shot, ...more]} open={open} onClose={close} />
    </figure>
  )
}

function Lightbox({ shots, open, onClose }: { shots: Shot[]; open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const count = shots.length
  const shot = shots[index]

  useEffect(() => {
    if (open) setIndex(0)
  }, [open])

  useEffect(() => {
    if (!open) return
    // Capture phase on window runs before the app's own key handler, so while a photo is
    // enlarged the keys act on the photo and never switch sections or close the panel.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') return
      e.stopPropagation()
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowRight') {
        setIndex((i) => (i + 1) % count)
      } else if (e.key === 'ArrowLeft') {
        setIndex((i) => (i - 1 + count) % count)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose, count])

  const page = (step: number) => (e: MouseEvent) => {
    e.stopPropagation()
    setIndex((i) => (i + step + count) % count)
  }

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
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            className="max-h-[78vh] max-w-full rounded-[2px] shadow-2xl"
            initial={{ scale: 0.96, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
          />
          <p className="mt-3 max-w-3xl text-center font-text text-body italic text-wall">{shot.caption}</p>
          {count > 1 && (
            <div className="mt-2 flex items-center gap-2 font-mono text-small text-wall">
              <button type="button" className="hud-link" onClick={page(-1)} aria-label="Previous screenshot">
                ←
              </button>
              <span>
                {index + 1} / {count}
              </span>
              <button type="button" className="hud-link" onClick={page(1)} aria-label="Next screenshot">
                →
              </button>
            </div>
          )}
          <button type="button" autoFocus className="hud-link absolute right-5 top-5" onClick={onClose}>
            Close ✕
          </button>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
