import { useEffect, useState } from 'react'
import { TALL, WIDE, phoneLayout } from '../board/layout'
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
/** The phone header, which has the resume button in it. */
const PHONE_TOP = 44
/** Room left around the stage for the wooden frame. */
const FRAME = 18
const PHONE_MARGIN = 11

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

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * The phone stage takes the size of the screen, so text stays at its real size. It only scales
 * when the screen is smaller than the cards can go, or much larger than they are meant to be.
 */
function fitPhone(vp: Viewport): Fit {
  const sideways = vp.w > vp.h
  const availW = vp.w - 2 * PHONE_MARGIN
  const availH = vp.h - PHONE_TOP - 2 * PHONE_MARGIN
  const w = sideways ? clamp(availW, 640, 900) : clamp(availW, 340, 440)
  const fitW = Math.min(1.3, availW / w)
  const h = sideways ? clamp(availH / fitW, 290, 420) : clamp(availH / fitW, 520, 740)
  const scale = Math.min(fitW, availH / h)
  return {
    layout: phoneLayout(w, h, sideways),
    scale,
    left: (vp.w - w * scale) / 2,
    top: PHONE_TOP + PHONE_MARGIN + (availH - h * scale) / 2,
  }
}

/** Use whichever board fills this window best: wide for PCs and landscape, tall for portrait tablets, and the
 *  phone board for narrow windows and for any window too short for the other two to stay readable. */
export function fitBoard(vp: Viewport): Fit {
  const wide = fitTo(WIDE, vp)
  const tall = fitTo(TALL, vp)
  const best = tall.scale > wide.scale ? tall : wide
  return vp.w < 700 || best.scale < 0.42 ? fitPhone(vp) : best
}

/** Where the focused evidence panel sits once it has zoomed in. On phones it is a full-screen sheet. */
export function panelRect(vp: Viewport, phone: boolean): Rect {
  if (phone) return { left: 6, top: 6, width: vp.w - 12, height: vp.h - 12 }
  const width = Math.min(1120, vp.w - 16)
  const top = HUD_TOP + 2
  return { left: (vp.w - width) / 2, top, width, height: vp.h - top - HUD_BOTTOM - 6 }
}
