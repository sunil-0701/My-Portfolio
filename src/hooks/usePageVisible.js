import { useSyncExternalStore } from 'react'

const subscribe = (notify) => {
  document.addEventListener('visibilitychange', notify)
  return () => document.removeEventListener('visibilitychange', notify)
}
const getSnapshot = () => document.visibilityState !== 'hidden'
const getServerSnapshot = () => true

export default function usePageVisible() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
