import { DashboardCard } from '../../../components/ui/DashboardCard'
import { StatusPill } from '../../../components/ui/StatusPill'
import { Award } from 'lucide-react'

interface ExamResult {
  subject: string
  marks: number
  maxMarks: number
  grade: string
}



interface RecentExamResultWidgetProps {
  examName?: string
  results?: ExamResult[]
  className?: string
}

export function RecentExamResultWidget({
  examName = 'Published Examination Scorecard',
  results = [],
  className = '',
}: RecentExamResultWidgetProps) {
  const totalObtained = results.reduce((sum, r) => sum + r.marks, 0)
  const totalMax = results.reduce((sum, r) => sum + r.maxMarks, 0)
  const overallPct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0

  return (
    <DashboardCard title="Recent Exam Result" icon={Award} className={className} noPadding>
      {results.length === 0 ? (
        <p className="text-xs text-ink-400 text-center py-8 px-5">No published examination scorecards available yet.</p>
      ) : (
        <>
          {/* Exam header bar */}
          <div className="px-5 pb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-ink-400">{examName}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-display font-bold text-ink-900 tabular-nums">
                {totalObtained}/{totalMax}
              </span>
              <StatusPill
                status={overallPct >= 80 ? 'success' : overallPct >= 60 ? 'warning' : 'danger'}
                label={`${overallPct}%`}
              />
            </div>
          </div>

          {/* Results table */}
          <div className="divide-y divide-border/60">
            {results.map((r) => {
              const pct = r.maxMarks > 0 ? Math.round((r.marks / r.maxMarks) * 100) : 0
              return (
                <div
                  key={r.subject}
                  className="flex items-center gap-4 px-5 py-2.5 hover:bg-canvas/50 transition-colors"
                >
                  <span className="text-sm text-ink-900 flex-1 min-w-0 truncate">{r.subject}</span>
                  <span className="text-sm font-medium text-ink-600 tabular-nums shrink-0">
                    {r.marks}/{r.maxMarks}
                  </span>
                  <span
                    className={`text-xs font-bold shrink-0 w-8 text-center ${
                      pct >= 85
                        ? 'text-success-600'
                        : pct >= 70
                          ? 'text-brand-600'
                          : pct >= 50
                            ? 'text-warning-600'
                            : 'text-danger-600'
                    }`}
                  >
                    {r.grade}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </DashboardCard>
  )
}
