import { useEffect, useState } from 'react'
import { STAGE } from '../board/layout'

export interface Viewport {
  w: number
  h: number
}

export interface Fit {
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

export const HUD_TOP = 48
export const HUD_BOTTOM = 76
/** Room left around the stage for the wooden frame. */
const FRAME = 36

export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

/** Scale the stage to the largest size that fits between the HUD bars. */
export function fitStage(vp: Viewport): Fit {
  const availW = vp.w - 2 * (FRAME + 12)
  const availH = vp.h - HUD_TOP - HUD_BOTTOM - 2 * FRAME
  const scale = Math.max(0.2, Math.min(availW / STAGE.w, availH / STAGE.h, 1.4))
  return {
    scale,
    left: (vp.w - STAGE.w * scale) / 2,
    top: HUD_TOP + FRAME + (availH - STAGE.h * scale) / 2,
  }
}

/** Below this board scale the text gets too small to read, so phones and narrow windows get the stacked layout. */
export const isStacked = (fit: Fit) => fit.scale < 0.55

/** Where the focused evidence panel sits once it has zoomed in. On phones it is a full-screen sheet. */
export function panelRect(vp: Viewport, stacked: boolean): Rect {
  if (stacked) return { left: 6, top: 6, width: vp.w - 12, height: vp.h - 12 }
  const width = Math.min(1120, vp.w - 32)
  const top = HUD_TOP + 4
  return { left: (vp.w - width) / 2, top, width, height: vp.h - top - HUD_BOTTOM - 10 }
}
