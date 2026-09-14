/* ===== EduFlow Domain Types ===== */

export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent'

export type AttendanceStatus = 'present' | 'absent' | 'late'
export type FeeStatus = 'paid' | 'pending' | 'overdue'
export type HomeworkStatus = 'active' | 'overdue' | 'submitted' | 'completed'
export type NoticePriority = 'high' | 'medium' | 'low'
export type ExamType = 'unit_test' | 'mid_term' | 'final' | 'custom'
export type PaymentMethod = 'cash' | 'online_transfer' | 'cheque'
export type FeeFrequency = 'monthly' | 'quarterly' | 'yearly' | 'one_time'
export type MaterialType = 'notes' | 'video' | 'pdf' | 'other'

// ===== Core entities =====

export interface College {
  id: string
  code: string
  name: string
  email: string
  phone: string
  address: string
  city?: string
  state?: string
  country?: string
  logo_url?: string
  status: 'active' | 'suspended' | 'inactive'
  created_at: string
}

export type School = College

export interface Profile {
  id: string
  college_id: string
  school_id: string // Backwards compatibility
  role: UserRole
  name: string
  email: string
  phone?: string
  avatar_url?: string
  student_id?: string
  teacher_id?: string
  parent_id?: string
  child_student_id?: string
  status?: 'active' | 'inactive' | 'suspended'
  permissions?: string[]
  created_at: string
}

export interface CollegeRegistrationPayload {
  college_name: string
  college_code: string
  official_email: string
  official_phone: string
  address: string
  city?: string
  state?: string
  country?: string
  admin_name: string
  admin_email: string
  admin_password?: string
  admin_phone?: string
}


export interface Student {
  id: string
  profile_id: string
  school_id: string
  class_id: string
  roll_no: string
  name: string
  email: string
  dob?: string
  gender?: string
  blood_group?: string
  address?: string
  parent_id?: string
  parent_name?: string
  parent_email?: string
  parent_phone?: string
  status: 'active' | 'inactive'
  attendance_percentage?: number
  fee_status?: FeeStatus
  class_name?: string
  created_at: string
}

export interface Teacher {
  id: string
  profile_id: string
  school_id: string
  name: string
  email: string
  phone?: string
  subject?: string
  qualification?: string
  classes_assigned?: string[]
  status: 'active' | 'inactive'
  avatar_url?: string
  created_at: string
}

export interface Class {
  id: string
  school_id: string
  name: string
  class_teacher_id?: string
  class_teacher_name?: string
  student_count?: number
  created_at: string
}

export interface Subject {
  id: string
  college_id?: string
  school_id?: string
  course?: string
  course_name?: string
  branch?: string
  branch_name?: string
  semester?: string
  semester_name?: string
  name: string
  code: string
  description?: string
  is_common?: boolean
  subject_type?: 'common' | 'branch_specific'
  applicable_branches?: string[]
  type?: 'Theory' | 'Practical' | 'Elective'
  credits?: number
  status?: 'active' | 'inactive'
  created_at?: string
}

export interface SemesterItem {
  id: string
  college_id?: string
  course: string
  name: string
  term: 'Odd' | 'Even'
  status: 'active' | 'inactive'
  created_at?: string
}

export interface ClassSubject {
  id: string
  class_id: string
  subject_id: string
  teacher_id?: string
  subject_name?: string
  subject_code?: string
  teacher_name?: string
}

// ===== Attendance =====

export interface AttendanceRecord {
  id: string
  student_id: string
  class_id: string
  date: string
  status: AttendanceStatus
  marked_by: string
  student_name?: string
  roll_no?: string
  created_at: string
}

// ===== Fees =====

export interface FeeHead {
  id: string
  school_id: string
  class_id: string
  title: string
  amount: number
  frequency: FeeFrequency
  academic_year: string
  due_date?: string
  description?: string
  created_at: string
}

export interface FeePayment {
  id: string
  student_id: string
  fee_head_id: string
  amount: number
  method: PaymentMethod
  transaction_id?: string
  paid_at: string
  recorded_by: string
  student_name?: string
  class_name?: string
  fee_title?: string
  created_at: string
}

export interface FeeComponent {
  name: string
  amount: number
}

export interface FeeInstallment {
  id: string
  name: string
  type: 'percentage' | 'fixed'
  value: number
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
}

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
  installment_id?: string
  installment_name?: string
  amount: number
  payment_method: PaymentMethod
  transaction_id: string
  payment_date: string
  remarks?: string
  status: 'Completed' | 'Pending' | 'Failed'
  created_at: string
}

// ===== Assignments / Homework =====

export type AssignmentStatus = 'active' | 'overdue' | 'submitted' | 'completed'

export interface Assignment {
  id: string
  title: string
  course: string
  branch: string
  is_common_subject: boolean
  semester: string
  section: string
  subject: string
  assignment_date: string
  due_date: string
  description: string
  attachment_url?: string
  attachment_type?: 'PDF' | 'Link' | 'File'
  attachment_name?: string
  created_by: string
  teacher_name: string
  submitted_count: number
  total_students: number
  status: 'active' | 'overdue' | 'completed'
  created_at: string
}

