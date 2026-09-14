import { useState, useMemo } from 'react'
import {
  Tabs,
  DataTable,
  Button,
  SearchInput,
  Modal,
  Select,
  StatusPill,
  EmptyState,
  FormField,
  Input,
  Textarea,
} from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import {
  History as HistoryIcon,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  FileSpreadsheet,
  IndianRupee,
  Award,
  ShieldAlert,
  Plus,
  Send,
} from 'lucide-react'
import type { Column } from '../../components/ui/DataTable'
import { useAuth } from '../../app/providers/AuthProvider'
import {
  useAcademicStore,
  getTeacherForUser,
  isBranchMatch,
  COURSES,
  YEARS,
  BRANCHES_BY_COURSE,
  type TeacherRecord,
} from '../../lib/academicStore'
import { useFeeStore } from '../../lib/feeStore'
import { useExamStore } from '../../lib/examStore'
import { useSuspensionStore, type SuspensionRecord } from '../../lib/suspensionStore'
import { exportToCSV } from '../../lib/exportUtils'
import { formatCurrency } from '../../lib/formatCurrency'

// ===== TYPES & DOMAIN SCHEMAS FOR ATTENDANCE =====
export interface AttendanceStudentEntry {
  id: string
  roll_no: string
  name: string
  status: 'present' | 'absent' | 'late' | 'leave'
  remark?: string
}

export interface AttendanceHistorySession {
  id: string
  date: string
  course: string
  year: string
  branch: string
  semester: string
  section: string
  lecture: string
  students: AttendanceStudentEntry[]
  created_at: string
}

function checkTeacherPermission(
  teacher: TeacherRecord | null,
  target: { course: string; branch: string; year: string; section?: string }
): boolean {
  if (!teacher) return false
  const targetBranch = (target.branch || '').toLowerCase()
  const targetCourse = (target.course || '').toLowerCase()
  const targetYear = (target.year || '').toLowerCase()

  if (Array.isArray(teacher.assigned_classes) && teacher.assigned_classes.length > 0) {
    return teacher.assigned_classes.some((assignedStr) => {
      const norm = assignedStr.toLowerCase()
      const matchCourse = !targetCourse || norm.includes(targetCourse)
      const matchBranch = !targetBranch || norm.includes(targetBranch)
      const matchYear = !targetYear || norm.includes(targetYear)
      return matchCourse && matchBranch && matchYear
    })
  }

  const teacherCourse = (teacher.course || '').toLowerCase()
  const teacherDept = (teacher.department || '').toLowerCase()

  return teacherCourse.includes(targetCourse) && teacherDept.includes(targetBranch)
}

