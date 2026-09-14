import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { useAuth } from '../app/providers/AuthProvider'

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface TnpCompany {
  id: string
  college_id: string
  name: string
  logo: string
  industry: string
  website: string
  hr_name: string
  hr_email: string
  hr_phone: string
  location: string
  description: string
  status: 'Active' | 'Inactive'
  created_at?: string
  updated_at?: string
}

export type DriveStatus =
  | 'Draft'
  | 'Registration Open'
  | 'Registration Closed'
  | 'Shortlisted'
  | 'In Process'
  | 'Completed'
  | 'Cancelled'

export interface PlacementDrive {
  id: string
  college_id: string
  company_id: string
  company_name: string
  drive_name: string
  job_role: string
  drive_date: string
  reg_start_date: string
  reg_end_date: string
  target_courses: string[]
  target_branches: string[]
  target_years: string[]
  eligibility_criteria: string
  min_cgpa: number
  backlog_criteria: string
  salary_package: string
  job_location: string
  is_internship: boolean
  vacancy: number
  description: string
  status: DriveStatus
  created_by?: string
  created_at?: string
  updated_at?: string
}

export type AppStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Aptitude'
  | 'GD'
  | 'PI'
  | 'Selected'
  | 'Rejected'
  | 'Waitlisted'

export interface PlacementApplication {
  id: string
  college_id: string
  drive_id: string
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year: string
  semester?: string
  section?: string
  cgpa: number
  applied_at: string
  status: AppStatus
  current_round: string
  remarks?: string
  created_at?: string
  updated_at?: string
}

export interface SelectionRound {
  id: string
  college_id: string
  drive_id: string
  round_number: number
  round_name: string
  description?: string
  round_date?: string
  venue?: string
  status: 'Scheduled' | 'In Progress' | 'Completed'
  created_at?: string
}

export interface SelectionResult {
  id: string
  college_id: string
  drive_id: string
  round_id?: string
  student_id: string
  student_name: string
  roll_no: string
  status: 'Passed' | 'Failed' | 'Absent' | 'On Hold'
  score_comments?: string
  updated_by?: string
  updated_at?: string
}

export interface Internship {
  id: string
  college_id: string
  company_id?: string
  company_name: string
  title: string
  role: string
  stipend: string
  duration: string
  start_date: string
  reg_end_date: string
  target_courses: string[]
  target_branches: string[]
  target_years: string[]
  location: string
  description: string
  status: 'Active' | 'Closed' | 'Draft'
  created_at?: string
}

export interface InternshipApplication {
  id: string
  college_id: string
  internship_id: string
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year: string
  status: 'Applied' | 'Shortlisted' | 'Selected' | 'Rejected'
  applied_at: string
}

export type TrainingType =
  | 'Technical Training'
  | 'Aptitude Training'
  | 'Soft Skills'
  | 'Communication'
  | 'Interview Preparation'
  | 'Technical Interview'
  | 'Programming'
  | 'Industry Training'

export interface TrainingSession {
  id: string
  college_id: string
  title: string
  type: TrainingType
  trainer_name: string
  organization: string
  target_courses: string[]
  target_branches: string[]
  target_years: string[]
  start_date: string
  end_date: string
  timing: string
  venue: string
  capacity: number
  description: string
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'
  created_at?: string
}

export interface TrainingRegistration {
  id: string
  college_id: string
  training_id: string
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year: string
  registered_at: string
  attendance_status?: 'Registered' | 'Attended' | 'Absent'
}

export type EventType =
  | 'Seminar'
  | 'Workshop'
  | 'Guest Lecture'
  | 'Career Guidance'
  | 'Industry Interaction'
  | 'Technical Session'

export interface TnpEvent {
  id: string
  college_id: string
  title: string
  type: EventType
  speaker: string
  organization: string
  event_date: string
  timing: string
  venue: string
  target_courses: string[]
  target_branches: string[]
  target_years: string[]
  description: string
  registration_required: boolean
  capacity: number
  status: 'Upcoming' | 'Completed' | 'Cancelled'
  created_at?: string
}

