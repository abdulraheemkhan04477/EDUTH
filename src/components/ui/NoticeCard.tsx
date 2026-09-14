import { formatDate } from '../../lib/formatDate'
import { StatusPill } from './StatusPill'
import type { NoticePriority } from '../../types/domain'
import { Calendar, Pencil, Trash2 } from 'lucide-react'

export interface NoticeCardProps {
  title: string
  body: string
  priority: NoticePriority
  author: string
  date: string
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

const priorityMap = {
  high: { status: 'danger' as const, label: 'High' },
  medium: { status: 'warning' as const, label: 'Medium' },
  low: { status: 'neutral' as const, label: 'Low' },
}

export function NoticeCard({
  title,
  body,
  priority,
  author,
  date,
  onEdit,
  onDelete,
  className = '',
}: NoticeCardProps) {
  const config = priorityMap[priority]

  return (
    <div className={`bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5 group ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-base font-display font-semibold text-ink-900">{title}</h3>
        <StatusPill status={config.status} label={config.label} />
      </div>
      <p className="text-sm text-ink-600 line-clamp-2 mb-3">{body}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-ink-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(date)}</span>
          <span>·</span>
          <span>By {author}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 cursor-pointer"
              aria-label="Edit notice"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded hover:bg-danger-100 text-ink-400 hover:text-danger-600 cursor-pointer"
              aria-label="Delete notice"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
