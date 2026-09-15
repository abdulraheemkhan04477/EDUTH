import { useState, useEffect } from 'react'
import { useAuth } from '../app/providers/AuthProvider'
import { supabase, isSupabaseConfigured } from './supabase'

export interface AcademicCourse {
  name: string
  branches: string[]
}

export interface BranchItem {
  id: string
  course_name: string
  name: string
  code: string
  status: 'active' | 'inactive'
  college_id?: string
}

export const COURSES: string[] = ['B.Tech', 'Diploma', 'MBA']

export const initialBranches: BranchItem[] = [
  // B.Tech
  { id: 'b1', course_name: 'B.Tech', name: 'Electronics & Communication Engineering', code: 'ECE', status: 'active' },
  { id: 'b2', course_name: 'B.Tech', name: 'Computer Science & Engineering', code: 'CSE', status: 'active' },
  { id: 'b3', course_name: 'B.Tech', name: 'Information Technology', code: 'IT', status: 'active' },
  { id: 'b4', course_name: 'B.Tech', name: 'Computer Science & Design', code: 'CSD', status: 'active' },
  { id: 'b5', course_name: 'B.Tech', name: 'Artificial Intelligence & Machine Learning', code: 'AI/ML', status: 'active' },
  { id: 'b6', course_name: 'B.Tech', name: 'Mechanical Engineering', code: 'ME', status: 'active' },
  { id: 'b7', course_name: 'B.Tech', name: 'Civil Engineering', code: 'Civil', status: 'active' },
  { id: 'b8', course_name: 'B.Tech', name: 'Biotechnology', code: 'Biotech', status: 'active' },
  { id: 'b9', course_name: 'B.Tech', name: 'Electrical Engineering', code: 'EE', status: 'active' },

  // Diploma
  { id: 'b10', course_name: 'Diploma', name: 'Civil Engineering', code: 'Civil', status: 'active' },
  { id: 'b11', course_name: 'Diploma', name: 'Mechanical Engineering', code: 'ME', status: 'active' },
  { id: 'b12', course_name: 'Diploma', name: 'Electrical Engineering', code: 'EE', status: 'active' },
  { id: 'b13', course_name: 'Diploma', name: 'Electronics Engineering', code: 'ECE', status: 'active' },
  { id: 'b14', course_name: 'Diploma', name: 'Computer Science', code: 'CSE', status: 'active' },
  { id: 'b15', course_name: 'Diploma', name: 'Information Technology', code: 'IT', status: 'active' },

  // MBA
  { id: 'b16', course_name: 'MBA', name: 'Finance', code: 'Finance', status: 'active' },
  { id: 'b17', course_name: 'MBA', name: 'Marketing', code: 'Marketing', status: 'active' },
  { id: 'b18', course_name: 'MBA', name: 'Human Resource Management', code: 'HR', status: 'active' },
  { id: 'b19', course_name: 'MBA', name: 'International Business', code: 'International Business', status: 'active' },
  { id: 'b20', course_name: 'MBA', name: 'Business Analytics', code: 'Business Analytics', status: 'active' },
]

export const BRANCH_MAP: Record<string, string> = {
  Biotech: 'Biotechnology',
  Civil: 'Civil Engineering',
  CSE: 'Computer Science & Engineering',
  CSD: 'Computer Science & Design',
  'AI/ML': 'Artificial Intelligence & Machine Learning',
  AIML: 'Artificial Intelligence & Machine Learning',
  IT: 'Information Technology',
  ECE: 'Electronics & Communication Engineering',
  EC: 'Electronics & Communication Engineering',
  EE: 'Electrical Engineering',
  ME: 'Mechanical Engineering',
  Finance: 'Finance',
  Marketing: 'Marketing',
  HR: 'Human Resource Management',
  'Human Resource Management': 'Human Resource Management',
  IB: 'International Business',
  'International Business': 'International Business',
  BA: 'Business Analytics',
  'Business Analytics': 'Business Analytics',
  TNP: 'Training and Placement Department',
  'Training and Placement Department': 'Training and Placement Department',
}

export const BRANCH_CODE_MAP: Record<string, string> = {
  'Biotechnology': 'Biotech',
  'Civil Engineering': 'Civil',
  'Computer Science & Engineering': 'CSE',
  'Computer Science': 'CSE',
  'Computer Science & Design': 'CSD',
  'Artificial Intelligence & Machine Learning': 'AI/ML',
  'CSE (AI/ML)': 'AI/ML',
  'Information Technology': 'IT',
  'Electronics & Communication Engineering': 'ECE',
  'Electronics Engineering': 'ECE',
  'Electrical Engineering': 'EE',
  'Mechanical Engineering': 'ME',
  'Finance': 'Finance',
  'Marketing': 'Marketing',
  'Human Resource Management': 'HR',
  'International Business': 'IB',
  'Business Analytics': 'BA',
  'Biotech': 'Biotech',
  'Civil': 'Civil',
  'CSE': 'CSE',
  'CSD': 'CSD',
  'AI/ML': 'AI/ML',
  'IT': 'IT',
  'ECE': 'ECE',
  'EE': 'EE',
  'ME': 'ME',
  'HR': 'HR',
  'IB': 'IB',
  'BA': 'BA',
  'TNP': 'TNP',
  'Training and Placement Department': 'TNP',
}

export function isBranchMatch(b1?: string | null, b2?: string | null): boolean {
  if (!b1 || !b2) return false
  if (b1 === 'All' || b2 === 'All' || b1 === '' || b2 === '') return true
  const trim1 = b1.trim()
  const trim2 = b2.trim()
  if (trim1 === trim2) return true
  const c1 = (BRANCH_CODE_MAP[trim1] || trim1).toLowerCase().trim()
  const c2 = (BRANCH_CODE_MAP[trim2] || trim2).toLowerCase().trim()
  if (c1 === c2) return true
  const m1 = (BRANCH_MAP[trim1] || trim1).toLowerCase().trim()
  const m2 = (BRANCH_MAP[trim2] || trim2).toLowerCase().trim()
  if (m1 === m2) return true
  const s1 = trim1.toLowerCase()
  const s2 = trim2.toLowerCase()
  return s1.includes(s2) || s2.includes(s1)
}

export function isSemesterMatch(s1?: string | null, s2?: string | null): boolean {
  if (!s1 || !s2) return true
  if (s1 === 'All Semesters' || s2 === 'All Semesters' || s1 === 'All' || s2 === 'All' || s1 === '' || s2 === '') return true
  if (s1 === s2) return true
  const n1 = s1.replace(/[^0-9]/g, '')
  const n2 = s2.replace(/[^0-9]/g, '')
  if (n1 && n2 && n1 === n2) return true
  return s1.toLowerCase().trim() === s2.toLowerCase().trim()
}

export const BRANCHES_BY_COURSE: Record<string, string[]> = {
  'B.Tech': [
    'ECE',
    'EE',
    'ME',
    'Civil',
    'CSE',
    'CSD',
    'IT',
    'AI/ML',
    'Biotech',
    'TNP',
  ],
  Diploma: [
    'Civil',
    'ME',
    'EE',
    'ECE',
    'CSE',
    'IT',
    'TNP',
  ],
  MBA: [
    'Finance',
    'Marketing',
    'Human Resource Management',
    'International Business',
    'Business Analytics',
    'TNP',
  ],
}

export const YEARS: string[] = ['1st Year', '2nd Year', '3rd Year', '4th Year']

export const YEARS_BY_COURSE = (course: string): string[] => {
  if (course === 'MBA') return ['1st Year', '2nd Year']
  if (course === 'Diploma') return ['1st Year', '2nd Year', '3rd Year']
  return ['1st Year', '2nd Year', '3rd Year', '4th Year']
}

export const SEMESTERS_BY_COURSE = (course: string): string[] => {
  if (course === 'MBA') {
    return ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester']
  }
  if (course === 'Diploma') {
    return ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester']
  }
  return [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester',
  ]
}

export const SEMESTERS_BY_YEAR_COURSE = (year: string, course: string): string[] => {
  if (course === 'MBA') {
    if (year === '1st Year') return ['1st Semester', '2nd Semester']
    if (year === '2nd Year') return ['3rd Semester', '4th Semester']
    return ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester']
  }
  if (course === 'Diploma') {
    if (year === '1st Year') return ['1st Semester', '2nd Semester']
    if (year === '2nd Year') return ['3rd Semester', '4th Semester']
    if (year === '3rd Year') return ['5th Semester', '6th Semester']
    return ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester']
  }
  if (year === '1st Year') return ['1st Semester', '2nd Semester']
  if (year === '2nd Year') return ['3rd Semester', '4th Semester']
  if (year === '3rd Year') return ['5th Semester', '6th Semester']
  if (year === '4th Year') return ['7th Semester', '8th Semester']
  return ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester']
}

export const TEACHER_POSITIONS = [
  'Assistant Professor',
  'Assistant Head of Department',
  'Head of Department',
  'Dean',
  'Senior Educator',
]

export interface StudentRecord {
  id: string
  student_id: string
  roll_no: string
  name: string
  course: string
  branch: string
  year: string
  semester: string
  section: string
  class_name: string
  dob: string
  gender: string
  blood_group: string
  email: string
  phone: string
  address: string
  parent_name: string
  parent_phone: string
  parent_email: string
  college_id?: string
  profile_id?: string
}

