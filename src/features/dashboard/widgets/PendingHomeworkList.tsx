import { DashboardCard } from '../../../components/ui/DashboardCard'
import { StatusPill } from '../../../components/ui/StatusPill'
import { BookOpen, Calendar } from 'lucide-react'
import { formatDate } from '../../../lib/formatDate'

interface HomeworkItem {
  id: string
  subject: string
  title: string
  due_date: string
  status: 'active' | 'overdue' | 'submitted'
}

const statusMap = {
  active: { status: 'warning' as const, label: 'Pending' },
  overdue: { status: 'danger' as const, label: 'Overdue' },
  submitted: { status: 'success' as const, label: 'Submitted' },
}

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-info-100 text-info-600',
  English: 'bg-success-100 text-success-600',
  Science: 'bg-warning-100 text-warning-600',
  History: 'bg-danger-100 text-danger-600',
  'Computer Science': 'bg-brand-100 text-brand-600',
  'Social Studies': 'bg-info-100 text-info-600',
}

const defaultHomework: HomeworkItem[] = [
  { id: '1', subject: 'Mathematics', title: 'Quadratic Equations Practice — Ex 5.1 to 5.5', due_date: '2026-09-01', status: 'active' },
  { id: '2', subject: 'Science', title: 'Lab Report — Photosynthesis Experiment', due_date: '2026-08-30', status: 'active' },
  { id: '3', subject: 'English', title: 'Essay Writing — Climate Change Impact', due_date: '2026-08-28', status: 'overdue' },
  { id: '4', subject: 'History', title: 'Research on Mughal Empire Administration', due_date: '2026-09-05', status: 'active' },
]

interface PendingHomeworkListProps {
  homework?: HomeworkItem[]
  className?: string
  viewAllHref?: string
}

export function PendingHomeworkList({
  homework = defaultHomework,
  className = '',
  viewAllHref,
}: PendingHomeworkListProps) {
  const pendingItems = homework.filter((h) => h.status !== 'submitted').slice(0, 6)

  return (
    <DashboardCard
      title="Pending Assignments"
      icon={BookOpen}
      className={className}
      viewAllHref={viewAllHref}
      noPadding
    >
      {pendingItems.length === 0 ? (
        <p className="text-sm text-ink-400 text-center py-8 px-5">No pending assignments 🎉</p>
      ) : (
        <div className="divide-y divide-border/60">
          {pendingItems.map((hw) => (
            <div
              key={hw.id}
              className="flex items-center gap-4 px-5 py-3 hover:bg-canvas/50 transition-colors"
            >
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 ${
                  subjectColors[hw.subject] ?? 'bg-canvas text-ink-600'
                }`}
              >
                {hw.subject}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-900 truncate">{hw.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-ink-400">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {formatDate(hw.due_date)}</span>
                </div>
              </div>
              <StatusPill {...statusMap[hw.status]} />
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  )
}
