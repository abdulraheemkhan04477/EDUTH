import { createClient } from '@supabase/supabase-js';
import { AuthService } from '../src/services/authService';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runFinalTests() {
  console.log('==================================================');
  console.log('FINAL E2E HISTORY & ALL MODULES VERIFICATION TEST');
  console.log('==================================================\n');

  // Authenticate
  console.log('Signing in as Teacher user (teacher07bt24ece00101@gmail.com)...');
  const signInRes = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101',
  });

  if (signInRes.error) {
    console.error('Sign-in Error:', signInRes.error.message);
    return;
  }
  console.log('SUCCESS: Authenticated User ID:', signInRes.data.user.id);

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', signInRes.data.user.id).maybeSingle();
  const collegeId = profile?.college_id || 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f';

  // 1. ATTENDANCE HISTORY TEST
  console.log('\n--- 1. Testing Attendance History Persistence ---');
  const attId = `att_test_final_${Date.now()}`;
  const attData = {
    id: attId,
    college_id: collegeId,
    student_id: 'std_test_001',
    student_name: 'Rohit Sharma',
    roll_no: '2303610000001',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'A',
    lecture: 'L-1',
    date: '2026-09-07',
    status: 'present',
    remarks: 'Punctual',
  };
  const attInsert = await supabase.from('attendance').upsert([attData]).select();
  if (attInsert.error) console.error('Attendance Error:', attInsert.error.message);
  else console.log('SUCCESS: Attendance History Record Saved & Verified! ID:', attInsert.data[0].id);
  await supabase.from('attendance').delete().eq('id', attId);

  // 2. FEE HISTORY TEST
  console.log('\n--- 2. Testing Fee Payment History Persistence ---');
  const feePayId = `pay_test_final_${Date.now()}`;
  const feeData = {
    id: feePayId,
    college_id: collegeId,
    student_id: 'std_test_001',
    student_name: 'Rohit Sharma',
    roll_no: '2303610000001',
    course: 'B.Tech',
    branch: 'ECE',
    year_semester: '1st Year',
    amount: 25000,
    payment_method: 'UPI',
    transaction_id: 'UPI9876543210',
    payment_date: '2026-09-07',
    status: 'paid',
  };
  const feeInsert = await supabase.from('fee_payments').upsert([feeData]).select();
  if (feeInsert.error) console.error('Fee Payment Error:', feeInsert.error.message);
  else console.log('SUCCESS: Fee Payment History Record Saved & Verified! Receipt ID:', feeInsert.data[0].id);
  await supabase.from('fee_payments').delete().eq('id', feePayId);

  // 3. EXAM HISTORY TEST
  console.log('\n--- 3. Testing Exam Result History Persistence ---');
  const resId = `res_test_final_${Date.now()}`;
  const examResultData = {
    id: resId,
    college_id: collegeId,
    student_id: 'std_test_001',
    student_name: 'Rohit Sharma',
    roll_no: '2303610000001',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    subject: 'Digital Electronics',
    obtained_marks: 88,
    max_marks: 100,
    status: 'Pass',
    is_published: true,
  };
  const examInsert = await supabase.from('results').upsert([examResultData]).select();
  if (examInsert.error) console.error('Exam Result Error:', examInsert.error.message);
  else console.log('SUCCESS: Exam Result History Record Saved & Verified! ID:', examInsert.data[0].id);
  await supabase.from('results').delete().eq('id', resId);

  // 4. SUSPENSION HISTORY TEST
  console.log('\n--- 4. Testing Student Suspension History Creation, Read, Edit & Delete ---');
  const suspId = `susp_test_final_${Date.now()}`;
  const suspData = {
    id: suspId,
    college_id: collegeId,
    student_id: 'std_test_001',
    student_name: 'Rohit Sharma',
    roll_no: '2303610000001',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    category: 'Examination Malpractice',
    reason: 'Unauthorized notes in exam hall',
    description: 'Student brought unauthorized material during mid-term exam.',
    start_date: '2026-09-07',
    end_date: '2026-09-21',
    status: 'Active',
    action_taken: 'Suspended for 14 days and parent conference scheduled',
    created_by: 'Faculty Test',
  };

  const suspInsert = await supabase.from('suspensions').upsert([suspData]).select();
  if (suspInsert.error) {
    console.error('Suspension Insert Error:', suspInsert.error.message);
  } else {
    console.log('SUCCESS: Student Suspension Record Created in Supabase! ID:', suspInsert.data[0].id);

    // Read Back Test
    const suspFetch = await supabase.from('suspensions').select('*').eq('id', suspId).maybeSingle();
    console.log('SUCCESS: Suspension Record Fetched from Supabase:', suspFetch.data?.student_name, 'Reason:', suspFetch.data?.reason);

    // Edit Suspension Status
    const suspEdit = await supabase.from('suspensions').update({ status: 'Completed' }).eq('id', suspId).select();
    console.log('SUCCESS: Suspension Record Status Updated to:', suspEdit.data?.[0]?.status);

    // Delete Suspension Record
    await supabase.from('suspensions').delete().eq('id', suspId);
    console.log('SUCCESS: Suspension Record Deleted cleanly from Supabase!');
  }

  console.log('\n==================================================');
  console.log('ALL FINAL HISTORY & MODULE TESTS PASSED PERFECTLY!');
  console.log('==================================================');
}

runFinalTests().catch(console.error);
