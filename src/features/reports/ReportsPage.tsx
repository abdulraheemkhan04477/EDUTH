import { useState, useMemo } from 'react'
import { Tabs, StatCard, Button, DataTable, StatusPill, Select, SearchInput, EmptyState } from '../../components/ui'
import {
  Users, GraduationCap, TrendingUp, IndianRupee, Download, Printer,
  CalendarCheck, Award, FileText, CheckCircle2, AlertCircle, Clock,
  BookOpen, FolderOpen, Lock, ShieldCheck, Building, Briefcase
} from 'lucide-react'
import { formatCurrency } from '../../lib/formatCurrency'
import { exportToCSV, exportToPDF, exportExamResultsPDF } from '../../lib/exportUtils'
import { useAcademicStore, COURSES, BRANCHES_BY_COURSE, YEARS, YEARS_BY_COURSE, SEMESTERS_BY_COURSE, getTeacherForUser, isBranchMatch, isSemesterMatch } from '../../lib/academicStore'
import { useExamStore } from '../../lib/examStore'
import { useFeeStore } from '../../lib/feeStore'
import { useAssignmentStore } from '../../lib/assignmentStore'
import { useStudyMaterialStore } from '../../lib/studyMaterialStore'
import { useTnpStore } from '../../lib/tnpStore'
import { useAuth } from '../../app/providers/AuthProvider'
import { hasPermission } from '../../services/permissionService'

// Year ↔ Semester mapping per course (BUG 1 FIX)
const SEMESTERS_BY_YEAR_COURSE_MAP: Record<string, Record<string, string[]>> = {
  'B.Tech': {
    '1st Year': ['Semester 1', 'Semester 2'],
    '2nd Year': ['Semester 3', 'Semester 4'],
    '3rd Year': ['Semester 5', 'Semester 6'],
    '4th Year': ['Semester 7', 'Semester 8'],
  },
  Diploma: {
    '1st Year': ['Semester 1', 'Semester 2'],
    '2nd Year': ['Semester 3', 'Semester 4'],
    '3rd Year': ['Semester 5', 'Semester 6'],
  },
  MBA: {
    '1st Year': ['Semester 1', 'Semester 2'],
    '2nd Year': ['Semester 3', 'Semester 4'],
  },
}

function getYearForSemester(sem: string, course: string): string | null {
  if (!sem || sem === 'All Semesters') return null
  const cMap = SEMESTERS_BY_YEAR_COURSE_MAP[course] || SEMESTERS_BY_YEAR_COURSE_MAP['B.Tech']
  for (const [yr, sems] of Object.entries(cMap)) {
    if (sems.some((s) => s === sem || isSemesterMatch(s, sem))) {
      return yr
    }
  }
  return null
}

