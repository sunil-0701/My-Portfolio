// Single source of truth for identity + contact details.
// Edit here; every component reads from this file.
export const SITE = {
  name: 'Sunil Amarthya',
  firstName: 'SUNIL',
  lastName: 'AMARTHYA',
  // Cycled by the hero role reel, in order.
  roles: ['SOFTWARE ENGINEER', 'STUDENT', 'INTERN'],
  greeting: "Hello world, I'm",
  summary:
    'I build the APIs, data models, and infrastructure that sit behind the product — the part users never see and always feel.',

  // TODO: confirm these two before shipping.
  location: 'Bengaluru, IN',
  timezone: 'UTC+5:30',

  available: true,
  availableLabel: 'Open to backend roles',

  email: 'sunil.amarthya.d@gmail.com',
  github: 'https://github.com/sunilamarthya',
  linkedin: 'https://linkedin.com/in/sunilamarthya',
}

// Sections in build order. `ready: false` renders the nav item as
// not-yet-available instead of a link that silently dead-ends.
export const SECTIONS = [
  { id: 'home', label: 'HOME', ready: true },
  { id: 'work', label: 'WORK', ready: false },
  { id: 'about', label: 'ABOUT', ready: false },
  { id: 'experience', label: 'EXPERIENCE', ready: false },
  { id: 'contact', label: 'CONTACT', ready: false },
]
