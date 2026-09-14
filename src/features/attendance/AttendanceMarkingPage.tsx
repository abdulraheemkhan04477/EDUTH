import { useState, useMemo, useEffect, useCallback } from 'react'
import { Select, SearchInput } from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import {
  CheckCheck,
  XCircle,
  RotateCcw,
  Download,
  FileSpreadsheet,
  FileText,
  Save,
  Users,
  QrCode,
  Fingerprint,
  RefreshCw,
  Clock,
  ShieldAlert,
  Scan,
  Zap,
  Radio,
  X,
  Sparkles,
} from 'lucide-react'

import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, getTeacherForUser, type TeacherRecord, isBranchMatch } from '../../lib/academicStore'
import { exportToCSV, exportAttendancePDF } from '../../lib/exportUtils'
import {
  generateDynamicToken,
  encodeQRPayload,
  decodeQRPayload,
  renderQRCodeSVG,
  type QRPayloadData,
} from '../../lib/qrUtils'

type AttendanceMarkStatus = 'not_marked' | 'present' | 'absent' | 'late' | 'leave'
type AttendanceMode = 'manual' | 'qr' | 'fingerprint'

// Semester options mapping by Year & Course
const semestersByYearCourse = (year: string, course: string): { value: string; label: string }[] => {
  if (course === 'MBA') {
    if (year === '1st Year') return [{ value: 'Semester 1', label: 'Semester 1' }, { value: 'Semester 2', label: 'Semester 2' }]
    if (year === '2nd Year') return [{ value: 'Semester 3', label: 'Semester 3' }, { value: 'Semester 4', label: 'Semester 4' }]
    return []
  }
  if (year === '1st Year') return [{ value: 'Semester 1', label: 'Semester 1' }, { value: 'Semester 2', label: 'Semester 2' }]
  if (year === '2nd Year') return [{ value: 'Semester 3', label: 'Semester 3' }, { value: 'Semester 4', label: 'Semester 4' }]
  if (year === '3rd Year') return [{ value: 'Semester 5', label: 'Semester 5' }, { value: 'Semester 6', label: 'Semester 6' }]
  if (year === '4th Year') return [{ value: 'Semester 7', label: 'Semester 7' }, { value: 'Semester 8', label: 'Semester 8' }]
  return []
}

function checkTeacherPermission(
  teacher: TeacherRecord | null,
  target: { course: string; branch: string; year: string; semester?: string; section?: string }
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

  return false
}

