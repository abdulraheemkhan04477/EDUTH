import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

async function testScopedStudentsFilter() {
  const client = createClient(supabaseUrl, supabaseKey)
  await client.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  })

  const { data: rawTeachers } = await client.from('teachers').select('*')
  const { data: rawClasses } = await client.from('classes').select('*')
  const { data: rawStudents } = await client.from('students').select('*')

  const userContext = {
    role: 'teacher',
    email: 'teacher07bt24ece00101@gmail.com',
    name: 'Payal Rastogi'
  }

  const currentTeacher = rawTeachers?.find(t => t.email === userContext.email)

  // Old broken logic:
  const oldScoped = rawStudents?.filter((s) => currentTeacher?.assigned_classes?.includes(s.class_name) || currentTeacher?.assigned_classes?.includes(s.id))
  console.log('Old logic scoped students count:', oldScoped?.length) // Will be 0!

  // New robust logic:
  const teacherClasses = rawClasses?.filter((c) =>
    c.teacher_id === currentTeacher?.teacher_id ||
    (currentTeacher?.email && c.teacher_id?.toLowerCase().trim() === currentTeacher.email.toLowerCase().trim()) ||
    (currentTeacher?.name && c.teacher_name?.includes(currentTeacher.name)) ||
    (currentTeacher?.assigned_classes || []).some((ac) =>
      ac.includes(c.name) ||
      c.name.includes(ac) ||
      (ac.toLowerCase().includes(c.course.toLowerCase()) &&
        ac.toLowerCase().includes(c.branch.toLowerCase()) &&
        ac.toLowerCase().includes(c.year.toLowerCase()))
    )
  ) || []

  const newScoped = rawStudents?.filter((s) => {
    if (!currentTeacher) return false
    const matchClassObj = teacherClasses.some((c) =>
      s.course === c.course &&
      s.branch === c.branch &&
      s.year === c.year &&
      (!c.section || c.section === 'All Sections' || s.section === c.section || c.name.includes(s.section))
    )
    if (matchClassObj) return true

    const assigned = currentTeacher.assigned_classes || []
    if (assigned.length === 0) return false

    const secClean = (s.section || '').replace(/^Section\s+/i, '').trim()

    return assigned.some((ac) => {
      if (ac === s.class_name || ac === s.id) return true
      if (s.class_name && (ac.includes(s.class_name) || s.class_name.includes(ac))) return true
      const norm = ac.toLowerCase()
      const matchCourse = s.course && norm.includes(s.course.toLowerCase())
      const matchBranch = s.branch && norm.includes(s.branch.toLowerCase())
      const matchYear = s.year && norm.includes(s.year.toLowerCase())
      const matchSec = !secClean || norm.includes(secClean.toLowerCase())
      return matchCourse && matchBranch && matchYear && matchSec
    })
  })

  console.log('New logic scoped students count:', newScoped?.length)
  console.log('New logic student names:', newScoped?.map(s => s.name))
}

testScopedStudentsFilter()