export function ReportsPage() {
  const { user, role } = useAuth()
  const isStudent = role === 'student'
  const isParent = role === 'parent'
  const isTeacher = role === 'teacher'
  const isAdmin = role === 'admin' || role === 'super_admin'

  // Stores
  const { students, teachers, classes, getAttendance } = useAcademicStore()
  const { results } = useExamStore()
  const { studentFees } = useFeeStore()
  const { assignments } = useAssignmentStore()
  const { materials } = useStudyMaterialStore()
  const { companies, drives, applications, placements, activities: _activities, adminMetrics: _adminMetrics } = useTnpStore()

  // Teacher Scoping Context
  const currentTeacher = useMemo(() => {
    if (!isTeacher) return null
    return getTeacherForUser(user, teachers, classes)
  }, [teachers, classes, user, isTeacher])

  // Linked student resolution for Student / Parent
  const currentStudent = useMemo(() => {
    const userEmailLower = user?.email?.toLowerCase().trim()
    if (isStudent) {
      const sId = user?.student_id || user?.id
      return students.find(
        (s) =>
          (sId && (s.id === sId || s.student_id === sId || s.roll_no === sId)) ||
          (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower) ||
          (user?.id && s.id === user.id)
      ) || null
    }
    if (isParent) {
      const childId = user?.child_student_id || user?.student_id
      return students.find(
        (s) =>
          (childId && (s.id === childId || s.student_id === childId || s.roll_no === childId)) ||
          (userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower)
      ) || null
    }
    return null
  }, [students, user, isStudent, isParent])

  // Helper evaluator: Is a given record/class in Teacher's assigned class scope?
  const isRecordInTeacherScope = useMemo(() => {
    return (item: { course?: string; branch?: string; year?: string; year_semester?: string; semester?: string; section?: string }) => {
      if (isAdmin) return true
      if (isStudent || isParent) return true
      if (!isTeacher || !currentTeacher) return false

      const assigned = currentTeacher.assigned_classes || []
      const itemCourse = (item.course || '').toLowerCase()
      const itemBranch = (item.branch || '').toLowerCase()
      const itemYr = (item.year || item.year_semester || item.semester || '').toLowerCase()

      // Check DB classes matching teacher
      const matchedClassInDb = classes.some((c) => {
        const isTeacherMatch =
          c.teacher_id === currentTeacher.teacher_id ||
          c.teacher_id === currentTeacher.id ||
          (c.teacher_name && currentTeacher.name && c.teacher_name.toLowerCase() === currentTeacher.name.toLowerCase())
        if (!isTeacherMatch) return false

        const cCourse = c.course.toLowerCase()
        const cBranch = c.branch.toLowerCase()
        const cYr = (c.semester || c.year || '').toLowerCase()

        return (!itemCourse || itemCourse === cCourse) && (!itemBranch || itemBranch === cBranch) && (!itemYr || itemYr.includes(cYr) || cYr.includes(itemYr))
      })
      if (matchedClassInDb) return true

      if (assigned.length === 0) return true

      return assigned.some((assignedStr) => {
        const norm = assignedStr.toLowerCase()
        const matchCourse = !itemCourse || norm.includes(itemCourse)
        const matchBranch = !itemBranch || itemBranch === 'all branches / common' || itemBranch === 'common' || norm.includes(itemBranch)
        const matchYr = !itemYr || norm.includes(itemYr)
        return matchCourse && matchBranch && matchYr
      })
    }
  }, [isAdmin, isStudent, isParent, isTeacher, currentTeacher, classes])

  // Report Category Tabs
  const reportTabs = isStudent || isParent
    ? [
        { id: 'attendance', label: 'Attendance Report' },
        { id: 'exams', label: 'Exam & Result Report' },
        { id: 'fee', label: 'Fee Report' },
        { id: 'assignment', label: 'Assignment Report' },
        { id: 'study_material', label: 'Study Material' },
      ]
    : [
        { id: 'student', label: 'Student Report' },
        { id: 'teacher', label: 'Teacher Report' },
        { id: 'attendance', label: 'Attendance Report' },
        { id: 'exams', label: 'Exam & Result Report' },
        { id: 'fee', label: 'Fee Report' },
        { id: 'assignment', label: 'Assignment Report' },
        { id: 'study_material', label: 'Study Material' },
        { id: 'tnp', label: 'TNP Report' },
      ]

  // Tab state
  const [activeTab, setActiveTab] = useState<string>(isStudent || isParent ? 'attendance' : 'student')

  // Academic Filter States
  const [filterCourse, setFilterCourse] = useState('All Courses')
  const [filterBranch, setFilterBranch] = useState('All Branches')
  const [filterYear, setFilterYear] = useState('All Years')
  const [filterSemester, setFilterSemester] = useState('All Semesters')
  const [filterSection, setFilterSection] = useState('All Sections')
  const [filterStatus, setFilterStatus] = useState('All Statuses')
  const [search, setSearch] = useState('')

  // Branch options based on course filter
  const availableBranches = useMemo(() => {
    if (filterCourse === 'All Courses') {
      const set = new Set<string>()
      Object.values(BRANCHES_BY_COURSE).forEach((list) => list.forEach((b) => set.add(b)))
      return Array.from(set)
    }
    return BRANCHES_BY_COURSE[filterCourse] || []
  }, [filterCourse])

  // Years available based on course filter (BUG 1 FIX)
  const availableYears = useMemo(() => {
    if (filterCourse === 'All Courses') return YEARS
    return YEARS_BY_COURSE(filterCourse) || YEARS
  }, [filterCourse])

  // Semester options strictly based on year + course (BUG 1 FIX)
  const availableSemesters = useMemo(() => {
    if (filterCourse === 'All Courses') {
      if (filterYear === 'All Years') {
        return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']
      }
      return SEMESTERS_BY_YEAR_COURSE_MAP['B.Tech'][filterYear] || ['Semester 1', 'Semester 2']
    }

    if (filterYear === 'All Years') {
      const allSems = SEMESTERS_BY_COURSE(filterCourse)
      return allSems.map((s) => s.replace('1st Semester', 'Semester 1').replace('2nd Semester', 'Semester 2').replace('3rd Semester', 'Semester 3').replace('4th Semester', 'Semester 4').replace('5th Semester', 'Semester 5').replace('6th Semester', 'Semester 6').replace('7th Semester', 'Semester 7').replace('8th Semester', 'Semester 8'))
    }

    const cMap = SEMESTERS_BY_YEAR_COURSE_MAP[filterCourse] || SEMESTERS_BY_YEAR_COURSE_MAP['B.Tech']
    return cMap[filterYear] || ['Semester 1', 'Semester 2']
  }, [filterCourse, filterYear])

  // Filter Change Handlers (BUG 1 FIX)
  const handleCourseChange = (c: string) => {
    setFilterCourse(c)
    setFilterBranch('All Branches')
    setFilterYear('All Years')
    setFilterSemester('All Semesters')
  }

  const handleYearChange = (y: string) => {
    setFilterYear(y)
    if (y === 'All Years') {
      setFilterSemester('All Semesters')
    } else {
      const cMap = SEMESTERS_BY_YEAR_COURSE_MAP[filterCourse] || SEMESTERS_BY_YEAR_COURSE_MAP['B.Tech']
      const validSems = cMap[y] || []
      if (filterSemester !== 'All Semesters' && !validSems.includes(filterSemester)) {
        setFilterSemester('All Semesters')
      }
    }
  }

  const handleSemesterChange = (s: string) => {
    setFilterSemester(s)
    if (s !== 'All Semesters') {
      const lockedYr = getYearForSemester(s, filterCourse)
      if (lockedYr) {
        setFilterYear(lockedYr)
      }
    }
  }

  // Academic matching helper
  const matchesAcademic = (item: { course?: string; branch?: string; year?: string; year_semester?: string; semester?: string; section?: string }) => {
    if (filterCourse !== 'All Courses' && item.course && item.course !== filterCourse) return false
    if (filterBranch !== 'All Branches' && item.branch && item.branch !== 'Common Subject' && item.branch !== 'all' && !isBranchMatch(item.branch, filterBranch)) return false
    
    const yr = item.year || item.year_semester
    if (filterYear !== 'All Years' && yr && yr !== filterYear) return false
    if (filterSemester !== 'All Semesters' && item.semester && !isSemesterMatch(item.semester, filterSemester)) return false
    if (filterSection !== 'All Sections' && item.section && item.section !== filterSection) return false

    return true
  }

  // 1. FILTERED STUDENT REPORT DATA
  const filteredStudents = useMemo(() => {
    let source = students
    if (isStudent || isParent) {
      source = currentStudent ? [currentStudent] : []
    } else if (isTeacher) {
      source = students.filter((s) => isRecordInTeacherScope(s))
    }

    return source.filter((s) => {
      if (!matchesAcademic(s)) return false
      if (search) {
        const q = search.toLowerCase()
        if (!s.name.toLowerCase().includes(q) && !s.roll_no.toLowerCase().includes(q) && !s.student_id.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [students, currentStudent, isStudent, isParent, isTeacher, isRecordInTeacherScope, filterCourse, filterBranch, filterYear, filterSemester, filterSection, search])

  // 2. FILTERED TEACHER REPORT DATA
  const filteredTeachers = useMemo(() => {
    let source = teachers
    if (isTeacher && currentTeacher) {
      source = [currentTeacher]
    }
    return source.filter((t) => {
      if (filterCourse !== 'All Courses' && t.course && t.course !== filterCourse) return false
      if (filterBranch !== 'All Branches' && t.department && t.department !== filterBranch) return false
      if (search) {
        const q = search.toLowerCase()
        if (!t.name.toLowerCase().includes(q) && !t.teacher_id.toLowerCase().includes(q) && !(t.qualification || '').toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [teachers, currentTeacher, isTeacher, filterCourse, filterBranch, search])

  // 3. FILTERED ATTENDANCE REPORT DATA
  const filteredAttendance = useMemo(() => {
    const allRecords = getAttendance()
    return filteredStudents.map((st) => {
      const studentRecords = allRecords.filter(
        (a) => a.student_id === st.id || (st.student_id && a.student_id === st.student_id) || (st.roll_no && a.roll_no === st.roll_no)
      )
      const totalLectures = studentRecords.length
      const presentLectures = studentRecords.filter((r) => r.status === 'present' || r.status === 'late').length
      const absentLectures = studentRecords.filter((r) => r.status === 'absent').length
      const attPct = totalLectures > 0 ? Math.round((presentLectures / totalLectures) * 100) : 0
      return {
        id: st.id,
        name: st.name,
        roll_no: st.roll_no,
        student_id: st.student_id,
        course: st.course,
        branch: st.branch,
        year: st.year,
        semester: st.semester,
        section: st.section,
        totalLectures,
        presentLectures,
        absentLectures,
        attPct: `${attPct}%`,
        attPctValue: attPct,
      }
    })
  }, [filteredStudents, getAttendance])

  // 4. FILTERED EXAM RESULTS DATA
  const filteredExamResults = useMemo(() => {
    let source = results
    if (isStudent || isParent) {
      if (!currentStudent) return []
      source = results.filter(
        (r) =>
          r.is_published &&
          (r.student_id === currentStudent.id ||
            r.student_id === currentStudent.student_id ||
            r.roll_no === currentStudent.roll_no)
      )
    } else if (isTeacher) {
      source = results.filter((r) => isRecordInTeacherScope(r))
    }

    return source.filter((r) => {
      if (!matchesAcademic(r)) return false
      if (filterStatus !== 'All Statuses' && r.status !== filterStatus) return false
      if (search) {
        const q = search.toLowerCase()
        if (!r.student_name.toLowerCase().includes(q) && !r.roll_no.toLowerCase().includes(q) && !r.subject.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [results, currentStudent, isStudent, isParent, isTeacher, isRecordInTeacherScope, filterCourse, filterBranch, filterYear, filterSemester, filterSection, filterStatus, search])

  // Unique subjects list from filtered exam results (BUG 2 FIX)
  const examSubjectsList = useMemo(() => {
    const set = new Set<string>()
    filteredExamResults.forEach((r) => {
      if (r.subject) set.add(r.subject.trim())
    })
    return Array.from(set)
  }, [filteredExamResults])

  // Pivoted rows: 1 row per student with marks under subject columns (BUG 2 FIX)
  const pivotedExamRows = useMemo(() => {
    if (filteredExamResults.length === 0) return []

    const studentMap = new Map<string, {
      id: string
      student_name: string
      roll_no: string
      student_id: string
      course: string
      branch: string
      year: string
      semester: string
      marksBySubject: Record<string, number>
      totalObtained: number
      totalMax: number
    }>()

    filteredExamResults.forEach((r) => {
      const key = r.student_id || r.roll_no || r.student_name
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          id: r.id,
          student_name: r.student_name,
          roll_no: r.roll_no,
          student_id: r.student_id || '',
          course: r.course || '',
          branch: r.branch || '',
          year: r.year || '',
          semester: r.semester || '',
          marksBySubject: {},
          totalObtained: 0,
          totalMax: 0,
        })
      }

      const sEntry = studentMap.get(key)!
      const subj = r.subject ? r.subject.trim() : 'Subject'
      const obt = Number(r.obtained_marks ?? (r as any).marks ?? 0)
      const max = Number(r.max_marks || 100)

      if (sEntry.marksBySubject[subj] !== undefined) {
        sEntry.marksBySubject[subj] += obt
      } else {
        sEntry.marksBySubject[subj] = obt
      }

      sEntry.totalObtained += obt
      sEntry.totalMax += max
    })

    return Array.from(studentMap.values())
  }, [filteredExamResults])

  // 5. FILTERED FEE REPORT DATA
  const filteredFees = useMemo(() => {
    return studentFees.filter((sf) => {
      if (!sf) return false
      if (filterCourse !== 'All Courses' && sf.course && sf.course !== filterCourse) return false
      if (filterBranch !== 'All Branches' && sf.branch && !isBranchMatch(sf.branch, filterBranch)) return false
      if (filterYear !== 'All Years' && sf.year_semester && sf.year_semester !== filterYear) return false
      if (filterSemester !== 'All Semesters' && sf.year_semester && !isSemesterMatch(sf.year_semester, filterSemester)) return false
      if (filterSection !== 'All Sections' && sf.section && sf.section !== filterSection) return false
      if (filterStatus !== 'All Statuses' && sf.status && sf.status.toLowerCase() !== filterStatus.toLowerCase()) return false
      if (search) {
        const q = search.toLowerCase()
        const matchName = (sf.student_name || '').toLowerCase().includes(q)
        const matchRoll = (sf.roll_no || '').toLowerCase().includes(q)
        if (!matchName && !matchRoll) return false
      }
      return true
    })
  }, [studentFees, filterCourse, filterBranch, filterYear, filterSemester, filterSection, filterStatus, search])

  // 6. FILTERED ASSIGNMENT REPORT DATA
  const filteredAssignments = useMemo(() => {
    let source = assignments
    if (isStudent || isParent) {
      if (!currentStudent) return []
      source = assignments.filter(() => matchesAcademic({ course: currentStudent.course, branch: currentStudent.branch, semester: currentStudent.semester }))
    } else if (isTeacher) {
      source = assignments.filter((a) => isRecordInTeacherScope(a))
    }

    return source.filter((a) => {
      if (!matchesAcademic(a)) return false
      if (search) {
        const q = search.toLowerCase()
        if (!a.title.toLowerCase().includes(q) && !a.subject.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [assignments, currentStudent, isStudent, isParent, isTeacher, isRecordInTeacherScope, filterCourse, filterBranch, filterYear, filterSemester, filterSection, search])

  // 7. FILTERED STUDY MATERIAL REPORT DATA
  const filteredMaterials = useMemo(() => {
    let source = materials
    if (isStudent || isParent) {
      if (!currentStudent) return []
      source = materials.filter(() => matchesAcademic({ course: currentStudent.course, branch: currentStudent.branch, semester: currentStudent.semester }))
    }

    return source.filter((m) => {
      if (filterCourse !== 'All Courses' && m.course !== filterCourse) return false
      if (filterBranch !== 'All Branches' && m.branch !== 'Common Subject' && m.branch !== filterBranch) return false
      if (filterSemester !== 'All Semesters' && m.semester !== filterSemester) return false
      if (search) {
        const q = search.toLowerCase()
        if (!m.title.toLowerCase().includes(q) && !m.subject_name.toLowerCase().includes(q) && !m.category.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [materials, currentStudent, isStudent, isParent, filterCourse, filterBranch, filterSemester, search])

  // 8. FILTERED TNP REPORT DATA
  const filteredTnpPlacements = useMemo(() => {
    let source = placements
    if (isTeacher) {
      source = placements.filter((p) => isRecordInTeacherScope(p))
    }
    return source.filter((p) => {
      if (!matchesAcademic(p)) return false
      if (search) {
        const q = search.toLowerCase()
        if (!p.student_name.toLowerCase().includes(q) && !p.roll_no.toLowerCase().includes(q) && !p.company_name.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [placements, isTeacher, isRecordInTeacherScope, filterCourse, filterBranch, filterYear, filterSemester, filterSection, search])

  // Conducted lectures count from actual attendance records
  const totalLecturesConducted = useMemo(() => {
    const allRecords = getAttendance()
    const sessionKeys = new Set(allRecords.map((a) => `${a.date}_${a.course}_${a.branch}_${a.year}_${a.section}_${a.lecture}`))
    return sessionKeys.size
  }, [getAttendance])

  // Dynamic fee metrics calculated from filtered fee records
  const calculatedFeeMetrics = useMemo(() => {
    const totalFees = filteredFees.reduce((sum, f) => sum + (f.total_fee || 0), 0)
    const totalPaid = filteredFees.reduce((sum, f) => sum + (f.paid || 0), 0)
    const totalPending = filteredFees.reduce((sum, f) => sum + (f.pending || 0), 0)
    const dueCount = filteredFees.filter((f) => f.status === 'due').length
    const paidPct = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0
    return { totalFees, totalPaid, totalPending, dueCount, paidPct }
  }, [filteredFees])

  const canExport = isAdmin || isStudent || isParent || (isTeacher && hasPermission(user, 'reports.export'))

  // ===== CSV EXPORT HANDLER =====
  const handleExportCSV = () => {
    if (!canExport) return
    let filename = `eduth_${activeTab}_report`
    let dataToExport: Record<string, any>[] = []

    if (activeTab === 'student') dataToExport = filteredStudents
    else if (activeTab === 'teacher') dataToExport = filteredTeachers
    else if (activeTab === 'attendance') dataToExport = filteredAttendance
    else if (activeTab === 'exams') dataToExport = pivotedExamRows
    else if (activeTab === 'fee') dataToExport = filteredFees
    else if (activeTab === 'assignment') dataToExport = filteredAssignments
    else if (activeTab === 'study_material') dataToExport = filteredMaterials

    exportToCSV(filename, dataToExport)
  }

  // ===== PDF EXPORT HANDLER (BUG 3 FIX) =====
  const handleExportPDF = () => {
    if (!canExport) return

    if (activeTab === 'exams') {
      exportExamResultsPDF(
        {
          collegeName: (user as any)?.college_name || 'RRIMT',
          collegeId: user?.college_id || '13695a78-0105-4bde-bc85-d664bb66637e',
          reportTitle: 'Examination & Results Report',
          course: filterCourse,
          branch: filterBranch,
          year: filterYear,
          semester: filterSemester,
          section: filterSection,
          generatedBy: user?.name || role || 'Admin',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        },
        examSubjectsList,
        pivotedExamRows
      )
      return
    }

    let title = 'College Management Analytical Report'
    let subtitle = `Filtered Data Report (${filterCourse} • ${filterBranch})`
    let columns: { key: string; header: string }[] = []
    let dataToExport: Record<string, any>[] = []

    if (activeTab === 'student') {
      title = 'College Student Directory Report'
      columns = [
        { key: 'name', header: 'Student Name' },
        { key: 'roll_no', header: 'Roll No' },
        { key: 'student_id', header: 'Student ID' },
        { key: 'course', header: 'Course' },
        { key: 'branch', header: 'Branch' },
        { key: 'year', header: 'Year' },
        { key: 'section', header: 'Section' },
      ]
      dataToExport = filteredStudents
    } else if (activeTab === 'teacher') {
      title = 'Faculty & Teacher Directory Report'
      columns = [
        { key: 'name', header: 'Faculty Name' },
        { key: 'teacher_id', header: 'Teacher ID' },
        { key: 'position', header: 'Position' },
        { key: 'department', header: 'Department' },
        { key: 'qualification', header: 'Qualification' },
      ]
      dataToExport = filteredTeachers
    } else if (activeTab === 'attendance') {
      title = 'Academic Attendance Report'
      columns = [
        { key: 'name', header: 'Student' },
        { key: 'roll_no', header: 'Roll No' },
        { key: 'branch', header: 'Branch' },
        { key: 'presentLectures', header: 'Present' },
        { key: 'absentLectures', header: 'Absent' },
        { key: 'attPct', header: 'Attendance %' },
      ]
      dataToExport = filteredAttendance
    } else if (activeTab === 'fee') {
      title = 'Financial Fee Ledger Report'
      columns = [
        { key: 'student_name', header: 'Student' },
        { key: 'roll_no', header: 'Roll No' },
        { key: 'course', header: 'Course' },
        { key: 'total_fee', header: 'Total Fee (₹)' },
        { key: 'paid', header: 'Paid (₹)' },
        { key: 'pending', header: 'Pending (₹)' },
        { key: 'status', header: 'Status' },
      ]
      dataToExport = filteredFees
    } else if (activeTab === 'assignment') {
      title = 'Academic Assignments Report'
      columns = [
        { key: 'title', header: 'Assignment Title' },
        { key: 'subject', header: 'Subject' },
        { key: 'course', header: 'Course' },
        { key: 'branch', header: 'Branch' },
        { key: 'due_date', header: 'Due Date' },
      ]
      dataToExport = filteredAssignments
    } else if (activeTab === 'study_material') {
      title = 'Study Materials & Resources Report'
      columns = [
        { key: 'title', header: 'Material Title' },
        { key: 'subject_name', header: 'Subject' },
        { key: 'category', header: 'Category' },
        { key: 'access_type', header: 'Access' },
        { key: 'date', header: 'Date' },
      ]
      dataToExport = filteredMaterials
    }

    exportToPDF(title, subtitle, columns, dataToExport)
  }

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-ink-400 mt-1">
            {isStudent
              ? 'Personal academic attendance, examination scorecards, fee ledgers, and assignments.'
              : isParent
              ? `Academic progress, attendance summary, and published exam results for ${currentStudent?.name || 'Linked Child'}.`
              : isTeacher
              ? `Assigned class analytical reports for ${currentTeacher?.name || 'Faculty'}.`
              : 'College management analytical reports across students, faculty, attendance, exams, fees, and resources.'}
          </p>
        </div>
        {canExport && (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleExportCSV} className="gap-2 border border-border">
              <Download className="h-4 w-4 text-ink-500" />
              <span>Export CSV</span>
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportPDF} className="gap-2 bg-brand-600 hover:bg-brand-700">
              <Printer className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
          </div>
        )}
      </div>

      {/* Linked Profile Banner for Student / Parent / Teacher */}
      {(isStudent || isParent) && currentStudent && (
        <div className="p-4 bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-100 text-brand-700 rounded-lg">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">{currentStudent.name}</p>
              <p className="text-xs text-ink-500">
                Roll No: {currentStudent.roll_no} | {currentStudent.course} · {currentStudent.branch} ({currentStudent.year}, {currentStudent.semester})
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-brand-50 text-brand-700 font-semibold text-xs rounded-full border border-brand-200 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isParent ? 'Linked Child Account' : 'Student Verified Profile'}
          </span>
        </div>
      )}

      {isTeacher && currentTeacher && (
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-[var(--radius-card)] flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              Teacher Account: <span className="font-bold">{currentTeacher.name}</span> | Scope Restricted to Assigned Classes ({Array.isArray(currentTeacher.assigned_classes) ? currentTeacher.assigned_classes.join(', ') : 'Assigned Class Mode'})
            </span>
          </div>
          <span className="px-2.5 py-0.5 bg-amber-100 font-semibold text-[11px] rounded border border-amber-300">
            Assigned Class Mode
          </span>
        </div>
      )}

      {/* Report Categories Tabs */}
      <Tabs tabs={reportTabs} activeId={activeTab} onChange={setActiveTab} className="border-b border-border" />

      {/* Academic Filter Bar Container (BUG 1 FIX) */}
      {!isStudent && !isParent && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <SearchInput
              placeholder="Search report records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56"
            />
            <Select
              options={['All Courses', ...COURSES].map((c) => ({ value: c, label: c }))}
              value={filterCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full sm:w-36"
            />
            <Select
              options={['All Branches', ...availableBranches].map((b) => ({ value: b, label: b }))}
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full sm:w-44"
            />
            <Select
              options={['All Years', ...availableYears].map((y) => ({ value: y, label: y }))}
              value={filterYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full sm:w-32"
            />
            <Select
              options={['All Semesters', ...availableSemesters].map((s) => ({ value: s, label: s }))}
              value={filterSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              className="w-full sm:w-36"
            />
            <Select
              options={[
                { value: 'All Sections', label: 'All Sections' },
                { value: 'Section A', label: 'Section A' },
                { value: 'Section B', label: 'Section B' },
              ]}
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full sm:w-32"
            />
            {(activeTab === 'exams' || activeTab === 'fee' || activeTab === 'student') && (
              <Select
                options={[
                  { value: 'All Statuses', label: 'All Statuses' },
                  { value: 'Pass', label: 'Pass' },
                  { value: 'Fail', label: 'Fail' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'due', label: 'Due' },
                ]}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-32"
              />
            )}
          </div>
        </div>
      )}

      {/* ==================== 1. STUDENT REPORT ==================== */}
      {activeTab === 'student' && !isStudent && !isParent && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Filtered Students" value={filteredStudents.length.toString()} icon={Users} tone="brand" />
            <StatCard label="Active Status" value="100%" icon={CheckCircle2} tone="success" />
            <StatCard label="Active Courses" value={COURSES.length.toString()} icon={GraduationCap} tone="info" />
            <StatCard label="Total Branches" value={availableBranches.length.toString()} icon={Building} tone="warning" />
          </div>
          {filteredStudents.length === 0 ? (
            <EmptyState icon={Users} title="No Student Records Found" description="No student records match your active academic filters." />
          ) : (
            <DataTable
              columns={[
                { key: 'name', header: 'Student Name', render: (r) => <div><span className="font-semibold text-ink-900 block">{r.name}</span><span className="text-xs text-ink-400 font-mono">{r.email}</span></div> },
                { key: 'roll_no', header: 'Roll Number', render: (r) => <span className="font-mono text-xs font-medium text-ink-700">{r.roll_no}</span> },
                { key: 'student_id', header: 'Student ID', render: (r) => <span className="font-mono text-xs text-ink-500">{r.student_id}</span> },
                { key: 'course', header: 'Course', render: (r) => <span className="text-xs font-semibold text-brand-700">{r.course}</span> },
                { key: 'branch', header: 'Branch', render: (r) => r.branch },
                { key: 'year', header: 'Year / Semester', render: (r) => `${r.year} (${r.semester})` },
                { key: 'section', header: 'Section', render: (r) => r.section },
                { key: 'status', header: 'Academic Status', render: () => <StatusPill status="success" label="Active Enrolled" /> },
              ]}
              rows={filteredStudents}
              keyExtractor={(r) => r.id}
            />
          )}
        </div>
      )}

      {/* ==================== 2. TEACHER REPORT ==================== */}
      {activeTab === 'teacher' && !isStudent && !isParent && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Faculty" value={filteredTeachers.length.toString()} icon={GraduationCap} tone="success" />
            <StatCard label="HODs & Deans" value={filteredTeachers.filter((t) => (t.position || '').includes('Head') || (t.position || '').includes('Dean')).length.toString()} icon={Award} tone="brand" />
            <StatCard label="Senior Educators" value={filteredTeachers.filter((t) => (t.position || '').includes('Senior')).length.toString()} icon={CheckCircle2} tone="info" />
            <StatCard label="Assistant Professors" value={filteredTeachers.filter((t) => (t.position || '').includes('Assistant')).length.toString()} icon={Users} tone="warning" />
          </div>
          {filteredTeachers.length === 0 ? (
            <EmptyState icon={GraduationCap} title="No Teacher Records Found" description="No faculty records match your selected department/course filter." />
          ) : (
            <DataTable
              columns={[
                { key: 'name', header: 'Faculty Name', render: (r) => <div><span className="font-semibold text-ink-900 block">{r.name}</span><span className="text-xs text-ink-400 font-mono">{r.email}</span></div> },
                { key: 'teacher_id', header: 'Teacher ID', render: (r) => <span className="font-mono text-xs font-semibold text-ink-700">{r.teacher_id}</span> },
                { key: 'position', header: 'Designation / Position', render: (r) => <span className="px-2.5 py-0.5 bg-brand-100/70 text-brand-800 text-xs font-semibold rounded-full">{r.position}</span> },
                { key: 'course', header: 'Course', render: (r) => r.course },
                { key: 'department', header: 'Branch / Department', render: (r) => r.department },
                { key: 'qualification', header: 'Qualification', render: (r) => r.qualification },
                { key: 'assigned_classes', header: 'Assigned Classes', render: (r) => <span className="text-xs font-mono font-medium text-ink-600">{r.assigned_classes?.length || 0} Classes</span> },
              ]}
              rows={filteredTeachers}
              keyExtractor={(r) => r.id}
            />
          )}
        </div>
      )}

      {/* ==================== 3. ATTENDANCE REPORT ==================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Enrolled Students" value={filteredAttendance.length.toString()} icon={Users} tone="brand" />
            <StatCard label="Average Attendance" value={`${Math.round(filteredAttendance.reduce((sum, a) => sum + a.attPctValue, 0) / (filteredAttendance.length || 1))}%`} icon={CalendarCheck} tone="success" />
            <StatCard label="Lectures Conducted" value={totalLecturesConducted.toString()} icon={Clock} tone="info" />
            <StatCard label="Low Attendance (<75%)" value={filteredAttendance.filter((a) => a.attPctValue < 75).length.toString()} icon={AlertCircle} tone="danger" />
          </div>
          {filteredAttendance.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No Attendance Records Found" description="No attendance records available for the selected filters." />
          ) : (
            <DataTable
              columns={[
                { key: 'name', header: 'Student', render: (r) => <div><span className="font-semibold text-ink-900 block">{r.name}</span><span className="text-xs text-ink-400 font-mono">{r.student_id}</span></div> },
                { key: 'roll_no', header: 'Roll Number', render: (r) => <span className="font-mono text-xs font-semibold">{r.roll_no}</span> },
                { key: 'course', header: 'Course', render: (r) => r.course },
                { key: 'branch', header: 'Branch', render: (r) => r.branch },
                { key: 'year', header: 'Year / Semester', render: (r) => `${r.year} (${r.semester})` },
                { key: 'section', header: 'Section', render: (r) => r.section },
                { key: 'totalLectures', header: 'Total Lectures', render: (r) => r.totalLectures },
                { key: 'presentLectures', header: 'Present', render: (r) => <span className="text-emerald-600 font-bold">{r.presentLectures}</span> },
                { key: 'absentLectures', header: 'Absent', render: (r) => <span className="text-rose-600 font-medium">{r.absentLectures}</span> },
                { key: 'attPct', header: 'Attendance %', render: (r) => <StatusPill status={r.attPctValue >= 75 ? 'success' : 'warning'} label={r.attPct} /> },
              ]}
              rows={filteredAttendance}
              keyExtractor={(r) => r.id}
            />
          )}
        </div>
      )}

      {/* ==================== 4. EXAM & RESULT REPORT (BUG 2 FIX) ==================== */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Result Entries" value={filteredExamResults.length.toString()} icon={FileText} tone="brand" />
            <StatCard label="Pass Percentage" value={`${Math.round((filteredExamResults.filter((r) => r.status === 'Pass').length / (filteredExamResults.length || 1)) * 100)}%`} icon={CheckCircle2} tone="success" />
            <StatCard label="Passed Results" value={filteredExamResults.filter((r) => r.status === 'Pass').length.toString()} icon={Award} tone="info" />
            <StatCard label="Failed Results" value={filteredExamResults.filter((r) => r.status === 'Fail').length.toString()} icon={AlertCircle} tone="danger" />
          </div>
          {pivotedExamRows.length === 0 ? (
            <EmptyState icon={Award} title="No Exam Results Found" description="No published result records found matching active filters." />
          ) : (
            <DataTable
              columns={[
                { key: 'student_name', header: 'Student Name', render: (r) => <div><span className="font-semibold text-ink-900 block">{r.student_name}</span><span className="text-xs text-ink-400 font-mono">{r.course} • {r.branch}</span></div> },
                { key: 'roll_no', header: 'Roll No', render: (r) => <span className="font-mono text-xs font-semibold text-ink-700">{r.roll_no}</span> },
                ...examSubjectsList.map((subj) => ({
                  key: `subj_${subj}`,
                  header: subj,
                  render: (r: any) => {
                    const val = r.marksBySubject[subj]
                    return val !== undefined ? (
                      <span className="font-mono text-xs font-bold text-ink-900">{val}</span>
                    ) : (
                      <span className="text-xs text-ink-300">-</span>
                    )
                  },
                })),
                { key: 'total', header: 'Total', render: (r) => <span className="font-mono text-xs font-bold text-brand-700">{r.totalObtained} / {r.totalMax}</span> },
                { key: 'pct', header: 'Percentage', render: (r) => <span className="font-bold text-indigo-600">{r.totalMax > 0 ? Math.round((r.totalObtained / r.totalMax) * 100) : 0}%</span> },
                { key: 'status', header: 'Status', render: (r) => {
                  const pct = r.totalMax > 0 ? Math.round((r.totalObtained / r.totalMax) * 100) : 0
                  const isPass = pct >= 40
                  return <StatusPill status={isPass ? 'success' : 'danger'} label={isPass ? 'Pass' : 'Fail'} />
                }},
              ]}
              rows={pivotedExamRows}
              keyExtractor={(r) => r.id}
            />
          )}
        </div>
      )}

      {/* ==================== 5. FEE REPORT ==================== */}
      {activeTab === 'fee' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Invoiced" value={formatCurrency(calculatedFeeMetrics.totalFees)} icon={IndianRupee} tone="brand" />
            <StatCard label="Total Collected" value={formatCurrency(calculatedFeeMetrics.totalPaid)} icon={TrendingUp} tone="success" progressPercent={calculatedFeeMetrics.paidPct} />
            <StatCard label="Pending Dues" value={formatCurrency(calculatedFeeMetrics.totalPending)} icon={IndianRupee} tone="warning" />
            <StatCard label="Overdue Count" value={calculatedFeeMetrics.dueCount.toString()} icon={AlertCircle} tone="danger" />
          </div>
          {filteredFees.length === 0 ? (
            <EmptyState icon={IndianRupee} title="No Fee Records Found" description="No student fee records match your active search or filters." />
          ) : (
            <DataTable
              columns={[
                { key: 'student_name', header: 'Student Name', render: (r) => <div><span className="font-semibold text-ink-900 block">{r.student_name}</span><span className="text-xs text-ink-400 font-mono">{r.roll_no}</span></div> },
                { key: 'course', header: 'Course', render: (r) => r.course },
                { key: 'branch', header: 'Branch', render: (r) => r.branch },
                { key: 'year_semester', header: 'Year / Semester', render: (r) => r.year_semester },
                { key: 'total_fee', header: 'Total Fee', render: (r) => formatCurrency(r.total_fee) },
                { key: 'paid', header: 'Paid Amount', render: (r) => <span className="text-emerald-600 font-bold">{formatCurrency(r.paid)}</span> },
                { key: 'pending', header: 'Pending Due', render: (r) => <span className="text-amber-600 font-medium">{formatCurrency(r.pending)}</span> },
                { key: 'status', header: 'Payment Status', render: (r) => <StatusPill status={r.status === 'paid' ? 'success' : r.status === 'partial' ? 'warning' : 'danger'} label={r.status.toUpperCase()} /> },
              ]}
              rows={filteredFees}
              keyExtractor={(r) => r.id}
            />
          )}
        </div>
      )}

      {/* ==================== 6. ASSIGNMENT REPORT ==================== */}
      {activeTab === 'assignment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active Course Assignments" value={filteredAssignments.length.toString()} icon={BookOpen} tone="brand" />
            <StatCard label="Pending Due Date" value={filteredAssignments.filter((a) => new Date(a.due_date) >= new Date()).length.toString()} icon={Clock} tone="warning" />
            <StatCard label="Total Submissions" value={filteredAssignments.reduce((sum, a) => sum + (a.submitted_count || 0), 0).toString()} icon={CheckCircle2} tone="success" />
            <StatCard label="Target Courses" value={COURSES.length.toString()} icon={GraduationCap} tone="info" />
          </div>
          {filteredAssignments.length === 0 ? (
            <EmptyState icon={BookOpen} title="No Assignments Found" description="No assignment records found for the selected filter scope." />
          ) : (
            <DataTable
              columns={[
                { key: 'title', header: 'Assignment Title', render: (r) => <div><span className="font-semibold text-ink-900 block">{r.title}</span><span className="text-xs text-ink-400">{r.description}</span></div> },
                { key: 'subject', header: 'Subject', render: (r) => <span className="font-semibold text-brand-700">{r.subject}</span> },
                { key: 'course', header: 'Course / Branch', render: (r) => `${r.course} • ${r.branch}` },
                { key: 'semester', header: 'Semester / Section', render: (r) => `${r.semester} (${r.section || 'All'})` },
                { key: 'due_date', header: 'Due Date', render: (r) => <span className="font-mono text-xs font-semibold text-ink-800">{r.due_date}</span> },
                { key: 'teacher_name', header: 'Faculty', render: (r) => r.teacher_name },
                { key: 'submissions', header: 'Submissions', render: (r) => <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-xs rounded-full">{r.submitted_count || 0} Submitted</span> },
              ]}
              rows={filteredAssignments}
              keyExtractor={(r) => r.id}
            />
          )}
        </div>
      )}

      {/* ==================== 7. STUDY MATERIAL REPORT ==================== */}
      {activeTab === 'study_material' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Resources" value={filteredMaterials.length.toString()} icon={FolderOpen} tone="brand" />
            <StatCard label="Handwritten Notes" value={filteredMaterials.filter((m) => m.category === 'Handwritten Notes').length.toString()} icon={FileText} tone="success" />
            <StatCard label="Quantum Series" value={filteredMaterials.filter((m) => m.category === 'Quantum').length.toString()} icon={Award} tone="warning" />
            <StatCard label="PYQ Papers" value={filteredMaterials.filter((m) => m.category === 'Previous Year Questions').length.toString()} icon={BookOpen} tone="info" />
          </div>
          {filteredMaterials.length === 0 ? (
            <EmptyState icon={FolderOpen} title="No Study Materials Found" description="No study resources uploaded matching active filters." />
          ) : (
            <DataTable
              columns={[
                { key: 'title', header: 'Material Title', render: (r) => <div><span className="font-semibold text-ink-900 block">{r.title}</span><span className="text-xs text-ink-400">{r.description}</span></div> },
                { key: 'subject_name', header: 'Subject', render: (r) => <div><span className="font-semibold text-brand-700 block">{r.subject_name}</span><span className="text-xs font-mono text-ink-400">{r.subject_code}</span></div> },
                { key: 'course', header: 'Course / Branch', render: (r) => `${r.course} • ${r.branch}` },
                { key: 'category', header: 'Category', render: (r) => <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 text-xs font-semibold rounded-full">{r.category}</span> },
                { key: 'access_type', header: 'Access Type', render: (r) => <StatusPill status={r.access_type === 'Free' ? 'success' : 'warning'} label={r.access_type} /> },
                { key: 'size', header: 'File Size', render: (r) => <span className="font-mono text-xs">{r.size}</span> },
                { key: 'uploader', header: 'Uploaded By', render: (r) => r.uploader },
              ]}
              rows={filteredMaterials}
              keyExtractor={(r) => r.id}
            />
          )}
        </div>
      )}

      {/* ==================== 8. TNP REPORT ==================== */}
      {activeTab === 'tnp' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-xs">
            <div>
              <h3 className="font-bold text-ink-900 text-base">Training & Placement Official Report</h3>
              <p className="text-xs text-ink-500">Live placement statistics and student recruitment records from Supabase.</p>
            </div>
            <Button variant="ghost" onClick={() => exportToCSV('tnp_placements_report', filteredTnpPlacements)}>
              <Download className="h-4 w-4 mr-2" /> Export TNP Placements CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Registered Companies" value={companies.length.toString()} icon={Building} tone="brand" />
            <StatCard label="Placement Drives" value={drives.length.toString()} icon={Briefcase} tone="info" />
            <StatCard label="Total Applications" value={applications.length.toString()} icon={FileText} tone="warning" />
            <StatCard label="Offers Confirmed" value={filteredTnpPlacements.length.toString()} icon={Award} tone="success" />
          </div>

          {filteredTnpPlacements.length === 0 ? (
            <EmptyState icon={Award} title="No Placement Records Found" description="No placement offer records found matching active filters." />
          ) : (
            <DataTable
              columns={[
                { key: 'student_name', header: 'Student Name & Roll No', render: (r) => <div><span className="font-semibold text-ink-900 block">{r.student_name}</span><span className="text-xs font-mono text-ink-400">{r.roll_no}</span></div> },
                { key: 'course', header: 'Course / Branch', render: (r) => `${r.course} • ${r.branch}` },
                { key: 'year', header: 'Year', render: (r) => r.year },
                { key: 'company_name', header: 'Company Name', render: (r) => <span className="font-bold text-brand-700">{r.company_name}</span> },
                { key: 'job_role', header: 'Job Role', render: (r) => r.job_role },
                { key: 'package_amount', header: 'Package (CTC)', render: (r) => <span className="font-bold text-emerald-600 font-mono text-xs">{r.package_amount}</span> },
                { key: 'status', header: 'Status', render: (r) => <StatusPill status="success" label={r.status} /> },
              ]}
              rows={filteredTnpPlacements}
              keyExtractor={(r) => r.id}
            />
          )}
        </div>
      )}
    </div>
  )
}


