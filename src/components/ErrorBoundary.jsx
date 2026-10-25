import { Component } from 'react'
import Button from './ui/Button'
import { SITE } from '../config/site'

export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-6 py-12 text-paper">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Portfolio unavailable</p>
        <h1 className="font-display text-3xl">Something interrupted the page.</h1>
        <p className="leading-7 text-muted">You can retry the portfolio or use the contact links below.</p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => this.setState({ failed: false })} variant="outline">Retry page</Button>
          <Button href={`mailto:${SITE.email}`} variant="outline">Email {SITE.firstName}</Button>
          <Button href={SITE.github} target="_blank" variant="quiet">View GitHub</Button>
        </div>
      </main>
    )
  }
}
