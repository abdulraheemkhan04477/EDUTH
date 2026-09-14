import { DashboardCard } from '../../../components/ui/DashboardCard'
import { ProgressRing } from '../../../components/ui/ProgressRing'
import { CalendarCheck } from 'lucide-react'

interface AttendanceData {
  percentage: number
  present?: number
  presentDays?: number
  absent?: number
  absentDays?: number
  late?: number
  leaveDays?: number
  total?: number
  totalClasses?: number
}

const defaultData: AttendanceData = {
  percentage: 91,
  present: 36,
  absent: 3,
  late: 1,
  total: 40,
}

interface AttendanceWidgetProps {
  data?: AttendanceData
  title?: string
  subtitle?: string
  className?: string
}

export function AttendanceWidget({
  data = defaultData,
  title = 'Attendance Overview',
  subtitle,
  className = '',
}: AttendanceWidgetProps) {
  const present = data.present ?? data.presentDays ?? 0
  const absent = data.absent ?? data.absentDays ?? 0
  const late = data.late ?? data.leaveDays ?? 0
  const total = data.total ?? data.totalClasses ?? (present + absent + late)

  return (
    <DashboardCard title={title} icon={CalendarCheck} className={className}>
      <div className="flex items-center gap-6">
        {/* Progress Ring */}
        <div className="shrink-0">
          <ProgressRing
            percent={data.percentage}
            size={88}
            strokeWidth={6}
            color="var(--color-success-600)"
          >
            <span className="text-lg font-display font-bold text-ink-900">{data.percentage}%</span>
          </ProgressRing>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="bg-emerald-50/80 rounded-[var(--radius-btn)] p-2.5 border border-emerald-100">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">Present</p>
            <p className="text-xl font-display font-bold text-emerald-700 tabular-nums">{present}</p>
          </div>
          <div className="bg-rose-50/80 rounded-[var(--radius-btn)] p-2.5 border border-rose-100">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-600">Absent</p>
            <p className="text-xl font-display font-bold text-rose-700 tabular-nums">{absent}</p>
          </div>
          <div className="bg-amber-50/80 rounded-[var(--radius-btn)] p-2.5 border border-amber-100">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">Late / Leave</p>
            <p className="text-xl font-display font-bold text-amber-700 tabular-nums">{late}</p>
          </div>
          <div className="bg-slate-50 rounded-[var(--radius-btn)] p-2.5 border border-slate-200/60">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">Total</p>
            <p className="text-xl font-display font-bold text-ink-900 tabular-nums">{total}</p>
          </div>
        </div>
      </div>
      {subtitle && <p className="text-xs text-ink-400 mt-3">{subtitle}</p>}
    </DashboardCard>
  )
}
