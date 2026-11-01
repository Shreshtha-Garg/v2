import { m } from 'motion/react'
import { SKILLS } from '../data/caseFile'
import { notePos } from './layout'
import type { BoardLayout } from './layout'

interface Props {
  layout: BoardLayout
  activeSkill: string | null
  lockedSkill: string | null
  onHover: (id: string | null) => void
  onLock: (id: string | null) => void
}

/** Sticky notes along the top of the board. Hover (or tap, which locks it) to trace a skill to its evidence. */
export function SkillStrip({ layout, activeSkill, lockedSkill, onHover, onLock }: Props) {
  const phone = layout.name === 'phone'
  return (
    <div role="group" aria-label="Skills. Hover or select one to trace it across the board.">
      {SKILLS.map((s, i) => {
        const b = notePos(layout, i)
        const on = activeSkill === s.id
        return (
          <m.button
            key={s.id}
            type="button"
            aria-pressed={lockedSkill === s.id}
            aria-label={s.label}
            className={`note absolute flex items-center justify-center text-center ${phone ? 'px-0.5 pb-1.5' : 'px-1 pb-2'}`}
            style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
            initial={false}
            animate={{ rotate: on ? 0 : b.rot, y: on ? -4 : 0, scale: on ? 1.07 : 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            // Motion's hover ignores touch, so a tap only locks the note and a second tap can release it.
            onHoverStart={() => onHover(s.id)}
            onHoverEnd={() => onHover(null)}
            onFocus={(e) => {
              if (e.currentTarget.matches(':focus-visible')) onHover(s.id)
            }}
            onBlur={() => onHover(null)}
            onClick={(e) => {
              e.stopPropagation()
              onLock(lockedSkill === s.id ? null : s.id)
            }}
          >
            <span className="font-hand font-semibold leading-[0.92] text-ink" style={{ fontSize: layout.note.font }}>
              {phone ? s.short : s.label}
            </span>
          </m.button>
        )
      })}
    </div>
  )
}
