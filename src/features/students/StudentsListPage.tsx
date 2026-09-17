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
import { ProgressRing } from '../../components/ui/ProgressRing'
import { useToast } from '../../components/ui/Toast'
import { Plus, Users, Pencil, Trash2, Eye, Calendar, UserCheck, Lock, Mail, Phone, MapPin } from 'lucide-react'
import type { Column } from '../../components/ui/DataTable'
import { useAuth } from '../../app/providers/AuthProvider'
import { AuthService } from '../../services/authService'
import {
  useAcademicStore,
  type StudentRecord,
  SEMESTERS_BY_YEAR_COURSE,
  getTeacherForUser,
  syncAcademicStoreWithSupabase,
  isBranchMatch,
} from '../../lib/academicStore'

export function StudentsListPage() {
  const { user, role, hasPermission } = useAuth()
  const isTeacher = role === 'teacher'

  // Teacher Permission Checks (Buttons REMAIN VISIBLE, disabled with title="Permission required" if false)
  const canCreateStudent = role === 'admin' || role === 'super_admin' || hasPermission('students.create')
  const canEditStudent = role === 'admin' || role === 'super_admin' || hasPermission('students.edit')
  const canDeleteStudent = role === 'admin' || role === 'super_admin' || hasPermission('students.delete')

  const {
    courses,
    branchesByCourse,
    years,
    students,
    teachers,
    classes,
    saveStudent,
    deleteStudent,
    getStudentAttendancePercentage,
  } = useAcademicStore()

  const currentTeacher = useMemo(() => {
    if (!isTeacher) return null
    return getTeacherForUser(user, teachers, classes)
  }, [isTeacher, teachers, classes, user])

  const teacherAssignedClasses = useMemo(() => {
    if (!isTeacher || !currentTeacher) return []
    const userEmailLower = currentTeacher.email?.toLowerCase().trim()
    const directClasses = classes.filter(
      (c) =>
        c.teacher_id === currentTeacher.teacher_id ||
        (userEmailLower && c.teacher_id?.toLowerCase().trim() === userEmailLower) ||
        (currentTeacher.name && c.teacher_name?.includes(currentTeacher.name)) ||
        (currentTeacher.assigned_classes || []).some(
          (ac) =>
            ac.includes(c.name) ||
            c.name.includes(ac) ||
            (ac.toLowerCase().includes(c.course.toLowerCase()) &&
              ac.toLowerCase().includes(c.branch.toLowerCase()) &&
              ac.toLowerCase().includes(c.year.toLowerCase()))
        )
    )
    return directClasses
  }, [isTeacher, currentTeacher, classes])

  const permittedStudents = useMemo(() => {
    if (!isTeacher) return students
    if (teacherAssignedClasses.length === 0) return students
    return students.filter((s) =>
      teacherAssignedClasses.some(
        (c) =>
          (s.class_id && c.id && s.class_id === c.id) ||
          (s.course === c.course &&
            isBranchMatch(s.branch, c.branch) &&
            (s.year === c.year || !c.year) &&
            (!c.section || c.section === 'All Sections' || s.section === c.section || c.name.includes(s.section)))
      )
    )
  }, [isTeacher, students, teacherAssignedClasses])

  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null)
  const [page, setPage] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Form State for Add / Edit Student Modal
  const [formData, setFormData] = useState({
    class_id: '',
    name: '',
    roll_no: '',
    dob: '2006-01-01',
    gender: 'Female',
    blood_group: 'A+',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    parent_password: '',
    parent_confirmPassword: '',
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
    if (!canCreateStudent) {
      toast({ title: 'Permission Required', description: 'You do not have permission to add students.', type: 'error' })
      return
    }

    setEditingStudent(null)
    const randomRoll = `23036${Math.floor(10000000 + Math.random() * 90000000)}`
    const defaultAssignedClass = teacherAssignedClasses[0]

    setFormData({
      class_id: defaultAssignedClass ? defaultAssignedClass.id : '',
      name: '',
      roll_no: randomRoll,
      dob: '2006-01-01',
      gender: 'Female',
      blood_group: 'A+',
      course: defaultAssignedClass ? defaultAssignedClass.course : 'B.Tech',
      branch: defaultAssignedClass ? defaultAssignedClass.branch : 'ECE',
      year: defaultAssignedClass ? defaultAssignedClass.year : '1st Year',
      semester: defaultAssignedClass ? (SEMESTERS_BY_YEAR_COURSE(defaultAssignedClass.year, defaultAssignedClass.course)[0] || 'Semester 1') : 'Semester 1',
      section: defaultAssignedClass ? (defaultAssignedClass.section || 'Section A') : 'Section A',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      parent_name: '',
      parent_phone: '',
      parent_email: '',
      parent_password: '',
      parent_confirmPassword: '',
    })
    setShowModal(true)
  }

  const openEditModal = (student: StudentRecord) => {
    if (!canEditStudent) {
      toast({ title: 'Permission Required', description: 'You do not have permission to edit students.', type: 'error' })
      return
    }

    setEditingStudent(student)
    setFormData({
      class_id: student.class_id || '',
      name: student.name,
      roll_no: student.roll_no,
      dob: student.dob || '2006-01-01',
      gender: student.gender || 'Female',
      blood_group: student.blood_group || 'A+',
      course: student.course || 'B.Tech',
      branch: student.branch || 'ECE',
      year: student.year || '1st Year',
      semester: student.semester || 'Semester 1',
      section: student.section || 'Section A',
      phone: student.phone || '',
      email: student.email || '',
      password: '',
      confirmPassword: '',
      address: student.address || '',
      parent_name: student.parent_name || '',
      parent_phone: student.parent_phone || '',
      parent_email: student.parent_email || '',
      parent_password: '',
      parent_confirmPassword: '',
    })
    setShowModal(true)
  }

  const handleSaveStudent = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Validation Error', description: 'Full name is required', type: 'error' })
      return
    }

    // Strict Teacher assigned class verification before saving
    if (isTeacher) {
      if (teacherAssignedClasses.length > 0) {
        const isClassPermitted = teacherAssignedClasses.some(
          (c) =>
            (formData.class_id && c.id === formData.class_id) ||
            (c.course === formData.course && c.branch === formData.branch && c.year === formData.year)
        )
        if (!isClassPermitted) {
          toast({
            title: 'Scope Restriction Block',
            description: 'You can only enroll students into classes assigned to you.',
            type: 'error',
          })
          return
        }
      }
    }

    const className = `${formData.course} ${formData.branch} - ${formData.year}`
    const adminCollegeId = user?.college_id || user?.school_id || ''
    if (!adminCollegeId) {
      toast({ title: 'Configuration Error', description: 'Active college could not be identified from session.', type: 'error' })
      return
    }
    const studentEmail = (formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@school.edu`).trim().toLowerCase()
    const studentCode = editingStudent ? editingStudent.student_id : `STU-${Math.floor(1000 + Math.random() * 9000)}`

    if (!editingStudent) {
      if (!formData.email.trim()) {
        toast({ title: 'Validation Error', description: 'Student email is required for login account creation', type: 'error' })
        return
      }

      if (!formData.password) {
        toast({ title: 'Validation Error', description: 'Student password is required', type: 'error' })
        return
      }

      if (formData.password.length < 6) {
        toast({ title: 'Validation Error', description: 'Student password must be at least 6 characters long', type: 'error' })
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast({ title: 'Validation Error', description: 'Student passwords do not match', type: 'error' })
        return
      }

      if (formData.parent_email && formData.parent_email.trim()) {
        if (!formData.parent_password) {
          toast({ title: 'Validation Error', description: 'Parent password is required when creating parent account', type: 'error' })
          return
        }

        if (formData.parent_password.length < 6) {
          toast({ title: 'Validation Error', description: 'Parent password must be at least 6 characters long', type: 'error' })
          return
        }

        if (formData.parent_password !== formData.parent_confirmPassword) {
          toast({ title: 'Validation Error', description: 'Parent passwords do not match', type: 'error' })
          return
        }
      }
    }

    setIsSaving(true)

    try {
      if (!editingStudent) {
        // 1. Create Student Auth account via Supabase
        const studentRes = await AuthService.createStudentAccount({
          name: formData.name.trim(),
          email: studentEmail,
          password: formData.password,
          roll_no: formData.roll_no || '1001',
          student_id: studentCode,
          college_id: adminCollegeId,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          blood_group: formData.blood_group,
          address: formData.address,
          parent_name: formData.parent_name,
          parent_phone: formData.parent_phone,
          parent_email: formData.parent_email,
          course: formData.course,
          branch: formData.branch,
          year: formData.year,
          semester: formData.semester,
          section: formData.section,
          class_name: className,
        })

        if (studentRes.error) {
          setIsSaving(false)
          toast({ title: 'Account Creation Failed', description: studentRes.error, type: 'error' })
          return
        }

        // 2. Create Parent Auth account if parent email provided
        if (formData.parent_email && formData.parent_email.trim()) {
          const parentRes = await AuthService.createParentAccount({
            name: formData.parent_name || 'Parent Guardian',
            email: formData.parent_email.trim().toLowerCase(),
            password: formData.parent_password,
            college_id: adminCollegeId,
            child_student_id: studentCode,
            phone: formData.parent_phone || '+1 (555) 000-0000',
          })
          if (parentRes.error) {
            setIsSaving(false)
            toast({ title: 'Parent Account Creation Failed', description: parentRes.error, type: 'error' })
            return
          }
        }
      }

      // 3. Save Student Record to academicStore & Supabase students table
      await saveStudent({
        id: editingStudent ? editingStudent.id : undefined,
        student_id: studentCode,
        name: formData.name.trim(),
        roll_no: formData.roll_no || '1001',
        dob: formData.dob,
        gender: formData.gender,
        blood_group: formData.blood_group,
        course: formData.course,
        branch: formData.branch,
        year: formData.year,
        semester: formData.semester,
        section: formData.section,
        class_name: className,
        class_id: formData.class_id,
        phone: formData.phone || '',
        email: studentEmail,
        address: formData.address || '',
        parent_name: formData.parent_name || '',
        parent_phone: formData.parent_phone || '',
        parent_email: formData.parent_email || '',
        college_id: adminCollegeId,
      })

      await syncAcademicStoreWithSupabase(adminCollegeId)

      toast({
        title: 'Success',
        description: editingStudent
          ? 'Student details updated successfully'
          : 'New student & account created successfully',
        type: 'success',
      })
      setShowModal(false)
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message || 'Could not save student to database',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!canDeleteStudent) {
      toast({ title: 'Permission Required', description: 'You do not have permission to delete students.', type: 'error' })
      return
    }

    if (confirm(`Are you sure you want to remove student "${name}"?`)) {
      try {
        await deleteStudent(id)
        toast({ title: 'Student Removed', description: `${name} has been deleted.`, type: 'info' })
      } catch (err: any) {
        toast({ title: 'Delete Failed', description: err.message || 'Could not delete student', type: 'error' })
      }
    }
  }

  // Filter Logic based on Course -> Branch -> Year, sorted by Roll Number ascending
  const filtered = useMemo(() => {
    return permittedStudents
      .filter((s) => {
        if (
          search &&
          !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.student_id.toLowerCase().includes(search.toLowerCase()) &&
          !s.roll_no.includes(search)
        ) {
          return false
        }
        if (courseFilter && s.course !== courseFilter) return false
        if (branchFilter && !isBranchMatch(s.branch, branchFilter)) return false
        if (yearFilter && yearFilter !== 'All Years' && s.year !== yearFilter) return false
        return true
      })
      .sort((a, b) => a.roll_no.localeCompare(b.roll_no, undefined, { numeric: true }))
  }, [permittedStudents, search, courseFilter, branchFilter, yearFilter])

  // Table Columns (Fee Status & Status removed, Actions kept)
  const columns: Column<StudentRecord>[] = [
    {
      key: 'name',
      header: 'STUDENT',
      render: (row) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={row.name} size="md" />
          <div>
            <p className="font-semibold text-ink-900 leading-tight">{row.name}</p>
            <p className="text-xs text-ink-400 mt-0.5">
              {row.email} · {row.student_id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'roll_no',
      header: 'ROLL NUMBER',
      render: (row) => (
        <span className="text-sm font-mono text-ink-700 font-medium">
          {row.roll_no}
        </span>
      ),
    },
    {
      key: 'class_name',
      header: 'CLASS',
      render: (row) => (
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700">
            {row.course} {row.branch}
          </span>
          <p className="text-xs text-ink-400 mt-1">{row.year} ({row.semester})</p>
        </div>
      ),
    },
    {
      key: 'attendance',
      header: 'ATTENDANCE',
      align: 'center',
      render: (row) => {
        const attPct = getStudentAttendancePercentage(row.id)
        return (
          <div className="flex items-center justify-center gap-2">
            <ProgressRing percent={attPct} size={30} strokeWidth={3} />
            <span className="text-sm font-semibold tabular-nums text-ink-900">
              {attPct}%
            </span>
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
            onClick={() => setSelectedStudent(row)}
            className="p-1.5 rounded-[var(--radius-btn)] hover:bg-canvas text-ink-400 hover:text-brand-600 transition-colors cursor-pointer"
            aria-label="View Student Details"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          {/* Edit Button — VISIBLE ALWAYS, disabled if no permission */}
          <button
            onClick={canEditStudent ? () => openEditModal(row) : undefined}
            disabled={!canEditStudent}
            className={`p-1.5 rounded-[var(--radius-btn)] transition-colors ${
              canEditStudent
                ? 'hover:bg-canvas text-ink-400 hover:text-ink-900 cursor-pointer'
                : 'opacity-40 cursor-not-allowed text-slate-300'
            }`}
            aria-label="Edit Student"
            title={canEditStudent ? 'Edit' : 'Permission required'}
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* Delete Button — VISIBLE ALWAYS, disabled if no permission */}
          <button
            onClick={canDeleteStudent ? () => handleDelete(row.id, row.name) : undefined}
            disabled={!canDeleteStudent}
            className={`p-1.5 rounded-[var(--radius-btn)] transition-colors ${
              canDeleteStudent
                ? 'hover:bg-danger-100 text-ink-400 hover:text-danger-600 cursor-pointer'
                : 'opacity-40 cursor-not-allowed text-slate-300'
            }`}
            aria-label="Delete Student"
            title={canDeleteStudent ? 'Delete' : 'Permission required'}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  // Calculate average attendance for stat card
  const avgAttendance = useMemo(() => {
    if (permittedStudents.length === 0) return 0
    const sum = permittedStudents.reduce((acc, st) => acc + getStudentAttendancePercentage(st.id), 0)
    return Math.round(sum / permittedStudents.length)
  }, [permittedStudents, getStudentAttendancePercentage])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">
            {isTeacher ? 'Assigned Class Students' : 'Student Directory'}
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            {isTeacher
              ? `Displaying students enrolled in your assigned classes (${teacherAssignedClasses.map((c) => `${c.course} ${c.branch}`).slice(0, 3).join(', ')})`
              : 'Manage student enrollment, class allocations, and academic records.'}
          </p>
        </div>

        {/* Add Student Button — REMAINS VISIBLE for both Teacher and Admin */}
        <Button
          onClick={canCreateStudent ? openAddModal : undefined}
          disabled={!canCreateStudent}
          title={!canCreateStudent ? 'Permission required' : 'Add Student'}
          className={`shrink-0 ${!canCreateStudent ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Plus className="h-4 w-4" /> Add Student
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={permittedStudents.length.toString()} icon={Users} tone="info" />
        <StatCard label="Active Students" value={permittedStudents.length.toString()} icon={UserCheck} tone="success" />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} icon={Calendar} tone="warning" />
        <StatCard label="Courses Count" value={courses.length.toString()} icon={Users} tone="success" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <SearchInput
            placeholder="Search student name, ID, roll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          {/* 1. All Courses Filter */}
          <Select
            options={courses.map((c) => ({ value: c, label: c }))}
            placeholder="All Courses"
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value)
              setBranchFilter('')
            }}
            className="w-full sm:w-40"
          />
          {/* 2. All Branches Filter */}
          <Select
            options={availableBranchesForFilter.map((b) => ({ value: b, label: b }))}
            placeholder="All Branches"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full sm:w-44"
          />
          {/* 3. All Year Filter */}
          <Select
            options={years.map((y) => ({ value: y, label: y }))}
            placeholder="All Year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full sm:w-36"
          />
        </div>
        {(search || courseFilter || branchFilter || yearFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('')
              setCourseFilter('')
              setBranchFilter('')
              setYearFilter('')
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Student List Table */}
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
            icon={Users}
            title="No students found"
            description="Adjust search filters or add a new student record."
            actionLabel="Add Student"
            onAction={canCreateStudent ? openAddModal : undefined}
          />
        }
      />

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingStudent ? 'Edit Student Details' : 'Add New Student'}
        subtitle={
          isTeacher
            ? 'Enrolling student into assigned class'
            : 'Fill in student personal, academic, contact, and parent information'
        }
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button isLoading={isSaving} onClick={handleSaveStudent}>
              {editingStudent ? 'Update Student' : 'Save Student'}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* PERSONAL INFORMATION */}
          <div>
            <h4 className="text-xs uppercase font-bold text-ink-400 tracking-wider mb-3">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" required className="md:col-span-2">
                <Input
                  placeholder="e.g. Alice Liddell"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormField>
              <FormField label="Roll Number" required>
                <Input
                  placeholder="e.g. 2303610000001"
                  value={formData.roll_no}
                  onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                />
              </FormField>
              <FormField label="Date of Birth">
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </FormField>
              <FormField label="Gender">
                <Select
                  options={[
                    { value: 'Female', label: 'Female' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />
              </FormField>
              <FormField label="Blood Group">
                <Select
                  options={[
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' },
                    { value: 'AB+', label: 'AB+' },
                  ]}
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          {/* ACADEMIC INFORMATION — SCOPED FOR TEACHER */}
          <div className="border-t border-border pt-4">
            <h4 className="text-xs uppercase font-bold text-ink-400 tracking-wider mb-3">
              Academic Information {isTeacher && '(Restricted to Assigned Classes)'}
            </h4>

            {isTeacher ? (
              <div className="space-y-4">
                <FormField label="Select Assigned Class (class_id)" required>
                  <Select
                    options={
                      teacherAssignedClasses.length > 0
                        ? teacherAssignedClasses.map((c) => ({
                            value: c.id,
                            label: `${c.name} (${c.course} ${c.branch} - ${c.year} - ${c.section || 'Sec A'})`,
                          }))
                        : [{ value: '', label: 'No assigned classes available' }]
                    }
                    value={formData.class_id || (teacherAssignedClasses[0]?.id ?? '')}
                    onChange={(e) => {
                      const selectedId = e.target.value
                      const cls = teacherAssignedClasses.find((c) => c.id === selectedId)
                      if (cls) {
                        setFormData({
                          ...formData,
                          class_id: cls.id,
                          course: cls.course,
                          branch: cls.branch,
                          year: cls.year,
                          section: cls.section || 'Section A',
                          semester: SEMESTERS_BY_YEAR_COURSE(cls.year, cls.course)[0] || 'Semester 1',
                        })
                      }
                    }}
                  />
                </FormField>
                <div className="p-3 bg-brand-50 border border-brand-200 rounded text-xs text-brand-800 flex items-center justify-between">
                  <span>Selected Allocation: <strong>{formData.course} {formData.branch}</strong> ({formData.year} - {formData.section})</span>
                  <span className="font-mono text-[10px] bg-brand-100 px-2 py-0.5 rounded">class_id: {formData.class_id || teacherAssignedClasses[0]?.id}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField label="Course" required>
                  <Select
                    options={courses.map((c) => ({ value: c, label: c }))}
                    value={formData.course}
                    onChange={(e) => {
                      const newCourse = e.target.value
                      const newBranches = branchesByCourse[newCourse] || []
                      const newBranch = newBranches[0] || ''
                      const newSemesters = SEMESTERS_BY_YEAR_COURSE(formData.year, newCourse)
                      setFormData({
                        ...formData,
                        course: newCourse,
                        branch: newBranch,
                        semester: newSemesters[0] || 'Semester 1',
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
                    onChange={(e) => {
                      const newYear = e.target.value
                      const newSemesters = SEMESTERS_BY_YEAR_COURSE(newYear, formData.course)
                      setFormData({
                        ...formData,
                        year: newYear,
                        semester: newSemesters[0] || 'Semester 1',
                      })
                    }}
                  />
                </FormField>
                <FormField label="Semester" required>
                  <Select
                    options={availableSemestersForModal.map((s) => ({ value: s, label: s }))}
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </FormField>
              </div>
            )}
          </div>

          {/* CONTACT INFORMATION */}
          <div className="border-t border-border pt-4">
            <h4 className="text-xs uppercase font-bold text-ink-400 tracking-wider mb-3">
              Contact & Student Credentials
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Phone Number">
                <Input
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </FormField>
              <FormField label="Student Email" required={!editingStudent}>
                <Input
                  type="email"
                  placeholder="student@school.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormField>
              {!editingStudent && (
                <>
                  <FormField label="Student Password" required helperText="Min 8 characters for Student login">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      icon={<Lock className="h-4 w-4" />}
                    />
                  </FormField>
                  <FormField label="Confirm Student Password" required>
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
              <FormField label="Address" className="md:col-span-2">
                <Input
                  placeholder="Full street address, city"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          {/* PARENT / GUARDIAN INFORMATION */}
          <div className="border-t border-border pt-4">
            <h4 className="text-xs uppercase font-bold text-ink-400 tracking-wider mb-3">
              Parent / Guardian Credentials & Info
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Father / Guardian Name">
                <Input
                  placeholder="Father / Guardian full name"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                />
              </FormField>
              <FormField label="Father / Guardian Phone Number">
                <Input
                  placeholder="+1 (555) 000-0000"
                  value={formData.parent_phone}
                  onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                />
              </FormField>
              <FormField label="Father / Guardian Email" className="md:col-span-2">
                <Input
                  type="email"
                  placeholder="parent@email.com"
                  value={formData.parent_email}
                  onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                />
              </FormField>
              {!editingStudent && (
                <>
                  <FormField label="Parent Password" helperText="Min 8 characters for Parent login">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.parent_password}
                      onChange={(e) => setFormData({ ...formData, parent_password: e.target.value })}
                      icon={<Lock className="h-4 w-4" />}
                    />
                  </FormField>
                  <FormField label="Confirm Parent Password">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.parent_confirmPassword}
                      onChange={(e) => setFormData({ ...formData, parent_confirmPassword: e.target.value })}
                      icon={<Lock className="h-4 w-4" />}
                    />
                  </FormField>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Student Profile View Drawer */}
      <Drawer
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        title="Student Profile Details"
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* Header / Avatar */}
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <AvatarInitials name={selectedStudent.name} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-ink-900">{selectedStudent.name}</h3>
                <p className="text-xs text-ink-400 font-mono">
                  Roll No: <span className="font-semibold text-brand-600">{selectedStudent.roll_no}</span>
                </p>
                <p className="text-xs text-ink-400">
                  {selectedStudent.course} {selectedStudent.branch} • {selectedStudent.year} ({selectedStudent.semester})
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Academic Overview */}
              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">Academic Information</p>
                <div className="mt-2 p-3 bg-canvas rounded-[var(--radius-btn)] border border-border space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-400">Course & Branch:</span>
                    <span className="font-semibold text-ink-900">{selectedStudent.course} - {selectedStudent.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">Year & Semester:</span>
                    <span className="font-semibold text-ink-900">{selectedStudent.year}, {selectedStudent.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">Section:</span>
                    <span className="font-semibold text-ink-900">{selectedStudent.section || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">Attendance Overall:</span>
                    <span className="font-bold text-emerald-600">{getStudentAttendancePercentage(selectedStudent.student_id)}%</span>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">Personal Details</p>
                <div className="mt-2 p-3 bg-canvas rounded-[var(--radius-btn)] border border-border space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-400">Date of Birth:</span>
                    <span className="font-medium text-ink-900">{selectedStudent.dob || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">Gender:</span>
                    <span className="font-medium text-ink-900">{selectedStudent.gender || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">Blood Group:</span>
                    <span className="font-medium text-ink-900">{selectedStudent.blood_group || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">Contact Information</p>
                <div className="mt-2 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-ink-600">
                    <Mail className="h-4 w-4 text-ink-400 shrink-0" />
                    <span>{selectedStudent.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-600">
                    <Phone className="h-4 w-4 text-ink-400 shrink-0" />
                    <span>{selectedStudent.phone || 'No phone provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-600">
                    <MapPin className="h-4 w-4 text-ink-400 shrink-0" />
                    <span>{selectedStudent.address || 'No address provided'}</span>
                  </div>
                </div>
              </div>

              {/* Parent / Guardian Info */}
              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">Parent / Guardian Details</p>
                <div className="mt-2 p-3 bg-canvas rounded-[var(--radius-btn)] border border-border space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-400">Guardian Name:</span>
                    <span className="font-semibold text-ink-900">{selectedStudent.parent_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">Guardian Phone:</span>
                    <span className="font-medium text-ink-900">{selectedStudent.parent_phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">Guardian Email:</span>
                    <span className="font-medium text-ink-900">{selectedStudent.parent_email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              {canEditStudent ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    const studentToEdit = selectedStudent
                    setSelectedStudent(null)
                    openEditModal(studentToEdit)
                  }}
                  className="text-xs flex items-center gap-1.5 text-brand-600 hover:text-brand-700"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Student
                </Button>
              ) : <div />}
              <Button onClick={() => setSelectedStudent(null)}>Close Profile</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
