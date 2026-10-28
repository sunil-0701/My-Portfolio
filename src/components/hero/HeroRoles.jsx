import { SITE } from '../../config/site'

export default function HeroRoles({ ready = true, active = true }) {
  const roles = [...SITE.roles, SITE.roles[0]]

  return (
    <span
      className="hero-roles relative inline-block max-w-full align-middle"
      data-ready={ready}
      data-active={active}
    >
      <span className="sr-only">{SITE.roles.join(', ')}</span>
      <span aria-hidden="true" className="hero-role-bracket hero-role-left absolute top-0 left-0 leading-[1.6] text-faint">[</span>
      <span aria-hidden="true" className="hero-role-dashes pointer-events-none absolute inset-x-5 top-1/2 border-t border-dashed border-paper/30 opacity-0" />
      <span aria-hidden="true" className="hero-role-window mx-5 block h-[1.6em] overflow-hidden">
        <span className="hero-role-track flex flex-col">
          {roles.map((role, index) => (
            <span key={`${role}-${index}`} className="block h-[1.6em] shrink-0 whitespace-nowrap text-center leading-[1.6]">
              {role}
            </span>
          ))}
        </span>
      </span>
      <span aria-hidden="true" className="hero-role-bracket hero-role-right absolute top-0 right-0 leading-[1.6] text-faint">]</span>
    </span>
  )
}
