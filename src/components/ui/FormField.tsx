export interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  helperText?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-900">
        {label}
        {required && <span className="text-danger-600 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-danger-600" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && <p className="text-xs text-ink-400">{helperText}</p>}
    </div>
  )
}
