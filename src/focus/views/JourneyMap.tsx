// A hand-drawn style map of the journey so far. Every stop is a button that shows its details.
import { m } from 'motion/react'
import type { KeyboardEvent, ReactNode } from 'react'
import { JOURNEY } from '../../data/caseFile'
import type { StopId } from '../../data/caseFile'
import { smoothPath } from '../../lib/curves'

const INK = '#4a3420'
const RED = '#a8231c'

/** Map coordinates (in the 1000×440 viewBox) and label placement for each stop. The years sit under the name. */
const PLACES: Record<StopId, { x: number; y: number; label: string; labelY: number }> = {
  jee: { x: 120, y: 262, label: 'JEE Advanced', labelY: 302 },
  iiitm: { x: 340, y: 176, label: 'IIITM Gwalior', labelY: 106 },
  firstbench: { x: 548, y: 262, label: 'Firstbench.ai', labelY: 302 },
  // Named above its flag: below it, the trail on to the next stop would run through the label.
  hackon: { x: 742, y: 236, label: 'Amazon HackOn', labelY: 168 },
  next: { x: 906, y: 318, label: 'Your team?', labelY: 362 },
}

const TREES = [
  [52, 352], [86, 340], [118, 360], [70, 384], [104, 392], [140, 380], [176, 398],
  [40, 404], [150, 414], [206, 410], [232, 388], [190, 368],
]

const MOUNTAINS = [
  [604, 120, 50], [642, 104, 60], [690, 122, 46], [728, 98, 64], [776, 116, 52], [818, 102, 58], [858, 120, 44],
]

function Icon({ id }: { id: StopId }) {
  switch (id) {
    case 'jee':
      return (
        <g transform="translate(0 -30)">
          <rect x="-11" y="-10" width="22" height="26" fill="#f6eedb" stroke={INK} strokeWidth="1.6" />
          <path d="M-6 -3 H6 M-6 3 H6 M-6 9 H2" stroke={INK} strokeWidth="1.4" />
        </g>
      )
    case 'iiitm':
      return (
        <g transform="translate(0 -26)" fill="#c9a76d" stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M-24 14 V-4 h6 v-6 h6 v6 h6 v-6 h6 v6 h6 v-6 h6 v6 h6 V14 Z" />
          <path d="M-5 14 v-8 a5 5 0 0 1 10 0 v8" fill="#6b4a24" />
        </g>
      )
    case 'firstbench':
      return (
        <g transform="translate(0 -28)" stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M-16 -2 L0 -16 L16 -2 Z" fill="#a8231c" />
          <rect x="-13" y="-2" width="26" height="18" fill="#f1e4c6" />
          <rect x="-4" y="6" width="8" height="10" fill="#6b4a24" />
        </g>
      )
    case 'hackon':
      return (
        <g transform="translate(0 -6)" stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
          <path d="M-2 0 V-36" fill="none" />
          <path d="M-2 -36 L20 -29 L-2 -22 Z" fill="#a8231c" />
        </g>
      )
    case 'next':
      return (
        <g stroke={RED} strokeWidth="5" strokeLinecap="round">
          <path d="M-11 -11 L11 11 M11 -11 L-11 11" />
        </g>
      )
  }
}

interface Props {
  selected: StopId
  onSelect: (id: StopId) => void
}

