import type { Profile, UserRole } from '../types/domain'
import { permissionStore } from '../lib/permissionStore'

/**
 * Checks if a user profile has a specific permission.
 */
export function hasPermission(user: Profile | null, permissionId: string): boolean {
  if (!user) return false
  if (user.role === 'super_admin' || user.role === 'admin') return true

  const teacherId = user.teacher_id || user.id
  return permissionStore.hasPermission(user.role, permissionId, teacherId)
}

/**
 * Checks if a user's role matches any of the allowed roles.
 */
export function hasRole(user: Profile | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false
  if (user.role === 'super_admin') return true
  return allowedRoles.includes(user.role)
}

/**
 * Enforces college isolation: Returns true if the user is authorized to access data for targetCollegeId.
 */
export function canAccessCollege(user: Profile | null, targetCollegeId: string): boolean {
  if (!user) return false
  if (user.role === 'super_admin') return true
  const userCollege = user.college_id || user.school_id
  return userCollege === targetCollegeId
}

/**
 * Enforces teacher student access scoping:
 * Teacher can only access students belonging to their assigned classes.
 */
export function canTeacherAccessStudent(
  teacherUser: Profile | null,
  studentClassId: string,
  teacherAssignedClasses: string[]
): boolean {
  if (!teacherUser) return false
  if (teacherUser.role === 'admin' || teacherUser.role === 'super_admin') return true
  if (teacherUser.role !== 'teacher') return false

  return teacherAssignedClasses.includes(studentClassId)
}

/**
 * Enforces student own-data access scoping:
 * Student can only access their own profile/records.
 */
export function canStudentAccessRecord(
  studentUser: Profile | null,
  targetStudentId: string
): boolean {
  if (!studentUser) return false
  if (studentUser.role === 'admin' || studentUser.role === 'super_admin') return true
  if (studentUser.role !== 'student') return false

  return studentUser.student_id === targetStudentId || studentUser.id === targetStudentId
}

/**
 * Enforces parent child-data access scoping:
 * Parent can only access linked child records.
 */
export function canParentAccessStudent(
  parentUser: Profile | null,
  targetStudentId: string
): boolean {
  if (!parentUser) return false
  if (parentUser.role === 'admin' || parentUser.role === 'super_admin') return true
  if (parentUser.role !== 'parent') return false

  return parentUser.child_student_id === targetStudentId || parentUser.id === targetStudentId
}
