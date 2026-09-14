import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'zuneydkhan04477@gmail.com',
    password: 'admin123'
  });
  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }
  console.log('Logged in user:', auth.user.id);

  console.log('\n--- 1. Querying students with eq(college_id) ---');
  const res1 = await supabase.from('students').select('*').eq('college_id', 'col_a1b2c3d4e5');
  console.log('Count:', res1.data?.length, 'Error:', res1.error?.message);
  if (res1.data && res1.data.length > 0) {
    console.log('Sample student:', res1.data[0]);
  }

  console.log('\n--- 2. Querying students without filter ---');
  const res2 = await supabase.from('students').select('*');
  console.log('Count:', res2.data?.length, 'Error:', res2.error?.message);

  console.log('\n--- 3. Querying student_fees when authenticated ---');
  const res3 = await supabase.from('student_fees').select('*');
  console.log('Count:', res3.data?.length, 'Error:', res3.error?.message);

  console.log('\n--- 4. Querying fee_structures when authenticated ---');
  const res4 = await supabase.from('fee_structures').select('*');
  console.log('Count:', res4.data?.length, 'Error:', res4.error?.message);

  console.log('\n--- 5. Querying fee_payments when authenticated ---');
  const res5 = await supabase.from('fee_payments').select('*');
  console.log('Count:', res5.data?.length, 'Error:', res5.error?.message);
}

testQuery().catch(console.error);