export function JourneyMap({ selected, onSelect }: Props) {
  const trail = smoothPath(JOURNEY.map((s) => PLACES[s.id]))

  const onKey = (id: StopId) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(id)
    }
  }

  return (
    <svg viewBox="0 0 1000 440" className="block h-auto w-full" role="group" aria-label="Map of the journey so far">
      {/* Frame */}
      <rect x="6" y="6" width="988" height="428" fill="none" stroke={INK} strokeWidth="2.5" />
      <rect x="14" y="14" width="972" height="412" fill="none" stroke={INK} strokeWidth="1" opacity="0.6" />

      {/* Sea, river, hills, mountains and woods */}
      <path
        d="M14 14 H300 C 290 48, 250 70, 200 82 C 150 94, 120 120, 90 150 C 64 176, 40 182, 14 186 Z"
        fill="#a9bcb6"
        fillOpacity="0.55"
        stroke="#5f7f86"
        strokeWidth="1.5"
      />
      <g fill="none" stroke="#5f7f86" strokeWidth="1.3" opacity="0.7">
        <path d="M44 52 q 7 -6 14 0 t 14 0" />
        <path d="M120 40 q 7 -6 14 0 t 14 0" />
        <path d="M70 110 q 7 -6 14 0 t 14 0" />
        <path d="M200 46 q 7 -6 14 0 t 14 0" />
      </g>
      <Label x={128} y={86} size={20} color="#4d6b70" rotate={-8}>
        Debugging Sea
      </Label>
      <path
        d="M200 84 C 240 140, 210 200, 280 236 S 420 250, 470 300 S 610 400, 700 426"
        fill="none"
        stroke="#6d8f99"
        strokeWidth="6"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <g fill="none" stroke="#8a6a3c" strokeOpacity="0.35" strokeWidth="1.3">
        <path d="M380 392 q 40 -36 80 0" />
        <path d="M400 392 q 20 -18 40 0" />
        <path d="M620 330 q 50 -40 100 0" />
        <path d="M800 410 q 40 -30 80 0" />
      </g>
      <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
        {MOUNTAINS.map(([x, y, h]) => (
          <g key={x}>
            <path d={`M ${x - h / 2} ${y} L ${x} ${y - h * 0.9} L ${x + h / 2} ${y} Z`} fill="#cdb68a" />
            <path
              d={`M ${x - h * 0.16} ${y - h * 0.58} L ${x} ${y - h * 0.9} L ${x + h * 0.16} ${y - h * 0.58} L ${x} ${y - h * 0.5} Z`}
              fill="#f7efdc"
            />
          </g>
        ))}
      </g>
      <Label x={735} y={36} size={20} color="#5b4426">
        Mount Expert
      </Label>
      <g>
        {TREES.map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`} stroke={INK} strokeWidth="1">
            <path d="M0 -14 L-9 4 H9 Z" fill="#7d8a55" />
            <path d="M0 -6 L-11 12 H11 Z" fill="#6d7a48" />
            <rect x="-1.5" y="12" width="3" height="6" fill={INK} />
          </g>
        ))}
      </g>
      <Label x={318} y={392} size={18} color="#4f5a33">
        Recursion Woods
      </Label>

      {/* Title and compass */}
      <Label x={450} y={50} size={28} color={INK}>
        The Road So Far
      </Label>
      <path d="M352 60 H548" stroke={INK} strokeWidth="1" opacity="0.6" />
      <g transform="translate(940 80)" stroke={INK} strokeWidth="1.4">
        <circle r="28" fill="none" opacity="0.6" />
        <path d="M0 -34 L6 0 L0 34 L-6 0 Z" fill="#cdb68a" />
        <path d="M0 -34 L6 0 L-6 0 Z" fill={RED} />
        <path d="M-34 0 L0 5 L34 0 L0 -5 Z" fill="#f1e4c6" />
      </g>
      <Label x={940} y={36} size={14} color={INK}>
        N
      </Label>

      {/* Scale bar */}
      <g transform="translate(480 414)" stroke={INK} strokeWidth="1.5">
        <path d="M0 0 H100 M0 -5 V5 M50 -4 V4 M100 -5 V5" />
      </g>
      <Label x={530} y={404} size={15} color={INK}>
        about one year
      </Label>

      {/* The trail draws itself, then the stops pop in. The draw animation is a mask, because animating
          pathLength on the dotted path itself would overwrite its dash pattern. */}
      <defs>
        <mask id="trail-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="440">
          <m.path
            d={trail}
            fill="none"
            stroke="#fff"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.35, ease: 'easeInOut' }}
          />
        </mask>
      </defs>
      <path
        d={trail}
        fill="none"
        stroke={RED}
        strokeWidth="3.6"
        strokeDasharray="2 10"
        strokeLinecap="round"
        mask="url(#trail-reveal)"
      />

      {JOURNEY.map((stop, i) => {
        const p = PLACES[stop.id]
        const on = selected === stop.id
        return (
          <m.g
            key={stop.id}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${stop.title}, ${stop.when}`}
            className="cursor-pointer outline-none [&:focus-visible_.stop-ring]:stroke-[#f0b44a]"
            style={{ transformBox: 'fill-box' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.28, type: 'spring', stiffness: 300, damping: 18 }}
            onClick={() => onSelect(stop.id)}
            onMouseEnter={() => onSelect(stop.id)}
            onKeyDown={onKey(stop.id)}
          >
            <g transform={`translate(${p.x} ${p.y})`}>
              <circle r="34" fill="transparent" />
              {on && (
                <m.circle
                  r="16"
                  fill="none"
                  stroke={RED}
                  strokeWidth="2"
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <Icon id={stop.id} />
              {stop.id !== 'next' && (
                <circle className="stop-ring" r="7" fill={on ? RED : '#f6eedb'} stroke={RED} strokeWidth="3" />
              )}
            </g>
            <Label x={p.x} y={p.labelY} size={on ? 24 : 22} color={on ? RED : INK}>
              {p.label}
            </Label>
            {stop.years && (
              <text
                x={p.x}
                y={p.labelY + 20}
                fill={on ? RED : '#6b4a24'}
                fontSize="16"
                textAnchor="middle"
                style={{ fontFamily: 'var(--font-type)', letterSpacing: '0.06em' }}
              >
                {stop.years}
              </text>
            )}
          </m.g>
        )
      })}
    </svg>
  )
}

