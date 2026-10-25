import { createContactCard } from '../../utils/contactCard'

export default function SaveContact() {
  return (
    <a
      href={`data:text/vcard;charset=utf-8,${encodeURIComponent(createContactCard())}`}
      download="sunil-amarthya.vcf"
      className="save-contact inline-flex min-h-11 items-center px-2 text-[0.65rem] text-muted underline underline-offset-4 hover:text-paper"
    >
      Save contact <span className="sr-only">as a vCard file</span>
    </a>
  )
}
