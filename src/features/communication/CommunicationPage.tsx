import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AvatarInitials, Input, Button, Select } from '../../components/ui'
import { Send, Search, Loader2, Users, MessageSquare } from 'lucide-react'
import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, COURSES, BRANCHES_BY_COURSE } from '../../lib/academicStore'
import { CommunicationService } from '../../services/communicationService'
import type {
  ConversationItem,
  MessageItem,
  UserSearchResult,
} from '../../services/communicationService'

export function CommunicationPage() {
  const { user } = useAuth()
  useAcademicStore() // ensure academic store initialized if needed

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  // Tabs: 'chats' or 'recipients'
  const [activeTab, setActiveTab] = useState<'chats' | 'recipients'>('recipients')

  // Conversations & Active thread state
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [newMessage, setNewMessage] = useState('')

  // Filter & Recipient states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('All Courses')
  const [selectedBranch, setSelectedBranch] = useState('All Branches')
  const [recipients, setRecipients] = useState<UserSearchResult[]>([])

  // Loading states
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Derived available branches based on selected course
  const availableBranches = useMemo(() => {
    if (selectedCourse === 'All Courses') {
      const all = new Set<string>()
      Object.values(BRANCHES_BY_COURSE).forEach((list) => list.forEach((b) => all.add(b)))
      return Array.from(all)
    }
    return BRANCHES_BY_COURSE[selectedCourse] || []
  }, [selectedCourse])

  // Format timestamp
  const formatTime = (isoString?: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return ''

    const now = new Date()
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  // Load conversations (uses memory cache to prevent re-triggering full loading screens)
  const loadConversations = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return
    const convs = await CommunicationService.getConversations(user.id, forceRefresh)
    setConversations(convs)

    if (convs.length > 0 && !selectedConvId) {
      setSelectedConvId(convs[0].id)
    }
  }, [user?.id, selectedConvId])

  // Load Recipients (auto role-based list for Admin, Teacher, Student)
  const loadRecipients = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return
    const list = await CommunicationService.getRecipients(
      user.id,
      searchQuery,
      selectedCourse,
      selectedBranch,
      forceRefresh
    )
    setRecipients(list)
  }, [user?.id, searchQuery, selectedCourse, selectedBranch])

  // Initial load effect
  useEffect(() => {
    let isMounted = true
    const init = async () => {
      if (!user?.id) return
      // Only set initial loading state if we have no cached conversations or recipients
      setIsLoadingInitial(true)
      await Promise.all([loadConversations(), loadRecipients()])
      if (isMounted) setIsLoadingInitial(false)
    }

    init()

    // Realtime conversation updates
    const sub = CommunicationService.subscribeToConversations(() => {
      loadConversations(true)
    })

    return () => {
      isMounted = false
      sub.unsubscribe()
    }
  }, [user?.id, loadConversations, loadRecipients])

  // Refetch recipients on filter or search changes (silent background update)
  useEffect(() => {
    loadRecipients()
  }, [loadRecipients])

  // Load messages for selected conversation
  const loadMessages = useCallback(async (convId: string) => {
    setIsLoadingMsgs(true)
    const msgs = await CommunicationService.getMessages(convId)
    setMessages(msgs)
    setIsLoadingMsgs(false)

    if (user?.id) {
      await CommunicationService.markAsRead(convId, user.id)
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c))
      )
    }
    setTimeout(scrollToBottom, 100)
  }, [user?.id])

  useEffect(() => {
    if (!selectedConvId) return

    loadMessages(selectedConvId)

    const sub = CommunicationService.subscribeToMessages(selectedConvId, (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev
        return [...prev, newMsg]
      })

      if (user?.id && newMsg.receiver_id === user.id) {
        CommunicationService.markAsRead(selectedConvId, user.id)
      }

      setTimeout(scrollToBottom, 100)
    })

    return () => {
      sub.unsubscribe()
    }
  }, [selectedConvId, loadMessages, user?.id])

  // Start or open conversation from recipient item
  const handleSelectRecipient = async (targetUser: UserSearchResult) => {
    if (!user?.id) return
    const res = await CommunicationService.getOrCreateConversation(targetUser.id, user.id)

    if (res.error) {
      alert(`Could not start conversation: ${res.error}`)
      return
    }

    if (res.conversation) {
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === res.conversation!.id)
        if (exists) return prev
        return [res.conversation!, ...prev]
      })
      setSelectedConvId(res.conversation.id)
      setActiveTab('chats')
    }
  }

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConvId || !user?.id || isSending) return

    const text = newMessage.trim()
    setNewMessage('')
    setIsSending(true)

    const res = await CommunicationService.sendMessage(selectedConvId, text, user.id)
    setIsSending(false)

    if (res.error) {
      alert(`Failed to send message: ${res.error}`)
      return
    }

    if (res.message) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === res.message!.id)) return prev
        return [...prev, res.message!]
      })

      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConvId
            ? { ...c, last_message: text, last_message_at: res.message!.created_at }
            : c
        )
      )

      setTimeout(scrollToBottom, 100)
    }
  }

  const selectedConv = conversations.find((c) => c.id === selectedConvId)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-ink-900">Communication</h1>
        <p className="text-sm text-ink-400 mt-1">
          {isAdmin
            ? 'Communicate with faculty members across courses and departments.'
            : user?.role === 'teacher'
            ? 'Communicate with college administration and students in your assigned classes.'
            : 'Communicate directly with your assigned class teachers.'}
        </p>
      </div>

      <div className="bg-surface rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] flex h-[calc(100vh-220px)] overflow-hidden">
        {/* Left Sidebar: Navigation & Filters & Recipient List */}
        <div className="w-80 border-r border-border flex flex-col shrink-0">
          {/* Header Controls & Filters */}
          <div className="p-3 border-b border-border space-y-2">
            {/* Tab Switcher */}
            <div className="flex bg-canvas rounded-lg p-1 border border-border">
              <button
                onClick={() => setActiveTab('recipients')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'recipients'
                    ? 'bg-surface text-ink-900 shadow-sm font-semibold'
                    : 'text-ink-400 hover:text-ink-900'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>
                  {isAdmin ? 'Teachers' : user?.role === 'teacher' ? 'Class Students' : 'Class Teachers'}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('chats')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'chats'
                    ? 'bg-surface text-ink-900 shadow-sm font-semibold'
                    : 'text-ink-400 hover:text-ink-900'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Recent Chats</span>
                {conversations.some((c) => c.unread_count > 0) && (
                  <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Input
                placeholder={
                  isAdmin
                    ? 'Search teacher by name or ID...'
                    : user?.role === 'teacher'
                    ? 'Search student name or roll no...'
                    : 'Search class teacher...'
                }
                className="text-xs pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-3.5 w-3.5 absolute right-2.5 top-2.5 text-ink-400 pointer-events-none" />
            </div>

            {/* Admin Course & Branch Filters */}
            {isAdmin && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value)
                    setSelectedBranch('All Branches')
                  }}
                  options={['All Courses', ...COURSES].map((c) => ({ label: c, value: c }))}
                  className="text-xs"
                />
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  options={['All Branches', ...availableBranches].map((b) => ({ label: b, value: b }))}
                  className="text-xs"
                />
              </div>
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingInitial && recipients.length === 0 && conversations.length === 0 ? (
              <div className="p-8 flex items-center justify-center text-ink-400">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="text-xs">Loading contacts...</span>
              </div>
            ) : activeTab === 'recipients' ? (
              /* Auto-populated Role-based Recipient List */
              recipients.length === 0 ? (
                <div className="p-6 text-center text-ink-400">
                  <p className="text-xs font-medium">No matching contacts found</p>
                  <p className="text-[11px] mt-1">
                    {isAdmin
                      ? 'No teachers match the selected filters.'
                      : user?.role === 'teacher'
                      ? 'No students found for your assigned classes.'
                      : 'No teachers currently assigned to your class.'}
                  </p>
                </div>
              ) : (
                recipients.map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => handleSelectRecipient(rec)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-canvas transition-colors border-b border-border cursor-pointer"
                  >
                    <AvatarInitials name={rec.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ink-900 truncate">{rec.name}</p>
                        <span className="text-[10px] uppercase font-semibold text-brand-600 bg-brand-100/60 px-1.5 py-0.5 rounded">
                          {rec.role}
                        </span>
                      </div>
                      <p className="text-xs text-ink-400 truncate mt-0.5">
                        {rec.sub_title || rec.email}
                      </p>
                    </div>
                  </button>
                ))
              )
            ) : (
              /* Recent Conversations List */
              conversations.length === 0 ? (
                <div className="p-6 text-center text-ink-400">
                  <p className="text-xs font-medium">No recent conversations</p>
                  <p className="text-[11px] mt-1">Select a contact from the list above to start chatting.</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-canvas transition-colors border-b border-border cursor-pointer ${
                      selectedConvId === conv.id ? 'bg-brand-100/50' : ''
                    }`}
                  >
                    <AvatarInitials name={conv.target_name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ink-900 truncate">{conv.target_name}</p>
                        <span className="text-xs text-ink-400 shrink-0">{formatTime(conv.last_message_at)}</span>
                      </div>
                      <p className="text-xs text-ink-400 capitalize">{conv.target_role}</p>
                      <p className="text-xs text-ink-400 truncate mt-0.5">
                        {conv.last_message || <span className="italic opacity-60">No messages yet</span>}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="bg-brand-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                        {conv.unread_count}
                      </span>
                    )}
                  </button>
                ))
              )
            )}
          </div>
        </div>

        {/* Right Message Thread */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <AvatarInitials name={selectedConv.target_name} />
                <div>
                  <p className="text-sm font-medium text-ink-900">{selectedConv.target_name}</p>
                  <p className="text-xs text-ink-400 capitalize">{selectedConv.target_role}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoadingMsgs ? (
                  <div className="h-full flex items-center justify-center text-ink-400">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span className="text-xs">Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-ink-400">
                    <p className="text-xs">No messages in this conversation yet. Type below to start!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === user?.id
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-[var(--radius-card)] text-sm ${
                            isMine ? 'bg-brand-600 text-white' : 'bg-canvas text-ink-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMine ? 'text-white/70' : 'text-ink-400'}`}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border flex items-center gap-3">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendMessage} disabled={isSending || !newMessage.trim()}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-ink-400 p-8 text-center">
              <div>
                <MessageSquare className="h-10 w-10 text-ink-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-ink-900">Select a contact to start messaging</p>
                <p className="text-xs text-ink-400 mt-1 max-w-xs mx-auto">
                  Choose a recipient from the list on the left to open a conversation thread.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
