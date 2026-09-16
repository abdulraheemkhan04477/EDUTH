import { useState, useMemo } from 'react'
import {
  Tabs,
  Button,
  AvatarInitials,
  Modal,
} from '../../components/ui'
import { useAuth } from '../../app/providers/AuthProvider'
import { useAcademicStore, isBranchMatch } from '../../lib/academicStore'
import {
  useTnpStore,
  type PlacementDrive,
  type TnpActivity,
  type ActivityType,
} from '../../lib/tnpStore'
import {
  Briefcase,
  Award,
  CheckCircle2,
  GraduationCap,
  Eye,
} from 'lucide-react'
import { useToast } from '../../components/ui/Toast'

export function StudentTnpPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { students } = useAcademicStore()
  const {
    drives,
    applications,
    placements,
    activities,
    applyForDrive,
  } = useTnpStore()

  // Resolve logged-in student profile safely
  const currentStudent = useMemo(() => {
    const userEmailLower = user?.email?.toLowerCase().trim()
    const userIdLower = (user as any)?.id?.toLowerCase() || (user as any)?.student_id?.toLowerCase()

    const found = students.find((s) => {
      if (!s) return false
      const sEmailLower = s.email?.toLowerCase().trim()
      const sIdLower = s.id?.toLowerCase()
      const sStudentIdLower = s.student_id?.toLowerCase()
      const sRollNoLower = s.roll_no?.toLowerCase()

      return (
        (userEmailLower && sEmailLower === userEmailLower) ||
        (userIdLower && (sIdLower === userIdLower || sStudentIdLower === userIdLower || sRollNoLower === userIdLower))
      )
    })

    if (found) return found

    return (
      students[0] || {
        id: 'stu_fallback',
        name: user?.name || 'Student Candidate',
        roll_no: '2026CSE101',
        course: 'B.Tech',
        branch: 'CSE',
        year: '4th Year',
        section: 'Section A',
        cgpa: 8.4,
      }
    )
  }, [user, students])

  // Navigation Sub-Tabs strictly set to PRD specification: Dashboard, Drives, Activities, My Applications, My Status
  const [activeTab, setActiveTab] = useState('dashboard')

  // Activity sub-type filter
  const [activityTypeFilter, setActivityTypeFilter] = useState<'All' | ActivityType>('All')
  const [viewingActivity, setViewingActivity] = useState<TnpActivity | null>(null)

  // Filter Eligible Placement Drives for student's course, branch, and year
  const eligibleDrives = useMemo(() => {
    return drives.filter((d) => {
      const matchCourse =
        !d.target_courses ||
        d.target_courses.length === 0 ||
        d.target_courses.includes('All') ||
        d.target_courses.includes(currentStudent.course)

      const matchBranch =
        !d.target_branches ||
        d.target_branches.length === 0 ||
        d.target_branches.includes('All') ||
        d.target_branches.some((b) => isBranchMatch(b, currentStudent.branch))

      const matchYear =
        !d.target_years ||
        d.target_years.length === 0 ||
        d.target_years.includes('All') ||
        d.target_years.includes(currentStudent.year)

      return matchCourse && matchBranch && matchYear
    })
  }, [drives, currentStudent])

  // Filter Relevant Activities for student's class
  const studentActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchType = activityTypeFilter === 'All' || act.activity_type === activityTypeFilter
      const matchCourse = !act.course || act.course === 'All' || act.course === currentStudent.course
      const matchBranch = !act.branch || act.branch === 'All' || isBranchMatch(act.branch, currentStudent.branch)
      const matchYear = !act.year || act.year === 'All' || act.year === currentStudent.year

      return matchType && matchCourse && matchBranch && matchYear
    })
  }, [activities, activityTypeFilter, currentStudent])

  // Student's applications and placement offers
  const myDriveApplications = useMemo(() => {
    return applications.filter((a) => a.student_id === currentStudent.id || a.roll_no === currentStudent.roll_no)
  }, [applications, currentStudent])

  const appliedDriveIds = useMemo(() => {
    return new Set(myDriveApplications.map((a) => a.drive_id))
  }, [myDriveApplications])

  const myPlacementOffer = useMemo(() => {
    return placements.find((p) => p.student_id === currentStudent.id || p.roll_no === currentStudent.roll_no)
  }, [placements, currentStudent])

  // Action: Apply for placement drive
  const handleApplyDrive = async (drive: PlacementDrive) => {
    await applyForDrive(drive, {
      id: currentStudent.id,
      name: currentStudent.name,
      roll_no: currentStudent.roll_no,
      course: currentStudent.course,
      branch: currentStudent.branch,
      year: currentStudent.year,
      cgpa: (currentStudent as any).cgpa || 8.0,
    })
    toast({ type: 'success', title: 'Application Submitted', description: `Application submitted for ${drive.drive_name}` })
  }

  const topTabs = [
    { id: 'dashboard', label: 'TNP Dashboard' },
    { id: 'drives', label: 'Placement Drives' },
    { id: 'activities', label: 'Activities' },
    { id: 'my-applications', label: 'My Application' },
    { id: 'my-status', label: 'My Placement Status' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 max-w-full">
      {/* Student Profile Overview Card */}
      <div className="bg-surface p-4 sm:p-5 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <AvatarInitials name={currentStudent.name} size="lg" />
          <div>
            <h1 className="text-xl font-bold text-ink-900">{currentStudent.name}</h1>
            <p className="text-xs text-ink-500 font-mono">Roll No: {currentStudent.roll_no}</p>
            <p className="text-xs text-brand-600 font-semibold mt-0.5">
              {currentStudent.course} — {currentStudent.branch} ({currentStudent.year})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6 text-sm">
          <div>
            <p className="text-xs font-semibold text-ink-400 uppercase">CGPA Score</p>
            <p className="text-lg font-bold text-emerald-600">{(currentStudent as any).cgpa || '8.2'}</p>
          </div>
          <div className="ml-4">
            <p className="text-xs font-semibold text-ink-400 uppercase">Placement Status</p>
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${
                myPlacementOffer ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {myPlacementOffer ? `Placed @ ${myPlacementOffer.company_name}` : myDriveApplications.length > 0 ? 'In Process' : 'Eligible for Drives'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Sub-Tab Bar */}
      <div className="w-full max-w-full min-w-0">
        <Tabs tabs={topTabs} activeId={activeTab} onChange={setActiveTab} />
      </div>

      {/* TAB 1: STUDENT TNP DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 sm:p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400">ELIGIBLE DRIVES</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-2">{eligibleDrives.length}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-3">Matching Your Criteria</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 sm:p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400">APPLIED DRIVES</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-blue-600 mt-2">{myDriveApplications.length}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-ink-400 font-medium mt-3">Applications Sent</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 sm:p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400">SHORTLISTED</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-amber-600 mt-2">
                    {myDriveApplications.filter((a) => a.status === 'Shortlisted' || a.status === 'Aptitude' || a.status === 'GD' || a.status === 'PI').length}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-amber-600 font-medium mt-3">Next Rounds</p>
            </div>

            <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 sm:p-5 shadow-[var(--shadow-soft)] flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400">OFFERS RECEIVED</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-emerald-600 mt-2">
                    {myDriveApplications.filter((a) => a.status === 'Selected').length + (myPlacementOffer ? 1 : 0)}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-3">Final Selection</p>
            </div>
          </div>

          {/* Latest Eligible Placement Drives */}
          <div className="bg-surface p-5 rounded-[var(--radius-card)] border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-ink-900 text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-brand-600" /> Latest Eligible Placement Drives
              </h3>
              <span className="text-xs text-brand-600 font-semibold cursor-pointer" onClick={() => setActiveTab('drives')}>
                View All Drives ({eligibleDrives.length})
              </span>
            </div>

            {eligibleDrives.length === 0 ? (
              <p className="text-sm text-ink-400 py-6 text-center">No active placement drives currently open for your branch.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eligibleDrives.slice(0, 4).map((d) => {
                  const isApplied = appliedDriveIds.has(d.id)
                  const isClosed = d.status === 'Registration Closed' || d.status === 'Completed'

                  return (
                    <div key={d.id} className="p-4 bg-canvas rounded-xl border border-border/80 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-base text-ink-900">{d.drive_name}</h4>
                          <p className="text-xs text-brand-600 font-bold">{d.company_name}</p>
                          <p className="text-xs text-ink-600 mt-1">{d.job_role} • {d.job_location || 'Pan India'}</p>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-extrabold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {d.salary_package}
                        </span>
                      </div>

                      <div className="pt-1 flex items-center justify-end">
                        {isApplied ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Applied
                          </span>
                        ) : isClosed ? (
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                            Registration Closed
                          </span>
                        ) : (
                          <Button variant="primary" size="sm" onClick={() => handleApplyDrive(d)}>
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PLACEMENT DRIVES */}
      {activeTab === 'drives' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
            {eligibleDrives.length === 0 ? (
              <p className="p-12 text-center text-ink-400 text-sm">No eligible placement drives available at this time.</p>
            ) : (
              <div className="divide-y divide-border">
                {eligibleDrives.map((drive) => {
                  const isApplied = appliedDriveIds.has(drive.id)
                  const isClosed = drive.status === 'Registration Closed' || drive.status === 'Completed'

                  return (
                    <div key={drive.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-ink-900">{drive.drive_name}</h3>
                          <span className="px-2.5 py-0.5 text-xs font-extrabold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {drive.salary_package}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-brand-600">{drive.company_name} — {drive.job_role}</p>
                      </div>

                      <div>
                        {isApplied ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="h-4 w-4" /> Applied
                          </span>
                        ) : isClosed ? (
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3.5 py-2 rounded-lg">
                            Registration Closed
                          </span>
                        ) : (
                          <Button variant="primary" onClick={() => handleApplyDrive(drive)}>
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITIES (SINGLE COMBINED PANEL FOR STUDENT) */}
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
            {studentActivities.length === 0 ? (
              <p className="p-12 text-center text-ink-400 text-sm">No activities scheduled for your class at this time.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                    <tr>
                      <th className="p-3">Activity Title & Type</th>
                      <th className="p-3">Resource Person / Organization</th>
                      <th className="p-3">Schedule & Venue</th>
                      <th className="p-3">Target Audience</th>
                      <th className="p-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {studentActivities.map((act) => (
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
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => setViewingActivity(act)}>
                            <Eye className="h-3.5 w-3.5" /> View
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

      {/* TAB 4: MY APPLICATION */}
      {activeTab === 'my-applications' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
          {myDriveApplications.length === 0 ? (
            <p className="p-12 text-center text-ink-400 text-sm">You have not submitted any placement drive applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                  <tr>
                    <th className="p-3">Placement Drive</th>
                    <th className="p-3">Applied Date</th>
                    <th className="p-3">Current Round</th>
                    <th className="p-3">Application Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myDriveApplications.map((app) => {
                    const driveObj = drives.find((d) => d.id === app.drive_id)
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-bold text-ink-900">
                          <p>{driveObj?.drive_name || 'Placement Drive'}</p>
                          <p className="text-xs text-brand-600">{driveObj?.company_name}</p>
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '—'}
                        </td>
                        <td className="p-3 text-xs font-semibold text-ink-700">{app.current_round || 'Application Review'}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {app.status}
                          </span>
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

      {/* TAB 5: MY PLACEMENT STATUS */}
      {activeTab === 'my-status' && (
        <div className="bg-surface p-6 rounded-[var(--radius-card)] border border-border shadow-xs space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="font-bold text-ink-900 text-lg">My Career Placement Status</h3>
            <p className="text-xs text-ink-500">Official offer records and selection milestone history.</p>
          </div>

          {myPlacementOffer ? (
            <div className="p-5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
              <div className="flex items-center gap-3 text-emerald-700 font-bold text-lg">
                <Award className="h-6 w-6" /> Official Job Offer Confirmed
              </div>
              <div className="text-sm text-ink-800 space-y-1 pl-9">
                <p><strong>Company:</strong> {myPlacementOffer.company_name}</p>
                <p><strong>Designation / Role:</strong> {myPlacementOffer.job_role}</p>
                <p><strong>Offered Package (CTC):</strong> {myPlacementOffer.package_amount}</p>
                <p><strong>Work Location:</strong> {myPlacementOffer.location}</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-ink-500 space-y-2">
              <GraduationCap className="h-10 w-10 mx-auto text-slate-300" />
              <p className="font-semibold text-base text-ink-700">No confirmed placement offer logged yet.</p>
              <p className="text-xs text-ink-400">Keep applying to open drives and attending campus interviews!</p>
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
    </div>
  )
}
