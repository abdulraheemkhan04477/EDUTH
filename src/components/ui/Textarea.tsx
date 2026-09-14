import { type TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-[var(--radius-btn)] border px-3.5 py-2.5 text-sm text-ink-900 bg-surface placeholder:text-ink-400 shadow-2xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[80px] ${
          error ? 'border-danger-600 focus:ring-danger-600/20' : 'border-border'
        } ${className}`}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
