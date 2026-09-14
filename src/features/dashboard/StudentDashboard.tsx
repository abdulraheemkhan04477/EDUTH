import { useState, useMemo } from 'react'
import { StatCard } from '../../components/ui'
import {
  CalendarCheck,
  Trophy,
  Flame,
  Medal,
  Clock,
  UserCheck,
  Award,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  HeartPulse,
  Users,
  IdCard,
  QrCode,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { UpcomingExamsList } from './widgets/UpcomingExamsList'
import { AttendanceWidget } from './widgets/AttendanceWidget'
import { FeeSummaryWidget } from './widgets/FeeSummaryWidget'
import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, isBranchMatch, isSemesterMatch } from '../../lib/academicStore'
import { useFeeStore, findMatchingFeeStructure, isPaymentForStudent, calculateInstallmentStatuses } from '../../lib/feeStore'
import { useExamStore } from '../../lib/examStore'

export function StudentDashboard() {
  const { user } = useAuth()
  const { students, allStudentsRaw, teachers, attendance, getStudentAttendancePercentage } = useAcademicStore()
  const { getStudentFeeDetail, structures, payments } = useFeeStore()
  const { exams: storeExams, getStudentPublishedResults } = useExamStore()
  const [showFullIdCard, setShowFullIdCard] = useState(true)

  const userEmailLower = user?.email?.toLowerCase().trim()
  const userStudentId = user?.student_id || user?.id

  // Combine scoped students with raw all-students list for maximum match fidelity
  const studentList = useMemo(() => {
    const combined = [...students]
    if (allStudentsRaw && Array.isArray(allStudentsRaw)) {
      allStudentsRaw.forEach((raw) => {
        if (!combined.some((s) => s.id === raw.id || (s.email && raw.email && s.email.toLowerCase() === raw.email.toLowerCase()))) {
          combined.push(raw)
        }
      })
    }
    return combined
  }, [students, allStudentsRaw])

  const fallbackStudent = useMemo(() => {
    return {
      id: user?.student_id || user?.id || 'stu_' + Date.now(),
      student_id: user?.student_id || 'STU-MEMBER',
      roll_no: (user as any)?.roll_no || (user?.email ? user.email.split('@')[0] : 'STU001'),
      name: user?.name || (user?.email ? user.email.split('@')[0] : 'Student'),
      course: (user as any)?.course || 'B.Tech',
      branch: (user as any)?.branch || 'ECE',
      year: (user as any)?.year || '1st Year',
      semester: (user as any)?.semester || 'Semester 1',
      section: (user as any)?.section || 'Section A',
      class_name: `${(user as any)?.course || 'B.Tech'} ${(user as any)?.branch || 'ECE'} - 1st Year - Section A`,
      email: user?.email || '',
      phone: (user as any)?.phone || '',
      dob: '',
      gender: 'Male',
      blood_group: 'O+',
      address: '',
      parent_name: '',
      parent_phone: '',
      parent_email: '',
      college_id: user?.college_id || user?.school_id || '',
    }
  }, [user])

  const currentStudent = useMemo(() => {
    if (studentList && studentList.length > 0) {
      const matched = studentList.find(
        (s) =>
          (user?.id && ((s as any).profile_id === user.id || s.id === user.id)) ||
          (userStudentId &&
            (s.id === userStudentId ||
              s.student_id === userStudentId ||
              s.roll_no === userStudentId ||
              `STU-${s.roll_no}` === userStudentId ||
              userStudentId.replace(/^STU-/i, '') === s.roll_no)) ||
          (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower)
      )

      if (matched) return matched
    }

    return fallbackStudent
  }, [studentList, userStudentId, userEmailLower, fallbackStudent])

  const attPct = getStudentAttendancePercentage(currentStudent.id)

  const studentFeeRecord = useMemo(() => {
    if (!currentStudent) return null
    const sId = currentStudent.id
    const sCustomId = currentStudent.student_id
    const sRollNo = currentStudent.roll_no
    const cleanRollNo = sRollNo ? sRollNo.replace(/^STU-/i, '') : ''

    const directRec = getStudentFeeDetail(sId) || getStudentFeeDetail(sCustomId) || getStudentFeeDetail(sRollNo) || getStudentFeeDetail(cleanRollNo)
    if (directRec) return directRec

    const matchingStruct = findMatchingFeeStructure(currentStudent, structures)

    const totalFee = matchingStruct ? Number(matchingStruct.total_amount) || 0 : 0
    const studentPayments = payments.filter((p) => {
      const isStatusMatch = !p.status || p.status.toLowerCase() === 'completed'
      if (!isStatusMatch) return false
      return isPaymentForStudent(p, currentStudent)
    })
    const rawPaid = studentPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    const paidAmount = totalFee > 0 ? Math.min(rawPaid, totalFee) : rawPaid
    const pendingAmount = totalFee > 0 ? Math.max(0, totalFee - paidAmount) : 0
    const status: 'paid' | 'partial' | 'due' = paidAmount >= totalFee && totalFee > 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'due'

    const calculatedInstallments = calculateInstallmentStatuses(
      matchingStruct?.installments || [],
      totalFee,
      paidAmount
    )

    return {
      id: `sf_${sId}`,
      student_id: sId,
      student_name: currentStudent.name,
      roll_no: currentStudent.roll_no,
      course: currentStudent.course,
      branch: currentStudent.branch,
      year_semester: currentStudent.year || currentStudent.semester || '1st Year',
      section: currentStudent.section || 'Section A',
      fee_structure_id: matchingStruct?.id || '',
      fee_structure_title: matchingStruct?.title || `${currentStudent.course} Fee Structure`,
      total_fee: totalFee,
      paid: paidAmount,
      pending: pendingAmount,
      status,
      installments: calculatedInstallments,
      components: matchingStruct?.components || [],
    }
  }, [currentStudent, getStudentFeeDetail, structures, payments])

  const recentPaymentRecord = useMemo(() => {
    if (!currentStudent) return null
    const sId = currentStudent.id
    const sCustomId = currentStudent.student_id
    const sRollNo = currentStudent.roll_no
    const cleanRollNo = sRollNo ? sRollNo.replace(/^STU-/i, '') : ''

    const studentPayments = payments.filter((p) => {
      const isStatusMatch = !p.status || p.status.toLowerCase() === 'completed'
      if (!isStatusMatch) return false
      return (
        p.student_id === sId ||
        p.student_id === sCustomId ||
        p.student_id === sRollNo ||
        ((currentStudent as any).profile_id && p.student_id === (currentStudent as any).profile_id) ||
        (sRollNo && p.roll_no === sRollNo) ||
        (cleanRollNo && p.roll_no === cleanRollNo)
      )
    })
    return studentPayments.length > 0 ? studentPayments[0] : null
  }, [payments, currentStudent])

  const studentFees = useMemo(() => {
    const totalFees = studentFeeRecord?.total_fee || 0
    const paid = studentFeeRecord?.paid || 0
    const pending = studentFeeRecord?.pending || Math.max(0, totalFees - paid)
    return {
      totalFees,
      paid,
      pending,
      recentPayment: recentPaymentRecord
        ? { amount: recentPaymentRecord.amount, date: recentPaymentRecord.payment_date }
        : paid > 0
        ? { amount: paid, date: 'Recent Payment' }
        : undefined,
    }
  }, [studentFeeRecord, recentPaymentRecord])

  const classTeachers = useMemo(() => {
    if (!teachers || teachers.length === 0) return []
    return teachers.filter((t) => {
      const matchCourse = (t.course || '').toLowerCase() === (currentStudent.course || '').toLowerCase()
      const matchBranch = !t.department || t.department === 'All' || isBranchMatch(t.department, currentStudent.branch)
      return matchCourse && matchBranch
    })
  }, [teachers, currentStudent])

  const liveStudentUpcomingExams = useMemo(() => {
    if (!storeExams || storeExams.length === 0) return []
    return storeExams.filter((ex) => {
      const matchCourse = !ex.course || ex.course === 'All' || (ex.course || '').toLowerCase() === (currentStudent.course || '').toLowerCase()
      const matchBranch = !ex.branch || ex.branch === 'All' || isBranchMatch(ex.branch, currentStudent.branch)
      const exSem = (ex as any).year_semester || ex.year || ex.semester
      const matchSem = !exSem || exSem === 'All' || isSemesterMatch(exSem, currentStudent.year || currentStudent.semester)
      return matchCourse && matchBranch && matchSem
    })
  }, [storeExams, currentStudent])

  const studentAttendance = useMemo(() => {
    const studentLogs = attendance.filter((a) => a.student_id === currentStudent.id || a.student_id === currentStudent.student_id)
    const presentCount = studentLogs.filter((a) => a.status === 'present' || (a.status as string) === 'Present').length
    const absentCount = studentLogs.filter((a) => a.status === 'absent' || (a.status as string) === 'Absent').length
    const leaveCount = studentLogs.filter((a) => a.status === 'leave' || (a.status as string) === 'Leave').length
    const totalDays = studentLogs.length || 100
    const calculatedPct = Math.round((presentCount / totalDays) * 100)
    return {
      percentage: calculatedPct > 0 ? calculatedPct : attPct,
      present: presentCount,
      absent: absentCount,
      late: leaveCount,
      total: totalDays,
      presentDays: presentCount,
      absentDays: absentCount,
      leaveDays: leaveCount,
      totalClasses: totalDays,
    }
  }, [attendance, currentStudent, attPct])

  const publishedExamResults = useMemo(() => {
    return getStudentPublishedResults(currentStudent.id)
  }, [getStudentPublishedResults, currentStudent])

  // Initials for avatar
  const initials = (currentStudent.name || 'Student')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-6">
      {/* STUDENT IDENTITY HERO CARD — Theme Aware */}
      <div className="relative overflow-hidden rounded-3xl bg-surface p-6 sm:p-8 shadow-[var(--shadow-soft)] border border-border/80">
        {/* Subtle Ambient Light Orbs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />

        {/* Top Bar: Verification Badge & Expand Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/60 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/80 text-emerald-600 border border-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Official Student Portal
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/80 text-indigo-600 border border-indigo-100">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
              Verified Profile
            </span>
          </div>

          <button
            onClick={() => setShowFullIdCard(!showFullIdCard)}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-ink-900 bg-canvas hover:bg-border/40 px-3 py-1.5 rounded-full transition-all border border-border/80"
          >
            <IdCard className="h-4 w-4 text-brand-600" />
            {showFullIdCard ? 'Hide Details' : 'View Full Identity Card'}
            {showFullIdCard ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Main Identity Banner Header */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Animated Ring */}
            <div className="relative group shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-lg ring-4 ring-purple-400/30">
                <div className="h-full w-full rounded-[14px] bg-surface flex items-center justify-center font-display text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-500">
                  {initials}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-surface">
                <Sparkles className="h-4 w-4 fill-current" />
              </div>
            </div>

            {/* Student Title & Badges */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-ink-900">
                  {currentStudent.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-brand-100 text-brand-700 border border-brand-500/20">
                  Sec {currentStudent.section || 'A'}
                </span>
              </div>

              <p className="text-sm font-medium text-ink-600 flex flex-wrap items-center gap-2">
                <GraduationCap className="h-4 w-4 text-brand-600 shrink-0" />
                <span>{currentStudent.course} — <strong className="text-ink-900">{currentStudent.branch}</strong></span>
                <span className="text-ink-400">•</span>
                <span>{currentStudent.year} ({currentStudent.semester})</span>
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="px-3 py-1 rounded-lg bg-canvas border border-border/80 text-xs font-mono font-medium text-ink-600">
                  Roll No: <span className="font-bold text-ink-900">{currentStudent.roll_no}</span>
                </div>
                <div className="px-3 py-1 rounded-lg bg-canvas border border-border/80 text-xs font-mono font-medium text-ink-600">
                  Student ID: <span className="font-bold text-ink-900">{currentStudent.student_id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right QR Token Box */}
          <div className="hidden lg:flex flex-col items-end justify-center p-4 rounded-2xl bg-canvas border border-border/80 shrink-0 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-ink-600">
              <QrCode className="h-4 w-4 text-brand-600" />
              <span>Campus Digital Pass</span>
            </div>
            <div className="text-[11px] font-mono text-ink-400 text-right">
              College ID: {currentStudent.college_id || 'COLLEGE-CAMPUS'}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active Enrollment Status
            </div>
          </div>
        </div>

        {/* EXPANDABLE FULL REAL DATA GRID */}
        {showFullIdCard && (
          <div className="mt-8 pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Email Card */}
            <div className="p-3.5 rounded-xl bg-canvas hover:bg-border/20 border border-border/60 transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-50/80 text-indigo-600 shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider">Email Address</p>
                <p className="text-xs font-semibold text-ink-900 truncate">{currentStudent.email || 'N/A'}</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="p-3.5 rounded-xl bg-canvas hover:bg-border/20 border border-border/60 transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50/80 text-emerald-600 shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider">Contact Phone</p>
                <p className="text-xs font-semibold text-ink-900 truncate">{currentStudent.phone || 'N/A'}</p>
              </div>
            </div>

            {/* DOB & Gender Card */}
            <div className="p-3.5 rounded-xl bg-canvas hover:bg-border/20 border border-border/60 transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-50/80 text-indigo-600 shrink-0">
                <CalendarIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider">DOB & Gender</p>
                <p className="text-xs font-semibold text-ink-900 truncate">
                  {currentStudent.dob || 'N/A'} ({currentStudent.gender || 'Other'})
                </p>
              </div>
            </div>

            {/* Blood Group Card */}
            <div className="p-3.5 rounded-xl bg-canvas hover:bg-border/20 border border-border/60 transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-50/80 text-rose-600 shrink-0">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider">Blood Group</p>
                <p className="text-xs font-semibold text-ink-900 truncate">{currentStudent.blood_group || 'N/A'}</p>
              </div>
            </div>

            {/* Guardian Info Card */}
            <div className="p-3.5 rounded-xl bg-canvas hover:bg-border/20 border border-border/60 transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50/80 text-amber-600 shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider">Guardian / Parent</p>
                <p className="text-xs font-semibold text-ink-900 truncate">
                  {currentStudent.parent_name || 'N/A'} {currentStudent.parent_phone ? `(${currentStudent.parent_phone})` : ''}
                </p>
              </div>
            </div>

            {/* Residential Address Card */}
            <div className="p-3.5 rounded-xl bg-canvas hover:bg-border/20 border border-border/60 transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50/80 text-blue-600 shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-ink-400 uppercase tracking-wider">Permanent Address</p>
                <p className="text-xs font-semibold text-ink-900 truncate">{currentStudent.address || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Attendance" value={`${attPct}%`} icon={CalendarCheck} tone="success" progressPercent={attPct} />
        <StatCard label="Academic Points" value="238" icon={Trophy} tone="brand" />
        <StatCard label="Streak Days" value="14" icon={Flame} tone="warning" />
        <StatCard label="Batch Rank" value="#12" icon={Medal} tone="info" />
      </div>

      {/* Class Teachers Widget */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5">
        <h3 className="text-base font-display font-semibold text-ink-900 mb-4 flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-brand-600" />
          Class & Department Teachers
        </h3>
        {classTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classTeachers.map((tch) => (
              <div key={tch.id} className="p-3 rounded-[var(--radius-btn)] border border-border bg-slate-50/50 flex items-center gap-3 hover:border-brand-300 transition-colors">
                <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {tch.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{tch.name}</p>
                  <p className="text-xs text-ink-500">Faculty ID: {tch.teacher_id || tch.id}</p>
                  <p className="text-xs text-brand-600 font-medium">{tch.position || 'Assistant Professor'} — {tch.department || tch.course}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-400">No specific class teachers assigned yet for section {currentStudent.section || 'A'}.</p>
        )}
      </div>

      {/* Row 2: Today's Timetable + Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Timetable */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5">
          <h3 className="text-base font-display font-semibold text-ink-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-600" />
            Today's Class Schedule ({currentStudent.branch})
          </h3>
          <div className="space-y-2">
            {['Engineering Mathematics — 08:00 AM', 'Digital Electronics — 09:00 AM', 'Signals & Systems — 10:00 AM', 'Communication Lab — 11:15 AM'].map((item, i) => (
              <div key={i} className="p-3 rounded-[var(--radius-btn)] border border-border/80 bg-slate-50/50 text-sm font-medium text-ink-600 flex items-center justify-between">
                <span>{item}</span>
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">Lecture</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <UpcomingExamsList exams={liveStudentUpcomingExams.length > 0 ? liveStudentUpcomingExams : undefined} showClass={false} viewAllHref="exams" />
      </div>

      {/* Row 3: Attendance Overview + My Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttendanceWidget
          data={studentAttendance}
          title="Attendance Summary"
          subtitle="Your overall attendance record this session"
        />
        <FeeSummaryWidget data={studentFees} title="My Fees Breakdown" viewAllHref="fees" />
      </div>

      {/* Published Exam Results / Scorecards */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-display font-semibold text-ink-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            Published Exam Scorecards
          </h3>
          <Link to="/exams" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {publishedExamResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {publishedExamResults.slice(0, 6).map((res: any) => (
              <div key={res.id} className="p-3 rounded-lg border border-border bg-canvas/40 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-ink-900">{res.subject}</p>
                  <p className="text-[11px] text-ink-500">
                    Marks: <span className="font-bold text-ink-900">{res.obtained_marks}/{res.max_marks}</span> ({res.percentage}%)
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded border border-indigo-200">
                    {res.grade}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${res.status === 'Pass' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                    {res.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-border/80 rounded-lg bg-canvas/30 text-ink-400 text-xs">
            No published examination scorecards yet. Official results will appear here as soon as they are published by faculty.
          </div>
        )}
      </div>
    </div>
  )
}
