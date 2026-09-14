export interface TabItem {
  id: string
  label: string
  count?: number
}

export interface TabsProps {
  tabs: TabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeId, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-1 border-b border-border ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
              isActive
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-ink-400 hover:text-ink-900 hover:border-border'
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 text-xs ${isActive ? 'text-brand-600' : 'text-ink-400'}`}>
                ({tab.count})
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
