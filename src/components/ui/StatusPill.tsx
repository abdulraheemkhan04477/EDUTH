import { Check, AlertTriangle, X, Info, Minus } from 'lucide-react'

export interface StatusPillProps {
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | string
  label?: string
  className?: string
}

const statusConfig: Record<string, { bg: string; Icon: any }> = {
  success: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', Icon: Check },
  warning: { bg: 'bg-amber-50 text-amber-700 border-amber-200/60', Icon: AlertTriangle },
  danger: { bg: 'bg-rose-50 text-rose-700 border-rose-200/60', Icon: X },
  info: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60', Icon: Info },
  neutral: { bg: 'bg-slate-100 text-slate-600 border-slate-200/60', Icon: Minus },
}

/**
 * Status pill — always shows text label alongside color, per WCAG requirement
 * that status must never rely on color alone. Safe fallback to 'neutral' if unmapped status passed.
 */
export function StatusPill({ status = 'neutral', label, className = '' }: StatusPillProps) {
  const key = status && statusConfig[status] ? status : 'neutral'
  const config = statusConfig[key]
  const Icon = config.Icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-2xs ${config.bg} ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span>{label ?? status ?? ''}</span>
    </span>
  )
}
