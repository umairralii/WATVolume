import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { AUTO_CHECKOUT_MS } from './data.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'checkins.json')

function load() {
  if (!existsSync(DATA_FILE)) return { checkins: [] }
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return { checkins: [] }
  }
}

function save(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export function purgeExpired() {
  const data = load()
  const cutoff = Date.now() - AUTO_CHECKOUT_MS
  const before = data.checkins.length
  data.checkins = data.checkins.filter((c) => c.checkedInAt > cutoff)
  if (data.checkins.length !== before) save(data)
  return before - data.checkins.length
}

export function getActiveCheckins() {
  purgeExpired()
  return load().checkins
}

export function getCheckinBySession(sessionId) {
  purgeExpired()
  return load().checkins.find((c) => c.sessionId === sessionId) ?? null
}

export function checkIn(sessionId, locationId) {
  purgeExpired()
  const data = load()
  data.checkins = data.checkins.filter((c) => c.sessionId !== sessionId)
  const entry = { sessionId, locationId, checkedInAt: Date.now() }
  data.checkins.push(entry)
  save(data)
  return entry
}

export function checkOut(sessionId) {
  purgeExpired()
  const data = load()
  const idx = data.checkins.findIndex((c) => c.sessionId === sessionId)
  if (idx === -1) return false
  data.checkins.splice(idx, 1)
  save(data)
  return true
}

export function getOccupancy() {
  const checkins = getActiveCheckins()
  const counts = {}
  for (const c of checkins) {
    counts[c.locationId] = (counts[c.locationId] ?? 0) + 1
  }
  return counts
}
