import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { useAuth } from '../app/providers/AuthProvider'

export interface SuspensionRecord {
  id: string
  college_id: string
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year: string
  semester: string
  section?: string
  category: 'Disciplinary Violation' | 'Misconduct' | 'Attendance Related' | 'Examination Malpractice' | 'Fee/Administrative Issue' | 'Anti-Ragging Violation' | 'Damage to Property' | 'Other'
  reason: string
  description?: string
  start_date: string
  end_date?: string
  status: 'Active' | 'Completed' | 'Cancelled'
  action_taken?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

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

let suspensionsState: SuspensionRecord[] = loadLocalStorage<SuspensionRecord[]>('eduth_suspensions_v1', [])

export async function syncSuspensionsWithSupabase(userCollegeId?: string, isSuperAdmin?: boolean) {
  if (!isSupabaseConfigured) return

  try {
    let query = supabase.from('suspensions').select('*').order('created_at', { ascending: false })

    if (!isSuperAdmin && userCollegeId && userCollegeId !== 'PLATFORM_ALL') {
      query = query.eq('college_id', userCollegeId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase suspensions sync notice:', error.message)
      return
    }

    if (data) {
      suspensionsState = (data as any[]).map((s) => ({
        id: s.id,
        college_id: s.college_id,
        student_id: s.student_id,
        student_name: s.student_name || '',
        roll_no: s.roll_no || '',
        course: s.course || 'B.Tech',
        branch: s.branch || 'ECE',
        year: s.year || '1st Year',
        semester: s.semester || 'Semester 1',
        section: s.section || 'A',
        category: s.category || 'Disciplinary Violation',
        reason: s.reason || '',
        description: s.description || '',
        start_date: s.start_date || new Date().toISOString().split('T')[0],
        end_date: s.end_date || '',
        status: s.status || 'Active',
        action_taken: s.action_taken || '',
        created_by: s.created_by || 'Administration',
        created_at: s.created_at || new Date().toISOString(),
        updated_at: s.updated_at || new Date().toISOString(),
      }))
      saveLocalStorage('eduth_suspensions_v1', suspensionsState)
      notifyListeners()
    }
  } catch (err) {
    // Ignore error
  }
}

export function resetSuspensionStore() {
  suspensionsState = []
  saveLocalStorage('eduth_suspensions_v1', suspensionsState)
  notifyListeners()
}

export const suspensionStore = {
  getSuspensions: (): SuspensionRecord[] => suspensionsState,

  saveSuspension: async (record: Omit<SuspensionRecord, 'id'> & { id?: string }) => {
    const id = record.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'susp_' + Date.now())
    const targetRecord: SuspensionRecord = {
      ...record,
      id,
      created_at: record.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('suspensions').upsert([{
        id: targetRecord.id,
        college_id: targetRecord.college_id,
        student_id: targetRecord.student_id,
        student_name: targetRecord.student_name,
        roll_no: targetRecord.roll_no,
        course: targetRecord.course,
        branch: targetRecord.branch,
        year: targetRecord.year,
        semester: targetRecord.semester,
        section: targetRecord.section,
        category: targetRecord.category,
        reason: targetRecord.reason,
        description: targetRecord.description,
        start_date: targetRecord.start_date,
        end_date: targetRecord.end_date,
        status: targetRecord.status,
        action_taken: targetRecord.action_taken,
        created_by: targetRecord.created_by,
        updated_at: targetRecord.updated_at,
      }])

      if (error) {
        throw new Error(error.message)
      }
    }

    const existingIndex = suspensionsState.findIndex((s) => s.id === targetRecord.id)
    if (existingIndex >= 0) {
      suspensionsState[existingIndex] = targetRecord
    } else {
      suspensionsState = [targetRecord, ...suspensionsState]
    }

    saveLocalStorage('eduth_suspensions_v1', suspensionsState)
    notifyListeners()
    return targetRecord
  },

  deleteSuspension: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('suspensions').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    suspensionsState = suspensionsState.filter((s) => s.id !== id)
    saveLocalStorage('eduth_suspensions_v1', suspensionsState)
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

export function useSuspensionStore() {
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
    syncSuspensionsWithSupabase(userCollege, isSuperAdmin)
    const unsubscribe = suspensionStore.subscribe(() => {
      setTick((prev) => prev + 1)
    })
    return unsubscribe
  }, [userContext?.id, userCollege, isSuperAdmin])

  const isCollegeMatch = (itemCollegeId?: string) => {
    if (isSuperAdmin) return true
    if (!itemCollegeId || !userCollege) return true
    return itemCollegeId === userCollege
  }

  return {
    suspensions: suspensionsState.filter((s) => isCollegeMatch(s.college_id)),
    saveSuspension: suspensionStore.saveSuspension,
    deleteSuspension: suspensionStore.deleteSuspension,
  }
}
