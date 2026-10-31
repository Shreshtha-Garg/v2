import { m } from 'motion/react'
import { useMemo, useState } from 'react'
import { SECTIONS, SKILLS, anchorSection } from '../data/caseFile'
import type { Anchor, SectionId } from '../data/caseFile'
import type { Fit } from '../lib/useViewport'
import { BoardItem } from './BoardItem'
import { faceFor } from './faces'
import { ITEMS, STAGE } from './layout'
import { SkillStrip } from './SkillStrip'
import { Pins, Strings } from './Strings'

interface Props {
  fit: Fit
  active: SectionId | null
  examined: ReadonlySet<SectionId>
  onOpen: (id: SectionId) => void
}

export function Board({ fit, active, examined, onOpen }: Props) {
  const [hoveredItem, setHoveredItem] = useState<SectionId | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [lockedSkill, setLockedSkill] = useState<string | null>(null)
  const activeSkill = hoveredSkill ?? lockedSkill

  const hot = useMemo(
    () => new Set<Anchor>(SKILLS.find((s) => s.id === activeSkill)?.targets ?? []),
    [activeSkill],
  )
  const hotSections = useMemo(() => new Set([...hot].map(anchorSection)), [hot])

  return (
    // The "camera": steps back slightly while a piece of evidence is held up close.
    <m.div
      className="absolute inset-0"
      style={{ transformOrigin: '50% 45%' }}
      inert={active !== null}
      initial={false}
      animate={{ scale: active ? 0.94 : 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      onClick={() => setLockedSkill(null)}
    >
      <div
        className="absolute"
        style={{
          left: fit.left,
          top: fit.top,
          width: STAGE.w,
          height: STAGE.h,
          transform: `scale(${fit.scale})`,
          transformOrigin: '0 0',
        }}
      >
        <div className="board-frame absolute" style={{ inset: -26 }} aria-hidden="true" />
        <div className="cork absolute inset-0" aria-hidden="true" />

        {SECTIONS.map((s) => {
          const Face = faceFor[s.id]
          return (
            <BoardItem
              key={s.id}
              id={s.id}
              label={s.label}
              box={ITEMS[s.id]}
              lifted={active === s.id}
              dimmed={activeSkill !== null && !hotSections.has(s.id)}
              examined={examined.has(s.id)}
              onOpen={onOpen}
              onHover={setHoveredItem}
            >
              <Face hot={hot} />
            </BoardItem>
          )
        })}

        <Strings hoveredItem={hoveredItem} activeSkill={activeSkill} />
        <SkillStrip
          activeSkill={activeSkill}
          lockedSkill={lockedSkill}
          onHover={setHoveredSkill}
          onLock={setLockedSkill}
        />
        <Pins />
      </div>
    </m.div>
  )
}
