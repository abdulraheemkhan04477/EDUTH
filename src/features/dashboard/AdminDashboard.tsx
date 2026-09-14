import { StatCard } from '../../components/ui'
import { Users, GraduationCap, School, IndianRupee } from 'lucide-react'
import { formatCurrency } from '../../lib/formatCurrency'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { ClassPerformanceChart } from './widgets/ClassPerformanceChart'
import { CalendarWidget } from './widgets/CalendarWidget'
import { UpcomingExamsList } from './widgets/UpcomingExamsList'
import { RecentActivityFeed } from './widgets/RecentActivityFeed'
import { useAcademicStore } from '../../lib/academicStore'
import { useFeeStore } from '../../lib/feeStore'
const attendanceData = [
  { month: 'Jan', percentage: 92 }, { month: 'Feb', percentage: 88 },
  { month: 'Mar', percentage: 91 }, { month: 'Apr', percentage: 85 },
  { month: 'May', percentage: 90 }, { month: 'Jun', percentage: 94 },
  { month: 'Jul', percentage: 87 },
]

const feeData = [
  { month: 'Jan', collected: 85000, pending: 15000 },
  { month: 'Feb', collected: 78000, pending: 22000 },
  { month: 'Mar', collected: 92000, pending: 8000 },
  { month: 'Apr', collected: 70000, pending: 30000 },
  { month: 'May', collected: 88000, pending: 12000 },
  { month: 'Jun', collected: 95000, pending: 5000 },
]

export function AdminDashboard() {
  const { students, teachers, classes } = useAcademicStore()
  const { getDashboardMetrics } = useFeeStore()
  const metrics = getDashboardMetrics()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-400 mt-1">Welcome back! Here's your college overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Students" value={students.length.toLocaleString()} icon={Users} tone="brand" progressPercent={85} />
        <StatCard label="Total Teachers" value={teachers.length.toLocaleString()} icon={GraduationCap} tone="success" progressPercent={92} />
        <StatCard label="Total Classes" value={classes.length.toLocaleString()} icon={School} tone="info" progressPercent={100} />
        <StatCard label="Fee Collected" value={formatCurrency(metrics.totalCollectedAmount)} icon={IndianRupee} tone="warning" progressPercent={metrics.paidPercent} caption={`${metrics.paidPercent}% of total due`} />
      </div>

      {/* Row 2: Attendance + Fee Charts (existing) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Attendance Trend */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5">
          <h3 className="text-base font-display font-semibold text-ink-900 mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }} domain={[70, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percentage" stroke="var(--color-brand-600)" strokeWidth={2} dot={{ fill: 'var(--color-brand-600)', r: 4 }} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Collection */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5">
          <h3 className="text-base font-display font-semibold text-ink-900 mb-4">Fee Collection — Collected vs Pending</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={feeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }} />
              <Tooltip formatter={(value: any) => formatCurrency(Number(value || 0))} />
              <Legend />
              <Bar dataKey="collected" fill="var(--color-success-600)" name="Collected" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="var(--color-warning-600)" name="Pending" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Class Performance + College Calendar (NEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ClassPerformanceChart />
        <CalendarWidget />
      </div>

      {/* Row 4: Upcoming Exams + Recent Activity (NEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UpcomingExamsList viewAllHref="exams" />
        <RecentActivityFeed />
      </div>
    </div>
  )
}
