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

This runs strict linting (including warnings), a production build, and all ten
test suites. Use `npm test` for tests only, or run an individual suite with
`npm run test:motion`, `test:navigation`, `test:intro`, `test:layout`,
`test:buttons`, `test:fallback`, `test:contact`, `test:media`, `test:production`,
or `test:contact-card`.

The tests cover the blinking name period, reduced motion, intro persistence,
mobile focus handling, nine viewport sizes, unavailable web fonts, button
semantics, clipboard failures, print/PDF output, high contrast, and the
no-JavaScript fallback. Production checks serve the actual build at both `/` and
`/My-Portfolio/` and verify assets and interactive navigation. GitHub Actions is
manual-only: pushes and pull requests do not start checks. Use the Actions tab's
Run workflow button only if you explicitly want a run.

Browser checks use Puppeteer's Chrome installation. If it is missing, run
`npx puppeteer browsers install chrome`. On Windows with restricted PowerShell
scripts, use `npm.cmd` instead of `npm`.

## Deployment

Run `npm run build` and publish `dist/`. Bundled assets, icons, grain texture,
and preview-image references use relative paths, so the same build can be served
at a domain root or in a subfolder such as `/My-Portfolio/`. Serve subfolder
entry points with a trailing slash. This is an anchor-based single page and does
not require client-side route rewrites.

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
the heading. No pause button is displayed. It stays solid when the visitor
requests reduced motion and stops while its tab is hidden. With
JavaScript disabled, visitors still see the summary and working contact links.

The email-copy control announces success or shows the address if clipboard access
is denied. Profile links announce when they open a new tab. Print output hides
interactive controls and includes readable contact destinations.

Reduced-transparency preferences remove the texture and header
fade. Clipboard requests time out after eight seconds and offer a direct email
link on failure. Mobile navigation also closes on browser Back/Forward navigation.

Additional recovery and contact features:

- A rendering-error fallback keeps email and GitHub links available.
- Failed portraits show initials and a retry button.
- The footer's Back to top link also restores heading focus.
- Save contact downloads a vCard containing only the public identity and links
  from `src/config/site.js`; it does not send data to a service.
- An offline notice reflects the browser's connectivity signal, not a guarantee
  that any particular external service is reachable.
- Navigation hints can be dismissed with Escape.

## Manual review (no automatic runs)

When review is explicitly requested, check keyboard navigation, email-copy
permission denial, contact-card import, portrait retry, and the no-JavaScript
fallback. Rendering recovery can be exercised in development with a deliberately
throwing child component. Do not trigger Actions or local suites unless wanted;
pushes alone leave the manual-only workflow idle.

Work, About, and Contact navigation entries remain explicitly unavailable until
their sections are built. View work opens the real GitHub profile; Get in touch
opens an email draft. No backend or admin dashboard is implemented yet.
