import { Search } from 'lucide-react'
import { type InputHTMLAttributes, forwardRef } from 'react'

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
        <input
          ref={ref}
          type="search"
          className="w-full rounded-[var(--radius-btn)] border border-border pl-10 pr-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:outline-2 focus:outline-brand-600 focus:outline-offset-0 focus:border-brand-600 bg-surface"
          {...props}
        />
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
