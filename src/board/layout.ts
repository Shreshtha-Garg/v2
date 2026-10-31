import { SKILLS } from '../data/caseFile'
import type { Anchor, SectionId } from '../data/caseFile'

/** The board is drawn on a fixed 1600×820 stage that is scaled to fit the window, like a game canvas. */
export const STAGE = { w: 1600, h: 820 }

export interface Point {
  x: number
  y: number
}

export interface Box extends Point {
  w: number
  h: number
  rot: number
}

export const ITEMS: Record<SectionId, Box> = {
  projects: { x: 56, y: 52, w: 444, h: 372, rot: -1.8 },
  experience: { x: 1100, y: 52, w: 444, h: 372, rot: 1.5 },
  about: { x: 622, y: 124, w: 356, h: 424, rot: -0.8 },
  achievements: { x: 70, y: 458, w: 424, h: 340, rot: 1.2 },
  research: { x: 1106, y: 458, w: 424, h: 340, rot: -1.2 },
  contact: { x: 640, y: 600, w: 320, h: 196, rot: 0.8 },
}

/** Where each pin sits, in stage coordinates. Kept near item edges so strings cross cork, not text. */
export const ANCHORS: Record<Anchor, Point> = {
  about: { x: 800, y: 140 },
  'projects.clickon': { x: 490, y: 226 },
  'projects.hostelmate': { x: 490, y: 359 },
  'projects.archive': { x: 490, y: 408 },
  experience: { x: 1130, y: 300 },
  achievements: { x: 480, y: 498 },
  'research.rag': { x: 1118, y: 606 },
  'research.trojan': { x: 1234, y: 656 },
  contact: { x: 800, y: 610 },
}

/** Red string from the subject's dossier to each piece of evidence. */
export const CORE_STRINGS: { section: SectionId; from: Point; to: Anchor }[] = [
  { section: 'projects', from: { x: 640, y: 150 }, to: 'projects.clickon' },
  { section: 'experience', from: { x: 960, y: 150 }, to: 'experience' },
  { section: 'achievements', from: { x: 640, y: 530 }, to: 'achievements' },
  { section: 'research', from: { x: 960, y: 530 }, to: 'research.rag' },
  { section: 'contact', from: { x: 800, y: 540 }, to: 'contact' },
]

const NOTE = { w: 104, h: 80, y: 8, gap: 12 }
const NOTE_TILT = [-3, 2, -1.5, 3, -2]

export function notePos(i: number): Box {
  const total = SKILLS.length * NOTE.w + (SKILLS.length - 1) * NOTE.gap
  const x0 = (STAGE.w - total) / 2
  return { x: x0 + i * (NOTE.w + NOTE.gap), y: NOTE.y, w: NOTE.w, h: NOTE.h, rot: NOTE_TILT[i % NOTE_TILT.length] }
}

/** The pin at the bottom of a sticky note, where its skill strings start. */
export function noteOrigin(i: number): Point {
  const b = notePos(i)
  return { x: b.x + b.w / 2, y: b.y + b.h - 10 }
}

/** A string between two pins that sags under gravity, or pulls nearly straight when highlighted. */
export function stringPath(a: Point, b: Point, taut = false): string {
  const len = Math.hypot(b.x - a.x, b.y - a.y)
  const sag = taut ? len * 0.015 : Math.min(56, 10 + len * 0.09)
  const cx = (a.x + b.x) / 2
  const cy = (a.y + b.y) / 2 + sag
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}
