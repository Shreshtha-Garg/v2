import { PROFILE, SECTIONS } from '../data/caseFile'
import { Link } from '../lib/router'
import type { SectionId } from '../data/caseFile'

/** The case number and progress. On phones it doubles as the header, with the resume one tap away. */
export function TopHud({ examined, compact }: { examined: ReadonlySet<SectionId>; compact: boolean }) {
  const done = examined.size === SECTIONS.length
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-wall sm:px-5 sm:text-[12px] ${compact ? 'border-b border-white/10 bg-[#0e0c0a]' : ''}`}
    >
      <span>{compact ? `Case ${PROFILE.caseNo}` : `Case file ${PROFILE.caseNo} · ${PROFILE.name}`}</span>
      <span className="flex items-center gap-3">
        <span className={compact ? 'hidden min-[420px]:inline' : undefined}>
          {done ? 'Case closed' : `Examined ${examined.size}/${SECTIONS.length}`}
        </span>
        <span className="flex gap-1.5" aria-hidden="true">
          {SECTIONS.map((s) => (
            <span key={s.id} className={`h-2 w-2 rounded-full ${examined.has(s.id) ? 'bg-string' : 'bg-white/20'}`} />
          ))}
        </span>
        {compact && (
          <a
            href={PROFILE.resume}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto rounded bg-amber px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-[#1a1206]"
          >
            Resume
          </a>
        )}
      </span>
    </div>
  )
}

/** Always-visible navigation, so nobody has to find their way around the board to reach a section. */
export function BottomHud({ active }: { active: SectionId | null }) {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 flex h-[68px] items-center justify-center border-t border-white/10 bg-[#0e0c0a]"
    >
      <div className="flex max-w-full items-center gap-1 overflow-x-auto px-3 [scrollbar-width:none]">
        <HudLink to="/" label="Board" kbd="Esc" current={active === null} />
        <span className="mx-1 h-6 w-px shrink-0 bg-white/15" aria-hidden="true" />
        {SECTIONS.map((s) => (
          <HudLink key={s.id} to={s.path} label={s.label} kbd={s.key} current={active === s.id} />
        ))}
        <span className="mx-1 h-6 w-px shrink-0 bg-white/15" aria-hidden="true" />
        <a href={PROFILE.resume} target="_blank" rel="noreferrer" className="resume-btn">
          Resume PDF
        </a>
      </div>
    </nav>
  )
}

function HudLink({ to, label, kbd, current }: { to: string; label: string; kbd: string; current: boolean }) {
  return (
    <Link to={to} aria-current={current ? 'page' : undefined} className={`hud-link${current ? ' is-current' : ''}`}>
      <kbd className="hud-kbd">{kbd}</kbd>
      {label}
    </Link>
  )
}
