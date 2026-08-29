const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/sunilamarthya',
    path: (
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/sunilamarthya',
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
    href: 'mailto:sunil.amarthya.d@gmail.com',
    path: (
      <>
        <path d="M4 4h16v16H4z" />
        <path d="M4 6l8 7 8-7" />
      </>
    ),
  },
]

export default function SocialLinks({ orientation = 'vertical', className = '' }) {
  const flexDir = orientation === 'vertical' ? 'flex-col' : 'flex-row'

  return (
    <div className={`flex ${flexDir} gap-3 ${className}`}>
      {LINKS.map(({ label, href, path }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white/20 bg-ink/40 text-[#e6e6e4] backdrop-blur-md transition-colors hover:border-white/40"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {path}
          </svg>
        </a>
      ))}
    </div>
  )
}
