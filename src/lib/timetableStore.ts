import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { useAuth } from '../app/providers/AuthProvider'
import { normalizeCollegeId } from './academicStore'

export interface TimetablePeriodEntry {
  id: string
  class_id?: string
  course: string
  branch: string
  year: string
  semester: string
  section: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | string
  period: string // e.g. 'Period 1' or 'IV' or 'IV - VI'
  start_period?: string // e.g. 'I', 'IV'
  end_period?: string // e.g. 'I', 'VI'
  start_period_num: number // 1-indexed period slot (e.g. 4)
  end_period_num: number // 1-indexed period slot (e.g. 6)
  start_time?: string
  end_time?: string
  subject: string
  subject_code?: string
  teacher_id?: string
  teacher_name?: string
  room_no?: string
  entry_type?: 'Lecture' | 'Lab' | 'Practical' | 'Tutorial' | 'Training' | 'Project' | 'Aptitude' | 'PDP' | 'Library' | 'Seminar' | 'Workshop' | 'Free Period' | 'Other' | string
  effective_from?: string
  effective_to?: string
  is_combined?: boolean
  combined_sections?: string[]
  coordinator_id?: string
  coordinator_name?: string
  created_at: string
  college_id?: string
}

export interface PeriodSlotConfig {
  id: string
  label: string // e.g. 'I', 'II', 'III', 'LUNCH', 'IV', 'V', 'VI', 'VII'
  start_time: string // e.g. '09:00 AM'
  end_time: string // e.g. '09:55 AM'
  is_break: boolean
  break_type?: 'Lunch' | 'Short Break' | 'Other'
  order_no: number
}

export interface TimetableConfig {
  id: string
  college_id: string
  course: string
  year: string
  periods: PeriodSlotConfig[]
  days: string[]
}

// Default 7-period configuration for 1st - 3rd Year (Mon - Sat)
export const DEFAULT_1ST_3RD_YEAR_PERIODS: PeriodSlotConfig[] = [
  { id: 'p1', label: 'I', start_time: '09:00 AM', end_time: '09:55 AM', is_break: false, order_no: 1 },
  { id: 'p2', label: 'II', start_time: '09:55 AM', end_time: '10:55 AM', is_break: false, order_no: 2 },
  { id: 'p3', label: 'III', start_time: '10:55 AM', end_time: '11:55 AM', is_break: false, order_no: 3 },
  { id: 'p_lunch', label: 'LUNCH', start_time: '11:55 AM', end_time: '12:40 PM', is_break: true, break_type: 'Lunch', order_no: 4 },
  { id: 'p4', label: 'IV', start_time: '12:40 PM', end_time: '01:35 PM', is_break: false, order_no: 5 },
  { id: 'p5', label: 'V', start_time: '01:35 PM', end_time: '02:35 PM', is_break: false, order_no: 6 },
  { id: 'p6', label: 'VI', start_time: '02:35 PM', end_time: '03:35 PM', is_break: false, order_no: 7 },
  { id: 'p7', label: 'VII', start_time: '03:35 PM', end_time: '04:35 PM', is_break: false, order_no: 8 },
]

export const DEFAULT_1ST_3RD_YEAR_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Default 6-period configuration for 4th Year (Mon - Fri)
export const DEFAULT_4TH_YEAR_PERIODS: PeriodSlotConfig[] = [
  { id: 'p1', label: 'I', start_time: '09:00 AM', end_time: '09:55 AM', is_break: false, order_no: 1 },
  { id: 'p2', label: 'II', start_time: '09:55 AM', end_time: '10:55 AM', is_break: false, order_no: 2 },
  { id: 'p3', label: 'III', start_time: '10:55 AM', end_time: '11:55 AM', is_break: false, order_no: 3 },
  { id: 'p_lunch', label: 'LUNCH', start_time: '11:55 AM', end_time: '12:40 PM', is_break: true, break_type: 'Lunch', order_no: 4 },
  { id: 'p4', label: 'IV', start_time: '12:40 PM', end_time: '01:35 PM', is_break: false, order_no: 5 },
  { id: 'p5', label: 'V', start_time: '01:35 PM', end_time: '02:35 PM', is_break: false, order_no: 6 },
  { id: 'p6', label: 'VI', start_time: '02:35 PM', end_time: '03:35 PM', is_break: false, order_no: 7 },
]

export const DEFAULT_4TH_YEAR_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

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

let timetableState = loadLocalStorage<TimetablePeriodEntry[]>('eduth_timetable_v4', [])
let timetableConfigsState = loadLocalStorage<TimetableConfig[]>('eduth_timetable_configs_v4', [])

