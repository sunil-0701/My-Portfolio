import { useEffect, useId, useRef, useState } from 'react'
import { SITE } from '../../config/site'

export default function CopyEmail() {
  const feedbackId = useId()
  const [status, setStatus] = useState('')
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const mounted = useRef(true)
  const timeoutRef = useRef()
  const manualEmailRef = useRef(null)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const copy = async () => {
    if (pending.current) return
    pending.current = true
    setBusy(true)
    setStatus('')
    setFailed(false)
    try {
      await Promise.race([
        navigator.clipboard.writeText(SITE.email),
        new Promise((_, reject) => {
          timeoutRef.current = window.setTimeout(() => reject(new Error('Clipboard permission timed out')), 8000)
        }),
      ])
      if (mounted.current) setStatus('Email copied')
    } catch {
      if (mounted.current) {
        setFailed(true)
        setStatus(`Copy unavailable. Email: ${SITE.email}`)
      }
    } finally {
      window.clearTimeout(timeoutRef.current)
      pending.current = false
      if (mounted.current) setBusy(false)
    }
  }

  return (
    <div className="copy-email mt-4 text-[0.65rem] text-muted">
      <button type="button" onClick={copy} aria-busy={busy} aria-disabled={busy} aria-describedby={feedbackId} className="min-h-11 px-2 underline underline-offset-4 hover:text-paper aria-disabled:opacity-50">
        {busy ? 'Copying…' : 'Copy email address'}
      </button>
      <p id={feedbackId} aria-live="polite" aria-atomic="true" className="break-words" data-copy-feedback>
        {status}
      </p>
      {failed && <div className="mt-3 w-full max-w-sm">
        <label htmlFor={`${feedbackId}-manual`} className="block leading-6">Copy email manually</label>
        <input
          ref={manualEmailRef}
          id={`${feedbackId}-manual`}
          type="text"
          readOnly
          value={SITE.email}
          spellCheck={false}
          aria-describedby={`${feedbackId}-hint`}
          onFocus={(event) => event.currentTarget.select()}
          className="min-h-11 w-full min-w-0 border border-paper/30 bg-ink px-3 text-paper"
        />
        <p id={`${feedbackId}-hint`} className="mt-2 leading-6">Select the address and use your device’s copy command.</p>
        <div className="flex flex-wrap gap-x-4">
          <button type="button" data-select-email onClick={() => {
            manualEmailRef.current?.focus({ preventScroll: true })
            manualEmailRef.current?.select()
          }} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-paper">Select email</button>
          <a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-paper">Open email application</a>
        </div>
      </div>}
    </div>
  )
}