/** How far down to shift each icon, as drawn above its stop, to centre it on a row of the upright map. */
const ICON_DROP: Partial<Record<StopId, number>> = { jee: 27, iiitm: 24, firstbench: 27, hackon: 24 }

const ROW = 54
const ROW_TOP = 66
const ROUTE_X = [40, 72, 36, 74, 42]

/** The phone version of the map: the same route running top to bottom, with every label beside its stop. */
export function JourneyTrail({ selected, onSelect }: Props) {
  const stops = JOURNEY.map((stop, i) => ({ stop, x: ROUTE_X[i], y: ROW_TOP + i * ROW }))
  const height = ROW_TOP + JOURNEY.length * ROW - 4

  const onKey = (id: StopId) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(id)
    }
  }

  return (
    <svg viewBox={`0 0 350 ${height}`} className="block h-auto w-full" role="group" aria-label="Map of the journey so far">
      <rect x="3" y="3" width="344" height={height - 6} fill="none" stroke={INK} strokeWidth="2.2" />
      <rect x="8" y="8" width="334" height={height - 16} fill="none" stroke={INK} strokeWidth="0.8" opacity="0.6" />
      <path d="M8 8 H96 C 88 28, 58 34, 36 38 C 22 40, 14 44, 8 48 Z" fill="#a9bcb6" fillOpacity="0.55" stroke="#5f7f86" strokeWidth="1.2" />

      <Label x={175} y={36} size={21} color={INK}>
        The Road So Far
      </Label>
      <g transform="translate(316 34) scale(0.56)" stroke={INK} strokeWidth="1.8">
        <circle r="28" fill="none" opacity="0.6" />
        <path d="M0 -34 L6 0 L0 34 L-6 0 Z" fill="#cdb68a" />
        <path d="M0 -34 L6 0 L-6 0 Z" fill={RED} />
        <path d="M-34 0 L0 5 L34 0 L0 -5 Z" fill="#f1e4c6" />
      </g>
      <g stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
        {[[306, 108, 34], [326, 112, 26]].map(([x, y, h]) => (
          <g key={x}>
            <path d={`M ${x - h / 2} ${y} L ${x} ${y - h * 0.9} L ${x + h / 2} ${y} Z`} fill="#cdb68a" />
            <path d={`M ${x - h * 0.16} ${y - h * 0.58} L ${x} ${y - h * 0.9} L ${x + h * 0.16} ${y - h * 0.58} Z`} fill="#f7efdc" />
          </g>
        ))}
      </g>
      <g stroke={INK} strokeWidth="0.8">
        {[[300, height - 44], [320, height - 52], [326, height - 30], [304, height - 24]].map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <path d="M0 -12 L-8 3 H8 Z" fill="#7d8a55" />
            <path d="M0 -5 L-9 10 H9 Z" fill="#6d7a48" />
          </g>
        ))}
      </g>

      <path d={smoothPath(stops)} fill="none" stroke={RED} strokeWidth="3.4" strokeDasharray="2 9" strokeLinecap="round" />

      {stops.map(({ stop, x, y }) => {
        const on = selected === stop.id
        return (
          <g
            key={stop.id}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${stop.title}, ${stop.when}`}
            className="cursor-pointer outline-none [&:focus-visible_.stop-ring]:stroke-[#f0b44a]"
            onClick={() => onSelect(stop.id)}
            onKeyDown={onKey(stop.id)}
          >
            <rect x="8" y={y - ROW / 2} width="334" height={ROW} fill={on ? RED : 'transparent'} fillOpacity={on ? 0.08 : 0} />
            {stop.id === 'next' ? (
              <g transform={`translate(${x} ${y})`}>
                <Icon id="next" />
              </g>
            ) : (
              <>
                <circle className="stop-ring" cx={x} cy={y} r="7" fill={on ? RED : '#f6eedb'} stroke={RED} strokeWidth="3" />
                <g transform={`translate(112 ${y + (ICON_DROP[stop.id] ?? 0) * 0.72}) scale(0.72)`}>
                  <Icon id={stop.id} />
                </g>
              </>
            )}
            <Label x={136} y={stop.years ? y - 1 : y + 6} size={on ? 19 : 18} color={on ? RED : INK} anchor="start">
              {stop.id === 'iiitm' ? 'IIITM Gwalior' : stop.title}
            </Label>
            {stop.years && (
              <text x={136} y={y + 16} fill={on ? RED : '#6b4a24'} fontSize="13.5" style={{ fontFamily: 'var(--font-type)', letterSpacing: '0.05em' }}>
                {stop.years}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function Label({
  x,
  y,
  size,
  color,
  rotate = 0,
  anchor = 'middle',
  children,
}: {
  x: number
  y: number
  size: number
  color: string
  rotate?: number
  anchor?: 'start' | 'middle'
  children: ReactNode
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      textAnchor={anchor}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      style={{ fontFamily: 'var(--font-map)' }}
    >
      {children}
    </text>
  )
}
