import { useSyncExternalStore } from 'react'

const subscribe = (notify) => {
  window.addEventListener('online', notify)
  window.addEventListener('offline', notify)
  return () => {
    window.removeEventListener('online', notify)
    window.removeEventListener('offline', notify)
  }
}
const getSnapshot = () => navigator.onLine
const getServerSnapshot = () => true

export default function ConnectionNotice() {
  const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (online) return null

  return (
    <aside role="status" className="connection-notice mb-6 border border-paper/20 bg-ink-2 px-4 py-3 text-xs leading-6 text-muted">
      Your browser reports that you are offline. You can still copy the email address;
      external profiles may need a connection.
    </aside>
  )
}
