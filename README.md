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
npm run lint
npm run build
npm run test:motion
npm run test:navigation
npm run test:intro
```

Browser checks use Puppeteer's Chrome installation. If it is missing, run
`npx puppeteer browsers install chrome`. On Windows with restricted PowerShell
scripts, use `npm.cmd` instead of `npm`.

## Editing content

- Identity, expertise, social links, and section availability: `src/config/site.js`.
- Hero composition: `src/sections/Landing.jsx` and `src/components/hero/`.
- Theme tokens, typography, and responsive rules: `src/index.css`.
- Sharing metadata: `index.html`. Run `npm run og` to refresh the 1200 × 630
  `public/og.png`. The generator starts and closes its own server, waits for fonts
  and the portrait, and captures the period in its visible state. Set `OG_URL`
  only when you want to capture an already running site instead.

The intro can be skipped and is remembered for the current tab session. Reduced
motion preferences are respected. Mobile navigation traps focus, closes on Escape,
restores focus, and releases its scroll lock when switching to desktop.

Work, About, and Contact navigation entries remain explicitly unavailable until
their sections are built. View work opens the real GitHub profile; Get in touch
opens an email draft. No backend or admin dashboard is implemented yet.