export interface Homework {
  id: string
  class_id: string
  subject_id: string
  teacher_id: string
  title: string
  description?: string
  due_date: string
  attachment_url?: string
  class_name?: string
  subject_name?: string
  teacher_name?: string
  submissions_count?: number
  total_students?: number
  status?: HomeworkStatus
  created_at: string
}

export interface HomeworkSubmission {
  id: string
  homework_id: string
  student_id: string
  submitted_at: string
  file_url?: string
  text?: string
  student_name?: string
}

// ===== Timetable =====

export interface Period {
  id: string
  school_id: string
  label: string
  start_time: string
  end_time: string
  is_break: boolean
  break_type?: 'short' | 'lunch'
  order: number
}

export interface TimetableEntry {
  id: string
  class_id: string
  day: string
  period_id: string
  subject_id?: string
  teacher_id?: string
  subject_name?: string
  teacher_name?: string
  subject_code?: string
}

// ===== Notices =====

export interface Notice {
  id: string
  school_id: string
  author_id: string
  title: string
  description: string
  priority: NoticePriority
  audience_scope: 'school' | 'class'
  class_id?: string
  author_name?: string
  created_at: string
}

// ===== Communication =====

export interface Conversation {
  id: string
  school_id: string
  participant_ids: string[]
  last_message?: string
  last_message_at?: string
  unread_count?: number
  participant_names?: string[]
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  sender_name?: string
  sender_role?: UserRole
  created_at: string
}

// ===== Exams & Results (7-Section Module) =====

export type ExamStatus = 'Draft' | 'Scheduled' | 'Ongoing' | 'Completed' | 'Results Pending' | 'Published' | 'upcoming' | 'completed'

export interface Exam {
  id: string
  college_id?: string
  school_id?: string
  class_id?: string
  title: string
  type: string
  course: string
  branch: string
  year: string
  semester: string
  section: string
  subject: string
  academic_session?: string
  date: string
  start_date?: string
  end_date?: string
  start_time: string
  end_time: string
  max_marks: number
  passing_marks: number
  description?: string
  status: ExamStatus
  created_by?: string
  created_at: string
  updated_at?: string
}

export interface ExamSubject {
  id: string
  college_id?: string
  exam_id: string
  subject_id?: string
  subject_name: string
  subject_code: string
  course?: string
  branch?: string
  year?: string
  semester?: string
  date: string
  start_time?: string
  end_time?: string
  room_number?: string
  max_marks: number
  passing_marks: number
  created_at?: string
  updated_at?: string
}

export interface Result {
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
  marks?: number // legacy fallback
  passing_marks: number
  percentage?: number
  grade?: string
  grade_point?: number
  remarks?: string
  status: 'Pass' | 'Fail' | 'Absent' | 'Pending'
  published?: boolean
  is_published: boolean
  published_date?: string
  published_by?: string
  entered_by?: string
  created_at?: string
  updated_at?: string
}

export interface ClassResultSummary {
  student_id: string
  student_name: string
  roll_no: string
  course: string
  branch: string
  year: string
  semester: string
  total_max_marks: number
  total_obtained_marks: number
  overall_percentage: number
  overall_grade: string
  overall_status: 'Pass' | 'Fail' | 'Pending'
  is_published: boolean
  subject_marks: Record<string, { obtained: number; max: number; status: string; grade: string }>
}

// ===== Study Materials =====

export interface StudyMaterial {
  id: string
  college_id?: string
  school_id?: string
  class_id?: string
  subject_id?: string
  title: string
  description?: string
  course?: string
  branch?: string
  year?: string
  semester?: string
  section?: string
  subject_name?: string
  subject_code?: string
  is_common_subject?: boolean
  category?: string
  content_type?: string
  url?: string
  file_url?: string
  size?: string
  file_size?: number
  access_type?: 'Free' | 'Premium'
  uploaded_by?: string
  uploaded_by_role?: string
  uploader?: string
  uploader_name?: string
  type?: MaterialType
  date?: string
  created_at?: string
}

// ===== Permissions =====

export interface PermissionOverride {
  id: string
  teacher_id: string
  module: string
  action: string
  allowed: boolean
}

// ===== Dashboard =====

export interface AdminDashboardData {
  total_students: number
  total_teachers: number
  total_classes: number
  fee_collected: number
  fee_pending: number
  attendance_trend: { date: string; percentage: number }[]
  fee_chart: { month: string; collected: number; pending: number }[]
}

export interface TeacherDashboardData {
  my_classes: number
  my_students: number
  pending_to_grade: number
  todays_periods: {
    time: string
    class_name: string
    subject: string
  }[]
}

export interface StudentDashboardData {
  attendance_percentage: number
  points: number
  streak_days: number
  rank: number
  recent_activity: {
    id: string
    type: string
    title: string
    date: string
  }[]
  todays_timetable: TimetableEntry[]
  upcoming_exams: Exam[]
  recent_notices: Notice[]
  fees_total: number
  fees_pending: number
}

export interface ParentDashboardData extends StudentDashboardData {
  children: { id: string; name: string; class_name: string }[]
  selected_child_id: string
}

// ===== Pagination =====

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}
