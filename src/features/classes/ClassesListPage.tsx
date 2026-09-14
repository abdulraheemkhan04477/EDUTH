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
import { Plus, School, Pencil, Trash2, Users, Building, GraduationCap, CheckCircle2 } from 'lucide-react'
import type { Column } from '../../components/ui/DataTable'
import { useAuth } from '../../app/providers/AuthProvider'
import {
  useAcademicStore,
  type ClassRecord,
  SEMESTERS_BY_YEAR_COURSE,
  getTeacherForUser,
  isBranchMatch,
} from '../../lib/academicStore'

export function ClassesListPage() {
  const { user, role } = useAuth()
  const isTeacher = role === 'teacher'

  const {
    courses,
    branchesByCourse,
    years,
    classes,
    teachers,
    students,
    saveClass,
    deleteClass,
    getClassAttendanceStats,
    getStudentAttendancePercentage,
  } = useAcademicStore()

  const currentTeacher = isTeacher ? getTeacherForUser(user, teachers) : null

  const permittedClasses = useMemo(() => {
    if (!isTeacher || !currentTeacher) return classes
    const directClasses = classes.filter(
      (c) =>
        c.teacher_id === currentTeacher.teacher_id ||
        c.teacher_name === currentTeacher.name ||
        (currentTeacher.assigned_classes || []).some((ac) => ac.includes(c.name) || c.name.includes(ac))
    )
    if (directClasses.length > 0) return directClasses
    return classes.filter((c) => c.course === currentTeacher.course && c.branch === currentTeacher.department)
  }, [isTeacher, currentTeacher, classes])

  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState('')

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassRecord | null>(null)
  const [selectedClass, setSelectedClass] = useState<ClassRecord | null>(null)
  const [page, setPage] = useState(1)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    teacher_id: '',
    room_no: 'Room 301',
    capacity: 60,
  })

  // Dynamic branch options for filter
  const availableBranchesForFilter = useMemo(() => {
    if (courseFilter && branchesByCourse[courseFilter]) {
      return branchesByCourse[courseFilter]
    }
    const allBranches = Object.values(branchesByCourse).flat()
    return Array.from(new Set(allBranches))
  }, [courseFilter, branchesByCourse])

  // Dynamic branch options for Modal
  const availableBranchesForModal = useMemo(() => {
    return branchesByCourse[formData.course] || []
  }, [formData.course, branchesByCourse])

  // Dynamic semester options for Modal
  const availableSemestersForModal = useMemo(() => {
    return SEMESTERS_BY_YEAR_COURSE(formData.year, formData.course)
  }, [formData.year, formData.course])

  const openAddModal = () => {
    setEditingClass(null)
    const firstTeacher = teachers[0]
    setFormData({
      course: 'B.Tech',
      branch: 'ECE',
      year: '1st Year',
      semester: 'Semester 1',
      section: 'Section A',
      teacher_id: firstTeacher ? firstTeacher.id : '',
      room_no: `Room ${Math.floor(100 + Math.random() * 300)}`,
      capacity: 60,
    })
    setShowAddModal(true)
  }

  const openEditModal = (c: ClassRecord) => {
    setEditingClass(c)
    // Find matching teacher
    const matchingTeacher = teachers.find(
      (t) => t.teacher_id === c.teacher_id || t.name === c.teacher_name
    )
    setFormData({
      course: c.course || 'B.Tech',
      branch: c.branch || 'ECE',
      year: c.year || '1st Year',
      semester: c.semester || 'Semester 1',
      section: c.section || 'Section A',
      teacher_id: matchingTeacher ? matchingTeacher.id : '',
      room_no: c.room_no || 'Room 301',
      capacity: c.capacity || 60,
    })
    setShowAddModal(true)
  }

  const handleSave = async () => {
    const selectedTeacher = teachers.find((t) => t.id === formData.teacher_id || t.teacher_id === formData.teacher_id)
    const className = `${formData.course} ${formData.branch} - ${formData.year} - ${formData.section}`
    const adminCollegeId = user?.college_id || user?.school_id || ''

    if (!adminCollegeId) {
      toast({ title: 'Configuration Error', description: 'Active college could not be identified from session.', type: 'error' })
      return
    }

    try {
      await saveClass({
        id: editingClass ? editingClass.id : undefined,
        college_id: editingClass ? editingClass.college_id : adminCollegeId,
        course: formData.course,
        branch: formData.branch,
        year: formData.year,
        semester: formData.semester,
        section: formData.section,
        name: className,
        teacher_name: selectedTeacher ? selectedTeacher.name : 'Unassigned',
        teacher_id: selectedTeacher ? selectedTeacher.teacher_id : '',
        room_no: formData.room_no || 'Room 101',
        capacity: formData.capacity || 60,
      })

      toast({
        title: 'Success',
        description: editingClass ? 'Class details updated successfully' : 'New class created successfully',
        type: 'success',
      })
      setShowAddModal(false)
    } catch (err: any) {
      toast({ title: 'Save Failed', description: err.message || 'Could not save class to database', type: 'error' })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove class "${name}"?`)) {
      try {
        await deleteClass(id)
        toast({ title: 'Class Removed', description: `${name} has been deleted.`, type: 'info' })
      } catch (err: any) {
        toast({ title: 'Delete Failed', description: err.message || 'Could not delete class', type: 'error' })
      }
    }
  }

  // Filter Logic: Course -> Branch
  const filtered = useMemo(() => {
    return permittedClasses.filter((c) => {
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.teacher_name.toLowerCase().includes(search.toLowerCase()) &&
        !c.room_no.toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }
      if (courseFilter && c.course !== courseFilter) return false
      if (branchFilter && !isBranchMatch(c.branch, branchFilter)) return false
      return true
    })
  }, [permittedClasses, search, courseFilter, branchFilter])

  // Table Columns (Status column removed, Actions kept)
  const columns: Column<ClassRecord>[] = [
    {
      key: 'name',
      header: 'CLASS NAME',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-100 text-brand-600 rounded-[var(--radius-btn)] font-bold">
            <School className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-ink-900 leading-tight">{row.name}</p>
            <p className="text-xs text-ink-400 mt-0.5">{row.section} · {row.semester}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'teacher_name',
      header: 'CLASS TEACHER',
      render: (row) => (
        <div className="flex items-center gap-2">
          <AvatarInitials name={row.teacher_name} size="sm" />
          <div>
            <p className="font-medium text-ink-900 text-sm">{row.teacher_name}</p>
            <p className="text-xs text-ink-400 font-mono">{row.teacher_id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'room_no',
      header: 'ROOM NO.',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-canvas border border-border rounded-[var(--radius-btn)] text-xs font-semibold text-ink-600">
          <Building className="h-3.5 w-3.5 text-ink-400" /> {row.room_no}
        </span>
      ),
    },
    {
      key: 'capacity',
      header: 'CAPACITY & ENROLLED',
      render: (row) => {
        const enrolledCount = students.filter((s) => {
          if (row.course && s.course !== row.course) return false
          if (row.branch && s.branch !== row.branch) return false
          if (row.year && s.year !== row.year) return false
          if (row.section && s.section !== row.section) return false
          return true
        }).length

        return (
          <div>
            <span className="text-sm font-semibold text-ink-900 block">
              {enrolledCount} / {row.capacity} Students
            </span>
            <div className="w-24 bg-border/50 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((enrolledCount / row.capacity) * 100))}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setSelectedClass(row)}
            className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-brand-600 transition-colors cursor-pointer"
            aria-label="View Class Details"
            title="View Class Details"
          >
            <Users className="h-4 w-4" />
          </button>
          {!isTeacher && (
            <>
              <button
                onClick={() => openEditModal(row)}
                className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer"
                aria-label="Edit Class"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(row.id, row.name)}
                className="p-1.5 rounded hover:bg-danger-100 text-ink-400 hover:text-danger-600 transition-colors cursor-pointer"
                aria-label="Delete Class"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  // Enrolled students in selected class for drawer roster
  const selectedClassRoster = useMemo(() => {
    if (!selectedClass) return []
    return students.filter((s) => {
      if (selectedClass.course && s.course !== selectedClass.course) return false
      if (selectedClass.branch && s.branch !== selectedClass.branch) return false
      if (selectedClass.year && s.year !== selectedClass.year) return false
      if (selectedClass.section && s.section !== selectedClass.section) return false
      return true
    })
  }, [selectedClass, students])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">
            {isTeacher ? 'Assigned Classes' : 'Classes Management'}
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            {isTeacher ? 'View rosters and capacity for your assigned teaching classes.' : 'Manage grade sections, room allocations, and class teachers.'}
          </p>
        </div>
        {!isTeacher && (
          <Button onClick={openAddModal} className="shrink-0">
            <Plus className="h-4 w-4" /> Add Class
          </Button>
        )}
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Classes" value={classes.length.toString()} icon={School} tone="info" />
        <StatCard label="Active Classes" value={classes.length.toString()} icon={CheckCircle2} tone="success" />
        <StatCard label="Total Students" value={students.length.toString()} icon={Users} tone="warning" />
        <StatCard label="Class Teachers" value={teachers.length.toString()} icon={GraduationCap} tone="success" />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <SearchInput
            placeholder="Search class name, teacher, room..."
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
            className="w-44"
          />
          {/* 2. All Branches Filter */}
          <Select
            options={availableBranchesForFilter.map((b) => ({ value: b, label: b }))}
            placeholder="All Branches"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-48"
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

      {/* Table */}
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
            icon={School}
            title="No classes found"
            description="Create your first class to manage sections and student rosters."
            actionLabel="Add Class"
            onAction={openAddModal}
          />
        }
      />

      {/* Add / Edit Class Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingClass ? 'Edit Class Configuration' : 'Add New Class'}
        subtitle="Configure course, branch, year, section, assigned teacher, and classroom location"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingClass ? 'Update Class' : 'Add Class'}</Button>
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
                    branch: newBranches[0] || '',
                  })
                }}
              />
            </FormField>
            <FormField label="Branch" required>
              <Select
                options={availableBranchesForModal.map((b) => ({ value: b, label: b }))}
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              />
            </FormField>
            <FormField label="Year" required>
              <Select
                options={years.map((y) => ({ value: y, label: y }))}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </FormField>
            <FormField label="Semester" required>
              <Select
                options={availableSemestersForModal.map((s) => ({ value: s, label: s }))}
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              />
            </FormField>
            <FormField label="Section" required>
              <Select
                options={[
                  { value: 'Section A', label: 'Section A' },
                  { value: 'Section B', label: 'Section B' },
                  { value: 'Section C', label: 'Section C' },
                  { value: 'Section D', label: 'Section D' },
                ]}
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </FormField>
            <FormField label="Class Teacher" required>
              <Select
                options={teachers.map((t) => ({
                  value: t.id,
                  label: `${t.name} (${t.teacher_id} - ${t.department})`,
                }))}
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              />
            </FormField>
            <FormField label="Room Number" required>
              <Input
                placeholder="Room 301"
                value={formData.room_no}
                onChange={(e) => setFormData({ ...formData, room_no: e.target.value })}
              />
            </FormField>
            <FormField label="Capacity">
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Class Roster Drawer */}
      <Drawer
        isOpen={Boolean(selectedClass)}
        onClose={() => setSelectedClass(null)}
        title="Class Details & Roster"
      >
        {selectedClass && (
          <div className="space-y-6">
            <div className="p-4 bg-canvas border border-border rounded-[var(--radius-card)] space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-ink-900">{selectedClass.name}</h3>
                  <p className="text-xs text-ink-400">{selectedClass.section} · {selectedClass.room_no}</p>
                </div>
                <span className="px-2.5 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded-full">
                  {getClassAttendanceStats(selectedClass).present} / {getClassAttendanceStats(selectedClass).total} Present
                </span>
              </div>
              <p className="text-xs text-ink-600 pt-1 border-t border-border">
                Class Teacher: <span className="font-semibold text-ink-900">{selectedClass.teacher_name} ({selectedClass.teacher_id})</span>
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
                Enrolled Students ({selectedClassRoster.length})
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {selectedClassRoster.length > 0 ? (
                  selectedClassRoster.map((st) => (
                    <div
                      key={st.id}
                      className="p-3 bg-surface rounded-[var(--radius-btn)] border border-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <AvatarInitials name={st.name} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{st.name}</p>
                          <p className="text-xs text-ink-400">Roll: {st.roll_no} · {st.student_id}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-success-600 bg-success-100 px-2 py-0.5 rounded-full">
                        {getStudentAttendancePercentage(st.id)}% Att.
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ink-400 italic">No students currently enrolled in this specific class section.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button onClick={() => setSelectedClass(null)}>Close Details</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
