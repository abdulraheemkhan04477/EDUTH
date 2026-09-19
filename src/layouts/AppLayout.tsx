import { useState, useMemo } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../app/providers/AuthProvider'
import { useTheme } from '../app/providers/ThemeProvider'
import { AvatarInitials, SearchInput } from '../components/ui'
import {
  LayoutDashboard, Users, GraduationCap, School, CalendarCheck, IndianRupee,
  BookOpen, Clock, Megaphone, MessageSquare, Sparkles, Shield,
  BookA, FileText, FolderOpen, Settings, LogOut, Menu, Bell, Sun, Moon,
  ClipboardList, Award, TrendingUp, BarChart3, History, Briefcase,
} from 'lucide-react'
import type { UserRole } from '../types/domain'
import { useAcademicStore } from '../lib/academicStore'

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
  permissionKey?: string
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
  { label: 'Student', path: '/admin/students', icon: Users },
  { label: 'Teacher', path: '/admin/teachers', icon: GraduationCap },
  { label: 'Classes', path: '/admin/classes', icon: School },
  { label: 'Assignments', path: '/admin/assignments', icon: BookOpen },
  { label: 'Fees', path: '/admin/fees', icon: IndianRupee },
  { label: 'Training & Placement', path: '/admin/tnp', icon: Briefcase },
  { label: 'Test & Exam', path: '/admin/exams', icon: FileText },
  { label: 'Timetable', path: '/admin/timetable', icon: Clock },
  { label: 'Notice', path: '/admin/notices', icon: Megaphone },
  { label: 'Communication', path: '/admin/communication', icon: MessageSquare },

  { label: 'Progress', path: '/admin/progress', icon: TrendingUp },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'History', path: '/admin/history', icon: History },
  { label: 'AI Assistant', path: '/admin/ai-assistant', icon: Sparkles },
  { label: 'Roles & Permissions', path: '/admin/roles', icon: Shield },
  { label: 'Academic Structure', path: '/admin/subjects', icon: BookA },
  { label: 'Study Materials', path: '/admin/study-materials', icon: FolderOpen },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
]

const teacherNav: NavItem[] = [
  { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', path: '/teacher/attendance', icon: CalendarCheck, permissionKey: 'attendance.view' },
  { label: 'Students', path: '/teacher/students', icon: Users, permissionKey: 'students.view' },
  { label: 'Assignments', path: '/teacher/assignments', icon: BookOpen, permissionKey: 'assignments.view' },
  { label: 'Exam & Result', path: '/teacher/exams', icon: FileText, permissionKey: 'exams.view' },
  { label: 'Time Table', path: '/teacher/timetable', icon: Clock, permissionKey: 'timetable.view' },
  { label: 'Fees', path: '/teacher/fees', icon: IndianRupee, permissionKey: 'fees.view' },
  { label: 'Training & Placement', path: '/teacher/tnp', icon: Briefcase, permissionKey: 'tnp.view' },
  { label: 'Notices', path: '/teacher/notices', icon: Megaphone, permissionKey: 'notices.view' },
  { label: 'Study Materials', path: '/teacher/study-materials', icon: FolderOpen, permissionKey: 'materials.view' },
  { label: 'Reports', path: '/teacher/reports', icon: BarChart3, permissionKey: 'reports.view' },
  { label: 'Communication', path: '/teacher/communication', icon: MessageSquare },
  { label: 'AI Assistant', path: '/teacher/ai-assistant', icon: Sparkles },
]

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
  { label: 'Assignments', path: '/student/assignments', icon: BookOpen },
  { label: 'Time Table', path: '/student/timetable', icon: Clock },
  { label: 'Tests & Exams', path: '/student/exams', icon: FileText },
  { label: 'Training & Placement', path: '/student/tnp', icon: Briefcase },
  { label: 'Notices', path: '/student/notices', icon: Megaphone },
  { label: 'Communication', path: '/student/communication', icon: MessageSquare },
  { label: 'Report Card', path: '/student/report-card', icon: ClipboardList },
  { label: 'Fees', path: '/student/fees', icon: IndianRupee },
  { label: 'Progress', path: '/student/progress', icon: TrendingUp },
  { label: 'Study Materials', path: '/student/study-materials', icon: FolderOpen },
]

