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
import { useFeeStore } from '../../../lib/feeStore'
import { useNoticeStore } from '../../../lib/noticeStore'
import { useAssignmentStore } from '../../../lib/assignmentStore'
import { useAcademicStore } from '../../../lib/academicStore'
import { formatCurrency } from '../../../lib/formatCurrency'

export interface ActivityItem {
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

const now = Date.now()

const collegeActivitiesFallback: ActivityItem[] = [
  {
    id: 'act-fee-1',
    type: 'fee_payment',
    title: 'Fee payment of ₹45,000 received from Rahul Sharma (B.Tech CSE)',
    timestamp: new Date(now - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'act-notice-1',
    type: 'notice',
    title: 'Notice "Campus Placement Drive 2026 by TCS & Wipro" published by T&P Cell',
    timestamp: new Date(now - 1000 * 60 * 75).toISOString(),
  },
  {
    id: 'act-hw-1',
    type: 'homework',
    title: 'New assignment "Digital Signal Processing Lab-2" added for ECE 3rd Year',
    timestamp: new Date(now - 1000 * 60 * 140).toISOString(),
  },
  {
    id: 'act-stud-1',
    type: 'student_added',
    title: 'New student "Ananya Verma" enrolled in B.Tech CSE (2024 Batch)',
    timestamp: new Date(now - 1000 * 60 * 230).toISOString(),
  },
  {
    id: 'act-att-1',
    type: 'attendance',
    title: 'Attendance marked for B.Tech ECE 2nd Year - Section A (58 students)',
    timestamp: new Date(now - 1000 * 60 * 360).toISOString(),
  },
  {
    id: 'act-exam-1',
    type: 'exam_update',
    title: 'Mid-Semester Exam schedule published for B.Tech & Diploma branches',
    timestamp: new Date(now - 1000 * 60 * 500).toISOString(),
  },
  {
    id: 'act-fee-2',
    type: 'fee_payment',
    title: 'Semester Fee payment of ₹50,000 received from Priya Patel (B.Tech IT)',
    timestamp: new Date(now - 1000 * 60 * 680).toISOString(),
  },
  {
    id: 'act-teach-1',
    type: 'teacher_added',
    title: 'New faculty "Dr. Vikramaditya" appointed to Mechanical Engineering Dept',
    timestamp: new Date(now - 1000 * 60 * 850).toISOString(),
  },
  {
    id: 'act-notice-2',
    type: 'notice',
    title: 'Notice "Annual Technical Symposium - TechFest 2026" published by Dean Academics',
    timestamp: new Date(now - 1000 * 60 * 1100).toISOString(),
  },
  {
    id: 'act-hw-2',
    type: 'homework',
    title: 'Assignment "Database Indexing & B-Trees" published for B.Tech CSE',
    timestamp: new Date(now - 1000 * 60 * 1400).toISOString(),
  },
]

interface RecentActivityFeedProps {
  activities?: ActivityItem[]
  className?: string
}

export function RecentActivityFeed({
  activities: customActivities,
  className = '',
}: RecentActivityFeedProps) {
  const { payments } = useFeeStore()
  const { notices } = useNoticeStore()
  const { assignments } = useAssignmentStore()
  const { students, teachers } = useAcademicStore()

  // Collect live store items
  const storeActivities: ActivityItem[] = []

  // Payments
  if (payments && payments.length > 0) {
    payments.slice(0, 5).forEach((p) => {
      storeActivities.push({
        id: `fee_${p.id}`,
        type: 'fee_payment',
        title: `Fee payment of ${formatCurrency(p.amount)} received from ${p.student_name} (${p.branch || p.course || 'College Student'})`,
        timestamp: p.payment_date || p.created_at || new Date().toISOString(),
      })
    })
  }

  // Notices
  if (notices && notices.length > 0) {
    notices.slice(0, 5).forEach((n) => {
      storeActivities.push({
        id: `notice_${n.id}`,
        type: 'notice',
        title: `Notice "${n.title}" published by ${n.author || 'Administration'}`,
        timestamp: n.created_at || n.date || new Date().toISOString(),
      })
    })
  }

  // Assignments
  if (assignments && assignments.length > 0) {
    assignments.slice(0, 5).forEach((a) => {
      storeActivities.push({
        id: `assign_${a.id}`,
        type: 'homework',
        title: `New assignment "${a.title}" added for ${a.branch || a.course} (${a.subject})`,
        timestamp: a.created_at || a.assignment_date || new Date().toISOString(),
      })
    })
  }

  // Students
  if (students && students.length > 0) {
    students.slice(0, 3).forEach((s) => {
      storeActivities.push({
        id: `stud_${s.id}`,
        type: 'student_added',
        title: `New student "${s.name}" enrolled in ${s.course} ${s.branch}`,
        timestamp: new Date().toISOString(),
      })
    })
  }

  // Teachers
  if (teachers && teachers.length > 0) {
    teachers.slice(0, 2).forEach((t) => {
      storeActivities.push({
        id: `teach_${t.id}`,
        type: 'teacher_added',
        title: `New faculty "${t.name}" added to ${t.department || t.course} department`,
        timestamp: new Date().toISOString(),
      })
    })
  }

  // Merge custom or store items with college fallback activities
  const combined = customActivities
    ? customActivities
    : [...storeActivities, ...collegeActivitiesFallback]

  // Deduplicate and sort by timestamp descending
  const seenIds = new Set<string>()
  const displayList = combined
    .filter((act) => {
      if (seenIds.has(act.id)) return false
      seenIds.add(act.id)
      return true
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  return (
    <DashboardCard title="Recent Activity" icon={Activity} className={className} noPadding>
      {displayList.length === 0 ? (
        <p className="text-sm text-ink-400 text-center py-8 px-5">No recent activity</p>
      ) : (
        <div className="divide-y divide-border/60 max-h-[380px] overflow-y-auto">
          {displayList.map((activity) => {
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
