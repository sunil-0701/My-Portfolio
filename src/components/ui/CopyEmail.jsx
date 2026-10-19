import { useState } from 'react'
import { SITE } from '../../config/site'

export default function CopyEmail() {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const copy = async () => {
    setBusy(true)
    try {
      await navigator.clipboard.writeText(SITE.email)
      setStatus('Email copied')
    } catch {
      setStatus(`Copy unavailable. Email: ${SITE.email}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="copy-email mt-4 text-[0.65rem] text-muted">
      <button type="button" onClick={copy} disabled={busy} className="min-h-11 px-2 underline underline-offset-4 hover:text-paper disabled:opacity-50">
        {busy ? 'Copying…' : 'Copy email address'}
      </button>
      <p aria-live="polite" aria-atomic="true" className="break-words" data-copy-feedback>{status}</p>
    </div>
  )
}