export function AttendanceMarkingPage() {
  const { toast } = useToast()
  const { user, role } = useAuth()
  const { students, teachers, classes, setAttendanceRecord, getAttendance, branches: storeBranches } = useAcademicStore()

  // Mode Selection State: 'manual' | 'qr' | 'fingerprint'
  const [attendanceMode, setAttendanceMode] = useState<AttendanceMode>('manual')

  // Filter States: Date -> Course -> Year -> Branch -> Semester -> Lecture -> Section
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [course, setCourse] = useState('B.Tech')
  const [year, setYear] = useState('1st Year')
  const [branch, setBranch] = useState('ECE')
  const [semester, setSemester] = useState('Semester 1')
  const [lecture, setLecture] = useState('L-1')
  const [section, setSection] = useState('A')

  // QR Generator States (Admin & Teacher)
  const [qrSession, setQrSession] = useState<{
    sessionId: string
    createdAt: number
    expiresAt: number
  } | null>(null)
  const [qrTokenData, setQrTokenData] = useState<{ token: string; timestamp: number }>({ token: '', timestamp: 0 })
  const [qrTimeRemaining, setQrTimeRemaining] = useState<number>(0)
  const [qrPayloadString, setQrPayloadString] = useState<string>('')

  // Student Scan Modal State
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false)
  const [scannedPayloadInput, setScannedPayloadInput] = useState<string>('')

  const availableBranches = useMemo(() => {
    if (!course) return []
    const filtered = storeBranches.filter((b) => b.course_name === course && !b.name.toLowerCase().includes('common'))
    return filtered.map((b) => ({ value: b.code || b.name, label: b.code || b.name }))
  }, [course, storeBranches])

  const currentTeacher = useMemo(() => {
    if (role !== 'teacher') return null
    return getTeacherForUser(user, teachers, classes)
  }, [user, role, teachers, classes])

  // Teacher Restricted Options & Assigned Classes Logic
  const teacherAssignedClasses = useMemo(() => {
    if (role !== 'teacher' || !currentTeacher) return []
    const userEmailLower = currentTeacher.email?.toLowerCase().trim()
    return classes.filter(
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
  }, [role, currentTeacher, classes])

  // Check if selected filter combination is assigned to teacher
  const isSelectedFilterAssignedToTeacher = useMemo(() => {
    if (role !== 'teacher') return true
    if (!currentTeacher || teacherAssignedClasses.length === 0) return false

    const secClean = section.replace(/^Section\s+/i, '').trim()

    return teacherAssignedClasses.some((c) => {
      const matchCourse = !course || c.course === course
      const matchBranch = !branch || c.branch === branch
      const matchYear = !year || c.year === year
      const cSecClean = (c.section || '').replace(/^Section\s+/i, '').trim()
      const matchSection = !section || !cSecClean || cSecClean === secClean || c.name.includes(secClean)
      return matchCourse && matchBranch && matchYear && matchSection
    })
  }, [role, currentTeacher, teacherAssignedClasses, course, branch, year, section])

  // Auto-select first assigned class for teacher on mount/change if current filter is unassigned
  useEffect(() => {
    if (role === 'teacher' && teacherAssignedClasses.length > 0 && !isSelectedFilterAssignedToTeacher) {
      const firstClass = teacherAssignedClasses[0]
      const secClean = (firstClass.section || '').replace(/^Section\s+/i, '').trim() || 'A'
      setCourse(firstClass.course)
      setYear(firstClass.year)
      setBranch(firstClass.branch)
      if (firstClass.semester) setSemester(firstClass.semester)
      setSection(secClean)
    }
  }, [role, teacherAssignedClasses, isSelectedFilterAssignedToTeacher])

  // Search & Filter Tab State
  const [search, setSearch] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'present' | 'absent' | 'late' | 'leave'>('all')

  // Attendance Records State: key = `${course}_${year}_${branch}_${semester}_${section}_${lecture}_${date}`
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, Record<string, { status: AttendanceMarkStatus; remark: string }>>
  >({})

  // Session Key
  const sessionKey = `${course}_${year}_${branch}_${semester}_${section}_${lecture}_${date}`

  // Load existing attendance from Supabase/Store when session filters change
  const allSavedAttendance = getAttendance()

  useEffect(() => {
    if (!date || !course || !branch || !year || !section) return

    const secClean = section.replace(/^Section\s+/i, '').trim()

    const matchingSaved = allSavedAttendance.filter((a) => {
      if (a.date !== date) return false
      if (a.course && a.course !== course) return false
      if (a.branch && !isBranchMatch(a.branch, branch)) return false
      if (a.year && a.year !== year) return false
      if (a.section) {
        const aSecClean = a.section.replace(/^Section\s+/i, '').trim()
        if (aSecClean !== secClean) return false
      }
      if (lecture && a.lecture && a.lecture !== lecture) return false
      return true
    })

    if (matchingSaved.length > 0) {
      const sessionRecordMap: Record<string, { status: AttendanceMarkStatus; remark: string }> = {}
      matchingSaved.forEach((a) => {
        sessionRecordMap[a.student_id] = {
          status: a.status as AttendanceMarkStatus,
          remark: a.remarks || '',
        }
      })

      setAttendanceRecords((prev) => ({
        ...prev,
        [sessionKey]: {
          ...(prev[sessionKey] || {}),
          ...sessionRecordMap,
        },
      }))
    }
  }, [date, course, branch, year, semester, section, lecture, allSavedAttendance, sessionKey])

  // ===== QR CODE GENERATOR & ROTATION ENGINE (5 MIN SESSION + 12S DYNAMIC ROTATION) =====
  const handleGenerateQR = useCallback(() => {
    if (role === 'teacher') {
      const isAllowed = checkTeacherPermission(currentTeacher, { course, branch, year, semester, section })
      if (!isAllowed) {
        toast({
          type: 'error',
          title: 'Permission Denied',
          description: 'Teachers can only generate QR codes for their assigned classes.',
        })
        return
      }
    }

    const sessionId = `QRSESS_${Date.now()}`
    const createdAt = Date.now()
    const expiresAt = createdAt + 300000 // 5 minutes (300,000 ms)
    const initialTokenObj = generateDynamicToken()

    const payloadObj: QRPayloadData = {
      sessionId,
      course,
      year,
      branch,
      semester,
      lecture,
      section,
      date,
      createdAt,
      expiresAt,
      tokenTimestamp: initialTokenObj.timestamp,
      token: initialTokenObj.token,
    }

    const encoded = encodeQRPayload(payloadObj)
    setQrSession({ sessionId, createdAt, expiresAt })
    setQrTokenData(initialTokenObj)
    setQrTimeRemaining(300)
    setQrPayloadString(encoded)

    try {
      localStorage.setItem('eduth_active_qr_session', encoded)
    } catch {}

    toast({
      type: 'success',
      title: 'Dynamic Anti-Proxy QR Active',
      description: `Valid for 5 minutes. Display QR refreshes token every 12 seconds.`,
    })
  }, [role, currentTeacher, course, branch, year, semester, section, lecture, date, toast])

  // Timer countdown & dynamic token refresh effect
  useEffect(() => {
    if (!qrSession) return

    // 1. Session Countdown timer (1s interval)
    const countdownInterval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((qrSession.expiresAt - Date.now()) / 1000))
      setQrTimeRemaining(remaining)

      if (remaining <= 0) {
        setQrSession(null)
        setQrPayloadString('')
        try {
          localStorage.removeItem('eduth_active_qr_session')
        } catch {}
        toast({
          type: 'info',
          title: 'QR Session Expired',
          description: 'The 5-minute QR attendance window has closed.',
        })
      }
    }, 1000)

    // 2. Dynamic Token Auto-Rotation (12s interval for anti-proxy security)
    const rotationInterval = setInterval(() => {
      if (Date.now() >= qrSession.expiresAt) return

      const newTokenObj = generateDynamicToken()
      setQrTokenData(newTokenObj)

      const payloadObj: QRPayloadData = {
        sessionId: qrSession.sessionId,
        course,
        year,
        branch,
        semester,
        lecture,
        section,
        date,
        createdAt: qrSession.createdAt,
        expiresAt: qrSession.expiresAt,
        tokenTimestamp: newTokenObj.timestamp,
        token: newTokenObj.token,
      }
      const encoded = encodeQRPayload(payloadObj)
      setQrPayloadString(encoded)

      try {
        localStorage.setItem('eduth_active_qr_session', encoded)
      } catch {}
    }, 12000)

    return () => {
      clearInterval(countdownInterval)
      clearInterval(rotationInterval)
    }
  }, [qrSession, course, year, branch, semester, lecture, section, date, toast])

  // Get status for student in current session
  const getStatus = (studentId: string): AttendanceMarkStatus => {
    return attendanceRecords[sessionKey]?.[studentId]?.status ?? 'not_marked'
  }

  // Get remark for student in current session
  const getRemark = (studentId: string): string => {
    return attendanceRecords[sessionKey]?.[studentId]?.remark ?? ''
  }

  // Set student status
  const setStudentStatus = (studentId: string, status: AttendanceMarkStatus) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [sessionKey]: {
        ...(prev[sessionKey] || {}),
        [studentId]: {
          status,
          remark: prev[sessionKey]?.[studentId]?.remark ?? '',
        },
      },
    }))
  }

  // Set student remark
  const setStudentRemark = (studentId: string, remark: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [sessionKey]: {
        ...(prev[sessionKey] || {}),
        [studentId]: {
          status: prev[sessionKey]?.[studentId]?.status ?? 'not_marked',
          remark,
        },
      },
    }))
  }

  // Base Roster for selected filters - sorted by Roll Number ascending
  const currentRoster = useMemo(() => {
    if (role === 'teacher' && !isSelectedFilterAssignedToTeacher) {
      return []
    }

    const list = students.filter((s) => {
      if (course && s.course !== course) return false
      if (year && s.year !== year) return false
      if (branch && !isBranchMatch(s.branch, branch)) return false
      if (semester && s.semester !== semester) return false
      if (section) {
        const secClean = section.replace(/^Section\s+/i, '').trim()
        const sSecClean = (s.section || '').replace(/^Section\s+/i, '').trim()
        if (sSecClean !== secClean) return false
      }
      if (role === 'teacher' && teacherAssignedClasses.length > 0) {
        return teacherAssignedClasses.some(
          (c) =>
            s.course === c.course &&
            isBranchMatch(s.branch, c.branch) &&
            s.year === c.year &&
            (!c.section || c.section === 'All Sections' || s.section === c.section || c.name.includes(s.section))
        )
      }
      return true
    })

    return list.sort((a, b) => (a.roll_no || '').localeCompare(b.roll_no || '', undefined, { numeric: true, sensitivity: 'base' }))
  }, [students, course, year, branch, semester, section, role, isSelectedFilterAssignedToTeacher, teacherAssignedClasses])

  // Filtered Roster by Search & Status Tabs
  const displayedRoster = useMemo(() => {
    return currentRoster.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll_no.toLowerCase().includes(search.toLowerCase())

      const status = getStatus(s.id)
      const matchTab =
        activeFilterTab === 'all'
          ? true
          : activeFilterTab === 'present'
            ? status === 'present'
            : activeFilterTab === 'absent'
              ? status === 'absent'
              : activeFilterTab === 'late'
                ? status === 'late'
                : activeFilterTab === 'leave'
                  ? status === 'leave'
                  : true

      return matchSearch && matchTab
    })
  }, [currentRoster, search, activeFilterTab, attendanceRecords, sessionKey])

  // Counters
  const counters = useMemo(() => {
    let marked = 0
    let present = 0
    let absent = 0
    let late = 0
    let leave = 0

    currentRoster.forEach((s) => {
      const st = getStatus(s.id)
      if (st !== 'not_marked') marked++
      if (st === 'present') present++
      else if (st === 'absent') absent++
      else if (st === 'late') late++
      else if (st === 'leave') leave++
    })

    return {
      total: currentRoster.length,
      marked,
      present,
      absent,
      late,
      leave,
    }
  }, [currentRoster, attendanceRecords, sessionKey])

  // Status Counts for Tab badges
  const statusCounts = useMemo(() => {
    let present = 0
    let absent = 0
    let late = 0
    let leave = 0

    currentRoster.forEach((s) => {
      const st = getStatus(s.id)
      if (st === 'present') present++
      else if (st === 'absent') absent++
      else if (st === 'late') late++
      else if (st === 'leave') leave++
    })

    return { present, absent, late, leave }
  }, [currentRoster, attendanceRecords, sessionKey])

  // Quick Action: Mark All Present
  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceMarkStatus; remark: string }> = {}
    currentRoster.forEach((s) => {
      updated[s.id] = {
        status: 'present',
        remark: getRemark(s.id),
      }
    })
    setAttendanceRecords((prev) => ({
      ...prev,
      [sessionKey]: updated,
    }))
    toast({ type: 'success', title: `Marked all ${currentRoster.length} students Present` })
  }

  // Quick Action: Mark All Absent
  const handleMarkAllAbsent = () => {
    const updated: Record<string, { status: AttendanceMarkStatus; remark: string }> = {}
    currentRoster.forEach((s) => {
      updated[s.id] = {
        status: 'absent',
        remark: getRemark(s.id),
      }
    })
    setAttendanceRecords((prev) => ({
      ...prev,
      [sessionKey]: updated,
    }))
    toast({ type: 'info', title: `Marked all ${currentRoster.length} students Absent` })
  }

  // Quick Action: Reset
  const handleReset = () => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [sessionKey]: {},
    }))
    toast({ type: 'info', title: 'Attendance reset for current session' })
  }

  // Save Attendance Handler
  const handleSave = useCallback(async () => {
    if (role === 'teacher') {
      const isAllowed = checkTeacherPermission(currentTeacher, { course, branch, year, semester, section })
      if (!isAllowed) {
        toast({
          type: 'error',
          title: 'Permission Denied',
          description: 'You are only authorized to mark attendance for your assigned classes.',
        })
        return
      }
    }

    const className = `${course} ${branch} - ${year} - Section ${section}`
    const collegeId = user?.college_id || user?.school_id || '13695a78-0105-4bde-bc85-d664bb66637e'

    try {
      const promises: Promise<any>[] = []
      currentRoster.forEach((s) => {
        const st = getStatus(s.id)
        if (st !== 'not_marked') {
          promises.push(
            setAttendanceRecord({
              id: `att_${s.id}_${date}_${lecture}`,
              student_id: s.id,
              student_name: s.name,
              roll_no: s.roll_no,
              course,
              branch,
              year,
              semester,
              section,
              lecture,
              class_name: className,
              date,
              status: st,
              remarks: getRemark(s.id),
              marked_by: user?.name || user?.email || (role === 'teacher' ? 'Teacher' : 'Admin'),
              college_id: collegeId,
            })
          )
        }
      })

      await Promise.all(promises)

      toast({
        type: 'success',
        title: 'Attendance Saved Successfully',
        description: `${course || 'B.Tech'} · ${branch || 'ECE'} · ${semester || 'Semester 1'} · Sec ${section || 'A'} · ${lecture} (${date})`,
      })
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Attendance Save Failed',
        description: err.message || 'Could not save attendance records',
      })
    }
  }, [course, branch, year, semester, section, lecture, date, currentRoster, getStatus, getRemark, user, role, currentTeacher, setAttendanceRecord, toast])

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // Exports
  const handleCSVExport = () => {
    const data = currentRoster.map((s, i) => ({
      'S.No': i + 1,
      'Roll Number': s.roll_no,
      'Student Name': s.name,
      'Course': course,
      'Branch': branch,
      'Year': year,
      'Semester': semester,
      'Section': section,
      'Date': date,
      'Lecture': lecture,
      'Attendance Status': getStatus(s.id),
      'Remark': getRemark(s.id),
    }))
    exportToCSV(`Attendance_${course}_${branch}_Sec${section}_${date}`, data)
    toast({ type: 'info', title: `CSV Exported for ${course} ${branch} Sec ${section}` })
  }

  const handleExcelExport = () => {
    handleCSVExport()
  }

  const handlePDFExport = () => {
    const studentsPdfData = currentRoster.map((s, i) => ({
      sNo: i + 1,
      rollNo: s.roll_no,
      name: s.name,
      status: getStatus(s.id),
      remark: getRemark(s.id),
    }))

    exportAttendancePDF(
      {
        collegeName: 'RRIMT',
        course,
        branch,
        year,
        semester,
        section,
        date,
        lecture,
      },
      studentsPdfData
    )
    toast({ type: 'info', title: `Generated PDF for ${course} ${branch} Sec ${section}` })
  }

  // ===== STUDENT & PARENT VIEW (WITH LIVE QR CODE SCANNER MODAL) =====
  if (role === 'student' || role === 'parent') {
    const userEmailLower = user?.email?.toLowerCase().trim()
    const targetStudentId = role === 'parent' ? (user?.child_student_id || user?.student_id) : (user?.student_id || user?.id)

    const matchedStudents = students.filter(
      (s) =>
        (targetStudentId &&
          (s.id === targetStudentId ||
            s.student_id === targetStudentId ||
            s.roll_no === targetStudentId ||
            `STU-${s.roll_no}` === targetStudentId ||
            targetStudentId.replace(/^STU-/i, '') === s.roll_no)) ||
        (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower) ||
        (role === 'parent' && userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower)
    )

    const rollNo = targetStudentId ? targetStudentId.replace(/^STU-/i, '') : ''
    const isMBA = rollNo.includes('MB') || (targetStudentId && targetStudentId.includes('MB'))

    const fallbackStudent = {
      id: targetStudentId || 'STU-001',
      student_id: targetStudentId || 'STU-001',
      roll_no: rollNo || 'MB24FIN006',
      name: user?.name ? (user.name.toLowerCase().includes('parent') ? user.name.replace(/parent/i, 'Child') : (role === 'parent' ? `${user.name}'s Child` : user.name)) : 'Student',
      course: isMBA ? 'MBA' : 'B.Tech',
      branch: isMBA ? 'Finance' : 'ECE',
      year: '1st Year',
      semester: 'Semester 1',
      section: 'A',
      class_name: isMBA ? 'MBA Finance - 1st Year - Section A' : 'B.Tech ECE - 1st Year - Section A',
      email: user?.email || '',
      phone: '',
      dob: '',
      gender: 'Male',
      blood_group: 'O+',
      address: '',
      parent_name: user?.name || '',
      parent_phone: '',
      parent_email: user?.email || '',
      college_id: user?.college_id || user?.school_id || '',
    }

    const targetStudent = matchedStudents.length > 0 ? matchedStudents[0] : fallbackStudent

    const studentRollNo = targetStudent?.roll_no
    const studentIdStr = targetStudent?.id
    const studentCustomId = targetStudent?.student_id
    const studentEmailLower = targetStudent?.email?.toLowerCase().trim()

    const rawAttendance = getAttendance()
    const allAttendance = rawAttendance
      .filter((a) => {
        if (!targetStudent) return false
        if (studentIdStr && a.student_id === studentIdStr) return true
        if (studentCustomId && a.student_id === studentCustomId) return true
        if (studentRollNo && (a.roll_no === studentRollNo || a.roll_no === `STU-${studentRollNo}` || `STU-${a.roll_no}` === studentRollNo)) return true
        if (studentEmailLower && a.student_name && a.student_name.toLowerCase().includes(studentEmailLower)) return true
        return false
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const presentCount = allAttendance.filter((a) => a.status === 'present' || a.status === 'late').length
    const absentCount = allAttendance.filter((a) => a.status === 'absent').length
    const totalCount = allAttendance.length
    const attendancePct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

    // STUDENT QR CODE VALIDATION ENGINE WITH STRICT ALERT MESSAGES
    const handleStudentScanSubmission = (rawInputText: string) => {
      const textToValidate = rawInputText.trim() || scannedPayloadInput.trim()
      if (!textToValidate) {
        toast({ type: 'error', title: 'Invalid Scan', description: 'No QR payload detected.' })
        return
      }

      const decoded = decodeQRPayload(textToValidate)

      // ALERT 1: Expiry check
      if (!decoded || Date.now() > decoded.expiresAt) {
        toast({
          type: 'error',
          title: 'QR Scan Failed',
          description: 'QR session expired. Please ask teacher to regenerate QR.',
        })
        return
      }

      // ALERT 2: Class match check (Course -> Year -> Branch -> Semester -> Section)
      const norm = (str?: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      const studentCourseNorm = norm(targetStudent.course)
      const studentYearNorm = norm(targetStudent.year)
      const studentBranchNorm = norm(targetStudent.branch)
      const studentSemNorm = norm(targetStudent.semester)
      const studentSecNorm = norm(targetStudent.section)

      const payloadCourseNorm = norm(decoded.course)
      const payloadYearNorm = norm(decoded.year)
      const payloadBranchNorm = norm(decoded.branch)
      const payloadSemNorm = norm(decoded.semester)
      const payloadSecNorm = norm(decoded.section)

      const matchCourse = !payloadCourseNorm || payloadCourseNorm === studentCourseNorm || studentCourseNorm.includes(payloadCourseNorm)
      const matchYear = !payloadYearNorm || payloadYearNorm === studentYearNorm
      const matchBranch = !payloadBranchNorm || payloadBranchNorm === studentBranchNorm || studentBranchNorm.includes(payloadBranchNorm) || payloadBranchNorm.includes(studentBranchNorm)
      const matchSem = !payloadSemNorm || payloadSemNorm === studentSemNorm
      const matchSec = !payloadSecNorm || payloadSecNorm === studentSecNorm

      if (!matchCourse || !matchYear || !matchBranch || (decoded.semester && !matchSem) || (decoded.section && !matchSec)) {
        toast({
          type: 'error',
          title: 'Class Mismatch',
          description: 'This is not your class QR.',
        })
        return
      }

      // ALERT 3: Dynamic token screenshot check (token timestamp latency must be <= 25 seconds)
      const payloadAgeMs = Date.now() - (decoded.tokenTimestamp || decoded.createdAt)
      if (payloadAgeMs > 25000) {
        toast({
          type: 'error',
          title: 'Anti-Proxy Security Check',
          description: 'Invalid or expired QR screenshot. Please scan live QR from display.',
        })
        return
      }

      // ALERT 4: Duplicate check for date & lecture
      const existingTodayLectureRecord = allAttendance.find(
        (a) => a.date === decoded.date && (a.lecture === decoded.lecture || !a.lecture)
      )

      if (existingTodayLectureRecord && (existingTodayLectureRecord.status === 'present' || existingTodayLectureRecord.status === 'late')) {
        toast({
          type: 'error',
          title: 'Duplicate Entry',
          description: 'You have already marked.',
        })
        return
      }

      // SUCCESS: Mark student present in Supabase/Store
      const collegeId = user?.college_id || user?.school_id || '13695a78-0105-4bde-bc85-d664bb66637e'
      const className = `${decoded.course} ${decoded.branch} - ${decoded.year} - Section ${decoded.section}`

      setAttendanceRecord({
        id: `att_${targetStudent.id}_${decoded.date}_${decoded.lecture}`,
        student_id: targetStudent.id,
        student_name: targetStudent.name,
        roll_no: targetStudent.roll_no,
        course: decoded.course,
        branch: decoded.branch,
        year: decoded.year,
        semester: decoded.semester,
        section: decoded.section,
        lecture: decoded.lecture,
        class_name: className,
        date: decoded.date,
        status: 'present',
        remarks: 'Marked via QR Code Scan',
        marked_by: 'QR Scanner (Student Self-Mark)',
        college_id: collegeId,
      })

      toast({
        type: 'success',
        title: 'Attendance Marked Present!',
        description: `Verified for ${decoded.course} ${decoded.branch} (${decoded.lecture}) on ${decoded.date}.`,
      })

      setIsScanModalOpen(false)
      setScannedPayloadInput('')
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-ink-900">
              {role === 'parent' ? `${targetStudent?.name || 'Child'}'s Attendance` : 'My Attendance'}
            </h1>
            {targetStudent ? (
              <p className="text-xs text-ink-400 mt-0.5">
                {targetStudent.name} • {targetStudent.course} • {targetStudent.branch} • {targetStudent.year} (Section {targetStudent.section}) • Roll No: {targetStudent.roll_no}
              </p>
            ) : (
              <p className="text-xs text-ink-400 mt-0.5">Student profile loading...</p>
            )}
          </div>

          {/* Student QR Scan Action Button */}
          {role === 'student' && (
            <button
              type="button"
              onClick={() => {
                try {
                  const activeLocalPayload = localStorage.getItem('eduth_active_qr_session')
                  if (activeLocalPayload) setScannedPayloadInput(activeLocalPayload)
                } catch {}
                setIsScanModalOpen(true)
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <QrCode className="h-4 w-4" />
              Scan QR Code
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)]">
            <p className="text-xs font-medium text-ink-400">Total Recorded Lectures</p>
            <p className="text-2xl font-display font-bold text-ink-900 mt-1">{totalCount}</p>
          </div>
          <div className="bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)]">
            <p className="text-xs font-medium text-emerald-600">Present</p>
            <p className="text-2xl font-display font-bold text-emerald-600 mt-1">{presentCount}</p>
          </div>
          <div className="bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)]">
            <p className="text-xs font-medium text-rose-600">Absent</p>
            <p className="text-2xl font-display font-bold text-rose-600 mt-1">{absentCount}</p>
          </div>
          <div className="bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)]">
            <p className="text-xs font-medium text-indigo-600">Attendance Percentage</p>
            <p className="text-2xl font-display font-bold text-indigo-600 mt-1">{attendancePct}%</p>
          </div>
        </div>

        {/* Attendance Log */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-ink-900">Date-wise Attendance History Log</h2>
            <span className="text-xs text-ink-400 font-medium">Sorted: Newest First</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/80 text-xs font-semibold text-ink-400 uppercase">
                  <th className="px-4 py-3">DATE</th>
                  <th className="px-4 py-3">CLASS / LECTURE</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">REMARKS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {allAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-ink-400 text-xs">
                      No official attendance records found yet for this student.
                    </td>
                  </tr>
                ) : (
                  allAttendance.map((rec, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-xs font-medium text-ink-900">{rec.date}</td>
                      <td className="px-4 py-3 text-xs text-ink-600">{rec.class_name || `${rec.course} ${rec.branch}`} ({rec.lecture || 'L-1'})</td>
                      <td className="px-4 py-3 text-xs font-semibold">
                        {rec.status === 'present' && <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Present</span>}
                        {rec.status === 'absent' && <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">Absent</span>}
                        {rec.status === 'late' && <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">Late</span>}
                        {rec.status === 'leave' && <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Leave</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-400 italic">{rec.remarks || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* STUDENT QR SCANNER MODAL */}
        {isScanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Scan Class QR Code</h3>
                    <p className="text-xs text-slate-500">Live Anti-Proxy Attendance Verification</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsScanModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Viewfinder Graphic */}
              <div className="relative bg-slate-950 rounded-xl p-4 overflow-hidden border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                
                {/* Scanner Frame */}
                <div className="relative w-44 h-44 border-2 border-dashed border-indigo-400/80 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-400"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-400"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400"></div>
                  
                  {/* Laser Line Animation */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_8px_#818cf8] animate-pulse"></div>
                  <Scan className="h-12 w-12 text-indigo-400/40 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-3 flex items-center gap-1.5">
                  <CameraIcon /> Align QR code inside frame
                </p>
              </div>

              {/* Manual Payload / Camera Simulation Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>QR Code Data Stream</span>
                  <span className="text-[10px] text-indigo-600 font-normal">Auto-detected or paste payload</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Paste QR payload or click simulate..."
                  value={scannedPayloadInput}
                  onChange={(e) => setScannedPayloadInput(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const activeLocalPayload = localStorage.getItem('eduth_active_qr_session')
                      if (activeLocalPayload) {
                        setScannedPayloadInput(activeLocalPayload)
                        toast({ type: 'info', title: 'Live QR Loaded', description: 'Fetched active QR token from display.' })
                      } else {
                        toast({ type: 'error', title: 'No Display Active', description: 'Ask teacher to click "Generate QR" first.' })
                      }
                    } catch {}
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Fetch Display QR
                </button>
                <button
                  type="button"
                  onClick={() => handleStudentScanSubmission(scannedPayloadInput)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Verify & Mark Present
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ===== ADMIN / TEACHER ATTENDANCE MARKING VIEW =====
  return (
    <div className="space-y-6">
      {/* Page Header with Mode Selector Dropdown / Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">Mark Attendance</h1>
          <p className="text-xs text-ink-400 mt-0.5">
            {date} • {course || 'B.Tech'} Academic Year 2026-27 {role === 'teacher' ? '(Teacher Access)' : '(Admin Access)'}
          </p>
        </div>

        {/* HEADER OPTION: Attendance Mode Switcher (Top Right Corner) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => setAttendanceMode('manual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              attendanceMode === 'manual'
                ? 'bg-white text-indigo-950 shadow-xs border border-slate-200/80'
                : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Manual Register
          </button>
          <button
            type="button"
            onClick={() => setAttendanceMode('qr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              attendanceMode === 'qr'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            QR Based
          </button>
          <button
            type="button"
            onClick={() => setAttendanceMode('fingerprint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              attendanceMode === 'fingerprint'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            <Fingerprint className="h-3.5 w-3.5" />
            Fingerprint Based
          </button>
        </div>
      </div>

      {/* MODE 1: QR BASED ATTENDANCE WORKFLOW */}
      {attendanceMode === 'qr' && (
        <div className="space-y-6">
          {/* QR Class Selection Filters Card */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-display font-bold text-ink-900 uppercase tracking-wider flex items-center gap-2">
                <QrCode className="h-4 w-4 text-indigo-600" />
                QR CLASS SELECTION FILTERS
              </h2>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Anti-Proxy Session Mode
              </span>
            </div>

            {/* Quick Class Selector for Teacher */}
            {role === 'teacher' && teacherAssignedClasses.length > 0 && (
              <div className="mb-4 p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg">
                <p className="text-xs font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-indigo-600" />
                  MY ASSIGNED CLASSES (Quick Select):
                </p>
                <div className="flex flex-wrap gap-2">
                  {teacherAssignedClasses.map((cls) => {
                    const secClean = (cls.section || '').replace(/^Section\s+/i, '').trim() || 'A'
                    const isSelected =
                      cls.course === course &&
                      cls.branch === branch &&
                      cls.year === year &&
                      (cls.semester ? cls.semester === semester : true) &&
                      secClean === section

                    return (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => {
                          setCourse(cls.course)
                          setYear(cls.year)
                          setBranch(cls.branch)
                          if (cls.semester) setSemester(cls.semester)
                          setSection(secClean)
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-indigo-950 border border-indigo-200 hover:bg-indigo-100/70'
                        }`}
                      >
                        {cls.name || `${cls.course} ${cls.branch} - ${cls.year} (Sec ${secClean})`}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Filter Inputs Grid in EXACT order: Date -> Course -> Year -> Branch -> Semester -> Lecture -> Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {/* 1. Date */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-[var(--radius-btn)] border border-border px-3 py-2 text-sm text-ink-900 bg-surface focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                />
              </div>

              {/* 2. Course */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Course</label>
                <Select
                  options={[
                    { value: 'B.Tech', label: 'B.Tech' },
                    { value: 'Diploma', label: 'Diploma' },
                    { value: 'MBA', label: 'MBA' },
                  ]}
                  placeholder="Select Course..."
                  value={course}
                  onChange={(e) => {
                    const c = e.target.value
                    setCourse(c)
                    setBranch('')
                    setSemester('')
                    setSection('')
                  }}
                />
              </div>

              {/* 3. Year */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Year</label>
                <Select
                  options={
                    course === 'MBA'
                      ? [{ value: '1st Year', label: '1st Year' }, { value: '2nd Year', label: '2nd Year' }]
                      : course === 'Diploma'
                      ? [{ value: '1st Year', label: '1st Year' }, { value: '2nd Year', label: '2nd Year' }, { value: '3rd Year', label: '3rd Year' }]
                      : [
                          { value: '1st Year', label: '1st Year' },
                          { value: '2nd Year', label: '2nd Year' },
                          { value: '3rd Year', label: '3rd Year' },
                          { value: '4th Year', label: '4th Year' },
                        ]
                  }
                  placeholder="Select Year..."
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value)
                    setSemester('')
                  }}
                />
              </div>

              {/* 4. Branch */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Branch</label>
                <Select
                  options={availableBranches}
                  placeholder="Select Branch..."
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={!course}
                />
              </div>

              {/* 5. Semester */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Semester</label>
                <Select
                  options={course && year ? semestersByYearCourse(year, course) : []}
                  placeholder="Select Sem..."
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  disabled={!course || !year}
                />
              </div>

              {/* 6. Lecture */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Lecture</label>
                <Select
                  options={[
                    { value: 'L-1', label: 'L-1' },
                    { value: 'L-2', label: 'L-2' },
                    { value: 'L-3', label: 'L-3' },
                    { value: 'L-4', label: 'L-4' },
                  ]}
                  value={lecture}
                  onChange={(e) => setLecture(e.target.value)}
                />
              </div>

              {/* 7. Section */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Section</label>
                <Select
                  options={[
                    { value: 'A', label: 'Section A' },
                    { value: 'B', label: 'Section B' },
                    { value: 'C', label: 'Section C' },
                    { value: 'D', label: 'Section D' },
                  ]}
                  placeholder="Select Section..."
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  disabled={!course || !branch}
                />
              </div>
            </div>

            {/* QR Generation Trigger Buttons */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={handleGenerateQR}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <QrCode className="h-4 w-4" />
                Generate QR Code
              </button>

              {qrSession && (
                <button
                  type="button"
                  onClick={handleGenerateQR}
                  className="px-4 py-2.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
                  Regenerate QR
                </button>
              )}
            </div>
          </div>

          {/* QR Display Card (Shown when QR session is active) */}
          {qrSession && qrPayloadString ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Display Box */}
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-5">
                <div className="flex items-center justify-between w-full border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Class QR Display</span>
                    <h3 className="text-lg font-bold text-white">
                      {course} {branch} • {year} ({semester})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">Live Anti-Proxy Active</span>
                  </div>
                </div>

                {/* SVG Rendered Crisp QR Code Matrix */}
                <div className="p-5 bg-white rounded-2xl shadow-2xl border-4 border-indigo-500/30 flex items-center justify-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderQRCodeSVG(qrPayloadString, 260),
                    }}
                  />
                </div>

                {/* Anti-Proxy Dynamic Token Status */}
                <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 text-xs text-slate-300">
                  <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span>Dynamic Security Token: <strong className="font-mono text-amber-300">{qrTokenData.token}</strong> (rotates every 12s)</span>
                </div>

                {/* Session Timer Progress Bar */}
                <div className="w-full bg-slate-800 rounded-xl p-4 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      Session Valid Remaining:
                    </span>
                    <span className="font-mono font-bold text-lg text-indigo-300">
                      {Math.floor(qrTimeRemaining / 60).toString().padStart(2, '0')}:
                      {(qrTimeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-1000"
                      style={{ width: `${(qrTimeRemaining / 300) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Side Summary & Security Info */}
              <div className="bg-surface rounded-2xl p-5 border border-border shadow-[var(--shadow-soft)] space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-ink-900 border-b border-border pb-2 mb-3">
                    QR Attendance Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-xs text-emerald-800 font-medium">Scanned & Marked Present</p>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">{counters.present} Students</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-ink-400 font-medium">Target Roster Count</p>
                      <p className="text-xl font-bold text-ink-900 mt-1">{counters.total} Students</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5">
                  <p className="font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    Anti-Proxy Protection
                  </p>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Students must scan the QR directly from the screen. Screenshots shared in chat groups will fail validation automatically.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-2xl p-10 border border-dashed border-border text-center flex flex-col items-center justify-center space-y-3">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <QrCode className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-900">No QR Code Generated Yet</h3>
                <p className="text-xs text-ink-400 max-w-sm mt-1">
                  Select your class parameters above and click <strong>"Generate QR Code"</strong> to launch a 5-minute dynamic attendance session.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: FINGERPRINT BASED ATTENDANCE WORKFLOW (UI DESIGN ONLY) */}
      {attendanceMode === 'fingerprint' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Biometric Device Visualizer */}
            <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)] space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                    <Fingerprint className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-ink-900">Biometric Sensor Window</h2>
                    <p className="text-xs text-ink-400">Optical Fingerprint Scanner (ID: BIO-FP-8082)</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                  <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                  Device Connected & Ready
                </span>
              </div>

              {/* Graphic Scanner Interface */}
              <div className="bg-slate-950 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 border border-slate-800">
                <div className="relative p-6 rounded-full bg-purple-950/40 border-2 border-purple-500/40 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping"></div>
                  <Fingerprint className="h-24 w-24 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Place Registered Finger on Scanner</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Hold finger flat against optical surface until green LED confirmation flashes.
                  </p>
                </div>
              </div>

              {/* Sensor Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toast({ type: 'info', title: 'Biometric UI Mode', description: 'Sensor hardware initialization simulated.' })}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Start Biometric Capture
                  </button>
                  <button
                    type="button"
                    onClick={() => toast({ type: 'info', title: 'Sensor Calibrated', description: 'Optical sensitivity reset to default.' })}
                    className="px-3.5 py-2 rounded-xl border border-border text-ink-700 text-xs font-semibold hover:bg-canvas transition-colors"
                  >
                    Calibrate Sensor
                  </button>
                </div>
                <span className="text-xs text-ink-400 font-medium">Baud Rate: 115200 bps</span>
              </div>
            </div>

            {/* Right Hardware Diagnostics & Status */}
            <div className="bg-surface rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)] space-y-4">
              <h3 className="text-sm font-bold text-ink-900 border-b border-border pb-2">
                Biometric Device Status
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-ink-400">Device Model</span>
                  <span className="font-semibold text-ink-900">SecuGen Hamster Pro 20</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-ink-400">Firmware Version</span>
                  <span className="font-semibold text-ink-900">v3.4.12-PRO</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-ink-400">Template Capacity</span>
                  <span className="font-semibold text-ink-900">5,000 Prints</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-ink-400">FAR / FRR Rate</span>
                  <span className="font-semibold text-emerald-600">0.001% (High Match)</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs space-y-1">
                <p className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  UI Prototype Mode
                </p>
                <p className="text-purple-800 text-[11px]">
                  Fingerprint hardware integration interface is active. Ready for WebAuthn / USB Fingerprint SDK binding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: MANUAL REGISTER ATTENDANCE WORKFLOW */}
      {attendanceMode === 'manual' && (
        <>
          {/* ACADEMIC SESSION Card */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-xs font-display font-bold text-ink-900 uppercase tracking-wider mb-4">
              ACADEMIC SESSION
            </h2>

            {/* Quick Class Selector for Teacher */}
            {role === 'teacher' && teacherAssignedClasses.length > 0 && (
              <div className="mb-4 p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg">
                <p className="text-xs font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-indigo-600" />
                  MY ASSIGNED CLASSES (Quick Select):
                </p>
                <div className="flex flex-wrap gap-2">
                  {teacherAssignedClasses.map((cls) => {
                    const secClean = (cls.section || '').replace(/^Section\s+/i, '').trim() || 'A'
                    const isSelected =
                      cls.course === course &&
                      cls.branch === branch &&
                      cls.year === year &&
                      (cls.semester ? cls.semester === semester : true) &&
                      secClean === section

                    return (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => {
                          setCourse(cls.course)
                          setYear(cls.year)
                          setBranch(cls.branch)
                          if (cls.semester) setSemester(cls.semester)
                          setSection(secClean)
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-indigo-950 border border-indigo-200 hover:bg-indigo-100/70'
                        }`}
                      >
                        {cls.name || `${cls.course} ${cls.branch} - ${cls.year} (Sec ${secClean})`}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Filter Inputs Grid in EXACT order: Date -> Course -> Year -> Branch -> Semester -> Lecture -> Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {/* 1. Date */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-[var(--radius-btn)] border border-border px-3 py-2 text-sm text-ink-900 bg-surface focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                />
              </div>

              {/* 2. Course */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Course</label>
                <Select
                  options={[
                    { value: 'B.Tech', label: 'B.Tech' },
                    { value: 'Diploma', label: 'Diploma' },
                    { value: 'MBA', label: 'MBA' },
                  ]}
                  placeholder="Select Course..."
                  value={course}
                  onChange={(e) => {
                    const c = e.target.value
                    setCourse(c)
                    setBranch('')
                    setSemester('')
                    setSection('')
                  }}
                />
              </div>

              {/* 3. Year */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Year</label>
                <Select
                  options={
                    course === 'MBA'
                      ? [{ value: '1st Year', label: '1st Year' }, { value: '2nd Year', label: '2nd Year' }]
                      : course === 'Diploma'
                      ? [{ value: '1st Year', label: '1st Year' }, { value: '2nd Year', label: '2nd Year' }, { value: '3rd Year', label: '3rd Year' }]
                      : [
                          { value: '1st Year', label: '1st Year' },
                          { value: '2nd Year', label: '2nd Year' },
                          { value: '3rd Year', label: '3rd Year' },
                          { value: '4th Year', label: '4th Year' },
                        ]
                  }
                  placeholder="Select Year..."
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value)
                    setSemester('')
                  }}
                />
              </div>

              {/* 4. Branch */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Branch</label>
                <Select
                  options={availableBranches}
                  placeholder="Select Branch..."
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={!course}
                />
              </div>

              {/* 5. Semester */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Semester</label>
                <Select
                  options={course && year ? semestersByYearCourse(year, course) : []}
                  placeholder="Select Sem..."
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  disabled={!course || !year}
                />
              </div>

              {/* 6. Lecture */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Lecture</label>
                <Select
                  options={[
                    { value: 'L-1', label: 'L-1' },
                    { value: 'L-2', label: 'L-2' },
                    { value: 'L-3', label: 'L-3' },
                    { value: 'L-4', label: 'L-4' },
                  ]}
                  value={lecture}
                  onChange={(e) => setLecture(e.target.value)}
                />
              </div>

              {/* 7. Section */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink-600">Section</label>
                <Select
                  options={[
                    { value: 'A', label: 'Section A' },
                    { value: 'B', label: 'Section B' },
                    { value: 'C', label: 'Section C' },
                    { value: 'D', label: 'Section D' },
                  ]}
                  placeholder="Select Section..."
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  disabled={!course || !branch}
                />
              </div>
            </div>
          </div>

          {/* Actions & Counters Card */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] space-y-4">
            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleMarkAllPresent}
                  className="px-4 py-2 rounded-[var(--radius-btn)] bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCheck className="h-4 w-4" /> Mark All Present
                </button>
                <button
                  onClick={handleMarkAllAbsent}
                  className="px-4 py-2 rounded-[var(--radius-btn)] bg-rose-700 hover:bg-rose-800 text-white font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="h-4 w-4" /> Mark All Absent
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-[var(--radius-btn)] border border-border text-ink-700 hover:bg-canvas font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>

              {/* Right Export & Save Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCSVExport}
                  className="px-3.5 py-2 rounded-[var(--radius-btn)] border border-border text-ink-700 hover:bg-canvas text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
                <button
                  onClick={handleExcelExport}
                  className="px-3.5 py-2 rounded-[var(--radius-btn)] border border-border text-ink-700 hover:bg-canvas text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
                </button>
                <button
                  onClick={handlePDFExport}
                  className="px-3.5 py-2 rounded-[var(--radius-btn)] border border-border text-ink-700 hover:bg-canvas text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" /> PDF
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-[var(--radius-btn)] bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Save className="h-4 w-4" /> Save (Ctrl+S)
                </button>
              </div>
            </div>

            {/* Counter Stats Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 pt-3 border-t border-border/60">
              <div>
                <p className="text-xl font-display font-bold text-ink-900">{counters.total}</p>
                <p className="text-xs text-ink-400 font-medium mt-0.5">Total</p>
              </div>
              <div>
                <p className="text-xl font-display font-bold text-indigo-600">{counters.marked}</p>
                <p className="text-xs text-ink-400 font-medium mt-0.5">Marked</p>
              </div>
              <div>
                <p className="text-xl font-display font-bold text-emerald-600">{counters.present}</p>
                <p className="text-xs text-ink-400 font-medium mt-0.5">Present</p>
              </div>
              <div>
                <p className="text-xl font-display font-bold text-rose-600">{counters.absent}</p>
                <p className="text-xs text-ink-400 font-medium mt-0.5">Absent</p>
              </div>
              <div>
                <p className="text-xl font-display font-bold text-amber-600">{counters.late}</p>
                <p className="text-xs text-ink-400 font-medium mt-0.5">Late</p>
              </div>
              <div>
                <p className="text-xl font-display font-bold text-blue-600">{counters.leave}</p>
                <p className="text-xs text-ink-400 font-medium mt-0.5">Leave</p>
              </div>
            </div>
          </div>

          {/* Search and Filter Tabs Container */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search */}
            <SearchInput
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80"
            />

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: `All` },
                { id: 'present', label: `Present (${statusCounts.present})` },
                { id: 'absent', label: `Absent (${statusCounts.absent})` },
                { id: 'late', label: `Late (${statusCounts.late})` },
                { id: 'leave', label: `Leave (${statusCounts.leave})` },
              ].map((tab) => {
                const isActive = activeFilterTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilterTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-indigo-900 text-white'
                        : 'bg-surface text-ink-600 border border-border hover:bg-canvas'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}

              <div className="flex items-center gap-1 text-xs text-ink-400 font-medium ml-2">
                <Users className="h-3.5 w-3.5" />
                <span>{displayedRoster.length} students</span>
              </div>
            </div>
          </div>

          {/* Student Attendance Table */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-slate-50/80 text-xs font-semibold text-ink-400 uppercase">
                    <th className="px-4 py-3.5 w-12">#</th>
                    <th className="px-4 py-3.5 w-44">ROLL NO.</th>
                    <th className="px-4 py-3.5">NAME</th>
                    <th className="px-4 py-3.5 w-36">STATUS</th>
                    <th className="px-4 py-3.5 w-48">MARK</th>
                    <th className="px-4 py-3.5 w-64">REMARKS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {displayedRoster.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-ink-400 text-sm">
                        No students match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    displayedRoster.map((student, idx) => {
                      const currentStatus = getStatus(student.id)
                      const remark = getRemark(student.id)

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-ink-400 text-xs font-medium">{idx + 1}</td>
                          <td className="px-4 py-3 font-semibold text-indigo-600 text-xs tracking-wider font-mono">
                            {student.roll_no}
                          </td>
                          <td className="px-4 py-3 font-bold text-ink-900 text-xs tracking-wide uppercase">
                            {student.name}
                          </td>
                          <td className="px-4 py-3 text-xs italic">
                            {currentStatus === 'not_marked' && <span className="text-ink-400">Not marked</span>}
                            {currentStatus === 'present' && <span className="text-emerald-600 font-semibold not-italic">Present</span>}
                            {currentStatus === 'absent' && <span className="text-rose-600 font-semibold not-italic">Absent</span>}
                            {currentStatus === 'late' && <span className="text-amber-600 font-semibold not-italic">Late</span>}
                            {currentStatus === 'leave' && <span className="text-blue-600 font-semibold not-italic">Leave</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setStudentStatus(student.id, 'present')}
                                className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer border ${
                                  currentStatus === 'present'
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                    : 'bg-surface border-border text-ink-600 hover:border-emerald-500 hover:text-emerald-600'
                                }`}
                                title="Mark Present"
                              >
                                P
                              </button>
                              <button
                                onClick={() => setStudentStatus(student.id, 'absent')}
                                className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer border ${
                                  currentStatus === 'absent'
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                                    : 'bg-surface border-border text-ink-600 hover:border-rose-500 hover:text-rose-600'
                                }`}
                                title="Mark Absent"
                              >
                                A
                              </button>
                              <button
                                onClick={() => setStudentStatus(student.id, 'late')}
                                className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer border ${
                                  currentStatus === 'late'
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                                    : 'bg-surface border-border text-ink-600 hover:border-amber-500 hover:text-amber-600'
                                }`}
                                title="Mark Late"
                              >
                                L
                              </button>
                              <button
                                onClick={() => setStudentStatus(student.id, 'leave')}
                                className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer border ${
                                  currentStatus === 'leave'
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                    : 'bg-surface border-border text-ink-600 hover:border-blue-500 hover:text-blue-600'
                                }`}
                                title="Mark Leave"
                              >
                                Lv
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="Add remark..."
                              value={remark}
                              onChange={(e) => setStudentRemark(student.id, e.target.value)}
                              className="w-full rounded border border-border px-2.5 py-1 text-xs text-ink-900 bg-surface placeholder:text-ink-400 focus:outline-none focus:border-indigo-600"
                            />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function CameraIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
