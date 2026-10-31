// About as a subject dossier: clipped photo and ID fields on the folder, the case summary typed on a sheet.
import profileUrl from '../../assets/profile.webp'
import { PROFILE } from '../../data/caseFile'
import { Chips, PaperClip, Stamp } from './shared'

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
  { label: 'Case', value: PROFILE.caseNo },
  { label: 'Occupation', value: PROFILE.titles.join(', ') },
  { label: 'Known aliases', value: PROFILE.aliases },
  { label: 'Status', value: `Open to ${PROFILE.openTo}` },
]

export function AboutView() {
  return (
    <div className="relative px-6 pb-12 pt-8 md:px-10">
      <Stamp tone="green" className="absolute right-6 top-6 z-10 rotate-[8deg] text-[20px] md:right-10 md:text-[24px]">
        Cleared for hire
      </Stamp>
      <div className="grid gap-10 md:grid-cols-[250px_minmax(0,1fr)]">
        <div>
          <div className="relative mx-auto max-w-[250px]">
            <PaperClip className="absolute -top-6 left-12 z-10 h-16 w-6" />
            <figure className="polaroid -rotate-2">
              <img src={profileUrl} alt="Shreshtha Garg" className="aspect-square w-full object-cover" />
              <figcaption className="mt-2 text-center font-hand text-[26px] leading-none text-ink">the subject</figcaption>
            </figure>
          </div>
          <dl className="typed-sheet mt-8 space-y-3 p-4 font-type text-[15px] leading-snug">
            {ID_FIELDS.map((f) => (
              <div key={f.label}>
                <dt className="text-[12px] uppercase tracking-[0.16em] text-ink-soft">{f.label}</dt>
                <dd className="text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex items-center gap-3 text-[#6b4a24]">
            <Fingerprint className="h-16 w-14 opacity-60" />
            <p className="font-hand text-[22px] leading-tight">Prints all over React, Node and C++</p>
          </div>
        </div>

        <article className="typed-sheet p-6 md:rotate-[0.3deg] md:p-9">
          <p className="typed-label">Case summary</p>
          <h2 className="mt-4 font-serif text-[36px] font-bold leading-none text-ink sm:text-[44px] md:text-[52px]">
            {PROFILE.name}
          </h2>
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[15px] font-bold uppercase tracking-[0.2em] text-[#8c1c1c]">
            {PROFILE.titles.map((t, i) => (
              <span key={t}>
                {i > 0 && (
                  <span className="mr-3 text-ink-soft" aria-hidden="true">
                    ·
                  </span>
                )}
                {t}
              </span>
            ))}
          </p>
          <div className="mt-6 max-w-2xl space-y-5 text-[17px] leading-relaxed text-ink">
            {PROFILE.bio.map((p) => (
              <p key={p.lead}>
                <span className="font-serif text-[21px] font-bold leading-snug">{p.lead}</span> {p.text}
              </p>
            ))}
          </div>

          <p className="typed-label mt-10">Education on record</p>
          <ul className="mt-2">
            {PROFILE.education.map((e) => (
              <li key={e.school} className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-ink/15 py-3">
                <div>
                  <p className="font-semibold text-ink">{e.school}</p>
                  <p className="text-[15px] text-ink-soft">{e.detail}</p>
                </div>
                <div className="text-right font-mono text-[14px] text-ink">
                  <p>{e.when}</p>
                  <p className="font-bold">{e.score}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="typed-label mt-10">Known tools</p>
          <div className="mt-4 space-y-3">
            {PROFILE.skills.map((g) => (
              <div key={g.group} className="grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)]">
                <p className="pt-0.5 font-mono text-[13px] uppercase tracking-[0.16em] text-ink-soft">{g.group}</p>
                <Chips items={g.items} />
              </div>
            ))}
          </div>

          <p className="mt-10 font-hand text-[28px] leading-tight text-[#1f3f8a]">Verdict: worth an interview.</p>
        </article>
      </div>
    </div>
  )
}
