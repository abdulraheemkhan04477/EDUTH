import { useState, useMemo } from 'react'
import {
  Tabs,
  Button,
  DataTable,
  StatusPill,
  Select,
  AvatarInitials,
} from '../../components/ui'
import { ProgressRing } from '../../components/ui/ProgressRing'
import {
  Download,
  Printer,
  Award,
  FileSpreadsheet,
  CreditCard,
} from 'lucide-react'
import { formatCurrency } from '../../lib/formatCurrency'
import { exportToCSV, exportToPDF } from '../../lib/exportUtils'

// Monthly Breakdown for Attendance
const monthlyAttendanceLedger = [
  { month: 'January 2026', total_days: 22, present: 21, absent: 1, leave: 0, percentage: '95.4%' },
  { month: 'February 2026', total_days: 20, present: 19, absent: 1, leave: 0, percentage: '95.0%' },
  { month: 'March 2026', total_days: 23, present: 22, absent: 0, leave: 1, percentage: '95.6%' },
  { month: 'April 2026', total_days: 21, present: 19, absent: 2, leave: 0, percentage: '90.4%' },
  { month: 'May 2026', total_days: 18, present: 17, absent: 1, leave: 0, percentage: '94.4%' },
]

import { useAcademicStore } from '../../lib/academicStore'
import { useExamStore } from '../../lib/examStore'
import { useFeeStore } from '../../lib/feeStore'

import { useAuth } from '../../app/providers/AuthProvider'

