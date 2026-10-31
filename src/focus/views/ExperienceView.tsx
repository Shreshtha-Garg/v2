// Experience as an explorer's map of the journey, with the Firstbench.ai field report pinned below it.
import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { EXPERIENCE, JOURNEY, PROFILE } from '../../data/caseFile'
import type { StopId } from '../../data/caseFile'
import { JourneyMap } from './JourneyMap'
import { Bullets, Stamp } from './shared'

const REPORT_FIELDS = [
  { label: 'Agent', value: PROFILE.name },
  { label: 'Role', value: EXPERIENCE.title },
  { label: 'Posting', value: `${EXPERIENCE.company} · ${EXPERIENCE.place}` },
  { label: 'Duration', value: EXPERIENCE.period },
]

export function ExperienceView() {
  const [selected, setSelected] = useState<StopId>('firstbench')
  const stop = JOURNEY.find((s) => s.id === selected) ?? JOURNEY[0]

  return (
    <div className="px-6 pb-12 pt-6 md:px-10">
      {/* On phones the map keeps a readable size and scrolls sideways instead of shrinking. */}
      <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:thin] md:mx-0 md:overflow-visible md:px-0">
        <div className="min-w-[700px] md:min-w-0">
          <JourneyMap selected={selected} onSelect={setSelected} />
        </div>
      </div>
      <p className="mt-2 text-center font-mono text-[12px] uppercase tracking-[0.18em] text-ink-soft">
        <span className="md:hidden">Swipe the map · tap a stop</span>
        <span className="hidden md:inline">Hover or select a stop on the map</span>
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <article className="typed-sheet relative p-6 md:p-8">
          <p className="typed-label">Field report · {EXPERIENCE.company}</p>
          <dl className="mt-4 grid grid-cols-[100px_minmax(0,1fr)] gap-x-3 gap-y-1.5 font-type text-[15px]">
            {REPORT_FIELDS.map((f) => (
              <div key={f.label} className="contents">
                <dt className="text-ink-soft">{f.label}</dt>
                <dd className="text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="typed-label mt-7">Findings</p>
          <div className="mt-4">
            <Bullets items={EXPERIENCE.bullets} />
          </div>
          <Stamp className="stamp-sticker absolute -top-5 right-3 rotate-[-6deg] text-[16px] md:right-6 md:top-6 md:bg-transparent md:text-[18px] md:shadow-none md:mix-blend-multiply">
            Mission complete
          </Stamp>
        </article>

        <aside aria-live="polite" className="typed-sheet min-h-[220px] p-6 md:-rotate-1">
          <p className="typed-label">Stop on the map</p>
          <AnimatePresence mode="wait">
            <m.div
              key={stop.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <p className="mt-4 font-mono text-[13px] font-bold uppercase tracking-[0.16em] text-[#8c1c1c]">{stop.when}</p>
              <h3 className="mt-1 font-serif text-[30px] font-bold leading-tight text-ink">{stop.title}</h3>
              <p className="mt-2 font-text text-[17px] leading-relaxed text-ink">{stop.detail}</p>
            </m.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  )
}
