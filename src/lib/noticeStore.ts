import { useState, useEffect } from 'react'
import type { NoticePriority } from '../types/domain'
import { supabase, isSupabaseConfigured } from './supabase'
import { useAuth } from '../app/providers/AuthProvider'
import { normalizeCollegeId } from './academicStore'

export interface CollegeNotice {
  id: string
  title: string
  description: string
  priority: NoticePriority
  author: string
  date: string
  course: string // 'all' | 'B.Tech' | 'Diploma' | 'MBA'
  branch?: string // 'all' | 'ECE' | 'CSE' | etc. Optional!
  year?: string // 'all' | '1st Year' | '2nd Year' | etc.
  semester?: string // 'all' | 'Semester 1' | etc.
  section?: string // 'all' | 'Section A' | etc.
  publish_status?: 'published' | 'draft'
  created_at: string
  college_id?: string
}

// Initial state is empty when Supabase is configured
const initialNotices: CollegeNotice[] = []

function loadLocalStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (e) {
    return fallback
  }
}

function saveLocalStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    // ignore
  }
}

const listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach((l) => l())
}

let noticesState = loadLocalStorage<CollegeNotice[]>('eduth_notices', initialNotices)

let _lastNoticeSyncTime = 0
let _loadedNoticeCollege: string | null = null
let _inFlightNoticeSync: Promise<void> | null = null
const NOTICE_CACHE_TTL_MS = 30000

export function invalidateNoticeCache() {
  _lastNoticeSyncTime = 0
}

