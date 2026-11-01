import { useEffect, useState } from 'react'
import { TALL, WIDE } from '../board/layout'
import type { BoardLayout } from '../board/layout'

export interface Viewport {
  w: number
  h: number
}

export interface Fit {
  layout: BoardLayout
  scale: number
  left: number
  top: number
}

export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export const HUD_TOP = 36
export const HUD_BOTTOM = 52
/** Room left around the stage for the wooden frame. */
const FRAME = 18

export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

/** Scale a layout's stage to the largest size that fits between the HUD bars. */
function fitTo(layout: BoardLayout, vp: Viewport): Fit {
  const availW = vp.w - 2 * (FRAME + 6)
  const availH = vp.h - HUD_TOP - HUD_BOTTOM - 2 * FRAME
  const { w, h } = layout.stage
  const scale = Math.max(0.2, Math.min(availW / w, availH / h, 1.4))
  return { layout, scale, left: (vp.w - w * scale) / 2, top: HUD_TOP + FRAME + (availH - h * scale) / 2 }
}

/** Use whichever board shape fills this window best: wide for PCs and landscape, tall for portrait tablets. */
export function fitBoard(vp: Viewport): Fit {
  const wide = fitTo(WIDE, vp)
  const tall = fitTo(TALL, vp)
  return tall.scale > wide.scale ? tall : wide
}

/** Phones, and windows too short for any board to stay readable, get the stacked column. */
export const isStacked = (vp: Viewport, fit: Fit) => vp.w < 700 || fit.scale < 0.42

/** Where the focused evidence panel sits once it has zoomed in. On phones it is a full-screen sheet. */
export function panelRect(vp: Viewport, stacked: boolean): Rect {
  if (stacked) return { left: 6, top: 6, width: vp.w - 12, height: vp.h - 12 }
  const width = Math.min(1120, vp.w - 16)
  const top = HUD_TOP + 2
  return { left: (vp.w - width) / 2, top, width, height: vp.h - top - HUD_BOTTOM - 6 }
}