export function ReportCardPage() {
  const { user, role } = useAuth()
  const { students, getStudentAttendancePercentage, getAttendance } = useAcademicStore()
  const { getStudentPublishedResults } = useExamStore()
  const { studentFees } = useFeeStore()

  const isStudentOrParent = role === 'student' || role === 'parent'
  const defaultStudentId = role === 'parent' ? user?.child_student_id : (user?.student_id || user?.id)

  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudentId || '')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedExam, setSelectedExam] = useState('Mid-Term Examination 2026')

  const activeId = isStudentOrParent ? defaultStudentId : selectedStudentId
  const userEmailLower = user?.email?.toLowerCase().trim()
  const currentStudentObj = useMemo(() => {
    if (students && students.length > 0) {
      const matched = students.find(
        (s) =>
          (activeId &&
            (s.id === activeId ||
              s.student_id === activeId ||
              s.roll_no === activeId ||
              `STU-${s.roll_no}` === activeId ||
              activeId.replace(/^STU-/i, '') === s.roll_no)) ||
          (userEmailLower && (s.email?.toLowerCase().trim() === userEmailLower || s.parent_email?.toLowerCase().trim() === userEmailLower))
      )
      if (matched) return matched
    }
    return null
  }, [students, activeId, userEmailLower])

  const currentStudent = currentStudentObj
    ? {
        id: currentStudentObj.student_id,
        internal_id: currentStudentObj.id,
        name: currentStudentObj.name,
        class_name: currentStudentObj.class_name,
        roll_no: currentStudentObj.roll_no,
        academic_year: '2025-2026',
      }
    : {
        id: defaultStudentId || 'STU-MEMBER',
        internal_id: defaultStudentId || 'stu_user',
        name: user?.name || (user?.email ? user.email.split('@')[0] : 'Student'),
        class_name: 'B.Tech ECE - 1st Year - Section A',
        roll_no: (user as any)?.roll_no || 'STU001',
        academic_year: '2025-2026',
      }

  // Results for student
  const publishedResults = getStudentPublishedResults(
    currentStudentObj?.id || user?.id || user?.student_id || user?.child_student_id || selectedStudentId || '',
    currentStudentObj?.roll_no || (user as any)?.roll_no,
    currentStudentObj?.student_id || user?.student_id || user?.child_student_id,
    currentStudentObj?.email || user?.email
  )
  const currentExamSubjects = publishedResults.map((r) => ({
    subject: r.subject,
    max_marks: r.max_marks,
    obtained_marks: r.obtained_marks,
    grade: r.grade,
    status: r.status,
  }))

  // Attendance
  const studentAttRecords = getAttendance().filter(
    (a) =>
      a.student_id === currentStudentObj?.id ||
      (currentStudentObj?.student_id && a.student_id === currentStudentObj.student_id) ||
      (currentStudentObj?.roll_no && a.roll_no === currentStudentObj.roll_no)
  )
  const totalAttCount = studentAttRecords.length
  const presentAttCount = studentAttRecords.filter((a) => a.status === 'present' || a.status === 'late').length
  const absentAttCount = studentAttRecords.filter((a) => a.status === 'absent').length
  const leaveAttCount = studentAttRecords.filter((a) => a.status === 'leave').length

  const attPct = getStudentAttendancePercentage(currentStudentObj?.id || '')
  const currentAttendance = {
    working_days: totalAttCount || 200,
    present: presentAttCount || Math.round((attPct / 100) * 200),
    absent: absentAttCount || (200 - Math.round((attPct / 100) * 200)),
    leave: leaveAttCount || 0,
  }

  // Finance
  const sfRecord = studentFees.find(
    (sf) =>
      sf.student_id === currentStudentObj?.id ||
      sf.student_id === currentStudentObj?.student_id ||
      sf.roll_no === currentStudentObj?.roll_no ||
      sf.student_id === defaultStudentId ||
      sf.roll_no === (defaultStudentId ? defaultStudentId.replace(/^STU-/i, '') : '')
  )
  const currentFinance = sfRecord
    ? [
        { category: `${sfRecord.course} Annual Academic Tuition Fee`, fee_amount: sfRecord.total_fee, paid: sfRecord.paid, pending: sfRecord.pending, status: sfRecord.status, due_date: '2026-09-15' }
      ]
    : [
        { category: 'Tuition Fee', fee_amount: 0, paid: 0, pending: 0, status: 'due' as const, due_date: '2026-09-15' }
      ]

  const totalObtainedMarks = currentExamSubjects.reduce((sum, s) => sum + (s.obtained_marks || 0), 0)
  const totalMaxMarks = currentExamSubjects.reduce((sum, s) => sum + (s.max_marks || 0), 0)
  const overallPercentage = totalMaxMarks > 0 ? Math.round((totalObtainedMarks / totalMaxMarks) * 100) : 0
  const overallGrade = currentExamSubjects.length === 0 ? '-' : (overallPercentage >= 90 ? 'A+' : overallPercentage >= 80 ? 'A' : overallPercentage >= 70 ? 'B' : 'C')

  const attendancePercentage = Math.round((currentAttendance.present / currentAttendance.working_days) * 100)
  const totalFeeDue = currentFinance.reduce((sum, f) => sum + f.fee_amount, 0)
  const totalFeePaid = currentFinance.reduce((sum, f) => sum + f.paid, 0)
  const totalFeePending = currentFinance.reduce((sum, f) => sum + f.pending, 0)

  // Internal Navigation Tabs
  const reportCardTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'exam-result', label: 'Exam Result' },
    { id: 'finance', label: 'Finance' },
  ]

  // Export Handlers
  const handleExportOverviewCSV = () => {
    const data = currentExamSubjects.map((s) => ({
      Student: currentStudent.name,
      RollNo: currentStudent.roll_no,
      Class: currentStudent.class_name,
      Subject: s.subject,
      ObtainedMarks: s.obtained_marks,
      MaxMarks: s.max_marks,
      Grade: s.grade,
      Result: s.status,
    }))
    exportToCSV(`report_card_overview_${currentStudent.id}`, data)
  }

  const handleExportFullReportCard = () => {
    const title = `Official Student Report Card — ${currentStudent.name}`
    const subtitle = `Class: ${currentStudent.class_name} | Roll No: ${currentStudent.roll_no} | Academic Year: ${currentStudent.academic_year}`
    const columns = [
      { key: 'subject', header: 'Subject' },
      { key: 'obtained_marks', header: 'Marks Obtained' },
      { key: 'max_marks', header: 'Max Marks' },
      { key: 'grade', header: 'Grade' },
      { key: 'status', header: 'Status' },
    ]
    exportToPDF(title, subtitle, columns, currentExamSubjects)
  }

  const handleExportAttendanceCSV = () => {
    exportToCSV(`attendance_report_${currentStudent.id}`, monthlyAttendanceLedger)
  }

  const handleExportExamResultCSV = () => {
    exportToCSV(`exam_result_${currentStudent.id}`, currentExamSubjects)
  }

  const handleExportFinanceCSV = () => {
    exportToCSV(`finance_report_${currentStudent.id}`, currentFinance)
  }

  return (
    <div className="space-y-6">
      {/* Header & Student Switcher Bar */}
      <div className="bg-surface border border-border/80 rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-soft)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <AvatarInitials name={currentStudent.name} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-bold text-ink-900">{currentStudent.name}</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                {currentStudent.roll_no}
              </span>
            </div>
            <p className="text-xs text-ink-400 mt-0.5">
              {currentStudent.class_name} · Academic Year {currentStudent.academic_year} · ID: {currentStudent.id}
            </p>
          </div>
        </div>

        {!isStudentOrParent && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-ink-400 shrink-0">Select Student:</label>
            <Select
              options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.branch})` }))}
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-56"
            />
          </div>
        )}
      </div>

      {/* Internal Navigation Sub-Tabs (Following FeesPage Pattern) */}
      <Tabs tabs={reportCardTabs} activeId={activeTab} onChange={setActiveTab} className="border-b border-border" />

      {/* ==================== 1. OVERVIEW TAB ==================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Actions & Full Report Export Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-display font-bold text-ink-900">Academic Overview</h2>
              <p className="text-xs text-ink-400">Consolidated performance snapshot across all departments.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleExportOverviewCSV} className="gap-1.5">
                <FileSpreadsheet className="h-4 w-4" /> Export CSV
              </Button>
              <Button size="sm" onClick={handleExportFullReportCard} className="gap-2 bg-brand-600 hover:bg-brand-700">
                <Printer className="h-4 w-4" /> Export Full Report Card
              </Button>
            </div>
          </div>

          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Academic Performance */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400">ACADEMIC SCORE</p>
                  <p className="text-3xl font-display font-bold text-ink-900 mt-1">{overallPercentage}%</p>
                </div>
                <ProgressRing percent={overallPercentage} size={48} strokeWidth={4} color="#4F46E5" />
              </div>
              <p className="text-xs font-medium text-indigo-600 mt-3">Grade: {overallGrade} · Rank #3 in Class</p>
            </div>

            {/* Attendance Rate */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400">ATTENDANCE RATE</p>
                  <p className="text-3xl font-display font-bold text-ink-900 mt-1">{attendancePercentage}%</p>
                </div>
                <ProgressRing percent={attendancePercentage} size={48} strokeWidth={4} color="#10B981" />
              </div>
              <p className="text-xs font-medium text-emerald-600 mt-3">{currentAttendance.present} of {currentAttendance.working_days} Days Present</p>
            </div>

            {/* Total Marks */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400">TOTAL MARKS</p>
                  <p className="text-3xl font-display font-bold text-ink-900 mt-1">{totalObtainedMarks}</p>
                </div>
                <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs font-medium text-ink-400 mt-3">Out of {totalMaxMarks} Max Marks</p>
            </div>

            {/* Fee Status */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400">FEE STATUS</p>
                  <p className="text-2xl font-display font-bold text-ink-900 mt-1">
                    {totalFeePending === 0 ? 'CLEAR' : formatCurrency(totalFeePending)}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${totalFeePending === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
              <p className={`text-xs font-semibold mt-3 ${totalFeePending === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalFeePending === 0 ? 'All Tuition Fees Paid' : 'Pending Dues Remaining'}
              </p>
            </div>
          </div>

          {/* Subject Performance Breakdown Table */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="p-4 border-b border-border/80 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-base font-display font-semibold text-ink-900">Subject Breakdown Overview</h3>
              <span className="text-xs text-ink-400">Mid-Term Examination 2026</span>
            </div>

            <DataTable
              columns={[
                { key: 'subject', header: 'SUBJECT', render: (r) => <span className="font-semibold text-ink-900">{r.subject}</span> },
                { key: 'obtained_marks', header: 'OBTAINED MARKS', render: (r) => `${r.obtained_marks} / ${r.max_marks}` },
                {
                  key: 'pct',
                  header: 'PERCENTAGE',
                  render: (r) => {
                    const pct = Math.round((r.obtained_marks / r.max_marks) * 100)
                    return (
                      <div className="flex items-center gap-2">
                        <ProgressRing percent={pct} size={22} strokeWidth={2.5} color="#4F46E5" />
                        <span className="text-sm font-semibold text-ink-900">{pct}%</span>
                      </div>
                    )
                  },
                },
                { key: 'grade', header: 'GRADE', render: (r) => <span className="font-bold text-indigo-600">{r.grade}</span> },
                { key: 'status', header: 'RESULT', render: (r) => <StatusPill status={r.status === 'Pass' ? 'success' : 'danger'} label={r.status} /> },
              ]}
              rows={currentExamSubjects}
              keyExtractor={(r) => r.subject}
            />
          </div>
        </div>
      )}

      {/* ==================== 2. ATTENDANCE TAB ==================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-ink-900">Attendance Report</h2>
              <p className="text-xs text-ink-400">Detailed breakdown of student attendance metrics and monthly log.</p>
            </div>
            <Button size="sm" onClick={handleExportAttendanceCSV} className="gap-2 bg-brand-600 hover:bg-brand-700">
              <Download className="h-4 w-4" /> Export Attendance Report
            </Button>
          </div>

          {/* Attendance Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400">TOTAL WORKING DAYS</p>
              <p className="text-3xl font-display font-bold text-ink-900 mt-2">{currentAttendance.working_days} Days</p>
              <p className="text-xs text-ink-400 mt-2">Academic Term 2025-2026</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">PRESENT DAYS</p>
              <p className="text-3xl font-display font-bold text-emerald-600 mt-2">{currentAttendance.present} Days</p>
              <p className="text-xs text-emerald-700 font-semibold mt-2">{attendancePercentage}% Attendance Rate</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-rose-600">ABSENT DAYS</p>
              <p className="text-3xl font-display font-bold text-rose-600 mt-2">{currentAttendance.absent} Days</p>
              <p className="text-xs text-rose-700 font-semibold mt-2">Unexcused absences</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-amber-600">LEAVE DAYS</p>
              <p className="text-3xl font-display font-bold text-amber-600 mt-2">{currentAttendance.leave} Days</p>
              <p className="text-xs text-amber-700 font-semibold mt-2">Approved medical/personnel leave</p>
            </div>
          </div>

          {/* Monthly Attendance Table */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="p-4 border-b border-border/80 bg-slate-50/50">
              <h3 className="text-base font-display font-semibold text-ink-900">Monthly Attendance Log</h3>
            </div>
            <DataTable
              columns={[
                { key: 'month', header: 'MONTH', render: (r) => <span className="font-semibold text-ink-900">{r.month}</span> },
                { key: 'total_days', header: 'TOTAL DAYS', render: (r) => r.total_days },
                { key: 'present', header: 'PRESENT', render: (r) => <span className="text-emerald-600 font-semibold">{r.present}</span> },
                { key: 'absent', header: 'ABSENT', render: (r) => <span className="text-rose-600 font-semibold">{r.absent}</span> },
                { key: 'leave', header: 'LEAVE', render: (r) => <span className="text-amber-600 font-semibold">{r.leave}</span> },
                { key: 'percentage', header: 'ATTENDANCE RATE', render: (r) => <StatusPill status="success" label={r.percentage} /> },
              ]}
              rows={monthlyAttendanceLedger}
              keyExtractor={(r) => r.month}
            />
          </div>
        </div>
      )}

      {/* ==================== 3. EXAM RESULT TAB ==================== */}
      {activeTab === 'exam-result' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-display font-bold text-ink-900">Examination Results</h2>
              <p className="text-xs text-ink-400">Subject-wise marks, percentages, and performance metrics.</p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                options={[
                  { value: 'Mid-Term Examination 2026', label: 'Mid-Term Examination 2026' },
                  { value: 'Unit Test 2', label: 'Unit Test 2' },
                  { value: 'Annual Exam 2025', label: 'Annual Exam 2025' },
                ]}
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-56"
              />
              <Button size="sm" onClick={handleExportExamResultCSV} className="gap-2 bg-brand-600 hover:bg-brand-700 shrink-0">
                <Download className="h-4 w-4" /> Export Exam Result
              </Button>
            </div>
          </div>

          {/* Exam Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400">TOTAL MARKS OBTAINED</p>
              <p className="text-3xl font-display font-bold text-ink-900 mt-2">{totalObtainedMarks} / {totalMaxMarks}</p>
              <p className="text-xs text-indigo-600 font-semibold mt-2">{overallPercentage}% Overall Aggregate</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400">OVERALL GRADE</p>
              <p className="text-3xl font-display font-bold text-indigo-600 mt-2">{overallGrade}</p>
              <p className="text-xs text-emerald-600 font-semibold mt-2">Distinction Standard</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400">EXAM RESULT STATUS</p>
              <div className="mt-2">
                <StatusPill status="success" label="PASSED — PROMOTED" />
              </div>
              <p className="text-xs text-ink-400 mt-3">Cleared all subject benchmarks</p>
            </div>
          </div>

          {/* Detailed Exam Marks Table */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="p-4 border-b border-border/80 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-base font-display font-semibold text-ink-900">{selectedExam} Score Card</h3>
            </div>
            <DataTable
              columns={[
                { key: 'subject', header: 'SUBJECT', render: (r) => <span className="font-semibold text-ink-900">{r.subject}</span> },
                { key: 'max_marks', header: 'MAX MARKS', render: (r) => r.max_marks },
                { key: 'obtained_marks', header: 'OBTAINED MARKS', render: (r) => <span className="font-bold text-ink-900">{r.obtained_marks}</span> },
                {
                  key: 'pct',
                  header: 'PERCENTAGE',
                  render: (r) => {
                    const pct = Math.round((r.obtained_marks / r.max_marks) * 100)
                    return <span className="font-semibold text-indigo-600">{pct}%</span>
                  },
                },
                { key: 'grade', header: 'GRADE', render: (r) => <span className="font-bold text-ink-900">{r.grade}</span> },
                { key: 'status', header: 'STATUS', render: (r) => <StatusPill status={r.status === 'Pass' ? 'success' : 'danger'} label={r.status} /> },
              ]}
              rows={currentExamSubjects}
              keyExtractor={(r) => r.subject}
            />
          </div>
        </div>
      )}

      {/* ==================== 4. FINANCE TAB ==================== */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-ink-900">Student Financial Summary</h2>
              <p className="text-xs text-ink-400">Itemized fee structures, payments, and balance ledger.</p>
            </div>
            <Button size="sm" onClick={handleExportFinanceCSV} className="gap-2 bg-brand-600 hover:bg-brand-700">
              <Download className="h-4 w-4" /> Export Finance Report
            </Button>
          </div>

          {/* Financial Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-ink-400">TOTAL ACADEMIC FEES</p>
              <p className="text-3xl font-display font-bold text-ink-900 mt-2">{formatCurrency(totalFeeDue)}</p>
              <p className="text-xs text-ink-400 mt-2">Academic Year {currentStudent.academic_year}</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">AMOUNT PAID</p>
              <p className="text-3xl font-display font-bold text-emerald-600 mt-2">{formatCurrency(totalFeePaid)}</p>
              <p className="text-xs text-emerald-700 font-semibold mt-2">Verified Collection Receipts</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 p-5 shadow-[var(--shadow-soft)]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-amber-600">PENDING BALANCE</p>
              <p className="text-3xl font-display font-bold text-amber-600 mt-2">{formatCurrency(totalFeePending)}</p>
              <p className="text-xs text-amber-700 font-semibold mt-2">
                {totalFeePending === 0 ? 'No outstanding dues' : 'Payment required before end of term'}
              </p>
            </div>
          </div>

          {/* Itemized Fee Ledger */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="p-4 border-b border-border/80 bg-slate-50/50">
              <h3 className="text-base font-display font-semibold text-ink-900">Student Fee Ledger</h3>
            </div>
            <DataTable
              columns={[
                { key: 'category', header: 'FEE HEAD / CATEGORY', render: (r) => <span className="font-semibold text-ink-900">{r.category}</span> },
                { key: 'due_date', header: 'DUE DATE', render: (r) => r.due_date },
                { key: 'fee_amount', header: 'AMOUNT', render: (r) => formatCurrency(r.fee_amount) },
                { key: 'paid', header: 'PAID', render: (r) => <span className="text-emerald-600 font-semibold">{formatCurrency(r.paid)}</span> },
                { key: 'pending', header: 'PENDING', render: (r) => <span className="text-amber-600 font-semibold">{formatCurrency(r.pending)}</span> },
                { key: 'status', header: 'STATUS', render: (r) => <StatusPill status={r.status === 'paid' ? 'success' : r.status === 'partial' ? 'warning' : 'danger'} label={r.status.toUpperCase()} /> },
              ]}
              rows={currentFinance}
              keyExtractor={(r) => r.category}
            />
          </div>
        </div>
      )}
    </div>
  )
}
