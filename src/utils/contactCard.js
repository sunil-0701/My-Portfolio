import { SITE } from '../config/site.js'

const escapeField = (value) => String(value)
  .replace(/\\/g, '\\\\')
  .replace(/\r\n|\r|\n/g, '\\n')
  .replace(/,/g, '\\,')
  .replace(/;/g, '\\;')

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
  ].join('\r\n')
}
