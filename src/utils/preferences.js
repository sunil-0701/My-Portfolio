const BLINK_KEY = 'portfolio:blink-paused'

export function readBlinkPaused() {
  try {
    return localStorage.getItem(BLINK_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveBlinkPaused(paused) {
  try {
    localStorage.setItem(BLINK_KEY, String(paused))
  } catch {
    // The control still works when browser storage is unavailable.
  }
}

export function watchBlinkPaused(onChange) {
  const onStorage = (event) => {
    if (event.key === BLINK_KEY || event.key === null) onChange(readBlinkPaused())
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
