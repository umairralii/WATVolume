export function getBusynessLevel(percent, count = 0) {
  if (count === 0 || percent === 0) return { label: 'Empty', className: 'empty' }
  if (percent < 25) return { label: 'Quiet', className: 'quiet' }
  if (percent < 60) return { label: 'Moderate', className: 'moderate' }
  if (percent < 85) return { label: 'Busy', className: 'busy' }
  return { label: 'Packed', className: 'packed' }
}

export function formatTimeRemaining(checkedInAt) {
  const AUTO_MS = 4 * 60 * 60 * 1000
  const remaining = checkedInAt + AUTO_MS - Date.now()
  if (remaining <= 0) return 'Expiring soon'
  const mins = Math.floor(remaining / 60_000)
  const hrs = Math.floor(mins / 60)
  const m = mins % 60
  if (hrs > 0) return `${hrs}h ${m}m until auto checkout`
  return `${m}m until auto checkout`
}

export function sortLocations(locations, sortBy) {
  const sorted = [...locations]
  switch (sortBy) {
    case 'busiest':
      return sorted.sort((a, b) => b.percent - a.percent || b.count - a.count)
    case 'quietest':
      return sorted.sort((a, b) => a.percent - b.percent || a.count - b.count)
    case 'az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted
  }
}
