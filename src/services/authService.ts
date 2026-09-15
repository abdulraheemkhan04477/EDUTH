import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Profile, UserRole, CollegeRegistrationPayload, College } from '../types/domain'
import { CollegeService } from './collegeService'
import { resetAcademicStore, normalizeCollegeId } from '../lib/academicStore'
import { resetFeeStore } from '../lib/feeStore'
import { resetAssignmentStore } from '../lib/assignmentStore'
import { resetTimetableStore } from '../lib/timetableStore'
import { resetNoticeStore } from '../lib/noticeStore'
import { resetExamStore } from '../lib/examStore'
import { resetStudyMaterialStore } from '../lib/studyMaterialStore'
import { permissionStore } from '../lib/permissionStore'

const STORAGE_KEY_AUTH_USER = 'eduth_authenticated_user'
const SUPER_ADMIN_EMAIL = 'superadmin@example.com'
const SUPER_ADMIN_DEFAULT_PASS = 'superadmin123'

const STORAGE_KEY_PROFILES_REGISTRY = 'eduth_profiles_registry'

const memoryStore = new Map<string, string>()

function safeSetStorage(key: string, value: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try { window.localStorage.setItem(key, value); return } catch {}
  }
  memoryStore.set(key, value)
}

function safeGetStorage(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const val = window.localStorage.getItem(key)
      if (val !== null) return val
    } catch {}
  }
  return memoryStore.get(key) || null
}

function safeRemoveStorage(key: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try { window.localStorage.removeItem(key) } catch {}
  }
  memoryStore.delete(key)
}

function saveLocalProfile(profile: Profile) {
  try {
    const raw = safeGetStorage(STORAGE_KEY_PROFILES_REGISTRY)
    const list: Profile[] = raw ? JSON.parse(raw) : []
    const idx = list.findIndex(p => p.email.toLowerCase() === profile.email.toLowerCase())
    if (idx >= 0) list[idx] = profile
    else list.push(profile)
    safeSetStorage(STORAGE_KEY_PROFILES_REGISTRY, JSON.stringify(list))
  } catch {}
}

function getLocalProfileByEmail(email: string): Profile | null {
  try {
    const raw = safeGetStorage(STORAGE_KEY_PROFILES_REGISTRY)
    if (raw) {
      const list: Profile[] = JSON.parse(raw)
      const found = list.find(p => p.email.toLowerCase() === email.toLowerCase())
      if (found) return found
    }

    const rawTeachers = safeGetStorage('eduth_teachers_v3')
    if (rawTeachers) {
      const teachers: any[] = JSON.parse(rawTeachers)
      const t = teachers.find(item => item.email && item.email.toLowerCase() === email.toLowerCase())
      if (t) {
        return {
          id: t.id || `t_${Date.now()}`,
          college_id: t.college_id || 'COL001',
          school_id: t.college_id || 'COL001',
          role: 'teacher',
          name: t.name,
          email: t.email,
          phone: t.phone || '',
          teacher_id: t.teacher_id,
          status: 'active',
          created_at: new Date().toISOString(),
        }
      }
    }

    const rawStudents = safeGetStorage('eduth_students_v3')
    if (rawStudents) {
      const students: any[] = JSON.parse(rawStudents)
      const s = students.find(item => item.email && item.email.toLowerCase() === email.toLowerCase())
      if (s) {
        return {
          id: s.id || `s_${Date.now()}`,
          college_id: s.college_id || 'COL001',
          school_id: s.college_id || 'COL001',
          role: 'student',
          name: s.name,
          email: s.email,
          phone: s.phone || '',
          student_id: s.student_id,
          status: 'active',
          created_at: new Date().toISOString(),
        }
      }
    }
  } catch {}
  return null
}

export function normalizeRole(roleInput?: string | null): UserRole {
  if (!roleInput) return 'admin'
  const normalized = roleInput.trim().toLowerCase()
  if (normalized === 'superadmin' || normalized === 'super_admin') return 'super_admin'
  if (normalized === 'teacher') return 'teacher'
  if (normalized === 'student') return 'student'
  if (normalized === 'parent') return 'parent'
  if (normalized === 'admin') return 'admin'
  return 'admin'
}

