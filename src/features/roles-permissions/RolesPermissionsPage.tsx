import { useState, useEffect, useCallback, useMemo } from 'react'
import { Tabs, Button, SearchInput, Select } from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import { Shield, Save, RotateCcw, CheckSquare, XSquare, UserCheck, User, Sparkles, Filter, GraduationCap } from 'lucide-react'
import {
  PERMISSION_GROUPS,
  PRESET_TEMPLATES,
  permissionStore,
  usePermissionStore,
  type PresetTemplate,
} from '../../lib/permissionStore'
import type { UserRole } from '../../types/domain'
import { useAuth } from '../../app/providers/AuthProvider'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAcademicStore, isBranchMatch } from '../../lib/academicStore'

interface FacultyOption {
  id: string
  teacher_id: string
  name: string
  email: string
  department: string
  course: string
  position: string
}

interface StudentOption {
  id: string
  student_id: string
  roll_no: string
  name: string
  email: string
  course: string
  branch: string
  year: string
  semester: string
  section: string
}

function isValidUuid(id?: string | null): boolean {
  if (!id) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

export function RolesPermissionsPage() {
  const { user } = useAuth()
  const rawCollegeId = user?.college_id || user?.school_id
  const collegeId = isValidUuid(rawCollegeId) ? rawCollegeId! : '13695a78-0105-4bde-bc85-d664bb66637e'

  const { courses, branchesByCourse, years, students: storeStudents } = useAcademicStore()

  // STRICT 3 ROLES ONLY
  const [activeRole, setActiveRole] = useState<'admin' | 'teacher' | 'student'>('teacher')
  
  // FILTER BAR STATE — STRICTLY SEARCH + COURSE + BRANCH + YEAR
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState<string>('')
  const [branchFilter, setBranchFilter] = useState<string>('')
  const [yearFilter, setYearFilter] = useState<string>('')

  // Faculty and Student states
  const [teachers, setTeachers] = useState<FacultyOption[]>([])
  const [supabaseStudents, setSupabaseStudents] = useState<StudentOption[]>([])

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('')
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')

  const [isFetchingTeachers, setIsFetchingTeachers] = useState(false)
  const [isFetchingStudents, setIsFetchingStudents] = useState(false)
  const [isFetchingPerms, setIsFetchingPerms] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { toast } = useToast()
  const { matrix } = usePermissionStore()

  // State for active user overrides (teacher / student) or role baseline matrix
  const [userOverrideStates, setUserOverrideStates] = useState<Record<string, boolean>>({})
  const [roleStates, setRoleStates] = useState<Record<UserRole, Record<string, boolean>>>(matrix)

  // Fetch real teachers from Supabase for current college
  useEffect(() => {
    let isMounted = true
    const loadTeachers = async () => {
      if (!isSupabaseConfigured) return
      setIsFetchingTeachers(true)

      try {
        let query = supabase
          .from('teachers')
          .select('*')
        if (collegeId && collegeId !== 'PLATFORM_ALL') {
          query = query.eq('college_id', collegeId)
        }

        const { data, error } = await query

        if (!error && data && isMounted) {
          const mapped: FacultyOption[] = data.map((t: any) => ({
            id: t.id,
            teacher_id: t.teacher_id || t.id,
            name: t.name || 'Unnamed Faculty',
            email: t.email || '',
            department: t.department || t.course || 'Faculty',
            course: t.course || 'B.Tech',
            position: t.position || 'Lecturer',
          }))
          setTeachers(mapped)
          if (mapped.length > 0 && !selectedTeacherId) {
            setSelectedTeacherId(mapped[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load teachers for permission management:', err)
      } finally {
        if (isMounted) setIsFetchingTeachers(false)
      }
    }

    loadTeachers()

    return () => {
      isMounted = false
    }
  }, [collegeId])

  // Fetch real students from Supabase for current college
  useEffect(() => {
    let isMounted = true
    const loadStudents = async () => {
      if (!isSupabaseConfigured) return
      setIsFetchingStudents(true)

      try {
        let query = supabase
          .from('students')
          .select('*')
        if (collegeId && collegeId !== 'PLATFORM_ALL') {
          query = query.eq('college_id', collegeId)
        }

        const { data, error } = await query

        if (!error && data && isMounted) {
          const mapped: StudentOption[] = data.map((s: any) => ({
            id: s.id,
            student_id: s.student_id || s.roll_no || s.id,
            roll_no: s.roll_no || '1001',
            name: s.name || 'Unnamed Student',
            email: s.email || '',
            course: s.course || 'B.Tech',
            branch: s.branch || 'ECE',
            year: s.year || '1st Year',
            semester: s.semester || 'Semester 1',
            section: s.section || 'Section A',
          }))
          setSupabaseStudents(mapped)
          if (mapped.length > 0 && !selectedStudentId) {
            setSelectedStudentId(mapped[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load students for permission management:', err)
      } finally {
        if (isMounted) setIsFetchingStudents(false)
      }
    }

    loadStudents()

    return () => {
      isMounted = false
    }
  }, [collegeId])

  // Combine store students with Supabase students as fallback
  const allStudentsList = useMemo(() => {
    if (supabaseStudents.length > 0) return supabaseStudents
    return storeStudents.map((s) => ({
      id: s.id,
      student_id: s.student_id || s.roll_no || s.id,
      roll_no: s.roll_no || '1001',
      name: s.name || 'Unnamed Student',
      email: s.email || '',
      course: s.course || 'B.Tech',
      branch: s.branch || 'ECE',
      year: s.year || '1st Year',
      semester: s.semester || 'Semester 1',
      section: s.section || 'Section A',
    }))
  }, [supabaseStudents, storeStudents])

  // Dynamic branch options for filter based on selected Course
  const availableBranches = useMemo(() => {
    if (courseFilter && branchesByCourse[courseFilter]) {
      return branchesByCourse[courseFilter]
    }
    const all = Object.values(branchesByCourse).flat()
    return Array.from(new Set(all))
  }, [courseFilter, branchesByCourse])

  // Filtered Teachers List based on Search, Course, Branch, Year
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = search.trim().toLowerCase()
      if (
        q &&
        !t.name.toLowerCase().includes(q) &&
        !t.email.toLowerCase().includes(q) &&
        !t.teacher_id.toLowerCase().includes(q) &&
        !t.department.toLowerCase().includes(q)
      ) {
        return false
      }
      if (courseFilter && t.course.toLowerCase() !== courseFilter.toLowerCase() && !t.department.toLowerCase().includes(courseFilter.toLowerCase())) return false
      if (
        branchFilter &&
        !t.department.toLowerCase().includes(branchFilter.toLowerCase()) &&
        !t.course.toLowerCase().includes(branchFilter.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [teachers, search, courseFilter, branchFilter])

  // Filtered Students List based on Search, Course, Branch, Year (Working EXACTLY like Teacher tab)
  const filteredStudents = useMemo(() => {
    return allStudentsList.filter((s) => {
      const q = search.trim().toLowerCase()
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.email.toLowerCase().includes(q) &&
        !s.student_id.toLowerCase().includes(q) &&
        !s.roll_no.toLowerCase().includes(q)
      ) {
        return false
      }
      if (courseFilter && s.course.toLowerCase() !== courseFilter.toLowerCase()) return false
      if (branchFilter && !isBranchMatch(s.branch, branchFilter)) return false
      if (yearFilter && yearFilter !== 'All Years' && s.year.toLowerCase() !== yearFilter.toLowerCase()) return false
      return true
    })
  }, [allStudentsList, search, courseFilter, branchFilter, yearFilter])

  // Update selected IDs if filtered lists change and current selection is out of filter bounds
  useEffect(() => {
    if (activeRole === 'teacher' && filteredTeachers.length > 0) {
      const exists = filteredTeachers.some((t) => t.id === selectedTeacherId || t.teacher_id === selectedTeacherId)
      if (!exists) {
        setSelectedTeacherId(filteredTeachers[0].id)
      }
    }
  }, [activeRole, filteredTeachers, selectedTeacherId])

  useEffect(() => {
    if (activeRole === 'student' && filteredStudents.length > 0) {
      const exists = filteredStudents.some((s) => s.id === selectedStudentId || s.student_id === selectedStudentId)
      if (!exists) {
        setSelectedStudentId(filteredStudents[0].id)
      }
    }
  }, [activeRole, filteredStudents, selectedStudentId])

  // Currently selected Teacher object
  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId || t.teacher_id === selectedTeacherId)
  // Currently selected Student object
  const selectedStudent = allStudentsList.find((s) => s.id === selectedStudentId || s.student_id === selectedStudentId)

  // Load user permissions from Supabase
  const loadUserPermissions = useCallback(async (uId: string) => {
    if (!uId) return
    setIsFetchingPerms(true)
    const primaryId = uId

    const loaded = await permissionStore.fetchTeacherPermissionsFromSupabase(collegeId, primaryId)
    setUserOverrideStates(loaded)
    setIsFetchingPerms(false)
  }, [collegeId])

  useEffect(() => {
    if (activeRole === 'teacher' && selectedTeacherId) {
      loadUserPermissions(selectedTeacherId)
    } else if (activeRole === 'student' && selectedStudentId) {
      loadUserPermissions(selectedStudentId)
    }
  }, [activeRole, selectedTeacherId, selectedStudentId, loadUserPermissions])

  // STRICTLY 3 ROLES FOR ROLE & PERMISSION SECTION
  const roleTabs = [
    { id: 'teacher', label: 'Teacher' },
    { id: 'admin', label: 'Admin' },
    { id: 'student', label: 'Student' },
  ]

  const roleMeta: Record<'admin' | 'teacher' | 'student', { title: string; description: string; scope: string }> = {
    admin: {
      title: 'College Administrator',
      description: 'Full management access within college scope across academic structures, student enrollment, faculty, exams, notices, and financial ledgers.',
      scope: 'college',
    },
    teacher: {
      title: 'Teacher / Faculty Permissions',
      description: 'Teacher Access = Granted Permission AND Assigned Class. Select a teacher from the filtered list below to view or edit their Supabase overrides.',
      scope: 'assigned_class',
    },
    student: {
      title: 'Enrolled College Student',
      description: 'Student Access = Granted Permission AND Own Data. Select a student from the filtered list below to view or edit their specific portal overrides.',
      scope: 'own',
    },
  }

  const isUserOverrideMode = activeRole === 'teacher' ? selectedTeacherId !== '' : activeRole === 'student' ? selectedStudentId !== '' : false
  const currentPermissions = isUserOverrideMode
    ? userOverrideStates
    : (roleStates[activeRole] || permissionStore.getRolePermissions(activeRole))

  const togglePermission = (permId: string) => {
    if (isUserOverrideMode) {
      setUserOverrideStates((prev) => ({
        ...prev,
        [permId]: !prev[permId],
      }))
    } else {
      setRoleStates((prev) => ({
        ...prev,
        [activeRole]: {
          ...prev[activeRole],
          [permId]: !prev[activeRole]?.[permId],
        },
      }))
    }
  }

  const handleApplyPreset = (preset: PresetTemplate) => {
    if (isUserOverrideMode) {
      setUserOverrideStates((prev) => ({
        ...prev,
        ...preset.permissions,
      }))
      const targetName = activeRole === 'teacher' ? selectedTeacher?.name : selectedStudent?.name
      toast({
        title: `Preset Applied: ${preset.name}`,
        description: `Loaded ${preset.name} permission template for ${targetName || 'Selected User'}.`,
        type: 'success',
      })
    } else {
      setRoleStates((prev) => ({
        ...prev,
        [activeRole]: {
          ...(prev[activeRole] || {}),
          ...preset.permissions,
        },
      }))
      toast({
        title: `Preset Applied: ${preset.name}`,
        description: `Applied ${preset.name} permission preset to ${activeRole.toUpperCase()} baseline.`,
        type: 'success',
      })
    }
  }

  const handleEnableAll = () => {
    const updated: Record<string, boolean> = {}
    PERMISSION_GROUPS.forEach((g) => g.permissions.forEach((p) => (updated[p.id] = true)))

    if (isUserOverrideMode) {
      setUserOverrideStates(updated)
      const targetName = activeRole === 'teacher' ? selectedTeacher?.name : selectedStudent?.name
      toast({ title: 'Permissions Updated', description: `Enabled all permissions for ${targetName || 'Selected User'}`, type: 'info' })
    } else {
      setRoleStates((prev) => ({ ...prev, [activeRole]: updated }))
      toast({ title: 'Permissions Updated', description: `Enabled all default permissions for ${activeRole.toUpperCase()}`, type: 'info' })
    }
  }

  const handleDisableAll = () => {
    const updated: Record<string, boolean> = {}
    PERMISSION_GROUPS.forEach((g) => g.permissions.forEach((p) => (updated[p.id] = false)))

    if (isUserOverrideMode) {
      setUserOverrideStates(updated)
      const targetName = activeRole === 'teacher' ? selectedTeacher?.name : selectedStudent?.name
      toast({ title: 'Permissions Updated', description: `Disabled all permissions for ${targetName || 'Selected User'}`, type: 'info' })
    } else {
      setRoleStates((prev) => ({ ...prev, [activeRole]: updated }))
      toast({ title: 'Permissions Updated', description: `Disabled all permissions for ${activeRole.toUpperCase()}`, type: 'info' })
    }
  }

  const handleResetDefaults = () => {
    const defaults: Record<string, boolean> = {}
    PERMISSION_GROUPS.forEach((g) =>
      g.permissions.forEach((p) => (defaults[p.id] = p.defaultChecked[activeRole] ?? false))
    )

    if (isUserOverrideMode) {
      setUserOverrideStates(defaults)
      const targetName = activeRole === 'teacher' ? selectedTeacher?.name : selectedStudent?.name
      toast({ title: 'Permissions Reset', description: `Reset baseline default permissions for ${targetName || 'User'}`, type: 'info' })
    } else {
      permissionStore.resetRoleDefaults(activeRole)
      setRoleStates(permissionStore.getMatrix())
      toast({ title: 'Permissions Reset', description: `Reset default permissions for ${activeRole.toUpperCase()}`, type: 'info' })
    }
  }

  const handleSavePermissions = async () => {
    setIsSaving(true)

    if (activeRole === 'teacher' && selectedTeacher) {
      const primaryId = selectedTeacher.id || selectedTeacher.teacher_id
      const res = await permissionStore.saveTeacherPermissionsToSupabase(collegeId, primaryId, userOverrideStates)

      if (res.success) {
        toast({
          title: 'Teacher Permissions Saved to Supabase',
          description: `Updated authorization rules for ${selectedTeacher.name} (${selectedTeacher.teacher_id}). Active immediately.`,
          type: 'success',
        })
      } else {
        toast({ title: 'Failed to Save Permissions', description: res.error || 'An error occurred while updating Supabase.', type: 'error' })
      }
    } else if (activeRole === 'student' && selectedStudent) {
      const primaryId = selectedStudent.id || selectedStudent.student_id
      const res = await permissionStore.saveTeacherPermissionsToSupabase(collegeId, primaryId, userOverrideStates)

      if (res.success) {
        toast({
          title: 'Student Permissions Saved to Supabase',
          description: `Updated portal permissions for ${selectedStudent.name} (${selectedStudent.roll_no}). Active immediately.`,
          type: 'success',
        })
      } else {
        toast({ title: 'Failed to Save Permissions', description: res.error || 'An error occurred while updating Supabase.', type: 'error' })
      }
    } else {
      permissionStore.saveRolePermissions(activeRole, roleStates[activeRole] || {})
      toast({
        title: 'Role Authorization Matrix Saved',
        description: `Updated baseline authorization policies for ${roleMeta[activeRole]?.title || activeRole}.`,
        type: 'success',
      })
    }

    setIsSaving(false)
  }

  // Filter permission groups based on search when in Admin tab or searching permissions
  const filteredGroups = PERMISSION_GROUPS.map((g) => {
    const filteredPerms = g.permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase())
    )
    return { ...g, permissions: filteredPerms }
  }).filter((g) => g.permissions.length > 0)

  const clearAllFilters = () => {
    setSearch('')
    setCourseFilter('')
    setBranchFilter('')
    setYearFilter('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-brand-600" /> Roles & Permissions
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            Manage college authorization policies, teacher assigned-class permissions, and student portal access rules.
          </p>
        </div>
        <Button onClick={handleSavePermissions} disabled={isSaving} className="shrink-0 bg-brand-600 hover:bg-brand-700">
          <Save className="h-4 w-4" /> {isSaving ? 'Saving to Supabase...' : 'Save Permissions'}
        </Button>
      </div>

      {/* STRICT 3-ROLE SELECTION TABS */}
      <Tabs
        tabs={roleTabs}
        activeId={activeRole}
        onChange={(id) => {
          const newRole = id as 'admin' | 'teacher' | 'student'
          setActiveRole(newRole)
          setSearch('')
          setCourseFilter('')
          setBranchFilter('')
          setYearFilter('')
        }}
        className="border-b border-border"
      />

      {/* FILTER BAR — DISPLAYED ONLY FOR TEACHER & STUDENT TABS (REMOVED FROM ADMIN TAB AS REQUESTED) */}
      {activeRole !== 'admin' && (
        <div className="bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-700 uppercase tracking-wider">
            <Filter className="h-4 w-4 text-brand-600" /> Filter {activeRole === 'teacher' ? 'Faculty' : 'Student'} Directory & Permissions
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* 1. Search */}
            <SearchInput
              placeholder={`Search ${activeRole === 'teacher' ? 'teacher name, ID...' : 'student name, roll...'}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs"
            />

            {/* 2. Course Filter */}
            <Select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value)
                setBranchFilter('')
              }}
              options={[
                { value: '', label: 'All Courses' },
                ...courses.map((c) => ({ value: c, label: c })),
              ]}
              className="w-full text-xs"
            />

            {/* 3. Branch Filter */}
            <Select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              options={[
                { value: '', label: 'All Branches' },
                ...availableBranches.map((b) => ({ value: b, label: b })),
              ]}
              className="w-full text-xs"
            />

            {/* 4. Year Filter */}
            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              options={[
                { value: '', label: 'All Years' },
                ...years.map((y) => ({ value: y, label: y })),
              ]}
              className="w-full text-xs"
            />
          </div>

          {(search || courseFilter || branchFilter || yearFilter) && (
            <div className="flex justify-end pt-1">
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-7 py-0">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TEACHER PANEL FILTER & SELECTOR */}
      {activeRole === 'teacher' && (
        <div className="p-5 bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-surface border border-brand-200/80 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-brand-600" /> Select Teacher to Manage Overrides ({filteredTeachers.length} Available)
              </label>
              <p className="text-xs text-ink-600">
                Filtered faculty members based on your Course/Branch/Search criteria above.
              </p>
            </div>

            <div className="w-full md:w-80">
              <Select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                options={
                  filteredTeachers.length > 0
                    ? filteredTeachers.map((t) => ({
                        value: t.id,
                        label: `${t.name} (${t.teacher_id}) - ${t.department}`,
                      }))
                    : [{ value: '', label: isFetchingTeachers ? 'Loading faculty...' : 'No teachers match filter' }]
                }
                className="w-full font-semibold text-ink-900"
              />
            </div>
          </div>

          {/* Selected Teacher Info Card */}
          {selectedTeacher && (
            <div className="pt-3 border-t border-brand-200/60 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-ink-400 font-medium block">Teacher Name</span>
                <span className="font-bold text-ink-900 text-sm flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-brand-600" /> {selectedTeacher.name}
                </span>
              </div>
              <div>
                <span className="text-ink-400 font-medium block">Employee / Teacher ID</span>
                <span className="font-mono font-bold text-brand-700">{selectedTeacher.teacher_id}</span>
              </div>
              <div>
                <span className="text-ink-400 font-medium block">Department / Branch</span>
                <span className="font-semibold text-ink-800">{selectedTeacher.department} ({selectedTeacher.course})</span>
              </div>
              <div>
                <span className="text-ink-400 font-medium block">Designation</span>
                <span className="font-semibold text-ink-800">{selectedTeacher.position}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STUDENT PANEL FILTER & SELECTOR (WORKING EXACTLY LIKE TEACHER PANEL) */}
      {activeRole === 'student' && (
        <div className="p-5 bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-surface border border-emerald-200/80 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-emerald-600" /> Select Student to Manage Overrides ({filteredStudents.length} Available)
              </label>
              <p className="text-xs text-ink-600">
                Filtered student directory based on your Course/Branch/Year/Search criteria above.
              </p>
            </div>

            <div className="w-full md:w-80">
              <Select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                options={
                  filteredStudents.length > 0
                    ? filteredStudents.map((s) => ({
                        value: s.id,
                        label: `${s.name} (${s.roll_no}) - ${s.course} ${s.branch}`,
                      }))
                    : [{ value: '', label: isFetchingStudents ? 'Loading students...' : 'No students match filter' }]
                }
                className="w-full font-semibold text-ink-900"
              />
            </div>
          </div>

          {/* Selected Student Info Card */}
          {selectedStudent && (
            <div className="pt-3 border-t border-emerald-200/60 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-ink-400 font-medium block">Student Name</span>
                <span className="font-bold text-ink-900 text-sm flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-emerald-600" /> {selectedStudent.name}
                </span>
              </div>
              <div>
                <span className="text-ink-400 font-medium block">Roll Number / Student ID</span>
                <span className="font-mono font-bold text-emerald-800">{selectedStudent.roll_no} ({selectedStudent.student_id})</span>
              </div>
              <div>
                <span className="text-ink-400 font-medium block">Course & Branch</span>
                <span className="font-semibold text-ink-800">{selectedStudent.course} {selectedStudent.branch}</span>
              </div>
              <div>
                <span className="text-ink-400 font-medium block">Year & Semester</span>
                <span className="font-semibold text-ink-800">{selectedStudent.year} ({selectedStudent.semester})</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRESET TEMPLATES BAR */}
      <div className="p-4 bg-surface border border-border rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Permission Preset Templates</h3>
        </div>
        <p className="text-xs text-ink-400">
          Quickly apply standard permission presets for faculty roles. (Presets use Teacher/Admin/Student roles only).
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {PRESET_TEMPLATES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 bg-canvas hover:bg-brand-50 border border-border hover:border-brand-300 rounded-[var(--radius-btn)] text-xs font-semibold text-ink-800 hover:text-brand-700 transition-all cursor-pointer flex items-center gap-1.5"
              title={preset.description}
            >
              <Shield className="h-3.5 w-3.5 text-brand-600" /> {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Role Meta Banner */}
      <div className="p-5 bg-surface border border-border rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink-900">
              {activeRole === 'teacher' && selectedTeacher
                ? `Permissions for ${selectedTeacher.name}`
                : activeRole === 'student' && selectedStudent
                ? `Permissions for ${selectedStudent.name}`
                : roleMeta[activeRole]?.title}
            </h2>
            <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 text-xs font-bold rounded-full uppercase">
              {activeRole.toUpperCase()} Role
            </span>
          </div>
          <p className="text-sm text-ink-600">{roleMeta[activeRole]?.description}</p>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4 shrink-0">
          <div className="text-right">
            <p className="text-xs text-ink-400 font-bold uppercase">Permission Scope</p>
            <p className="text-sm font-mono font-bold text-brand-700 uppercase">{roleMeta[activeRole]?.scope}</p>
          </div>
        </div>
      </div>

      {/* Toolbar: Matrix Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)]">
        {activeRole === 'admin' ? (
          <SearchInput
            placeholder="Search permission name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72"
          />
        ) : (
          <div className="text-xs text-ink-500 font-medium">
            Toggle permissions to override baseline defaults for selected user.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleEnableAll} className="gap-1.5 text-xs">
            <CheckSquare className="h-4 w-4 text-emerald-600" /> Enable All
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDisableAll} className="gap-1.5 text-xs">
            <XSquare className="h-4 w-4 text-rose-600" /> Disable All
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetDefaults} className="gap-1.5 text-xs">
            <RotateCcw className="h-4 w-4" /> Reset Defaults
          </Button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isFetchingPerms && (
        <div className="p-4 bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg animate-pulse flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-600 border-t-transparent" />
          Loading permissions from Supabase...
        </div>
      )}

      {/* Permission Modules List */}
      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <div
            key={group.category}
            className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden"
          >
            <div className="px-6 py-4 bg-canvas/60 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink-900">{group.category}</h3>
                <p className="text-xs text-ink-400 mt-0.5">{group.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...currentPermissions }
                    group.permissions.forEach((p) => (updated[p.id] = true))
                    if (isUserOverrideMode) setUserOverrideStates(updated)
                    else setRoleStates((prev) => ({ ...prev, [activeRole]: updated }))
                  }}
                  className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-ink-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...currentPermissions }
                    group.permissions.forEach((p) => (updated[p.id] = false))
                    if (isUserOverrideMode) setUserOverrideStates(updated)
                    else setRoleStates((prev) => ({ ...prev, [activeRole]: updated }))
                  }}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="divide-y divide-border">
              {group.permissions.map((perm) => {
                const isChecked = Boolean(currentPermissions[perm.id])
                return (
                  <div
                    key={perm.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-canvas/30 transition-colors"
                  >
                    <div className="pr-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-ink-900">{perm.name}</p>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          {perm.id}
                        </span>
                      </div>
                      <p className="text-xs text-ink-400 mt-0.5">{perm.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePermission(perm.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isChecked ? 'bg-brand-600' : 'bg-border'
                      }`}
                      role="switch"
                      aria-checked={isChecked}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isChecked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
