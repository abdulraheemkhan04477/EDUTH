import { useState, useMemo } from 'react'
import {
  Button,
  StatusPill,
  Modal,
  FormField,
  Input,
  Select,
  Textarea,
  SearchInput,
  StatCard,
} from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../app/providers/AuthProvider'
import {
  useAssignmentStore,
  type Assignment,
} from '../../lib/assignmentStore'
import {
  useAcademicStore,
  getTeacherForUser,
  getAssignedClassRecordsForTeacher,
  isBranchMatch,
} from '../../lib/academicStore'
import {
  Plus,
  Calendar,
  Pencil,
  Trash2,
  Eye,
  FileText,
  ExternalLink,
  BookOpen,
  User,
  GraduationCap,
  Paperclip,
  CheckCircle2,
  Sparkles,
  Clock,
  AlertCircle,
} from 'lucide-react'

// Subject Map for dynamic selection based on Course / Branch / Semester
const SUBJECT_OPTIONS: Record<string, string[]> = {
  // Common Subjects
  'B.Tech-Common Subject-Semester 1': ['Mathematics I', 'Engineering Physics', 'Basic Electrical Engineering', 'Professional Communication', 'Environmental Science'],
  'B.Tech-Common Subject-Semester 2': ['Mathematics II', 'Engineering Chemistry', 'Programming for Problem Solving', 'Engineering Graphics'],
  'Diploma-Common Subject-Semester 1': ['Basic Mathematics', 'Applied Physics', 'Communication Skills', 'Computer Fundamentals'],
  'MBA-Common Subject-Semester 1': ['Managerial Economics', 'Organizational Behavior', 'Business Statistics'],

  // Branch Specific
  'B.Tech-ECE-Semester 3': ['Digital Electronics', 'Signals & Systems', 'Network Theory', 'Electronic Devices & Circuits'],
  'B.Tech-ECE-Semester 4': ['Analog Circuits', 'Electromagnetic Field Theory', 'Microprocessors & Microcontrollers', 'Control Systems'],
  'B.Tech-CSE-Semester 3': ['Data Structures & Algorithms', 'Object Oriented Programming', 'Discrete Mathematics', 'Computer Organization'],
  'B.Tech-CSE-Semester 4': ['Operating Systems', 'Database Management Systems', 'Theory of Computation', 'Software Engineering'],
  'B.Tech-IT-Semester 3': ['Data Structures', 'Object Oriented Programming', 'Digital Logic Design', 'Discrete Structures'],
  'B.Tech-AIML-Semester 3': ['Data Structures & Algorithms', 'Python for AI', 'Linear Algebra & Probability', 'Digital Principles'],
  'Diploma-CS-Semester 1': ['Programming in C', 'Computer Fundamentals', 'Basic Mathematics', 'Digital Electronics'],
  'MBA-Finance-Semester 1': ['Financial Accounting', 'Corporate Finance', 'Managerial Economics', 'Financial Markets'],
  'MBA-Marketing-Semester 1': ['Marketing Management', 'Consumer Behavior', 'Managerial Economics', 'Digital Marketing'],
}

const statusMap = {
  active: { status: 'warning' as const, label: 'Active' },
  overdue: { status: 'danger' as const, label: 'Overdue' },
  completed: { status: 'success' as const, label: 'Completed' },
}

