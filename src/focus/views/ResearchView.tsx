// Research as two case files: one closed (Hardware Trojan detection), one still under investigation (the thesis).
import type { ReactNode } from 'react'
import { RAG, TROJAN } from '../../data/caseFile'
import { Bullets, Chips, Stamp } from './shared'

function CaseFile({ tab, children }: { tab: string; children: ReactNode }) {
  return (
    <section className="folder mt-10 p-3 md:p-4">
      <span className="folder-tab">{tab}</span>
      <div className="typed-sheet p-6 md:p-8">{children}</div>
    </section>
  )
}

function Exhibit({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[3px] border-2 border-ink/70 bg-white/45 p-4">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#8c1c1c]">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function Bar({ label, value, width, good = false }: { label: string; value: string; width: number; good?: boolean }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[12px] text-ink-soft">
        <span>{label}</span>
        <span className="font-bold text-ink">{value}</span>
      </div>
      <div className="bar-track mt-1">
        <div className={`bar-fill${good ? ' is-good' : ''}`} style={{ width: `${Math.max(width, 1.5)}%` }} />
      </div>
    </div>
  )
}

const sup = (n: number) =>
  String(n)
    .split('')
    .map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)])
    .join('')

function TrojanFile() {
  const { patterns, triggers, activations } = TROJAN
  const before = `${triggers.before.base} × 10${sup(triggers.before.exp)}`
  const after = `${triggers.after.base} × 10${sup(triggers.after.exp)}`
  return (
    <CaseFile tab="Case HT-321">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <p className="kicker">{TROJAN.kicker}</p>
          <h2 className="mt-1 font-serif text-[30px] font-bold leading-[1.1] text-ink md:text-[36px]">{TROJAN.title}</h2>
        </div>
        <Stamp className="rotate-[-6deg] text-[20px]">Case closed</Stamp>
      </div>
      <p className="mt-4 max-w-3xl font-text text-[17px] leading-relaxed text-ink">{TROJAN.summary}</p>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <Exhibit label="Exhibit A">
          <p className="font-serif text-[46px] font-black leading-none text-ink">{activations.value}</p>
          <p className="mt-2 text-[14px] leading-snug text-ink-soft">{activations.label}</p>
        </Exhibit>
        <Exhibit label="Exhibit B">
          <p className="font-serif text-[22px] font-black leading-tight text-ink">{patterns.change}</p>
          <div className="mt-3 space-y-2.5">
            <Bar label="Before" value={patterns.before.toLocaleString('en-IN')} width={100} />
            <Bar label="After" value={String(patterns.after)} width={(patterns.after / patterns.before) * 100} good />
          </div>
        </Exhibit>
        <Exhibit label="Exhibit C">
          <p className="font-serif text-[22px] font-black leading-tight text-ink">Trigger combinations covered</p>
          <div className="mt-3 space-y-2.5">
            <Bar label="Before" value={before} width={(triggers.before.exp / triggers.after.exp) * 100} />
            <Bar label="After" value={after} width={100} good />
          </div>
          <p className="mt-2 font-mono text-[11px] text-ink-soft">Bars on a log scale</p>
        </Exhibit>
      </div>

      <p className="typed-label mt-8">Method</p>
      <div className="mt-4">
        <Bullets items={TROJAN.bullets} />
      </div>
      <div className="mt-5">
        <Chips items={TROJAN.stack} />
      </div>
    </CaseFile>
  )
}

function RagFile() {
  return (
    <CaseFile tab="M.Tech thesis">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <p className="kicker">{RAG.kicker}</p>
          <h2 className="mt-1 font-serif text-[30px] font-bold leading-[1.1] text-ink md:text-[36px]">{RAG.title}</h2>
        </div>
        <Stamp tone="amber" className="rotate-[-6deg] text-[20px]">
          Ongoing
        </Stamp>
      </div>
      <p className="mt-4 max-w-3xl font-text text-[17px] leading-relaxed text-ink">{RAG.summary}</p>

      <p className="typed-label mt-8">How it works</p>
      <ol className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6" aria-label="Pipeline">
        {RAG.pipeline.map((s, i) => (
          <li key={s.step} className={`flow-step relative${s.decision ? ' is-decision' : ''}`}>
            <p className="font-mono text-[11px] font-bold text-[#8c1c1c]">{String(i + 1).padStart(2, '0')}</p>
            <p className="mt-0.5 font-semibold">{s.step}</p>
            {s.note && <p className="mt-1 text-[13px] leading-snug text-ink-soft">{s.note}</p>}
            {i < RAG.pipeline.length - 1 && (
              <span
                className="absolute -right-[19px] top-1/2 hidden -translate-y-1/2 font-mono text-[16px] text-ink lg:block"
                aria-hidden="true"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-[#9a5600]">Status: {RAG.status}</p>
      <div className="mt-4">
        <Chips items={RAG.stack} />
      </div>
    </CaseFile>
  )
}

export function ResearchView() {
  return (
    <div className="px-6 pb-12 pt-2 md:px-10">
      <TrojanFile />
      <RagFile />
    </div>
  )
}
