import { useEffect, useState } from 'react'
import type { SectionId } from '../data/caseFile'

const KEY = 'case-2027-examined'

function load(): Set<SectionId> {
  try {
    const raw = sessionStorage.getItem(KEY)
    return new Set(raw ? (JSON.parse(raw) as SectionId[]) : [])
  } catch {
    return new Set()
  }
}

function save(seen: Set<SectionId>) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify([...seen]))
  } catch {
    // Storage can be blocked (private mode); the counter just resets on reload.
  }
}

/** Sections the visitor has opened this session, for the "Examined 3/6" counter and stamps. */
export function useExamined(active: SectionId | null): ReadonlySet<SectionId> {
  const [seen, setSeen] = useState<Set<SectionId>>(load)
  useEffect(() => {
    if (!active) return
    setSeen((prev) => {
      if (prev.has(active)) return prev
      const next = new Set(prev)
      next.add(active)
      save(next)
      return next
    })
  }, [active])
  return seen
}
