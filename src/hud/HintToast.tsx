import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'

const KEY = 'case-2027-hint-seen'

function seenBefore() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

interface Props {
  /** False while the intro is still playing; the tip waits for it. */
  ready: boolean
  /** True once a section opens; the tip is no longer needed. */
  dismissed: boolean
  /** Tablets and phones: no hovering, no number keys. */
  touch: boolean
  /** Sit above the bottom bar when there is one. */
  aboveHud: boolean
}

/** A one-time tip on how to use the board. Hides after a few seconds or as soon as a section opens. */
export function HintToast({ ready, dismissed, touch, aboveHud }: Props) {
  const [visible, setVisible] = useState(() => !seenBefore())

  useEffect(() => {
    if (!visible || !ready) return
    const timer = window.setTimeout(() => setVisible(false), 9000)
    return () => window.clearTimeout(timer)
  }, [visible, ready])

  useEffect(() => {
    if (dismissed) setVisible(false)
  }, [dismissed])

  useEffect(() => {
    if (visible) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      // Storage blocked; the tip may show again next visit.
    }
  }, [visible])

  const text = touch
    ? 'Tap any evidence to examine it · Tap a sticky note to trace a skill'
    : 'Click any evidence to examine it · Hover a sticky note to trace a skill · Keys 1–6 jump'

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 ${aboveHud ? 'bottom-[60px]' : 'bottom-5'}`}
    >
      <AnimatePresence>
        {visible && ready && !dismissed && (
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-md border border-white/10 bg-[#14110e]/92 px-4 py-2 text-center font-mono text-[12px] tracking-[0.08em] text-wall shadow-lg"
          >
            {text}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}
