import { useState } from 'react'
import { useLocations } from './hooks/useLocations'
import { checkIn, checkOut } from './utils/api'
import { formatTimeRemaining, LEGEND } from './utils/busyness'
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

  const studySpots = locations.filter((l) => l.category !== 'library')
  const libraries = locations.filter((l) => l.category === 'library')

  const cardProps = (loc) => ({
    location: loc,
    isCheckedIn: activeCheckin?.locationId === loc.id,
    isCheckedInElsewhere:
      !!activeCheckin && activeCheckin.locationId !== loc.id,
    onCheckIn: () => handleCheckIn(loc.id),
    onCheckOut: handleCheckOut,
    loading: actionLoading,
  })

  return (
    <div className="app">
      <div className="app-glow" aria-hidden="true" />

      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="logo-mark">W</div>
            <div className="logo-text">
              <span className="logo-name">
                <span className="logo-wat">WAT</span>Volume
              </span>
              <span className="logo-sub">University of Waterloo</span>
            </div>
          </div>
          <div className="header-status">
            <span className="live-indicator">
              <span className="live-dot" />
              Live
            </span>
          </div>
        </div>
      </header>

      <div className="gold-rule" aria-hidden="true" />

      <main className="main">
        <section className="hero">
          <h1 className="hero-title">UW Study Spot Occupancy</h1>
          <p className="hero-subtitle">
            Crowdsourced by students in real time. Check in when you arrive,
            check out when you leave. Counts auto-expire after 4 hours.
          </p>
        </section>

        <div className="legend" aria-label="Busyness color legend">
          {LEGEND.map((item) => (
            <span key={item.className} className="legend-item">
              <span className={`legend-dot ${item.className}`} />
              {item.label}
            </span>
          ))}
        </div>

        {activeCheckin && activeLocation && (
          <div className="active-banner">
            <div className="active-banner-content">
              <span className="active-label">Checked in</span>
              <span className="active-location">{activeLocation.name}</span>
            </div>
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
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading locations…</p>
          </div>
        ) : (
          <>
            {libraries.length > 0 && (
              <section className="location-section">
                <h2 className="section-label">Libraries</h2>
                <div className="location-grid">
                  {libraries.map((loc) => (
                    <LocationCard key={loc.id} {...cardProps(loc)} />
                  ))}
                </div>
              </section>
            )}

            {studySpots.length > 0 && (
              <section className="location-section">
                <h2 className="section-label">Study spots</h2>
                <div className="location-grid">
                  {studySpots.map((loc) => (
                    <LocationCard key={loc.id} {...cardProps(loc)} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <footer className="footer">
          <p>Sessions auto-expire after 4 hours · Updates every 10 seconds</p>
        </footer>
      </main>
    </div>
  )
}

export default App
