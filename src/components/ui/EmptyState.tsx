import type { LucideIcon } from 'lucide-react'
import { FileX } from 'lucide-react'
import { Button } from './Button'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = FileX,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
      <div className="bg-brand-100 p-4 rounded-full mb-4">
        <Icon className="h-8 w-8 text-brand-600" />
      </div>
      <h3 className="text-lg font-display font-semibold text-ink-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-400 max-w-sm mb-4">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
