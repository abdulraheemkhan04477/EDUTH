import { DashboardCard } from '../../../components/ui/DashboardCard'
import { ProgressRing } from '../../../components/ui/ProgressRing'
import { TrendingUp } from 'lucide-react'

interface SubjectPerformance {
  subject: string
  percentage: number
  grade: string
}



function getBarColor(pct: number): string {
  if (pct >= 85) return 'bg-success-600'
  if (pct >= 70) return 'bg-brand-600'
  if (pct >= 50) return 'bg-warning-600'
  return 'bg-danger-600'
}

interface AcademicProgressWidgetProps {
  subjects?: SubjectPerformance[]
  overallPercentage?: number
  className?: string
}

export function AcademicProgressWidget({
  subjects = [],
  overallPercentage,
  className = '',
}: AcademicProgressWidgetProps) {
  const overall =
    overallPercentage ??
    (subjects.length > 0
      ? Math.round(subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length)
      : 0)

  return (
    <DashboardCard title="Academic Progress" icon={TrendingUp} className={className}>
      {subjects.length === 0 ? (
        <p className="text-xs text-ink-400 text-center py-8">No published academic progress data available yet.</p>
      ) : (
        <div className="flex items-start gap-5">
          {/* Overall ring */}
          <div className="shrink-0 flex flex-col items-center">
            <ProgressRing
              percent={overall}
              size={80}
              strokeWidth={6}
              color="var(--color-brand-600)"
            >
              <span className="text-base font-display font-bold text-ink-900">{overall}%</span>
            </ProgressRing>
            <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wide mt-2">
              Overall
            </p>
          </div>

          {/* Subject bars */}
          <div className="flex-1 space-y-2.5 min-w-0">
            {subjects.map((s) => (
              <div key={s.subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-ink-900 truncate">{s.subject}</span>
                  <span className="text-xs font-semibold text-ink-600 tabular-nums shrink-0 ml-2">
                    {s.percentage}% · {s.grade}
                  </span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(s.percentage)}`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  )
}
