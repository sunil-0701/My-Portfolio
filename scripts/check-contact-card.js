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
const longName = 'Sunil, Amarthya '.repeat(30)
const unicodeName = String.fromCodePoint(0xe9, 0xf1, 0xfc, 0x4e2d).repeat(40)
for (const name of [longName, unicodeName, 'Sunil '.repeat(20) + String.fromCodePoint(0x1f680).repeat(30)]) {
  const folded = createContactCard({ ...SITE, name })
  assert.ok(folded.includes('\r\n '), 'Long fields should contain folded lines')
  for (const line of folded.split('\r\n')) {
    assert.ok(Buffer.byteLength(line, 'utf8') <= 75, 'Each physical line must fit 75 UTF-8 octets')
  }
  const unfolded = folded.replace(/\r\n[ \t]/g, '')
  assert.ok(unfolded.includes(`FN:${name.replace(/,/g, '\\,')}\r\n`), 'Unfolding must preserve the complete Unicode name')
  assert.equal(Buffer.from(folded).toString('utf8'), folded, 'Do not split Unicode characters')
}
console.log('Contact card checks passed: framing, public fields, escaping, UTF-8 line folding, and round-trip preservation.')
