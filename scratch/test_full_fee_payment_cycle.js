import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCycle() {
  console.log('--- Step 1: Login ---');
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'zuneydkhan04477@gmail.com',
    password: 'admin123'
  });
  if (authErr) throw authErr;
  const collegeId = '13695a78-0105-4bde-bc85-d664bb66637e';
  console.log('Logged in successfully!');

  // --- Step 2: Create Fee Structure ---
  console.log('\n--- Step 2: Insert Test Fee Structure into Supabase ---');
  const testStructId = crypto.randomUUID();
  const { data: structData, error: structErr } = await supabase.from('fee_structures').insert([{
    id: testStructId,
    college_id: collegeId,
    title: 'B.Tech ECE 1st Year Test Fee Structure',
    course: 'B.Tech',
    branch: 'ECE',
    year_semester: '1st Year',
    total_amount: 50000,
    components: [{ name: 'Tuition Fee', amount: 50000 }],
    installments: [{ name: 'Installment 1', type: 'percentage', value: 100, due_date: '2026-12-31', description: 'Full', calculated_amount: 50000 }],
  }]).select();

  if (structErr) console.error('Fee structure insert error:', structErr.message);
  else console.log('Fee structure inserted successfully! ID:', testStructId);

  // --- Step 3: Fetch Students & Match ---
  console.log('\n--- Step 3: Fetch B.Tech ECE 1st Year Students ---');
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('college_id', collegeId)
    .eq('course', 'B.Tech')
    .eq('branch', 'ECE')
    .eq('year', '1st Year')
    .order('roll_no', { ascending: true });

  console.log(`Found ${students?.length || 0} matching students.`);
  if (!students || students.length === 0) return;

  const targetStudent = students[0];
  console.log('Target student for test:', targetStudent.name, 'Roll:', targetStudent.roll_no, 'ID:', targetStudent.id);

  // --- Step 4: Record 1st Payment ₹10,000 ---
  console.log('\n--- Step 4: Record ₹10,000 Payment into Supabase fee_payments ---');
  const pay1Id = crypto.randomUUID();
  const { error: pay1Err } = await supabase.from('fee_payments').insert([{
    id: pay1Id,
    college_id: collegeId,
    student_id: targetStudent.id,
    fee_structure_id: testStructId,
    receipt_no: `REC-${Date.now().toString().slice(-6)}`,
    student_name: targetStudent.name,
    roll_no: targetStudent.roll_no,
    course: targetStudent.course,
    branch: targetStudent.branch,
    year_semester: targetStudent.year,
    amount: 10000,
    payment_method: 'Cash',
    transaction_id: `TXN-${Date.now().toString().slice(-6)}`,
    payment_date: new Date().toISOString().split('T')[0],
    remarks: 'Test Partial Payment',
    status: 'Completed',
  }]);

  if (pay1Err) console.error('Pay 1 error:', pay1Err.message);
  else console.log('Payment 1 inserted successfully!');

  // --- Step 5: Calculate & Verify Partial ---
  const { data: paymentsAfter1 } = await supabase.from('fee_payments').select('*').eq('student_id', targetStudent.id);
  const paid1 = (paymentsAfter1 || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const pending1 = 50000 - paid1;
  const status1 = pending1 === 0 ? 'paid' : paid1 > 0 ? 'partial' : 'due';
  console.log(`State after Payment 1 -> Total: ₹50,000 | Paid: ₹${paid1} | Pending: ₹${pending1} | Status: ${status1}`);

  // --- Step 6: Record 2nd Payment ₹40,000 ---
  console.log('\n--- Step 6: Record ₹40,000 Payment into Supabase fee_payments ---');
  const pay2Id = crypto.randomUUID();
  const { error: pay2Err } = await supabase.from('fee_payments').insert([{
    id: pay2Id,
    college_id: collegeId,
    student_id: targetStudent.id,
    fee_structure_id: testStructId,
    receipt_no: `REC-${Date.now().toString().slice(-6)}`,
    student_name: targetStudent.name,
    roll_no: targetStudent.roll_no,
    course: targetStudent.course,
    branch: targetStudent.branch,
    year_semester: targetStudent.year,
    amount: 40000,
    payment_method: 'UPI',
    transaction_id: `TXN-${Date.now().toString().slice(-6)}`,
    payment_date: new Date().toISOString().split('T')[0],
    remarks: 'Test Full Payment Clear',
    status: 'Completed',
  }]);

  if (pay2Err) console.error('Pay 2 error:', pay2Err.message);
  else console.log('Payment 2 inserted successfully!');

  // --- Step 7: Calculate & Verify Paid ---
  const { data: paymentsAfter2 } = await supabase.from('fee_payments').select('*').eq('student_id', targetStudent.id);
  const paid2 = (paymentsAfter2 || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const pending2 = 50000 - paid2;
  const status2 = pending2 === 0 ? 'paid' : paid2 > 0 ? 'partial' : 'due';
  console.log(`State after Payment 2 -> Total: ₹50,000 | Paid: ₹${paid2} | Pending: ₹${pending2} | Status: ${status2}`);

  // --- Step 8: Clean up test data ---
  console.log('\n--- Step 8: Cleaning up test data ---');
  await supabase.from('fee_payments').delete().eq('id', pay1Id);
  await supabase.from('fee_payments').delete().eq('id', pay2Id);
  await supabase.from('fee_structures').delete().eq('id', testStructId);
  console.log('Cleanup completed successfully!');
}

testCycle().catch(console.error);
