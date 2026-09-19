import { useState, useMemo, useEffect } from 'react'
import { StatCard, NoticeCard, ChildSwitcher } from '../../components/ui'
import { CalendarCheck, IndianRupee, Award } from 'lucide-react'
import { formatCurrency } from '../../lib/formatCurrency'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AcademicProgressWidget } from './widgets/AcademicProgressWidget'
import { RecentExamResultWidget } from './widgets/RecentExamResultWidget'
import { FeeSummaryWidget } from './widgets/FeeSummaryWidget'
import { UpcomingExamsList } from './widgets/UpcomingExamsList'
import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, isBranchMatch, isSemesterMatch } from '../../lib/academicStore'
import { useFeeStore, findMatchingFeeStructure, isPaymentForStudent, calculateInstallmentStatuses } from '../../lib/feeStore'
import { useNoticeStore } from '../../lib/noticeStore'
import { useExamStore, resolveSubjectName, fetchStudentPublishedResultsFromSupabase } from '../../lib/examStore'

const attendanceTrend = [
  { week: 'W1', percentage: 100 }, { week: 'W2', percentage: 80 },
  { week: 'W3', percentage: 100 }, { week: 'W4', percentage: 60 },
  { week: 'W5', percentage: 100 }, { week: 'W6', percentage: 100 },
]

