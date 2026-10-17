const INTRO_KEY = 'portfolio:intro-seen'

export function shouldShowIntro() {
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
  }
}
