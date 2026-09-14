import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

async function runVerification() {
  const client1 = createClient(supabaseUrl, supabaseKey)
  const client2 = createClient(supabaseUrl, supabaseKey)

  // Teacher 1
  await client1.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  })

  // Teacher 2
  await client2.auth.signInWithPassword({
    email: 'teacher07bt24ece00102@gmail.com',
    password: '07bt24ece00102'
  })

  const { data: teacher1Rec } = await client1.from('teachers').select('*').eq('email', 'teacher07bt24ece00101@gmail.com').single()
  const { data: teacher2Rec } = await client2.from('teachers').select('*').eq('email', 'teacher07bt24ece00102@gmail.com').single()

  const { data: students1 } = await client1.from('students').select('*')
  const { data: students2 } = await client2.from('students').select('*')

  const filterECE1stSectionA = (arr) => arr.filter(s => s.course === 'B.Tech' && s.branch === 'ECE' && s.year === '1st Year' && s.section === 'Section A')

  const eceStudents1 = filterECE1stSectionA(students1)
  const eceStudents2 = filterECE1stSectionA(students2)

  console.log('==================================================')
  console.log('REAL SUPABASE DATABASE VERIFICATION REPORT')
  console.log('==================================================')
  console.log('Target Class: B.Tech ECE - 1st Year - Section A')
  console.log('\n--- Assigned Teachers ---')
  console.log(`Teacher 1: ${teacher1Rec.name} (${teacher1Rec.email})`)
  console.log(`  Assigned Classes:`, teacher1Rec.assigned_classes)
  console.log(`Teacher 2: ${teacher2Rec.name} (${teacher2Rec.email})`)
  console.log(`  Assigned Classes:`, teacher2Rec.assigned_classes)

  console.log('\n--- Dynamic Student Count Verification ---')
  console.log(`Actual Student Count for B.Tech ECE 1st Year Sec A in DB: ${eceStudents1.length}`)
  console.log(`Teacher 1 sees student count: ${eceStudents1.length}`)
  console.log(`Teacher 2 sees student count: ${eceStudents2.length}`)
  console.log(`Are student counts equal across both teachers? ${eceStudents1.length === eceStudents2.length ? 'YES' : 'NO'}`)

  console.log('\n--- Accessible Student Roster (Shared Access) ---')
  eceStudents1.forEach((s, idx) => {
    console.log(`  Student ${idx + 1}: Roll=${s.roll_no}, Name=${s.name}, Email=${s.email}`)
  })
}

runVerification()
