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
        {failed && <>{' '}<a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-paper">Open email application</a></>}
      </p>
    </div>
  )
}
