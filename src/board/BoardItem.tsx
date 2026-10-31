import { m } from 'motion/react'
import type { KeyboardEvent, ReactNode } from 'react'
import type { SectionId } from '../data/caseFile'
import type { Box } from './layout'

interface Props {
  id: SectionId
  label: string
  box: Box
  /** True while this item is "picked up" into the focus panel. */
  lifted: boolean
  dimmed: boolean
  examined: boolean
  onOpen: (id: SectionId) => void
  onHover: (id: SectionId | null) => void
  children: ReactNode
}

export function BoardItem({ id, label, box, lifted, dimmed, examined, onOpen, onHover, children }: Props) {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(id)
    }
  }

  return (
    <m.div
      role="button"
      tabIndex={0}
      aria-label={`Open ${label}`}
      data-item={id}
      className="board-item absolute cursor-pointer select-none"
      style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
      initial={false}
      animate={{ rotate: box.rot, opacity: lifted ? 0 : 1 }}
      whileHover={{ y: -6, rotate: box.rot * 0.3, scale: 1.012 }}
      transition={{
        // Vanish instantly when picked up; reappear only once the panel has shrunk back onto the board.
        opacity: lifted ? { duration: 0.05 } : { duration: 0.2, delay: 0.32 },
        default: { type: 'spring', stiffness: 260, damping: 22 },
      }}
      onClick={(e) => {
        e.stopPropagation()
        onOpen(id)
      }}
      onKeyDown={onKeyDown}
      onHoverStart={() => onHover(id)}
      onHoverEnd={() => onHover(null)}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) onHover(id)
      }}
      onBlur={() => onHover(null)}
    >
      {/* Dimming uses opacity, not a CSS filter: a filter makes the browser rasterise the item and then
          scale it with the board, which blurs the text. */}
      <div className={`h-full w-full transition-opacity duration-200${dimmed ? ' opacity-45' : ''}`}>{children}</div>
      {examined && (
        <span className="stamp stamp-sticker pointer-events-none absolute -right-6 -top-3 z-10 rotate-[12deg] text-[15px]">
          Examined
        </span>
      )}
    </m.div>
  )
}
