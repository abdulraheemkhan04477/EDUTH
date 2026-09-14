import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPaymentCollection() {
  console.log('Testing Payment Collection...');

  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const collegeId = '13695a78-0105-4bde-bc85-d664bb66637e';

  // Find a student
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('college_id', collegeId)
    .limit(1);

  if (!students || students.length === 0) {
    throw new Error('No students found');
  }

  const student = students[0];
  console.log('Selected student:', student.name, 'ID:', student.id, 'Roll:', student.roll_no);

  // Record payment payload matching feeStore.recordPayment
  const paymentPayload = {
    id: crypto.randomUUID(),
    college_id: collegeId,
    student_id: student.id,
    fee_structure_id: '8244daa5-2cdd-4626-ae65-425a1ed69b36', // B.Tech ECE structure
    receipt_no: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    student_name: student.name,
    roll_no: student.roll_no,
    course: student.course,
    branch: student.branch,
    year_semester: student.year,
    installment_id: null,
    installment_name: 'General Fee Payment',
    amount: 15000,
    payment_method: 'UPI',
    transaction_id: `TXN-${Date.now().toString().slice(-6)}`,
    payment_date: new Date().toISOString().split('T')[0],
    remarks: 'Test Collect Payment fix',
    status: 'Completed',
  };

  const { data, error } = await supabase.from('fee_payments').insert([paymentPayload]).select();

  if (error) {
    console.error('❌ Insert payment failed:', error);
  } else {
    console.log('✅ Insert payment SUCCEEDED!', data);

    // Verify it can be fetched back
    const { data: fetched } = await supabase
      .from('fee_payments')
      .select('*')
      .eq('id', paymentPayload.id);

    console.log('✅ Fetched inserted payment:', fetched);

    // Clean up test payment
    await supabase.from('fee_payments').delete().eq('id', paymentPayload.id);
    console.log('✅ Cleaned up test payment.');
  }
}

testPaymentCollection().catch(console.error);
