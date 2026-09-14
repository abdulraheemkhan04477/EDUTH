import { DashboardCard } from '../../../components/ui/DashboardCard'
import { CalendarDays, PartyPopper, GraduationCap, Sun } from 'lucide-react'
import { formatDate } from '../../../lib/formatDate'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'academic' | 'holiday' | 'event' | 'exam'
}

const typeConfig = {
  academic: { icon: GraduationCap, bg: 'bg-info-100', text: 'text-info-600', label: 'Academic' },
  holiday: { icon: Sun, bg: 'bg-warning-100', text: 'text-warning-600', label: 'Holiday' },
  event: { icon: PartyPopper, bg: 'bg-success-100', text: 'text-success-600', label: 'Event' },
  exam: { icon: GraduationCap, bg: 'bg-danger-100', text: 'text-danger-600', label: 'Exam' },
}

const defaultEvents: CalendarEvent[] = [
  { id: '1', title: 'Parent-Teacher Meeting', date: '2026-08-30', type: 'academic' },
  { id: '2', title: 'Independence Day Holiday', date: '2026-08-15', type: 'holiday' },
  { id: '3', title: 'Annual Day Celebrations', date: '2026-09-10', type: 'event' },
  { id: '4', title: 'Mid-Term Examination Begins', date: '2026-09-15', type: 'exam' },
  { id: '5', title: 'Science Exhibition', date: '2026-09-20', type: 'event' },
  { id: '6', title: 'Dussehra Holiday', date: '2026-10-02', type: 'holiday' },
]

interface CalendarWidgetProps {
  events?: CalendarEvent[]
  className?: string
}

export function CalendarWidget({ events = defaultEvents, className = '' }: CalendarWidgetProps) {
  // Sort by date ascending (nearest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <DashboardCard title="College Calendar" icon={CalendarDays} className={className}>
      {sortedEvents.length === 0 ? (
        <p className="text-sm text-ink-400 text-center py-6">No calendar events</p>
      ) : (
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto">
          {sortedEvents.map((event) => {
            const config = typeConfig[event.type]
            const Icon = config.icon
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 p-2.5 rounded-[var(--radius-btn)] border border-border/60 hover:bg-canvas/50 transition-colors"
              >
                <div className={`${config.bg} ${config.text} p-2 rounded-[var(--radius-btn)] shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900 truncate">{event.title}</p>
                  <p className="text-xs text-ink-400">{formatDate(event.date)}</p>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.bg} ${config.text} shrink-0`}
                >
                  {config.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </DashboardCard>
  )
}
