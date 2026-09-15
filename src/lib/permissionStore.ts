import { useState, useEffect } from 'react'
import type { UserRole } from '../types/domain'
import { supabase, isSupabaseConfigured } from './supabase'

export interface PermissionDefinition {
  id: string
  name: string
  description: string
  category: string
  defaultChecked: Record<UserRole, boolean>
}

export interface PermissionGroup {
  category: string
  description: string
  permissions: PermissionDefinition[]
}

export function splitPermissionId(permId: string): { module: string; action: string } {
  const parts = permId.split('.')
  if (parts.length >= 2) {
    return { module: parts[0], action: parts.slice(1).join('_') }
  }
  return { module: permId, action: 'view' }
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'Student Management',
    description: 'Control access to college student directory, profile records, and academic status',
    permissions: [
      {
        id: 'students.view',
        name: 'View Student Directory',
        description: 'View student profiles, roll numbers, and academic allocations',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'students.create',
        name: 'Enroll New Student',
        description: 'Add new student records to courses and sections',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'students.edit',
        name: 'Edit Student Information',
        description: 'Modify personal details, roll numbers, and contact info',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'students.delete',
        name: 'Delete Student Record',
        description: 'Permanently delete student records from the college directory',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Teacher & Faculty Management',
    description: 'Control access to faculty profiles, qualifications, and department allocations',
    permissions: [
      {
        id: 'teachers.view',
        name: 'View Faculty Directory',
        description: 'View teacher profiles, designations, and assigned courses',
        category: 'Teacher & Faculty Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: false },
      },
      {
        id: 'teachers.create',
        name: 'Add New Faculty Member',
        description: 'Register new teachers into departments and branches',
        category: 'Teacher & Faculty Management',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'teachers.edit',
        name: 'Edit Faculty Information',
        description: 'Update faculty qualifications, designations, and assigned classes',
        category: 'Teacher & Faculty Management',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'teachers.delete',
        name: 'Remove Faculty Record',
        description: 'Delete faculty profiles from department records',
        category: 'Teacher & Faculty Management',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Attendance System',
    description: 'Control recording, reviewing, editing, and exporting student daily and lecture attendance',
    permissions: [
      {
        id: 'attendance.view',
        name: 'View Attendance Records',
        description: 'View lecture logs and student attendance percentages',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'attendance.mark',
        name: 'Mark Class Attendance',
        description: 'Record daily and lecture attendance for assigned classes',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'attendance.edit',
        name: 'Edit Historical Attendance',
        description: 'Modify past attendance entries beyond default lock period',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'attendance.delete',
        name: 'Delete Attendance Entry',
        description: 'Remove recorded attendance records',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'attendance.history',
        name: 'View Attendance History',
        description: 'Access complete academic year attendance logs',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'attendance.export',
        name: 'Export Attendance Reports',
        description: 'Export attendance logs in CSV/PDF format',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Fees & Financial Ledger',
    description: 'Control viewing fee structures, student dues, collecting payments, and fee edits',
    permissions: [
      {
        id: 'fees.view',
        name: 'View Fee Ledgers',
        description: 'View student fee structures, balances, paid, and pending dues',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: true, parent: true },
      },
      {
        id: 'fees.collect',
        name: 'Collect Fee Payment',
        description: 'Process student fee payments, record receipts, and update dues',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'fees.create',
        name: 'Configure Fee Structure',
        description: 'Create annual and semester fee structures for courses',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'fees.edit',
        name: 'Edit Fee Structure / Payment',
        description: 'Modify existing fee amounts, installment dates, or payment logs',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'fees.delete',
        name: 'Delete Fee Record',
        description: 'Remove payment receipts or fee structures',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'fees.history',
        name: 'View Payment History',
        description: 'Access complete transaction history and receipt archives',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: true, parent: true },
      },
      {
        id: 'fees.export',
        name: 'Export Financial Reports',
        description: 'Download financial ledgers and collection summaries',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Test & Examination',
    description: 'Control creation, scheduling, grading, and result publishing for examinations',
    permissions: [
      {
        id: 'exams.view',
        name: 'View Scheduled Exams',
        description: 'View exam timetables, sessional dates, and subject schedules',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'exams.create',
        name: 'Create Examination',
        description: 'Schedule new tests, sessional exams, PUTs, and main exams',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'exams.edit',
        name: 'Edit Exam Details',
        description: 'Modify exam timing, max marks, passing criteria, and dates',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'exams.delete',
        name: 'Delete Examination',
        description: 'Cancel and remove scheduled examinations',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'results.view',
        name: 'View Exam Marks',
        description: 'View subject scores, pass/fail status, and scorecards',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'results.enter',
        name: 'Enter Student Marks',
        description: 'Batch enter marks for assigned subject examinations',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'results.edit',
        name: 'Edit Entered Marks',
        description: 'Modify previously entered student exam scores',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'results.delete',
        name: 'Delete Exam Score Record',
        description: 'Remove entered marks from exam ledgers',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'results.publish',
        name: 'Publish Exam Results',
        description: 'Make exam results visible to students and parents',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'exams.export',
        name: 'Export Exam Scorecards',
        description: 'Export result sheets and exam marksheets in PDF/CSV',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Training & Placement (TNP)',
    description: 'Permissions for campus placement drives, company registrations, applications, and offers',
    permissions: [
      {
        id: 'tnp.view',
        name: 'View Placement Drives',
        description: 'View active placement drives, company postings, and eligibility',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: false },
      },
      {
        id: 'tnp.create',
        name: 'Create Placement Drive / Company',
        description: 'Register new recruitment drives, companies, and training events',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'tnp.application_view',
        name: 'View Student Applications',
        description: 'Access student placement applications and resumes',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'tnp.application_manage',
        name: 'Manage Student Applications',
        description: 'Approve, reject, or update student drive applications',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'tnp.selection_manage',
        name: 'Manage Selection Rounds',
        description: 'Log round outcomes (Online Test, Tech Interview, HR Interview)',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'tnp.placement_manage',
        name: 'Manage Placements & Offers',
        description: 'Issue final job offer records and package metrics',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'tnp.export',
        name: 'Export Placement Reports',
        description: 'Download placement statistics and placed student lists',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Reports & Analytics',
    description: 'Permissions for generating and exporting college management reports',
    permissions: [
      {
        id: 'reports.view',
        name: 'View Analytical Reports',
        description: 'Access student, attendance, exam, fee, class, and progress reports',
        category: 'Reports & Analytics',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'reports.export',
        name: 'Export Reports (PDF / CSV)',
        description: 'Download filtered analytical report datasets',
        category: 'Reports & Analytics',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Timetable Management',
    description: 'Permissions for configuring weekly period schedules and room allocation',
    permissions: [
      {
        id: 'timetable.view',
        name: 'View Class Timetable',
        description: 'View weekly lecture schedules, faculty slots, and rooms',
        category: 'Timetable Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'timetable.create',
        name: 'Add Period Assignment',
        description: 'Assign subjects, teachers, and rooms to timetable periods',
        category: 'Timetable Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'timetable.edit',
        name: 'Edit Timetable Entry',
        description: 'Modify existing lecture slots, faculty, or room assignments',
        category: 'Timetable Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'timetable.delete',
        name: 'Delete Period Assignment',
        description: 'Remove assigned periods from class schedule',
        category: 'Timetable Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Assignments & Coursework',
    description: 'Permissions for creating, submitting, and grading academic assignments',
    permissions: [
      {
        id: 'assignments.view',
        name: 'View Course Assignments',
        description: 'Access assigned coursework, deadlines, and requirements',
        category: 'Assignments & Coursework',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'assignments.create',
        name: 'Create Assignment',
        description: 'Publish new assignments to targeted courses and sections',
        category: 'Assignments & Coursework',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'assignments.edit',
        name: 'Edit Assignment Details',
        description: 'Update assignment deadlines, attachments, and instructions',
        category: 'Assignments & Coursework',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'assignments.delete',
        name: 'Delete Assignment',
        description: 'Remove assignments from student portals',
        category: 'Assignments & Coursework',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Study Materials & Repository',
    description: 'Control uploading, categorizing, and sharing academic study materials',
    permissions: [
      {
        id: 'materials.view',
        name: 'Access Study Materials',
        description: 'View and download handwritten notes, PYQ, and quantum series',
        category: 'Study Materials & Repository',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: false },
      },
      {
        id: 'materials.create',
        name: 'Upload Study Resource',
        description: 'Add new study materials for specific courses and semesters',
        category: 'Study Materials & Repository',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'materials.edit',
        name: 'Edit Material Details',
        description: 'Update study material title, category, and access level',
        category: 'Study Materials & Repository',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'materials.delete',
        name: 'Delete Study Resource',
        description: 'Remove study materials from repository',
        category: 'Study Materials & Repository',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Notice & Announcements',
    description: 'Control broadcasting announcements to specific courses, branches, or all users',
    permissions: [
      {
        id: 'notices.view',
        name: 'View Notice Board',
        description: 'Read college announcements, academic circulars, and notices',
        category: 'Notice & Announcements',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'notices.create',
        name: 'Create New Notice',
        description: 'Draft announcements targeted by course and branch',
        category: 'Notice & Announcements',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'notices.edit',
        name: 'Edit Notice Content',
        description: 'Modify notice details, target audience, and priority',
        category: 'Notice & Announcements',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'notices.delete',
        name: 'Delete Notice',
        description: 'Remove announcements from notice board',
        category: 'Notice & Announcements',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
    ],
  },
]

// Helper for initial default permissions
function getInitialMatrix(): Record<UserRole, Record<string, boolean>> {
  const matrix: Record<UserRole, Record<string, boolean>> = {
    super_admin: {},
    admin: {},
    teacher: {},
    student: {},
    parent: {},
  }

  PERMISSION_GROUPS.forEach((group) => {
    group.permissions.forEach((perm) => {
      matrix.super_admin[perm.id] = perm.defaultChecked.super_admin
      matrix.admin[perm.id] = perm.defaultChecked.admin
      matrix.teacher[perm.id] = perm.defaultChecked.teacher
      matrix.student[perm.id] = perm.defaultChecked.student
      matrix.parent[perm.id] = perm.defaultChecked.parent
    })
  })

  return matrix
}

const listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach((l) => l())
}

let roleMatrixState = getInitialMatrix()

// In-memory cache for loaded per-teacher permissions: teacherKey -> Record<permissionId, boolean>
const teacherPermissionsCache = new Map<string, Record<string, boolean>>()

export const permissionStore = {
  getMatrix: (): Record<UserRole, Record<string, boolean>> => roleMatrixState,

  getRolePermissions: (role: UserRole): Record<string, boolean> => {
    if (role === 'super_admin') {
      const all: Record<string, boolean> = {}
      PERMISSION_GROUPS.forEach((g) => g.permissions.forEach((p) => (all[p.id] = true)))
      return all
    }
    return roleMatrixState[role] || getInitialMatrix()[role] || {}
  },

  /**
   * Synchronous check for permission
   */
  hasPermission: (
    role: UserRole | string | null | undefined,
    permissionId: string,
    teacherId?: string | null
  ): boolean => {
    if (!role) return false
    const r = role.toLowerCase().replace('-', '_') as UserRole
    if (r === 'super_admin' || r === 'admin') return true

    if (r === 'teacher' && teacherId) {
      const teacherCache = teacherPermissionsCache.get(teacherId)
      if (teacherCache && typeof teacherCache[permissionId] === 'boolean') {
        return teacherCache[permissionId]
      }
    }

    const rolePerms = roleMatrixState[r] || getInitialMatrix()[r]
    return rolePerms ? Boolean(rolePerms[permissionId]) : false
  },

  /**
   * Sets cached permissions for a teacher in memory
   */
  setTeacherCache: (teacherId: string, permissions: Record<string, boolean>) => {
    teacherPermissionsCache.set(teacherId, permissions)
    notifyListeners()
  },

  /**
   * Fetch per-teacher permission overrides directly from Supabase
   */
  fetchTeacherPermissionsFromSupabase: async (
    collegeId: string,
    teacherId: string
  ): Promise<Record<string, boolean>> => {
    // Start with default teacher baseline
    const baseDefaults: Record<string, boolean> = {}
    PERMISSION_GROUPS.forEach((g) =>
      g.permissions.forEach((p) => {
        baseDefaults[p.id] = p.defaultChecked.teacher
      })
    )

    if (!isSupabaseConfigured || !collegeId || !teacherId) {
      teacherPermissionsCache.set(teacherId, baseDefaults)
      return baseDefaults
    }

    try {
      const { data, error } = await supabase
        .from('permission_overrides')
        .select('*')
        .eq('college_id', collegeId)
        .eq('teacher_id', teacherId)

      if (error) {
        console.error('Failed to fetch teacher permission overrides from Supabase:', error)
        teacherPermissionsCache.set(teacherId, baseDefaults)
        return baseDefaults
      }

      const merged: Record<string, boolean> = { ...baseDefaults }

      if (data && Array.isArray(data)) {
        data.forEach((row: { module: string; action: string; allowed: boolean }) => {
          // Find matching permission ID by module and action
          PERMISSION_GROUPS.forEach((g) => {
            g.permissions.forEach((p) => {
              const { module, action } = splitPermissionId(p.id)
              if (module === row.module && action === row.action) {
                merged[p.id] = Boolean(row.allowed)
              }
            })
          })
        })
      }

      teacherPermissionsCache.set(teacherId, merged)
      notifyListeners()
      return merged
    } catch (err) {
      console.error('Error fetching teacher permissions:', err)
      teacherPermissionsCache.set(teacherId, baseDefaults)
      return baseDefaults
    }
  },

  /**
   * Save per-teacher permission overrides directly to Supabase
   */
  saveTeacherPermissionsToSupabase: async (
    collegeId: string,
    teacherId: string,
    permissions: Record<string, boolean>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!collegeId || !teacherId) {
      return { success: false, error: 'College ID and Teacher ID are required.' }
    }

    // Build payload rows for Supabase permission_overrides table
    const rowsToUpsert: Array<{
      id: string
      college_id: string
      teacher_id: string
      module: string
      action: string
      allowed: boolean
    }> = []

    PERMISSION_GROUPS.forEach((g) => {
      g.permissions.forEach((p) => {
        const { module, action } = splitPermissionId(p.id)
        const isAllowed = Boolean(permissions[p.id])
        const rowId = `perm_ov_${collegeId}_${teacherId}_${module}_${action}`
        rowsToUpsert.push({
          id: rowId,
          college_id: collegeId,
          teacher_id: teacherId,
          module,
          action,
          allowed: isAllowed,
        })
      })
    })

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('permission_overrides')
          .upsert(rowsToUpsert, { onConflict: 'college_id,teacher_id,module,action' })

        if (error) {
          console.error('Failed to save permission overrides to Supabase:', error)
          return { success: false, error: error.message }
        }
      } catch (err: any) {
        console.error('Exception saving permission overrides:', err)
        return { success: false, error: err?.message || 'Failed to save permissions to Supabase' }
      }
    }

    // Update in-memory cache and notify listeners
    teacherPermissionsCache.set(teacherId, permissions)
    notifyListeners()

    return { success: true }
  },

  saveRolePermissions: (role: UserRole, perms: Record<string, boolean>) => {
    if (role === 'super_admin') return
    roleMatrixState = {
      ...roleMatrixState,
      [role]: perms,
    }
    notifyListeners()
  },

  resetRoleDefaults: (role: UserRole) => {
    const initial = getInitialMatrix()[role]
    if (initial) {
      roleMatrixState = {
        ...roleMatrixState,
        [role]: { ...initial },
      }
      notifyListeners()
    }
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx >= 0) listeners.splice(idx, 1)
    }
  },
}

export function usePermissionStore() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const unsubscribe = permissionStore.subscribe(() => {
      setTick((prev) => prev + 1)
    })
    return unsubscribe
  }, [])

  return {
    matrix: permissionStore.getMatrix(),
    getRolePermissions: permissionStore.getRolePermissions,
    hasPermission: permissionStore.hasPermission,
    saveRolePermissions: permissionStore.saveRolePermissions,
    resetRoleDefaults: permissionStore.resetRoleDefaults,
    fetchTeacherPermissionsFromSupabase: permissionStore.fetchTeacherPermissionsFromSupabase,
    saveTeacherPermissionsToSupabase: permissionStore.saveTeacherPermissionsToSupabase,
    setTeacherCache: permissionStore.setTeacherCache,
  }
}