export interface EventRegistration {
  id: string
  college_id: string
  event_id: string
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year: string
  registered_at: string
}

export type ActivityType = 'seminar' | 'event' | 'training' | 'internship'

export interface TnpActivity {
  id: string
  college_id: string
  activity_type: ActivityType
  title: string
  description: string
  speaker_trainer_organizer?: string
  start_date?: string
  end_date?: string
  start_time?: string
  end_time?: string
  venue?: string
  course?: string
  course_id?: string
  branch?: string
  branch_id?: string
  year?: string
  section?: string
  class_id?: string
  coordinator_id?: string
  company_id?: string
  company_name?: string
  eligibility?: string
  application_deadline?: string
  status: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface PlacementRecord {
  id: string
  college_id: string
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year: string
  company_id?: string
  company_name: string
  drive_id?: string
  drive_name: string
  job_role: string
  package_amount: string
  location: string
  selection_date: string
  joining_date?: string
  placement_type: 'Full Time' | 'Internship + PPO'
  status: 'Offered' | 'Confirmed' | 'Joined' | 'Declined'
  created_at?: string
  updated_at?: string
}


// Local Storage Helper Utilities
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

// Initial Local Storage Persisted State
let globalCompanies: TnpCompany[] = loadLocalStorage('eduth_tnp_companies_v1', [])
let globalDrives: PlacementDrive[] = loadLocalStorage('eduth_tnp_drives_v1', [])
let globalApplications: PlacementApplication[] = loadLocalStorage('eduth_tnp_apps_v1', [])
let globalRounds: SelectionRound[] = loadLocalStorage('eduth_tnp_rounds_v1', [])
let globalResults: SelectionResult[] = loadLocalStorage('eduth_tnp_results_v1', [])
let globalInternships: Internship[] = loadLocalStorage('eduth_tnp_internships_v1', [])
let globalInternApplications: InternshipApplication[] = loadLocalStorage('eduth_tnp_intern_apps_v1', [])
let globalTrainings: TrainingSession[] = loadLocalStorage('eduth_tnp_trainings_v1', [])
let globalTrainingRegistrations: TrainingRegistration[] = loadLocalStorage('eduth_tnp_trg_regs_v1', [])
let globalEvents: TnpEvent[] = loadLocalStorage('eduth_tnp_events_v1', [])
let globalEventRegistrations: EventRegistration[] = loadLocalStorage('eduth_tnp_evt_regs_v1', [])
let globalPlacements: PlacementRecord[] = loadLocalStorage('eduth_tnp_placements_v1', [])
let globalActivities: TnpActivity[] = loadLocalStorage('eduth_tnp_activities_v2', [])

const storeListeners: Set<() => void> = new Set()
function notifyTnpListeners() {
  saveLocalStorage('eduth_tnp_companies_v1', globalCompanies)
  saveLocalStorage('eduth_tnp_drives_v1', globalDrives)
  saveLocalStorage('eduth_tnp_apps_v1', globalApplications)
  saveLocalStorage('eduth_tnp_rounds_v1', globalRounds)
  saveLocalStorage('eduth_tnp_results_v1', globalResults)
  saveLocalStorage('eduth_tnp_internships_v1', globalInternships)
  saveLocalStorage('eduth_tnp_intern_apps_v1', globalInternApplications)
  saveLocalStorage('eduth_tnp_trainings_v1', globalTrainings)
  saveLocalStorage('eduth_tnp_trg_regs_v1', globalTrainingRegistrations)
  saveLocalStorage('eduth_tnp_events_v1', globalEvents)
  saveLocalStorage('eduth_tnp_evt_regs_v1', globalEventRegistrations)
  saveLocalStorage('eduth_tnp_placements_v1', globalPlacements)
  saveLocalStorage('eduth_tnp_activities_v2', globalActivities)

  storeListeners.forEach((l) => l())
}

async function safeFetch<T>(queryPromise: PromiseLike<{ data: T[] | null; error: any }>): Promise<{ data: T[] | null; error: any }> {
  try {
    return await queryPromise
  } catch (e) {
    return { data: null, error: e }
  }
}

let isTnpActivitiesTableMissing = false

// Hook Implementation
export function useTnpStore() {
  const { user, collegeId: authCollegeId } = useAuth()
  const collegeId = authCollegeId || (user as any)?.college_id || (user as any)?.school_id || ''

  const [isLoading, setIsLoading] = useState(false)
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick((prev) => prev + 1)
    storeListeners.add(listener)
    return () => {
      storeListeners.delete(listener)
    }
  }, [])

  // Load from Supabase on mount safely
  const refreshTnpData = useCallback(async () => {
    if (!collegeId || !isSupabaseConfigured) return
    setIsLoading(true)
    try {
      const [
        compRes,
        drvRes,
        appRes,
        rndRes,
        resRes,
        intRes,
        intAppRes,
        trgRes,
        trgRegRes,
        evtRes,
        evtRegRes,
        plcRes,
        actRes,
      ] = await Promise.all([
        safeFetch<TnpCompany>(supabase.from('tnp_companies').select('*').eq('college_id', collegeId)),
        safeFetch<PlacementDrive>(supabase.from('tnp_placement_drives').select('*').eq('college_id', collegeId)),
        safeFetch<PlacementApplication>(supabase.from('tnp_placement_applications').select('*').eq('college_id', collegeId)),
        safeFetch<SelectionRound>(supabase.from('tnp_selection_rounds').select('*').eq('college_id', collegeId)),
        safeFetch<SelectionResult>(supabase.from('tnp_selection_results').select('*').eq('college_id', collegeId)),
        safeFetch<Internship>(supabase.from('tnp_internships').select('*').eq('college_id', collegeId)),
        safeFetch<InternshipApplication>(supabase.from('tnp_internship_applications').select('*').eq('college_id', collegeId)),
        safeFetch<TrainingSession>(supabase.from('tnp_trainings').select('*').eq('college_id', collegeId)),
        safeFetch<TrainingRegistration>(supabase.from('tnp_training_registrations').select('*').eq('college_id', collegeId)),
        safeFetch<TnpEvent>(supabase.from('tnp_events').select('*').eq('college_id', collegeId)),
        safeFetch<EventRegistration>(supabase.from('tnp_event_registrations').select('*').eq('college_id', collegeId)),
        safeFetch<PlacementRecord>(supabase.from('tnp_placements').select('*').eq('college_id', collegeId)),
        isTnpActivitiesTableMissing
          ? Promise.resolve({ data: null, error: null })
          : safeFetch<TnpActivity>(supabase.from('tnp_activities').select('*').eq('college_id', collegeId)),
      ])

      if (actRes?.error) {
        const code = actRes.error.code
        const msg = String(actRes.error.message || '').toLowerCase()
        if (code === 'PGRST205' || msg.includes('not found') || msg.includes('does not exist')) {
          isTnpActivitiesTableMissing = true
        }
      }

      if (compRes && !compRes.error && compRes.data && compRes.data.length > 0) globalCompanies = compRes.data
      if (drvRes && !drvRes.error && drvRes.data && drvRes.data.length > 0) globalDrives = drvRes.data
      if (appRes && !appRes.error && appRes.data && appRes.data.length > 0) globalApplications = appRes.data
      if (rndRes && !rndRes.error && rndRes.data && rndRes.data.length > 0) globalRounds = rndRes.data
      if (resRes && !resRes.error && resRes.data && resRes.data.length > 0) globalResults = resRes.data
      if (intRes && !intRes.error && intRes.data && intRes.data.length > 0) globalInternships = intRes.data
      if (intAppRes && !intAppRes.error && intAppRes.data && intAppRes.data.length > 0) globalInternApplications = intAppRes.data
      if (trgRes && !trgRes.error && trgRes.data && trgRes.data.length > 0) globalTrainings = trgRes.data
      if (trgRegRes && !trgRegRes.error && trgRegRes.data && trgRegRes.data.length > 0) globalTrainingRegistrations = trgRegRes.data
      if (evtRes && !evtRes.error && evtRes.data && evtRes.data.length > 0) globalEvents = evtRes.data
      if (evtRegRes && !evtRegRes.error && evtRegRes.data && evtRegRes.data.length > 0) globalEventRegistrations = evtRegRes.data
      if (plcRes && !plcRes.error && plcRes.data && plcRes.data.length > 0) globalPlacements = plcRes.data
      if (actRes && !actRes.error && actRes.data && actRes.data.length > 0) globalActivities = actRes.data

      if (trgRegRes && !trgRegRes.error && trgRegRes.data && trgRegRes.data.length > 0) globalTrainingRegistrations = trgRegRes.data
      if (evtRes && !evtRes.error && evtRes.data && evtRes.data.length > 0) globalEvents = evtRes.data
      if (evtRegRes && !evtRegRes.error && evtRegRes.data && evtRegRes.data.length > 0) globalEventRegistrations = evtRegRes.data
      if (plcRes && !plcRes.error && plcRes.data && plcRes.data.length > 0) globalPlacements = plcRes.data

      notifyTnpListeners()
    } catch (e) {
      console.warn('TnpStore Supabase fetch fallback to localStorage:', e)
    } finally {
      setIsLoading(false)
    }
  }, [collegeId])

  useEffect(() => {
    refreshTnpData()
  }, [refreshTnpData])

  // ==========================================
  // CRUD OPERATIONS WITH SAFE FALLBACK
  // ==========================================

  // Companies
  const saveCompany = async (company: Omit<TnpCompany, 'id' | 'college_id'> & { id?: string }) => {
    const payload = {
      ...company,
      college_id: collegeId,
      updated_at: new Date().toISOString(),
    }

    if (company.id) {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_companies').update(payload).eq('id', company.id)
        } catch (e) {
          console.warn('Supabase update failed, saved locally:', e)
        }
      }
      globalCompanies = globalCompanies.map((c) => (c.id === company.id ? { ...c, ...payload } : c))
    } else {
      const newId = crypto.randomUUID()
      const item: TnpCompany = { ...payload, id: newId, created_at: new Date().toISOString() }
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_companies').insert(item)
        } catch (e) {
          console.warn('Supabase insert failed, saved locally:', e)
        }
      }
      globalCompanies = [item, ...globalCompanies]
    }
    notifyTnpListeners()
  }

  const deleteCompany = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_companies').delete().eq('id', id)
      } catch (e) {
        // ignore
      }
    }
    globalCompanies = globalCompanies.filter((c) => c.id !== id)
    notifyTnpListeners()
  }

  // Drives
  const saveDrive = async (drive: Omit<PlacementDrive, 'id' | 'college_id'> & { id?: string }) => {
    const payload = {
      ...drive,
      college_id: collegeId,
      updated_at: new Date().toISOString(),
    }

    if (drive.id) {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_placement_drives').update(payload).eq('id', drive.id)
        } catch (e) {
          // ignore
        }
      }
      globalDrives = globalDrives.map((d) => (d.id === drive.id ? { ...d, ...payload } : d))
    } else {
      const newId = crypto.randomUUID()
      const item: PlacementDrive = { ...payload, id: newId, created_at: new Date().toISOString() }
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_placement_drives').insert(item)
        } catch (e) {
          // ignore
        }
      }
      globalDrives = [item, ...globalDrives]
    }
    notifyTnpListeners()
  }

  const deleteDrive = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_placement_drives').delete().eq('id', id)
      } catch (e) {
        // ignore
      }
    }
    globalDrives = globalDrives.filter((d) => d.id !== id)
    globalApplications = globalApplications.filter((a) => a.drive_id !== id)
    notifyTnpListeners()
  }

  const updateDriveStatus = async (id: string, status: DriveStatus) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_placement_drives').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
      } catch (e) {
        // ignore
      }
    }
    globalDrives = globalDrives.map((d) => (d.id === id ? { ...d, status } : d))
    notifyTnpListeners()
  }

  // Applications
  const applyForDrive = async (
    drive: PlacementDrive,
    student: {
      id: string
      name: string
      roll_no: string
      course: string
      branch: string
      year: string
      cgpa?: number
    }
  ) => {
    const existing = globalApplications.find((a) => a.drive_id === drive.id && a.student_id === student.id)
    if (existing) return existing

    const newApp: PlacementApplication = {
      id: crypto.randomUUID(),
      college_id: collegeId,
      drive_id: drive.id,
      student_id: student.id,
      student_name: student.name,
      roll_no: student.roll_no,
      course: student.course,
      branch: student.branch,
      year: student.year,
      cgpa: student.cgpa || 0,
      applied_at: new Date().toISOString(),
      status: 'Applied',
      current_round: 'Applied',
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_placement_applications').insert(newApp)
      } catch (e) {
        // ignore
      }
    }
    globalApplications = [newApp, ...globalApplications]
    notifyTnpListeners()
    return newApp
  }

  const updateApplicationStatus = async (id: string, status: AppStatus, current_round?: string, remarks?: string) => {
    const payload = {
      status,
      current_round: current_round || status,
      remarks: remarks || '',
      updated_at: new Date().toISOString(),
    }
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_placement_applications').update(payload).eq('id', id)
      } catch (e) {
        // ignore
      }
    }
    globalApplications = globalApplications.map((a) => (a.id === id ? { ...a, ...payload } : a))
    notifyTnpListeners()
  }

  // Selection Rounds
  const saveRound = async (round: Omit<SelectionRound, 'id' | 'college_id'> & { id?: string }) => {
    const payload = { ...round, college_id: collegeId }
    if (round.id) {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_selection_rounds').update(payload).eq('id', round.id)
        } catch (e) {
          // ignore
        }
      }
      globalRounds = globalRounds.map((r) => (r.id === round.id ? { ...r, ...payload } : r))
    } else {
      const item: SelectionRound = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_selection_rounds').insert(item)
        } catch (e) {
          // ignore
        }
      }
      globalRounds = [...globalRounds, item]
    }
    notifyTnpListeners()
  }

  // Internships
  const saveInternship = async (internship: Omit<Internship, 'id' | 'college_id'> & { id?: string }) => {
    const payload = { ...internship, college_id: collegeId }
    if (internship.id) {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_internships').update(payload).eq('id', internship.id)
        } catch (e) {
          // ignore
        }
      }
      globalInternships = globalInternships.map((i) => (i.id === internship.id ? { ...i, ...payload } : i))
    } else {
      const item: Internship = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_internships').insert(item)
        } catch (e) {
          // ignore
        }
      }
      globalInternships = [item, ...globalInternships]
    }
    notifyTnpListeners()
  }

  const deleteInternship = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_internships').delete().eq('id', id)
      } catch (e) {
        // ignore
      }
    }
    globalInternships = globalInternships.filter((i) => i.id !== id)
    notifyTnpListeners()
  }

  const applyForInternship = async (
    internshipId: string,
    student: { id: string; name: string; roll_no: string; course: string; branch: string; year: string }
  ) => {
    const existing = globalInternApplications.find(
      (a) => a.internship_id === internshipId && a.student_id === student.id
    )
    if (existing) return existing

    const newApp: InternshipApplication = {
      id: crypto.randomUUID(),
      college_id: collegeId,
      internship_id: internshipId,
      student_id: student.id,
      student_name: student.name,
      roll_no: student.roll_no,
      course: student.course,
      branch: student.branch,
      year: student.year,
      status: 'Applied',
      applied_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_internship_applications').insert(newApp)
      } catch (e) {
        // ignore
      }
    }
    globalInternApplications = [newApp, ...globalInternApplications]
    notifyTnpListeners()
    return newApp
  }

  // Trainings
  const saveTraining = async (training: Omit<TrainingSession, 'id' | 'college_id'> & { id?: string }) => {
    const payload = { ...training, college_id: collegeId }
    if (training.id) {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_trainings').update(payload).eq('id', training.id)
        } catch (e) {
          // ignore
        }
      }
      globalTrainings = globalTrainings.map((t) => (t.id === training.id ? { ...t, ...payload } : t))
    } else {
      const item: TrainingSession = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_trainings').insert(item)
        } catch (e) {
          // ignore
        }
      }
      globalTrainings = [item, ...globalTrainings]
    }
    notifyTnpListeners()
  }

  const deleteTraining = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_trainings').delete().eq('id', id)
      } catch (e) {
        // ignore
      }
    }
    globalTrainings = globalTrainings.filter((t) => t.id !== id)
    notifyTnpListeners()
  }

  const registerForTraining = async (
    trainingId: string,
    student: { id: string; name: string; roll_no: string; course: string; branch: string; year: string }
  ) => {
    const existing = globalTrainingRegistrations.find(
      (r) => r.training_id === trainingId && r.student_id === student.id
    )
    if (existing) return existing

    const newReg: TrainingRegistration = {
      id: crypto.randomUUID(),
      college_id: collegeId,
      training_id: trainingId,
      student_id: student.id,
      student_name: student.name,
      roll_no: student.roll_no,
      course: student.course,
      branch: student.branch,
      year: student.year,
      registered_at: new Date().toISOString(),
      attendance_status: 'Registered',
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_training_registrations').insert(newReg)
      } catch (e) {
        // ignore
      }
    }
    globalTrainingRegistrations = [newReg, ...globalTrainingRegistrations]
    notifyTnpListeners()
    return newReg
  }

  // Events
  const saveEvent = async (event: Omit<TnpEvent, 'id' | 'college_id'> & { id?: string }) => {
    const payload = { ...event, college_id: collegeId }
    if (event.id) {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_events').update(payload).eq('id', event.id)
        } catch (e) {
          // ignore
        }
      }
      globalEvents = globalEvents.map((e) => (e.id === event.id ? { ...e, ...payload } : e))
    } else {
      const item: TnpEvent = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_events').insert(item)
        } catch (e) {
          // ignore
        }
      }
      globalEvents = [item, ...globalEvents]
    }
    notifyTnpListeners()
  }

  const deleteEvent = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_events').delete().eq('id', id)
      } catch (e) {
        // ignore
      }
    }
    globalEvents = globalEvents.filter((e) => e.id !== id)
    notifyTnpListeners()
  }

  const registerForEvent = async (
    eventId: string,
    student: { id: string; name: string; roll_no: string; course: string; branch: string; year: string }
  ) => {
    const existing = globalEventRegistrations.find(
      (r) => r.event_id === eventId && r.student_id === student.id
    )
    if (existing) return existing

    const newReg: EventRegistration = {
      id: crypto.randomUUID(),
      college_id: collegeId,
      event_id: eventId,
      student_id: student.id,
      student_name: student.name,
      roll_no: student.roll_no,
      course: student.course,
      branch: student.branch,
      year: student.year,
      registered_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_event_registrations').insert(newReg)
      } catch (e) {
        // ignore
      }
    }
    globalEventRegistrations = [newReg, ...globalEventRegistrations]
    notifyTnpListeners()
    return newReg
  }

  // Placements
  const savePlacement = async (placement: Omit<PlacementRecord, 'id' | 'college_id'> & { id?: string }) => {
    const payload = {
      ...placement,
      college_id: collegeId,
      updated_at: new Date().toISOString(),
    }
    if (placement.id) {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_placements').update(payload).eq('id', placement.id)
        } catch (e) {
          // ignore
        }
      }
      globalPlacements = globalPlacements.map((p) => (p.id === placement.id ? { ...p, ...payload } : p))
    } else {
      const item: PlacementRecord = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_placements').insert(item)
        } catch (e) {
          // ignore
        }
      }
      globalPlacements = [item, ...globalPlacements]
    }
    notifyTnpListeners()
  }

  const deletePlacement = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_placements').delete().eq('id', id)
      } catch (e) {
        // ignore
      }
    }
    globalPlacements = globalPlacements.filter((p) => p.id !== id)
    notifyTnpListeners()
  }

  // Unified Activities
  const saveActivity = async (activity: Omit<TnpActivity, 'id' | 'college_id'> & { id?: string }) => {
    const payload = {
      ...activity,
      college_id: collegeId,
      updated_at: new Date().toISOString(),
    }
    if (activity.id) {
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_activities').update(payload).eq('id', activity.id)
        } catch (e) {
          // ignore
        }
      }
      globalActivities = globalActivities.map((a) => (a.id === activity.id ? { ...a, ...payload } : a))
    } else {
      const item: TnpActivity = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      if (isSupabaseConfigured) {
        try {
          await supabase.from('tnp_activities').insert(item)
        } catch (e) {
          // ignore
        }
      }
      globalActivities = [item, ...globalActivities]
    }
    notifyTnpListeners()
  }

  const deleteActivity = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tnp_activities').delete().eq('id', id)
      } catch (e) {
        // ignore
      }
    }
    globalActivities = globalActivities.filter((a) => a.id !== id)
    globalTrainings = globalTrainings.filter((t) => t.id !== id)
    globalEvents = globalEvents.filter((e) => e.id !== id)
    globalInternships = globalInternships.filter((i) => i.id !== id)
    notifyTnpListeners()
  }

  // Combined Activities normalized list
  const activities = useMemo(() => {
    const legacyActivities: TnpActivity[] = [
      ...globalTrainings.map((t) => ({
        id: t.id,
        college_id: t.college_id,
        activity_type: 'training' as ActivityType,
        title: t.title,
        description: t.description,
        speaker_trainer_organizer: t.trainer_name || t.organization,
        start_date: t.start_date,
        end_date: t.end_date,
        venue: t.venue,
        course: t.target_courses?.[0] || 'All',
        branch: t.target_branches?.[0] || 'All',
        year: t.target_years?.[0] || 'All',
        status: t.status,
        created_at: t.created_at,
      })),
      ...globalEvents.map((e) => ({
        id: e.id,
        college_id: e.college_id,
        activity_type: (e.type?.toLowerCase().includes('seminar') ? 'seminar' : 'event') as ActivityType,
        title: e.title,
        description: e.description,
        speaker_trainer_organizer: e.speaker || e.organization,
        start_date: e.event_date,
        end_date: e.event_date,
        venue: e.venue,
        course: e.target_courses?.[0] || 'All',
        branch: e.target_branches?.[0] || 'All',
        year: e.target_years?.[0] || 'All',
        status: e.status,
        created_at: e.created_at,
      })),
      ...globalInternships.map((i) => ({
        id: i.id,
        college_id: i.college_id,
        activity_type: 'internship' as ActivityType,
        title: i.title,
        description: i.description,
        speaker_trainer_organizer: i.company_name,
        company_name: i.company_name,
        start_date: i.start_date,
        application_deadline: i.reg_end_date,
        course: i.target_courses?.[0] || 'All',
        branch: i.target_branches?.[0] || 'All',
        year: i.target_years?.[0] || 'All',
        status: i.status,
        created_at: i.created_at,
      })),
    ]

    const actMap = new Map<string, TnpActivity>()
    globalActivities.forEach((a) => actMap.set(a.id, a))
    legacyActivities.forEach((la) => {
      if (!actMap.has(la.id)) {
        actMap.set(la.id, la)
      }
    })
    return Array.from(actMap.values())
  }, [globalActivities, globalTrainings, globalEvents, globalInternships])

  // ==========================================
  // METRICS & COMPUTED DATA
  // ==========================================

  const adminMetrics = useMemo(() => {
    const totalCompanies = globalCompanies.length
    const activeDrives = globalDrives.filter((d) => d.status === 'Registration Open' || d.status === 'In Process').length
    const upcomingDrives = globalDrives.filter((d) => d.status === 'Draft' || d.status === 'Registration Open').length
    const totalApplications = globalApplications.length
    const shortlisted = globalApplications.filter((a) => a.status === 'Shortlisted' || a.status === 'Aptitude' || a.status === 'GD' || a.status === 'PI').length
    const selected = globalApplications.filter((a) => a.status === 'Selected').length
    const activeInternships = globalInternships.filter((i) => i.status === 'Active').length
    const upcomingTrainings = globalTrainings.filter((t) => t.status === 'Upcoming' || t.status === 'Ongoing').length
    const upcomingSeminars = globalEvents.filter((e) => e.status === 'Upcoming').length
    const placedStudents = new Set(globalPlacements.map((p) => p.student_id)).size
    const totalActivities = activities.length

    return {
      totalCompanies,
      activeDrives,
      upcomingDrives,
      totalApplications,
      shortlisted,
      selected,
      activeInternships,
      upcomingTrainings,
      upcomingSeminars,
      placedStudents,
      totalActivities,
    }
  }, [activities])

  // Helper function to check student eligibility against drive target arrays
  const isStudentEligibleForDrive = useCallback(
    (drive: PlacementDrive, studentCourse: string, studentBranch: string, studentYear: string, studentCgpa?: number) => {
      const courseMatch =
        !drive.target_courses ||
        drive.target_courses.length === 0 ||
        drive.target_courses.includes('All') ||
        drive.target_courses.includes(studentCourse)

      const branchMatch =
        !drive.target_branches ||
        drive.target_branches.length === 0 ||
        drive.target_branches.includes('All') ||
        drive.target_branches.includes(studentBranch)

      const yearMatch =
        !drive.target_years ||
        drive.target_years.length === 0 ||
        drive.target_years.includes('All') ||
        drive.target_years.includes(studentYear)

      const cgpaMatch = !drive.min_cgpa || (studentCgpa !== undefined && studentCgpa >= drive.min_cgpa)

      return courseMatch && branchMatch && yearMatch && cgpaMatch
    },
    []
  )

  return {
    isLoading,
    companies: globalCompanies,
    drives: globalDrives,
    applications: globalApplications,
    rounds: globalRounds,
    results: globalResults,
    internships: globalInternships,
    internshipApplications: globalInternApplications,
    trainings: globalTrainings,
    trainingRegistrations: globalTrainingRegistrations,
    events: globalEvents,
    eventRegistrations: globalEventRegistrations,
    placements: globalPlacements,
    activities,

    // Actions
    refreshTnpData,
    saveCompany,
    deleteCompany,
    saveDrive,
    deleteDrive,
    updateDriveStatus,
    applyForDrive,
    updateApplicationStatus,
    saveRound,
    saveInternship,
    deleteInternship,
    applyForInternship,
    saveTraining,
    deleteTraining,
    registerForTraining,
    saveEvent,
    deleteEvent,
    registerForEvent,
    savePlacement,
    deletePlacement,
    saveActivity,
    deleteActivity,

    // Calculated stats
    adminMetrics,
    isStudentEligibleForDrive,
  }

}
