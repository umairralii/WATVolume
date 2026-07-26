const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function fetchLocations() {
  const res = await fetch(`${API_BASE}/locations`)
  if (!res.ok) throw new Error('Failed to fetch locations')
  return res.json()
}

export async function fetchCheckin(sessionId) {
  const res = await fetch(`${API_BASE}/checkin/${sessionId}`)
  if (!res.ok) throw new Error('Failed to fetch check-in')
  return res.json()
}

export async function checkIn(sessionId, locationId) {
  const res = await fetch(`${API_BASE}/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, locationId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Check-in failed')
  return data
}

export async function checkOut(sessionId) {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Check-out failed')
  return data
}

export async function createSession() {
  const res = await fetch(`${API_BASE}/session`)
  if (!res.ok) throw new Error('Failed to create session')
  const data = await res.json()
  return data.sessionId
}
