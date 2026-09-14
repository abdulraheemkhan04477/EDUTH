import { useState, useEffect } from 'react'
import { COURSES, BRANCHES_BY_COURSE, SEMESTERS_BY_YEAR_COURSE, normalizeCollegeId } from './academicStore'
import { supabase, isSupabaseConfigured } from './supabase'
import { useAuth } from '../app/providers/AuthProvider'

export type MaterialCategory =
  | 'Handwritten Notes'
  | 'Previous Year Questions'
  | 'Quantum'
  | 'Books'
  | 'Additional Notes'

export type ContentType = 'PDF' | 'Link'
export type AccessType = 'Free' | 'Premium'

export interface StudyMaterialItem {
  id: string
  course: string
  branch: string
  year?: string
  semester: string
  section?: string
  is_common_subject: boolean
  title: string
  subject_name: string
  subject_code: string
  subject_id?: string
  class_id?: string
  description: string
  category: MaterialCategory
  content_type: ContentType
  url: string
  size: string
  access_type: AccessType
  uploader: string
  uploaded_by?: string
  uploaded_by_role?: string
  date: string
  college_id?: string
}

export const CATEGORIES: MaterialCategory[] = [
  'Handwritten Notes',
  'Previous Year Questions',
  'Quantum',
  'Books',
  'Additional Notes',
]

// Initial state is empty when Supabase is configured
const initialStudyMaterials: StudyMaterialItem[] = []

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

let materialsState = loadLocalStorage<StudyMaterialItem[]>(
  'eduth_study_materials_v2',
  initialStudyMaterials
)