export interface SemesterItem {
  id: string
  course_name: string
  name: string
  term: 'Odd' | 'Even'
  status: 'active' | 'inactive'
  college_id?: string
}

export interface SectionItem {
  id: string
  course_name: string
  branch_name: string
  semester_name: string
  name: string
  capacity: number
  status: 'active' | 'inactive'
  college_id?: string
}

export interface SubjectItem {
  id: string
  course_name: string
  branch_name: string
  semester_name: string
  name: string
  code: string
  description?: string
  is_common?: boolean
  subject_type?: string
  applicable_branches?: string[]
  type?: 'Theory' | 'Practical' | 'Elective'
  credits?: number
  status: 'active' | 'inactive'
  college_id?: string
}

export interface TeacherRecord {
  id: string
  teacher_id: string
  name: string
  position: string
  course: string
  department: string // actual Branch
  assigned_classes: string[]
  assigned_subjects?: string[]
  email: string
  phone: string
  qualification: string
  college_id?: string
}

export interface ClassRecord {
  id: string
  course: string
  branch: string
  year: string
  semester: string
  section: string
  name: string
  teacher_name: string
  teacher_id: string
  room_no: string
  capacity: number
  college_id?: string
}

export interface AttendanceEntry {
  id?: string
  college_id?: string
  student_id: string
  student_name?: string
  roll_no?: string
  course?: string
  branch?: string
  year?: string
  semester?: string
  section?: string
  lecture?: string
  class_id?: string
  class_name?: string
  date: string
  status: 'present' | 'absent' | 'late' | 'leave'
  remarks?: string
  marked_by?: string
  created_at?: string
}

