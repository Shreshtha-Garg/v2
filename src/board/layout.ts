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
  name: 'wide' | 'tall' | 'phone'
  stage: { w: number; h: number }
  /** Tall boards use the shorter versions of the pinned items. */
  compact: boolean
  /** Width of the wooden frame around the stage, and the size of the pins. */
  frame: number
  pin: number
  items: Record<SectionId, Box>
  /** Where each pin sits, kept near item edges so strings cross cork, not text. */
  anchors: Record<Anchor, Point>
  /** Red string joining the evidence to the subject's dossier. */
  strings: CoreString[]
  /** `x` puts the notes in a column at that position instead of a row across the top. */
  note: { w: number; h: number; y: number; gap: number; font: number; x?: number }
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
  frame: 16,
  pin: 20,
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
  frame: 16,
  pin: 20,
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

/**
 * The phone board, drawn at phone size for the room the screen gives it: two columns and three rows
 * upright, three columns and two rows held sideways with the sticky notes down the left.
 */
export function phoneLayout(w: number, h: number, sideways: boolean): BoardLayout {
  const side = 8
  const gapX = 14
  const gapY = 18
  const noteW = 68
  const left = sideways ? side + noteW + 12 : side
  const top = sideways ? 12 : 62
  const cols = sideways ? 3 : 2
  const rows = sideways ? 2 : 3
  const colW = (w - left - side - gapX * (cols - 1)) / cols
  const rowH = (h - top - 8 - gapY * (rows - 1)) / rows

  const order: SectionId[] = ['about', 'projects', 'experience', 'achievements', 'research', 'contact']
  const tilt = [-0.6, 0.7, 0.5, -0.5, -0.4, 0.6]
  const items = Object.fromEntries(
    order.map((id, i) => [
      id,
      {
        x: left + (i % cols) * (colW + gapX),
        y: top + Math.floor(i / cols) * (rowH + gapY),
        w: colW,
        h: rowH,
        rot: tilt[i],
      },
    ]),
  ) as Record<SectionId, Box>

  const drop = colW * 0.75
  const across = Math.min(40, rowH * 0.28)
  const down = (a: SectionId, b: SectionId, section: SectionId): CoreString => ({
    section,
    from: at(items[a], drop, rowH - 3),
    to: at(items[b], drop, 3),
  })
  const beside = (a: SectionId, b: SectionId, section: SectionId): CoreString => ({
    section,
    from: at(items[a], colW - 5, across),
    to: at(items[b], -1, across),
  })

  return {
    name: 'phone',
    stage: { w, h },
    compact: true,
    frame: 7,
    pin: 12,
    items,
    anchors: {
      about: at(items.about, colW / 2, 3),
      'projects.clickon': at(items.projects, -1, across),
      'projects.hostelmate': at(items.projects, -1, rowH * 0.6),
      'projects.archive': at(items.projects, -1, rowH - 10),
      experience: at(items.experience, -1, rowH * 0.45),
      achievements: at(items.achievements, drop, 3),
      'research.rag': at(items.research, -1, rowH * 0.3),
      'research.trojan': at(items.research, colW * 0.06 - 1, rowH * 0.72),
      contact: at(items.contact, drop, 3),
    },
    strings: sideways
      ? [
          beside('about', 'projects', 'projects'),
          beside('projects', 'experience', 'experience'),
          down('about', 'achievements', 'achievements'),
          down('projects', 'research', 'research'),
          down('experience', 'contact', 'contact'),
        ]
      : [
          beside('about', 'projects', 'projects'),
          down('about', 'experience', 'experience'),
          down('projects', 'achievements', 'achievements'),
          down('experience', 'research', 'research'),
          down('achievements', 'contact', 'contact'),
        ],
    note: sideways
      ? { w: noteW, h: (h - 16 - 4 * 6) / 5, y: 8, gap: 6, font: 18, x: side }
      : { w: (w - 16 - 4 * 5) / 5, h: 42, y: 6, gap: 5, font: 18 },
  }
}

const NOTE_TILT = [-3, 2, -1.5, 3, -2]

export function notePos(layout: BoardLayout, i: number): Box {
  const { w, h, y, gap, x } = layout.note
  if (x !== undefined) return { x, y: y + i * (h + gap), w, h, rot: NOTE_TILT[i % NOTE_TILT.length] }
  const total = SKILLS.length * w + (SKILLS.length - 1) * gap
  const x0 = (layout.stage.w - total) / 2
  return { x: x0 + i * (w + gap), y, w, h, rot: NOTE_TILT[i % NOTE_TILT.length] }
}

/** The pin at the bottom of a sticky note, where its skill strings start. */
export function noteOrigin(layout: BoardLayout, i: number): Point {
  const b = notePos(layout, i)
  return { x: b.x + b.w / 2, y: b.y + b.h - layout.pin / 2 + 1 }
}

/** A string between two pins that sags under gravity, or pulls nearly straight when highlighted. */
export function stringPath(a: Point, b: Point, taut = false): string {
  const len = Math.hypot(b.x - a.x, b.y - a.y)
  const sag = taut ? len * 0.015 : Math.min(56, 10 + len * 0.09)
  const cx = (a.x + b.x) / 2
  const cy = (a.y + b.y) / 2 + sag
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}
