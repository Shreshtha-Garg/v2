// The pinned items on the phone board: the same evidence cut down to a headline and a line or two,
// drawn at phone size rather than shrunk. Each card is a size container: on a taller phone its text
// grows and a little more detail appears, so the space is used rather than left blank.
import type { ComponentType, ReactNode } from 'react'
import profileUrl from '../assets/profile.webp'
import { EXPERIENCE, PROFILE, RATINGS } from '../data/caseFile'
import type { SectionId } from '../data/caseFile'
import { smoothPath } from '../lib/curves'
import { lit } from './faces'
import type { FaceProps } from './faces'

function Card({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative h-full w-full [container-type:size]">
      {children}
      <span className="dymo absolute -left-1 -top-2.5 z-10 text-[10.5px] tracking-[0.12em]">{label}</span>
    </div>
  )
}

function AboutCard({ hot }: FaceProps) {
  return (
    <Card label="About me">
      <div
        className={`paper-manila grid h-full grid-cols-[auto_minmax(0,1fr)] content-between gap-x-2 rounded-[3px] px-2.5 pb-2 pt-4 @[210px]:grid-rows-[1fr_auto_auto] shadow-paper${lit(hot.has('about'))}`}
      >
        <figure className="polaroid -rotate-2 self-start !p-1 @[210px]:row-span-3">
          <img
            src={profileUrl}
            alt="Shreshtha Garg"
            className="block aspect-[10/11] h-[clamp(56px,calc(100cqh-98px),84px)] object-cover"
            draggable={false}
          />
        </figure>
        <div className="font-type text-[12px] leading-tight text-ink-soft">
          <p>{PROFILE.caseNo}</p>
          <p className="mt-1 text-[13px] text-ink">Open to work</p>
        </div>
        <h2 className="col-span-2 mt-1 whitespace-nowrap font-serif text-[clamp(17px,11.4cqw,21px)] font-bold leading-none text-ink @[210px]:col-span-1 @[210px]:col-start-2">
          {PROFILE.name}
        </h2>
        <p className="col-span-2 mt-0.5 text-[12px] font-semibold leading-tight text-[#8c1c1c] @[210px]:col-span-1 @[210px]:col-start-2">
          Full Stack Developer
          <br />
          Competitive Programmer
        </p>
      </div>
    </Card>
  )
}

function ProjectsCard({ hot }: FaceProps) {
  return (
    <Card label="Projects">
      <div className="paper-news flex h-full flex-col overflow-hidden px-2 pb-1 pt-3.5 shadow-paper">
        <p className="border-b-[3px] border-double border-ink pb-0.5 text-right font-serif text-[15px] font-black leading-none text-ink">
          The Daily Build
        </p>
        <article className={`mt-1 rounded-[2px] px-0.5${lit(hot.has('projects.clickon'))}`}>
          <p className="font-mono text-[11px] font-bold uppercase leading-tight text-[#9b1b1b]">ClickON</p>
          <h3 className="font-serif text-[clamp(15px,8.4cqh,18px)] font-extrabold leading-[1.1] text-ink">Intent to cart in a blink</h3>
          <p className="hidden font-serif text-[12.5px] leading-tight text-ink-soft tallcard:block">An AI cart, powered by Gemini</p>
        </article>
        <article className={`mt-1 rounded-[2px] border-t border-ink/30 px-0.5 pt-1${lit(hot.has('projects.hostelmate'))}`}>
          <h4 className="font-serif text-[clamp(14px,7.4cqh,16px)] font-bold leading-[1.1] text-ink">HostelMate goes real-time</h4>
          <p className="hidden font-serif text-[12.5px] leading-tight text-ink-soft tallcard:block">Socket.io chat · Redis OTP</p>
        </article>
        <p
          className={`mt-auto whitespace-nowrap px-0.5 font-mono text-[11px] uppercase leading-tight [@container_(height<140px)]:hidden text-ink-soft${lit(hot.has('projects.archive'))}`}
        >
          2 from archives
        </p>
      </div>
    </Card>
  )
}

const TRAIL = [
  { x: 20, y: 86 },
  { x: 78, y: 62 },
  { x: 40, y: 36 },
  { x: 92, y: 20 },
  { x: 142, y: 34 },
]