export function ParentDashboard() {
  const { user } = useAuth()
  const { students, getStudentAttendancePercentage } = useAcademicStore()
  const { getStudentFeeDetail, structures, payments } = useFeeStore()
  const { getNoticesForStudent } = useNoticeStore()
  const { getStudentPublishedResults, exams: storeExams } = useExamStore()

  const targetChildId = user?.child_student_id || user?.student_id
  const userEmailLower = user?.email?.toLowerCase().trim()
  const targetRollNo = targetChildId ? targetChildId.replace(/^STU-/i, '') : ''
  const isMBA = targetRollNo.includes('MB') || (targetChildId && targetChildId.includes('MB'))

  const fallbackChild = useMemo(() => {
    return {
      id: targetChildId || (user as any)?.child_student_id || 'child_' + Date.now(),
      student_id: targetChildId || (user as any)?.child_student_id || 'STU-CHILD',
      roll_no: targetRollNo || (user as any)?.child_roll_no || 'STU001',
      name: user?.name ? (user.name.toLowerCase().includes('parent') ? user.name.replace(/parent/i, 'Child').trim() : `${user.name}'s Child`) : 'Student',
      course: isMBA ? 'MBA' : 'B.Tech',
      branch: isMBA ? 'Finance' : 'ECE',
      year: '1st Year',
      semester: 'Semester 1',
      section: 'Section A',
      class_name: isMBA ? 'MBA Finance - 1st Year - Section A' : 'B.Tech ECE - 1st Year - Section A',
      email: '',
      phone: '',
      dob: '',
      gender: 'Male',
      blood_group: 'O+',
      address: '',
      parent_name: user?.name || 'Parent',
      parent_phone: '',
      parent_email: user?.email || '',
      college_id: user?.college_id || user?.school_id || '',
    }
  }, [targetChildId, targetRollNo, isMBA, user])

  const childStudent = useMemo(() => {
    if (students && students.length > 0) {
      const matched = students.find(
        (s) =>
          (targetChildId &&
            (s.id === targetChildId ||
              s.profile_id === targetChildId ||
              s.student_id === targetChildId ||
              s.roll_no === targetChildId ||
              `STU-${s.roll_no}` === targetChildId ||
              targetChildId.replace(/^STU-/i, '') === s.roll_no)) ||
          (userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower) ||
          (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower)
      )
      if (matched) return matched
    }
    return fallbackChild
  }, [students, targetChildId, userEmailLower, fallbackChild])

  const attPct = getStudentAttendancePercentage(childStudent.id)

  const childFeeRecord = useMemo(() => {
    if (!childStudent) return null
    const cId = childStudent.id
    const cCustomId = childStudent.student_id
    const cRollNo = childStudent.roll_no
    const cleanRollNo = cRollNo ? cRollNo.replace(/^STU-/i, '') : ''

    const directRec = getStudentFeeDetail(cId) || getStudentFeeDetail(cCustomId) || getStudentFeeDetail(cRollNo) || getStudentFeeDetail(cleanRollNo)
    if (directRec) return directRec

    const matchingStruct = findMatchingFeeStructure(childStudent, structures)

    const totalFee = matchingStruct ? Number(matchingStruct.total_amount) || 0 : 0
    const childPayments = payments.filter((p) => {
      const isStatusMatch = !p.status || p.status.toLowerCase() === 'completed'
      if (!isStatusMatch) return false
      return isPaymentForStudent(p, childStudent)
    })
    const rawPaid = childPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    const paidAmount = totalFee > 0 ? Math.min(rawPaid, totalFee) : rawPaid
    const pendingAmount = totalFee > 0 ? Math.max(0, totalFee - paidAmount) : 0
    const status: 'paid' | 'partial' | 'due' = paidAmount >= totalFee && totalFee > 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'due'

    const calculatedInstallments = calculateInstallmentStatuses(
      matchingStruct?.installments || [],
      totalFee,
      paidAmount
    )

    return {
      id: `sf_${cId}`,
      student_id: cId,
      student_name: childStudent.name,
      roll_no: childStudent.roll_no,
      course: childStudent.course,
      branch: childStudent.branch,
      year_semester: childStudent.year || childStudent.semester || '1st Year',
      section: childStudent.section || 'Section A',
      fee_structure_id: matchingStruct?.id || '',
      fee_structure_title: matchingStruct?.title || `${childStudent.course} Fee Structure`,
      total_fee: totalFee,
      paid: paidAmount,
      pending: pendingAmount,
      status,
      installments: calculatedInstallments,
      components: matchingStruct?.components || [],
    }
  }, [childStudent, getStudentFeeDetail, structures, payments])

  const recentChildPaymentRecord = useMemo(() => {
    if (!childStudent) return null
    const cId = childStudent.id
    const cCustomId = childStudent.student_id
    const cRollNo = childStudent.roll_no
    const cleanRollNo = cRollNo ? cRollNo.replace(/^STU-/i, '') : ''

    const childPayments = payments.filter((p) => {
      const isStatusMatch = !p.status || p.status.toLowerCase() === 'completed'
      if (!isStatusMatch) return false
      return (
        p.student_id === cId ||
        p.student_id === cCustomId ||
        p.student_id === cRollNo ||
        ((childStudent as any).profile_id && p.student_id === (childStudent as any).profile_id) ||
        (cRollNo && p.roll_no === cRollNo) ||
        (cleanRollNo && p.roll_no === cleanRollNo)
      )
    })
    return childPayments.length > 0 ? childPayments[0] : null
  }, [payments, childStudent])

  const childFees = useMemo(() => {
    const totalFees = childFeeRecord?.total_fee || 0
    const paid = childFeeRecord?.paid || 0
    const pending = childFeeRecord?.pending || Math.max(0, totalFees - paid)
    return {
      totalFees,
      paid,
      pending,
      recentPayment: recentChildPaymentRecord
        ? { amount: recentChildPaymentRecord.amount, date: recentChildPaymentRecord.payment_date }
        : paid > 0
        ? { amount: paid, date: 'Recent Payment' }
        : undefined,
    }
  }, [childFeeRecord, recentChildPaymentRecord])

  const [selectedChildId, setSelectedChildId] = useState<string>(targetChildId || '')

  const parentChildren = useMemo(() => {
    const matched = students.filter(
      (s) =>
        (userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower) ||
        (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower) ||
        (targetChildId && (s.id === targetChildId || s.student_id === targetChildId))
    )
    if (matched.length > 0) {
      return matched.map((s) => ({
        id: s.id,
        name: s.name,
        class_name: `${s.course} ${s.branch} - ${s.year}`,
        roll_no: s.roll_no,
      }))
    }
    return [{
      id: childStudent.id,
      name: childStudent.name,
      class_name: childStudent.class_name,
      roll_no: childStudent.roll_no,
    }]
  }, [students, userEmailLower, targetChildId, childStudent])

  const realNotices = useMemo(() => {
    return getNoticesForStudent({
      course: childStudent.course,
      branch: childStudent.branch,
      year: childStudent.year,
      section: childStudent.section,
    })
  }, [getNoticesForStudent, childStudent])

  const liveChildUpcomingExams = useMemo(() => {
    if (!storeExams || storeExams.length === 0) return []
    return storeExams.filter((ex) => {
      const matchCourse = !ex.course || ex.course === 'All' || (ex.course || '').toLowerCase() === (childStudent.course || '').toLowerCase()
      const matchBranch = !ex.branch || ex.branch === 'All' || isBranchMatch(ex.branch, childStudent.branch)
      const exSem = (ex as any).year_semester || ex.year || ex.semester
      const matchSem = !exSem || exSem === 'All' || isSemesterMatch(exSem, childStudent.year || childStudent.semester)
      return matchCourse && matchBranch && matchSem
    })
  }, [storeExams, childStudent])

  useEffect(() => {
    if (!childStudent) return
    const ids = Array.from(
      new Set(
        [
          childStudent.id,
          childStudent.student_id,
          childStudent.roll_no,
          `STU-${childStudent.roll_no}`,
          (childStudent.roll_no || '').replace(/^STU-/i, ''),
        ].filter(Boolean) as string[]
      )
    )
    fetchStudentPublishedResultsFromSupabase(ids)
  }, [childStudent?.id, childStudent?.student_id, childStudent?.roll_no])

  const childPublishedResults = useMemo(() => {
    if (!childStudent) return []
    const raw = getStudentPublishedResults(
      childStudent.id,
      childStudent.roll_no,
      childStudent.student_id,
      childStudent.email || childStudent.parent_email || user?.email
    )
    return raw.map((r: any) => ({
      ...r,
      subject: resolveSubjectName(r.subject, r.exam_subject_id),
    }))
  }, [getStudentPublishedResults, childStudent, user?.email])

  const childLatestPct = useMemo(() => {
    if (!childPublishedResults || childPublishedResults.length === 0) return null
    const totalPct = childPublishedResults.reduce((acc: number, r: any) => acc + (Number(r.percentage) || 0), 0)
    return Math.round(totalPct / childPublishedResults.length)
  }, [childPublishedResults])

  const childSubjectPerformance = useMemo(() => {
    if (!childPublishedResults || childPublishedResults.length === 0) return []
    return childPublishedResults.map((r: any) => ({
      subject: r.subject || 'Subject',
      percentage: Number(r.percentage) || 0,
      grade: r.grade || 'A',
    }))
  }, [childPublishedResults])

  const recentExamName = useMemo(() => {
    if (!childPublishedResults || childPublishedResults.length === 0) return 'Mid-Term Examinations 2026'
    return (childPublishedResults[0] as any)?.exam_title || 'Latest Examination'
  }, [childPublishedResults])

  const formattedChildResults = useMemo(() => {
    if (!childPublishedResults || childPublishedResults.length === 0) return []
    return childPublishedResults.map((r: any) => ({
      subject: r.subject || 'Subject',
      marks: Number(r.obtained_marks) || 0,
      maxMarks: Number(r.max_marks) || 100,
      grade: r.grade || 'A',
    }))
  }, [childPublishedResults])

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">Dashboard</h1>
          <p className="text-sm text-ink-400 mt-1">Stay updated on {childStudent.name}'s academic journey.</p>
        </div>
        <ChildSwitcher
          children={parentChildren}
          selectedId={selectedChildId}
          onChange={setSelectedChildId}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Attendance" value={`${attPct}%`} icon={CalendarCheck} tone="success" progressPercent={attPct} />
        <StatCard label="Fees Due" value={formatCurrency(childFeeRecord?.pending ?? 0)} icon={IndianRupee} tone="warning" />
        <StatCard
          label="Latest Result"
          value={childLatestPct !== null ? `${childLatestPct}%` : 'Pending'}
          icon={Award}
          tone="brand"
          progressPercent={childLatestPct !== null ? childLatestPct : undefined}
        />
      </div>

      {/* Row 2: Fees History + Attendance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <FeeSummaryWidget data={childFees} title="Fees History" viewAllHref="fees" />

        {/* Attendance Trend */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5">
          <h3 className="text-base font-display font-semibold text-ink-900 mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-ink-400)' }} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percentage" stroke="var(--color-brand-600)" strokeWidth={2} dot={{ fill: 'var(--color-brand-600)', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Recent Notices + Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Recent Notices */}
        <div className="bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-[var(--shadow-soft)] hover:shadow-md transition-all duration-200 p-5">
          <h3 className="text-base font-display font-semibold text-ink-900 mb-4">Recent Notices</h3>
          <div className="space-y-3">
            {realNotices.length === 0 ? (
              <p className="text-xs text-ink-400 italic">No recent announcements posted for {childStudent.name}'s class.</p>
            ) : (
              realNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  title={notice.title}
                  body={notice.description}
                  priority={notice.priority}
                  author={notice.author}
                  date={notice.date}
                />
              ))
            )}
          </div>
        </div>

        <UpcomingExamsList exams={liveChildUpcomingExams.length > 0 ? liveChildUpcomingExams : undefined} showClass={false} viewAllHref="exams" />
      </div>

      {/* Row 4: Academic Progress + Recent Exam Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AcademicProgressWidget
          subjects={childSubjectPerformance}
          overallPercentage={childLatestPct !== null ? childLatestPct : undefined}
        />
        <RecentExamResultWidget
          examName={recentExamName}
          results={formattedChildResults}
        />
      </div>
    </div>
  )
}

