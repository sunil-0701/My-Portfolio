import ContentSection from '../components/layout/ContentSection'
import CopyEmail from '../components/ui/CopyEmail'
import SaveContact from '../components/ui/SaveContact'
import ExternalLink from '../components/ui/ExternalLink'
import { SITE } from '../config/site'

export default function Contact() {
  return (
    <ContentSection id="contact" number="04" title="Start a conversation." intro="Email is the direct way to get in touch. You can also copy the address, save the contact card, or find me on the profiles below.">
      <a className="contact-email inline-block max-w-full break-all py-3 font-mono text-base text-paper underline decoration-paper/40 underline-offset-4 transition-colors duration-150 hover:text-signal hover:decoration-signal sm:text-lg" href={`mailto:${SITE.email}`}>{SITE.email}</a>
      <div className="flex flex-wrap items-start gap-x-6">
        <CopyEmail />
        <div className="mt-4"><SaveContact /></div>
      </div>
      <ul aria-label="Professional profiles" className="mt-8 flex flex-wrap gap-6 text-sm text-muted">
        <li><ExternalLink href={SITE.github}>GitHub</ExternalLink></li>
        <li><ExternalLink href={SITE.linkedin}>LinkedIn</ExternalLink></li>
      </ul>
      <a className="back-to-top mt-10 inline-flex min-h-11 items-center gap-1 text-xs text-muted underline underline-offset-4 transition-colors duration-150 hover:text-paper" href="#home">Back to top <span aria-hidden="true">↑</span></a>
    </ContentSection>
  )
}
