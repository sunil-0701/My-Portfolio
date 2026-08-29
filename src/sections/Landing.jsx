import HeroBackground from '../components/hero/HeroBackground'
import HeroPortrait from '../components/hero/HeroPortrait'
import HeroContent from '../components/hero/HeroContent'
import ScrollIndicator from '../components/hero/ScrollIndicator'

export default function Landing() {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-ink text-paper"
    >
      <HeroBackground />
      <HeroPortrait />
      <HeroContent />
      <ScrollIndicator />
    </section>
  )
}