function ExperienceCard({ hot }: FaceProps) {
  const end = TRAIL[TRAIL.length - 1]
  return (
    <Card label="Experience">
      <div className="paper-parchment relative h-full w-full overflow-hidden shadow-paper">
        <svg
          viewBox="0 0 170 104"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-x-0 top-3 h-[calc(100%-74px)] w-full"
          aria-hidden="true"
        >
          <path d={smoothPath(TRAIL)} fill="none" stroke="#b3241e" strokeWidth="3" strokeDasharray="1 8" strokeLinecap="round" />
          {TRAIL.slice(0, -1).map((p) => (
            <circle key={p.x} cx={p.x} cy={p.y} r="5" fill="#b3241e" stroke="#f3e6c6" strokeWidth="1.6" />
          ))}
          <g stroke="#b3241e" strokeWidth="3.6" strokeLinecap="round">
            <path d={`M ${end.x - 7} ${end.y - 7} L ${end.x + 7} ${end.y + 7}`} />
            <path d={`M ${end.x + 7} ${end.y - 7} L ${end.x - 7} ${end.y + 7}`} />
          </g>
        </svg>
        <div className={`id-badge absolute inset-x-1.5 bottom-1.5${lit(hot.has('experience'))}`}>
          <p className="bg-[#1f3c5e] px-2 py-0.5 font-mono text-[11px] font-bold uppercase leading-tight text-white">{EXPERIENCE.company}</p>
          <div className="bg-[#f7f5ef] px-2 py-1">
            <p className="whitespace-nowrap font-serif text-[12.5px] font-bold leading-tight text-ink">Software Dev Intern</p>
            <p className="whitespace-nowrap font-mono text-[11px] leading-tight text-ink-soft">{EXPERIENCE.period}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

const TAG_SITE = ['LC', 'CF', 'CC']

function AchievementsCard({ hot }: FaceProps) {
  return (
    <Card label="Achievements">
      <div className={`paper-news flex h-full flex-col px-2 pb-2 pt-3.5 shadow-paper${lit(hot.has('achievements'))}`}>
        <h3 className="font-serif text-[clamp(15px,8.6cqh,18px)] font-black leading-[1.08] text-ink">Local dev promoted to Expert</h3>
        <p className="mt-0.5 whitespace-nowrap font-serif text-[12.5px] leading-tight text-ink-soft">1600+ problems solved</p>
        <div className="mt-auto flex justify-between gap-1 pt-1">
          {RATINGS.map((r, i) => (
            <div key={r.site} className="evidence-tag min-w-0 flex-1 px-0.5 pb-1 pt-2 text-center">
              <p className="hidden font-mono text-[10px] font-bold uppercase leading-none text-ink-soft tallcard:block">{TAG_SITE[i]}</p>
              <p className="font-serif text-[clamp(16px,calc(5.6cqh+4px),20px)] font-black leading-none text-ink tallcard:mt-0.5">{r.rating}</p>
              <p className="mt-0.5 whitespace-nowrap font-type text-[11.5px] leading-none text-[#8c1c1c]">{r.title}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function ResearchCard({ hot }: FaceProps) {
  return (
    <Card label="Research">
      <div
        className={`paper-manila absolute left-0 top-0 h-[60%] w-[92%] -rotate-1 rounded-[3px] px-2 pt-4 shadow-paper${lit(hot.has('research.rag'))}`}
      >
        <p className="font-mono text-[11px] font-bold uppercase leading-tight text-ink-soft">M.Tech thesis</p>
        <h3 className="font-serif text-[clamp(15px,8.4cqh,18px)] font-bold leading-tight text-ink">Adaptive RAG</h3>
        <span className="stamp stamp-amber mt-1 hidden rotate-[-4deg] border-2 text-[10px] midcard:inline-block">Ongoing</span>
      </div>
      <div
        className={`paper-manila-dark absolute bottom-0 right-0 h-[54%] w-[94%] rotate-1 rounded-[3px] px-2 pt-1 shadow-paper${lit(hot.has('research.trojan'))}`}
      >
        <h3 className="whitespace-nowrap font-serif text-[clamp(14px,8cqh,16.5px)] font-bold leading-tight text-ink">Hardware Trojan</h3>
        <p className="whitespace-nowrap font-mono text-[11px] font-bold leading-tight text-ink">93.7% fewer patterns</p>
        <span className="stamp absolute bottom-1 right-1.5 rotate-[-6deg] border-2 text-[10px]">Case closed</span>
      </div>
    </Card>
  )
}

function ContactCard({ hot }: FaceProps) {
  return (
    <Card label="Contact">
      <div className={`paper-card flex h-full w-full flex-col pb-2 pl-[46px] pr-1 pt-4 shadow-paper${lit(hot.has('contact'))}`}>
        <p className="font-type text-[clamp(20px,11cqh,24px)] leading-none text-ink">Tip line</p>
        <p className="mt-1.5 font-hand text-[clamp(20px,11.4cqh,25px)] font-semibold leading-[1.05] text-[#1f3f8a]">Got a lead? Leave a tip.</p>
        <p className="mt-auto font-mono text-[11px] leading-tight text-ink-soft">Email · LinkedIn</p>
      </div>
    </Card>
  )
}

export const phoneFaceFor: Record<SectionId, ComponentType<FaceProps>> = {
  about: AboutCard,
  projects: ProjectsCard,
  experience: ExperienceCard,
  achievements: AchievementsCard,
  research: ResearchCard,
  contact: ContactCard,
}
