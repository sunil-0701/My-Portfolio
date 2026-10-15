const INTRO_KEY = 'portfolio:intro-seen'

export function shouldShowIntro() {
  // Deep links should land on their destination without waiting for a curtain.
  if (window.location.hash && !['#home', '#main'].includes(window.location.hash)) return false
  try {
    return sessionStorage.getItem(INTRO_KEY) !== 'true'
  } catch {
    return true
  }
}

export function rememberIntro() {
  try {
    sessionStorage.setItem(INTRO_KEY, 'true')
  } catch {
    // Storage can be disabled; the intro must still hand control to the page.
  }
}
