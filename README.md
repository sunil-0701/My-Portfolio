# Sunil Amarthya — Portfolio

A responsive React portfolio with a monochrome terminal-inspired landing page,
static grain texture, technical portrait framing, and keyboard-accessible navigation.

## Development

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

## Quality checks

```sh
npm run check
```

This runs strict linting (including warnings), a production build, and all six
test suites. Use `npm test` for tests only, or run an individual suite with
`npm run test:motion`, `test:navigation`, `test:intro`, `test:layout`,
`test:buttons`, or `test:fallback`.

The tests cover the blinking name period, reduced motion, intro persistence,
mobile focus handling, nine viewport sizes, unavailable web fonts, button
semantics, and the no-JavaScript fallback. GitHub Actions runs the same checks on
pull requests and pushes to `main` and `landingPage`.

Browser checks use Puppeteer's Chrome installation. If it is missing, run
`npx puppeteer browsers install chrome`. On Windows with restricted PowerShell
scripts, use `npm.cmd` instead of `npm`.

## Editing content

- Identity, expertise, social links, and section availability: `src/config/site.js`.
  Keep the static no-JavaScript content in `index.html` in sync when changing
  identity or contact information; the fallback test checks this consistency.
- Hero composition: `src/sections/Landing.jsx` and `src/components/hero/`.
- Theme tokens, typography, and responsive rules: `src/index.css`.
- Sharing metadata: `index.html`. Run `npm run og` to refresh the 1200 × 630
  `public/og.png`. The generator starts and closes its own server, waits for fonts
  and the portrait, and captures the period in its visible state. Set `OG_URL`
  only when you want to capture an already running site instead.

The intro can be skipped and is remembered for the current tab session. Reduced
motion preferences are respected. Mobile navigation traps focus, closes on Escape,
restores focus, and releases its scroll lock when switching to desktop.

The decorative period after the name blinks every 1.2 seconds without shifting
the heading. It stays solid when the visitor requests reduced motion. With
JavaScript disabled, visitors still see the summary and working contact links.

Work, About, and Contact navigation entries remain explicitly unavailable until
their sections are built. View work opens the real GitHub profile; Get in touch
opens an email draft. No backend or admin dashboard is implemented yet.
