import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

async function verifyBothTeachers() {
  const client1 = createClient(supabaseUrl, supabaseKey)
  const client2 = createClient(supabaseUrl, supabaseKey)

  await client1.auth.signInWithPassword({ email: 'teacher07bt24ece00101@gmail.com', password: '07bt24ece00101' })
  await client2.auth.signInWithPassword({ email: 'teacher07bt24ece00102@gmail.com', password: '07bt24ece00102' })

  const { data: rawTeachers1 } = await client1.from('teachers').select('*')
  const { data: rawClasses1 } = await client1.from('classes').select('*')
  const { data: rawStudents1 } = await client1.from('students').select('*')

  const { data: rawTeachers2 } = await client2.from('teachers').select('*')
  const { data: rawClasses2 } = await client2.from('classes').select('*')
  const { data: rawStudents2 } = await client2.from('students').select('*')

  function getScopedStudents(userContext, rawTeachers, rawClasses, rawStudents) {
    const currentTeacher = rawTeachers?.find(t => t.email === userContext.email)
    if (!currentTeacher) return []

    const teacherClasses = rawClasses.filter(
      (c) =>
        c.teacher_id === currentTeacher.teacher_id ||
        (currentTeacher.email && c.teacher_id?.toLowerCase().trim() === currentTeacher.email.toLowerCase().trim()) ||
        (currentTeacher.name && c.teacher_name?.includes(currentTeacher.name)) ||
        (currentTeacher.assigned_classes || []).some(
          (ac) =>
            ac.includes(c.name) ||
            c.name.includes(ac) ||
            (ac.toLowerCase().includes(c.course.toLowerCase()) &&
              ac.toLowerCase().includes(c.branch.toLowerCase()) &&
              ac.toLowerCase().includes(c.year.toLowerCase()))
        )
    )

    return rawStudents.filter((s) => {
      const matchClassObj = teacherClasses.some(
        (c) =>
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
  }

  const scoped1 = getScopedStudents({ role: 'teacher', email: 'teacher07bt24ece00101@gmail.com' }, rawTeachers1, rawClasses1, rawStudents1)
  const scoped2 = getScopedStudents({ role: 'teacher', email: 'teacher07bt24ece00102@gmail.com' }, rawTeachers2, rawClasses2, rawStudents2)

  console.log('=== FINAL STORE LEVEL VERIFICATION ===')
  console.log('Teacher 1 (Payal Rastogi) scoped student count:', scoped1.length)
  console.log('Teacher 2 (Ritu Kannaujiya) scoped student count:', scoped2.length)
  console.log('Student Names visible to Teacher 1:', scoped1.map(s => s.name))
  console.log('Student Names visible to Teacher 2:', scoped2.map(s => s.name))
}

verifyBothTeachers()
