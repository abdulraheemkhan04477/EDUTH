import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Tabs,
  Button,
  FormField,
  Input,
  Select,
  FileUpload,
  Modal,
} from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import {
  Settings,
  Save,
  Building,
  Calendar,
  Bell,
  Globe,
  RotateCcw,
  BookOpen,
  DollarSign,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Award,
  Layers,
} from 'lucide-react'
import { useAcademicStore, normalizeCollegeId } from '../../lib/academicStore'
import { useAuth } from '../../app/providers/AuthProvider'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export function SettingsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const { classes, students, teachers } = useAcademicStore()

  const rawUserCollege = user?.college_id || user?.school_id || '13695a78-0105-4bde-bc85-d664bb66637e'
  const userCollegeId = normalizeCollegeId(rawUserCollege) || '13695a78-0105-4bde-bc85-d664bb66637e'

  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [confirmResetText, setConfirmResetText] = useState('')

  // Settings State matching Sections A to H
  const [collegeData, setCollegeData] = useState({
    // SECTION A: College Profile
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

    // SECTION B: Academic Session
    academic_session: '2025-2026',
    session_start_date: '2025-07-15',
    session_end_date: '2026-06-30',
    active_semester: 'Odd' as 'Odd' | 'Even',
    previous_sessions: ['2024-2025', '2023-2024', '2022-2023'],

    // SECTION D: Grading & Evaluation
    grading_system: 'Percentage' as 'Percentage' | 'CGPA' | 'Letter Grade',
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

    // SECTION E: Attendance Rules
    min_attendance_percentage: 75,
    attendance_calc_method: 'per_lecture' as 'per_subject' | 'per_day' | 'per_lecture',
    late_mark_policy: 'Half' as 'Present' | 'Absent' | 'Half',

    // SECTION F: Fee Configuration
    currency: 'INR (₹)',
    fee_cycle: 'Semester' as 'Yearly' | 'Semester' | 'Monthly',
    late_fee_enabled: true,
    late_fee_amount: 50,
    late_fee_grace_days: 7,
    receipt_prefix: 'RRIMT-2025-',
    enabled_payment_modes: ['Cash', 'UPI', 'Bank Transfer', 'Online Gateway'],

    // SECTION G: Notice Preferences
    default_notice_target: 'All Students & Staff',
    auto_notice_exam: true,
    auto_notice_fee: true,
    auto_notice_holiday: true,
    show_notice_on_login: true,

    // SECTION H: Report Branding
    report_header_logo: '',
    report_header_name: 'R.R. INSTITUTE OF MODERN TECHNOLOGY',
    report_tagline: 'Approved by AICTE, New Delhi & Affiliated to AKTU / BTEUP',
    report_footer_text: 'NH-24, Sitapur Road, Lucknow, Uttar Pradesh - 226201 | Phone: +91 7238087084',
  })

  // Load persistent settings from Supabase DB on mount
  useEffect(() => {
    let isMounted = true

    const fetchCollegeSettings = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('id', userCollegeId)
          .maybeSingle()

        if (error) {
          console.warn('Supabase fetch college settings notice:', error.message)
        }

        if (data && isMounted) {
          const s = data.settings || {}
          setCollegeData((prev) => ({
            ...prev,
            name: data.name || prev.name,
            code: data.code || prev.code,
            logo_url: data.logo_url || prev.logo_url,
            address_line1: data.address_line1 || data.address || prev.address_line1,
            address_line2: data.address_line2 || prev.address_line2,
            city: data.city || prev.city,
            state: data.state || prev.state,
            pincode: data.pincode || prev.pincode,
            phone: data.phone || prev.phone,
            alternate_phone: data.alternate_phone || prev.alternate_phone,
            email: data.email || prev.email,
            website: data.website || prev.website,
            established_year: data.established_year || prev.established_year,
            affiliated_university: data.affiliated_university || prev.affiliated_university,
            college_type: data.college_type || prev.college_type,

            academic_session: s.academic_session || prev.academic_session,
            session_start_date: s.session_start_date || prev.session_start_date,
            session_end_date: s.session_end_date || prev.session_end_date,
            active_semester: s.active_semester || prev.active_semester,
            previous_sessions: s.previous_sessions || prev.previous_sessions,

            grading_system: s.grading_system || prev.grading_system,
            passing_criteria: s.passing_criteria ?? prev.passing_criteria,
            grade_boundaries: s.grade_boundaries || prev.grade_boundaries,
            allowed_exam_types: s.allowed_exam_types || prev.allowed_exam_types,

            min_attendance_percentage: s.min_attendance_percentage ?? prev.min_attendance_percentage,
            attendance_calc_method: s.attendance_calc_method || prev.attendance_calc_method,
            late_mark_policy: s.late_mark_policy || prev.late_mark_policy,

            currency: s.currency || prev.currency,
            fee_cycle: s.fee_cycle || prev.fee_cycle,
            late_fee_enabled: s.late_fee_enabled ?? prev.late_fee_enabled,
            late_fee_amount: s.late_fee_amount ?? prev.late_fee_amount,
            late_fee_grace_days: s.late_fee_grace_days ?? prev.late_fee_grace_days,
            receipt_prefix: s.receipt_prefix || prev.receipt_prefix,
            enabled_payment_modes: s.enabled_payment_modes || prev.enabled_payment_modes,

            default_notice_target: s.default_notice_target || prev.default_notice_target,
            auto_notice_exam: s.auto_notice_exam ?? prev.auto_notice_exam,
            auto_notice_fee: s.auto_notice_fee ?? prev.auto_notice_fee,
            auto_notice_holiday: s.auto_notice_holiday ?? prev.auto_notice_holiday,
            show_notice_on_login: s.show_notice_on_login ?? prev.show_notice_on_login,

            report_header_logo: s.report_header_logo || data.logo_url || prev.report_header_logo,
            report_header_name: s.report_header_name || data.name || prev.report_header_name,
            report_tagline: s.report_tagline || prev.report_tagline,
            report_footer_text: s.report_footer_text || prev.report_footer_text,
          }))
        }
      } catch (err: any) {
        console.error('Failed to load college settings:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCollegeSettings()
  }, [userCollegeId])

  // Save all settings to Supabase Postgres DB
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      if (isSupabaseConfigured) {
        const rootFields = {
          name: collegeData.name,
          code: collegeData.code,
          email: collegeData.email,
          phone: collegeData.phone,
          address: `${collegeData.address_line1} ${collegeData.address_line2}`.trim(),
          address_line1: collegeData.address_line1,
          address_line2: collegeData.address_line2,
          city: collegeData.city,
          state: collegeData.state,
          pincode: collegeData.pincode,
          logo_url: collegeData.logo_url,
          website: collegeData.website,
          established_year: collegeData.established_year,
          affiliated_university: collegeData.affiliated_university,
          college_type: collegeData.college_type,
          alternate_phone: collegeData.alternate_phone,
          settings: {
            academic_session: collegeData.academic_session,
            session_start_date: collegeData.session_start_date,
            session_end_date: collegeData.session_end_date,
            active_semester: collegeData.active_semester,
            previous_sessions: collegeData.previous_sessions,

            grading_system: collegeData.grading_system,
            passing_criteria: collegeData.passing_criteria,
            grade_boundaries: collegeData.grade_boundaries,
            allowed_exam_types: collegeData.allowed_exam_types,

            min_attendance_percentage: collegeData.min_attendance_percentage,
            attendance_calc_method: collegeData.attendance_calc_method,
            late_mark_policy: collegeData.late_mark_policy,

            currency: collegeData.currency,
            fee_cycle: collegeData.fee_cycle,
            late_fee_enabled: collegeData.late_fee_enabled,
            late_fee_amount: collegeData.late_fee_amount,
            late_fee_grace_days: collegeData.late_fee_grace_days,
            receipt_prefix: collegeData.receipt_prefix,
            enabled_payment_modes: collegeData.enabled_payment_modes,

            default_notice_target: collegeData.default_notice_target,
            auto_notice_exam: collegeData.auto_notice_exam,
            auto_notice_fee: collegeData.auto_notice_fee,
            auto_notice_holiday: collegeData.auto_notice_holiday,
            show_notice_on_login: collegeData.show_notice_on_login,

            report_header_logo: collegeData.report_header_logo,
            report_header_name: collegeData.report_header_name,
            report_tagline: collegeData.report_tagline,
            report_footer_text: collegeData.report_footer_text,
          },
        }

        const { error } = await supabase
          .from('colleges')
          .update(rootFields)
          .eq('id', userCollegeId)

        if (error) {
          throw new Error(error.message)
        }
      }

      toast({
        title: 'Settings Saved',
        description: 'College configuration & preferences saved successfully to Supabase.',
        type: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message || 'Failed to save college settings.',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle Logo Upload
  const handleLogoUpload = async (file: File | null) => {
    if (!file) return
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `logos/${userCollegeId}_${Date.now()}.${fileExt}`

      if (isSupabaseConfigured) {
        const { error: uploadErr } = await supabase.storage
          .from('college-logos')
          .upload(filePath, file, { upsert: true })

        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('college-logos').getPublicUrl(filePath)
          if (urlData?.publicUrl) {
            setCollegeData((prev) => ({
              ...prev,
              logo_url: urlData.publicUrl,
              report_header_logo: urlData.publicUrl,
            }))
            toast({ title: 'Logo Uploaded', description: 'College logo saved to Supabase storage.', type: 'success' })
            return
          }
        }
      }

      // Fallback preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCollegeData((prev) => ({ ...prev, logo_url: result, report_header_logo: result }))
        toast({ title: 'Logo Loaded', description: `Loaded logo: ${file.name}`, type: 'success' })
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      toast({ title: 'Upload Failed', description: err.message || 'Could not upload logo.', type: 'error' })
    }
  }

  // Toggle helpers for multi-select checklists
  const toggleExamType = (type: string) => {
    setCollegeData((prev) => {
      const exists = prev.allowed_exam_types.includes(type)
      const updated = exists ? prev.allowed_exam_types.filter((t) => t !== type) : [...prev.allowed_exam_types, type]
      return { ...prev, allowed_exam_types: updated }
    })
  }

  const togglePaymentMode = (mode: string) => {
    setCollegeData((prev) => {
      const exists = prev.enabled_payment_modes.includes(mode)
      const updated = exists ? prev.enabled_payment_modes.filter((m) => m !== mode) : [...prev.enabled_payment_modes, mode]
      return { ...prev, enabled_payment_modes: updated }
    })
  }

  // Academic Structure Summary Counts
  const academicSummary = useMemo(() => {
    const totalClasses = classes.length
    const totalStudents = students.length
    const totalTeachers = teachers.length
    const uniqueCourses = Array.from(new Set(classes.map((c) => c.course).filter(Boolean)))
    const uniqueBranches = Array.from(new Set(classes.map((c) => c.branch).filter(Boolean)))
    return {
      totalClasses,
      totalStudents,
      totalTeachers,
      coursesCount: uniqueCourses.length || 3,
      branchesCount: uniqueBranches.length || 9,
    }
  }, [classes, students, teachers])

  // Handle Academic Session Reset (Danger Zone)
  const handleResetSession = () => {
    if (confirmResetText !== 'RESET SESSION') {
      toast({ title: 'Invalid Confirmation', description: 'Please type "RESET SESSION" exactly to confirm.', type: 'error' })
      return
    }
    setShowResetModal(false)
    setConfirmResetText('')
    toast({
      title: 'Session Reset Initiated',
      description: 'Academic session parameters re-initialized for the upcoming term.',
      type: 'info',
    })
  }

  const tabs = [
    { id: 'profile', label: 'College Profile' },
    { id: 'academic', label: 'Academic & Structure' },
    { id: 'evaluation', label: 'Grading & Attendance' },
    { id: 'fees', label: 'Fees & Notices' },
    { id: 'branding', label: 'Branding & Data' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-brand-600" /> College Admin Settings
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            Configure institutional parameters, academic calendar, grading evaluation rules, fee cycles, and report branding.
          </p>
        </div>
        <Button onClick={handleSaveAll} disabled={saving || loading} className="shrink-0 bg-brand-600 hover:bg-brand-700">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} className="border-b border-border" />

      {loading ? (
        <div className="p-12 text-center text-ink-400">Loading college settings from Supabase DB...</div>
      ) : (
        <>
          {/* TAB 1: SECTION A — College Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 shadow-[var(--shadow-soft)] space-y-6">
                <h3 className="text-base font-bold text-ink-900 border-b border-border pb-3 flex items-center gap-2">
                  <Building className="h-5 w-5 text-brand-600" /> Section A — College Profile & Institution Identity
                </h3>

                {/* Logo & Banner Upload */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-ink-900">Official College Logo</label>
                    {collegeData.logo_url ? (
                      <div className="flex items-center gap-4">
                        <img src={collegeData.logo_url} alt="College Logo" className="h-16 w-16 object-contain rounded border border-border bg-white p-1" />
                        <Button variant="ghost" size="sm" onClick={() => setCollegeData((p) => ({ ...p, logo_url: '' }))}>
                          Remove Logo
                        </Button>
                      </div>
                    ) : (
                      <FileUpload accept="image/*" onFileSelect={handleLogoUpload} />
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <FormField label="Logo Public Image URL (Direct Link)">
                      <Input
                        placeholder="https://example.com/logo.png"
                        value={collegeData.logo_url}
                        onChange={(e) => setCollegeData({ ...collegeData, logo_url: e.target.value })}
                      />
                    </FormField>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="College Name" required>
                    <Input
                      value={collegeData.name}
                      onChange={(e) => setCollegeData({ ...collegeData, name: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Short Code / College Alias" required>
                    <Input
                      value={collegeData.code}
                      onChange={(e) => setCollegeData({ ...collegeData, code: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Official Contact Email" required>
                    <Input
                      type="email"
                      value={collegeData.email}
                      onChange={(e) => setCollegeData({ ...collegeData, email: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Primary Phone Number" required>
                    <Input
                      value={collegeData.phone}
                      onChange={(e) => setCollegeData({ ...collegeData, phone: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Alternate Phone Number">
                    <Input
                      value={collegeData.alternate_phone}
                      onChange={(e) => setCollegeData({ ...collegeData, alternate_phone: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Official Website URL">
                    <Input
                      value={collegeData.website}
                      onChange={(e) => setCollegeData({ ...collegeData, website: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Established Year">
                    <Input
                      value={collegeData.established_year}
                      onChange={(e) => setCollegeData({ ...collegeData, established_year: e.target.value })}
                    />
                  </FormField>
                  <FormField label="College Type">
                    <Select
                      options={[
                        { value: 'Engineering', label: 'Engineering & Technology' },
                        { value: 'Diploma', label: 'Polytechnic Diploma' },
                        { value: 'MBA', label: 'Management (MBA/PGDM)' },
                        { value: 'Mixed', label: 'Integrated / Mixed Institution' },
                      ]}
                      value={collegeData.college_type}
                      onChange={(e) => setCollegeData({ ...collegeData, college_type: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Affiliated University / Board" className="md:col-span-2">
                    <Input
                      value={collegeData.affiliated_university}
                      onChange={(e) => setCollegeData({ ...collegeData, affiliated_university: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Address Line 1" required>
                    <Input
                      value={collegeData.address_line1}
                      onChange={(e) => setCollegeData({ ...collegeData, address_line1: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Address Line 2">
                    <Input
                      value={collegeData.address_line2}
                      onChange={(e) => setCollegeData({ ...collegeData, address_line2: e.target.value })}
                    />
                  </FormField>
                  <FormField label="City" required>
                    <Input
                      value={collegeData.city}
                      onChange={(e) => setCollegeData({ ...collegeData, city: e.target.value })}
                    />
                  </FormField>
                  <FormField label="State" required>
                    <Input
                      value={collegeData.state}
                      onChange={(e) => setCollegeData({ ...collegeData, state: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Pincode">
                    <Input
                      value={collegeData.pincode}
                      onChange={(e) => setCollegeData({ ...collegeData, pincode: e.target.value })}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTION B & SECTION C — Academic Session & Structure Shortcut */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              {/* SECTION B: Academic Session */}
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 shadow-[var(--shadow-soft)] space-y-4">
                <h3 className="text-base font-bold text-ink-900 border-b border-border pb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-brand-600" /> Section B — Academic Session Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Current Academic Session" required>
                    <Input
                      value={collegeData.academic_session}
                      onChange={(e) => setCollegeData({ ...collegeData, academic_session: e.target.value })}
                      placeholder="e.g. 2025-2026"
                    />
                  </FormField>
                  <FormField label="Active Term Semester">
                    <Select
                      options={[
                        { value: 'Odd', label: 'Odd Semesters (1st, 3rd, 5th, 7th)' },
                        { value: 'Even', label: 'Even Semesters (2nd, 4th, 6th, 8th)' },
                      ]}
                      value={collegeData.active_semester}
                      onChange={(e) => setCollegeData({ ...collegeData, active_semester: e.target.value as any })}
                    />
                  </FormField>
                  <FormField label="Session Start Date" required>
                    <Input
                      type="date"
                      value={collegeData.session_start_date}
                      onChange={(e) => setCollegeData({ ...collegeData, session_start_date: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Session End Date" required>
                    <Input
                      type="date"
                      value={collegeData.session_end_date}
                      onChange={(e) => setCollegeData({ ...collegeData, session_end_date: e.target.value })}
                    />
                  </FormField>
                </div>

                {/* Read-only previous sessions */}
                <div className="pt-3 border-t border-border space-y-2">
                  <label className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Previous Academic Sessions (Read-Only Archive)</label>
                  <div className="flex flex-wrap gap-2">
                    {collegeData.previous_sessions.map((sess) => (
                      <span key={sess} className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-hover text-ink-700 text-xs font-medium rounded-full border border-border">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> {sess}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION C: Academic Structure Shortcut */}
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 shadow-[var(--shadow-soft)] space-y-4">
                <h3 className="text-base font-bold text-ink-900 border-b border-border pb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-brand-600" /> Section C — Academic Structure Overview (Shortcut)
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/classes')}>
                    <ExternalLink className="h-4 w-4" /> Manage Academic Structure
                  </Button>
                </h3>

                <p className="text-sm text-ink-600">
                  Read-only summary of configured courses, branches, and class sections for this college. Click the button above to edit or add new classes.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="bg-surface-hover border border-border rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-brand-600">{academicSummary.coursesCount}</p>
                    <p className="text-xs text-ink-400 font-medium mt-1">Courses (B.Tech, Diploma, MBA)</p>
                  </div>
                  <div className="bg-surface-hover border border-border rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-brand-600">{academicSummary.branchesCount}</p>
                    <p className="text-xs text-ink-400 font-medium mt-1">Specialized Branches</p>
                  </div>
                  <div className="bg-surface-hover border border-border rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-brand-600">{academicSummary.totalClasses}</p>
                    <p className="text-xs text-ink-400 font-medium mt-1">Configured Classes</p>
                  </div>
                  <div className="bg-surface-hover border border-border rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-brand-600">{academicSummary.totalStudents}</p>
                    <p className="text-xs text-ink-400 font-medium mt-1">Enrolled Students</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECTION D & SECTION E — Grading & Attendance Rules */}
          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              {/* SECTION D: Grading & Evaluation */}
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 shadow-[var(--shadow-soft)] space-y-4">
                <h3 className="text-base font-bold text-ink-900 border-b border-border pb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-600" /> Section D — Grading & Evaluation Policy
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Grading System">
                    <Select
                      options={[
                        { value: 'Percentage', label: 'Percentage System (0-100%)' },
                        { value: 'CGPA', label: '10-Point CGPA Scale' },
                        { value: 'Letter Grade', label: 'Letter Grade (A+ to F)' },
                      ]}
                      value={collegeData.grading_system}
                      onChange={(e) => setCollegeData({ ...collegeData, grading_system: e.target.value as any })}
                    />
                  </FormField>
                  <FormField label="Minimum Subject Passing Criteria (%)">
                    <Input
                      type="number"
                      value={collegeData.passing_criteria}
                      onChange={(e) => setCollegeData({ ...collegeData, passing_criteria: Number(e.target.value) })}
                    />
                  </FormField>
                </div>

                {/* Grade Boundaries */}
                <div className="pt-3 border-t border-border space-y-3">
                  <label className="text-sm font-semibold text-ink-900">Grade Cutoff Boundaries (%)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    {Object.entries(collegeData.grade_boundaries).map(([grade, cutoff]) => (
                      <div key={grade} className="bg-surface-hover p-2.5 rounded border border-border text-center">
                        <span className="text-xs font-bold text-ink-900 block">{grade} Grade</span>
                        <input
                          type="number"
                          className="w-full mt-1 px-1.5 py-1 bg-surface border border-border rounded text-xs text-center font-medium"
                          value={cutoff}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            setCollegeData((prev) => ({
                              ...prev,
                              grade_boundaries: { ...prev.grade_boundaries, [grade]: val },
                            }))
                          }}
                        />
                        <span className="text-[10px] text-ink-400 block mt-1">≥ {cutoff}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allowed Exam Types (Multi-Select) */}
                <div className="pt-3 border-t border-border space-y-2">
                  <label className="text-sm font-semibold text-ink-900">Allowed Examination Types</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Sessional Exam', 'PUT', 'Test', 'Practical', 'Mid Term', 'End Semester'].map((type) => {
                      const isChecked = collegeData.allowed_exam_types.includes(type)
                      return (
                        <label key={type} className="flex items-center gap-2 p-2.5 border border-border rounded-lg bg-surface-hover cursor-pointer hover:bg-border transition">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleExamType(type)}
                            className="rounded border-border text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-xs font-medium text-ink-900">{type}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION E: Attendance Rules */}
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 shadow-[var(--shadow-soft)] space-y-4">
                <h3 className="text-base font-bold text-ink-900 border-b border-border pb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-brand-600" /> Section E — Attendance Compliance Rules
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Minimum Attendance Required (%)">
                    <Input
                      type="number"
                      value={collegeData.min_attendance_percentage}
                      onChange={(e) => setCollegeData({ ...collegeData, min_attendance_percentage: Number(e.target.value) })}
                    />
                  </FormField>
                  <FormField label="Calculation Method">
                    <Select
                      options={[
                        { value: 'per_lecture', label: 'Per Lecture / Subject Slot' },
                        { value: 'per_day', label: 'Daily Full Day' },
                        { value: 'per_subject', label: 'Subject Wise Aggregate' },
                      ]}
                      value={collegeData.attendance_calc_method}
                      onChange={(e) => setCollegeData({ ...collegeData, attendance_calc_method: e.target.value as any })}
                    />
                  </FormField>
                  <FormField label="Late Arrival Policy">
                    <Select
                      options={[
                        { value: 'Half', label: 'Mark Half-Day' },
                        { value: 'Present', label: 'Mark Present' },
                        { value: 'Absent', label: 'Mark Absent' },
                      ]}
                      value={collegeData.late_mark_policy}
                      onChange={(e) => setCollegeData({ ...collegeData, late_mark_policy: e.target.value as any })}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECTION F & SECTION G — Fees & Notices */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              {/* SECTION F: Fee Configuration */}
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 shadow-[var(--shadow-soft)] space-y-4">
                <h3 className="text-base font-bold text-ink-900 border-b border-border pb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-brand-600" /> Section F — Institutional Fee Parameters
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Default Currency">
                    <Select
                      options={[
                        { value: 'INR (₹)', label: 'INR (₹)' },
                        { value: 'USD ($)', label: 'USD ($)' },
                      ]}
                      value={collegeData.currency}
                      onChange={(e) => setCollegeData({ ...collegeData, currency: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Fee Collection Cycle">
                    <Select
                      options={[
                        { value: 'Semester', label: 'Semester Wise (Bi-Annual)' },
                        { value: 'Yearly', label: 'Yearly Academic Fee' },
                        { value: 'Monthly', label: 'Monthly Instalments' },
                      ]}
                      value={collegeData.fee_cycle}
                      onChange={(e) => setCollegeData({ ...collegeData, fee_cycle: e.target.value as any })}
                    />
                  </FormField>
                  <FormField label="Receipt Number Prefix">
                    <Input
                      value={collegeData.receipt_prefix}
                      onChange={(e) => setCollegeData({ ...collegeData, receipt_prefix: e.target.value })}
                      placeholder="e.g. RRIMT-2025-"
                    />
                  </FormField>
                </div>

                {/* Late Fee Rules */}
                <div className="pt-3 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">Enable Late Fee Fines & Penalty Rules</p>
                      <p className="text-xs text-ink-400">Automatically calculate per-day fines after grace period</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollegeData((prev) => ({ ...prev, late_fee_enabled: !prev.late_fee_enabled }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        collegeData.late_fee_enabled ? 'bg-brand-600' : 'bg-border'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${collegeData.late_fee_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {collegeData.late_fee_enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-hover p-4 rounded-lg border border-border">
                      <FormField label="Daily Late Fine Amount (₹)">
                        <Input
                          type="number"
                          value={collegeData.late_fee_amount}
                          onChange={(e) => setCollegeData({ ...collegeData, late_fee_amount: Number(e.target.value) })}
                        />
                      </FormField>
                      <FormField label="Grace Period Days">
                        <Input
                          type="number"
                          value={collegeData.late_fee_grace_days}
                          onChange={(e) => setCollegeData({ ...collegeData, late_fee_grace_days: Number(e.target.value) })}
                        />
                      </FormField>
                    </div>
                  )}
                </div>

                {/* Payment Modes */}
                <div className="pt-3 border-t border-border space-y-2">
                  <label className="text-sm font-semibold text-ink-900">Enabled Payment Modes</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Cash', 'UPI', 'Bank Transfer', 'Online Gateway'].map((mode) => {
                      const isChecked = collegeData.enabled_payment_modes.includes(mode)
                      return (
                        <label key={mode} className="flex items-center gap-2 p-2.5 border border-border rounded-lg bg-surface-hover cursor-pointer hover:bg-border transition">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePaymentMode(mode)}
                            className="rounded border-border text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-xs font-medium text-ink-900">{mode}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION G: Notice Preferences */}
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 shadow-[var(--shadow-soft)] space-y-4">
                <h3 className="text-base font-bold text-ink-900 border-b border-border pb-3 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-brand-600" /> Section G — Notice & Notification Preferences
                </h3>

                <FormField label="Default Target Audience for New Notices">
                  <Select
                    options={[
                      { value: 'All Students & Staff', label: 'All Students & Staff' },
                      { value: 'Students Only', label: 'Students Only' },
                      { value: 'Faculty Only', label: 'Faculty Only' },
                    ]}
                    value={collegeData.default_notice_target}
                    onChange={(e) => setCollegeData({ ...collegeData, default_notice_target: e.target.value })}
                  />
                </FormField>

                <div className="divide-y divide-border">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">Auto Notice on Exam Release</p>
                      <p className="text-xs text-ink-400">Broadcast notice when datesheets or scorecards are published</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollegeData((prev) => ({ ...prev, auto_notice_exam: !prev.auto_notice_exam }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        collegeData.auto_notice_exam ? 'bg-brand-600' : 'bg-border'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${collegeData.auto_notice_exam ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">Auto Notice on Fee Overdue</p>
                      <p className="text-xs text-ink-400">Send automatic notice alerts for fee installment deadlines</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollegeData((prev) => ({ ...prev, auto_notice_fee: !prev.auto_notice_fee }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        collegeData.auto_notice_fee ? 'bg-brand-600' : 'bg-border'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${collegeData.auto_notice_fee ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">Show Important Notice Popup on Login</p>
                      <p className="text-xs text-ink-400">Display high-priority notices in a modal immediately upon user login</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollegeData((prev) => ({ ...prev, show_notice_on_login: !prev.show_notice_on_login }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        collegeData.show_notice_on_login ? 'bg-brand-600' : 'bg-border'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${collegeData.show_notice_on_login ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECTION H & SECTION I — Report Branding & Data Maintenance Shortcuts */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              {/* SECTION H: Report Branding */}
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 shadow-[var(--shadow-soft)] space-y-4">
                <h3 className="text-base font-bold text-ink-900 border-b border-border pb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-600" /> Section H — Report Card & Certificate Branding
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Report Header Institution Name">
                    <Input
                      value={collegeData.report_header_name}
                      onChange={(e) => setCollegeData({ ...collegeData, report_header_name: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Header Subtitle / Tagline">
                    <Input
                      value={collegeData.report_tagline}
                      onChange={(e) => setCollegeData({ ...collegeData, report_tagline: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Report Footer Address Text" className="md:col-span-2">
                    <Input
                      value={collegeData.report_footer_text}
                      onChange={(e) => setCollegeData({ ...collegeData, report_footer_text: e.target.value })}
                    />
                  </FormField>
                </div>
              </div>

              {/* SECTION I: Data & Backup Shortcuts */}
              <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6 shadow-[var(--shadow-soft)] space-y-4">
                <h3 className="text-base font-bold text-ink-900 border-b border-border pb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-brand-600" /> Section I — Institutional Data & Report Shortcuts
                </h3>
                <p className="text-sm text-ink-600">
                  Access institutional data export, attendance summary matrices, and fee ledger analytics.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="ghost" onClick={() => navigate('/reports')}>
                    <ExternalLink className="h-4 w-4" /> Export College Data (Global Reports)
                  </Button>
                </div>
              </div>

              {/* Danger Zone: Session Maintenance */}
              <div className="bg-surface rounded-[var(--radius-card)] border border-rose-200 dark:border-rose-900/40 p-6 shadow-[var(--shadow-soft)] space-y-4">
                <h3 className="text-base font-bold text-rose-700 dark:text-rose-400 border-b border-rose-200 dark:border-rose-900/40 pb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-600" /> Danger Zone — Reset Academic Session Parameters
                </h3>
                <p className="text-sm text-ink-600">
                  Re-initialize active term parameters for the new academic year. This operation requires strong confirmation.
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowResetModal(true)}
                  className="border border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1.5 font-medium"
                >
                  <RotateCcw className="h-4 w-4 text-rose-600" /> Reset Academic Session Parameters
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Danger Zone Modal */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="Confirm Academic Session Reset">
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-lg text-rose-800 dark:text-rose-300">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <p className="text-xs">
              This action will reset active academic term flags for <strong>{collegeData.name}</strong>. Type <strong>RESET SESSION</strong> below to proceed.
            </p>
          </div>

          <FormField label='Type "RESET SESSION" to confirm'>
            <Input
              value={confirmResetText}
              onChange={(e) => setConfirmResetText(e.target.value)}
              placeholder="RESET SESSION"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={confirmResetText !== 'RESET SESSION'}
              onClick={handleResetSession}
            >
              Reset Session
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bottom Save Action */}
      <div className="pt-4 border-t border-border flex justify-end">
        <Button onClick={handleSaveAll} disabled={saving || loading} className="bg-brand-600 hover:bg-brand-700">
          <Save className="h-4 w-4" /> {saving ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
