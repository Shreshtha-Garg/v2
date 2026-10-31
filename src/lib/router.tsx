// A tiny History API router. The site only needs "/" plus six section paths, so this replaces a full
// routing library: the current path, programmatic navigation, and links that don't reload the page.
import { useSyncExternalStore } from 'react'
import type { AnchorHTMLAttributes, MouseEvent } from 'react'

const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('popstate', onChange)
  }
}

const getPathname = () => window.location.pathname

export function navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
  if (to === window.location.pathname) return
  if (replace) window.history.replaceState(null, '', to)
  else window.history.pushState(null, '', to)
  listeners.forEach((notify) => notify())
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, getPathname)
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
}

/** An in-app link. Modified clicks (new tab, new window) keep their normal browser behaviour. */
export function Link({ to, onClick, ...rest }: LinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handleClick} {...rest} />
}
