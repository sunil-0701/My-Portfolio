import { useEffect, useState } from 'react'

export default function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? 'home')

  useEffect(() => {
    let frame = 0
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const update = () => {
      frame = 0
      const threshold = Math.min(window.innerHeight * 0.3, 200)
      let current = sections[0]?.id ?? 'home'
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= threshold) current = section.id
      }
      const height = document.documentElement.scrollHeight
      if (height > window.innerHeight + 2 && Math.ceil(window.scrollY + window.innerHeight) >= height - 2) {
        current = sections.at(-1)?.id ?? current
      }
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('pageshow', schedule)
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null
    sections.forEach((section) => observer?.observe(section))
    document.fonts?.addEventListener('loadingdone', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pageshow', schedule)
      observer?.disconnect()
      document.fonts?.removeEventListener('loadingdone', schedule)
    }
  }, [ids])

  return active
}