export async function syncNoticesWithSupabase(userCollegeId?: string, isSuperAdmin?: boolean) {
  if (!isSupabaseConfigured) return

  const targetCollege = isSuperAdmin ? 'SUPER_ADMIN' : (userCollegeId || 'COL001')

  if (_loadedNoticeCollege === targetCollege && Date.now() - _lastNoticeSyncTime < NOTICE_CACHE_TTL_MS) {
    return
  }

  if (_inFlightNoticeSync) {
    return _inFlightNoticeSync
  }

  _inFlightNoticeSync = (async () => {
    try {
      let query = supabase.from('notices').select('*').order('created_at', { ascending: false })

      if (!isSuperAdmin && userCollegeId && userCollegeId !== 'PLATFORM_ALL') {
        query = query.eq('college_id', userCollegeId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase notices sync notice:', error.message)
        return
      }

      if (data) {
        noticesState = (data as any[]).map((n) => ({
          id: n.id,
          title: n.title,
          description: n.description || '',
          priority: (n.priority || 'medium') as NoticePriority,
          author: n.author || n.author_name || 'Administration',
          date: n.date || (n.created_at ? new Date(n.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          course: n.course || 'all',
          branch: n.branch || 'all',
          year: n.year || 'all',
          semester: n.semester || 'all',
          section: n.section || 'all',
          publish_status: n.publish_status || 'published',
          created_at: n.created_at || new Date().toISOString(),
          college_id: n.college_id,
        }))
        saveLocalStorage('eduth_notices', noticesState)
        _lastNoticeSyncTime = Date.now()
        _loadedNoticeCollege = targetCollege
        notifyListeners()
      }
    } catch (err) {
      // Ignore error
    } finally {
      _inFlightNoticeSync = null
    }
  })()

  return _inFlightNoticeSync
}

export function resetNoticeStore() {
  noticesState = []
  saveLocalStorage('eduth_notices', noticesState)
  notifyListeners()
}

export const noticeStore = {
  getNotices: (): CollegeNotice[] => noticesState,

  getNoticesForStudent: (
    studentCourseOrObj?: string | { course?: string; branch?: string; year?: string; semester?: string; section?: string },
    studentBranch?: string,
    studentYear?: string,
    studentSemester?: string,
    studentSection?: string
  ): CollegeNotice[] => {
    let sCourse = typeof studentCourseOrObj === 'string' ? studentCourseOrObj : studentCourseOrObj?.course
    let sBranch = typeof studentCourseOrObj === 'string' ? studentBranch : studentCourseOrObj?.branch
    let sYear = typeof studentCourseOrObj === 'string' ? studentYear : studentCourseOrObj?.year
    let sSemester = typeof studentCourseOrObj === 'string' ? studentSemester : studentCourseOrObj?.semester
    let sSection = typeof studentCourseOrObj === 'string' ? studentSection : studentCourseOrObj?.section

    const courseStr = typeof sCourse === 'string' ? sCourse : ''
    const branchStr = typeof sBranch === 'string' ? sBranch : ''
    const yearStr = typeof sYear === 'string' ? sYear : ''
    const semStr = typeof sSemester === 'string' ? sSemester : ''
    const secStr = typeof sSection === 'string' ? sSection : ''

    return noticesState.filter((n) => {
      // Must be published if status field is present
      if (n.publish_status === 'draft') return false

      // Match Course: if notice is 'all', matches everyone. If specific, must match student course
      if (n.course && n.course !== 'all' && n.course !== 'All Courses' && courseStr && n.course.toLowerCase() !== courseStr.toLowerCase()) {
        return false
      }

      // Match Branch: if branch is not specified, or 'all', matches everyone in course. If specific, must match student branch
      if (n.branch && n.branch !== 'all' && n.branch !== 'All Branches / Common' && n.branch !== 'Common' && branchStr && n.branch.toLowerCase() !== branchStr.toLowerCase()) {
        return false
      }

      // Match Year: if year is not specified or 'all', matches everyone. If specific, must match student year
      if (n.year && n.year !== 'all' && n.year !== 'All Years' && yearStr && n.year.toLowerCase() !== yearStr.toLowerCase()) {
        return false
      }

      // Match Semester: if semester is not specified or 'all', matches everyone. If specific, must match student semester
      if (n.semester && n.semester !== 'all' && n.semester !== 'All Semesters' && semStr && n.semester.toLowerCase() !== semStr.toLowerCase()) {
        return false
      }

      // Match Section: if section is not specified or 'all', matches everyone. If specific, must match student section
      if (n.section && n.section !== 'all' && n.section !== 'All Sections' && secStr && n.section.toLowerCase() !== secStr.toLowerCase()) {
        return false
      }

      return true
    })
  },

  getNoticesForTeacher: (assignedClasses: string[]): CollegeNotice[] => {
    if (!assignedClasses || assignedClasses.length === 0) {
      return noticesState.filter((n) => !n.course || n.course === 'all' || n.course === 'All Courses')
    }
    return noticesState.filter((n) => {
      // Common notices are visible to teachers
      if (!n.course || n.course === 'all' || n.course === 'All Courses') return true

      // Check if notice matches any of teacher's assigned classes
      return assignedClasses.some((ac) => {
        const courseMatch = !n.course || n.course === 'all' || n.course === 'All Courses' || ac.toLowerCase().includes(n.course.toLowerCase())
        const branchMatch = !n.branch || n.branch === 'all' || n.branch === 'Common' || n.branch === 'All Branches / Common' || ac.toLowerCase().includes(n.branch.toLowerCase())
        const yearMatch = !n.year || n.year === 'all' || n.year === 'All Years' || ac.toLowerCase().includes(n.year.toLowerCase())
        const semMatch = !n.semester || n.semester === 'all' || n.semester === 'All Semesters' || ac.toLowerCase().includes(n.semester.toLowerCase())
        const secMatch = !n.section || n.section === 'all' || n.section === 'All Sections' || ac.toLowerCase().includes(n.section.toLowerCase())
        return courseMatch && branchMatch && yearMatch && semMatch && secMatch
      })
    })
  },

  saveNotice: async (notice: Omit<CollegeNotice, 'id' | 'created_at'> & { id?: string }) => {
    const id = notice.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'n_' + Date.now())
    const targetNotice: CollegeNotice = {
      ...notice,
      id,
      publish_status: notice.publish_status || 'published',
      created_at: new Date().toISOString(),
      year: notice.year || 'all',
      semester: notice.semester || 'all',
      section: notice.section || 'all',
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('notices').upsert([{
        id: targetNotice.id,
        college_id: targetNotice.college_id,
        title: targetNotice.title,
        description: targetNotice.description,
        priority: targetNotice.priority,
        author: targetNotice.author,
        author_name: targetNotice.author,
        date: targetNotice.date,
        course: targetNotice.course,
        branch: targetNotice.branch || 'all',
        year: targetNotice.year || 'all',
        semester: targetNotice.semester || 'all',
        section: targetNotice.section || 'all',
        publish_status: targetNotice.publish_status,
      }])

      if (error) {
        throw new Error(error.message)
      }
    }

    const existingIndex = noticesState.findIndex((n) => n.id === targetNotice.id)
    if (existingIndex >= 0) {
      noticesState[existingIndex] = targetNotice
    } else {
      noticesState = [targetNotice, ...noticesState]
    }

    saveLocalStorage('eduth_notices', noticesState)
    notifyListeners()
    return targetNotice
  },

  deleteNotice: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('notices').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    noticesState = noticesState.filter((n) => n.id !== id)
    saveLocalStorage('eduth_notices', noticesState)
    notifyListeners()
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx >= 0) listeners.splice(idx, 1)
    }
  },
}

export function useNoticeStore() {
  const [, setTick] = useState(0)
  let userContext: any = null

  try {
    const auth = useAuth()
    userContext = auth.user
  } catch {
    // Fallback
  }

  const userCollege = userContext?.college_id || userContext?.school_id
  const isSuperAdmin = userContext?.role === 'super_admin'
  const normUserCollege = normalizeCollegeId(userCollege)

  useEffect(() => {
    syncNoticesWithSupabase(userCollege, isSuperAdmin)
    const unsubscribe = noticeStore.subscribe(() => {
      setTick((prev) => prev + 1)
    })
    return unsubscribe
  }, [userContext?.id, userCollege, normUserCollege, isSuperAdmin])

  const isCollegeMatch = (itemCollegeId?: string) => {
    if (isSuperAdmin) return true
    if (!itemCollegeId) return true
    const normItem = normalizeCollegeId(itemCollegeId)
    return normItem === normUserCollege || itemCollegeId === userCollege || normItem === userCollege
  }

  return {
    notices: noticesState.filter((n) => isCollegeMatch(n.college_id)),
    getNoticesForStudent: noticeStore.getNoticesForStudent,
    getNoticesForTeacher: noticeStore.getNoticesForTeacher,
    saveNotice: noticeStore.saveNotice,
    deleteNotice: noticeStore.deleteNotice,
    invalidateNoticeCache,
  }
}