export function HistoryPage() {
  const { toast } = useToast()
  const { user, role } = useAuth()
  const isStudent = role === 'student'
  const isParent = role === 'parent'
  const isAdmin = role === 'admin' || role === 'super_admin'

  // Stores
  const { getAttendance, students, teachers, setAttendanceRecord, deleteAttendanceSession } = useAcademicStore()
  const { studentFees } = useFeeStore()
  const { results, saveSingleResult } = useExamStore()
  const { suspensions, saveSuspension, deleteSuspension } = useSuspensionStore()

  // Active Category Tab
  const [activeCategory, setActiveCategory] = useState('attendance')

  // History Options
  const categoryTabs = [
    { id: 'attendance', label: 'Attendance History' },
    { id: 'fees', label: 'Fee History' },
    { id: 'exams', label: 'Exam History' },
    { id: 'suspensions', label: 'Suspension History' },
  ]

  const currentTeacher = useMemo(() => {
    if (role !== 'teacher') return null
    return getTeacherForUser(user, teachers)
  }, [user, role, teachers])

  // Resolve target student for Student / Parent roles
  const targetStudent = useMemo(() => {
    const userEmailLower = user?.email?.toLowerCase().trim()
    if (isStudent) {
      const sId = user?.student_id || user?.id
      return students.find(
        (s) =>
          (sId &&
            (s.id === sId ||
              s.student_id === sId ||
              s.roll_no === sId ||
              `STU-${s.roll_no}` === sId ||
              sId.replace(/^STU-/i, '') === s.roll_no)) ||
          (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower) ||
          (user?.id && s.id === user.id)
      )
    }
    if (isParent) {
      const cId = user?.child_student_id || user?.student_id
      return students.find(
        (s) =>
          (cId &&
            (s.id === cId ||
              s.student_id === cId ||
              s.roll_no === cId ||
              `STU-${s.roll_no}` === cId ||
              cId.replace(/^STU-/i, '') === s.roll_no)) ||
          (userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower) ||
          (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower)
      )
    }
    return null
  }, [isStudent, isParent, user, students])

  // Shared Global Filters State
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Branch options based on selected course
  const availableBranchesForFilter = useMemo(() => {
    if (courseFilter && BRANCHES_BY_COURSE[courseFilter]) {
      return BRANCHES_BY_COURSE[courseFilter]
    }
    const set = new Set<string>()
    Object.values(BRANCHES_BY_COURSE).forEach((list) => list.forEach((b) => set.add(b)))
    return Array.from(set)
  }, [courseFilter])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // ==================== 1. ATTENDANCE HISTORY DATA & MODALS ====================
  const [lectureFilter] = useState('')
  const [viewSession, setViewSession] = useState<AttendanceHistorySession | null>(null)
  const [editSession, setEditSession] = useState<AttendanceHistorySession | null>(null)
  const [editStudents, setEditStudents] = useState<AttendanceStudentEntry[]>([])
  const [deleteSessionModal, setDeleteSessionModal] = useState<AttendanceHistorySession | null>(null)

  const historySessions = useMemo(() => {
    const rawAttendance = getAttendance()
    const sessionMap = new Map<string, AttendanceHistorySession>()

    rawAttendance.forEach((entry) => {
      const sCourse = entry.course || 'B.Tech'
      const sBranch = entry.branch || 'ECE'
      const sYear = entry.year || '1st Year'
      const sSection = (entry.section || 'A').replace(/^Section\s+/i, '').trim() || 'A'
      const sLecture = entry.lecture || 'L-1'
      const sDate = entry.date

      const sessionKey = `${sDate}_${sCourse}_${sBranch}_${sYear}_${sSection}_${sLecture}`

      if (!sessionMap.has(sessionKey)) {
        sessionMap.set(sessionKey, {
          id: sessionKey,
          date: sDate,
          course: sCourse,
          branch: sBranch,
          year: sYear,
          semester: entry.semester || 'Semester 1',
          section: sSection,
          lecture: sLecture,
          created_at: entry.created_at || new Date().toISOString(),
          students: [],
        })
      }

      const session = sessionMap.get(sessionKey)!
      const matchingStudent = students.find(
        (s) =>
          s.id === entry.student_id ||
          s.student_id === entry.student_id ||
          s.roll_no === entry.roll_no ||
          `STU-${s.roll_no}` === entry.roll_no
      )

      session.students.push({
        id: entry.student_id,
        roll_no: entry.roll_no || matchingStudent?.roll_no || '',
        name: entry.student_name || matchingStudent?.name || 'STUDENT',
        status: entry.status,
        remark: entry.remarks,
      })
    })

    let sessionList = Array.from(sessionMap.values())

    if (role === 'teacher' && currentTeacher) {
      sessionList = sessionList.filter((s) => checkTeacherPermission(currentTeacher, { course: s.course, branch: s.branch, year: s.year, section: s.section }))
    } else if (isStudent || isParent) {
      if (targetStudent) {
        const tId = targetStudent.id
        const tRollNo = targetStudent.roll_no
        sessionList = sessionList.filter((s) =>
          s.students.some(
            (st) =>
              st.id === tId ||
              st.roll_no === tRollNo ||
              st.roll_no === `STU-${tRollNo}` ||
              (tRollNo && st.roll_no && st.roll_no.endsWith(tRollNo))
          )
        )
      } else {
        sessionList = []
      }
    }

    return sessionList.sort((a, b) => b.date.localeCompare(a.date))
  }, [getAttendance, students, teachers, role, currentTeacher, isStudent, isParent, targetStudent])

  const filteredAttendanceSessions = useMemo(() => {
    return historySessions.filter((s) => {
      if (dateFilter && s.date !== dateFilter) return false
      if (courseFilter && s.course !== courseFilter) return false
      if (yearFilter && s.year !== yearFilter) return false
      if (branchFilter && !isBranchMatch(s.branch, branchFilter)) return false
      if (semesterFilter && s.semester !== semesterFilter) return false
      if (sectionFilter && s.section !== sectionFilter) return false
      if (lectureFilter && s.lecture !== lectureFilter) return false

      if (search) {
        const query = search.toLowerCase()
        const matchMeta =
          s.course.toLowerCase().includes(query) ||
          s.branch.toLowerCase().includes(query) ||
          s.semester.toLowerCase().includes(query) ||
          s.section.toLowerCase().includes(query) ||
          s.date.includes(query)
        const matchStudent = s.students.some(
          (st) => st.name.toLowerCase().includes(query) || st.roll_no.toLowerCase().includes(query)
        )
        if (!matchMeta && !matchStudent) return false
      }
      return true
    })
  }, [historySessions, search, dateFilter, courseFilter, yearFilter, branchFilter, semesterFilter, sectionFilter, lectureFilter])

  // Attendance Handlers
  const handleOpenEditAttendance = (session: AttendanceHistorySession) => {
    if (role === 'teacher') {
      const isAllowed = checkTeacherPermission(currentTeacher, { course: session.course, branch: session.branch, year: session.year, section: session.section })
      if (!isAllowed) {
        toast({ type: 'error', title: 'Permission Denied', description: 'You can only edit attendance for your assigned classes.' })
        return
      }
    }
    setEditSession(session)
    setEditStudents(JSON.parse(JSON.stringify(session.students)))
  }

  const handleSaveEditAttendance = async () => {
    if (!editSession) return
    try {
      const className = `${editSession.course} ${editSession.branch} - ${editSession.year} - Section ${editSession.section}`
      const collegeId = user?.college_id || user?.school_id || 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f'

      const promises = editStudents.map((st) =>
        setAttendanceRecord({
          id: `att_${st.id}_${editSession.date}_${editSession.lecture}`,
          student_id: st.id,
          student_name: st.name,
          roll_no: st.roll_no,
          course: editSession.course,
          branch: editSession.branch,
          year: editSession.year,
          semester: editSession.semester,
          section: editSession.section,
          lecture: editSession.lecture,
          class_name: className,
          date: editSession.date,
          status: st.status,
          remarks: st.remark,
          marked_by: user?.name || user?.email || (role === 'teacher' ? 'Teacher' : 'Admin'),
          college_id: collegeId,
        })
      )

      await Promise.all(promises)
      toast({ type: 'success', title: 'Attendance Record Updated', description: `Updated ${editSession.course} - ${editSession.branch} (${editSession.date})` })
      setEditSession(null)
    } catch (err: any) {
      toast({ type: 'error', title: 'Update Failed', description: err.message || 'Failed to update attendance session' })
    }
  }

  const handleConfirmDeleteAttendance = async () => {
    if (!deleteSessionModal) return
    try {
      await deleteAttendanceSession({
        date: deleteSessionModal.date,
        course: deleteSessionModal.course,
        branch: deleteSessionModal.branch,
        year: deleteSessionModal.year,
        semester: deleteSessionModal.semester,
        section: deleteSessionModal.section,
        lecture: deleteSessionModal.lecture,
      })
      toast({ type: 'info', title: 'Attendance Record Deleted', description: `Deleted session ${deleteSessionModal.branch} (${deleteSessionModal.date})` })
      setDeleteSessionModal(null)
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', description: err.message || 'Failed to delete attendance session' })
    }
  }

  // ==================== 2. FEE HISTORY DATA & MODALS ====================
  const [viewFeeModal, setViewFeeModal] = useState<any>(null)

  const filteredFeeHistory = useMemo(() => {
    return studentFees.filter((sf) => {
      if (isStudent || isParent) {
        if (!targetStudent) return false
        if (
          sf.student_id !== targetStudent.id &&
          sf.student_id !== targetStudent.student_id &&
          sf.roll_no !== targetStudent.roll_no
        )
          return false
      } else if (role === 'teacher' && currentTeacher) {
        if (
          !checkTeacherPermission(currentTeacher, {
            course: sf.course,
            branch: sf.branch,
            year: sf.year_semester,
            section: sf.section,
          })
        )
          return false
      }
      if (courseFilter && sf.course !== courseFilter) return false
      if (branchFilter && !isBranchMatch(sf.branch, branchFilter)) return false
      if (yearFilter && sf.year_semester !== yearFilter) return false
      if (statusFilter && sf.status !== statusFilter) return false

      if (search) {
        const q = search.toLowerCase()
        const matchName = sf.student_name.toLowerCase().includes(q)
        const matchRoll = sf.roll_no.toLowerCase().includes(q)
        if (!matchName && !matchRoll) return false
      }
      return true
    })
  }, [studentFees, isStudent, isParent, role, currentTeacher, targetStudent, courseFilter, branchFilter, yearFilter, statusFilter, search])

  // ==================== 3. EXAM HISTORY DATA & MODALS ====================
  const [viewExamModal, setViewExamModal] = useState<any>(null)
  const [editExamModal, setEditExamModal] = useState<any>(null)
  const [editObtainedMarks, setEditObtainedMarks] = useState<number>(0)
  const [editMaxMarks, setEditMaxMarks] = useState<number>(100)
  const [editPassingMarks, setEditPassingMarks] = useState<number>(40)
  const [editRemarks, setEditRemarks] = useState<string>('')

  const handleOpenEditExam = (record: any) => {
    setEditExamModal(record)
    setEditObtainedMarks(record.obtained_marks || 0)
    setEditMaxMarks(record.max_marks || 100)
    setEditPassingMarks(record.passing_marks || 40)
    setEditRemarks(record.remarks || '')
  }

  const handleSaveEditExamMarks = async () => {
    if (!editExamModal) return
    try {
      await saveSingleResult({
        id: editExamModal.id,
        obtained_marks: editObtainedMarks,
        max_marks: editMaxMarks,
        passing_marks: editPassingMarks,
        remarks: editRemarks,
      })
      toast({
        type: 'success',
        title: 'Marks Updated Successfully',
        description: `Updated marks for ${editExamModal.student_name} (${editExamModal.subject})`,
      })
      setEditExamModal(null)
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Update Failed',
        description: err.message || 'Failed to update exam marks',
      })
    }
  }

  const filteredExamHistory = useMemo(() => {
    const userEmailLower = user?.email?.toLowerCase().trim()
    const sId = user?.student_id || user?.id || user?.child_student_id
    const rollNo = targetStudent?.roll_no || (user as any)?.roll_no || (sId ? sId.replace(/^STU-/i, '') : '')

    return results.filter((r) => {
      if (isStudent || isParent) {
        const isPub = r.is_published !== false && (r as any).published !== false
        if (!isPub) return false

        const matchStudent =
          (targetStudent && (r.student_id === targetStudent.id || r.student_id === targetStudent.student_id || r.roll_no === targetStudent.roll_no || (targetStudent.email && (r as any).student_email?.toLowerCase() === targetStudent.email.toLowerCase()))) ||
          (sId && (r.student_id === sId || r.student_id?.toLowerCase() === sId.toLowerCase() || r.roll_no === sId || `STU-${r.roll_no}` === sId)) ||
          (rollNo && (r.roll_no === rollNo || r.student_id === rollNo)) ||
          (userEmailLower && ((r as any).student_email?.toLowerCase().trim() === userEmailLower || (r as any).parent_email?.toLowerCase().trim() === userEmailLower))

        if (!matchStudent) return false
      } else if (role === 'teacher' && currentTeacher) {
        if (
          !checkTeacherPermission(currentTeacher, {
            course: r.course,
            branch: r.branch,
            year: r.year,
            section: r.section,
          })
        )
          return false
      }
      if (courseFilter && r.course !== courseFilter) return false
      if (branchFilter && !isBranchMatch(r.branch, branchFilter)) return false
      if (yearFilter && r.year !== yearFilter) return false
      if (semesterFilter && r.semester !== semesterFilter) return false
      if (statusFilter && r.status !== statusFilter) return false

      if (search) {
        const q = search.toLowerCase()
        const matchStudent = r.student_name.toLowerCase().includes(q) || r.roll_no.toLowerCase().includes(q)
        const matchSubject = r.subject.toLowerCase().includes(q)
        if (!matchStudent && !matchSubject) return false
      }
      return true
    })
  }, [results, isStudent, isParent, role, currentTeacher, targetStudent, courseFilter, branchFilter, yearFilter, semesterFilter, statusFilter, search])

  // ==================== 4. SUSPENSION HISTORY DATA & MODALS ====================
  const [showAddSuspensionModal, setShowAddSuspensionModal] = useState(false)
  const [viewSuspensionModal, setViewSuspensionModal] = useState<SuspensionRecord | null>(null)
  const [editingSuspension, setEditingSuspension] = useState<SuspensionRecord | null>(null)
  const [deleteSuspensionModal, setDeleteSuspensionModal] = useState<SuspensionRecord | null>(null)

  // Add / Edit Suspension Form State
  const [suspensionStudentId, setSuspensionStudentId] = useState('')
  const [suspensionCategory, setSuspensionCategory] = useState<SuspensionRecord['category']>('Disciplinary Violation')
  const [suspensionReason, setSuspensionReason] = useState('')
  const [suspensionDesc, setSuspensionDesc] = useState('')
  const [suspensionStartDate, setSuspensionStartDate] = useState(() => new Date().toISOString().split('T')[0])
  const [suspensionEndDate, setSuspensionEndDate] = useState('')
  const [suspensionStatus, setSuspensionStatus] = useState<'Active' | 'Completed' | 'Cancelled'>('Active')
  const [suspensionActionTaken, setSuspensionActionTaken] = useState('')

  // Target Student selected in form
  const selectedSuspensionStudent = useMemo(() => {
    return students.find((s) => s.id === suspensionStudentId) || null
  }, [suspensionStudentId, students])

  const filteredSuspensions = useMemo(() => {
    return suspensions.filter((s) => {
      if (isStudent || isParent) {
        if (!targetStudent) return false
        if (
          s.student_id !== targetStudent.id &&
          s.student_id !== targetStudent.student_id &&
          s.roll_no !== targetStudent.roll_no
        )
          return false
      } else if (role === 'teacher' && currentTeacher) {
        if (
          !checkTeacherPermission(currentTeacher, {
            course: s.course,
            branch: s.branch,
            year: s.year,
            section: s.section,
          })
        )
          return false
      }
      if (courseFilter && s.course !== courseFilter) return false
      if (branchFilter && !isBranchMatch(s.branch, branchFilter)) return false
      if (yearFilter && s.year !== yearFilter) return false
      if (semesterFilter && s.semester !== semesterFilter) return false
      if (statusFilter && s.status !== statusFilter) return false

      if (search) {
        const q = search.toLowerCase()
        const matchName = s.student_name.toLowerCase().includes(q) || s.roll_no.toLowerCase().includes(q)
        const matchReason = s.reason.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
        if (!matchName && !matchReason) return false
      }
      return true
    })
  }, [suspensions, isStudent, isParent, role, currentTeacher, targetStudent, courseFilter, branchFilter, yearFilter, semesterFilter, statusFilter, search])

  const openCreateSuspensionModal = () => {
    setEditingSuspension(null)
    setSuspensionStudentId(students[0]?.id || '')
    setSuspensionCategory('Disciplinary Violation')
    setSuspensionReason('')
    setSuspensionDesc('')
    setSuspensionStartDate(new Date().toISOString().split('T')[0])
    setSuspensionEndDate('')
    setSuspensionStatus('Active')
    setSuspensionActionTaken('')
    setShowAddSuspensionModal(true)
  }

  const openEditSuspensionModal = (record: SuspensionRecord) => {
    setEditingSuspension(record)
    setSuspensionStudentId(record.student_id)
    setSuspensionCategory(record.category)
    setSuspensionReason(record.reason)
    setSuspensionDesc(record.description || '')
    setSuspensionStartDate(record.start_date)
    setSuspensionEndDate(record.end_date || '')
    setSuspensionStatus(record.status)
    setSuspensionActionTaken(record.action_taken || '')
    setShowAddSuspensionModal(true)
  }

  const handleSaveSuspensionRecord = async () => {
    if (!selectedSuspensionStudent && !editingSuspension) {
      toast({ type: 'error', title: 'Student selection is required' })
      return
    }
    if (!suspensionReason.trim()) {
      toast({ type: 'error', title: 'Suspension Reason title is required' })
      return
    }

    const st = selectedSuspensionStudent || {
      id: editingSuspension?.student_id || '',
      name: editingSuspension?.student_name || '',
      roll_no: editingSuspension?.roll_no || '',
      course: editingSuspension?.course || 'B.Tech',
      branch: editingSuspension?.branch || 'ECE',
      year: editingSuspension?.year || '1st Year',
      semester: editingSuspension?.semester || 'Semester 1',
      section: editingSuspension?.section || 'A',
    }

    try {
      await saveSuspension({
        id: editingSuspension?.id,
        college_id: user?.college_id || user?.school_id || 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f',
        student_id: st.id,
        student_name: st.name,
        roll_no: st.roll_no,
        course: st.course,
        branch: st.branch,
        year: st.year,
        semester: st.semester,
        section: st.section,
        category: suspensionCategory,
        reason: suspensionReason.trim(),
        description: suspensionDesc.trim(),
        start_date: suspensionStartDate,
        end_date: suspensionEndDate,
        status: suspensionStatus,
        action_taken: suspensionActionTaken.trim(),
        created_by: user?.name || (isAdmin ? 'College Admin' : 'Faculty'),
      })

      toast({
        type: 'success',
        title: editingSuspension ? 'Suspension Record Updated' : 'Student Suspension Created',
        description: `Student: ${st.name} (${st.roll_no})`,
      })
      setShowAddSuspensionModal(false)
    } catch (err: any) {
      toast({ type: 'error', title: 'Save Failed', description: err.message || 'Failed to save suspension record' })
    }
  }

  const handleConfirmDeleteSuspension = async () => {
    if (!deleteSuspensionModal) return
    try {
      await deleteSuspension(deleteSuspensionModal.id)
      toast({ type: 'info', title: 'Suspension Record Deleted', description: `Removed suspension for ${deleteSuspensionModal.student_name}` })
      setDeleteSuspensionModal(null)
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', description: err.message || 'Failed to delete suspension' })
    }
  }

  // ===== CSV EXPORT HANDLER =====
  const handleExportHistory = () => {
    if (activeCategory === 'attendance') {
      const data = filteredAttendanceSessions.map((s) => ({
        'Date': s.date,
        'Course': s.course,
        'Branch': s.branch,
        'Year': s.year,
        'Semester': s.semester,
        'Section': s.section,
        'Lecture': s.lecture,
        'Total Students': s.students.length,
        'Present': s.students.filter((st) => st.status === 'present').length,
        'Absent': s.students.filter((st) => st.status === 'absent').length,
      }))
      exportToCSV('Attendance_History_Export', data)
    } else if (activeCategory === 'fees') {
      exportToCSV('Fee_Payment_History_Export', filteredFeeHistory)
    } else if (activeCategory === 'exams') {
      exportToCSV('Exam_Result_History_Export', filteredExamHistory)
    } else if (activeCategory === 'suspensions') {
      exportToCSV('Disciplinary_Suspension_History_Export', filteredSuspensions)
    }
    toast({ type: 'info', title: `Exported ${activeCategory.toUpperCase()} History CSV` })
  }

  // Attendance Table Columns
  const attendanceColumns: Column<AttendanceHistorySession>[] = [
    {
      key: 'date',
      header: 'Date & Session',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-100/60 text-brand-600 rounded-lg shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-ink-900">{r.date}</p>
            <p className="text-xs text-ink-400 font-mono">Lecture: {r.lecture}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'structure',
      header: 'Academic Hierarchy',
      render: (r) => (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="px-2 py-0.5 bg-brand-100 text-brand-700 font-semibold rounded">{r.course}</span>
          <span className="text-ink-400">›</span>
          <span className="px-2 py-0.5 bg-info-100 text-info-700 font-medium rounded truncate max-w-[150px]">{r.branch}</span>
          <span className="text-ink-400">›</span>
          <span className="px-2 py-0.5 bg-canvas border border-border text-ink-600 font-medium rounded">{r.semester}</span>
          <span className="text-ink-400">›</span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Sec {r.section}</span>
        </div>
      ),
    },
    {
      key: 'students',
      header: 'Attendance Stats',
      render: (r) => {
        const present = r.students.filter((st) => st.status === 'present').length
        const absent = r.students.filter((st) => st.status === 'absent').length
        const late = r.students.filter((st) => st.status === 'late').length
        const leave = r.students.filter((st) => st.status === 'leave').length
        const total = r.students.length

        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-ink-900">Total: {total} Students</div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-emerald-600 font-bold">P: {present}</span>
              <span className="text-rose-600 font-bold">A: {absent}</span>
              <span className="text-amber-600 font-bold">L: {late}</span>
              <span className="text-blue-600 font-bold">Lv: {leave}</span>
            </div>
          </div>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <StatusPill status="success" label="COMPLETED" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setViewSession(r)}
            className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {!isStudent && !isParent && (
            <>
              <button
                onClick={() => handleOpenEditAttendance(r)}
                className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Edit Attendance"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteSessionModal(r)}
                className="p-1.5 rounded hover:bg-rose-50 text-ink-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Delete Record"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">History</h1>
          <p className="text-sm text-ink-400 mt-1">
            Centralized historical audit records across attendance, fees, exams, and student suspensions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleExportHistory} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" /> Export History
          </Button>
          {activeCategory === 'suspensions' && !isStudent && !isParent && (
            <Button onClick={openCreateSuspensionModal} className="bg-rose-600 hover:bg-rose-700 text-white gap-2">
              <Plus className="h-4 w-4" /> Add Suspension
            </Button>
          )}
        </div>
      </div>

      {/* History Category Navigation Tabs */}
      <Tabs
        tabs={categoryTabs}
        activeId={activeCategory}
        onChange={(cat) => {
          setActiveCategory(cat)
          setCurrentPage(1)
        }}
        className="border-b border-border"
      />

      {/* Shared Filter Bar */}
      <div className="bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            placeholder={`Search ${activeCategory} history records...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />

          <Select
            options={[{ value: '', label: 'All Courses' }, ...COURSES.map((c) => ({ value: c, label: c }))]}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full sm:w-36"
          />

          <Select
            options={[{ value: '', label: 'All Years' }, ...YEARS.map((y) => ({ value: y, label: y }))]}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full sm:w-32"
          />

          <Select
            options={[
              { value: '', label: 'All Branches' },
              ...availableBranchesForFilter.map((b) => ({ value: b, label: b })),
            ]}
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full sm:w-36"
          />

          {activeCategory !== 'fees' && (
            <Select
              options={[
                { value: '', label: 'All Semesters' },
                { value: 'Semester 1', label: 'Semester 1' },
                { value: 'Semester 2', label: 'Semester 2' },
                { value: 'Semester 3', label: 'Semester 3' },
                { value: 'Semester 4', label: 'Semester 4' },
                { value: 'Semester 5', label: 'Semester 5' },
                { value: 'Semester 6', label: 'Semester 6' },
              ]}
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full sm:w-36"
            />
          )}

          {activeCategory === 'attendance' && (
            <Select
              options={[
                { value: '', label: 'All Sections' },
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
              ]}
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full sm:w-32"
            />
          )}

          {(activeCategory === 'fees' || activeCategory === 'exams' || activeCategory === 'suspensions') && (
            <Select
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'paid', label: 'Paid' },
                { value: 'partial', label: 'Partial' },
                { value: 'due', label: 'Due' },
                { value: 'Pass', label: 'Pass' },
                { value: 'Fail', label: 'Fail' },
                { value: 'Active', label: 'Active Suspension' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-36"
            />
          )}

          {(search || courseFilter || yearFilter || branchFilter || semesterFilter || sectionFilter || statusFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setDateFilter('')
                setCourseFilter('')
                setYearFilter('')
                setBranchFilter('')
                setSemesterFilter('')
                setSectionFilter('')
                setStatusFilter('')
              }}
              className="text-xs text-ink-400 hover:text-ink-900"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* ==================== 1. ATTENDANCE HISTORY TAB ==================== */}
      {activeCategory === 'attendance' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <DataTable
            columns={attendanceColumns}
            rows={filteredAttendanceSessions.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            keyExtractor={(r) => r.id}
            emptyState={
              <EmptyState
                icon={HistoryIcon}
                title="No attendance history records found"
                description="Attendance marked by teachers or admins will appear here automatically."
              />
            }
          />
        </div>
      )}

      {/* ==================== 2. FEE HISTORY TAB ==================== */}
      {activeCategory === 'fees' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'date',
                header: 'Date & Receipt',
                render: (r) => (
                  <div>
                    <span className="font-bold text-ink-900 block">{(r as any).updated_at ? new Date((r as any).updated_at).toISOString().split('T')[0] : 'Recorded'}</span>
                    <span className="text-xs text-ink-400 font-mono">Roll: {r.roll_no}</span>
                  </div>
                ),
              },
              {
                key: 'student',
                header: 'Student Name',
                render: (r) => <div><span className="font-semibold text-ink-900 block">{r.student_name}</span><span className="text-xs text-ink-500">{r.course} • {r.branch} ({r.year_semester})</span></div>,
              },
              {
                key: 'fee_type',
                header: 'Fee Structure',
                render: (r) => <span className="font-medium text-brand-700 text-xs">{r.fee_structure_title || (r as any).title || 'Semester Fee'}</span>,
              },
              {
                key: 'total_fee',
                header: 'Total Invoiced',
                render: (r) => <span className="font-mono text-xs">{formatCurrency(r.total_fee)}</span>,
              },
              {
                key: 'paid',
                header: 'Paid Amount',
                render: (r) => <span className="font-bold text-emerald-600 font-mono">{formatCurrency(r.paid)}</span>,
              },
              {
                key: 'pending',
                header: 'Pending Due',
                render: (r) => <span className="font-semibold text-amber-600 font-mono">{formatCurrency(r.pending)}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => <StatusPill status={r.status === 'paid' ? 'success' : r.status === 'partial' ? 'warning' : 'danger'} label={(r.status || 'due').toUpperCase()} />,
              },
              {
                key: 'actions',
                header: 'Receipt Detail',
                align: 'right',
                render: (r) => (
                  <button
                    onClick={() => setViewFeeModal(r)}
                    className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer"
                    title="View Transaction"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                ),
              },
            ]}
            rows={filteredFeeHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            keyExtractor={(r) => r.id}
            emptyState={
              <EmptyState
                icon={IndianRupee}
                title="No fee payment history records found"
                description="Payments recorded in the Fees module will appear here automatically."
              />
            }
          />
        </div>
      )}

      {/* ==================== 3. EXAM HISTORY TAB ==================== */}
      {activeCategory === 'exams' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'student',
                header: 'Student Name',
                render: (r) => <div><span className="font-semibold text-ink-900 block">{r.student_name}</span><span className="text-xs text-ink-400 font-mono">{r.roll_no}</span></div>,
              },
              {
                key: 'subject',
                header: 'Subject & Code',
                render: (r) => <div><span className="font-semibold text-brand-700 block">{r.subject}</span><span className="text-xs text-ink-500">{r.course} • {r.branch}</span></div>,
              },
              {
                key: 'term',
                header: 'Year / Semester',
                render: (r) => `${r.year} (${r.semester})`,
              },
              {
                key: 'marks',
                header: 'Obtained / Max',
                render: (r) => <span className="font-mono text-xs font-bold text-ink-900">{r.obtained_marks} / {r.max_marks}</span>,
              },
              {
                key: 'pct',
                header: 'Percentage',
                render: (r) => <span className="font-bold text-indigo-600">{Math.round((r.obtained_marks / r.max_marks) * 100)}%</span>,
              },
              {
                key: 'grade',
                header: 'Grade',
                render: (r) => <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-bold rounded">{r.grade || 'Pass'}</span>,
              },
              {
                key: 'status',
                header: 'Result Status',
                render: (r) => <StatusPill status={r.status === 'Pass' ? 'success' : 'danger'} label={r.status} />,
              },
              {
                key: 'actions',
                header: 'Transcript & Actions',
                align: 'right',
                render: (r) => (
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setViewExamModal(r)}
                      className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer"
                      title="View Transcript"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {!isStudent && !isParent && (
                      <button
                        onClick={() => handleOpenEditExam(r)}
                        className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Edit Marks"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            rows={filteredExamHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            keyExtractor={(r) => r.id}
            emptyState={
              <EmptyState
                icon={Award}
                title="No exam result history records found"
                description="Exam results published by faculty will appear here automatically."
              />
            }
          />
        </div>
      )}

      {/* ==================== 4. SUSPENSION HISTORY TAB ==================== */}
      {activeCategory === 'suspensions' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'student',
                header: 'Student Name',
                render: (r) => <div><span className="font-semibold text-ink-900 block">{r.student_name}</span><span className="text-xs text-ink-400 font-mono">{r.roll_no}</span></div>,
              },
              {
                key: 'academic',
                header: 'Academic Group',
                render: (r) => `${r.course} • ${r.branch} (${r.year})`,
              },
              {
                key: 'category',
                header: 'Violation Category',
                render: (r) => <span className="px-2.5 py-0.5 bg-rose-100/70 text-rose-800 text-xs font-semibold rounded-full">{r.category}</span>,
              },
              {
                key: 'reason',
                header: 'Reason / Summary',
                render: (r) => <div><span className="font-semibold text-ink-900 block truncate max-w-[200px]">{r.reason}</span><span className="text-xs text-ink-400 truncate max-w-[200px] block">{r.description}</span></div>,
              },
              {
                key: 'period',
                header: 'Suspension Period',
                render: (r) => <span className="font-mono text-xs text-ink-700">{r.start_date} → {r.end_date || 'Indefinite'}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => <StatusPill status={r.status === 'Active' ? 'danger' : r.status === 'Completed' ? 'success' : 'neutral'} label={r.status.toUpperCase()} />,
              },
              {
                key: 'created_by',
                header: 'Recorded By',
                render: (r) => <span className="text-xs text-ink-500">{r.created_by}</span>,
              },
              {
                key: 'actions',
                header: 'Actions',
                align: 'right',
                render: (r) => (
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setViewSuspensionModal(r)}
                      className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {!isStudent && !isParent && (
                      <>
                        <button
                          onClick={() => openEditSuspensionModal(r)}
                          className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Edit Suspension"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteSuspensionModal(r)}
                          className="p-1.5 rounded hover:bg-rose-50 text-ink-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Suspension"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
            rows={filteredSuspensions.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            keyExtractor={(r) => r.id}
            emptyState={
              <EmptyState
                icon={ShieldAlert}
                title="No student suspension history records found"
                description="Disciplinary suspension records created by college administration will appear here."
              />
            }
          />
        </div>
      )}

      {/* ==================== ATTENDANCE VIEW DETAILS MODAL ==================== */}
      <Modal
        isOpen={!!viewSession}
        onClose={() => setViewSession(null)}
        title="Attendance Session Breakdown"
        footer={
          <div className="flex items-center justify-between w-full">
            {!isStudent && !isParent && viewSession ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const sessionToEdit = viewSession
                    setViewSession(null)
                    handleOpenEditAttendance(sessionToEdit)
                  }}
                  className="gap-1 text-xs border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Attendance
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const sessionToDelete = viewSession
                    setViewSession(null)
                    setDeleteSessionModal(sessionToDelete)
                  }}
                  className="gap-1 text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-600" /> Delete Record
                </Button>
              </div>
            ) : <div />}
            <Button variant="ghost" onClick={() => setViewSession(null)}>Close</Button>
          </div>
        }
      >
        {viewSession && (
          <div className="space-y-4">
            <div className="p-3 bg-canvas border border-border rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-ink-900">{viewSession.course} {viewSession.branch}</span> ({viewSession.year}, {viewSession.semester} - Section {viewSession.section})
              </div>
              <div className="font-mono text-ink-500">Date: {viewSession.date} • Lecture: {viewSession.lecture}</div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {viewSession.students.map((st) => (
                <div key={st.id} className="p-2.5 bg-surface border border-border rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-ink-900 block">{st.name}</span>
                    <span className="font-mono text-ink-400 text-[11px]">{st.roll_no}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {st.remark && <span className="text-[11px] text-ink-400 italic">"{st.remark}"</span>}
                    <StatusPill
                      status={st.status === 'present' ? 'success' : st.status === 'absent' ? 'danger' : 'warning'}
                      label={st.status.toUpperCase()}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== ATTENDANCE EDIT MODAL ==================== */}
      <Modal
        isOpen={!!editSession}
        onClose={() => setEditSession(null)}
        title="Edit Attendance Session"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditSession(null)}>Cancel</Button>
            <Button onClick={handleSaveEditAttendance} className="bg-brand-600 hover:bg-brand-700 text-white">
              Save Attendance Changes
            </Button>
          </>
        }
      >
        {editSession && (
          <div className="space-y-4">
            <div className="p-3 bg-canvas border border-border rounded-xl text-xs flex items-center justify-between">
              <span className="font-bold text-ink-900">{editSession.course} {editSession.branch} ({editSession.date})</span>
              <span className="font-mono text-ink-500">Section {editSession.section} • {editSession.lecture}</span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {editStudents.map((st) => (
                <div key={st.id} className="p-3 bg-surface border border-border rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-ink-900 block">{st.name}</span>
                      <span className="font-mono text-ink-400 text-[11px]">{st.roll_no}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {(['present', 'absent', 'late', 'leave'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setEditStudents((prev) =>
                              prev.map((item) => (item.id === st.id ? { ...item, status: s } : item))
                            )
                          }}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                            st.status === s
                              ? s === 'present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : s === 'absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : s === 'late'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-blue-600 text-white shadow-sm'
                              : 'bg-canvas text-ink-600 hover:bg-border/60'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input
                    placeholder="Remark (optional)..."
                    value={st.remark || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      setEditStudents((prev) =>
                        prev.map((item) => (item.id === st.id ? { ...item, remark: val } : item))
                      )
                    }}
                    className="text-xs py-1"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== ATTENDANCE DELETE MODAL ==================== */}
      <Modal
        isOpen={!!deleteSessionModal}
        onClose={() => setDeleteSessionModal(null)}
        title="Confirm Delete Attendance Session"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteSessionModal(null)}>Cancel</Button>
            <Button onClick={handleConfirmDeleteAttendance} className="bg-rose-600 hover:bg-rose-700 text-white">Confirm Delete</Button>
          </>
        }
      >
        {deleteSessionModal && (
          <p className="text-sm text-ink-800">
            Are you sure you want to delete attendance history for <strong>{deleteSessionModal.course} {deleteSessionModal.branch} (Sec {deleteSessionModal.section})</strong> on <strong>{deleteSessionModal.date}</strong>?
          </p>
        )}
      </Modal>

      {/* ==================== FEE TRANSACTION VIEW MODAL ==================== */}
      <Modal
        isOpen={!!viewFeeModal}
        onClose={() => setViewFeeModal(null)}
        title="Fee Payment Transaction Receipt"
        footer={<Button variant="ghost" onClick={() => setViewFeeModal(null)}>Close Receipt</Button>}
      >
        {viewFeeModal && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-canvas border border-border rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-900 text-sm">{viewFeeModal.student_name}</span>
                <StatusPill status={viewFeeModal.status === 'paid' ? 'success' : viewFeeModal.status === 'partial' ? 'warning' : 'danger'} label={(viewFeeModal.status || 'due').toUpperCase()} />
              </div>
              <div className="text-ink-400 font-mono">Roll No: {viewFeeModal.roll_no} • {viewFeeModal.course} ({viewFeeModal.branch})</div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-surface border border-border rounded-xl">
              <div>Total Invoiced: <strong className="font-mono text-ink-900">{formatCurrency(viewFeeModal.total_fee)}</strong></div>
              <div>Paid Amount: <strong className="font-mono text-emerald-600">{formatCurrency(viewFeeModal.paid)}</strong></div>
              <div>Pending Dues: <strong className="font-mono text-amber-600">{formatCurrency(viewFeeModal.pending)}</strong></div>
              <div>Fee Structure: <strong className="text-brand-700">{viewFeeModal.title || 'Semester Fee'}</strong></div>
            </div>

            <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
              <div>Payment Date: <strong className="font-mono text-ink-800">{viewFeeModal.updated_at ? new Date(viewFeeModal.updated_at).toISOString().split('T')[0] : 'N/A'}</strong></div>
              <div>Recorded By: <strong className="text-ink-800">{viewFeeModal.recorded_by || 'Finance Department'}</strong></div>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== EXAM TRANSCRIPT VIEW MODAL ==================== */}
      <Modal
        isOpen={!!viewExamModal}
        onClose={() => setViewExamModal(null)}
        title="Exam Result Official Transcript"
        footer={<Button variant="ghost" onClick={() => setViewExamModal(null)}>Close Transcript</Button>}
      >
        {viewExamModal && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-canvas border border-border rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-900 text-sm">{viewExamModal.student_name}</span>
                <StatusPill status={viewExamModal.status === 'Pass' ? 'success' : 'danger'} label={viewExamModal.status} />
              </div>
              <div className="text-ink-400 font-mono">Roll No: {viewExamModal.roll_no} • {viewExamModal.course} ({viewExamModal.branch})</div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-surface border border-border rounded-xl">
              <div>Subject: <strong className="text-brand-700">{viewExamModal.subject}</strong></div>
              <div>Term: <strong>{viewExamModal.year} ({viewExamModal.semester})</strong></div>
              <div>Obtained Marks: <strong className="font-mono text-indigo-600">{viewExamModal.obtained_marks} / {viewExamModal.max_marks}</strong></div>
              <div>Percentage: <strong className="font-mono text-emerald-600">{Math.round((viewExamModal.obtained_marks / viewExamModal.max_marks) * 100)}%</strong></div>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== EDIT EXAM MARKS MODAL ==================== */}
      <Modal
        isOpen={!!editExamModal}
        onClose={() => setEditExamModal(null)}
        title="Edit Exam Result Marks"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditExamModal(null)}>Cancel</Button>
            <Button onClick={handleSaveEditExamMarks} className="bg-brand-600 hover:bg-brand-700 text-white">Save Changes</Button>
          </>
        }
      >
        {editExamModal && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-canvas border border-border rounded-xl space-y-1">
              <div className="font-bold text-ink-900 text-sm">{editExamModal.student_name} ({editExamModal.roll_no})</div>
              <div className="text-ink-500 font-medium">{editExamModal.subject} — {editExamModal.course} ({editExamModal.branch}, {editExamModal.semester})</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Obtained Marks" required>
                <Input
                  type="number"
                  min={0}
                  max={editMaxMarks}
                  value={editObtainedMarks}
                  onChange={(e) => setEditObtainedMarks(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Max Marks">
                <Input
                  type="number"
                  min={1}
                  value={editMaxMarks}
                  onChange={(e) => setEditMaxMarks(Number(e.target.value))}
                />
              </FormField>

              <FormField label="Passing Marks">
                <Input
                  type="number"
                  min={0}
                  value={editPassingMarks}
                  onChange={(e) => setEditPassingMarks(Number(e.target.value))}
                />
              </FormField>
            </div>

            <FormField label="Remarks">
              <Input
                placeholder="Optional remarks e.g. Good performance..."
                value={editRemarks}
                onChange={(e) => setEditRemarks(e.target.value)}
              />
            </FormField>

            <div className="p-3 bg-surface border border-border rounded-xl flex items-center justify-between font-medium">
              <span>Calculated Percentage: <strong className="text-indigo-600 font-mono">{editMaxMarks > 0 ? Math.round((editObtainedMarks / editMaxMarks) * 100) : 0}%</strong></span>
              <span>Calculated Status: <strong className={editObtainedMarks >= editPassingMarks ? 'text-emerald-600' : 'text-rose-600'}>{editObtainedMarks >= editPassingMarks ? 'PASS' : 'FAIL'}</strong></span>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== ADD / EDIT SUSPENSION MODAL ==================== */}
      <Modal
        isOpen={showAddSuspensionModal}
        onClose={() => setShowAddSuspensionModal(false)}
        title={editingSuspension ? 'Edit Disciplinary Suspension' : 'Create Student Disciplinary Suspension'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddSuspensionModal(false)}>Cancel</Button>
            <Button onClick={handleSaveSuspensionRecord} className="bg-rose-600 hover:bg-rose-700 text-white gap-2">
              <Send className="h-4 w-4" />
              <span>{editingSuspension ? 'Save Changes' : 'Record Suspension'}</span>
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Select Target Student" required>
            <Select
              options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.roll_no}) - ${s.course} ${s.branch}` }))}
              value={suspensionStudentId}
              onChange={(e) => setSuspensionStudentId(e.target.value)}
              disabled={!!editingSuspension}
            />
          </FormField>

          {selectedSuspensionStudent && (
            <div className="p-3 bg-canvas border border-border rounded-xl text-xs space-y-1">
              <div className="font-bold text-ink-900">{selectedSuspensionStudent.name} (Roll: {selectedSuspensionStudent.roll_no})</div>
              <div className="text-ink-500">{selectedSuspensionStudent.course} • {selectedSuspensionStudent.branch} · {selectedSuspensionStudent.year}, {selectedSuspensionStudent.semester} (Section {selectedSuspensionStudent.section})</div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Violation Category" required>
              <Select
                options={[
                  { value: 'Disciplinary Violation', label: 'Disciplinary Violation' },
                  { value: 'Misconduct', label: 'Misconduct' },
                  { value: 'Attendance Related', label: 'Attendance Related' },
                  { value: 'Examination Malpractice', label: 'Examination Malpractice' },
                  { value: 'Fee/Administrative Issue', label: 'Fee/Administrative Issue' },
                  { value: 'Anti-Ragging Violation', label: 'Anti-Ragging Violation' },
                  { value: 'Damage to Property', label: 'Damage to Property' },
                  { value: 'Other', label: 'Other Category' },
                ]}
                value={suspensionCategory}
                onChange={(e) => setSuspensionCategory(e.target.value as any)}
              />
            </FormField>

            <FormField label="Suspension Status">
              <Select
                options={[
                  { value: 'Active', label: 'Active Suspension' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Cancelled', label: 'Cancelled' },
                ]}
                value={suspensionStatus}
                onChange={(e) => setSuspensionStatus(e.target.value as any)}
              />
            </FormField>
          </div>

          <FormField label="Suspension Reason / Title" required>
            <Input
              placeholder="Short title e.g. Examination Malpractice during Mid-Term..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
            />
          </FormField>

          <FormField label="Detailed Description / Investigation Findings">
            <Textarea
              placeholder="Enter full details of misconduct and investigation notes..."
              rows={3}
              value={suspensionDesc}
              onChange={(e) => setSuspensionDesc(e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Start Date" required>
              <Input
                type="date"
                value={suspensionStartDate}
                onChange={(e) => setSuspensionStartDate(e.target.value)}
              />
            </FormField>

            <FormField label="End Date / Until">
              <Input
                type="date"
                value={suspensionEndDate}
                onChange={(e) => setSuspensionEndDate(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Action Taken / Administrative Penalty">
            <Input
              placeholder="e.g. Suspended from lectures & labs for 14 days, parent meeting scheduled..."
              value={suspensionActionTaken}
              onChange={(e) => setSuspensionActionTaken(e.target.value)}
            />
          </FormField>
        </div>
      </Modal>

      {/* ==================== VIEW SUSPENSION MODAL ==================== */}
      <Modal
        isOpen={!!viewSuspensionModal}
        onClose={() => setViewSuspensionModal(null)}
        title="Student Suspension Record Details"
        footer={<Button variant="ghost" onClick={() => setViewSuspensionModal(null)}>Close</Button>}
      >
        {viewSuspensionModal && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 text-sm">{viewSuspensionModal.student_name}</span>
                <StatusPill status={viewSuspensionModal.status === 'Active' ? 'danger' : 'neutral'} label={viewSuspensionModal.status.toUpperCase()} />
              </div>
              <div className="text-rose-700 font-mono">Roll No: {viewSuspensionModal.roll_no} • {viewSuspensionModal.course} ({viewSuspensionModal.branch})</div>
            </div>

            <div className="space-y-2 p-3 bg-surface border border-border rounded-xl">
              <div>Category: <span className="font-bold text-rose-700">{viewSuspensionModal.category}</span></div>
              <div>Reason: <span className="font-semibold text-ink-900">{viewSuspensionModal.reason}</span></div>
              <div>Period: <span className="font-mono text-ink-800">{viewSuspensionModal.start_date} → {viewSuspensionModal.end_date || 'Indefinite'}</span></div>
              <div>Action Taken: <span className="font-medium text-ink-800">{viewSuspensionModal.action_taken || 'Class Suspension'}</span></div>
            </div>

            {viewSuspensionModal.description && (
              <div className="p-3 bg-canvas border border-border rounded-xl space-y-1">
                <div className="font-semibold text-ink-900">Investigation & Notes:</div>
                <p className="text-ink-600 leading-relaxed whitespace-pre-wrap">{viewSuspensionModal.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ==================== DELETE SUSPENSION MODAL ==================== */}
      <Modal
        isOpen={!!deleteSuspensionModal}
        onClose={() => setDeleteSuspensionModal(null)}
        title="Confirm Delete Suspension Record"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteSuspensionModal(null)}>Cancel</Button>
            <Button onClick={handleConfirmDeleteSuspension} className="bg-rose-600 hover:bg-rose-700 text-white">Confirm Delete</Button>
          </>
        }
      >
        {deleteSuspensionModal && (
          <p className="text-sm text-ink-800">
            Are you sure you want to delete the suspension record for <strong>{deleteSuspensionModal.student_name} ({deleteSuspensionModal.roll_no})</strong>?
          </p>
        )}
      </Modal>
    </div>
  )
}
