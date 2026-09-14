import type { LucideIcon } from 'lucide-react'
import { ProgressRing } from './ProgressRing'

export interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: 'brand' | 'success' | 'warning' | 'info' | 'danger'
  progressPercent?: number
  caption?: string
  className?: string
}

const toneConfig = {
  brand: { bg: 'bg-indigo-50/80 border-indigo-100', text: 'text-indigo-600', ring: 'var(--color-brand-600)' },
  success: { bg: 'bg-emerald-50/80 border-emerald-100', text: 'text-emerald-600', ring: 'var(--color-success-600)' },
  warning: { bg: 'bg-amber-50/80 border-amber-100', text: 'text-amber-600', ring: 'var(--color-warning-600)' },
  info: { bg: 'bg-blue-50/80 border-blue-100', text: 'text-blue-600', ring: 'var(--color-info-600)' },
  danger: { bg: 'bg-rose-50/80 border-rose-100', text: 'text-rose-600', ring: 'var(--color-danger-600)' },
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
  progressPercent,
  caption,
  className = '',
}: StatCardProps) {
  const config = toneConfig[tone] || toneConfig.brand

  return (
    <div className={`bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5 flex items-start gap-4 ${className}`}>
      {/* Icon badge */}
      <div className={`${config.bg} ${config.text} border p-2.5 rounded-[var(--radius-btn)] shrink-0 shadow-2xs`}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink-400 font-medium uppercase tracking-wide mb-1">{label}</p>
        <div className="flex items-center gap-3">
          <p className="text-2xl font-display font-bold text-ink-900 tabular-nums">{value}</p>
          {progressPercent !== undefined && (
            <ProgressRing
              percent={progressPercent}
              size={40}
              strokeWidth={3}
              color={config.ring}
            />
          )}
        </div>
        {caption && <p className="text-xs text-ink-400 mt-1">{caption}</p>}
      </div>
    </div>
  )
}
