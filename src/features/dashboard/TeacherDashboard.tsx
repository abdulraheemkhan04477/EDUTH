import { useMemo } from 'react'
import { StatCard } from '../../components/ui'
import { Users, ClipboardCheck, Clock, AlertCircle, CalendarCheck, FileText } from 'lucide-react'
import { AttendanceWidget } from './widgets/AttendanceWidget'
import { UpcomingExamsList } from './widgets/UpcomingExamsList'
import { PendingHomeworkList } from './widgets/PendingHomeworkList'
import { ClassPerformanceChart } from './widgets/ClassPerformanceChart'
import { CalendarWidget } from './widgets/CalendarWidget'
import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, getTeacherForUser } from '../../lib/academicStore'
import { useExamStore } from '../../lib/examStore'
import { assignmentStore } from '../../lib/assignmentStore'

export function TeacherDashboard() {
  const { user } = useAuth()
  const { teachers, classes, students, attendance, getClassAttendanceStats } = useAcademicStore()
  const { exams: storeExams, results: storeResults } = useExamStore()

  const currentTeacher = useMemo(() => {
    return getTeacherForUser(user, teachers, classes) || {
      id: user?.teacher_id || user?.id || 't1',
      teacher_id: user?.teacher_id || 'TCH-2026-0001',
      name: user?.name || user?.email?.split('@')[0] || 'Faculty Member',
      position: 'Assistant Professor',
      course: 'B.Tech',
      department: 'ECE',
      assigned_classes: [],
      email: user?.email || 'teacher@school.edu',
      phone: user?.phone || '',
      qualification: 'Higher Education Degree',
      college_id: user?.college_id || 'COL001',
    }
  }, [user, teachers, classes])

  // Resolve assigned classes strictly without department fallback
  const assignedClasses = useMemo(() => {
    if (!currentTeacher) return []
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
  }, [classes, currentTeacher])

  const assignedStudents = useMemo(() => {
    if (assignedClasses.length === 0) return []
    return students.filter((s) =>
      assignedClasses.some(
        (c) =>
          s.course === c.course &&
          s.branch === c.branch &&
          s.year === c.year &&
          (!c.section || c.section === 'All Sections' || s.section === c.section || c.name.includes(s.section))
      )
    )
  }, [students, assignedClasses])

  // ── Real Attendance Data ──
  const teacherAttendance = useMemo(() => {
    if (assignedClasses.length === 0 || assignedStudents.length === 0) {
      return { percentage: 0, present: 0, absent: 0, late: 0, total: 0 }
    }

    let totalPresent = 0
    let totalAbsent = 0
    let totalLate = 0
    let totalStudents = 0

    assignedClasses.forEach((cls) => {
      const stats = getClassAttendanceStats(cls)
      totalPresent += stats.present
      totalStudents += stats.total
    })

    // Also compute from individual attendance records for more detail
    const studentIds = new Set(assignedStudents.map((s) => s.id))
    const studentCustomIds = new Set(assignedStudents.filter((s) => s.student_id).map((s) => s.student_id))

    const relevantRecords = attendance.filter(
      (a) => studentIds.has(a.student_id) || studentCustomIds.has(a.student_id)
    )

    if (relevantRecords.length > 0) {
      totalPresent = relevantRecords.filter((r) => r.status === 'present').length
      totalAbsent = relevantRecords.filter((r) => r.status === 'absent').length
      totalLate = relevantRecords.filter((r) => r.status === 'late').length
      totalStudents = relevantRecords.length
    } else {
      // Fallback: absent = total - present
      totalAbsent = Math.max(0, totalStudents - totalPresent)
    }

    const percentage = totalStudents > 0
      ? Math.round(((totalPresent + totalLate) / totalStudents) * 100)
      : 0

    return { percentage, present: totalPresent, absent: totalAbsent, late: totalLate, total: totalStudents }
  }, [assignedClasses, assignedStudents, attendance, getClassAttendanceStats])

  // ── Real Upcoming Exams ──
  const liveTeacherUpcomingExams = useMemo(() => {
    if (assignedClasses.length === 0) return []
    return storeExams
      .filter((e) => {
        if (e.status === 'Completed' || e.status === 'completed') return false
        return assignedClasses.some(
          (c) =>
            e.course === c.course &&
            (!e.branch || e.branch === 'All Branches / Common' || e.branch === c.branch)
        )
      })
      .map((e) => ({
        id: e.id,
        title: e.title,
        subject: e.subject || e.type || 'Examination',
        class_name: `${e.course} ${e.branch || ''}`,
        date: e.date,
        time: e.start_time || '09:30 AM',
        status: e.status || 'Scheduled',
      }))
  }, [storeExams, assignedClasses])

  // ── Real Pending Assignments ──
  const teacherAssignments = useMemo(() => {
    if (assignedClasses.length === 0) return []
    const classNames = assignedClasses.map((c) => c.name)
    return assignmentStore.getTeacherAssignments(classNames, currentTeacher.teacher_id, classes)
  }, [assignedClasses, currentTeacher, classes])

  const pendingAssignments = useMemo(() => {
    return teacherAssignments.filter((a) => a.status !== 'completed')
  }, [teacherAssignments])

  const pendingHomeworkItems = useMemo(() => {
    return pendingAssignments.map((a) => ({
      id: a.id,
      subject: a.subject || 'General',
      title: a.title,
      due_date: a.due_date,
      status: a.status as 'active' | 'overdue' | 'submitted',
    }))
  }, [pendingAssignments])

  // ── Class Performance Data (from exam results) ──
  const classPerformanceData = useMemo(() => {
    if (assignedClasses.length === 0 || storeResults.length === 0) return []

    return assignedClasses.map((cls) => {
      // Find results for students in this class
      const classStudents = students.filter(
        (s) =>
          s.course === cls.course &&
          s.branch === cls.branch &&
          s.year === cls.year &&
          (!cls.section || cls.section === 'All Sections' || s.section === cls.section || cls.name.includes(s.section))
      )
      const studentIds = new Set(classStudents.map((s) => s.id))
      const studentRolls = new Set(classStudents.filter((s) => s.roll_no).map((s) => s.roll_no))

      const classResults = storeResults.filter(
        (r) => studentIds.has(r.student_id) || studentRolls.has(r.roll_no)
      )

      const avg = classResults.length > 0
        ? Math.round(classResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / classResults.length)
        : 0

      // Shorten the class name for chart display
      const shortName = cls.section
        ? `${cls.branch} ${cls.year?.replace(/\s*Year/i, 'Y')} ${cls.section.replace('Section ', '')}`
        : `${cls.branch} ${cls.year?.replace(/\s*Year/i, 'Y')}`

      return { class_name: shortName, average: avg }
    }).filter((d) => d.average > 0) // Only show classes with actual result data
  }, [assignedClasses, storeResults, students])

  // ── Today's Schedule ──
  const todaysPeriods = useMemo(() => {
    if (assignedClasses.length === 0) return []
    const times = ['09:00 AM — 10:00 AM', '10:15 AM — 11:15 AM', '11:30 AM — 12:30 PM', '02:00 PM — 03:00 PM']
    return assignedClasses.slice(0, 4).map((c, i) => ({
      time: times[i % times.length],
      class_name: c.name,
      subject: `${c.branch} Theory & Practical (${c.semester})`,
    }))
  }, [assignedClasses])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-400 mt-1">Welcome back, <span className="font-semibold text-brand-600">{currentTeacher.name}</span>! ({currentTeacher.position} — {currentTeacher.department})</p>
      </div>

      {assignedClasses.length === 0 && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-[var(--radius-card)] text-amber-700 dark:text-amber-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">No assigned classes found</p>
            <p className="text-xs opacity-90">Your dashboard will populate once classes are assigned to your profile. Contact administration if this is incorrect.</p>
          </div>
        </div>
      )}

      {/* Row 1: Stat Cards — 4-column grid matching Admin Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Students"
          value={assignedStudents.length.toLocaleString()}
          icon={Users}
          tone="brand"
          progressPercent={assignedStudents.length > 0 ? 100 : 0}
        />
        <StatCard
          label="Attendance"
          value={`${teacherAttendance.percentage}%`}
          icon={CalendarCheck}
          tone="success"
          progressPercent={teacherAttendance.percentage}
          caption={teacherAttendance.total > 0 ? `${teacherAttendance.present + teacherAttendance.late} of ${teacherAttendance.total} records` : 'No records yet'}
        />
        <StatCard
          label="Upcoming Exams"
          value={liveTeacherUpcomingExams.length.toString()}
          icon={ClipboardCheck}
          tone="info"
        />
        <StatCard
          label="Pending Assignments"
          value={pendingAssignments.length.toString()}
          icon={FileText}
          tone="warning"
        />
      </div>

      {/* Row 2: Attendance Overview + Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AttendanceWidget
          data={teacherAttendance}
          title="Attendance Overview"
          subtitle="Attendance across your assigned teaching sections"
        />
        <UpcomingExamsList exams={liveTeacherUpcomingExams.length > 0 ? liveTeacherUpcomingExams : undefined} viewAllHref="exams" />
      </div>

      {/* Row 3: Pending Assignments + College Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <PendingHomeworkList
          homework={pendingHomeworkItems.length > 0 ? pendingHomeworkItems : undefined}
          viewAllHref="assignments"
        />
        <CalendarWidget />
      </div>

      {/* Row 4: Class Performance + Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClassPerformanceChart
          data={classPerformanceData.length > 0 ? classPerformanceData : undefined}
        />

        {/* Today's Classes */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5">
          <h3 className="text-base font-display font-semibold text-ink-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-600" />
            Today's Class Schedule
          </h3>
          {todaysPeriods.length === 0 ? (
            <p className="text-sm text-ink-400 text-center py-8">No classes scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {todaysPeriods.map((period, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-4 p-3 rounded-[var(--radius-btn)] border border-border hover:bg-canvas transition-colors">
                  <div className="text-xs sm:text-sm text-ink-400 font-medium sm:w-44 shrink-0 font-mono">{period.time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{period.subject}</p>
                    <p className="text-xs text-ink-400 truncate">{period.class_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
