/**
 * Shared date formatting utility.
 * All dates in the app go through this for consistency.
 */
export function formatDate(
  date: string | Date,
  options?: { format?: 'short' | 'long' | 'relative' | 'time' }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const { format = 'short' } = options ?? {}

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    case 'long':
      return d.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    case 'time':
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    case 'relative': {
      const now = new Date()
      const diff = now.getTime() - d.getTime()
      const mins = Math.floor(diff / 60000)
      if (mins < 1) return 'Just now'
      if (mins < 60) return `${mins}m ago`
      const hours = Math.floor(mins / 60)
      if (hours < 24) return `${hours}h ago`
      const days = Math.floor(hours / 24)
      if (days < 7) return `${days}d ago`
      return formatDate(d, { format: 'short' })
    }
    default:
      return d.toLocaleDateString('en-IN')
  }
}

export function formatDateInput(date: Date): string {
  return date.toISOString().split('T')[0]
}
