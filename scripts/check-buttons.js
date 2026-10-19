import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true } })
try {
  const { default: Button } = await server.ssrLoadModule('/src/components/ui/Button.jsx')
  const render = (props) => renderToStaticMarkup(createElement(Button, props, 'Action'))
  assert.match(render({}), /type="button"/, 'Do not submit forms by default')
  assert.match(render({ type: 'submit' }), /type="submit"/, 'Explicit form submission still works')
  const external = render({ href: 'https://example.com', target: '_blank', rel: 'nofollow' })
  assert.match(external, /rel="nofollow noopener noreferrer"/)
  assert.match(external, /opens in a new tab/)
  assert.doesNotMatch(external, /type="button"/)
  const disabledLink = render({ href: 'https://example.com', disabled: true })
  assert.match(disabledLink, /role="link"/)
  assert.match(disabledLink, /aria-disabled="true"/)
  assert.match(disabledLink, /tabindex="-1"/)
  assert.doesNotMatch(disabledLink, /href=/, 'Disabled links cannot navigate')
  assert.match(render({ disabled: true }), /disabled=""/)
  assert.doesNotMatch(render({ variant: 'missing' }), /undefined/)
  assert.match(render({ variant: 'quiet' }), /group-focus-visible:scale-x-100/)
  console.log('Button checks passed: form defaults, external link security, disabled states, variant fallback, and focus styling.')
} finally {
  await server.close()
}
