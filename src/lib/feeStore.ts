import { useState, useEffect } from 'react'
import { COURSES, BRANCHES_BY_COURSE, YEARS, academicStore, getTeacherForUser, isBranchMatch, isSemesterMatch } from './academicStore'
import { useAuth } from '../app/providers/AuthProvider'
import { supabase, isSupabaseConfigured } from './supabase'

// ============================================================
// TYPE DEFINITIONS — unchanged from existing UI expectations
// ============================================================

export interface FeeComponent {
  name: string
  amount: number
}

export interface FeeInstallment {
  id: string
  name: string
  type: 'percentage' | 'fixed'
  value: number // percentage number (e.g. 25) or fixed amount (e.g. 20000)
  calculated_amount: number
  due_date: string
  description?: string
  status?: 'paid' | 'partial' | 'due'
}

export interface FeeStructure {
  id: string
  title: string
  course: string
  branch: string
  year_semester: string
  total_amount: number
  components: FeeComponent[]
  installments: FeeInstallment[]
  created_at: string
  college_id?: string
}

export type PaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Bank Transfer'
  | 'Credit/Debit Card'
  | 'Online Payment'
  | 'Cheque'
  | 'Other'

export interface PaymentRecord {
  id: string
  receipt_no: string
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year_semester: string
  fee_structure_id: string
  student_fee_id?: string
  installment_id?: string
  installment_name?: string
  amount: number
  payment_method: PaymentMethod
  transaction_id: string
  payment_date: string
  remarks?: string
  status: 'Completed' | 'Pending' | 'Failed'
  created_at: string
  college_id?: string
  recorded_by?: string
}

export interface StudentFeeRecord {
  id: string
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year_semester: string
  section: string
  fee_structure_id: string
  fee_structure_title: string
  total_fee: number
  paid: number
  pending: number
  status: 'paid' | 'partial' | 'due'
  installments: FeeInstallment[]
  components?: FeeComponent[]
  college_id?: string
}

