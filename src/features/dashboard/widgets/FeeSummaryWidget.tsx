import { DashboardCard } from '../../../components/ui/DashboardCard'
import { IndianRupee } from 'lucide-react'
import { formatCurrency } from '../../../lib/formatCurrency'

interface FeeData {
  totalFees: number
  paid: number
  pending: number
  recentPayment?: { amount: number; date: string }
}

const defaultData: FeeData = {
  totalFees: 0,
  paid: 0,
  pending: 0,
}

interface FeeSummaryWidgetProps {
  data?: FeeData
  title?: string
  className?: string
  viewAllHref?: string
}

export function FeeSummaryWidget({
  data = defaultData,
  title = 'Fees Summary',
  className = '',
  viewAllHref,
}: FeeSummaryWidgetProps) {
  const paidPercent = data.totalFees > 0 ? Math.round((data.paid / data.totalFees) * 100) : 0

  return (
    <DashboardCard title={title} icon={IndianRupee} className={className} viewAllHref={viewAllHref}>
      {/* Total */}
      <div className="mb-4">
        <p className="text-xs text-ink-400 font-medium uppercase tracking-wide">Total Fees</p>
        <p className="text-2xl font-display font-bold text-ink-900 tabular-nums mt-0.5">
          {formatCurrency(data.totalFees)}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-ink-400">Collection Progress</span>
          <span className="font-semibold text-ink-900">{paidPercent}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${paidPercent}%`,
              background:
                paidPercent >= 80
                  ? 'var(--color-success-600)'
                  : paidPercent >= 50
                    ? 'var(--color-warning-600)'
                    : 'var(--color-danger-600)',
            }}
          />
        </div>
      </div>

      {/* Paid / Pending row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50/80 rounded-[var(--radius-btn)] p-2.5 border border-emerald-100">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">Paid</p>
          <p className="text-base font-display font-bold text-emerald-700 tabular-nums">
            {formatCurrency(data.paid)}
          </p>
        </div>
        <div className="bg-amber-50/80 rounded-[var(--radius-btn)] p-2.5 border border-amber-100">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">Pending</p>
          <p className="text-base font-display font-bold text-amber-700 tabular-nums">
            {formatCurrency(data.pending)}
          </p>
        </div>
      </div>

      {/* Recent payment */}
      {data.recentPayment && (
        <p className="text-xs text-ink-400 mt-3">
          Last payment: {formatCurrency(data.recentPayment.amount)} on {data.recentPayment.date}
        </p>
      )}
    </DashboardCard>
  )
}
