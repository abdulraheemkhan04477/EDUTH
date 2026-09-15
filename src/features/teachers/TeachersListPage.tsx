import { useState, useMemo } from 'react'
import {
  DataTable,
  Button,
  AvatarInitials,
  SearchInput,
  EmptyState,
  Modal,
  Drawer,
  FormField,
  Input,
  Select,
  StatCard,
} from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import { Plus, GraduationCap, Pencil, Trash2, Eye, Mail, Phone, BookOpen, Building2, Lock, Users, Award } from 'lucide-react'
import type { Column } from '../../components/ui/DataTable'
import {
  useAcademicStore,
  type TeacherRecord,
  TEACHER_POSITIONS,
  syncAcademicStoreWithSupabase,
} from '../../lib/academicStore'
import { useAuth } from '../../app/providers/AuthProvider'
import { AuthService } from '../../services/authService'
function isCourseMatch(teacherCourse?: string, selectedCourse?: string): boolean {
  if (!selectedCourse) return true
  if (!teacherCourse) return false
  const tNorm = teacherCourse.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  const sNorm = selectedCourse.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  return tNorm === sNorm
}

const BRANCH_CANONICAL_GROUPS: Record<string, string[]> = {
  cse: [
    'cse',
    'computer science & engineering',
    'computer science and engineering',
    'computer science & engineering (cse)',
    'd-cse',
    'b.tech cse',
  ],
  csd: [
    'csd',
    'computer science & design',
    'computer science and design',
    'b.tech csd',
  ],
  cs: [
    'cs',
    'computer science',
    'd-cs',
    'diploma cs',
    'diploma in computer science',
  ],
  aiml: [
    'aiml',
    'ai/ml',
    'ai & ml',
    'artificial intelligence',
    'artificial intelligence & machine learning',
    'artificial intelligence and machine learning',
  ],
  ece: [
    'ece',
    'electronics & communication engineering',
    'electronics and communication engineering',
    'b.tech ece',
  ],
  ec: [
    'ec',
    'electronics engineering',
    'd-ec',
    'diploma ec',
    'diploma in electronics engineering',
  ],
  ee: [
    'ee',
    'electrical engineering',
    'd-ee',
    'b.tech ee',
  ],
  it: [
    'it',
    'information technology',
    'd-it',
    'b.tech it',
  ],
  me: [
    'me',
    'mechanical',
    'mechanical engineering',
    'd-me',
    'b.tech me',
  ],
  civil: [
    'civil',
    'civil engineering',
    'd-civil',
    'b.tech civil',
  ],
  biotech: [
    'biotech',
    'biotechnology',
    'bio technology',
  ],
  finance: [
    'finance',
    'financial management',
  ],
  marketing: [
    'marketing',
    'marketing management',
  ],
  hr: [
    'hr',
    'hrm',
    'human resource',
    'human resource management',
  ],
  ib: [
    'international business',
    'ib',
  ],
  ba: [
    'business analytics',
    'ba',
  ],
}

function getCanonicalBranchGroup(branchStr: string): string {
  const norm = branchStr.trim().toLowerCase().replace(/\s+/g, ' ')
  for (const [key, aliases] of Object.entries(BRANCH_CANONICAL_GROUPS)) {
    if (aliases.includes(norm)) {
      return key
    }
  }
  return norm.replace(/[^a-z0-9]/g, '')
}

function isBranchMatch(teacherDept?: string, selectedBranch?: string): boolean {
  if (!selectedBranch) return true
  if (!teacherDept) return false

  const tNorm = teacherDept.trim().toLowerCase()
  const sNorm = selectedBranch.trim().toLowerCase()
  if (tNorm === sNorm) return true

  const tKey = getCanonicalBranchGroup(tNorm)
  const sKey = getCanonicalBranchGroup(sNorm)

  return tKey === sKey
}