export const initialSubjects: SubjectItem[] = [
  // B.Tech - ECE
  { id: 'sub_btech_ece_1', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 1', name: 'Engineering Mathematics-I', code: 'BAS-101', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_2', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 1', name: 'Basic Electrical Engineering', code: 'BEE-101', type: 'Theory', credits: 3, status: 'active' },
  { id: 'sub_btech_ece_3', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 1', name: 'Engineering Physics', code: 'BAS-102', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_4', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 2', name: 'Engineering Mathematics-II', code: 'BAS-201', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_5', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 2', name: 'Electronic Devices & Circuits', code: 'ECE-201', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_6', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 3', name: 'Digital Electronics', code: 'ECE-301', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_7', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 3', name: 'Network Analysis & Synthesis', code: 'ECE-302', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_8', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 4', name: 'Analog Communication', code: 'ECE-401', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_9', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 4', name: 'Signals & Systems', code: 'ECE-402', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_10', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 5', name: 'Digital Signal Processing', code: 'ECE-501', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_11', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 5', name: 'Microprocessors & Microcontrollers', code: 'ECE-502', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_12', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 6', name: 'VLSI Design', code: 'ECE-601', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_13', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 6', name: 'Digital Communication', code: 'ECE-602', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_ece_14', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 7', name: 'Wireless & Mobile Communication', code: 'ECE-701', type: 'Theory', credits: 3, status: 'active' },
  { id: 'sub_btech_ece_15', course_name: 'B.Tech', branch_name: 'ECE', semester_name: 'Semester 8', name: 'Satellite & Optical Communication', code: 'ECE-801', type: 'Theory', credits: 3, status: 'active' },

  // B.Tech - CSE
  { id: 'sub_btech_cse_1', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 1', name: 'Programming for Problem Solving (C)', code: 'CSE-101', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_2', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 1', name: 'Engineering Mathematics-I', code: 'BAS-101', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_3', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 2', name: 'Data Structures & Algorithms', code: 'CSE-201', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_4', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 3', name: 'Object Oriented Programming with Java', code: 'CSE-301', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_5', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 3', name: 'Discrete Mathematics', code: 'CSE-302', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_6', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 4', name: 'Operating Systems', code: 'CSE-401', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_7', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 4', name: 'Database Management Systems', code: 'CSE-402', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_8', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 5', name: 'Computer Networks', code: 'CSE-501', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_9', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 5', name: 'Theory of Computation', code: 'CSE-502', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_10', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 6', name: 'Compiler Design', code: 'CSE-601', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_11', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 6', name: 'Web Technologies & Cloud Computing', code: 'CSE-602', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_cse_12', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 7', name: 'Artificial Intelligence & ML', code: 'CSE-701', type: 'Theory', credits: 3, status: 'active' },
  { id: 'sub_btech_cse_13', course_name: 'B.Tech', branch_name: 'CSE', semester_name: 'Semester 8', name: 'Cyber Security & Cryptography', code: 'CSE-801', type: 'Theory', credits: 3, status: 'active' },

  // B.Tech - IT
  { id: 'sub_btech_it_1', course_name: 'B.Tech', branch_name: 'IT', semester_name: 'Semester 3', name: 'Data Structures using C++', code: 'IT-301', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_it_2', course_name: 'B.Tech', branch_name: 'IT', semester_name: 'Semester 4', name: 'Software Engineering', code: 'IT-401', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_it_3', course_name: 'B.Tech', branch_name: 'IT', semester_name: 'Semester 5', name: 'Information Security', code: 'IT-501', type: 'Theory', credits: 4, status: 'active' },

  // B.Tech - ME
  { id: 'sub_btech_me_1', course_name: 'B.Tech', branch_name: 'ME', semester_name: 'Semester 3', name: 'Thermodynamics', code: 'ME-301', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_me_2', course_name: 'B.Tech', branch_name: 'ME', semester_name: 'Semester 4', name: 'Fluid Mechanics', code: 'ME-401', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_me_3', course_name: 'B.Tech', branch_name: 'ME', semester_name: 'Semester 5', name: 'Heat & Mass Transfer', code: 'ME-501', type: 'Theory', credits: 4, status: 'active' },

  // B.Tech - Civil
  { id: 'sub_btech_civ_1', course_name: 'B.Tech', branch_name: 'Civil', semester_name: 'Semester 3', name: 'Building Materials & Construction', code: 'CE-301', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_btech_civ_2', course_name: 'B.Tech', branch_name: 'Civil', semester_name: 'Semester 4', name: 'Structural Analysis', code: 'CE-401', type: 'Theory', credits: 4, status: 'active' },

  // Diploma - Civil, ME, CS, EC, EE, IT
  { id: 'sub_dip_cs_1', course_name: 'Diploma', branch_name: 'CS', semester_name: 'Semester 1', name: 'Applied Mathematics-I', code: 'DIP-M101', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_dip_cs_2', course_name: 'Diploma', branch_name: 'CS', semester_name: 'Semester 2', name: 'Fundamentals of Computer Programming', code: 'DIP-CS201', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_dip_cs_3', course_name: 'Diploma', branch_name: 'CS', semester_name: 'Semester 3', name: 'Data Structures with C', code: 'DIP-CS301', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_dip_ec_1', course_name: 'Diploma', branch_name: 'EC', semester_name: 'Semester 1', name: 'Basic Electronics', code: 'DIP-EC101', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_dip_me_1', course_name: 'Diploma', branch_name: 'ME', semester_name: 'Semester 1', name: 'Engineering Drawing', code: 'DIP-ME101', type: 'Practical', credits: 3, status: 'active' },
  { id: 'sub_dip_civ_1', course_name: 'Diploma', branch_name: 'Civil', semester_name: 'Semester 1', name: 'Surveying-I', code: 'DIP-CE101', type: 'Theory', credits: 4, status: 'active' },

  // MBA - Finance, Marketing, HR, International Business, Business Analytics
  { id: 'sub_mba_fin_1', course_name: 'MBA', branch_name: 'Finance', semester_name: 'Semester 1', name: 'Management Principles & Organizational Behavior', code: 'MBA-101', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_mba_fin_2', course_name: 'MBA', branch_name: 'Finance', semester_name: 'Semester 1', name: 'Financial Accounting & Reporting', code: 'MBA-102', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_mba_fin_3', course_name: 'MBA', branch_name: 'Finance', semester_name: 'Semester 2', name: 'Corporate Finance & Valuation', code: 'MBA-FIN201', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_mba_fin_4', course_name: 'MBA', branch_name: 'Finance', semester_name: 'Semester 3', name: 'Investment Analysis & Portfolio Management', code: 'MBA-FIN301', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_mba_fin_5', course_name: 'MBA', branch_name: 'Finance', semester_name: 'Semester 4', name: 'Financial Derivatives & Risk Management', code: 'MBA-FIN401', type: 'Theory', credits: 4, status: 'active' },

  { id: 'sub_mba_mkt_1', course_name: 'MBA', branch_name: 'Marketing', semester_name: 'Semester 1', name: 'Marketing Management Essentials', code: 'MBA-MKT101', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_mba_mkt_2', course_name: 'MBA', branch_name: 'Marketing', semester_name: 'Semester 2', name: 'Consumer Behavior & Market Research', code: 'MBA-MKT201', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_mba_mkt_3', course_name: 'MBA', branch_name: 'Marketing', semester_name: 'Semester 3', name: 'Digital & Social Media Marketing', code: 'MBA-MKT301', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_mba_mkt_4', course_name: 'MBA', branch_name: 'Marketing', semester_name: 'Semester 4', name: 'Brand Management & Strategic Marketing', code: 'MBA-MKT401', type: 'Theory', credits: 4, status: 'active' },

  { id: 'sub_mba_hr_1', course_name: 'MBA', branch_name: 'HR', semester_name: 'Semester 1', name: 'Human Resource Management Fundamentals', code: 'MBA-HR101', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_mba_hr_2', course_name: 'MBA', branch_name: 'HR', semester_name: 'Semester 2', name: 'Talent Acquisition & Development', code: 'MBA-HR201', type: 'Theory', credits: 4, status: 'active' },
  { id: 'sub_mba_hr_3', course_name: 'MBA', branch_name: 'HR', semester_name: 'Semester 3', name: 'Performance Management & Reward Systems', code: 'MBA-HR301', type: 'Theory', credits: 4, status: 'active' },

  // TNP Subjects
  { id: 'sub_tnp_pdp_btech', course_name: 'B.Tech', branch_name: 'TNP', semester_name: 'All Semesters', name: 'PDP', code: 'PDP', type: 'Theory', credits: 4, status: 'active', applicable_branches: ['TNP'] },
  { id: 'sub_tnp_apt_btech', course_name: 'B.Tech', branch_name: 'TNP', semester_name: 'All Semesters', name: 'Aptitude', code: 'APT', type: 'Theory', credits: 4, status: 'active', applicable_branches: ['TNP'] },
  { id: 'sub_tnp_tt_btech', course_name: 'B.Tech', branch_name: 'TNP', semester_name: 'All Semesters', name: 'Technical Training', code: 'TECH_TRG', type: 'Theory', credits: 4, status: 'active', applicable_branches: ['TNP'] },

  { id: 'sub_tnp_pdp_dip', course_name: 'Diploma', branch_name: 'TNP', semester_name: 'All Semesters', name: 'PDP', code: 'PDP', type: 'Theory', credits: 4, status: 'active', applicable_branches: ['TNP'] },
  { id: 'sub_tnp_apt_dip', course_name: 'Diploma', branch_name: 'TNP', semester_name: 'All Semesters', name: 'Aptitude', code: 'APT', type: 'Theory', credits: 4, status: 'active', applicable_branches: ['TNP'] },
  { id: 'sub_tnp_tt_dip', course_name: 'Diploma', branch_name: 'TNP', semester_name: 'All Semesters', name: 'Technical Training', code: 'TECH_TRG', type: 'Theory', credits: 4, status: 'active', applicable_branches: ['TNP'] },

  { id: 'sub_tnp_pdp_mba', course_name: 'MBA', branch_name: 'TNP', semester_name: 'All Semesters', name: 'PDP', code: 'PDP', type: 'Theory', credits: 4, status: 'active', applicable_branches: ['TNP'] },
  { id: 'sub_tnp_apt_mba', course_name: 'MBA', branch_name: 'TNP', semester_name: 'All Semesters', name: 'Aptitude', code: 'APT', type: 'Theory', credits: 4, status: 'active', applicable_branches: ['TNP'] },
  { id: 'sub_tnp_tt_mba', course_name: 'MBA', branch_name: 'TNP', semester_name: 'All Semesters', name: 'Technical Training', code: 'TECH_TRG', type: 'Theory', credits: 4, status: 'active', applicable_branches: ['TNP'] },
]

// Empty initial state when Supabase is configured
const initialClasses: ClassRecord[] = []
const initialTeachers: TeacherRecord[] = []
const initialStudents: StudentRecord[] = []
const initialAttendance: AttendanceEntry[] = []

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

let classesState = loadLocalStorage<ClassRecord[]>('eduth_classes_v3', initialClasses)
let teachersState = loadLocalStorage<TeacherRecord[]>('eduth_teachers_v3', initialTeachers)
let studentsState = loadLocalStorage<StudentRecord[]>('eduth_students_v3', initialStudents)
let attendanceState = loadLocalStorage<AttendanceEntry[]>('eduth_attendance_v3', initialAttendance)
let subjectsState = loadLocalStorage<SubjectItem[]>('eduth_subjects_v3', initialSubjects)
let semestersState = loadLocalStorage<SemesterItem[]>('eduth_semesters_v3', [])
let branchesState = loadLocalStorage<BranchItem[]>('eduth_branches_v3', initialBranches)
let sectionsState = loadLocalStorage<SectionItem[]>('eduth_sections_v3', [])

export function normalizeCollegeId(input?: string | null): string {
  if (!input) return '13695a78-0105-4bde-bc85-d664bb66637e'
  const trimmed = input.trim()
  if (trimmed === '151' || trimmed === 'COL-151') return 'ea318ebf-893e-410c-a925-ac1d4dc986eb'
  if (trimmed === '0361' || trimmed === 'COL001' || trimmed === 'COL-0361' || trimmed === 'PLATFORM_ALL') return '13695a78-0105-4bde-bc85-d664bb66637e'
  return trimmed
}

export const isValidUUID = (str?: string) => Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str))

let _lastAcademicSyncTime = 0
let _loadedForCollege: string | null = null
let _inFlightAcademicSync: Promise<void> | null = null
const CACHE_TTL_MS = 30000

export function invalidateAcademicCache() {
  _lastAcademicSyncTime = 0
  _loadedForCollege = null
}

// Fetch & sync with Supabase when configured
export async function syncWithSupabase(userCollegeId?: string, isSuperAdmin?: boolean) {
  if (!isSupabaseConfigured) return

  const normCollegeId = normalizeCollegeId(userCollegeId)
  const targetCollege = isSuperAdmin ? 'SUPER_ADMIN' : normCollegeId

  if (_loadedForCollege === targetCollege && Date.now() - _lastAcademicSyncTime < CACHE_TTL_MS) {
    return
  }

  if (_inFlightAcademicSync) {
    return _inFlightAcademicSync
  }

  _inFlightAcademicSync = (async () => {
    try {
      let classesQuery = supabase.from('classes').select('*')
      let teachersQuery = supabase.from('teachers').select('*')
      let studentsQuery = supabase.from('students').select('*')
      let attendanceQuery = supabase.from('attendance').select('*')
      let subjectsQuery = supabase.from('subjects').select('*')
      let semestersQuery = supabase.from('semesters').select('*')
      let branchesQuery = supabase.from('branches').select('*')
      let subjectBranchesQuery = supabase.from('subject_branches').select('*')
      let sectionsQuery = supabase.from('sections').select('*')

      if (!isSuperAdmin && normCollegeId && normCollegeId !== 'PLATFORM_ALL') {
        classesQuery = classesQuery.eq('college_id', normCollegeId)
        teachersQuery = teachersQuery.eq('college_id', normCollegeId)
        studentsQuery = studentsQuery.eq('college_id', normCollegeId)
        attendanceQuery = attendanceQuery.eq('college_id', normCollegeId)
        subjectsQuery = subjectsQuery.eq('college_id', normCollegeId)
        semestersQuery = semestersQuery.eq('college_id', normCollegeId)
        branchesQuery = branchesQuery.eq('college_id', normCollegeId)
        subjectBranchesQuery = subjectBranchesQuery.eq('college_id', normCollegeId)
        sectionsQuery = sectionsQuery.eq('college_id', normCollegeId)
      }

      const [
        { data: dbClasses, error: classErr },
        { data: dbTeachers, error: teachErr },
        { data: dbStudents, error: studErr },
        { data: dbAttendance, error: attErr },
        { data: dbSubjects, error: subErr },
        { data: dbSemesters, error: semErr },
        { data: dbBranches, error: branchErr },
        { data: dbSubjectBranches, error: sbErr },
        { data: dbSections, error: secErr },
      ] = await Promise.all([
        classesQuery,
        teachersQuery,
        studentsQuery,
        attendanceQuery,
        subjectsQuery,
        semestersQuery,
        branchesQuery,
        subjectBranchesQuery,
        sectionsQuery,
      ])

      if (classErr) console.error('Supabase classes sync notice:', classErr.message)
      if (teachErr) console.error('Supabase teachers sync notice:', teachErr.message)
      if (studErr) console.error('Supabase students sync notice:', studErr.message)
      if (attErr) console.error('Supabase attendance sync notice:', attErr.message)
      if (subErr) console.log('Supabase subjects sync notice:', subErr.message)
      if (semErr) console.log('Supabase semesters sync notice:', semErr.message)
      if (branchErr) console.log('Supabase branches sync notice:', branchErr.message)
      if (sbErr) console.log('Supabase subject_branches sync notice:', sbErr.message)
      if (secErr) console.log('Supabase sections sync notice:', secErr.message)

      if (dbBranches && Array.isArray(dbBranches)) {
        branchesState = (dbBranches as any[]).map((b) => ({
          id: b.id,
          course_name: b.course_name || b.course || 'B.Tech',
          name: b.name || b.code || '',
          code: b.code || b.name || '',
          status: (b.status || 'active') as 'active' | 'inactive',
          college_id: b.college_id,
        }))
        saveLocalStorage('eduth_branches_v3', branchesState)
      }

      if (dbSemesters && Array.isArray(dbSemesters)) {
        semestersState = (dbSemesters as any[]).map((s) => ({
          id: s.id,
          course_name: s.course_name || s.course || 'B.Tech',
          name: s.name || s.semester_name || '1st Semester',
          term: s.term || (s.name?.includes('1') || s.name?.includes('3') || s.name?.includes('5') || s.name?.includes('7') ? 'Odd' : 'Even'),
          status: s.status || 'active',
          college_id: s.college_id,
        }))
        saveLocalStorage('eduth_semesters_v3', semestersState)
      }

      if (dbSections && Array.isArray(dbSections)) {
        sectionsState = (dbSections as any[]).map((sec) => ({
          id: sec.id,
          course_name: sec.course_name || sec.course || 'B.Tech',
          branch_name: sec.branch_name || sec.branch || 'ECE',
          semester_name: sec.semester_name || sec.semester || '1st Semester',
          name: sec.name || 'A',
          capacity: Number(sec.capacity || 60),
          status: (sec.status || 'active') as 'active' | 'inactive',
          college_id: sec.college_id,
        }))
        saveLocalStorage('eduth_sections_v3', sectionsState)
      }

      if (dbSubjects && Array.isArray(dbSubjects) && dbSubjects.length > 0) {
        const branchMapBySubId: Record<string, string[]> = {}
        if (dbSubjectBranches && Array.isArray(dbSubjectBranches)) {
          for (const sb of dbSubjectBranches) {
            if (!branchMapBySubId[sb.subject_id]) branchMapBySubId[sb.subject_id] = []
            branchMapBySubId[sb.subject_id].push(sb.branch_name || sb.branch_code)
          }
        }

        subjectsState = (dbSubjects as any[]).map((s) => {
          const isCommon = Boolean(s.is_common || s.branch === 'Common' || s.branch_name === 'Common Subject (All Branches)')
          const mappedBranches = branchMapBySubId[s.id] || s.applicable_branches || []
          const branchName = isCommon
            ? 'Common Subject (All Branches)'
            : s.branch_name || s.branch || (mappedBranches.length > 0 ? mappedBranches[0] : 'ECE')

          return {
            id: s.id,
            course_name: s.course_name || s.course || 'B.Tech',
            branch_name: branchName,
            semester_name: s.semester_name || s.semester || '1st Semester',
            name: s.name || s.subject_name || '',
            code: s.code || s.subject_code || '',
            description: s.description || '',
            is_common: isCommon,
            subject_type: s.subject_type || s.type || 'Theory',
            applicable_branches: mappedBranches,
            type: (s.type || s.subject_type || 'Theory') as 'Theory' | 'Practical' | 'Elective',
            credits: Number(s.credits || 4),
            status: (s.status || 'active') as 'active' | 'inactive',
            college_id: s.college_id,
          }
        })
        saveLocalStorage('eduth_subjects_v3', subjectsState)
      }

      if (dbClasses) {
        classesState = (dbClasses as any[]).map((c) => ({
          id: c.id,
          course: c.course,
          branch: c.branch,
          year: c.year,
          semester: c.semester,
          section: c.section,
          name: c.name || `${c.course} ${c.branch} - ${c.year} - ${c.section}`,
          teacher_name: c.teacher_name || '',
          teacher_id: c.teacher_id || '',
          room_no: c.room_no || 'Room 101',
          capacity: c.capacity || 60,
          college_id: c.college_id,
        }))
        saveLocalStorage('eduth_classes_v3', classesState)
      }

      if (dbTeachers) {
        const prevTeachers = teachersState.length > 0 ? teachersState : loadLocalStorage<TeacherRecord[]>('eduth_teachers_v3', [])
        teachersState = (dbTeachers as any[]).map((t) => {
          const localT = prevTeachers.find(
            (p) => (t.id && p.id === t.id) || (t.teacher_id && p.teacher_id === t.teacher_id) || (t.email && p.email && p.email.toLowerCase() === t.email.toLowerCase())
          )

          let parsedClasses: string[] = []
          if (Array.isArray(t.assigned_classes)) {
            parsedClasses = t.assigned_classes
          } else if (typeof t.assigned_classes === 'string') {
            try {
              parsedClasses = JSON.parse(t.assigned_classes)
            } catch {
              parsedClasses = []
            }
          }

          const matchedClassesFromDb = (dbClasses || classesState)
            .filter((c: any) => c.teacher_id === t.teacher_id || c.teacher_id === t.id || (t.name && c.teacher_name === t.name))
            .map((c: any) => c.name || `${c.course} ${c.branch} - ${c.year} - ${c.section}`)

          const combinedClasses = Array.from(new Set([...(parsedClasses.length > 0 ? parsedClasses : (localT?.assigned_classes || [])), ...matchedClassesFromDb]))

          let parsedSubjects: string[] = []
          if (Array.isArray(t.assigned_subjects)) {
            parsedSubjects = t.assigned_subjects
          } else if (typeof t.assigned_subjects === 'string') {
            try {
              parsedSubjects = JSON.parse(t.assigned_subjects)
            } catch {
              parsedSubjects = []
            }
          }
          const combinedSubjects = parsedSubjects.length > 0 ? parsedSubjects : (localT?.assigned_subjects || [])

          return {
            id: t.id,
            teacher_id: t.teacher_id || t.id,
            name: t.name,
            email: t.email,
            phone: t.phone || '',
            position: t.position || 'Assistant Professor',
            course: t.course || 'B.Tech',
            department: t.department || t.course || 'ECE',
            qualification: t.qualification || '',
            college_id: t.college_id,
            assigned_classes: combinedClasses,
            assigned_subjects: combinedSubjects,
          }
        })
        saveLocalStorage('eduth_teachers_v3', teachersState)
      }

      if (dbStudents) {
        studentsState = (dbStudents as any[]).map((s) => ({
          id: s.id,
          student_id: s.student_id || s.roll_no || s.id,
          roll_no: s.roll_no || '',
          name: s.name,
          email: s.email,
          phone: s.phone || '',
          dob: s.dob || '',
          gender: s.gender || 'Other',
          blood_group: s.blood_group || '',
          address: s.address || '',
          parent_name: s.parent_name || '',
          parent_phone: s.parent_phone || '',
          parent_email: s.parent_email || '',
          course: s.course || 'B.Tech',
          branch: s.branch || 'ECE',
          year: s.year || '1st Year',
          semester: s.semester || 'Semester 1',
          section: s.section || 'Section A',
          class_name: s.class_name || `${s.course} ${s.branch} - ${s.year} - ${s.section}`,
          college_id: s.college_id,
        }))
        saveLocalStorage('eduth_students_v3', studentsState)
      }

      if (dbAttendance) {
        attendanceState = (dbAttendance as any[]).map((a) => ({
          id: a.id,
          college_id: a.college_id,
          student_id: a.student_id,
          student_name: a.student_name || '',
          roll_no: a.roll_no || '',
          course: a.course || '',
          branch: a.branch || '',
          year: a.year || '',
          semester: a.semester || '',
          section: a.section || '',
          lecture: a.lecture || 'L-1',
          class_id: a.class_id || '',
          class_name: a.class_name || (a.section ? `${a.course} ${a.branch} - ${a.year} - Section ${a.section}` : ''),
          date: typeof a.date === 'string' ? a.date : new Date(a.date).toISOString().split('T')[0],
          status: a.status,
          remarks: a.remarks || '',
          marked_by: a.marked_by || '',
          created_at: a.created_at || '',
        }))
        saveLocalStorage('eduth_attendance_v3', attendanceState)
      }

      _lastAcademicSyncTime = Date.now()
      _loadedForCollege = targetCollege
      notifyListeners()
    } catch (err) {
      // Ignore sync failures
    } finally {
      _inFlightAcademicSync = null
    }
  })()

  return _inFlightAcademicSync
}

export const syncAcademicStoreWithSupabase = syncWithSupabase

export function resetAcademicStore() {
  classesState = []
  teachersState = []
  studentsState = []
  attendanceState = []
  _lastAcademicSyncTime = 0
  _loadedForCollege = null
  _inFlightAcademicSync = null
  saveLocalStorage('eduth_classes_v3', classesState)
  saveLocalStorage('eduth_teachers_v3', teachersState)
  saveLocalStorage('eduth_students_v3', studentsState)
  saveLocalStorage('eduth_attendance_v3', attendanceState)
  notifyListeners()
}

export const academicStore = {
  getClasses: () => classesState,
  getTeachers: () => teachersState,
  getStudents: () => studentsState.filter((s) => s && s.name && s.name.trim() !== '' && s.name.toLowerCase() !== 'student' && s.roll_no && s.roll_no.trim() !== ''),
  getAttendance: () => attendanceState,

  saveStudent: async (student: Omit<StudentRecord, 'id'> & { id?: string }) => {
    const id = student.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 's_' + Date.now())
    const collegeId = normalizeCollegeId(student.college_id) || student.college_id
    const targetStudent: StudentRecord = { ...student, id, college_id: collegeId }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('students').upsert([{
        id: targetStudent.id,
        college_id: targetStudent.college_id,
        roll_no: targetStudent.roll_no || 'STU-000',
        name: targetStudent.name,
        email: targetStudent.email,
        dob: targetStudent.dob,
        gender: targetStudent.gender,
        blood_group: targetStudent.blood_group,
        address: targetStudent.address,
        phone: targetStudent.phone,
        parent_name: targetStudent.parent_name,
        parent_phone: targetStudent.parent_phone,
        parent_email: targetStudent.parent_email,
        course: targetStudent.course,
        branch: targetStudent.branch,
        year: targetStudent.year,
        semester: targetStudent.semester,
        section: targetStudent.section,
        class_name: targetStudent.class_name,
        status: 'active'
      }])

      if (error) {
        // Fallback to SECURITY DEFINER stored procedure
        const { error: rpcError } = await supabase.rpc('save_student_record', { p_student: targetStudent })
        if (rpcError) {
          throw new Error(rpcError.message || error.message)
        }
      }
    }

    const existingIndex = studentsState.findIndex(
      (s) => (targetStudent.id && s.id === targetStudent.id) || (targetStudent.email && s.email && s.email.toLowerCase() === targetStudent.email.toLowerCase())
    )
    if (existingIndex >= 0) {
      studentsState[existingIndex] = targetStudent
    } else {
      studentsState = [targetStudent, ...studentsState]
    }
    saveLocalStorage('eduth_students_v3', studentsState)
    notifyListeners()
    return targetStudent
  },

  deleteStudent: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('students').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    studentsState = studentsState.filter((s) => s.id !== id)
    saveLocalStorage('eduth_students_v3', studentsState)
    notifyListeners()
  },

  saveTeacher: async (teacher: Omit<TeacherRecord, 'id'> & { id?: string }) => {
    const rawId = teacher.id
    const id = (rawId && isValidUUID(rawId))
      ? rawId
      : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'))
    const rawCollegeId = teacher.college_id || (_loadedForCollege !== 'SUPER_ADMIN' ? _loadedForCollege : null) || 'ea318ebf-893e-410c-a925-ac1d4dc986eb'
    const collegeId = normalizeCollegeId(rawCollegeId) || rawCollegeId
    const targetTeacher: TeacherRecord = {
      ...teacher,
      id,
      college_id: collegeId,
      assigned_classes: teacher.assigned_classes || [],
      assigned_subjects: teacher.assigned_subjects || []
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('teachers').upsert([{
        id: targetTeacher.id,
        college_id: targetTeacher.college_id,
        teacher_id: targetTeacher.teacher_id,
        name: targetTeacher.name,
        email: targetTeacher.email,
        phone: targetTeacher.phone,
        department: targetTeacher.department || targetTeacher.course,
        course: targetTeacher.course,
        position: targetTeacher.position,
        qualification: targetTeacher.qualification,
        assigned_classes: targetTeacher.assigned_classes,
        assigned_subjects: targetTeacher.assigned_subjects,
        status: 'active'
      }])

      if (error) {
        console.warn('Supabase teachers upsert notice:', error.message)
        try {
          await supabase.from('profiles').upsert([{
            id: targetTeacher.id,
            college_id: targetTeacher.college_id,
            school_id: targetTeacher.college_id,
            role: 'teacher',
            name: targetTeacher.name,
            email: targetTeacher.email,
            phone: targetTeacher.phone,
            teacher_id: targetTeacher.teacher_id,
            status: 'active'
          }])
        } catch (pErr) {
          console.warn('Profiles fallback notice:', pErr)
        }
      }

      // Also synchronize matching classes in Supabase 'classes' table
      try {
        if (targetTeacher.assigned_classes.length > 0) {
          for (const className of targetTeacher.assigned_classes) {
            await supabase
              .from('classes')
              .update({ teacher_id: targetTeacher.teacher_id, teacher_name: targetTeacher.name })
              .eq('name', className)
          }
        }
        const classesToClear = classesState.filter(
          (c) =>
            (c.teacher_id === targetTeacher.teacher_id || c.teacher_name === targetTeacher.name) &&
            !targetTeacher.assigned_classes.includes(c.name)
        )
        for (const clsToClear of classesToClear) {
          await supabase
            .from('classes')
            .update({ teacher_id: null, teacher_name: null })
            .eq('id', clsToClear.id)
        }
      } catch (clsErr) {
        console.warn('Classes table teacher sync notice:', clsErr)
      }
    }

    // Update classes in local state as well
    classesState = classesState.map((c) => {
      if (targetTeacher.assigned_classes.includes(c.name)) {
        return { ...c, teacher_id: targetTeacher.teacher_id, teacher_name: targetTeacher.name }
      } else if (c.teacher_id === targetTeacher.teacher_id || c.teacher_name === targetTeacher.name) {
        return { ...c, teacher_id: '', teacher_name: '' }
      }
      return c
    })
    saveLocalStorage('eduth_classes_v3', classesState)

    const existingIndex = teachersState.findIndex(
      (t) => (targetTeacher.id && t.id === targetTeacher.id) || (targetTeacher.email && t.email && t.email.toLowerCase() === targetTeacher.email.toLowerCase())
    )
    if (existingIndex >= 0) {
      teachersState[existingIndex] = targetTeacher
    } else {
      teachersState = [targetTeacher, ...teachersState]
    }
    saveLocalStorage('eduth_teachers_v3', teachersState)
    invalidateAcademicCache()
    notifyListeners()
    return targetTeacher
  },

  deleteTeacher: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('teachers').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    teachersState = teachersState.filter((t) => t.id !== id)
    saveLocalStorage('eduth_teachers_v3', teachersState)
    invalidateAcademicCache()
    notifyListeners()
  },

  getBranches: () => branchesState,

  getBranchesByCourse: (courseName?: string): BranchItem[] => {
    if (!courseName) return branchesState
    return branchesState.filter((b) => b.course_name.toLowerCase() === courseName.toLowerCase())
  },

  saveBranch: async (branch: Omit<BranchItem, 'id'> & { id?: string }) => {
    const id = branch.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'b_' + Date.now())
    const collegeId = normalizeCollegeId(branch.college_id) || branch.college_id || (_loadedForCollege !== 'SUPER_ADMIN' ? _loadedForCollege : null) || 'ea318ebf-893e-410c-a925-ac1d4dc986eb'
    const targetBranch: BranchItem = {
      ...branch,
      id,
      college_id: collegeId,
      status: branch.status || 'active',
    }

    if (isSupabaseConfigured && targetBranch.college_id) {
      const { error } = await supabase.from('branches').upsert([{
        id: targetBranch.id,
        college_id: targetBranch.college_id,
        course_name: targetBranch.course_name,
        name: targetBranch.name,
        code: targetBranch.code,
        status: targetBranch.status,
      }])
      if (error) {
        throw new Error(error.message)
      }
    }

    const existingIndex = branchesState.findIndex((b) => b.id === targetBranch.id)
    if (existingIndex >= 0) {
      branchesState[existingIndex] = targetBranch
    } else {
      branchesState = [...branchesState, targetBranch]
    }
    saveLocalStorage('eduth_branches_v3', branchesState)
    invalidateAcademicCache()
    notifyListeners()
    return targetBranch
  },

  deleteBranch: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('branches').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    branchesState = branchesState.filter((b) => b.id !== id)
    saveLocalStorage('eduth_branches_v3', branchesState)
    invalidateAcademicCache()
    notifyListeners()
  },

  getSemesters: () => semestersState,

  saveSemester: async (semester: Omit<SemesterItem, 'id'> & { id?: string }) => {
    const id = semester.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'sem_' + Date.now())
    const collegeId = normalizeCollegeId(semester.college_id) || semester.college_id || (_loadedForCollege !== 'SUPER_ADMIN' ? _loadedForCollege : null) || 'ea318ebf-893e-410c-a925-ac1d4dc986eb'
    const targetSemester: SemesterItem = {
      ...semester,
      id,
      college_id: collegeId,
      term: semester.term || 'Odd',
      status: semester.status || 'active',
    }

    if (isSupabaseConfigured && targetSemester.college_id) {
      const { error } = await supabase.from('semesters').upsert([{
        id: targetSemester.id,
        college_id: targetSemester.college_id,
        course: targetSemester.course_name,
        course_name: targetSemester.course_name,
        name: targetSemester.name,
        term: targetSemester.term,
        status: targetSemester.status,
      }])
      if (error) {
        throw new Error(error.message)
      }
    }

    const existingIndex = semestersState.findIndex((s) => s.id === targetSemester.id)
    if (existingIndex >= 0) {
      semestersState[existingIndex] = targetSemester
    } else {
      semestersState = [...semestersState, targetSemester]
    }
    saveLocalStorage('eduth_semesters_v3', semestersState)
    invalidateAcademicCache()
    notifyListeners()
    return targetSemester
  },

  deleteSemester: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('semesters').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    semestersState = semestersState.filter((s) => s.id !== id)
    saveLocalStorage('eduth_semesters_v3', semestersState)
    invalidateAcademicCache()
    notifyListeners()
  },

  getSections: () => sectionsState,

  saveSection: async (section: Omit<SectionItem, 'id'> & { id?: string }) => {
    const id = section.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'sec_' + Date.now())
    const collegeId = normalizeCollegeId(section.college_id) || section.college_id || (_loadedForCollege !== 'SUPER_ADMIN' ? _loadedForCollege : null) || 'ea318ebf-893e-410c-a925-ac1d4dc986eb'
    const targetSection: SectionItem = {
      ...section,
      id,
      college_id: collegeId,
      capacity: Number(section.capacity || 60),
      status: section.status || 'active',
    }

    if (isSupabaseConfigured && targetSection.college_id) {
      const { error } = await supabase.from('sections').upsert([{
        id: targetSection.id,
        college_id: targetSection.college_id,
        course_name: targetSection.course_name,
        branch_name: targetSection.branch_name,
        semester_name: targetSection.semester_name,
        name: targetSection.name,
        capacity: targetSection.capacity,
        status: targetSection.status,
      }])
      if (error) {
        throw new Error(error.message)
      }
    }

    const existingIndex = sectionsState.findIndex((s) => s.id === targetSection.id)
    if (existingIndex >= 0) {
      sectionsState[existingIndex] = targetSection
    } else {
      sectionsState = [...sectionsState, targetSection]
    }
    saveLocalStorage('eduth_sections_v3', sectionsState)
    invalidateAcademicCache()
    notifyListeners()
    return targetSection
  },

  deleteSection: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('sections').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    sectionsState = sectionsState.filter((s) => s.id !== id)
    saveLocalStorage('eduth_sections_v3', sectionsState)
    invalidateAcademicCache()
    notifyListeners()
  },

  getSubjects: () => subjectsState,

  getSubjectsByClass: (course?: string, branch?: string, semester?: string): SubjectItem[] => {
    return subjectsState.filter((sub) => {
      // Flexible course matching
      if (course && sub.course_name) {
        const c1 = sub.course_name.toLowerCase().replace(/[^a-z0-9]/g, '')
        const c2 = course.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (c1 !== c2 && sub.course_name !== 'All' && !c1.includes(c2) && !c2.includes(c1)) return false
      }

      // Check if branch is specifically TNP
      const isTargetTnp = Boolean(branch && (branch.toUpperCase() === 'TNP' || isBranchMatch('TNP', branch)))
      const isSubTnp = Boolean(
        sub.branch_name === 'TNP' ||
        sub.subject_type === 'TNP' ||
        (sub.branch_name && sub.branch_name.toLowerCase().includes('training and placement')) ||
        (sub.applicable_branches && sub.applicable_branches.includes('TNP'))
      )

      if (isTargetTnp) {
        // When TNP branch is selected, return ONLY TNP subjects
        return isSubTnp
      } else if (isSubTnp) {
        // TNP subjects should NOT show under non-TNP branches
        return false
      }

      // Flexible semester matching (e.g. 'Semester 1' vs '1st Semester')
      if (semester && sub.semester_name && sub.semester_name !== 'All Semesters') {
        const s1Num = sub.semester_name.replace(/[^0-9]/g, '')
        const s2Num = semester.replace(/[^0-9]/g, '')
        if (s1Num && s2Num) {
          if (s1Num !== s2Num) return false
        } else if (sub.semester_name.toLowerCase().trim() !== semester.toLowerCase().trim()) {
          return false
        }
      }

      // Flexible branch matching
      if (branch) {
        const isSubCommon = Boolean(sub.is_common || (sub.branch_name || '').toLowerCase().includes('common'))
        if (isSubCommon) return true

        const targetCode = (BRANCH_CODE_MAP[branch] || branch).toLowerCase().trim()
        const targetFull = (BRANCH_MAP[branch] || branch).toLowerCase().trim()
        const targetRaw = branch.toLowerCase().trim()

        if (sub.applicable_branches && sub.applicable_branches.length > 0) {
          const matchInList = sub.applicable_branches.some((b) => {
            const bNorm = b.toLowerCase().trim()
            const bCode = (BRANCH_CODE_MAP[b] || b).toLowerCase().trim()
            return bNorm === targetRaw || bCode === targetCode || bNorm === targetFull || bNorm.replace(/[^a-z0-9]/g, '') === targetRaw.replace(/[^a-z0-9]/g, '')
          })
          if (matchInList) return true
        }

        const subBranchNorm = (sub.branch_name || '').toLowerCase().trim()
        const subBranchCode = (BRANCH_CODE_MAP[sub.branch_name] || sub.branch_name || '').toLowerCase().trim()
        const subClean = subBranchNorm.replace(/[^a-z0-9]/g, '')
        const targetClean = targetRaw.replace(/[^a-z0-9]/g, '')

        const matches =
          subClean === targetClean ||
          subBranchNorm === targetRaw ||
          subBranchNorm === targetFull ||
          subBranchCode === targetCode ||
          subBranchNorm.includes(targetCode) ||
          targetRaw.includes(subBranchCode)

        if (!matches) return false
      }
      return true
    })
  },

  saveSubject: async (subject: Omit<SubjectItem, 'id'> & { id?: string }) => {
    const id = subject.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'sub_' + Date.now())
    const collegeId = normalizeCollegeId(subject.college_id) || subject.college_id
    const isCommon = Boolean(
      subject.is_common ||
      subject.branch_name === 'Common Subject (All Branches)' ||
      subject.branch_name === 'Common'
    )

    const targetSubject: SubjectItem = {
      ...subject,
      id,
      college_id: collegeId,
      is_common: isCommon,
      branch_name: isCommon ? 'Common Subject (All Branches)' : subject.branch_name,
      type: subject.type || 'Theory',
      credits: Number(subject.credits || 4),
      status: subject.status || 'active',
      applicable_branches: subject.applicable_branches || [],
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('subjects').upsert([{
          id: targetSubject.id,
          college_id: targetSubject.college_id,
          course: targetSubject.course_name,
          branch: isCommon ? 'Common' : targetSubject.branch_name,
          semester: targetSubject.semester_name,
          name: targetSubject.name,
          code: targetSubject.code,
          description: targetSubject.description || '',
          is_common: isCommon,
          subject_type: targetSubject.type,
          applicable_branches: targetSubject.applicable_branches,
          type: targetSubject.type,
          credits: targetSubject.credits,
          status: targetSubject.status,
        }])

        // Sync subject_branches junction table
        await supabase.from('subject_branches').delete().eq('subject_id', targetSubject.id)

        if (targetSubject.applicable_branches && targetSubject.applicable_branches.length > 0) {
          const branchRows = targetSubject.applicable_branches.map((br) => ({
            subject_id: targetSubject.id,
            branch_code: BRANCH_CODE_MAP[br] || br,
            branch_name: BRANCH_MAP[br] || br,
            college_id: targetSubject.college_id,
          }))
          await supabase.from('subject_branches').insert(branchRows)
        } else if (!isCommon && targetSubject.branch_name) {
          const code = BRANCH_CODE_MAP[targetSubject.branch_name] || targetSubject.branch_name
          await supabase.from('subject_branches').insert([{
            subject_id: targetSubject.id,
            branch_code: code,
            branch_name: targetSubject.branch_name,
            college_id: targetSubject.college_id,
          }])
        }
      } catch (err: any) {
        console.warn('Supabase saveSubject error:', err)
      }
    }

    const existingIndex = subjectsState.findIndex((s) => s.id === targetSubject.id)
    if (existingIndex >= 0) {
      subjectsState[existingIndex] = targetSubject
    } else {
      subjectsState = [targetSubject, ...subjectsState]
    }
    saveLocalStorage('eduth_subjects_v3', subjectsState)
    notifyListeners()
    return targetSubject
  },

  deleteSubject: async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('subject_branches').delete().eq('subject_id', id)
        await supabase.from('subjects').delete().eq('id', id)
      } catch (err: any) {
        console.warn('Supabase deleteSubject error:', err)
      }
    }
    subjectsState = subjectsState.filter((s) => s.id !== id)
    saveLocalStorage('eduth_subjects_v3', subjectsState)
    notifyListeners()
  },

  saveClass: async (cls: Omit<ClassRecord, 'id'> & { id?: string }) => {
    const id = cls.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'c_' + Date.now())
    const collegeId = normalizeCollegeId(cls.college_id) || cls.college_id
    const targetClass: ClassRecord = { ...cls, id, college_id: collegeId }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('classes').upsert([{
        id: targetClass.id,
        college_id: targetClass.college_id,
        course: targetClass.course,
        branch: targetClass.branch,
        year: targetClass.year,
        semester: targetClass.semester,
        section: targetClass.section,
        name: targetClass.name,
        teacher_id: targetClass.teacher_id || null,
        teacher_name: targetClass.teacher_name || null,
        room_no: targetClass.room_no || null,
        capacity: targetClass.capacity || 60
      }])

      if (error) {
        throw new Error(error.message)
      }
    }

    const existingIndex = classesState.findIndex((c) => c.id === targetClass.id)
    if (existingIndex >= 0) {
      classesState[existingIndex] = targetClass
    } else {
      classesState = [targetClass, ...classesState]
    }
    saveLocalStorage('eduth_classes_v3', classesState)
    notifyListeners()
    return targetClass
  },

  deleteClass: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('classes').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    classesState = classesState.filter((c) => c.id !== id)
    saveLocalStorage('eduth_classes_v3', classesState)
    notifyListeners()
  },

  setAttendanceRecord: async (record: AttendanceEntry) => {
    const student = studentsState.find((s) => s.id === record.student_id || s.student_id === record.student_id || s.roll_no === record.roll_no)
    const actualStudentId = student?.id || record.student_id
    const rawCollegeId = record.college_id || student?.college_id || (_loadedForCollege !== 'SUPER_ADMIN' ? _loadedForCollege : null) || 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f'
    const collegeId = normalizeCollegeId(rawCollegeId) || rawCollegeId
    const lectureKey = record.lecture || 'L-1'
    const attId = record.id || `att_${actualStudentId}_${record.date}_${lectureKey}`
    const rawSection = record.section || student?.section || 'A'
    const cleanSection = rawSection.replace(/^Section\s+/i, '').trim() || 'A'

    const targetRecord: AttendanceEntry = {
      ...record,
      id: attId,
      college_id: collegeId,
      student_id: actualStudentId,
      student_name: record.student_name || student?.name || '',
      roll_no: record.roll_no || student?.roll_no || '',
      course: record.course || student?.course || 'B.Tech',
      branch: record.branch || student?.branch || 'ECE',
      year: record.year || student?.year || '1st Year',
      semester: record.semester || student?.semester || 'Semester 1',
      section: cleanSection,
      lecture: lectureKey,
      class_name: record.class_name || `${record.course || student?.course || 'B.Tech'} ${record.branch || student?.branch || 'ECE'} - ${record.year || student?.year || '1st Year'} - Section ${cleanSection}`,
    }

    if (isSupabaseConfigured && collegeId) {
      const matchingClass = classesState.find((c) => c.name === targetRecord.class_name || c.id === targetRecord.class_name)
      const { error } = await supabase.from('attendance').upsert([{
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
        lecture: targetRecord.lecture,
        class_id: matchingClass ? matchingClass.id : null,
        class_name: targetRecord.class_name,
        date: targetRecord.date,
        status: targetRecord.status,
        remarks: targetRecord.remarks || null,
        marked_by: targetRecord.marked_by || null,
      }])

      if (error) {
        console.error('Supabase attendance upsert error:', error.message)
        throw new Error(error.message)
      }
    }

    const existingIndex = attendanceState.findIndex(
      (a) => a.id === targetRecord.id || (a.student_id === targetRecord.student_id && a.date === targetRecord.date && (a.lecture === targetRecord.lecture || (!a.lecture && targetRecord.lecture === 'L-1')))
    )
    if (existingIndex >= 0) {
      attendanceState[existingIndex] = targetRecord
    } else {
      attendanceState = [...attendanceState, targetRecord]
    }
    saveLocalStorage('eduth_attendance_v3', attendanceState)
    invalidateAcademicCache()
    notifyListeners()
    return targetRecord
  },

  deleteAttendanceRecord: async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('attendance').delete().eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    }
    attendanceState = attendanceState.filter((a) => a.id !== id)
    saveLocalStorage('eduth_attendance_v3', attendanceState)
    invalidateAcademicCache()
    notifyListeners()
  },

  deleteAttendanceSession: async (sessionFilter: {
    date: string
    course?: string
    branch?: string
    year?: string
    semester?: string
    section?: string
    lecture?: string
  }) => {
    if (isSupabaseConfigured) {
      let query = supabase.from('attendance').delete().eq('date', sessionFilter.date)
      if (sessionFilter.course) query = query.eq('course', sessionFilter.course)
      if (sessionFilter.branch) query = query.eq('branch', sessionFilter.branch)
      if (sessionFilter.year) query = query.eq('year', sessionFilter.year)
      if (sessionFilter.semester) query = query.eq('semester', sessionFilter.semester)
      if (sessionFilter.section) query = query.eq('section', sessionFilter.section)
      if (sessionFilter.lecture) query = query.eq('lecture', sessionFilter.lecture)
      const { error } = await query
      if (error) {
        console.error('Supabase deleteAttendanceSession error:', error.message)
      }
    }
    attendanceState = attendanceState.filter((a) => {
      if (a.date !== sessionFilter.date) return true
      if (sessionFilter.course && a.course && a.course !== sessionFilter.course) return true
      if (sessionFilter.branch && a.branch && a.branch !== sessionFilter.branch) return true
      if (sessionFilter.year && a.year && a.year !== sessionFilter.year) return true
      if (sessionFilter.semester && a.semester && a.semester !== sessionFilter.semester) return true
      if (sessionFilter.section && a.section && a.section !== sessionFilter.section) return true
      if (sessionFilter.lecture && a.lecture && a.lecture !== sessionFilter.lecture) return true
      return false
    })
    saveLocalStorage('eduth_attendance_v3', attendanceState)
    invalidateAcademicCache()
    notifyListeners()
  },

  clearAllAttendance: async () => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('attendance').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        if (error) {
          console.error('Supabase clearAllAttendance error:', error.message)
        }
      } catch (err) {
        console.error('Supabase clearAllAttendance exception:', err)
      }
    }
    attendanceState = []
    saveLocalStorage('eduth_attendance_v3', attendanceState)
    invalidateAcademicCache()
    notifyListeners()
  },

  getStudentAttendancePercentage: (studentId: string): number => {
    const student = studentsState.find(
      (s) =>
        s.id === studentId ||
        s.student_id === studentId ||
        s.roll_no === studentId ||
        `STU-${s.roll_no}` === studentId ||
        studentId.replace(/^STU-/i, '') === s.roll_no
    )
    const actualId = student?.id || studentId
    const studentRollNo = student?.roll_no
    const studentEmail = student?.email?.toLowerCase().trim()

    const records = attendanceState.filter(
      (a) =>
        a.student_id === actualId ||
        a.student_id === studentId ||
        (student?.student_id && a.student_id === student.student_id) ||
        (studentRollNo && (a.roll_no === studentRollNo || a.roll_no === `STU-${studentRollNo}` || `STU-${a.roll_no}` === studentRollNo)) ||
        (studentEmail && a.student_name && a.student_name.toLowerCase().includes(studentEmail))
    )
    if (records.length === 0) return 0
    const presentCount = records.filter((r) => r.status === 'present' || r.status === 'late').length
    return Math.round((presentCount / records.length) * 100)
  },

  getClassAttendanceStats: (classItem: ClassRecord): { present: number; total: number } => {
    const enrolledStudents = studentsState.filter((s) => {
      if (classItem.course && s.course !== classItem.course) return false
      if (classItem.branch && s.branch !== classItem.branch) return false
      if (classItem.year && s.year !== classItem.year) return false
      if (classItem.section && s.section !== classItem.section) return false
      return true
    })
    const total = enrolledStudents.length
    
    let present = 0
    if (enrolledStudents.length > 0) {
      enrolledStudents.forEach((st) => {
        const rec = attendanceState.find((a) => a.student_id === st.id)
        if (!rec || rec.status === 'present' || rec.status === 'late') {
          present++
        }
      })
    }
    return { present, total }
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx >= 0) listeners.splice(idx, 1)
    }
  },
}

