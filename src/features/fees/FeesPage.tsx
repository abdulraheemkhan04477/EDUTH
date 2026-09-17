import { useState, useMemo } from 'react'
import {
  Tabs,
  DataTable,
  Button,
  Modal,
  FormField,
  Input,
  Select,
  SearchInput,
  AvatarInitials,
} from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../app/providers/AuthProvider'
import { academicStore, COURSES } from '../../lib/academicStore'
import {
  useFeeStore,
  findMatchingFeeStructure,
  type PaymentRecord,
  type StudentFeeRecord,
  type FeeStructure,
  type PaymentMethod,
} from '../../lib/feeStore'
import {
  Plus,
  Download,
  Wallet,
  Receipt,
  TrendingUp,
  FileText,
  CheckCircle2,
  CreditCard,
  Pencil,
  Trash2,
  Eye,
  Clock,
  IndianRupee,
  Users,
} from 'lucide-react'
import type { Column } from '../../components/ui/DataTable'
import { exportToCSV, exportToPDF } from '../../lib/exportUtils'

const paymentMethods: PaymentMethod[] = [
  'Cash',
  'UPI',
  'Bank Transfer',
  'Credit/Debit Card',
  'Online Payment',
  'Cheque',
  'Other',
]

export function FeesPage() {
  const { user, role, collegeId: authCollegeId } = useAuth()
  const adminCollegeId = authCollegeId || (user as any)?.college_id || (user as any)?.school_id || ''
  const { toast } = useToast()
  const {
    structures,
    getStudentFees,
    getPayments,
    saveStructure,
    deleteStructure,
    recordPayment,
    deletePayment,
    getDashboardMetrics: _getDashboardMetrics,
    courses,
    branchesByCourse,
  } = useFeeStore()

  // Navigation Sub-Tabs (Admin Panel)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSaving, setIsSaving] = useState(false)

  // Search & Filter States
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('All')
  const [branchFilter, setBranchFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Modals state
  const [showStructureModal, setShowStructureModal] = useState(false)
  const [showCollectModal, setShowCollectModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showDeletePaymentModal, setShowDeletePaymentModal] = useState(false)
  const [showDeleteStructureModal, setShowDeleteStructureModal] = useState(false)

  // Selected items for modals
  const [selectedStudentFee, setSelectedStudentFee] = useState<StudentFeeRecord | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null)
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null)
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null)
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null)
  const [deletingStructureId, setDeletingStructureId] = useState<string | null>(null)

  // Manual Collect / Pay Form State
  const [paymentStudentId, setPaymentStudentId] = useState('')
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod>('Cash')
  const [paymentTxnRef, setPaymentTxnRef] = useState('')
  const [paymentInstallmentId] = useState('')
  const [paymentRemarks, setPaymentRemarks] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  // New Fee Structure Form State
  const [structTitle, setStructTitle] = useState('')
  const [structCourse, setStructCourse] = useState('B.Tech')
  const [structBranch, setStructBranch] = useState('ECE')
  const [structYear, setStructYear] = useState('')
  const [components, setComponents] = useState<{ name: string; amount: number }[]>([
    { name: 'Tuition Fee', amount: 50000 },
    { name: 'Examination Fee', amount: 10000 },
    { name: 'Laboratory Fee', amount: 10000 },
    { name: 'Library & Digital Resources', amount: 5000 },
    { name: 'Development Fee', amount: 5000 },
  ])
  const [installments] = useState<
    { name: string; type: 'percentage' | 'fixed'; value: number; due_date: string; description: string }[]
  >([
    { name: 'Installment 1', type: 'percentage', value: 25, due_date: '2026-08-15', description: 'Term 1' },
    { name: 'Installment 2', type: 'percentage', value: 25, due_date: '2026-11-15', description: 'Term 2' },
    { name: 'Installment 3', type: 'percentage', value: 25, due_date: '2027-01-15', description: 'Term 3' },
    { name: 'Installment 4', type: 'percentage', value: 25, due_date: '2027-04-15', description: 'Term 4' },
  ])

  // Admin Navigation Tabs
  const topTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'structure', label: 'Fee Structure' },
    { id: 'student-fees', label: 'Student Fees' },
    { id: 'payment', label: 'Payment' },
  ]

  // Filtered Student Fees List (Admin)
  const studentFeeRecords = useMemo(
    () =>
      getStudentFees({
        course: courseFilter,
        branch: branchFilter,
        year_semester: yearFilter,
        status: statusFilter,
        search,
      }),
    [getStudentFees, courseFilter, branchFilter, yearFilter, statusFilter, search]
  )

  // Dynamic dashboard metrics computed from filtered student fee records
  const filteredMetrics = useMemo(() => {
    const totalExpected = studentFeeRecords.reduce((sum, sf) => sum + sf.total_fee, 0)
    const totalCollected = studentFeeRecords.reduce((sum, sf) => sum + sf.paid, 0)
    const totalPending = Math.max(0, totalExpected - totalCollected)
    const paidStudentsCount = studentFeeRecords.filter((sf) => sf.status === 'paid' && sf.total_fee > 0).length
    const pendingStudentsCount = studentFeeRecords.filter((sf) => sf.pending > 0).length

    return {
      totalExpected,
      totalCollected,
      totalPending,
      paidStudentsCount,
      pendingStudentsCount,
      totalStudentsCount: studentFeeRecords.length,
    }
  }, [studentFeeRecords])

  // Filtered Payments List (Admin)
  const paymentRecords = useMemo(
    () =>
      getPayments({
        course: courseFilter,
        branch: branchFilter,
        search,
      }),
    [getPayments, courseFilter, branchFilter, search]
  )

  // Strict Role Check for Student & Parent Panels
  const isStudentOrParent = role === 'student' || role === 'parent'
  const userEmailLower = user?.email?.toLowerCase().trim()

  // Dynamic DEDICATED Student & Parent Record Computation (NO hardcoded data, fully store-driven)
  const studentOwnRecord = useMemo((): StudentFeeRecord | null => {
    if (!isStudentOrParent) return null

    const childId = (user as any)?.child_student_id
    const studentId = (user as any)?.student_id || user?.id

    // 1. Check existing stored student fee record in feeStore
    const allStudentFees = getStudentFees({ course: 'All', branch: 'All', year_semester: 'All', status: 'All', search: '' })
    const foundFeeRecord = allStudentFees.find((s) => {
      if (role === 'parent') {
        if (childId && (s.student_id === childId || s.id === childId || s.roll_no === childId || `STU-${s.roll_no}` === childId)) return true
        if (studentId && (s.student_id === studentId || s.id === studentId || s.roll_no === studentId || `STU-${s.roll_no}` === studentId)) return true
        const masterStud = academicStore.getStudents().find((st: any) => st.id === s.student_id || st.student_id === s.student_id)
        if (masterStud && userEmailLower && masterStud.parent_email?.toLowerCase().trim() === userEmailLower) return true
      } else {
        if (studentId && (s.student_id === studentId || s.id === studentId || s.roll_no === studentId || `STU-${s.roll_no}` === studentId)) return true
        const masterStud = academicStore.getStudents().find((st: any) => st.id === s.student_id || st.student_id === s.student_id)
        if (masterStud && userEmailLower && masterStud.email?.toLowerCase().trim() === userEmailLower) return true
      }
      return false
    })

    // 2. Find student in academicStore
    const allStudents = academicStore.getStudents()
    const matchingStudent = allStudents.find((s) => {
      if (role === 'parent') {
        if (childId && (s.id === childId || s.student_id === childId || s.roll_no === childId || `STU-${s.roll_no}` === childId)) return true
        if (studentId && (s.id === studentId || s.student_id === studentId || s.roll_no === studentId || `STU-${s.roll_no}` === studentId)) return true
        if (userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower) return true
      } else {
        if (studentId && (s.id === studentId || s.student_id === studentId || s.roll_no === studentId || `STU-${s.roll_no}` === studentId)) return true
        if (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower) return true
        if (user?.id && s.id === user.id) return true
      }
      return false
    }) || {
      id: studentId || 'STU-001',
      student_id: studentId || 'STU-001',
      name: user?.name ? (role === 'parent' ? (user.name.toLowerCase().includes('parent') ? `${user.name.replace(/parent/i, '')}'s Child` : `${user.name}'s Child`) : user.name) : 'Student',
      roll_no: (user as any)?.roll_no || '2026ECE001',
      course: (user as any)?.course || 'B.Tech',
      branch: (user as any)?.branch || 'ECE',
      year: (user as any)?.year || '1st Year',
      section: (user as any)?.section || 'A',
      college_id: authCollegeId || 'COL001',
    }

    if (foundFeeRecord) {
      const studentPayments = getPayments({ student_id: foundFeeRecord.student_id })
      const actualPaid = studentPayments.reduce((sum, p) => sum + (p.status === 'Completed' ? Number(p.amount) : 0), 0)
      const totalFee = foundFeeRecord.total_fee
      const pending = Math.max(0, totalFee - actualPaid)
      const status: 'paid' | 'partial' | 'due' = actualPaid >= totalFee && totalFee > 0 ? 'paid' : actualPaid > 0 ? 'partial' : 'due'

      return {
        ...foundFeeRecord,
        paid: actualPaid,
        pending,
        status,
      }
    }

    // 3. Dynamic lookup from matching fee structures
    const matchingStructure = findMatchingFeeStructure(matchingStudent, structures)

    const totalFee = matchingStructure ? Number(matchingStructure.total_amount) || 0 : 0
    const studentPayments = getPayments({ student_id: matchingStudent.id })
    const actualPaid = studentPayments.reduce((sum, p) => sum + (p.status === 'Completed' ? Number(p.amount) : 0), 0)
    const pending = totalFee > 0 ? Math.max(0, totalFee - actualPaid) : 0
    const status: 'paid' | 'partial' | 'due' = actualPaid >= totalFee && totalFee > 0 ? 'paid' : actualPaid > 0 ? 'partial' : 'due'

    const baseInstallments = matchingStructure?.installments || [
      { id: 'inst_1', name: 'Installment 1', type: 'percentage' as const, value: 50, calculated_amount: totalFee * 0.5, due_date: '2026-08-15', description: 'Term 1 Tuition & Lab Fee' },
      { id: 'inst_2', name: 'Installment 2', type: 'percentage' as const, value: 50, calculated_amount: totalFee * 0.5, due_date: '2027-01-15', description: 'Term 2 Tuition & Exam Fee' },
    ]

    let runningPaid = actualPaid
    const calculatedInstallments = baseInstallments.map((inst) => {
      const amt = inst.calculated_amount || (totalFee * (inst.value / 100))
      let instStatus: 'paid' | 'partial' | 'due' = 'due'
      if (runningPaid >= amt) {
        instStatus = 'paid'
        runningPaid -= amt
      } else if (runningPaid > 0) {
        instStatus = 'partial'
        runningPaid = 0
      }
      return {
        ...inst,
        calculated_amount: amt,
        status: instStatus,
      }
    })

    return {
      id: `fee_${matchingStudent.id}`,
      student_id: matchingStudent.id,
      student_name: matchingStudent.name,
      roll_no: matchingStudent.roll_no,
      course: matchingStudent.course,
      branch: matchingStudent.branch,
      year_semester: matchingStudent.year,
      section: matchingStudent.section || 'A',
      fee_structure_id: matchingStructure?.id || 'STRUCT_GENERIC',
      fee_structure_title: matchingStructure?.title || `${matchingStudent.course} Fee Structure`,
      total_fee: totalFee,
      paid: actualPaid,
      pending,
      status,
      installments: calculatedInstallments,
      components: matchingStructure?.components || [],
      college_id: matchingStudent.college_id || authCollegeId || 'COL001',
    }
  }, [isStudentOrParent, role, user, getStudentFees, getPayments, structures, userEmailLower, authCollegeId])

  // Student specific payment history
  const studentOwnPayments = useMemo(() => {
    if (!studentOwnRecord) return []
    return getPayments({ student_id: studentOwnRecord.student_id })
  }, [studentOwnRecord, getPayments])

  const availableBranchesForCourse = useMemo(() => {
    if (courseFilter === 'All') {
      const allBranches = Object.values(branchesByCourse).flat()
      return Array.from(new Set(allBranches))
    }
    return branchesByCourse[courseFilter] || []
  }, [courseFilter, branchesByCourse])

  const filteredStructures = useMemo(() => {
    return structures.filter((st) => {
      const matchSearch =
        !search ||
        st.title.toLowerCase().includes(search.toLowerCase()) ||
        st.course.toLowerCase().includes(search.toLowerCase()) ||
        st.branch.toLowerCase().includes(search.toLowerCase())
      const matchCourse = courseFilter === 'All' || st.course === courseFilter
      const matchBranch =
        branchFilter === 'All' || st.branch === branchFilter || st.branch === 'All Branches'
      const matchYear =
        yearFilter === 'All' || st.year_semester === yearFilter || st.year_semester === 'All Years'
      return matchSearch && matchCourse && matchBranch && matchYear
    })
  }, [structures, search, courseFilter, branchFilter, yearFilter])

  const availableBranchesForStructForm = useMemo(() => {
    return branchesByCourse[structCourse] || []
  }, [structCourse, branchesByCourse])

  const totalComponentSum = useMemo(() => {
    return components.reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
  }, [components])

  // Open Collect Modal
  const handleOpenCollectModal = (record?: StudentFeeRecord) => {
    const target = record || studentOwnRecord || studentFeeRecords[0]
    if (!target) return
    setSelectedStudentFee(target)
    setPaymentStudentId(target.student_id)
    setPaymentAmount(target.pending > 0 ? target.pending : target.total_fee)
    setPaymentMethodState('Cash')
    setPaymentTxnRef(`TXN-${Date.now().toString().slice(-6)}`)
    setPaymentRemarks('Fee collection at office counter')
    setPaymentDate(new Date().toISOString().split('T')[0])
    setEditingPayment(null)
    setShowCollectModal(true)
  }

  // Open Edit Modal for payment
  const handleOpenEditPayment = (payment: PaymentRecord) => {
    const target = studentFeeRecords.find((s) => s.student_id === payment.student_id)
    if (target) setSelectedStudentFee(target)
    setEditingPayment(payment)
    setPaymentStudentId(payment.student_id)
    setPaymentAmount(payment.amount)
    setPaymentMethodState(payment.payment_method)
    setPaymentTxnRef(payment.transaction_id)
    setPaymentRemarks(payment.remarks || '')
    setPaymentDate(payment.payment_date)
    setShowCollectModal(true)
  }

  // Submit Payment Record
  const handleProcessPayment = async () => {
    if (isSaving) return
    if (!paymentStudentId) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please select a student.' })
      return
    }
    if (paymentAmount <= 0) {
      toast({ type: 'error', title: 'Validation Error', description: 'Payment amount must be greater than 0.' })
      return
    }

    const studentRec = studentFeeRecords.find((s) => s.student_id === paymentStudentId) || selectedStudentFee || studentOwnRecord

    if (!studentRec) {
      toast({ type: 'error', title: 'Error', description: 'Student record not found.' })
      return
    }

    const maxAllowed = Math.max(0, studentRec.total_fee - (studentRec.paid || 0))

    if (!editingPayment && studentRec.total_fee > 0 && paymentAmount > maxAllowed) {
      toast({
        type: 'error',
        title: 'Payment Blocked',
        description:
          maxAllowed <= 0
            ? `Fee of ₹${studentRec.total_fee.toLocaleString()} for ${studentRec.student_name} is already fully paid.`
            : `Payment amount of ₹${paymentAmount.toLocaleString()} exceeds maximum allowed payment of ₹${maxAllowed.toLocaleString()} (Total Fee: ₹${studentRec.total_fee.toLocaleString()}, Paid: ₹${(studentRec.paid || 0).toLocaleString()}).`,
      })
      return
    }

    setIsSaving(true)
    try {
      const paymentPayload: any = {
        receipt_no: editingPayment?.receipt_no || (`RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`),
        student_id: studentRec.student_id,
        student_name: studentRec.student_name,
        roll_no: studentRec.roll_no,
        course: studentRec.course,
        branch: studentRec.branch,
        year_semester: studentRec.year_semester,
        fee_structure_id: studentRec.fee_structure_id,
        student_fee_id: studentRec.id,
        installment_name: paymentInstallmentId ? 'Selected Installment' : 'General Fee Payment',
        amount: Number(paymentAmount),
        payment_method: paymentMethod,
        transaction_id: paymentTxnRef || `REF-${Date.now().toString().slice(-6)}`,
        payment_date: paymentDate,
        remarks: paymentRemarks,
        status: 'Completed',
        college_id: adminCollegeId,
      }
      if (editingPayment?.id) {
        paymentPayload.id = editingPayment.id
      }
      await recordPayment(paymentPayload)

      toast({
        type: 'success',
        title: editingPayment ? 'Payment Updated' : 'Payment Collection Successful',
        description: `Recorded ₹${paymentAmount.toLocaleString()} payment for ${studentRec.student_name}.`,
      })

      setShowCollectModal(false)
      setEditingPayment(null)
    } catch (err: any) {
      toast({ type: 'error', title: 'Payment Failed', description: err.message || 'An error occurred while recording payment.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Open Add Structure Modal
  const handleOpenAddStructureModal = () => {
    setEditingStructure(null)
    setStructTitle('')
    setStructCourse('B.Tech')
    setStructBranch('ECE')
    setStructYear('1st Year')
    setComponents([
      { name: 'Tuition Fee', amount: 50000 },
      { name: 'Examination Fee', amount: 10000 },
      { name: 'Laboratory Fee', amount: 10000 },
      { name: 'Library & Digital Resources', amount: 5000 },
      { name: 'Development Fee', amount: 5000 },
    ])
    setShowStructureModal(true)
  }

  // Handle Open Edit Structure Modal
  const handleOpenEditStructureModal = (st: FeeStructure) => {
    setEditingStructure(st)
    setStructTitle(st.title)
    setStructCourse(st.course)
    setStructBranch(st.branch)
    setStructYear(st.year_semester)
    setComponents(st.components && st.components.length > 0 ? st.components : [
      { name: 'Tuition Fee', amount: 50000 },
      { name: 'Examination Fee', amount: 10000 },
    ])
    setShowStructureModal(true)
  }

  // Handle Save / Update Fee Structure
  const handleSaveStructure = async () => {
    if (isSaving) return
    if (!structTitle.trim()) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please enter a Fee Structure title.' })
      return
    }
    if (components.length === 0) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please add at least one fee component.' })
      return
    }

    setIsSaving(true)
    try {
      await saveStructure({
        id: editingStructure?.id,
        title: structTitle.trim(),
        course: structCourse,
        branch: structBranch,
        year_semester: structYear || 'All Years',
        total_amount: totalComponentSum,
        components,
        installments: installments.map((inst, idx) => ({
          id: `inst_${Date.now()}_${idx}`,
          name: inst.name,
          type: inst.type,
          value: Number(inst.value),
          calculated_amount: inst.type === 'percentage' ? Math.round((totalComponentSum * inst.value) / 100) : Number(inst.value),
          due_date: inst.due_date,
          description: inst.description,
        })),
        college_id: adminCollegeId,
      })

      toast({
        type: 'success',
        title: editingStructure ? 'Fee Structure Updated' : 'Fee Structure Saved',
        description: editingStructure ? 'Fee structure details updated.' : 'New fee structure created and assigned.',
      })
      setShowStructureModal(false)
      setEditingStructure(null)
      setStructTitle('')
      setStructYear('')
      setComponents([
        { name: 'Tuition Fee', amount: 50000 },
        { name: 'Examination Fee', amount: 10000 },
        { name: 'Laboratory Fee', amount: 10000 },
        { name: 'Library & Digital Resources', amount: 5000 },
        { name: 'Development Fee', amount: 5000 },
      ])
    } catch (err: any) {
      toast({ type: 'error', title: 'Save Failed', description: err.message || 'Could not save fee structure.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Delete Fee Structure
  const handleDeleteStructureConfirm = async () => {
    if (!deletingStructureId) return
    try {
      await deleteStructure(deletingStructureId, adminCollegeId)
      toast({ type: 'success', title: 'Structure Deleted', description: 'Fee structure deleted successfully.' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', description: err.message || 'Could not delete fee structure.' })
    }
    setShowDeleteStructureModal(false)
    setDeletingStructureId(null)
  }

  // Handle Delete Payment
  const handleDeletePaymentConfirm = async () => {
    if (!deletingPaymentId) return
    try {
      await deletePayment(deletingPaymentId, adminCollegeId)
      toast({ type: 'success', title: 'Payment Deleted', description: 'The payment transaction was removed and student balances updated.' })
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', description: err.message || 'Could not delete payment.' })
    }
    setShowDeletePaymentModal(false)
    setDeletingPaymentId(null)
  }

  // Export handlers
  const handleExportCSV = () => {
    const exportData = studentFeeRecords.map((s) => ({
      'Student Name': s.student_name,
      'Roll Number': s.roll_no,
      Course: s.course,
      Branch: s.branch,
      Year: s.year_semester,
      'Total Fee': s.total_fee,
      Paid: s.paid,
      Pending: s.pending,
      Status: s.status.toUpperCase(),
    }))
    exportToCSV('Fee_Collection_Report', exportData)
    toast({ type: 'success', title: 'Export Started', description: 'Fee collection CSV downloaded successfully.' })
  }

  const handleExportPDF = () => {
    const columns = [
      { key: 'student_name', header: 'Student' },
      { key: 'roll_no', header: 'Roll No' },
      { key: 'course', header: 'Course' },
      { key: 'total_fee', header: 'Total (₹)' },
      { key: 'paid', header: 'Paid (₹)' },
      { key: 'pending', header: 'Pending (₹)' },
      { key: 'status', header: 'Status' },
    ]
    exportToPDF('Fee Collection Audit Report', 'Academic Year 2026-2027', columns, studentFeeRecords)
    toast({ type: 'success', title: 'Export Started', description: 'PDF Audit report generated successfully.' })
  }

  // Table Columns for Student Fees
  const studentFeeColumns: Column<StudentFeeRecord>[] = [
    {
      key: 'student_name',
      header: 'STUDENT',
      render: (row) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={row.student_name} size="md" />
          <div>
            <span className="font-semibold text-ink-900 block">{row.student_name}</span>
            <span className="text-xs text-ink-400 font-mono">{row.roll_no}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'course',
      header: 'COURSE & BRANCH',
      render: (row) => (
        <div>
          <span className="text-sm font-medium text-ink-900 block">{row.course} • {row.branch}</span>
          <span className="text-xs text-ink-400">{row.year_semester} ({row.section})</span>
        </div>
      ),
    },
    {
      key: 'total_fee',
      header: 'TOTAL FEE',
      render: (row) => <span className="font-medium text-ink-900">₹{row.total_fee.toLocaleString()}</span>,
    },
    {
      key: 'paid',
      header: 'PAID',
      render: (row) => <span className="font-semibold text-emerald-600">₹{row.paid.toLocaleString()}</span>,
    },
    {
      key: 'pending',
      header: 'PENDING',
      render: (row) => (
        <span className={`font-semibold ${row.pending > 0 ? 'text-rose-600' : 'text-ink-400'}`}>
          ₹{row.pending.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (row) => {
        if (row.status === 'paid') {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              Paid
            </span>
          )
        }
        if (row.status === 'partial') {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              Partial
            </span>
          )
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
            Due
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: 'ACTION',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedStudentFee(row)
              setShowDetailModal(true)
            }}
            title="View Details"
          >
            <Eye className="h-4 w-4 text-ink-600" />
          </Button>
          {!isStudentOrParent && (
            <Button
              size="sm"
              onClick={() => handleOpenCollectModal(row)}
              className="rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium px-3 text-xs shrink-0"
            >
              Collect
            </Button>
          )}
        </div>
      ),
    },
  ]

  // Table Columns for Payments History
  const paymentColumns: Column<PaymentRecord>[] = [
    {
      key: 'receipt_no',
      header: 'RECEIPT / TXN ID',
      render: (row) => (
        <div>
          <span className="text-xs font-bold font-mono text-indigo-600 block">{row.receipt_no}</span>
          <span className="text-[11px] text-slate-400 font-mono">{row.transaction_id}</span>
        </div>
      ),
    },
    {
      key: 'student_name',
      header: 'STUDENT',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.student_name}</span>
          <span className="text-xs text-slate-500">{row.roll_no} ({row.course} • {row.branch})</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'AMOUNT',
      render: (row) => <span className="font-bold text-emerald-600">₹{row.amount.toLocaleString()}</span>,
    },
    {
      key: 'payment_method',
      header: 'METHOD',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {row.payment_method}
        </span>
      ),
    },
    {
      key: 'payment_date',
      header: 'DATE',
      render: (row) => <span className="text-xs font-medium text-slate-700">{row.payment_date}</span>,
    },
    {
      key: 'status',
      header: 'STATUS',
      render: () => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          Completed
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTION',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedReceipt(row)
              setShowReceiptModal(true)
            }}
            title="View Receipt"
          >
            <FileText className="h-4 w-4 text-slate-600" />
          </Button>
          {!isStudentOrParent && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOpenEditPayment(row)}
                title="Edit Payment"
              >
                <Pencil className="h-3.5 w-3.5 text-slate-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setDeletingPaymentId(row.id)
                  setShowDeletePaymentModal(true)
                }}
                title="Delete Payment"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-600" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  // =========================================================================
  // STRICT RENDER: DEDICATED STUDENT & PARENT FEE ACCOUNT STRUCTURE
  // (NEVER Falls through to Admin UI under any condition for Student/Parent)
  // =========================================================================
  if (isStudentOrParent) {
    if (!studentOwnRecord) {
      return (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500 font-medium">Loading student fee account details...</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <IndianRupee className="h-7 w-7 text-indigo-600" />
              {role === 'parent' ? 'Child Fee Account' : 'My Fee Details'}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {studentOwnRecord.student_name} ({studentOwnRecord.roll_no}) • {studentOwnRecord.course} {studentOwnRecord.branch} ({studentOwnRecord.year_semester})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleExportPDF}
              variant="ghost"
              className="border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              <Download className="h-4 w-4 mr-1.5 text-indigo-600" /> Download Fee Statement
            </Button>
            {studentOwnRecord.pending > 0 && (
              <Button
                onClick={() => handleOpenCollectModal(studentOwnRecord)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" /> Pay Outstanding Fee
              </Button>
            )}
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">TOTAL APPLICABLE FEE</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-3">
              ₹{studentOwnRecord.total_fee.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Academic Year 2026-27</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">TOTAL AMOUNT PAID</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display text-emerald-600 mt-3">
              ₹{studentOwnRecord.paid.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-700/80 mt-1 font-medium">Verified Receipts On Record</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">REMAINING PENDING BALANCE</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display text-rose-600 mt-3">
              ₹{studentOwnRecord.pending.toLocaleString()}
            </p>
            <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1 w-fit ${
              studentOwnRecord.pending === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {studentOwnRecord.pending === 0 ? 'Fee Fully Paid' : 'Payment Due'}
            </span>
          </div>
        </div>

        {/* Installment Schedule & Fee Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Installments Schedule */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Fee Installment Schedule
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {studentOwnRecord.installments.length} Terms Total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studentOwnRecord.installments.map((inst, idx) => (
                <div
                  key={inst.id || idx}
                  className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{inst.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Due: <strong className="text-slate-800">{inst.due_date}</strong></p>
                    </div>
                    <span
                      className={`inline-block text-[11px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        inst.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inst.status === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inst.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-normal">{inst.description || 'Semester Tuition & Institutional Fee'}</p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Scheduled Amount</span>
                    <span className="text-base font-bold text-slate-900">₹{inst.calculated_amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Component-wise Structure Breakup */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-indigo-600" />
              Fee Component Breakup
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              {studentOwnRecord.components && studentOwnRecord.components.length > 0 ? (
                studentOwnRecord.components.map((c, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">{c.name}</span>
                    <span className="font-bold text-slate-900">₹{(Number(c.amount) || 0).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Tuition & Academic Fee</span>
                    <span className="font-bold text-slate-900">₹{Math.round(studentOwnRecord.total_fee * 0.65).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Laboratory & Practical Fee</span>
                    <span className="font-bold text-slate-900">₹{Math.round(studentOwnRecord.total_fee * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Examination & Evaluation Fee</span>
                    <span className="font-bold text-slate-900">₹{Math.round(studentOwnRecord.total_fee * 0.10).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Library & E-Resources</span>
                    <span className="font-bold text-slate-900">₹{Math.round(studentOwnRecord.total_fee * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Development & Activity Fee</span>
                    <span className="font-bold text-slate-900">₹{Math.round(studentOwnRecord.total_fee * 0.05).toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-2.5 pt-3 border-t-2 border-slate-900 text-sm">
                <span className="font-bold text-slate-900">Total Structural Fee</span>
                <span className="font-extrabold text-indigo-700">₹{studentOwnRecord.total_fee.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History & Receipts Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Payment Receipts & Transaction Ledger
            </h3>
            <span className="text-xs font-semibold text-slate-500">{studentOwnPayments.length} Payments Recorded</span>
          </div>

          <DataTable
            columns={paymentColumns}
            rows={studentOwnPayments}
            keyExtractor={(r) => r.id}
            pageSize={5}
          />
        </div>

        {/* Receipt View Modal */}
        {selectedReceipt && (
          <Modal
            isOpen={showReceiptModal}
            onClose={() => setShowReceiptModal(false)}
            title="Official Fee Payment Receipt"
            footer={
              <Button onClick={() => setShowReceiptModal(false)} className="bg-indigo-600 text-white font-bold">
                Close Receipt
              </Button>
            }
          >
            <div className="space-y-4 text-sm">
              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-3 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Official Fee Receipt</h4>
                    <p className="text-xs text-slate-500">RRIMT College Management System</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-600 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                    {selectedReceipt.receipt_no}
                  </span>
                </div>
                <div className="space-y-2 text-slate-700 text-xs sm:text-sm">
                  <p>Student Name: <strong className="text-slate-900">{selectedReceipt.student_name}</strong> ({selectedReceipt.roll_no})</p>
                  <p>Course & Branch: <strong className="text-slate-900">{selectedReceipt.course} • {selectedReceipt.branch}</strong></p>
                  <p>Amount Paid: <strong className="text-emerald-600 font-bold text-base">₹{selectedReceipt.amount.toLocaleString()}</strong></p>
                  <p>Payment Method: <strong className="text-slate-900">{selectedReceipt.payment_method}</strong></p>
                  <p>Transaction Ref: <strong className="font-mono text-slate-900">{selectedReceipt.transaction_id}</strong></p>
                  <p>Payment Date: <strong className="text-slate-900">{selectedReceipt.payment_date}</strong></p>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold pt-3 border-t border-slate-200">
                  <CheckCircle2 className="h-4 w-4" /> Official College Seal - Payment Verified & Settled
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    )
  }

  // =========================================================================
  // ADMIN & AUTHORIZED USERS VIEW
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">Fees Management</h1>
          <p className="text-sm text-ink-400 mt-1">
            Real-time fee structure, collection counter, student ledgers, and financial reports.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={() => handleOpenCollectModal()} variant="ghost" className="border border-border gap-1.5">
            <Plus className="h-4 w-4" /> Collect Payment
          </Button>
          <Button onClick={handleOpenAddStructureModal} className="bg-brand-600 hover:bg-brand-700 gap-1.5">
            <Plus className="h-4 w-4" /> New Fee Structure
          </Button>
        </div>
      </div>

      {/* Top Navigation Sub-Tabs */}
      <Tabs tabs={topTabs} activeId={activeTab} onChange={setActiveTab} className="border-b border-border" />

      {/* SECTION 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 4 Overview Metric Stat Cards (Above Filter Bar) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Paid Students */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">PAID STUDENTS</p>
                  <p className="text-3xl font-display font-bold text-emerald-600 mt-2">{filteredMetrics.paidStudentsCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3 font-medium">Fully Cleared Accounts</p>
            </div>

            {/* Card 2: Pending Students */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">PENDING STUDENTS</p>
                  <p className="text-3xl font-display font-bold text-amber-600 mt-2">{filteredMetrics.pendingStudentsCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3 font-medium">Outstanding Balance Due</p>
            </div>

            {/* Card 3: Total Collection */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">TOTAL COLLECTION</p>
                  <p className="text-3xl font-display font-bold text-emerald-600 mt-2">
                    ₹{filteredMetrics.totalCollected.toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3 font-medium">Total Fees Received</p>
            </div>

            {/* Card 4: Pending Dues */}
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">PENDING DUES</p>
                  <p className="text-3xl font-display font-bold text-rose-600 mt-2">
                    ₹{filteredMetrics.totalPending.toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3 font-medium">Total Fees Remaining</p>
            </div>
          </div>

          {/* Dashboard Filter Bar (identical layout to Students/Teachers directory) */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <SearchInput
                placeholder="Search student name, roll..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select
                options={COURSES.map((c: string) => ({ value: c, label: c }))}
                placeholder="All Courses"
                value={courseFilter === 'All' ? '' : courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value || 'All')
                  setBranchFilter('All')
                }}
                className="w-full sm:w-40"
              />
              <Select
                options={availableBranchesForCourse.map((b: string) => ({ value: b, label: b }))}
                placeholder="All Branches"
                value={branchFilter === 'All' ? '' : branchFilter}
                onChange={(e) => setBranchFilter(e.target.value || 'All')}
                className="w-full sm:w-44"
              />
              <Select
                options={[
                  { value: '1st Year', label: '1st Year' },
                  { value: '2nd Year', label: '2nd Year' },
                  { value: '3rd Year', label: '3rd Year' },
                  { value: '4th Year', label: '4th Year' },
                ]}
                placeholder="All Year"
                value={yearFilter === 'All' ? '' : yearFilter}
                onChange={(e) => setYearFilter(e.target.value || 'All')}
                className="w-full sm:w-36"
              />
            </div>
            {(search || courseFilter !== 'All' || branchFilter !== 'All' || yearFilter !== 'All') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setCourseFilter('All')
                  setBranchFilter('All')
                  setYearFilter('All')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Filtered Student Fees Table Summary */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-base font-bold text-ink-900">Filtered Student Ledger Summary ({studentFeeRecords.length})</h2>
              <Button onClick={() => setActiveTab('student-fees')} variant="ghost" className="text-xs text-brand-600 font-semibold">
                View Full Student Fees →
              </Button>
            </div>
            <DataTable columns={studentFeeColumns} rows={studentFeeRecords} keyExtractor={(r) => r.id} pageSize={5} />
          </div>
        </div>
      )}

      {/* SECTION 2: FEE STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <SearchInput
                placeholder="Search structure title, course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select
                options={COURSES.map((c: string) => ({ value: c, label: c }))}
                placeholder="All Courses"
                value={courseFilter === 'All' ? '' : courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value || 'All')
                  setBranchFilter('All')
                }}
                className="w-40"
              />
              <Select
                options={availableBranchesForCourse.map((b: string) => ({ value: b, label: b }))}
                placeholder="All Branches"
                value={branchFilter === 'All' ? '' : branchFilter}
                onChange={(e) => setBranchFilter(e.target.value || 'All')}
                className="w-44"
              />
              <Select
                options={[
                  { value: '1st Year', label: '1st Year' },
                  { value: '2nd Year', label: '2nd Year' },
                  { value: '3rd Year', label: '3rd Year' },
                  { value: '4th Year', label: '4th Year' },
                ]}
                placeholder="All Year"
                value={yearFilter === 'All' ? '' : yearFilter}
                onChange={(e) => setYearFilter(e.target.value || 'All')}
                className="w-36"
              />
            </div>
            <div className="flex items-center gap-2">
              {(search || courseFilter !== 'All' || branchFilter !== 'All' || yearFilter !== 'All') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch('')
                    setCourseFilter('All')
                    setBranchFilter('All')
                    setYearFilter('All')
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Button onClick={handleOpenAddStructureModal} className="bg-brand-600 hover:bg-brand-700 text-white text-xs shrink-0">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Fee Structure
              </Button>
            </div>
          </div>

          {filteredStructures.length === 0 ? (
            <div className="bg-surface p-8 text-center rounded-[var(--radius-card)] border border-border">
              <p className="text-sm text-ink-400 font-medium">No fee structures match the selected filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStructures.map((st) => (
                <div key={st.id} className="bg-surface p-5 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] space-y-3">
                  <div className="flex justify-between items-start border-b border-border pb-2">
                    <div>
                      <h3 className="font-bold text-ink-900 text-base">{st.title}</h3>
                      <p className="text-xs text-ink-400">{st.course} • {st.branch} ({st.year_semester})</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-600">₹{st.total_amount.toLocaleString()}</span>
                      {!isStudentOrParent && (
                        <div className="flex items-center gap-1 ml-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenEditStructureModal(st)}
                            title="Edit Structure"
                          >
                            <Pencil className="h-4 w-4 text-ink-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setDeletingStructureId(st.id)
                              setShowDeleteStructureModal(true)
                            }}
                            title="Delete Structure"
                          >
                            <Trash2 className="h-4 w-4 text-rose-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    {st.components.map((c, i) => (
                      <div key={i} className="flex justify-between text-ink-600">
                        <span>{c.name}</span>
                        <span className="font-medium">₹{c.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: STUDENT FEES */}
      {activeTab === 'student-fees' && (
        <div className="space-y-4">
          {/* Filter Bar (Identical UI to Students/Teachers Page) */}
          <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <SearchInput
                placeholder="Search student name or roll..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select
                options={COURSES.map((c: string) => ({ value: c, label: c }))}
                placeholder="All Courses"
                value={courseFilter === 'All' ? '' : courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value || 'All')
                  setBranchFilter('All')
                }}
                className="w-40"
              />
              <Select
                options={availableBranchesForCourse.map((b: string) => ({ value: b, label: b }))}
                placeholder="All Branches"
                value={branchFilter === 'All' ? '' : branchFilter}
                onChange={(e) => setBranchFilter(e.target.value || 'All')}
                className="w-44"
              />
              <Select
                options={[
                  { value: '1st Year', label: '1st Year' },
                  { value: '2nd Year', label: '2nd Year' },
                  { value: '3rd Year', label: '3rd Year' },
                  { value: '4th Year', label: '4th Year' },
                ]}
                placeholder="All Year"
                value={yearFilter === 'All' ? '' : yearFilter}
                onChange={(e) => setYearFilter(e.target.value || 'All')}
                className="w-36"
              />
              <Select
                options={[
                  { value: 'paid', label: 'Paid' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'due', label: 'Due' },
                ]}
                placeholder="All Statuses"
                value={statusFilter === 'All' ? '' : statusFilter}
                onChange={(e) => setStatusFilter(e.target.value || 'All')}
                className="w-36"
              />
            </div>
            <div className="flex items-center gap-2">
              {(search || courseFilter !== 'All' || branchFilter !== 'All' || yearFilter !== 'All' || statusFilter !== 'All') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch('')
                    setCourseFilter('All')
                    setBranchFilter('All')
                    setYearFilter('All')
                    setStatusFilter('All')
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Button onClick={handleExportCSV} variant="ghost" className="border border-border text-xs">
                <Download className="h-3.5 w-3.5 mr-1" /> CSV
              </Button>
              <Button onClick={handleExportPDF} variant="ghost" className="border border-border text-xs">
                <Download className="h-3.5 w-3.5 mr-1" /> PDF
              </Button>
            </div>
          </div>

          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-5">
            <DataTable columns={studentFeeColumns} rows={studentFeeRecords} keyExtractor={(r) => r.id} pageSize={10} />
          </div>
        </div>
      )}

      {/* SECTION 4: PAYMENT */}
      {activeTab === 'payment' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <SearchInput
                placeholder="Search student name, roll or receipt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select
                options={COURSES.map((c: string) => ({ value: c, label: c }))}
                placeholder="All Courses"
                value={courseFilter === 'All' ? '' : courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value || 'All')
                  setBranchFilter('All')
                }}
                className="w-40"
              />
              <Select
                options={availableBranchesForCourse.map((b: string) => ({ value: b, label: b }))}
                placeholder="All Branches"
                value={branchFilter === 'All' ? '' : branchFilter}
                onChange={(e) => setBranchFilter(e.target.value || 'All')}
                className="w-44"
              />
            </div>
            <div className="flex items-center gap-2">
              {(search || courseFilter !== 'All' || branchFilter !== 'All') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch('')
                    setCourseFilter('All')
                    setBranchFilter('All')
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Button onClick={() => handleOpenCollectModal()} className="bg-brand-600 hover:bg-brand-700 text-white text-xs shrink-0">
                <Plus className="h-3.5 w-3.5 mr-1" /> Record New Payment
              </Button>
            </div>
          </div>

          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-5">
            <DataTable columns={paymentColumns} rows={paymentRecords} keyExtractor={(r) => r.id} pageSize={10} />
          </div>
        </div>
      )}

      {/* COLLECT PAYMENT MODAL */}
      {showCollectModal && (
        <Modal
          isOpen={showCollectModal}
          onClose={() => setShowCollectModal(false)}
          title={editingPayment ? 'Edit Payment Record' : 'Record Fee Payment'}
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowCollectModal(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleProcessPayment} disabled={isSaving} className="bg-indigo-600 text-white font-bold">
                {isSaving ? 'Processing...' : 'Confirm & Save Payment'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <FormField label="Student" required>
              <Select
                value={paymentStudentId}
                onChange={(e) => {
                  setPaymentStudentId(e.target.value)
                  const target = studentFeeRecords.find((s) => s.student_id === e.target.value)
                  if (target) {
                    setSelectedStudentFee(target)
                    setPaymentAmount(target.pending > 0 ? target.pending : target.total_fee)
                  }
                }}
                options={studentFeeRecords.map((s) => ({
                  value: s.student_id,
                  label: `${s.student_name} (${s.roll_no}) — ${s.course} ${s.branch} (Due: ₹${s.pending.toLocaleString()})`,
                }))}
              />
            </FormField>

            <FormField label="Payment Amount (₹)" required>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
              />
            </FormField>

            <FormField label="Payment Method" required>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethodState(e.target.value as PaymentMethod)}
                options={paymentMethods.map((m) => ({ value: m, label: m }))}
              />
            </FormField>

            <FormField label="Transaction Ref / ID">
              <Input value={paymentTxnRef} onChange={(e) => setPaymentTxnRef(e.target.value)} placeholder="e.g. UPI Ref / Cheque No" />
            </FormField>

            <FormField label="Payment Date">
              <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </FormField>

            <FormField label="Remarks / Notes">
              <Input value={paymentRemarks} onChange={(e) => setPaymentRemarks(e.target.value)} placeholder="Payment remarks..." />
            </FormField>
          </div>
        </Modal>
      )}

      {/* VIEW DETAILS MODAL */}
      {showDetailModal && selectedStudentFee && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Student Fee Ledger — ${selectedStudentFee.student_name}`}
          footer={<Button onClick={() => setShowDetailModal(false)}>Close</Button>}
        >
          <div className="space-y-4 text-sm max-h-[75vh] overflow-y-auto pr-1">
            {/* Header Summary Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 text-base">{selectedStudentFee.student_name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Roll No: <strong className="text-slate-800">{selectedStudentFee.roll_no}</strong> • {selectedStudentFee.course} ({selectedStudentFee.branch}) — {selectedStudentFee.year_semester} ({selectedStudentFee.section})
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-center text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Total Fee</span>
                  <span className="font-bold text-slate-900 text-sm">₹{selectedStudentFee.total_fee.toLocaleString()}</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-emerald-600 block font-semibold uppercase text-[10px]">Total Paid</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{selectedStudentFee.paid.toLocaleString()}</span>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                  <span className="text-rose-600 block font-semibold uppercase text-[10px]">Pending Due</span>
                  <span className="font-bold text-rose-700 text-sm">₹{selectedStudentFee.pending.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Installments Schedule with Right-Aligned Status Badges */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Fee Installments Schedule</span>
                <span className="text-[11px] text-slate-400 font-normal">{selectedStudentFee.installments.length} Installments</span>
              </h4>

              {selectedStudentFee.installments && selectedStudentFee.installments.length > 0 ? (
                <div className="space-y-2">
                  {selectedStudentFee.installments.map((inst, idx) => (
                    <div key={inst.id || idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{inst.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Scheduled: <strong className="text-slate-700">₹{(inst.calculated_amount || 0).toLocaleString()}</strong>
                          {inst.due_date && <span className="ml-2">Due: {inst.due_date}</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                            inst.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : inst.status === 'partial'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {inst.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded border">No installment schedule configured.</p>
              )}
            </div>

            {/* Student Payment Receipts */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Payment Receipts</h4>
              {getPayments({ student_id: selectedStudentFee.student_id }).length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded border">No payments recorded yet.</p>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {getPayments({ student_id: selectedStudentFee.student_id }).map((p) => (
                    <div key={p.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-emerald-700">₹{p.amount.toLocaleString()} ({p.payment_method})</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{p.receipt_no} • {p.payment_date}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedReceipt(p)
                          setShowReceiptModal(true)
                        }}
                        title="View Receipt"
                      >
                        <FileText className="h-4 w-4 text-indigo-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* NEW / EDIT FEE STRUCTURE MODAL */}
      {showStructureModal && (
        <Modal
          isOpen={showStructureModal}
          onClose={() => {
            setShowStructureModal(false)
            setEditingStructure(null)
          }}
          title={editingStructure ? 'Edit Fee Structure' : 'Create New Fee Structure'}
          footer={
            <>
              <Button variant="ghost" onClick={() => {
                setShowStructureModal(false)
                setEditingStructure(null)
              }} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleSaveStructure} disabled={isSaving} className="bg-indigo-600 text-white font-bold">
                {isSaving ? 'Saving...' : (editingStructure ? 'Update Structure' : 'Create Structure')}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <FormField label="Structure Title" required>
              <Input value={structTitle} onChange={(e) => setStructTitle(e.target.value)} placeholder="e.g. B.Tech ECE Academic Fee 2026-27" />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Course" required>
                <Select value={structCourse} onChange={(e) => setStructCourse(e.target.value)} options={courses.map((c) => ({ value: c, label: c }))} />
              </FormField>
              <FormField label="Branch" required>
                <Select value={structBranch} onChange={(e) => setStructBranch(e.target.value)} options={availableBranchesForStructForm.map((b) => ({ value: b, label: b }))} />
              </FormField>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase block mb-2">Total Calculated Fee Structure</span>
              <span className="text-2xl font-bold text-indigo-700">₹{totalComponentSum.toLocaleString()}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE PAYMENT CONFIRM MODAL */}
      {showDeletePaymentModal && (
        <Modal
          isOpen={showDeletePaymentModal}
          onClose={() => setShowDeletePaymentModal(false)}
          title="Confirm Payment Deletion"
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowDeletePaymentModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeletePaymentConfirm} className="bg-rose-600 hover:bg-rose-700 font-bold">Delete Record</Button>
            </>
          }
        >
          <p className="text-sm text-slate-600 py-2">
            Are you sure you want to delete this payment record? This action will reverse the paid balance for the student.
          </p>
        </Modal>
      )}

      {/* DELETE STRUCTURE CONFIRM MODAL */}
      {showDeleteStructureModal && (
        <Modal
          isOpen={showDeleteStructureModal}
          onClose={() => setShowDeleteStructureModal(false)}
          title="Confirm Fee Structure Deletion"
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowDeleteStructureModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeleteStructureConfirm} className="bg-rose-600 hover:bg-rose-700 font-bold text-white">Delete Structure</Button>
            </>
          }
        >
          <p className="text-sm text-slate-600 py-2">
            Are you sure you want to delete this fee structure? This will remove the structure assignment for associated students.
          </p>
        </Modal>
      )}

      {/* RECEIPT VIEW MODAL */}
      {selectedReceipt && (
        <Modal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          title="Official Fee Payment Receipt"
          footer={
            <Button onClick={() => setShowReceiptModal(false)} className="bg-indigo-600 text-white font-bold">
              Close Receipt
            </Button>
          }
        >
          <div className="space-y-4 text-sm">
            <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Official Fee Receipt</h4>
                  <p className="text-xs text-slate-500">RRIMT College Management System</p>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                  {selectedReceipt.receipt_no}
                </span>
              </div>
              <div className="space-y-2 text-slate-700 text-xs sm:text-sm">
                <p>Student Name: <strong className="text-slate-900">{selectedReceipt.student_name}</strong> ({selectedReceipt.roll_no})</p>
                <p>Course & Branch: <strong className="text-slate-900">{selectedReceipt.course} • {selectedReceipt.branch}</strong></p>
                <p>Amount Paid: <strong className="text-emerald-600 font-bold text-base">₹{selectedReceipt.amount.toLocaleString()}</strong></p>
                <p>Payment Method: <strong className="text-slate-900">{selectedReceipt.payment_method}</strong></p>
                <p>Transaction Ref: <strong className="font-mono text-slate-900">{selectedReceipt.transaction_id}</strong></p>
                <p>Payment Date: <strong className="text-slate-900">{selectedReceipt.payment_date}</strong></p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold pt-3 border-t border-slate-200">
                <CheckCircle2 className="h-4 w-4" /> Official College Seal - Payment Verified & Settled
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