export const DEFAULT_FEE_STRUCTURES: FeeStructure[] = [
  {
    id: 'struct_btech',
    title: 'B.Tech Regular Fee Structure',
    course: 'B.Tech',
    branch: 'All Branches',
    year_semester: 'All Years',
    total_amount: 80000,
    components: [
      { name: 'Tuition & Academic Fee', amount: 52000 },
      { name: 'Laboratory & Practical Fee', amount: 12000 },
      { name: 'Examination & Evaluation Fee', amount: 8000 },
      { name: 'Library & E-Resources', amount: 4000 },
      { name: 'Development & Activity Fee', amount: 4000 },
    ],
    installments: [
      { id: 'inst_1', name: 'Semester 1 Installment', type: 'percentage', value: 50, calculated_amount: 40000, due_date: '2026-08-15', description: 'Term 1 Fee' },
      { id: 'inst_2', name: 'Semester 2 Installment', type: 'percentage', value: 50, calculated_amount: 40000, due_date: '2027-01-15', description: 'Term 2 Fee' },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'struct_diploma',
    title: 'Diploma Engineering Fee Structure',
    course: 'Diploma',
    branch: 'All Branches',
    year_semester: 'All Years',
    total_amount: 70000,
    components: [
      { name: 'Tuition & Academic Fee', amount: 45000 },
      { name: 'Laboratory & Practical Fee', amount: 12000 },
      { name: 'Examination & Evaluation Fee', amount: 7000 },
      { name: 'Library & E-Resources', amount: 3000 },
      { name: 'Development & Activity Fee', amount: 3000 },
    ],
    installments: [
      { id: 'inst_1', name: 'Semester 1 Installment', type: 'percentage', value: 50, calculated_amount: 35000, due_date: '2026-08-15', description: 'Term 1 Fee' },
      { id: 'inst_2', name: 'Semester 2 Installment', type: 'percentage', value: 50, calculated_amount: 35000, due_date: '2027-01-15', description: 'Term 2 Fee' },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'struct_mba',
    title: 'MBA Management Fee Structure',
    course: 'MBA',
    branch: 'All Branches',
    year_semester: 'All Years',
    total_amount: 90000,
    components: [
      { name: 'Tuition & Academic Fee', amount: 60000 },
      { name: 'Case Studies & Seminars', amount: 15000 },
      { name: 'Examination & Evaluation Fee', amount: 9000 },
      { name: 'Library & E-Resources', amount: 3000 },
      { name: 'Development & Activity Fee', amount: 3000 },
    ],
    installments: [
      { id: 'inst_1', name: 'Semester 1 Installment', type: 'percentage', value: 50, calculated_amount: 45000, due_date: '2026-08-15', description: 'Term 1 Fee' },
      { id: 'inst_2', name: 'Semester 2 Installment', type: 'percentage', value: 50, calculated_amount: 45000, due_date: '2027-01-15', description: 'Term 2 Fee' },
    ],
    created_at: new Date().toISOString(),
  },
]

export function findMatchingFeeStructure(
  student: { course?: string; branch?: string; year?: string; semester?: string },
  structures: FeeStructure[]
): FeeStructure {
  const customList = Array.isArray(structures) ? structures.filter((s) => s && s.id && !s.id.startsWith('struct_')) : []
  const candidateList = customList.length > 0 ? customList : (Array.isArray(structures) && structures.length > 0 ? structures : DEFAULT_FEE_STRUCTURES)

  const sCourse = (student.course || 'B.Tech').trim().toLowerCase()
  const sBranch = (student.branch || '').trim().toLowerCase()
  const sYear = (student.year || student.semester || '').trim().toLowerCase()
  const sSem = (student.semester || '').trim().toLowerCase()

  let bestStruct: FeeStructure | undefined = undefined
  let maxScore = -1

  for (const st of candidateList) {
    const stCourse = (st.course || '').trim().toLowerCase()
    const stBranch = (st.branch || '').trim().toLowerCase()
    const stYear = (st.year_semester || '').trim().toLowerCase()
    const stTitle = (st.title || '').trim().toLowerCase()

    // 1. Course matching
    let courseScore = 0
    if (stCourse === sCourse) {
      courseScore = 10
    } else if (stCourse === 'all' || stCourse === 'all courses' || !stCourse) {
      courseScore = 5
    } else if (sCourse.length > 0 && (stCourse.includes(sCourse) || sCourse.includes(stCourse))) {
      courseScore = 8
    } else {
      courseScore = 0
    }

    // 2. Branch matching
    let branchScore = 0
    if (stBranch === sBranch) {
      branchScore = 10
    } else if (isBranchMatch(st.branch, student.branch)) {
      branchScore = 9
    } else if (stTitle.length > 0 && sBranch.length > 0 && stTitle.includes(sBranch)) {
      branchScore = 7
    } else if (stBranch === 'all' || stBranch === 'all branches' || !stBranch) {
      branchScore = 5
    } else {
      branchScore = 1
    }

    // 3. Year/Semester matching
    let yearScore = 0
    if (stYear === sYear || stYear === sSem) {
      yearScore = 10
    } else if (isSemesterMatch(st.year_semester, student.year || student.semester)) {
      yearScore = 9
    } else if (stYear === 'all' || stYear === 'all years' || stYear === 'all semesters' || !stYear) {
      yearScore = 5
    } else {
      yearScore = 1
    }

    const totalScore = courseScore + branchScore + yearScore
    if (totalScore > maxScore) {
      maxScore = totalScore
      bestStruct = st
    }
  }

  const defaultMatch = DEFAULT_FEE_STRUCTURES.find((st) => (st.course || '').toLowerCase() === sCourse)
  return bestStruct || defaultMatch || DEFAULT_FEE_STRUCTURES[0]
}

export function calculateInstallmentStatuses(
  installments: FeeInstallment[],
  totalFee: number,
  paidAmount: number
): FeeInstallment[] {
  if (!installments || installments.length === 0) return []
  let runningPaid = Math.max(0, paidAmount)

  return installments.map((inst) => {
    let amt = Number(inst.calculated_amount) || 0
    if (!amt && inst.value && totalFee > 0) {
      amt = inst.type === 'percentage' ? Math.round((totalFee * inst.value) / 100) : Number(inst.value)
    }

    let instStatus: 'paid' | 'partial' | 'due' = 'due'
    let instPaid = 0

    if (amt > 0) {
      if (runningPaid >= amt) {
        instStatus = 'paid'
        instPaid = amt
        runningPaid -= amt
      } else if (runningPaid > 0) {
        instStatus = 'partial'
        instPaid = runningPaid
        runningPaid = 0
      } else {
        instStatus = 'due'
        instPaid = 0
      }
    }

    return {
      ...inst,
      calculated_amount: amt,
      paid_amount: instPaid,
      status: instStatus,
    }
  })
}

export function isPaymentForStudent(p: PaymentRecord, student: any): boolean {
  if (!p || !student) return false

  const clean = (val: any) => (val ? String(val).replace(/^(stu-|sf_|fee_|col\d+_)/i, '').trim().toLowerCase() : '')

  const pStudentId = clean(p.student_id)
  const pRollNo = clean(p.roll_no)
  const pName = (p.student_name || '').trim().toLowerCase()

  const sId = clean(student.id)
  const sStudentId = clean(student.student_id)
  const sProfileId = clean(student.profile_id)
  const sRollNo = clean(student.roll_no)
  const sName = (student.name || '').trim().toLowerCase()

  // 1. Direct or cleaned ID match
  if (pStudentId && (pStudentId === sId || pStudentId === sStudentId || pStudentId === sProfileId || pStudentId === sRollNo)) {
    return true
  }

  // 2. Roll number match
  if (pRollNo && (pRollNo === sRollNo || pRollNo === sStudentId || pRollNo === sId)) {
    return true
  }

  // 3. Name match (if non-generic)
  if (pName && sName && pName !== 'student' && sName !== 'student' && pName === sName) {
    return true
  }

  return false
}

// ============================================================
// INTERNAL STATE — Supabase is the source of truth
function loadLocalStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch (e) {
    return fallback
  }
}

function saveLocalStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    // ignore
  }
}

// ============================================================
// INTERNAL STATE — Supabase is the source of truth
// ============================================================

const listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach((l) => l())
}

