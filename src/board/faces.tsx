// What each pinned item looks like on the board: enough to read at a glance, with details saved for the zoom.
// `compact` is the version used on the tall tablet board: less content, and text a size larger so that it
// still reads at about 13px once the board is scaled down to an iPad Mini.
import type { ComponentType } from 'react'
import profileUrl from '../assets/profile.webp'
import clickonThumb from '../assets/projects/clickon-thumb.webp'
import { EXPERIENCE, PROFILE, RATINGS } from '../data/caseFile'
import type { Anchor, SectionId } from '../data/caseFile'
import { smoothPath } from '../lib/curves'

export interface FaceProps {
  /** Anchors the hovered skill traces to; those parts of the face light up. */
  hot: ReadonlySet<Anchor>
  compact?: boolean
}

const lit = (on: boolean) => (on ? ' hot-target' : '')

function Dymo({ children, tilt = -2 }: { children: string; tilt?: number }) {
  return (
    <span className="dymo absolute -left-3 -top-4 z-10 text-[15px]" style={{ rotate: `${tilt}deg` }}>
      {children}
    </span>
  )
}

function DossierFace({ hot, compact = false }: FaceProps) {
  const titles = (
    <p className="font-mono text-[14px] font-bold uppercase leading-[1.4] tracking-[0.1em] text-[#8c1c1c]">
      {PROFILE.titles.map((t) => (
        <span key={t} className="block">
          {t}
        </span>
      ))}
    </p>
  )
  return (
    <div className="relative h-full w-full">
      <span
        className="paper-manila absolute -top-[22px] left-6 h-[30px] w-[150px] rounded-t-[7px]"
        aria-hidden="true"
      />
      <div className={`paper-manila relative h-full w-full rounded-[3px] px-6 pb-5 pt-6 shadow-paper${lit(hot.has('about'))}`}>
        <div className="flex gap-5">
          <figure className="polaroid w-[158px] shrink-0 -rotate-3">
            <img
              src={profileUrl}
              alt="Shreshtha Garg"
              className="block h-[148px] w-full object-cover"
              draggable={false}
            />
            <figcaption className="mt-1.5 text-center font-hand text-[22px] leading-none text-ink">the subject</figcaption>
          </figure>
          <div className="min-w-0 pt-3 font-type text-[16px] leading-[1.45] text-ink-soft">
            <p>File {PROFILE.caseNo}</p>
            <p className="mt-2">Status</p>
            <p className="text-[18px] text-ink">Open to work</p>
            {compact && <div className="mt-3">{titles}</div>}
          </div>
        </div>
        <h2 className="mt-3 font-serif text-[40px] font-bold leading-none text-ink">{PROFILE.name}</h2>
        {!compact && <div className="mt-2">{titles}</div>}
        <ul className={`mt-2 space-y-0.5 font-type leading-snug text-ink ${compact ? 'text-[18px]' : 'text-[16px]'}`}>
          <li>ABV-IIITM Gwalior · CGPA 9.00</li>
          <li>LeetCode Knight · CF Expert</li>
        </ul>
        {/* Inset far enough to clear the string pin at this corner. */}
        <p className="absolute bottom-3 right-9 font-mono text-[13px] font-bold uppercase tracking-[0.16em] text-ink-soft">
          Open file →
        </p>
      </div>
      <Dymo tilt={-3}>About me</Dymo>
    </div>
  )
}

function ProjectsFace({ hot, compact = false }: FaceProps) {
  const body = compact ? 'text-[18px]' : 'text-[17px]'
  return (
    <div className="relative h-full w-full">
      <div className="paper-news relative h-full w-full overflow-hidden px-5 pb-2 pt-3 shadow-paper">
        <header className="border-b-[3px] border-double border-ink pb-0.5 text-center">
          <p className="font-serif text-[34px] font-black leading-none tracking-tight text-ink">The Daily Build</p>
          <div className="mt-1 flex justify-between font-mono text-[13px] uppercase tracking-[0.12em] text-ink-soft">
            <span>Projects edition</span>
            <span>June 2026</span>
          </div>
        </header>
        <article className={`mt-1.5 rounded-[2px] p-1${lit(hot.has('projects.clickon'))}`}>
          <p className="font-mono text-[14px] font-bold uppercase tracking-[0.1em] text-[#9b1b1b]">Amazon HackOn · ClickON</p>
          <h3 className="font-serif text-[29px] font-extrabold leading-[1.1] text-ink">Intent to cart in a blink</h3>
          <div className="mt-1.5 flex gap-3">
            <div className="news-photo h-[64px] w-[100px] shrink-0 border border-ink/40" aria-hidden="true">
              <img src={clickonThumb} alt="" className="h-full w-full object-cover grayscale contrast-125" draggable={false} />
            </div>
            <p className={`font-serif leading-[1.24] text-ink-soft ${body}`}>
              Say, type or snap what you need and get a cart, powered by Gemini.
            </p>
          </div>
        </article>
        <hr className="my-1 border-ink/40" />
        <article className={`rounded-[2px] p-1${lit(hot.has('projects.hostelmate'))}`}>
          <h4 className="font-serif text-[23px] font-bold leading-tight text-ink">HostelMate goes real-time</h4>
          <p className={`font-serif leading-snug text-ink-soft ${body}`}>Socket.io chat · Redis OTP · 3 roles</p>
        </article>
        <p
          className={`absolute inset-x-5 bottom-1.5 border-t border-ink/40 pt-0.5 font-mono text-[13px] uppercase tracking-[0.06em] text-ink-soft${lit(hot.has('projects.archive'))}`}
        >
          From the archives: Buy Me a Chai · ReGeniX
        </p>
      </div>
      <Dymo>Projects</Dymo>
    </div>
  )
}

