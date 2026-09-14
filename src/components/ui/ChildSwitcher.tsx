import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { AvatarInitials } from './AvatarInitials'

export interface Child {
  id: string
  name: string
  class_name: string
}

export interface ChildSwitcherProps {
  children: Child[]
  selectedId: string
  onChange: (childId: string) => void
  className?: string
}

export function ChildSwitcher({ children: childList, selectedId, onChange, className = '' }: ChildSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = childList.find((c) => c.id === selectedId) ?? childList[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (childList.length === 1) {
    return (
      <div className={`flex items-center gap-2.5 p-2 rounded-[var(--radius-btn)] bg-white/60 border border-slate-200/80 shadow-2xs ${className}`}>
        <AvatarInitials name={selected.name} size="sm" />
        <div className="text-left flex-1 min-w-0">
          <p className="text-xs font-semibold text-ink-900 truncate">{selected.name}</p>
          <p className="text-[11px] text-ink-400 font-medium truncate">{selected.class_name}</p>
        </div>
      </div>
    )
  }

  if (childList.length === 0) return null

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full p-2 rounded-[var(--radius-btn)] hover:bg-brand-100/50 transition-colors cursor-pointer"
      >
        <AvatarInitials name={selected.name} size="sm" />
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-900 truncate">{selected.name}</p>
          <p className="text-xs text-ink-400">{selected.class_name}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-[var(--radius-btn)] shadow-[var(--shadow-soft)] z-10 py-1">
          {childList.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                onChange(child.id)
                setOpen(false)
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-canvas transition-colors cursor-pointer ${
                child.id === selectedId ? 'bg-brand-100/50' : ''
              }`}
            >
              <AvatarInitials name={child.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-ink-900">{child.name}</p>
                <p className="text-xs text-ink-400">{child.class_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
