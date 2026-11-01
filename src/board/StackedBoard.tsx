// The phone and narrow-window version of the board: the same pinned items, stacked in one column and
// joined by a single red string down the left edge. Tapping an item opens the same zoomed view.
import { m } from 'motion/react'
import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { PROFILE, SECTIONS, SKILLS, anchorSection } from '../data/caseFile'
import type { Anchor, SectionId } from '../data/caseFile'
import type { Viewport } from '../lib/useViewport'
import { faceFor } from './faces'
import { WIDE } from './layout'

/** Space on the left for the string. */
const GUTTER = 40
const GAP = 44
const TILT = [-1.2, 1, -0.8, 1.2, -1, 0.8]

interface Props {
  vp: Viewport
  active: SectionId | null
  examined: ReadonlySet<SectionId>
  onOpen: (id: SectionId) => void
}

export function StackedBoard({ vp, active, examined, onOpen }: Props) {
  const [lockedSkill, setLockedSkill] = useState<string | null>(null)
  const hot = useMemo(
    () => new Set<Anchor>(SKILLS.find((s) => s.id === lockedSkill)?.targets ?? []),
    [lockedSkill],
  )
  const hotSections = useMemo(() => new Set([...hot].map(anchorSection)), [hot])

  // Each item keeps its board design and is scaled to the column width, so it reads the same as on desktop.
  const column = Math.min(vp.w - GUTTER - 28, 460)
  let y = 0
  const placed = SECTIONS.map((s, i) => {
    const box = WIDE.items[s.id]
    const scale = Math.min(1, column / box.w)
    const item = { section: s, box, scale, top: y, w: box.w * scale, h: box.h * scale, rot: TILT[i % TILT.length] }
    y += item.h + GAP
    return item
  })
  const height = y - GAP
  const pins = placed.map((p) => ({ x: GUTTER - 6, y: p.top + 18 }))
  const string = pins.reduce(
    (d, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${d} Q ${i % 2 ? 6 : 16} ${(pins[i - 1].y + p.y) / 2} ${p.x} ${p.y}`),
    '',
  )

  return (
    <div className="fixed inset-0 overflow-y-auto overscroll-contain" inert={active !== null}>
      <div className="cork min-h-full px-3 pb-16 pt-14" onClick={() => setLockedSkill(null)}>
        <header className="mx-auto max-w-[500px] px-1 text-center">
          <p className="font-type text-[13px] uppercase tracking-[0.2em] text-[#f3e7cf]/80">Case file {PROFILE.caseNo}</p>
          <h1 className="mt-1 font-serif text-[30px] font-black leading-tight text-[#fbf3e2] [text-shadow:0_2px_6px_rgb(0_0_0/0.6)]">
            The case of {PROFILE.name}
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f3e7cf]/70">
            Tap any evidence to examine it
          </p>
        </header>

        <div
          className="-mx-3 mt-5 flex gap-3 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none]"
          role="group"
          aria-label="Skills. Select one to see where it was used."
        >
          {SKILLS.map((s, i) => {
            const on = lockedSkill === s.id
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                className="note flex h-[64px] w-[92px] shrink-0 items-center justify-center px-1.5 text-center transition-[rotate,scale] duration-200"
                style={{ rotate: on ? '0deg' : `${[-2, 2, -1, 2, -2][i % 5]}deg`, scale: on ? '1.06' : '1' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setLockedSkill(on ? null : s.id)
                }}
              >
                <span className="font-hand text-[20px] font-semibold leading-[0.95] text-ink">{s.label}</span>
              </button>
            )
          })}
        </div>

        <div className="relative mx-auto mt-6" style={{ width: GUTTER + column, height }}>
          <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={GUTTER} height={height} aria-hidden="true">
            <path
              d={string}
              fill="none"
              stroke="#b51c22"
              strokeWidth="2.6"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(2px 4px 2px rgb(0 0 0 / 0.45))' }}
            />
          </svg>

          {placed.map(({ section, box, scale, top, w, h, rot }) => {
            const Face = faceFor[section.id]
            const lifted = active === section.id
            const dimmed = lockedSkill !== null && !hotSections.has(section.id)
            const onKeyDown = (e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpen(section.id)
              }
            }
            return (
              <m.div
                key={section.id}
                role="button"
                tabIndex={0}
                aria-label={`Open ${section.label}`}
                data-item={section.id}
                className="board-item absolute cursor-pointer select-none"
                style={{ left: GUTTER, top, width: w, height: h, rotate: rot }}
                initial={false}
                animate={{ opacity: lifted ? 0 : 1 }}
                transition={{ opacity: lifted ? { duration: 0.05 } : { duration: 0.2, delay: 0.32 } }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onOpen(section.id)
                }}
                onKeyDown={onKeyDown}
              >
                <div
                  className={`transition-opacity duration-200${dimmed ? ' opacity-45' : ''}`}
                  style={{ width: box.w, height: box.h, transform: `scale(${scale})`, transformOrigin: '0 0' }}
                >
                  <Face hot={hot} />
                </div>
                {examined.has(section.id) && (
                  <span className="stamp stamp-sticker pointer-events-none absolute -right-2 -top-3 z-10 rotate-[12deg] text-[13px]">
                    Examined
                  </span>
                )}
              </m.div>
            )
          })}

          {pins.map((p) => (
            <span key={p.y} className="pin" style={{ left: p.x, top: p.y }} />
          ))}
        </div>

        <footer className="mx-auto mt-12 flex max-w-[500px] flex-col items-center gap-3 text-center">
          <a href={PROFILE.resume} target="_blank" rel="noreferrer" className="resume-btn">
            Resume PDF
          </a>
          <a href={`mailto:${PROFILE.email}`} className="font-mono text-[13px] text-[#f3e7cf] underline underline-offset-4">
            {PROFILE.email}
          </a>
        </footer>
      </div>
    </div>
  )
}
