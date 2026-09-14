import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepCheck() {
  console.log('--- Students by course & branch & year ---');
  const { data: students, error: stdErr } = await supabase
    .from('students')
    .select('id, name, roll_no, course, branch, year, semester, college_id')
    .limit(20);
  console.log('Students:', students?.length, 'Err:', stdErr);
  if (students && students.length > 0) {
    console.log('Sample students:', students.slice(0, 5));
  }

  console.log('\n--- Fee Structures ---');
  const { data: feeStructs, error: fsErr } = await supabase
    .from('fee_structures')
    .select('*');
  console.log('Fee Structures count:', feeStructs?.length, 'Err:', fsErr);
  console.log('Fee Structures:', feeStructs);

  console.log('\n--- Student Fees ---');
  const { data: sFees, error: sfErr } = await supabase
    .from('student_fees')
    .select('*');
  console.log('Student Fees count:', sFees?.length, 'Err:', sfErr);
  console.log('Student Fees sample:', sFees?.slice(0, 5));

  console.log('\n--- Fee Payments ---');
  const { data: fPayments, error: fpErr } = await supabase
    .from('fee_payments')
    .select('*');
  console.log('Fee Payments count:', fPayments?.length, 'Err:', fpErr);
  console.log('Fee Payments sample:', fPayments?.slice(0, 5));
}

deepCheck().catch(console.error);