export async function uploadStudyMaterialFile(file: File, collegeId?: string): Promise<string> {
  if (!isSupabaseConfigured) {
    return URL.createObjectURL(file)
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${collegeId || 'common'}/${Date.now()}_${cleanName}`

  const { data, error } = await supabase.storage
    .from('study-materials')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Supabase storage upload error:', error.message)
    throw new Error(`File Upload Failed: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage
    .from('study-materials')
    .getPublicUrl(data.path)

  return publicUrlData.publicUrl
}

let _lastStudyMatSyncTime = 0
let _loadedStudyMatCollege: string | null = null
let _inFlightStudyMatSync: Promise<void> | null = null
const STUDY_MAT_CACHE_TTL_MS = 30000

export function invalidateStudyMaterialCache() {
  _lastStudyMatSyncTime = 0
}

export async function syncStudyMaterialsWithSupabase(userCollegeId?: string, isSuperAdmin?: boolean) {
  if (!isSupabaseConfigured) return

  const targetCollege = isSuperAdmin ? 'SUPER_ADMIN' : (userCollegeId || 'COL001')

  if (_loadedStudyMatCollege === targetCollege && Date.now() - _lastStudyMatSyncTime < STUDY_MAT_CACHE_TTL_MS) {
    return
  }

  if (_inFlightStudyMatSync) {
    return _inFlightStudyMatSync
  }

  _inFlightStudyMatSync = (async () => {
    try {
      let query = supabase.from('study_materials').select('*').order('created_at', { ascending: false })

      if (!isSuperAdmin && userCollegeId && userCollegeId !== 'PLATFORM_ALL') {
        query = query.eq('college_id', userCollegeId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase study materials sync notice:', error.message)
        return
      }

      if (data) {
        materialsState = (data as any[]).map((m) => ({
          id: m.id,
          course: m.course || 'B.Tech',
          branch: m.branch || 'ECE',
          year: m.year || '1st Year',
          semester: m.semester || 'Semester 1',
          section: m.section || 'All',
          is_common_subject: Boolean(m.is_common_subject),
          title: m.title,
          subject_name: m.subject_name || '',
          subject_code: m.subject_code || '',
          subject_id: m.subject_id || undefined,
          class_id: m.class_id || undefined,
          description: m.description || '',
          category: (m.category || 'Handwritten Notes') as MaterialCategory,
          content_type: (m.content_type || 'PDF') as ContentType,
          url: m.url || m.file_url || '',
          size: m.size || (m.file_size ? `${(m.file_size / (1024 * 1024)).toFixed(1)} MB` : '1.0 MB'),
          access_type: (m.access_type || 'Free') as AccessType,
          uploader: m.uploader || m.uploader_name || 'Faculty Member',
          uploaded_by: m.uploaded_by || '',
          uploaded_by_role: m.uploaded_by_role || '',
          date: m.date || (m.created_at ? new Date(m.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          college_id: m.college_id,
        }))
        saveLocalStorage('eduth_study_materials_v2', materialsState)
        _lastStudyMatSyncTime = Date.now()
        _loadedStudyMatCollege = targetCollege
        notifyListeners()
      }
    } catch (err) {
      // Ignore error
    } finally {
      _inFlightStudyMatSync = null
    }
  })()

  return _inFlightStudyMatSync
}

export function resetStudyMaterialStore() {
  materialsState = []
  saveLocalStorage('eduth_study_materials_v2', materialsState)
  notifyListeners()
}

export const studyMaterialStore = {
  getMaterials: (): StudyMaterialItem[] => materialsState,

  getStudentMaterials: (
    course: string,
    branch: string,
    year: string,
    semester: string,
    section: string = 'All'
  ): StudyMaterialItem[] => {
    return materialsState.filter((m) => {
      // 1. Course Match
      if (m.course && m.course !== course) return false

      // 2. Year Match (If year specified)
      if (m.year && year && m.year !== year) return false

      // 3. Semester Match
      if (m.semester && m.semester !== semester) return false

      // 4. Branch Match (Is common subject OR branch matches)
      const isCommonBranch =
        m.is_common_subject ||
        m.branch === 'Common Subject' ||
        m.branch === 'All Branches / Common' ||
        m.branch === 'All Branches'
      if (!isCommonBranch && m.branch !== branch) return false

      // 5. Section Match (If material has specific section other than 'All')
      if (m.section && m.section !== 'All' && m.section !== 'All Sections' && section && section !== 'All' && m.section !== section) {
        return false
      }

      return true
    })
  },

  saveMaterial: async (
    item: Omit<StudyMaterialItem, 'id' | 'date'> & {
      id?: string
      date?: string
      college_id?: string
      fileToUpload?: File | null
    }
  ) => {
    const id = item.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'sm_' + Date.now())
    
    let finalUrl = item.url
    let fileSizeStr = item.size

    // If a physical file was provided, upload to Supabase Storage
    if (item.fileToUpload) {
      finalUrl = await uploadStudyMaterialFile(item.fileToUpload, item.college_id)
      fileSizeStr = `${(item.fileToUpload.size / (1024 * 1024)).toFixed(1)} MB`
    }

    const targetItem: StudyMaterialItem = {
      ...item,
      id,
      url: finalUrl,
      size: fileSizeStr,
      year: item.year || '1st Year',
      section: item.section || 'All',
      date: item.date || new Date().toISOString().split('T')[0],
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('study_materials').upsert([{
        id: targetItem.id,
        college_id: targetItem.college_id,
        title: targetItem.title,
        course: targetItem.course,
        branch: targetItem.branch,
        year: targetItem.year,
        semester: targetItem.semester,
        section: targetItem.section,
        is_common_subject: targetItem.is_common_subject,
        subject_name: targetItem.subject_name,
        subject_code: targetItem.subject_code,
        subject_id: targetItem.subject_id || null,
        class_id: targetItem.class_id || null,
        description: targetItem.description,
        category: targetItem.category,
        content_type: targetItem.content_type,
        url: targetItem.url,
        file_url: targetItem.url,
        size: targetItem.size,
        access_type: targetItem.access_type,
        uploader: targetItem.uploader,
        uploader_name: targetItem.uploader,
        uploaded_by: targetItem.uploaded_by || null,
        uploaded_by_role: targetItem.uploaded_by_role || null,
        date: targetItem.date,
      }])

      if (error) {
        console.error('Save material error:', error)
        throw new Error(error.message)
      }
    }

    const existingIndex = materialsState.findIndex((m) => m.id === targetItem.id)
    if (existingIndex >= 0) {
      materialsState[existingIndex] = targetItem
    } else {
      materialsState = [targetItem, ...materialsState]
    }

    saveLocalStorage('eduth_study_materials_v2', materialsState)
    notifyListeners()
    return targetItem
  },

  deleteMaterial: async (id: string) => {
    const target = materialsState.find((m) => m.id === id)
    
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('study_materials').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }

      // Try to clean up storage object if URL is from study-materials storage bucket
      if (target?.url && target.url.includes('/study-materials/')) {
        try {
          const parts = target.url.split('/study-materials/')
          if (parts[1]) {
            await supabase.storage.from('study-materials').remove([decodeURIComponent(parts[1])])
          }
        } catch {
          // non-critical cleanup
        }
      }
    }

    materialsState = materialsState.filter((m) => m.id !== id)
    saveLocalStorage('eduth_study_materials_v2', materialsState)
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

export function useStudyMaterialStore() {
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
    syncStudyMaterialsWithSupabase(userCollege, isSuperAdmin)
    const unsubscribe = studyMaterialStore.subscribe(() => {
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

  const rawMaterials = studyMaterialStore.getMaterials()
  const scopedMaterials = isSuperAdmin ? rawMaterials : rawMaterials.filter((m) => isCollegeMatch(m.college_id))

  return {
    materials: scopedMaterials,
    getStudentMaterials: studyMaterialStore.getStudentMaterials,
    saveMaterial: studyMaterialStore.saveMaterial,
    deleteMaterial: studyMaterialStore.deleteMaterial,
    categories: CATEGORIES,
    courses: COURSES,
    branchesByCourse: BRANCHES_BY_COURSE,
    getSemestersByYearCourse: SEMESTERS_BY_YEAR_COURSE,
  }
}