let structuresState: FeeStructure[] = loadLocalStorage<FeeStructure[]>('eduth_fee_structures', DEFAULT_FEE_STRUCTURES)
let paymentsState: PaymentRecord[] = loadLocalStorage<PaymentRecord[]>('eduth_fee_payments', [])
let studentFeesState: StudentFeeRecord[] = []

let _lastFeeSyncTime = 0
let _loadedFeeCollege: string | null = null
let _inFlightFeeSync: Promise<void> | null = null
const FEE_CACHE_TTL_MS = 30000

export function invalidateFeeCache() {
  _lastFeeSyncTime = 0
}

// ============================================================
// SUPABASE SYNC — Fetch all fee data from Supabase
// ============================================================

export async function syncFeeDataWithSupabase(userCollegeId?: string, isSuperAdmin?: boolean) {
  if (!isSupabaseConfigured) return

  const targetCollege = isSuperAdmin ? 'SUPER_ADMIN' : (userCollegeId || 'COL001')

  if (_loadedFeeCollege === targetCollege && Date.now() - _lastFeeSyncTime < FEE_CACHE_TTL_MS) {
    return
  }

  if (_inFlightFeeSync) {
    return _inFlightFeeSync
  }

  _inFlightFeeSync = (async () => {
    try {
      // 1. Fetch fee structures
      const structQuery = supabase.from('fee_structures').select('*').order('created_at', { ascending: false })

      // 2. Fetch actual master student records from Supabase
      const stdQuery = supabase.from('students').select('*').order('roll_no', { ascending: true })

      // 3. Fetch payments
      const payQuery = supabase.from('fee_payments').select('*').order('created_at', { ascending: false })

      const [
        { data: dbStructures, error: structErr },
        { data: dbStudents, error: stdErr },
        { data: dbPayments, error: payErr },
      ] = await Promise.all([structQuery, stdQuery, payQuery])

    if (structErr) console.error('Supabase fee structures sync error:', structErr.message)
    if (stdErr) console.error('Supabase students sync error:', stdErr.message)
    if (payErr) console.error('Supabase fee payments sync error:', payErr.message)

    // Map fee structures: prioritize custom DB structures, fallback to default structures if empty
    const customDbStructs = (dbStructures && dbStructures.length > 0) ? (dbStructures as any[]).map((s) => ({
      id: s.id,
      title: s.title,
      course: s.course,
      branch: s.branch,
      year_semester: s.year_semester || 'All Years',
      total_amount: Number(s.total_amount) || 0,
      components: parseJsonField(s.components, []),
      installments: parseJsonField(s.installments, []),
      created_at: s.created_at || new Date().toISOString(),
      college_id: s.college_id,
    })) : []

    structuresState = customDbStructs.length > 0 ? customDbStructs : DEFAULT_FEE_STRUCTURES
    saveLocalStorage('eduth_fee_structures', structuresState)

    // Map payments
    if (dbPayments) {
      paymentsState = (dbPayments as any[]).map((p) => ({
        id: p.id,
        receipt_no: p.receipt_no || `REC-${p.id?.slice(0, 6) || '000000'}`,
        student_id: p.student_id,
        student_name: p.student_name || '',
        roll_no: p.roll_no || '',
        course: p.course || 'B.Tech',
        branch: p.branch || 'ECE',
        year_semester: p.year_semester || '1st Year',
        fee_structure_id: p.fee_structure_id || '',
        student_fee_id: p.student_fee_id || '',
        installment_id: p.installment_id || '',
        installment_name: p.installment_name || '',
        amount: Number(p.amount) || 0,
        payment_method: p.payment_method || 'Cash',
        transaction_id: p.transaction_id || '',
        payment_date: typeof p.payment_date === 'string' ? p.payment_date : new Date(p.payment_date).toISOString().split('T')[0],
        remarks: p.remarks || '',
        status: p.status || 'Completed',
        created_at: p.created_at || new Date().toISOString(),
        college_id: p.college_id,
        recorded_by: p.recorded_by || '',
      }))
      saveLocalStorage('eduth_fee_payments', paymentsState)
    }

    // Map student fees by combining local academicStore students and DB students with strict deduplication
    const localStudents = academicStore.getStudents() || []
    const combinedStudents: any[] = []
    
    // Add local students first
    localStudents.forEach((st) => {
      if (!st) return
      const name = (st.name || '').trim()
      const rollNo = (st.roll_no || '').trim()
      if (!name || name.toLowerCase() === 'student' || !rollNo) return
      combinedStudents.push(st)
    })

    // Add DB students avoiding duplicates
    if (dbStudents && Array.isArray(dbStudents)) {
      dbStudents.forEach((student) => {
        if (!student) return
        const name = (student.name || '').trim()
        const rollNo = (student.roll_no || '').trim()
        if (!name || name.toLowerCase() === 'student' || !rollNo) return

        const isDuplicate = combinedStudents.some((s) => {
          if (s.id === student.id) return true
          if (s.student_id && student.student_id && s.student_id === student.student_id) return true
          const norm1 = (s.roll_no || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
          const norm2 = (rollNo || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
          if (norm1 && norm2 && norm1 === norm2) return true
          if (s.email && student.email && s.email.toLowerCase().trim() === student.email.toLowerCase().trim()) return true
          return false
        })

        if (!isDuplicate) {
          combinedStudents.push(student)
        }
      })
    }

    // Auto-enrich paymentsState so all payments (agent, student, admin) have complete student name, roll_no, course, branch
    const studentLookupMap = new Map<string, any>()
    combinedStudents.forEach((st) => {
      if (st.id) studentLookupMap.set(st.id.toString().trim(), st)
      if (st.student_id) studentLookupMap.set(st.student_id.toString().trim(), st)
      if (st.roll_no) studentLookupMap.set(st.roll_no.toString().trim().toLowerCase(), st)
    })

    paymentsState = paymentsState.map((p) => {
      const pStudentId = (p.student_id || '').toString().trim()
      const pRollNo = (p.roll_no || '').toString().trim().toLowerCase()
      const matchedStudent = studentLookupMap.get(pStudentId) || studentLookupMap.get(pRollNo)

      const studentName =
        p.student_name && p.student_name.trim() !== '' && p.student_name.toLowerCase() !== 'student'
          ? p.student_name
          : (matchedStudent?.name || (p.roll_no ? `Student (${p.roll_no})` : 'Student'))

      const rollNo =
        p.roll_no && p.roll_no.trim() !== ''
          ? p.roll_no
          : (matchedStudent?.roll_no || p.student_id || 'N/A')

      const course = p.course || matchedStudent?.course || 'B.Tech'
      const branch = p.branch || matchedStudent?.branch || 'ECE'
      const yearSem = p.year_semester || matchedStudent?.year || matchedStudent?.semester || '1st Year'

      return {
        ...p,
        student_name: studentName,
        roll_no: rollNo,
        course,
        branch,
        year_semester: yearSem,
      }
    })

    if (combinedStudents.length > 0) {
      studentFeesState = combinedStudents.map((student) => {
        // Match fee structure using scored ranking algorithm
        const matchStruct = findMatchingFeeStructure(student, structuresState)

        // Find all completed payments for this student
        const studentPayments = paymentsState.filter((p) => {
          const isStatusMatch = !p.status || p.status.toLowerCase() === 'completed'
          if (!isStatusMatch) return false
          return isPaymentForStudent(p, student)
        })

        // Authoritative paid calculation = SUM of actual completed payment records
        const rawPaidAmount = studentPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
        // Authoritative total fee = student's applicable Fee Structure
        const totalFee = matchStruct ? Number(matchStruct.total_amount) || 0 : 0
        // Cap paid to fee structure total so student does not show as overpaid beyond their fee structure
        const paidAmount = totalFee > 0 ? Math.min(rawPaidAmount, totalFee) : rawPaidAmount
        // Due = max(Total Fee - Paid, 0)
        const pendingAmount = totalFee > 0 ? Math.max(0, totalFee - paidAmount) : 0

        let status: 'paid' | 'partial' | 'due' = 'due'
        if (totalFee > 0 && paidAmount >= totalFee) {
          status = 'paid'
        } else if (paidAmount > 0) {
          status = 'partial'
        } else {
          status = 'due'
        }

        const calculatedInstallments = calculateInstallmentStatuses(
          matchStruct?.installments || [],
          totalFee,
          paidAmount
        )

        return {
          id: `sf_${student.id}`,
          student_id: student.id,
          student_name: student.name,
          roll_no: student.roll_no,
          course: student.course || 'B.Tech',
          branch: student.branch || 'ECE',
          year_semester: student.year || student.semester || '1st Year',
          section: student.section || 'Section A',
          fee_structure_id: matchStruct?.id || '',
          fee_structure_title: matchStruct?.title || `${student.course || 'Course'} Fee Structure`,
          total_fee: totalFee,
          paid: paidAmount,
          pending: pendingAmount,
          status: status,
          installments: calculatedInstallments,
          components: matchStruct?.components || [],
          college_id: student.college_id,
        }
      })
    } else {
      studentFeesState = []
    }

      _lastFeeSyncTime = Date.now()
      _loadedFeeCollege = targetCollege
      notifyListeners()
    } catch (err) {
      console.error('Fee sync error:', err)
    } finally {
      _inFlightFeeSync = null
    }
  })()

  return _inFlightFeeSync
}

function parseJsonField<T>(field: any, fallback: T): T {
  if (Array.isArray(field)) return field as T
  if (typeof field === 'string') {
    try { return JSON.parse(field) } catch { return fallback }
  }
  return fallback
}

// ============================================================
// RESET
// ============================================================

export function resetFeeStore() {
  structuresState = []
  paymentsState = []
  studentFeesState = []
  notifyListeners()
}

// ============================================================
// STORE SINGLETON — All operations go through Supabase
// ============================================================

export const feeStore = {
  getStructures: () => structuresState,

  getStudentFees: (filters?: {
    course?: string
    branch?: string
    year_semester?: string
    section?: string
    status?: string
    search?: string
  }): StudentFeeRecord[] => {
    const validList = studentFeesState.filter(
      (sf) => sf && sf.student_name && sf.student_name.trim() !== '' && sf.student_name.toLowerCase() !== 'student' && sf.roll_no && sf.roll_no.trim() !== ''
    )
    if (!filters) return validList
    return validList.filter((sf) => {
      if (filters.course && filters.course !== 'All' && sf.course !== filters.course) return false
      if (filters.branch && filters.branch !== 'All' && !isBranchMatch(sf.branch, filters.branch)) return false
      if (filters.year_semester && filters.year_semester !== 'All' && sf.year_semester !== filters.year_semester) return false
      if (filters.section && filters.section !== 'All' && sf.section !== filters.section) return false
      if (filters.status && filters.status !== 'All' && sf.status !== filters.status) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const matchName = sf.student_name.toLowerCase().includes(q)
        const matchRoll = sf.roll_no.toLowerCase().includes(q)
        if (!matchName && !matchRoll) return false
      }
      return true
    })
  },

  getPayments: (filters?: {
    course?: string
    branch?: string
    year_semester?: string
    student_id?: string
    search?: string
  }): PaymentRecord[] => {
    // Return all valid payments (don't drop records with generic names or missing roll_no)
    const validPayments = paymentsState.filter((p) => p && p.id && (Number(p.amount) > 0 || p.receipt_no))
    if (!filters) return validPayments
    return validPayments.filter((p) => {
      if (filters.course && filters.course !== 'All' && p.course !== filters.course) return false
      if (filters.branch && filters.branch !== 'All' && !isBranchMatch(p.branch, filters.branch)) return false
      if (filters.year_semester && filters.year_semester !== 'All' && p.year_semester !== filters.year_semester) return false
      
      if (filters.student_id) {
        const targetStudent = feeStore.getStudentFeeDetail(filters.student_id)
        if (targetStudent) {
          if (!isPaymentForStudent(p, targetStudent)) return false
        } else {
          const filterId = filters.student_id.trim().toLowerCase()
          const cleanId = filterId.replace(/^(stu-|sf_|fee_|col\d+_)/i, '')
          const pStudentId = (p.student_id || '').trim().toLowerCase()
          const pRollNo = (p.roll_no || '').trim().toLowerCase()

          const isMatch =
            pStudentId === filterId ||
            pRollNo === filterId ||
            pRollNo === cleanId ||
            pStudentId === cleanId ||
            pStudentId.replace(/^(stu-|sf_|fee_|col\d+_)/i, '') === cleanId

          if (!isMatch) return false
        }
      }

      if (filters.search) {
        const q = filters.search.toLowerCase()
        const matchName = p.student_name.toLowerCase().includes(q)
        const matchRoll = p.roll_no.toLowerCase().includes(q)
        const matchReceipt = p.receipt_no.toLowerCase().includes(q)
        if (!matchName && !matchRoll && !matchReceipt) return false
      }
      return true
    })
  },

  getStudentFeeDetail: (studentId: string): StudentFeeRecord | undefined => {
    if (!studentId) return undefined
    const cleanId = studentId.replace(/^STU-/i, '')
    const lowerId = studentId.toLowerCase().trim()

    return studentFeesState.find((sf) => {
      if (sf.student_id === studentId || sf.id === studentId || sf.id === `sf_${studentId}`) return true
      if (sf.roll_no === studentId || sf.roll_no === cleanId) return true
      if (sf.roll_no && sf.roll_no.replace(/^STU-/i, '') === cleanId) return true
      const masterStud = academicStore.getStudents().find((st: any) => st.id === sf.student_id || st.student_id === sf.student_id)
      if (masterStud) {
        if (masterStud.profile_id === studentId) return true
        if (masterStud.email && masterStud.email.toLowerCase().trim() === lowerId) return true
        if (masterStud.parent_email && masterStud.parent_email.toLowerCase().trim() === lowerId) return true
      }
      return false
    })
  },

  getDashboardMetrics: () => {
    const totalFeesAmount = studentFeesState.reduce((sum, sf) => sum + sf.total_fee, 0)
    const totalCollectedAmount = studentFeesState.reduce((sum, sf) => sum + sf.paid, 0)
    const totalPendingAmount = Math.max(0, totalFeesAmount - totalCollectedAmount)

    const totalStudentsCount = studentFeesState.length || 1
    const paidStudentsCount = studentFeesState.filter((sf) => sf.status === 'paid' && sf.total_fee > 0).length
    const pendingStudentsCount = studentFeesState.filter((sf) => sf.pending > 0).length
    const partialStudentsCount = studentFeesState.filter((sf) => sf.status === 'partial').length
    const dueStudentsCount = studentFeesState.filter((sf) => sf.status === 'due' && sf.total_fee > 0).length

    const paidPercent = totalStudentsCount > 0 ? Math.round((paidStudentsCount / totalStudentsCount) * 100) : 0
    const pendingPercent = totalStudentsCount > 0 ? Math.round((pendingStudentsCount / totalStudentsCount) * 100) : 0
    const duePercent = totalStudentsCount > 0 ? Math.round((dueStudentsCount / totalStudentsCount) * 100) : 0

    return {
      totalFeesAmount,
      totalCollectedAmount,
      totalPendingAmount,
      totalCollected: totalCollectedAmount,
      totalPending: totalPendingAmount,
      totalExpected: totalFeesAmount,
      paidCount: paidStudentsCount,
      partialCount: partialStudentsCount,
      dueCount: dueStudentsCount,
      paidStudentsCount,
      pendingStudentsCount,
      partialStudentsCount,
      dueStudentsCount,
      totalStudentsCount,
      paidPercent,
      pendingPercent,
      duePercent,
    }
  },

  // ============================================================
  // SAVE FEE STRUCTURE — Upsert to Supabase + auto-generate student_fees
  // ============================================================
  saveStructure: async (structure: Omit<FeeStructure, 'id' | 'created_at'> & { id?: string }) => {
    const structureId = structure.id || crypto.randomUUID()
    const now = new Date().toISOString()

    const targetStructure: FeeStructure = {
      ...structure,
      id: structureId,
      created_at: now,
      college_id: structure.college_id || '',
    } as FeeStructure

    // 1. Immediately update local in-memory reactive state so UI reflects changes without delay
    const existingIdx = structuresState.findIndex((s) => s.id === structureId)
    if (existingIdx >= 0) {
      structuresState[existingIdx] = targetStructure
    } else {
      structuresState = [targetStructure, ...structuresState]
    }
    notifyListeners()

    if (isSupabaseConfigured) {
      // 2. Upsert fee structure to Supabase
      const { error } = await supabase.from('fee_structures').upsert([{
        id: targetStructure.id,
        college_id: targetStructure.college_id,
        title: targetStructure.title,
        course: targetStructure.course,
        branch: targetStructure.branch,
        year_semester: targetStructure.year_semester,
        total_amount: targetStructure.total_amount,
        components: targetStructure.components,
        installments: targetStructure.installments,
      }])

      if (error) {
        console.error('Supabase fee_structures save error:', error.message)
        throw new Error(error.message)
      }

      // 3. Auto-generate student_fees for matching students
      try {
        await supabase.rpc('generate_student_fees_for_structure', {
          p_fee_structure_id: targetStructure.id,
        })
      } catch (rpcErr) {
        console.warn('Could not auto-generate student fees via RPC, will generate locally:', rpcErr)
        // Fallback: manually generate student_fees from existing students
        await generateStudentFeesLocally(targetStructure)
      }

      // 4. Re-sync to get full refreshed data
      await syncFeeDataWithSupabase(targetStructure.college_id)
    }

    return targetStructure
  },

  // ============================================================
  // DELETE FEE STRUCTURE
  // ============================================================
  deleteStructure: async (id: string, collegeId?: string) => {
    structuresState = structuresState.filter((s) => s.id !== id)
    studentFeesState = studentFeesState.filter((sf) => sf.fee_structure_id !== id)
    notifyListeners()

    if (isSupabaseConfigured) {
      try {
        await supabase.from('student_fees').delete().eq('fee_structure_id', id)
      } catch (err) {
        console.warn('Optional student_fees delete skipped:', err)
      }
      const { error } = await supabase.from('fee_structures').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
      invalidateFeeCache()
      await syncFeeDataWithSupabase(collegeId)
    }
  },

  // ============================================================
  // RECORD PAYMENT — Insert to Supabase + recalculate student_fees
  // ============================================================
  recordPayment: async (payment: Omit<PaymentRecord, 'id' | 'receipt_no' | 'created_at'> & { id?: string }) => {
    // 1. Resolve student fee record & applicable Fee Structure
    const studentFee = feeStore.getStudentFeeDetail(payment.student_id) || studentFeesState.find((sf) => isPaymentForStudent(payment as any, sf as any))
    const totalFee = studentFee ? studentFee.total_fee : 80000

    // Sum existing completed payments for this student (excluding current payment if updating)
    const existingPayments = paymentsState.filter((p) => {
      if (payment.id && p.id === payment.id) return false
      const isStatusMatch = !p.status || p.status.toLowerCase() === 'completed'
      if (!isStatusMatch) return false
      return isPaymentForStudent(p, { id: payment.student_id, roll_no: payment.roll_no, student_id: payment.student_id })
    })
    const existingPaid = existingPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    const newAmount = Number(payment.amount) || 0
    const maxAllowed = totalFee > 0 ? Math.max(0, totalFee - existingPaid) : 0

    // STRICT CEILING PROTECTION (Requirement #6)
    if (totalFee > 0 && newAmount > maxAllowed) {
      throw new Error(
        maxAllowed <= 0
          ? `Payment rejected: Student fee of ₹${totalFee.toLocaleString()} is already fully paid.`
          : `Payment rejected: Payment amount of ₹${newAmount.toLocaleString()} exceeds maximum allowed payment of ₹${maxAllowed.toLocaleString()} (Total Fee: ₹${totalFee.toLocaleString()}, Total Paid: ₹${existingPaid.toLocaleString()}).`
      )
    }



    const paymentId = payment.id || crypto.randomUUID()
    const receiptNo = (payment as any).receipt_no || `REC-${new Date().getFullYear()}-${String(paymentsState.length + 1).padStart(4, '0')}`
    const now = new Date().toISOString()

    const newPayment: PaymentRecord = {
      ...payment,
      id: paymentId,
      receipt_no: receiptNo,
      student_fee_id: studentFee?.id || payment.student_fee_id,
      created_at: now,
      college_id: payment.college_id,
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('fee_payments').upsert([{
        id: newPayment.id,
        college_id: newPayment.college_id,
        student_id: newPayment.student_id,
        fee_structure_id: newPayment.fee_structure_id || null,
        receipt_no: newPayment.receipt_no,
        student_name: newPayment.student_name,
        roll_no: newPayment.roll_no,
        course: newPayment.course,
        branch: newPayment.branch,
        year_semester: newPayment.year_semester,
        installment_id: newPayment.installment_id || null,
        installment_name: newPayment.installment_name || null,
        amount: newPayment.amount,
        payment_method: newPayment.payment_method,
        transaction_id: newPayment.transaction_id,
        payment_date: newPayment.payment_date,
        remarks: newPayment.remarks || null,
        status: newPayment.status,
        recorded_by: newPayment.recorded_by || null,
      }])

      if (error) {
        throw new Error(error.message)
      }

      invalidateFeeCache()
      await syncFeeDataWithSupabase(newPayment.college_id)
    } else {
      // Offline fallback
      paymentsState = [newPayment, ...paymentsState]

      // Update local student_fees
      studentFeesState = studentFeesState.map((sf) => {
        if (sf.student_id === payment.student_id) {
          const newPaid = sf.paid + payment.amount
          const newPending = Math.max(0, sf.total_fee - newPaid)
          const newStatus: 'paid' | 'partial' | 'due' = newPending === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'due'
          return { ...sf, paid: newPaid, pending: newPending, status: newStatus }
        }
        return sf
      })
      notifyListeners()
    }

    return newPayment
  },

  // ============================================================
  // DELETE PAYMENT — Delete from Supabase + recalculate
  // ============================================================
  deletePayment: async (id: string, collegeId?: string) => {
    const payment = paymentsState.find((p) => p.id === id)

    // Instantly remove from local state
    paymentsState = paymentsState.filter((p) => p.id !== id)
    notifyListeners()

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('fee_payments').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }

      invalidateFeeCache()
      await syncFeeDataWithSupabase(collegeId || payment?.college_id)
    }
  },

  updatePayment: async (paymentId: string, updates: Partial<PaymentRecord>, collegeId?: string) => {
    const payment = paymentsState.find((p) => p.id === paymentId)

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('fee_payments')
        .update(updates)
        .eq('id', paymentId)

      if (error) {
        throw new Error(error.message)
      }

      invalidateFeeCache()
      await syncFeeDataWithSupabase(collegeId || payment?.college_id)
    } else {
      paymentsState = paymentsState.map((p) => (p.id === paymentId ? { ...p, ...updates } : p))
      notifyListeners()
    }
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx >= 0) listeners.splice(idx, 1)
    }
  },
}

