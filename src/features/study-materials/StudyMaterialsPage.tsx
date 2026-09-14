import { useState, useMemo } from 'react'
import {
  Button,
  Modal,
  FormField,
  Input,
  Select,
  FileUpload,
  SearchInput,
  useToast,
  Textarea,
} from '../../components/ui'
import {
  Plus,
  Download,
  Eye,
  Trash2,
  Pencil,
  FileText,
  Link as LinkIcon,
  Crown,
  CheckCircle2,
  BookOpen,
  Filter,
} from 'lucide-react'
import { useAuth } from '../../app/providers/AuthProvider'
import { hasPermission } from '../../services/permissionService'
import {
  useStudyMaterialStore,
  type StudyMaterialItem,
  type MaterialCategory,
  type ContentType,
  type AccessType,
  CATEGORIES,
} from '../../lib/studyMaterialStore'

import {
  useAcademicStore,
  YEARS_BY_COURSE,
  BRANCH_MAP,
  BRANCH_CODE_MAP,
} from '../../lib/academicStore'

function normalizeSemesterStr(str: string): string {
  if (!str) return ''
  const m = str.match(/\d+/)
  return m ? m[0] : str.toLowerCase().trim()
}

function isBranchMatch(subjectBranch: string, selectedBranch: string, isCommon?: boolean): boolean {
  if (isCommon || subjectBranch === 'Common Subject' || subjectBranch === 'All Branches' || subjectBranch === 'All Branches / Common') {
    return true
  }
  if (!selectedBranch || selectedBranch === 'All' || selectedBranch === 'All Branches') return true
  if (subjectBranch === selectedBranch) return true
  if (BRANCH_MAP[subjectBranch] === selectedBranch) return true
  if (BRANCH_CODE_MAP[subjectBranch] === selectedBranch) return true
  if (BRANCH_MAP[selectedBranch] === subjectBranch) return true
  if (BRANCH_CODE_MAP[selectedBranch] === subjectBranch) return true
  return false
}

const getSemestersForCourse = (c: string): string[] => {
  if (c === 'MBA') return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4']
  if (c === 'Diploma') return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6']
  return [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
  ]
}

