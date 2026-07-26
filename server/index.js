import express from 'express'
import cors from 'cors'
import { randomUUID } from 'crypto'
import { LOCATIONS } from './data.js'
import {
  getOccupancy,
  getCheckinBySession,
  checkIn,
  checkOut,
  purgeExpired,
} from './store.js'

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  }),
)
app.use(express.json())

// Purge expired check-ins every minute
setInterval(purgeExpired, 60_000)

app.get('/api/locations', (_req, res) => {
  const occupancy = getOccupancy()
  const locations = LOCATIONS.map((loc) => {
    const count = occupancy[loc.id] ?? 0
    const percent = loc.capacity
      ? Math.round((count / loc.capacity) * 100)
      : null
    return { ...loc, count, percent }
  })
  res.json(locations)
})

app.get('/api/session', (_req, res) => {
  res.json({ sessionId: randomUUID() })
})

app.get('/api/checkin/:sessionId', (req, res) => {
  const checkin = getCheckinBySession(req.params.sessionId)
  res.json(checkin)
})

app.post('/api/checkin', (req, res) => {
  const { sessionId, locationId } = req.body
  if (!sessionId || !locationId) {
    return res.status(400).json({ error: 'sessionId and locationId required' })
  }
  const location = LOCATIONS.find((l) => l.id === locationId)
  if (!location) {
    return res.status(404).json({ error: 'Location not found' })
  }
  const occupancy = getOccupancy()
  if (
    location.capacity &&
    (occupancy[locationId] ?? 0) >= location.capacity
  ) {
    return res.status(409).json({ error: 'Location is at capacity' })
  }
  const existing = getCheckinBySession(sessionId)
  if (existing && existing.locationId !== locationId) {
    return res.status(409).json({
      error: 'Already checked in elsewhere',
      locationId: existing.locationId,
    })
  }
  if (existing) {
    return res.json(existing)
  }
  const entry = checkIn(sessionId, locationId)
  res.json(entry)
})

app.post('/api/checkout', (req, res) => {
  const { sessionId } = req.body
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId required' })
  }
  const ok = checkOut(sessionId)
  if (!ok) {
    return res.status(404).json({ error: 'No active check-in found' })
  }
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`WATVolume API running on http://localhost:${PORT}`)
})
