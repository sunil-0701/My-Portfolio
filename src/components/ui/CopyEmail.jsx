import { useRef, useState } from 'react'
import { SITE } from '../../config/site'

export default function CopyEmail() {
  const [status, setStatus] = useState('')
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)

  const copy = async () => {
    if (pending.current) return
    pending.current = true
    setBusy(true)
    setStatus('')
    setFailed(false)
    let timeout
    try {
      await Promise.race([
        navigator.clipboard.writeText(SITE.email),
        new Promise((_, reject) => {
          timeout = window.setTimeout(() => reject(new Error('Clipboard permission timed out')), 8000)
        }),
      ])
      setStatus('Email copied')
    } catch {
      setFailed(true)
      setStatus(`Copy unavailable. Email: ${SITE.email}`)
    } finally {
      window.clearTimeout(timeout)
      pending.current = false
      setBusy(false)
    }
  }

  return (
    <div className="copy-email mt-4 text-[0.65rem] text-muted">
      <button type="button" onClick={copy} aria-busy={busy} aria-disabled={busy} aria-describedby="copy-email-feedback" className="min-h-11 px-2 underline underline-offset-4 hover:text-paper aria-disabled:opacity-50">
        {busy ? 'Copying…' : 'Copy email address'}
      </button>
      <p id="copy-email-feedback" aria-live="polite" aria-atomic="true" className="break-words" data-copy-feedback>
        {status}
        {failed && <>{' '}<a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-paper">Open email application</a></>}
      </p>
    </div>
  )
}
