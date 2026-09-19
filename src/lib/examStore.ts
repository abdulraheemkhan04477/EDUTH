import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { useAuth } from '../app/providers/AuthProvider'
import { academicStore, normalizeCollegeId } from './academicStore'

export type ExamType = 'Test' | 'Sessional Exam' | 'PUT' | 'Mid Term' | 'End Semester' | string
export type ExamStatus = 'Draft' | 'Scheduled' | 'Ongoing' | 'Completed' | 'Results Pending' | 'Published' | 'upcoming' | 'completed'

export interface ExamSubjectRecord {
  id: string
  college_id?: string
  exam_id: string
  subject_id?: string
  subject_name: string
  subject_code: string
  date: string
  start_time: string
  end_time: string
  room_number?: string
  max_marks: number
  passing_marks: number
  created_at?: string
  updated_at?: string
}

export interface ExamRecord {
  id: string
  college_id?: string
  title: string
  type: ExamType
  course: string
  branch?: string
  year?: string
  semester?: string
  section?: string
  subject?: string
  academic_session?: string
  date: string
  end_date?: string
  start_time?: string
  end_time?: string
  max_marks?: number
  passing_marks?: number
  description?: string
  status: ExamStatus
  created_by?: string
  created_at: string
  updated_at?: string
  subjects?: ExamSubjectRecord[]
}

export interface ExamResultRecord {
  id: string
  college_id?: string
  exam_id: string
  exam_subject_id?: string
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year: string
  semester: string
  section: string
  subject: string
  max_marks: number
  obtained_marks: number
  passing_marks: number
  percentage: number
  grade: string
  grade_point: number
  remarks?: string
  status: 'Pass' | 'Fail' | 'Absent' | 'Pending'
  is_published: boolean
  published_date?: string
  published_by?: string
  entered_by?: string
  created_at?: string
  updated_at?: string
}

// Centralized Grading Function
export function calculateGradeAndPoint(obtained: number, max: number, passing: number): { grade: string; gradePoint: number; status: 'Pass' | 'Fail' } {
  if (max <= 0) return { grade: 'F', gradePoint: 0.0, status: 'Fail' }
  const pct = Math.round((obtained / max) * 100)
  const isPass = obtained >= passing

  let grade = 'F'
  let gradePoint = 0.0

  if (pct >= 90) {
    grade = 'A+'
    gradePoint = 4.0
  } else if (pct >= 80) {
    grade = 'A'
    gradePoint = 3.7
  } else if (pct >= 70) {
    grade = 'B+'
    gradePoint = 3.3
  } else if (pct >= 60) {
    grade = 'B'
    gradePoint = 3.0
  } else if (pct >= 50) {
    grade = 'C'
    gradePoint = 2.5
  } else if (pct >= 40) {
    grade = 'D'
    gradePoint = 2.0
  } else {
    grade = 'F'
    gradePoint = 0.0
  }

  return {
    grade,
    gradePoint,
    status: isPass ? 'Pass' : 'Fail',
  }
}

export const isValidUUID = (str?: string) => Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str))

// Local Storage Caching Fallback
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

const listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach((l) => l())
}

const defaultExamsData: ExamRecord[] = [
  {
    id: 'ex_midterm_101',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    title: 'Mid-Term Examination 2026',
    type: 'Mid Term',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    academic_session: '2026-2027',
    date: '2026-09-20',
    start_time: '09:30 AM',
    end_time: '12:30 PM',
    max_marks: 100,
    passing_marks: 40,
    description: 'Official mid-semester written examination for B.Tech ECE 1st Year students.',
    status: 'Published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ex_unittest_101',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    title: 'Internal Unit Test 1',
    type: 'Internal Test',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    academic_session: '2026-2027',
    date: '2026-09-05',
    start_time: '10:00 AM',
    end_time: '11:30 AM',
    max_marks: 50,
    passing_marks: 20,
    description: 'Unit test evaluation for foundational subjects.',
    status: 'Published',
    created_at: new Date().toISOString(),
  }
]

const defaultSubjectsData: ExamSubjectRecord[] = [
  {
    id: 'es_math_101',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    exam_id: 'ex_midterm_101',
    subject_name: 'Engineering Mathematics-I',
    subject_code: 'BAS-101',
    date: '2026-09-20',
    start_time: '09:30 AM',
    end_time: '12:30 PM',
    room_number: 'Hall 101',
    max_marks: 100,
    passing_marks: 40,
  },
  {
    id: 'es_phy_101',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    exam_id: 'ex_midterm_101',
    subject_name: 'Engineering Physics',
    subject_code: 'BAS-102',
    date: '2026-09-22',
    start_time: '09:30 AM',
    end_time: '12:30 PM',
    room_number: 'Hall 102',
    max_marks: 100,
    passing_marks: 40,
  },
  {
    id: 'es_elec_101',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    exam_id: 'ex_midterm_101',
    subject_name: 'Basic Electrical Engineering',
    subject_code: 'BEE-101',
    date: '2026-09-24',
    start_time: '09:30 AM',
    end_time: '12:30 PM',
    room_number: 'Hall 103',
    max_marks: 100,
    passing_marks: 40,
  },
  {
    id: 'es_prog_101',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    exam_id: 'ex_midterm_101',
    subject_name: 'Computer Programming & C',
    subject_code: 'BCS-101',
    date: '2026-09-26',
    start_time: '09:30 AM',
    end_time: '12:30 PM',
    room_number: 'Lab 2',
    max_marks: 100,
    passing_marks: 40,
  }
]

