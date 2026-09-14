import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectFeesSchema() {
  console.log('--- Inspecting Students Table ---');
  const students = await supabase.from('students').select('*').limit(3);
  console.log('Students count sample:', students.data?.length, 'error:', students.error?.message);
  if (students.data && students.data.length > 0) {
    console.log('Student columns:', Object.keys(students.data[0]));
    console.log('Sample student:', students.data[0]);
  }

  console.log('\n--- Inspecting fee_structures Table ---');
  const feeStructs = await supabase.from('fee_structures').select('*').limit(3);
  console.log('fee_structures count sample:', feeStructs.data?.length, 'error:', feeStructs.error?.message);
  if (feeStructs.data && feeStructs.data.length > 0) {
    console.log('fee_structures columns:', Object.keys(feeStructs.data[0]));
    console.log('Sample fee_structure:', feeStructs.data[0]);
  }

  console.log('\n--- Inspecting student_fees Table ---');
  const studentFees = await supabase.from('student_fees').select('*').limit(3);
  console.log('student_fees count sample:', studentFees.data?.length, 'error:', studentFees.error?.message);
  if (studentFees.data && studentFees.data.length > 0) {
    console.log('student_fees columns:', Object.keys(studentFees.data[0]));
    console.log('Sample student_fee:', studentFees.data[0]);
  }

  console.log('\n--- Inspecting fee_payments Table ---');
  const feePayments = await supabase.from('fee_payments').select('*').limit(3);
  console.log('fee_payments count sample:', feePayments.data?.length, 'error:', feePayments.error?.message);
  if (feePayments.data && feePayments.data.length > 0) {
    console.log('fee_payments columns:', Object.keys(feePayments.data[0]));
    console.log('Sample fee_payment:', feePayments.data[0]);
  }
}

inspectFeesSchema().catch(console.error);