export function getTeacherForUser(user: any | null, teachersList?: TeacherRecord[], classesList?: ClassRecord[]): TeacherRecord | null {
  if (!user) return null
  const list = teachersList || academicStore.getTeachers()
  const clsList = classesList || academicStore.getClasses()

  const userEmailLower = user.email?.toLowerCase().trim()
  const userId = user.id
  const userTeacherId = user.teacher_id

  const found = list.find(
    (t) =>
      (userEmailLower && t.email?.toLowerCase().trim() === userEmailLower) ||
      (userTeacherId && t.teacher_id === userTeacherId) ||
      (userId && t.id === userId)
  )

  if (found) {
    if ((!found.assigned_classes || found.assigned_classes.length === 0) && clsList.length > 0) {
      const matchedFromClasses = clsList
        .filter(
          (c) =>
            c.teacher_id === found.teacher_id ||
            (userEmailLower && c.teacher_id?.toLowerCase().trim() === userEmailLower) ||
            (found.name && c.teacher_name?.includes(found.name))
        )
        .map((c) => c.name)
      if (matchedFromClasses.length > 0) {
        return { ...found, assigned_classes: matchedFromClasses }
      }
    }
    return found
  }

  if (user.role === 'teacher') {
    const matchedFromClasses = clsList
      .filter(
        (c) =>
          (userTeacherId && c.teacher_id === userTeacherId) ||
          (userEmailLower && c.teacher_id?.toLowerCase().trim() === userEmailLower) ||
          (user.name && c.teacher_name?.includes(user.name))
      )
      .map((c) => c.name)

    return {
      id: user.id || `t_${Date.now()}`,
      teacher_id: user.teacher_id || 'TCH-2026-0001',
      name: user.name || (user.email ? user.email.split('@')[0] : 'Faculty Member'),
      position: 'Assistant Professor',
      course: 'B.Tech',
      department: 'ECE',
      assigned_classes: matchedFromClasses,
      email: user.email || 'teacher@school.edu',
      phone: user.phone || '',
      qualification: 'Higher Education Degree',
      college_id: user.college_id || 'COL001',
    }
  }
  return null
}