let _lastTimetableSyncTime = 0
let _loadedTimetableCollege: string | null = null
let _inFlightTimetableSync: Promise<void> | null = null
const TIMETABLE_CACHE_TTL_MS = 30000

export function invalidateTimetableCache() {
  _lastTimetableSyncTime = 0
}

export async function syncTimetableWithSupabase(userCollegeId?: string, isSuperAdmin?: boolean) {
  if (!isSupabaseConfigured) return

  const targetCollege = isSuperAdmin ? 'SUPER_ADMIN' : (userCollegeId || 'COL001')

  if (_loadedTimetableCollege === targetCollege && Date.now() - _lastTimetableSyncTime < TIMETABLE_CACHE_TTL_MS) {
    return
  }

  if (_inFlightTimetableSync) {
    return _inFlightTimetableSync
  }

  _inFlightTimetableSync = (async () => {
    try {
      let entryQuery = supabase.from('timetable_entries').select('*')
      let configQuery = supabase.from('timetable_configs').select('*')

      if (!isSuperAdmin && userCollegeId && userCollegeId !== 'PLATFORM_ALL') {
        entryQuery = entryQuery.eq('college_id', userCollegeId)
        configQuery = configQuery.eq('college_id', userCollegeId)
      }

      const [{ data: dbEntries, error: entryErr }, { data: dbConfigs, error: configErr }] = await Promise.all([
        entryQuery,
        configQuery,
      ])

      if (entryErr) console.error('Supabase timetable entries notice:', entryErr.message)
      if (configErr) console.error('Supabase timetable configs notice:', configErr.message)

      if (dbEntries) {
        timetableState = (dbEntries as any[]).map((row) => ({
          id: row.id,
          class_id: row.class_id || undefined,
          course: row.course || 'B.Tech',
          branch: row.branch || 'ECE',
          year: row.year || '1st Year',
          semester: row.semester || 'Semester 1',
          section: row.section || 'Section A',
          day: row.day,
          period: row.period || 'Period 1',
          start_period: row.start_period || row.period || 'I',
          end_period: row.end_period || row.start_period || row.period || 'I',
          start_period_num: Number(row.start_period_num) || 1,
          end_period_num: Number(row.end_period_num) || Number(row.start_period_num) || 1,
          start_time: row.start_time,
          end_time: row.end_time,
          subject: row.subject || row.subject_name || '',
          subject_code: row.subject_code,
          teacher_id: row.teacher_id,
          teacher_name: row.teacher_name,
          room_no: row.room_no,
          entry_type: row.entry_type || 'Lecture',
          effective_from: row.effective_from || '2026-02-02',
          effective_to: row.effective_to,
          is_combined: Boolean(row.is_combined),
          combined_sections: Array.isArray(row.combined_sections) ? row.combined_sections : [],
          coordinator_id: row.coordinator_id,
          coordinator_name: row.coordinator_name,
          created_at: row.created_at || new Date().toISOString(),
          college_id: row.college_id,
        }))
        saveLocalStorage('eduth_timetable_v4', timetableState)
      }

      if (dbConfigs) {
        timetableConfigsState = (dbConfigs as any[]).map((c) => ({
          id: c.id,
          college_id: c.college_id,
          course: c.course,
          year: c.year,
          periods: Array.isArray(c.periods_json) ? c.periods_json : DEFAULT_1ST_3RD_YEAR_PERIODS,
          days: Array.isArray(c.days_json) ? c.days_json : DEFAULT_1ST_3RD_YEAR_DAYS,
        }))
        saveLocalStorage('eduth_timetable_configs_v4', timetableConfigsState)
      }

      _lastTimetableSyncTime = Date.now()
      _loadedTimetableCollege = targetCollege
      notifyListeners()
    } catch (err) {
      // Ignore error
    } finally {
      _inFlightTimetableSync = null
    }
  })()

  return _inFlightTimetableSync
}

export function resetTimetableStore() {
  timetableState = []
  timetableConfigsState = []
  saveLocalStorage('eduth_timetable_v4', timetableState)
  saveLocalStorage('eduth_timetable_configs_v4', timetableConfigsState)
  notifyListeners()
}

