// About as a subject dossier: clipped photo and ID fields on the folder, the case summary typed on a sheet.
import { useState } from 'react'
import profileUrl from '../../assets/profile.webp'
import { PROFILE } from '../../data/caseFile'
import { Chips, PaperClip, Stamp } from './shared'

function Verdict({ className }: { className: string }) {
  return <p className={`font-hand text-[23px] leading-tight text-[#1f3f8a] ${className}`}>Verdict: worth an interview.</p>
}

function Fingerprint({ className = '' }: { className?: string }) {
  const ridges = Array.from({ length: 9 }, (_, i) => 6 + i * 5.2)
  return (
    <svg viewBox="0 0 100 110" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {ridges.map((r, i) => (
          <path
            key={r}
            d={`M ${50 - r} ${60 + r * 0.35} C ${50 - r} ${58 - r * 1.25}, ${50 + r} ${58 - r * 1.25}, ${50 + r} ${60 + r * 0.4}`}
            strokeDasharray={i % 3 === 1 ? '16 5' : undefined}
          />
        ))}
      </g>
    </svg>
  )
}

const ID_FIELDS = [
  { label: 'Known aliases', value: PROFILE.aliases },
  { label: 'Status', value: `Open to ${PROFILE.openTo}` },
]

export function AboutView() {
  // Phones start with the first paragraph; tablets and PCs always show the whole summary.
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="px-5 pb-3 pt-4 tab:px-8 lg:px-10">
      <div className="grid gap-6 tab:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-8">
        {/* On phones the photo sits beside the ID card, so the summary starts on the first screen. */}
        <div className="grid grid-cols-[112px_minmax(0,1fr)] items-start gap-3 tab:block">
          <div className="relative mx-auto w-full max-w-[210px]">
            <PaperClip className="absolute -top-4 left-6 z-10 h-10 w-4 tab:-top-5 tab:left-10 tab:h-14 tab:w-5" />
            <figure className="polaroid -rotate-2 !p-1.5 tab:!p-2.5">
              <img src={profileUrl} alt="Shreshtha Garg" className="aspect-square w-full object-cover" />
              <figcaption className="mt-1 text-center font-hand text-[18px] leading-none text-ink tab:mt-1.5 tab:text-[22px]">the subject</figcaption>
            </figure>
          </div>
          <dl className="typed-sheet space-y-2 p-3 font-type text-[14px] leading-snug tab:mt-5">
            {ID_FIELDS.map((f) => (
              <div key={f.label}>
                <dt className="text-small uppercase tracking-[0.12em] text-ink-soft">{f.label}</dt>
                <dd className="text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 hidden items-center gap-2 text-[#6b4a24] tab:flex">
            <Fingerprint className="h-12 w-11 shrink-0 opacity-60" />
            <p className="font-hand text-[19px] leading-tight">Prints all over React, Node and C++</p>
          </div>
          {/* On tablets this column has room to spare and the sheet doesn't; on PCs it fills out the education column. */}
          <Verdict className="mt-3 hidden tab:block lg:hidden" />
        </div>

        <article className="typed-sheet relative p-5 lg:p-6">
          <Stamp tone="green" className="absolute -top-3 right-3 rotate-[5deg] text-[14px] lg:text-[16px]">
            Cleared for hire
          </Stamp>
          <p className="typed-label">Case summary</p>
          <h2 className="mt-2 font-serif text-name font-bold leading-none text-ink">{PROFILE.name}</h2>
          <div className="mt-1.5 overflow-hidden">
            <ul className="dot-list font-mono text-small font-bold uppercase tracking-[0.14em] text-[#8c1c1c]">
              {PROFILE.titles.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="mt-3 space-y-2.5 text-body leading-normal text-ink">
            {PROFILE.bio.map((p, i) => (
              <p key={p.lead} className={i === 0 || expanded ? undefined : 'hidden tab:block'}>
                <span className="font-serif text-[17px] font-bold leading-snug">{p.lead}</span> {p.text}
              </p>
            ))}
          </div>
          <button
            type="button"
            className="ink-btn mt-2 tab:hidden"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>

          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <section>
              <p className="typed-label">Education on record</p>
              <ul>
                {PROFILE.education.map((e) => (
                  <li key={e.school} className="flex justify-between gap-x-3 border-b border-ink/15 py-1.5">
                    <div className="min-w-0">
                      <p className="text-body font-semibold leading-snug text-ink">{e.school}</p>
                      <p className="text-[13px] leading-snug text-ink-soft">{e.detail}</p>
                    </div>
                    <div className="shrink-0 text-right font-mono text-small leading-snug text-ink">
                      <p>{e.when}</p>
                      <p className="font-bold">{e.score}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Verdict className="mt-2 tab:hidden lg:block" />
            </section>
            <section>
              <p className="typed-label">Known tools</p>
              <div className="mt-2 space-y-1.5">
                {PROFILE.skills.map((g) => (
                  <div key={g.group} className="grid grid-cols-[82px_minmax(0,1fr)] gap-1.5">
                    <p className="pt-px font-mono text-small uppercase tracking-[0.06em] text-ink-soft">{g.group}</p>
                    <Chips items={g.items} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  )
}
