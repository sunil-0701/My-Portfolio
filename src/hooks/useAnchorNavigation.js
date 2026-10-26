import { useEffect } from 'react'

export default function useAnchorNavigation(ready) {
  useEffect(() => {
    if (!ready) return
    let frame = 0
    const visit = (hash) => {
      let id
      try { id = decodeURIComponent(hash.slice(1)) } catch { return }
      if (!id) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const target = document.getElementById(id)
        if (!target) return
        target.scrollIntoView({ block: 'start', behavior: 'instant' })
        const heading = target.id === 'main' ? target : target.querySelector('h1, h2') ?? target
        if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
      })
    }
    const onHashChange = () => visit(window.location.hash)
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      const destination = new URL(link.href, window.location.href)
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.search === window.location.search) {
        visit(destination.hash)
      }
    }
    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [ready])
}
