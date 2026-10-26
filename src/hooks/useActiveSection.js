import { useEffect, useState } from 'react'

export default function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? 'home')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const threshold = Math.min(window.innerHeight * 0.3, 200)
      let current = ids[0] ?? 'home'
      for (const id of ids) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= threshold) current = id
      }
      const height = document.documentElement.scrollHeight
      if (height > window.innerHeight + 2 && Math.ceil(window.scrollY + window.innerHeight) >= height - 2) {
        current = ids.at(-1) ?? current
      }
      setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ids])

  return active
}