export const timetableStore = {
  getTimetable: (): TimetablePeriodEntry[] => timetableState,

  getClassTimetable: (
    course: string,
    branch: string,
    year: string,
    semester?: string,
    section?: string,
    classId?: string
  ): TimetablePeriodEntry[] => {
    return timetableState.filter((entry) => {
      if (classId && entry.class_id && entry.class_id === classId) return true
      if (course && entry.course !== course) return false
      if (branch && entry.branch !== branch) return false
      if (year && entry.year !== year) return false
      if (semester && entry.semester !== semester) return false
      if (section && section !== 'All Sections' && entry.section !== section && (!entry.is_combined || !entry.combined_sections?.includes(section))) return false
      return true
    })
  },

  getTeacherTimetable: (teacherIdOrName: string): TimetablePeriodEntry[] => {
    if (!teacherIdOrName) return timetableState
    return timetableState.filter(
      (t) => t.teacher_id === teacherIdOrName || (t.teacher_name && t.teacher_name.toLowerCase().includes(teacherIdOrName.toLowerCase()))
    )
  },

  getTimetableConfig: (course: string, year: string): { periods: PeriodSlotConfig[]; days: string[] } => {
    const found = timetableConfigsState.find((c) => c.course === course && c.year === year)
    if (found) {
      return { periods: found.periods, days: found.days }
    }
    if (year === '4th Year') {
      return { periods: DEFAULT_4TH_YEAR_PERIODS, days: DEFAULT_4TH_YEAR_DAYS }
    }
    return { periods: DEFAULT_1ST_3RD_YEAR_PERIODS, days: DEFAULT_1ST_3RD_YEAR_DAYS }
  },

  saveTimetableConfig: async (config: Omit<TimetableConfig, 'id'> & { id?: string }): Promise<{ success: boolean; error?: string }> => {
    const id = config.id || `cfg_${config.course}_${config.year}`
    const targetConfig: TimetableConfig = {
      ...config,
      id,
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('timetable_configs').upsert([{
        id: targetConfig.id,
        college_id: targetConfig.college_id,
        course: targetConfig.course,
        year: targetConfig.year,
        periods_json: targetConfig.periods,
        days_json: targetConfig.days,
        updated_at: new Date().toISOString(),
      }])

      if (error) return { success: false, error: error.message }
    }

    const idx = timetableConfigsState.findIndex((c) => c.id === targetConfig.id)
    if (idx >= 0) {
      timetableConfigsState[idx] = targetConfig
    } else {
      timetableConfigsState.push(targetConfig)
    }

    saveLocalStorage('eduth_timetable_configs_v4', timetableConfigsState)
    notifyListeners()
    return { success: true }
  },

  checkConflict: (entry: Omit<TimetablePeriodEntry, 'created_at' | 'id'> & { id?: string }): string | null => {
    const existingEntries = timetableState.filter((e) => e.id !== entry.id)
    const eStart = entry.start_period_num
    const eEnd = entry.end_period_num

    // Helper for interval overlap [a1, a2] and [b1, b2]
    const isIntervalOverlap = (a1: number, a2: number, b1: number, b2: number) => {
      return Math.max(a1, b1) <= Math.min(a2, b2)
    }

    // 1. Same Class Schedule Overlap Conflict
    const classConflict = existingEntries.find((e) => {
      if (e.day === entry.day) {
        const sameClass = (e.class_id && entry.class_id && e.class_id === entry.class_id) || (e.course === entry.course && e.branch === entry.branch && e.year === entry.year && (e.section === entry.section || entry.section === 'All Sections' || e.section === 'All Sections'))
        if (sameClass) {
          return isIntervalOverlap(e.start_period_num, e.end_period_num, eStart, eEnd)
        }
      }
      return false
    })

    if (classConflict) {
      return `Class Schedule Overlap Conflict: Period(s) ${classConflict.start_period_num}–${classConflict.end_period_num} on ${entry.day} is already scheduled with "${classConflict.subject}".`
    }

    // 2. Faculty Double-Booking Conflict
    if (entry.teacher_id || entry.teacher_name) {
      const teacherConflict = existingEntries.find((e) => {
        if (e.day === entry.day) {
          const sameTeacher = (entry.teacher_id && e.teacher_id === entry.teacher_id) || (entry.teacher_name && e.teacher_name && e.teacher_name.toLowerCase() === entry.teacher_name.toLowerCase())
          if (sameTeacher) {
            return isIntervalOverlap(e.start_period_num, e.end_period_num, eStart, eEnd)
          }
        }
        return false
      })

      if (teacherConflict) {
        return `Faculty Double-Booking Conflict: ${entry.teacher_name || 'Selected Faculty'} is already assigned to ${teacherConflict.course} ${teacherConflict.branch} (${teacherConflict.section}) on ${entry.day} during Period(s) ${teacherConflict.start_period_num}–${teacherConflict.end_period_num}.`
      }
    }

    // 3. Room Double-Booking Conflict
    if (entry.room_no && entry.room_no.trim() !== '' && entry.room_no !== 'Unassigned') {
      const roomConflict = existingEntries.find((e) => {
        if (e.day === entry.day) {
          const sameRoom = e.room_no && e.room_no.trim().toLowerCase() === entry.room_no?.trim().toLowerCase()
          if (sameRoom) {
            return isIntervalOverlap(e.start_period_num, e.end_period_num, eStart, eEnd)
          }
        }
        return false
      })

      if (roomConflict) {
        return `Room Double-Booking Conflict: Room "${entry.room_no}" is already assigned to ${roomConflict.course} ${roomConflict.branch} (${roomConflict.section}) on ${entry.day} during Period(s) ${roomConflict.start_period_num}–${roomConflict.end_period_num}.`
      }
    }

    return null
  },

  savePeriod: async (entry: Omit<TimetablePeriodEntry, 'created_at' | 'id'> & { id?: string }): Promise<{ success: boolean; error?: string }> => {
    const conflict = timetableStore.checkConflict(entry)
    if (conflict) {
      return { success: false, error: conflict }
    }

    const id = entry.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'tt_' + Date.now())
    const targetEntry: TimetablePeriodEntry = {
      ...entry,
      id,
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('timetable_entries').upsert([{
        id: targetEntry.id,
        college_id: targetEntry.college_id,
        class_id: targetEntry.class_id || null,
        day: targetEntry.day,
        period: targetEntry.period,
        start_period: targetEntry.start_period,
        end_period: targetEntry.end_period,
        start_period_num: targetEntry.start_period_num,
        end_period_num: targetEntry.end_period_num,
        start_time: targetEntry.start_time,
        end_time: targetEntry.end_time,
        subject: targetEntry.subject,
        subject_name: targetEntry.subject,
        subject_code: targetEntry.subject_code,
        teacher_id: targetEntry.teacher_id,
        teacher_name: targetEntry.teacher_name,
        room_no: targetEntry.room_no,
        course: targetEntry.course,
        branch: targetEntry.branch,
        year: targetEntry.year,
        semester: targetEntry.semester,
        section: targetEntry.section,
        entry_type: targetEntry.entry_type,
        effective_from: targetEntry.effective_from,
        effective_to: targetEntry.effective_to,
        is_combined: targetEntry.is_combined,
        combined_sections: targetEntry.combined_sections,
        coordinator_id: targetEntry.coordinator_id,
        coordinator_name: targetEntry.coordinator_name,
      }])

      if (error) {
        return { success: false, error: error.message }
      }
    }

    const existingIndex = timetableState.findIndex((e) => e.id === targetEntry.id)

    if (existingIndex >= 0) {
      timetableState[existingIndex] = targetEntry
    } else {
      timetableState.push(targetEntry)
    }

    saveLocalStorage('eduth_timetable_v4', timetableState)
    notifyListeners()
    return { success: true }
  },

  deletePeriod: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('timetable_entries').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    timetableState = timetableState.filter((e) => e.id !== id)
    saveLocalStorage('eduth_timetable_v4', timetableState)
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

