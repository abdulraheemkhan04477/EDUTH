import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryProvider } from './app/providers/QueryProvider'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { AuthProvider } from './app/providers/AuthProvider'
import { ToastProvider } from './components/ui/Toast'
import { RoleGuard } from './routes/RoleGuard'
import { AppLayout } from './layouts/AppLayout'

// Eagerly Loaded Core Auth & Dashboards
import { LoginPage } from './features/auth/LoginPage'
import { SuperAdminLoginPage } from './features/auth/SuperAdminLoginPage'
import { SuperAdminDashboard } from './features/super-admin/SuperAdminDashboard'
import { AdminDashboard } from './features/dashboard/AdminDashboard'
import { TeacherDashboard } from './features/dashboard/TeacherDashboard'
import { StudentDashboard } from './features/dashboard/StudentDashboard'
import { ParentDashboard } from './features/dashboard/ParentDashboard'

// Lazy-Loaded Secondary Feature Modules
const StudentsListPage = lazy(() => import('./features/students/StudentsListPage').then((m) => ({ default: m.StudentsListPage })))
const TeachersListPage = lazy(() => import('./features/teachers/TeachersListPage').then((m) => ({ default: m.TeachersListPage })))
const ClassesListPage = lazy(() => import('./features/classes/ClassesListPage').then((m) => ({ default: m.ClassesListPage })))
const AttendanceMarkingPage = lazy(() => import('./features/attendance/AttendanceMarkingPage').then((m) => ({ default: m.AttendanceMarkingPage })))
const FeesPage = lazy(() => import('./features/fees/FeesPage').then((m) => ({ default: m.FeesPage })))
const TeacherFeesPage = lazy(() => import('./features/fees/TeacherFeesPage').then((m) => ({ default: m.TeacherFeesPage })))
const AssignmentsListPage = lazy(() => import('./features/assignments/AssignmentsListPage').then((m) => ({ default: m.AssignmentsListPage })))
const TimetablePage = lazy(() => import('./features/timetable/TimetablePage').then((m) => ({ default: m.TimetablePage })))
const NoticeBoardPage = lazy(() => import('./features/notices/NoticeBoardPage').then((m) => ({ default: m.NoticeBoardPage })))
const CommunicationPage = lazy(() => import('./features/communication/CommunicationPage').then((m) => ({ default: m.CommunicationPage })))
const ReportsPage = lazy(() => import('./features/reports/ReportsPage').then((m) => ({ default: m.ReportsPage })))
const AIAssistantPage = lazy(() => import('./features/ai-assistant/AIAssistantPage').then((m) => ({ default: m.AIAssistantPage })))
const RolesPermissionsPage = lazy(() => import('./features/roles-permissions/RolesPermissionsPage').then((m) => ({ default: m.RolesPermissionsPage })))
const SubjectClassPage = lazy(() => import('./features/subjects/SubjectClassPage').then((m) => ({ default: m.SubjectClassPage })))
const ExamsPage = lazy(() => import('./features/exams/ExamsPage').then((m) => ({ default: m.ExamsPage })))
const StudyMaterialsPage = lazy(() => import('./features/study-materials/StudyMaterialsPage').then((m) => ({ default: m.StudyMaterialsPage })))
const HistoryPage = lazy(() => import('./features/history/HistoryPage').then((m) => ({ default: m.HistoryPage })))
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })))

// Student & Parent Specific
const ReportCardPage = lazy(() => import('./features/report-card/ReportCardPage').then((m) => ({ default: m.ReportCardPage })))
const StudentProgressPage = lazy(() => import('./features/progress/StudentProgressPage').then((m) => ({ default: m.StudentProgressPage })))

