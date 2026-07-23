import { useState } from 'react'
import { getBusynessLevel } from '../utils/busyness'

export default function LocationCard({
  location,
  isCheckedIn,
  isCheckedInElsewhere,
  onCheckIn,
  onCheckOut,
  loading,
}) {
  const { label, className } = getBusynessLevel(location.percent)
  const atCapacity = location.count >= location.capacity

  return (
    <article className={`location-card ${isCheckedIn ? 'checked-in' : ''}`}>
      <div className="card-header">
        <h2>{location.name}</h2>
        <span className={`busyness-badge ${className}`}>{label}</span>
      </div>

      <div className="occupancy-display">
        <span className="count">{location.count}</span>
        <span className="capacity">/ {location.capacity}</span>
      </div>

      <div className="progress-bar">
        <div
          className={`progress-fill ${className}`}
          style={{ width: `${Math.min(location.percent, 100)}%` }}
        />
      </div>

      <p className="percent-label">{location.percent}% full</p>

      <div className="card-actions">
        {isCheckedIn ? (
          <button
            type="button"
            className="btn btn-checkout"
            onClick={onCheckOut}
            disabled={loading}
          >
            Check Out
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-checkin"
            onClick={onCheckIn}
            disabled={loading || atCapacity || isCheckedInElsewhere}
          >
            {atCapacity ? 'At Capacity' : 'Check In'}
          </button>
        )}
      </div>

      <p className="library-note">
        For detailed library floor data, visit{' '}
        <a href="https://waitz.io" target="_blank" rel="noopener noreferrer">
          waitz.io
        </a>
      </p>
    </article>
  )
}
