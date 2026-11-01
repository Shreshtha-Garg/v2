import { AnimatePresence, m } from 'motion/react'
import { SKILLS } from '../data/caseFile'
import type { SectionId } from '../data/caseFile'
import { noteOrigin, stringPath } from './layout'
import type { BoardLayout } from './layout'

const STRING = '#b51c22'
const STRING_HOT = '#ff3b3b'

interface Props {
  layout: BoardLayout
  hoveredItem: SectionId | null
  activeSkill: string | null
}

export function Strings({ layout, hoveredItem, activeSkill }: Props) {
  const { stage, strings, anchors } = layout
  const skillIndex = SKILLS.findIndex((s) => s.id === activeSkill)
  const skill = skillIndex >= 0 ? SKILLS[skillIndex] : null
  // User-space filter regions, so perfectly straight strings (zero-size bounding boxes) still render.
  const filterBox = { filterUnits: 'userSpaceOnUse' as const, x: -60, y: -60, width: stage.w + 120, height: stage.h + 120 }

  return (
    <svg
      className="pointer-events-none absolute inset-0 overflow-visible"
      width={stage.w}
      height={stage.h}
      viewBox={`0 0 ${stage.w} ${stage.h}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="string-shadow" {...filterBox}>
          <feDropShadow dx="2" dy="5" stdDeviation="2.2" floodColor="#000" floodOpacity="0.5" />
        </filter>
        <filter id="string-glow" {...filterBox}>
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {strings.map((s) => {
        // Hovering the dossier lights every string; hovering an item lights its own.
        const hot = hoveredItem === s.section || hoveredItem === 'about'
        return (
          <m.path
            key={s.section}
            fill="none"
            strokeLinecap="round"
            filter={hot ? 'url(#string-glow)' : 'url(#string-shadow)'}
            initial={false}
            animate={{
              d: stringPath(s.from, s.to, hot),
              stroke: hot ? STRING_HOT : STRING,
              strokeWidth: hot ? 3.6 : 2.6,
            }}
            transition={{ d: { type: 'spring', stiffness: 260, damping: 12 }, default: { duration: 0.2 } }}
          />
        )
      })}

      <AnimatePresence>
        {skill?.targets.map((target, i) => (
          <m.path
            key={`${skill.id}:${target}`}
            d={stringPath(noteOrigin(layout, skillIndex), anchors[target], true)}
            fill="none"
            stroke={STRING_HOT}
            strokeWidth={3.4}
            strokeLinecap="round"
            filter="url(#string-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </svg>
  )
}

export function Pins({ layout }: { layout: BoardLayout }) {
  const points = [
    ...Object.values(layout.anchors),
    ...layout.strings.flatMap((s) => [s.from, s.to]),
    ...SKILLS.map((_, i) => noteOrigin(layout, i)),
  ]
  const unique = [...new Map(points.map((p) => [`${p.x},${p.y}`, p])).values()]
  return (
    <>
      {unique.map((p) => (
        <span key={`${p.x},${p.y}`} className="pin" style={{ left: p.x, top: p.y }} />
      ))}
    </>
  )
}
