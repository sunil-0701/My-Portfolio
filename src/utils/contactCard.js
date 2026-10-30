import { SITE } from '../config/site.js'

const escapeField = (value) => String(value)
  .replace(/\\/g, '\\\\')
  .replace(/\r\n|\r|\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;')

// vCard content lines are folded at 75 UTF-8 octets, never inside a character.
const foldLine = (line) => {
  const encoder = new TextEncoder()
  let folded = ''
  let octets = 0
  for (const character of line) {
    const size = encoder.encode(character).length
    if (octets + size > 75) {
      folded += '\r\n '
      octets = 1
    }
    folded += character
    octets += size
  }
  return folded
}

export function createContactCard(site = SITE) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeField(site.name)}`,
    `N:${escapeField(site.lastName)};${escapeField(site.firstName)};;;`,
    `EMAIL;TYPE=INTERNET:${escapeField(site.email)}`,
    `URL:${escapeField(site.github)}`,
    `NOTE:${escapeField(site.location)}`,
    'END:VCARD',
    '',
  ].map(foldLine).join('\r\n')
}
