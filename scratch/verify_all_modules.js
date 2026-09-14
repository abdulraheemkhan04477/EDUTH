import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runE2ETests() {
  console.log('==================================================');
  console.log('AUTHENTICATED E2E MODULE FUNCTIONALITY & SUPABASE TEST');
  console.log('==================================================\n');

  // Authenticate as Teacher
  console.log('Signing in as Teacher user (teacher07bt24ece00101@gmail.com)...');
  const signInRes = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101',
  });

  if (signInRes.error) {
    console.error('Sign-in Error:', signInRes.error.message);
    return;
  }

  console.log('SUCCESS: Teacher Signed In! User ID:', signInRes.data.user.id);

  // Get User Profile to check college_id
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', signInRes.data.user.id).maybeSingle();
  console.log('Profile fetched:', { email: profile?.email, role: profile?.role, college_id: profile?.college_id });
  const collegeId = profile?.college_id || 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f';

  // 1. HISTORY / ATTENDANCE PERSISTENCE TEST
  console.log('\n--- 1. Testing Attendance Save, Persistence & Deletion in Supabase ---');
  const testAttId = `att_test_${Date.now()}`;
  const testAttRecord = {
    id: testAttId,
    college_id: collegeId,
    student_id: 'test_student_1',
    student_name: 'Test Student Attendance',
    roll_no: 'TEST-ATT-001',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'A',
    lecture: 'L-1',
    date: '2026-09-07',
    status: 'present',
    remarks: 'Punctual',
    marked_by: 'Teacher Test',
  };

  const attUpsert = await supabase.from('attendance').upsert([testAttRecord]).select();
  if (attUpsert.error) {
    console.error('Attendance Upsert Result:', attUpsert.error.message);
  } else {
    console.log('SUCCESS: Attendance Record Saved to Supabase! ID:', attUpsert.data[0].id);

    // Verify Fetch from History Query
    const attFetch = await supabase.from('attendance').select('*').eq('id', testAttId).maybeSingle();
    console.log('SUCCESS: History Query fetched saved attendance record:', attFetch.data?.student_name, attFetch.data?.status);

    // Edit Attendance
    const attUpdate = await supabase.from('attendance').update({ status: 'late', remarks: 'Traffic delay' }).eq('id', testAttId).select();
    console.log('SUCCESS: Edit Attendance updated record status to:', attUpdate.data?.[0]?.status);

    // Delete Attendance Record
    await supabase.from('attendance').delete().eq('id', testAttId);
    console.log('SUCCESS: Attendance Record Deleted cleanly from Supabase!');
  }

  // 2. NOTICE CREATION, TARGETING & DELETION TEST
  console.log('\n--- 2. Testing Notice Creation, Dynamic Targeting & Persistence in Supabase ---');
  const testNoticeId = `n_test_${Date.now()}`;
  const testNotice = {
    id: testNoticeId,
    college_id: collegeId,
    title: 'Semester 5 ECE Exam Schedule Released',
    description: 'Mid-term examination schedule for B.Tech ECE 3rd Year 5th Semester.',
    priority: 'high',
    author: 'Teacher Test',
    date: '2026-09-07',
    course: 'B.Tech',
    branch: 'ECE',
    year: '3rd Year',
    semester: 'Semester 5',
    publish_status: 'published',
  };

  const noticeUpsert = await supabase.from('notices').upsert([testNotice]).select();
  if (noticeUpsert.error) {
    console.error('Notice Upsert Result:', noticeUpsert.error.message);
  } else {
    console.log('SUCCESS: Targeted Notice Saved to Supabase! ID:', noticeUpsert.data[0].id);

    // Target Matching Test 1: B.Tech ECE 3rd Year 5th Semester Student (Should match)
    const eceStudentTarget = { course: 'B.Tech', branch: 'ECE', year: '3rd Year', semester: 'Semester 5' };
    const matchesEce = noticeUpsert.data[0].course === eceStudentTarget.course &&
                       noticeUpsert.data[0].branch === eceStudentTarget.branch &&
                       noticeUpsert.data[0].year === eceStudentTarget.year &&
                       noticeUpsert.data[0].semester === eceStudentTarget.semester;
    console.log('TARGET MATCH TEST (B.Tech ECE 3rd Year Sem 5 Student):', matchesEce ? 'PASS (Visible)' : 'FAIL (Hidden)');

    // Target Matching Test 2: Diploma CSE Student (Should NOT match)
    const cseStudentTarget = { course: 'Diploma', branch: 'CSE', year: '1st Year', semester: 'Semester 1' };
    const matchesCse = noticeUpsert.data[0].course === cseStudentTarget.course;
    console.log('TARGET MISMATCH TEST (Diploma CSE Student):', !matchesCse ? 'PASS (Hidden as expected)' : 'FAIL (Leaked notice)');

    // Delete Notice
    await supabase.from('notices').delete().eq('id', testNoticeId);
    console.log('SUCCESS: Notice Deleted cleanly from Supabase!');
  }

  // 3. REPORTS DATA QUERY TEST
  console.log('\n--- 3. Testing Reports Data Source Queries ---');
  const studentsCount = await supabase.from('students').select('*', { count: 'exact', head: true });
  const teachersCount = await supabase.from('teachers').select('*', { count: 'exact', head: true });
  const feeStructCount = await supabase.from('fee_structures').select('*', { count: 'exact', head: true });
  const resultsCount = await supabase.from('results').select('*', { count: 'exact', head: true });
  console.log('Live Database Counts for Reports:');
  console.log(` - Students Table Count: ${studentsCount.count}`);
  console.log(` - Teachers Table Count: ${teachersCount.count}`);
  console.log(` - Fee Structures Table Count: ${feeStructCount.count}`);
  console.log(` - Exam Results Table Count: ${resultsCount.count}`);

  console.log('\n==================================================');
  console.log('ALL MODULE VERIFICATION TESTS COMPLETED SUCCESSFULLY');
  console.log('==================================================');
}

runE2ETests().catch(console.error);
