import { useState, useMemo, useEffect } from 'react'
import { Tabs, DataTable, Button, StatusPill, Modal, FormField, Input, Select, EmptyState, SearchInput } from '../../components/ui'
import {
  Plus, Pencil, Trash2, Eye, Award,
  Calendar, Edit3, Award as ResultIcon, Send,
  Printer, AlertCircle, BookOpen, Check
} from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts'
import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, COURSES, BRANCHES_BY_COURSE, YEARS_BY_COURSE, academicStore, getTeacherForUser, isBranchMatch, normalizeCollegeId } from '../../lib/academicStore'
import { useExamStore, calculateGradeAndPoint } from '../../lib/examStore'
import type { ExamRecord, ExamStatus } from '../../lib/examStore'
import { useToast } from '../../components/ui/Toast'

export const getSemestersForYearAndCourse = (year: string, course: string): string[] => {
  if (course === 'MBA') {
    if (year === '1st Year') return ['Semester 1', 'Semester 2']
    if (year === '2nd Year') return ['Semester 3', 'Semester 4']
    return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4']
  }
  if (course === 'Diploma') {
    if (year === '1st Year') return ['Semester 1', 'Semester 2']
    if (year === '2nd Year') return ['Semester 3', 'Semester 4']
    if (year === '3rd Year') return ['Semester 5', 'Semester 6']
    return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6']
  }
  if (year === '1st Year') return ['Semester 1', 'Semester 2']
  if (year === '2nd Year') return ['Semester 3', 'Semester 4']
  if (year === '3rd Year') return ['Semester 5', 'Semester 6']
  if (year === '4th Year') return ['Semester 7', 'Semester 8']
  return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']
}

export function isSemesterMatch(s1?: string | null, s2?: string | null): boolean {
  if (!s1 || !s2) return true
  if (s1 === s2) return true
  const n1 = s1.replace(/[^0-9]/g, '')
  const n2 = s2.replace(/[^0-9]/g, '')
  if (n1 && n2 && n1 === n2) return true
  return s1.toLowerCase().trim() === s2.toLowerCase().trim()
}

