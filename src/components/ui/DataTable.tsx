import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from './Skeleton'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows?: T[]
  data?: T[]
  isLoading?: boolean
  emptyState?: React.ReactNode
  emptyText?: string
  keyExtractor?: (row: T, index: number) => string
  // Pagination
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  className?: string
}

export function DataTable<T>({
  columns,
  rows,
  data,
  isLoading,
  emptyState,
  emptyText,
  keyExtractor,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  className = '',
}: DataTableProps<T>) {
  const actualRows = data || rows || []
  const effectiveTotal = total ?? actualRows.length
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / pageSize))

  const getKey = (row: T, index: number): string => {
    if (keyExtractor) return keyExtractor(row, index)
    const r = row as any
    return r.id || r.student_id || r.receipt_no || r.roll_no || String(index)
  }

  if (isLoading) {
    return (
      <div className={`bg-surface rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-canvas/50">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-ink-400 uppercase tracking-wider">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton variant="text" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (actualRows.length === 0) {
    if (emptyState) {
      return (
        <div className={`bg-surface rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-8 ${className}`}>
          {emptyState}
        </div>
      )
    }
    return (
      <div className={`bg-surface rounded-[var(--radius-card)] border border-border/80 p-8 text-center text-ink-400 text-sm font-medium ${className}`}>
        {emptyText || 'No records found.'}
      </div>
    )
  }

  const displayedRows = total !== undefined ? actualRows : actualRows.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className={`bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-slate-50/80 sticky top-0">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  } ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, idx) => (
              <tr
                key={getKey(row, idx)}
                className="border-b border-border/60 last:border-0 hover:bg-slate-50/60 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-ink-600 whitespace-nowrap ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    } ${col.className ?? ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && effectiveTotal > pageSize && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm text-ink-400">
          <span>
            Showing {Math.min((page - 1) * pageSize + 1, effectiveTotal)}–{Math.min(page * pageSize, effectiveTotal)} of {effectiveTotal}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded hover:bg-canvas disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-2.5 py-1 rounded text-sm cursor-pointer ${
                    pageNum === page ? 'bg-brand-600 text-white' : 'hover:bg-canvas text-ink-600'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded hover:bg-canvas disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
