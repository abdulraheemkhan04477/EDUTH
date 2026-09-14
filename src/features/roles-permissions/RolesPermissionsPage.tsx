import { useState, useEffect, useCallback } from 'react'
import { Tabs, Button, SearchInput, Select } from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import { Shield, Save, RotateCcw, CheckSquare, XSquare, UserCheck, User } from 'lucide-react'
import { PERMISSION_GROUPS, permissionStore, usePermissionStore } from '../../lib/permissionStore'
import type { UserRole } from '../../types/domain'
import { useAuth } from '../../app/providers/AuthProvider'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

interface TeacherOption {
  id: string
  teacher_id: string
  name: string
  email: string
  department: string
  course: string
  position: string
}

export function RolesPermissionsPage() {
  const { user } = useAuth()
  const collegeId = user?.college_id || user?.school_id || '13695a78-0105-4bde-bc85-d664bb66637e'

  const [activeRole, setActiveRole] = useState<UserRole>('teacher')
  const [search, setSearch] = useState('')
  const [teachers, setTeachers] = useState<TeacherOption[]>([])
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('')
  const [isFetchingTeachers, setIsFetchingTeachers] = useState(false)
  const [isFetchingPerms, setIsFetchingPerms] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { toast } = useToast()
  const { matrix } = usePermissionStore()

  // State for active teacher permissions or role baseline matrix
  const [teacherStates, setTeacherStates] = useState<Record<string, boolean>>({})
  const [roleStates, setRoleStates] = useState<Record<UserRole, Record<string, boolean>>>(matrix)

  // Fetch real teachers from Supabase for current college
  useEffect(() => {
    let isMounted = true
    const loadTeachers = async () => {
      if (!isSupabaseConfigured) return
      setIsFetchingTeachers(true)

      try {
        let query = supabase.from('teachers').select('id, teacher_id, name, email, department, course, position, college_id')
        if (collegeId && collegeId !== 'PLATFORM_ALL') {
          query = query.or(`college_id.eq.${collegeId},college_id.eq.COL001,college_id.eq.13695a78-0105-4bde-bc85-d664bb66637e`)
        }

        const { data, error } = await query

        if (!error && data && isMounted) {
          const mapped: TeacherOption[] = data.map((t: any) => ({
            id: t.id,
            teacher_id: t.teacher_id || t.id,
            name: t.name || 'Unnamed Teacher',
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

  // Selected teacher object
  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId || t.teacher_id === selectedTeacherId)

  // Load selected teacher's permissions from Supabase
  const loadTeacherPermissions = useCallback(async (tId: string) => {
    if (!tId) return
    setIsFetchingPerms(true)
    const tObj = teachers.find((t) => t.id === tId || t.teacher_id === tId)
    const primaryId = tObj?.id || tId

    const loaded = await permissionStore.fetchTeacherPermissionsFromSupabase(collegeId, primaryId)
    setTeacherStates(loaded)
    setIsFetchingPerms(false)
  }, [collegeId, teachers])

  useEffect(() => {
    if (activeRole === 'teacher' && selectedTeacherId) {
      loadTeacherPermissions(selectedTeacherId)
    }
  }, [activeRole, selectedTeacherId, loadTeacherPermissions])

  const roleTabs = [
    { id: 'teacher', label: 'Teacher / Faculty' },
    { id: 'admin', label: 'Admin' },
    { id: 'super_admin', label: 'Super Admin' },
    { id: 'student', label: 'Student' },
    { id: 'parent', label: 'Parent' },
  ]

  const roleMeta: Record<UserRole, { title: string; description: string; usersCount: number }> = {
    super_admin: {
      title: 'College Super Administrator',
      description: 'Unrestricted system-level control across all academic structures, financial ledgers, roles, and settings.',
      usersCount: 2,
    },
    admin: {
      title: 'College Administrator',
      description: 'Management access to student enrollment, faculty, course allocations, exams, notices, and financial ledgers.',
      usersCount: 6,
    },
    teacher: {
      title: 'Faculty / Educator Permissions',
      description: 'Granular per-teacher permissions connected to Supabase. Configure individual capabilities for each faculty member.',
      usersCount: teachers.length || 26,
    },
    student: {
      title: 'Enrolled College Student',
      description: 'Self-service portal access restricted strictly to personal timetable, coursework, study materials, and report cards.',
      usersCount: 145,
    },
    parent: {
      title: 'Parent / Guardian',
      description: 'Parent portal access restricted strictly to linked child attendance, fee dues, exam results, and college notices.',
      usersCount: 145,
    },
  }

  const isTeacherMode = activeRole === 'teacher' && selectedTeacherId !== ''
  const currentPermissions = isTeacherMode ? teacherStates : (roleStates[activeRole] || permissionStore.getRolePermissions(activeRole))

  const togglePermission = (permId: string) => {
    if (activeRole === 'super_admin') {
      toast({ title: 'Super Admin Protected', description: 'Super Admin retains full system permissions.', type: 'info' })
      return
    }

    if (isTeacherMode) {
      setTeacherStates((prev) => ({
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

  const handleEnableAll = () => {
    if (activeRole === 'super_admin') return
    const updated: Record<string, boolean> = {}
    PERMISSION_GROUPS.forEach((g) => g.permissions.forEach((p) => (updated[p.id] = true)))

    if (isTeacherMode) {
      setTeacherStates(updated)
      toast({ title: 'Permissions Updated', description: `Enabled all permissions for ${selectedTeacher?.name || 'Selected Teacher'}`, type: 'info' })
    } else {
      setRoleStates((prev) => ({ ...prev, [activeRole]: updated }))
      toast({ title: 'Permissions Updated', description: `Enabled all default permissions for ${activeRole.toUpperCase()}`, type: 'info' })
    }
  }

  const handleDisableAll = () => {
    if (activeRole === 'super_admin') return
    const updated: Record<string, boolean> = {}
    PERMISSION_GROUPS.forEach((g) => g.permissions.forEach((p) => (updated[p.id] = false)))

    if (isTeacherMode) {
      setTeacherStates(updated)
      toast({ title: 'Permissions Updated', description: `Disabled all permissions for ${selectedTeacher?.name || 'Selected Teacher'}`, type: 'info' })
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

    if (isTeacherMode) {
      setTeacherStates(defaults)
      toast({ title: 'Permissions Reset', description: `Reset baseline default permissions for ${selectedTeacher?.name || 'Teacher'}`, type: 'info' })
    } else {
      permissionStore.resetRoleDefaults(activeRole)
      setRoleStates(permissionStore.getMatrix())
      toast({ title: 'Permissions Reset', description: `Reset default permissions for ${activeRole.toUpperCase()}`, type: 'info' })
    }
  }

  const handleSavePermissions = async () => {
    if (activeRole === 'super_admin') {
      toast({ title: 'Super Admin Protected', description: 'Super Admin retains full system permissions.', type: 'info' })
      return
    }

    setIsSaving(true)

    if (isTeacherMode && selectedTeacher) {
      const primaryId = selectedTeacher.id || selectedTeacher.teacher_id
      const res = await permissionStore.saveTeacherPermissionsToSupabase(collegeId, primaryId, teacherStates)

      if (res.success) {
        toast({
          title: 'Teacher Permissions Saved to Supabase',
          description: `Updated authorization rules for ${selectedTeacher.name} (${selectedTeacher.teacher_id}). Changes active immediately in Supabase.`,
          type: 'success',
        })
      } else {
        toast({
          title: 'Failed to Save Permissions',
          description: res.error || 'An error occurred while updating Supabase.',
          type: 'error',
        })
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

  const filteredGroups = PERMISSION_GROUPS.map((g) => {
    const filteredPerms = g.permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase())
    )
    return { ...g, permissions: filteredPerms }
  }).filter((g) => g.permissions.length > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-brand-600" /> Roles & Permissions
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            Configure college management authorization policies, per-teacher Supabase permission overrides, and security rules.
          </p>
        </div>
        <Button onClick={handleSavePermissions} disabled={isSaving} className="shrink-0 bg-brand-600 hover:bg-brand-700">
          <Save className="h-4 w-4" /> {isSaving ? 'Saving to Supabase...' : 'Save Permissions'}
        </Button>
      </div>

      {/* Role Selection Tabs */}
      <Tabs tabs={roleTabs} activeId={activeRole} onChange={(id) => setActiveRole(id as UserRole)} className="border-b border-border" />

      {/* Teacher Dropdown Selector (Active when Teacher tab is selected) */}
      {activeRole === 'teacher' && (
        <div className="p-5 bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-surface border border-brand-200/80 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-brand-600" /> Select Teacher to Manage Permissions
              </label>
              <p className="text-xs text-ink-600">
                Loaded real faculty members from Supabase database for your college.
              </p>
            </div>

            <div className="w-full md:w-80">
              <Select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                options={
                  teachers.length > 0
                    ? teachers.map((t) => ({
                        value: t.id,
                        label: `${t.name} (${t.teacher_id}) - ${t.department}`,
                      }))
                    : [{ value: '', label: isFetchingTeachers ? 'Loading teachers...' : 'No teachers found' }]
                }
                className="w-full font-semibold text-ink-900"
              />
            </div>
          </div>

          {/* Selected Teacher Details Card */}
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

      {/* Role Meta Banner */}
      <div className="p-5 bg-surface border border-border rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink-900">
              {isTeacherMode && selectedTeacher ? `Permissions for ${selectedTeacher.name}` : roleMeta[activeRole]?.title}
            </h2>
            <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 text-xs font-bold rounded-full uppercase">
              {activeRole.replace('_', ' ')} Role
            </span>
          </div>
          <p className="text-sm text-ink-600">{roleMeta[activeRole]?.description}</p>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4 shrink-0">
          <div className="text-right">
            <p className="text-xs text-ink-400 font-bold uppercase">Active Faculty</p>
            <p className="text-lg font-bold text-ink-900">{roleMeta[activeRole]?.usersCount}</p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Preset Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)]">
        <SearchInput
          placeholder="Search permission or module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleEnableAll} className="gap-1.5 text-xs" disabled={activeRole === 'super_admin'}>
            <CheckSquare className="h-4 w-4 text-emerald-600" /> Enable All
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDisableAll} className="gap-1.5 text-xs" disabled={activeRole === 'super_admin'}>
            <XSquare className="h-4 w-4 text-rose-600" /> Disable All
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetDefaults} className="gap-1.5 text-xs">
            <RotateCcw className="h-4 w-4" /> Reset Defaults
          </Button>
        </div>
      </div>

      {/* Loading Overlay when fetching teacher perms */}
      {isFetchingPerms && (
        <div className="p-4 bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium rounded-lg animate-pulse flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-600 border-t-transparent" />
          Loading permissions from Supabase for {selectedTeacher?.name}...
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

              {activeRole !== 'super_admin' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...currentPermissions }
                      group.permissions.forEach((p) => (updated[p.id] = true))
                      if (isTeacherMode) setTeacherStates(updated)
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
                      if (isTeacherMode) setTeacherStates(updated)
                      else setRoleStates((prev) => ({ ...prev, [activeRole]: updated }))
                    }}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              )}
            </div>

            <div className="divide-y divide-border">
              {group.permissions.map((perm) => {
                const isChecked = activeRole === 'super_admin' ? true : Boolean(currentPermissions[perm.id])
                return (
                  <div
                    key={perm.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-canvas/30 transition-colors"
                  >
                    <div className="pr-4">
                      <p className="text-sm font-semibold text-ink-900">{perm.name}</p>
                      <p className="text-xs text-ink-400 mt-0.5">{perm.description}</p>
                    </div>

                    <button
                      type="button"
                      disabled={activeRole === 'super_admin'}
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