export function getAssignedClassRecordsForTeacher(
  user: any | null,
  teachersList?: TeacherRecord[],
  classesList?: ClassRecord[]
): ClassRecord[] {
  if (!user) return []
  const clsList = classesList || academicStore.getClasses()
  const teacherRec = getTeacherForUser(user, teachersList, clsList)
  if (!teacherRec) return []

  const assignedStrings = teacherRec.assigned_classes || []
  const userEmailLower = user.email?.toLowerCase().trim()
  const userTeacherId = user.teacher_id || teacherRec.teacher_id
  const userId = user.id || teacherRec.id
  const teacherName = teacherRec.name || user.name

  const directMatched = clsList.filter((c) => {
    return (
      (userTeacherId && c.teacher_id === userTeacherId) ||
      (userId && c.teacher_id === userId) ||
      (userEmailLower && c.teacher_id?.toLowerCase().trim() === userEmailLower) ||
      (teacherName && c.teacher_name && c.teacher_name.includes(teacherName))
    )
  })

  const arrayMatched = clsList.filter((c) => {
    return assignedStrings.some((ac) => {
      if (!ac) return false
      if (c.id === ac || c.name === ac) return true
      const acLower = ac.toLowerCase()
      const cNameLower = c.name.toLowerCase()
      if (acLower === cNameLower || acLower.includes(cNameLower) || cNameLower.includes(acLower)) return true

      const courseMatch = !c.course || acLower.includes(c.course.toLowerCase())
      const branchMatch = !c.branch || acLower.includes(c.branch.toLowerCase())
      const yearMatch = !c.year || acLower.includes(c.year.toLowerCase()) || (c.semester && acLower.includes(c.semester.toLowerCase()))
      const secMatch = !c.section || acLower.includes(c.section.toLowerCase())
      return courseMatch && branchMatch && yearMatch && secMatch
    })
  })

  // Deduplicate matched classes
  const map = new Map<string, ClassRecord>()
  for (const c of [...directMatched, ...arrayMatched]) {
    map.set(c.id, c)
  }
  return Array.from(map.values())
}

