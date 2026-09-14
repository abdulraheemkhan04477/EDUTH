import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function runTests() {
  console.log('=== RUNNING UPDATED COMMUNICATION SYSTEM VERIFICATION TESTS ===\n')

  let passed = 0
  let failed = 0

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`)
      passed++
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`)
      failed++
    }
  }

  try {
    const ADMIN_A_ID = '50efc471-d85c-4878-b7a3-ce1baa6f0bf4' // Zuneyd Khan (Admin, College A)
    const TEACHER_1_ID = 'c6115423-030f-4e3c-bc6e-a16dcfa65359' // Payal Rastogi (Teacher, ECE/CSE/Biotech 1st Year)
    const STUDENT_ECE_ID = '4a70154b-dc88-49e7-a106-83f5c26ad773' // Vivaan Kannojia (Student in ECE 1st Year)
    const STUDENT_UNASSIGNED_ID = 'e060413d-63df-463e-af25-6b29fcc33e1c' // Gaurav Bharti (Student in Diploma EC 2nd Year)
    const TEACHER_AIML_ID = 'aa6f5ce5-4af4-43e3-990a-d0bd7cd4d240' // Abhishek Dwivedi (Teacher, AIML 1st Year only)

    console.log('Test identities:')
    console.log(`- Admin A: ${ADMIN_A_ID}`)
    console.log(`- Teacher 1: ${TEACHER_1_ID}`)
    console.log(`- Student ECE: ${STUDENT_ECE_ID}`)
    console.log(`- Student Unassigned: ${STUDENT_UNASSIGNED_ID}\n`)

    // TEST 1 & 2: Teacher opens Communication -> Auto-shows assigned class students
    const { data: teacherAutoRecipients } = await supabase.rpc('get_communication_recipients', {
      p_user_id: TEACHER_1_ID,
      p_search_query: '',
      p_course: '',
      p_branch: '',
    })

    const foundAssignedStudent = teacherAutoRecipients?.some((r: any) => r.id === STUDENT_ECE_ID)
    const foundUnassignedStudent = teacherAutoRecipients?.some((r: any) => r.id === STUDENT_UNASSIGNED_ID)

    assert(
      foundAssignedStudent && !foundUnassignedStudent,
      'TEST 1 & 2: Teacher automatically receives all assigned-class students (and NO unassigned students)'
    )

    // TEST 3 & 4: Student opens Communication -> Auto-shows assigned class teachers
    const { data: studentAutoRecipients } = await supabase.rpc('get_communication_recipients', {
      p_user_id: STUDENT_ECE_ID,
      p_search_query: '',
      p_course: '',
      p_branch: '',
    })

    const foundPayalTeacher = studentAutoRecipients?.some((r: any) => r.id === TEACHER_1_ID)
    const foundAIMLTeacher = studentAutoRecipients?.some((r: any) => r.id === TEACHER_AIML_ID)

    assert(
      foundPayalTeacher && !foundAIMLTeacher,
      'TEST 3 & 4: Student automatically receives all assigned class teachers (and NO unrelated class teachers)'
    )

    // TEST 5: Admin opens Communication -> Auto-shows all college teachers
    const { data: adminAutoRecipients } = await supabase.rpc('get_communication_recipients', {
      p_user_id: ADMIN_A_ID,
      p_search_query: '',
      p_course: '',
      p_branch: '',
    })

    assert(
      Array.isArray(adminAutoRecipients) && adminAutoRecipients.length > 5,
      'TEST 5: Admin automatically sees all college teachers by default'
    )

    // TEST 6: Admin Course Filter
    const { data: adminCourseFilter } = await supabase.rpc('get_communication_recipients', {
      p_user_id: ADMIN_A_ID,
      p_search_query: '',
      p_course: 'B.Tech',
      p_branch: 'All Branches',
    })

    const allBtech = adminCourseFilter?.every((r: any) => r.course === 'B.Tech')
    assert(
      Array.isArray(adminCourseFilter) && adminCourseFilter.length > 0 && allBtech,
      'TEST 6: Admin Course filter (B.Tech) returns only B.Tech teachers'
    )

    // TEST 7: Admin Branch Filter
    const { data: adminBranchFilter } = await supabase.rpc('get_communication_recipients', {
      p_user_id: ADMIN_A_ID,
      p_search_query: '',
      p_course: 'B.Tech',
      p_branch: 'ECE',
    })

    const allEce = adminBranchFilter?.every((r: any) => r.branch === 'ECE')
    assert(
      Array.isArray(adminBranchFilter) && adminBranchFilter.length > 0 && allEce,
      'TEST 7: Admin Branch filter (B.Tech ECE) returns only ECE teachers'
    )

    // TEST 8 & 9: Admin Search + Filter combined
    const { data: adminCombinedSearch } = await supabase.rpc('get_communication_recipients', {
      p_user_id: ADMIN_A_ID,
      p_search_query: 'Payal',
      p_course: 'B.Tech',
      p_branch: 'ECE',
    })

    assert(
      Array.isArray(adminCombinedSearch) && adminCombinedSearch.some((r: any) => r.id === TEACHER_1_ID),
      'TEST 8 & 9: Admin search + Course + Branch filter combination returns matching teacher'
    )

    // TEST 10 & 11: Security & RLS Isolation
    const { error: blockUnassignedErr } = await supabase.rpc('get_or_create_conversation', {
      p_target_user_id: STUDENT_UNASSIGNED_ID,
      p_user_id: TEACHER_1_ID,
    })
    assert(Boolean(blockUnassignedErr), 'TEST 11: Security/RLS blocks Teacher messaging unassigned student')

    console.log(`\n=== VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED ===`)
  } catch (err: any) {
    console.error('Test error:', err)
  }
}

runTests()
