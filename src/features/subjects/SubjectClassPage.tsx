import { useState } from 'react'
import {
  Tabs,
  DataTable,
  Button,
  SearchInput,
  Modal,
  FormField,
  Input,
  Select,
  StatusPill,
  EmptyState,
} from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import {
  Plus,
  Pencil,
  Trash2,
  GraduationCap,
  GitBranch,
  Calendar,
  Grid,
  BookOpen,
} from 'lucide-react'
import type { Column } from '../../components/ui/DataTable'
import { useAcademicStore, type SubjectItem } from '../../lib/academicStore'
import { useAuth } from '../../app/providers/AuthProvider'

// ===== DOMAIN INTERFACES =====
export interface CourseItem {
  id: string
  name: string
  code: string
  duration: string
  status: 'active' | 'inactive'
}

export interface BranchItem {
  id: string
  college_id?: string
  course_name: string
  name: string
  code: string
  status: 'active' | 'inactive'
}

export interface SemesterItem {
  id: string
  college_id?: string
  course_name: string
  name: string
  term: 'Odd' | 'Even'
  status: 'active' | 'inactive'
}

export interface SectionItem {
  id: string
  college_id?: string
  course_name: string
  branch_name: string
  semester_name: string
  name: string
  capacity: number
  status: 'active' | 'inactive'
}

// ===== SAMPLE DUMMY DATA =====
const initialCourses: CourseItem[] = [
  { id: 'c1', name: 'B.Tech', code: 'BTECH', duration: '4 Years (8 Semesters)', status: 'active' },
  { id: 'c2', name: 'Diploma', code: 'DIP', duration: '3 Years (6 Semesters)', status: 'active' },
  { id: 'c3', name: 'MBA', code: 'MBA', duration: '2 Years (4 Semesters)', status: 'active' },
]





