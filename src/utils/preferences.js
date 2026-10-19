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