// TNP Module
const AdminTnpPage = lazy(() => import('./features/tnp/AdminTnpPage').then((m) => ({ default: m.AdminTnpPage })))
const TeacherTnpPage = lazy(() => import('./features/tnp/TeacherTnpPage').then((m) => ({ default: m.TeacherTnpPage })))
const StudentTnpPage = lazy(() => import('./features/tnp/StudentTnpPage').then((m) => ({ default: m.StudentTnpPage })))

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<div className="p-6 text-sm text-ink-400">Loading module...</div>}>
                <Routes>
                  {/* Public Auth Route */}
                  <Route path="/login" element={<LoginPage />} />

                  {/* Dedicated Super Admin Entry Route */}
                  <Route path="/veneyd07744" element={<SuperAdminLoginPage />} />

                  {/* Super Admin Protected Route */}
                  <Route
                    path="/super-admin/dashboard"
                    element={
                      <RoleGuard allow={['super_admin']}>
                        <SuperAdminDashboard />
                      </RoleGuard>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin"
                    element={
                      <RoleGuard allow={['admin']}>
                        <AppLayout />
                      </RoleGuard>
                    }
                  >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="attendance" element={<AttendanceMarkingPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="students" element={<StudentsListPage />} />
                    <Route path="teachers" element={<TeachersListPage />} />
                    <Route path="classes" element={<ClassesListPage />} />
                    <Route path="assignments" element={<AssignmentsListPage />} />
                    <Route path="homework" element={<Navigate to="/admin/assignments" replace />} />
                    <Route path="fees" element={<FeesPage />} />
                    <Route path="tnp" element={<AdminTnpPage />} />
                    <Route path="exams" element={<ExamsPage />} />
                    <Route path="notices" element={<NoticeBoardPage />} />
                    <Route path="communication" element={<CommunicationPage />} />
                    <Route path="report-card" element={<ReportCardPage />} />
                    <Route path="progress" element={<StudentProgressPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="ai-assistant" element={<AIAssistantPage />} />
                    <Route path="roles" element={<RolesPermissionsPage />} />
                    <Route path="subjects" element={<SubjectClassPage />} />
                    <Route path="timetable" element={<TimetablePage />} />
                    <Route path="study-materials" element={<StudyMaterialsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  </Route>

                  {/* Teacher Protected Routes */}
                  <Route
                    path="/teacher"
                    element={
                      <RoleGuard allow={['teacher']}>
                        <AppLayout />
                      </RoleGuard>
                    }
                  >
                    <Route path="dashboard" element={<TeacherDashboard />} />
                    <Route path="attendance" element={<RoleGuard allow={['teacher']} requirePermission="attendance.view"><AttendanceMarkingPage /></RoleGuard>} />
                    <Route path="students" element={<RoleGuard allow={['teacher']} requirePermission="students.view"><StudentsListPage /></RoleGuard>} />
                    <Route path="classes" element={<ClassesListPage />} />
                    <Route path="assignments" element={<RoleGuard allow={['teacher']} requirePermission="assignments.view"><AssignmentsListPage /></RoleGuard>} />
                    <Route path="homework" element={<Navigate to="/teacher/assignments" replace />} />
                    <Route path="exams" element={<RoleGuard allow={['teacher']} requirePermission="exams.view"><ExamsPage /></RoleGuard>} />
                    <Route path="timetable" element={<RoleGuard allow={['teacher']} requirePermission="timetable.view"><TimetablePage /></RoleGuard>} />
                    <Route path="fees" element={<RoleGuard allow={['teacher']} requirePermission="fees.view"><TeacherFeesPage /></RoleGuard>} />
                    <Route path="tnp" element={<RoleGuard allow={['teacher']} requirePermission="tnp.view"><TeacherTnpPage /></RoleGuard>} />
                    <Route path="notices" element={<RoleGuard allow={['teacher']} requirePermission="notices.view"><NoticeBoardPage /></RoleGuard>} />
                    <Route path="progress" element={<StudentProgressPage />} />
                    <Route path="communication" element={<CommunicationPage />} />
                    <Route path="ai-assistant" element={<AIAssistantPage />} />
                    <Route path="study-materials" element={<RoleGuard allow={['teacher']} requirePermission="materials.view"><StudyMaterialsPage /></RoleGuard>} />
                    <Route path="reports" element={<RoleGuard allow={['teacher']} requirePermission="reports.view"><ReportsPage /></RoleGuard>} />
                    <Route index element={<Navigate to="/teacher/dashboard" replace />} />
                  </Route>

                  {/* Student Protected Routes */}
                  <Route
                    path="/student"
                    element={
                      <RoleGuard allow={['student']}>
                        <AppLayout />
                      </RoleGuard>
                    }
                  >
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="attendance" element={<AttendanceMarkingPage />} />
                    <Route path="assignments" element={<AssignmentsListPage />} />
                    <Route path="timetable" element={<TimetablePage />} />
                    <Route path="homework" element={<Navigate to="/student/assignments" replace />} />
                    <Route path="exams" element={<ExamsPage />} />
                    <Route path="tnp" element={<StudentTnpPage />} />
                    <Route path="notices" element={<NoticeBoardPage />} />
                    <Route path="communication" element={<CommunicationPage />} />
                    <Route path="report-card" element={<ReportCardPage />} />
                    <Route path="fees" element={<FeesPage />} />
                    <Route path="progress" element={<StudentProgressPage />} />
                    <Route path="ai-assistant" element={<AIAssistantPage />} />
                    <Route path="study-materials" element={<StudyMaterialsPage />} />
                    <Route index element={<Navigate to="/student/dashboard" replace />} />
                  </Route>

                  {/* Parent Protected Routes */}
                  <Route
                    path="/parent"
                    element={
                      <RoleGuard allow={['parent']}>
                        <AppLayout />
                      </RoleGuard>
                    }
                  >
                    <Route path="dashboard" element={<ParentDashboard />} />
                    <Route path="attendance" element={<AttendanceMarkingPage />} />
                    <Route path="fees" element={<FeesPage />} />
                    <Route path="results" element={<ReportCardPage />} />
                    <Route path="exams" element={<ExamsPage />} />
                    <Route path="notices" element={<NoticeBoardPage />} />
                    <Route index element={<Navigate to="/parent/dashboard" replace />} />
                  </Route>

                  {/* Default Fallback */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
