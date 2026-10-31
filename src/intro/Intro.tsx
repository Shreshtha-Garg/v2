// The opening shot: a dark room, a typewriter line, then the desk lamp clicks on and the board appears.
import { m } from 'motion/react'
import { useEffect, useState } from 'react'
import profileUrl from '../assets/profile.webp'

const KEY = 'case-2027-intro-seen'
const LINE = 'Opening case file #2027…'

/** Play the intro once per session, only on the home page, and never for people who prefer less motion. */
export function shouldPlayIntro(pathname: string): boolean {
  if (pathname !== '/') return false
  try {
    if (sessionStorage.getItem(KEY) === '1') return false
  } catch {
    // Storage blocked: play it; the worst case is seeing it again next visit.
  }
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    // Storage blocked; nothing to remember it in.
  }
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })
}

export function Intro({ onDone }: { onDone: () => void }) {
  const [typed, setTyped] = useState(0)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTyped((n) => {
        if (n >= LINE.length) window.clearInterval(timer)
        return Math.min(n + 1, LINE.length)
      })
    }, 36)
    return () => window.clearInterval(timer)
  }, [])

  // Wait for real loading (fonts and the photo), at least ~1 s for the effect and never more than ~2.4 s,
  // then switch the lamp on and hand over to the board.
  useEffect(() => {
    let cancelled = false
    const ready = Promise.all([wait(1000), document.fonts?.ready ?? Promise.resolve(), loadImage(profileUrl)])
    Promise.race([ready, wait(2400)]).then(async () => {
      if (cancelled) return
      setLit(true)
      await wait(700)
      if (!cancelled) onDone()
    })
    return () => {
      cancelled = true
    }
  }, [onDone])

  // Any key or tap skips straight to the board.
  useEffect(() => {
    const skip = () => onDone()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onDone])

  return (
    <m.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden bg-[#050403]"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      role="status"
      aria-label="Loading the case file"
    >
      <m.div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 48% 62% at 50% 16%, rgb(255 214 150 / 0.3), transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={lit ? { opacity: [0, 0.95, 0.2, 0.7, 1] } : { opacity: 0 }}
        transition={{ duration: 0.55, times: [0, 0.2, 0.4, 0.6, 1] }}
      />

      <svg
        viewBox="0 0 200 190"
        className="absolute left-1/2 top-0 h-[150px] w-[158px] -translate-x-1/2"
        aria-hidden="true"
      >
        <line x1="100" y1="0" x2="100" y2="72" stroke="#2c2621" strokeWidth="3" />
        <m.ellipse
          cx="100"
          cy="112"
          rx="22"
          ry="10"
          initial={false}
          animate={{ fill: lit ? '#ffe2a8' : '#2b2620' }}
          transition={{ duration: 0.2 }}
        />
        <path d="M56 112 L80 70 H120 L144 112 Z" fill="#1b1814" stroke="#3a332b" strokeWidth="2" />
        <m.g initial={false} animate={{ y: lit ? [0, 12, 0] : 0 }} transition={{ duration: 0.3 }}>
          <line x1="130" y1="104" x2="130" y2="150" stroke="#8d8577" strokeWidth="1.5" strokeDasharray="2 3" />
          <circle cx="130" cy="154" r="4.5" fill="#b5ab98" />
        </m.g>
      </svg>

      <p className="relative font-type text-[18px] tracking-[0.12em] text-wall">
        {LINE.slice(0, typed)}
        <span className="ml-0.5 inline-block w-[0.6em] animate-pulse text-string">▍</span>
      </p>
      <div className="relative mt-6 h-[3px] w-[220px] overflow-hidden rounded-full bg-white/10">
        <m.div
          className="h-full origin-left bg-string"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />
      </div>
      <p className="absolute bottom-8 font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
        Click or press any key to skip
      </p>
    </m.div>
  )
}
