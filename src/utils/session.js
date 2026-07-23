const SESSION_KEY = 'watvolume_session'

export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function setSessionId(id) {
  localStorage.setItem(SESSION_KEY, id)
}
