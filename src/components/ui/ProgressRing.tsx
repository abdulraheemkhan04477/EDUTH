interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  children?: React.ReactNode
  className?: string
}

/**
 * Signature EduFlow progress ring — the one recurring "flourish" of the product.
 * Uses SVG for crisp rendering at any size.
 */
export function ProgressRing({
  percent,
  size = 56,
  strokeWidth = 4,
  color = 'var(--color-brand-600)',
  bgColor = 'var(--color-border)',
  children,
  className = '',
}: ProgressRingProps) {
  const safePercent = typeof percent === 'number' && !isNaN(percent) ? percent : (parseFloat(percent as any) || 0)
  const validPercent = Math.min(100, Math.max(0, safePercent))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const calcOffset = circumference - (validPercent / 100) * circumference
  const offset = isNaN(calcOffset) ? 0 : calcOffset

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
