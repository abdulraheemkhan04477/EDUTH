import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRlsDetails() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const { data: user } = await supabase.auth.getUser();
  console.log('Logged in user ID:', user.user?.id);

  // Check what profiles record exists for user.user?.id
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.user?.id).single();
  console.log('User profile:', profile);

  // Attempt insert to fee_structures with college_id matching profile.college_id
  const testId = crypto.randomUUID();
  const res1 = await supabase.from('fee_structures').insert([{
    id: testId,
    college_id: profile.college_id,
    title: 'Test Structure RLS',
    course: 'B.Tech',
    branch: 'ECE',
    year_semester: '1st Year',
    total_amount: 50000,
    components: [],
    installments: [],
  }]);

  console.log('Insert fee_structures result:', res1.error ? res1.error.message : 'SUCCESS');

  // Attempt insert to fee_payments with college_id matching profile.college_id
  const res2 = await supabase.from('fee_payments').insert([{
    id: testId,
    college_id: profile.college_id,
    student_id: '4a70154b-dc88-49e7-a106-83f5c26ad773',
    receipt_no: 'REC-TEST-001',
    student_name: 'Test Student',
    roll_no: 'BT24ECE001',
    course: 'B.Tech',
    branch: 'ECE',
    year_semester: '1st Year',
    amount: 5000,
    payment_method: 'Cash',
    transaction_id: 'TXN-TEST',
    payment_date: '2026-09-06',
    status: 'Completed',
  }]);

  console.log('Insert fee_payments result:', res2.error ? res2.error.message : 'SUCCESS');
}

testRlsDetails().catch(console.error);
