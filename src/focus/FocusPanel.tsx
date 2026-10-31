import { AnimatePresence, m } from 'motion/react'
import type { Variants } from 'motion/react'
import { Suspense, lazy, useEffect, useRef } from 'react'
import { SECTIONS, sectionById, sectionIndex } from '../data/caseFile'
import type { SectionId } from '../data/caseFile'
import { panelRect } from '../lib/useViewport'
import type { Rect, Viewport } from '../lib/useViewport'

// The section views (with their screenshots, map and form) load in their own chunk, so the board paints first.
const loadViews = () => import('./views')
const SectionView = lazy(() => loadViews().then((mod) => ({ default: mod.SectionView })))

/** Fetch the views in the background once the board is up, so the first zoom is instant. */
export function preloadViews() {
  void loadViews()
}

/** Where a board item sits on screen right now, and how it is tilted. */
export interface ItemPlacement {
  rect: Rect
  rot: number
}

interface Flip {
  x: number
  y: number
  sx: number
  sy: number
  rot: number
}

/** Each panel keeps the material of the item it was picked up from. */
const SKIN: Record<SectionId, string> = {
  about: 'paper-manila',
  projects: 'paper-news',
  experience: 'paper-parchment',
  achievements: 'paper-news',
  research: 'paper-manila',
  // The tip line is a clipboard and a pinned card, so it sits on cork like the board.
  contact: 'cork',
}

const panelVariants: Variants = {
  item: (f: Flip) => ({
    x: f.x,
    y: f.y,
    scaleX: f.sx,
    scaleY: f.sy,
    rotate: f.rot,
    transition: { type: 'spring', stiffness: 320, damping: 34 },
  }),
  open: {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 230, damping: 28 },
  },
}

const contentVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 56 }),
  shown: { opacity: 1, x: 0, transition: { duration: 0.26, ease: 'easeOut' } },
  leave: (dir: number) => ({ opacity: 0, x: dir * -56, transition: { duration: 0.14 } }),
}

interface Props {
  active: SectionId | null
  /** The most recently open section: where the panel shrinks back to on close. */
  last: SectionId | null
  /** +1 when moving forward through the sections, -1 when moving back. */
  dir: number
  vp: Viewport
  /** Phone layout: the panel becomes a full-screen sheet. */
  stacked: boolean
  getItemPlacement: (id: SectionId) => ItemPlacement | null
  onClose: () => void
  onStep: (step: number) => void
}

export function FocusPanel({ active, last, dir, vp, stacked, getItemPlacement, onClose, onStep }: Props) {
  const rect = panelRect(vp, stacked)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isOpen = active !== null

  useEffect(() => {
    if (isOpen) closeRef.current?.focus({ preventScroll: true })
  }, [isOpen])

  // The transform that lays the open panel exactly over a board item, so opening reads as picking it up.
  // If the item is off screen (a phone scrolled elsewhere), the panel grows from the middle instead.
  const flipTo = (id: SectionId | null): Flip => {
    if (!id) return { x: 0, y: 0, sx: 1, sy: 1, rot: 0 }
    const placement = getItemPlacement(id)
    if (!placement) return { x: rect.width * 0.1, y: rect.height * 0.12, sx: 0.8, sy: 0.76, rot: 0 }
    const { rect: r, rot } = placement
    return {
      x: r.left - rect.left,
      y: r.top - rect.top,
      sx: r.width / rect.width,
      sy: r.height / rect.height,
      rot,
    }
  }

  return (
    <AnimatePresence custom={flipTo(last)}>
      {active && (
        <m.section
          key="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="panel-title"
          className={`${SKIN[active]} fixed ${stacked ? 'z-[55]' : 'z-40'} overflow-hidden rounded-[3px] shadow-panel`}
          style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, transformOrigin: '0 0' }}
          custom={flipTo(active)}
          variants={panelVariants}
          initial="item"
          animate="open"
          exit="item"
        >
          {/* Content fades in after the zoom and out before it, so text is never seen stretched. */}
          <m.div
            className="flex h-full flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-ink/20 bg-[#f7f2e7]/90 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span id="panel-title" className="dymo text-[13px]">
                  {sectionById(active).label}
                </span>
                <span className="hidden font-mono text-[12px] uppercase tracking-[0.2em] text-ink-soft md:inline">
                  Evidence {sectionIndex(active) + 1} of {SECTIONS.length}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" className="panel-btn" onClick={() => onStep(-1)} aria-label="Previous evidence">
                  ←
                </button>
                <button type="button" className="panel-btn" onClick={() => onStep(1)} aria-label="Next evidence">
                  →
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  className="panel-btn"
                  onClick={onClose}
                  aria-label="Back to board"
                >
                  <span className="hidden sm:inline">Back to board</span>
                  <span className="sm:hidden" aria-hidden="true">
                    ✕
                  </span>
                  <kbd className="kbd hidden sm:inline">Esc</kbd>
                </button>
              </div>
            </header>
            <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
              {/* Each section starts at its top: reset the shared scroller once the old one has slid out. */}
              <AnimatePresence
                mode="wait"
                custom={dir}
                initial={false}
                onExitComplete={() => scrollRef.current?.scrollTo({ top: 0 })}
              >
                <m.div key={active} custom={dir} variants={contentVariants} initial="enter" animate="shown" exit="leave">
                  <Suspense fallback={<p className="px-8 py-10 font-type text-[16px] text-ink-soft">Pulling the file…</p>}>
                    <SectionView id={active} />
                  </Suspense>
                </m.div>
              </AnimatePresence>
            </div>
          </m.div>
        </m.section>
      )}
    </AnimatePresence>
  )
}
