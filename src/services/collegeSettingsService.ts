import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface CollegeSettingsData {
  // SECTION A: College Profile
  name: string
  code: string
  logo_url: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  pincode: string
  phone: string
  alternate_phone: string
  email: string
  website: string
  established_year: string
  affiliated_university: string
  college_type: string

  // SECTION B: Academic Session
  academic_session: string
  session_start_date: string
  session_end_date: string
  active_semester: 'Odd' | 'Even'
  previous_sessions: string[]

  // SECTION D: Grading & Evaluation
  grading_system: 'Percentage' | 'CGPA' | 'Letter Grade'
  passing_criteria: number
  grade_boundaries: Record<string, number>
  allowed_exam_types: string[]

  // SECTION E: Attendance Rules
  min_attendance_percentage: number
  attendance_calc_method: 'per_subject' | 'per_day' | 'per_lecture'
  late_mark_policy: 'Present' | 'Absent' | 'Half'

  // SECTION F: Fee Configuration
  currency: string
  fee_cycle: 'Yearly' | 'Semester' | 'Monthly'
  late_fee_enabled: boolean
  late_fee_amount: number
  late_fee_grace_days: number
  receipt_prefix: string
  enabled_payment_modes: string[]

  // SECTION G: Notice Preferences
  default_notice_target: string
  auto_notice_exam: boolean
  auto_notice_fee: boolean
  auto_notice_holiday: boolean
  show_notice_on_login: boolean

  // SECTION H: Report Branding
  report_header_logo: string
  report_header_name: string
  report_tagline: string
  report_footer_text: string
}

export const DEFAULT_COLLEGE_SETTINGS: CollegeSettingsData = {
  name: 'R.R. Institute of Modern Technology',
  code: '0361',
  logo_url: '',
  address_line1: 'NH-24, Sitapur Road',
  address_line2: 'Bakamau, Uttar Pradesh',
  city: 'Lucknow',
  state: 'Uttar Pradesh',
  pincode: '226201',
  phone: '+91 7238087084',
  alternate_phone: '+91 522 273849',
  email: 'info@rrimt.ac.in',
  website: 'https://rrimt.ac.in',
  established_year: '2008',
  affiliated_university: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU) / BTEUP',
  college_type: 'Engineering',

  academic_session: '2025-2026',
  session_start_date: '2025-07-15',
  session_end_date: '2026-06-30',
  active_semester: 'Odd',
  previous_sessions: ['2024-2025', '2023-2024', '2022-2023'],

  grading_system: 'Percentage',
  passing_criteria: 40,
  grade_boundaries: {
    'A+': 90,
    'A': 80,
    'B+': 70,
    'B': 60,
    'C': 50,
    'D': 40,
    'F': 0,
  },
  allowed_exam_types: ['Sessional Exam', 'PUT', 'Test', 'Practical', 'Mid Term', 'End Semester'],

  min_attendance_percentage: 75,
  attendance_calc_method: 'per_lecture',
  late_mark_policy: 'Half',

  currency: 'INR (₹)',
  fee_cycle: 'Semester',
  late_fee_enabled: true,
  late_fee_amount: 50,
  late_fee_grace_days: 7,
  receipt_prefix: 'RRIMT-2025-',
  enabled_payment_modes: ['Cash', 'UPI', 'Bank Transfer', 'Online Gateway'],

  default_notice_target: 'All Students & Staff',
  auto_notice_exam: true,
  auto_notice_fee: true,
  auto_notice_holiday: true,
  show_notice_on_login: true,

  report_header_logo: '',
  report_header_name: 'R.R. INSTITUTE OF MODERN TECHNOLOGY',
  report_tagline: 'Approved by AICTE, New Delhi & Affiliated to AKTU / BTEUP',
  report_footer_text: 'NH-24, Sitapur Road, Lucknow, Uttar Pradesh - 226201 | Phone: +91 7238087084',
}

const memoryCache = new Map<string, CollegeSettingsData>()
const STORAGE_PREFIX = 'eduth_college_settings_cache_'

export class CollegeSettingsService {
  /**
   * Reads settings synchronously from in-memory cache or localStorage
   */
  static getCachedSettings(collegeId: string): CollegeSettingsData | null {
    if (memoryCache.has(collegeId)) {
      return memoryCache.get(collegeId)!
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(`${STORAGE_PREFIX}${collegeId}`)
        if (raw) {
          const parsed = JSON.parse(raw) as CollegeSettingsData
          memoryCache.set(collegeId, parsed)
          return parsed
        }
      }
    } catch {
      // Fallback
    }

