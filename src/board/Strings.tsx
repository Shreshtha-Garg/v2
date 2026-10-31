import { AnimatePresence, m } from 'motion/react'
import { SKILLS } from '../data/caseFile'
import type { SectionId } from '../data/caseFile'
import { ANCHORS, CORE_STRINGS, STAGE, noteOrigin, stringPath } from './layout'

const STRING = '#b51c22'
const STRING_HOT = '#ff3b3b'
// User-space filter regions, so perfectly straight strings (zero-size bounding boxes) still render.
const FILTER_BOX = { filterUnits: 'userSpaceOnUse' as const, x: -60, y: -60, width: STAGE.w + 120, height: STAGE.h + 120 }

interface Props {
  hoveredItem: SectionId | null
  activeSkill: string | null
}

export function Strings({ hoveredItem, activeSkill }: Props) {
  const skillIndex = SKILLS.findIndex((s) => s.id === activeSkill)
  const skill = skillIndex >= 0 ? SKILLS[skillIndex] : null

  return (
    <svg
      className="pointer-events-none absolute inset-0 overflow-visible"
      width={STAGE.w}
      height={STAGE.h}
      viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="string-shadow" {...FILTER_BOX}>
          <feDropShadow dx="2" dy="5" stdDeviation="2.2" floodColor="#000" floodOpacity="0.5" />
        </filter>
        <filter id="string-glow" {...FILTER_BOX}>
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {CORE_STRINGS.map((s) => {
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
              d: stringPath(s.from, ANCHORS[s.to], hot),
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
            d={stringPath(noteOrigin(skillIndex), ANCHORS[target], true)}
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

export function Pins() {
  const points = [
    ...Object.values(ANCHORS),
    ...CORE_STRINGS.map((s) => s.from),
    ...SKILLS.map((_, i) => noteOrigin(i)),
  ]
  return (
    <>
      {points.map((p, i) => (
        <span key={i} className="pin" style={{ left: p.x, top: p.y }} />
      ))}
    </>
  )
}
