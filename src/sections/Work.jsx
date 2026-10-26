import ContentSection from '../components/layout/ContentSection'
import ExternalLink from '../components/ui/ExternalLink'
import { PROJECTS } from '../config/site'

export default function Work() {
  return (
    <ContentSection id="work" number="02" title="Built, not just described." intro="A closer look at the code behind this portfolio.">
      <div className="grid gap-6 lg:grid-cols-2">
        {PROJECTS.map((project) => (
          <article key={project.id} aria-labelledby={`project-${project.id}`} className="project-card min-w-0 border border-paper/25 bg-ink-2 p-6 sm:p-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-faint">{project.type}</p>
            <h3 id={`project-${project.id}`} className="font-display text-2xl font-bold">{project.title}</h3>
            <p className="my-6 text-sm leading-8 text-muted">{project.description}</p>
            <ul aria-label={`${project.title} technologies`} className="mb-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => <li key={technology} className="border border-paper/15 px-3 py-2 text-xs text-muted">{technology}</li>)}
            </ul>
            <ExternalLink href={project.source} className="text-xs underline underline-offset-4">View source</ExternalLink>
          </article>
        ))}
      </div>
    </ContentSection>
  )
}