const defaultResultsData: ExamResultRecord[] = [
  {
    id: 'res_default_1',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    exam_id: 'ex_midterm_101',
    exam_subject_id: 'es_math_101',
    student_id: 'STU001',
    student_name: 'Student',
    roll_no: 'STU001',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    subject: 'Engineering Mathematics-I',
    max_marks: 100,
    obtained_marks: 88,
    passing_marks: 40,
    percentage: 88,
    grade: 'A',
    grade_point: 3.7,
    remarks: 'Excellent problem solving skills',
    status: 'Pass',
    is_published: true,
    published_date: '2026-09-13',
  },
  {
    id: 'res_default_2',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    exam_id: 'ex_midterm_101',
    exam_subject_id: 'es_phy_101',
    student_id: 'STU001',
    student_name: 'Student',
    roll_no: 'STU001',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    subject: 'Engineering Physics',
    max_marks: 100,
    obtained_marks: 82,
    passing_marks: 40,
    percentage: 82,
    grade: 'A',
    grade_point: 3.7,
    remarks: 'Very good analytical concepts',
    status: 'Pass',
    is_published: true,
    published_date: '2026-09-13',
  },
  {
    id: 'res_default_3',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    exam_id: 'ex_midterm_101',
    exam_subject_id: 'es_elec_101',
    student_id: 'STU001',
    student_name: 'Student',
    roll_no: 'STU001',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    subject: 'Basic Electrical Engineering',
    max_marks: 100,
    obtained_marks: 91,
    passing_marks: 40,
    percentage: 91,
    grade: 'A+',
    grade_point: 4.0,
    remarks: 'Outstanding performance',
    status: 'Pass',
    is_published: true,
    published_date: '2026-09-13',
  },
  {
    id: 'res_default_4',
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    exam_id: 'ex_midterm_101',
    exam_subject_id: 'es_prog_101',
    student_id: 'STU001',
    student_name: 'Student',
    roll_no: 'STU001',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    subject: 'Computer Programming & C',
    max_marks: 100,
    obtained_marks: 95,
    passing_marks: 40,
    percentage: 95,
    grade: 'A+',
    grade_point: 4.0,
    remarks: 'Top scorer in coding lab',
    status: 'Pass',
    is_published: true,
    published_date: '2026-09-13',
  }
]

let rawExams = loadLocalStorage<ExamRecord[]>('eduth_exams_v3', defaultExamsData)
let examsState: ExamRecord[] = rawExams.length > 0 ? rawExams : defaultExamsData

let rawSubjects = loadLocalStorage<ExamSubjectRecord[]>('eduth_exam_subjects_v3', defaultSubjectsData)
let examSubjectsState: ExamSubjectRecord[] = rawSubjects.length > 0 ? rawSubjects : defaultSubjectsData

let rawResults = loadLocalStorage<ExamResultRecord[]>('eduth_results_v3', defaultResultsData)
let resultsState: ExamResultRecord[] = (rawResults.length > 0 ? rawResults : defaultResultsData).map((r) => ({
  ...r,
  is_published: true,
}))

export function resetExamStore() {
  examsState = []
  examSubjectsState = []
  resultsState = []
  _lastExamSyncTime = 0
  _loadedExamCollege = null
  _inFlightExamSync = null
  saveLocalStorage('eduth_exams_v3', examsState)
  saveLocalStorage('eduth_exam_subjects_v3', examSubjectsState)
  saveLocalStorage('eduth_results_v3', resultsState)
  notifyListeners()
}

let _lastExamSyncTime = 0
let _loadedExamCollege: string | null = null
let _inFlightExamSync: Promise<void> | null = null
const EXAM_CACHE_TTL_MS = 30000

export function invalidateExamCache() {
  _lastExamSyncTime = 0
}

export async function fetchStudentPublishedResultsFromSupabase(studentIds: string[]): Promise<ExamResultRecord[]> {
  if (!isSupabaseConfigured || !studentIds || studentIds.length === 0) return []
  const validIds = Array.from(new Set(studentIds.filter(Boolean)))
  if (validIds.length === 0) return []

  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .in('student_id', validIds)

    if (error || !data) return []

    const formatted = data
      .filter((r: any) => Boolean(r.is_published) || Boolean(r.published) || String(r.is_published) === 'true' || String(r.published) === 'true')
      .map((r: any) => {
        const maxM = Number(r.max_marks) || 100
        const obtM = Number(r.obtained_marks ?? r.marks) || 0
        const passM = Number(r.passing_marks) || 40
        const pct = Math.round((obtM / maxM) * 100)
        const calc = calculateGradeAndPoint(obtM, maxM, passM)

        return {
          id: r.id,
          college_id: r.college_id,
          exam_id: r.exam_id,
          exam_subject_id: r.exam_subject_id,
          student_id: r.student_id,
          student_name: r.student_name || '',
          roll_no: r.roll_no || '',
          course: r.course || 'B.Tech',
          branch: r.branch || 'ECE',
          year: r.year || '1st Year',
          semester: r.semester || 'Semester 1',
          section: r.section || 'Section A',
          subject: resolveSubjectName(r.subject, r.exam_subject_id),
          max_marks: maxM,
          obtained_marks: obtM,
          passing_marks: passM,
          percentage: Number(r.percentage) || pct,
          grade: r.grade || calc.grade,
          grade_point: Number(r.grade_point) || calc.gradePoint,
          remarks: r.remarks || '',
          status: (r.status || calc.status) as any,
          is_published: true,
          published_date: r.published_date,
          published_by: r.published_by,
          entered_by: r.entered_by,
          created_at: r.created_at || new Date().toISOString(),
          updated_at: r.updated_at,
        }
      })

    if (formatted.length > 0) {
      const map = new Map<string, ExamResultRecord>()
      resultsState.forEach((item) => map.set(item.id, item))
      formatted.forEach((item) => map.set(item.id, item))

      resultsState = Array.from(map.values())
      saveLocalStorage('eduth_results_v3', resultsState)
      notifyListeners()
    }

    return formatted
  } catch (e) {
    return []
  }
}

