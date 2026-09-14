import { useState, useEffect } from 'react'
import { COURSES, BRANCHES_BY_COURSE, SEMESTERS_BY_YEAR_COURSE, normalizeCollegeId } from './academicStore'
import { supabase, isSupabaseConfigured } from './supabase'
import { useAuth } from '../app/providers/AuthProvider'

export interface Assignment {
  id: string
  class_id?: string
  teacher_id?: string
  title: string
  course: string
  branch: string
  is_common_subject: boolean
  semester: string
  section: string
  year?: string
  subject: string
  assignment_date: string
  due_date: string
  description: string
  attachment_url?: string
  attachment_type?: 'PDF' | 'Link' | 'File'
  attachment_name?: string
  created_by: string
  teacher_name: string
  submitted_count: number
  total_students: number
  status: 'active' | 'overdue' | 'completed'
  created_at: string
  college_id?: string
}

// Initial state is empty when Supabase is configured
const initialAssignments: Assignment[] = []

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

// Global Event Listener System
const listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach((l) => l())
}

let assignmentsState = loadLocalStorage<Assignment[]>(
  'eduth_assignments_v2',
  initialAssignments
)

let _lastAssignmentSyncTime = 0
let _loadedAssignmentCollege: string | null = null
let _inFlightAssignmentSync: Promise<void> | null = null
const ASSIGNMENT_CACHE_TTL_MS = 30000

export function invalidateAssignmentCache() {
  _lastAssignmentSyncTime = 0
}