export function ExamsPage() {
  const { user } = useAuth()
  const { students, teachers, classes } = useAcademicStore()
  const {
    exams,
    examSubjects,
    results,
    saveExam,
    deleteExam,
    saveResultBatch,
    publishExamResults,
    getStudentPublishedResults,
  } = useExamStore()
  const { toast } = useToast()

  const role = user?.role || 'admin'
  const isStudent = role === 'student'
  const isParent = role === 'parent'
  const isTeacher = role === 'teacher'
  const isAdmin = role === 'admin' || role === 'super_admin'

  const userCollege = normalizeCollegeId(user?.college_id || user?.school_id) || '13695a78-0105-4bde-bc85-d664bb66637e'

  // Teacher scoping context
  const currentTeacher = useMemo(() => {
    if (!isTeacher) return null
    return getTeacherForUser(user, teachers, classes)
  }, [teachers, classes, user, isTeacher])

  // Linked student resolution for Student / Parent
  const currentStudent = useMemo(() => {
    if (isStudent) {
      const uId = user?.id
      const sId = user?.student_id || uId
      const uEmail = user?.email?.toLowerCase().trim()
      const found = students.find(
        (s) =>
          (uId && (s.profile_id === uId || s.id === uId)) ||
          (sId && (s.id === sId || s.student_id === sId || s.roll_no === sId || `STU-${s.roll_no}` === sId || sId.replace(/^STU-/i, '') === s.roll_no)) ||
          (uEmail && s.email?.toLowerCase().trim() === uEmail)
      )
      if (found) return found

      const matchingRes = results.find((r) => r.student_id === uId || r.student_id === sId || (r.roll_no && sId && r.roll_no === sId.replace(/^STU-/i, '')))
      return {
        id: matchingRes?.student_id || sId || 'STU-LOCAL',
        student_id: user?.student_id || sId || 'STU-LOCAL',
        roll_no: matchingRes?.roll_no || (user as any)?.roll_no || (sId ? sId.replace(/^STU-/i, '') : 'STU001'),
        name: matchingRes?.student_name || user?.name || 'Student',
        email: user?.email || '',
        course: matchingRes?.course || 'B.Tech',
        branch: matchingRes?.branch || 'ECE',
        year: matchingRes?.year || '1st Year',
        semester: matchingRes?.semester || 'Semester 1',
        section: matchingRes?.section || 'Section A',
        class_name: `${matchingRes?.course || 'B.Tech'} ${matchingRes?.branch || 'ECE'} - ${matchingRes?.year || '1st Year'} - ${matchingRes?.section || 'Section A'}`,
        status: 'active' as const,
        created_at: new Date().toISOString(),
      }
    }
    if (isParent) {
      const uId = user?.id
      const childId = user?.child_student_id || user?.student_id
      const uEmail = user?.email?.toLowerCase().trim()
      const found = students.find(
        (s) =>
          (childId && (s.id === childId || s.profile_id === childId || s.student_id === childId || s.roll_no === childId || `STU-${s.roll_no}` === childId || childId.replace(/^STU-/i, '') === childId)) ||
          (uEmail && s.parent_email?.toLowerCase().trim() === uEmail) ||
          (uEmail && s.email?.toLowerCase().trim() === uEmail)
      )
      if (found) return found

      const matchingRes = results.find((r) => r.student_id === uId || r.student_id === childId || (r.roll_no && childId && r.roll_no === childId.replace(/^STU-/i, '')))
      return {
        id: matchingRes?.student_id || childId || 'STU-CHILD',
        student_id: childId || 'STU-CHILD',
        roll_no: matchingRes?.roll_no || (user as any)?.child_roll_no || (childId ? childId.replace(/^STU-/i, '') : 'STU001'),
        name: matchingRes?.student_name || 'Child Student',
        email: user?.email || '',
        course: matchingRes?.course || 'B.Tech',
        branch: matchingRes?.branch || 'ECE',
        year: matchingRes?.year || '1st Year',
        semester: matchingRes?.semester || 'Semester 1',
        section: matchingRes?.section || 'Section A',
        class_name: `${matchingRes?.course || 'B.Tech'} ${matchingRes?.branch || 'ECE'} - ${matchingRes?.year || '1st Year'} - ${matchingRes?.section || 'Section A'}`,
        status: 'active' as const,
        created_at: new Date().toISOString(),
      }
    }
    return null
  }, [students, user, isStudent, isParent, results])

  // Navigation Sub-sections
  const [activeSection, setActiveSection] = useState<string>(isStudent || isParent ? 'my_results' : 'dashboard')

  // Modals & View States
  const [showAddExamModal, setShowAddExamModal] = useState(false)
  const [editingExam, setEditingExam] = useState<ExamRecord | null>(null)

  // Exam Form Fields (Creation/Edit Modal)
  const [formTitle, setFormTitle] = useState('')
  const [formType, setFormType] = useState<string>('Sessional Exam')
  const [customType, setCustomType] = useState('')
  const [formCourse, setFormCourse] = useState('B.Tech')
  const [formBranch, setFormBranch] = useState('ECE')
  const [formYear, setFormYear] = useState('1st Year')
  const [formSemester, setFormSemester] = useState('Semester 1')
  const [formSection, setFormSection] = useState('Section A')
  const [formSession, setFormSession] = useState('2026-2027')
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [formStartTime, setFormStartTime] = useState('09:30 AM')
  const [formEndTime, setFormEndTime] = useState('12:30 PM')
  const [formDescription, setFormDescription] = useState('')
  const [formStatus, setFormStatus] = useState<ExamStatus>('Scheduled')

  // Selected Subject IDs for Create Exam modal
  const [formSelectedSubjectIds, setFormSelectedSubjectIds] = useState<string[]>([])


  // Available subjects for the class selected in Create Exam Modal
  const formAvailableSubjects = useMemo(() => {
    return academicStore.getSubjectsByClass(formCourse, formBranch, formSemester)
  }, [formCourse, formBranch, formSemester])

  // Sync selected subjects when course/branch/semester changes in form
  useEffect(() => {
    if (!editingExam) {
      setFormSelectedSubjectIds(formAvailableSubjects.map((s) => s.id))
    }
  }, [formAvailableSubjects, editingExam])

  // Search & Global Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCourse, setFilterCourse] = useState('B.Tech')
  const [filterBranch, setFilterBranch] = useState('ECE')
  const [filterYear, setFilterYear] = useState('1st Year')
  const [filterSemester, setFilterSemester] = useState('Semester 1')
  const [filterSection, setFilterSection] = useState('Section A')
  const [filterExamId, setFilterExamId] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [filterStudentId, setFilterStudentId] = useState<string>('All Students')
  const [selectedStudentSummaryModal, setSelectedStudentSummaryModal] = useState<any | null>(null)

  // Student/Parent Exam Filter for scorecards
  const [selectedStudentExamFilter, setSelectedStudentExamFilter] = useState<string>('All Exams')

  // Dynamic Filter Options
  const availableFilterBranches = BRANCHES_BY_COURSE[filterCourse] || ['All Branches / Common']
  const availableFilterYears = YEARS_BY_COURSE(filterCourse)
  const availableFilterSemesters = useMemo(() => {
    return getSemestersForYearAndCourse(filterYear, filterCourse)
  }, [filterYear, filterCourse])

  // Class-scoped Exams for the selected class filter
  const classExams = useMemo(() => {
    return exams.filter((e) => {
      if (filterCourse && e.course && e.course.toLowerCase().trim() !== filterCourse.toLowerCase().trim()) return false
      if (filterBranch && filterBranch !== 'All Branches / Common' && e.branch && e.branch !== 'All Branches / Common' && !isBranchMatch(e.branch, filterBranch)) return false
      if (filterYear && filterYear !== 'All Years' && e.year && e.year !== 'All Years' && e.year !== filterYear) return false
      if (filterSemester && filterSemester !== 'All Semesters' && e.semester && !isSemesterMatch(e.semester, filterSemester)) return false
      if (filterSection && filterSection !== 'All Sections' && e.section && e.section !== 'All Sections' && e.section !== filterSection) return false
      return true
    })
  }, [exams, filterCourse, filterBranch, filterYear, filterSemester, filterSection])

  // Auto-set filterExamId if classExams changes and current filterExamId is invalid
  useEffect(() => {
    if (classExams.length > 0) {
      if (!filterExamId || !classExams.some((e) => e.id === filterExamId)) {
        setFilterExamId(classExams[0].id)
      }
    } else if (exams.length > 0) {
      if (!filterExamId || !exams.some((e) => e.id === filterExamId)) {
        const firstEx = exams[0]
        setFilterExamId(firstEx.id)
        if (firstEx.course) setFilterCourse(firstEx.course)
        if (firstEx.branch) setFilterBranch(firstEx.branch)
        if (firstEx.year) setFilterYear(firstEx.year)
        if (firstEx.semester) setFilterSemester(firstEx.semester)
        if (firstEx.section) setFilterSection(firstEx.section)
      }
    } else {
      setFilterExamId('')
    }
  }, [classExams, exams, filterExamId])

  // Selected Exam for Dashboard & Marks Entry
  const selectedDashboardExamObj = useMemo(() => {
    return exams.find((e) => e.id === filterExamId) || (classExams.length > 0 ? classExams[0] : (exams.length > 0 ? exams[0] : null))
  }, [exams, filterExamId, classExams])

  // Subjects for the selected exam
  const subjectsForSelectedExam = useMemo(() => {
    if (!selectedDashboardExamObj) return []
    const subjs = examSubjects.filter((s) => s.exam_id === selectedDashboardExamObj.id)
    if (subjs.length > 0) return subjs
    if (selectedDashboardExamObj.subjects && selectedDashboardExamObj.subjects.length > 0) {
      return selectedDashboardExamObj.subjects
    }
    if (selectedDashboardExamObj.subject) {
      return [{
        id: 's_single_' + selectedDashboardExamObj.id,
        exam_id: selectedDashboardExamObj.id,
        subject_name: selectedDashboardExamObj.subject,
        subject_code: '',
        date: selectedDashboardExamObj.date,
        start_time: selectedDashboardExamObj.start_time || '09:30 AM',
        end_time: selectedDashboardExamObj.end_time || '12:30 PM',
        max_marks: selectedDashboardExamObj.max_marks || 100,
        passing_marks: selectedDashboardExamObj.passing_marks || 40,
      }]
    }
    return []
  }, [selectedDashboardExamObj, examSubjects])

  // Teacher permission helper
  const canTeacherManageExam = useMemo(() => {
    return (target: ExamRecord | { course?: string; branch?: string; year?: string; semester?: string; section?: string }) => {
      if (isAdmin) return true
      if (!isTeacher || !currentTeacher) return false

      const assigned = currentTeacher.assigned_classes || []
      if (assigned.length === 0) return true

      const targetCourse = (target.course || filterCourse || '').toLowerCase()
      const targetBranch = (target.branch || filterBranch || '').toLowerCase()

      return assigned.some((assignedStr) => {
        const norm = assignedStr.toLowerCase()
        const matchCourse = !targetCourse || norm.includes(targetCourse)
        const matchBranch = !targetBranch || targetBranch === 'all branches / common' || norm.includes(targetBranch)
        return matchCourse && matchBranch
      })
    }
  }, [isAdmin, isTeacher, currentTeacher, filterCourse, filterBranch])

  // Teacher class permission check
  const isTeacherAssignedToClass = useMemo(() => {
    return canTeacherManageExam({ course: filterCourse, branch: filterBranch, year: filterYear, semester: filterSemester, section: filterSection })
  }, [canTeacherManageExam, filterCourse, filterBranch, filterYear, filterSemester, filterSection])

  // Marks Entry State: studentId -> entered mark string / remarks
  const [enteredMarksMap, setEnteredMarksMap] = useState<Record<string, string | number>>({})
  const [enteredRemarksMap, setEnteredRemarksMap] = useState<Record<string, string>>({})

  // Academic Subjects for selected Course, Branch, Semester
  const availableSubjectsForSelection = useMemo(() => {
    return academicStore.getSubjectsByClass(filterCourse, filterBranch, filterSemester)
  }, [filterCourse, filterBranch, filterSemester])

  // Active Subject details for Marks Entry
  const activeSelectedSubjectObj = useMemo(() => {
    if (!selectedSubjectId) return null
    return availableSubjectsForSelection.find((s) => s.id === selectedSubjectId || s.name === selectedSubjectId) || null
  }, [availableSubjectsForSelection, selectedSubjectId])

  // Filtered Class Students
  const targetClassStudents = useMemo(() => {
    return students.filter((s) => {
      if (filterCourse && s.course !== filterCourse) return false
      if (filterBranch && filterBranch !== 'All Branches / Common' && s.branch && !isBranchMatch(s.branch, filterBranch)) return false
      if (filterYear && s.year && s.year !== filterYear) return false
      if (filterSemester && s.semester && !isSemesterMatch(s.semester, filterSemester)) return false
      if (filterSection && filterSection !== 'All Sections' && s.section && s.section !== filterSection) return false
      return true
    })
  }, [students, filterCourse, filterBranch, filterYear, filterSemester, filterSection])

  // Consolidated Student Marks List for Dashboard
  const dashboardStudentMarksList = useMemo(() => {
    if (!selectedDashboardExamObj) return []

    return targetClassStudents.map((st) => {
      let totalObtained = 0
      let totalMax = 0
      let hasFailed = false
      let hasAnyMark = false

      const subjectBreakdown = subjectsForSelectedExam.map((sub) => {
        const r = results.find(
          (res) =>
            res.exam_id === selectedDashboardExamObj.id &&
            (res.student_id === st.id || res.roll_no === st.roll_no) &&
            (res.exam_subject_id === sub.id || res.subject === sub.subject_name)
        )

        if (r) {
          hasAnyMark = true
          totalObtained += r.obtained_marks
          totalMax += r.max_marks
          if (r.status === 'Fail' || r.obtained_marks < r.passing_marks) {
            hasFailed = true
          }
          return {
            subject_name: sub.subject_name,
            obtained_marks: r.obtained_marks,
            max_marks: r.max_marks,
            passing_marks: r.passing_marks,
            status: r.status,
            grade: r.grade,
          }
        } else {
          totalMax += sub.max_marks || 100
          return {
            subject_name: sub.subject_name,
            obtained_marks: null,
            max_marks: sub.max_marks || 100,
            passing_marks: sub.passing_marks || 40,
            status: 'Pending',
            grade: '-',
          }
        }
      })

      const pct = totalMax > 0 && hasAnyMark ? Math.round((totalObtained / totalMax) * 100) : 0
      const passMark = Math.round(totalMax * 0.4)
      const calc = calculateGradeAndPoint(totalObtained, totalMax, passMark)

      return {
        student_id: st.id,
        roll_no: st.roll_no,
        student_name: st.name,
        course: st.course || filterCourse,
        branch: st.branch || filterBranch,
        year: st.year || filterYear,
        semester: st.semester || filterSemester,
        section: st.section || filterSection,
        subjectBreakdown,
        totalObtained,
        totalMax,
        hasAnyMark,
        percentage: pct,
        grade: hasAnyMark ? (hasFailed ? 'F' : calc.grade) : '-',
        status: hasAnyMark ? (hasFailed ? 'Fail' : 'Pass') : 'Pending',
      }
    })
  }, [selectedDashboardExamObj, subjectsForSelectedExam, targetClassStudents, results, filterCourse, filterBranch, filterYear, filterSemester, filterSection])

  // Navigation Sub-sections
  const mainNavTabs = isStudent || isParent
    ? [
        { id: 'my_results', label: 'My Exam Results' },
        { id: 'schedule', label: 'Exam Schedule' },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'exam_schedule', label: 'Exam & Schedule' },
        { id: 'marks_entry', label: 'Marks Entry' },
        { id: 'result', label: 'Exam Result' },
        { id: 'publish_result', label: 'Publish Result' },
        { id: 'analysis', label: 'Result Analysis' },
      ]

  // Modal Handlers
  const openCreateExamModal = () => {
    setEditingExam(null)
    setFormTitle('')
    setFormType('Internal Test')
    setCustomType('')
    setFormCourse('B.Tech')
    const bList = BRANCHES_BY_COURSE['B.Tech'] || ['ECE']
    setFormBranch(bList[0] || 'ECE')
    setFormYear('1st Year')
    setFormSemester('Semester 1')
    setFormSection('Section A')
    setFormSession('2026-2027')
    setFormDate(new Date().toISOString().split('T')[0])
    setFormStartTime('09:30 AM')
    setFormEndTime('12:30 PM')
    setFormDescription('')
    setFormStatus('Scheduled')

    const defaultSubs = academicStore.getSubjectsByClass('B.Tech', bList[0] || 'ECE', 'Semester 1')
    setFormSelectedSubjectIds(defaultSubs.map((s) => s.id))
    setShowAddExamModal(true)
  }

  const openEditExamModal = (exam: ExamRecord) => {
    setEditingExam(exam)
    setFormTitle(exam.title)
    if (['Internal Test', 'Mid Term', 'Unit Test', 'Practical', 'Semester Exam', 'Pre University Exam', 'Sessional Exam', 'PUT', 'End Semester'].includes(exam.type)) {
      setFormType(exam.type)
      setCustomType('')
    } else {
      setFormType('Custom')
      setCustomType(exam.type)
    }
    setFormCourse(exam.course || 'B.Tech')
    setFormBranch(exam.branch || 'ECE')
    setFormYear(exam.year || '1st Year')
    setFormSemester(exam.semester || 'Semester 1')
    setFormSection(exam.section || 'Section A')
    setFormSession(exam.academic_session || '2026-2027')
    setFormDate(exam.date || new Date().toISOString().split('T')[0])
    setFormDescription(exam.description || '')
    setFormStatus(exam.status)

    const exSubjs = examSubjects.filter((s) => s.exam_id === exam.id)
    if (exSubjs.length > 0) {
      setFormSelectedSubjectIds(exSubjs.map((s) => s.subject_id || s.id))
    } else {
      const classSubs = academicStore.getSubjectsByClass(exam.course, exam.branch || '', exam.semester || '')
      setFormSelectedSubjectIds(classSubs.map((s) => s.id))
    }
    setShowAddExamModal(true)
  }

  const handleSaveExam = async () => {
    if (!formTitle.trim()) {
      toast({ type: 'error', title: 'Validation Error', description: 'Exam Title is required.' })
      return
    }

    if (isTeacher && !canTeacherManageExam({ course: formCourse, branch: formBranch, year: formYear, semester: formSemester, section: formSection })) {
      toast({
        type: 'error',
        title: 'Access Restricted',
        description: `You are only authorized to manage examinations for your assigned classes: ${currentTeacher?.assigned_classes?.join(', ') || 'Your assigned class'}.`,
      })
      return
    }

    const finalType = formType === 'Custom' ? customType || 'Custom Exam' : formType

    const selectedSubjectsPayload = formSelectedSubjectIds.map((subId) => {
      const subObj = formAvailableSubjects.find((s) => s.id === subId)
      return {
        subject_id: subId,
        subject_name: subObj ? subObj.name : subId,
        subject_code: subObj ? subObj.code : '',
        date: formDate,
        start_time: formStartTime,
        end_time: formEndTime,
        room_number: '',
        max_marks: 100,
        passing_marks: 40,
      }
    })

    try {
      const saved = await saveExam({
        id: editingExam?.id,
        college_id: userCollege,
        title: formTitle.trim(),
        type: finalType,
        course: formCourse,
        branch: formBranch,
        year: formYear,
        semester: formSemester,
        section: formSection,
        academic_session: formSession,
        date: formDate,
        start_time: formStartTime,
        end_time: formEndTime,
        max_marks: 100,
        passing_marks: 40,
        description: formDescription,
        status: formStatus,
        subjects: selectedSubjectsPayload as any,
        created_by: user?.id,
      })

      if (saved) {
        setFilterCourse(formCourse)
        setFilterBranch(formBranch)
        setFilterYear(formYear)
        setFilterSemester(formSemester)
        setFilterSection(formSection)
        if (saved.id) setFilterExamId(saved.id)
      }

      toast({
        type: 'success',
        title: editingExam ? 'Exam Updated' : 'Exam Created Successfully',
        description: `Saved "${formTitle}" with ${selectedSubjectsPayload.length} subject(s) in Supabase.`,
      })
      setShowAddExamModal(false)
    } catch (err: any) {
      toast({ type: 'error', title: 'Save Failed', description: err.message || 'Failed to save exam.' })
    }
  }

  const handleDeleteExam = async (exam: ExamRecord) => {
    if (!window.confirm(`Are you sure you want to delete examination "${exam.title}"? This will safely remove all related subject papers and results.`)) {
      return
    }
    try {
      await deleteExam(exam.id)
      toast({ type: 'info', title: 'Exam Deleted', description: `Examination "${exam.title}" removed.` })
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', description: err.message || 'Failed to delete exam.' })
    }
  }


  // Active Subject details for Marks Entry
  useEffect(() => {
    if (!selectedDashboardExamObj || !activeSelectedSubjectObj) return
    const marksMap: Record<string, string | number> = {}
    const remarksMap: Record<string, string> = {}

    results.forEach((r) => {
      if (
        r.exam_id === selectedDashboardExamObj.id &&
        (r.subject === activeSelectedSubjectObj.name || r.exam_subject_id === activeSelectedSubjectObj.id)
      ) {
        const markKey = `${r.student_id}_${activeSelectedSubjectObj.id}`
        marksMap[markKey] = r.obtained_marks
        marksMap[r.student_id] = r.obtained_marks
        remarksMap[markKey] = r.remarks || ''
        remarksMap[r.student_id] = r.remarks || ''
      }
    })

    setEnteredMarksMap(marksMap)
    setEnteredRemarksMap(remarksMap)
  }, [selectedDashboardExamObj?.id, activeSelectedSubjectObj?.id, results])

  // Save single subject marks batch to Supabase
  const handleSaveMarksForSubject = async () => {
    if (!selectedDashboardExamObj || !activeSelectedSubjectObj) {
      toast({ type: 'error', title: 'Selection Error', description: 'Please select both an Exam and a Subject.' })
      return
    }

    if (!isTeacherAssignedToClass) {
      toast({ type: 'error', title: 'Access Denied', description: 'You are not assigned to teach this class.' })
      return
    }

    const subjectName = activeSelectedSubjectObj.name
    const maxMarks = 100
    const passMarks = 40

    const targetStudents = filterStudentId === 'All Students'
      ? targetClassStudents
      : targetClassStudents.filter((s) => s.id === filterStudentId)

    const batchPayload = targetStudents.map((st) => {
      const markKey = `${st.id}_${activeSelectedSubjectObj.id}`
      const rawVal = enteredMarksMap[markKey] ?? enteredMarksMap[st.id] ?? 0
      const obtM = Math.min(Math.max(0, Number(rawVal)), maxMarks)
      const calc = calculateGradeAndPoint(obtM, maxMarks, passMarks)

      const existingRes = results.find(
        (r) => r.exam_id === selectedDashboardExamObj.id && (r.student_id === st.id || r.roll_no === st.roll_no) && (r.exam_subject_id === activeSelectedSubjectObj.id || r.subject === subjectName)
      )
      const isPub = existingRes && existingRes.is_published !== undefined ? existingRes.is_published : true

      return {
        college_id: userCollege,
        student_id: st.id,
        student_name: st.name,
        roll_no: st.roll_no,
        course: st.course || filterCourse,
        branch: st.branch || filterBranch,
        year: st.year || filterYear,
        semester: st.semester || filterSemester,
        section: st.section || filterSection,
        subject: subjectName,
        exam_subject_id: activeSelectedSubjectObj.id,
        max_marks: maxMarks,
        obtained_marks: obtM,
        passing_marks: passMarks,
        percentage: Math.round((obtM / maxMarks) * 100),
        grade: calc.grade,
        grade_point: calc.gradePoint,
        status: calc.status,
        remarks: enteredRemarksMap[markKey] || (obtM >= passMarks ? 'Satisfactory' : 'Needs Improvement'),
        is_published: isPub,
        entered_by: user?.id,
      }
    })

    try {
      await saveResultBatch(selectedDashboardExamObj.id, batchPayload)
      toast({
        type: 'success',
        title: 'Marks Saved',
        description: `Successfully saved marks for ${subjectName} (${targetStudents.length} student records) in Supabase.`,
      })
    } catch (err: any) {
      toast({ type: 'error', title: 'Save Failed', description: err.message || 'Failed to save marks.' })
    }
  }

  // Toggle Publish Status
  const handleTogglePublish = async (examId: string, currentStatus: boolean) => {
    try {
      await publishExamResults(examId, !currentStatus, user?.id)
      toast({
        type: !currentStatus ? 'success' : 'info',
        title: !currentStatus ? 'Results Published' : 'Results Drafted',
        description: !currentStatus ? 'Scorecards are now visible to Students & Parents.' : 'Results are hidden from Students & Parents.',
      })
    } catch (err: any) {
      toast({ type: 'error', title: 'Publish Action Failed', description: err.message || 'Failed to update publication state.' })
    }
  }

  // Dashboard Stats Summary
  const statsSummary = useMemo(() => {
    const totalExams = exams.length
    const upcomingCount = exams.filter((e) => (e.status as string) === 'upcoming' || (e.status as string) === 'Scheduled').length
    const ongoingCount = exams.filter((e) => (e.status as string) === 'ongoing' || (e.status as string) === 'Ongoing').length
    const completedCount = exams.filter((e) => (e.status as string) === 'completed' || (e.status as string) === 'Completed').length

    const publishedExamsCount = exams.filter((e) => {
      return results.some((r) => r.exam_id === e.id && r.is_published)
    }).length
    const pendingResultsCount = totalExams - publishedExamsCount

    return { totalExams, upcomingCount, ongoingCount, completedCount, publishedExamsCount, pendingResultsCount }
  }, [exams, results])

  // Consolidated Student Results for Exam Result & Scorecards section
  const consolidatedStudentResults = useMemo(() => {
    const filteredResults = results.filter((r) => {
      if (filterCourse && r.course !== filterCourse) return false
      if (filterBranch && filterBranch !== 'All Branches / Common' && r.branch !== filterBranch && r.branch !== 'All Branches / Common') return false
      if (filterYear && r.year !== filterYear) return false
      if (filterSemester && r.semester && !isSemesterMatch(r.semester, filterSemester)) return false
      if (filterSection && filterSection !== 'All Sections' && r.section && r.section !== filterSection) return false
      if (filterExamId && r.exam_id !== filterExamId) return false
      if (filterStudentId && filterStudentId !== 'All Students' && r.student_id !== filterStudentId && r.roll_no !== filterStudentId) return false
      return true
    })

    const studentMap: Record<string, any> = {}

    filteredResults.forEach((r) => {
      const key = r.student_id || r.roll_no
      if (!studentMap[key]) {
        studentMap[key] = {
          student_id: r.student_id,
          student_name: r.student_name,
          roll_no: r.roll_no,
          course: r.course,
          branch: r.branch,
          year: r.year,
          semester: r.semester,
          section: r.section || filterSection,
          exam_id: r.exam_id,
          published_date: r.published_date,
          subjects: [],
        }
      }

      studentMap[key].subjects.push({
        subject_name: r.subject,
        obtained_marks: r.obtained_marks,
        max_marks: r.max_marks,
        passing_marks: r.passing_marks,
        percentage: r.percentage,
        grade: r.grade,
        status: r.status,
        remarks: r.remarks,
      })
    })

    return Object.values(studentMap).map((st: any) => {
      const totalObtained = st.subjects.reduce((sum: number, s: any) => sum + (s.obtained_marks || 0), 0)
      const totalMax = st.subjects.reduce((sum: number, s: any) => sum + (s.max_marks || 100), 0)
      const overallPct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0
      const hasFailed = st.subjects.some((s: any) => s.status === 'Fail')
      const passMark = Math.round(totalMax * 0.4)
      const gradeCalc = calculateGradeAndPoint(totalObtained, totalMax, passMark)

      return {
        ...st,
        total_obtained: totalObtained,
        total_max: totalMax,
        overall_percentage: overallPct,
        overall_grade: hasFailed ? 'F' : gradeCalc.grade,
        overall_status: hasFailed ? 'Fail' : 'Pass',
      }
    })
  }, [results, filterCourse, filterBranch, filterYear, filterSemester, filterSection, filterExamId, filterStudentId])

  // Filtered Exam List for search
  const filteredExamsList = useMemo(() => {
    return exams.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchTitle = e.title.toLowerCase().includes(q)
        const matchSubject = (e.subject || '').toLowerCase().includes(q)
        const matchCourse = e.course.toLowerCase().includes(q)
        if (!matchTitle && !matchSubject && !matchCourse) return false
      }
      return true
    })
  }, [exams, searchQuery])

  // Class-scoped Exams for Student/Parent Datesheet & Results View
  const studentClassExams = useMemo(() => {
    if (!currentStudent) return []
    return exams.filter((e) => {
      if (e.course && currentStudent.course && e.course.toLowerCase().trim() !== currentStudent.course.toLowerCase().trim()) return false
      if (e.branch && e.branch !== 'All Branches / Common' && currentStudent.branch && !isBranchMatch(e.branch, currentStudent.branch)) return false
      if (e.year && e.year !== 'All Years' && currentStudent.year && e.year !== currentStudent.year) return false
      if (e.semester && e.semester !== 'All Semesters' && currentStudent.semester && !isSemesterMatch(e.semester, currentStudent.semester)) return false
      if (e.section && e.section !== 'All Sections' && currentStudent.section && e.section !== currentStudent.section) return false
      return true
    })
  }, [exams, currentStudent])

  // Available Exams for Student/Parent Exam Selector (includes all class exams)
  const availablePublishedExamOptions = useMemo(() => {
    if (!currentStudent) return []
    return studentClassExams.map((ex) => ({
      value: ex.id,
      label: ex.title,
    }))
  }, [currentStudent, studentClassExams])

  // Student / Parent Published Results
  const studentPublishedResults = useMemo(() => {
    if (!currentStudent) return []
    const allPub = getStudentPublishedResults(
      currentStudent.id,
      currentStudent.roll_no,
      currentStudent.student_id,
      currentStudent.email || user?.email
    )
    if (selectedStudentExamFilter === 'All Exams') return allPub
    return allPub.filter((r) => r.exam_id === selectedStudentExamFilter)
  }, [currentStudent, user?.email, getStudentPublishedResults, selectedStudentExamFilter])

  // Analysis Calculations
  const analysisData = useMemo(() => {
    const targetResults = results.filter((r) => {
      if (filterCourse && r.course !== filterCourse) return false
      if (filterBranch && filterBranch !== 'All Branches / Common' && r.branch !== filterBranch && r.branch !== 'All Branches / Common') return false
      if (filterYear && r.year !== filterYear) return false
      if (filterSemester && r.semester && !isSemesterMatch(r.semester, filterSemester)) return false
      if (filterExamId && r.exam_id !== filterExamId) return false
      if (selectedSubjectId && r.subject !== selectedSubjectId && r.exam_subject_id !== selectedSubjectId) return false
      return true
    })

    const totalRecords = targetResults.length
    const passedRecords = targetResults.filter((r) => r.status === 'Pass')
    const failedRecords = targetResults.filter((r) => r.status === 'Fail')
    const passPercentage = totalRecords > 0 ? Math.round((passedRecords.length / totalRecords) * 100) : 0

    const marksList = targetResults.map((r) => r.obtained_marks)
    const highestMarks = marksList.length > 0 ? Math.max(...marksList) : 0
    const lowestMarks = marksList.length > 0 ? Math.min(...marksList) : 0
    const avgMarks = marksList.length > 0 ? Math.round(marksList.reduce((a, b) => a + b, 0) / marksList.length) : 0

    const gradeCounts = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 }
    targetResults.forEach((r) => {
      const g = (r.grade || 'F') as keyof typeof gradeCounts
      if (gradeCounts[g] !== undefined) {
        gradeCounts[g] += 1
      } else {
        gradeCounts['F'] += 1
      }
    })

    const chartGradeData = Object.entries(gradeCounts).map(([grade, count]) => ({
      grade,
      students: count,
    }))

    const piePassFailData = [
      { name: 'Passed', value: passedRecords.length, color: '#10B981' },
      { name: 'Failed', value: failedRecords.length, color: '#EF4444' },
    ]

    return {
      totalRecords,
      passedCount: passedRecords.length,
      failedCount: failedRecords.length,
      passPercentage,
      highestMarks,
      lowestMarks,
      avgMarks,
      gradeCounts,
      chartGradeData,
      piePassFailData,
    }
  }, [results, filterCourse, filterBranch, filterYear, filterSemester, filterExamId, selectedSubjectId])

  // Filter Bar Component
  const renderHorizontalFilterBar = (options?: {
    showExamSelect?: boolean
    showSubjectSelect?: boolean
    showStudentSelect?: boolean
  }) => {
    const isFilterActive =
      searchQuery !== '' ||
      filterCourse !== 'B.Tech' ||
      (availableFilterBranches.length > 0 && filterBranch !== availableFilterBranches[0]) ||
      filterYear !== '1st Year' ||
      (availableFilterSemesters.length > 0 && filterSemester !== availableFilterSemesters[0]) ||
      filterSection !== 'Section A' ||
      filterExamId !== '' ||
      selectedSubjectId !== '' ||
      filterStudentId !== 'All Students'

    const handleResetFilters = () => {
      setSearchQuery('')
      setFilterCourse('B.Tech')
      const bList = BRANCHES_BY_COURSE['B.Tech'] || ['ECE']
      setFilterBranch(bList[0] || 'ECE')
      setFilterYear('1st Year')
      const sList = getSemestersForYearAndCourse('1st Year', 'B.Tech')
      setFilterSemester(sList[0] || 'Semester 1')
      setFilterSection('Section A')
      setFilterExamId('')
      setSelectedSubjectId('')
      setFilterStudentId('All Students')
    }

    return (
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Course Selector */}
          <Select
            options={COURSES.map((c) => ({ value: c, label: c }))}
            value={filterCourse}
            onChange={(e) => {
              const c = e.target.value
              setFilterCourse(c)
              const bList = BRANCHES_BY_COURSE[c] || ['ECE']
              setFilterBranch(bList[0] || 'ECE')
              setFilterYear('1st Year')
              const sList = getSemestersForYearAndCourse('1st Year', c)
              setFilterSemester(sList[0] || 'Semester 1')
              setSelectedSubjectId('')
            }}
            className="w-40 text-sm font-medium"
          />

          {/* Branch Selector */}
          <Select
            options={availableFilterBranches.map((b) => ({ value: b, label: b }))}
            value={filterBranch}
            onChange={(e) => {
              setFilterBranch(e.target.value)
              setSelectedSubjectId('')
            }}
            className="w-44 text-sm font-medium"
          />

          {/* Year Selector */}
          <Select
            options={availableFilterYears.map((y) => ({ value: y, label: y }))}
            value={filterYear}
            onChange={(e) => {
              const y = e.target.value
              setFilterYear(y)
              const sList = getSemestersForYearAndCourse(y, filterCourse)
              setFilterSemester(sList[0] || 'Semester 1')
              setSelectedSubjectId('')
            }}
            className="w-36 text-sm font-medium"
          />

          {/* Exam Dropdown scoped to selected class */}
          <Select
            options={[
              { value: '', label: classExams.length > 0 ? 'Select Exam...' : 'No exams for this class' },
              ...classExams.map((ex) => ({ value: ex.id, label: ex.title })),
            ]}
            value={filterExamId}
            onChange={(e) => setFilterExamId(e.target.value)}
            className="w-52 text-sm font-semibold border-brand-500 bg-brand-50/40 text-brand-900"
          />

          {options?.showSubjectSelect && (
            <Select
              options={[
                { value: '', label: 'Select Subject...' },
                ...availableSubjectsForSelection.map((sub: any) => ({
                  value: sub.id,
                  label: `${sub.name} (${sub.code})`,
                })),
              ]}
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className={`w-48 text-sm ${selectedSubjectId ? 'border-brand-500 font-bold text-brand-900 bg-brand-50/50' : 'border-amber-400 bg-amber-50/30'}`}
            />
          )}

          {options?.showStudentSelect && (
            <Select
              options={[
                { value: 'All Students', label: 'All Students' },
                ...targetClassStudents.map((st) => ({ value: st.id, label: `${st.roll_no} - ${st.name}` })),
              ]}
              value={filterStudentId}
              onChange={(e) => setFilterStudentId(e.target.value)}
              className="w-48 text-sm"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams..."
            className="w-full sm:w-56 text-sm"
          />
          {isFilterActive && (
            <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-sm">
              Clear
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900 tracking-tight">Test & Exam Management</h1>
          <p className="text-sm text-ink-400 mt-0.5">
            {isStudent || isParent
              ? `Official examination schedules and grade scorecards for ${currentStudent?.name || 'Student'}.`
              : 'Complete examination lifecycle management, date sheet timetable, subject-wise marks entry, and result publishing.'}
          </p>
        </div>

        {(isAdmin || isTeacher) && (
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={openCreateExamModal} className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm">
              <Plus className="h-4 w-4" /> Create Examination
            </Button>
          </div>
        )}
      </div>

      {/* Linked Student Banner for Parent */}
      {isParent && currentStudent && (
        <div className="p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-[var(--radius-card)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-lg">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">{currentStudent.name}</p>
              <p className="text-xs text-ink-500">
                Roll No: {currentStudent.roll_no} | {currentStudent.course} · {currentStudent.branch} ({currentStudent.year}, {currentStudent.semester})
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-full border border-indigo-300">
            Linked Child
          </span>
        </div>
      )}

      {/* Teacher Scoping Status Banner */}
      {isTeacher && currentTeacher && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[var(--radius-card)] flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              Teacher Account: <span className="font-bold">{currentTeacher.name}</span> | Assigned Classes: <span className="font-bold">{Array.isArray(currentTeacher.assigned_classes) ? currentTeacher.assigned_classes.join(', ') : 'All Assigned'}</span>
            </span>
          </div>
          <span className="px-2 py-0.5 bg-amber-100 font-semibold text-[11px] rounded border border-amber-300">
            Assigned Class Mode
          </span>
        </div>
      )}

      {/* Section Navigation Tabs */}
      <Tabs tabs={mainNavTabs} activeId={activeSection} onChange={setActiveSection} className="border-b border-border" />

      {/* ============================================================ */}
      {/* SECTION 1: DASHBOARD                                         */}
      {/* ============================================================ */}
      {activeSection === 'dashboard' && !isStudent && !isParent && (
        <div className="space-y-6">
          {/* EXACTLY 4 MAIN DASHBOARD CARDS ABOVE FILTERS (SIZED & STYLED TO MATCH FEES CARDS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Exams */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">TOTAL EXAMS</p>
                  <p className="text-3xl font-display font-bold text-ink-900 mt-2">{statsSummary.totalExams}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3 font-medium">Scheduled & Conducted</p>
            </div>

            {/* Card 2: Upcoming Exams */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">UPCOMING EXAMS</p>
                  <p className="text-3xl font-display font-bold text-blue-600 mt-2">{statsSummary.upcomingCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3 font-medium">Next Scheduled Tests</p>
            </div>

            {/* Card 3: Published Results */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">PUBLISHED RESULTS</p>
                  <p className="text-3xl font-display font-bold text-emerald-600 mt-2">{statsSummary.publishedExamsCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3 font-medium">Live Scorecards Released</p>
            </div>

            {/* Card 4: Pending Results */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">PENDING RESULTS</p>
                  <p className="text-3xl font-display font-bold text-amber-600 mt-2">{statsSummary.pendingResultsCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3 font-medium">Evaluation / Draft Mode</p>
            </div>
          </div>

          {/* Horizontal Class & Exam Filter Bar */}
          {renderHorizontalFilterBar()}

          {/* Student Class Marks Table on Dashboard */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="p-4 border-b border-border bg-canvas/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-bold text-ink-900 uppercase tracking-wider flex items-center gap-2">
                  <span>Class Students & Exam Marks</span>
                  {selectedDashboardExamObj && (
                    <span className="px-2.5 py-0.5 bg-brand-100 text-brand-800 text-xs rounded-full font-bold">
                      {selectedDashboardExamObj.title}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-ink-400">
                  Showing students for {filterCourse} {filterBranch} {filterYear} ({filterSemester}, {filterSection}).
                </p>
              </div>

              {(isAdmin || isTeacher) && (
                <Button size="sm" onClick={openCreateExamModal} className="bg-brand-600 hover:bg-brand-700 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Create Exam
                </Button>
              )}
            </div>

            {targetClassStudents.length === 0 ? (
              <EmptyState icon={Award} title="No students found in selected class" description="Adjust your Course, Branch, Year, and Section filters above to view students." />
            ) : !selectedDashboardExamObj ? (
              <div className="p-8 text-center text-ink-400 text-xs space-y-2">
                <AlertCircle className="h-6 w-6 mx-auto text-amber-500" />
                <p className="font-bold text-ink-700 text-sm">No Examination Selected</p>
                <p>Select an examination from the Exam dropdown in the filter bar to view student marks.</p>
              </div>
            ) : (
              <DataTable
                columns={[
                  { key: 'roll_no', header: 'Roll No', render: (r) => <span className="font-mono text-xs font-bold text-ink-900">{r.roll_no}</span> },
                  { key: 'student_name', header: 'Student Name', render: (r) => <span className="font-bold text-ink-900 text-sm">{r.student_name}</span> },
                  {
                    key: 'subjectBreakdown',
                    header: `Subject-wise Marks (${subjectsForSelectedExam.length} Subjects)`,
                    render: (r) => (
                      <div className="flex flex-wrap gap-1.5 max-w-lg">
                        {r.subjectBreakdown.map((sb: any, idx: number) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 border text-[11px] font-medium rounded flex items-center gap-1 ${
                              sb.obtained_marks === null
                                ? 'bg-canvas text-ink-400 border-border'
                                : sb.status === 'Pass'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            <span className="font-semibold text-ink-900">{sb.subject_name}:</span>
                            <span className="font-bold">
                              {sb.obtained_marks === null ? 'Not Entered' : `${sb.obtained_marks}/${sb.max_marks}`}
                            </span>
                          </span>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: 'total',
                    header: 'Total / %',
                    render: (r) => (
                      <div>
                        <span className="font-bold text-ink-900 text-sm block">{r.totalObtained} / {r.totalMax}</span>
                        <span className="text-xs font-semibold text-indigo-600">{r.hasAnyMark ? `${r.percentage}%` : '-'}</span>
                      </div>
                    ),
                  },
                  {
                    key: 'grade',
                    header: 'Grade',
                    render: (r) => (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded border border-indigo-200">
                        {r.grade}
                      </span>
                    ),
                  },
                  {
                    key: 'status',
                    header: 'Status',
                    render: (r) => <StatusPill status={r.status === 'Pass' ? 'success' : r.status === 'Fail' ? 'danger' : 'neutral'} label={r.status} />,
                  },
                ]}
                rows={dashboardStudentMarksList}
                keyExtractor={(r) => r.student_id || r.roll_no}
              />
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: EXAM & SCHEDULE                                    */}
      {/* ============================================================ */}
      {activeSection === 'exam_schedule' && !isStudent && !isParent && (
        <div className="space-y-6">
          {/* Horizontal Filter Bar */}
          {renderHorizontalFilterBar()}

          {/* Examination Records Table */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="p-4 border-b border-border bg-canvas/40 flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-bold text-ink-900">1. Central Examination Records</h3>
                <p className="text-xs text-ink-400">Manage examinations for {filterCourse} {filterBranch} {filterYear}.</p>
              </div>
            </div>

            <DataTable
              columns={[
                {
                  key: 'title',
                  header: 'Examination Title',
                  render: (r) => (
                    <div>
                      <span className="font-bold text-ink-900 block">{r.title}</span>
                      {r.description && <span className="text-xs text-ink-500 block truncate max-w-xs">{r.description}</span>}
                    </div>
                  ),
                },
                { key: 'type', header: 'Exam Type', render: (r) => <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 text-xs font-semibold rounded">{r.type}</span> },
                { key: 'academic', header: 'Course & Class', render: (r) => <span className="text-xs font-medium text-ink-700">{r.course} ({r.branch}) · {r.year}</span> },
                { key: 'session', header: 'Session', render: (r) => <span className="text-xs text-ink-600">{r.academic_session || '2026-2027'}</span> },
                { key: 'date', header: 'Start Date', render: (r) => <span className="text-xs font-semibold text-ink-900">{r.date}</span> },
                { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status === 'Completed' ? 'success' : r.status === 'Ongoing' ? 'warning' : 'info'} label={r.status} /> },
                {
                  key: 'actions',
                  header: 'Actions',
                  align: 'right',
                  render: (r) => (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setFilterExamId(r.id)
                          if (r.course) setFilterCourse(r.course)
                          setActiveSection('marks_entry')
                        }}
                        className="p-1.5 text-xs bg-brand-50 text-brand-600 hover:bg-brand-100 rounded font-semibold flex items-center gap-1 cursor-pointer"
                        title="Enter / View Marks"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Marks Entry
                      </button>

                      {canTeacherManageExam(r) && (
                        <>
                          <button onClick={() => openEditExamModal(r)} className="p-1.5 hover:bg-canvas text-ink-400 hover:text-ink-900 rounded cursor-pointer" title="Edit Exam">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteExam(r)} className="p-1.5 hover:bg-danger-100 text-ink-400 hover:text-danger-600 rounded cursor-pointer" title="Delete Exam">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ),
                },
              ]}
              rows={filteredExamsList}
              keyExtractor={(r) => r.id}
              emptyState={<EmptyState icon={Award} title="No examinations found" description="Create an exam to get started." onAction={isAdmin ? openCreateExamModal : undefined} actionLabel={isAdmin ? "Create Examination" : undefined} />}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 3: MARKS ENTRY                                      */}
      {/* ============================================================ */}
      {activeSection === 'marks_entry' && !isStudent && !isParent && (
        <div className="space-y-6">
          {/* Horizontal Filter Bar */}
          {renderHorizontalFilterBar({ showExamSelect: true, showSubjectSelect: true, showStudentSelect: true })}

          {!filterExamId ? (
            <div className="p-12 text-center border-2 border-dashed border-border rounded-[var(--radius-card)] bg-surface text-ink-400 text-sm">
              <Award className="h-8 w-8 mx-auto mb-2 text-ink-300" />
              Please select an <span className="font-bold text-ink-700">Examination</span> from the filter bar above.
            </div>
          ) : !selectedSubjectId ? (
            <div className="p-12 text-center border-2 border-dashed border-amber-300 rounded-[var(--radius-card)] bg-amber-50/40 text-amber-900 text-sm">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-amber-600" />
              <p className="font-bold text-base text-amber-900">Subject Selection Required</p>
              <p className="text-xs text-amber-700 mt-1 max-w-md mx-auto">
                Please select a <span className="font-bold">Subject</span> from the filter bar above to load marks entry.
              </p>
            </div>
          ) : !isTeacherAssignedToClass ? (
            <div className="p-12 text-center border-2 border-dashed border-rose-300 rounded-[var(--radius-card)] bg-rose-50/40 text-rose-900 text-sm">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-rose-600" />
              <p className="font-bold text-base text-rose-900">Access Restricted</p>
              <p className="text-xs text-rose-700 mt-1 max-w-md mx-auto">
                You are logged in as a Teacher but are not assigned to teach {filterCourse} {filterBranch}.
              </p>
            </div>
          ) : (
            <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
              <div className="p-4 border-b border-border bg-canvas/40 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-display font-bold text-ink-900 flex items-center gap-2">
                    <span>Subject Marks Entry — {activeSelectedSubjectObj?.name}</span>
                    <span className="px-2 py-0.5 bg-brand-100 text-brand-700 font-mono text-xs font-bold rounded">
                      {activeSelectedSubjectObj?.code}
                    </span>
                  </h3>
                  <p className="text-xs text-ink-400">
                    Exam: {selectedDashboardExamObj?.title} | Class: {filterCourse} {filterBranch} {filterSemester} ({filterSection})
                  </p>
                </div>

                <Button onClick={handleSaveMarksForSubject} className="bg-brand-600 hover:bg-brand-700 text-white">
                  Save Subject Marks to Supabase
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-canvas/30 text-xs font-semibold text-ink-400 uppercase">
                      <th className="px-4 py-3">S.No</th>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Max Marks</th>
                      <th className="px-4 py-3">Passing Marks</th>
                      <th className="px-4 py-3 w-36">Obtained Marks *</th>
                      <th className="px-4 py-3">Percentage</th>
                      <th className="px-4 py-3">Grade</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filterStudentId === 'All Students'
                      ? targetClassStudents
                      : targetClassStudents.filter((s) => s.id === filterStudentId)
                    ).map((st, idx) => {
                      const markKey = `${st.id}_${activeSelectedSubjectObj?.id}`
                      const existingRes = results.find(
                        (r) => r.exam_id === selectedDashboardExamObj?.id && r.student_id === st.id && (r.subject === activeSelectedSubjectObj?.name || r.exam_subject_id === activeSelectedSubjectObj?.id)
                      )

                      const rawVal = enteredMarksMap[markKey] ?? (existingRes ? existingRes.obtained_marks : '')
                      const obtNum = rawVal === '' ? 0 : Number(rawVal)
                      const maxM = 100
                      const passM = 40
                      const pct = Math.round((obtNum / maxM) * 100)
                      const calc = calculateGradeAndPoint(obtNum, maxM, passM)

                      return (
                        <tr key={st.id} className="border-b border-border last:border-0 hover:bg-canvas/20">
                          <td className="px-4 py-3 text-xs text-ink-400 font-mono">{idx + 1}</td>
                          <td className="px-4 py-3 text-xs font-mono font-bold text-ink-900">{st.roll_no}</td>
                          <td className="px-4 py-3 text-sm font-bold text-ink-900">{st.name}</td>
                          <td className="px-4 py-3 text-xs text-ink-600">{maxM}</td>
                          <td className="px-4 py-3 text-xs text-emerald-700 font-semibold">{passM}</td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min={0}
                              max={maxM}
                              value={rawVal}
                              onChange={(e) => {
                                const valStr = e.target.value
                                const num = Number(valStr)
                                if (num > maxM) {
                                  toast({ type: 'warning', title: 'Validation Warning', description: `Marks cannot exceed ${maxM}.` })
                                  setEnteredMarksMap((prev) => ({ ...prev, [markKey]: maxM }))
                                } else if (num < 0) {
                                  setEnteredMarksMap((prev) => ({ ...prev, [markKey]: 0 }))
                                } else {
                                  setEnteredMarksMap((prev) => ({ ...prev, [markKey]: valStr }))
                                }
                              }}
                              className="w-28 text-sm font-bold"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3 text-xs font-bold text-indigo-600">{isNaN(pct) ? '0%' : `${pct}%`}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded border border-indigo-200">
                              {calc.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusPill status={calc.status === 'Pass' ? 'success' : 'danger'} label={calc.status} />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={enteredRemarksMap[markKey] ?? (existingRes ? existingRes.remarks || '' : '')}
                              onChange={(e) => setEnteredRemarksMap((prev) => ({ ...prev, [markKey]: e.target.value }))}
                              placeholder="Optional remark..."
                              className="text-xs py-1"
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: EXAM RESULT                                      */}
      {/* ============================================================ */}
      {activeSection === 'result' && !isStudent && !isParent && (
        <div className="space-y-6">
          {/* Horizontal Filter Bar */}
          {renderHorizontalFilterBar({ showStudentSelect: true })}

          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="p-4 border-b border-border bg-canvas/40 flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-bold text-ink-900">Consolidated Student Exam Performance & Scorecards</h3>
                <p className="text-xs text-ink-400">View subject breakdowns, percentage, and overall pass/fail status per student.</p>
              </div>
            </div>

            <DataTable
              columns={[
                { key: 'roll_no', header: 'Roll No', render: (r) => <span className="font-mono text-xs font-bold text-ink-900">{r.roll_no}</span> },
                { key: 'student', header: 'Student Name', render: (r) => <span className="font-bold text-ink-900">{r.student_name}</span> },
                { key: 'group', header: 'Class Group', render: (r) => <span className="text-xs text-ink-600">{r.course} ({r.branch}) · {r.year} ({r.semester})</span> },
                {
                  key: 'subjects',
                  header: 'Subjects & Marks Breakdown',
                  render: (r) => (
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {r.subjects.map((sub: any, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-canvas border border-border text-[11px] font-medium rounded text-ink-800 flex items-center gap-1">
                          <span className="font-semibold text-ink-900">{sub.subject_name}:</span>
                          <span className={sub.status === 'Pass' ? 'font-bold text-emerald-700' : 'font-bold text-rose-600'}>
                            {sub.obtained_marks}/{sub.max_marks}
                          </span>
                        </span>
                      ))}
                    </div>
                  ),
                },
                { key: 'marks', header: 'Total Marks', render: (r) => <span className="font-bold text-ink-900 text-sm">{r.total_obtained} / {r.total_max}</span> },
                { key: 'pct', header: 'Overall %', render: (r) => <span className="font-bold text-indigo-600 text-sm">{r.overall_percentage}%</span> },
                { key: 'grade', header: 'Grade', render: (r) => <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded border border-indigo-200">{r.overall_grade}</span> },
                { key: 'status', header: 'Result Status', render: (r) => <StatusPill status={r.overall_status === 'Pass' ? 'success' : 'danger'} label={r.overall_status} /> },
                {
                  key: 'action',
                  header: 'Scorecard',
                  align: 'right',
                  render: (r) => (
                    <Button size="sm" variant="ghost" onClick={() => setSelectedStudentSummaryModal(r)} className="text-xs gap-1">
                      <Eye className="h-3.5 w-3.5" /> Full Marksheet
                    </Button>
                  ),
                },
              ]}
              rows={consolidatedStudentResults}
              keyExtractor={(r) => r.student_id || r.roll_no}
              emptyState={<EmptyState icon={ResultIcon} title="No student results found" description="Select Course, Branch, Year, Semester, Section to view consolidated exam details." />}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 5: PUBLISH RESULT                                   */}
      {/* ============================================================ */}
      {activeSection === 'publish_result' && !isStudent && !isParent && (
        <div className="space-y-6">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-4">
            <h3 className="text-base font-display font-bold text-ink-900">Result Releases & Publication Lifecycle</h3>
            <p className="text-xs text-ink-400 mt-0.5">
              Control result releases. Un-published results remain in Draft mode and are strictly hidden from Students & Parents.
            </p>
          </div>

          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden divide-y divide-border">
            {exams.map((exam) => {
              const examResults = results.filter((r) => r.exam_id === exam.id)
              const isPublished = examResults.some((r) => r.is_published)

              return (
                <div key={exam.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-canvas/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-ink-900 text-sm">{exam.title}</h4>
                      <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-semibold rounded">{exam.type}</span>
                    </div>
                    <p className="text-xs text-ink-500">
                      Course: <span className="font-semibold text-ink-900">{exam.course} ({exam.branch || 'All Branches'}, {exam.year || 'All Years'})</span> | Total Marks Records: <span className="font-bold">{examResults.length}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusPill status={isPublished ? 'success' : 'neutral'} label={isPublished ? 'PUBLISHED' : 'DRAFT / HIDDEN'} />
                    {canTeacherManageExam(exam) && (
                      <Button
                        size="sm"
                        onClick={() => handleTogglePublish(exam.id, isPublished)}
                        className={!isPublished ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-ink-700'}
                      >
                        <Send className="h-3.5 w-3.5" />
                        {isPublished ? 'Unpublish' : 'Publish Result'}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 6: RESULT ANALYSIS                                  */}
      {/* ============================================================ */}
      {activeSection === 'analysis' && !isStudent && !isParent && (
        <div className="space-y-6">
          {/* Horizontal Filter Bar */}
          {renderHorizontalFilterBar({ showSubjectSelect: true })}

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="p-4 bg-surface rounded-[var(--radius-card)] border border-border shadow-2xs">
              <span className="text-xs font-semibold text-ink-400 block mb-1">Total Records</span>
              <p className="text-2xl font-bold text-ink-900">{analysisData.totalRecords}</p>
            </div>
            <div className="p-4 bg-surface rounded-[var(--radius-card)] border border-border shadow-2xs">
              <span className="text-xs font-semibold text-ink-400 block mb-1">Passed Students</span>
              <p className="text-2xl font-bold text-emerald-600">{analysisData.passedCount}</p>
            </div>
            <div className="p-4 bg-surface rounded-[var(--radius-card)] border border-border shadow-2xs">
              <span className="text-xs font-semibold text-ink-400 block mb-1">Failed Students</span>
              <p className="text-2xl font-bold text-rose-600">{analysisData.failedCount}</p>
            </div>
            <div className="p-4 bg-surface rounded-[var(--radius-card)] border border-border shadow-2xs">
              <span className="text-xs font-semibold text-ink-400 block mb-1">Pass Percentage</span>
              <p className="text-2xl font-bold text-indigo-600">{analysisData.passPercentage}%</p>
            </div>
            <div className="p-4 bg-surface rounded-[var(--radius-card)] border border-border shadow-2xs">
              <span className="text-xs font-semibold text-ink-400 block mb-1">Class Average</span>
              <p className="text-2xl font-bold text-ink-900">{analysisData.avgMarks}</p>
            </div>
            <div className="p-4 bg-surface rounded-[var(--radius-card)] border border-border shadow-2xs">
              <span className="text-xs font-semibold text-ink-400 block mb-1">Highest Score</span>
              <p className="text-2xl font-bold text-emerald-600">{analysisData.highestMarks}</p>
            </div>
            <div className="p-4 bg-surface rounded-[var(--radius-card)] border border-border shadow-2xs">
              <span className="text-xs font-semibold text-ink-400 block mb-1">Lowest Score</span>
              <p className="text-2xl font-bold text-rose-600">{analysisData.lowestMarks}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-bold text-ink-900 uppercase tracking-wider">Grade Distribution</h3>
                <span className="text-xs font-medium text-ink-500">{filterCourse} {filterBranch}</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysisData.chartGradeData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#4B5563' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#4B5563' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                      itemStyle={{ color: '#6366F1' }}
                    />
                    <Bar dataKey="students" fill="#6366F1" radius={[4, 4, 0, 0]}>
                      {analysisData.chartGradeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.grade === 'F' ? '#EF4444' : entry.grade.startsWith('A') ? '#10B981' : '#6366F1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-5 space-y-4 flex flex-col justify-between">
              <h3 className="text-sm font-display font-bold text-ink-900 uppercase tracking-wider">Pass vs Fail Ratio</h3>

              <div className="h-64 w-full flex items-center justify-center">
                {analysisData.totalRecords === 0 ? (
                  <div className="text-xs text-ink-400 text-center">No examination data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysisData.piePassFailData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {analysisData.piePassFailData.map((entry, index) => (
                          <Cell key={`pie-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '12px' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STUDENT & PARENT VIEW: MY RESULTS                            */}
      {/* ============================================================ */}
      {(isStudent || isParent) && activeSection === 'my_results' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-display font-bold text-ink-900">Official Exam Scorecards</h3>
              <p className="text-xs text-ink-400 mt-0.5">Verified results published by college administration.</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-ink-500 shrink-0">Select Exam:</label>
              <Select
                options={[
                  { value: 'All Exams', label: 'All Published Exams' },
                  ...availablePublishedExamOptions,
                ]}
                value={selectedStudentExamFilter}
                onChange={(e) => setSelectedStudentExamFilter(e.target.value)}
                className="w-56 text-xs"
              />
            </div>
          </div>

          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
            {studentPublishedResults.length === 0 ? (
              <div className="p-12 text-center text-ink-400 text-sm">
                {selectedStudentExamFilter === 'All Exams' ? (
                  'No published results available yet for your class.'
                ) : (
                  <>
                    No published results available yet for{' '}
                    <span className="font-semibold text-ink-700">
                      {exams.find((e) => e.id === selectedStudentExamFilter)?.title || 'this examination'}
                    </span>
                    . Results will appear here once published by faculty.
                  </>
                )}
              </div>
            ) : (
              <DataTable
                columns={[
                  { key: 'exam', header: 'Exam Title', render: (r) => <span className="font-semibold text-brand-700">{exams.find((e) => e.id === r.exam_id)?.title || 'Examination'}</span> },
                  { key: 'subject', header: 'Subject Name', render: (r) => <span className="font-bold text-ink-900">{r.subject}</span> },
                  { key: 'max_marks', header: 'Max Marks', render: (r) => r.max_marks },
                  { key: 'passing_marks', header: 'Passing', render: (r) => <span className="text-emerald-700 font-medium">{r.passing_marks}</span> },
                  { key: 'obtained_marks', header: 'Obtained Marks', render: (r) => <span className="font-bold text-ink-900 text-sm">{r.obtained_marks}</span> },
                  { key: 'percentage', header: 'Percentage', render: (r) => <span className="font-bold text-indigo-600">{r.percentage}%</span> },
                  { key: 'grade', header: 'Grade', render: (r) => <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded border border-indigo-200">{r.grade}</span> },
                  { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status === 'Pass' ? 'success' : 'danger'} label={r.status} /> },
                  { key: 'date', header: 'Published Date', render: (r) => <span className="text-xs text-ink-400">{r.published_date || 'Published'}</span> },
                ]}
                rows={studentPublishedResults}
                keyExtractor={(r) => r.id}
              />
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STUDENT & PARENT VIEW: EXAM SCHEDULE & DATESHEET             */}
      {/* ============================================================ */}
      {(isStudent || isParent) && activeSection === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-4">
            <h3 className="text-base font-display font-bold text-ink-900">Official Examination Timetable & Datesheet</h3>
            <p className="text-xs text-ink-400 mt-0.5">
              Scheduled examinations, date sheet timetables, and venue details for {currentStudent?.course} ({currentStudent?.branch}).
            </p>
          </div>

          {studentClassExams.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-border rounded-[var(--radius-card)] bg-surface text-ink-400 text-sm">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-ink-300" />
              No upcoming examination schedule available for your class yet.
            </div>
          ) : (
            <div className="space-y-6">
              {studentClassExams.map((ex) => {
                const exSubjs = examSubjects.filter((s) => s.exam_id === ex.id)

                return (
                  <div key={ex.id} className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
                    <div className="p-4 border-b border-border bg-canvas/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-ink-900 text-base">{ex.title}</h4>
                          <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 text-xs font-semibold rounded">{ex.type}</span>
                        </div>
                        <p className="text-xs text-ink-500 mt-1">
                          Academic Session: <span className="font-semibold text-ink-900">{ex.academic_session || '2026-2027'}</span> | Start Date: <span className="font-semibold text-ink-900">{ex.date}</span>
                        </p>
                        {ex.description && <p className="text-xs text-ink-400 italic mt-0.5">{ex.description}</p>}
                      </div>

                      <StatusPill status={ex.status === 'Completed' ? 'success' : ex.status === 'Ongoing' ? 'warning' : 'info'} label={ex.status} />
                    </div>

                    {exSubjs.length === 0 ? (
                      <div className="p-6 text-center text-xs text-ink-400 italic">
                        Exam scheduled on {ex.date}. Detailed subject paper datesheet will be published shortly.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-border bg-canvas/20 text-ink-400 font-semibold uppercase">
                              <th className="px-4 py-3">S.No</th>
                              <th className="px-4 py-3">Subject Name</th>
                              <th className="px-4 py-3">Subject Code</th>
                              <th className="px-4 py-3">Date</th>
                              <th className="px-4 py-3">Timing</th>
                              <th className="px-4 py-3">Room / Venue</th>
                              <th className="px-4 py-3">Max Marks</th>
                              <th className="px-4 py-3">Passing Marks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {exSubjs.map((sub, idx) => (
                              <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-canvas/30">
                                <td className="px-4 py-3 font-mono text-ink-400">{idx + 1}</td>
                                <td className="px-4 py-3 font-bold text-ink-900">{sub.subject_name}</td>
                                <td className="px-4 py-3 font-mono font-semibold text-brand-700">{sub.subject_code}</td>
                                <td className="px-4 py-3 font-semibold text-ink-900">{sub.date}</td>
                                <td className="px-4 py-3 text-ink-600">{sub.start_time} — {sub.end_time}</td>
                                <td className="px-4 py-3 text-ink-600">{sub.room_number || 'Main Hall'}</td>
                                <td className="px-4 py-3 font-semibold text-ink-900">{sub.max_marks}</td>
                                <td className="px-4 py-3 text-emerald-700 font-semibold">{sub.passing_marks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* EXAM CREATE / EDIT MODAL                                     */}
      {/* ============================================================ */}
      <Modal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        title={editingExam ? 'Edit Examination Details' : 'Create New Examination'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddExamModal(false)}>Cancel</Button>
            <Button onClick={handleSaveExam} className="bg-brand-600 hover:bg-brand-700 text-white">
              {editingExam ? 'Save Changes' : 'Create Examination'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <FormField label="Exam / Test Name" required>
            <Input placeholder="e.g. Internal Test - 1, Mid Term Examination" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Exam Type" required>
              <Select
                options={[
                  { value: 'Internal Test', label: 'Internal Test' },
                  { value: 'Mid Term', label: 'Mid Term' },
                  { value: 'Unit Test', label: 'Unit Test' },
                  { value: 'Practical', label: 'Practical' },
                  { value: 'Semester Exam', label: 'Semester Exam' },
                  { value: 'Pre University Exam', label: 'Pre University Exam' },
                  { value: 'Sessional Exam', label: 'Sessional Exam' },
                  { value: 'Custom', label: 'Other / Custom' },
                ]}
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              />
            </FormField>

            {formType === 'Custom' ? (
              <FormField label="Custom Type Name">
                <Input placeholder="Surprise Quiz" value={customType} onChange={(e) => setCustomType(e.target.value)} />
              </FormField>
            ) : (
              <FormField label="Academic Session">
                <Input value={formSession} onChange={(e) => setFormSession(e.target.value)} placeholder="2026-2027" />
              </FormField>
            )}
          </div>

          {/* Class Selectors for Exam Creation */}
          <div className="p-3 bg-canvas/60 border border-border rounded-lg space-y-3">
            <span className="text-xs font-bold text-ink-800 uppercase tracking-wider block">Target Class & Group</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <FormField label="Course" required>
                <Select
                  options={COURSES.map((c) => ({ value: c, label: c }))}
                  value={formCourse}
                  onChange={(e) => {
                    const c = e.target.value
                    setFormCourse(c)
                    const bList = BRANCHES_BY_COURSE[c] || ['ECE']
                    setFormBranch(bList[0] || 'ECE')
                    setFormYear('1st Year')
                    const sList = getSemestersForYearAndCourse('1st Year', c)
                    setFormSemester(sList[0] || 'Semester 1')
                  }}
                  className="text-xs"
                />
              </FormField>

              <FormField label="Branch" required>
                <Select
                  options={(BRANCHES_BY_COURSE[formCourse] || ['ECE']).map((b) => ({ value: b, label: b }))}
                  value={formBranch}
                  onChange={(e) => setFormBranch(e.target.value)}
                  className="text-xs"
                />
              </FormField>

              <FormField label="Year" required>
                <Select
                  options={YEARS_BY_COURSE(formCourse).map((y) => ({ value: y, label: y }))}
                  value={formYear}
                  onChange={(e) => {
                    const y = e.target.value
                    setFormYear(y)
                    const sList = getSemestersForYearAndCourse(y, formCourse)
                    setFormSemester(sList[0] || 'Semester 1')
                  }}
                  className="text-xs"
                />
              </FormField>
            </div>
          </div>

          {/* Selectable Subjects Pills for Exam Creation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ink-800 uppercase tracking-wider">
                Select Exam Subjects ({formSelectedSubjectIds.length} Selected) *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormSelectedSubjectIds(formAvailableSubjects.map((s) => s.id))}
                  className="text-[11px] text-brand-600 font-semibold hover:underline"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setFormSelectedSubjectIds([])}
                  className="text-[11px] text-ink-400 font-semibold hover:underline"
                >
                  Clear All
                </button>
              </div>
            </div>

            {formAvailableSubjects.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                No subjects found in system for {formCourse} ({formBranch}, {formSemester}). All subjects defined in Academic Setup will appear here.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 bg-canvas/40 border border-border rounded-lg max-h-40 overflow-y-auto">
                {formAvailableSubjects.map((sub) => {
                  const isSelected = formSelectedSubjectIds.includes(sub.id)
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setFormSelectedSubjectIds((prev) => prev.filter((id) => id !== sub.id))
                        } else {
                          setFormSelectedSubjectIds((prev) => [...prev, sub.id])
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-surface text-ink-700 border border-border hover:border-brand-300'
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                      <span>{sub.name}</span>
                      <span className={`text-[10px] opacity-75 font-mono ${isSelected ? 'text-brand-100' : 'text-ink-400'}`}>
                        ({sub.code})
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Exam Start Date" required>
              <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
            </FormField>

            <FormField label="Status" required>
              <Select
                options={[
                  { value: 'Scheduled', label: 'Scheduled' },
                  { value: 'Ongoing', label: 'Ongoing' },
                  { value: 'Completed', label: 'Completed' },
                ]}
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
              />
            </FormField>
          </div>

          <FormField label="Description / Instructions (Optional)">
            <Input placeholder="Instructions for invigilators & students..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          </FormField>
        </div>
      </Modal>

      {/* Full Marksheet Summary Modal */}
      {selectedStudentSummaryModal && (
        <Modal
          isOpen={Boolean(selectedStudentSummaryModal)}
          onClose={() => setSelectedStudentSummaryModal(null)}
          title="Official Multi-Subject Examination Marksheet"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" onClick={() => window.print()} className="gap-1 text-xs">
                <Printer className="h-4 w-4" /> Print Official Marksheet
              </Button>
              <Button variant="ghost" onClick={() => setSelectedStudentSummaryModal(null)}>Close</Button>
            </div>
          }
        >
          <div className="space-y-4 text-sm p-1">
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-lg space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-ink-900">{selectedStudentSummaryModal.student_name}</h3>
                <StatusPill status={selectedStudentSummaryModal.overall_status === 'Pass' ? 'success' : 'danger'} label={selectedStudentSummaryModal.overall_status === 'Pass' ? 'PASSED' : 'FAILED'} />
              </div>
              <p className="text-xs text-ink-600">Roll No: <span className="font-mono font-bold text-ink-900">{selectedStudentSummaryModal.roll_no}</span></p>
              <p className="text-xs text-ink-600">Academic Group: <span className="font-semibold text-ink-900">{selectedStudentSummaryModal.course} ({selectedStudentSummaryModal.branch}) — {selectedStudentSummaryModal.year} ({selectedStudentSummaryModal.semester})</span></p>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-canvas/60 border-b border-border font-bold text-xs text-ink-800 uppercase tracking-wider">
                Exam Papers Performance Breakdown ({selectedStudentSummaryModal.subjects.length} Subjects)
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-canvas/30 text-ink-400 font-semibold uppercase">
                    <th className="px-3 py-2">S.No</th>
                    <th className="px-3 py-2">Subject Name</th>
                    <th className="px-3 py-2">Max Marks</th>
                    <th className="px-3 py-2">Passing</th>
                    <th className="px-3 py-2">Obtained</th>
                    <th className="px-3 py-2">%</th>
                    <th className="px-3 py-2">Grade</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudentSummaryModal.subjects.map((sub: any, idx: number) => (
                    <tr key={idx} className="border-b border-border last:border-0 hover:bg-canvas/20">
                      <td className="px-3 py-2 font-mono text-ink-400">{idx + 1}</td>
                      <td className="px-3 py-2 font-semibold text-ink-900">{sub.subject_name}</td>
                      <td className="px-3 py-2 text-ink-600">{sub.max_marks}</td>
                      <td className="px-3 py-2 text-emerald-700 font-medium">{sub.passing_marks}</td>
                      <td className="px-3 py-2 font-bold text-ink-900">{sub.obtained_marks}</td>
                      <td className="px-3 py-2 font-bold text-indigo-600">{sub.percentage}%</td>
                      <td className="px-3 py-2">
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded border border-indigo-200">
                          {sub.grade}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <StatusPill status={sub.status === 'Pass' ? 'success' : 'danger'} label={sub.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-canvas/60 border border-border rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-[10px] font-semibold text-ink-400 block uppercase">Total Obtained</span>
                <span className="text-base font-bold text-ink-900">{selectedStudentSummaryModal.total_obtained} / {selectedStudentSummaryModal.total_max}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-ink-400 block uppercase">Overall %</span>
                <span className="text-base font-bold text-indigo-600">{selectedStudentSummaryModal.overall_percentage}%</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-ink-400 block uppercase">Overall Grade</span>
                <span className="text-base font-bold text-indigo-700">{selectedStudentSummaryModal.overall_grade}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-ink-400 block uppercase">Final Result</span>
                <span className={selectedStudentSummaryModal.overall_status === 'Pass' ? 'text-base font-bold text-emerald-600' : 'text-base font-bold text-rose-600'}>
                  {selectedStudentSummaryModal.overall_status === 'Pass' ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
