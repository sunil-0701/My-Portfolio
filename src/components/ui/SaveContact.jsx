import { createContactCard } from '../../utils/contactCard'

export default function SaveContact() {
  return (
    <a
      href={`data:text/vcard;charset=utf-8,${encodeURIComponent(createContactCard())}`}
      download="sunil-amarthya.vcf"
      className="save-contact inline-flex min-h-11 items-center px-2 text-[0.65rem] text-muted underline underline-offset-4 transition-colors duration-150 hover:text-paper"
    >
      Save contact <span aria-hidden="true" className="ml-1">↓</span>
      <span aria-hidden="true" className="ml-2 border border-paper/20 px-1.5 py-0.5 font-mono text-[0.6rem] no-underline">.vcf</span>
      <span className="sr-only"> as a vCard file</span>
    </a>
  )
}
