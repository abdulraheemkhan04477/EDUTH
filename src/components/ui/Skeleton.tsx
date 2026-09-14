export interface SkeletonProps {
  variant?: 'row' | 'card' | 'text' | 'circle'
  className?: string
}

export function Skeleton({ variant = 'text', className = '' }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-3/4 rounded',
    row: 'h-12 w-full rounded-[var(--radius-btn)]',
    card: 'h-32 w-full rounded-[var(--radius-card)]',
    circle: 'h-9 w-9 rounded-full',
  }

  return (
    <div
      className={`bg-border/60 animate-pulse ${variants[variant]} ${className}`}
      aria-hidden="true"
    />
  )
}
