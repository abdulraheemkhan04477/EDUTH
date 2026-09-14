import { useState, useMemo } from 'react'
import {
  Button,
  Modal,
  FormField,
  Input,
  Select,
  Textarea,
  StatusPill,
  SearchInput,
  EmptyState,
} from '../../components/ui'
import {
  Plus,
  Megaphone,
  Calendar,
  User,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react'
import type { NoticePriority } from '../../types/domain'
import { useAuth } from '../../app/providers/AuthProvider'
import {
  useAcademicStore,
  COURSES,
  BRANCHES_BY_COURSE,
  YEARS,
  SEMESTERS_BY_YEAR_COURSE,
  getTeacherForUser,
  isBranchMatch,
} from '../../lib/academicStore'
import { useNoticeStore } from '../../lib/noticeStore'
import type { CollegeNotice } from '../../lib/noticeStore'
import { useToast } from '../../components/ui/Toast'

export function NoticeBoardPage() {
  const { user, role } = useAuth()
  const { students, teachers, classes } = useAcademicStore()
  const { notices, saveNotice, deleteNotice, getNoticesForStudent, getNoticesForTeacher } = useNoticeStore()
  const { toast } = useToast()

  const isStudent = role === 'student'
  const isParent = role === 'parent'
  const isAdmin = role === 'admin' || role === 'super_admin'
  const isTeacher = role === 'teacher'



  // Teacher context and assigned classes
  const teacherRecord = useMemo(() => {
    if (!isTeacher) return null
    return getTeacherForUser(user, teachers, classes)
  }, [isTeacher, user, teachers, classes])

  const teacherAssignedClasses = useMemo(() => {
    return teacherRecord?.assigned_classes || []
  }, [teacherRecord])

  // Resolve Student context for targeting
  const studentContext = useMemo(() => {
    if (isStudent) {
      const userEmailLower = user?.email?.toLowerCase().trim()
      return students.find(
        (s) =>
          (user?.student_id && (s.id === user.student_id || s.student_id === user.student_id || s.roll_no === user.student_id || `STU-${s.roll_no}` === user.student_id)) ||
          (userEmailLower && s.email?.toLowerCase().trim() === userEmailLower) ||
          (user?.id && s.id === user.id)
      )
    }
    if (isParent) {
      const linkedStudentId = user?.child_student_id || user?.student_id
      const userEmailLower = user?.email?.toLowerCase().trim()
      return students.find(
        (s) =>
          (linkedStudentId && (s.id === linkedStudentId || s.student_id === linkedStudentId || s.roll_no === linkedStudentId || `STU-${s.roll_no}` === linkedStudentId)) ||
          (userEmailLower && s.parent_email?.toLowerCase().trim() === userEmailLower)
      )
    }
    return null
  }, [isStudent, isParent, user, students])

  // Filter notices based on role
  const roleBaseNotices = useMemo(() => {
    if (isStudent || isParent) {
      if (!studentContext) return []
      return getNoticesForStudent(
        studentContext.course,
        studentContext.branch,
        studentContext.year,
        studentContext.semester,
        studentContext.section
      )
    }
    if (isTeacher) {
      return getNoticesForTeacher(teacherAssignedClasses)
    }
    return notices
  }, [isStudent, isParent, isTeacher, studentContext, teacherAssignedClasses, notices, getNoticesForStudent, getNoticesForTeacher])

  // UI Filter & Search States
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCourse, setFilterCourse] = useState<string>('all')
  const [filterBranch, setFilterBranch] = useState<string>('all')
  const [filterYear, setFilterYear] = useState<string>('all')
  const [filterSemester, setFilterSemester] = useState<string>('all')

  // Available Branch options for filters
  const filterAvailableBranches = useMemo(() => {
    if (filterCourse === 'all') {
      const set = new Set<string>()
      Object.values(BRANCHES_BY_COURSE).forEach((list) => list.forEach((b) => set.add(b)))
      return Array.from(set)
    }
    return BRANCHES_BY_COURSE[filterCourse] || []
  }, [filterCourse])

  // Available Semester options for filters
  const filterAvailableSemesters = useMemo(() => {
    if (filterYear === 'all' || filterCourse === 'all') {
      return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']
    }
    return SEMESTERS_BY_YEAR_COURSE(filterYear, filterCourse)
  }, [filterYear, filterCourse])

  // Filtered Notices List
  const filteredNotices = useMemo(() => {
    return roleBaseNotices.filter((n) => {
      if (filterPriority !== 'all' && n.priority !== filterPriority) return false
      if (filterStatus !== 'all' && (n.publish_status || 'published') !== filterStatus) return false
      if (filterCourse !== 'all' && n.course !== 'all' && n.course !== filterCourse) return false
      if (filterBranch !== 'all' && n.branch && n.branch !== 'all' && !isBranchMatch(n.branch, filterBranch)) return false
      if (filterYear !== 'all' && n.year && n.year !== 'all' && n.year !== filterYear) return false
      if (filterSemester !== 'all' && n.semester && n.semester !== 'all' && n.semester !== filterSemester) return false

      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchTitle = n.title.toLowerCase().includes(q)
        const matchDesc = n.description.toLowerCase().includes(q)
        const matchAuthor = n.author.toLowerCase().includes(q)
        const matchCourse = n.course.toLowerCase().includes(q)
        const matchBranch = (n.branch || '').toLowerCase().includes(q)
        if (!matchTitle && !matchDesc && !matchAuthor && !matchCourse && !matchBranch) return false
      }
      return true
    })
  }, [roleBaseNotices, filterPriority, filterStatus, filterCourse, filterBranch, filterYear, filterSemester, search])

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewNoticeModal, setViewNoticeModal] = useState<CollegeNotice | null>(null)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<CollegeNotice | null>(null)
  const [editingNotice, setEditingNotice] = useState<CollegeNotice | null>(null)

  // Form State for Add / Edit Notice
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<NoticePriority>('medium')
  const [noticeDate, setNoticeDate] = useState(() => new Date().toISOString().split('T')[0])
  const [targetCourse, setTargetCourse] = useState('all')
  const [targetBranch, setTargetBranch] = useState('all')
  const [targetYear, setTargetYear] = useState('all')
  const [targetSemester, setTargetSemester] = useState('all')
  const [publishStatus, setPublishStatus] = useState<'published' | 'draft'>('published')

  const availableBranchesForForm = targetCourse !== 'all' ? BRANCHES_BY_COURSE[targetCourse] || [] : []
  const availableSemestersForForm = targetYear !== 'all' && targetCourse !== 'all'
    ? SEMESTERS_BY_YEAR_COURSE(targetYear, targetCourse)
    : ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']

  const openCreateModal = () => {
    setEditingNotice(null)
    setTitle('')
    setDescription('')
    setPriority('medium')
    setNoticeDate(new Date().toISOString().split('T')[0])
    setTargetCourse('all')
    setTargetBranch('all')
    setTargetYear('all')
    setTargetSemester('all')
    setPublishStatus('published')
    setShowAddModal(true)
  }

  const openEditModal = (notice: CollegeNotice) => {
    setEditingNotice(notice)
    setTitle(notice.title)
    setDescription(notice.description)
    setPriority(notice.priority)
    setNoticeDate(notice.date || new Date().toISOString().split('T')[0])
    setTargetCourse(notice.course || 'all')
    setTargetBranch(notice.branch || 'all')
    setTargetYear(notice.year || 'all')
    setTargetSemester(notice.semester || 'all')
    setPublishStatus(notice.publish_status || 'published')
    setShowAddModal(true)
  }

  const handleSaveNotice = async () => {
    if (!title.trim()) {
      toast({ type: 'error', title: 'Notice Title is required' })
      return
    }
    if (!description.trim()) {
      toast({ type: 'error', title: 'Notice Description/Content is required' })
      return
    }

    if (isTeacher && targetCourse !== 'all' && targetCourse !== 'All Courses') {
      const isValidTarget = teacherAssignedClasses.some((ac) => {
        const cMatch = ac.toLowerCase().includes(targetCourse.toLowerCase())
        const bMatch = targetBranch === 'all' || targetBranch === 'Common' || ac.toLowerCase().includes(targetBranch.toLowerCase())
        return cMatch && bMatch
      })
      if (!isValidTarget && teacherAssignedClasses.length > 0) {
        toast({ type: 'error', title: 'Unauthorized Target Class', description: 'Teachers can only post notices for their assigned classes.' })
        return
      }
    }

    try {
      await saveNotice({
        id: editingNotice?.id,
        title: title.trim(),
        description: description.trim(),
        priority,
        author: user?.name || (isAdmin ? 'College Admin' : isTeacher ? 'Faculty Member' : 'Administration'),
        date: noticeDate,
        course: targetCourse,
        branch: targetBranch,
        year: targetYear,
        semester: targetSemester,
        section: 'all',
        publish_status: publishStatus,
        college_id: editingNotice?.college_id || user?.college_id || user?.school_id || 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f',
      })

      toast({
        type: 'success',
        title: editingNotice ? 'Notice Updated Successfully' : 'Notice Posted Successfully',
        description: `Target: ${targetCourse === 'all' ? 'All Courses' : targetCourse} (${targetBranch === 'all' ? 'All Branches' : targetBranch})`,
      })
      setShowAddModal(false)
    } catch (err: any) {
      toast({ type: 'error', title: 'Save Failed', description: err.message || 'Failed to save notice record' })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirmModal) return
    try {
      await deleteNotice(deleteConfirmModal.id)
      toast({ type: 'info', title: 'Notice Deleted', description: `Removed notice: ${deleteConfirmModal.title}` })
      setDeleteConfirmModal(null)
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', description: err.message || 'Failed to delete notice' })
    }
  }

  const hasActiveFilters = filterPriority !== 'all' || filterStatus !== 'all' || filterCourse !== 'all' || filterBranch !== 'all' || filterYear !== 'all' || filterSemester !== 'all' || search.trim() !== ''

  const clearFilters = () => {
    setSearch('')
    setFilterPriority('all')
    setFilterStatus('all')
    setFilterCourse('all')
    setFilterBranch('all')
    setFilterYear('all')
    setFilterSemester('all')
  }

  // Summary Metrics
  const highPriorityCount = roleBaseNotices.filter((n) => n.priority === 'high').length
  const publishedCount = roleBaseNotices.filter((n) => n.publish_status !== 'draft').length


  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-100/70 text-brand-600 rounded-xl">
              <Megaphone className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-display font-bold text-ink-900 tracking-tight">Notice Board</h1>
              <p className="text-xs text-ink-400">
                {isStudent || isParent
                  ? `Official announcements for ${studentContext?.course || 'All Courses'} ${studentContext?.branch ? `• ${studentContext.branch}` : ''}`
                  : `Targeted academic announcements and institutional policy updates (${roleBaseNotices.length} notices total)`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Summary Stat Pills */}
          <div className="hidden md:flex items-center gap-2 pr-4 border-r border-border text-xs">
            <div className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200/60 rounded-lg font-semibold flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{highPriorityCount} High Priority</span>
            </div>
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{publishedCount} Published</span>
            </div>
          </div>

          {!isStudent && !isParent && (
            <Button onClick={openCreateModal} className="bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm gap-2">
              <Plus className="h-4 w-4" />
              <span>Post New Notice</span>
            </Button>
          )}
        </div>
      </div>

      {/* Modern Filter & Control Bar */}
      <div className="bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <SearchInput
              placeholder="Search by title, description, or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />

            {/* Course */}
            <Select
              options={[{ value: 'all', label: 'All Courses' }, ...COURSES.map((c) => ({ value: c, label: c }))]}
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value)
                setFilterBranch('all')
              }}
              className="w-full sm:w-36"
            />

            {/* Branch */}
            <Select
              options={[{ value: 'all', label: 'All Branches' }, ...filterAvailableBranches.map((b) => ({ value: b, label: b }))]}
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full sm:w-40"
            />

            {/* Year */}
            <Select
              options={[{ value: 'all', label: 'All Years' }, ...YEARS.map((y) => ({ value: y, label: y }))]}
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full sm:w-32"
            />

            {/* Semester */}
            <Select
              options={[{ value: 'all', label: 'All Semesters' }, ...filterAvailableSemesters.map((s) => ({ value: s, label: s }))]}
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full sm:w-36"
            />

            {/* Priority Filter */}
            <Select
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'high', label: 'High Priority' },
                { value: 'medium', label: 'Medium Priority' },
                { value: 'low', label: 'Low Priority' },
              ]}
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full sm:w-36"
            />

            {/* Status Filter (Admin / Teacher Only) */}
            {!isStudent && !isParent && (
              <Select
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'published', label: 'Published Only' },
                  { value: 'draft', label: 'Drafts Only' },
                ]}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-36"
              />
            )}
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-ink-500 hover:text-ink-900">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Notice Cards Grid */}
      {filteredNotices.length === 0 ? (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-12 text-center shadow-[var(--shadow-soft)]">
          <EmptyState
            icon={Megaphone}
            title="No notices found"
            description={
              hasActiveFilters
                ? 'No notices match your current search and filter settings. Try clearing your filters.'
                : 'There are currently no announcements posted for your academic group.'
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredNotices.map((notice) => {
            const courseText = notice.course === 'all' ? 'All Courses' : notice.course
            const branchText = !notice.branch || notice.branch === 'all' ? 'All Branches' : notice.branch
            const yearText = !notice.year || notice.year === 'all' ? 'All Years' : notice.year
            const semesterText = !notice.semester || notice.semester === 'all' ? 'All Semesters' : notice.semester

            const targetBadge = `🎯 ${courseText} • ${branchText} • ${yearText} • ${semesterText}`

            return (
              <div
                key={notice.id}
                className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4 group"
              >
                {/* Notice Card Header */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Priority Pill */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          notice.priority === 'high'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : notice.priority === 'medium'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-sky-100 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {notice.priority} Priority
                      </span>

                      {/* Status Pill for Admin / Teacher */}
                      {!isStudent && !isParent && (
                        <StatusPill
                          status={notice.publish_status === 'draft' ? 'neutral' : 'success'}
                          label={notice.publish_status === 'draft' ? 'DRAFT' : 'PUBLISHED'}
                        />
                      )}
                    </div>

                    {/* Published Date */}
                    <div className="flex items-center gap-1.5 text-xs text-ink-400 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{notice.date}</span>
                    </div>
                  </div>

                  {/* Title & Preview */}
                  <h3 className="text-lg font-display font-bold text-ink-900 group-hover:text-brand-600 transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-ink-600 line-clamp-2 leading-relaxed">
                    {notice.description}
                  </p>
                </div>

                {/* Notice Card Footer & Metadata */}
                <div className="pt-3 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Target Audience Pill */}
                    <span className="px-2.5 py-1 bg-brand-50 text-brand-700 font-medium rounded-lg border border-brand-100/80 truncate max-w-full sm:max-w-md">
                      {targetBadge}
                    </span>
                    <span className="text-ink-400 flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> By {notice.author}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewNoticeModal(notice)}
                      className="gap-1.5 text-ink-600 hover:text-brand-600"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Button>

                    {!isStudent && !isParent && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(notice)}
                          className="gap-1.5 text-ink-600 hover:text-indigo-600"
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmModal(notice)}
                          className="gap-1.5 text-ink-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ==================== VIEW NOTICE DETAILS MODAL ==================== */}
      <Modal
        isOpen={!!viewNoticeModal}
        onClose={() => setViewNoticeModal(null)}
        title="Notice Announcement Details"
        footer={
          <Button variant="ghost" onClick={() => setViewNoticeModal(null)}>
            Close Notice
          </Button>
        }
      >
        {viewNoticeModal && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  viewNoticeModal.priority === 'high'
                    ? 'bg-rose-100 text-rose-700'
                    : viewNoticeModal.priority === 'medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {viewNoticeModal.priority} Priority
              </span>
              <div className="text-xs text-ink-400 font-mono">Published: {viewNoticeModal.date}</div>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold text-ink-900 mb-2">
                {viewNoticeModal.title}
              </h2>
              <div className="p-4 bg-canvas/60 rounded-xl border border-border text-sm text-ink-800 whitespace-pre-wrap leading-relaxed">
                {viewNoticeModal.description}
              </div>
            </div>

            {/* Target Breakdown Grid */}
            <div className="p-3 bg-surface rounded-xl border border-border space-y-2 text-xs">
              <div className="font-semibold text-ink-900 uppercase tracking-wider text-[10px]">Target Audience Breakdown</div>
              <div className="grid grid-cols-2 gap-2">
                <div>Course: <span className="font-semibold text-brand-700">{viewNoticeModal.course === 'all' ? 'All Courses (Global)' : viewNoticeModal.course}</span></div>
                <div>Branch: <span className="font-semibold text-brand-700">{!viewNoticeModal.branch || viewNoticeModal.branch === 'all' ? 'All Branches / Common' : viewNoticeModal.branch}</span></div>
                <div>Year: <span className="font-semibold text-ink-700">{!viewNoticeModal.year || viewNoticeModal.year === 'all' ? 'All Academic Years' : viewNoticeModal.year}</span></div>
                <div>Semester: <span className="font-semibold text-ink-700">{!viewNoticeModal.semester || viewNoticeModal.semester === 'all' ? 'All Semesters' : viewNoticeModal.semester}</span></div>
              </div>
            </div>

            <div className="text-xs text-ink-400 flex items-center justify-between pt-2 border-t border-border">
              <span>Author: <strong className="text-ink-800">{viewNoticeModal.author}</strong></span>
              <StatusPill status={viewNoticeModal.publish_status === 'draft' ? 'neutral' : 'success'} label={viewNoticeModal.publish_status === 'draft' ? 'DRAFT' : 'PUBLISHED'} />
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== ADD / EDIT NOTICE MODAL ==================== */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingNotice ? 'Edit Targeted Notice' : 'Post New Targeted Notice'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotice} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
              <Send className="h-4 w-4" />
              <span>{editingNotice ? 'Save Notice Changes' : 'Post Notice'}</span>
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Section 1: Notice Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 border-b border-border pb-1">
              1. Notice Details & Content
            </h4>

            <FormField label="Notice Title" required>
              <Input
                placeholder="Enter clear notice title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormField>

            <FormField label="Notice Content / Description" required>
              <Textarea
                placeholder="Enter complete notice announcement body..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Priority Level">
                <Select
                  options={[
                    { value: 'high', label: 'High Priority' },
                    { value: 'medium', label: 'Medium Priority' },
                    { value: 'low', label: 'Low Priority' },
                  ]}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NoticePriority)}
                />
              </FormField>

              <FormField label="Publish Date">
                <Input
                  type="date"
                  value={noticeDate}
                  onChange={(e) => setNoticeDate(e.target.value)}
                />
              </FormField>

              <FormField label="Visibility Status">
                <Select
                  options={[
                    { value: 'published', label: 'Published (Live)' },
                    { value: 'draft', label: 'Draft Mode' },
                  ]}
                  value={publishStatus}
                  onChange={(e) => setPublishStatus(e.target.value as 'published' | 'draft')}
                />
              </FormField>
            </div>
          </div>

          {/* Section 2: Target Audience */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 border-b border-border pb-1">
              2. Target Audience & Academic Scope
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Target Course */}
              <FormField label="Target Course" required>
                <Select
                  options={[
                    { value: 'all', label: 'All Courses (Global Institution Notice)' },
                    ...COURSES.map((c) => ({ value: c, label: c })),
                  ]}
                  value={targetCourse}
                  onChange={(e) => {
                    const c = e.target.value
                    setTargetCourse(c)
                    setTargetBranch('all')
                  }}
                />
              </FormField>

              {/* Target Branch */}
              <FormField label="Target Branch (Optional)">
                <Select
                  disabled={targetCourse === 'all'}
                  options={[
                    { value: 'all', label: 'All Branches / Common' },
                    ...availableBranchesForForm.map((b) => ({ value: b, label: b })),
                  ]}
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                />
              </FormField>

              {/* Target Year */}
              <FormField label="Target Academic Year">
                <Select
                  options={[
                    { value: 'all', label: 'All Years' },
                    ...YEARS.map((y) => ({ value: y, label: y })),
                  ]}
                  value={targetYear}
                  onChange={(e) => {
                    const y = e.target.value
                    setTargetYear(y)
                    setTargetSemester('all')
                  }}
                />
              </FormField>

              {/* Target Semester */}
              <FormField label="Target Semester">
                <Select
                  options={[
                    { value: 'all', label: 'All Semesters' },
                    ...availableSemestersForForm.map((s) => ({ value: s, label: s })),
                  ]}
                  value={targetSemester}
                  onChange={(e) => setTargetSemester(e.target.value)}
                />
              </FormField>
            </div>

            {/* Dynamic Targeting Summary Banner */}
            <div className="p-3 bg-brand-50/70 border border-brand-100 rounded-xl text-xs text-brand-900 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <strong>Notice Reach: </strong>
                {targetCourse === 'all' ? (
                  <span>Reaches ALL students across all courses, branches, years, and semesters.</span>
                ) : (
                  <span>
                    Targeted to <strong>{targetCourse}</strong> (
                    {targetBranch === 'all' ? 'All Branches' : targetBranch} ·{' '}
                    {targetYear === 'all' ? 'All Years' : targetYear} ·{' '}
                    {targetSemester === 'all' ? 'All Semesters' : targetSemester}).
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      <Modal
        isOpen={!!deleteConfirmModal}
        onClose={() => setDeleteConfirmModal(null)}
        title="Confirm Notice Deletion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirmModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} className="bg-rose-600 hover:bg-rose-700 text-white">
              Confirm Delete
            </Button>
          </>
        }
      >
        {deleteConfirmModal && (
          <div className="space-y-3">
            <p className="text-sm text-ink-800">
              Are you sure you want to delete notice <strong>"{deleteConfirmModal.title}"</strong>?
            </p>
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              ⚠️ This action will permanently remove this record from Supabase and clear it from all target student/parent notice boards.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
