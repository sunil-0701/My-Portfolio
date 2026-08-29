import { motion } from 'framer-motion'
import Button from '../ui/Button'
import ShineText from '../ui/ShineText'

const reveal = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const stack = {
  hidden: {},
  show: { transition: { delayChildren: 0.25, staggerChildren: 0.1 } },
}

const ArrowIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H8M17 7V16" />
  </svg>
)

const ROLE_LINES = [
  'BACKEND ENGINEER',
  'BUILDING SCALABLE SYSTEMS',
  'THAT SOLVE REAL PROBLEMS.',
]

export default function HeroContent() {
  return (
    <motion.div
      variants={stack}
      initial="hidden"
      animate="show"
      className="relative z-10 flex min-h-screen flex-col justify-center px-6 pt-16 pb-12 sm:px-10 lg:pl-[20vw] lg:px-0 lg:pt-0"
    >
      {/* Greeting */}
      <motion.p
        variants={reveal}
        className="mb-3 text-[0.66rem] font-medium uppercase tracking-[0.3em] text-[#a0a0a5] sm:text-[0.7rem]"
      >
        HELLO, I&apos;M
      </motion.p>

      {/* Main Name */}
      <motion.h1
        variants={reveal}
        className="font-display text-[clamp(3.2rem,6.4vw,7.6rem)] font-normal uppercase leading-[0.88] text-[#eeeeec] [text-shadow:0_0_40px_rgba(255,255,255,0.14)]"
      >
        <span className="tracking-[0.11em]">SUNIL</span>
        <br />
        <span className="tracking-[0.11em]">AMARTHYA</span>
        <span className="animate-blink-period inline-block tracking-normal">.</span>
      </motion.h1>

      {/* Subtle Horizontal Divider */}
      <motion.div
        variants={reveal}
        className="my-6 h-[1px] w-[40px] bg-white/20"
      />

      {/* Role Lines with Vertical Light Sweep */}
      <motion.div
        variants={reveal}
        className="flex flex-col gap-2 text-[0.68rem] font-light uppercase leading-relaxed tracking-[0.24em] sm:text-[0.74rem]"
      >
        {ROLE_LINES.map((line, i) => (
          <ShineText key={line} delay={i * 0.4}>
            {line}
          </ShineText>
        ))}
      </motion.div>

      {/* Button */}
      <motion.div variants={reveal} className="mt-8">
        <Button icon={ArrowIcon}>
          EXPLORE MY WORK
        </Button>
      </motion.div>
    </motion.div>
  )
}


