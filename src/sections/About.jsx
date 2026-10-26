import ContentSection from '../components/layout/ContentSection'
import { SITE } from '../config/site'

export default function About() {
  return (
    <ContentSection id="about" number="03" title="Behind the product." intro={SITE.about}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="mb-5 font-mono text-xs uppercase tracking-widest text-muted">Engineering focus</h3>
          <ul className="flex flex-wrap gap-3">
            {SITE.expertise.map((item) => <li key={item} className="border border-paper/25 px-4 py-3 text-xs tracking-wide">{item}</li>)}
          </ul>
        </div>
        <dl className="grid gap-6 text-sm">
          <div><dt className="mb-2 text-xs uppercase tracking-widest text-faint">Based in</dt><dd>{SITE.location}</dd></div>
          <div><dt className="mb-2 text-xs uppercase tracking-widest text-faint">Time zone</dt><dd>{SITE.timezone}</dd></div>
        </dl>
      </div>
    </ContentSection>
  )
}