interface TrailStop {
  x: number
  y: number
  label: string
  labelX: number
  labelY: number
}

// Positions are in the map's own 444×356 coordinates. Each label sits on the side the trail doesn't cross.
const TRAIL: TrailStop[] = [
  { x: 288, y: 300, label: '2022 · JEE', labelX: 302, labelY: 298 },
  { x: 394, y: 222, label: 'IIITM', labelX: 382, labelY: 186 },
  { x: 270, y: 166, label: 'Firstbench', labelX: 282, labelY: 139 },
  { x: 140, y: 108, label: 'HackOn ’26', labelX: 36, labelY: 94 },
  { x: 318, y: 70, label: 'Next?', labelX: 330, labelY: 43 },
]

function ExperienceFace({ hot }: FaceProps) {
  const end = TRAIL[TRAIL.length - 1]
  return (
    <div className="relative h-full w-full">
      <div className="paper-parchment relative h-full w-full overflow-hidden shadow-paper">
        <div className="absolute left-1/2 top-0 h-[356px] w-[444px] -translate-x-1/2">
          <svg viewBox="0 0 444 356" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <g fill="none" stroke="#7a5a30" strokeOpacity="0.3" strokeWidth="1.3">
              <path d="M-10 50 C 70 22, 150 82, 240 52 S 390 14, 460 40" />
              <path d="M-10 204 C 50 176, 120 234, 196 204 S 330 166, 460 194" />
              <ellipse cx="368" cy="134" rx="48" ry="27" />
              <ellipse cx="368" cy="134" rx="29" ry="15" />
            </g>
            <path
              d={smoothPath(TRAIL)}
              fill="none"
              stroke="#b3241e"
              strokeWidth="3.2"
              strokeDasharray="1 10"
              strokeLinecap="round"
            />
            {TRAIL.slice(0, -1).map((p) => (
              <circle key={p.label} cx={p.x} cy={p.y} r="6" fill="#b3241e" stroke="#f3e6c6" strokeWidth="2" />
            ))}
            <g stroke="#b3241e" strokeWidth="4" strokeLinecap="round">
              <path d={`M ${end.x - 9} ${end.y - 9} L ${end.x + 9} ${end.y + 9}`} />
              <path d={`M ${end.x + 9} ${end.y - 9} L ${end.x - 9} ${end.y + 9}`} />
            </g>
          </svg>
          {TRAIL.map((p) => (
            <span
              key={p.label}
              className="absolute whitespace-nowrap font-type text-[17px] text-[#3b2a17]"
              style={{ left: p.labelX, top: p.labelY }}
            >
              {p.label}
            </span>
          ))}
        </div>
        <span className="absolute right-4 top-3 font-serif text-[20px] font-bold text-[#5b4426]" aria-hidden="true">
          N ↑
        </span>
        <div className={`id-badge absolute bottom-4 left-4 w-[252px] -rotate-2${lit(hot.has('experience'))}`}>
          <div className="flex items-center justify-between bg-[#1f3c5e] px-3 py-1 font-mono text-[13px] font-bold uppercase tracking-[0.1em] text-white">
            <span>{EXPERIENCE.company}</span>
            <span>Intern</span>
          </div>
          <div className="bg-[#f7f5ef] px-3 py-1.5">
            <p className="whitespace-nowrap font-serif text-[18px] font-bold leading-tight text-ink">{EXPERIENCE.title}</p>
            <p className="mt-0.5 font-mono text-[14px] leading-snug text-ink-soft">{EXPERIENCE.period}</p>
            <p className="font-mono text-[14px] leading-snug text-ink-soft">4 features · 7 new APIs</p>
          </div>
        </div>
      </div>
      <Dymo tilt={1}>Experience</Dymo>
    </div>
  )
}

const TAG_TILT = [-3, 2, -1]