// Track which college's data is currently loaded in memory

export function useAcademicStore() {
  const [, setTick] = useState(0)
  let userContext: any = null

  try {
    const auth = useAuth()
    userContext = auth.user
  } catch {
    // Graceful fallback if invoked outside AuthProvider
  }

  const userCollege = userContext?.college_id || userContext?.school_id
  const isSuperAdmin = userContext?.role === 'super_admin'
  const normalizedUserCollege = normalizeCollegeId(userCollege)

  useEffect(() => {
    // Subscribe to store changes for re-renders
    const unsubscribe = academicStore.subscribe(() => {
      setTick((prev) => prev + 1)
    })

    if (!userCollege && !isSuperAdmin) {
      return unsubscribe
    }

    const targetCollege = isSuperAdmin ? 'SUPER_ADMIN' : normalizedUserCollege

    // If data loaded is for a different college, clear and re-fetch
    if (_loadedForCollege !== null && _loadedForCollege !== targetCollege) {
      // Clear stale data from previous college only when actually switching colleges
      classesState = []
      teachersState = []
      studentsState = []
      attendanceState = []
      notifyListeners()
      _loadedForCollege = targetCollege
    }

    // Always fetch fresh data from Supabase
    syncWithSupabase(normalizedUserCollege, isSuperAdmin).then(() => {
      _loadedForCollege = targetCollege
    })

    return unsubscribe
  }, [userContext?.id, userCollege, normalizedUserCollege, isSuperAdmin])

  const    rawClasses = academicStore.getClasses()
  const rawTeachers = academicStore.getTeachers()
  const rawStudents = academicStore.getStudents()
  const rawSubjects = academicStore.getSubjects()

  // No client-side college filtering needed - Supabase RLS + syncWithSupabase already filter by college
  // But keep isCollegeMatch as a safety net for any edge cases
  const isCollegeMatch = (itemCollegeId?: string) => {
    if (isSuperAdmin) return true
    if (!itemCollegeId || !normalizedUserCollege) return true // show all if no filter context
    const normItem = normalizeCollegeId(itemCollegeId)
    return normItem === normalizedUserCollege
  }

  const scopedClasses = isSuperAdmin ? rawClasses : rawClasses.filter((c) => isCollegeMatch(c.college_id))
  const scopedTeachers = isSuperAdmin ? rawTeachers : rawTeachers.filter((t) => isCollegeMatch(t.college_id))
  let scopedStudents = isSuperAdmin ? rawStudents : rawStudents.filter((s) => isCollegeMatch(s.college_id))
  const scopedSubjects = isSuperAdmin ? rawSubjects : rawSubjects.filter((s) => isCollegeMatch(s.college_id))

  if (userContext?.role === 'student') {
    const sId = userContext.student_id || userContext.id
    const userEmailLower = userContext.email?.toLowerCase().trim()
    scopedStudents = scopedStudents.filter(
      (s) =>
        s.id === sId ||
        s.student_id === sId ||
        s.roll_no === sId ||
        `STU-${s.roll_no}` === sId ||
        sId.replace(/^STU-/i, '') === s.roll_no ||
        (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower)
    )
  } else if (userContext?.role === 'parent') {
    const cId = userContext.child_student_id || userContext.student_id
    const userEmailLower = userContext.email?.toLowerCase().trim()
    scopedStudents = scopedStudents.filter(
      (s) =>
        s.id === cId ||
        s.student_id === cId ||
        s.roll_no === cId ||
        `STU-${s.roll_no}` === cId ||
        (cId && cId.replace(/^STU-/i, '') === s.roll_no) ||
        (userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower) ||
        (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower)
    )
  } else if (userContext?.role === 'teacher') {
    const currentTeacher = getTeacherForUser(userContext, rawTeachers, rawClasses)
    if (currentTeacher) {
      const teacherClasses = rawClasses.filter(
        (c) =>
          c.teacher_id === currentTeacher.teacher_id ||
          (currentTeacher.email && c.teacher_id?.toLowerCase().trim() === currentTeacher.email.toLowerCase().trim()) ||
          (currentTeacher.name && c.teacher_name?.includes(currentTeacher.name)) ||
          (currentTeacher.assigned_classes || []).some(
            (ac) =>
              ac.includes(c.name) ||
              c.name.includes(ac) ||
              (ac.toLowerCase().includes(c.course.toLowerCase()) &&
                ac.toLowerCase().includes(c.branch.toLowerCase()) &&
                ac.toLowerCase().includes(c.year.toLowerCase()))
          )
      )

      scopedStudents = scopedStudents.filter((s) => {
        const matchClassObj = teacherClasses.some(
          (c) =>
            s.course === c.course &&
            s.branch === c.branch &&
            s.year === c.year &&
            (!c.section || c.section === 'All Sections' || s.section === c.section || c.name.includes(s.section))
        )
        if (matchClassObj) return true

        const assigned = currentTeacher.assigned_classes || []
        if (assigned.length === 0) return false

        const secClean = (s.section || '').replace(/^Section\s+/i, '').trim()

        return assigned.some((ac) => {
          if (ac === s.class_name || ac === s.id) return true
          if (s.class_name && (ac.includes(s.class_name) || s.class_name.includes(ac))) return true
          const norm = ac.toLowerCase()
          const matchCourse = s.course && norm.includes(s.course.toLowerCase())
          const matchBranch = s.branch && norm.includes(s.branch.toLowerCase())
          const matchYear = s.year && norm.includes(s.year.toLowerCase())
          const matchSec = !secClean || norm.includes(secClean.toLowerCase())
          return matchCourse && matchBranch && matchYear && matchSec
        })
      })
    }
  }

  const rawSemesters = academicStore.getSemesters()
  const scopedSemesters = isSuperAdmin ? rawSemesters : rawSemesters.filter((s) => isCollegeMatch(s.college_id))

  const rawBranches = academicStore.getBranches()
  const scopedBranches = isSuperAdmin ? rawBranches : rawBranches.filter((b) => isCollegeMatch(b.college_id))

  const dynamicBranchesByCourse: Record<string, string[]> = { ...BRANCHES_BY_COURSE }
  COURSES.forEach((c) => {
    const bList = scopedBranches
      .filter((b) => b.course_name.toLowerCase() === c.toLowerCase())
      .map((b) => b.code || b.name)
    if (bList.length > 0) {
      dynamicBranchesByCourse[c] = Array.from(new Set([...(BRANCHES_BY_COURSE[c] || []), ...bList]))
    }
  })

  const rawSections = academicStore.getSections()
  const scopedSections = isSuperAdmin ? rawSections : rawSections.filter((sec) => isCollegeMatch(sec.college_id))

  return {
    courses: COURSES,
    branchesByCourse: dynamicBranchesByCourse,
    years: YEARS,
    teacherPositions: TEACHER_POSITIONS,
    classes: scopedClasses,
    teachers: scopedTeachers,
    students: scopedStudents,
    subjects: scopedSubjects,
    semesters: scopedSemesters,
    branches: scopedBranches,
    sections: scopedSections,
    allStudentsRaw: rawStudents,
    attendance: academicStore.getAttendance(),
    getAttendance: academicStore.getAttendance,
    getTeacherForUser: (usr?: any) => getTeacherForUser(usr || userContext, scopedTeachers),
    getAssignedClassRecordsForTeacher: (usr?: any) => getAssignedClassRecordsForTeacher(usr || userContext, scopedTeachers, scopedClasses),
    saveStudent: academicStore.saveStudent,
    deleteStudent: academicStore.deleteStudent,
    saveTeacher: academicStore.saveTeacher,
    addTeacher: academicStore.saveTeacher,
    deleteTeacher: academicStore.deleteTeacher,
    saveClass: academicStore.saveClass,
    deleteClass: academicStore.deleteClass,
    getSemesters: academicStore.getSemesters,
    saveSemester: academicStore.saveSemester,
    deleteSemester: academicStore.deleteSemester,
    getBranches: academicStore.getBranches,
    getBranchesByCourse: academicStore.getBranchesByCourse,
    saveBranch: academicStore.saveBranch,
    deleteBranch: academicStore.deleteBranch,
    getSections: academicStore.getSections,
    saveSection: academicStore.saveSection,
    deleteSection: academicStore.deleteSection,
    getSubjects: academicStore.getSubjects,
    getSubjectsByClass: academicStore.getSubjectsByClass,
    saveSubject: academicStore.saveSubject,
    deleteSubject: academicStore.deleteSubject,
    setAttendanceRecord: academicStore.setAttendanceRecord,
    deleteAttendanceRecord: academicStore.deleteAttendanceRecord,
    deleteAttendanceSession: academicStore.deleteAttendanceSession,
    clearAllAttendance: academicStore.clearAllAttendance,
    getStudentAttendancePercentage: academicStore.getStudentAttendancePercentage,
    getClassAttendanceStats: academicStore.getClassAttendanceStats,
  }
}