export function useTimetableStore() {
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
  const normUserCollege = normalizeCollegeId(userCollege)

  useEffect(() => {
    syncTimetableWithSupabase(userCollege, isSuperAdmin)
    const unsubscribe = timetableStore.subscribe(() => {
      setTick((prev) => prev + 1)
    })
    return unsubscribe
  }, [userContext?.id, userCollege, normUserCollege, isSuperAdmin])

  const isCollegeMatch = (itemCollegeId?: string) => {
    if (isSuperAdmin) return true
    if (!itemCollegeId) return true
    const normItem = normalizeCollegeId(itemCollegeId)
    return normItem === normUserCollege || itemCollegeId === userCollege || normItem === userCollege
  }

  const rawTimetable = timetableStore.getTimetable()
  const scopedTimetable = isSuperAdmin ? rawTimetable : rawTimetable.filter((t) => isCollegeMatch(t.college_id))

  return {
    timetable: scopedTimetable,
    getClassTimetable: timetableStore.getClassTimetable,
    getTeacherTimetable: timetableStore.getTeacherTimetable,
    getTimetableConfig: timetableStore.getTimetableConfig,
    saveTimetableConfig: timetableStore.saveTimetableConfig,
    savePeriod: timetableStore.savePeriod,
    deletePeriod: timetableStore.deletePeriod,
  }
}
