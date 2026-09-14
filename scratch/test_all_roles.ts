process.env.VITE_SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

async function testAllRoles() {
  const { AuthService } = await import('../src/services/authService')
  console.log('=== AUTH 2.0 ROLE VERIFICATION TESTS ===\n')

  // 1. Test Super Admin Login
  console.log('1. Testing Super Admin login via superAdminSignIn...')
  const superAdminRes = await AuthService.superAdminSignIn('superadmin@example.com', 'superadmin123')
  console.log('Super Admin Result:', {
    role: superAdminRes.user?.role,
    college_id: superAdminRes.user?.college_id,
    email: superAdminRes.user?.email,
    error: superAdminRes.error,
  })

  // 2. Test Admin Login with RRIMT email
  console.log('\n2. Testing College Admin login...')
  const adminRes = await AuthService.signIn('zuneydkhan04477@gmail.com', 'dummyPassword', 'admin')
  console.log('College Admin Result:', {
    role: adminRes.user?.role,
    college_id: adminRes.user?.college_id,
    name: adminRes.user?.name,
    email: adminRes.user?.email,
    error: adminRes.error,
  })

  // 3. Create & Test Teacher
  console.log('\n3. Creating & Testing Teacher Account...')
  const teacherEmail = `teacher_test_${Date.now()}@rrimt.edu`
  const teacherCreate = await AuthService.createTeacherAccount({
    name: 'Professor Vikram',
    email: teacherEmail,
    password: 'TeacherPass123!',
    teacher_id: 'TCH-RRIMT-001',
    college_id: 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f',
    department: 'Computer Science',
  })
  console.log('Teacher Creation:', teacherCreate.user ? 'SUCCESS' : teacherCreate.error)

  const teacherSignIn = await AuthService.signIn(teacherEmail, 'TeacherPass123!', 'teacher')
  console.log('Teacher Sign-In Result:', {
    role: teacherSignIn.user?.role,
    college_id: teacherSignIn.user?.college_id,
    teacher_id: teacherSignIn.user?.teacher_id,
    name: teacherSignIn.user?.name,
    error: teacherSignIn.error,
  })

  // 4. Create & Test Student
  console.log('\n4. Creating & Testing Student Account...')
  const studentEmail = `student_test_${Date.now()}@rrimt.edu`
  const studentCreate = await AuthService.createStudentAccount({
    name: 'Ananya Roy',
    email: studentEmail,
    password: 'StudentPass123!',
    roll_no: 'CS-2026-042',
    student_id: 'STU-RRIMT-042',
    college_id: 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f',
    course: 'B.Tech',
    branch: 'CSE',
    year: '3rd Year',
    semester: '5',
    section: 'A',
  })
  console.log('Student Creation:', studentCreate.user ? 'SUCCESS' : studentCreate.error)

  const studentSignIn = await AuthService.signIn(studentEmail, 'StudentPass123!', 'student')
  console.log('Student Sign-In Result:', {
    role: studentSignIn.user?.role,
    college_id: studentSignIn.user?.college_id,
    student_id: studentSignIn.user?.student_id,
    name: studentSignIn.user?.name,
    error: studentSignIn.error,
  })

  // 5. Create & Test Parent (linked to STU-RRIMT-042)
  console.log('\n5. Creating & Testing Parent Account...')
  const parentEmail = `parent_test_${Date.now()}@rrimt.edu`
  const parentCreate = await AuthService.createParentAccount({
    name: 'Suresh Roy',
    email: parentEmail,
    password: 'ParentPass123!',
    college_id: 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f',
    child_student_id: 'STU-RRIMT-042',
    relationship: 'Father',
  })
  console.log('Parent Creation:', parentCreate.user ? 'SUCCESS' : parentCreate.error)

  const parentSignIn = await AuthService.signIn(parentEmail, 'ParentPass123!', 'parent')
  console.log('Parent Sign-In Result:', {
    role: parentSignIn.user?.role,
    college_id: parentSignIn.user?.college_id,
    child_student_id: parentSignIn.user?.child_student_id,
    name: parentSignIn.user?.name,
    error: parentSignIn.error,
  })

  // 6. Test invalid role selection mismatch
  console.log('\n6. Testing role tile mismatch prevention...')
  const mismatchRes = await AuthService.signIn(studentEmail, 'StudentPass123!', 'teacher')
  console.log('Role Mismatch Result (Expected Error):', mismatchRes.error)
}

testAllRoles().catch(console.error)