    return null
  }

  /**
   * Saves settings to in-memory cache & localStorage
   */
  static setCachedSettings(collegeId: string, data: CollegeSettingsData): void {
    memoryCache.set(collegeId, data)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`${STORAGE_PREFIX}${collegeId}`, JSON.stringify(data))
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Merges Supabase row data with default values into a clean CollegeSettingsData object
   */
  static mapRowToSettings(data: any, baseDefaults = DEFAULT_COLLEGE_SETTINGS): CollegeSettingsData {
    const s = data?.settings || {}
    return {
      ...baseDefaults,
      name: data?.name || baseDefaults.name,
      code: data?.code || baseDefaults.code,
      logo_url: data?.logo_url || baseDefaults.logo_url,
      address_line1: data?.address_line1 || data?.address || baseDefaults.address_line1,
      address_line2: data?.address_line2 || baseDefaults.address_line2,
      city: data?.city || baseDefaults.city,
      state: data?.state || baseDefaults.state,
      pincode: data?.pincode || baseDefaults.pincode,
      phone: data?.phone || baseDefaults.phone,
      alternate_phone: data?.alternate_phone || baseDefaults.alternate_phone,
      email: data?.email || baseDefaults.email,
      website: data?.website || baseDefaults.website,
      established_year: data?.established_year || baseDefaults.established_year,
      affiliated_university: data?.affiliated_university || baseDefaults.affiliated_university,
      college_type: data?.college_type || baseDefaults.college_type,

      academic_session: s.academic_session || baseDefaults.academic_session,
      session_start_date: s.session_start_date || baseDefaults.session_start_date,
      session_end_date: s.session_end_date || baseDefaults.session_end_date,
      active_semester: s.active_semester || baseDefaults.active_semester,
      previous_sessions: s.previous_sessions || baseDefaults.previous_sessions,

      grading_system: s.grading_system || baseDefaults.grading_system,
      passing_criteria: s.passing_criteria ?? baseDefaults.passing_criteria,
      grade_boundaries: s.grade_boundaries || baseDefaults.grade_boundaries,
      allowed_exam_types: s.allowed_exam_types || baseDefaults.allowed_exam_types,

      min_attendance_percentage: s.min_attendance_percentage ?? baseDefaults.min_attendance_percentage,
      attendance_calc_method: s.attendance_calc_method || baseDefaults.attendance_calc_method,
      late_mark_policy: s.late_mark_policy || baseDefaults.late_mark_policy,

      currency: s.currency || baseDefaults.currency,
      fee_cycle: s.fee_cycle || baseDefaults.fee_cycle,
      late_fee_enabled: s.late_fee_enabled ?? baseDefaults.late_fee_enabled,
      late_fee_amount: s.late_fee_amount ?? baseDefaults.late_fee_amount,
      late_fee_grace_days: s.late_fee_grace_days ?? baseDefaults.late_fee_grace_days,
      receipt_prefix: s.receipt_prefix || baseDefaults.receipt_prefix,
      enabled_payment_modes: s.enabled_payment_modes || baseDefaults.enabled_payment_modes,

      default_notice_target: s.default_notice_target || baseDefaults.default_notice_target,
      auto_notice_exam: s.auto_notice_exam ?? baseDefaults.auto_notice_exam,
      auto_notice_fee: s.auto_notice_fee ?? baseDefaults.auto_notice_fee,
      auto_notice_holiday: s.auto_notice_holiday ?? baseDefaults.auto_notice_holiday,
      show_notice_on_login: s.show_notice_on_login ?? baseDefaults.show_notice_on_login,

      report_header_logo: s.report_header_logo || data?.logo_url || baseDefaults.report_header_logo,
      report_header_name: s.report_header_name || data?.name || baseDefaults.report_header_name,
      report_tagline: s.report_tagline || baseDefaults.report_tagline,
      report_footer_text: s.report_footer_text || baseDefaults.report_footer_text,
    }
  }

  /**
   * Fetches settings from Supabase, updates cache, and returns final merged object
   */
  static async fetchCollegeSettings(collegeId: string): Promise<CollegeSettingsData> {
    const cached = this.getCachedSettings(collegeId)
    const base = cached || DEFAULT_COLLEGE_SETTINGS

    if (!isSupabaseConfigured) {
      return base
    }

    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, code, logo_url, address, address_line1, address_line2, city, state, pincode, phone, alternate_phone, email, website, established_year, affiliated_university, college_type, settings')
        .eq('id', collegeId)
        .maybeSingle()

      if (error) {
        console.warn('Supabase fetch college settings notice:', error.message)
        return base
      }

      if (data) {
        const merged = this.mapRowToSettings(data, base)
        this.setCachedSettings(collegeId, merged)
        return merged
      }
    } catch (err: any) {
      console.error('Failed to fetch college settings:', err)
    }

    return base
  }
}
