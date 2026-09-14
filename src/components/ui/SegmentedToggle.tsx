export interface SegmentedToggleProps<T extends string> {
  options: { value: T; label: string; color?: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

const colorMap: Record<string, string> = {
  green: 'bg-success-600 text-white',
  red: 'bg-danger-600 text-white',
  yellow: 'bg-warning-600 text-white',
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedToggleProps<T>) {
  return (
    <div className={`inline-flex rounded-[var(--radius-btn)] border border-border overflow-hidden ${className}`} role="radiogroup">
      {options.map((opt) => {
        const isActive = opt.value === value
        const activeColor = opt.color ? colorMap[opt.color] || 'bg-brand-600 text-white' : 'bg-brand-600 text-white'

        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={isActive}
            className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isActive ? activeColor : 'bg-surface text-ink-600 hover:bg-canvas'
            }`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
