import { getBusynessLevel } from '../utils/busyness'

export default function LocationCard({
  location,
  isCheckedIn,
  isCheckedInElsewhere,
  onCheckIn,
  onCheckOut,
  loading,
}) {
  const isLibrary = location.category === 'library'
  const { label, className } = getBusynessLevel(location.percent, location.count)
  const atCapacity =
    location.capacity != null && location.count >= location.capacity

  return (
    <article className={`location-card ${isCheckedIn ? 'checked-in' : ''}`}>
      <div className="card-top">
        <div className="card-meta">
          {isLibrary && <span className="card-category">Library</span>}
          <span className={`status-pill ${className}`}>
            <span className="status-dot" />
            {label}
          </span>
        </div>
        <h2 className="card-title">{location.name}</h2>
      </div>

      <div className="card-stats">
        <div className="stat-primary">
          <span className="stat-count">{location.count}</span>
          {!isLibrary && (
            <span className="stat-capacity">of {location.capacity}</span>
          )}
          {isLibrary && (
            <span className="stat-capacity">checked in</span>
          )}
        </div>
        {!isLibrary && (
          <span className="stat-percent">{location.percent}%</span>
        )}
      </div>

      {!isLibrary && (
        <div className="progress-track">
          <div
            className={`progress-fill ${className}`}
            style={{ width: `${Math.min(location.percent, 100)}%` }}
          />
        </div>
      )}

      <div className="card-actions">
        {isCheckedIn ? (
          <button
            type="button"
            className="btn btn-checkout"
            onClick={onCheckOut}
            disabled={loading}
          >
            <span className="btn-label">Check Out</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-checkin"
            onClick={onCheckIn}
            disabled={loading || atCapacity || isCheckedInElsewhere}
          >
            <span className="btn-shine" aria-hidden="true" />
            <span className="btn-label">
              {atCapacity ? 'At Capacity' : 'Check In'}
            </span>
            {!atCapacity && !isCheckedInElsewhere && (
              <svg
                className="btn-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {isLibrary && (
        <p className="library-note">
          For detailed floor data visit{' '}
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
