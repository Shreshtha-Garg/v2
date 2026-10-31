// What each pinned item looks like on the board: enough to read at a glance, with details saved for the zoom.
import type { ComponentType } from 'react'
import profileUrl from '../assets/profile.webp'
import clickonThumb from '../assets/projects/clickon-thumb.webp'
import { EXPERIENCE, PROFILE, RATINGS } from '../data/caseFile'
import type { Anchor, SectionId } from '../data/caseFile'
import { smoothPath } from '../lib/curves'

export interface FaceProps {
  /** Anchors the hovered skill traces to; those parts of the face light up. */
  hot: ReadonlySet<Anchor>
}

const lit = (on: boolean) => (on ? ' hot-target' : '')

function Dymo({ children, tilt = -2 }: { children: string; tilt?: number }) {
  return (
    <span className="dymo absolute -left-3 -top-4 z-10 text-[15px]" style={{ rotate: `${tilt}deg` }}>
      {children}
    </span>
  )
}

function DossierFace({ hot }: FaceProps) {
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
          <div className="pt-4 font-type text-[16px] leading-[1.5] text-ink-soft">
            <p>File {PROFILE.caseNo}</p>
            <p className="mt-3">Status</p>
            <p className="text-[18px] text-ink">Open to work</p>
          </div>
        </div>
        <h2 className="mt-3 font-serif text-[40px] font-bold leading-none text-ink">{PROFILE.name}</h2>
        <p className="mt-2 font-mono text-[13px] font-bold uppercase leading-[1.45] tracking-[0.18em] text-[#8c1c1c]">
          {PROFILE.titles.map((t) => (
            <span key={t} className="block">
              {t}
            </span>
          ))}
        </p>
        <ul className="mt-2 space-y-0.5 font-type text-[16px] leading-snug text-ink">
          <li>ABV-IIITM Gwalior · CGPA 9.00</li>
          <li>LeetCode Knight · CF Expert</li>
        </ul>
        <p className="absolute bottom-4 right-5 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-ink-soft">
          Open file →
        </p>
      </div>
      <Dymo tilt={-3}>About me</Dymo>
    </div>
  )
}

function ProjectsFace({ hot }: FaceProps) {
  return (
    <div className="relative h-full w-full">
      <div className="paper-news relative h-full w-full overflow-hidden px-5 pb-3 pt-4 shadow-paper">
        <header className="border-b-[3px] border-double border-ink pb-1 text-center">
          <p className="font-serif text-[36px] font-black leading-none tracking-tight text-ink">The Daily Build</p>
          <div className="mt-1.5 flex justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            <span>Projects edition</span>
            <span>June 2026</span>
          </div>
        </header>
        <article className={`mt-3 rounded-[2px] p-1${lit(hot.has('projects.clickon'))}`}>
          <p className="font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-[#9b1b1b]">Amazon HackOn · ClickON</p>
          <h3 className="mt-1 font-serif text-[28px] font-extrabold leading-[1.04] text-ink">Intent to cart in a blink</h3>
          <div className="mt-2 flex gap-3">
            <div className="news-photo h-[72px] w-[108px] shrink-0 border border-ink/40" aria-hidden="true">
              <img src={clickonThumb} alt="" className="h-full w-full object-cover grayscale contrast-125" draggable={false} />
            </div>
            <p className="font-serif text-[16px] leading-[1.32] text-ink-soft">
              Say, type or snap what you need and get a cart, powered by Gemini.
            </p>
          </div>
        </article>
        <hr className="my-2 border-ink/40" />
        <article className={`rounded-[2px] p-1${lit(hot.has('projects.hostelmate'))}`}>
          <h4 className="font-serif text-[22px] font-bold leading-tight text-ink">HostelMate goes real-time</h4>
          <p className="font-serif text-[16px] text-ink-soft">Socket.io chat · Redis OTP · 3 roles</p>
        </article>
        <p
          className={`absolute inset-x-5 bottom-2 border-t border-ink/40 pt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft${lit(hot.has('projects.archive'))}`}
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
  side: 'left' | 'right'
}

// Positions are in the map face's own 444×372 coordinates.
const TRAIL: TrailStop[] = [
  { x: 288, y: 316, label: '2022 · JEE', side: 'right' },
  { x: 394, y: 236, label: 'IIITM', side: 'left' },
  { x: 270, y: 178, label: 'Firstbench', side: 'right' },
  { x: 140, y: 116, label: 'HackOn ’26', side: 'right' },
  { x: 318, y: 78, label: 'Next?', side: 'right' },
]

function ExperienceFace({ hot }: FaceProps) {
  const end = TRAIL[TRAIL.length - 1]
  return (
    <div className="relative h-full w-full">
      <div className="paper-parchment relative h-full w-full overflow-hidden shadow-paper">
        <svg viewBox="0 0 444 372" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g fill="none" stroke="#7a5a30" strokeOpacity="0.3" strokeWidth="1.3">
            <path d="M-10 54 C 70 26, 150 86, 240 56 S 390 18, 460 44" />
            <path d="M-10 214 C 50 186, 120 244, 196 214 S 330 176, 460 204" />
            <path d="M-10 300 C 40 280, 90 320, 150 300" />
            <ellipse cx="368" cy="146" rx="48" ry="27" />
            <ellipse cx="368" cy="146" rx="29" ry="15" />
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
            className="absolute whitespace-nowrap font-type text-[16px] text-[#3b2a17]"
            style={p.side === 'right' ? { left: p.x + 12, top: p.y - 26 } : { right: 444 - p.x + 12, top: p.y - 26 }}
          >
            {p.label}
          </span>
        ))}
        <span className="absolute right-4 top-3 font-serif text-[20px] font-bold text-[#5b4426]" aria-hidden="true">
          N ↑
        </span>
        <div className={`id-badge absolute bottom-4 left-4 w-[252px] -rotate-2${lit(hot.has('experience'))}`}>
          <div className="flex items-center justify-between bg-[#1f3c5e] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            <span>{EXPERIENCE.company}</span>
            <span>Intern</span>
          </div>
          <div className="bg-[#f7f5ef] px-3 py-2">
            <p className="whitespace-nowrap font-serif text-[17px] font-bold leading-tight text-ink">{EXPERIENCE.title}</p>
            <p className="mt-1 font-mono text-[13px] text-ink-soft">{EXPERIENCE.period}</p>
            <p className="font-mono text-[13px] text-ink-soft">4 features · 7 new APIs</p>
          </div>
        </div>
      </div>
      <Dymo tilt={1}>Experience</Dymo>
    </div>
  )
}

