import { useState, useMemo } from 'react'
import {
  Tabs,
  Button,
  Modal,
  FormField,
  Input,
  Select,
  SearchInput,
  AvatarInitials,
} from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import {
  COURSES,
  BRANCHES_BY_COURSE,
  YEARS_BY_COURSE,
  useAcademicStore,
  isBranchMatch,
  BRANCH_CODE_MAP,
  type TeacherRecord,
} from '../../lib/academicStore'
import { useAuth } from '../../app/providers/AuthProvider'
import { AuthService } from '../../services/authService'
import {
  useTnpStore,
  type TnpCompany,
  type PlacementDrive,
  type DriveStatus,
  type AppStatus,
  type PlacementRecord,
  type TnpActivity,
  type ActivityType,
} from '../../lib/tnpStore'
import {
  Building2,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Eye,
  UserCheck,
  Sparkles,
} from 'lucide-react'

const TNP_SPECIALIZATIONS = ['Aptitude', 'PDP', 'Technical Training'] as const
const TNP_ACTIVITY_TYPES: { type: ActivityType; label: string }[] = [
  { type: 'seminar', label: 'Seminar' },
  { type: 'event', label: 'Event' },
  { type: 'training', label: 'Training' },
  { type: 'internship', label: 'Internship' },
]

const APP_STATUSES: AppStatus[] = [
  'Applied',
  'Shortlisted',
  'Aptitude',
  'GD',
  'PI',
  'Selected',
  'Rejected',
  'Waitlisted',
]

const DRIVE_STATUSES: DriveStatus[] = [
  'Draft',
  'Registration Open',
  'Registration Closed',
  'Shortlisted',
  'In Process',
  'Completed',
  'Cancelled',
]

