import { useEffect } from 'react'

/**
 * Replicates Portfolio/nav.js: intercepts clicks on in-page `#anchor` links,
 * smooth-scrolls to the target, then clears the hash from the URL via
 * pushState so the address bar never shows a fragment (instead of relying
 * on .htaccess rewrites for client-side nav).
 */
export function useHashNav(): void {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!link) return

      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return

      const el = document.querySelector(hash)
      if (!el) return

      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth' })
      history.pushState({}, '', location.pathname)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}
