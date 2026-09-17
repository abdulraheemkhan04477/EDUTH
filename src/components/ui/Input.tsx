import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  error?: boolean
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={`relative w-full ${containerClassName}`}>
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full rounded-[var(--radius-btn)] border px-3.5 py-2 text-sm text-ink-900 bg-surface placeholder:text-ink-400 shadow-2xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-danger-600 focus:ring-danger-600/20' : 'border-border'} ${className}`}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'

