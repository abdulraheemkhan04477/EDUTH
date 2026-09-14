import { supabase } from '../lib/supabase'

export interface UserSearchResult {
  id: string
  name: string
  email: string
  role: string
  avatar_url?: string
  sub_title?: string
  course?: string
  branch?: string
}

export interface ConversationItem {
  id: string
  college_id: string
  participant_ids: string[]
  target_id: string
  target_name: string
  target_role: string
  target_avatar?: string
  last_message?: string
  last_message_at?: string
  unread_count: number
  created_at: string
}

export interface MessageItem {
  id: string
  conversation_id: string
  college_id: string
  sender_id: string
  receiver_id: string
  content: string
  sender_name?: string
  sender_role?: string
  read_at?: string
  created_at: string
}

// In-memory caching for zero-loading screen navigation
let memoryConversationsCache: { userId: string; data: ConversationItem[]; timestamp: number } | null = null
const memoryRecipientsCache: Map<string, { userId: string; data: UserSearchResult[]; timestamp: number }> = new Map()
const memoryMessagesCache: Map<string, { data: MessageItem[]; timestamp: number }> = new Map()

export const CommunicationService = {
  /**
   * Get Communication Recipients (Default role-based auto list OR filtered by search, course, branch).
   * Uses memory cache for instant render upon returning to Communication panel.
   */
  async getRecipients(
    currentUserId?: string,
    searchQuery: string = '',
    course: string = '',
    branch: string = '',
    forceRefresh: boolean = false
  ): Promise<UserSearchResult[]> {
    const userId = currentUserId || 'anonymous'
    const filterKey = `${userId}|${searchQuery.trim()}|${course.trim()}|${branch.trim()}`
    const cached = memoryRecipientsCache.get(filterKey)

    // If fresh cache exists, return immediately and silently refresh background
    if (!forceRefresh && cached && Date.now() - cached.timestamp < 120000) {
      // Background silent refresh
      this.fetchRecipientsFromDb(currentUserId, searchQuery, course, branch).then((freshData) => {
        memoryRecipientsCache.set(filterKey, { userId, data: freshData, timestamp: Date.now() })
      })
      return cached.data
    }

    const data = await this.fetchRecipientsFromDb(currentUserId, searchQuery, course, branch)
    memoryRecipientsCache.set(filterKey, { userId, data, timestamp: Date.now() })
    return data
  },

  async fetchRecipientsFromDb(
    currentUserId?: string,
    searchQuery: string = '',
    course: string = '',
    branch: string = ''
  ): Promise<UserSearchResult[]> {
    const { data, error } = await supabase.rpc('get_communication_recipients', {
      p_user_id: currentUserId || null,
      p_search_query: searchQuery.trim() || null,
      p_course: course.trim() || null,
      p_branch: branch.trim() || null,
    })

    if (error) {
      console.error('Error fetching communication recipients:', error)
      return []
    }

    return (data as UserSearchResult[]) || []
  },

  /**
   * Fetch all conversations for user with memory caching for zero-delay navigation.
   */
  async getConversations(currentUserId?: string, forceRefresh: boolean = false): Promise<ConversationItem[]> {
    const userId = currentUserId || 'anonymous'

    if (!forceRefresh && memoryConversationsCache && memoryConversationsCache.userId === userId) {
      // Background silent refresh
      this.fetchConversationsFromDb(currentUserId).then((freshData) => {
        memoryConversationsCache = { userId, data: freshData, timestamp: Date.now() }
      })
      return memoryConversationsCache.data
    }

    const data = await this.fetchConversationsFromDb(currentUserId)
    memoryConversationsCache = { userId, data, timestamp: Date.now() }
    return data
  },

  async fetchConversationsFromDb(currentUserId?: string): Promise<ConversationItem[]> {
    const { data, error } = await supabase.rpc('get_user_conversations', {
      p_user_id: currentUserId || null,
    })

    if (error) {
      console.error('Error fetching user conversations:', error)
      return []
    }

    return (
      (data || []).map((row: any) => ({
        id: row.id,
        college_id: row.college_id,
        participant_ids: Array.isArray(row.participant_ids) ? row.participant_ids : [],
        target_id: row.target_id,
        target_name: row.target_name || 'Unknown User',
        target_role: row.target_role || 'User',
        target_avatar: row.target_avatar,
        last_message: row.last_message || '',
        last_message_at: row.last_message_at || row.created_at,
        unread_count: Number(row.unread_count || 0),
        created_at: row.created_at,
      })) || []
    )
  },

  /**
   * Open existing conversation or create a new one.
   */
  async getOrCreateConversation(
    targetUserId: string,
    currentUserId?: string
  ): Promise<{ conversation?: ConversationItem; error?: string }> {
    const { data, error } = await supabase.rpc('get_or_create_conversation', {
      p_target_user_id: targetUserId,
      p_user_id: currentUserId || null,
    })

    if (error) {
      console.error('Error in get_or_create_conversation:', error)
      return { error: error.message }
    }

    const res = data as any
    const conv: ConversationItem = {
      id: res.id,
      college_id: res.college_id,
      participant_ids: res.participant_ids || [],
      target_id: targetUserId,
      target_name: res.target_name || 'User',
      target_role: res.target_role || 'User',
      target_avatar: res.target_avatar,
      last_message: res.last_message || '',
      last_message_at: res.last_message_at || res.created_at,
      unread_count: 0,
      created_at: res.created_at,
    }

    // Update in-memory conversations cache
    if (memoryConversationsCache) {
      const exists = memoryConversationsCache.data.some((c) => c.id === conv.id)
      if (!exists) {
        memoryConversationsCache.data = [conv, ...memoryConversationsCache.data]
      }
    }

    return { conversation: conv }
  },

  /**
   * Fetch all messages for conversation with memory caching.
   */
  async getMessages(conversationId: string, forceRefresh: boolean = false): Promise<MessageItem[]> {
    if (!conversationId) return []

    const cached = memoryMessagesCache.get(conversationId)
    if (!forceRefresh && cached) {
      // Background silent refresh
      this.fetchMessagesFromDb(conversationId).then((freshData) => {
        memoryMessagesCache.set(conversationId, { data: freshData, timestamp: Date.now() })
      })
      return cached.data
    }

    const data = await this.fetchMessagesFromDb(conversationId)
    memoryMessagesCache.set(conversationId, { data, timestamp: Date.now() })
    return data
  },

  async fetchMessagesFromDb(conversationId: string): Promise<MessageItem[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }

    return (data as MessageItem[]) || []
  },

  /**
   * Send message in a conversation.
   */
  async sendMessage(
    conversationId: string,
    content: string,
    currentUserId?: string
  ): Promise<{ message?: MessageItem; error?: string }> {
    if (!content.trim()) return { error: 'Message content cannot be empty' }

    const { data, error } = await supabase.rpc('send_communication_message', {
      p_conversation_id: conversationId,
      p_content: content.trim(),
      p_sender_id: currentUserId || null,
    })

    if (error) {
      console.error('Error sending message:', error)
      return { error: error.message }
    }

    const msg = data as MessageItem

    // Update message cache
    const existingMsgs = memoryMessagesCache.get(conversationId)?.data || []
    if (!existingMsgs.some((m) => m.id === msg.id)) {
      memoryMessagesCache.set(conversationId, {
        data: [...existingMsgs, msg],
        timestamp: Date.now(),
      })
    }

    // Update conversation last message in memory
    if (memoryConversationsCache) {
      memoryConversationsCache.data = memoryConversationsCache.data.map((c) =>
        c.id === conversationId
          ? { ...c, last_message: content.trim(), last_message_at: msg.created_at }
          : c
      )
    }

    return { message: msg }
  },

  /**
   * Mark messages as read.
   */
  async markAsRead(conversationId: string, currentUserId?: string): Promise<number> {
    if (!conversationId) return 0

    const { data, error } = await supabase.rpc('mark_messages_as_read', {
      p_conversation_id: conversationId,
      p_user_id: currentUserId || null,
    })

    if (error) {
      console.error('Error marking messages as read:', error)
      return 0
    }

    // Update local cache unread count
    if (memoryConversationsCache) {
      memoryConversationsCache.data = memoryConversationsCache.data.map((c) =>
        c.id === conversationId ? { ...c, unread_count: 0 } : c
      )
    }

    return Number(data || 0)
  },

  /**
   * Realtime subscriptions.
   */
  subscribeToMessages(conversationId: string, onNewMessage: (msg: MessageItem) => void) {
    if (!conversationId) return { unsubscribe: () => {} }

    const channel = supabase
      .channel(`chat_thread:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.new) {
            const msg = payload.new as MessageItem
            // Append to memory cache
            const existingMsgs = memoryMessagesCache.get(conversationId)?.data || []
            if (!existingMsgs.some((m) => m.id === msg.id)) {
              memoryMessagesCache.set(conversationId, {
                data: [...existingMsgs, msg],
                timestamp: Date.now(),
              })
            }
            onNewMessage(msg)
          }
        }
      )
      .subscribe()

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel)
      },
    }
  },

  subscribeToConversations(onUpdate: () => void) {
    const channel = supabase
      .channel('global_conversations_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          onUpdate()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          onUpdate()
        }
      )
      .subscribe()

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel)
      },
    }
  },

  clearCache() {
    memoryConversationsCache = null
    memoryRecipientsCache.clear()
    memoryMessagesCache.clear()
  },
}