export function TeachersListPage() {
  const { user, collegeId: authCollegeId } = useAuth()
  const adminCollegeId = authCollegeId || user?.college_id || user?.school_id || ''

  const {
    courses,
    branchesByCourse,
    classes,
    teachers,
    subjects,
    saveTeacher,
    deleteTeacher,
  } = useAcademicStore()

  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState('')

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null)
  const [page, setPage] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    position: 'Assistant Professor',
    teacher_id: '',
    course: 'B.Tech',
    department: 'ECE',
    assigned_classes: [] as string[],
    assigned_subjects: [] as string[],
    email: '',
    phone: '',
    qualification: '',
    password: '',
    confirmPassword: '',
  })

  // Available branches for filter
  const availableBranchesForFilter = useMemo(() => {
    let standardBranches: string[] = []
    if (courseFilter && branchesByCourse[courseFilter]) {
      standardBranches = branchesByCourse[courseFilter]
    } else {
      standardBranches = Array.from(new Set(Object.values(branchesByCourse).flat()))
    }
    const extraTeacherBranches = teachers
      .filter((t) => !courseFilter || isCourseMatch(t.course, courseFilter))
      .map((t) => t.department)
      .filter(Boolean)

    return Array.from(new Set([...standardBranches, ...extraTeacherBranches]))
  }, [courseFilter, branchesByCourse, teachers])

  // Available branches for Modal
  const availableBranchesForModal = useMemo(() => {
    return branchesByCourse[formData.course] || []
  }, [formData.course, branchesByCourse])

  // Available Subjects for Modal (Dynamic based on selected Course & Department)
  const availableSubjectsForModal = useMemo(() => {
    const deptNorm = (formData.department || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    const isTnp = isBranchMatch('TNP', formData.department) || (formData.department || '').toUpperCase() === 'TNP' || (formData.department || '').toLowerCase().includes('training and placement')

    if (isTnp) {
      // If selected branch is TNP, show ONLY TNP subjects (PDP, Aptitude, Technical Training) for the selected course
      return subjects.filter((s) => {
        if (formData.course && s.course_name && s.course_name.toLowerCase() !== formData.course.toLowerCase()) return false
        const isSubTnp = s.branch_name === 'TNP' || (s.applicable_branches && s.applicable_branches.includes('TNP')) || s.branch_name === 'Training and Placement Department' || s.subject_type === 'TNP' || ['pdp', 'aptitude', 'technical training'].includes((s.name || '').toLowerCase())
        return isSubTnp
      })
    }

    const courseSubjects = subjects.filter((s) => {
      const isSubTnp = s.branch_name === 'TNP' || (s.applicable_branches && s.applicable_branches.includes('TNP')) || s.branch_name === 'Training and Placement Department' || s.subject_type === 'TNP'
      if (isSubTnp) return false // Do NOT show TNP subjects under normal academic branches

      if (formData.course && s.course_name && s.course_name.toLowerCase() !== formData.course.toLowerCase()) return false
      if (formData.department && s.branch_name) {
        const isSubCommon = Boolean(s.is_common || s.branch_name.toLowerCase().includes('common'))
        if (isSubCommon) return true

        const subBranch = s.branch_name.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (subBranch !== deptNorm && !s.branch_name.toLowerCase().includes(formData.department.toLowerCase()) && !formData.department.toLowerCase().includes(s.branch_name.toLowerCase())) {
          return false
        }
      }
      return true
    })

    const uniqueMap = new Map<string, typeof subjects[0]>()
    courseSubjects.forEach((s) => {
      uniqueMap.set(`${s.name} (${s.code})`, s)
    })
    return Array.from(uniqueMap.values())
  }, [formData.course, formData.department, subjects])

  const openAddModal = () => {
    setEditingTeacher(null)
    const defaultCourse = 'B.Tech'
    const defaultDept = 'ECE'
    const defaultSubs = subjects
      .filter((s) => s.course_name === defaultCourse && s.branch_name === defaultDept)
      .slice(0, 2)
      .map((s) => `${s.name} (${s.code})`)

    setFormData({
      name: '',
      position: 'Assistant Professor',
      teacher_id: `TCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      course: defaultCourse,
      department: defaultDept,
      assigned_classes: classes.length > 0 ? [classes[0].name] : ['B.Tech • ECE • 1st Year • Section A'],
      assigned_subjects: defaultSubs,
      email: '',
      phone: '',
      qualification: '',
      password: '',
      confirmPassword: '',
    })
    setShowAddModal(true)
  }

  const openEditModal = (t: TeacherRecord) => {
    setEditingTeacher(t)
    setFormData({
      name: t.name,
      position: t.position || 'Assistant Professor',
      teacher_id: t.teacher_id,
      course: t.course || 'B.Tech',
      department: t.department || 'ECE',
      assigned_classes: t.assigned_classes || [],
      assigned_subjects: t.assigned_subjects || [],
      email: t.email || '',
      phone: t.phone || '',
      qualification: t.qualification || '',
      password: '',
      confirmPassword: '',
    })
    setShowAddModal(true)
  }

  const toggleClass = (cName: string) => {
    setFormData((prev) => ({
      ...prev,
      assigned_classes: prev.assigned_classes.includes(cName)
        ? prev.assigned_classes.filter((x) => x !== cName)
        : [...prev.assigned_classes, cName],
    }))
  }

  const toggleSubject = (subDisplayName: string) => {
    setFormData((prev) => ({
      ...prev,
      assigned_subjects: prev.assigned_subjects.includes(subDisplayName)
        ? prev.assigned_subjects.filter((x) => x !== subDisplayName)
        : [...prev.assigned_subjects, subDisplayName],
    }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Validation Error', description: 'Teacher name is required', type: 'error' })
      return
    }

    const cleanEmail = (formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@school.edu`).trim().toLowerCase()

    try {
      if (!editingTeacher) {
        if (!formData.email.trim()) {
          toast({ title: 'Validation Error', description: 'Teacher email address is required for Auth account', type: 'error' })
          return
        }

        if (!formData.password) {
          toast({ title: 'Validation Error', description: 'Password is required for new Teacher account', type: 'error' })
          return
        }

        if (formData.password.length < 8) {
          toast({ title: 'Validation Error', description: 'Password must be at least 8 characters long', type: 'error' })
          return
        }

        if (formData.password !== formData.confirmPassword) {
          toast({ title: 'Validation Error', description: 'Passwords do not match', type: 'error' })
          return
        }

        if (teachers.some((t) => t.email.toLowerCase() === cleanEmail)) {
          toast({ title: 'Validation Error', description: 'A faculty member with this email address already exists', type: 'error' })
          return
        }

        if (formData.teacher_id && teachers.some((t) => t.teacher_id && t.teacher_id.trim().toLowerCase() === formData.teacher_id.trim().toLowerCase())) {
          toast({ title: 'Validation Error', description: 'A faculty member with this Teacher ID already exists', type: 'error' })
          return
        }

        setIsSaving(true)

        const res = await AuthService.createTeacherAccount({
          name: formData.name.trim(),
          email: cleanEmail,
          password: formData.password,
          teacher_id: formData.teacher_id || `TCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          college_id: adminCollegeId,
          position: formData.position,
          department: formData.department,
          course: formData.course,
          phone: formData.phone || '+1 (555) 000-0000',
          qualification: formData.qualification || 'Higher Education Degree',
          assigned_classes: formData.assigned_classes,
          assigned_subjects: formData.assigned_subjects,
        })

        if (res.error) {
          toast({ title: 'Teacher Creation Error', description: res.error, type: 'error' })
          return
        }

        await syncAcademicStoreWithSupabase(adminCollegeId)

        toast({
          title: 'Success',
          description: `Teacher account created successfully for ${cleanEmail}`,
          type: 'success',
        })
        setShowAddModal(false)
      } else {
        setIsSaving(true)
        await saveTeacher({
          id: editingTeacher.id,
          teacher_id: formData.teacher_id || `TCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          name: formData.name.trim(),
          position: formData.position,
          course: formData.course,
          department: formData.department,
          assigned_classes: formData.assigned_classes,
          assigned_subjects: formData.assigned_subjects,
          email: cleanEmail,
          phone: formData.phone || '+1 (555) 000-0000',
          qualification: formData.qualification || 'Higher Education Degree',
          college_id: adminCollegeId,
        })

        toast({
          title: 'Success',
          description: 'Faculty details updated successfully',
          type: 'success',
        })
        setShowAddModal(false)
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'An unexpected error occurred while saving teacher record',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete faculty member "${name}"?`)) {
      try {
        await deleteTeacher(id)
        toast({ title: 'Faculty Deleted', description: `${name} has been removed.`, type: 'info' })
      } catch (err: any) {
        toast({ title: 'Delete Failed', description: err.message || 'Failed to delete faculty member', type: 'error' })
      }
    }
  }

  // Teacher Filter logic: Course -> Branch
  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      if (
        search &&
        !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.teacher_id.toLowerCase().includes(search.toLowerCase()) &&
        !t.department.toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }
      if (courseFilter && !isCourseMatch(t.course, courseFilter)) return false
      if (branchFilter && !isBranchMatch(t.department, branchFilter)) return false
      return true
    })
  }, [teachers, search, courseFilter, branchFilter])

  // Table Columns
  const columns: Column<TeacherRecord>[] = [
    {
      key: 'name',
      header: 'TEACHER',
      render: (row) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={row.name} size="md" />
          <div>
            <p className="font-semibold text-ink-900 leading-tight">{row.name}</p>
            <p className="text-xs text-ink-400 mt-0.5">{row.position}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'teacher_id',
      header: 'TEACHER ID',
      render: (row) => <span className="text-sm font-mono text-ink-600">{row.teacher_id}</span>,
    },
    {
      key: 'department',
      header: 'DEPARTMENT / BRANCH',
      render: (row) => (
        <span className="text-sm text-ink-900 font-medium">
          {row.department}
        </span>
      ),
    },
    {
      key: 'assigned_classes',
      header: 'ASSIGNED CLASSES & SUBJECTS',
      render: (row) => (
        <div className="space-y-1 max-w-[280px]">
          <div className="flex flex-wrap gap-1">
            {row.assigned_classes && row.assigned_classes.length > 0 ? (
              row.assigned_classes.map((cls) => (
                <span
                  key={cls}
                  className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded text-xs font-medium border border-brand-200"
                >
                  {cls}
                </span>
              ))
            ) : (
              <span className="text-xs text-ink-400 italic">No classes assigned</span>
            )}
          </div>
          {row.assigned_subjects && row.assigned_subjects.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {row.assigned_subjects.map((sub) => (
                <span
                  key={sub}
                  className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[11px] font-medium border border-purple-200"
                >
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setSelectedTeacher(row)}
            className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-brand-600 transition-colors cursor-pointer"
            aria-label="View Details"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer"
            aria-label="Edit Teacher"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 rounded hover:bg-danger-100 text-ink-400 hover:text-danger-600 transition-colors cursor-pointer"
            aria-label="Delete Teacher"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  // Course-wise teacher counts for overview cards
  const btechCount = useMemo(() => {
    return teachers.filter((t) => isCourseMatch(t.course, 'B.Tech')).length
  }, [teachers])

  const diplomaCount = useMemo(() => {
    return teachers.filter((t) => isCourseMatch(t.course, 'Diploma')).length
  }, [teachers])

  const mbaCount = useMemo(() => {
    return teachers.filter((t) => isCourseMatch(t.course, 'MBA')).length
  }, [teachers])

  return (
    <div className="space-y-6">
      {/* Top Search & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">Faculty Management</h1>
          <p className="text-sm text-ink-400 mt-1">Manage and monitor teacher performance and records</p>
        </div>
        <Button onClick={openAddModal} className="shrink-0">
          <Plus className="h-4 w-4" /> Add Teacher
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Teachers" value={teachers.length.toString()} icon={Users} tone="info" />
        <StatCard label="B.Tech Teachers" value={btechCount.toString()} icon={GraduationCap} tone="brand" />
        <StatCard label="Diploma Teachers" value={diplomaCount.toString()} icon={BookOpen} tone="warning" />
        <StatCard label="MBA Teachers" value={mbaCount.toString()} icon={Award} tone="success" />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <SearchInput
            placeholder="Search faculty, IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72"
          />
          {/* 1. All Courses Filter */}
          <Select
            options={courses.map((c) => ({ value: c, label: c }))}
            placeholder="All Courses"
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value)
              setBranchFilter('') // reset branch when course changes
            }}
            className="w-full sm:w-44"
          />
          {/* 2. All Branches Filter */}
          <Select
            options={availableBranchesForFilter.map((b) => ({ value: b, label: b }))}
            placeholder="All Branches"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>
        {(search || courseFilter || branchFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('')
              setCourseFilter('')
              setBranchFilter('')
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Main Table Container */}
      <DataTable
        columns={columns}
        rows={filtered}
        keyExtractor={(r) => r.id}
        page={page}
        pageSize={10}
        total={filtered.length}
        onPageChange={setPage}
        emptyState={
          <EmptyState
            icon={GraduationCap}
            title="No faculty members found"
            description="Add your first teacher to manage class assignments."
            actionLabel="Add Teacher"
            onAction={openAddModal}
          />
        }
      />

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingTeacher ? 'Edit Faculty Record' : 'Add New Teacher'}
        subtitle="Fill in teacher profile and assign academic classes & subjects"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button isLoading={isSaving} onClick={handleSave}>{editingTeacher ? 'Update Teacher' : 'Add Teacher'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Course" required>
              <Select
                options={courses.map((c) => ({ value: c, label: c }))}
                value={formData.course}
                onChange={(e) => {
                  const newCourse = e.target.value
                  const newBranches = branchesByCourse[newCourse] || []
                  setFormData({
                    ...formData,
                    course: newCourse,
                    department: newBranches[0] || '',
                    assigned_subjects: [],
                  })
                }}
              />
            </FormField>
            <FormField label="Department / Branch" required>
              <Select
                options={availableBranchesForModal.map((b) => ({ value: b, label: b }))}
                value={formData.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value,
                    assigned_subjects: [],
                  })
                }
              />
            </FormField>
            <FormField label="Full Name" required>
              <Input
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormField>
            <FormField label="Position" required>
              <Select
                options={TEACHER_POSITIONS.map((p) => ({ value: p, label: p }))}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </FormField>
            <FormField label="Teacher ID" required>
              <Input
                placeholder="TCH-2026-0001"
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              />
            </FormField>
            <FormField label="Email Address" required={!editingTeacher}>
              <Input
                type="email"
                placeholder="teacher@school.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormField>
            <FormField label="Phone Number">
              <Input
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </FormField>
            <FormField label="Qualification">
              <Input
                placeholder="Degree / Specialization"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </FormField>
            {!editingTeacher && (
              <>
                <FormField label="Password" required helperText="Min 8 characters for Teacher login">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    icon={<Lock className="h-4 w-4" />}
                  />
                </FormField>
                <FormField label="Confirm Password" required>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    icon={<Lock className="h-4 w-4" />}
                  />
                </FormField>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-sm font-semibold text-ink-900 mb-2">Assign Class / Classes</p>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 border border-border rounded-[var(--radius-btn)] bg-canvas">
              {classes.map((cls) => {
                const isSelected = formData.assigned_classes.includes(cls.name)
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => toggleClass(cls.name)}
                    className={`px-3 py-1.5 rounded-[var(--radius-btn)] text-xs font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? 'border-brand-600 bg-brand-100 text-brand-700'
                        : 'border-border bg-surface text-ink-600 hover:border-ink-400'
                    }`}
                  >
                    {cls.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-ink-900">Assign Subject(s)</p>
              <span className="text-xs text-ink-400">Filtered by {formData.course} ({formData.department})</span>
            </div>
            {availableSubjectsForModal.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-border rounded-[var(--radius-btn)] bg-canvas">
                {availableSubjectsForModal.map((sub) => {
                  const subDisplayName = `${sub.name} (${sub.code})`
                  const isSelected = formData.assigned_subjects.includes(subDisplayName) || formData.assigned_subjects.includes(sub.name)
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => toggleSubject(subDisplayName)}
                      className={`px-3 py-1.5 rounded-[var(--radius-btn)] text-xs font-semibold transition-colors cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-purple-600 bg-purple-100 text-purple-700 shadow-sm'
                          : 'border-border bg-surface text-ink-600 hover:border-ink-400'
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{sub.name}</span>
                      <span className="font-mono opacity-75">({sub.code})</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="p-3 bg-canvas border border-dashed border-border rounded-[var(--radius-btn)] text-center text-xs text-ink-400">
                No subjects found for {formData.course} - {formData.department}. You can add subjects in Academic Structure.
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Teacher Profile Drawer */}
      <Drawer
        isOpen={Boolean(selectedTeacher)}
        onClose={() => setSelectedTeacher(null)}
        title="Faculty Profile"
      >
        {selectedTeacher && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <AvatarInitials name={selectedTeacher.name} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-ink-900">{selectedTeacher.name}</h3>
                <p className="text-xs text-ink-400">
                  {selectedTeacher.position} · {selectedTeacher.teacher_id}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">Department & Qualification</p>
                <div className="mt-2 p-3 bg-canvas rounded-[var(--radius-btn)] border border-border space-y-1">
                  <p className="text-sm font-semibold text-ink-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-brand-600" /> {selectedTeacher.course} ({selectedTeacher.department})
                  </p>
                  <p className="text-xs text-ink-600">{selectedTeacher.qualification}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">Assigned Courses & Classes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTeacher.assigned_classes && selectedTeacher.assigned_classes.length > 0 ? (
                    selectedTeacher.assigned_classes.map((cls) => (
                      <span
                        key={cls}
                        className="px-3 py-1 bg-brand-100 text-brand-700 rounded-[var(--radius-btn)] text-xs font-semibold flex items-center gap-1.5"
                      >
                        <BookOpen className="h-3.5 w-3.5" /> {cls}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-ink-400 italic">No classes assigned</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">Assigned Subjects</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTeacher.assigned_subjects && selectedTeacher.assigned_subjects.length > 0 ? (
                    selectedTeacher.assigned_subjects.map((sub) => (
                      <span
                        key={sub}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-[var(--radius-btn)] text-xs font-semibold flex items-center gap-1.5"
                      >
                        <BookOpen className="h-3.5 w-3.5" /> {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-ink-400 italic">No subjects assigned</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">Contact Details</p>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-ink-600">
                    <Mail className="h-4 w-4 text-ink-400" />
                    <span>{selectedTeacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-600">
                    <Phone className="h-4 w-4 text-ink-400" />
                    <span>{selectedTeacher.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button onClick={() => setSelectedTeacher(null)}>Close Profile</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
