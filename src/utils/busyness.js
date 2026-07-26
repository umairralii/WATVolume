export function getBusynessLevel(percent, count = 0) {
  if (count === 0 || percent === 0 || percent === null) {
    return { label: 'Empty', className: 'empty' }
  }
  if (percent < 30) return { label: 'Quiet', className: 'quiet' }
  if (percent < 65) return { label: 'Moderate', className: 'moderate' }
  return { label: 'Busy', className: 'busy' }
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

export const LEGEND = [
  { label: 'Empty', className: 'empty' },
  { label: 'Quiet', className: 'quiet' },
  { label: 'Moderate', className: 'moderate' },
  { label: 'Busy', className: 'busy' },
]