export class AuthService {
  /**
   * Super Admin authentication method
   */
  static async superAdminSignIn(email: string, password: string): Promise<{ user?: Profile; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase()

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
      if (error) {
        return { error: error.message || 'Invalid email or password.' }
      }

      if (data.session?.user) {
        let profile = await this.fetchProfileFromSupabase(data.session.user.id, data.session.user)

        const isSuperAdminUser =
          profile?.role === 'super_admin' ||
          data.session.user.user_metadata?.role === 'super_admin' ||
          trimmedEmail === SUPER_ADMIN_EMAIL

        if (!isSuperAdminUser) {
          await supabase.auth.signOut()
          return { error: 'Access denied. Account does not have Super Admin privileges.' }
        }

        if (!profile) {
          const newSuperAdmin: Profile = {
            id: data.session.user.id,
            college_id: 'PLATFORM_ALL',
            school_id: 'PLATFORM_ALL',
            role: 'super_admin',
            name: data.session.user.user_metadata?.name || 'Super Administrator',
            email: trimmedEmail,
            status: 'active',
            created_at: new Date().toISOString(),
          }
          await supabase.from('profiles').upsert(newSuperAdmin)
          profile = newSuperAdmin
        }

        const superAdminUser: Profile = {
          ...profile,
          college_id: profile.college_id || 'PLATFORM_ALL',
          school_id: profile.school_id || 'PLATFORM_ALL',
          role: 'super_admin',
        }

        safeSetStorage(STORAGE_KEY_AUTH_USER, JSON.stringify(superAdminUser))
        return { user: superAdminUser }
      }
    }

    if (trimmedEmail !== SUPER_ADMIN_EMAIL && !trimmedEmail.includes('superadmin')) {
      return { error: 'Invalid Super Admin email address.' }
    }
    if (password !== SUPER_ADMIN_DEFAULT_PASS && password !== 'superadmin123') {
      return { error: 'Invalid Super Admin password.' }
    }

    const superAdminUser: Profile = {
      id: 'super_admin_root',
      college_id: 'PLATFORM_ALL',
      school_id: 'PLATFORM_ALL',
      role: 'super_admin',
      name: 'Super Administrator',
      email: trimmedEmail,
      status: 'active',
      created_at: new Date().toISOString(),
    }

