import { useState, useEffect } from 'react'
import type { UserRole } from '../types/domain'
import { supabase, isSupabaseConfigured } from './supabase'

export interface PermissionDefinition {
  id: string
  name: string
  description: string
  category: string
  defaultChecked: Record<UserRole, boolean>
}

export interface PermissionGroup {
  category: string
  description: string
  permissions: PermissionDefinition[]
}

export interface PresetTemplate {
  id: string
  name: string
  description: string
  targetRole: 'teacher' | 'admin' | 'student'
  permissions: Record<string, boolean>
}

export function splitPermissionId(permId: string): { module: string; action: string } {
  const parts = permId.split('.')
  if (parts.length >= 2) {
    return { module: parts[0], action: parts.slice(1).join('_') }
  }
  return { module: permId, action: 'view' }
}

// Maps legacy/alternative permission keys to standard Part 2 permission IDs
const PERMISSION_ALIASES: Record<string, string> = {
  'attendance.mark': 'attendance.create',
  'exams.view': 'exam.view',
  'exams.create': 'exam.create',
  'exams.edit': 'exam.edit',
  'exams.delete': 'exam.delete',
  'exams.export': 'exam.export',
  'results.view': 'exam.result_view',
  'results.enter': 'exam.marks_create',
  'results.edit': 'exam.marks_edit',
  'results.delete': 'exam.marks_delete',
  'results.publish': 'exam.publish',
  'materials.view': 'study_material.view',
  'materials.create': 'study_material.create',
  'materials.edit': 'study_material.edit',
  'materials.delete': 'study_material.delete',
  'assignments.view': 'assignment.view',
  'assignments.create': 'assignment.create',
  'assignments.edit': 'assignment.edit',
  'assignments.delete': 'assignment.delete',
  'notices.view': 'notice.view',
  'notices.create': 'notice.create',
  'notices.edit': 'notice.edit',
  'notices.delete': 'notice.delete',
  'tnp.create': 'tnp.drives_manage',
  'tnp.application_view': 'tnp.applications_view',
  'tnp.application_manage': 'tnp.applications_manage',
  'tnp.selection_manage': 'tnp.selection_process',
  'tnp.placement_manage': 'tnp.placement_publish',
  'tnp.export': 'reports.export',
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'Student Management',
    description: 'Control access to college student directory, profile records, and academic status',
    permissions: [
      {
        id: 'students.view',
        name: 'View Student Directory',
        description: 'View student profiles, roll numbers, and academic allocations',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'students.create',
        name: 'Add / Enroll Student',
        description: 'Add new student records to assigned classes',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'students.edit',
        name: 'Edit Student Information',
        description: 'Modify personal details, roll numbers, and contact info',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'students.delete',
        name: 'Delete Student Record',
        description: 'Permanently delete student records from directory',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'students.import',
        name: 'Import Students',
        description: 'Bulk import student records via CSV/Excel',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'students.export',
        name: 'Export Student Records',
        description: 'Export student lists in CSV/PDF format',
        category: 'Student Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Attendance System',
    description: 'Control recording, reviewing, editing, and exporting student daily and lecture attendance',
    permissions: [
      {
        id: 'attendance.view',
        name: 'View Attendance Records',
        description: 'View lecture logs and student attendance percentages',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'attendance.create',
        name: 'Mark Class Attendance',
        description: 'Record daily and lecture attendance for assigned classes',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'attendance.edit',
        name: 'Edit Historical Attendance',
        description: 'Modify past attendance entries beyond default lock period',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'attendance.delete',
        name: 'Delete Attendance Entry',
        description: 'Remove recorded attendance records',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'attendance.history',
        name: 'View Attendance History',
        description: 'Access complete academic year attendance logs',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'attendance.export',
        name: 'Export Attendance Reports',
        description: 'Export attendance logs in CSV/PDF format',
        category: 'Attendance System',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Fees & Financial Ledger',
    description: 'Control viewing fee structures, student dues, collecting payments, and fee edits',
    permissions: [
      {
        id: 'fees.view',
        name: 'View Fee Ledgers',
        description: 'View student fee structures, balances, paid, and pending dues',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: true, parent: true },
      },
      {
        id: 'fees.create',
        name: 'Configure Fee Structure',
        description: 'Create annual and semester fee structures for courses',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'fees.edit',
        name: 'Edit Fee Structure / Payment',
        description: 'Modify existing fee amounts, installment dates, or payment logs',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'fees.delete',
        name: 'Delete Fee Record',
        description: 'Remove payment receipts or fee structures',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'fees.collect',
        name: 'Collect Fee Payment',
        description: 'Process student fee payments, record receipts, and update dues',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'fees.history',
        name: 'View Payment History',
        description: 'Access complete transaction history and receipt archives',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: true, parent: true },
      },
      {
        id: 'fees.export',
        name: 'Export Financial Reports',
        description: 'Download financial ledgers and collection summaries',
        category: 'Fees & Financial Ledger',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Test & Examination',
    description: 'Control creation, scheduling, grading, and result publishing for examinations',
    permissions: [
      {
        id: 'exam.view',
        name: 'View Scheduled Exams',
        description: 'View exam timetables, sessional dates, and subject schedules',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'exam.create',
        name: 'Create Examination',
        description: 'Schedule new tests, sessional exams, PUTs, and main exams',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'exam.edit',
        name: 'Edit Exam Details',
        description: 'Modify exam timing, max marks, passing criteria, and dates',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'exam.delete',
        name: 'Delete Examination',
        description: 'Cancel and remove scheduled examinations',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'exam.schedule_manage',
        name: 'Manage Exam Timetable',
        description: 'Configure exam dates, slots, and seating arrangements',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'exam.marks_view',
        name: 'View Marks Entry Ledger',
        description: 'View subject marksheets and batch grade lists',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'exam.marks_create',
        name: 'Enter Student Marks',
        description: 'Batch enter marks for assigned subject examinations',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'exam.marks_edit',
        name: 'Edit Entered Marks',
        description: 'Modify previously entered student exam scores',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'exam.marks_delete',
        name: 'Delete Exam Marks',
        description: 'Remove entered marks from exam ledgers',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'exam.publish',
        name: 'Publish Exam Results',
        description: 'Make exam results visible to students',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'exam.result_view',
        name: 'View Published Results',
        description: 'View final result cards and score summaries',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'exam.export',
        name: 'Export Exam Scorecards',
        description: 'Export result sheets and exam marksheets in PDF/CSV',
        category: 'Test & Examination',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Study Material',
    description: 'Control uploading, categorizing, and sharing academic study materials',
    permissions: [
      {
        id: 'study_material.view',
        name: 'Access Study Materials',
        description: 'View and download handwritten notes, PYQ, and quantum series',
        category: 'Study Material',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: false },
      },
      {
        id: 'study_material.create',
        name: 'Upload Study Resource',
        description: 'Add new study materials for specific courses and semesters',
        category: 'Study Material',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'study_material.edit',
        name: 'Edit Material Details',
        description: 'Update study material title, category, and access level',
        category: 'Study Material',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'study_material.delete',
        name: 'Delete Study Resource',
        description: 'Remove study materials from repository',
        category: 'Study Material',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Assignments & Coursework',
    description: 'Permissions for creating, submitting, and grading academic assignments',
    permissions: [
      {
        id: 'assignment.view',
        name: 'View Course Assignments',
        description: 'Access assigned coursework, deadlines, and requirements',
        category: 'Assignments & Coursework',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'assignment.create',
        name: 'Create Assignment',
        description: 'Publish new assignments to targeted courses and sections',
        category: 'Assignments & Coursework',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'assignment.edit',
        name: 'Edit Assignment Details',
        description: 'Update assignment deadlines, attachments, and instructions',
        category: 'Assignments & Coursework',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'assignment.delete',
        name: 'Delete Assignment',
        description: 'Remove assignments from student portals',
        category: 'Assignments & Coursework',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'assignment.grade',
        name: 'Grade Submissions',
        description: 'Review student submissions and assign marks/feedback',
        category: 'Assignments & Coursework',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Timetable Management',
    description: 'Permissions for configuring weekly period schedules and room allocation',
    permissions: [
      {
        id: 'timetable.view',
        name: 'View Class Timetable',
        description: 'View weekly lecture schedules, faculty slots, and rooms',
        category: 'Timetable Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'timetable.create',
        name: 'Add Period Assignment',
        description: 'Assign subjects, teachers, and rooms to timetable periods',
        category: 'Timetable Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'timetable.edit',
        name: 'Edit Timetable Entry',
        description: 'Modify existing lecture slots, faculty, or room assignments',
        category: 'Timetable Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'timetable.delete',
        name: 'Delete Period Assignment',
        description: 'Remove assigned periods from class schedule',
        category: 'Timetable Management',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Notice & Announcements',
    description: 'Control broadcasting announcements to specific courses, branches, or all users',
    permissions: [
      {
        id: 'notice.view',
        name: 'View Notice Board',
        description: 'Read college announcements, academic circulars, and notices',
        category: 'Notice & Announcements',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'notice.create',
        name: 'Create New Notice',
        description: 'Draft announcements targeted by course and branch',
        category: 'Notice & Announcements',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'notice.edit',
        name: 'Edit Notice Content',
        description: 'Modify notice details, target audience, and priority',
        category: 'Notice & Announcements',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'notice.delete',
        name: 'Delete Notice',
        description: 'Remove announcements from notice board',
        category: 'Notice & Announcements',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Reports & Analytics',
    description: 'Permissions for generating and exporting college management reports',
    permissions: [
      {
        id: 'reports.view',
        name: 'View Analytical Reports',
        description: 'Access student, attendance, exam, fee, class, and progress reports',
        category: 'Reports & Analytics',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'reports.export',
        name: 'Export Reports (PDF / CSV)',
        description: 'Download filtered analytical report datasets',
        category: 'Reports & Analytics',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Progress Tracking',
    description: 'Permissions for evaluating student academic progress and analytical trends',
    permissions: [
      {
        id: 'progress.view',
        name: 'View Progress Analytics',
        description: 'Access individual and class academic progress metrics',
        category: 'Progress Tracking',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'progress.export',
        name: 'Export Progress Reports',
        description: 'Download progress chart analytics and report cards',
        category: 'Progress Tracking',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
    ],
  },
  {
    category: 'System History',
    description: 'Permissions for inspecting historical activity logs and audit records',
    permissions: [
      {
        id: 'history.attendance.view',
        name: 'View Attendance Logs',
        description: 'Inspect past attendance modification logs',
        category: 'System History',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'history.fees.view',
        name: 'View Fee Audit Logs',
        description: 'Inspect financial fee collection history and receipt logs',
        category: 'System History',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'history.exam.view',
        name: 'View Exam Audit Logs',
        description: 'Inspect exam scheduling and mark entry edit logs',
        category: 'System History',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'history.suspension.view',
        name: 'View Suspension Logs',
        description: 'Inspect student and staff disciplinary suspension records',
        category: 'System History',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
    ],
  },
  {
    category: 'Communication',
    description: 'Permissions for messaging, chat, and circular notifications',
    permissions: [
      {
        id: 'communication.view',
        name: 'View Messages / Contacts',
        description: 'Access chat inbox and contact directories',
        category: 'Communication',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: true },
      },
      {
        id: 'communication.send',
        name: 'Send Messages',
        description: 'Dispatch direct and group messages to students/parents',
        category: 'Communication',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: false },
      },
    ],
  },
  {
    category: 'Training & Placement (TNP)',
    description: 'Permissions for campus placement drives, company registrations, applications, and offers',
    permissions: [
      {
        id: 'tnp.view',
        name: 'View Placement Drives',
        description: 'View active placement drives, company postings, and eligibility',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: true, parent: false },
      },
      {
        id: 'tnp.companies_manage',
        name: 'Manage Recruiting Companies',
        description: 'Register and update visiting company profiles',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'tnp.drives_manage',
        name: 'Manage Placement Drives',
        description: 'Schedule and publish recruitment drives',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'tnp.activities_manage',
        name: 'Manage TNP Activities',
        description: 'Create and run mock interviews, workshops, and resume clinics',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'tnp.applications_view',
        name: 'View Student Applications',
        description: 'Access student placement drive applications and resumes',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: true, student: false, parent: false },
      },
      {
        id: 'tnp.applications_manage',
        name: 'Manage Student Applications',
        description: 'Approve, reject, or update student drive applications',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'tnp.selection_process',
        name: 'Manage Selection Rounds',
        description: 'Log round outcomes (Online Test, Tech Interview, HR Interview)',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
      {
        id: 'tnp.placement_publish',
        name: 'Publish Placements & Offers',
        description: 'Publish final job offer records and package metrics',
        category: 'Training & Placement (TNP)',
        defaultChecked: { super_admin: true, admin: true, teacher: false, student: false, parent: false },
      },
    ],
  },
]

// Preset templates for quick role configuration
export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'preset_senior_teacher',
    name: 'Senior Teacher',
    description: 'Full class authority with marks entry, study material management, and student edit rights.',
    targetRole: 'teacher',
    permissions: {
      'students.view': true,
      'students.create': true,
      'students.edit': true,
      'students.export': true,
      'attendance.view': true,
      'attendance.create': true,
      'attendance.edit': true,
      'attendance.history': true,
      'attendance.export': true,
      'exam.view': true,
      'exam.create': true,
      'exam.edit': true,
      'exam.marks_view': true,
      'exam.marks_create': true,
      'exam.marks_edit': true,
      'exam.export': true,
      'study_material.view': true,
      'study_material.create': true,
      'study_material.edit': true,
      'study_material.delete': true,
      'assignment.view': true,
      'assignment.create': true,
      'assignment.edit': true,
      'assignment.delete': true,
      'assignment.grade': true,
      'timetable.view': true,
      'notice.view': true,
      'notice.create': true,
      'reports.view': true,
      'reports.export': true,
      'communication.view': true,
      'communication.send': true,
    },
  },
  {
    id: 'preset_junior_teacher',
    name: 'Junior Teacher',
    description: 'Basic teaching capabilities (attendance, coursework view, assignment grade, notice view).',
    targetRole: 'teacher',
    permissions: {
      'students.view': true,
      'students.create': false,
      'students.edit': false,
      'attendance.view': true,
      'attendance.create': true,
      'attendance.edit': false,
      'exam.view': true,
      'exam.marks_view': true,
      'exam.marks_create': true,
      'study_material.view': true,
      'study_material.create': true,
      'assignment.view': true,
      'assignment.create': true,
      'assignment.grade': true,
      'timetable.view': true,
      'notice.view': true,
      'reports.view': true,
      'communication.view': true,
      'communication.send': true,
    },
  },
  {
    id: 'preset_class_teacher',
    name: 'Class Teacher',
    description: 'Class-focused management including student creation, attendance, and coursework.',
    targetRole: 'teacher',
    permissions: {
      'students.view': true,
      'students.create': true,
      'students.edit': true,
      'students.export': true,
      'attendance.view': true,
      'attendance.create': true,
      'attendance.edit': true,
      'attendance.history': true,
      'attendance.export': true,
      'exam.view': true,
      'exam.marks_view': true,
      'exam.marks_create': true,
      'exam.marks_edit': true,
      'study_material.view': true,
      'study_material.create': true,
      'assignment.view': true,
      'assignment.create': true,
      'assignment.grade': true,
      'timetable.view': true,
      'notice.view': true,
      'notice.create': true,
      'reports.view': true,
      'communication.view': true,
      'communication.send': true,
    },
  },
  {
    id: 'preset_exam_coordinator',
    name: 'Exam Coordinator',
    description: 'Focused on exam scheduling, mark entry verification, and publishing results.',
    targetRole: 'teacher',
    permissions: {
      'students.view': true,
      'exam.view': true,
      'exam.create': true,
      'exam.edit': true,
      'exam.delete': true,
      'exam.schedule_manage': true,
      'exam.marks_view': true,
      'exam.marks_create': true,
      'exam.marks_edit': true,
      'exam.marks_delete': true,
      'exam.publish': true,
      'exam.result_view': true,
      'exam.export': true,
      'reports.view': true,
      'reports.export': true,
    },
  },
  {
    id: 'preset_tnp_coordinator',
    name: 'TNP Coordinator',
    description: 'Dedicated to placement drives, company registration, and application handling.',
    targetRole: 'teacher',
    permissions: {
      'students.view': true,
      'tnp.view': true,
      'tnp.companies_manage': true,
      'tnp.drives_manage': true,
      'tnp.activities_manage': true,
      'tnp.applications_view': true,
      'tnp.applications_manage': true,
      'tnp.selection_process': true,
      'tnp.placement_publish': true,
      'notice.view': true,
      'notice.create': true,
      'communication.view': true,
      'communication.send': true,
    },
  },
  {
    id: 'preset_accountant',
    name: 'Accountant',
    description: 'Financial ledger, fee collection, fee structure, and dues management.',
    targetRole: 'teacher',
    permissions: {
      'students.view': true,
      'fees.view': true,
      'fees.create': true,
      'fees.edit': true,
      'fees.collect': true,
      'fees.history': true,
      'fees.export': true,
      'reports.view': true,
      'reports.export': true,
      'history.fees.view': true,
    },
  },
]

// Helper for initial default permissions
function getInitialMatrix(): Record<UserRole, Record<string, boolean>> {
  const matrix: Record<UserRole, Record<string, boolean>> = {
    super_admin: {},
    admin: {},
    teacher: {},
    student: {},
    parent: {},
  }

  PERMISSION_GROUPS.forEach((group) => {
    group.permissions.forEach((perm) => {
      matrix.super_admin[perm.id] = perm.defaultChecked.super_admin
      matrix.admin[perm.id] = perm.defaultChecked.admin
      matrix.teacher[perm.id] = perm.defaultChecked.teacher
      matrix.student[perm.id] = perm.defaultChecked.student
      matrix.parent[perm.id] = perm.defaultChecked.parent
    })
  })

  return matrix
}

const listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach((l) => l())
}

let roleMatrixState = getInitialMatrix()

// In-memory cache for loaded per-teacher permissions: teacherKey -> Record<permissionId, boolean>
const teacherPermissionsCache = new Map<string, Record<string, boolean>>()

export const permissionStore = {
  getMatrix: (): Record<UserRole, Record<string, boolean>> => roleMatrixState,

  getRolePermissions: (role: UserRole): Record<string, boolean> => {
    if (role === 'super_admin' || role === 'admin') {
      const all: Record<string, boolean> = {}
      PERMISSION_GROUPS.forEach((g) => g.permissions.forEach((p) => (all[p.id] = true)))
      return all
    }
    return roleMatrixState[role] || getInitialMatrix()[role] || {}
  },

  /**
   * Synchronous check for permission (supports legacy aliases)
   */
  hasPermission: (
    role: UserRole | string | null | undefined,
    permissionId: string,
    teacherId?: string | null
  ): boolean => {
    if (!role) return false
    const r = role.toLowerCase().replace('-', '_') as UserRole
    if (r === 'super_admin' || r === 'admin') return true

    // Resolve aliased permission ID if present
    const resolvedId = PERMISSION_ALIASES[permissionId] || permissionId

    if (r === 'teacher' && teacherId) {
      const teacherCache = teacherPermissionsCache.get(teacherId)
      if (teacherCache && typeof teacherCache[resolvedId] === 'boolean') {
        return teacherCache[resolvedId]
      }
      if (teacherCache && typeof teacherCache[permissionId] === 'boolean') {
        return teacherCache[permissionId]
      }
    }

    const rolePerms = roleMatrixState[r] || getInitialMatrix()[r]
    if (!rolePerms) return false
    return Boolean(rolePerms[resolvedId] ?? rolePerms[permissionId])
  },

  /**
   * Sets cached permissions for a teacher in memory
   */
  setTeacherCache: (teacherId: string, permissions: Record<string, boolean>) => {
    teacherPermissionsCache.set(teacherId, permissions)
    notifyListeners()
  },

  /**
   * Fetch per-teacher permission overrides directly from Supabase
   */
  fetchTeacherPermissionsFromSupabase: async (
    collegeId: string,
    teacherId: string
  ): Promise<Record<string, boolean>> => {
    // Start with default teacher baseline
    const baseDefaults: Record<string, boolean> = {}
    PERMISSION_GROUPS.forEach((g) =>
      g.permissions.forEach((p) => {
        baseDefaults[p.id] = p.defaultChecked.teacher
      })
    )

    if (!isSupabaseConfigured || !collegeId || !teacherId) {
      teacherPermissionsCache.set(teacherId, baseDefaults)
      return baseDefaults
    }

    try {
      const { data, error } = await supabase
        .from('permission_overrides')
        .select('*')
        .eq('college_id', collegeId)
        .eq('teacher_id', teacherId)

      if (error) {
        console.error('Failed to fetch teacher permission overrides from Supabase:', error)
        teacherPermissionsCache.set(teacherId, baseDefaults)
        return baseDefaults
      }

      const merged: Record<string, boolean> = { ...baseDefaults }

      if (data && Array.isArray(data)) {
        data.forEach((row: { module: string; action: string; allowed: boolean }) => {
          PERMISSION_GROUPS.forEach((g) => {
            g.permissions.forEach((p) => {
              const { module, action } = splitPermissionId(p.id)
              if (module === row.module && action === row.action) {
                merged[p.id] = Boolean(row.allowed)
              }
            })
          })
        })
      }

      teacherPermissionsCache.set(teacherId, merged)
      notifyListeners()
      return merged
    } catch (err) {
      console.error('Error fetching teacher permissions:', err)
      teacherPermissionsCache.set(teacherId, baseDefaults)
      return baseDefaults
    }
  },

  /**
   * Save per-teacher permission overrides directly to Supabase
   */
  saveTeacherPermissionsToSupabase: async (
    collegeId: string,
    teacherId: string,
    permissions: Record<string, boolean>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!collegeId || !teacherId) {
      return { success: false, error: 'College ID and Teacher ID are required.' }
    }

    const rowsToUpsert: Array<{
      id: string
      college_id: string
      teacher_id: string
      module: string
      action: string
      allowed: boolean
    }> = []

    PERMISSION_GROUPS.forEach((g) => {
      g.permissions.forEach((p) => {
        const { module, action } = splitPermissionId(p.id)
        const isAllowed = Boolean(permissions[p.id])
        const rowId = `perm_ov_${collegeId}_${teacherId}_${module}_${action}`
        rowsToUpsert.push({
          id: rowId,
          college_id: collegeId,
          teacher_id: teacherId,
          module,
          action,
          allowed: isAllowed,
        })
      })
    })

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('permission_overrides')
          .upsert(rowsToUpsert, { onConflict: 'college_id,teacher_id,module,action' })

        if (error) {
          console.error('Failed to save permission overrides to Supabase:', error)
          return { success: false, error: error.message }
        }
      } catch (err: any) {
        console.error('Exception saving permission overrides:', err)
        return { success: false, error: err?.message || 'Failed to save permissions to Supabase' }
      }
    }

    // Update in-memory cache and notify listeners
    teacherPermissionsCache.set(teacherId, permissions)
    notifyListeners()

    return { success: true }
  },

  saveRolePermissions: (role: UserRole, perms: Record<string, boolean>) => {
    if (role === 'super_admin') return
    roleMatrixState = {
      ...roleMatrixState,
      [role]: perms,
    }
    notifyListeners()
  },

  resetRoleDefaults: (role: UserRole) => {
    const initial = getInitialMatrix()[role]
    if (initial) {
      roleMatrixState = {
        ...roleMatrixState,
        [role]: { ...initial },
      }
      notifyListeners()
    }
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx >= 0) listeners.splice(idx, 1)
    }
  },
}

export function usePermissionStore() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const unsubscribe = permissionStore.subscribe(() => {
      setTick((prev) => prev + 1)
    })
    return unsubscribe
  }, [])

  return {
    matrix: permissionStore.getMatrix(),
    getRolePermissions: permissionStore.getRolePermissions,
    hasPermission: permissionStore.hasPermission,
    saveRolePermissions: permissionStore.saveRolePermissions,
    resetRoleDefaults: permissionStore.resetRoleDefaults,
    fetchTeacherPermissionsFromSupabase: permissionStore.fetchTeacherPermissionsFromSupabase,
    saveTeacherPermissionsToSupabase: permissionStore.saveTeacherPermissionsToSupabase,
    setTeacherCache: permissionStore.setTeacherCache,
  }
}
