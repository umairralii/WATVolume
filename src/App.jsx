import { useState, useMemo } from 'react'
import { useLocations } from './hooks/useLocations'
import { checkIn, checkOut } from './utils/api'
import { formatTimeRemaining, sortLocations } from './utils/busyness'
import LocationCard from './components/LocationCard'
import './App.css'

const SORT_OPTIONS = [
  { id: 'busiest', label: 'Busiest first' },
  { id: 'quietest', label: 'Quietest first' },
  { id: 'az', label: 'A–Z' },
]

function GradCapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 2 8l10 5 10-5-10-5Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M6 10.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 8.5v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function App() {
  const { locations, activeCheckin, loading, error, sessionId, refresh } =
    useLocations()
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [sortBy, setSortBy] = useState('busiest')

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

  const totalStudying = useMemo(
    () => locations.reduce((sum, l) => sum + l.count, 0),
    [locations],
  )

  const sortedLocations = useMemo(
    () => sortLocations(locations, sortBy),
    [locations, sortBy],
  )

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
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="logo-mark">
              <GradCapIcon />
            </div>
            <div className="logo-text">
              <span className="logo-name">WATVolume</span>
              <span className="logo-sub">UW campus study spots, live</span>
            </div>
          </div>
          <div className="live-pill">
            <span className="live-dot" />
            Live · {totalStudying} studying
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <h1 className="hero-title">How busy is campus right now?</h1>
          <p className="hero-subtitle">
            Crowdsourced by students — check in when you arrive, check out when
            you leave. Counts auto-expire after 4 hours.
          </p>
        </section>

        {activeCheckin && activeLocation && (
          <div className="active-banner">
            <span>
              Checked in at <strong>{activeLocation.name}</strong>
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

        <div className="sort-bar">
          <span className="sort-label">Sort:</span>
          <div className="sort-options">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`sort-btn ${sortBy === opt.id ? 'active' : ''}`}
                onClick={() => setSortBy(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading && locations.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading locations…</p>
          </div>
        ) : (
          <div className="location-grid">
            {sortedLocations.map((loc) => (
              <LocationCard key={loc.id} {...cardProps(loc)} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
