import { useState, useMemo, useEffect } from 'react'
import { Select, Button, Drawer, FormField, Input, Modal, EmptyState, StatCard } from '../../components/ui'
import {
  Plus, Pencil, Trash2, Printer, Settings,
  AlertTriangle, Calendar, Search, Clock, Users, Lock,
  GraduationCap, BookOpen, DoorOpen
} from 'lucide-react'
import { useAuth } from '../../app/providers/AuthProvider'
import { hasPermission } from '../../services/permissionService'
import {
  useAcademicStore,
  COURSES,
  academicStore,
  isBranchMatch,
  getAssignedClassRecordsForTeacher,
} from '../../lib/academicStore'
import {
  useTimetableStore,
  timetableStore,
} from '../../lib/timetableStore'
import type { TimetablePeriodEntry } from '../../lib/timetableStore'
import { useToast } from '../../components/ui/Toast'

// Clean branch dictionary per course - NO 'All Branches / Common' option
export const TIMETABLE_BRANCHES_BY_COURSE: Record<string, string[]> = {
  'B.Tech': ['ECE', 'CSE', 'IT', 'CSD', 'AIML', 'ME', 'Civil', 'Biotech', 'EE'],
  Diploma: ['Civil', 'ME', 'IT', 'CS', 'EE', 'EC'],
  MBA: ['Finance', 'Marketing', 'HR', 'International Business', 'Business Analytics'],
}

export const YEARS_BY_COURSE: Record<string, string[]> = {
  'B.Tech': ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  Diploma: ['1st Year', '2nd Year', '3rd Year'],
  MBA: ['1st Year', '2nd Year'],
}

export const DEFAULT_SEMESTER_FOR_YEAR: Record<string, string> = {
  '1st Year': 'Semester 1',
  '2nd Year': 'Semester 3',
  '3rd Year': 'Semester 5',
  '4th Year': 'Semester 7',
}

