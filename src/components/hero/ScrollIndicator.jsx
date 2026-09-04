import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  return (
    <motion.div
      aria-hidden="true"
      className="flex items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.3, ease: 'easeOut' }}
    >
      {/* Rule with a light point travelling down it */}
      <span className="relative block h-10 w-px overflow-hidden bg-white/15">
        <span className="animate-scroll-travel absolute inset-x-0 top-0 block h-4 bg-gradient-to-b from-transparent via-paper to-transparent" />
      </span>

      <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-faint">
        Scroll
      </span>
    </motion.div>
  )
}
