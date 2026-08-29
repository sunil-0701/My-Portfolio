import { motion } from 'framer-motion'

export default function HeroBackground() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Base radial illumination behind portrait */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60vw 70vh at 75% 40%, rgba(255,255,255,0.075), transparent 70%)',
        }}
      />

      {/* Low atmospheric floor glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75vw 30vh at 50% 98%, rgba(255,255,255,0.035), transparent 75%)',
        }}
      />

      {/* Left side sweeping orbital curve */}
      <div className="absolute -left-[25vw] -top-[15vh] h-[120vw] w-[120vw] max-w-[1600px] max-h-[1600px]">
        <svg className="h-full w-full" viewBox="0 0 1000 1000" fill="none">
          <circle
            cx="500"
            cy="500"
            r="430"
            stroke="rgba(255, 255, 255, 0.075)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Right side portrait orbital ring with travelling dot */}
      <div className="absolute left-[72%] top-[40%] h-[68vw] w-[68vw] max-w-[1000px] max-h-[1000px] -translate-x-1/2 -translate-y-1/2">
        <svg className="h-full w-full animate-orbital-drift" viewBox="0 0 1000 1000" fill="none">
          <circle
            cx="500"
            cy="500"
            r="440"
            stroke="rgba(255, 255, 255, 0.075)"
            strokeWidth="1.2"
          />
          <circle
            cx="500"
            cy="500"
            r="360"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="1"
          />
          {/* Light point sitting on outer circle */}
          <circle
            cx="940"
            cy="500"
            r="3"
            fill="#ffffff"
            className="shadow-[0_0_8px_2px_rgba(255,255,255,0.9)]"
          />
        </svg>
      </div>

      {/* Film grain texture */}
      <div className="bg-grain absolute inset-0 opacity-[0.045] mix-blend-overlay" />

      {/* Subtle edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 160px 35px rgba(0,0,0,0.7)' }}
      />
    </motion.div>
  )
}


