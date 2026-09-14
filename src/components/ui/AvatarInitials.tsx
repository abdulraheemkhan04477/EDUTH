export interface AvatarInitialsProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-2xs',
    'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xs',
    'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-2xs',
    'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-2xs',
    'bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-2xs',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const sizeClasses = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function AvatarInitials({ name, size = 'md', className = '' }: AvatarInitialsProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium shrink-0 ${getColorFromName(name)} ${sizeClasses[size]} ${className}`}
      aria-label={name}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
