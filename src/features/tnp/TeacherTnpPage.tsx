import { useState, useMemo } from 'react'
import {
  Tabs,
  Select,
  SearchInput,
  AvatarInitials,
  Button,
  Modal,
  FormField,
  Input,
} from '../../components/ui'
import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, getTeacherForUser, isBranchMatch } from '../../lib/academicStore'
import {
  useTnpStore,
  type TnpActivity,
  type ActivityType,
} from '../../lib/tnpStore'
import {
  Briefcase,
  Users,
  Award,
  Eye,
  Pencil,
} from 'lucide-react'
import { useToast } from '../../components/ui/Toast'

export function TeacherTnpPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { teachers, classes, students } = useAcademicStore()
  const {
    drives,
    applications,
    placements,
    activities,
    saveActivity,
  } = useTnpStore()

  // 1. Resolve current teacher profile & assigned classes
  const currentTeacher = useMemo(() => {
    return getTeacherForUser(user, teachers, classes)
  }, [user, teachers, classes])

  const assignedClasses = useMemo(() => {
    if (!currentTeacher) return []
    const userEmailLower = currentTeacher.email?.toLowerCase().trim()
    return classes.filter((c) => {
      if (!c) return false
      const cTeacherId = c.teacher_id?.toLowerCase().trim()
      const isTeacherMatch =
        (c.teacher_id && c.teacher_id === currentTeacher.teacher_id) ||
        (userEmailLower && cTeacherId === userEmailLower) ||
        (currentTeacher.name && c.teacher_name?.includes(currentTeacher.name))

      if (isTeacherMatch) return true

      const cName = c.name || ''
      const cCourse = (c.course || '').toLowerCase()
      const cBranch = (c.branch || '').toLowerCase()
      const cYear = (c.year || '').toLowerCase()

      return (currentTeacher.assigned_classes || []).some((ac) => {
        if (!ac) return false
        const normAc = ac.toLowerCase()
        if (cName && (ac.includes(cName) || cName.includes(ac))) return true
        if (cCourse && cBranch && cYear) {
          return normAc.includes(cCourse) && normAc.includes(cBranch) && normAc.includes(cYear)
        }
        return false
      })
    })
  }, [classes, currentTeacher])

  // Extract allowed courses, branches, and years strictly from teacher's assigned classes
  const assignedCourses = useMemo(() => {
    const set = new Set(assignedClasses.map((c) => c.course).filter(Boolean))
    return Array.from(set)
  }, [assignedClasses])

  const assignedBranches = useMemo(() => {
    const set = new Set(assignedClasses.map((c) => c.branch).filter((b) => b && !b.toLowerCase().includes('common')))
    return Array.from(set)
  }, [assignedClasses])

  const assignedYears = useMemo(() => {
    const set = new Set(assignedClasses.map((c) => c.year).filter(Boolean))
    return Array.from(set)
  }, [assignedClasses])

  // Navigation Sub-Tabs strictly set to PRD specification: Dashboard, Drives, Activities, Student Status
  const [activeTab, setActiveTab] = useState('dashboard')

  // Activity sub-type filter
  const [activityTypeFilter, setActivityTypeFilter] = useState<'All' | ActivityType>('All')

  // Search & Filter States (Restricted to assigned classes)
  const [courseFilter, setCourseFilter] = useState('All')
  const [branchFilter, setBranchFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [search, setSearch] = useState('')

  // View / Edit Activity State
  const [viewingActivity, setViewingActivity] = useState<TnpActivity | null>(null)
  const [editingActivity, setEditingActivity] = useState<TnpActivity | null>(null)

  const [actTitle, setActTitle] = useState('')
  const [actSpeakerTrainer, setActSpeakerTrainer] = useState('')
  const [actStartDate, setActStartDate] = useState('')
  const [actVenue, setActVenue] = useState('')
  const [actDesc, setActDesc] = useState('')

  const openEditActivity = (act: TnpActivity) => {
    setEditingActivity(act)
    setActTitle(act.title)
    setActSpeakerTrainer(act.speaker_trainer_organizer || '')
    setActStartDate(act.start_date || '')
    setActVenue(act.venue || '')
    setActDesc(act.description || '')
  }

  const handleSaveActivity = async () => {
    if (!editingActivity || !actTitle.trim()) return
    await saveActivity({
      ...editingActivity,
      title: actTitle.trim(),
      speaker_trainer_organizer: actSpeakerTrainer.trim(),
      start_date: actStartDate,
      venue: actVenue.trim(),
      description: actDesc.trim(),
    })
    setEditingActivity(null)
    toast({ type: 'success', title: 'Success', description: 'Activity updated successfully' })
  }

  // Filter assigned students list
  const assignedStudents = useMemo(() => {
    if (assignedClasses.length === 0) return students
    return students.filter((s) => {
      return assignedClasses.some(
        (c) => c.course === s.course && isBranchMatch(c.branch, s.branch) && c.year === s.year
      )
    })
  }, [students, assignedClasses])

  const assignedStudentIds = useMemo(() => {
    return new Set(assignedStudents.map((s) => s.id))
  }, [assignedStudents])

  // Filtered Lists for Teacher View (Scoped strictly to assigned classes)
  const teacherDrives = useMemo(() => {
    return drives.filter((d) => {
      const isTargeted =
        assignedCourses.length === 0 ||
        d.target_courses?.some((tc) => assignedCourses.includes(tc)) ||
        d.target_courses?.includes('All')

      if (!isTargeted) return false

      const matchCourse = courseFilter === 'All' || d.target_courses?.includes(courseFilter)
      const matchBranch = branchFilter === 'All' || d.target_branches?.some((b) => isBranchMatch(b, branchFilter))
      const matchYear = yearFilter === 'All' || d.target_years?.includes(yearFilter)
      const matchSearch =
        !search ||
        d.drive_name.toLowerCase().includes(search.toLowerCase()) ||
        d.company_name.toLowerCase().includes(search.toLowerCase())

      return matchCourse && matchBranch && matchYear && matchSearch
    })
  }, [drives, assignedCourses, courseFilter, branchFilter, yearFilter, search])

  const teacherActivities = useMemo(() => {
    return activities.filter((a) => {
      const isTargeted =
        assignedCourses.length === 0 ||
        assignedCourses.includes(a.course || 'All') ||
        a.course === 'All'

      if (!isTargeted) return false

      const matchType = activityTypeFilter === 'All' || a.activity_type === activityTypeFilter
      const matchCourse = courseFilter === 'All' || a.course === courseFilter || a.course === 'All'
      const matchBranch = branchFilter === 'All' || isBranchMatch(a.branch, branchFilter) || a.branch === 'All'
      const matchYear = yearFilter === 'All' || a.year === yearFilter || a.year === 'All'
      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.speaker_trainer_organizer || '').toLowerCase().includes(search.toLowerCase())

      return matchType && matchCourse && matchBranch && matchYear && matchSearch
    })
  }, [activities, assignedCourses, activityTypeFilter, courseFilter, branchFilter, yearFilter, search])

  const teacherApplications = useMemo(() => {
    return applications.filter((a) => {
      const isAssignedStudent = assignedStudentIds.has(a.student_id)
      if (!isAssignedStudent && assignedStudentIds.size > 0) return false

      const matchCourse = courseFilter === 'All' || a.course === courseFilter
      const matchBranch = branchFilter === 'All' || isBranchMatch(a.branch, branchFilter)
      const matchYear = yearFilter === 'All' || a.year === yearFilter
      const matchSearch =
        !search ||
        a.student_name.toLowerCase().includes(search.toLowerCase()) ||
        a.roll_no.toLowerCase().includes(search.toLowerCase())

      return matchCourse && matchBranch && matchYear && matchSearch
    })
  }, [applications, assignedStudentIds, courseFilter, branchFilter, yearFilter, search])

  const teacherPlacements = useMemo(() => {
    return placements.filter((p) => {
      const isAssignedStudent = assignedStudentIds.has(p.student_id)
      if (!isAssignedStudent && assignedStudentIds.size > 0) return false

      const matchCourse = courseFilter === 'All' || p.course === courseFilter
      const matchBranch = branchFilter === 'All' || isBranchMatch(p.branch, branchFilter)
      const matchYear = yearFilter === 'All' || p.year === yearFilter
      const matchSearch =
        !search ||
        p.student_name.toLowerCase().includes(search.toLowerCase()) ||
        p.company_name.toLowerCase().includes(search.toLowerCase())

      return matchCourse && matchBranch && matchYear && matchSearch
    })
  }, [placements, assignedStudentIds, courseFilter, branchFilter, yearFilter, search])

  const topTabs = [
    { id: 'dashboard', label: 'TNP Dashboard' },
    { id: 'drives', label: 'Placement Drives' },
    { id: 'activities', label: 'Activities' },
    { id: 'student-status', label: 'Student TNP Status' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-ink-900 tracking-tight">
          Training & Placement — Faculty Panel
        </h1>
        <p className="text-xs sm:text-sm text-ink-500 mt-0.5 sm:mt-1">
          Controlled view access to career placement drives, activities, and assigned class student statuses.
        </p>
      </div>

      {/* Top Tab Bar */}
      <div className="w-full max-w-full min-w-0">
        <Tabs tabs={topTabs} activeId={activeTab} onChange={setActiveTab} />
      </div>

      {/* Search & Filter Bar (Matching Teachers / Classes / Fees UI) */}
      {['drives', 'activities', 'student-status'].includes(activeTab) && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-3 sm:p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3 min-w-0 max-w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0 w-full sm:w-auto">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or activity..."
              className="w-full sm:w-64 lg:w-72"
            />
            <Select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              options={['All', ...assignedCourses].map((c) => ({ label: c === 'All' ? 'All Courses' : c, value: c }))}
              className="w-full sm:w-40 md:w-44"
            />
            <Select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              options={['All', ...assignedBranches].map((b) => ({ label: b === 'All' ? 'All Branches' : b, value: b }))}
              className="w-full sm:w-44 md:w-48"
            />
            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              options={['All', ...assignedYears].map((y) => ({ label: y === 'All' ? 'All Years' : y, value: y }))}
              className="w-full sm:w-36 md:w-40"
            />
          </div>
          {(search || courseFilter !== 'All' || branchFilter !== 'All' || yearFilter !== 'All') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setCourseFilter('All')
                setBranchFilter('All')
                setYearFilter('All')
              }}
              className="shrink-0"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* TAB 1: TNP DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 sm:p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">ASSIGNED CLASS STUDENTS</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-2">{assignedStudents.length}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 font-medium mt-3">Total Enrolled Students</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 sm:p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">TOTAL APPLICATIONS</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-2">{teacherApplications.length}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-blue-600 font-medium mt-3">Submitted by Assigned Students</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 sm:p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-ink-400">PLACED STUDENTS</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-emerald-600 mt-2">{teacherPlacements.length}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-3">Offers Received</p>
            </div>
          </div>

          {/* Relevant Placement Drives */}
          <div className="bg-surface p-5 rounded-[var(--radius-card)] border border-border space-y-4">
            <h3 className="font-bold text-ink-900 text-base border-b border-border pb-3">Active Placement Drives for Your Classes</h3>
            {teacherDrives.length === 0 ? (
              <p className="text-sm text-ink-400 py-4 text-center">No active drives targeted to your assigned classes.</p>
            ) : (
              <div className="space-y-3">
                {teacherDrives.map((d) => (
                  <div key={d.id} className="p-3 bg-canvas rounded-lg border border-border/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-ink-900">{d.drive_name}</h4>
                      <p className="text-xs text-brand-600 font-medium">{d.company_name} • {d.job_role}</p>
                      <p className="text-[11px] text-ink-400">Target: {d.target_courses?.join(', ')} ({d.target_branches?.join(', ')})</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {d.salary_package}
                      </span>
                      <p className="text-[10px] text-ink-400 mt-1">Status: {d.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PLACEMENT DRIVES */}
      {activeTab === 'drives' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
          {teacherDrives.length === 0 ? (
            <p className="p-12 text-center text-ink-400 text-sm">No placement drives found for assigned class criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                  <tr>
                    <th className="p-3">Drive Name</th>
                    <th className="p-3">Company</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Package</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {teacherDrives.map((drive) => (
                    <tr key={drive.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 font-bold text-ink-900">{drive.drive_name}</td>
                      <td className="p-3 font-semibold text-brand-600">{drive.company_name}</td>
                      <td className="p-3 text-ink-700">{drive.job_role}</td>
                      <td className="p-3 text-xs text-ink-600">{drive.target_courses?.join(', ')} ({drive.target_branches?.join(', ')})</td>
                      <td className="p-3 font-bold text-emerald-600">{drive.salary_package}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {drive.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACTIVITIES (SINGLE COMBINED PANEL FOR TEACHER) */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-xs">
            <button
              onClick={() => setActivityTypeFilter('All')}
              className={`px-3 py-1.5 text-xs font-bold rounded-[var(--radius-btn)] transition-all cursor-pointer ${
                activityTypeFilter === 'All' ? 'bg-brand-600 text-white shadow-xs' : 'bg-canvas text-ink-700 hover:bg-slate-100'
              }`}
            >
              All Activities
            </button>
            <button
              onClick={() => setActivityTypeFilter('seminar')}
              className={`px-3 py-1.5 text-xs font-bold rounded-[var(--radius-btn)] transition-all cursor-pointer ${
                activityTypeFilter === 'seminar' ? 'bg-brand-600 text-white shadow-xs' : 'bg-canvas text-ink-700 hover:bg-slate-100'
              }`}
            >
              Seminar
            </button>
            <button
              onClick={() => setActivityTypeFilter('event')}
              className={`px-3 py-1.5 text-xs font-bold rounded-[var(--radius-btn)] transition-all cursor-pointer ${
                activityTypeFilter === 'event' ? 'bg-brand-600 text-white shadow-xs' : 'bg-canvas text-ink-700 hover:bg-slate-100'
              }`}
            >
              Event
            </button>
            <button
              onClick={() => setActivityTypeFilter('training')}
              className={`px-3 py-1.5 text-xs font-bold rounded-[var(--radius-btn)] transition-all cursor-pointer ${
                activityTypeFilter === 'training' ? 'bg-brand-600 text-white shadow-xs' : 'bg-canvas text-ink-700 hover:bg-slate-100'
              }`}
            >
              Training
            </button>
            <button
              onClick={() => setActivityTypeFilter('internship')}
              className={`px-3 py-1.5 text-xs font-bold rounded-[var(--radius-btn)] transition-all cursor-pointer ${
                activityTypeFilter === 'internship' ? 'bg-brand-600 text-white shadow-xs' : 'bg-canvas text-ink-700 hover:bg-slate-100'
              }`}
            >
              Internship
            </button>
          </div>

          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
            {teacherActivities.length === 0 ? (
              <p className="p-12 text-center text-ink-400 text-sm">No activities scheduled for your assigned classes.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                    <tr>
                      <th className="p-3">Activity Title & Type</th>
                      <th className="p-3">Facilitator / Organization</th>
                      <th className="p-3">Schedule & Venue</th>
                      <th className="p-3">Target Class</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {teacherActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-semibold text-ink-900">
                          <p className="font-bold">{act.title}</p>
                          <span className="inline-block uppercase text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 mt-0.5">
                            {act.activity_type}
                          </span>
                        </td>
                        <td className="p-3 text-ink-700 font-medium">
                          {act.speaker_trainer_organizer || 'TNP Facilitator'}
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          <p className="font-semibold">{act.start_date || 'Upcoming'}</p>
                          <p className="text-ink-400">{act.venue || 'Campus Venue'}</p>
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          {act.course} - {act.branch} ({act.year})
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewingActivity(act)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditActivity(act)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: STUDENT TNP STATUS */}
      {activeTab === 'student-status' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-ink-900 text-base">Assigned Class Student Career Status</h3>
            <span className="text-xs text-ink-500">Total Enrolled: {assignedStudents.length}</span>
          </div>

          {assignedStudents.length === 0 ? (
            <p className="p-12 text-center text-ink-400 text-sm">No students found for assigned class criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Drive Applications</th>
                    <th className="p-3">Placement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignedStudents.map((stu) => {
                    const stuApps = applications.filter((a) => a.student_id === stu.id)
                    const stuPlc = placements.find((p) => p.student_id === stu.id)

                    return (
                      <tr key={stu.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-bold text-ink-900">
                          <div className="flex items-center gap-2.5">
                            <AvatarInitials name={stu.name} size="sm" />
                            <span>{stu.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-ink-600 text-xs font-semibold">{stu.roll_no}</td>
                        <td className="p-3 text-xs text-ink-600">{stu.course} {stu.branch} ({stu.year})</td>
                        <td className="p-3 text-xs font-semibold text-blue-600">
                          {stuApps.length} Drives Applied
                        </td>
                        <td className="p-3">
                          {stuPlc ? (
                            <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Placed at {stuPlc.company_name} ({stuPlc.package_amount})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-600">
                              Seeking Opportunity
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW ACTIVITY MODAL */}
      <Modal isOpen={!!viewingActivity} onClose={() => setViewingActivity(null)} title="Activity Details">
        {viewingActivity && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-ink-900">{viewingActivity.title}</h3>
              <span className="uppercase text-xs font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {viewingActivity.activity_type}
              </span>
            </div>
            <div className="text-sm space-y-2 text-ink-700">
              <p><strong className="text-ink-900">Resource Person:</strong> {viewingActivity.speaker_trainer_organizer || 'TNP Facilitator'}</p>
              <p><strong className="text-ink-900">Schedule:</strong> {viewingActivity.start_date || 'Upcoming'}</p>
              <p><strong className="text-ink-900">Venue:</strong> {viewingActivity.venue || 'Campus Venue'}</p>
              <p><strong className="text-ink-900">Target Class:</strong> {viewingActivity.course} - {viewingActivity.branch} ({viewingActivity.year})</p>
              {viewingActivity.description && (
                <div className="p-3 bg-canvas rounded-lg border border-border mt-2">
                  <p className="text-xs text-ink-600">{viewingActivity.description}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={() => setViewingActivity(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT ACTIVITY MODAL */}
      <Modal isOpen={!!editingActivity} onClose={() => setEditingActivity(null)} title="Edit Activity">
        {editingActivity && (
          <div className="space-y-4">
            <FormField label="Title">
              <Input value={actTitle} onChange={(e) => setActTitle(e.target.value)} />
            </FormField>
            <FormField label="Resource Person / Trainer">
              <Input value={actSpeakerTrainer} onChange={(e) => setActSpeakerTrainer(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start Date">
                <Input type="date" value={actStartDate} onChange={(e) => setActStartDate(e.target.value)} />
              </FormField>
              <FormField label="Venue">
                <Input value={actVenue} onChange={(e) => setActVenue(e.target.value)} />
              </FormField>
            </div>
            <FormField label="Description">
              <Input value={actDesc} onChange={(e) => setActDesc(e.target.value)} />
            </FormField>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setEditingActivity(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveActivity}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
