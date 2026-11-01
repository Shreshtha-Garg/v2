// Experience as an explorer's map of the journey, with the Firstbench.ai field report pinned below it.
import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { EXPERIENCE, JOURNEY } from '../../data/caseFile'
import type { StopId } from '../../data/caseFile'
import { JourneyMap, JourneyTrail } from './JourneyMap'
import { Bullets, Stamp } from './shared'

const REPORT_FIELDS = [
  { label: 'Role', value: EXPERIENCE.title },
  { label: 'Posting', value: EXPERIENCE.company },
  { label: 'Where', value: EXPERIENCE.place },
  { label: 'Duration', value: EXPERIENCE.period },
]

export function ExperienceView() {
  const [selected, setSelected] = useState<StopId>('firstbench')
  const stop = JOURNEY.find((s) => s.id === selected) ?? JOURNEY[0]

  return (
    <div className="px-5 pb-5 pt-4 tab:px-8 lg:px-10">
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          {/* Shrunk to phone width the wide map's labels can't be read, so phones get the same route drawn upright. */}
          <div className="tab:hidden">
            <JourneyTrail selected={selected} onSelect={setSelected} />
          </div>
          <div className="hidden tab:block">
            <JourneyMap selected={selected} onSelect={setSelected} />
          </div>
          <p className="mt-1 text-center font-mono text-small uppercase tracking-[0.14em] text-ink-soft">
            <span className="tab:hidden">Tap a stop on the map</span>
            <span className="hidden tab:inline">Hover or select a stop on the map</span>
          </p>
        </div>

        <aside aria-live="polite" className="typed-sheet p-4">
          <p className="typed-label">Stop on the map</p>
          <AnimatePresence mode="wait">
            <m.div
              key={stop.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <p className="mt-2 font-mono text-small font-bold uppercase tracking-[0.12em] text-[#8c1c1c]">{stop.when}</p>
              <h3 className="mt-0.5 font-serif text-subhead font-bold leading-tight text-ink">{stop.title}</h3>
              <p className="mt-1 font-text text-body leading-normal text-ink">{stop.detail}</p>
            </m.div>
          </AnimatePresence>
        </aside>
      </div>

      <article className="typed-sheet relative mt-5 p-4 lg:p-5">
        <p className="typed-label">
          Field report<span className="hidden tab:inline"> · {EXPERIENCE.company}</span>
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 font-type text-[14px] tab:grid-cols-4">
          {REPORT_FIELDS.map((f) => (
            <div key={f.label}>
              <dt className="text-small uppercase tracking-[0.1em] text-ink-soft">{f.label}</dt>
              <dd className="text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="typed-label mt-3">Findings</p>
        <div className="mt-2">
          <Bullets items={EXPERIENCE.bullets} />
        </div>
        <Stamp className="stamp-sticker absolute -top-4 right-3 rotate-[-5deg] text-[14px] tab:top-2 tab:bg-transparent tab:shadow-none tab:mix-blend-multiply">
          Mission complete
        </Stamp>
      </article>
    </div>
  )
}