// ============================================================
// FALLBACK: Generate student fees locally when RPC not available
// ============================================================

async function generateStudentFeesLocally(structure: FeeStructure) {
  if (!isSupabaseConfigured || !structure.college_id) return

  // Fetch matching students
  let query = supabase
    .from('students')
    .select('id, name, roll_no, course, branch, year, section, college_id')
    .eq('college_id', structure.college_id)
    .eq('course', structure.course)

  if (structure.branch && structure.branch !== 'All') {
    query = query.eq('branch', structure.branch)
  }
  if (structure.year_semester && structure.year_semester !== 'All' && structure.year_semester !== 'All Years') {
    query = query.eq('year', structure.year_semester)
  }

  const { data: matchingStudents } = await query

  if (!matchingStudents || matchingStudents.length === 0) return

  const studentFeeRows = matchingStudents.map((s: any) => ({
    id: crypto.randomUUID(),
    college_id: s.college_id,
    student_id: s.id,
    fee_structure_id: structure.id,
    student_name: s.name,
    roll_no: s.roll_no,
    course: s.course,
    branch: s.branch,
    year_semester: s.year || structure.year_semester,
    section: s.section || 'Section A',
    total_amount: structure.total_amount,
    paid_amount: 0,
    due_amount: structure.total_amount,
    status: 'due',
    installments: structure.installments,
  }))

  // Upsert (ignore conflicts on student_id + fee_structure_id)
  const { error } = await supabase.from('student_fees').upsert(studentFeeRows, {
    onConflict: 'student_id,fee_structure_id',
    ignoreDuplicates: true,
  })

  if (error) {
    console.warn('Failed to generate student fees locally:', error.message)
  }
}