export function AdminTnpPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const userCollege = user?.college_id || user?.school_id
  const { students, teachers, classes, subjects, addTeacher, deleteTeacher } = useAcademicStore()
  const {
    companies,
    drives,
    applications,
    rounds,
    placements,
    activities,
    saveCompany,
    deleteCompany,
    saveDrive,
    deleteDrive,
    updateDriveStatus,
    updateApplicationStatus,
    saveRound,
    savePlacement,
    deletePlacement,
    saveActivity,
    deleteActivity,
  } = useTnpStore()

  // Navigation Sub-Tabs (Strictly 8 sections as required by PRD)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Cascading Academic Filter States
  const [courseFilter, setCourseFilter] = useState('All')
  const [branchFilter, setBranchFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Dynamic Branches for Course filter (short code list)
  const availableBranches = useMemo(() => {
    if (courseFilter === 'All') {
      const all = Object.values(BRANCHES_BY_COURSE)
        .flat()
        .map((b) => BRANCH_CODE_MAP[b] || b)
        .filter((b) => !b.toLowerCase().includes('common'))
      return Array.from(new Set(all))
    }
    return (BRANCHES_BY_COURSE[courseFilter] || [])
      .map((b) => BRANCH_CODE_MAP[b] || b)
      .filter((b) => !b.toLowerCase().includes('common'))
  }, [courseFilter])

  // Dynamic Years for Course filter
  const availableYears = useMemo(() => {
    if (courseFilter === 'All') return ['1st Year', '2nd Year', '3rd Year', '4th Year']
    return YEARS_BY_COURSE(courseFilter)
  }, [courseFilter])

  // Handle Course change
  const handleCourseChange = (val: string) => {
    setCourseFilter(val)
    setBranchFilter('All')
    setYearFilter('All')
  }

  // Filtered TNP Teachers
  const tnpTeachers = useMemo(() => {
    return teachers.filter((t) => (t.department || '').toUpperCase() === 'TNP' || isBranchMatch('TNP', t.department))
  }, [teachers])

  // Modals state
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState<TnpCompany | null>(null)

  const [showDriveModal, setShowDriveModal] = useState(false)
  const [editingDrive, setEditingDrive] = useState<PlacementDrive | null>(null)

  const [showPlacementModal, setShowPlacementModal] = useState(false)
  const [editingPlacement, setEditingPlacement] = useState<PlacementRecord | null>(null)

  const [showRoundModal, setShowRoundModal] = useState(false)
  const [selectedDriveForRound, setSelectedDriveForRound] = useState<string>('')

  // TNP Teacher Modal
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null)
  const [teacherName, setTeacherName] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [teacherQual, setTeacherQual] = useState('')
  const [teacherEmail, setTeacherEmail] = useState('')
  const [teacherPhone, setTeacherPhone] = useState('')
  const [teacherCourse, setTeacherCourse] = useState('B.Tech')
  const [teacherSelectedClasses, setTeacherSelectedClasses] = useState<string[]>([])
  const [teacherSpecialization, setTeacherSpecialization] = useState<'Aptitude' | 'PDP' | 'Technical Training'>('Aptitude')
  const [teacherPassword, setTeacherPassword] = useState('')
  const [teacherConfirmPassword, setTeacherConfirmPassword] = useState('')

  const availableClassOptions = useMemo(() => {
    const matching = classes.filter((c) => c.course === teacherCourse)
    if (matching.length > 0) {
      return matching.map((c) => ({
        id: c.id,
        label: `${c.course} ${c.branch} ${c.year} ${c.section}`,
      }))
    }
    const branches = BRANCHES_BY_COURSE[teacherCourse] || ['CSE', 'ECE', 'ME', 'Civil']
    const years = YEARS_BY_COURSE(teacherCourse)
    const fallbackList: { id: string; label: string }[] = []
    branches.forEach((b) => {
      years.forEach((y) => {
        fallbackList.push({
          id: `${teacherCourse}-${b}-${y}-A`,
          label: `${teacherCourse} ${b} ${y} Section A`,
        })
      })
    })
    return fallbackList
  }, [classes, teacherCourse])

  const availableTnpSubjects = useMemo(() => {
    const filtered = subjects.filter((s) => {
      if (teacherCourse && s.course_name && s.course_name.toLowerCase() !== teacherCourse.toLowerCase()) return false
      const isSubTnp =
        s.branch_name === 'TNP' ||
        (s.applicable_branches && s.applicable_branches.includes('TNP')) ||
        s.branch_name === 'Training and Placement Department' ||
        s.subject_type === 'TNP' ||
        ['pdp', 'aptitude', 'technical training'].includes((s.name || '').toLowerCase())
      return isSubTnp
    })

    if (filtered.length > 0) return filtered

    return [
      { id: 'pdp', name: 'PDP', code: 'PDP', course_name: teacherCourse, branch_name: 'TNP', status: 'active' },
      { id: 'apt', name: 'Aptitude', code: 'APT', course_name: teacherCourse, branch_name: 'TNP', status: 'active' },
      { id: 'tt', name: 'Technical Training', code: 'TECH_TRG', course_name: teacherCourse, branch_name: 'TNP', status: 'active' },
    ]
  }, [subjects, teacherCourse])

  const toggleTeacherClass = (classLabel: string) => {
    setTeacherSelectedClasses((prev) => {
      if (prev.includes(classLabel)) {
        return prev.filter((c) => c !== classLabel)
      }
      if (prev.length >= 6) {
        toast({
          type: 'warning',
          title: 'Class Limit Reached',
          description: 'You can assign a maximum of 6 classes to a TNP teacher.',
        })
        return prev
      }
      return [...prev, classLabel]
    })
  }

  // Unified Activity Modal & Filter
  const [activityTypeFilter, setActivityTypeFilter] = useState<'All' | ActivityType>('All')
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState<TnpActivity | null>(null)
  const [viewingActivity, setViewingActivity] = useState<TnpActivity | null>(null)

  const [actTitle, setActTitle] = useState('')
  const [actType, setActType] = useState<ActivityType>('seminar')
  const [actDesc, setActDesc] = useState('')
  const [actSpeakerTrainer, setActSpeakerTrainer] = useState('')
  const [actStartDate, setActStartDate] = useState('')
  const [actEndDate, setActEndDate] = useState('')
  const [actStartTime, setActStartTime] = useState('')
  const [actEndTime, setActEndTime] = useState('')
  const [actVenue, setActVenue] = useState('')
  const [actCourse, setActCourse] = useState('B.Tech')
  const [actBranch, setActBranch] = useState('CSE')
  const [actYear, setActYear] = useState('4th Year')
  const [actSection, setActSection] = useState('Section A')
  const [actEligibility, setActEligibility] = useState('')
  const [actDeadline, setActDeadline] = useState('')
  const [actStatus, setActStatus] = useState('Active')

  // Company Form State
  const [compName, setCompName] = useState('')
  const [compIndustry, setCompIndustry] = useState('')
  const [compWebsite, setCompWebsite] = useState('')
  const [compHrName, setCompHrName] = useState('')
  const [compHrEmail, setCompHrEmail] = useState('')
  const [compHrPhone, setCompHrPhone] = useState('')
  const [compLocation, setCompLocation] = useState('')

  // Drive Form State
  const [driveCompanyId, setDriveCompanyId] = useState('')
  const [driveName, setDriveName] = useState('')
  const [driveRole, setDriveRole] = useState('')
  const [driveRegEnd, setDriveRegEnd] = useState('')
  const [driveCourse, setDriveCourse] = useState('B.Tech')
  const [driveBranch, setDriveBranch] = useState('CSE')
  const [driveYear, setDriveYear] = useState('4th Year')
  const [driveMinCgpa, setDriveMinCgpa] = useState<number>(6.0)
  const [drivePackage, setDrivePackage] = useState('6.5 LPA')
  const [driveLocation, setDriveLocation] = useState('Noida')

  // Placement Form State
  const [plcStudentId, setPlcStudentId] = useState('')
  const [plcCompName, setPlcCompName] = useState('')
  const [plcRole, setPlcRole] = useState('')
  const [plcPackage, setPlcPackage] = useState('')
  const [plcLocation, setPlcLocation] = useState('')

  // Selection Round State
  const [roundNum, setRoundNum] = useState<number>(1)
  const [roundName, setRoundName] = useState('')
  const [roundDate, setRoundDate] = useState('')
  const [roundVenue, setRoundVenue] = useState('')

  // Modals Openers
  const openCompanyModal = (comp?: TnpCompany) => {
    if (comp) {
      setEditingCompany(comp)
      setCompName(comp.name)
      setCompIndustry(comp.industry)
      setCompWebsite(comp.website)
      setCompHrName(comp.hr_name)
      setCompHrEmail(comp.hr_email)
      setCompHrPhone(comp.hr_phone)
      setCompLocation(comp.location)
    } else {
      setEditingCompany(null)
      setCompName('')
      setCompIndustry('')
      setCompWebsite('')
      setCompHrName('')
      setCompHrEmail('')
      setCompHrPhone('')
      setCompLocation('')
    }
    setShowCompanyModal(true)
  }

  const openDriveModal = (drive?: PlacementDrive) => {
    if (drive) {
      setEditingDrive(drive)
      setDriveCompanyId(drive.company_id || '')
      setDriveName(drive.drive_name)
      setDriveRole(drive.job_role)
      setDriveRegEnd(drive.reg_end_date || '')
      setDriveCourse(drive.target_courses?.[0] || 'B.Tech')
      setDriveBranch(drive.target_branches?.[0] || 'CSE')
      setDriveYear(drive.target_years?.[0] || '4th Year')
      setDriveMinCgpa(drive.min_cgpa || 6.0)
      setDrivePackage(drive.salary_package || '')
      setDriveLocation(drive.job_location || '')
    } else {
      setEditingDrive(null)
      setDriveCompanyId(companies[0]?.id || '')
      setDriveName('')
      setDriveRole('')
      setDriveRegEnd('')
      setDriveCourse('B.Tech')
      setDriveBranch('CSE')
      setDriveYear('4th Year')
      setDriveMinCgpa(6.0)
      setDrivePackage('')
      setDriveLocation('')
    }
    setShowDriveModal(true)
  }

  const openPlacementModal = (plc?: PlacementRecord) => {
    if (plc) {
      setEditingPlacement(plc)
      setPlcStudentId(plc.student_id)
      setPlcCompName(plc.company_name)
      setPlcRole(plc.job_role)
      setPlcPackage(plc.package_amount)
      setPlcLocation(plc.location)
    } else {
      setEditingPlacement(null)
      setPlcStudentId(students[0]?.id || '')
      setPlcCompName('')
      setPlcRole('')
      setPlcPackage('')
      setPlcLocation('')
    }
    setShowPlacementModal(true)
  }

  const openRoundModal = (driveId: string) => {
    setSelectedDriveForRound(driveId)
    const existingCount = rounds.filter((r) => r.drive_id === driveId).length
    setRoundNum(existingCount + 1)
    setRoundName('')
    setRoundDate('')
    setRoundVenue('')
    setShowRoundModal(true)
  }

  const openTeacherModal = (tch?: TeacherRecord) => {
    if (tch) {
      setEditingTeacher(tch)
      setTeacherName(tch.name)
      setTeacherId(tch.teacher_id)
      setTeacherQual(tch.qualification || '')
      setTeacherEmail(tch.email || '')
      setTeacherPhone(tch.phone || '')
      setTeacherCourse(tch.course || 'B.Tech')
      setTeacherSelectedClasses(tch.assigned_classes || [])
      setTeacherSpecialization((tch.assigned_subjects?.[0] as any) || 'Aptitude')
      setTeacherPassword('')
      setTeacherConfirmPassword('')
    } else {
      setEditingTeacher(null)
      setTeacherName('')
      setTeacherId(`TNP-${Math.floor(100 + Math.random() * 900)}`)
      setTeacherQual('')
      setTeacherEmail('')
      setTeacherPhone('')
      setTeacherCourse('B.Tech')
      setTeacherSelectedClasses([])
      setTeacherSpecialization('Aptitude')
      setTeacherPassword('')
      setTeacherConfirmPassword('')
    }
    setShowTeacherModal(true)
  }

  const openActivityModal = (act?: TnpActivity, initialType?: ActivityType) => {
    if (act) {
      setEditingActivity(act)
      setActType(act.activity_type)
      setActTitle(act.title)
      setActDesc(act.description || '')
      setActSpeakerTrainer(act.speaker_trainer_organizer || '')
      setActStartDate(act.start_date || '')
      setActEndDate(act.end_date || '')
      setActStartTime(act.start_time || '')
      setActEndTime(act.end_time || '')
      setActVenue(act.venue || '')
      setActCourse(act.course || 'B.Tech')
      setActBranch(act.branch || 'CSE')
      setActYear(act.year || '4th Year')
      setActSection(act.section || 'Section A')
      setActEligibility(act.eligibility || '')
      setActDeadline(act.application_deadline || '')
      setActStatus(act.status || 'Active')
    } else {
      setEditingActivity(null)
      setActType(initialType || (activityTypeFilter !== 'All' ? activityTypeFilter : 'seminar'))
      setActTitle('')
      setActDesc('')
      setActSpeakerTrainer('')
      setActStartDate('')
      setActEndDate('')
      setActStartTime('')
      setActEndTime('')
      setActVenue('')
      setActCourse('B.Tech')
      setActBranch('CSE')
      setActYear('4th Year')
      setActSection('Section A')
      setActEligibility('')
      setActDeadline('')
      setActStatus('Active')
    }
    setShowActivityModal(true)
  }

  // Handlers
  const handleSaveCompany = async () => {
    if (!compName.trim()) {
      toast({ type: 'error', title: 'Validation Error', description: 'Company Name is required' })
      return
    }
    await saveCompany({
      id: editingCompany?.id,
      name: compName.trim(),
      industry: compIndustry.trim(),
      website: compWebsite.trim(),
      hr_name: compHrName.trim(),
      hr_email: compHrEmail.trim(),
      hr_phone: compHrPhone.trim(),
      location: compLocation.trim(),
      logo: '',
      description: '',
      status: 'Active',
    })
    setShowCompanyModal(false)
    toast({ type: 'success', title: 'Success', description: 'Company saved successfully' })
  }

  const handleSaveDrive = async () => {
    if (!driveName.trim() || !driveRole.trim()) {
      toast({ type: 'error', title: 'Validation Error', description: 'Drive Title and Job Role are required' })
      return
    }
    const selectedComp = companies.find((c) => c.id === driveCompanyId)
    await saveDrive({
      id: editingDrive?.id,
      company_id: driveCompanyId,
      company_name: selectedComp?.name || 'Partner Company',
      drive_name: driveName.trim(),
      job_role: driveRole.trim(),
      drive_date: new Date().toISOString().split('T')[0],
      reg_start_date: new Date().toISOString().split('T')[0],
      reg_end_date: driveRegEnd,
      target_courses: [driveCourse],
      target_branches: [driveBranch],
      target_years: [driveYear],
      eligibility_criteria: `Min CGPA ${driveMinCgpa}`,
      min_cgpa: driveMinCgpa,
      backlog_criteria: 'No Active Backlogs',
      salary_package: drivePackage.trim(),
      job_location: driveLocation.trim(),
      is_internship: false,
      vacancy: 10,
      description: '',
      status: 'Registration Open',
    })
    setShowDriveModal(false)
    toast({ type: 'success', title: 'Success', description: 'Placement Drive saved successfully' })
  }

  const handleSaveRound = async () => {
    if (!roundName.trim() || !selectedDriveForRound) return
    await saveRound({
      drive_id: selectedDriveForRound,
      round_number: roundNum,
      round_name: roundName.trim(),
      round_date: roundDate,
      venue: roundVenue.trim(),
      status: 'Scheduled',
    })
    setShowRoundModal(false)
    toast({ type: 'success', title: 'Success', description: 'Selection Round added' })
  }

  const handleSaveTeacher = async () => {
    if (!teacherName.trim() || !teacherEmail.trim()) {
      toast({ type: 'error', title: 'Validation Error', description: 'Teacher Name and Email are required' })
      return
    }
    if (teacherSelectedClasses.length === 0) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please select at least one class for the TNP Teacher' })
      return
    }
    if (teacherPassword && teacherPassword !== teacherConfirmPassword) {
      toast({ type: 'error', title: 'Validation Error', description: 'Passwords do not match' })
      return
    }

    const payload: Omit<TeacherRecord, 'id'> & { id?: string } = {
      id: editingTeacher?.id,
      teacher_id: teacherId || `TNP-${Math.floor(100 + Math.random() * 900)}`,
      name: teacherName.trim(),
      position: 'TNP Trainer',
      course: teacherCourse,
      department: 'TNP', // LOCKED TO TNP PER PRD
      assigned_classes: teacherSelectedClasses,
      assigned_subjects: [teacherSpecialization], // ONLY Aptitude, PDP, Technical Training
      email: teacherEmail.trim(),
      phone: teacherPhone.trim(),
      qualification: teacherQual.trim(),
      college_id: userCollege || 'ea318ebf-893e-410c-a925-ac1d4dc986eb',
    }

    if (!editingTeacher && teacherPassword) {
      await AuthService.createTeacherAccount({
        ...payload,
        password: teacherPassword,
      })
    }

    await addTeacher(payload)
    setShowTeacherModal(false)
    toast({ type: 'success', title: 'Success', description: 'TNP Teacher saved successfully' })
  }

  const handleSaveActivity = async () => {
    if (!actTitle.trim()) {
      toast({ type: 'error', title: 'Validation Error', description: 'Activity Title is required' })
      return
    }

    await saveActivity({
      id: editingActivity?.id,
      activity_type: actType,
      title: actTitle.trim(),
      description: actDesc.trim(),
      speaker_trainer_organizer: actSpeakerTrainer.trim(),
      start_date: actStartDate,
      end_date: actEndDate,
      start_time: actStartTime,
      end_time: actEndTime,
      venue: actVenue.trim(),
      course: actCourse,
      branch: actBranch,
      year: actYear,
      section: actSection,
      eligibility: actEligibility.trim(),
      application_deadline: actDeadline,
      status: actStatus,
    })

    setShowActivityModal(false)
    toast({ type: 'success', title: 'Success', description: `${actType.toUpperCase()} activity saved successfully` })
  }

  const handleSavePlacement = async () => {
    const selectedStudent = students.find((s) => s.id === plcStudentId)
    if (!selectedStudent || !plcCompName.trim() || !plcRole.trim()) {
      toast({ type: 'error', title: 'Validation Error', description: 'Please select student and enter company details' })
      return
    }
    await savePlacement({
      id: editingPlacement?.id,
      student_id: selectedStudent.id,
      student_name: selectedStudent.name,
      roll_no: selectedStudent.roll_no,
      course: selectedStudent.course,
      branch: selectedStudent.branch,
      year: selectedStudent.year,
      company_name: plcCompName.trim(),
      drive_name: `${plcCompName.trim()} Drive`,
      job_role: plcRole.trim(),
      package_amount: plcPackage.trim() || '6.0 LPA',
      location: plcLocation.trim() || 'Noida',
      selection_date: new Date().toISOString().split('T')[0],
      placement_type: 'Full Time',
      status: 'Offered',
    })
    setShowPlacementModal(false)
    toast({ type: 'success', title: 'Success', description: 'Placement Record saved' })
  }

  // Filtered lists
  const filteredDrives = useMemo(() => {
    return drives.filter((d) => {
      const matchCourse = courseFilter === 'All' || d.target_courses?.includes(courseFilter)
      const matchBranch = branchFilter === 'All' || d.target_branches?.some((b) => isBranchMatch(b, branchFilter))
      const matchYear = yearFilter === 'All' || d.target_years?.includes(yearFilter)
      const matchSearch =
        !search ||
        d.drive_name.toLowerCase().includes(search.toLowerCase()) ||
        d.company_name.toLowerCase().includes(search.toLowerCase())
      return matchCourse && matchBranch && matchYear && matchSearch
    })
  }, [drives, courseFilter, branchFilter, yearFilter, search])

  const filteredApplications = useMemo(() => {
    return applications.filter((a) => {
      const matchCourse = courseFilter === 'All' || a.course === courseFilter
      const matchBranch = branchFilter === 'All' || isBranchMatch(a.branch, branchFilter)
      const matchYear = yearFilter === 'All' || a.year === yearFilter
      const matchSearch =
        !search ||
        a.student_name.toLowerCase().includes(search.toLowerCase()) ||
        a.roll_no.toLowerCase().includes(search.toLowerCase())
      return matchCourse && matchBranch && matchYear && matchSearch
    })
  }, [applications, courseFilter, branchFilter, yearFilter, search])

  const filteredPlacements = useMemo(() => {
    return placements.filter((p) => {
      const matchCourse = courseFilter === 'All' || p.course === courseFilter
      const matchBranch = branchFilter === 'All' || isBranchMatch(p.branch, branchFilter)
      const matchYear = yearFilter === 'All' || p.year === yearFilter
      const matchSearch =
        !search ||
        p.student_name.toLowerCase().includes(search.toLowerCase()) ||
        p.company_name.toLowerCase().includes(search.toLowerCase())
      return matchCourse && matchBranch && matchYear && matchSearch
    })
  }, [placements, courseFilter, branchFilter, yearFilter, search])

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchType = activityTypeFilter === 'All' || act.activity_type === activityTypeFilter
      const matchCourse = courseFilter === 'All' || act.course === courseFilter || act.course === 'All'
      const matchBranch = branchFilter === 'All' || isBranchMatch(act.branch, branchFilter) || act.branch === 'All'
      const matchYear = yearFilter === 'All' || act.year === yearFilter || act.year === 'All'
      const matchSearch =
        !search ||
        act.title.toLowerCase().includes(search.toLowerCase()) ||
        (act.speaker_trainer_organizer || '').toLowerCase().includes(search.toLowerCase())
      return matchType && matchCourse && matchBranch && matchYear && matchSearch
    })
  }, [activities, activityTypeFilter, courseFilter, branchFilter, yearFilter, search])

  // Top Sub-Tabs strictly set to 8 as per PRD
  const topTabs = [
    { id: 'dashboard', label: 'TNP Dashboard' },
    { id: 'staff', label: 'Staff' },
    { id: 'companies', label: 'Companies' },
    { id: 'drives', label: 'Placement Drives' },
    { id: 'activities', label: 'Activities' },
    { id: 'applications', label: 'Application' },
    { id: 'selection', label: 'Selection Process' },
    { id: 'placements', label: 'Placement' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900 tracking-tight">
            Training & Placement Department
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Complete management of corporate drives, TNP staff, training activities, applications, and placements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'staff' && (
            <Button
              variant="primary"
              onClick={() =>
                toast({
                  type: 'info',
                  title: 'Add Teacher via Faculty Management',
                  description: 'To add a TNP Teacher, go to Faculty Management and select Department: TNP.',
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add TNP Teacher
            </Button>
          )}
          {activeTab === 'companies' && (
            <Button variant="primary" onClick={() => openCompanyModal()}>
              <Plus className="h-4 w-4 mr-2" /> Add Company
            </Button>
          )}
          {activeTab === 'drives' && (
            <Button variant="primary" onClick={() => openDriveModal()}>
              <Plus className="h-4 w-4 mr-2" /> Create Drive
            </Button>
          )}
          {activeTab === 'activities' && (
            <Button variant="primary" onClick={() => openActivityModal()}>
              <Plus className="h-4 w-4 mr-2" /> Add Activity
            </Button>
          )}
          {activeTab === 'placements' && (
            <Button variant="primary" onClick={() => openPlacementModal()}>
              <Plus className="h-4 w-4 mr-2" /> Record Placement Offer
            </Button>
          )}
        </div>
      </div>

      {/* Top Sub-Tab Bar */}
      <Tabs tabs={topTabs} activeId={activeTab} onChange={setActiveTab} />

      {/* Search & Filter Bar (Matching Teachers / Classes / Fees UI) */}
      {['drives', 'activities', 'applications', 'placements', 'staff'].includes(activeTab) && (
        <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="w-full sm:w-72"
            />
            <Select
              value={courseFilter}
              onChange={(e) => handleCourseChange(e.target.value)}
              options={['All', ...COURSES].map((c) => ({ label: c === 'All' ? 'All Courses' : c, value: c }))}
              className="w-44"
            />
            <Select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              options={['All', ...availableBranches].map((b) => ({ label: b === 'All' ? 'All Branches' : b, value: b }))}
              className="w-48"
            />
            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              options={['All', ...availableYears].map((y) => ({ label: y === 'All' ? 'All Years' : y, value: y }))}
              className="w-40"
            />
            {activeTab === 'activities' && (
              <Select
                value={activityTypeFilter}
                onChange={(e) => setActivityTypeFilter(e.target.value as any)}
                options={['All', ...TNP_ACTIVITY_TYPES.map((t) => t.type)].map((t) => ({
                  label: t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1),
                  value: t,
                }))}
                className="w-40"
              />
            )}
          </div>
          {(search || courseFilter !== 'All' || branchFilter !== 'All' || yearFilter !== 'All' || activityTypeFilter !== 'All') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setCourseFilter('All')
                setBranchFilter('All')
                setYearFilter('All')
                setActivityTypeFilter('All')
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* TAB 1: TNP DASHBOARD (EXACTLY 4 SUMMARY CARDS PER PRD SECTION 36) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Placement Drives */}
            <div className="bg-surface p-5 rounded-[var(--radius-card)] border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-500">Placement Drives</span>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-ink-900 tracking-tight">{drives.length}</p>
              <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> {drives.filter((d) => d.status === 'Registration Open').length} Open for Application
              </p>
            </div>

            {/* Card 2: Applications */}
            <div className="bg-surface p-5 rounded-[var(--radius-card)] border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-500">Applications</span>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-ink-900 tracking-tight">{applications.length}</p>
              <p className="text-xs text-indigo-600 font-medium">
                {applications.filter((a) => a.status === 'Shortlisted' || a.status === 'Selected').length} Shortlisted / Selected
              </p>
            </div>

            {/* Card 3: Placements */}
            <div className="bg-surface p-5 rounded-[var(--radius-card)] border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-500">Placements</span>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">{placements.length}</p>
              <p className="text-xs text-emerald-600 font-medium">Offers Confirmed in DB</p>
            </div>

            {/* Card 4: Activities */}
            <div className="bg-surface p-5 rounded-[var(--radius-card)] border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-500">Activities</span>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-ink-900 tracking-tight">{activities.length}</p>
              <p className="text-xs text-amber-600 font-medium">Seminars, Events, Trainings, Internships</p>
            </div>
          </div>

          {/* Clean Dashboard Overview Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Drives */}
            <div className="bg-surface p-5 rounded-[var(--radius-card)] border border-border space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-ink-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-600" /> Active Placement Drives
                </h3>
                <span className="text-xs text-brand-600 font-semibold cursor-pointer" onClick={() => setActiveTab('drives')}>
                  View All ({drives.length})
                </span>
              </div>
              {drives.length === 0 ? (
                <p className="text-sm text-ink-400 py-6 text-center">No placement drives registered in database.</p>
              ) : (
                <div className="space-y-3">
                  {drives.slice(0, 4).map((d) => (
                    <div key={d.id} className="p-3 bg-canvas rounded-lg border border-border/80 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-ink-900">{d.drive_name}</h4>
                        <p className="text-xs text-ink-500">{d.company_name} • {d.job_role}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {d.salary_package || 'Standard CTC'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Latest Activities */}
            <div className="bg-surface p-5 rounded-[var(--radius-card)] border border-border space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-ink-900 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-amber-600" /> Latest TNP Activities
                </h3>
                <span className="text-xs text-amber-600 font-semibold cursor-pointer" onClick={() => setActiveTab('activities')}>
                  View All ({activities.length})
                </span>
              </div>
              {activities.length === 0 ? (
                <p className="text-sm text-ink-400 py-6 text-center">No activities recorded.</p>
              ) : (
                <div className="space-y-3">
                  {activities.slice(0, 4).map((a) => (
                    <div key={a.id} className="p-3 bg-canvas rounded-lg border border-border/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="uppercase text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            {a.activity_type}
                          </span>
                          <h4 className="font-bold text-sm text-ink-900">{a.title}</h4>
                        </div>
                        <p className="text-xs text-ink-500 mt-1">{a.speaker_trainer_organizer || 'TNP Facilitator'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-ink-600 font-semibold">{a.start_date || 'Upcoming'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TNP STAFF (DEDICATED TNP TEACHERS) */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink-900 text-base">Dedicated TNP Staff & Trainers</h3>
                <p className="text-xs text-ink-500">Only faculty assigned strictly to Department: TNP appear in this system.</p>
              </div>
              <Button
                variant="primary"
                onClick={() =>
                  toast({
                    type: 'info',
                    title: 'Add Teacher via Faculty Management',
                    description: 'To add a TNP Teacher, go to Faculty Management and select Department: TNP.',
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add TNP Teacher
              </Button>
            </div>

            {tnpTeachers.length === 0 ? (
              <div className="p-12 text-center text-ink-400 space-y-3">
                <UserCheck className="h-10 w-10 mx-auto text-slate-300" />
                <p className="text-base font-semibold text-ink-700">No TNP staff added yet.</p>
                <p className="text-sm text-ink-400">Click "Add TNP Teacher" to register dedicated placement trainers.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                    <tr>
                      <th className="p-3">Teacher Name & ID</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">TNP Specialization</th>
                      <th className="p-3">Assigned Class</th>
                      <th className="p-3">Contact Email & Phone</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tnpTeachers.map((tch) => (
                      <tr key={tch.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-semibold text-ink-900">
                          <div className="flex items-center gap-3">
                            <AvatarInitials name={tch.name} size="sm" />
                            <div>
                              <p className="font-bold">{tch.name}</p>
                              <p className="text-xs text-ink-400">{tch.teacher_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-brand-600 text-xs">
                          <span className="px-2 py-0.5 rounded bg-brand-50 border border-brand-200">
                            {tch.department}
                          </span>
                        </td>
                        <td className="p-3 text-ink-700">{tch.course}</td>
                        <td className="p-3 font-semibold text-indigo-700 text-xs">
                          {tch.assigned_subjects?.join(', ') || 'Aptitude'}
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          {tch.assigned_classes?.join(', ') || 'Unassigned'}
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          <p className="font-medium">{tch.email}</p>
                          <p className="text-ink-400">{tch.phone}</p>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => openTeacherModal(tch)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => deleteTeacher(tch.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* TAB 3: COMPANIES */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
            {companies.length === 0 ? (
              <div className="p-12 text-center text-ink-400 space-y-3">
                <Building2 className="h-10 w-10 mx-auto text-slate-300" />
                <p className="text-base font-semibold text-ink-700">No partner companies added yet.</p>
                <Button variant="primary" onClick={() => openCompanyModal()}>
                  <Plus className="h-4 w-4 mr-2" /> Add First Company
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                    <tr>
                      <th className="p-3">Company</th>
                      <th className="p-3">Industry</th>
                      <th className="p-3">HR Recruiter</th>
                      <th className="p-3">Contact Details</th>
                      <th className="p-3">Location</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {companies.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-semibold text-ink-900">
                          <div className="flex items-center gap-3">
                            <AvatarInitials name={comp.name} size="sm" />
                            <div>
                              <p className="font-bold">{comp.name}</p>
                              {comp.website && (
                                <a href={comp.website} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:underline">
                                  {comp.website}
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-ink-600">{comp.industry || '—'}</td>
                        <td className="p-3 text-ink-700 font-medium">{comp.hr_name || '—'}</td>
                        <td className="p-3 text-ink-600 text-xs">
                          <p>{comp.hr_email || '—'}</p>
                          <p className="text-ink-400">{comp.hr_phone}</p>
                        </td>
                        <td className="p-3 text-ink-600">{comp.location || '—'}</td>
                        <td className="p-3 text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => openCompanyModal(comp)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => deleteCompany(comp.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* TAB 4: PLACEMENT DRIVES */}
      {activeTab === 'drives' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
            {filteredDrives.length === 0 ? (
              <div className="p-12 text-center text-ink-400 space-y-3">
                <Briefcase className="h-10 w-10 mx-auto text-slate-300" />
                <p className="text-base font-semibold text-ink-700">No placement drives found.</p>
                <Button variant="primary" onClick={() => openDriveModal()}>
                  <Plus className="h-4 w-4 mr-2" /> Create Placement Drive
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                    <tr>
                      <th className="p-3">Drive Name & Company</th>
                      <th className="p-3">Job Role & Location</th>
                      <th className="p-3">Target Class</th>
                      <th className="p-3">Package / CTC</th>
                      <th className="p-3">Eligibility</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDrives.map((drive) => (
                      <tr key={drive.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-semibold text-ink-900">
                          <p className="font-bold text-ink-900">{drive.drive_name}</p>
                          <p className="text-xs text-brand-600 font-medium">{drive.company_name}</p>
                        </td>
                        <td className="p-3 text-ink-700">
                          <p className="font-medium">{drive.job_role}</p>
                          <p className="text-xs text-ink-400">{drive.job_location || 'Pan India'}</p>
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          <p className="font-semibold">{drive.target_courses?.join(', ')}</p>
                          <p>{drive.target_branches?.join(', ')} — {drive.target_years?.join(', ')}</p>
                        </td>
                        <td className="p-3 font-bold text-emerald-700 text-xs">{drive.salary_package || 'As per norms'}</td>
                        <td className="p-3 text-xs text-ink-600">
                          <p className="font-medium">Min CGPA: {drive.min_cgpa || '0.0'}</p>
                        </td>
                        <td className="p-3">
                          <Select
                            value={drive.status}
                            onChange={(e) => updateDriveStatus(drive.id, e.target.value as DriveStatus)}
                            options={DRIVE_STATUSES.map((s) => ({ label: s, value: s }))}
                            className="text-xs py-1 h-8"
                          />
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => openRoundModal(drive.id)}>
                            + Round
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDriveModal(drive)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => deleteDrive(drive.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* TAB 5: ACTIVITIES (SINGLE COMBINED PANEL PER PRD SECTION 2 & 43) */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          {/* Sub Type Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-[var(--radius-card)] border border-border shadow-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActivityTypeFilter('All')}
                className={`px-3 py-1.5 text-xs font-bold rounded-[var(--radius-btn)] transition-all cursor-pointer ${
                  activityTypeFilter === 'All'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-canvas text-ink-700 hover:bg-slate-100'
                }`}
              >
                All Activities
              </button>
              {TNP_ACTIVITY_TYPES.map((at) => (
                <button
                  key={at.type}
                  onClick={() => setActivityTypeFilter(at.type)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[var(--radius-btn)] transition-all cursor-pointer ${
                    activityTypeFilter === at.type
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-canvas text-ink-700 hover:bg-slate-100'
                  }`}
                >
                  {at.label}
                </button>
              ))}
            </div>

            <Button variant="primary" onClick={() => openActivityModal()}>
              <Plus className="h-4 w-4 mr-2" /> Add Activity
            </Button>
          </div>

          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
            {filteredActivities.length === 0 ? (
              <div className="p-12 text-center text-ink-400 space-y-3">
                <GraduationCap className="h-10 w-10 mx-auto text-slate-300" />
                <p className="text-base font-semibold text-ink-700">No TNP activities found.</p>
                <p className="text-sm text-ink-400">Click "Add Activity" to create a Seminar, Event, Training, or Internship.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                    <tr>
                      <th className="p-3">Activity Title & Type</th>
                      <th className="p-3">Speaker / Trainer / Organizer</th>
                      <th className="p-3">Schedule & Venue</th>
                      <th className="p-3">Target Academic Class</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-semibold text-ink-900">
                          <p className="font-bold">{act.title}</p>
                          <span className="inline-block uppercase text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 mt-0.5">
                            {act.activity_type}
                          </span>
                        </td>
                        <td className="p-3 text-ink-700">
                          <p className="font-medium">{act.speaker_trainer_organizer || 'TNP Facilitator'}</p>
                          {act.company_name && <p className="text-xs text-brand-600 font-semibold">{act.company_name}</p>}
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          <p className="font-semibold">{act.start_date || 'Upcoming'}</p>
                          <p className="text-ink-400">{act.venue || 'Campus Venue'}</p>
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          <p className="font-semibold">{act.course || 'All'}</p>
                          <p>{act.branch || 'All'} — {act.year || 'All'}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {act.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewingActivity(act)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openActivityModal(act)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => deleteActivity(act.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* TAB 6: APPLICATION */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
            {filteredApplications.length === 0 ? (
              <div className="p-12 text-center text-ink-400 space-y-2">
                <FileText className="h-10 w-10 mx-auto text-slate-300" />
                <p className="text-base font-semibold text-ink-700">No student applications submitted yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                    <tr>
                      <th className="p-3">Student Name & Roll No</th>
                      <th className="p-3">Course / Branch / Year</th>
                      <th className="p-3">CGPA</th>
                      <th className="p-3">Applied Drive</th>
                      <th className="p-3">Applied Date</th>
                      <th className="p-3">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-semibold text-ink-900">
                          <p className="font-bold">{app.student_name}</p>
                          <p className="text-xs text-ink-400">{app.roll_no}</p>
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          {app.course} — {app.branch} ({app.year})
                        </td>
                        <td className="p-3 font-bold text-ink-900 text-xs">{app.cgpa || 'N/A'}</td>
                        <td className="p-3 text-brand-600 font-semibold text-xs">
                          {drives.find((d) => d.id === app.drive_id)?.drive_name || 'Placement Drive'}
                        </td>
                        <td className="p-3 text-ink-500 text-xs">{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '—'}</td>
                        <td className="p-3">
                          <Select
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value as AppStatus)}
                            options={APP_STATUSES.map((s) => ({ label: s, value: s }))}
                            className="text-xs py-1 h-8"
                          />
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

      {/* TAB 7: SELECTION PROCESS */}
      {activeTab === 'selection' && (
        <div className="space-y-6">
          <div className="bg-surface p-5 rounded-[var(--radius-card)] border border-border shadow-xs space-y-4">
            <h3 className="font-bold text-ink-900 text-base border-b border-border pb-3">Selection Process & Rounds Pipeline</h3>
            {drives.length === 0 ? (
              <p className="text-sm text-ink-400 py-4">Create a placement drive first to configure recruitment rounds.</p>
            ) : (
              <div className="space-y-6">
                {drives.map((drv) => {
                  const drvRounds = rounds.filter((r) => r.drive_id === drv.id)
                  return (
                    <div key={drv.id} className="p-4 bg-canvas rounded-xl border border-border/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                        <div>
                          <h4 className="font-bold text-base text-ink-900">{drv.drive_name}</h4>
                          <p className="text-xs text-brand-600 font-semibold">{drv.company_name} — {drv.job_role}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openRoundModal(drv.id)}>
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add Selection Round
                        </Button>
                      </div>

                      {drvRounds.length === 0 ? (
                        <p className="text-xs text-ink-400 italic">No rounds configured for this drive yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {drvRounds.map((rnd) => (
                            <div key={rnd.id} className="p-3 bg-surface rounded-lg border border-border text-xs space-y-1">
                              <p className="font-bold text-ink-900">Round {rnd.round_number}: {rnd.round_name}</p>
                              <p className="text-ink-500">Date: {rnd.round_date || 'TBA'}</p>
                              <p className="text-ink-400">Venue: {rnd.venue || 'Campus'}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: PLACEMENT */}
      {activeTab === 'placements' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-xs overflow-hidden">
            {filteredPlacements.length === 0 ? (
              <div className="p-12 text-center text-ink-400 space-y-3">
                <Award className="h-10 w-10 mx-auto text-slate-300" />
                <p className="text-base font-semibold text-ink-700">No placement records logged yet.</p>
                <Button variant="primary" onClick={() => openPlacementModal()}>
                  <Plus className="h-4 w-4 mr-2" /> Record Placement Offer
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-border text-xs uppercase text-ink-500 font-semibold">
                    <tr>
                      <th className="p-3">Student Name & Roll No</th>
                      <th className="p-3">Course / Branch / Year</th>
                      <th className="p-3">Company Name</th>
                      <th className="p-3">Job Role</th>
                      <th className="p-3">Package Offered</th>
                      <th className="p-3">Offer Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPlacements.map((plc) => (
                      <tr key={plc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-semibold text-ink-900">
                          <p className="font-bold">{plc.student_name}</p>
                          <p className="text-xs text-ink-400">{plc.roll_no}</p>
                        </td>
                        <td className="p-3 text-xs text-ink-600">
                          {plc.course} — {plc.branch} ({plc.year})
                        </td>
                        <td className="p-3 font-bold text-brand-600">{plc.company_name}</td>
                        <td className="p-3 text-ink-700">{plc.job_role}</td>
                        <td className="p-3 font-bold text-emerald-700 text-xs">{plc.package_amount}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {plc.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => openPlacementModal(plc)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => deletePlacement(plc.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* MODALS */}

      {/* 1. TNP Teacher Modal */}
      <Modal isOpen={showTeacherModal} onClose={() => setShowTeacherModal(false)} title={editingTeacher ? 'Edit TNP Teacher' : 'Add TNP Teacher'}>
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name">
              <Input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="e.g. Dr. Rajesh Verma" />
            </FormField>
            <FormField label="Teacher ID">
              <Input value={teacherId} onChange={(e) => setTeacherId(e.target.value)} placeholder="e.g. TNP-101" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Qualification">
              <Input value={teacherQual} onChange={(e) => setTeacherQual(e.target.value)} placeholder="e.g. M.Tech / PhD" />
            </FormField>
            <FormField label="Course">
              <Select
                value={teacherCourse}
                onChange={(e) => {
                  const newCourse = e.target.value
                  setTeacherCourse(newCourse)
                  setTeacherSelectedClasses((prev) => prev.filter((cStr) => cStr.startsWith(newCourse)))
                }}
                options={COURSES.map((c) => ({ label: c, value: c }))}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Department (Fixed)">
              <Select value="TNP" onChange={() => {}} options={[{ label: 'TNP', value: 'TNP' }]} disabled />
            </FormField>
            <FormField label="TNP Training Specialization">
              <Select
                value={teacherSpecialization}
                onChange={(e) => setTeacherSpecialization(e.target.value as any)}
                options={availableTnpSubjects.map((s) => ({ label: `${s.name} (${s.code})`, value: s.name }))}
              />
            </FormField>
          </div>

          <FormField label={`Assign Academic Classes for ${teacherCourse} (Max 6, Selected: ${teacherSelectedClasses.length})`}>
            <div className="border border-border rounded-xl p-3 bg-canvas/50 max-h-48 overflow-y-auto space-y-2">
              {availableClassOptions.length === 0 ? (
                <p className="text-xs text-ink-400">No classes available for {teacherCourse}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableClassOptions.map((opt) => {
                    const isSelected = teacherSelectedClasses.includes(opt.label)
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleTeacherClass(opt.label)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-brand-600 text-white border-brand-600 shadow-2xs'
                            : 'bg-surface text-ink-700 border-border hover:bg-canvas'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-white text-brand-600 font-bold border-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected ? '✓' : ''}
                        </span>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email">
              <Input type="email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} placeholder="teacher@college.edu" />
            </FormField>
            <FormField label="Phone Number">
              <Input value={teacherPhone} onChange={(e) => setTeacherPhone(e.target.value)} placeholder="+91 9876543210" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Password">
              <Input type="password" value={teacherPassword} onChange={(e) => setTeacherPassword(e.target.value)} placeholder="••••••••" />
            </FormField>
            <FormField label="Confirm Password">
              <Input type="password" value={teacherConfirmPassword} onChange={(e) => setTeacherConfirmPassword(e.target.value)} placeholder="••••••••" />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowTeacherModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveTeacher}>Save TNP Teacher</Button>
          </div>
        </div>
      </Modal>

      {/* 2. Unified Activity Modal */}
      <Modal isOpen={showActivityModal} onClose={() => setShowActivityModal(false)} title={editingActivity ? 'Edit TNP Activity' : 'Add TNP Activity'}>
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Activity Type">
              <Select
                value={actType}
                onChange={(e) => setActType(e.target.value as ActivityType)}
                options={TNP_ACTIVITY_TYPES.map((t) => ({ label: t.label, value: t.type }))}
              />
            </FormField>
            <FormField label="Title / Name">
              <Input value={actTitle} onChange={(e) => setActTitle(e.target.value)} placeholder="Activity Title" />
            </FormField>
          </div>
          <FormField label="Speaker / Trainer / Organizer / Company">
            <Input value={actSpeakerTrainer} onChange={(e) => setActSpeakerTrainer(e.target.value)} placeholder="Resource Person Name / Company" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date">
              <Input type="date" value={actStartDate} onChange={(e) => setActStartDate(e.target.value)} />
            </FormField>
            <FormField label="End Date">
              <Input type="date" value={actEndDate} onChange={(e) => setActEndDate(e.target.value)} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Time">
              <Input type="time" value={actStartTime} onChange={(e) => setActStartTime(e.target.value)} />
            </FormField>
            <FormField label="End Time">
              <Input type="time" value={actEndTime} onChange={(e) => setActEndTime(e.target.value)} />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Course">
              <Select value={actCourse} onChange={(e) => setActCourse(e.target.value)} options={['All', ...COURSES].map((c) => ({ label: c, value: c }))} />
            </FormField>
            <FormField label="Branch Short Code">
              <Select value={actBranch} onChange={(e) => setActBranch(e.target.value)} options={['All', ...availableBranches].map((b) => ({ label: b, value: b }))} />
            </FormField>
            <FormField label="Year">
              <Select value={actYear} onChange={(e) => setActYear(e.target.value)} options={['All', ...availableYears].map((y) => ({ label: y, value: y }))} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Venue">
              <Input value={actVenue} onChange={(e) => setActVenue(e.target.value)} placeholder="Seminar Hall / Online" />
            </FormField>
            <FormField label="Application Deadline">
              <Input type="date" value={actDeadline} onChange={(e) => setActDeadline(e.target.value)} />
            </FormField>
          </div>
          <FormField label="Description">
            <Input value={actDesc} onChange={(e) => setActDesc(e.target.value)} placeholder="Brief summary of activity" />
          </FormField>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowActivityModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveActivity}>Save Activity</Button>
          </div>
        </div>
      </Modal>

      {/* 3. Activity View Modal */}
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
              <p><strong className="text-ink-900">Resource Person / Organizer:</strong> {viewingActivity.speaker_trainer_organizer || 'TNP Facilitator'}</p>
              <p><strong className="text-ink-900">Schedule:</strong> {viewingActivity.start_date || 'Upcoming'} {viewingActivity.start_time}</p>
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

      {/* 4. Company Modal */}
      <Modal isOpen={showCompanyModal} onClose={() => setShowCompanyModal(false)} title={editingCompany ? 'Edit Partner Company' : 'Add Partner Company'}>
        <div className="space-y-4">
          <FormField label="Company Name">
            <Input value={compName} onChange={(e) => setCompName(e.target.value)} placeholder="e.g. Tata Consultancy Services" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Industry">
              <Input value={compIndustry} onChange={(e) => setCompIndustry(e.target.value)} placeholder="e.g. IT Services / Fintech" />
            </FormField>
            <FormField label="Website">
              <Input value={compWebsite} onChange={(e) => setCompWebsite(e.target.value)} placeholder="e.g. https://tcs.com" />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="HR Name">
              <Input value={compHrName} onChange={(e) => setCompHrName(e.target.value)} placeholder="HR Manager Name" />
            </FormField>
            <FormField label="HR Email">
              <Input value={compHrEmail} onChange={(e) => setCompHrEmail(e.target.value)} placeholder="hr@company.com" />
            </FormField>
            <FormField label="HR Phone">
              <Input value={compHrPhone} onChange={(e) => setCompHrPhone(e.target.value)} placeholder="+91 9876543210" />
            </FormField>
          </div>
          <FormField label="Location">
            <Input value={compLocation} onChange={(e) => setCompLocation(e.target.value)} placeholder="e.g. Noida / Bengaluru" />
          </FormField>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowCompanyModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveCompany}>Save Company</Button>
          </div>
        </div>
      </Modal>

      {/* 5. Placement Drive Modal */}
      <Modal isOpen={showDriveModal} onClose={() => setShowDriveModal(false)} title={editingDrive ? 'Edit Placement Drive' : 'Create Placement Drive'}>
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <FormField label="Select Company">
            <Select
              value={driveCompanyId}
              onChange={(e) => setDriveCompanyId(e.target.value)}
              options={companies.map((c) => ({ label: c.name, value: c.id }))}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Drive Title">
              <Input value={driveName} onChange={(e) => setDriveName(e.target.value)} placeholder="e.g. Campus Recruitment 2026" />
            </FormField>
            <FormField label="Job Role">
              <Input value={driveRole} onChange={(e) => setDriveRole(e.target.value)} placeholder="e.g. Software Engineer" />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Course Eligibility">
              <Select value={driveCourse} onChange={(e) => setDriveCourse(e.target.value)} options={COURSES.map((c) => ({ label: c, value: c }))} />
            </FormField>
            <FormField label="Branch Eligibility">
              <Select value={driveBranch} onChange={(e) => setDriveBranch(e.target.value)} options={availableBranches.map((b) => ({ label: b, value: b }))} />
            </FormField>
            <FormField label="Target Year">
              <Select value={driveYear} onChange={(e) => setDriveYear(e.target.value)} options={availableYears.map((y) => ({ label: y, value: y }))} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Package / Salary (CTC)">
              <Input value={drivePackage} onChange={(e) => setDrivePackage(e.target.value)} placeholder="e.g. 8.5 LPA" />
            </FormField>
            <FormField label="Minimum CGPA">
              <Input type="number" step="0.1" value={driveMinCgpa} onChange={(e) => setDriveMinCgpa(parseFloat(e.target.value) || 0)} placeholder="6.5" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Registration End Date">
              <Input type="date" value={driveRegEnd} onChange={(e) => setDriveRegEnd(e.target.value)} />
            </FormField>
            <FormField label="Job Location">
              <Input value={driveLocation} onChange={(e) => setDriveLocation(e.target.value)} placeholder="Noida / Gurgaon" />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowDriveModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveDrive}>Save Drive</Button>
          </div>
        </div>
      </Modal>

      {/* 6. Selection Round Modal */}
      <Modal isOpen={showRoundModal} onClose={() => setShowRoundModal(false)} title="Add Selection Round">
        <div className="space-y-4">
          <FormField label="Round Number">
            <Input type="number" value={roundNum} onChange={(e) => setRoundNum(parseInt(e.target.value) || 1)} />
          </FormField>
          <FormField label="Round Name">
            <Input value={roundName} onChange={(e) => setRoundName(e.target.value)} placeholder="e.g. Aptitude Test / GD / Technical PI" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date">
              <Input type="date" value={roundDate} onChange={(e) => setRoundDate(e.target.value)} />
            </FormField>
            <FormField label="Venue">
              <Input value={roundVenue} onChange={(e) => setRoundVenue(e.target.value)} placeholder="e.g. Lab 2 / Seminar Hall" />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowRoundModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveRound}>Save Round</Button>
          </div>
        </div>
      </Modal>

      {/* 7. Record Placement Offer Modal */}
      <Modal isOpen={showPlacementModal} onClose={() => setShowPlacementModal(false)} title={editingPlacement ? 'Edit Placement Offer' : 'Record Final Placement Offer'}>
        <div className="space-y-4">
          <FormField label="Select Placed Student">
            <Select
              value={plcStudentId}
              onChange={(e) => setPlcStudentId(e.target.value)}
              options={students.map((s) => ({ label: `${s.name} (${s.roll_no} - ${s.branch})`, value: s.id }))}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Company Name">
              <Input value={plcCompName} onChange={(e) => setPlcCompName(e.target.value)} placeholder="e.g. Infosys" />
            </FormField>
            <FormField label="Job Role">
              <Input value={plcRole} onChange={(e) => setPlcRole(e.target.value)} placeholder="Systems Engineer" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Package Offered (CTC)">
              <Input value={plcPackage} onChange={(e) => setPlcPackage(e.target.value)} placeholder="e.g. 7.5 LPA" />
            </FormField>
            <FormField label="Location">
              <Input value={plcLocation} onChange={(e) => setPlcLocation(e.target.value)} placeholder="Bengaluru" />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowPlacementModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSavePlacement}>Save Placement</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
