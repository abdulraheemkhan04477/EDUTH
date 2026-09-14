import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface DashboardCardProps {
  title: string
  icon?: LucideIcon
  viewAllHref?: string
  viewAllLabel?: string
  className?: string
  children: React.ReactNode
  noPadding?: boolean
}

/**
 * Consistent dashboard widget card wrapper.
 * Provides title bar with optional icon + "View All" link,
 * and a padded content area.
 */
export function DashboardCard({
  title,
  icon: Icon,
  viewAllHref,
  viewAllLabel = 'View All',
  className = '',
  children,
  noPadding = false,
}: DashboardCardProps) {
  return (
    <div
      className={`bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-base font-display font-semibold text-ink-900 flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-brand-600" />}
          {title}
        </h3>
        {viewAllHref && (
          <Link
            to={viewAllHref.startsWith('/') ? viewAllHref : `/${viewAllHref}`}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-0.5 transition-colors"
          >
            {viewAllLabel}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className={noPadding ? '' : 'px-5 pb-5'}>{children}</div>
    </div>
  )
}