// ============================================================
// REACT HOOK — useFeeStore
// ============================================================

export function useFeeStore() {
  const [, setTick] = useState(0)
  let userContext: any = null

  try {
    const auth = useAuth()
    userContext = auth.user
  } catch {
    // Fallback
  }

  const userCollege = userContext?.college_id || userContext?.school_id
  const isSuperAdmin = userContext?.role === 'super_admin'

  useEffect(() => {
    syncFeeDataWithSupabase(userCollege, isSuperAdmin)
    const unsubscribe = feeStore.subscribe(() => {
      setTick((prev) => prev + 1)
    })
    return unsubscribe
  }, [userContext?.id, userCollege, isSuperAdmin])

  // College scoping (applied on the already-fetched data)
  const isCollegeMatch = (itemCollegeId?: string) => {
    if (isSuperAdmin) return true
    if (!itemCollegeId || !userCollege) return true // allow if no college_id set
    return itemCollegeId === userCollege
  }

  const rawStructures = feeStore.getStructures()
  const rawPayments = feeStore.getPayments()

  const scopedStructures = isSuperAdmin ? rawStructures : rawStructures.filter((s) => isCollegeMatch(s.college_id))
  let scopedPayments = isSuperAdmin ? rawPayments : rawPayments.filter((p) => isCollegeMatch(p.college_id))
  let scopedStudentFees = feeStore.getStudentFees()

  // Role-based filtering
  if (userContext?.role === 'student') {
    const sId = userContext.student_id || userContext.id
    const userRollNo = (userContext as any)?.roll_no || (userContext?.email ? userContext.email.split('@')[0] : '')
    scopedStudentFees = scopedStudentFees.filter(
      (sf) => sf.student_id === sId || sf.id === sId || sf.id === `sf_${sId}` || (userRollNo && sf.roll_no === userRollNo)
    )
    scopedPayments = scopedPayments.filter(
      (p) => p.student_id === sId || p.student_id === userContext.id || (userRollNo && (p.roll_no === userRollNo || p.student_id === userRollNo))
    )
  } else if (userContext?.role === 'parent') {
    const cId = userContext.child_student_id || userContext.student_id
    const childRollNo = userContext.child_roll_no || (cId ? cId.replace(/^STU-/i, '') : '')
    scopedStudentFees = scopedStudentFees.filter(
      (sf) => (cId && (sf.student_id === cId || sf.id === cId || sf.id === `sf_${cId}`)) || (childRollNo && sf.roll_no === childRollNo)
    )
    scopedPayments = scopedPayments.filter(
      (p) => (cId && p.student_id === cId) || (childRollNo && (p.roll_no === childRollNo || p.student_id === childRollNo))
    )
  } else if (userContext?.role === 'teacher') {
    const currentTeacher = getTeacherForUser(userContext, academicStore.getTeachers(), academicStore.getClasses())
    if (currentTeacher) {
      const rawClasses = academicStore.getClasses()
      const rawStudents = academicStore.getStudents()
      const userEmailLower = currentTeacher.email?.toLowerCase().trim()

      const teacherClasses = rawClasses.filter((c) => {
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

      const assignedStudentIds = new Set<string>()
      rawStudents.forEach((s) => {
        if (!s) return
        const sCourse = s.course || ''
        const sBranch = s.branch || ''
        const sYear = s.year || ''
        const sSection = s.section || ''

        const matchClassObj = teacherClasses.some(
          (c) =>
            sCourse === c.course &&
            sBranch === c.branch &&
            sYear === c.year &&
            (!c.section || c.section === 'All Sections' || sSection === c.section || (c.name && c.name.includes(sSection)))
        )
        if (matchClassObj) {
          assignedStudentIds.add(s.id)
          if (s.student_id) assignedStudentIds.add(s.student_id)
          return
        }

        const assigned = currentTeacher.assigned_classes || []
        if (assigned.length === 0) return

        const secClean = sSection.replace(/^Section\s+/i, '').trim()
        const sClassName = s.class_name || ''

        const isMatch = assigned.some((ac) => {
          if (!ac) return false
          if (ac === sClassName || ac === s.id) return true
          if (sClassName && (ac.includes(sClassName) || sClassName.includes(ac))) return true
          const norm = ac.toLowerCase()
          const matchCourse = sCourse && norm.includes(sCourse.toLowerCase())
          const matchBranch = sBranch && norm.includes(sBranch.toLowerCase())
          const matchYear = sYear && norm.includes(sYear.toLowerCase())
          const matchSec = !secClean || norm.includes(secClean.toLowerCase())
          return matchCourse && matchBranch && matchYear && matchSec
        })
        if (isMatch) {
          assignedStudentIds.add(s.id)
          if (s.student_id) assignedStudentIds.add(s.student_id)
        }
      })

      scopedStudentFees = scopedStudentFees.filter((sf) => assignedStudentIds.has(sf.student_id) || assignedStudentIds.has(sf.id))
      scopedPayments = scopedPayments.filter((p) => assignedStudentIds.has(p.student_id))
    }
  }

  return {
    structures: scopedStructures,
    studentFees: scopedStudentFees,
    payments: scopedPayments,
    getStudentFees: feeStore.getStudentFees,
    getPayments: feeStore.getPayments,
    getStudentFeeDetail: feeStore.getStudentFeeDetail,
    getDashboardMetrics: feeStore.getDashboardMetrics,
    saveStructure: feeStore.saveStructure,
    deleteStructure: feeStore.deleteStructure,
    recordPayment: feeStore.recordPayment,
    deletePayment: feeStore.deletePayment,
    updatePayment: feeStore.updatePayment,
    courses: COURSES,
    branchesByCourse: BRANCHES_BY_COURSE,
    years: YEARS,
  }
}
