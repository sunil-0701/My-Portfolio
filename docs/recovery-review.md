# Recovery and navigation review

This is an opt-in manual checklist, not a record of passing checks. Local tests,
builds, and GitHub Actions must not be started without authorization.

## Page error fallback

- In an authorized development session, use a temporary throwing child inside
  `ErrorBoundary` to exercise the recovery page. Do not commit the injected error.
- Confirm keyboard focus moves to “Something interrupted the page.” The heading
  should be programmatically focusable without adding an extra Tab stop.
- The recovery main landmark should be named by that heading.
- Tab should reach Retry page, Email, and View GitHub in that order. Links should
  retain their normal browser behavior.
- After removing the temporary fault, Retry page should render the portfolio
  again. A persistent fault should return to the focused recovery heading.

No execution-based validation was performed when this guide was introduced.
