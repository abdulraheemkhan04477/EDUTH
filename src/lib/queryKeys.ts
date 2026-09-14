/**
 * Centralized react-query key factory.
 * Every query/mutation uses keys from here for consistent invalidation.
 */
export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
    profile: ['auth', 'profile'] as const,
  },
  students: {
    all: ['students'] as const,
    list: (filters?: Record<string, unknown>) => ['students', 'list', filters] as const,
    detail: (id: string) => ['students', 'detail', id] as const,
  },
  teachers: {
    all: ['teachers'] as const,
    list: (filters?: Record<string, unknown>) => ['teachers', 'list', filters] as const,
    detail: (id: string) => ['teachers', 'detail', id] as const,
  },
  classes: {
    all: ['classes'] as const,
    list: () => ['classes', 'list'] as const,
    detail: (id: string) => ['classes', 'detail', id] as const,
    roster: (id: string) => ['classes', 'roster', id] as const,
  },
  subjects: {
    all: ['subjects'] as const,
    list: () => ['subjects', 'list'] as const,
    assignments: (classId: string) => ['subjects', 'assignments', classId] as const,
  },
  attendance: {
    all: ['attendance'] as const,
    byClassDate: (classId: string, date: string) => ['attendance', classId, date] as const,
    byStudent: (studentId: string) => ['attendance', 'student', studentId] as const,
  },
  fees: {
    all: ['fees'] as const,
    structure: (classId?: string) => ['fees', 'structure', classId] as const,
    payments: (filters?: Record<string, unknown>) => ['fees', 'payments', filters] as const,
    studentLedger: (studentId: string) => ['fees', 'ledger', studentId] as const,
    dashboard: () => ['fees', 'dashboard'] as const,
  },
  assignments: {
    all: ['assignments'] as const,
    list: (filters?: Record<string, unknown>) => ['assignments', 'list', filters] as const,
    detail: (id: string) => ['assignments', 'detail', id] as const,
    submissions: (assignmentId: string) => ['assignments', 'submissions', assignmentId] as const,
  },
  homework: {
    all: ['assignments'] as const,
    list: (filters?: Record<string, unknown>) => ['assignments', 'list', filters] as const,
    detail: (id: string) => ['assignments', 'detail', id] as const,
    submissions: (homeworkId: string) => ['assignments', 'submissions', homeworkId] as const,
  },
  timetable: {
    all: ['timetable'] as const,
    byClass: (classId: string) => ['timetable', classId] as const,
    periods: () => ['timetable', 'periods'] as const,
  },
  notices: {
    all: ['notices'] as const,
    list: (filters?: Record<string, unknown>) => ['notices', 'list', filters] as const,
  },
  communication: {
    conversations: () => ['communication', 'conversations'] as const,
    messages: (conversationId: string) => ['communication', 'messages', conversationId] as const,
  },
  exams: {
    all: ['exams'] as const,
    list: (filters?: Record<string, unknown>) => ['exams', 'list', filters] as const,
    detail: (id: string) => ['exams', 'detail', id] as const,
    results: (examId: string, classId: string) => ['exams', 'results', examId, classId] as const,
  },
  reports: {
    overview: () => ['reports', 'overview'] as const,
    attendance: () => ['reports', 'attendance'] as const,
    exams: () => ['reports', 'exams'] as const,
    finance: () => ['reports', 'finance'] as const,
  },
  studyMaterials: {
    all: ['study-materials'] as const,
    list: (filters?: Record<string, unknown>) => ['study-materials', 'list', filters] as const,
  },
  settings: {
    school: () => ['settings', 'school'] as const,
  },
  permissions: {
    byTeacher: (teacherId: string) => ['permissions', teacherId] as const,
  },
  dashboard: {
    admin: () => ['dashboard', 'admin'] as const,
    teacher: () => ['dashboard', 'teacher'] as const,
    student: () => ['dashboard', 'student'] as const,
    parent: (childId?: string) => ['dashboard', 'parent', childId] as const,
  },
} as const
