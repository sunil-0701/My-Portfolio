import usePageVisible from '../../hooks/usePageVisible'

export default function HeroLinework({ ready = true }) {
  const pageVisible = usePageVisible()

  return (
    <div
      aria-hidden="true"
      data-ready={ready}
      data-active={ready && pageVisible}
      className="hero-linework pointer-events-none absolute top-[20%] right-[4.5%] bottom-[18%] hidden w-[10%] lg:block"
    >
      <span className="hero-linework-vertical absolute inset-y-0 right-0 w-px origin-top bg-paper/20" />
      <span className="hero-linework-tick absolute top-0 left-0 h-12 w-px origin-top bg-paper/30" />
      <p className="absolute top-[24%] left-4 font-mono text-[0.65rem] leading-6 tracking-[0.15em] text-faint">IDEAS<br />SYSTEMS<br />CODE<br />IMPACT</p>
      <div className="hero-linework-scan absolute top-[60%] right-0 h-px w-24">
        <span className="hero-linework-crossbar absolute inset-0 origin-right bg-paper/35" />
        <span className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 border border-paper" />
      </div>
    </div>
  )
}
