import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectFeePayments() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  // Try select * from fee_payments
  const { data, error } = await supabase.from('fee_payments').select('*').limit(1);
  console.log('Select fee_payments error:', error);
  if (data && data.length > 0) {
    console.log('Columns in fee_payments:', Object.keys(data[0]));
    console.log('Sample row:', data[0]);
  }

  // Try inserting a dummy row with only minimum fields to see which columns exist/fail
  const testId = crypto.randomUUID();
  const res = await supabase.from('fee_payments').insert([{
    id: testId,
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    student_id: '18f6f70d-b44e-4cbf-b6d1-65302f6a7ea8',
    student_fee_id: 'sf_18f6f70d-b44e-4cbf-b6d1-65302f6a7ea8',
    amount: 100
  }]);
  console.log('Insert test with student_fee_id result:', res.error ? res.error : 'SUCCESS');

  // Try inserting without student_fee_id
  const testId2 = crypto.randomUUID();
  const res2 = await supabase.from('fee_payments').insert([{
    id: testId2,
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    student_id: '18f6f70d-b44e-4cbf-b6d1-65302f6a7ea8',
    amount: 100
  }]);
  console.log('Insert test without student_fee_id result:', res2.error ? res2.error : 'SUCCESS');
  
  if (!res2.error) {
    await supabase.from('fee_payments').delete().eq('id', testId2);
  }
}

inspectFeePayments().catch(console.error);