const parentNav: NavItem[] = [
  { label: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', path: '/parent/attendance', icon: CalendarCheck },
  { label: 'Fees', path: '/parent/fees', icon: IndianRupee },
  { label: 'Results', path: '/parent/results', icon: Award },
  { label: 'Notices', path: '/parent/notices', icon: Megaphone },
]

const navByRole: Record<UserRole, NavItem[]> = {
  super_admin: adminNav,
  admin: adminNav,
  teacher: teacherNav,
  student: studentNav,
  parent: parentNav,
}

export function AppLayout() {
  const { user, signOut, role, hasPermission } = useAuth()
  const { students } = useAcademicStore()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    const isSuper = role === 'super_admin'
    await signOut()
    navigate(isSuper ? '/veneyd07744' : '/login', { replace: true })
  }

  const baseNavItems = navByRole[role ?? 'admin']
  const navItems = useMemo(() => {
    if (role === 'teacher') {
      return baseNavItems.filter((item) => !item.permissionKey || hasPermission(item.permissionKey))
    }
    return baseNavItems
  }, [role, baseNavItems, hasPermission])
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  // Linked Child for Parent role
  const linkedChild = useMemo(() => {
    if (role !== 'parent') return null
    const cId = user?.child_student_id || user?.student_id
    const userEmailLower = user?.email?.toLowerCase().trim()
    const found = students.find(
      (s) =>
        (cId &&
          (s.id === cId ||
            s.student_id === cId ||
            s.roll_no === cId ||
            `STU-${s.roll_no}` === cId ||
            cId.replace(/^STU-/i, '') === s.roll_no)) ||
        (userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower) ||
        (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower)
    )
    if (found) return found
    const rollNo = cId ? cId.replace(/^STU-/i, '') : ''
    const isMBA = rollNo.includes('MB') || (cId && cId.includes('MB'))
    return {
      id: cId || 'child_001',
      student_id: cId || 'STU-001',
      roll_no: rollNo || 'MB24FIN006',
      name: user?.name ? (user.name.toLowerCase().includes('parent') ? user.name.replace(/parent/i, 'Child') : `${user.name}'s Child`) : 'Child Student',
      course: isMBA ? 'MBA' : 'B.Tech',
      branch: isMBA ? 'Finance' : 'ECE',
      year: '1st Year',
      semester: 'Semester 1',
      section: 'Section A',
      class_name: isMBA ? 'MBA Finance - 1st Year - Section A' : 'B.Tech ECE - 1st Year - Section A',
    }
  }, [role, user, students])

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-surface border-r border-border flex flex-col transition-all duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'}`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border/80 flex items-center gap-3 h-16 shrink-0">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-2 rounded-[var(--radius-btn)] shrink-0 shadow-sm shadow-indigo-500/20">
            <School className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-display font-bold text-ink-900 tracking-tight truncate">Eduth<span className="text-indigo-600">Flow</span></h1>
              <p className="text-[10px] text-ink-400 font-medium uppercase tracking-wider -mt-0.5">College Management</p>
            </div>
          )}
        </div>

        {/* Linked Student Info for Parent Panel (Above Dashboard) */}
        {role === 'parent' && !collapsed && linkedChild && (
          <div className="px-3.5 py-3 border-b border-border/80 bg-slate-50/50 shrink-0">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Linked Student</p>
              <p className="text-sm font-bold text-ink-900 truncate">{linkedChild.name}</p>
              <div className="text-xs text-ink-600 space-y-0.5 font-medium">
                <p><span className="text-ink-400 font-normal">Course:</span> {linkedChild.course}</p>
                <p><span className="text-ink-400 font-normal">Branch:</span> {linkedChild.branch}</p>
                <p><span className="text-ink-400 font-normal">Semester:</span> {linkedChild.semester}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-btn)] text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-brand-100/90 text-brand-600 font-semibold border-l-4 border-brand-600 shadow-2xs'
                    : 'text-ink-600 hover:bg-slate-100/80 hover:text-ink-900'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border/80 shrink-0 bg-slate-50/50">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <AvatarInitials name={user?.name ?? 'User'} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">{user?.name}</p>
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded border border-indigo-200/60">
                  {role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 w-full flex justify-center transition-colors cursor-pointer"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-surface border-b border-border flex items-center gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6 shrink-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded hover:bg-canvas text-ink-600 cursor-pointer shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Collapse button (desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-2 rounded hover:bg-canvas text-ink-400 cursor-pointer shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <SearchInput
            placeholder="Search across EduFlow..."
            className="w-32 sm:w-auto flex-1 max-w-[180px] sm:max-w-md"
          />

          <div className="flex-1" />

          {/* Notification bell */}
          <button className="relative p-2 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer shrink-0" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger-600 rounded-full" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-600/20 shrink-0"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-ink-600" />
            )}
          </button>

          {/* User dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <AvatarInitials name={user?.name ?? 'User'} />
            <span className="hidden md:block text-sm font-medium text-ink-900">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