export async function syncExamsWithSupabase(userCollegeId?: string, isSuperAdmin?: boolean) {
  if (!isSupabaseConfigured) return

  const normCollegeId = normalizeCollegeId(userCollegeId)
  const targetCollege = isSuperAdmin ? 'SUPER_ADMIN' : (normCollegeId || userCollegeId || 'COL001')

  if (_loadedExamCollege === targetCollege && examsState.length > 0 && Date.now() - _lastExamSyncTime < EXAM_CACHE_TTL_MS) {
    return
  }

  if (_inFlightExamSync) {
    return _inFlightExamSync
  }

  _inFlightExamSync = (async () => {
    try {
      let userCtx: any = null
      try {
        const authStr = typeof window !== 'undefined' ? (localStorage.getItem('eduth_authenticated_user') || localStorage.getItem('eduth_auth_user')) : null
        if (authStr) userCtx = JSON.parse(authStr)
      } catch {}

      const isStudentOrParent = Boolean(userCtx && (userCtx.role === 'student' || userCtx.role === 'parent'))
      const isStaff = Boolean(userCtx && ['admin', 'teacher', 'super_admin', 'staff', 'principal', 'accountant', 'management', 'dean'].includes(userCtx.role))

      let examQuery = supabase.from('exams').select('*').order('created_at', { ascending: false }).limit(200)
      let subjectQuery = supabase.from('exam_subjects').select('*').limit(500)

      const matchingColleges = Array.from(
        new Set([normCollegeId, userCollegeId, '13695a78-0105-4bde-bc85-d664bb66637e'].filter(Boolean) as string[])
      )

      if (!isSuperAdmin && matchingColleges.length > 0) {
        if (matchingColleges.length === 1) {
          examQuery = examQuery.eq('college_id', matchingColleges[0])
          subjectQuery = subjectQuery.eq('college_id', matchingColleges[0])
        } else {
          examQuery = examQuery.in('college_id', matchingColleges)
          subjectQuery = subjectQuery.in('college_id', matchingColleges)
        }
      }

      let studentIdsToMatch: string[] = []
      if (isStudentOrParent) {
        const sId = userCtx.role === 'student' ? (userCtx.student_id || userCtx.id) : (userCtx.child_student_id || userCtx.student_id)
        const rollNo = userCtx.roll_no || userCtx.child_roll_no
        const email = userCtx.email
        const allStuds = academicStore.getStudents()
        const matchedS = allStuds.find((s: any) =>
          (sId && (s.id === sId || s.student_id === sId || s.roll_no === sId || `STU-${s.roll_no}` === sId || sId.replace(/^STU-/i, '') === s.roll_no)) ||
          (rollNo && (s.id === rollNo || s.student_id === rollNo || s.roll_no === rollNo)) ||
          (email && ((s.email && s.email.toLowerCase().trim() === email.toLowerCase().trim()) || (s.parent_email && s.parent_email.toLowerCase().trim() === email.toLowerCase().trim())))
        )

        const idsSet = new Set<string>()
        const addVal = (v?: string) => {
          if (!v) return
          const str = String(v).trim()
          if (!str) return
          idsSet.add(str)
          const stripped = str.replace(/^STU-/i, '')
          if (stripped) {
            idsSet.add(stripped)
            idsSet.add(`STU-${stripped}`)
          }
        }

        addVal(userCtx.id)
        addVal(userCtx.student_id)
        addVal(userCtx.child_student_id)
        addVal(userCtx.roll_no)
        addVal(userCtx.child_roll_no)
        if (matchedS) {
          addVal(matchedS.id)
          addVal(matchedS.profile_id)
          addVal(matchedS.student_id)
          addVal(matchedS.roll_no)
        }

        studentIdsToMatch = Array.from(idsSet)
      }

      // For student/parent, fetch targeted results via indexed query directly
      let resQuery = null
      if (isStudentOrParent && studentIdsToMatch.length > 0) {
        await fetchStudentPublishedResultsFromSupabase(studentIdsToMatch)
      } else if (isStaff || isSuperAdmin) {
        let q = supabase.from('results').select('*').limit(200)
        if (!isSuperAdmin && matchingColleges.length > 0) {
          q = matchingColleges.length === 1 ? q.eq('college_id', matchingColleges[0]) : q.in('college_id', matchingColleges)
        }
        resQuery = q
      }

      const [examRes, subjRes, resultsRes] = await Promise.allSettled([
        Promise.resolve(examQuery),
        Promise.resolve(subjectQuery),
        resQuery ? Promise.resolve(resQuery) : Promise.resolve({ data: null, error: null })
      ])

      const dbExams = examRes.status === 'fulfilled' ? (examRes.value as any)?.data : null
      const examErr = examRes.status === 'fulfilled' ? (examRes.value as any)?.error : (examRes as any).reason
      const dbSubjects = subjRes.status === 'fulfilled' ? (subjRes.value as any)?.data : null
      const subjErr = subjRes.status === 'fulfilled' ? (subjRes.value as any)?.error : (subjRes as any).reason
      const dbResults = resultsRes.status === 'fulfilled' ? (resultsRes.value as any)?.data : null
      const resErr = resultsRes.status === 'fulfilled' ? (resultsRes.value as any)?.error : (resultsRes as any).reason

      if (examErr) console.warn('Supabase exams fetch notice:', (examErr as any).message || examErr)
      if (subjErr) console.warn('Supabase exam subjects fetch notice:', (subjErr as any).message || subjErr)
      if (resErr && !resErr.message?.includes('timeout')) console.warn('Supabase results fetch notice:', (resErr as any).message || resErr)

      if (dbSubjects && dbSubjects.length > 0) {
        examSubjectsState = (dbSubjects as any[]).map((s) => ({
          id: s.id,
          college_id: s.college_id,
          exam_id: s.exam_id,
          subject_id: s.subject_id,
          subject_name: resolveSubjectName(s.subject_name, s.id || s.subject_id),
          subject_code: s.subject_code || '',
          date: s.date || new Date().toISOString().split('T')[0],
          start_time: s.start_time || '09:30 AM',
          end_time: s.end_time || '12:30 PM',
          room_number: s.room_number || '',
          max_marks: Number(s.max_marks) || 100,
          passing_marks: Number(s.passing_marks) || 40,
          created_at: s.created_at,
          updated_at: s.updated_at,
        }))
        saveLocalStorage('eduth_exam_subjects_v3', examSubjectsState)
      }

      if (dbExams && dbExams.length > 0) {
        examsState = (dbExams as any[]).map((e) => ({
          id: e.id,
          college_id: e.college_id,
          title: e.title,
          type: e.type || 'Sessional Exam',
          course: e.course || 'B.Tech',
          branch: e.branch || 'ECE',
          year: e.year || '1st Year',
          semester: e.semester || 'Semester 1',
          section: e.section || 'Section A',
          subject: e.subject || '',
          academic_session: e.academic_session || '2026-2027',
          date: e.date || (e.start_date ? new Date(e.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          end_date: e.end_date,
          start_time: e.start_time || '09:30 AM',
          end_time: e.end_time || '12:30 PM',
          max_marks: Number(e.max_marks) || 100,
          passing_marks: Number(e.passing_marks) || 40,
          description: e.description || '',
          status: (e.status || 'upcoming') as ExamStatus,
          created_by: e.created_by,
          created_at: e.created_at || new Date().toISOString(),
          updated_at: e.updated_at,
          subjects: examSubjectsState.filter((s) => s.exam_id === e.id),
        }))
        saveLocalStorage('eduth_exams_v3', examsState)
      }

      if (dbResults && dbResults.length > 0) {
        const mappedDbResults = (dbResults as any[]).map((r) => {
          const maxM = Number(r.max_marks) || 100
          const obtM = Number(r.obtained_marks ?? r.marks) || 0
          const passM = Number(r.passing_marks) || 40
          const pct = Math.round((obtM / maxM) * 100)
          const calc = calculateGradeAndPoint(obtM, maxM, passM)

          return {
            id: r.id,
            college_id: r.college_id,
            exam_id: r.exam_id,
            exam_subject_id: r.exam_subject_id,
            student_id: r.student_id,
            student_name: r.student_name || '',
            roll_no: r.roll_no || '',
            course: r.course || 'B.Tech',
            branch: r.branch || 'ECE',
            year: r.year || '1st Year',
            semester: r.semester || 'Semester 1',
            section: r.section || 'Section A',
            subject: resolveSubjectName(r.subject, r.exam_subject_id),
            max_marks: maxM,
            obtained_marks: obtM,
            passing_marks: passM,
            percentage: Number(r.percentage) || pct,
            grade: r.grade || calc.grade,
            grade_point: Number(r.grade_point) || calc.gradePoint,
            remarks: r.remarks || '',
            status: (r.status || calc.status) as any,
            is_published: r.is_published === true || r.published === true,
            published_date: r.published_date,
            published_by: r.published_by,
            entered_by: r.entered_by,
            created_at: r.created_at || new Date().toISOString(),
            updated_at: r.updated_at,
          }
        })

        const resultMap = new Map<string, ExamResultRecord>()
        resultsState.forEach((item) => resultMap.set(item.id, item))
        mappedDbResults.forEach((item) => resultMap.set(item.id, item))

        resultsState = Array.from(resultMap.values()).sort(
          (a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime()
        )
        saveLocalStorage('eduth_results_v3', resultsState)
      } else if (isStudentOrParent && studentIdsToMatch.length > 0) {
        await fetchStudentPublishedResultsFromSupabase(studentIdsToMatch)
      }

      _lastExamSyncTime = Date.now()
      _loadedExamCollege = targetCollege
      notifyListeners()
    } catch (err) {
      // Ignore error
    } finally {
      _inFlightExamSync = null
    }
  })()

  return _inFlightExamSync
}

export const resolveSubjectName = (subjectOrId?: string, examSubjectId?: string): string => {
  if (!subjectOrId && !examSubjectId) return 'Subject'
  const isValidUUID = (str?: string) => Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str))

  if (subjectOrId && !isValidUUID(subjectOrId)) {
    return subjectOrId
  }

  try {
    const matchEs = examSubjectsState.find((es) => es.id === examSubjectId || es.id === subjectOrId || es.subject_id === subjectOrId)
    if (matchEs && matchEs.subject_name && !isValidUUID(matchEs.subject_name)) {
      return matchEs.subject_name
    }
  } catch {}

  try {
    const allSubjects = academicStore.getSubjects()
    const match = allSubjects.find((s) => s.id === subjectOrId || s.id === examSubjectId || s.code === subjectOrId)
    if (match && match.name && !isValidUUID(match.name)) {
      return match.name
    }
  } catch {}

  try {
    if (examSubjectId) {
      const matchEs2 = examSubjectsState.find((es) => es.subject_id === examSubjectId)
      if (matchEs2 && matchEs2.subject_name && !isValidUUID(matchEs2.subject_name)) {
        return matchEs2.subject_name
      }
    }
  } catch {}

  if (subjectOrId && isValidUUID(subjectOrId)) {
    return 'Subject'
  }

  return subjectOrId || 'Subject'
}

export const examStore = {
  getExams: (): ExamRecord[] => examsState,
  getExamSubjects: (): ExamSubjectRecord[] => examSubjectsState,
  getResults: (): ExamResultRecord[] => resultsState,

  saveExam: async (exam: Omit<ExamRecord, 'id' | 'created_at'> & { id?: string; college_id?: string; subjects?: Omit<ExamSubjectRecord, 'id' | 'exam_id'>[] }) => {
    const normCollegeId = normalizeCollegeId(exam.college_id) || '13695a78-0105-4bde-bc85-d664bb66637e'
    const id = exam.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'exam_' + Date.now())
    const targetExam: ExamRecord = {
      ...exam,
      id,
      college_id: normCollegeId,
      academic_session: exam.academic_session || '2026-2027',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      const isValidUUID = (str?: string) => Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str))
      const createdByUuid = isValidUUID(exam.created_by) ? exam.created_by : null

      const { error } = await supabase.from('exams').upsert([{
        id: targetExam.id,
        college_id: normCollegeId,
        title: targetExam.title,
        type: targetExam.type,
        course: targetExam.course,
        branch: targetExam.branch,
        year: targetExam.year,
        semester: targetExam.semester,
        section: targetExam.section,
        subject: targetExam.subject,
        academic_session: targetExam.academic_session,
        date: targetExam.date,
        start_date: targetExam.date,
        end_date: targetExam.end_date || targetExam.date,
        start_time: targetExam.start_time,
        end_time: targetExam.end_time,
        max_marks: targetExam.max_marks,
        passing_marks: targetExam.passing_marks,
        description: targetExam.description,
        status: targetExam.status,
        created_by: createdByUuid,
        updated_at: new Date().toISOString(),
      }])

      if (error) {
        console.error('Supabase saveExam failed:', error.message)
        throw new Error(error.message)
      }

      // If subject papers are passed, insert or update them in exam_subjects
      if (exam.subjects && exam.subjects.length > 0) {
        const dbSubjs = exam.subjects.map((sub) => {
          const rawId = (sub as any).id
          const validId = rawId && isValidUUID(rawId)
            ? rawId
            : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-9000-' + Date.now().toString(16).padStart(12, '0'))
          return {
            id: validId,
            college_id: normCollegeId,
            exam_id: targetExam.id,
            subject_name: sub.subject_name,
            subject_code: sub.subject_code,
            date: sub.date,
            start_time: sub.start_time || '09:30 AM',
            end_time: sub.end_time || '12:30 PM',
            room_number: sub.room_number || '',
            max_marks: sub.max_marks,
            passing_marks: sub.passing_marks,
            updated_at: new Date().toISOString(),
          }
        })

        const { error: subjErr } = await supabase.from('exam_subjects').upsert(dbSubjs)
        if (subjErr) console.warn('Exam subject upsert notice:', subjErr.message)
      }
    }

    const existingIndex = examsState.findIndex((e) => e.id === targetExam.id)
    if (existingIndex >= 0) {
      examsState[existingIndex] = targetExam
    } else {
      examsState = [targetExam, ...examsState]
    }

    saveLocalStorage('eduth_exams_v3', examsState)
    invalidateExamCache()
    notifyListeners()
    await syncExamsWithSupabase(normCollegeId)
    return targetExam
  },

  saveExamSubject: async (subject: Omit<ExamSubjectRecord, 'id'> & { id?: string }) => {
    const normCollegeId = normalizeCollegeId(subject.college_id) || '13695a78-0105-4bde-bc85-d664bb66637e'
    const id = subject.id && isValidUUID(subject.id)
      ? subject.id
      : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-9000-' + Date.now().toString(16).padStart(12, '0'))
    const targetSub: ExamSubjectRecord = {
      ...subject,
      id,
      college_id: normCollegeId,
      updated_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('exam_subjects').upsert([{
        id: targetSub.id,
        college_id: normCollegeId,
        exam_id: targetSub.exam_id,
        subject_id: targetSub.subject_id,
        subject_name: targetSub.subject_name,
        subject_code: targetSub.subject_code,
        date: targetSub.date,
        start_time: targetSub.start_time,
        end_time: targetSub.end_time,
        room_number: targetSub.room_number,
        max_marks: targetSub.max_marks,
        passing_marks: targetSub.passing_marks,
        updated_at: targetSub.updated_at,
      }])

      if (error) {
        throw new Error(error.message)
      }
    }

    const idx = examSubjectsState.findIndex((s) => s.id === targetSub.id)
    if (idx >= 0) {
      examSubjectsState[idx] = targetSub
    } else {
      examSubjectsState.push(targetSub)
    }

    saveLocalStorage('eduth_exam_subjects_v3', examSubjectsState)
    invalidateExamCache()
    notifyListeners()
    return targetSub
  },

  deleteExamSubject: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('exam_subjects').delete().eq('id', id)
      if (error) throw new Error(error.message)
    }
    examSubjectsState = examSubjectsState.filter((s) => s.id !== id)
    saveLocalStorage('eduth_exam_subjects_v3', examSubjectsState)
    notifyListeners()
  },

  deleteExam: async (id: string) => {
    if (isSupabaseConfigured) {
      // First delete subjects & results safely
      await supabase.from('exam_subjects').delete().eq('exam_id', id)
      await supabase.from('results').delete().eq('exam_id', id)
      const { error } = await supabase.from('exams').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    examsState = examsState.filter((e) => e.id !== id)
    examSubjectsState = examSubjectsState.filter((s) => s.exam_id !== id)
    resultsState = resultsState.filter((r) => r.exam_id !== id)
    saveLocalStorage('eduth_exams_v3', examsState)
    saveLocalStorage('eduth_exam_subjects_v3', examSubjectsState)
    saveLocalStorage('eduth_results_v3', resultsState)
    notifyListeners()
  },

  saveResultBatch: async (
    examId: string,
    batch: Array<{
      student_id: string
      student_name: string
      roll_no: string
      course: string
      branch: string
      year: string
      semester: string
      section: string
      subject: string
      max_marks: number
      obtained_marks: number
      passing_marks: number
      remarks?: string
      is_published?: boolean
      college_id?: string
      exam_subject_id?: string
      entered_by?: string
    }>
  ) => {
    const updatedRecords: ExamResultRecord[] = []
    const dbPayload: any[] = []

    const isValidUUID = (str?: string) => Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str))

    batch.forEach((item) => {
      // Strict mark boundaries
      const maxM = Math.max(1, item.max_marks)
      const obtM = Math.min(Math.max(0, item.obtained_marks), maxM)
      const passM = item.passing_marks
      const pct = Math.round((obtM / maxM) * 100)
      const calc = calculateGradeAndPoint(obtM, maxM, passM)

      const existingIdx = resultsState.findIndex(
        (r) => r.exam_id === examId && (r.student_id === item.student_id || (item.roll_no && r.roll_no === item.roll_no)) && ((item.exam_subject_id && r.exam_subject_id === item.exam_subject_id) || r.subject === item.subject)
      )

      const existingRecord = existingIdx >= 0 ? resultsState[existingIdx] : null
      const published = item.is_published ?? (existingRecord ? Boolean(existingRecord.is_published) : false)
      
      const recordId = existingRecord
        ? existingRecord.id
        : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'))

      // Safe resolution for exam_subject_id to avoid results_exam_subject_id_fkey foreign key constraint failure
      let validExamSubjId: string | null = null
      if (item.exam_subject_id && isValidUUID(item.exam_subject_id)) {
        if (examSubjectsState.some((es) => es.id === item.exam_subject_id)) {
          validExamSubjId = item.exam_subject_id
        }
      }
      if (!validExamSubjId && item.subject) {
        const matchEs = examSubjectsState.find(
          (es) => es.exam_id === examId && es.subject_name.toLowerCase() === item.subject.toLowerCase() && isValidUUID(es.id)
        )
        if (matchEs) {
          validExamSubjId = matchEs.id
        }
      }

      const normCollege = normalizeCollegeId(item.college_id || (existingRecord ? existingRecord.college_id : undefined)) || '13695a78-0105-4bde-bc85-d664bb66637e'

      // Safe resolution for student_id to match students(id) FK in Supabase DB
      let resolvedStudentId = item.student_id
      const allStuds = academicStore.getStudents()
      const matchStud = allStuds.find(
        (s: any) =>
          s.id === item.student_id ||
          s.student_id === item.student_id ||
          (item.roll_no && s.roll_no === item.roll_no)
      )
      if (matchStud && matchStud.id) {
        resolvedStudentId = matchStud.id
      }

      const record: ExamResultRecord = {
        id: recordId,
        college_id: normCollege,
        exam_id: examId,
        exam_subject_id: validExamSubjId || undefined,
        student_id: resolvedStudentId,
        student_name: item.student_name,
        roll_no: item.roll_no,
        course: item.course,
        branch: item.branch,
        year: item.year,
        semester: item.semester,
        section: item.section,
        subject: item.subject,
        max_marks: maxM,
        obtained_marks: obtM,
        passing_marks: passM,
        percentage: pct,
        grade: calc.grade,
        grade_point: calc.gradePoint,
        remarks: item.remarks || (calc.status === 'Pass' ? 'Good' : 'Needs Improvement'),
        status: calc.status,
        is_published: published,
        published_date: published ? (existingRecord && existingRecord.published_date ? existingRecord.published_date : new Date().toISOString().split('T')[0]) : undefined,
        entered_by: item.entered_by || (existingRecord ? existingRecord.entered_by : undefined),
        updated_at: new Date().toISOString(),
      }

      updatedRecords.push(record)

      const entryUuid = isValidUUID(record.entered_by) ? record.entered_by : null

      dbPayload.push({
        id: record.id,
        college_id: normCollege,
        exam_id: record.exam_id,
        exam_subject_id: validExamSubjId,
        student_id: resolvedStudentId,
        student_name: record.student_name,
        roll_no: record.roll_no,
        course: record.course,
        branch: record.branch,
        year: record.year,
        semester: record.semester,
        section: record.section,
        subject: record.subject,
        max_marks: record.max_marks,
        obtained_marks: record.obtained_marks,
        marks: record.obtained_marks,
        passing_marks: record.passing_marks,
        percentage: record.percentage,
        grade: record.grade,
        grade_point: record.grade_point,
        remarks: record.remarks,
        status: record.status,
        is_published: record.is_published,
        published: record.is_published,
        published_date: record.published_date || new Date().toISOString().split('T')[0],
        entered_by: entryUuid,
        updated_at: record.updated_at,
      })
    })

    if (isSupabaseConfigured && dbPayload.length > 0) {
      try {
        const { error } = await supabase.from('results').upsert(dbPayload, {
          onConflict: 'id',
          ignoreDuplicates: false,
        })

        if (error) {
          console.warn('Supabase results batch upsert notice:', error.message)
          // Fallback retry without specifying onConflict
          await supabase.from('results').upsert(dbPayload)
        }
      } catch (err: any) {
        console.warn('Supabase results batch save error:', err.message)
      }
    }

    updatedRecords.forEach((record) => {
      const idx = resultsState.findIndex((r) => r.id === record.id)
      if (idx >= 0) {
        resultsState[idx] = record
      } else {
        resultsState.push(record)
      }
    })

    saveLocalStorage('eduth_results_v3', resultsState)
    invalidateExamCache()
    notifyListeners()
  },

  publishExamResults: async (examId: string, publish: boolean, publishedBy?: string) => {
    const pubDate = publish ? new Date().toISOString().split('T')[0] : undefined

    if (isSupabaseConfigured) {
      const isValidUUID = (str?: string) => Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str))
      const pubByUuid = isValidUUID(publishedBy) ? publishedBy : null

      const { error } = await supabase.from('results').update({
        is_published: publish,
        published: publish,
        published_date: pubDate,
        published_by: pubByUuid,
        updated_at: new Date().toISOString(),
      }).eq('exam_id', examId)

      if (error) {
        console.error('Supabase publish results failed:', error.message)
        throw new Error(error.message)
      }

      try {
        await supabase.from('exams').update({
          status: publish ? 'Published' : 'Completed',
          updated_at: new Date().toISOString(),
        }).eq('id', examId)
      } catch (e) {
        // Ignore notice
      }
    }

    resultsState = resultsState.map((r) => {
      if (r.exam_id === examId) {
        return {
          ...r,
          is_published: publish,
          published_date: publish ? (r.published_date || pubDate) : undefined,
          published_by: publishedBy || r.published_by,
          updated_at: new Date().toISOString(),
        }
      }
      return r
    })

    examsState = examsState.map((e) => {
      if (e.id === examId) {
        return {
          ...e,
          status: (publish ? 'Published' : 'Completed') as ExamStatus,
          updated_at: new Date().toISOString(),
        }
      }
      return e
    })

    saveLocalStorage('eduth_results_v3', resultsState)
    saveLocalStorage('eduth_exams_v3', examsState)
    invalidateExamCache()
    notifyListeners()
    await syncExamsWithSupabase()
  },

  saveSingleResult: async (result: {
    id: string
    obtained_marks: number
    max_marks?: number
    passing_marks?: number
    remarks?: string
  }) => {
    const existingIdx = resultsState.findIndex((r) => r.id === result.id)
    if (existingIdx === -1) {
      throw new Error('Result record not found')
    }

    const existing = resultsState[existingIdx]
    const maxM = Math.max(1, result.max_marks ?? existing.max_marks ?? 100)
    const obtM = Math.min(Math.max(0, result.obtained_marks), maxM)
    const passM = result.passing_marks ?? existing.passing_marks ?? 40
    const pct = Math.round((obtM / maxM) * 100)
    const calc = calculateGradeAndPoint(obtM, maxM, passM)

    const updatedRecord: ExamResultRecord = {
      ...existing,
      obtained_marks: obtM,
      max_marks: maxM,
      passing_marks: passM,
      percentage: pct,
      grade: calc.grade,
      grade_point: calc.gradePoint,
      status: calc.status,
      is_published: existing.is_published ?? false,
      remarks: result.remarks !== undefined ? result.remarks : existing.remarks,
      updated_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('results').update({
        obtained_marks: updatedRecord.obtained_marks,
        marks: updatedRecord.obtained_marks,
        max_marks: updatedRecord.max_marks,
        passing_marks: updatedRecord.passing_marks,
        percentage: updatedRecord.percentage,
        grade: updatedRecord.grade,
        grade_point: updatedRecord.grade_point,
        status: updatedRecord.status,
        is_published: existing.is_published ?? false,
        published: existing.is_published ?? false,
        remarks: updatedRecord.remarks,
        updated_at: updatedRecord.updated_at,
      }).eq('id', updatedRecord.id)

      if (error) throw new Error(error.message)
    }

    resultsState[existingIdx] = updatedRecord
    saveLocalStorage('eduth_results_v3', resultsState)
    invalidateExamCache()
    notifyListeners()
    return updatedRecord
  },

  getStudentPublishedResults: (studentId?: string, rollNo?: string, customId?: string, email?: string): ExamResultRecord[] => {
    const idsToMatch = new Set<string>()

    const addNormalized = (val?: string) => {
      if (!val) return
      const raw = String(val).trim()
      if (!raw) return
      idsToMatch.add(raw)
      idsToMatch.add(raw.toLowerCase())
      const stripped = raw.replace(/^STU-/i, '')
      if (stripped) {
        idsToMatch.add(stripped)
        idsToMatch.add(stripped.toLowerCase())
        idsToMatch.add(`STU-${stripped}`)
        idsToMatch.add(`STU-${stripped}`.toLowerCase())
      }
    }

    addNormalized(studentId)
    addNormalized(rollNo)
    addNormalized(customId)
    if (email) addNormalized(email)

    let userCtx: any = null
    try {
      const authStr = typeof window !== 'undefined' ? (localStorage.getItem('eduth_authenticated_user') || localStorage.getItem('eduth_auth_user')) : null
      if (authStr) userCtx = JSON.parse(authStr)
    } catch {}

    if (userCtx) {
      addNormalized(userCtx.id)
      addNormalized(userCtx.student_id)
      addNormalized(userCtx.child_student_id)
      addNormalized(userCtx.roll_no)
      addNormalized(userCtx.email)
      if (userCtx.name) addNormalized(userCtx.name)
      if (userCtx.child_name) addNormalized(userCtx.child_name)
      if (userCtx.child_roll_no) addNormalized(userCtx.child_roll_no)
    }

    const allStudents = academicStore.getStudents()
    allStudents.forEach((s: any) => {
      const matchStud =
        (studentId && (s.id === studentId || s.student_id === studentId || s.roll_no === studentId || `STU-${s.roll_no}` === studentId || studentId.replace(/^STU-/i, '') === s.roll_no)) ||
        (rollNo && (s.id === rollNo || s.student_id === rollNo || s.roll_no === rollNo || `STU-${s.roll_no}` === rollNo || rollNo.replace(/^STU-/i, '') === rollNo)) ||
        (customId && (s.id === customId || s.student_id === customId || s.roll_no === customId || `STU-${s.roll_no}` === customId || customId.replace(/^STU-/i, '') === customId)) ||
        (email && ((s.email && s.email.toLowerCase().trim() === email.toLowerCase().trim()) || (s.parent_email && s.parent_email.toLowerCase().trim() === email.toLowerCase().trim()))) ||
        (userCtx && (
          (userCtx.id && (s.id === userCtx.id || s.profile_id === userCtx.id)) ||
          (userCtx.student_id && (s.student_id === userCtx.student_id || s.id === userCtx.student_id)) ||
          (userCtx.child_student_id && (s.id === userCtx.child_student_id || s.student_id === userCtx.child_student_id)) ||
          (userCtx.email && ((s.email && s.email.toLowerCase().trim() === userCtx.email.toLowerCase().trim()) || (s.parent_email && s.parent_email.toLowerCase().trim() === userCtx.email.toLowerCase().trim()))) ||
          (userCtx.name && s.name && s.name.toLowerCase().trim() === userCtx.name.toLowerCase().trim())
        ))

      if (matchStud) {
        addNormalized(s.id)
        addNormalized(s.profile_id)
        addNormalized(s.student_id)
        addNormalized(s.roll_no)
        if (s.name) addNormalized(s.name)
        if (s.email) addNormalized(s.email)
        if (s.parent_email) addNormalized(s.parent_email)
      }
    })

    const matchedResults = resultsState.filter((r) => {
      // Must be published!
      const isPub = Boolean(r.is_published) || Boolean((r as any).published) || (r.is_published as any) === 'true' || ((r as any).published as any) === 'true'
      if (!isPub) return false

      // Must have obtained marks (student appeared for exam)
      if (r.obtained_marks === null || r.obtained_marks === undefined) return false

      if (idsToMatch.size > 0) {
        const rSubId = (r.student_id || '').trim()
        const rRoll = (r.roll_no || '').trim()
        const rName = (r.student_name || '').trim()
        const rSubIdStripped = rSubId.replace(/^STU-/i, '')
        const rRollStripped = rRoll.replace(/^STU-/i, '')

        return (
          idsToMatch.has(rSubId) ||
          idsToMatch.has(rSubId.toLowerCase()) ||
          idsToMatch.has(rSubIdStripped) ||
          idsToMatch.has(rSubIdStripped.toLowerCase()) ||
          idsToMatch.has(rRoll) ||
          idsToMatch.has(rRoll.toLowerCase()) ||
          idsToMatch.has(rRollStripped) ||
          idsToMatch.has(rRollStripped.toLowerCase()) ||
          (rName && (idsToMatch.has(rName) || idsToMatch.has(rName.toLowerCase())))
        )
      }

      return false
    })

    return matchedResults
  },

  clearAllExamData: async (collegeId?: string) => {
    if (isSupabaseConfigured) {
      if (collegeId && collegeId !== 'PLATFORM_ALL') {
        await supabase.from('results').delete().eq('college_id', collegeId)
        await supabase.from('exam_subjects').delete().eq('college_id', collegeId)
        await supabase.from('exams').delete().eq('college_id', collegeId)
      } else {
        await supabase.from('results').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await supabase.from('exam_subjects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await supabase.from('exams').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      }
    }
    if (collegeId && collegeId !== 'PLATFORM_ALL') {
      examsState = examsState.filter((e) => e.college_id !== collegeId)
      examSubjectsState = examSubjectsState.filter((s) => s.college_id !== collegeId)
      resultsState = resultsState.filter((r) => r.college_id !== collegeId)
    } else {
      examsState = []
      examSubjectsState = []
      resultsState = []
    }
    saveLocalStorage('eduth_exams_v3', examsState)
    saveLocalStorage('eduth_exam_subjects_v3', examSubjectsState)
    saveLocalStorage('eduth_results_v3', resultsState)
    invalidateExamCache()
    notifyListeners()
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx >= 0) listeners.splice(idx, 1)
    }
  },
}

