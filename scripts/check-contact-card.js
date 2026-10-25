import assert from 'node:assert/strict'
import { SITE } from '../src/config/site.js'
import { createContactCard } from '../src/utils/contactCard.js'

const card = createContactCard()
assert.ok(card.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n'))
assert.ok(card.includes(`FN:${SITE.name}\r\n`))
assert.ok(card.includes(`EMAIL;TYPE=INTERNET:${SITE.email}\r\n`))
assert.ok(card.endsWith('END:VCARD\r\n'))
const escaped = createContactCard({ ...SITE, name: 'Sunil, Amarthya', location: 'Bengaluru; IN\nIndia' })
assert.ok(escaped.includes('FN:Sunil\\, Amarthya\r\n'))
assert.ok(escaped.includes('NOTE:Bengaluru\\; IN\\nIndia\r\n'))
console.log('Contact card checks passed: vCard framing, public fields, CRLF endings, and text escaping.')