export function SubjectClassPage() {
  const { toast } = useToast()
  const { user, collegeId: activeCollegeId } = useAuth()
  const targetCollegeId = user?.college_id || activeCollegeId || user?.school_id || ''
  const [activeTab, setActiveTab] = useState('courses')

  // Academic Store Integration for Subjects, Semesters, Branches and Sections
  const {
    subjects,
    saveSubject,
    deleteSubject,
    semesters: storeSemesters,
    saveSemester: saveSemesterStore,
    deleteSemester: deleteSemesterStore,
    branches: storeBranches,
    saveBranch: saveBranchStore,
    deleteBranch: deleteBranchStore,
    sections: storeSections,
    saveSection: saveSectionStore,
    deleteSection: deleteSectionStore,
  } = useAcademicStore()

  // Data States
  const courses: CourseItem[] = initialCourses // Fixed protected root entities
  const branches = storeBranches || []
  const semesters = storeSemesters || []
  const sections = storeSections || []

  // Filters & Search
  const [search, setSearch] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState('')

  // Modal States
  const [branchModal, setBranchModal] = useState(false)
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null)
  const [isSavingBranch, setIsSavingBranch] = useState(false)
  const [branchForm, setBranchForm] = useState<{ course_name: string; name: string; code: string; status: 'active' | 'inactive' }>({
    course_name: 'B.Tech',
    name: '',
    code: '',
    status: 'active',
  })

  const [semesterModal, setSemesterModal] = useState(false)
  const [editingSemester, setEditingSemester] = useState<SemesterItem | null>(null)
  const [isSavingSemester, setIsSavingSemester] = useState(false)
  const [semesterForm, setSemesterForm] = useState<{ course_name: string; name: string; term: 'Odd' | 'Even'; status: 'active' | 'inactive' }>({
    course_name: 'B.Tech',
    name: '1st Semester',
    term: 'Odd',
    status: 'active',
  })

  const [sectionModal, setSectionModal] = useState(false)
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null)
  const [sectionForm, setSectionForm] = useState<{
    course_name: string
    branch_name: string
    semester_name: string
    name: string
    capacity: number
    status: 'active' | 'inactive'
  }>({
    course_name: 'B.Tech',
    branch_name: 'CSE',
    semester_name: '1st Semester',
    name: 'A',
    capacity: 60,
    status: 'active',
  })

  const [subjectModal, setSubjectModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null)
  const [isSavingSubject, setIsSavingSubject] = useState(false)
  const [isCommonSubject, setIsCommonSubject] = useState(false)
  const [subjectForm, setSubjectForm] = useState<{
    course_name: string
    branch_name: string
    semester_name: string
    name: string
    code: string
    type: 'Theory' | 'Practical' | 'Elective'
    credits: number
    status: 'active' | 'inactive'
  }>({
    course_name: 'B.Tech',
    branch_name: 'ECE',
    semester_name: '1st Semester',
    name: '',
    code: '',
    type: 'Theory',
    credits: 4,
    status: 'active',
  })

  const navTabs = [
    { id: 'courses', label: 'Courses' },
    { id: 'branches', label: 'Branches' },
    { id: 'semesters', label: 'Semesters' },
    { id: 'sections', label: 'Sections' },
    { id: 'subjects', label: 'Subjects' },
  ]

  // ===== BRANCH HANDLERS =====
  const openAddBranch = () => {
    setEditingBranch(null)
    setBranchForm({ course_name: courses[0]?.name || 'B.Tech', name: '', code: '', status: 'active' })
    setBranchModal(true)
  }

  const openEditBranch = (b: BranchItem) => {
    setEditingBranch(b)
    setBranchForm({ course_name: b.course_name, name: b.name, code: b.code, status: b.status })
    setBranchModal(true)
  }

  const handleSaveBranch = async () => {
    if (!branchForm.name.trim()) {
      toast({ type: 'error', title: 'Branch full name is required' })
      return
    }
    if (!branchForm.code.trim()) {
      toast({ type: 'error', title: 'Branch short code is required' })
      return
    }
    try {
      setIsSavingBranch(true)
      await saveBranchStore({
        ...(editingBranch ? { id: editingBranch.id } : {}),
        college_id: editingBranch?.college_id || targetCollegeId,
        course_name: branchForm.course_name,
        name: branchForm.name.trim(),
        code: branchForm.code.trim().toUpperCase(),
        status: branchForm.status,
      })
      toast({
        type: 'success',
        title: editingBranch ? 'Branch updated successfully' : 'Branch added successfully',
      })
      setBranchModal(false)
    } catch (err: any) {
      toast({ type: 'error', title: err.message || 'Failed to save branch' })
    } finally {
      setIsSavingBranch(false)
    }
  }

  const handleDeleteBranch = async (id: string, name: string) => {
    try {
      await deleteBranchStore(id)
      toast({ type: 'info', title: `Branch "${name}" deleted` })
    } catch (err: any) {
      toast({ type: 'error', title: err.message || 'Failed to delete branch' })
    }
  }

  // ===== SEMESTER HANDLERS =====
  const openAddSemester = () => {
    setEditingSemester(null)
    setSemesterForm({ course_name: courses[0]?.name || 'B.Tech', name: '1st Semester', term: 'Odd', status: 'active' })
    setSemesterModal(true)
  }

  const openEditSemester = (s: SemesterItem) => {
    setEditingSemester(s)
    setSemesterForm({ course_name: s.course_name, name: s.name, term: s.term, status: s.status })
    setSemesterModal(true)
  }

  const handleSaveSemester = async () => {
    if (!semesterForm.name.trim()) {
      toast({ type: 'error', title: 'Semester name is required' })
      return
    }
    try {
      setIsSavingSemester(true)
      await saveSemesterStore({
        ...(editingSemester ? { id: editingSemester.id } : {}),
        college_id: editingSemester?.college_id || targetCollegeId,
        course_name: semesterForm.course_name,
        name: semesterForm.name.trim(),
        term: semesterForm.term,
        status: semesterForm.status,
      })
      toast({
        type: 'success',
        title: editingSemester ? 'Semester updated successfully' : 'Semester added successfully',
      })
      setSemesterModal(false)
    } catch (err: any) {
      toast({ type: 'error', title: err.message || 'Failed to save semester' })
    } finally {
      setIsSavingSemester(false)
    }
  }

  const handleDeleteSemester = async (id: string, name: string) => {
    try {
      await deleteSemesterStore(id)
      toast({ type: 'info', title: `Semester "${name}" deleted` })
    } catch (err: any) {
      toast({ type: 'error', title: err.message || 'Failed to delete semester' })
    }
  }

  // ===== SECTION HANDLERS =====
  const openAddSection = () => {
    setEditingSection(null)
    setSectionForm({
      course_name: courses[0]?.name || 'B.Tech',
      branch_name: branches[0]?.name || 'Computer Science & Engineering (CSE)',
      semester_name: '1st Semester',
      name: 'A',
      capacity: 60,
      status: 'active',
    })
    setSectionModal(true)
  }

  const openEditSection = (s: SectionItem) => {
    setEditingSection(s)
    setSectionForm({
      course_name: s.course_name,
      branch_name: s.branch_name,
      semester_name: s.semester_name,
      name: s.name,
      capacity: s.capacity,
      status: s.status,
    })
    setSectionModal(true)
  }

  const [isSavingSection, setIsSavingSection] = useState(false)

  const handleSaveSection = async () => {
    if (!sectionForm.name.trim()) {
      toast({ type: 'error', title: 'Section name is required' })
      return
    }
    try {
      setIsSavingSection(true)
      await saveSectionStore({
        ...(editingSection ? { id: editingSection.id } : {}),
        college_id: editingSection?.college_id || targetCollegeId,
        course_name: sectionForm.course_name,
        branch_name: sectionForm.branch_name,
        semester_name: sectionForm.semester_name,
        name: sectionForm.name.trim().toUpperCase(),
        capacity: Number(sectionForm.capacity || 60),
        status: sectionForm.status,
      })
      toast({
        type: 'success',
        title: editingSection ? 'Section updated successfully' : 'Section added successfully',
      })
      setSectionModal(false)
    } catch (err: any) {
      toast({ type: 'error', title: err.message || 'Failed to save section' })
    } finally {
      setIsSavingSection(false)
    }
  }

  const handleDeleteSection = async (id: string, name: string) => {
    try {
      await deleteSectionStore(id)
      toast({ type: 'info', title: `Section "${name}" deleted` })
    } catch (err: any) {
      toast({ type: 'error', title: err.message || 'Failed to delete section' })
    }
  }

  // ===== SUBJECT HANDLERS =====
  const openAddSubject = () => {
    setEditingSubject(null)
    setIsCommonSubject(false)
    const defaultCourse = courses[0]?.name || 'B.Tech'
    const availableBr = branches.filter((b) => b.course_name === defaultCourse && !b.name.toLowerCase().includes('common'))
    const availableSem = semesters.filter((s) => s.course_name === defaultCourse)
    setSubjectForm({
      course_name: defaultCourse,
      branch_name: availableBr[0]?.name || 'Computer Science & Engineering (CSE)',
      semester_name: availableSem[0]?.name || '1st Semester',
      name: '',
      code: '',
      type: 'Theory',
      credits: 4,
      status: 'active',
    })
    setSubjectModal(true)
  }

  const openEditSubject = (s: SubjectItem) => {
    setEditingSubject(s)
    const isCommon = Boolean(s.is_common || (s.branch_name || '').toLowerCase().includes('common'))
    setIsCommonSubject(isCommon)
    setSubjectForm({
      course_name: s.course_name,
      branch_name: isCommon ? 'Common Subject (All Branches)' : s.branch_name,
      semester_name: s.semester_name,
      name: s.name,
      code: s.code,
      type: s.type || 'Theory',
      credits: Number(s.credits || 4),
      status: s.status,
    })
    setSubjectModal(true)
  }

  const handleSaveSubject = async () => {
    if (!subjectForm.name.trim()) {
      toast({ type: 'error', title: 'Subject name is required' })
      return
    }
    if (!subjectForm.code.trim()) {
      toast({ type: 'error', title: 'Subject code is required' })
      return
    }
    try {
      setIsSavingSubject(true)
      await saveSubject({
        ...(editingSubject ? { id: editingSubject.id } : {}),
        college_id: editingSubject?.college_id || targetCollegeId,
        course_name: subjectForm.course_name,
        branch_name: isCommonSubject ? 'Common Subject (All Branches)' : subjectForm.branch_name,
        semester_name: subjectForm.semester_name,
        name: subjectForm.name.trim(),
        code: subjectForm.code.trim(),
        type: subjectForm.type,
        credits: Number(subjectForm.credits || 4),
        status: subjectForm.status,
        is_common: isCommonSubject,
      })
      toast({
        type: 'success',
        title: editingSubject ? 'Subject updated successfully' : 'Subject added successfully',
      })
      setSubjectModal(false)
    } catch (err: any) {
      toast({ type: 'error', title: err.message || 'Failed to save subject' })
    } finally {
      setIsSavingSubject(false)
    }
  }

  const handleDeleteSubject = async (id: string, name: string) => {
    try {
      await deleteSubject(id)
      toast({ type: 'info', title: `Subject "${name}" deleted` })
    } catch (err: any) {
      toast({ type: 'error', title: err.message || 'Failed to delete subject' })
    }
  }

  // ===== FILTER LOGIC =====
  const filteredCourses = courses.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  )

  const filteredBranches = branches.filter((b) => {
    if (b.name.toLowerCase().includes('common') || b.name === 'All Branches / Common') return false
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.code.toLowerCase().includes(search.toLowerCase())) return false
    if (courseFilter && b.course_name !== courseFilter) return false
    return true
  })

  const filteredSemesters = semesters.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.course_name.toLowerCase().includes(search.toLowerCase())) return false
    if (courseFilter && s.course_name !== courseFilter) return false
    return true
  })

  const filteredSections = sections.filter((sec) => {
    if (search && !sec.name.toLowerCase().includes(search.toLowerCase()) && !sec.branch_name.toLowerCase().includes(search.toLowerCase())) return false
    if (semesterFilter && sec.semester_name !== semesterFilter) return false
    if (courseFilter && sec.course_name !== courseFilter) return false
    if (branchFilter && sec.branch_name !== branchFilter) return false
    return true
  })

  const filteredSubjects = subjects.filter((sub) => {
    if (search && !sub.name.toLowerCase().includes(search.toLowerCase()) && !sub.code.toLowerCase().includes(search.toLowerCase())) return false
    if (semesterFilter && sub.semester_name !== semesterFilter) return false
    if (courseFilter && sub.course_name !== courseFilter) return false
    if (branchFilter) {
      const isSubCommon = Boolean(sub.is_common || (sub.branch_name || '').toLowerCase().includes('common'))
      if (!isSubCommon) {
        const bNorm = branchFilter.toLowerCase().replace(/[^a-z0-9]/g, '')
        const subBNorm = (sub.branch_name || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const matchesDirect = subBNorm === bNorm || sub.branch_name.toLowerCase().includes(branchFilter.toLowerCase()) || branchFilter.toLowerCase().includes(sub.branch_name.toLowerCase())
        const matchesApplicable = sub.applicable_branches && sub.applicable_branches.some((b) => b.toLowerCase().replace(/[^a-z0-9]/g, '') === bNorm)
        if (!matchesDirect && !matchesApplicable) return false
      }
    }
    return true
  })

  // ===== COLUMNS CONFIGS =====
  const courseColumns: Column<CourseItem>[] = [
    {
      key: 'name',
      header: 'Course Name',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-100/60 text-brand-600 rounded-lg shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-ink-900">{r.name}</p>
            <p className="text-xs text-ink-400 font-mono">{r.code}</p>
          </div>
        </div>
      ),
    },
    { key: 'duration', header: 'Duration & Terms', render: (r) => <span className="text-sm text-ink-600">{r.duration}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status === 'active' ? 'success' : 'neutral'} label={r.status.toUpperCase()} /> },
  ]

  const branchColumns: Column<BranchItem>[] = [
    {
      key: 'name',
      header: 'Branch (Code & Name)',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-info-100/80 text-info-700 font-bold font-mono text-xs rounded-md shrink-0 border border-info-200">
            {r.code || 'BR'}
          </div>
          <div>
            <p className="font-bold text-ink-900">{r.code}</p>
            <p className="text-xs text-ink-500">{r.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'course_name',
      header: 'Associated Course',
      render: (r) => <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 font-semibold text-xs rounded-full">{r.course_name}</span>,
    },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status === 'active' ? 'success' : 'neutral'} label={r.status.toUpperCase()} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEditBranch(r)} className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteBranch(r.id, r.name)} className="p-1.5 rounded hover:bg-danger-100 text-ink-400 hover:text-danger-600 transition-colors cursor-pointer" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  const semesterColumns: Column<SemesterItem>[] = [
    {
      key: 'name',
      header: 'Semester',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning-100/60 text-warning-600 rounded-lg shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="font-bold text-ink-900">{r.name}</span>
        </div>
      ),
    },
    {
      key: 'course_name',
      header: 'Course',
      render: (r) => <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 font-semibold text-xs rounded-full">{r.course_name}</span>,
    },
    { key: 'term', header: 'Academic Term', render: (r) => <span className="text-sm text-ink-600 font-medium">{r.term} Term</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status === 'active' ? 'success' : 'neutral'} label={r.status.toUpperCase()} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEditSemester(r)} className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteSemester(r.id, r.name)} className="p-1.5 rounded hover:bg-danger-100 text-ink-400 hover:text-danger-600 transition-colors cursor-pointer" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  const sectionColumns: Column<SectionItem>[] = [
    {
      key: 'name',
      header: 'Section',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100/60 text-emerald-600 rounded-lg shrink-0 font-display font-bold">
            <Grid className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-ink-900">Section {r.name}</p>
            <p className="text-xs text-ink-400">{r.capacity} Max Capacity</p>
          </div>
        </div>
      ),
    },
    {
      key: 'hierarchy',
      header: 'Structure Hierarchy',
      render: (r) => (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="px-2 py-0.5 bg-brand-100 text-brand-700 font-semibold rounded">{r.course_name}</span>
          <span className="text-ink-400">›</span>
          <span className="px-2 py-0.5 bg-info-100 text-info-700 font-medium rounded truncate max-w-[200px]" title={r.branch_name}>
            {r.branch_name}
          </span>
          <span className="text-ink-400">›</span>
          <span className="px-2 py-0.5 bg-canvas border border-border text-ink-600 font-medium rounded">{r.semester_name}</span>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status === 'active' ? 'success' : 'neutral'} label={r.status.toUpperCase()} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEditSection(r)} className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteSection(r.id, r.name)} className="p-1.5 rounded hover:bg-danger-100 text-ink-400 hover:text-danger-600 transition-colors cursor-pointer" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  const subjectColumns: Column<SubjectItem>[] = [
    {
      key: 'name',
      header: 'Subject Name & Code',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100/60 text-purple-600 rounded-lg shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-ink-900">{r.name}</p>
            <p className="text-xs text-ink-400 font-mono">Code: {r.code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'structure',
      header: 'Academic Mapping',
      render: (r) => {
        const isCommon = Boolean(r.is_common || (r.branch_name || '').toLowerCase().includes('common'))
        return (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 bg-brand-100 text-brand-700 font-bold rounded">{r.course_name}</span>
            <span className="text-ink-400">›</span>
            {isCommon ? (
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 font-bold rounded-full border border-purple-200">
                Common Subject (All Branches)
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-info-100 text-info-700 font-medium rounded truncate max-w-[220px]" title={r.branch_name}>
                {r.branch_name}
              </span>
            )}
            {r.semester_name && (
              <>
                <span className="text-ink-400">›</span>
                <span className="px-2 py-0.5 bg-canvas border border-border text-ink-600 font-medium rounded">{r.semester_name}</span>
              </>
            )}
          </div>
        )
      },
    },
    {
      key: 'type',
      header: 'Type & Credits',
      render: (r) => (
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded font-semibold ${
            r.type === 'Practical'
              ? 'bg-amber-100 text-amber-700'
              : r.type === 'Elective'
              ? 'bg-teal-100 text-teal-700'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {r.type || 'Theory'}
          </span>
          <span className="text-ink-500 font-medium">{r.credits || 4} Credits</span>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status === 'active' ? 'success' : 'neutral'} label={r.status.toUpperCase()} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEditSubject(r)} className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteSubject(r.id, r.name)} className="p-1.5 rounded hover:bg-danger-100 text-ink-400 hover:text-danger-600 transition-colors cursor-pointer" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">Academic Structure</h1>
          <p className="text-sm text-ink-400 mt-1">Configure and manage courses, branches, semesters, sections, and subjects.</p>
        </div>
        <div>
          {activeTab === 'branches' && (
            <Button onClick={openAddBranch} className="bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4" /> Add Branch
            </Button>
          )}
          {activeTab === 'semesters' && (
            <Button onClick={openAddSemester} className="bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4" /> Add Semester
            </Button>
          )}
          {activeTab === 'sections' && (
            <Button onClick={openAddSection} className="bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4" /> Add Section
            </Button>
          )}
          {activeTab === 'subjects' && (
            <Button onClick={openAddSubject} className="bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4" /> Add Subject
            </Button>
          )}
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <Tabs tabs={navTabs} activeId={activeTab} onChange={(tab) => { setActiveTab(tab); setSearch(''); setCourseFilter(''); setBranchFilter(''); setSemesterFilter(''); }} className="border-b border-border" />

      {/* ==================== 1. COURSES TAB ==================== */}
      {activeTab === 'courses' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="p-4 border-b border-border bg-canvas/40">
            <SearchInput placeholder="Filter courses by name or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-80" />
          </div>
          <DataTable
            columns={courseColumns}
            rows={filteredCourses}
            keyExtractor={(r) => r.id}
            emptyState={<EmptyState icon={GraduationCap} title="No courses found" description="Academic courses are protected root entities." />}
          />
        </div>
      )}

      {/* ==================== 2. BRANCHES TAB ==================== */}
      {activeTab === 'branches' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-canvas/40">
            <SearchInput placeholder="Search branch name or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-80" />
            <Select
              options={courses.map((c) => ({ value: c.name, label: c.name }))}
              placeholder="All Courses"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-44"
            />
          </div>
          <DataTable
            columns={branchColumns}
            rows={filteredBranches}
            keyExtractor={(r) => r.id}
            emptyState={<EmptyState icon={GitBranch} title="No branches found" description="Add branches linked to your courses." actionLabel="Add Branch" onAction={openAddBranch} />}
          />
        </div>
      )}

      {/* ==================== 3. SEMESTERS TAB ==================== */}
      {activeTab === 'semesters' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-canvas/40">
            <SearchInput placeholder="Search semesters..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-80" />
            <Select
              options={courses.map((c) => ({ value: c.name, label: c.name }))}
              placeholder="All Courses"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-44"
            />
          </div>
          <DataTable
            columns={semesterColumns}
            rows={filteredSemesters}
            keyExtractor={(r) => r.id}
            emptyState={<EmptyState icon={Calendar} title="No semesters found" description="Configure semester structures for courses." actionLabel="Add Semester" onAction={openAddSemester} />}
          />
        </div>
      )}

      {/* ==================== 4. SECTIONS TAB ==================== */}
      {activeTab === 'sections' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="p-4 border-b border-border flex flex-wrap items-center gap-3 bg-canvas/40">
            <SearchInput placeholder="Filter sections..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-56" />
            <Select
              options={courses.map((c) => ({ value: c.name, label: c.name }))}
              placeholder="All Courses"
              value={courseFilter}
              onChange={(e) => { setCourseFilter(e.target.value); setBranchFilter(''); setSemesterFilter(''); }}
              className="w-40"
            />
            <Select
              options={branches.filter((b) => (!courseFilter || b.course_name === courseFilter) && !b.name.toLowerCase().includes('common')).map((b) => ({ value: b.code || b.name, label: b.code || b.name }))}
              placeholder="All Branches"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-44"
            />
            {semesters.filter((s) => !courseFilter || s.course_name === courseFilter).length > 0 && (
              <Select
                options={semesters.filter((s) => !courseFilter || s.course_name === courseFilter).map((s) => ({ value: s.name, label: s.name }))}
                placeholder="All Semesters"
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="w-40"
              />
            )}
          </div>
          <DataTable
            columns={sectionColumns}
            rows={filteredSections}
            keyExtractor={(r) => r.id}
            emptyState={<EmptyState icon={Grid} title="No sections found" description="Create class sections assigned to specific course branches and semesters." actionLabel="Add Section" onAction={openAddSection} />}
          />
        </div>
      )}

      {/* ==================== 5. SUBJECTS TAB ==================== */}
      {activeTab === 'subjects' && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="p-4 border-b border-border flex flex-wrap items-center gap-3 bg-canvas/40">
            <SearchInput placeholder="Filter subjects by name or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-56" />
            {/* Cascading Filter Order: Course -> Branch -> Semester */}
            <Select
              options={courses.map((c) => ({ value: c.name, label: c.name }))}
              placeholder="All Courses"
              value={courseFilter}
              onChange={(e) => { setCourseFilter(e.target.value); setBranchFilter(''); setSemesterFilter(''); }}
              className="w-40"
            />
            <Select
              options={[
                { value: 'Common Subject (All Branches)', label: 'Common Subject (All Branches)' },
                ...branches
                  .filter((b) => (!courseFilter || b.course_name === courseFilter) && !b.name.toLowerCase().includes('common'))
                  .map((b) => ({ value: b.code || b.name, label: b.code || b.name })),
              ]}
              placeholder="All Branches"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-56"
            />
            {semesters.filter((s) => !courseFilter || s.course_name === courseFilter).length > 0 && (
              <Select
                options={semesters.filter((s) => !courseFilter || s.course_name === courseFilter).map((s) => ({ value: s.name, label: s.name }))}
                placeholder="All Semesters"
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="w-40"
              />
            )}
          </div>
          <DataTable
            columns={subjectColumns}
            rows={filteredSubjects}
            keyExtractor={(r) => r.id}
            emptyState={<EmptyState icon={BookOpen} title="No subjects found" description="Add academic subjects categorized by course, branch, and semester." actionLabel="Add Subject" onAction={openAddSubject} />}
          />
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* 2. Add / Edit Branch Modal */}
      <Modal
        isOpen={branchModal}
        onClose={() => setBranchModal(false)}
        title={editingBranch ? 'Edit Branch' : 'Add Branch'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setBranchModal(false)}>Cancel</Button>
            <Button isLoading={isSavingBranch} onClick={handleSaveBranch}>{editingBranch ? 'Save Changes' : 'Add Branch'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Course Association" required>
            <Select options={courses.map((c) => ({ value: c.name, label: c.name }))} value={branchForm.course_name} onChange={(e) => setBranchForm({ ...branchForm, course_name: e.target.value })} />
          </FormField>
          <FormField label="Branch Full Name" required>
            <Input placeholder="e.g. Electronics & Communication Engineering" value={branchForm.name} onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Branch Short Code (UI Label)" required>
              <Input placeholder="e.g. ECE" value={branchForm.code} onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })} />
            </FormField>
            <FormField label="Status">
              <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} value={branchForm.status} onChange={(e) => setBranchForm({ ...branchForm, status: e.target.value as 'active' | 'inactive' })} />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* 3. Add / Edit Semester Modal */}
      <Modal
        isOpen={semesterModal}
        onClose={() => setSemesterModal(false)}
        title={editingSemester ? 'Edit Semester' : 'Add Semester'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSemesterModal(false)}>Cancel</Button>
            <Button isLoading={isSavingSemester} onClick={handleSaveSemester}>{editingSemester ? 'Save Changes' : 'Add Semester'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Course Association" required>
            <Select options={courses.map((c) => ({ value: c.name, label: c.name }))} value={semesterForm.course_name} onChange={(e) => setSemesterForm({ ...semesterForm, course_name: e.target.value })} />
          </FormField>
          <FormField label="Semester Name" required>
            <Input placeholder="e.g. 1st Semester" value={semesterForm.name} onChange={(e) => setSemesterForm({ ...semesterForm, name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Term Type">
              <Select options={[{ value: 'Odd', label: 'Odd Semester' }, { value: 'Even', label: 'Even Semester' }]} value={semesterForm.term} onChange={(e) => setSemesterForm({ ...semesterForm, term: e.target.value as 'Odd' | 'Even' })} />
            </FormField>
            <FormField label="Status">
              <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} value={semesterForm.status} onChange={(e) => setSemesterForm({ ...semesterForm, status: e.target.value as 'active' | 'inactive' })} />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* 4. Add / Edit Section Modal */}
      <Modal
        isOpen={sectionModal}
        onClose={() => setSectionModal(false)}
        title={editingSection ? 'Edit Section' : 'Add Section'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSectionModal(false)}>Cancel</Button>
            <Button isLoading={isSavingSection} onClick={handleSaveSection}>{editingSection ? 'Save Changes' : 'Add Section'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Course" required>
            <Select
              options={courses.map((c) => ({ value: c.name, label: c.name }))}
              value={sectionForm.course_name}
              onChange={(e) => setSectionForm({ ...sectionForm, course_name: e.target.value, branch_name: branches.find(b => b.course_name === e.target.value && !b.name.toLowerCase().includes('common'))?.code || '' })}
            />
          </FormField>
          <FormField label="Branch" required>
            <Select
              options={branches.filter(b => b.course_name === sectionForm.course_name && !b.name.toLowerCase().includes('common')).map((b) => ({ value: b.code || b.name, label: b.code || b.name }))}
              value={sectionForm.branch_name}
              onChange={(e) => setSectionForm({ ...sectionForm, branch_name: e.target.value })}
            />
          </FormField>
          {semesters.filter(s => s.course_name === sectionForm.course_name).length > 0 && (
            <FormField label="Semester" required>
              <Select
                options={semesters.filter(s => s.course_name === sectionForm.course_name).map((s) => ({ value: s.name, label: s.name }))}
                value={sectionForm.semester_name}
                onChange={(e) => setSectionForm({ ...sectionForm, semester_name: e.target.value })}
              />
            </FormField>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Section Name" required>
              <Input placeholder="e.g. A, B, D" value={sectionForm.name} onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })} />
            </FormField>
            <FormField label="Student Capacity">
              <Input type="number" value={sectionForm.capacity} onChange={(e) => setSectionForm({ ...sectionForm, capacity: Number(e.target.value) })} />
            </FormField>
          </div>
          <FormField label="Status">
            <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} value={sectionForm.status} onChange={(e) => setSectionForm({ ...sectionForm, status: e.target.value as 'active' | 'inactive' })} />
          </FormField>
        </div>
      </Modal>

      {/* 5. Add / Edit Subject Modal */}
      <Modal
        isOpen={subjectModal}
        onClose={() => setSubjectModal(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSubjectModal(false)}>Cancel</Button>
            <Button isLoading={isSavingSubject} onClick={handleSaveSubject}>{editingSubject ? 'Save Changes' : 'Add Subject'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Course Association" required>
            <Select
              options={courses.map((c) => ({ value: c.name, label: c.name }))}
              value={subjectForm.course_name}
              onChange={(e) => {
                const newCourse = e.target.value
                const newBranches = branches.filter((b) => b.course_name === newCourse && !b.name.toLowerCase().includes('common'))
                const newSemesters = semesters.filter((s) => s.course_name === newCourse)
                setSubjectForm({
                  ...subjectForm,
                  course_name: newCourse,
                  branch_name: isCommonSubject ? 'Common Subject (All Branches)' : (newBranches[0]?.code || newBranches[0]?.name || 'ECE'),
                  semester_name: newSemesters[0]?.name || '',
                })
              }}
            />
          </FormField>

          {/* Common Subject Checkbox */}
          <div className="flex items-center gap-2.5 py-1 px-3 bg-purple-50/70 rounded-lg border border-purple-200/80">
            <input
              type="checkbox"
              id="is_common_cb"
              checked={isCommonSubject}
              onChange={(e) => {
                const checked = e.target.checked
                setIsCommonSubject(checked)
                if (checked) {
                  setSubjectForm({ ...subjectForm, branch_name: 'Common Subject (All Branches)' })
                } else {
                  const avail = branches.filter((b) => b.course_name === subjectForm.course_name && !b.name.toLowerCase().includes('common'))
                  setSubjectForm({ ...subjectForm, branch_name: avail[0]?.code || avail[0]?.name || 'ECE' })
                }
              }}
              className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="is_common_cb" className="text-sm font-semibold text-purple-900 cursor-pointer select-none">
              Common Subject (Applies to All Branches)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!isCommonSubject ? (
              <FormField label="Branch / Department" required>
                <Select
                  options={[
                    { value: 'Common Subject (All Branches)', label: 'Common Subject (All Branches)' },
                    ...branches.filter((b) => b.course_name === subjectForm.course_name && !b.name.toLowerCase().includes('common')).map((b) => ({ value: b.code || b.name, label: `${b.code} - ${b.name}` })),
                  ]}
                  value={subjectForm.branch_name}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === 'Common Subject (All Branches)') {
                      setIsCommonSubject(true)
                    } else {
                      setIsCommonSubject(false)
                    }
                    setSubjectForm({ ...subjectForm, branch_name: val })
                  }}
                />
              </FormField>
            ) : (
              <FormField label="Branch / Department">
                <Input value="Common Subject (All Branches)" disabled className="bg-canvas/80 text-ink-500 font-medium" />
              </FormField>
            )}

            {/* Semester positioned immediately BEFORE Subject Name */}
            {semesters.filter((s) => s.course_name === subjectForm.course_name).length > 0 ? (
              <FormField label="Semester" required>
                <Select
                  options={semesters.filter((s) => s.course_name === subjectForm.course_name).map((s) => ({ value: s.name, label: s.name }))}
                  value={subjectForm.semester_name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, semester_name: e.target.value })}
                />
              </FormField>
            ) : (
              <FormField label="Semester">
                <Input value="N/A (No Semesters for Diploma)" disabled className="bg-canvas/80 text-ink-400 font-medium text-xs" />
              </FormField>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Subject Name" required>
              <Input
                placeholder="e.g. Engineering Mathematics-I"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              />
            </FormField>
            <FormField label="Subject Code" required>
              <Input
                placeholder="e.g. BAS-101"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Subject Type">
              <Select
                options={[
                  { value: 'Theory', label: 'Theory' },
                  { value: 'Practical', label: 'Practical' },
                  { value: 'Elective', label: 'Elective' },
                ]}
                value={subjectForm.type}
                onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value as any })}
              />
            </FormField>
            <FormField label="Credits">
              <Input
                type="number"
                min={1}
                max={10}
                value={subjectForm.credits}
                onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) || 4 })}
              />
            </FormField>
            <FormField label="Status">
              <Select
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                value={subjectForm.status}
                onChange={(e) => setSubjectForm({ ...subjectForm, status: e.target.value as any })}
              />
            </FormField>
          </div>
        </div>
      </Modal>
    </div>
  )
}
