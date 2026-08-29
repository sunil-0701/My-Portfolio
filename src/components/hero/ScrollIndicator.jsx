import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-[4vw] z-10 flex items-end gap-3.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
    >
      {/* Vertical line with glowing white dot at top */}
      <div className="flex flex-col items-center">
        <span className="animate-subtle-pulse h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]" />
        <span className="h-10 w-[1px] bg-white/20" />
      </div>

      {/* Label beside lower portion */}
      <span className="pb-0.5 text-[0.68rem] font-light uppercase tracking-[0.26em] text-[#707075]">
        SCROLL DOWN
      </span>
    </motion.div>
  )
}