const TAG_TILT = [-3, 2, -1]

function AchievementsFace({ hot }: FaceProps) {
  return (
    <div className="relative h-full w-full">
      <div className={`paper-news absolute left-0 top-0 w-full -rotate-1 px-5 pb-4 pt-7 shadow-paper${lit(hot.has('achievements'))}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-soft">The Daily Build · Sport</p>
        <h3 className="mt-1 font-serif text-[30px] font-black leading-[1.04] text-ink">Local dev promoted to Expert</h3>
        <p className="mt-1 font-serif text-[16px] leading-snug text-ink-soft">Codeforces 1640 · LeetCode 2067 · 1600+ solved</p>
      </div>
      <div className="absolute left-1 top-[166px] flex gap-3">
        {RATINGS.map((r, i) => (
          <div key={r.site} className="tag-shadow" style={{ rotate: `${TAG_TILT[i]}deg` }}>
            <div className="evidence-tag w-[128px] px-3 pb-3 pt-6">
              <span className="tag-hole" aria-hidden="true" />
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-ink-soft">{r.site}</p>
              <p className="font-serif text-[40px] font-black leading-none text-ink">{r.rating}</p>
              <p className="mt-1 font-type text-[16px] text-[#8c1c1c]">{r.title}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="paper-news absolute bottom-0 right-0 rotate-2 px-3 py-1.5 font-type text-[15px] text-ink shadow-paper">
        HackOn & GRiD 8.0 national semifinalist
      </p>
      <Dymo tilt={-2}>Achievements</Dymo>
    </div>
  )
}

function ResearchFace({ hot }: FaceProps) {
  return (
    <div className="relative h-full w-full">
      <div
        className={`paper-manila absolute left-0 top-0 h-[212px] w-[304px] -rotate-2 rounded-[3px] px-5 pt-8 shadow-paper${lit(hot.has('research.rag'))}`}
      >
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">M.Tech thesis · 2026–27</p>
        <h3 className="mt-1 font-serif text-[27px] font-bold leading-[1.05] text-ink">Adaptive RAG</h3>
        <p className="mt-1 max-w-[180px] font-serif text-[16px] leading-snug text-ink-soft">
          Evidence-aware retrieval for LLMs
        </p>
        <span className="stamp stamp-amber absolute right-3 top-[72px] rotate-[-8deg] text-[17px]">Ongoing</span>
      </div>
      <div
        className={`paper-manila-dark absolute left-[116px] top-[136px] h-[204px] w-[308px] rotate-[1.5deg] rounded-[3px] px-5 pt-5 shadow-paper${lit(hot.has('research.trojan'))}`}
      >
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">Case HT-321 · July 2026</p>
        <h3 className="mt-1 font-serif text-[25px] font-bold leading-[1.05] text-ink">Hardware Trojan detection</h3>
        <p className="mt-2 font-mono text-[15px] font-bold text-ink">93.7% fewer test patterns</p>
        <p className="font-mono text-[14px] text-ink-soft">321 rare nodes hit at once</p>
        <span className="stamp absolute bottom-4 right-4 rotate-[-9deg] text-[18px]">Case closed</span>
      </div>
      <Dymo tilt={1}>Research</Dymo>
    </div>
  )
}

function ContactFace({ hot }: FaceProps) {
  return (
    <div className="relative h-full w-full">
      <div className={`paper-card h-full w-full pb-4 pl-[54px] pr-6 pt-4 shadow-paper${lit(hot.has('contact'))}`}>
        <p className="font-type text-[28px] leading-none text-ink">Tip line</p>
        <p className="mt-2 font-hand text-[27px] leading-none text-[#1f3f8a]">Got a lead? Leave a tip.</p>
        <p className="mt-4 font-mono text-[15px] font-semibold text-ink">{PROFILE.email}</p>
        <p className="mt-1 font-mono text-[13px] text-ink-soft">LinkedIn · GitHub · Resume</p>
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
