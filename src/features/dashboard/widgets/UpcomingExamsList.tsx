import { DashboardCard } from '../../../components/ui/DashboardCard'
import { StatusPill } from '../../../components/ui/StatusPill'
import { ClipboardList } from 'lucide-react'
import { formatDate } from '../../../lib/formatDate'
import { useExamStore } from '../../../lib/examStore'

interface ExamItem {
  id: string
  title: string
  subject?: string
  class_name?: string
  date: string
  time?: string
  status: string
}

const statusMap: Record<string, { status: 'info' | 'warning' | 'success' | 'neutral'; label: string }> = {
  upcoming: { status: 'info', label: 'Upcoming' },
  Scheduled: { status: 'info', label: 'Scheduled' },
  Draft: { status: 'neutral', label: 'Draft' },
  ongoing: { status: 'warning', label: 'Ongoing' },
  Ongoing: { status: 'warning', label: 'Ongoing' },
  completed: { status: 'success', label: 'Completed' },
  Completed: { status: 'success', label: 'Completed' },
}

interface UpcomingExamsListProps {
  exams?: ExamItem[]
  showClass?: boolean
  className?: string
  viewAllHref?: string
}

export function UpcomingExamsList({
  exams: propExams,
  showClass = true,
  className = '',
  viewAllHref,
}: UpcomingExamsListProps) {
  const { exams: storeExams } = useExamStore()

  const displayExams: ExamItem[] = propExams || storeExams.map((e) => ({
    id: e.id,
    title: e.title,
    subject: e.subject,
    class_name: `${e.course} ${e.branch} (${e.section})`,
    date: e.date,
    time: e.start_time,
    status: e.status || 'Scheduled',
  }))

  const upcomingExams = displayExams.filter((e) => e.status !== 'completed' && e.status !== 'Completed').slice(0, 5)

  return (
    <DashboardCard
      title="Upcoming Exams"
      icon={ClipboardList}
      className={className}
      viewAllHref={viewAllHref}
      noPadding
    >
      {upcomingExams.length === 0 ? (
        <p className="text-sm text-ink-400 text-center py-8 px-5">No upcoming exams</p>
      ) : (
        <div className="divide-y divide-border/60">
          {upcomingExams.map((exam) => {
            const pillConfig = statusMap[exam.status] || { status: 'info' as const, label: exam.status }
            return (
              <div
                key={exam.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-canvas/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900 truncate">{exam.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-ink-400">
                    {exam.subject && <span>{exam.subject}</span>}
                    {exam.subject && showClass && exam.class_name && <span>·</span>}
                    {showClass && exam.class_name && <span>{exam.class_name}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-ink-900 tabular-nums">{formatDate(exam.date)}</p>
                  {exam.time && <p className="text-[11px] text-ink-400">{exam.time}</p>}
                </div>
                <StatusPill status={pillConfig.status} label={pillConfig.label} />
              </div>
            )
          })}
        </div>
      )}
    </DashboardCard>
  )
}
