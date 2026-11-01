// Research as two case files in one folder: one closed (Hardware Trojan detection), one still under
// investigation (the thesis). The folder tabs switch between them, so each file fits on one screen.
import { useState } from 'react'
import type { ReactNode } from 'react'
import { RAG, TROJAN } from '../../data/caseFile'
import { Bullets, Chips, Stamp } from './shared'

function Exhibit({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-[3px] border-2 border-ink/70 bg-white/45 px-2 py-1.5 tab:px-3 tab:py-2 ${className}`}>
      <p className="font-mono text-small font-bold uppercase tracking-[0.08em] text-[#8c1c1c] tab:tracking-[0.16em]">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function Bar({ label, value, width, good = false }: { label: string; value: string; width: number; good?: boolean }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-small leading-snug text-ink-soft">
        <span>{label}</span>
        <span className="font-bold text-ink">{value}</span>
      </div>
      <div className="bar-track mt-0.5">
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

const STAMP_CLASS = 'absolute -top-3 right-3 rotate-[4deg] text-[14px] lg:text-[16px]'

function FileHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <>
      <p className="kicker">{kicker}</p>
      <h2 className="mt-0.5 font-serif text-subhead font-bold leading-[1.12] text-ink">{title}</h2>
    </>
  )
}

function TrojanFile() {
  const { patterns, triggers, activations } = TROJAN
  const before = `${triggers.before.base} × 10${sup(triggers.before.exp)}`
  const after = `${triggers.after.base} × 10${sup(triggers.after.exp)}`
  // Phones open the method on request; tablets and PCs always show it.
  const [showMethod, setShowMethod] = useState(false)
  return (
    <>
      <Stamp className={STAMP_CLASS}>Case closed</Stamp>
      <FileHeader kicker={TROJAN.kicker} title={TROJAN.title} />
      <p className="mt-2 max-w-4xl font-text text-body leading-normal text-ink">{TROJAN.summary}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 tab:grid-cols-3 tab:gap-3">
        {/* On phones the headline number runs across the top, with the two charts side by side under it. */}
        <Exhibit label="Exhibit A" className="col-span-2 tab:col-span-1">
          <div className="flex items-center gap-3 tab:block">
            <p className="font-serif text-number font-black leading-none text-ink">{activations.value}</p>
            <p className="mt-1 text-[13px] leading-snug text-ink-soft">{activations.label}</p>
          </div>
        </Exhibit>
        <Exhibit label="Exhibit B">
          <p className="font-serif text-[14px] font-black leading-tight text-ink tab:text-[16px]">{patterns.change}</p>
          <div className="mt-1.5 space-y-1">
            <Bar label="Before" value={patterns.before.toLocaleString('en-IN')} width={100} />
            <Bar label="After" value={String(patterns.after)} width={(patterns.after / patterns.before) * 100} good />
          </div>
        </Exhibit>
        <Exhibit label="Exhibit C">
          <p className="font-serif text-[14px] font-black leading-tight text-ink tab:text-[16px]">Trigger combinations covered</p>
          <div className="mt-1.5 space-y-1">
            <Bar label="Before" value={before} width={(triggers.before.exp / triggers.after.exp) * 100} />
            <Bar label="After" value={after} width={100} good />
          </div>
          <p className="mt-1 font-mono text-[11px] text-ink-soft">Bars on a log scale</p>
        </Exhibit>
      </div>

      <p className="typed-label mt-3">Method</p>
      <div className={`mt-2${showMethod ? '' : ' hidden tab:block'}`}>
        <Bullets items={TROJAN.bullets} />
      </div>
      <button
        type="button"
        className="ink-btn mt-2 tab:hidden"
        aria-expanded={showMethod}
        onClick={() => setShowMethod((s) => !s)}
      >
        {showMethod ? 'Hide method' : 'Read the method'}
      </button>
      <div className="mt-3">
        <Chips items={TROJAN.stack} />
      </div>
    </>
  )
}

function RagFile() {
  return (
    <>
      <Stamp tone="amber" className={STAMP_CLASS}>
        Ongoing
      </Stamp>
      <FileHeader kicker={RAG.kicker} title={RAG.title} />
      <p className="mt-2 max-w-4xl font-text text-body leading-normal text-ink">{RAG.summary}</p>

      <p className="typed-label mt-3">How it works</p>
      <ol className="mt-3 grid grid-cols-2 gap-2 tab:grid-cols-3 tab:gap-x-5 tab:gap-y-3 lg:grid-cols-6" aria-label="Pipeline">
        {RAG.pipeline.map((s, i) => (
          <li key={s.step} className={`flow-step relative${s.decision ? ' is-decision' : ''}`}>
            <p className="font-mono text-[11px] font-bold text-[#8c1c1c]">{String(i + 1).padStart(2, '0')}</p>
            <p className="font-semibold">{s.step}</p>
            {s.note && <p className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{s.note}</p>}
            {i < RAG.pipeline.length - 1 && (
              <span
                className="absolute -right-[17px] top-1/2 hidden -translate-y-1/2 font-mono text-[14px] text-ink lg:block"
                aria-hidden="true"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-3 font-mono text-small font-bold uppercase tracking-[0.14em] text-[#9a5600]">Status: {RAG.status}</p>
      <div className="mt-2">
        <Chips items={RAG.stack} />
      </div>
    </>
  )
}

const FILES = [
  { id: 'trojan', tab: 'File 1 · Hardware Trojan', short: 'File 1 · Trojan', View: TrojanFile },
  { id: 'rag', tab: 'File 2 · Adaptive RAG', short: 'File 2 · RAG', View: RagFile },
]

export function ResearchView() {
  const [current, setCurrent] = useState(0)
  const file = FILES[current]
  const next = FILES[(current + 1) % FILES.length]

  return (
    <div className="px-5 pb-6 pt-4 tab:px-8 lg:px-10">
      <div role="tablist" aria-label="Case files" className="flex gap-1">
        {FILES.map((f, i) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            id={`file-tab-${f.id}`}
            aria-selected={i === current}
            aria-controls="research-file"
            className={`folder-tab${i === current ? ' is-active' : ''}`}
            onClick={() => setCurrent(i)}
          >
            <span className="tab:hidden">{f.short}</span>
            <span className="hidden tab:inline">{f.tab}</span>
          </button>
        ))}
      </div>
      <section
        id="research-file"
        role="tabpanel"
        aria-labelledby={`file-tab-${file.id}`}
        className="folder p-2 pt-5 tab:p-2.5"
      >
        <div className="typed-sheet relative p-4 lg:p-5">
          <file.View />
          <div className="mt-3 flex justify-end border-t border-dashed border-ink/25 pt-2.5">
            <button type="button" className="ink-btn" onClick={() => setCurrent((current + 1) % FILES.length)}>
              Open {next.tab} →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
