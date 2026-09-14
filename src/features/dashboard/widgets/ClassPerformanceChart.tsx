import { DashboardCard } from '../../../components/ui/DashboardCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface ClassPerformance {
  class_name: string
  average: number
}

const defaultData: ClassPerformance[] = [
  { class_name: '10-A', average: 82 },
  { class_name: '10-B', average: 76 },
  { class_name: '9-A', average: 88 },
  { class_name: '9-B', average: 71 },
  { class_name: '8-A', average: 85 },
  { class_name: '8-B', average: 79 },
  { class_name: '7-A', average: 90 },
]

function getBarColor(value: number): string {
  if (value >= 85) return 'var(--color-success-600)'
  if (value >= 75) return 'var(--color-brand-600)'
  if (value >= 60) return 'var(--color-warning-600)'
  return 'var(--color-danger-600)'
}

interface ClassPerformanceChartProps {
  data?: ClassPerformance[]
  className?: string
}

export function ClassPerformanceChart({
  data = defaultData,
  className = '',
}: ClassPerformanceChartProps) {
  return (
    <DashboardCard title="Class Performance" icon={TrendingUp} className={className}>
      {data.length === 0 ? (
        <p className="text-sm text-ink-400 text-center py-8">No performance data available</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="class_name"
                tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value: any) => [`${value}%`, 'Average']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-soft)',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="average" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.average)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 text-xs text-ink-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success-600" /> ≥85%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600" /> 75–84%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-warning-600" /> 60–74%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-danger-600" /> &lt;60%
            </span>
          </div>
        </>
      )}
    </DashboardCard>
  )
}
