// The atmosphere is static: no pointer listeners, animation loops, or moving
// full-screen surfaces. Keep the original rings and cool-neutral palette.
const STAR_DUST = [
  [8, 15], [14, 42], [22, 78], [31, 12], [38, 88], [45, 26],
  [52, 64], [61, 18], [68, 92], [76, 14], [84, 82], [91, 35],
  [5, 68], [18, 24], [27, 55], [35, 34], [42, 72], [49, 10],
  [58, 84], [65, 38], [73, 60], [81, 22], [89, 75], [96, 12],
  [11, 85], [25, 40], [40, 6], [55, 48], [70, 4], [86, 45],
  [16, 94], [47, 92], [63, 70], [78, 96], [93, 58], [29, 90],
]

export default function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[var(--z-behind)] overflow-hidden bg-ink"
      style={{
        backgroundImage: [
          'radial-gradient(ellipse 110% 105% at 50% 45%, transparent 42%, rgba(2,3,4,0.55) 78%, rgba(2,3,4,0.9) 100%)',
          'radial-gradient(ellipse 60% 70% at 85% 40%, rgba(255,255,255,0.065), transparent 75%)',
          'radial-gradient(ellipse 55% 65% at 15% 80%, rgba(143,179,163,0.035), transparent 75%)',
          'radial-gradient(ellipse 85% 40% at 50% 98%, rgba(255,255,255,0.04), transparent 75%)',
        ].join(', '),
      }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {STAR_DUST.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.06" fill="#ffffff" />
        ))}
      </svg>

      <div className="absolute -left-[28vw] -top-[18vh] h-[130vw] max-h-[1700px] w-[130vw] max-w-[1700px]">
        <svg className="h-full w-full" viewBox="0 0 1000 1000" fill="none">
          <circle cx="500" cy="500" r="460" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="500" cy="40" r="2" fill="rgba(143,179,163,0.8)" />
        </svg>
      </div>

      <div className="absolute left-[72%] top-[42%] h-[75vw] max-h-[1100px] w-[75vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2">
        <svg className="h-full w-full" viewBox="0 0 1000 1000" fill="none">
          <circle cx="500" cy="500" r="500" stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" />
          <circle cx="500" cy="500" r="440" stroke="rgba(255,255,255,0.075)" strokeWidth="1" />
          <circle cx="500" cy="500" r="360" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
          <circle cx="940" cy="500" r="2.5" fill="#ffffff" />
        </svg>
      </div>
    </div>
  )
}