function AchievementsFace({ hot, compact = false }: FaceProps) {
  return (
    <div className="relative h-full w-full">
      <div className={`paper-news absolute left-0 top-0 w-full -rotate-1 px-5 pb-3 pt-6 shadow-paper${lit(hot.has('achievements'))}`}>
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink-soft">The Daily Build · Sport</p>
        <h3 className="mt-0.5 font-serif text-[30px] font-black leading-[1.04] text-ink">Local dev promoted to Expert</h3>
        <p className={`mt-1 whitespace-nowrap font-serif leading-snug text-ink-soft ${compact ? 'text-[18px]' : 'text-[16px]'}`}>
          Codeforces 1640 · LeetCode 2067 · 1600+ solved
        </p>
      </div>
      <div className="absolute inset-x-1 top-[166px] flex justify-between">
        {RATINGS.map((r, i) => (
          <div key={r.site} className="tag-shadow" style={{ rotate: `${TAG_TILT[i]}deg` }}>
            <div className="evidence-tag w-[128px] px-2.5 pb-2.5 pt-5">
              <span className="tag-hole" aria-hidden="true" />
              <p className="font-mono text-[13px] font-bold uppercase tracking-[0.04em] text-ink-soft">{r.site}</p>
              <p className="font-serif text-[40px] font-black leading-none text-ink">{r.rating}</p>
              <p className="mt-0.5 font-type text-[17px] leading-tight text-[#8c1c1c]">{r.title}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="paper-news absolute bottom-0 right-0 rotate-2 whitespace-nowrap px-3 py-1 font-type text-[15px] text-ink shadow-paper">
        HackOn & GRiD 8.0 national semifinalist
      </p>
      <Dymo tilt={-2}>Achievements</Dymo>
    </div>
  )
}

function ResearchFace({ hot, compact = false }: FaceProps) {
  return (
    <div className="relative h-full w-full">
      <div
        className={`paper-manila absolute left-0 top-0 h-[212px] w-[304px] -rotate-2 rounded-[3px] px-5 pt-7 shadow-paper${lit(hot.has('research.rag'))}`}
      >
        <p className="font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">M.Tech thesis · 2026–27</p>
        <h3 className="mt-0.5 font-serif text-[27px] font-bold leading-[1.05] text-ink">Adaptive RAG</h3>
        <p className={`mt-1 max-w-[170px] font-serif leading-snug text-ink-soft ${compact ? 'text-[18px]' : 'text-[17px]'}`}>
          Evidence-aware retrieval for LLMs
        </p>
        <span className="stamp stamp-amber absolute right-3 top-[86px] rotate-[-8deg] text-[17px]">Ongoing</span>
      </div>
      <div
        className={`paper-manila-dark absolute bottom-0 right-0 h-[204px] w-[308px] rotate-[1.5deg] rounded-[3px] px-5 pt-3.5 shadow-paper${lit(hot.has('research.trojan'))}`}
      >
        <p className="font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-ink-soft">Case HT-321 · July 2026</p>
        <h3 className="mt-0.5 font-serif text-[25px] font-bold leading-[1.05] text-ink">Hardware Trojan detection</h3>
        <p className="mt-1.5 font-mono text-[15px] font-bold leading-snug text-ink">93.7% fewer test patterns</p>
        <p className="font-mono text-[14px] leading-snug text-ink-soft">321 rare nodes hit at once</p>
        <span className="stamp absolute bottom-3 right-3 rotate-[-9deg] text-[17px]">Case closed</span>
      </div>
      <Dymo tilt={1}>Research</Dymo>
    </div>
  )
}

function ContactFace({ hot, compact = false }: FaceProps) {
  return (
    <div className="relative h-full w-full">
      <div className={`paper-card h-full w-full pb-4 pl-[54px] pr-6 ${compact ? 'pt-10' : 'pt-7'} shadow-paper${lit(hot.has('contact'))}`}>
        <p className={`font-type leading-none text-ink ${compact ? 'text-[36px]' : 'text-[28px]'}`}>Tip line</p>
        <p className={`mt-2 font-hand leading-none text-[#1f3f8a] ${compact ? 'text-[34px]' : 'text-[27px]'}`}>
          Got a lead? Leave a tip.
        </p>
        <p className={`mt-4 font-mono font-semibold text-ink ${compact ? 'text-[19px]' : 'text-[15px]'}`}>{PROFILE.email}</p>
        <p className={`mt-1 font-mono text-ink-soft ${compact ? 'text-[16px]' : 'text-[13px]'}`}>LinkedIn · GitHub · Resume</p>
      </div>
      <Dymo tilt={-1}>Contact</Dymo>
    </div>
  )
}

export const faceFor: Record<SectionId, ComponentType<FaceProps>> = {
  about: DossierFace,
  projects: ProjectsFace,
  experience: ExperienceFace,
  achievements: AchievementsFace,
  research: ResearchFace,
  contact: ContactFace,
}
