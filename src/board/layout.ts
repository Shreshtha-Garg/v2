import { SKILLS } from '../data/caseFile'
import type { Anchor, SectionId } from '../data/caseFile'

export interface Point {
  x: number
  y: number
}

export interface Box extends Point {
  w: number
  h: number
  rot: number
}

export interface CoreString {
  /** The board item this string belongs to; hovering that item lights it. */
  section: SectionId
  from: Point
  to: Point
}

/** One arrangement of the board, drawn on a fixed stage that is scaled to fit the window, like a game canvas. */
export interface BoardLayout {
  name: 'wide' | 'tall'
  stage: { w: number; h: number }
  /** Tall boards use the shorter versions of the pinned items. */
  compact: boolean
  items: Record<SectionId, Box>
  /** Where each pin sits, kept near item edges so strings cross cork, not text. */
  anchors: Record<Anchor, Point>
  /** Red string joining the evidence to the subject's dossier. */
  strings: CoreString[]
  note: { w: number; h: number; y: number; gap: number; font: number }
}

const at = (b: Box, dx: number, dy: number): Point => ({ x: b.x + dx, y: b.y + dy })

const WIDE_ITEMS: Record<SectionId, Box> = {
  projects: { x: 16, y: 32, w: 444, h: 356, rot: -1.8 },
  experience: { x: 980, y: 32, w: 444, h: 356, rot: 1.5 },
  about: { x: 542, y: 100, w: 356, h: 424, rot: -0.8 },
  achievements: { x: 26, y: 416, w: 424, h: 344, rot: 1.2 },
  research: { x: 990, y: 416, w: 424, h: 344, rot: -1.2 },
  contact: { x: 560, y: 562, w: 320, h: 196, rot: 0.8 },
}

const WIDE_ANCHORS: Record<Anchor, Point> = {
  about: at(WIDE_ITEMS.about, 178, 12),
  'projects.clickon': at(WIDE_ITEMS.projects, 434, 150),
  'projects.hostelmate': at(WIDE_ITEMS.projects, 434, 272),
  'projects.archive': at(WIDE_ITEMS.projects, 434, 334),
  experience: at(WIDE_ITEMS.experience, 16, 226),
  achievements: at(WIDE_ITEMS.achievements, 410, 40),
  'research.rag': at(WIDE_ITEMS.research, 14, 170),
  'research.trojan': at(WIDE_ITEMS.research, 126, 206),
  contact: at(WIDE_ITEMS.contact, 160, 10),
}

/** Three columns with the dossier in the middle. Used on PCs, laptops and landscape tablets. */
export const WIDE: BoardLayout = {
  name: 'wide',
  stage: { w: 1440, h: 780 },
  compact: false,
  items: WIDE_ITEMS,
  anchors: WIDE_ANCHORS,
  strings: [
    { section: 'projects', from: at(WIDE_ITEMS.about, 18, 26), to: WIDE_ANCHORS['projects.clickon'] },
    { section: 'experience', from: at(WIDE_ITEMS.about, 338, 26), to: WIDE_ANCHORS.experience },
    { section: 'achievements', from: at(WIDE_ITEMS.about, 18, 406), to: WIDE_ANCHORS.achievements },
    { section: 'research', from: at(WIDE_ITEMS.about, 338, 406), to: WIDE_ANCHORS['research.rag'] },
    { section: 'contact', from: at(WIDE_ITEMS.about, 178, 416), to: WIDE_ANCHORS.contact },
  ],
  note: { w: 96, h: 66, y: 6, gap: 8, font: 21 },
}

const TALL_ITEMS: Record<SectionId, Box> = {
  about: { x: 24, y: 104, w: 458, h: 356, rot: -0.7 },
  projects: { x: 518, y: 104, w: 458, h: 356, rot: 0.8 },
  experience: { x: 24, y: 486, w: 458, h: 356, rot: 0.6 },
  achievements: { x: 518, y: 486, w: 458, h: 356, rot: -0.6 },
  research: { x: 24, y: 868, w: 458, h: 356, rot: -0.6 },
  contact: { x: 528, y: 892, w: 438, h: 300, rot: 0.8 },
}

const TALL_ANCHORS: Record<Anchor, Point> = {
  about: at(TALL_ITEMS.about, 229, 12),
  'projects.clickon': at(TALL_ITEMS.projects, 10, 150),
  'projects.hostelmate': at(TALL_ITEMS.projects, 10, 272),
  'projects.archive': at(TALL_ITEMS.projects, 10, 334),
  experience: at(TALL_ITEMS.experience, 16, 226),
  achievements: at(TALL_ITEMS.achievements, 230, 10),
  'research.rag': at(TALL_ITEMS.research, 14, 170),
  'research.trojan': at(TALL_ITEMS.research, 160, 218),
  contact: at(TALL_ITEMS.contact, 118, 8),
}

/** Two columns and three rows, with no scrolling. Used on portrait tablets. */
export const TALL: BoardLayout = {
  name: 'tall',
  stage: { w: 1000, h: 1240 },
  compact: true,
  items: TALL_ITEMS,
  anchors: TALL_ANCHORS,
  // The strings run through the gutters between items, so none of them crosses any text.
  strings: [
    { section: 'projects', from: at(TALL_ITEMS.about, 446, 180), to: TALL_ANCHORS['projects.clickon'] },
    { section: 'experience', from: at(TALL_ITEMS.about, 230, 348), to: at(TALL_ITEMS.experience, 230, 10) },
    { section: 'achievements', from: at(TALL_ITEMS.projects, 230, 358), to: TALL_ANCHORS.achievements },
    { section: 'research', from: at(TALL_ITEMS.experience, 400, 346), to: at(TALL_ITEMS.research, 220, 12) },
    { section: 'contact', from: at(TALL_ITEMS.achievements, 108, 262), to: TALL_ANCHORS.contact },
  ],
  note: { w: 150, h: 74, y: 10, gap: 20, font: 26 },
}

const NOTE_TILT = [-3, 2, -1.5, 3, -2]

export function notePos(layout: BoardLayout, i: number): Box {
  const { w, h, y, gap } = layout.note
  const total = SKILLS.length * w + (SKILLS.length - 1) * gap
  const x0 = (layout.stage.w - total) / 2
  return { x: x0 + i * (w + gap), y, w, h, rot: NOTE_TILT[i % NOTE_TILT.length] }
}

/** The pin at the bottom of a sticky note, where its skill strings start. */
export function noteOrigin(layout: BoardLayout, i: number): Point {
  const b = notePos(layout, i)
  return { x: b.x + b.w / 2, y: b.y + b.h - 9 }
}

/** A string between two pins that sags under gravity, or pulls nearly straight when highlighted. */
export function stringPath(a: Point, b: Point, taut = false): string {
  const len = Math.hypot(b.x - a.x, b.y - a.y)
  const sag = taut ? len * 0.015 : Math.min(56, 10 + len * 0.09)
  const cx = (a.x + b.x) / 2
  const cy = (a.y + b.y) / 2 + sag
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}