export function StudyMaterialsPage() {
  const { user, role } = useAuth()
  const { toast } = useToast()
  const { students, subjects, teachers, classes, getTeacherForUser } = useAcademicStore()
  const {
    materials,
    getStudentMaterials,
    saveMaterial,
    deleteMaterial,
    courses,
    branchesByCourse,
  } = useStudyMaterialStore()

  const isSuperAdmin = role === 'super_admin'
  const isAdmin = role === 'admin' || isSuperAdmin
  const isTeacher = role === 'teacher'
  const isStudent = role === 'student'
  const isParent = role === 'parent'
  const isManagement = isAdmin || isTeacher

  const canUploadMaterial = isAdmin || (isTeacher && hasPermission(user, 'materials.create'))
  const canEditMaterial = isAdmin || (isTeacher && hasPermission(user, 'materials.edit'))
  const canDeleteMaterial = isAdmin || (isTeacher && hasPermission(user, 'materials.delete'))

  // Teacher Profile & Assigned Classes Extraction
  const teacherRecord = isTeacher ? getTeacherForUser(user) || teachers.find(t => t.email === user?.email || t.id === user?.id) : null
  const teacherAssignedClasses = useMemo(() => {
    if (!isTeacher || !teacherRecord) return []
    const rawAssigned = teacherRecord.assigned_classes || []
    
    // Also include classes where teacher_id or teacher_name matches
    const classObjs = classes.filter(
      c => c.teacher_id === teacherRecord.id || c.teacher_name === teacherRecord.name
    )
    const classObjNames = classObjs.map(c => c.name)

    const allAssigned = Array.from(new Set([...rawAssigned, ...classObjNames]))
    return allAssigned
  }, [isTeacher, teacherRecord, classes])

  // Student Profile Extraction
  const currentStudentObj = useMemo(() => {
    if (isStudent) {
      return students.find((s) => s.id === user?.student_id || s.student_id === user?.student_id || s.email === user?.email || s.id === user?.id) || students[0]
    }
    if (isParent) {
      return students.find((s) => s.parent_email === user?.email || (s as any).parent_id === user?.id || s.id === (user as any)?.child_student_id) || students[0]
    }
    return null
  }, [isStudent, isParent, students, user])

  // Student / Parent Academic Profile
  const studentCourse = currentStudentObj?.course || (user as any)?.course || 'B.Tech'
  const studentBranch = currentStudentObj?.branch || (user as any)?.branch || 'ECE'
  const studentYear = currentStudentObj?.year || (user as any)?.year || '1st Year'
  const studentSemester = currentStudentObj?.semester || (user as any)?.semester || 'Semester 1'
  const studentSection = currentStudentObj?.section || (user as any)?.section || 'A'

  // Top Filter Bar State for Admin & Teacher
  const [filterCourse, setFilterCourse] = useState<string>('All')
  const [filterBranch, setFilterBranch] = useState<string>('All')
  const [filterSemester, setFilterSemester] = useState<string>('All')

  // Search & Category Filters State
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Modal State for Add / Edit Material
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<StudyMaterialItem | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Academic Form State inside Modal
  const [course, setCourse] = useState('B.Tech')
  const [branch, setBranch] = useState('ECE')
  const [year, setYear] = useState('1st Year')
  const [semester, setSemester] = useState('Semester 1')
  const [section, setSection] = useState('All')
  const [subjectId, setSubjectId] = useState('')
  const [title, setTitle] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<MaterialCategory>('Handwritten Notes')
  const [contentType, setContentType] = useState<ContentType>('PDF')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [materialLink, setMaterialLink] = useState('')
  const [accessType, setAccessType] = useState<AccessType>('Free')

  // Available Courses for Top Filter (Restricted for Teacher)
  const topAvailableCourses = useMemo(() => {
    if (!isTeacher || teacherAssignedClasses.length === 0) return courses
    const set = new Set<string>()
    courses.forEach(c => {
      if (teacherAssignedClasses.some(ac => ac.toLowerCase().includes(c.toLowerCase()))) {
        set.add(c)
      }
    })
    return set.size > 0 ? Array.from(set) : courses
  }, [isTeacher, teacherAssignedClasses, courses])

  // Available Branches for Top Filter (Cascading based on filterCourse)
  const topAvailableBranches = useMemo(() => {
    let baseBranches: string[] = []
    if (filterCourse !== 'All') {
      baseBranches = branchesByCourse[filterCourse] || []
    } else {
      const set = new Set<string>()
      Object.values(branchesByCourse).forEach(arr => arr.forEach(b => set.add(b)))
      baseBranches = Array.from(set)
    }

    if (!isTeacher || teacherAssignedClasses.length === 0) return baseBranches
    const filtered = baseBranches.filter(b =>
      teacherAssignedClasses.some(ac => ac.toLowerCase().includes(b.toLowerCase()))
    )
    return filtered.length > 0 ? filtered : baseBranches
  }, [filterCourse, branchesByCourse, isTeacher, teacherAssignedClasses])

  // Available Semesters for Top Filter (Cascading based on filterCourse)
  const topAvailableSemesters = useMemo(() => {
    if (filterCourse !== 'All') {
      return getSemestersForCourse(filterCourse)
    }
    return [
      'Semester 1',
      'Semester 2',
      'Semester 3',
      'Semester 4',
      'Semester 5',
      'Semester 6',
      'Semester 7',
      'Semester 8',
    ]
  }, [filterCourse])

  // Available Courses inside Modal (Filtered for Teacher if restricted)
  const availableCourses = useMemo(() => {
    if (!isTeacher || teacherAssignedClasses.length === 0) return courses
    const set = new Set<string>()
    courses.forEach(c => {
      if (teacherAssignedClasses.some(ac => ac.toLowerCase().includes(c.toLowerCase()))) {
        set.add(c)
      }
    })
    return set.size > 0 ? Array.from(set) : courses
  }, [isTeacher, teacherAssignedClasses, courses])

  // Dynamic branch options inside Modal based on selected Course
  const availableBranches = useMemo(() => {
    const branches = branchesByCourse[course] || []
    if (!isTeacher || teacherAssignedClasses.length === 0) {
      return ['Common Subject', ...branches]
    }
    const filtered = branches.filter(b => 
      teacherAssignedClasses.some(ac => ac.toLowerCase().includes(b.toLowerCase()))
    )
    return ['Common Subject', ...(filtered.length > 0 ? filtered : branches)]
  }, [course, branchesByCourse, isTeacher, teacherAssignedClasses])

  // Dynamic Year options inside Modal
  const availableYears = useMemo(() => {
    const yList = YEARS_BY_COURSE(course)
    if (!isTeacher || teacherAssignedClasses.length === 0) return yList
    const filtered = yList.filter(y =>
      teacherAssignedClasses.some(ac => ac.toLowerCase().includes(y.toLowerCase()))
    )
    return filtered.length > 0 ? filtered : yList
  }, [course, isTeacher, teacherAssignedClasses])

  // Dynamic semester options inside Modal based on selected Course
  const availableSemesters = useMemo(() => {
    return getSemestersForCourse(course)
  }, [course])

  // Dynamic Subjects from Supabase / academicStore for Modal
  const modalAvailableSubjects = useMemo(() => {
    const normSem = normalizeSemesterStr(semester)
    return subjects.filter((s) => {
      // Course match
      if (s.course_name && s.course_name !== course) return false
      
      // Semester match
      if (s.semester_name && normSem) {
        if (normalizeSemesterStr(s.semester_name) !== normSem) return false
      }

      // Branch match
      const isCommon = (s as any).is_common || s.subject_type === 'common' || s.branch_name === 'Common Subject'
      if (branch !== 'Common Subject' && !isCommon) {
        if (!isBranchMatch(s.branch_name, branch, isCommon)) {
          if ((s as any).applicable_branches && Array.isArray((s as any).applicable_branches)) {
            const matchApp = (s as any).applicable_branches.some((ab: string) => isBranchMatch(ab, branch))
            if (!matchApp) return false
          } else {
            return false
          }
        }
      }
      return true
    })
  }, [subjects, course, branch, semester])

  // Handle Subject Select Dropdown Change inside Modal
  const handleSubjectChange = (selectedId: string) => {
    setSubjectId(selectedId)
    if (selectedId === 'CUSTOM' || !selectedId) {
      if (selectedId === '') {
        setSubjectName('')
        setSubjectCode('')
      }
      return
    }

    const found = subjects.find(s => s.id === selectedId) || modalAvailableSubjects.find(s => s.id === selectedId)
    if (found) {
      setSubjectName(found.name)
      setSubjectCode(found.code)
    }
  }

  // Reset / Open Add Material Modal
  const handleOpenAdd = () => {
    setEditingItem(null)
    const defaultCourse = availableCourses[0] || 'B.Tech'
    setCourse(defaultCourse)

    const defaultBranch = availableBranches[0] || 'Common Subject'
    setBranch(defaultBranch)

    const defaultYears = YEARS_BY_COURSE(defaultCourse)
    const defaultYear = availableYears[0] || defaultYears[0] || '1st Year'
    setYear(defaultYear)

    const defaultSems = getSemestersForCourse(defaultCourse)
    setSemester(defaultSems[0] || 'Semester 1')

    setSection('All')
    setSubjectId('')
    setTitle('')
    setSubjectName('')
    setSubjectCode('')
    setDescription('')
    setCategory('Handwritten Notes')
    setContentType('PDF')
    setSelectedFile(null)
    setMaterialLink('')
    setAccessType('Free')
    setUploadProgress(0)
    setIsSaving(false)
    setShowModal(true)
  }

  // Open Edit Material Modal
  const handleOpenEdit = (m: StudyMaterialItem) => {
    // Check permission for Teacher
    if (isTeacher) {
      const isOwner = m.uploaded_by === user?.id || m.uploader === user?.name || m.uploader === teacherRecord?.name
      if (!isOwner) {
        toast({ type: 'error', title: 'Permission Denied', description: 'Teachers can only edit their own uploaded materials.' })
        return
      }
    }

    setEditingItem(m)
    setCourse(m.course || 'B.Tech')
    setBranch(m.is_common_subject ? 'Common Subject' : (m.branch || 'ECE'))
    setYear(m.year || '1st Year')
    setSemester(m.semester || 'Semester 1')
    setSection(m.section || 'All')
    
    // Match subject id if existing
    const matchSub = subjects.find(s => s.id === m.subject_id || s.name.toLowerCase() === (m.subject_name || '').toLowerCase())
    setSubjectId(matchSub ? matchSub.id : (m.subject_id || 'CUSTOM'))
    setSubjectName(m.subject_name || '')
    setSubjectCode(m.subject_code || '')
    
    setTitle(m.title)
    setDescription(m.description || '')
    setCategory(m.category || 'Handwritten Notes')
    setContentType(m.content_type || 'PDF')
    setSelectedFile(null)
    setMaterialLink(m.content_type === 'Link' ? m.url : '')
    setAccessType(m.access_type || 'Free')
    setUploadProgress(0)
    setIsSaving(false)
    setShowModal(true)
  }

  // Validate & Save Handler
  const handleSave = async () => {
    if (isSaving) return

    if (!course) {
      toast({ type: 'error', title: 'Please select a Course.' })
      return
    }
    if (!branch) {
      toast({ type: 'error', title: 'Please select a Branch or Common Subject.' })
      return
    }
    if (!semester) {
      toast({ type: 'error', title: 'Please select a Semester.' })
      return
    }
    if (!subjectName.trim()) {
      toast({ type: 'error', title: 'Please select a valid Subject.' })
      return
    }
    if (!subjectCode.trim()) {
      toast({ type: 'error', title: 'Subject Code is missing for selected subject.' })
      return
    }
    if (!title.trim()) {
      toast({ type: 'error', title: 'Material Title is required.' })
      return
    }

    if (contentType === 'PDF' && !editingItem && !selectedFile) {
      toast({ type: 'error', title: 'Please upload a PDF file.' })
      return
    }

    if (contentType === 'Link') {
      if (!materialLink.trim()) {
        toast({ type: 'error', title: 'Please enter a valid Material Link URL.' })
        return
      }
      try {
        new URL(materialLink.startsWith('http') ? materialLink : `https://${materialLink}`)
      } catch {
        toast({ type: 'error', title: 'Invalid URL format for Material Link.' })
        return
      }
    }

    // Teacher Restriction Verification
    if (isTeacher && teacherAssignedClasses.length > 0) {
      const isCommon = branch === 'Common Subject'
      if (!isCommon) {
        const matchesAssignment = teacherAssignedClasses.some(ac => {
          const norm = ac.toLowerCase()
          return norm.includes(course.toLowerCase()) && norm.includes(branch.toLowerCase())
        })

        if (!matchesAssignment) {
          toast({
            type: 'error',
            title: 'Class Assignment Restricted',
            description: `You are not assigned to ${course} ${branch}. Material can only be added to your assigned classes.`,
          })
          return
        }
      }
    }

    setIsSaving(true)
    setUploadProgress(25)

    try {
      setUploadProgress(50)
      const isCommon = branch === 'Common Subject'
      const finalUrl =
        contentType === 'Link'
          ? materialLink.startsWith('http')
            ? materialLink
            : `https://${materialLink}`
          : editingItem?.url || ''

      const fileSize =
        contentType === 'Link'
          ? 'Web Link'
          : selectedFile
            ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
            : editingItem?.size || '1.0 MB'

      setUploadProgress(75)

      await saveMaterial({
        id: editingItem ? editingItem.id : undefined,
        course,
        branch: isCommon ? 'Common Subject' : branch,
        year,
        semester,
        section: section || 'All',
        is_common_subject: isCommon,
        title: title.trim(),
        subject_id: subjectId !== 'CUSTOM' ? subjectId : undefined,
        subject_name: subjectName.trim(),
        subject_code: subjectCode.trim().toUpperCase(),
        description: description.trim(),
        category,
        content_type: contentType,
        url: finalUrl,
        size: fileSize,
        access_type: accessType,
        uploader: user?.name || (isTeacher ? teacherRecord?.name || 'Faculty Member' : 'Admin'),
        uploaded_by: user?.id,
        uploaded_by_role: role || 'Admin',
        college_id: editingItem?.college_id || user?.college_id || user?.school_id,
        fileToUpload: contentType === 'PDF' ? selectedFile : null,
      })

      setUploadProgress(100)

      toast({
        type: 'success',
        title: editingItem
          ? 'Study material updated successfully.'
          : 'Study material uploaded successfully.',
      })

      setIsSaving(false)
      setShowModal(false)
    } catch (err: any) {
      setIsSaving(false)
      toast({
        type: 'error',
        title: 'Save Failed',
        description: err.message || 'Failed to save study material to Supabase',
      })
    }
  }

  // Delete Handler
  const handleDelete = async (m: StudyMaterialItem) => {
    if (isTeacher) {
      const isOwner = m.uploaded_by === user?.id || m.uploader === user?.name || m.uploader === teacherRecord?.name
      if (!isOwner) {
        toast({ type: 'error', title: 'Permission Denied', description: 'Teachers can only delete their own uploaded materials.' })
        return
      }
    }

    if (confirm(`Are you sure you want to delete material "${m.title}"?`)) {
      try {
        await deleteMaterial(m.id)
        toast({ type: 'info', title: 'Study material deleted.' })
      } catch (err: any) {
        toast({ type: 'error', title: 'Delete Failed', description: err.message || 'Failed to delete study material' })
      }
    }
  }

  // Material Preview / Download Handler
  const handleAccessMaterial = (item: StudyMaterialItem, action: 'view' | 'download') => {
    if (item.access_type === 'Premium' && (isStudent || isParent)) {
      toast({
        type: 'warning',
        title: 'Premium Content Locked',
        description: 'This is a premium resource. Please upgrade your subscription to access.',
      })
      return
    }

    if (action === 'view') {
      window.open(item.url, '_blank')
      toast({ type: 'info', title: `Opening preview for "${item.title}"` })
    } else {
      if (item.content_type === 'Link') {
        window.open(item.url, '_blank')
        return
      }
      
      // Direct PDF Download
      fetch(item.url)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(blobUrl)
          toast({ type: 'success', title: `Downloading "${item.title}"` })
        })
        .catch(() => {
          const link = document.createElement('a')
          link.href = item.url
          link.target = '_blank'
          link.download = `${item.title}.pdf`
          link.click()
          toast({ type: 'success', title: `Downloading "${item.title}"` })
        })
    }
  }

  // Data Filtering Logic
  const filteredMaterials = useMemo(() => {
    let list: StudyMaterialItem[] = []

    if (isStudent || isParent) {
      // Automatic Academic Scoping for Student / Parent
      list = getStudentMaterials(studentCourse, studentBranch, studentYear, studentSemester, studentSection)
    } else {
      // Management (Admin & Teacher)
      list = materials
    }

    // Apply Admin / Teacher Cascading Academic Filters
    if (isManagement) {
      if (filterCourse !== 'All') {
        list = list.filter((m) => m.course === filterCourse)
      }
      if (filterBranch !== 'All') {
        list = list.filter((m) => {
          const isCommon = m.is_common_subject || m.branch === 'Common Subject' || m.branch === 'All Branches'
          return isCommon || isBranchMatch(m.branch, filterBranch)
        })
      }
      if (filterSemester !== 'All') {
        const normFilterSem = normalizeSemesterStr(filterSemester)
        list = list.filter((m) => normalizeSemesterStr(m.semester) === normFilterSem)
      }
    }

    // Apply Search Filter (Title, Subject Name, Subject Code, Description)
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.subject_name.toLowerCase().includes(q) ||
          m.subject_code.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      )
    }

    // Apply Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter((m) => m.category === selectedCategory)
    }

    return list
  }, [
    isStudent,
    isParent,
    studentCourse,
    studentBranch,
    studentYear,
    studentSemester,
    studentSection,
    getStudentMaterials,
    materials,
    isManagement,
    filterCourse,
    filterBranch,
    filterSemester,
    search,
    selectedCategory,
  ])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900">Study Materials</h1>
          <p className="text-sm text-ink-400 mt-1">
            {isStudent || isParent
              ? `Curated learning resources for ${studentCourse} ${studentBranch} (${studentYear} - ${studentSemester})`
              : 'Upload, manage, and distribute course study materials across academic departments.'}
          </p>
        </div>
        {isManagement && canUploadMaterial && (
          <Button onClick={handleOpenAdd} className="shrink-0">
            <Plus className="h-4 w-4" /> Add Study Material
          </Button>
        )}
      </div>

      {/* Student Academic Info Banner (Shown for Student & Parent Views) */}
      {(isStudent || isParent) && (
        <div className="bg-brand-50/60 border border-brand-200/80 rounded-[var(--radius-card)] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-600 text-white rounded-[var(--radius-btn)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Academic Curriculum
              </p>
              <h3 className="text-sm font-bold text-ink-900">
                {studentCourse} • {studentBranch} • {studentYear} ({studentSemester}) {studentSection ? `• Sec ${studentSection}` : ''}
              </h3>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-surface border border-brand-200 text-brand-700 rounded-full">
            Auto-Filtered Scope
          </span>
        </div>
      )}

      {/* Cascading Academic Filters Bar (Admin & Teacher) */}
      {isManagement && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Course">
            <Select
              options={[
                { value: 'All', label: 'All Courses' },
                ...topAvailableCourses.map((c) => ({ value: c, label: c })),
              ]}
              value={filterCourse}
              onChange={(e) => {
                const newC = e.target.value
                setFilterCourse(newC)
                setFilterBranch('All')
                setFilterSemester('All')
              }}
            />
          </FormField>

          <FormField label="Branch">
            <Select
              options={[
                { value: 'All', label: 'All Branches' },
                ...topAvailableBranches.map((b) => ({ value: b, label: b })),
              ]}
              value={filterBranch}
              onChange={(e) => {
                setFilterBranch(e.target.value)
                setFilterSemester('All')
              }}
            />
          </FormField>

          <FormField label="Semester">
            <Select
              options={[
                { value: 'All', label: 'All Semesters' },
                ...topAvailableSemesters.map((s) => ({ value: s, label: s })),
              ]}
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
            />
          </FormField>
        </div>
      )}

      {/* Controls Bar: Search Input & Category Pills */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchInput
            placeholder="Search material title, subject name, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80"
          />

          <div className="text-xs text-ink-400 font-medium">
            Showing <span className="font-bold text-ink-900">{filteredMaterials.length}</span> resources
          </div>
        </div>

        {/* Category Tabs / Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <span className="text-xs font-bold text-ink-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Categories:
          </span>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-[var(--radius-btn)] text-xs font-semibold transition-colors cursor-pointer border ${
              selectedCategory === 'All'
                ? 'border-brand-600 bg-brand-100 text-brand-700'
                : 'border-border bg-canvas text-ink-600 hover:border-ink-400'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-[var(--radius-btn)] text-xs font-semibold transition-colors cursor-pointer border ${
                  isSelected
                    ? 'border-brand-600 bg-brand-100 text-brand-700'
                    : 'border-border bg-canvas text-ink-600 hover:border-ink-400'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Material Grid Cards */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((m) => {
            const isPremium = m.access_type === 'Premium'
            const isOwner = m.uploaded_by === user?.id || m.uploader === user?.name || m.uploader === teacherRecord?.name
            const canManageThis = isAdmin || (isTeacher && isOwner)

            return (
              <div
                key={m.id}
                className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] p-5 group flex flex-col justify-between hover:shadow-md transition-all duration-200 relative overflow-hidden"
              >
                {/* Free / Premium Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {isPremium ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <Crown className="h-3 w-3 text-amber-600" /> Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Free
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2 pr-20">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        m.content_type === 'PDF'
                          ? 'bg-danger-100 text-danger-600'
                          : 'bg-info-100 text-info-600'
                      }`}
                    >
                      {m.content_type}
                    </span>
                    <span className="text-xs text-ink-400 font-medium">{m.size}</span>
                  </div>

                  <h3 className="text-base font-semibold text-ink-900 mb-1 leading-snug line-clamp-2">
                    {m.title}
                  </h3>

                  <p className="text-xs text-brand-700 font-bold mb-2">
                    {m.subject_name} {m.subject_code ? `(${m.subject_code})` : ''}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 bg-canvas border border-border text-ink-600 text-[11px] rounded font-medium">
                      {m.course}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[11px] rounded font-medium border ${
                        m.is_common_subject || m.branch === 'Common Subject'
                          ? 'bg-purple-100 border-purple-200 text-purple-700'
                          : 'bg-canvas border-border text-ink-600'
                      }`}
                    >
                      {m.is_common_subject || m.branch === 'Common Subject' ? 'Common Subject' : m.branch}
                    </span>
                    <span className="px-2 py-0.5 bg-canvas border border-border text-ink-600 text-[11px] rounded font-medium">
                      {m.semester}
                    </span>
                    {m.section && m.section !== 'All' && (
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded font-medium">
                        Sec {m.section}
                      </span>
                    )}
                  </div>

                  {m.description && (
                    <p className="text-xs text-ink-400 mb-3 line-clamp-2 leading-relaxed">
                      {m.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-2">
                  <div>
                    <p className="text-[11px] text-ink-400">
                      By {m.uploader} • {m.date}
                    </p>
                    <p className="text-[11px] font-semibold text-brand-600 mt-0.5">
                      {m.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAccessMaterial(m, 'view')}
                      className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-brand-600 transition-colors cursor-pointer"
                      aria-label="View Material"
                      title={m.content_type === 'Link' ? 'Open Link' : 'Preview PDF'}
                    >
                      {m.content_type === 'Link' ? (
                        <LinkIcon className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    {m.content_type === 'PDF' && (
                      <button
                        onClick={() => handleAccessMaterial(m, 'download')}
                        className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-brand-600 transition-colors cursor-pointer"
                        aria-label="Download Material"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}

                    {/* Edit & Delete Actions */}
                    {canManageThis && (
                      <>
                        {canEditMaterial && (
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 rounded hover:bg-canvas text-ink-400 hover:text-ink-900 transition-colors cursor-pointer"
                            aria-label="Edit Material"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {canDeleteMaterial && (
                          <button
                            onClick={() => handleDelete(m)}
                            className="p-1.5 rounded hover:bg-danger-100 text-ink-400 hover:text-danger-600 transition-colors cursor-pointer"
                            aria-label="Delete Material"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-12 text-center">
          <FileText className="h-10 w-10 text-ink-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-ink-900">No Study Materials Found</h3>
          <p className="text-xs text-ink-400 max-w-md mx-auto mt-1">
            {isStudent || isParent
              ? `No resources uploaded yet for ${studentCourse} ${studentBranch} (${studentSemester}) under "${selectedCategory}".`
              : 'No materials match the current search or academic filter selections.'}
          </p>
        </div>
      )}

      {/* Add / Edit Material Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !isSaving && setShowModal(false)}
        title={editingItem ? 'Edit Study Material' : 'Add Study Material'}
        subtitle="Select academic course, branch, semester, subject, and content resource"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving
                ? editingItem
                  ? 'Saving Changes...'
                  : 'Uploading...'
                : editingItem
                  ? 'Save Changes'
                  : 'Add Material'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Progress Bar during save */}
          {isSaving && (
            <div className="w-full bg-border h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-brand-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* 1. SELECT COURSE */}
          <FormField label="1. Course" required>
            <Select
              options={availableCourses.map((c) => ({ value: c, label: c }))}
              value={course}
              onChange={(e) => {
                const newCourse = e.target.value
                setCourse(newCourse)

                const newBranches = branchesByCourse[newCourse] || []
                setBranch(newBranches[0] || 'Common Subject')

                const newYears = YEARS_BY_COURSE(newCourse)
                setYear(newYears[0] || '1st Year')

                const newSems = getSemestersForCourse(newCourse)
                setSemester(newSems[0] || 'Semester 1')

                setSubjectId('')
                setSubjectName('')
                setSubjectCode('')
              }}
            />
          </FormField>

          {/* 2. SELECT BRANCH / COMMON SUBJECT */}
          <FormField label="2. Branch / Common Subject" required>
            <Select
              options={availableBranches.map((b) => ({
                value: b,
                label: b === 'Common Subject' ? '★ Common Subject (All Branches)' : b,
              }))}
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value)
                setSubjectId('')
                setSubjectName('')
                setSubjectCode('')
              }}
            />
          </FormField>

          {/* 3. SELECT YEAR & SEMESTER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="3. Year" required>
              <Select
                options={availableYears.map((y) => ({ value: y, label: y }))}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </FormField>

            <FormField label="4. Semester" required>
              <Select
                options={availableSemesters.map((s) => ({ value: s, label: s }))}
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value)
                  setSubjectId('')
                  setSubjectName('')
                  setSubjectCode('')
                }}
              />
            </FormField>
          </div>

          {/* 5. SECTION SCOPING */}
          <FormField label="5. Section Scoping (Optional)">
            <Select
              options={[
                { value: 'All', label: 'All Sections (Common)' },
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
                { value: 'C', label: 'Section C' },
                { value: 'D', label: 'Section D' },
              ]}
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </FormField>

          {/* 6. SELECT DYNAMIC SUBJECT (FROM SUPABASE) */}
          <FormField label="6. Subject Selection (Dynamic from Supabase)" required>
            <Select
              options={[
                {
                  value: '',
                  label: modalAvailableSubjects.length > 0 ? '-- Select Applicable Subject --' : 'No subjects available for selected combination',
                },
                ...modalAvailableSubjects.map((s) => ({
                  value: s.id,
                  label: `${s.name} — ${s.code}${(s as any).is_common || s.subject_type === 'common' ? ' ★ Common' : ''}`,
                })),
                { value: 'CUSTOM', label: '+ Enter Custom Subject' },
              ]}
              value={subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
            />
          </FormField>

          {/* 7. SUBJECT NAME & SUBJECT CODE (AUTO-POPULATED FROM DYNAMIC SELECTION) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Subject Name" required>
              <Input
                placeholder="e.g. Digital Electronics"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                readOnly={Boolean(subjectId && subjectId !== 'CUSTOM')}
                className={subjectId && subjectId !== 'CUSTOM' ? 'bg-canvas text-ink-700 font-semibold' : ''}
              />
            </FormField>
            <FormField label="Subject Code" required>
              <Input
                placeholder="e.g. BEC-402"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                readOnly={Boolean(subjectId && subjectId !== 'CUSTOM')}
                className={subjectId && subjectId !== 'CUSTOM' ? 'bg-canvas text-ink-700 font-semibold' : ''}
              />
            </FormField>
          </div>

          {/* 8. MATERIAL TITLE */}
          <FormField label="8. Material Title" required>
            <Input
              placeholder="e.g. Unit 3 Notes - Digital Communication"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormField>

          {/* 9. DESCRIPTION */}
          <FormField label="9. Description (Optional)">
            <Textarea
              placeholder="Short description or key topics covered in this material..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </FormField>

          {/* 10. MATERIAL CATEGORY */}
          <FormField label="10. Material Category" required>
            <Select
              options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              value={category}
              onChange={(e) => setCategory(e.target.value as MaterialCategory)}
            />
          </FormField>

          {/* 11. CONTENT TYPE */}
          <FormField label="11. Content Type" required>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContentType('PDF')}
                className={`py-2 px-3 rounded-[var(--radius-btn)] text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  contentType === 'PDF'
                    ? 'border-brand-600 bg-brand-100 text-brand-700'
                    : 'border-border bg-canvas text-ink-600 hover:border-ink-400'
                }`}
              >
                <FileText className="h-4 w-4" /> PDF Document
              </button>
              <button
                type="button"
                onClick={() => setContentType('Link')}
                className={`py-2 px-3 rounded-[var(--radius-btn)] text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  contentType === 'Link'
                    ? 'border-brand-600 bg-brand-100 text-brand-700'
                    : 'border-border bg-canvas text-ink-600 hover:border-ink-400'
                }`}
              >
                <LinkIcon className="h-4 w-4" /> Material Link / URL
              </button>
            </div>
          </FormField>

          {/* 12. UPLOAD PDF OR ADD LINK */}
          {contentType === 'PDF' ? (
            <FormField label={editingItem ? '12. Replace PDF File (Optional)' : '12. Upload PDF File to Supabase Storage'} required={!editingItem}>
              <FileUpload
                accept=".pdf"
                maxSizeMB={50}
                onFileSelect={(file) => setSelectedFile(file)}
              />
            </FormField>
          ) : (
            <FormField label="12. Material Resource Link / URL" required>
              <Input
                type="url"
                placeholder="https://example.com/study-material-resource"
                value={materialLink}
                onChange={(e) => setMaterialLink(e.target.value)}
              />
            </FormField>
          )}

          {/* 13. ACCESS TYPE */}
          <FormField label="13. Access Type" required>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccessType('Free')}
                className={`py-2 px-3 rounded-[var(--radius-btn)] text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  accessType === 'Free'
                    ? 'border-emerald-600 bg-emerald-100 text-emerald-800'
                    : 'border-border bg-canvas text-ink-600 hover:border-ink-400'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Free Access
              </button>
              <button
                type="button"
                onClick={() => setAccessType('Premium')}
                className={`py-2 px-3 rounded-[var(--radius-btn)] text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  accessType === 'Premium'
                    ? 'border-amber-500 bg-amber-100 text-amber-900'
                    : 'border-border bg-canvas text-ink-600 hover:border-ink-400'
                }`}
              >
                <Crown className="h-4 w-4 text-amber-600" /> Premium Content
              </button>
            </div>
          </FormField>
        </div>
      </Modal>
    </div>
  )
}
