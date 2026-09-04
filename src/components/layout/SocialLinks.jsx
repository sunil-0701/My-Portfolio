import { SITE } from '../../config/site'

const LINKS = [
  {
    label: 'GitHub',
    href: SITE.github,
    path: (
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    ),
  },
  {
    label: 'LinkedIn',
    href: SITE.linkedin,
    path: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: 'Email',
    href: `mailto:${SITE.email}`,
    external: false,
    path: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3.5 7l8.5 6.5L20.5 7" />
      </>
    ),
  },
]

export default function SocialLinks({ orientation = 'vertical', className = '' }) {
  const flexDir = orientation === 'vertical' ? 'flex-col' : 'flex-row'

  return (
    <ul className={`flex ${flexDir} gap-2.5 ${className}`}>
      {LINKS.map(({ label, href, path, external = true }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            aria-label={label}
            title={label}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/[0.12] bg-white/[0.02] text-muted backdrop-blur-md transition-[color,border-color,background-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.05] hover:text-paper active:translate-y-0 active:scale-95"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {path}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