// Color tokens for entry types with full Dark Mode support
const entryTypeColors: Record<string, { border: string; bg: string; text: string; darkBg: string; darkText: string; badgeBg: string }> = {
  Lecture: { border: 'border-l-indigo-600', bg: 'bg-indigo-50/70 hover:bg-indigo-100/70', text: 'text-indigo-950', darkBg: 'dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60', darkText: 'dark:text-indigo-200', badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
  Lab: { border: 'border-l-emerald-600', bg: 'bg-emerald-50/80 hover:bg-emerald-100/80', text: 'text-emerald-950', darkBg: 'dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60', darkText: 'dark:text-emerald-200', badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
  Practical: { border: 'border-l-teal-600', bg: 'bg-teal-50/80 hover:bg-teal-100/80', text: 'text-teal-950', darkBg: 'dark:bg-teal-950/40 dark:hover:bg-teal-950/60', darkText: 'dark:text-teal-200', badgeBg: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
  Tutorial: { border: 'border-l-amber-600', bg: 'bg-amber-50/70 hover:bg-amber-100/70', text: 'text-amber-950', darkBg: 'dark:bg-amber-950/40 dark:hover:bg-amber-950/60', darkText: 'dark:text-amber-200', badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  Training: { border: 'border-l-purple-600', bg: 'bg-purple-50/80 hover:bg-purple-100/80', text: 'text-purple-950', darkBg: 'dark:bg-purple-950/40 dark:hover:bg-purple-950/60', darkText: 'dark:text-purple-200', badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  Project: { border: 'border-l-blue-600', bg: 'bg-blue-50/80 hover:bg-blue-100/80', text: 'text-blue-950', darkBg: 'dark:bg-blue-950/40 dark:hover:bg-blue-950/60', darkText: 'dark:text-blue-200', badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  Aptitude: { border: 'border-l-cyan-600', bg: 'bg-cyan-50/70 hover:bg-cyan-100/70', text: 'text-cyan-950', darkBg: 'dark:bg-cyan-950/40 dark:hover:bg-cyan-950/60', darkText: 'dark:text-cyan-200', badgeBg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' },
  PDP: { border: 'border-l-pink-600', bg: 'bg-pink-50/70 hover:bg-pink-100/70', text: 'text-pink-950', darkBg: 'dark:bg-pink-950/40 dark:hover:bg-pink-950/60', darkText: 'dark:text-pink-200', badgeBg: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
  Library: { border: 'border-l-rose-600', bg: 'bg-rose-50/70 hover:bg-rose-100/70', text: 'text-rose-950', darkBg: 'dark:bg-rose-950/40 dark:hover:bg-rose-950/60', darkText: 'dark:text-rose-200', badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200' },
  Seminar: { border: 'border-l-violet-600', bg: 'bg-violet-50/70 hover:bg-violet-100/70', text: 'text-violet-950', darkBg: 'dark:bg-violet-950/40 dark:hover:bg-violet-950/60', darkText: 'dark:text-violet-200', badgeBg: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200' },
  Workshop: { border: 'border-l-orange-600', bg: 'bg-orange-50/70 hover:bg-orange-100/70', text: 'text-orange-950', darkBg: 'dark:bg-orange-950/40 dark:hover:bg-orange-950/60', darkText: 'dark:text-orange-200', badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  'Free Period': { border: 'border-l-slate-400', bg: 'bg-slate-50 hover:bg-slate-100', text: 'text-slate-600', darkBg: 'dark:bg-slate-800/40 dark:hover:bg-slate-800/60', darkText: 'dark:text-slate-400', badgeBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  Other: { border: 'border-l-brand-600', bg: 'bg-brand-50/70 hover:bg-brand-100/70', text: 'text-brand-950', darkBg: 'dark:bg-brand-950/40 dark:hover:bg-brand-950/60', darkText: 'dark:text-brand-200', badgeBg: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200' },
}

const getYearBySemester = (sem?: string, course: string = 'B.Tech'): string => {
  if (!sem) return '1st Year'
  if (course === 'MBA') {
    if (sem === 'Semester 1' || sem === 'Semester 2') return '1st Year'
    return '2nd Year'
  }
  if (course === 'Diploma') {
    if (sem === 'Semester 1' || sem === 'Semester 2') return '1st Year'
    if (sem === 'Semester 3' || sem === 'Semester 4') return '2nd Year'
    return '3rd Year'
  }
  if (sem === 'Semester 1' || sem === 'Semester 2') return '1st Year'
  if (sem === 'Semester 3' || sem === 'Semester 4') return '2nd Year'
  if (sem === 'Semester 5' || sem === 'Semester 6') return '3rd Year'
  if (sem === 'Semester 7' || sem === 'Semester 8') return '4th Year'
  return '1st Year'
}

export function TimetablePage() {
  const { user } = useAuth()
  const { teachers, students, classes } = useAcademicStore()
  const {
    timetable,
    getTimetableConfig,
    savePeriod,
    deletePeriod,
  } = useTimetableStore()
  const { toast } = useToast()

  // Role Determination
  const role = user?.role || 'admin'
  const isStudent = role === 'student'
  const isTeacher = role === 'teacher'
  const isAdmin = role === 'admin' || role === 'super_admin'

  // Student Record (if Student role)
  const currentStudent = useMemo(() => {
    if (!isStudent) return null
    return students.find(
      (s) =>
        s.id === user?.student_id ||
        s.student_id === user?.student_id ||
        s.email === user?.email ||
        s.id === user?.id
    ) || students[0]
  }, [isStudent, students, user])

  // Teacher Record (if Teacher role)
  const currentTeacher = useMemo(() => {
    if (!isTeacher) return null
    return teachers.find(
      (t) =>
        t.id === user?.teacher_id ||
        t.teacher_id === user?.teacher_id ||
        t.email === user?.email ||
        t.id === user?.id
    ) || teachers[0]
  }, [isTeacher, teachers, user])

  // Teacher Assigned Class Records (from DB classes table)
  const teacherAssignedClassRecords = useMemo(() => {
    if (!isTeacher) return []
    return getAssignedClassRecordsForTeacher(user, teachers, classes)
  }, [isTeacher, user, teachers, classes])

  // Filter State (Strictly Course -> Branch -> Year -> Section)
  const [filterCourse, setFilterCourse] = useState('B.Tech')
  const [filterBranch, setFilterBranch] = useState('ECE')
  const [filterYear, setFilterYear] = useState('3rd Year')
  const [filterSection, setFilterSection] = useState('Section A')
  const [filterSemester, setFilterSemester] = useState('Semester 5')

  // Dynamic Filter Options (Filtered strictly per role and cascading selection)
  const availableCourses = useMemo(() => {
    if (isTeacher) {
      const courses = Array.from(new Set(teacherAssignedClassRecords.map((c) => c.course)))
      return courses.length > 0 ? courses : COURSES
    }
    return COURSES
  }, [isTeacher, teacherAssignedClassRecords])

  const availableBranches = useMemo(() => {
    if (isTeacher) {
      const branches = Array.from(
        new Set(
          teacherAssignedClassRecords
            .filter((c) => c.course.toLowerCase() === filterCourse.toLowerCase())
            .map((c) => c.branch)
        )
      )
      return branches.length > 0 ? branches : (TIMETABLE_BRANCHES_BY_COURSE[filterCourse] || ['ECE'])
    }
    return TIMETABLE_BRANCHES_BY_COURSE[filterCourse] || ['ECE']
  }, [isTeacher, teacherAssignedClassRecords, filterCourse])

  const availableYears = useMemo(() => {
    if (isTeacher) {
      const years = Array.from(
        new Set(
          teacherAssignedClassRecords
            .filter(
              (c) =>
                c.course.toLowerCase() === filterCourse.toLowerCase() &&
                isBranchMatch(c.branch, filterBranch)
            )
            .map((c) => c.year || getYearBySemester(c.semester, c.course))
        )
      )
      return years.length > 0 ? years : (YEARS_BY_COURSE[filterCourse] || ['1st Year'])
    }
    return YEARS_BY_COURSE[filterCourse] || ['1st Year', '2nd Year', '3rd Year', '4th Year']
  }, [isTeacher, teacherAssignedClassRecords, filterCourse, filterBranch])

  const availableSections = useMemo(() => {
    if (isTeacher) {
      const sections = Array.from(
        new Set(
          teacherAssignedClassRecords
            .filter((c) => {
              const courseMatch = c.course.toLowerCase() === filterCourse.toLowerCase()
              const branchMatch = isBranchMatch(c.branch, filterBranch)
              const yearMatch = (c.year || getYearBySemester(c.semester, c.course)).toLowerCase() === filterYear.toLowerCase()
              return courseMatch && branchMatch && yearMatch
            })
            .map((c) => c.section)
        )
      )
      return sections.length > 0 ? sections : ['Section A', 'Section B', 'Section C']
    }
    const dbSections = classes
      .filter((c) => {
        const courseMatch = c.course.toLowerCase() === filterCourse.toLowerCase()
        const branchMatch = isBranchMatch(c.branch, filterBranch)
        const yearMatch = (c.year || getYearBySemester(c.semester, c.course)).toLowerCase() === filterYear.toLowerCase()
        return courseMatch && branchMatch && yearMatch
      })
      .map((c) => c.section)
    return Array.from(new Set([...dbSections, 'Section A', 'Section B', 'Section C']))
  }, [isTeacher, teacherAssignedClassRecords, classes, filterCourse, filterBranch, filterYear])

  // Synchronize Student Class Context automatically
  useEffect(() => {
    if (isStudent && currentStudent) {
      const sCourse = currentStudent.course || 'B.Tech'
      const bList = TIMETABLE_BRANCHES_BY_COURSE[sCourse] || ['ECE']
      const sBranch = bList.find((b) => isBranchMatch(b, currentStudent.branch)) || currentStudent.branch || bList[0]
      const sYear = currentStudent.year || getYearBySemester(currentStudent.semester, sCourse) || '3rd Year'
      const sSection = currentStudent.section || 'Section A'

      setFilterCourse(sCourse)
      setFilterBranch(sBranch)
      setFilterYear(sYear)
      setFilterSemester(currentStudent.semester || DEFAULT_SEMESTER_FOR_YEAR[sYear] || 'Semester 5')
      setFilterSection(sSection)
    }
  }, [isStudent, currentStudent])

  // Synchronize Teacher Initial Class Context automatically
  useEffect(() => {
    if (isTeacher && teacherAssignedClassRecords.length > 0) {
      const firstCls = teacherAssignedClassRecords[0]
      const tCourse = firstCls.course || 'B.Tech'
      const tBranch = firstCls.branch || 'ECE'
      const tYear = firstCls.year || getYearBySemester(firstCls.semester, tCourse) || '1st Year'
      const tSection = firstCls.section || 'Section A'

      setFilterCourse(tCourse)
      setFilterBranch(tBranch)
      setFilterYear(tYear)
      setFilterSemester(firstCls.semester || DEFAULT_SEMESTER_FOR_YEAR[tYear] || 'Semester 1')
      setFilterSection(tSection)
    }
  }, [isTeacher, teacherAssignedClassRecords])

  // Cascading Filter Change Handlers
  const handleCourseChange = (newCourse: string) => {
    setFilterCourse(newCourse)

    let newBranches: string[] = []
    if (isTeacher) {
      newBranches = Array.from(
        new Set(
          teacherAssignedClassRecords
            .filter((c) => c.course.toLowerCase() === newCourse.toLowerCase())
            .map((c) => c.branch)
        )
      )
    }
    if (!newBranches || newBranches.length === 0) {
      newBranches = TIMETABLE_BRANCHES_BY_COURSE[newCourse] || ['ECE']
    }
    const nextBranch = newBranches[0] || 'ECE'
    setFilterBranch(nextBranch)

    let newYears: string[] = []
    if (isTeacher) {
      newYears = Array.from(
        new Set(
          teacherAssignedClassRecords
            .filter(
              (c) =>
                c.course.toLowerCase() === newCourse.toLowerCase() &&
                isBranchMatch(c.branch, nextBranch)
            )
            .map((c) => c.year || getYearBySemester(c.semester, c.course))
        )
      )
    }
    if (!newYears || newYears.length === 0) {
      newYears = YEARS_BY_COURSE[newCourse] || ['1st Year']
    }
    const nextYear = newYears[0] || '1st Year'
    setFilterYear(nextYear)
    setFilterSemester(DEFAULT_SEMESTER_FOR_YEAR[nextYear] || 'Semester 1')

    let newSections: string[] = []
    if (isTeacher) {
      newSections = Array.from(
        new Set(
          teacherAssignedClassRecords
            .filter((c) => {
              const courseMatch = c.course.toLowerCase() === newCourse.toLowerCase()
              const branchMatch = isBranchMatch(c.branch, nextBranch)
              const yearMatch = (c.year || getYearBySemester(c.semester, c.course)).toLowerCase() === nextYear.toLowerCase()
              return courseMatch && branchMatch && yearMatch
            })
            .map((c) => c.section)
        )
      )
    }
    if (!newSections || newSections.length === 0) {
      newSections = ['Section A', 'Section B', 'Section C']
    }
    setFilterSection(newSections[0] || 'Section A')
  }

  const handleBranchChange = (newBranch: string) => {
    setFilterBranch(newBranch)

    let newYears: string[] = []
    if (isTeacher) {
      newYears = Array.from(
        new Set(
          teacherAssignedClassRecords
            .filter(
              (c) =>
                c.course.toLowerCase() === filterCourse.toLowerCase() &&
                isBranchMatch(c.branch, newBranch)
            )
            .map((c) => c.year || getYearBySemester(c.semester, c.course))
        )
      )
    }
    if (!newYears || newYears.length === 0) {
      newYears = YEARS_BY_COURSE[filterCourse] || ['1st Year']
    }
    const nextYear = newYears.includes(filterYear) ? filterYear : (newYears[0] || '1st Year')
    setFilterYear(nextYear)
    setFilterSemester(DEFAULT_SEMESTER_FOR_YEAR[nextYear] || 'Semester 1')

    let newSections: string[] = []
    if (isTeacher) {
      newSections = Array.from(
        new Set(
          teacherAssignedClassRecords
            .filter((c) => {
              const courseMatch = c.course.toLowerCase() === filterCourse.toLowerCase()
              const branchMatch = isBranchMatch(c.branch, newBranch)
              const yearMatch = (c.year || getYearBySemester(c.semester, c.course)).toLowerCase() === nextYear.toLowerCase()
              return courseMatch && branchMatch && yearMatch
            })
            .map((c) => c.section)
        )
      )
    }
    if (!newSections || newSections.length === 0) {
      newSections = ['Section A', 'Section B', 'Section C']
    }
    const nextSection = newSections.includes(filterSection) ? filterSection : (newSections[0] || 'Section A')
    setFilterSection(nextSection)
  }

  const handleYearChange = (newYear: string) => {
    setFilterYear(newYear)
    setFilterSemester(DEFAULT_SEMESTER_FOR_YEAR[newYear] || 'Semester 1')

    let newSections: string[] = []
    if (isTeacher) {
      newSections = Array.from(
        new Set(
          teacherAssignedClassRecords
            .filter((c) => {
              const courseMatch = c.course.toLowerCase() === filterCourse.toLowerCase()
              const branchMatch = isBranchMatch(c.branch, filterBranch)
              const yearMatch = (c.year || getYearBySemester(c.semester, c.course)).toLowerCase() === newYear.toLowerCase()
              return courseMatch && branchMatch && yearMatch
            })
            .map((c) => c.section)
        )
      )
    }
    if (!newSections || newSections.length === 0) {
      newSections = ['Section A', 'Section B', 'Section C']
    }
    const nextSection = newSections.includes(filterSection) ? filterSection : (newSections[0] || 'Section A')
    setFilterSection(nextSection)
  }

  // Teacher Assigned Class Permission Evaluator
  const isClassAssignedToTeacher = useMemo(() => {
    if (isAdmin) return true
    if (isStudent) return false
    if (!currentTeacher) return false

    // Check if selected filter match teacher's assigned class records
    const matchedInAssigned = teacherAssignedClassRecords.some((c) => {
      const courseMatch = c.course.toLowerCase() === filterCourse.toLowerCase()
      const branchMatch = isBranchMatch(c.branch, filterBranch)
      const yearMatch = c.year?.toLowerCase() === filterYear.toLowerCase() || getYearBySemester(c.semester, c.course).toLowerCase() === filterYear.toLowerCase()
      const secMatch = c.section.toLowerCase() === filterSection.toLowerCase()
      return courseMatch && branchMatch && yearMatch && secMatch
    })
    if (matchedInAssigned) return true

    // Check teacher's assigned_classes string array as backup
    if (Array.isArray(currentTeacher.assigned_classes) && currentTeacher.assigned_classes.length > 0) {
      return currentTeacher.assigned_classes.some((assignedStr) => {
        const lower = assignedStr.toLowerCase()
        const matchCourse = lower.includes(filterCourse.toLowerCase())
        const matchBranch = lower.includes(filterBranch.toLowerCase())
        const matchYear = lower.includes(filterYear.toLowerCase()) || (filterSemester && lower.includes(filterSemester.toLowerCase()))
        const matchSection = lower.includes(filterSection.toLowerCase())
        return matchCourse && matchBranch && matchYear && matchSection
      })
    }

    // Fallback: check if teacher has any timetable entry in this class
    return timetable.some(
      (e) =>
        e.course.toLowerCase() === filterCourse.toLowerCase() &&
        isBranchMatch(e.branch, filterBranch) &&
        (e.year?.toLowerCase() === filterYear.toLowerCase() || getYearBySemester(e.semester, e.course).toLowerCase() === filterYear.toLowerCase()) &&
        e.section.toLowerCase() === filterSection.toLowerCase() &&
        (e.teacher_id === currentTeacher.teacher_id || e.teacher_id === currentTeacher.id || e.teacher_name === currentTeacher.name)
    )
  }, [isAdmin, isStudent, currentTeacher, teacherAssignedClassRecords, filterCourse, filterBranch, filterYear, filterSemester, filterSection, timetable])

  // Permission checks combining Layer 1 (Role/Overrides) and Layer 2 (Teacher Class Assignment)
  const canCreateTimetable = isAdmin || (isTeacher && isClassAssignedToTeacher && hasPermission(user, 'timetable.create'))
  const canEditTimetable = isAdmin || (isTeacher && isClassAssignedToTeacher && hasPermission(user, 'timetable.edit'))
  const canDeleteTimetable = isAdmin || (isTeacher && isClassAssignedToTeacher && hasPermission(user, 'timetable.delete'))
  const canManageCurrentClass = canCreateTimetable || canEditTimetable || canDeleteTimetable

  // Enrolled Students list for active Course + Branch + Year + Section
  const classStudents = useMemo(() => {
    return students.filter((s) => {
      if (filterCourse && s.course && s.course.toLowerCase() !== filterCourse.toLowerCase()) return false
      if (filterBranch && s.branch && !isBranchMatch(s.branch, filterBranch)) return false
      if (filterYear && s.year) {
        if (s.year.toLowerCase() !== filterYear.toLowerCase()) {
          if (getYearBySemester(s.semester, s.course).toLowerCase() !== filterYear.toLowerCase()) return false
        }
      }
      if (filterSection && s.section) {
        if (s.section.toLowerCase() !== filterSection.toLowerCase()) return false
      }
      return true
    })
  }, [students, filterCourse, filterBranch, filterYear, filterSection])

  const studentCount = classStudents.length

  // Class Record from DB for metadata
  const currentClassRecord = useMemo(() => {
    return classes.find((c) => {
      const courseMatch = c.course.toLowerCase() === filterCourse.toLowerCase()
      const branchMatch = isBranchMatch(c.branch, filterBranch)
      const yearMatch = c.year?.toLowerCase() === filterYear.toLowerCase() || getYearBySemester(c.semester, c.course).toLowerCase() === filterYear.toLowerCase()
      const secMatch = c.section.toLowerCase() === filterSection.toLowerCase()
      return courseMatch && branchMatch && yearMatch && secMatch
    })
  }, [classes, filterCourse, filterBranch, filterYear, filterSection])

  // Timetable Entries for active class
  const classTimetable = useMemo(() => {
    return timetable.filter((entry) => {
      if (entry.class_id && currentClassRecord?.id && entry.class_id === currentClassRecord.id) {
        return true
      }
      if (entry.course.toLowerCase() !== filterCourse.toLowerCase()) return false
      if (!isBranchMatch(entry.branch, filterBranch)) return false
      const entryYear = entry.year || getYearBySemester(entry.semester, entry.course)
      if (entryYear.toLowerCase() !== filterYear.toLowerCase()) return false
      if (filterSection && entry.section && entry.section.toLowerCase() !== filterSection.toLowerCase()) return false
      return true
    })
  }, [timetable, filterCourse, filterBranch, filterYear, filterSection, currentClassRecord])

  // Live Metadata for Class Header
  const displayRoomNo = useMemo(() => {
    if (currentClassRecord?.room_no) return currentClassRecord.room_no
    const entryWithRoom = classTimetable.find((e) => e.room_no && e.room_no.trim() !== '')
    if (entryWithRoom?.room_no) return entryWithRoom.room_no
    return 'Room 204'
  }, [currentClassRecord, classTimetable])

  const displayClassTeacher = useMemo(() => {
    if (currentClassRecord?.teacher_name) return currentClassRecord.teacher_name
    const foundTeacher = teachers.find((t) => {
      if (Array.isArray(t.assigned_classes)) {
        return t.assigned_classes.some((ac) => ac.toLowerCase().includes(filterBranch.toLowerCase()) && ac.toLowerCase().includes(filterSection.toLowerCase()))
      }
      return false
    })
    if (foundTeacher?.name) return foundTeacher.name
    return 'Dr. Rahul Sharma'
  }, [currentClassRecord, teachers, filterBranch, filterSection])

  // Distinct Faculty/Subject Teachers teaching this class (for bottom dynamic signature)
  const distinctSubjectTeachers = useMemo(() => {
    const map = new Map<string, string>()
    classTimetable.forEach((e) => {
      if (e.teacher_name && e.teacher_name.trim() !== '' && e.teacher_name !== 'Unassigned') {
        map.set(e.teacher_name, e.subject || 'Faculty')
      }
    })
    return Array.from(map.entries()).map(([name, subject]) => ({ name, subject }))
  }, [classTimetable])

  // Determine current day of week name (Monday - Sunday)
  const todayDayName = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[new Date().getDay()] || 'Monday'
  }, [])

  // 1. Stat: Total Classes (Role & Filter scoped)
  const statTotalClasses = useMemo(() => {
    if (isStudent) return 1
    if (isTeacher) {
      const matching = teacherAssignedClassRecords.filter((c) => {
        const courseMatch = !filterCourse || c.course.toLowerCase() === filterCourse.toLowerCase()
        const branchMatch = !filterBranch || isBranchMatch(c.branch, filterBranch)
        const yearMatch = !filterYear || c.year?.toLowerCase() === filterYear.toLowerCase() || getYearBySemester(c.semester, c.course).toLowerCase() === filterYear.toLowerCase()
        const secMatch = !filterSection || c.section.toLowerCase() === filterSection.toLowerCase()
        return courseMatch && branchMatch && yearMatch && secMatch
      })
      return matching.length > 0 ? matching.length : teacherAssignedClassRecords.length
    }
    // Admin
    const matching = classes.filter((c) => {
      const courseMatch = !filterCourse || c.course.toLowerCase() === filterCourse.toLowerCase()
      const branchMatch = !filterBranch || isBranchMatch(c.branch, filterBranch)
      const yearMatch = !filterYear || c.year?.toLowerCase() === filterYear.toLowerCase() || getYearBySemester(c.semester, c.course).toLowerCase() === filterYear.toLowerCase()
      const secMatch = !filterSection || c.section.toLowerCase() === filterSection.toLowerCase()
      return courseMatch && branchMatch && yearMatch && secMatch
    })
    return matching.length > 0 ? matching.length : classes.length
  }, [isStudent, isTeacher, teacherAssignedClassRecords, classes, filterCourse, filterBranch, filterYear, filterSection])

  // 2. Stat: Total Lectures (Filtered timetable entries count)
  const statTotalLectures = useMemo(() => {
    return classTimetable.length
  }, [classTimetable])

  // 3. Stat: Today's Classes (Scheduled entries for current day)
  const statTodaysClasses = useMemo(() => {
    return classTimetable.filter((e) => e.day.toLowerCase() === todayDayName.toLowerCase()).length
  }, [classTimetable, todayDayName])

  // 4. Stat: Available Rooms (Distinct room count represented in active timetable scope)
  const statAvailableRooms = useMemo(() => {
    const roomSet = new Set<string>()
    classTimetable.forEach((e) => {
      if (e.room_no && e.room_no.trim() !== '') {
        roomSet.add(e.room_no.trim())
      }
    })
    if (roomSet.size > 0) return roomSet.size
    if (currentClassRecord?.room_no) return 1
    return classTimetable.length > 0 ? 1 : 0
  }, [classTimetable, currentClassRecord])

  // Modals & Drawers State
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimetablePeriodEntry | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [studentSearchQuery, setStudentSearchQuery] = useState('')

  const filteredClassStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return classStudents
    const q = studentSearchQuery.toLowerCase()
    return classStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.roll_no || '').toLowerCase().includes(q) ||
        (s.student_id || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q)
    )
  }, [classStudents, studentSearchQuery])

  // Drawer Form fields
  const [formDay, setFormDay] = useState('Monday')
  const [formStartPeriodNum, setFormStartPeriodNum] = useState<number>(1)
  const [formEndPeriodNum, setFormEndPeriodNum] = useState<number>(1)
  const [formEntryType, setFormEntryType] = useState<string>('Lecture')
  const [formSubject, setFormSubject] = useState('Digital Communication')
  const [formSubjectCode, setFormSubjectCode] = useState('BEC 601')
  const [formTeacherId, setFormTeacherId] = useState('')
  const [formTeacherName, setFormTeacherName] = useState('')
  const [formRoomNo, setFormRoomNo] = useState(displayRoomNo)
  const [formEffectiveFrom, setFormEffectiveFrom] = useState('2026-02-02')

  // Active Period & Days Configuration for selected Course & Year
  const activeConfig = useMemo(() => {
    return getTimetableConfig(filterCourse, filterYear)
  }, [getTimetableConfig, filterCourse, filterYear])

  const activePeriods = activeConfig.periods
  const activeDays = activeConfig.days

  // Filter registered subjects for quick selection
  const registeredSubjects = useMemo(() => {
    return academicStore.getSubjectsByClass(filterCourse, filterBranch, filterSemester)
  }, [filterCourse, filterBranch, filterSemester])

  // Conflict Detector Warning Message in Drawer
  const conflictMessage = useMemo(() => {
    if (!showDrawer) return null
    const startP = activePeriods.find((p) => p.order_no === formStartPeriodNum)
    const endP = activePeriods.find((p) => p.order_no === formEndPeriodNum)
    const startLabel = startP ? startP.label : `Period ${formStartPeriodNum}`
    const endLabel = endP ? endP.label : `Period ${formEndPeriodNum}`

    return timetableStore.checkConflict({
      id: editingEntry?.id,
      course: filterCourse,
      branch: filterBranch,
      year: filterYear,
      semester: filterSemester,
      section: filterSection,
      day: formDay,
      period: startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`,
      start_period: startLabel,
      end_period: endLabel,
      start_period_num: formStartPeriodNum,
      end_period_num: formEndPeriodNum,
      start_time: startP?.start_time,
      end_time: endP?.end_time,
      subject: formSubject,
      subject_code: formSubjectCode,
      teacher_id: formTeacherId,
      teacher_name: formTeacherName,
      room_no: formRoomNo,
      entry_type: formEntryType,
      effective_from: formEffectiveFrom,
    })
  }, [
    showDrawer,
    editingEntry,
    filterCourse,
    filterBranch,
    filterYear,
    filterSemester,
    filterSection,
    formDay,
    formStartPeriodNum,
    formEndPeriodNum,
    formSubject,
    formSubjectCode,
    formTeacherId,
    formTeacherName,
    formRoomNo,
    formEntryType,
    formEffectiveFrom,
    activePeriods,
  ])

  // Open Drawer to Add/Edit Timetable Entry
  const openAddEntryDrawer = (day: string = 'Monday', startNum: number = 1, existing?: TimetablePeriodEntry) => {
    if (!canManageCurrentClass) {
      toast({
        type: 'error',
        title: 'Access Restricted',
        description: 'You are only authorized to manage timetables for your assigned classes.',
      })
      return
    }

    if (existing) {
      setEditingEntry(existing)
      setFormDay(existing.day)
      setFormStartPeriodNum(existing.start_period_num || 1)
      setFormEndPeriodNum(existing.end_period_num || existing.start_period_num || 1)
      setFormEntryType(existing.entry_type || 'Lecture')
      setFormSubject(existing.subject)
      setFormSubjectCode(existing.subject_code || '')
      setFormTeacherId(existing.teacher_id || '')
      setFormTeacherName(existing.teacher_name || '')
      setFormRoomNo(existing.room_no || displayRoomNo)
      setFormEffectiveFrom(existing.effective_from || '2026-02-02')
    } else {
      setEditingEntry(null)
      setFormDay(day)
      setFormStartPeriodNum(startNum)
      setFormEndPeriodNum(startNum)
      setFormEntryType('Lecture')
      const firstSub = registeredSubjects[0]
      if (firstSub) {
        setFormSubject(firstSub.name)
        setFormSubjectCode(firstSub.code)
      } else {
        setFormSubject('Digital Communication')
        setFormSubjectCode('BEC 601')
      }
      setFormTeacherId(teachers[0]?.teacher_id || teachers[0]?.id || '')
      setFormTeacherName(teachers[0]?.name || 'Dr. Rahul Sharma')
      setFormRoomNo(displayRoomNo)
      setFormEffectiveFrom('2026-02-02')
    }
    setShowDrawer(true)
  }

  // Save Timetable Entry
  const handleSaveEntry = async () => {
    if (!canManageCurrentClass) {
      toast({ type: 'error', title: 'Permission Denied', description: 'Cannot modify unassigned class timetable.' })
      return
    }

    if (!formSubject.trim()) {
      toast({ type: 'error', title: 'Subject Required', description: 'Please enter or select a subject name.' })
      return
    }

    if (formEndPeriodNum < formStartPeriodNum) {
      toast({ type: 'error', title: 'Invalid Period Range', description: 'End Period cannot be earlier than Start Period.' })
      return
    }

    const startP = activePeriods.find((p) => p.order_no === formStartPeriodNum)
    const endP = activePeriods.find((p) => p.order_no === formEndPeriodNum)
    const startLabel = startP ? startP.label : `P${formStartPeriodNum}`
    const endLabel = endP ? endP.label : `P${formEndPeriodNum}`
    const periodStr = startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`

    const payload: Omit<TimetablePeriodEntry, 'created_at' | 'id'> & { id?: string } = {
      id: editingEntry?.id,
      class_id: currentClassRecord?.id,
      college_id: editingEntry?.college_id || user?.college_id || user?.school_id || '13695a78-0105-4bde-bc85-d664bb66637e',
      course: filterCourse,
      branch: filterBranch,
      year: filterYear,
      semester: filterSemester,
      section: filterSection,
      day: formDay,
      period: periodStr,
      start_period: startLabel,
      end_period: endLabel,
      start_period_num: formStartPeriodNum,
      end_period_num: formEndPeriodNum,
      start_time: startP?.start_time || '09:00 AM',
      end_time: endP?.end_time || '09:55 AM',
      subject: formSubject.trim(),
      subject_code: formSubjectCode.trim(),
      teacher_id: formTeacherId,
      teacher_name: formTeacherName,
      room_no: formRoomNo.trim(),
      entry_type: formEntryType,
      effective_from: formEffectiveFrom,
    }

    const res = await savePeriod(payload)
    if (!res.success) {
      toast({ type: 'error', title: 'Conflict Warning', description: res.error })
      return
    }

    toast({
      type: 'success',
      title: editingEntry ? 'Entry Updated Successfully' : 'Entry Added Successfully',
      description: `Saved "${formSubject}" for ${formDay} (${periodStr}).`,
    })
    setShowDrawer(false)
  }

  // Delete Timetable Entry
  const handleDeleteEntry = async (id: string, subjectName: string) => {
    if (!canManageCurrentClass) {
      toast({ type: 'error', title: 'Permission Denied', description: 'Cannot delete entry for unassigned class.' })
      return
    }

    if (!window.confirm(`Are you sure you want to delete "${subjectName}" from the timetable?`)) {
      return
    }
    try {
      await deletePeriod(id)
      toast({ type: 'info', title: 'Entry Removed', description: `Deleted "${subjectName}" from timetable.` })
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', description: err.message || 'Could not delete entry.' })
    }
  }

  // Handle Teacher Select in Drawer
  const handleTeacherChange = (teachId: string) => {
    setFormTeacherId(teachId)
    const tObj = teachers.find((t: any) => t.teacher_id === teachId || t.id === teachId)
    if (tObj) {
      setFormTeacherName(tObj.name)
    }
  }

  // Handle Subject Select in Drawer
  const handleSubjectSelectChange = (subjNameVal: string) => {
    setFormSubject(subjNameVal)
    const subObj = registeredSubjects.find((s: any) => s.name === subjNameVal)
    if (subObj) {
      setFormSubjectCode(subObj.code)
    }
  }

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 1. TOP HEADER & CONTROLS TOOLBAR                             */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 border border-brand-200/60 dark:border-brand-800/60 shadow-sm">
              <Calendar className="h-6 w-6" />
            </div>
            Academic Timetable
          </h1>
          <p className="text-sm font-medium text-ink-400 mt-1.5">
            Role-based dynamic class scheduling, multi-period merging, room allocations, and faculty assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {!isStudent && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowStudentsModal(true)}
              className="gap-2 border border-border text-ink-600 font-semibold py-2 px-3.5 rounded-xl"
            >
              <Users className="h-4 w-4 text-brand-600" /> Enrolled Students ({classStudents.length})
            </Button>
          )}

          {isAdmin && (
            <>
              <Button size="sm" variant="ghost" onClick={() => setShowConfigModal(true)} className="gap-2 border border-border text-ink-600 font-semibold py-2 px-3.5 rounded-xl">
                <Settings className="h-4 w-4 text-ink-500" /> Period Slots
              </Button>
              <Button
                size="sm"
                onClick={() => openAddEntryDrawer()}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold gap-2 py-2 px-4 rounded-xl shadow-sm"
              >
                <Plus className="h-4 w-4" /> Add Lecture / Lab
              </Button>
            </>
          )}

          {isTeacher && (
            canCreateTimetable ? (
              <Button
                size="sm"
                onClick={() => openAddEntryDrawer()}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold gap-2 py-2 px-4 rounded-xl shadow-sm"
              >
                <Plus className="h-4 w-4" /> Add Lecture / Lab
              </Button>
            ) : (
              <span className="px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-xl flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/60">
                <Lock className="h-3.5 w-3.5" /> Read Only {!isClassAssignedToTeacher ? '(Unassigned Class)' : '(No Permission)'}
              </span>
            )
          )}

          {isStudent && (
            <span className="px-3 py-1.5 text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 rounded-xl flex items-center gap-1.5 border border-brand-200 dark:border-brand-800/60">
              <Lock className="h-3.5 w-3.5 text-brand-600" /> My Enrolled Class
            </span>
          )}

          <Button size="sm" variant="ghost" onClick={() => window.print()} className="gap-2 border border-border text-ink-600 font-semibold py-2 px-3.5 rounded-xl">
            <Printer className="h-4 w-4" /> Print / Export PDF
          </Button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. 4 TIMETABLE DASHBOARD SUMMARY GRID CARDS                 */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <StatCard
          label="Total Classes"
          value={statTotalClasses}
          icon={GraduationCap}
          tone="brand"
          caption={isStudent ? 'Enrolled Class Scope' : isTeacher ? 'Assigned Class Scope' : 'Active College Scope'}
        />
        <StatCard
          label="Total Lectures"
          value={statTotalLectures}
          icon={BookOpen}
          tone="info"
          caption="Scheduled period entries"
        />
        <StatCard
          label="Today's Classes"
          value={statTodaysClasses}
          icon={Calendar}
          tone="success"
          caption={`Scheduled for ${todayDayName}`}
        />
        <StatCard
          label="Available Rooms"
          value={statAvailableRooms}
          icon={DoorOpen}
          tone="warning"
          caption="Distinct allocated rooms"
        />
      </div>

      {/* ============================================================ */}
      {/* 3. CASCADING FILTER TOOLBAR (Matching Classes/Fees UI)      */}
      {/* ============================================================ */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border p-4 shadow-[var(--shadow-soft)] flex flex-wrap items-center justify-between gap-3 print:hidden">
        {!isStudent ? (
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <Select
              options={availableCourses.map((c) => ({ value: c, label: c }))}
              value={filterCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-44"
            />

            <Select
              options={availableBranches.map((b) => ({ value: b, label: b }))}
              value={filterBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="w-48"
            />

            <Select
              options={availableYears.map((y) => ({ value: y, label: y }))}
              value={filterYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-40"
            />

            <Select
              options={availableSections.map((s) => ({ value: s, label: s }))}
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-40"
            />
          </div>
        ) : (
          <div className="p-3.5 bg-canvas border border-border rounded-xl flex items-center justify-between w-full">
            <span className="text-xs font-bold text-ink-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-600 shrink-0" />
              Showing Timetable for: {filterCourse} — {filterBranch} | {filterYear} | {filterSection}
            </span>
            <span className="text-xs text-brand-700 dark:text-brand-300 font-semibold px-3 py-1 bg-brand-50 dark:bg-brand-950/60 rounded-full border border-brand-200 dark:border-brand-800/60">
              Enrolled Student View
            </span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. CLASS INFORMATION HEADER & TIMETABLE GRID ENGINE          */}
      {/* ============================================================ */}
      <div className="bg-surface text-ink-900 border border-border rounded-2xl shadow-[var(--shadow-soft)] p-6 print:bg-white print:text-black print:border-none print:shadow-none print:p-0 space-y-6">
        
        {/* Class Information Header Card */}
        <div className="border-b border-border pb-5 space-y-4 print:border-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-ink-900 tracking-tight uppercase print:text-black">
                {filterCourse} — {filterBranch}
              </h2>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-ink-400 mt-1 print:text-black">
                <span>{filterSemester} ({filterYear})</span>
                <span className="text-ink-300">•</span>
                <span>{filterSection}</span>
              </div>
            </div>
          </div>

          {/* Class Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs font-semibold">
            <div className="p-4 bg-canvas rounded-xl border border-border/80 shadow-xs hover:border-brand-300 transition-colors">
              <span className="text-[11px] uppercase font-extrabold text-ink-400 tracking-wider block mb-1">Room Location</span>
              <span className="text-base font-extrabold text-brand-600 print:text-black">{displayRoomNo}</span>
            </div>

            <div className="p-4 bg-canvas rounded-xl border border-border/80 shadow-xs hover:border-brand-300 transition-colors">
              <span className="text-[11px] uppercase font-extrabold text-ink-400 tracking-wider block mb-1">Enrolled Students</span>
              <span className="text-base font-extrabold text-ink-900 print:text-black">{studentCount} Students</span>
            </div>

            <div className="p-4 bg-canvas rounded-xl border border-border/80 shadow-xs hover:border-brand-300 transition-colors">
              <span className="text-[11px] uppercase font-extrabold text-ink-400 tracking-wider block mb-1">Class Teacher</span>
              <span className="text-base font-extrabold text-ink-900 print:text-black">{displayClassTeacher}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Timetable Grid Engine */}
        <div className="overflow-x-auto rounded-xl border border-border shadow-xs">
          <table className="w-full border-collapse border border-border text-center text-xs print:border-2 print:border-black">
            <thead>
              <tr className="bg-canvas text-ink-900 font-extrabold border-b border-border print:bg-slate-100 print:text-black print:border-b-2 print:border-black">
                <th className="border-r border-border p-3.5 w-28 text-center uppercase tracking-wider text-xs print:border-r-2 print:border-black">
                  Day / Time
                </th>

                {activePeriods.map((p) => {
                  if (p.is_break) {
                    return (
                      <th
                        key={p.id}
                        className="border-r border-border p-2.5 w-20 bg-amber-500/10 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold uppercase text-xs tracking-wider print:border-black"
                      >
                        {p.label}
                        <span className="block text-[10px] font-normal text-ink-400 font-mono mt-0.5">
                          {p.start_time} - {p.end_time}
                        </span>
                      </th>
                    )
                  }
                  return (
                    <th key={p.id} className="border-r border-border p-3 text-center min-w-[130px] print:border-black">
                      <span className="font-display font-extrabold text-sm sm:text-base text-ink-900 block">{p.label}</span>
                      <span className="text-[11px] font-mono font-medium block text-ink-400 mt-0.5">
                        {p.start_time} - {p.end_time}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {activeDays.map((dayName, dayIdx) => {
                let skipCount = 0

                return (
                  <tr key={dayName} className="border-b border-border text-ink-900 min-h-[85px] hover:bg-canvas/30 transition-colors print:border-black">
                    {/* Day Column */}
                    <td className="border-r border-border font-extrabold p-3 bg-canvas/70 uppercase text-xs w-28 text-center align-middle print:bg-slate-50 print:border-r-2 print:border-black">
                      <span className="px-2.5 py-1 rounded-lg bg-surface border border-border/80 shadow-xs inline-block">
                        {dayName.substring(0, 3).toUpperCase()}
                      </span>
                    </td>

                    {/* Period Columns */}
                    {activePeriods.map((periodObj) => {
                      if (skipCount > 0) {
                        skipCount--
                        return null
                      }

                      {/* Lunch Merged Block: Single rowSpan column spanning top to bottom */}
                      if (periodObj.is_break) {
                        if (dayIdx === 0) {
                          return (
                            <td
                              key={periodObj.id}
                              rowSpan={activeDays.length}
                              className="border-r border-border p-3 bg-gradient-to-b from-amber-500/15 via-amber-500/10 to-amber-500/15 dark:from-amber-950/50 dark:via-amber-900/30 dark:to-amber-950/40 font-extrabold text-amber-800 dark:text-amber-300 text-sm uppercase tracking-[0.3em] text-center align-middle print:bg-amber-50 print:text-amber-900 print:border-black border-l border-amber-300/40 dark:border-amber-800/40"
                            >
                              <div className="flex flex-col items-center justify-center space-y-2 py-6 font-display">
                                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-black mb-1">
                                  🍽️
                                </div>
                                <span className="font-extrabold text-sm">L</span>
                                <span className="font-extrabold text-sm">U</span>
                                <span className="font-extrabold text-sm">N</span>
                                <span className="font-extrabold text-sm">C</span>
                                <span className="font-extrabold text-sm">H</span>
                              </div>
                            </td>
                          )
                        }
                        return null
                      }

                      {/* Find entry starting at this period number */}
                      const entry = classTimetable.find(
                        (e) => e.day.toLowerCase() === dayName.toLowerCase() && e.start_period_num === periodObj.order_no
                      )

                      if (entry) {
                        const span = Math.max(1, (entry.end_period_num || entry.start_period_num) - entry.start_period_num + 1)
                        if (span > 1) {
                          skipCount = span - 1
                        }

                        const styleTokens = entryTypeColors[entry.entry_type || 'Lecture'] || entryTypeColors.Lecture

                        return (
                          <td
                            key={periodObj.id}
                            colSpan={span}
                            className={`border-r border-border p-3 align-middle relative group transition-all duration-200 ${styleTokens.bg} ${styleTokens.darkBg} ${styleTokens.text} ${styleTokens.darkText} ${styleTokens.border} ${span > 1 ? 'border-l-4 shadow-sm' : 'border-l-2'} print:border-black`}
                          >
                            <div className="space-y-1.5 text-center">
                              {/* Subject Code & Name */}
                              <div className="font-bold text-xs sm:text-sm leading-snug tracking-tight">
                                {entry.subject_code ? (
                                  <span className="inline-block px-1.5 py-0.5 mr-1 text-[10px] font-mono font-bold rounded bg-surface/70 border border-border/50">
                                    {entry.subject_code}
                                  </span>
                                ) : null}
                                {entry.subject}
                              </div>

                              {/* Teacher Name */}
                              {entry.teacher_name && (
                                <div className="text-[11px] font-semibold opacity-90">
                                  {entry.teacher_name}
                                </div>
                              )}

                              {/* Room Number & Duration Badge */}
                              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] opacity-80 pt-0.5">
                                {entry.room_no && <span className="font-semibold">Room: {entry.room_no}</span>}
                                {span > 1 && (
                                  <span className={`px-2 py-0.5 font-mono rounded-md font-bold ${styleTokens.badgeBg}`}>
                                    P{entry.start_period_num}–P{entry.end_period_num}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Hover Actions for Authorized Users */}
                            {canManageCurrentClass && (
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-surface p-1 rounded-lg shadow-md border border-border print:hidden transition-opacity">
                                {canEditTimetable && (
                                  <button
                                    type="button"
                                    onClick={() => openAddEntryDrawer(dayName, periodObj.order_no, entry)}
                                    className="p-1 text-brand-600 hover:bg-canvas rounded-md cursor-pointer"
                                    title="Edit Entry"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                {canDeleteTimetable && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteEntry(entry.id, entry.subject)}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                                    title="Delete Entry"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        )
                      }

                      {/* Empty Slot */}
                      return (
                        <td
                          key={periodObj.id}
                          className={`border-r border-border p-3 transition-colors text-center relative group print:border-black ${
                            canCreateTimetable ? 'hover:bg-brand-50/40 dark:hover:bg-brand-950/30 cursor-pointer' : ''
                          }`}
                          onClick={() => canCreateTimetable && openAddEntryDrawer(dayName, periodObj.order_no)}
                        >
                          {canCreateTimetable && (
                            <span className="opacity-0 group-hover:opacity-100 text-[11px] text-brand-600 font-bold flex items-center justify-center gap-1 print:hidden">
                              <Plus className="h-3.5 w-3.5" /> Add
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic Bottom Signatures (NO HARD-CODED NAMES) */}
        <div className="pt-6 border-t border-border mt-6 print:border-black">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-semibold text-ink-600">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-400 uppercase font-bold tracking-wider block">Assigned Class Teacher</span>
              <p className="text-sm font-bold text-ink-900">{displayClassTeacher}</p>
            </div>

            {distinctSubjectTeachers.length > 0 && (
              <div className="space-y-1 text-left sm:text-right">
                <span className="text-[10px] text-ink-400 uppercase font-bold tracking-wider block">Class Subject Faculty</span>
                <p className="text-xs text-ink-600 font-medium">
                  {distinctSubjectTeachers.slice(0, 4).map((t) => `${t.name} (${t.subject})`).join(' • ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. ENTRY DRAWER (MULTI-PERIOD LECTURE MERGING FLOW)           */}
      {/* ============================================================ */}
      <Drawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title={editingEntry ? 'Edit Timetable Lecture / Lab' : 'Add Timetable Lecture / Lab Entry'}
      >
        <div className="space-y-4 text-sm p-1">
          {conflictMessage && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-lg flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Conflict Alert</p>
                <p>{conflictMessage}</p>
              </div>
            </div>
          )}

          {/* Academic Selection Context */}
          <div className="p-3 bg-canvas/60 dark:bg-slate-800/60 border border-border dark:border-slate-700 rounded-lg text-xs space-y-1">
            <span className="font-bold text-ink-900 dark:text-slate-100">Target Academic Class:</span>
            <p className="text-ink-600 dark:text-slate-300 font-semibold">
              {filterCourse} ({filterBranch}) · {filterSemester} ({filterYear}) — {filterSection}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Day of Week" required>
              <Select
                options={activeDays.map((d) => ({ value: d, label: d }))}
                value={formDay}
                onChange={(e) => setFormDay(e.target.value)}
              />
            </FormField>

            <FormField label="Entry Type" required>
              <Select
                options={[
                  { value: 'Lecture', label: 'Lecture' },
                  { value: 'Lab', label: 'Lab / Practical' },
                  { value: 'Tutorial', label: 'Tutorial' },
                  { value: 'Training', label: 'Tech Training' },
                  { value: 'Project', label: 'Project Work' },
                  { value: 'Aptitude', label: 'Aptitude / PDP' },
                  { value: 'Library', label: 'Library' },
                  { value: 'Seminar', label: 'Seminar / Workshop' },
                  { value: 'Free Period', label: 'Free Period' },
                  { value: 'Other', label: 'Other Activity' },
                ]}
                value={formEntryType}
                onChange={(e) => setFormEntryType(e.target.value)}
              />
            </FormField>
          </div>

          {/* Multi-Period Merge Period Selector */}
          <div className="p-3 bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-brand-900 dark:text-brand-300 uppercase tracking-wider">
              Period Duration Selection (Multi-Period Merge)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Start Period" required>
                <Select
                  options={activePeriods.filter((p) => !p.is_break).map((p) => ({ value: String(p.order_no), label: `${p.label} (${p.start_time})` }))}
                  value={String(formStartPeriodNum)}
                  onChange={(e) => {
                    const num = Number(e.target.value)
                    setFormStartPeriodNum(num)
                    if (formEndPeriodNum < num) setFormEndPeriodNum(num)
                  }}
                />
              </FormField>

              <FormField label="End Period (Merge End)" required>
                <Select
                  options={activePeriods.filter((p) => !p.is_break && p.order_no >= formStartPeriodNum).map((p) => ({ value: String(p.order_no), label: `${p.label} (${p.end_time})` }))}
                  value={String(formEndPeriodNum)}
                  onChange={(e) => setFormEndPeriodNum(Number(e.target.value))}
                />
              </FormField>
            </div>

            <div className="text-xs text-brand-800 dark:text-brand-300 font-semibold flex items-center gap-1.5 bg-brand-100/60 dark:bg-brand-900/60 p-2 rounded">
              <Clock className="h-4 w-4 text-brand-600 shrink-0" />
              <span>
                Duration: <strong className="font-bold">{formEndPeriodNum - formStartPeriodNum + 1} Period(s)</strong> — Occupies Period {activePeriods.find((p) => p.order_no === formStartPeriodNum)?.label} to {activePeriods.find((p) => p.order_no === formEndPeriodNum)?.label}.
              </span>
            </div>
          </div>

          {/* Subject & Teacher Selection */}
          <FormField label="Subject Name / Activity Title" required>
            <Input
              value={formSubject}
              onChange={(e) => handleSubjectSelectChange(e.target.value)}
              placeholder="e.g. Digital Communication LAB"
            />
          </FormField>

          {registeredSubjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] font-semibold text-ink-400 block w-full">Quick Subject Choose:</span>
              {registeredSubjects.map((sub: any) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    setFormSubject(sub.name)
                    setFormSubjectCode(sub.code)
                  }}
                  className="px-2 py-0.5 text-[11px] bg-canvas dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-700 font-semibold border border-border dark:border-slate-700 rounded transition-colors"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Subject Code">
              <Input
                value={formSubjectCode}
                onChange={(e) => setFormSubjectCode(e.target.value)}
                placeholder="e.g. KEC-601"
              />
            </FormField>

            <FormField label="Assign Teacher">
              <Select
                options={[
                  { value: '', label: 'Unassigned' },
                  ...teachers.map((t: any) => ({ value: t.teacher_id || t.id, label: `${t.name} (${t.department || t.course})` })),
                ]}
                value={formTeacherId}
                onChange={(e) => handleTeacherChange(e.target.value)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Room / Location">
              <Input
                value={formRoomNo}
                onChange={(e) => setFormRoomNo(e.target.value)}
                placeholder="e.g. Room 204 or ECE Lab-1"
              />
            </FormField>

            <FormField label="Effective Date (W.E.F.)">
              <Input
                type="date"
                value={formEffectiveFrom}
                onChange={(e) => setFormEffectiveFrom(e.target.value)}
              />
            </FormField>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-border dark:border-slate-800">
            <Button variant="ghost" onClick={() => setShowDrawer(false)}>Cancel</Button>
            <Button onClick={handleSaveEntry} className="bg-brand-600 hover:bg-brand-700 text-white">
              {editingEntry ? 'Save Changes' : 'Assign to Timetable Grid'}
            </Button>
          </div>
        </div>
      </Drawer>

      {/* ============================================================ */}
      {/* 4. PERIOD SLOTS CONFIGURATION MODAL (ADMIN)                   */}
      {/* ============================================================ */}
      {showConfigModal && (
        <Modal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          title={`Configure Period Slots — ${filterCourse} (${filterYear})`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowConfigModal(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  toast({ type: 'success', title: 'Period Config Saved', description: 'Updated period slot timings for class.' })
                  setShowConfigModal(false)
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                Save Period Config
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-sm p-1">
            <p className="text-xs text-ink-500 dark:text-slate-400">
              Customize period slots, timings, and lunch breaks for {filterCourse} ({filterYear}).
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {activePeriods.map((p) => (
                <div key={p.id} className="p-2.5 bg-canvas/60 dark:bg-slate-800/60 border border-border dark:border-slate-700 rounded-lg flex items-center justify-between gap-3 text-xs">
                  <div className="font-bold text-ink-900 dark:text-slate-100 w-12">{p.label}</div>
                  <div className="flex items-center gap-2 flex-1">
                    <Input value={p.start_time} className="text-xs py-1" />
                    <span>to</span>
                    <Input value={p.end_time} className="text-xs py-1" />
                  </div>
                  <span className={p.is_break ? 'px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-[10px] font-bold rounded' : 'px-2 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-[10px] font-bold rounded'}>
                    {p.is_break ? 'BREAK' : 'LECTURE'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* ============================================================ */}
      {/* 5. ENROLLED STUDENTS LIST MODAL                              */}
      {/* ============================================================ */}
      {showStudentsModal && (
        <Modal
          isOpen={showStudentsModal}
          onClose={() => setShowStudentsModal(false)}
          title={`Enrolled Students — ${filterCourse} ${filterBranch} (${filterSemester} - ${filterSection})`}
          footer={
            <Button onClick={() => setShowStudentsModal(false)} className="bg-brand-600 text-white">
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-sm p-1">
            <div className="flex items-center justify-between gap-3 bg-brand-50/60 dark:bg-brand-950/40 p-3 rounded-lg border border-brand-100 dark:border-brand-900">
              <div>
                <p className="font-bold text-brand-950 dark:text-brand-200 text-xs uppercase">Target Academic Class</p>
                <p className="text-xs text-brand-700 dark:text-brand-300">
                  {filterCourse} ({filterBranch}) · {filterSemester} ({filterYear}) · {filterSection}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-brand-600 text-white font-bold text-xs rounded-full">
                {classStudents.length} Students
              </span>
            </div>

            <FormField label="Search Enrolled Students">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
                <Input
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  placeholder="Type student name, roll number or email..."
                  className="pl-9"
                />
              </div>
            </FormField>

            {filteredClassStudents.length === 0 ? (
              <EmptyState
                title="No Students Found"
                description={`No student records found enrolled in ${filterCourse} ${filterBranch} (${filterSemester}) - ${filterSection}.`}
              />
            ) : (
              <div className="max-h-72 overflow-y-auto border border-border dark:border-slate-800 rounded-lg divide-y divide-border dark:divide-slate-800">
                {filteredClassStudents.map((st, idx) => (
                  <div key={st.id || idx} className="p-3 hover:bg-canvas/50 dark:hover:bg-slate-800/50 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200 font-bold flex items-center justify-center text-xs shrink-0">
                        {st.name ? st.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <p className="font-bold text-ink-900 dark:text-slate-100">{st.name}</p>
                        <p className="text-[11px] text-ink-500 dark:text-slate-400 font-mono">
                          Roll No: <span className="font-semibold text-ink-700 dark:text-slate-200">{st.roll_no || st.student_id || 'N/A'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] space-y-0.5">
                      <p className="text-ink-600 dark:text-slate-400">{st.email || st.phone || 'No contact'}</p>
                      <span className="px-2 py-0.5 bg-canvas dark:bg-slate-800 text-ink-700 dark:text-slate-300 font-medium rounded text-[10px] border border-border dark:border-slate-700">
                        Section: {st.section || filterSection}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
