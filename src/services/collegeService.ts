import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { College, Profile, CollegeRegistrationPayload } from '../types/domain'

// In-memory / persistent localStorage college registry for demo and Supabase integration
const STORAGE_KEY_COLLEGES = 'eduth_colleges_db'
const STORAGE_KEY_PROFILES = 'eduth_profiles_db'

export class CollegeService {
  private static getStoredColleges(): College[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_COLLEGES)
        if (saved) return JSON.parse(saved)
      }
    } catch {
      // Fallback
    }
    return []
  }

  private static saveColleges(colleges: College[]) {
    localStorage.setItem(STORAGE_KEY_COLLEGES, JSON.stringify(colleges))
  }

  static getColleges(): College[] {
    return this.getStoredColleges()
  }

  static getCollegeById(id: string): College | undefined {
    return this.getStoredColleges().find((c) => c.id === id || c.code === id)
  }

  static async getCollegeByIdAsync(id: string): Promise<College | undefined> {
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase.from('colleges').select('*').or(`id.eq.${id},code.eq.${id}`).maybeSingle()
        if (data) return data as College
      } catch {
        // Fallback
      }
    }
    return this.getCollegeById(id)
  }

  static updateCollegeStatus(collegeId: string, status: 'active' | 'suspended' | 'inactive'): College | null {
    const colleges = this.getStoredColleges()
    const index = colleges.findIndex((c) => c.id === collegeId)
    if (index !== -1) {
      colleges[index].status = status
      this.saveColleges(colleges)
    }

    if (isSupabaseConfigured) {
      supabase.from('colleges').update({ status }).eq('id', collegeId).then()
    }

    return colleges[index] || null
  }

  static createCollege(payload: CollegeRegistrationPayload): { college: College; adminProfile: Profile } {
    const colleges = this.getStoredColleges()

    const collegeId = payload.college_code
      ? payload.college_code.toUpperCase().replace(/[^A-Z0-9]/g, '')
      : `COL${String(colleges.length + 1).padStart(3, '0')}`

    if (colleges.some((c) => c.id === collegeId || c.code === payload.college_code)) {
      throw new Error(`College code '${payload.college_code || collegeId}' is already registered.`)
    }

    const newCollege: College = {
      id: collegeId,
      code: payload.college_code || collegeId,
      name: payload.college_name,
      email: payload.official_email,
      phone: payload.official_phone,
      address: payload.address,
      city: payload.city || '',
      state: payload.state || '',
      country: payload.country || 'USA',
      status: 'active',
      created_at: new Date().toISOString(),
    }

    colleges.push(newCollege)
    this.saveColleges(colleges)

    const adminId = `admin_${collegeId.toLowerCase()}_01`
    const adminProfile: Profile = {
      id: adminId,
      college_id: collegeId,
      school_id: collegeId,
      role: 'admin',
      name: payload.admin_name,
      email: payload.admin_email,
      phone: payload.admin_phone || payload.official_phone,
      status: 'active',
      created_at: new Date().toISOString(),
    }

    try {
      const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES)
      const profiles: Profile[] = savedProfiles ? JSON.parse(savedProfiles) : []
      profiles.push(adminProfile)
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles))
    } catch {
      // Ignore
    }

    if (isSupabaseConfigured) {
      supabase.from('colleges').insert([newCollege]).then()
    }

    return { college: newCollege, adminProfile }
  }

  static async createCollegeAsync(payload: CollegeRegistrationPayload): Promise<{ college: College; adminProfile: Profile }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('create_college_with_admin', {
          p_college_code: payload.college_code,
          p_college_name: payload.college_name,
          p_official_email: payload.official_email,
          p_official_phone: payload.official_phone,
          p_address: payload.address,
          p_city: payload.city || '',
          p_state: payload.state || '',
          p_country: payload.country || 'USA',
          p_admin_name: payload.admin_name,
          p_admin_email: payload.admin_email,
          p_admin_password: payload.admin_password,
          p_admin_phone: payload.admin_phone || payload.official_phone || null,
        })

        if (error) {
          throw new Error(error.message)
        }

        if (data) {
          const college: College = {
            id: data.college_id,
            code: data.college_code,
            name: data.college_name,
            email: payload.official_email,
            phone: payload.official_phone,
            address: payload.address,
            city: payload.city || '',
            state: payload.state || '',
            country: payload.country || 'USA',
            status: 'active',
            created_at: new Date().toISOString(),
          }

          const adminProfile: Profile = {
            id: data.admin_user_id,
            college_id: data.college_id,
            school_id: data.college_id,
            role: 'admin',
            name: payload.admin_name,
            email: payload.admin_email,
            status: 'active',
            created_at: new Date().toISOString(),
          }

          const colleges = this.getStoredColleges()
          colleges.push(college)
          this.saveColleges(colleges)

          return { college, adminProfile }
        }
      } catch (err: any) {
        throw new Error(err.message || 'Failed to create college with admin')
      }
    }

    return this.createCollege(payload)
  }

  static async fetchCollegesAsync(): Promise<College[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('colleges').select('*').order('created_at', { ascending: false })
        if (!error && data && data.length > 0) {
          this.saveColleges(data as College[])
          return data as College[]
        }
      } catch {
        // Fallback
      }
    }
    return this.getStoredColleges()
  }

  static async getCollegeAdminAsync(collegeId: string): Promise<Profile | null> {
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .or(`college_id.eq.${collegeId},school_id.eq.${collegeId}`)
          .eq('role', 'admin')
          .maybeSingle()

        if (data) return data as Profile
      } catch {
        // Fallback
      }
    }

    try {
      const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES)
      const profiles: Profile[] = savedProfiles ? JSON.parse(savedProfiles) : []
      const found = profiles.find((p) => (p.college_id === collegeId || p.school_id === collegeId) && p.role === 'admin')
      if (found) return found
    } catch {
      // Ignore
    }

    return null
  }

  static async updateCollegeAsync(
    collegeId: string,
    payload: Partial<CollegeRegistrationPayload>
  ): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.rpc('update_college_and_admin', {
          p_college_id: collegeId,
          p_college_name: payload.college_name || '',
          p_official_email: payload.official_email || '',
          p_official_phone: payload.official_phone || '',
          p_address: payload.address || '',
          p_city: payload.city || '',
          p_state: payload.state || '',
          p_country: payload.country || 'USA',
          p_admin_name: payload.admin_name || '',
          p_admin_email: payload.admin_email || '',
          p_admin_phone: payload.admin_phone || payload.official_phone || null,
        })
        if (error) {
          throw new Error(error.message)
        }
      } catch (err: any) {
        throw new Error(err.message || 'Failed to update college record')
      }
    }

    const colleges = this.getStoredColleges()
    const index = colleges.findIndex((c) => c.id === collegeId || c.code === collegeId)
    if (index !== -1) {
      colleges[index] = {
        ...colleges[index],
        name: payload.college_name || colleges[index].name,
        email: payload.official_email || colleges[index].email,
        phone: payload.official_phone || colleges[index].phone,
        address: payload.address || colleges[index].address,
        city: payload.city !== undefined ? payload.city : colleges[index].city,
        state: payload.state !== undefined ? payload.state : colleges[index].state,
        country: payload.country || colleges[index].country,
      }
      this.saveColleges(colleges)
    }
    return true
  }

  static async deleteCollegeAsync(collegeId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.rpc('delete_college_cascade', { p_college_id: collegeId })
        if (error) {
          throw new Error(error.message)
        }
      } catch (err: any) {
        throw new Error(err.message || 'Failed to delete college record')
      }
    }

    const colleges = this.getStoredColleges().filter((c) => c.id !== collegeId && c.code !== collegeId)
    this.saveColleges(colleges)
    return true
  }
}


