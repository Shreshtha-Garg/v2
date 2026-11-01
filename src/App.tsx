import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Board } from './board/Board'
import { StackedBoard } from './board/StackedBoard'
import { SECTIONS, neighbour, sectionById, sectionFromPath, sectionIndex } from './data/caseFile'
import type { SectionId } from './data/caseFile'
import { FocusPanel, preloadViews } from './focus/FocusPanel'
import type { ItemPlacement } from './focus/FocusPanel'
import { HintToast } from './hud/HintToast'
import { BottomHud, TopHud } from './hud/Hud'
import { Intro, markIntroSeen, shouldPlayIntro } from './intro/Intro'
import { navigate, usePathname } from './lib/router'
import { useExamined } from './lib/useExamined'
import { fitBoard, isStacked, useViewport } from './lib/useViewport'

const HOME_TITLE = 'Shreshtha Garg · Full Stack Developer'

export default function App() {
  const pathname = usePathname()
  const active = sectionFromPath(pathname)
  const vp = useViewport()
  const fit = fitBoard(vp)
  const stacked = isStacked(vp, fit)
  const examined = useExamined(active)

  const [intro, setIntro] = useState(() => shouldPlayIntro(pathname))
  const endIntro = useCallback(() => {
    markIntroSeen()
    setIntro(false)
  }, [])

  // The route is the source of truth. These refs remember where we came from, so the panel knows
  // which way to slide its content and which board item to shrink back into on close.
  const prev = useRef<SectionId | null>(active)
  const last = useRef<SectionId | null>(active)
  const dir = useRef(1)
  const pendingDir = useRef<number | null>(null)
  if (prev.current !== active) {
    if (prev.current && active) {
      dir.current = pendingDir.current ?? (Math.sign(sectionIndex(active) - sectionIndex(prev.current)) || 1)
    }
    pendingDir.current = null
    prev.current = active
  }
  if (active) last.current = active

  const open = (id: SectionId) => navigate(sectionById(id).path)
  const close = () => navigate('/')
  const step = (d: number) => {
    if (!active) return
    pendingDir.current = d
    navigate(neighbour(active, d).path)
  }

  // On the board the geometry is known exactly; in the stacked layout the item is measured where it sits.
  const getItemPlacement = (id: SectionId): ItemPlacement | null => {
    if (!stacked) {
      const b = fit.layout.items[id]
      const rect = { left: fit.left + b.x * fit.scale, top: fit.top + b.y * fit.scale, width: b.w * fit.scale, height: b.h * fit.scale }
      return { rect, rot: b.rot }
    }
    const el = document.querySelector<HTMLElement>(`[data-item="${id}"]`)
    if (!el) return null
    const r = el.getBoundingClientRect()
    if (r.bottom < 0 || r.top > window.innerHeight) return null
    return { rect: { left: r.left, top: r.top, width: r.width, height: r.height }, rot: 0 }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'Escape') {
        if (active) navigate('/')
        return
      }
      const jump = SECTIONS.find((s) => s.key === e.key)
      if (jump) {
        navigate(jump.path)
        return
      }
      if (active && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const d = e.key === 'ArrowRight' ? 1 : -1
        pendingDir.current = d
        navigate(neighbour(active, d).path)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  // Unknown paths fall back to the board.
  useEffect(() => {
    if (pathname !== '/' && !active) navigate('/', { replace: true })
  }, [pathname, active])

  useEffect(() => {
    document.title = active ? `${sectionById(active).label} · Shreshtha Garg` : HOME_TITLE
  }, [active])

  // Fetch the zoomed views in the background once the board is up.
  useEffect(() => {
    const timer = window.setTimeout(preloadViews, 1500)
    return () => window.clearTimeout(timer)
  }, [])

  // After closing, hand keyboard focus back to the item that was open, once it has landed on the board.
  const wasActive = useRef(active)
  useEffect(() => {
    const was = wasActive.current
    wasActive.current = active
    if (!was || active) return
    const timer = window.setTimeout(() => {
      document.querySelector<HTMLElement>(`[data-item="${was}"]`)?.focus({ preventScroll: true })
    }, 380)
    return () => window.clearTimeout(timer)
  }, [active])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="room fixed inset-0 overflow-hidden">
          {stacked ? (
            <StackedBoard vp={vp} active={active} examined={examined} onOpen={open} />
          ) : (
            <>
              <Board fit={fit} active={active} examined={examined} onOpen={open} />
              <div className="lamp pointer-events-none fixed inset-0 z-10" aria-hidden="true" />
            </>
          )}
          <AnimatePresence>
            {active && (
              <m.div
                key="backdrop"
                className="fixed inset-0 z-30 bg-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={close}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
          <FocusPanel
            active={active}
            last={last.current}
            dir={dir.current}
            vp={vp}
            stacked={stacked}
            getItemPlacement={getItemPlacement}
            onClose={close}
            onStep={step}
          />
          <TopHud examined={examined} compact={stacked} />
          {!stacked && <BottomHud active={active} />}
          <HintToast ready={!intro} dismissed={active !== null} touch={stacked || fit.layout.compact} aboveHud={!stacked} />
          <AnimatePresence>{intro && <Intro key="intro" onDone={endIntro} />}</AnimatePresence>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
