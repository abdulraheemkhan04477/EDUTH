import { useState, useMemo, useEffect } from 'react'
import { StatCard, Select, DataTable, StatusPill, EmptyState } from '../../components/ui'
import { TrendingUp, Target, Award, BookOpen, User, CheckCircle, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, COURSES, BRANCHES_BY_COURSE, SEMESTERS_BY_YEAR_COURSE, YEARS, YEARS_BY_COURSE, getTeacherForUser, isBranchMatch, isSemesterMatch, normalizeCollegeId } from '../../lib/academicStore'
import { useExamStore } from '../../lib/examStore'
import { useSuspensionStore } from '../../lib/suspensionStore'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export function StudentProgressPage() {
  const { user, role } = useAuth()
  const isStudent = role === 'student'
  const isParent = role === 'parent'
  const isTeacher = role === 'teacher'
  const { students, teachers, classes, getStudentAttendancePercentage } = useAcademicStore()
  const { getStudentPublishedResults, exams: storeExams } = useExamStore()
  const { suspensions } = useSuspensionStore()

  const userCollegeId = user?.college_id || '13695a78-0105-4bde-bc85-d664bb66637e'

  const currentTeacher = isTeacher ? getTeacherForUser(user, teachers) : null

  const teacherAssignedClasses = isTeacher && currentTeacher
    ? classes.filter(
        (c) =>
          c.teacher_id === currentTeacher.teacher_id ||
          c.teacher_name === currentTeacher.name ||
          (currentTeacher.assigned_classes || []).some((ac) => ac.includes(c.name) || c.name.includes(ac))
      )
    : []

  // Admin / Teacher Filters State
  const [filterCourse, setFilterCourse] = useState(isTeacher && teacherAssignedClasses[0] ? teacherAssignedClasses[0].course : 'B.Tech')
  const [filterBranch, setFilterBranch] = useState(isTeacher && teacherAssignedClasses[0] ? teacherAssignedClasses[0].branch : 'ECE')
  const [filterYear, setFilterYear] = useState(isTeacher && teacherAssignedClasses[0] ? teacherAssignedClasses[0].year : '1st Year')
  const [filterSemester, setFilterSemester] = useState('Semester 1')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedExamId, setSelectedExamId] = useState('')

  // Fresh fetched students for selected class (targeted DB query)
  const [groupStudents, setGroupStudents] = useState<any[]>([])

  // Available exams for the selected student's class
  const [availableExams, setAvailableExams] = useState<any[]>([])

  // Fresh fetched exam results for selected student (+ selected exam)
  const [studentPublishedResults, setStudentPublishedResults] = useState<any[]>([])

  // Target Student Resolution
  const loggedInStudent = useMemo(() => {
    if (!isStudent) return null
    const userEmailLower = user?.email?.toLowerCase().trim()
    return students.find(
      (s) =>
        (user?.student_id && (s.id === user.student_id || s.student_id === user.student_id || s.roll_no === user.student_id)) ||
        (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower) ||
        (user?.id && s.id === user.id)
    ) || null
  }, [isStudent, user, students])

  const parentLinkedStudent = useMemo(() => {
    if (!isParent) return null
    const linkedStudentId = user?.child_student_id || user?.student_id
    const userEmailLower = user?.email?.toLowerCase().trim()
    return students.find(
      (s) =>
        (linkedStudentId && (s.id === linkedStudentId || s.student_id === linkedStudentId || s.roll_no === linkedStudentId)) ||
        (userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower)
    ) || null
  }, [isParent, user, students])

  const currentStudent = isStudent
    ? loggedInStudent
    : isParent
    ? parentLinkedStudent
    : groupStudents.find((s) => s.id === selectedStudentId) || groupStudents[0] || null

  // Fast targeted query for students matching Course + Branch + Semester
  useEffect(() => {
    let isMounted = true

    async function fetchClassStudents() {
      if (isStudent || isParent) return

      try {
        if (isSupabaseConfigured) {
          const normCol = normalizeCollegeId(userCollegeId) || userCollegeId
          const collegeIds = Array.from(new Set([userCollegeId, normCol, '13695a78-0105-4bde-bc85-d664bb66637e'].filter(Boolean)))

          // Targeted select query - only needed columns and course filter directly in DB
          let query = supabase
            .from('students')
            .select('id, student_id, name, roll_no, course, branch, year, semester, section, college_id')
            .in('college_id', collegeIds)

          if (filterCourse) {
            query = query.eq('course', filterCourse)
          }

          const { data, error } = await query
          if (!error && data && isMounted) {
            const filtered = data.filter((s: any) => {
              if (filterBranch && !isBranchMatch(s.branch, filterBranch)) return false
              if (filterSemester && !isSemesterMatch(s.semester, filterSemester)) return false
              if (isTeacher && teacherAssignedClasses.length > 0) {
                const isAssigned = teacherAssignedClasses.some(
                  (c) => s.course === c.course && isBranchMatch(s.branch, c.branch) && (s.year === c.year || !c.year)
                )
                if (!isAssigned) return false
              }
              return true
            })

            setGroupStudents(filtered)
            if (filtered.length > 0) {
              if (!filtered.some((s: any) => s.id === selectedStudentId)) {
                setSelectedStudentId(filtered[0].id)
                setSelectedExamId('') // Reset exam when student changes
              }
            } else {
              setSelectedStudentId('')
              setSelectedExamId('')
            }
            return
          }
        }
      } catch (e) {
        console.warn('Supabase targeted student fetch notice:', e)
      }

      // Fallback from store if offline / Supabase error
      if (isMounted) {
        const permittedStudents = isTeacher
          ? students.filter((s) =>
              teacherAssignedClasses.some(
                (c) => s.course === c.course && s.branch === c.branch && s.year === c.year && (!c.section || c.section === 'All Sections' || s.section === c.section)
              )
            )
          : students

        const filtered = permittedStudents.filter((s) => {
          if (filterCourse && s.course !== filterCourse) return false
          if (filterBranch && !isBranchMatch(s.branch, filterBranch)) return false
          if (filterSemester && !isSemesterMatch(s.semester, filterSemester)) return false
          return true
        })

        setGroupStudents(filtered)
        if (filtered.length > 0) {
          if (!filtered.some((s) => s.id === selectedStudentId)) {
            setSelectedStudentId(filtered[0].id)
            setSelectedExamId('')
          }
        } else {
          setSelectedStudentId('')
          setSelectedExamId('')
        }
      }
    }

    fetchClassStudents()
    return () => {
      isMounted = false
    }
  }, [filterCourse, filterBranch, filterSemester, filterYear, isTeacher, userCollegeId, isStudent, isParent])

  // Parallel fetch & robust matching for class-relevant Exams & Student Marks
  useEffect(() => {
    let isMounted = true

    async function fetchExamsAndMarks() {
      if (!currentStudent) {
        setAvailableExams([])
        setStudentPublishedResults([])
        return
      }

      const selectedId = currentStudent.id || currentStudent.profile_id || currentStudent.student_id
      if (!selectedId) {
        setAvailableExams([])
        setStudentPublishedResults([])
        return
      }

      // Collect all student identifier variants
      const studentIdsToMatch = Array.from(
        new Set(
          [
            selectedId,
            currentStudent.id,
            currentStudent.profile_id,
            currentStudent.student_id,
            currentStudent.roll_no,
            `STU-${currentStudent.roll_no}`,
            (currentStudent.roll_no || '').replace(/^STU-/i, ''),
          ].filter(Boolean) as string[]
        )
      )

      // 1. Always get authoritative store published results as robust baseline
      const storePublishedResults = getStudentPublishedResults(
        currentStudent.id,
        currentStudent.roll_no,
        currentStudent.student_id,
        currentStudent.email
      )

      let rawDbExams: any[] = []
      let rawDbResults: any[] = []

      try {
        if (isSupabaseConfigured) {
          const normCol = normalizeCollegeId(userCollegeId) || userCollegeId
          const collegeIds = Array.from(new Set([userCollegeId, normCol, '13695a78-0105-4bde-bc85-d664bb66637e'].filter(Boolean)))

          // Fetch Exams for student's course & college
          let examsQuery = supabase
            .from('exams')
            .select('id, title, type, course, branch, year, semester, section, status, date, subject')
            .in('college_id', collegeIds)

          if (currentStudent.course) {
            examsQuery = examsQuery.eq('course', currentStudent.course)
          }

          // Fetch Results for student's identifiers
          let resQuery = supabase
            .from('results')
            .select('id, exam_id, exam_subject_id, subject, exam_subject_name, obtained_marks, marks, max_marks, passing_marks, status, semester, is_published, published, student_id, roll_no')
            .in('student_id', studentIdsToMatch)

          const [examsRes, resultsRes] = await Promise.all([examsQuery, resQuery])
          if (examsRes.data) rawDbExams = examsRes.data
          if (resultsRes.data) rawDbResults = resultsRes.data
        }
      } catch (e) {
        console.warn('Supabase exams & results fetch notice:', e)
      }

      if (!isMounted) return

      // Combine DB Exams + storeExams, scoped strictly to student's class
      const allExamsList = [...rawDbExams, ...(storeExams || [])]
      const uniqueExamsMap = new Map<string, any>()

      allExamsList.forEach((e: any) => {
        if (!e || !e.id) return
        const courseMatch = !e.course || e.course === currentStudent.course
        const branchMatch = !e.branch || e.branch === 'All' || e.branch === 'All Branches' || isBranchMatch(e.branch, currentStudent.branch)
        const yearMatch = !e.year || e.year === 'All' || e.year === currentStudent.year
        const semMatch = !e.semester || isSemesterMatch(e.semester, currentStudent.semester)

        if (courseMatch && branchMatch && yearMatch && semMatch) {
          if (!uniqueExamsMap.has(e.id)) {
            uniqueExamsMap.set(e.id, {
              id: e.id,
              title: e.title || `${e.type || 'Exam'} (${e.subject || 'General'})`,
              type: e.type,
              course: e.course,
              branch: e.branch,
              year: e.year,
              semester: e.semester,
              subject: e.subject,
            })
          }
        }
      })

      const classExams = Array.from(uniqueExamsMap.values())

      // Combine DB Results + Store Results
      const formattedDbResults = rawDbResults
        .filter((r: any) => {
          const isPub = r.published === true || r.is_published === true
          const hasMarks = r.obtained_marks !== null && r.obtained_marks !== undefined
          return isPub && hasMarks
        })
        .map((r: any) => ({
          id: r.id,
          exam_id: r.exam_id,
          exam_subject_id: r.exam_subject_id,
          subject: r.subject || r.exam_subject_name || 'Subject',
          obtained_marks: Number(r.obtained_marks ?? r.marks),
          max_marks: Number(r.max_marks) || 100,
          status: r.status || (Number(r.obtained_marks) >= Number(r.passing_marks || 40) ? 'Pass' : 'Fail'),
          semester: r.semester || currentStudent.semester || 'Semester 1',
        }))

      const formattedStoreResults = storePublishedResults.map((r) => ({
        id: r.id,
        exam_id: r.exam_id,
        exam_subject_id: r.exam_subject_id,
        subject: r.subject,
        obtained_marks: Number(r.obtained_marks),
        max_marks: Number(r.max_marks) || 100,
        status: r.status,
        semester: r.semester || currentStudent.semester || 'Semester 1',
      }))

      // Deduplicate results by ID or (subject + exam_id)
      const combinedResultsMap = new Map<string, any>()
      formattedDbResults.forEach((r) => combinedResultsMap.set(r.id, r))
      formattedStoreResults.forEach((r) => {
        if (!combinedResultsMap.has(r.id)) {
          const altKey = `${r.exam_id || ''}_${r.subject}`
          if (!Array.from(combinedResultsMap.values()).some((x) => `${x.exam_id || ''}_${x.subject}` === altKey)) {
            combinedResultsMap.set(r.id, r)
          }
        }
      })

      const allStudentResults = Array.from(combinedResultsMap.values())

      // Filter for selected exam
      let filteredMarks = allStudentResults
      if (selectedExamId) {
        const selectedExamObj = classExams.find((e) => e.id === selectedExamId)
        filteredMarks = allStudentResults.filter((r) => {
          if (r.exam_id && r.exam_id === selectedExamId) return true
          if (r.exam_subject_id && r.exam_subject_id === selectedExamId) return true
          if (selectedExamObj) {
            if (selectedExamObj.id && r.exam_id === selectedExamObj.id) return true
            if (selectedExamObj.title && r.exam_title && r.exam_title.toLowerCase() === selectedExamObj.title.toLowerCase()) return true
            if (selectedExamObj.title && r.title && r.title.toLowerCase() === selectedExamObj.title.toLowerCase()) return true
            if (selectedExamObj.title && r.subject && selectedExamObj.title.toLowerCase().includes(r.subject.toLowerCase())) return true
            if (selectedExamObj.subject && r.subject && r.subject.toLowerCase() === selectedExamObj.subject.toLowerCase()) return true
          }
          return false
        })
      }

      setAvailableExams(classExams)
      setStudentPublishedResults(filteredMarks)
    }

    fetchExamsAndMarks()
    return () => {
      isMounted = false
    }
  }, [currentStudent?.id, currentStudent?.profile_id, currentStudent?.roll_no, currentStudent?.student_id, currentStudent?.course, currentStudent?.branch, currentStudent?.year, currentStudent?.semester, selectedExamId, getStudentPublishedResults, userCollegeId, storeExams])

  // Real Attendance Percentage
  const attendancePercentage = currentStudent ? getStudentAttendancePercentage(currentStudent.id) : 0

  // Real Suspension Records for current student
  const studentSuspensions = useMemo(() => {
    if (!currentStudent) return []
    return suspensions.filter(
      (s) =>
        s.student_id === currentStudent.id ||
        s.student_id === currentStudent.student_id ||
        s.roll_no === currentStudent.roll_no
    )
  }, [currentStudent, suspensions])

  // Calculations
  const totalSubjects = studentPublishedResults.length
  const passedSubjects = studentPublishedResults.filter((r) => r.status === 'Pass').length

  const avgPercentage = studentPublishedResults.length > 0
    ? Math.round(
        studentPublishedResults.reduce((sum, r) => sum + (r.obtained_marks / r.max_marks) * 100, 0) /
          studentPublishedResults.length
      )
    : 0

  // Subject-wise performance records
  const subjectPerformanceRows = useMemo(() => {
    if (!studentPublishedResults || studentPublishedResults.length === 0) return []
    return studentPublishedResults.map((r) => {
      const pct = Math.round((r.obtained_marks / r.max_marks) * 100)
      let evalStatus = 'Good'
      if (pct >= 85) evalStatus = 'Excellent'
      else if (pct >= 70) evalStatus = 'Good'
      else if (pct >= 40) evalStatus = 'Needs Improvement'
      else evalStatus = 'Fail'

      return {
        subject: r.subject,
        obtained: r.obtained_marks,
        max: r.max_marks,
        pct,
        resultStatus: r.status,
        evalStatus,
      }
    })
  }, [studentPublishedResults])

  // Best Subject
  const bestSubjectObj = useMemo(() => {
    if (subjectPerformanceRows.length === 0) return null
    return [...subjectPerformanceRows].sort((a, b) => b.pct - a.pct)[0]
  }, [subjectPerformanceRows])

  const bestSubjectName = bestSubjectObj ? bestSubjectObj.subject : 'N/A'

  // Semester Performance Trend Data derived from real exam results grouped by semester
  const semesterTrendData = useMemo(() => {
    if (!studentPublishedResults || studentPublishedResults.length === 0) {
      if (!currentStudent) return []
      return [
        {
          semester: currentStudent.semester || 'Current Term',
          overall: avgPercentage,
          math: attendancePercentage,
          core: avgPercentage,
        },
      ]
    }

    const semMap = new Map<string, { totalPct: number; count: number; maxPct: number }>()
    studentPublishedResults.forEach((r) => {
      const semKey = r.semester || currentStudent?.semester || 'Semester 1'
      const pct = Math.round((r.obtained_marks / r.max_marks) * 100)
      if (!semMap.has(semKey)) {
        semMap.set(semKey, { totalPct: 0, count: 0, maxPct: 0 })
      }
      const data = semMap.get(semKey)!
      data.totalPct += pct
      data.count += 1
      if (pct > data.maxPct) data.maxPct = pct
    })

    return Array.from(semMap.entries()).map(([semName, data]) => {
      const semAvg = Math.round(data.totalPct / data.count)
      return {
        semester: semName,
        overall: semAvg,
        math: data.maxPct,
        core: Math.max(0, semAvg - 3),
      }
    })
  }, [studentPublishedResults, currentStudent, avgPercentage, attendancePercentage])

  if (!currentStudent && (isStudent || isParent)) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold text-ink-900">Academic Progress</h1>
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-12 text-center">
          <EmptyState
            icon={AlertCircle}
            title={isStudent ? 'Student Profile Not Found' : 'Linked Student Profile Not Found'}
            description={
              isStudent
                ? 'Your student account is not linked to an active student record. Please contact your college administrator.'
                : 'No student record found linked to your parent account. Please verify your student link in Settings.'
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">
            {isStudent ? 'My Academic Progress' : isParent ? 'Child Academic Progress' : 'Student Academic Progress'}
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            {isStudent || isParent
              ? 'Track real academic performance, attendance, and exam standings.'
              : 'Filter and inspect student progress reports across courses, branches, and semesters.'}
          </p>
        </div>
      </div>

      {/* Academic & Exam Filter Bar (Hidden for Student and Parent unless Exam filter available) */}
      {!isStudent && !isParent && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <Select
              options={COURSES.map((c) => ({ value: c, label: c }))}
              value={filterCourse}
              onChange={(e) => {
                const c = e.target.value
                setFilterCourse(c)
                setFilterBranch(BRANCHES_BY_COURSE[c]?.[0] || '')
                setSelectedExamId('')
              }}
              className="w-full sm:w-40"
            />
            <Select
              options={(BRANCHES_BY_COURSE[filterCourse] || []).map((b) => ({ value: b, label: b }))}
              value={filterBranch}
              onChange={(e) => {
                setFilterBranch(e.target.value)
                setSelectedExamId('')
              }}
              className="w-full sm:w-48"
            />
            <Select
              options={(YEARS_BY_COURSE(filterCourse) || YEARS).map((y) => ({ value: y, label: y }))}
              value={filterYear}
              onChange={(e) => {
                const y = e.target.value
                setFilterYear(y)
                setFilterSemester(SEMESTERS_BY_YEAR_COURSE(y, filterCourse)[0] || 'Semester 1')
                setSelectedExamId('')
              }}
              className="w-full sm:w-36"
            />
            <Select
              options={SEMESTERS_BY_YEAR_COURSE(filterYear, filterCourse).map((s) => ({ value: s, label: s }))}
              value={filterSemester}
              onChange={(e) => {
                setFilterSemester(e.target.value)
                setSelectedExamId('')
              }}
              className="w-full sm:w-40"
            />
            <Select
              options={groupStudents.map((s) => ({ value: s.id, label: `${s.name} (${s.roll_no})` }))}
              value={currentStudent?.id || ''}
              onChange={(e) => {
                setSelectedStudentId(e.target.value)
                setSelectedExamId('')
              }}
              className="w-full sm:w-64"
            />
            <Select
              options={
                availableExams.length > 0
                  ? [{ value: '', label: 'All Exams' }, ...availableExams.map((e) => ({ value: e.id, label: e.title }))]
                  : [{ value: '', label: 'No Exams Available' }]
              }
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full sm:w-56"
            />
          </div>
        </div>
      )}

      {/* Student / Parent Exam Selection Bar */}
      {(isStudent || isParent) && availableExams.length > 0 && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-ink-600">Select Exam:</span>
            <Select
              options={[{ value: '', label: 'All Exams' }, ...availableExams.map((e) => ({ value: e.id, label: e.title }))]}
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
        </div>
      )}

      {/* Selected Student Banner Info */}
      {currentStudent && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-100 text-brand-600 rounded-xl font-bold">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-ink-900">{currentStudent.name}</h3>
              <p className="text-xs text-ink-400 mt-0.5">
                Roll No: <span className="font-mono font-semibold text-ink-900">{currentStudent.roll_no}</span> · {currentStudent.course} ({currentStudent.branch}) · {currentStudent.year || '1st Year'}, {currentStudent.semester || 'Semester 1'} ({currentStudent.section || 'Section A'})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Enrolled Active Student
            </span>
          </div>
        </div>
      )}

      {/* 4 Performance Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Overall Average" value={`${avgPercentage}%`} icon={TrendingUp} tone="brand" progressPercent={avgPercentage} />
        <StatCard label="Attendance Rate" value={`${attendancePercentage}%`} icon={BookOpen} tone="success" progressPercent={attendancePercentage} />
        <StatCard label="Best Subject" value={bestSubjectName} icon={Target} tone="info" />
        <StatCard label="Passed Subjects" value={`${passedSubjects} / ${totalSubjects}`} icon={Award} tone="warning" progressPercent={totalSubjects > 0 ? Math.round((passedSubjects / totalSubjects) * 100) : 0} />
      </div>

      {/* Subject-Wise Performance Breakdown Table */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden mb-6">
        <div className="p-4 border-b border-border bg-canvas/40 flex items-center justify-between">
          <h3 className="text-base font-display font-semibold text-ink-900">Subject-Wise Academic Performance</h3>
          <span className="text-xs text-ink-400">Based on verified published examination results</span>
        </div>
        <DataTable
          columns={[
            { key: 'subject', header: 'Subject', render: (r) => <span className="font-semibold text-ink-900">{r.subject}</span> },
            { key: 'obtained', header: 'Marks Obtained', render: (r) => `${r.obtained} / ${r.max}` },
            { key: 'pct', header: 'Percentage', render: (r) => <span className="font-bold text-indigo-600">{r.pct}%</span> },
            { key: 'evalStatus', header: 'Performance Level', render: (r) => (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                r.pct >= 85 ? 'bg-emerald-100 text-emerald-700' : r.pct >= 70 ? 'bg-info-100 text-info-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {r.evalStatus}
              </span>
            )},
            { key: 'resultStatus', header: 'Status', render: (r) => <StatusPill status={r.resultStatus === 'Pass' ? 'success' : 'danger'} label={r.resultStatus} /> },
          ]}
          rows={subjectPerformanceRows}
          keyExtractor={(r) => r.subject}
          emptyState={
            <EmptyState
              icon={Award}
              title="No published exam results found"
              description="Subject performance breakdown will be available once exam results are published."
            />
          }
        />
      </div>

      {/* Semester Progression Recharts Chart */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-display font-semibold text-ink-900">Semester-Wise Performance Trend</h3>
          <span className="text-xs text-ink-400">Historical Term Growth</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={semesterTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="semester" tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }} domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="overall" stroke="var(--color-brand-600)" strokeWidth={2.5} name="Overall Aggregate %" />
            <Line type="monotone" dataKey="math" stroke="var(--color-info-600)" strokeWidth={2} name="Top Subject %" />
            <Line type="monotone" dataKey="core" stroke="var(--color-success-600)" strokeWidth={2} name="Department Core %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Disciplinary & Suspension Record Section */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-5">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <div>
            <h3 className="text-base font-display font-semibold text-ink-900">Disciplinary & Suspension Status</h3>
            <p className="text-xs text-ink-400 mt-0.5">Official disciplinary standing and suspension records</p>
          </div>
        </div>

        {studentSuspensions.length === 0 ? (
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-900">Clean Conduct Record (Good Standing)</p>
              <p className="text-xs text-emerald-700">No active or historical suspension records on file for this student.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {studentSuspensions.map((susp) => (
              <div key={susp.id} className="p-4 bg-canvas rounded-lg border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      susp.status === 'Active' ? 'bg-rose-100 text-rose-700' : susp.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {susp.status} Suspension
                    </span>
                    <span className="text-xs font-bold text-ink-900">{susp.category}</span>
                  </div>
                  <p className="text-xs text-ink-600 font-medium">{susp.reason}</p>
                  {susp.action_taken && (
                    <p className="text-[11px] text-ink-400">Action: {susp.action_taken}</p>
                  )}
                </div>
                <div className="text-right text-xs">
                  <p className="text-ink-400 font-medium">Start: <strong className="text-ink-900">{susp.start_date}</strong></p>
                  {susp.end_date && <p className="text-ink-400 font-medium">End: <strong className="text-ink-900">{susp.end_date}</strong></p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


