import { useState, useMemo } from 'react'
import {
  DataTable,
  Button,
  Modal,
  Select,
  SearchInput,
  AvatarInitials,
} from '../../components/ui'
import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, getTeacherForUser, isBranchMatch } from '../../lib/academicStore'
import {
  useFeeStore,
  type PaymentRecord,
  type StudentFeeRecord,
} from '../../lib/feeStore'
import {
  IndianRupee,
  Wallet,
  Receipt,
  CheckCircle2,
  Clock,
  Eye,
  Download,
  Users,
  History,
} from 'lucide-react'
import type { Column } from '../../components/ui/DataTable'
import { exportToCSV } from '../../lib/exportUtils'

export function TeacherFeesPage() {
  const { user } = useAuth()
  
  const { teachers, classes } = useAcademicStore()
  const {
    studentFees,
    payments,
    getPayments,
  } = useFeeStore()

  // 1. Resolve current teacher profile
  const currentTeacher = useMemo(() => {
    return getTeacherForUser(user, teachers, classes)
  }, [user, teachers, classes])

  // 2. Identify assigned classes
  const assignedClasses = useMemo(() => {
    if (!currentTeacher) return []
    const userEmailLower = currentTeacher.email?.toLowerCase().trim()
    return classes.filter((c) => {
      if (!c) return false
      const cTeacherId = c.teacher_id?.toLowerCase().trim()
      const isTeacherMatch =
        (c.teacher_id && c.teacher_id === currentTeacher.teacher_id) ||
        (userEmailLower && cTeacherId === userEmailLower) ||
        (currentTeacher.name && c.teacher_name?.includes(currentTeacher.name))

      if (isTeacherMatch) return true

      const cName = c.name || ''
      const cCourse = (c.course || '').toLowerCase()
      const cBranch = (c.branch || '').toLowerCase()
      const cYear = (c.year || '').toLowerCase()

      return (currentTeacher.assigned_classes || []).some((ac) => {
        if (!ac) return false
        const normAc = ac.toLowerCase()
        if (cName && (ac.includes(cName) || cName.includes(ac))) return true
        if (cCourse && cBranch && cYear) {
          return normAc.includes(cCourse) && normAc.includes(cBranch) && normAc.includes(cYear)
        }
        return false
      })
    })
  }, [classes, currentTeacher])

  // Sub-tab Navigation
  const [activeTab, setActiveTab] = useState<'student-fees' | 'payment-history'>('student-fees')

  // Search & Filter States
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('All')
  const [branchFilter, setBranchFilter] = useState('All')
  const [yearFilter] = useState('All')
  const [sectionFilter, setSectionFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)

  // Modals state
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  // Selected items for modals
  const [selectedStudentFee, setSelectedStudentFee] = useState<StudentFeeRecord | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null)

  // Filter options strictly derived from teacher's assigned student records
  const availableCourses = useMemo(() => {
    const set = new Set((studentFees || []).map((s) => s?.course).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [studentFees])

  const availableBranches = useMemo(() => {
    let filtered = studentFees || []
    if (courseFilter !== 'All') filtered = filtered.filter((s) => s?.course === courseFilter)
    const set = new Set(filtered.map((s) => s?.branch).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [studentFees, courseFilter])

  const availableSections = useMemo(() => {
    let filtered = studentFees || []
    if (courseFilter !== 'All') filtered = filtered.filter((s) => s?.course === courseFilter)
    if (branchFilter !== 'All') filtered = filtered.filter((s) => s?.branch === branchFilter)
    const set = new Set(filtered.map((s) => s?.section || 'Section A'))
    return ['All', ...Array.from(set)]
  }, [studentFees, courseFilter, branchFilter])

  // Calculate Metrics exclusively for assigned students
  const metrics = useMemo(() => {
    const list = studentFees || []
    const totalFeesAmount = list.reduce((sum, sf) => sum + (sf?.total_fee || 0), 0)
    const totalCollectedAmount = list.reduce((sum, sf) => sum + (sf?.paid || 0), 0)
    const totalPendingAmount = Math.max(0, totalFeesAmount - totalCollectedAmount)

    const totalStudentsCount = list.length
    const paidStudentsCount = list.filter((sf) => sf?.status === 'paid' && (sf?.total_fee || 0) > 0).length
    const partialStudentsCount = list.filter((sf) => sf?.status === 'partial').length
    const dueStudentsCount = list.filter((sf) => sf?.status === 'due' && (sf?.total_fee || 0) > 0).length

    return {
      totalFeesAmount,
      totalCollectedAmount,
      totalPendingAmount,
      totalStudentsCount,
      paidStudentsCount,
      partialStudentsCount,
      dueStudentsCount,
    }
  }, [studentFees])

  // Filtered Student Fees List
  const filteredStudentFees = useMemo(() => {
    return (studentFees || []).filter((sf) => {
      if (!sf) return false
      if (courseFilter !== 'All' && sf.course !== courseFilter) return false
      if (branchFilter !== 'All' && !isBranchMatch(sf.branch, branchFilter)) return false
      if (yearFilter !== 'All' && sf.year_semester !== yearFilter) return false
      if (sectionFilter !== 'All' && sf.section !== sectionFilter) return false
      if (statusFilter !== 'All' && sf.status !== statusFilter) return false

      if (search) {
        const q = search.toLowerCase()
        const matchName = (sf.student_name || '').toLowerCase().includes(q)
        const matchRoll = (sf.roll_no || '').toLowerCase().includes(q)
        if (!matchName && !matchRoll) return false
      }
      return true
    })
  }, [studentFees, courseFilter, branchFilter, yearFilter, sectionFilter, statusFilter, search])

  // Filtered Payments List for History
  const filteredPayments = useMemo(() => {
    return (payments || []).filter((p) => {
      if (!p) return false
      if (courseFilter !== 'All' && p.course !== courseFilter) return false
      if (branchFilter !== 'All' && !isBranchMatch(p.branch, branchFilter)) return false
      if (yearFilter !== 'All' && p.year_semester !== yearFilter) return false
      if (search) {
        const q = search.toLowerCase()
        const matchName = (p.student_name || '').toLowerCase().includes(q)
        const matchRoll = (p.roll_no || '').toLowerCase().includes(q)
        const matchReceipt = (p.receipt_no || '').toLowerCase().includes(q)
        if (!matchName && !matchRoll && !matchReceipt) return false
      }
      return true
    })
  }, [payments, courseFilter, branchFilter, yearFilter, search])

  // Handle Receipt Preview
  const handleViewReceipt = (payment: PaymentRecord) => {
    setSelectedReceipt(payment)
    setShowReceiptModal(true)
  }

  // Handle Export CSV
  const handleExportCSV = () => {
    if (activeTab === 'student-fees') {
      const exportData = filteredStudentFees.map((sf) => ({
        Student: sf.student_name,
        'Roll No': sf.roll_no,
        Course: sf.course,
        Branch: sf.branch,
        Year: sf.year_semester,
        Section: sf.section,
        'Total Fee (₹)': sf.total_fee,
        'Paid (₹)': sf.paid,
        'Pending (₹)': sf.pending,
        Status: sf.status.toUpperCase(),
      }))
      exportToCSV(`Assigned_Students_Fees_${new Date().toISOString().split('T')[0]}`, exportData)
    } else {
      const exportData = filteredPayments.map((p) => ({
        'Receipt No': p.receipt_no,
        Student: p.student_name,
        'Roll No': p.roll_no,
        Course: p.course,
        Branch: p.branch,
        'Year/Sem': p.year_semester,
        'Amount (₹)': p.amount,
        Method: p.payment_method,
        'Txn ID': p.transaction_id,
        Date: p.payment_date,
        'Collected By': p.recorded_by || 'Teacher',
        Status: p.status,
      }))
      exportToCSV(`Fee_Payments_History_${new Date().toISOString().split('T')[0]}`, exportData)
    }
  }

  // Student Fees Table Columns
  const studentFeeColumns: Column<StudentFeeRecord>[] = [
    {
      key: 'student_name',
      header: 'Student',
      render: (r) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={r.student_name} size="sm" />
          <div>
            <p className="font-medium text-ink-900 text-sm">{r.student_name}</p>
            <p className="text-xs text-ink-400 font-mono">{r.roll_no}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'class_info',
      header: 'Class & Section',
      render: (r) => (
        <div className="text-xs">
          <p className="font-semibold text-ink-800">{r.course} — {r.branch}</p>
          <p className="text-ink-400">{r.year_semester} ({r.section})</p>
        </div>
      ),
    },
    {
      key: 'total_fee',
      header: 'Total Fee',
      render: (r) => <span className="font-semibold text-ink-900">₹{r.total_fee.toLocaleString()}</span>,
    },
    {
      key: 'paid',
      header: 'Paid',
      render: (r) => <span className="font-semibold text-emerald-600">₹{r.paid.toLocaleString()}</span>,
    },
    {
      key: 'pending',
      header: 'Pending',
      render: (r) => (
        <span className={`font-semibold ${r.pending > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
          ₹{r.pending.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        const badgeMap = {
          paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          partial: 'bg-amber-50 text-amber-700 border-amber-200',
          due: 'bg-rose-50 text-rose-700 border-rose-200',
        }
        return (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeMap[r.status]}`}>
            {r.status.toUpperCase()}
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedStudentFee(r)
              setShowDetailModal(true)
            }}
            className="gap-1 border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            title="View Ledger Details"
          >
            <Eye className="h-3.5 w-3.5" />
            View Ledger
          </Button>
        </div>
      ),
    },
  ]

  // Payment History Table Columns
  const paymentHistoryColumns: Column<PaymentRecord>[] = [
    {
      key: 'receipt_no',
      header: 'Receipt No',
      render: (r) => <span className="font-mono text-xs font-semibold text-brand-600">{r.receipt_no}</span>,
    },
    {
      key: 'student_name',
      header: 'Student',
      render: (r) => (
        <div>
          <p className="font-medium text-ink-900 text-sm">{r.student_name}</p>
          <p className="text-xs text-ink-400 font-mono">{r.roll_no}</p>
        </div>
      ),
    },
    {
      key: 'class_info',
      header: 'Class',
      render: (r) => (
        <span className="text-xs text-ink-600">
          {r.course} {r.branch} ({r.year_semester})
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (r) => <span className="font-bold text-emerald-600">₹{r.amount.toLocaleString()}</span>,
    },
    {
      key: 'payment_method',
      header: 'Method',
      render: (r) => <span className="text-xs font-medium text-ink-700">{r.payment_method}</span>,
    },
    {
      key: 'transaction_id',
      header: 'Txn / Ref ID',
      render: (r) => <span className="font-mono text-xs text-ink-500">{r.transaction_id}</span>,
    },
    {
      key: 'payment_date',
      header: 'Date',
      render: (r) => <span className="text-xs text-ink-600">{r.payment_date}</span>,
    },
    {
      key: 'recorded_by',
      header: 'Collected By',
      render: (r) => (
        <span className="text-xs text-slate-600 font-medium">{r.recorded_by || 'Faculty Member'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Receipt',
      render: (r) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleViewReceipt(r)}
          className="gap-1 text-xs"
        >
          <Receipt className="h-3.5 w-3.5 text-slate-500" />
          Receipt
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900 flex items-center gap-2">
            <IndianRupee className="h-6 w-6 text-indigo-600" />
            Fees Management
          </h1>
          <p className="text-sm text-ink-500 mt-0.5">
            Fee collection & ledgers for assigned classes{' '}
            <span className="font-medium text-indigo-600">
              ({assignedClasses.map((c) => c.name).join(', ') || 'No Assigned Classes'})
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Metrics Cards — Exclusively for Assigned Students */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-2xs">
          <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
            <span>Assigned Students</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-ink-900 mt-2">{metrics.totalStudentsCount}</p>
          <p className="text-[11px] text-ink-400 mt-1">Across assigned classes</p>
        </div>

        <div className="p-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-2xs">
          <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
            <span>Total Expected Fee</span>
            <Wallet className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-ink-900 mt-2">₹{metrics.totalFeesAmount.toLocaleString()}</p>
          <p className="text-[11px] text-ink-400 mt-1">Class fee structure total</p>
        </div>

        <div className="p-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-2xs">
          <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
            <span>Total Collected</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">₹{metrics.totalCollectedAmount.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600/80 font-medium mt-1">
            {metrics.paidStudentsCount} Fully Paid • {metrics.partialStudentsCount} Partial
          </p>
        </div>

        <div className="p-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-2xs">
          <div className="flex items-center justify-between text-ink-500 text-xs font-medium">
            <span>Total Pending Fee</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">₹{metrics.totalPendingAmount.toLocaleString()}</p>
          <p className="text-[11px] text-amber-600/80 font-medium mt-1">
            {metrics.dueStudentsCount} Students pending
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-border flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('student-fees')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'student-fees'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-ink-500 hover:text-ink-900'
            }`}
          >
            Assigned Student Fees ({filteredStudentFees.length})
          </button>

          <button
            onClick={() => setActiveTab('payment-history')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payment-history'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-ink-500 hover:text-ink-900'
            }`}
          >
            <History className="h-4 w-4" />
            Payment History ({filteredPayments.length})
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-surface rounded-[var(--radius-card)] border border-border space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <SearchInput
            placeholder="Search student or roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2"
          />

          <Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="All">All Courses</option>
            {availableCourses.filter((c) => c !== 'All').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>

          <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="All">All Branches</option>
            {availableBranches.filter((b) => b !== 'All').map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </Select>

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Fee Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="due">Due</option>
          </Select>
        </div>

        {availableSections.length > 2 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-ink-400 font-medium">Filter Section:</span>
            {availableSections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSectionFilter(sec)}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  sectionFilter === sec
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab 1: Student Fees Table */}
      {activeTab === 'student-fees' && (
        <DataTable
          columns={studentFeeColumns}
          data={filteredStudentFees}
          page={page}
          pageSize={10}
          onPageChange={setPage}
          emptyText="No assigned students found matching your criteria."
        />
      )}

      {/* Tab 2: Payment History Table */}
      {activeTab === 'payment-history' && (
        <DataTable
          columns={paymentHistoryColumns}
          data={filteredPayments}
          page={page}
          pageSize={10}
          onPageChange={setPage}
          emptyText="No payment history records found for your assigned students."
        />
      )}



      {/* Student Fee Detail Modal */}
      {showDetailModal && selectedStudentFee && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`Student Fee Ledger — ${selectedStudentFee.student_name}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-400">Roll No:</span> <span className="font-semibold text-slate-800">{selectedStudentFee.roll_no}</span></div>
                <div><span className="text-slate-400">Course & Branch:</span> <span className="font-semibold text-slate-800">{selectedStudentFee.course} ({selectedStudentFee.branch})</span></div>
                <div><span className="text-slate-400">Year / Sem:</span> <span className="font-semibold text-slate-800">{selectedStudentFee.year_semester}</span></div>
                <div><span className="text-slate-400">Section:</span> <span className="font-semibold text-slate-800">{selectedStudentFee.section}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded border">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Fee</p>
                  <p className="text-sm font-bold text-slate-900">₹{selectedStudentFee.total_fee.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 uppercase font-semibold">Total Paid</p>
                  <p className="text-sm font-bold text-emerald-700">₹{selectedStudentFee.paid.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 p-2 rounded border border-amber-100">
                  <p className="text-[10px] text-amber-600 uppercase font-semibold">Pending Due</p>
                  <p className="text-sm font-bold text-amber-700">₹{selectedStudentFee.pending.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Payment History for this Student */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Recorded Payments</h4>
              {getPayments({ student_id: selectedStudentFee.student_id }).length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded border">No payment records found yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {getPayments({ student_id: selectedStudentFee.student_id }).map((p) => (
                    <div key={p.id} className="p-2.5 bg-white border border-slate-200 rounded-md flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-800">₹{p.amount.toLocaleString()} ({p.payment_method})</p>
                        <p className="text-[10px] text-slate-400">{p.payment_date} • Txn: {p.transaction_id}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleViewReceipt(p)}>
                        <Receipt className="h-3.5 w-3.5 text-indigo-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Printable Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <Modal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          title="Payment Receipt"
        >
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-4 font-sans text-xs">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">EduFlow Institution</h3>
                <p className="text-slate-500">Official Fee Payment Acknowledgment</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-indigo-600 text-sm">{selectedReceipt.receipt_no}</p>
                <p className="text-slate-400">{selectedReceipt.payment_date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded">
              <div><span className="text-slate-400">Student Name:</span> <span className="font-bold text-slate-800">{selectedReceipt.student_name}</span></div>
              <div><span className="text-slate-400">Roll No:</span> <span className="font-bold text-slate-800">{selectedReceipt.roll_no}</span></div>
              <div><span className="text-slate-400">Course & Branch:</span> <span className="font-medium text-slate-700">{selectedReceipt.course} {selectedReceipt.branch}</span></div>
              <div><span className="text-slate-400">Year/Sem:</span> <span className="font-medium text-slate-700">{selectedReceipt.year_semester}</span></div>
            </div>

            <div className="border rounded p-3 space-y-1">
              <div className="flex justify-between font-bold text-sm text-emerald-700">
                <span>Amount Paid:</span>
                <span>₹{selectedReceipt.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Method:</span>
                <span>{selectedReceipt.payment_method}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Transaction ID:</span>
                <span className="font-mono">{selectedReceipt.transaction_id}</span>
              </div>
              {selectedReceipt.remarks && (
                <div className="flex justify-between text-slate-500 pt-1 border-t">
                  <span>Remarks:</span>
                  <span>{selectedReceipt.remarks}</span>
                </div>
              )}
            </div>

            <div className="text-right pt-2 text-[10px] text-slate-400">
              Collected & Verified by: <span className="font-semibold text-slate-600">{selectedReceipt.recorded_by || 'Faculty Member'}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setShowReceiptModal(false)}>
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  window.print()
                }}
                className="gap-1 bg-indigo-600 text-white"
              >
                <Download className="h-3.5 w-3.5" />
                Print / Download
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