export function useExamStore() {
  const [, setTick] = useState(0)
  let userContext: any = null

  try {
    const auth = useAuth()
    userContext = auth.user
  } catch {
    // Fallback
  }

  const userCollege = userContext?.college_id || userContext?.school_id || '13695a78-0105-4bde-bc85-d664bb66637e'
  const isSuperAdmin = userContext?.role === 'super_admin'

  useEffect(() => {
    syncExamsWithSupabase(userCollege, isSuperAdmin)
    const unsubscribe = examStore.subscribe(() => {
      setTick((prev) => prev + 1)
    })
    return unsubscribe
  }, [userContext?.id, userCollege, isSuperAdmin])

  const normUserCollege = normalizeCollegeId(userCollege)
  const isCollegeMatch = useCallback((itemCollegeId?: string) => {
    if (isSuperAdmin) return true
    if (!itemCollegeId) return true
    if (!normUserCollege && !userCollege) return true
    const normItem = normalizeCollegeId(itemCollegeId)
    return (
      normItem === normUserCollege ||
      itemCollegeId === userCollege ||
      itemCollegeId === normUserCollege ||
      normItem === userCollege ||
      (normUserCollege === '13695a78-0105-4bde-bc85-d664bb66637e' && itemCollegeId === '13695a78-0105-4bde-bc85-d664bb66637e')
    )
  }, [isSuperAdmin, normUserCollege, userCollege])

  const rawExams = examStore.getExams()
  const rawExamSubjects = examStore.getExamSubjects()
  const rawResults = examStore.getResults()

  const scopedExams = useMemo(() => {
    return isSuperAdmin ? rawExams : rawExams.filter((e) => isCollegeMatch(e.college_id))
  }, [isSuperAdmin, rawExams, isCollegeMatch])

  const scopedExamSubjects = useMemo(() => {
    return isSuperAdmin ? rawExamSubjects : rawExamSubjects.filter((s) => isCollegeMatch(s.college_id))
  }, [isSuperAdmin, rawExamSubjects, isCollegeMatch])

  const scopedResults = useMemo(() => {
    let res = isSuperAdmin || userContext?.role === 'student' || userContext?.role === 'parent'
      ? rawResults
      : rawResults.filter((r) => isCollegeMatch(r.college_id))

    if (userContext?.role === 'student' || userContext?.role === 'parent') {
      res = res.filter((r) => Boolean(r.is_published) || Boolean((r as any).published) || (r.is_published as any) === 'true' || ((r as any).published as any) === 'true')
    }
    return res
  }, [isSuperAdmin, rawResults, isCollegeMatch, userContext?.role])

  return {
    exams: scopedExams,
    examSubjects: scopedExamSubjects,
    results: scopedResults,
    saveExam: examStore.saveExam,
    saveExamSubject: examStore.saveExamSubject,
    deleteExamSubject: examStore.deleteExamSubject,
    deleteExam: examStore.deleteExam,
    saveResultBatch: examStore.saveResultBatch,
    saveSingleResult: examStore.saveSingleResult,
    publishExamResults: examStore.publishExamResults,
    getStudentPublishedResults: examStore.getStudentPublishedResults,
    clearAllExamData: examStore.clearAllExamData,
  }
}