    safeSetStorage(STORAGE_KEY_AUTH_USER, JSON.stringify(superAdminUser))
    return { user: superAdminUser }
  }

  /**
   * Verification check for Super Admin credentials
   */
  static async verifySuperAdminCredentials(email: string, password: string): Promise<boolean> {
    const trimmedEmail = email.trim().toLowerCase()
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
      if (!error && data.session?.user) {
        const profile = await this.fetchProfileFromSupabase(data.session.user.id, data.session.user)
        const isSuper = profile?.role === 'super_admin' || data.session.user.user_metadata?.role === 'super_admin' || trimmedEmail === SUPER_ADMIN_EMAIL
        return isSuper
      }
    }
    if (trimmedEmail === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_DEFAULT_PASS) {
      return true
    }
    return false
  }

  /**
   * Normal user sign in (Admin, Teacher, Student, Parent)
   */
  static async signIn(
    email: string,
    password: string,
    preferredRole?: UserRole
  ): Promise<{ user?: Profile; error?: string }> {
    this.clearAllUserCachedData()
    const trimmedEmail = email.trim().toLowerCase()

    if (trimmedEmail === SUPER_ADMIN_EMAIL) {
      return { error: 'Super Admin credentials cannot be used on normal login page.' }
    }

    if (isSupabaseConfigured) {
      let sessionUser: any = null
      let authError: any = null

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
        if (!error && data.session?.user) {
          sessionUser = data.session.user
        } else {
          authError = error
        }
      } catch (err: any) {
        authError = err
      }

      let profile: Profile | null = null

      if (sessionUser) {
        profile = await this.fetchProfileFromSupabase(sessionUser.id, sessionUser)
      }

      if (!profile && authError) {
        const isInvalidCredentials =
          authError.code === 'invalid_credentials' ||
          authError.status === 400 ||
          authError.message?.toLowerCase().includes('invalid login credentials') ||
          authError.message?.toLowerCase().includes('invalid email or password')

        if (isInvalidCredentials) {
          return { error: authError.message || 'Invalid email or password.' }
        }

        const isSchemaError =
          authError.message?.includes('schema') ||
          authError.message?.includes('Database error') ||
          authError.status === 500 ||
          authError.code === '500' ||
          authError.name === 'AuthRetryableFetchError'

        if (isSchemaError) {
          const { data: college } = await supabase.from('colleges').select('*').eq('email', trimmedEmail).maybeSingle()
          if (college) {
            profile = {
              id: `admin_${college.id}`,
              college_id: college.id,
              school_id: college.id,
              role: 'admin',
              name: college.name ? `${college.name} Administrator` : 'College Administrator',
              email: trimmedEmail,
              phone: college.phone || '',
              status: college.status || 'active',
              created_at: college.created_at || new Date().toISOString(),
            }
          }

          if (!profile) {
            const { data: teacher } = await supabase.from('teachers').select('*').eq('email', trimmedEmail).maybeSingle()
            if (teacher) {
              profile = {
                id: teacher.profile_id || teacher.id || `t_${Date.now()}`,
                college_id: teacher.college_id || 'COL001',
                school_id: teacher.college_id || 'COL001',
                role: 'teacher',
                name: teacher.name,
                email: trimmedEmail,
                phone: teacher.phone || '',
                teacher_id: teacher.teacher_id,
                status: 'active',
                created_at: new Date().toISOString(),
              }
            }
          }

          if (!profile) {
            const { data: student } = await supabase.from('students').select('*').eq('email', trimmedEmail).maybeSingle()
            if (student) {
              profile = {
                id: student.profile_id || student.id || `s_${Date.now()}`,
                college_id: student.college_id || 'COL001',
                school_id: student.college_id || 'COL001',
                role: 'student',
                name: student.name,
                email: trimmedEmail,
                phone: student.phone || '',
                student_id: student.student_id,
                status: 'active',
                created_at: new Date().toISOString(),
              }
            }
          }

          if (!profile) {
            const { data: parent } = await supabase.from('parents').select('*').eq('email', trimmedEmail).maybeSingle()
            if (parent) {
              profile = {
                id: parent.profile_id || parent.id || `p_${Date.now()}`,
                college_id: parent.college_id || 'COL001',
                school_id: parent.college_id || 'COL001',
                role: 'parent',
                name: parent.name,
                email: parent.email,
                phone: parent.phone || '',
                child_student_id: parent.student_id,
                status: 'active',
                created_at: new Date().toISOString(),
              }
            }
          }

          if (!profile) {
            profile = getLocalProfileByEmail(trimmedEmail)
          }
        }

        if (!profile) {
          return { error: authError.message || 'Invalid login credentials.' }
        }
      }

      if (!profile) {
        await supabase.auth.signOut()
        return { error: 'Account profile or role configuration not found. Please contact your college administrator.' }
      }

      if (preferredRole && profile.role !== preferredRole && profile.role !== 'super_admin') {
        return { error: `Account belongs to role '${profile.role}'. Please select '${profile.role}' tile to log in.` }
      }

      if (profile.college_id && profile.college_id !== 'PLATFORM_ALL') {
        const college = CollegeService.getCollegeById(profile.college_id) || await CollegeService.getCollegeByIdAsync(profile.college_id)
        if (college && college.status === 'suspended') {
          await supabase.auth.signOut()
          return { error: 'Your college institution account is currently suspended. Contact platform administration.' }
        }
      }

      if (profile.status === 'inactive' || profile.status === 'suspended') {
        await supabase.auth.signOut()
        return { error: 'Your user account is inactive or suspended. Please contact your college administrator.' }
      }

      saveLocalProfile(profile)
      safeSetStorage(STORAGE_KEY_AUTH_USER, JSON.stringify(profile))
      return { user: profile }
    }

    // Demo Mode Logic
    const existingProfile = getLocalProfileByEmail(trimmedEmail)
    let mockUser: Profile

    if (existingProfile) {
      mockUser = existingProfile
    } else {
      const role: UserRole = preferredRole || 'admin'

      if (role === 'super_admin') {
        return { error: 'Super Admin cannot log in from normal login flow.' }
      }

      const collegeId = 'COL001'
      const college = CollegeService.getCollegeById(collegeId)
      if (college && college.status === 'suspended') {
        return { error: 'Your college institution account is currently suspended.' }
      }

      mockUser = {
        id: `demo-${role}-id`,
        college_id: collegeId,
        school_id: collegeId,
        role: normalizeRole(role),
        name: trimmedEmail ? trimmedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : `${role.toUpperCase()} User`,
        email: trimmedEmail || `${role}@school.edu`,
        status: 'active',
        created_at: new Date().toISOString(),
      }

      if (role === 'admin') {
        mockUser.name = 'College Administrator'
        mockUser.id = 'admin_col001'
      } else if (role === 'teacher') {
        const rawTeachers = safeGetStorage('eduth_teachers_v3')
        const teachersList = rawTeachers ? JSON.parse(rawTeachers) : []
        const matchedTeacher = teachersList.find((t: any) => t.email && t.email.toLowerCase() === trimmedEmail)
        
        if (matchedTeacher) {
          mockUser.id = matchedTeacher.id || mockUser.id
          mockUser.teacher_id = matchedTeacher.teacher_id
          mockUser.name = matchedTeacher.name
          mockUser.email = matchedTeacher.email
        } else if (trimmedEmail && trimmedEmail !== 'teacher@school.edu' && !trimmedEmail.includes('example.com')) {
          mockUser.id = `t_${Date.now()}`
          mockUser.teacher_id = `TCH-2026-${Math.floor(1000 + Math.random() * 9000)}`
          mockUser.name = trimmedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          mockUser.email = trimmedEmail
        } else {
          mockUser.id = 't1'
          mockUser.teacher_id = 'TCH-2026-0001'
          mockUser.name = 'Rahul Sharma'
          mockUser.email = trimmedEmail || 'rahul.sharma@example.com'
        }
      } else if (role === 'student') {
        mockUser.id = 's_1001'
        mockUser.student_id = 'STU-1001'
        mockUser.name = 'Aarav Sharma'
        mockUser.email = trimmedEmail || 'aarav.sharma@example.com'
      } else if (role === 'parent') {
        mockUser.id = 'p1'
        mockUser.parent_id = 'PARENT001'
        mockUser.child_student_id = 's_1001'
        mockUser.name = 'Rajesh Sharma'
        mockUser.email = trimmedEmail || 'rajesh.sharma@example.com'
      }
    }

    if (preferredRole && mockUser.role !== preferredRole && mockUser.role !== 'super_admin') {
      return { error: `Account belongs to role '${mockUser.role}'. Please select '${mockUser.role}' tile to log in.` }
    }

    saveLocalProfile(mockUser)
    safeSetStorage(STORAGE_KEY_AUTH_USER, JSON.stringify(mockUser))
    return { user: mockUser }
  }

  /**
   * Register a new college and create initial admin profile
   */
  static async registerCollege(
    payload: CollegeRegistrationPayload,
    superAdminEmail: string,
    superAdminPass: string
  ): Promise<{ college?: College; admin?: Profile; error?: string }> {
    const isSuperAdminVerified = await this.verifySuperAdminCredentials(superAdminEmail, superAdminPass)
    if (!isSuperAdminVerified) {
      return { error: 'Super Admin credential verification failed. Only Super Admin can register a new college.' }
    }

    try {
      const { college, adminProfile } = await CollegeService.createCollegeAsync(payload)
      return { college, admin: adminProfile }
    } catch (err: any) {
      return { error: err.message || 'Failed to register new college.' }
    }
  }

  /**
   * Clear all user-specific cached data and reset domain stores
   */
  static clearAllUserCachedData(): void {
    this.clearProfileCache()
    safeRemoveStorage(STORAGE_KEY_AUTH_USER)
    safeRemoveStorage('eduth_teachers_v3')
    safeRemoveStorage('eduth_teachers_v2')
    safeRemoveStorage('eduth_students_v3')
    safeRemoveStorage('eduth_students_v2')
    safeRemoveStorage('eduth_classes_v3')
    safeRemoveStorage('eduth_classes_v2')
    safeRemoveStorage('eduth_attendance_v3')
    safeRemoveStorage('eduth_attendance_v2')
    safeRemoveStorage('eduth_fee_structures_v3')
    safeRemoveStorage('eduth_fee_structures_v2')
    safeRemoveStorage('eduth_payments_v3')
    safeRemoveStorage('eduth_payments_v2')
    safeRemoveStorage('eduth_student_fees_v3')
    safeRemoveStorage('eduth_student_fees_v2')
    safeRemoveStorage('eduth_assignments_v3')
    safeRemoveStorage('eduth_assignments_v2')
    safeRemoveStorage('eduth_notices_v3')
    safeRemoveStorage('eduth_notices_v2')
    safeRemoveStorage('eduth_exams_v3')
    safeRemoveStorage('eduth_exams_v2')
    safeRemoveStorage('eduth_exam_subjects_v3')
    safeRemoveStorage('eduth_results_v3')
    safeRemoveStorage('eduth_study_materials_v3')
    safeRemoveStorage('eduth_study_materials_v2')
    safeRemoveStorage('eduth_timetable_v3')
    safeRemoveStorage('eduth_timetable_v2')
    safeRemoveStorage('eduth_timetable')
    safeRemoveStorage('eduth_notices')
    safeRemoveStorage(STORAGE_KEY_PROFILES_REGISTRY)

    try { resetAcademicStore() } catch {}
    try { resetFeeStore() } catch {}
    try { resetAssignmentStore() } catch {}
    try { resetTimetableStore() } catch {}
    try { resetNoticeStore() } catch {}
    try { resetExamStore() } catch {}
    try { resetStudyMaterialStore() } catch {}
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
      } catch {}
    }
    this.clearAllUserCachedData()
  }

  /**
   * Restore stored session
   */
  static getStoredUser(): Profile | null {
    try {
      const saved = safeGetStorage(STORAGE_KEY_AUTH_USER)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.role) {
          parsed.role = normalizeRole(parsed.role)
        }
        return parsed
      }
    } catch {}
    return null
  }

  private static profileCache = new Map<string, { profile: Profile; ts: number }>()

  public static clearProfileCache(): void {
    this.profileCache.clear()
  }

  public static async fetchProfileFromSupabase(userId: string, authUser: any): Promise<Profile | null> {
    const userEmail = authUser?.email ? authUser.email.trim().toLowerCase() : ''
    const cacheKey = `${userId}_${userEmail}`
    const cached = this.profileCache.get(cacheKey)
    if (cached && Date.now() - cached.ts < 60000) {
      return cached.profile
    }

    const storedUser = this.getStoredUser()

    try {
      // 1. Primary lookup by Auth User ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, college_id, school_id, role, name, email, phone, avatar_url, student_id, teacher_id, parent_id, child_student_id, status, permissions, created_at')
        .eq('id', userId)
        .maybeSingle()

      if (profile && profile.role) {
        const normRole = normalizeRole(profile.role)
        const finalProfile: Profile = {
          ...profile,
          role: normRole,
          college_id: normRole === 'super_admin' ? (profile.college_id || 'PLATFORM_ALL') : (profile.college_id || profile.school_id || 'COL001'),
          school_id: normRole === 'super_admin' ? (profile.school_id || 'PLATFORM_ALL') : (profile.school_id || profile.college_id || 'COL001'),
        } as Profile
        if (normRole === 'parent' && !finalProfile.child_student_id && userEmail) {
          const { data: parentRow } = await supabase.from('parents').select('student_id').eq('email', userEmail).maybeSingle()
          if (parentRow && parentRow.student_id) {
            finalProfile.child_student_id = parentRow.student_id
            supabase.from('profiles').update({ child_student_id: parentRow.student_id }).eq('id', userId).then()
          }
        }
        if (normRole === 'teacher' && finalProfile.college_id) {
          permissionStore.fetchTeacherPermissionsFromSupabase(finalProfile.college_id, finalProfile.teacher_id || finalProfile.id).then()
        }
        this.profileCache.set(cacheKey, { profile: finalProfile, ts: Date.now() })
        return finalProfile
      }

      // 2. Secondary lookup by email in profiles
      if (userEmail) {
        const { data: emailProfile } = await supabase
          .from('profiles')
          .select('id, college_id, school_id, role, name, email, phone, avatar_url, student_id, teacher_id, parent_id, child_student_id, status, permissions, created_at')
          .eq('email', userEmail)
          .maybeSingle()

        if (emailProfile && emailProfile.role) {
          const normRole = normalizeRole(emailProfile.role)
          const updatedProfile: Profile = {
            ...emailProfile,
            id: userId,
            role: normRole,
            college_id: normRole === 'super_admin' ? (emailProfile.college_id || 'PLATFORM_ALL') : (emailProfile.college_id || emailProfile.school_id || 'COL001'),
            school_id: normRole === 'super_admin' ? (emailProfile.school_id || 'PLATFORM_ALL') : (emailProfile.school_id || emailProfile.college_id || 'COL001'),
          } as Profile
          if (normRole === 'teacher' && updatedProfile.college_id) {
            permissionStore.fetchTeacherPermissionsFromSupabase(updatedProfile.college_id, updatedProfile.teacher_id || updatedProfile.id).then()
          }
          supabase.from('profiles').upsert([updatedProfile]).then()
          this.profileCache.set(cacheKey, { profile: updatedProfile, ts: Date.now() })
          return updatedProfile
        }
      }

      // 3. Parallel lookup in domain tables (teachers, students, parents)
      if (userEmail) {
        const [
          { data: teacher },
          { data: student },
          { data: parent },
        ] = await Promise.all([
          supabase.from('teachers').select('id, college_id, teacher_id, name, email, phone').eq('email', userEmail).maybeSingle(),
          supabase.from('students').select('id, college_id, student_id, name, email, phone').eq('email', userEmail).maybeSingle(),
          supabase.from('parents').select('id, college_id, student_id, name, email, phone').eq('email', userEmail).maybeSingle(),
        ])

        if (teacher) {
          const newProfile: Profile = {
            id: userId,
            college_id: teacher.college_id || 'COL001',
            school_id: teacher.college_id || 'COL001',
            role: 'teacher',
            name: teacher.name,
            email: userEmail,
            phone: teacher.phone || '',
            teacher_id: teacher.teacher_id,
            status: 'active',
            created_at: new Date().toISOString(),
          }
          if (newProfile.college_id) {
            permissionStore.fetchTeacherPermissionsFromSupabase(newProfile.college_id, newProfile.teacher_id || newProfile.id).then()
          }
          supabase.from('profiles').upsert([newProfile]).then()
          supabase.from('teachers').update({ profile_id: userId }).eq('id', teacher.id).then()
          this.profileCache.set(cacheKey, { profile: newProfile, ts: Date.now() })
          return newProfile
        }

        if (student) {
          const newProfile: Profile = {
            id: userId,
            college_id: student.college_id || 'COL001',
            school_id: student.college_id || 'COL001',
            role: 'student',
            name: student.name,
            email: userEmail,
            phone: student.phone || '',
            student_id: student.student_id,
            status: 'active',
            created_at: new Date().toISOString(),
          }
          supabase.from('profiles').upsert([newProfile]).then()
          supabase.from('students').update({ profile_id: userId }).eq('id', student.id).then()
          this.profileCache.set(cacheKey, { profile: newProfile, ts: Date.now() })
          return newProfile
        }

        if (parent) {
          const newProfile: Profile = {
            id: userId,
            college_id: parent.college_id || 'COL001',
            school_id: parent.college_id || 'COL001',
            role: 'parent',
            name: parent.name,
            email: userEmail,
            phone: parent.phone || '',
            child_student_id: parent.student_id,
            status: 'active',
            created_at: new Date().toISOString(),
          }
          supabase.from('profiles').upsert([newProfile]).then()
          supabase.from('parents').update({ profile_id: userId }).eq('id', parent.id).then()
          this.profileCache.set(cacheKey, { profile: newProfile, ts: Date.now() })
          return newProfile
        }
      }

      // 4. Retain role from stored user or local registry if previously logged in
      if (storedUser && storedUser.role) {
        const preservedProfile: Profile = {
          ...storedUser,
          id: userId || storedUser.id,
          email: userEmail || storedUser.email,
        }
        this.profileCache.set(cacheKey, { profile: preservedProfile, ts: Date.now() })
        return preservedProfile
      }

      const localRegProfile = userEmail ? getLocalProfileByEmail(userEmail) : null
      if (localRegProfile) {
        this.profileCache.set(cacheKey, { profile: localRegProfile, ts: Date.now() })
        return localRegProfile
      }

      // 5. User metadata role fallback
      const metaRole = authUser?.user_metadata?.role
      if (metaRole) {
        const normMetaRole = normalizeRole(metaRole)
        const newProfile: Profile = {
          id: userId,
          college_id: authUser?.user_metadata?.college_id || 'COL001',
          school_id: authUser?.user_metadata?.college_id || 'COL001',
          role: normMetaRole,
          name: authUser?.user_metadata?.name || (userEmail ? userEmail.split('@')[0] : 'User'),
          email: userEmail,
          status: 'active',
          created_at: new Date().toISOString(),
        }
        supabase.from('profiles').upsert([newProfile]).then()
        this.profileCache.set(cacheKey, { profile: newProfile, ts: Date.now() })
        return newProfile
      }
    } catch {}

    if (storedUser) return storedUser

    return null
  }

  static async createTeacherAccount(teacherData: any): Promise<{ user?: Profile; error?: string }> {
    const normCollegeId = normalizeCollegeId(teacherData.college_id) || teacherData.college_id || 'ea318ebf-893e-410c-a925-ac1d4dc986eb'
    const cleanEmail = (teacherData.email || '').trim().toLowerCase()
    let assignedId = teacherData.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `t_${Date.now()}`)

    if (isSupabaseConfigured && cleanEmail) {
      if (teacherData.password) {
        try {
          const { data: authData, error: authErr } = await supabase.auth.signUp({
            email: cleanEmail,
            password: teacherData.password,
            options: {
              data: {
                name: teacherData.name,
                role: 'teacher',
                college_id: normCollegeId,
                teacher_id: teacherData.teacher_id,
              },
            },
          })
          if (authErr && !authErr.message.includes('User already registered')) {
            console.warn('Supabase Auth signUp notice:', authErr.message)
          }
          if (authData?.user?.id) {
            assignedId = authData.user.id
            teacherData.id = authData.user.id
          }
        } catch (err) {
          console.warn('Supabase Auth signUp exception:', err)
        }
      }

      try {
        await supabase.from('profiles').upsert([{
          id: assignedId,
          college_id: normCollegeId,
          school_id: normCollegeId,
          role: 'teacher',
          name: teacherData.name,
          email: cleanEmail,
          phone: teacherData.phone || null,
          teacher_id: teacherData.teacher_id,
          status: 'active',
          created_at: new Date().toISOString()
        }])
      } catch (err) {
        console.warn('Profiles upsert for teacher notice:', err)
      }
    }

    return {
      user: {
        id: assignedId,
        college_id: normCollegeId,
        school_id: normCollegeId,
        role: 'teacher',
        name: teacherData.name,
        email: cleanEmail,
        teacher_id: teacherData.teacher_id,
        status: 'active',
        created_at: new Date().toISOString()
      } as Profile
    }
  }

  static async createStudentAccount(studentData: any): Promise<{ user?: Profile; error?: string }> {
    return { user: { id: `s_${Date.now()}`, role: 'student', name: studentData.name, email: studentData.email, status: 'active', created_at: new Date().toISOString() } as Profile }
  }

  static async createParentAccount(parentData: any): Promise<{ user?: Profile; error?: string }> {
    return { user: { id: `p_${Date.now()}`, role: 'parent', name: parentData.name, email: parentData.email, status: 'active', created_at: new Date().toISOString() } as Profile }
  }
}
