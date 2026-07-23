import { useState, useEffect, useCallback } from 'react'
import { fetchLocations, fetchCheckin } from '../utils/api'
import { getSessionId } from '../utils/session'

const POLL_INTERVAL = 10_000

export function useLocations() {
  const [locations, setLocations] = useState([])
  const [activeCheckin, setActiveCheckin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sessionId = getSessionId()

  const refresh = useCallback(async () => {
    try {
      const [locs, checkin] = await Promise.all([
        fetchLocations(),
        fetchCheckin(sessionId),
      ])
      setLocations(locs)
      setActiveCheckin(checkin?.locationId ? checkin : null)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [refresh])

  return { locations, activeCheckin, loading, error, sessionId, refresh }
}
