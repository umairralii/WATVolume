import { useState } from 'react'
import { useLocations } from './hooks/useLocations'
import { checkIn, checkOut } from './utils/api'
import { formatTimeRemaining } from './utils/busyness'
import LocationCard from './components/LocationCard'
import './App.css'

function App() {
  const { locations, activeCheckin, loading, error, sessionId, refresh } =
    useLocations()
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)

  async function handleCheckIn(locationId) {
    setActionLoading(true)
    setActionError(null)
    try {
      await checkIn(sessionId, locationId)
      await refresh()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCheckOut() {
    setActionLoading(true)
    setActionError(null)
    try {
      await checkOut(sessionId)
      await refresh()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const activeLocation = activeCheckin
    ? locations.find((l) => l.id === activeCheckin.locationId)
    : null

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-wat">WAT</span>
            <span className="logo-volume">Volume</span>
          </div>
          <p className="tagline">
            Real-time campus study spot busyness for Waterloo students
          </p>
        </div>
      </header>

      <main className="main">
        {activeCheckin && activeLocation && (
          <div className="active-banner">
            <span>
              You&apos;re checked in at <strong>{activeLocation.name}</strong>
            </span>
            <span className="auto-checkout-note">
              {formatTimeRemaining(activeCheckin.checkedInAt)}
            </span>
          </div>
        )}

        {(error || actionError) && (
          <div className="error-banner" role="alert">
            {actionError || error}
          </div>
        )}

        {loading && locations.length === 0 ? (
          <p className="loading">Loading study spots…</p>
        ) : (
          <div className="location-grid">
            {locations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                isCheckedIn={activeCheckin?.locationId === loc.id}
                isCheckedInElsewhere={
                  !!activeCheckin && activeCheckin.locationId !== loc.id
                }
                onCheckIn={() => handleCheckIn(loc.id)}
                onCheckOut={handleCheckOut}
                loading={actionLoading}
              />
            ))}
          </div>
        )}

        <footer className="footer">
          <p>
            Check in when you arrive, check out when you leave. Sessions auto-expire
            after 4 hours.
          </p>
          <p className="footer-live">
            <span className="live-dot" /> Updates every 10 seconds
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
