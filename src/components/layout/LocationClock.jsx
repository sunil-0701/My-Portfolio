import { useEffect, useState } from 'react'
import { SITE } from '../../config/site'
import usePageVisible from '../../hooks/usePageVisible'

const cities = ['Bengaluru', 'Coimbatore', 'Bangalore', 'Bengaluru']
const clock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

export default function LocationClock({ ready = true }) {
  const [now, setNow] = useState(() => new Date())
  const pageVisible = usePageVisible()

  useEffect(() => {
    if (!ready || !pageVisible) return
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [ready, pageVisible])

  return (
    <div
      data-active={ready && pageVisible}
      className="location-status mt-1 hidden items-center gap-2 border-b border-paper/20 pb-3 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-faint sm:flex"
    >
      <span className="sr-only">{SITE.location}</span>
      <span aria-hidden="true" className="inline-flex shrink-0 items-center">
        <span className="block h-[1.5em] overflow-hidden">
          <span className="location-track flex flex-col">
            {cities.map((city, index) => (
              <span key={`${city}-${index}`} className="block h-[1.5em] shrink-0 whitespace-nowrap leading-[1.5]">
                {city}
              </span>
            ))}
          </span>
        </span>
        <span className="whitespace-nowrap">, IN</span>
      </span>
      <time dateTime={now.toISOString()} className="tabular whitespace-nowrap" aria-label={`Current time in India: ${clock.format(now)} IST`}>
        {clock.format(now)} IST
      </time>
    </div>
  )
}
