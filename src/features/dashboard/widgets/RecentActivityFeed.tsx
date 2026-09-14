import { DashboardCard } from '../../../components/ui/DashboardCard'
import {
  UserPlus,
  CalendarCheck,
  IndianRupee,
  FileText,
  Megaphone,
  GraduationCap,
  ClipboardCheck,
  Activity,
} from 'lucide-react'
import { formatDate } from '../../../lib/formatDate'

interface ActivityItem {
  id: string
  type: 'student_added' | 'teacher_added' | 'attendance' | 'fee_payment' | 'exam_update' | 'notice' | 'homework' | 'general'
  title: string
  timestamp: string
}

const typeConfig: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
  student_added: { icon: UserPlus, bg: 'bg-info-100', text: 'text-info-600' },
  teacher_added: { icon: GraduationCap, bg: 'bg-brand-100', text: 'text-brand-600' },
  attendance: { icon: CalendarCheck, bg: 'bg-success-100', text: 'text-success-600' },
  fee_payment: { icon: IndianRupee, bg: 'bg-warning-100', text: 'text-warning-600' },
  exam_update: { icon: ClipboardCheck, bg: 'bg-danger-100', text: 'text-danger-600' },
  notice: { icon: Megaphone, bg: 'bg-info-100', text: 'text-info-600' },
  homework: { icon: FileText, bg: 'bg-success-100', text: 'text-success-600' },
  general: { icon: Activity, bg: 'bg-brand-100', text: 'text-brand-600' },
}

const defaultActivities: ActivityItem[] = [
  { id: '1', type: 'student_added', title: 'New student "Riya Mehta" enrolled in Grade 9-A', timestamp: '2026-08-29T09:15:00' },
  { id: '2', type: 'fee_payment', title: 'Fee payment of ₹12,000 received from Aarav Sharma', timestamp: '2026-08-29T08:45:00' },
  { id: '3', type: 'attendance', title: 'Attendance marked for Grade 10-A (42 students)', timestamp: '2026-08-29T08:30:00' },
  { id: '4', type: 'notice', title: 'Notice "Parent-Teacher Meeting" published by Principal', timestamp: '2026-08-28T16:20:00' },
  { id: '5', type: 'exam_update', title: 'Mid-Term schedule published for all classes', timestamp: '2026-08-28T14:00:00' },
  { id: '6', type: 'homework', title: 'New assignment "Quadratic Equations" added for 10-A', timestamp: '2026-08-28T11:30:00' },
  { id: '7', type: 'teacher_added', title: 'New teacher "Ms. Priya Nair" added to staff', timestamp: '2026-08-27T10:00:00' },
]

interface RecentActivityFeedProps {
  activities?: ActivityItem[]
  className?: string
}

export function RecentActivityFeed({
  activities = defaultActivities,
  className = '',
}: RecentActivityFeedProps) {
  return (
    <DashboardCard title="Recent Activity" icon={Activity} className={className} noPadding>
      {activities.length === 0 ? (
        <p className="text-sm text-ink-400 text-center py-8 px-5">No recent activity</p>
      ) : (
        <div className="divide-y divide-border/60 max-h-[380px] overflow-y-auto">
          {activities.slice(0, 8).map((activity) => {
            const config = typeConfig[activity.type] || typeConfig.general
            const Icon = config.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 px-5 py-3 hover:bg-canvas/50 transition-colors"
              >
                <div className={`${config.bg} ${config.text} p-1.5 rounded-[var(--radius-btn)] shrink-0 mt-0.5`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink-900 leading-snug">{activity.title}</p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    {formatDate(activity.timestamp, { format: 'relative' })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardCard>
  )
}
