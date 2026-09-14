import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testAttendanceFlow() {
  console.log('=== ATTENDANCE MASTER FLOW TEST ===')

  // 1. Fetch Teacher Payal Rastogi profile / login test
  console.log('\n--- 1. Querying Teacher Payal Rastogi ---')
  const { data: teachers, error: tErr } = await supabase
    .from('teachers')
    .select('*')
    .eq('email', 'teacher07bt24ece00101@gmail.com')

  if (tErr) console.error('Teacher Query Error:', tErr)
  else console.log('Teacher Record:', teachers?.[0]?.name, 'College:', teachers?.[0]?.college_id)

  // 2. Fetch Students for B.Tech ECE - 1st Year - Section A in College 13695a78-0105-4bde-bc85-d664bb66637e
  console.log('\n--- 2. Querying Students for B.Tech ECE - 1st Year - Section A ---')
  const { data: eceStudents, error: sErr } = await supabase
    .from('students')
    .select('id, roll_no, name, email, parent_email')
    .eq('course', 'B.Tech')
    .eq('branch', 'ECE')
    .eq('year', '1st Year')
    .eq('section', 'Section A')

  if (sErr) console.error('Student Query Error:', sErr)
  else console.log(`Found ${eceStudents?.length || 0} students for B.Tech ECE 1st Year Sec A`)

  // 3. Perform a simulated save for teacher attendance
  const testDate = '2026-09-05'
  const testLecture = 'L-1'
  const teacherName = teachers?.[0]?.name || 'Payal Rastogi'
  const collegeId = teachers?.[0]?.college_id || '13695a78-0105-4bde-bc85-d664bb66637e'

  console.log('\n--- 3. Saving Attendance Records as Teacher ---')
  if (eceStudents && eceStudents.length > 0) {
    const attendancePayload = eceStudents.map((st, idx) => ({
      id: `att_${st.id}_${testDate}_${testLecture}`,
      college_id: collegeId,
      student_id: st.id,
      student_name: st.name,
      roll_no: st.roll_no,
      course: 'B.Tech',
      branch: 'ECE',
      year: '1st Year',
      semester: 'Semester 1',
      section: 'A',
      lecture: testLecture,
      class_name: 'B.Tech ECE - 1st Year - Section A',
      date: testDate,
      status: idx % 2 === 0 ? 'present' : 'absent',
      marked_by: teacherName,
      remarks: idx % 2 === 0 ? '' : 'Absent in L1',
    }))

    const { data: upsertData, error: uErr } = await supabase
      .from('attendance')
      .upsert(attendancePayload)

    if (uErr) console.error('Upsert Error:', uErr)
    else console.log('Successfully saved attendance records to Supabase for', attendancePayload.length, 'students!')
  }

  // 4. Admin Query Test — Verify Admin can see saved records
  console.log('\n--- 4. Querying Saved Attendance as Admin ---')
  const { data: adminAtt, error: aErr } = await supabase
    .from('attendance')
    .select('*')
    .eq('date', testDate)
    .eq('course', 'B.Tech')
    .eq('branch', 'ECE')

  if (aErr) console.error('Admin Fetch Error:', aErr)
  else console.log(`Admin History returned ${adminAtt?.length || 0} records for ${testDate} B.Tech ECE`)

  // 5. Verify Student Vivaan Kannojia's percentage & records
  const vivaan = eceStudents?.find(s => s.roll_no === 'BT24ECE001')
  if (vivaan) {
    console.log('\n--- 5. Student Vivaan Attendance Records ---')
    const { data: vivaanAtt, error: vErr } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', vivaan.id)

    if (vErr) console.error('Vivaan Fetch Error:', vErr)
    else {
      const total = vivaanAtt?.length || 0
      const present = vivaanAtt?.filter(a => a.status === 'present' || a.status === 'late').length || 0
      const pct = total > 0 ? Math.round((present / total) * 100) : 0
      console.log(`Vivaan Records: Total=${total}, Present=${present}, Pct=${pct}%`)
    }
  }

  console.log('\n=== TEST COMPLETE ===')
}

testAttendanceFlow()