export async function syncAssignmentsWithSupabase(userCollegeId?: string, isSuperAdmin?: boolean) {
  if (!isSupabaseConfigured) return

  const targetCollege = isSuperAdmin ? 'SUPER_ADMIN' : (userCollegeId || 'COL001')

  if (_loadedAssignmentCollege === targetCollege && Date.now() - _lastAssignmentSyncTime < ASSIGNMENT_CACHE_TTL_MS) {
    return
  }

  if (_inFlightAssignmentSync) {
    return _inFlightAssignmentSync
  }

  _inFlightAssignmentSync = (async () => {
    try {
      let query = supabase.from('assignments').select('*').order('created_at', { ascending: false })

      if (!isSuperAdmin && userCollegeId && userCollegeId !== 'PLATFORM_ALL') {
        query = query.eq('college_id', userCollegeId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase assignments sync notice:', error.message)
        return
      }

      if (data) {
        assignmentsState = (data as any[]).map((a) => ({
          id: a.id,
          class_id: a.class_id || undefined,
          teacher_id: a.teacher_id || undefined,
          title: a.title,
          course: a.course,
          branch: a.branch,
          is_common_subject: Boolean(a.is_common_subject),
          semester: a.semester,
          section: a.section,
          year: a.year || 'all',
          subject: a.subject,
          assignment_date: a.assignment_date,
          due_date: a.due_date,
          description: a.description || '',
          attachment_url: a.attachment_url,
          attachment_type: a.attachment_type,
          attachment_name: a.attachment_name,
          created_by: a.created_by || '',
          teacher_name: a.teacher_name || '',
          submitted_count: Number(a.submitted_count) || 0,
          total_students: Number(a.total_students) || 60,
          status: a.status || 'active',
          created_at: a.created_at || new Date().toISOString(),
          college_id: a.college_id,
        }))
        saveLocalStorage('eduth_assignments_v2', assignmentsState)
        _lastAssignmentSyncTime = Date.now()
        _loadedAssignmentCollege = targetCollege
        notifyListeners()
      }
    } catch (err) {
      // Ignore error
    } finally {
      _inFlightAssignmentSync = null
    }
  })()

  return _inFlightAssignmentSync
}

export function resetAssignmentStore() {
  assignmentsState = []
  saveLocalStorage('eduth_assignments_v2', assignmentsState)
  notifyListeners()
}

export const assignmentStore = {
  getAssignments: (): Assignment[] => assignmentsState,

  getStudentAssignments: (
    course: string,
    branch: string,
    semester: string,
    section?: string
  ): Assignment[] => {
    return assignmentsState.filter((a) => {
      if (a.course !== course) return false
      if (a.semester !== semester) return false

      if (a.section && a.section !== 'All Sections' && section && a.section !== section) {
        return false
      }

      if (a.is_common_subject || a.branch === 'Common Subject' || a.branch === branch) {
        return true
      }
      return false
    })
  },

  getTeacherAssignments: (
    assignedClasses?: (string | any)[],
    teacherIdOrName?: string,
    allClasses?: any[]
  ): Assignment[] => {
    if (!assignedClasses || assignedClasses.length === 0) {
      return []
    }

    const clsList = allClasses || []
    const classRecords: any[] = assignedClasses.map((item) => {
      if (typeof item !== 'string') return item
      const found = clsList.find((c: any) => c.id === item || c.name === item)
      if (found) return found
      const acLower = item.toLowerCase()
      return {
        id: item,
        name: item,
        course: (['B.Tech', 'Diploma', 'MBA', 'BCA', 'B.Sc'].find(c => acLower.includes(c.toLowerCase())) || 'B.Tech'),
        branch: (['ECE', 'CSE', 'EE', 'ME', 'Civil', 'IT', 'AI/ML', 'Biotech', 'Finance', 'HR', 'Marketing'].find(b => acLower.includes(b.toLowerCase())) || 'ECE'),
        year: (['1st Year', '2nd Year', '3rd Year', '4th Year'].find(y => acLower.includes(y.toLowerCase())) || '1st Year'),
        semester: (['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].find(s => acLower.includes(s.toLowerCase())) || 'Semester 1'),
        section: (['Section A', 'Section B', 'Section C', 'Section D'].find(s => acLower.includes(s.toLowerCase())) || 'Section A'),
      }
    })

    return assignmentsState.filter((a) => {
      // 1. Direct class_id or class name match
      if (a.class_id && classRecords.some((c) => c.id === a.class_id || c.name === a.class_id)) {
        return true
      }

      // 2. Match creator or assigned teacher ID
      if (teacherIdOrName && (a.created_by === teacherIdOrName || a.teacher_name === teacherIdOrName || a.teacher_id === teacherIdOrName)) {
        return true
      }

      // 3. Match against assigned class attributes
      const matchesAssignedClass = classRecords.some((c) => {
        if (a.course && c.course && a.course.toLowerCase() !== c.course.toLowerCase()) return false

        const isCommon = a.is_common_subject || a.branch === 'Common Subject' || a.branch === 'All Branches / Common'
        if (!isCommon && a.branch && c.branch && a.branch.toLowerCase() !== c.branch.toLowerCase()) return false

        if (a.semester && c.semester && a.semester !== 'All Semesters') {
          const aSemNum = a.semester.replace(/\D/g, '')
          const cSemNum = c.semester.replace(/\D/g, '')
          if (aSemNum && cSemNum && aSemNum !== cSemNum && a.semester.toLowerCase() !== c.semester.toLowerCase()) {
            return false
          }
        }

        if (a.section && a.section !== 'All Sections' && c.section && a.section !== c.section) {
          return false
        }

        return true
      })

      return matchesAssignedClass
    })
  },

  saveAssignment: async (
    item: Omit<Assignment, 'id' | 'created_at' | 'submitted_count' | 'total_students' | 'status'> & {
      id?: string
      class_id?: string
      teacher_id?: string
      submitted_count?: number
      total_students?: number
      status?: 'active' | 'overdue' | 'completed'
      college_id?: string
    }
  ) => {
    const isCommon = item.branch === 'Common Subject' || Boolean(item.is_common_subject)
    const normalizedBranch = isCommon ? 'Common Subject' : item.branch
    const today = new Date()
    const dueDateObj = new Date(item.due_date)
    const isOverdue = dueDateObj < today
    const status: 'active' | 'overdue' | 'completed' = item.status || (isOverdue ? 'overdue' : 'active')

    let targetAssignment: Assignment

    if (item.id) {
      const existing = assignmentsState.find((a) => a.id === item.id)
      targetAssignment = {
        ...existing,
        ...item,
        id: item.id,
        class_id: item.class_id || existing?.class_id,
        teacher_id: item.teacher_id || existing?.teacher_id,
        branch: normalizedBranch,
        is_common_subject: isCommon,
        year: item.year || existing?.year || 'all',
        submitted_count: item.submitted_count ?? existing?.submitted_count ?? 0,
        total_students: item.total_students ?? existing?.total_students ?? 60,
        status,
        created_at: existing?.created_at || new Date().toISOString(),
        college_id: item.college_id || existing?.college_id,
      } as Assignment
    } else {
      const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'asg_' + Date.now()
      targetAssignment = {
        ...item,
        id,
        class_id: item.class_id,
        teacher_id: item.teacher_id,
        branch: normalizedBranch,
        is_common_subject: isCommon,
        year: item.year || 'all',
        submitted_count: item.submitted_count ?? 0,
        total_students: item.total_students ?? 60,
        status,
        created_at: new Date().toISOString(),
        college_id: item.college_id,
      }
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('assignments').upsert([{
        id: targetAssignment.id,
        college_id: targetAssignment.college_id,
        class_id: targetAssignment.class_id || null,
        teacher_id: targetAssignment.teacher_id || null,
        title: targetAssignment.title,
        course: targetAssignment.course,
        branch: targetAssignment.branch,
        is_common_subject: targetAssignment.is_common_subject,
        semester: targetAssignment.semester,
        section: targetAssignment.section,
        year: targetAssignment.year || 'all',
        subject: targetAssignment.subject,
        assignment_date: targetAssignment.assignment_date,
        due_date: targetAssignment.due_date,
        description: targetAssignment.description,
        attachment_url: targetAssignment.attachment_url,
        attachment_type: targetAssignment.attachment_type,
        attachment_name: targetAssignment.attachment_name,
        created_by: targetAssignment.created_by,
        teacher_name: targetAssignment.teacher_name,
        submitted_count: targetAssignment.submitted_count,
        total_students: targetAssignment.total_students,
        status: targetAssignment.status,
      }])

      if (error) {
        throw new Error(error.message)
      }
    }

    const existingIndex = assignmentsState.findIndex((a) => a.id === targetAssignment.id)
    if (existingIndex >= 0) {
      assignmentsState[existingIndex] = targetAssignment
    } else {
      assignmentsState = [targetAssignment, ...assignmentsState]
    }

    saveLocalStorage('eduth_assignments_v2', assignmentsState)
    notifyListeners()
    return targetAssignment
  },

  deleteAssignment: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('assignments').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    assignmentsState = assignmentsState.filter((a) => a.id !== id)
    saveLocalStorage('eduth_assignments_v2', assignmentsState)
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

export function useAssignmentStore() {
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
    syncAssignmentsWithSupabase(userCollege, isSuperAdmin)
    const unsubscribe = assignmentStore.subscribe(() => {
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

  const rawAssignments = assignmentStore.getAssignments()
  const scopedAssignments = isSuperAdmin ? rawAssignments : rawAssignments.filter((a) => isCollegeMatch(a.college_id))

  return {
    assignments: scopedAssignments,
    getStudentAssignments: assignmentStore.getStudentAssignments,
    getTeacherAssignments: assignmentStore.getTeacherAssignments,
    saveAssignment: assignmentStore.saveAssignment,
    deleteAssignment: assignmentStore.deleteAssignment,
    invalidateAssignmentCache,
    courses: COURSES,
    branchesByCourse: BRANCHES_BY_COURSE,
    getSemestersByYearCourse: SEMESTERS_BY_YEAR_COURSE,
  }
}