export function AssignmentsListPage() {
  const { user, role } = useAuth()
  const { toast } = useToast()
  const { students, teachers, classes } = useAcademicStore()
  const {
    assignments,
    saveAssignment,
    deleteAssignment,
    getStudentAssignments,
    getTeacherAssignments,
    courses,
    branchesByCourse,
  } = useAssignmentStore()

  const isParent = role === 'parent'

  // Student academic profile resolution
  const studentRecord = useMemo(() => {
    if (role !== 'student') return null
    const userEmailLower = user?.email?.toLowerCase().trim()
    return students.find(
      (s) =>
        (user?.student_id && (s.id === user.student_id || s.student_id === user.student_id || s.roll_no === user.student_id || `STU-${s.roll_no}` === user.student_id)) ||
        (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower) ||
        (user?.id && s.id === user.id)
    )
  }, [role, user, students])

  const studentCourse = studentRecord?.course || (user as any)?.course || 'B.Tech'
  const studentBranch = studentRecord?.branch || (user as any)?.branch || 'ECE'
  const studentSemester = studentRecord?.semester || (user as any)?.semester || 'Semester 3'
  const studentSection = studentRecord?.section || (user as any)?.section || 'Section A'

  // Teacher profile and assigned classes resolution
  const teacherRecord = useMemo(() => {
    if (role !== 'teacher') return null
    return getTeacherForUser(user, teachers, classes)
  }, [role, user, teachers, classes])

  const teacherAssignedClasses = useMemo(() => {
    return teacherRecord?.assigned_classes || []
  }, [teacherRecord])

  const teacherAssignedClassRecords = useMemo(() => {
    if (role !== 'teacher') return []
    return getAssignedClassRecordsForTeacher(user, teachers, classes)
  }, [role, user, teachers, classes])

  const teacherId = (user as any)?.teacher_id || user?.id || teacherRecord?.id || 'TCH-2026-0001'
  const teacherName = user?.name || teacherRecord?.name || 'Faculty Member'

  // Filter & Search states
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('All')
  const [selectedBranch, setSelectedBranch] = useState<string>('All')
  const [selectedYear, setSelectedYear] = useState<string>('All')

  // Modals state
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null)
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Fields
  const [formClassId, setFormClassId] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formCourse, setFormCourse] = useState('B.Tech')
  const [formBranch, setFormBranch] = useState('ECE')
  const [formSemester, setFormSemester] = useState('Semester 3')
  const [formSection, setFormSection] = useState('Section A')
  const [formSubject, setFormSubject] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [formAssignmentDate, setFormAssignmentDate] = useState(new Date().toISOString().split('T')[0])
  const [formDueDate, setFormDueDate] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formAttachmentUrl, setFormAttachmentUrl] = useState('')
  const [formAttachmentType, setFormAttachmentType] = useState<'PDF' | 'Link' | 'File'>('PDF')
  const [formAttachmentName, setFormAttachmentName] = useState('')

  // Dynamically calculate branches for selected course in form
  const availableBranchesInForm = useMemo(() => {
    if (role === 'teacher' && teacherAssignedClassRecords.length > 0) {
      const branchesForCourse = teacherAssignedClassRecords
        .filter((c) => c.course === formCourse)
        .map((c) => c.branch)
      return Array.from(new Set(['Common Subject', ...branchesForCourse]))
    }
    const courseBranches = branchesByCourse[formCourse] || []
    return ['Common Subject', ...courseBranches]
  }, [formCourse, branchesByCourse, role, teacherAssignedClassRecords])

  // Dynamically calculate semesters based on course in form
  const availableSemestersInForm = useMemo(() => {
    if (role === 'teacher' && teacherAssignedClassRecords.length > 0) {
      const semsForCourse = teacherAssignedClassRecords
        .filter((c) => c.course === formCourse)
        .map((c) => c.semester)
      if (semsForCourse.length > 0) return Array.from(new Set(semsForCourse))
    }
    if (formCourse === 'MBA') return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4']
    if (formCourse === 'Diploma') return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6']
    return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']
  }, [formCourse, role, teacherAssignedClassRecords])

  // Dynamically calculate available subjects based on Course + Branch + Semester
  const availableSubjectsInForm = useMemo(() => {
    const key = `${formCourse}-${formBranch}-${formSemester}`
    const list = SUBJECT_OPTIONS[key]
    if (list && list.length > 0) return list
    return ['Mathematics', 'Programming', 'Electronics', 'Physics', 'Management', 'Other']
  }, [formCourse, formBranch, formSemester])

  // Handle Course Change in Form -> Update Branch & Semester dynamically
  const handleFormCourseChange = (newCourse: string) => {
    setFormCourse(newCourse)
    if (role === 'teacher' && teacherAssignedClassRecords.length > 0) {
      const match = teacherAssignedClassRecords.find((c) => c.course === newCourse)
      if (match) {
        setFormClassId(match.id)
        setFormBranch(match.branch)
        setFormSemester(match.semester)
        setFormSection(match.section)
        setFormSubject('')
        return
      }
    }
    const newBranches = branchesByCourse[newCourse] || []
    const firstBranch = newBranches[0] || 'Common Subject'
    setFormBranch(firstBranch)
    setFormSemester('Semester 1')
    setFormSubject('')
  }

  // Role-based filtering of assignments
  const visibleAssignments = useMemo(() => {
    if (isParent) return []

    let list = assignments

    // 1. Role level filtering
    if (role === 'student') {
      list = getStudentAssignments(studentCourse, studentBranch, studentSemester, studentSection)
    } else if (role === 'teacher') {
      list = getTeacherAssignments(
        teacherAssignedClassRecords.length > 0 ? teacherAssignedClassRecords : teacherAssignedClasses,
        teacherName || teacherId,
        classes
      )
    }

    // 2. Filter dropdowns
    if (selectedCourse !== 'All') {
      list = list.filter((a) => a.course === selectedCourse)
    }
    if (selectedBranch !== 'All') {
      list = list.filter((a) => isBranchMatch(a.branch, selectedBranch) || (selectedBranch === 'Common Subject' && a.is_common_subject))
    }
    if (selectedYear !== 'All') {
      list = list.filter((a) => {
        if (a.year && a.year !== 'all') {
          return a.year.toLowerCase() === selectedYear.toLowerCase()
        }
        if (selectedYear === '1st Year') return ['Semester 1', 'Semester 2'].includes(a.semester)
        if (selectedYear === '2nd Year') return ['Semester 3', 'Semester 4'].includes(a.semester)
        if (selectedYear === '3rd Year') return ['Semester 5', 'Semester 6'].includes(a.semester)
        if (selectedYear === '4th Year') return ['Semester 7', 'Semester 8'].includes(a.semester)
        return true
      })
    }

    // 3. Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.teacher_name.toLowerCase().includes(q)
      )
    }

    return list
  }, [
    assignments,
    role,
    isParent,
    studentCourse,
    studentBranch,
    studentSemester,
    studentSection,
    teacherAssignedClasses,
    teacherAssignedClassRecords,
    classes,
    teacherId,
    teacherName,
    selectedCourse,
    selectedBranch,
    selectedYear,
    search,
    getStudentAssignments,
    getTeacherAssignments,
  ])

  // Calculated stats for summary metrics cards
  const assignmentStats = useMemo(() => {
    const total = visibleAssignments.length
    const active = visibleAssignments.filter((a) => a.status === 'active' || !a.status).length
    const completed = visibleAssignments.filter((a) => a.status === 'completed').length
    const overdue = visibleAssignments.filter((a) => a.status === 'overdue').length
    return { total, active, completed, overdue }
  }, [visibleAssignments])

  // Open modal for NEW assignment
  const handleOpenNewModal = () => {
    if (role === 'teacher') {
      if (teacherAssignedClassRecords.length === 0 && teacherAssignedClasses.length === 0) {
        toast({
          type: 'error',
          title: 'No Class Assigned',
          description: 'You are not assigned to any class. Please contact your administrator to assign classes.',
        })
        return
      }
      const firstCls = teacherAssignedClassRecords[0]
      setEditingAssignment(null)
      setFormTitle('')
      setFormClassId(firstCls ? firstCls.id : '')
      setFormCourse(firstCls ? firstCls.course : 'B.Tech')
      setFormBranch(firstCls ? firstCls.branch : 'ECE')
      setFormSemester(firstCls ? firstCls.semester : 'Semester 1')
      setFormSection(firstCls ? firstCls.section : 'Section A')
      setFormSubject('')
      setCustomSubject('')
      setFormAssignmentDate(new Date().toISOString().split('T')[0])
      setFormDueDate('')
      setFormDescription('')
      setFormAttachmentUrl('')
      setFormAttachmentType('PDF')
      setFormAttachmentName('')
      setShowAddEditModal(true)
      return
    }

    setEditingAssignment(null)
    setFormTitle('')
    setFormClassId('')
    setFormCourse('B.Tech')
    setFormBranch('ECE')
    setFormSemester('Semester 3')
    setFormSection('Section A')
    setFormSubject('Digital Electronics')
    setCustomSubject('')
    setFormAssignmentDate(new Date().toISOString().split('T')[0])
    setFormDueDate('')
    setFormDescription('')
    setFormAttachmentUrl('')
    setFormAttachmentType('PDF')
    setFormAttachmentName('')
    setShowAddEditModal(true)
  }

  // Open modal for EDIT assignment
  const handleOpenEditModal = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setFormTitle(assignment.title)
    setFormClassId(assignment.class_id || '')
    setFormCourse(assignment.course)
    setFormBranch(assignment.is_common_subject ? 'Common Subject' : assignment.branch)
    setFormSemester(assignment.semester)
    setFormSection(assignment.section || 'All Sections')
    setFormSubject(assignment.subject)
    setFormAssignmentDate(assignment.assignment_date || new Date().toISOString().split('T')[0])
    setFormDueDate(assignment.due_date)
    setFormDescription(assignment.description || '')
    setFormAttachmentUrl(assignment.attachment_url || '')
    setFormAttachmentType(assignment.attachment_type || 'PDF')
    setFormAttachmentName(assignment.attachment_name || '')
    setShowAddEditModal(true)
  }

  // Handle Save Assignment submit
  const handleSave = async () => {
    if (!formTitle.trim()) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please enter an assignment title.' })
      return
    }
    if (!formCourse) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please select a Course.' })
      return
    }
    if (!formBranch) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please select a Branch.' })
      return
    }
    if (!formSemester) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please select a Semester.' })
      return
    }
    const finalSubject = formSubject === 'Other' ? customSubject : formSubject
    if (!finalSubject.trim()) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please select or enter a Subject.' })
      return
    }
    if (!formAssignmentDate) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please enter the Assignment Date.' })
      return
    }
    if (!formDueDate) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please enter the Due Date.' })
      return
    }

    if (role === 'teacher' && formBranch !== 'Common Subject' && teacherAssignedClassRecords.length > 0) {
      const isValidTarget = teacherAssignedClassRecords.some((c) => {
        const cMatch = c.course.toLowerCase() === formCourse.toLowerCase()
        const bMatch = c.branch.toLowerCase() === formBranch.toLowerCase()
        return cMatch && bMatch
      })
      if (!isValidTarget) {
        toast({ type: 'error', title: 'Unauthorized Class', description: 'Teachers can only create assignments for their assigned classes.' })
        return
      }
    }

    let resolvedClassId = formClassId || editingAssignment?.class_id
    let matchedClass: any = null

    if (role === 'teacher' && teacherAssignedClassRecords.length > 0) {
      matchedClass = teacherAssignedClassRecords.find(
        (c) => c.course === formCourse && c.branch === formBranch && (c.semester === formSemester || c.section === formSection)
      ) || teacherAssignedClassRecords.find((c) => c.course === formCourse && c.branch === formBranch) || teacherAssignedClassRecords[0]
      resolvedClassId = resolvedClassId || matchedClass?.id
    }

    if (!matchedClass && classes.length > 0) {
      matchedClass = classes.find(
        (c) => c.course === formCourse && c.branch === formBranch && (c.semester === formSemester || !c.semester) && (formSection === 'All Sections' || c.section === formSection)
      ) || classes.find((c) => c.course === formCourse && c.branch === formBranch)
      resolvedClassId = resolvedClassId || matchedClass?.id
    }

    const resolvedYear = matchedClass?.year || (['Semester 1', 'Semester 2'].includes(formSemester) ? '1st Year' : ['Semester 3', 'Semester 4'].includes(formSemester) ? '2nd Year' : ['Semester 5', 'Semester 6'].includes(formSemester) ? '3rd Year' : ['Semester 7', 'Semester 8'].includes(formSemester) ? '4th Year' : '1st Year')

    setIsSubmitting(true)

    try {
      const isCommon = formBranch === 'Common Subject'
      await saveAssignment({
        id: editingAssignment?.id,
        class_id: resolvedClassId,
        teacher_id: role === 'teacher' ? teacherId : editingAssignment?.teacher_id,
        title: formTitle.trim(),
        course: formCourse,
        branch: isCommon ? 'Common Subject' : formBranch,
        is_common_subject: isCommon,
        semester: formSemester,
        section: formSection,
        year: resolvedYear,
        subject: finalSubject.trim(),
        assignment_date: formAssignmentDate,
        due_date: formDueDate,
        description: formDescription.trim(),
        attachment_url: formAttachmentUrl.trim() || undefined,
        attachment_type: formAttachmentType,
        attachment_name: formAttachmentName.trim() || (formAttachmentUrl ? 'Assignment Document' : undefined),
        created_by: editingAssignment ? editingAssignment.created_by : (role === 'teacher' ? teacherId : 'ADMIN-001'),
        teacher_name: editingAssignment ? editingAssignment.teacher_name : (role === 'teacher' ? teacherName : 'Dept. Head / Admin'),
        college_id: editingAssignment?.college_id || user?.college_id || user?.school_id,
      })

      toast({
        type: 'success',
        title: editingAssignment ? 'Assignment Updated' : 'Assignment Created',
        description: `Successfully ${editingAssignment ? 'updated' : 'created'} assignment "${formTitle}".`,
      })

      setShowAddEditModal(false)
    } catch (e: any) {
      toast({ type: 'error', title: 'Error', description: e.message || 'Failed to save assignment. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete assignment
  const handleDeleteConfirm = async () => {
    if (!deletingAssignmentId) return
    try {
      await deleteAssignment(deletingAssignmentId)
      toast({ type: 'success', title: 'Assignment Deleted', description: 'The assignment has been successfully removed.' })
      setShowDeleteModal(false)
      setDeletingAssignmentId(null)
    } catch (e: any) {
      toast({ type: 'error', title: 'Delete Failed', description: e.message || 'Failed to delete assignment' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Prominent Dashboard Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 border border-brand-200/60 dark:border-brand-800/60 shadow-sm">
              <BookOpen className="h-6 w-6" />
            </div>
            Assignments Dashboard
          </h1>
          <p className="text-sm font-medium text-ink-400 mt-1.5">
            {role === 'student'
              ? `Enrolled Academic Roster: ${studentCourse} • ${studentBranch} • ${studentSemester} (${studentSection})`
              : `${visibleAssignments.length} active assignments configured in academic structure`}
          </p>
        </div>
        {role !== 'student' && (
          <Button onClick={handleOpenNewModal} className="bg-brand-600 hover:bg-brand-700 text-white shadow-md text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shrink-0">
            <Plus className="h-4 w-4" /> New Assignment
          </Button>
        )}
      </div>

      {/* 4 Stat Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Assignments"
          value={assignmentStats.total}
          icon={BookOpen}
          tone="brand"
          caption="Total active roster items"
        />
        <StatCard
          label="Active Assignments"
          value={assignmentStats.active}
          icon={Clock}
          tone="warning"
          caption="Open for submission"
        />
        <StatCard
          label="Completed"
          value={assignmentStats.completed}
          icon={CheckCircle2}
          tone="success"
          caption="Marked completed / evaluated"
        />
        <StatCard
          label="Overdue / Pending"
          value={assignmentStats.overdue}
          icon={AlertCircle}
          tone="danger"
          caption="Past due deadline"
        />
      </div>

      {/* Search & Filter Bar ([ All Course ] [ All Branch ] [ All Year ]) */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, subject, faculty..."
            className="w-full sm:w-72"
          />

          <Select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value)
              setSelectedBranch('All')
            }}
            options={[
              { value: 'All', label: 'All Course' },
              ...courses.map((c) => ({ value: c, label: c })),
            ]}
            className="w-44"
          />

          <Select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            options={[
              { value: 'All', label: 'All Branch' },
              { value: 'Common Subject', label: 'Common Subject' },
              ...((selectedCourse !== 'All' ? branchesByCourse[selectedCourse] : []) || []).map((b) => ({
                value: b,
                label: b,
              })),
            ]}
            className="w-48"
          />

          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            options={[
              { value: 'All', label: 'All Year' },
              { value: '1st Year', label: '1st Year' },
              { value: '2nd Year', label: '2nd Year' },
              { value: '3rd Year', label: '3rd Year' },
              { value: '4th Year', label: '4th Year' },
            ]}
            className="w-44"
          />
        </div>

        {(search || selectedCourse !== 'All' || selectedBranch !== 'All' || selectedYear !== 'All') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('')
              setSelectedCourse('All')
              setSelectedBranch('All')
              setSelectedYear('All')
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Assignments Cards Grid (SPACIOUS 3-COLUMN GRID & RICH HIGH-VISIBILITY TYPOGRAPHY) */}
      {visibleAssignments.length === 0 ? (
        <div className="bg-surface rounded-2xl shadow-[var(--shadow-soft)] p-12 text-center border border-dashed border-border">
          <div className="p-4 rounded-full bg-canvas text-ink-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-border">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-ink-900 mb-1">No Assignments Found</h3>
          <p className="text-sm text-ink-400 max-w-md mx-auto mb-5">
            No assignments match your selected search query or course filters. Adjust filters or create a new assignment entry.
          </p>
          {role !== 'student' && (
            <Button variant="ghost" onClick={handleOpenNewModal} className="text-brand-600 font-semibold border border-brand-200 hover:bg-brand-50">
              <Plus className="h-4 w-4 mr-2" /> Create Assignment Now
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleAssignments.map((hw) => {
            const submissionPercentage = hw.total_students > 0 ? Math.round((hw.submitted_count / hw.total_students) * 100) : 0
            return (
              <div
                key={hw.id}
                className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  {/* Status & Subject badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 truncate">
                        {hw.subject}
                      </span>
                      {hw.is_common_subject && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                          Common
                        </span>
                      )}
                    </div>
                    <StatusPill {...(statusMap[hw.status] || statusMap.active)} />
                  </div>

                  {/* 1. Title */}
                  <h3 className="text-base font-semibold text-ink-900 group-hover:text-brand-600 transition-colors leading-snug line-clamp-1">
                    {hw.title}
                  </h3>

                  {/* 2. Subject / Class Information */}
                  <div className="text-xs text-ink-500 font-medium flex items-center gap-1.5 flex-wrap">
                    <GraduationCap className="h-3.5 w-3.5 text-ink-400 shrink-0" />
                    <span>{hw.course} • {hw.branch} • {hw.semester} {hw.section ? `(${hw.section})` : ''}</span>
                  </div>

                  {/* 3. Short description / preview */}
                  <p className="text-xs text-ink-600 line-clamp-2 leading-relaxed bg-canvas/40 p-2.5 rounded-lg border border-border/50">
                    {hw.description || 'No specific description provided.'}
                  </p>
                </div>

                {/* 4. Due date / status / metadata & 5. Actions */}
                <div className="pt-3 mt-3 border-t border-border/60 space-y-3">
                  {/* Due Date & Faculty Name */}
                  <div className="flex items-center justify-between text-xs text-ink-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                      Due: <strong className="text-ink-900 font-semibold">{hw.due_date}</strong>
                    </span>
                    <span className="text-ink-400 font-medium flex items-center gap-1 truncate max-w-[120px]">
                      <User className="h-3.5 w-3.5 text-ink-400 shrink-0" />
                      {hw.teacher_name}
                    </span>
                  </div>

                  {/* Attachment if present */}
                  {hw.attachment_url && (
                    <a
                      href={hw.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg bg-brand-50/60 hover:bg-brand-100/60 dark:bg-brand-950/40 border border-brand-200/50 text-xs text-brand-700 dark:text-brand-300 font-medium transition-colors"
                    >
                      <Paperclip className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                      <span className="truncate flex-1">{hw.attachment_name || 'View Attachment'}</span>
                      <ExternalLink className="h-3 w-3 text-brand-500 shrink-0" />
                    </a>
                  )}

                  {/* Submissions Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-ink-500">
                      <span>Submissions</span>
                      <span className="font-mono text-ink-900 font-semibold">
                        {hw.submitted_count} / {hw.total_students} ({submissionPercentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-canvas rounded-full overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-brand-600 rounded-full transition-all duration-300"
                        style={{ width: `${submissionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setViewingAssignment(hw)
                        setShowViewModal(true)
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-ink-600 hover:text-brand-600 hover:bg-canvas transition-colors flex items-center gap-1 border border-border/60"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                    {role !== 'student' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(hw)}
                          className="p-1.5 rounded-lg text-ink-600 hover:text-brand-600 hover:bg-canvas transition-colors border border-border/60"
                          title="Edit Assignment"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingAssignmentId(hw.id)
                            setShowDeleteModal(true)
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors border border-border/60 hover:border-rose-200"
                          title="Delete Assignment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* NEW / EDIT ASSIGNMENT MODAL */}
      <Modal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddEditModal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting} className="bg-brand-600 hover:bg-brand-700 text-white font-bold">
              {isSubmitting ? 'Saving...' : editingAssignment ? 'Save Changes' : 'Create Assignment'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-ink-900">
          {/* Assigned Class Selection for Teachers */}
          {role === 'teacher' && teacherAssignedClassRecords.length > 0 && (
            <FormField label="Target Assigned Class" required>
              <Select
                value={formClassId}
                onChange={(e) => {
                  const targetId = e.target.value
                  setFormClassId(targetId)
                  const selectedCls = teacherAssignedClassRecords.find((c) => c.id === targetId)
                  if (selectedCls) {
                    setFormCourse(selectedCls.course)
                    setFormBranch(selectedCls.branch)
                    setFormSemester(selectedCls.semester)
                    setFormSection(selectedCls.section)
                  }
                }}
                options={teacherAssignedClassRecords.map((c) => ({
                  value: c.id,
                  label: c.name || `${c.course} ${c.branch} - ${c.year} - ${c.section}`,
                }))}
              />
            </FormField>
          )}

          {/* 1. Assignment Title */}
          <FormField label="Assignment Title" required>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Data Structures Unit 1 Assignment"
              className="text-sm font-medium"
            />
          </FormField>

          {/* 2. Course & 3. Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Course" required>
              <Select
                value={formCourse}
                onChange={(e) => handleFormCourseChange(e.target.value)}
                options={courses.map((c) => ({ value: c, label: c }))}
              />
            </FormField>

            <FormField label="Branch" required>
              <Select
                value={formBranch}
                onChange={(e) => {
                  setFormBranch(e.target.value)
                  setFormSubject('')
                }}
                options={availableBranchesInForm.map((b) => ({ value: b, label: b }))}
              />
            </FormField>
          </div>

          {/* 4. Semester & 5. Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Semester" required>
              <Select
                value={formSemester}
                onChange={(e) => {
                  setFormSemester(e.target.value)
                  setFormSubject('')
                }}
                options={availableSemestersInForm.map((s) => ({ value: s, label: s }))}
              />
            </FormField>

            <FormField label="Section">
              <Select
                value={formSection}
                onChange={(e) => setFormSection(e.target.value)}
                options={[
                  { value: 'All Sections', label: 'All Sections' },
                  { value: 'Section A', label: 'Section A' },
                  { value: 'Section B', label: 'Section B' },
                  { value: 'Section C', label: 'Section C' },
                  { value: 'Section D', label: 'Section D' },
                ]}
              />
            </FormField>
          </div>

          {/* 6. Subject */}
          <FormField label="Subject" required>
            <Select
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              placeholder="Select subject"
              options={[
                ...availableSubjectsInForm.map((sub) => ({ value: sub, label: sub })),
                { value: 'Other', label: '+ Enter Custom Subject' },
              ]}
            />
          </FormField>

          {formSubject === 'Other' && (
            <FormField label="Custom Subject Name" required>
              <Input
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter custom subject name"
              />
            </FormField>
          )}

          {/* 7. Assignment Date & 8. Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Assignment Date" required>
              <Input
                type="date"
                value={formAssignmentDate}
                onChange={(e) => setFormAssignmentDate(e.target.value)}
              />
            </FormField>

            <FormField label="Due Date" required>
              <Input
                type="date"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
              />
            </FormField>
          </div>

          {/* 9. Description */}
          <FormField label="Description">
            <Textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Assignment instructions, guidelines, syllabus chapters covered..."
            />
          </FormField>

          {/* 10. Attachment / Material */}
          <div className="p-4 bg-canvas rounded-xl border border-border space-y-3">
            <span className="text-xs font-bold text-ink-900 uppercase tracking-wider block">Attachment / Reference Material</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Type">
                <Select
                  value={formAttachmentType}
                  onChange={(e) => setFormAttachmentType(e.target.value as any)}
                  options={[
                    { value: 'PDF', label: 'PDF Document' },
                    { value: 'Link', label: 'External URL / Link' },
                    { value: 'File', label: 'Other File' },
                  ]}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Document Title / Name">
                  <Input
                    value={formAttachmentName}
                    onChange={(e) => setFormAttachmentName(e.target.value)}
                    placeholder="e.g. Unit 1 Reference Sheet.pdf"
                  />
                </FormField>
              </div>
            </div>

            <FormField label="URL / File Link">
              <Input
                value={formAttachmentUrl}
                onChange={(e) => setFormAttachmentUrl(e.target.value)}
                placeholder="https://... or PDF document URL"
              />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* VIEW ASSIGNMENT MODAL */}
      {viewingAssignment && (
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setViewingAssignment(null)
          }}
          title="Assignment Details"
          footer={
            <Button onClick={() => setShowViewModal(false)} className="bg-brand-600 text-white font-bold">
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-ink-900">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                {viewingAssignment.subject}
              </span>
              <StatusPill {...(statusMap[viewingAssignment.status] || statusMap.active)} />
            </div>

            <div>
              <h2 className="text-xl font-bold font-display text-ink-900">{viewingAssignment.title}</h2>
              <p className="text-xs sm:text-sm text-ink-600 mt-1">
                Target Roster: <strong className="text-ink-900">{viewingAssignment.course} • {viewingAssignment.branch} • {viewingAssignment.semester} {viewingAssignment.section ? `• ${viewingAssignment.section}` : ''}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm bg-canvas p-4 rounded-xl border border-border">
              <div>
                <span className="text-ink-400 block text-xs">Assigned Date:</span>
                <span className="font-bold text-ink-900">{viewingAssignment.assignment_date || 'N/A'}</span>
              </div>
              <div>
                <span className="text-ink-400 block text-xs">Due Date:</span>
                <span className="font-bold text-ink-900">{viewingAssignment.due_date}</span>
              </div>
              <div>
                <span className="text-ink-400 block text-xs">Assigned By:</span>
                <span className="font-bold text-ink-900">{viewingAssignment.teacher_name}</span>
              </div>
              <div>
                <span className="text-ink-400 block text-xs">Submissions:</span>
                <span className="font-bold text-brand-600">{viewingAssignment.submitted_count} / {viewingAssignment.total_students}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">Instructions</h4>
              <p className="text-sm text-ink-900 font-normal whitespace-pre-wrap leading-relaxed bg-surface p-4 rounded-xl border border-border">
                {viewingAssignment.description || 'No detailed instructions provided.'}
              </p>
            </div>

            {viewingAssignment.attachment_url && (
              <div>
                <h4 className="text-xs font-bold text-ink-600 uppercase tracking-wider mb-1.5">Attachment Material</h4>
                <a
                  href={viewingAssignment.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100/70 p-3 rounded-xl border border-brand-200 dark:border-brand-800/60 w-full transition-colors"
                >
                  <FileText className="h-4 w-4 text-brand-600 shrink-0" />
                  <span className="flex-1 truncate">{viewingAssignment.attachment_name || 'Download Attachment Document'}</span>
                  <ExternalLink className="h-4 w-4 text-brand-500 shrink-0" />
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingAssignmentId(null)
        }}
        title="Confirm Deletion"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false)
                setDeletingAssignmentId(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} className="bg-rose-600 hover:bg-rose-700 text-white font-bold">
              Delete Assignment
            </Button>
          </>
        }
      >
        <div className="py-2 text-ink-900">
          <p className="text-sm text-ink-600">
            Are you sure you want to delete this assignment? This action cannot be undone and will remove the record for all assigned students.
          </p>
        </div>
      </Modal>
    </div>
  )
}
