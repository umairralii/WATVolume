import { getBusynessLevel } from '../utils/busyness'

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M6 1a3 3 0 0 0-3 3c0 2.25 3 5.5 3 5.5s3-3.25 3-5.5a3 3 0 0 0-3-3Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="6" cy="4" r="1" fill="currentColor" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="4" r="2" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M1 11c0-2 1.6-3.5 3.5-3.5S8 9 8 11"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="9" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M7.5 11c0-1.5 1-2.5 2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function LocationCard({
  location,
  isCheckedIn,
  isCheckedInElsewhere,
  onCheckIn,
  onCheckOut,
  loading,
}) {
  const { label, className } = getBusynessLevel(location.percent, location.count)
  const atCapacity = location.count >= location.capacity
  const isLibrary = location.category === 'library'

  return (
    <article className={`location-card ${isCheckedIn ? 'checked-in' : ''}`}>
      <div className="card-header-row">
        <h2 className="card-title">{location.name}</h2>
        <div className="card-status-group">
          <span className={`status-badge ${className}`}>
            <span className="status-dot" />
            {label}
          </span>
          <span className="here-count">
            <UsersIcon />
            {location.count} here
          </span>
        </div>
      </div>

      <p className="card-building">
        <PinIcon />
        {location.building}
      </p>

      <p className="card-description">{location.description}</p>

      <div className="card-progress">
        <div className="progress-track">
          <div
            className={`progress-fill ${className}`}
            style={{ width: `${Math.min(location.percent, 100)}%` }}
          />
        </div>
        <div className="progress-labels">
          <span>{location.count} checked in</span>
          <span>cap ~{location.capacity}</span>
        </div>
      </div>

      <div className="card-actions">
        {isCheckedIn ? (
          <button
            type="button"
            className="btn btn-checked-in"
            onClick={onCheckOut}
            disabled={loading}
          >
            ✓ Checked in here — tap to check out
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-checkin"
            onClick={onCheckIn}
            disabled={loading || atCapacity || isCheckedInElsewhere}
          >
            {atCapacity
              ? 'At capacity'
              : isCheckedInElsewhere
                ? 'Already checked in elsewhere'
                : '→ Check in here'}
          </button>
        )}
      </div>

      {isLibrary && (
        <p className="library-note">
          Floor-by-floor occupancy on{' '}
          <a
            href={location.waitzUrl || 'https://waitz.io'}
            target="_blank"
            rel="noopener noreferrer"
          >
            waitz.io
          </a>
        </p>
      )}
    </article>
  )
}
