import ContentSection from '../components/layout/ContentSection'
import { SITE } from '../config/site'

export default function About() {
  return (
    <ContentSection id="about" number="03" title="Behind the product." intro={SITE.about}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 id="engineering-focus-heading" className="mb-5 font-mono text-xs uppercase tracking-widest text-muted">Engineering focus</h3>
          <ul aria-labelledby="engineering-focus-heading" className="flex flex-wrap gap-3">
            {SITE.expertise.map((item) => <li key={item} className="border border-paper/25 px-4 py-3 text-xs tracking-wide transition-colors duration-150 hover:border-paper/50 hover:text-paper">{item}</li>)}
          </ul>
        </div>
        <dl className="grid gap-6 text-sm sm:grid-cols-2">
          <div className="border-l border-paper/20 pl-4"><dt className="mb-2 text-xs uppercase tracking-widest text-faint">Based in</dt><dd>{SITE.location}</dd></div>
          <div className="border-l border-paper/20 pl-4"><dt className="mb-2 text-xs uppercase tracking-widest text-faint">Time zone</dt><dd className="tabular">{SITE.timezone}</dd></div>
        </dl>
      </div>
    </ContentSection>
  )
}
