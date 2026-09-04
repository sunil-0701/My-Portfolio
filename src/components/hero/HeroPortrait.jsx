import { motion } from 'framer-motion'
import portrait from '../../assets/profile-portrait.jpg'
import { SITE } from '../../config/site'

// Fades on all four edges so the photo dissolves into the background instead of
// being hard-cropped at the viewport edge.
const MASK =
  'radial-gradient(ellipse 62% 74% at 52% 42%, #000 26%, rgba(0,0,0,0.72) 54%, transparent 80%)'

export default function HeroPortrait({ ready = true }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 right-0 z-[var(--z-behind)] w-[88%] sm:w-[66%] md:w-[58%] lg:w-[52%] xl:w-[50%]"
      initial={{ opacity: 0, scale: 1.07 }}
      animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.07 }}
      transition={{ duration: 2.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Atmospheric aura behind the silhouette, breathing slowly */}
      <div
        aria-hidden="true"
        className="animate-aura-breathe absolute left-[52%] top-[40%] h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen blur-[70px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.09) 45%, transparent 75%)',
        }}
      />

      <div className="parallax parallax-mid relative h-full w-full">
        <img
          src={portrait}
          alt={`${SITE.name}, photographed in profile`}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[48%_20%] opacity-30 brightness-[1.02] contrast-[1.06] sm:opacity-45 lg:opacity-100"
          style={{ maskImage: MASK, WebkitMaskImage: MASK }}
        />
      </div>

      {/* Soft rim light on the head. Deliberately NOT mix-blend-screen: the
          animated wrapper isolates the blend group, which made the layer's own
          box edge show up as a vertical seam down the middle of the hero. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 58% 30%, rgba(255,255,255,0.13), transparent 42%)',
        }}
      />

      {/* Right-edge scrim — kills the vertical hard cut at the viewport boundary */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[18%]"
        style={{
          background: 'linear-gradient(to left, #020304 0%, rgba(2,3,4,0.55) 45%, transparent 100%)',
        }}
      />

      {/* The floor fade lives in Landing, spanning the whole section. Boxed to
          this container it read as a rectangular shadow under the photo. */}
    </motion.div>
  )
}
