import { DashboardCard } from '../../../components/ui/DashboardCard'
import { NoticeCard } from '../../../components/ui/NoticeCard'
import { Megaphone } from 'lucide-react'
import type { NoticePriority } from '../../../types/domain'
import { useNoticeStore } from '../../../lib/noticeStore'

interface NoticeItem {
  id: string
  title: string
  body: string
  priority: NoticePriority
  author: string
  date: string
}

interface NoticeListWidgetProps {
  notices?: NoticeItem[]
  className?: string
  viewAllHref?: string
}

export function NoticeListWidget({
  notices: propNotices,
  className = '',
  viewAllHref,
}: NoticeListWidgetProps) {
  const { notices: storeNotices } = useNoticeStore()

  const displayNotices: NoticeItem[] = propNotices || storeNotices.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.description,
    priority: n.priority,
    author: n.author,
    date: n.date,
  }))

  return (
    <DashboardCard
      title="Notices"
      icon={Megaphone}
      className={className}
      viewAllHref={viewAllHref}
    >
      {displayNotices.length === 0 ? (
        <p className="text-sm text-ink-400 text-center py-8">No notices to display</p>
      ) : (
        <div className="space-y-3">
          {displayNotices.slice(0, 3).map((notice) => (
            <NoticeCard key={notice.id} {...notice} />
          ))}
        </div>
      )}
    </DashboardCard>
  )
}
