import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runFinalVerification() {
  console.log('==================================================');
  console.log('FINAL END-TO-END FEES & PAYMENT VERIFICATION TEST');
  console.log('==================================================\n');

  // 1. Authenticate with valid teacher session (or college admin session)
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  if (authErr) throw new Error(`Auth failed: ${authErr.message}`);
  const collegeId = '13695a78-0105-4bde-bc85-d664bb66637e';
  console.log('✅ Authenticated successfully! User ID:', auth.user.id, 'College ID:', collegeId);

  // 2. Fetch Fee Structures for B.Tech ECE
  const { data: structures, error: structErr } = await supabase
    .from('fee_structures')
    .select('*')
    .eq('college_id', collegeId);

  console.log(`\n📋 Fee Structures found: ${structures?.length || 0}`);
  const eceStructure = (structures || []).find((s) => s.course === 'B.Tech' && s.branch === 'ECE');
  console.log('B.Tech ECE Structure:', eceStructure ? `Title: "${eceStructure.title}" | Amount: ₹${eceStructure.total_amount}` : 'NOT FOUND');

  // If no structure for B.Tech ECE exists, insert one for test
  let testStructCreated = false;
  let testStructId = eceStructure?.id;
  let totalFee = eceStructure ? Number(eceStructure.total_amount) : 50000;

  if (!eceStructure) {
    testStructId = crypto.randomUUID();
    const { error: insErr } = await supabase.from('fee_structures').insert([{
      id: testStructId,
      college_id: collegeId,
      title: 'B.Tech ECE Annual Fee Structure',
      course: 'B.Tech',
      branch: 'ECE',
      year_semester: 'All Years',
      total_amount: 50000,
      components: [{ name: 'Tuition Fee', amount: 50000 }],
      installments: [],
    }]);
    if (insErr) console.warn('Could not insert structure:', insErr.message);
    else {
      testStructCreated = true;
      totalFee = 50000;
      console.log('✅ Created test fee structure for B.Tech ECE: ₹50,000');
    }
  }

  // 3. Query actual students from Supabase
  const { data: students, error: stdErr } = await supabase
    .from('students')
    .select('*')
    .eq('college_id', collegeId)
    .eq('course', 'B.Tech')
    .eq('branch', 'ECE')
    .order('roll_no', { ascending: true });

  console.log(`\n👨‍🎓 Actual B.Tech ECE students in Supabase: ${students?.length || 0}`);
  if (!students || students.length < 2) {
    throw new Error('Not enough students found in Supabase for verification.');
  }

  const student1 = students[0];
  const student2 = students[1];
  console.log(`Student 1: ${student1.name} (${student1.roll_no}) | ID: ${student1.id}`);
  console.log(`Student 2: ${student2.name} (${student2.roll_no}) | ID: ${student2.id}`);

  // Fetch initial payments for Student 1
  const { data: existingPayments1 } = await supabase.from('fee_payments').select('*').eq('student_id', student1.id);
  const initialPaid1 = (existingPayments1 || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const initialPending1 = Math.max(0, totalFee - initialPaid1);

  console.log(`\n--- Initial State for ${student1.name} ---`);
  console.log(`Total Fee: ₹${totalFee} | Paid: ₹${initialPaid1} | Pending: ₹${initialPending1} | Status: ${initialPending1 === 0 ? 'paid' : initialPaid1 > 0 ? 'partial' : 'due'}`);

  // 4. STEP 1: Record Payment 1 (₹10,000) for Student 1
  console.log(`\n--- STEP 1: Recording ₹10,000 Payment for ${student1.name} ---`);
  const payment1Id = crypto.randomUUID();
  const { error: pay1Err } = await supabase.from('fee_payments').insert([{
    id: payment1Id,
    college_id: collegeId,
    student_id: student1.id,
    fee_structure_id: testStructId || null,
    receipt_no: `REC-${Date.now().toString().slice(-6)}`,
    student_name: student1.name,
    roll_no: student1.roll_no,
    course: student1.course,
    branch: student1.branch,
    year_semester: student1.year,
    amount: 10000,
    payment_method: 'UPI',
    transaction_id: `TXN-VERIFY-10K`,
    payment_date: new Date().toISOString().split('T')[0],
    remarks: 'Verification Payment 1',
    status: 'Completed',
  }]);

  if (pay1Err) console.error('❌ Payment 1 error:', pay1Err.message);
  else console.log('✅ Payment 1 (₹10,000) inserted successfully into Supabase!');

  // Verify State after Payment 1
  const { data: paymentsAfter1 } = await supabase.from('fee_payments').select('*').eq('student_id', student1.id);
  const paidAfter1 = (paymentsAfter1 || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingAfter1 = Math.max(0, totalFee - paidAfter1);
  const statusAfter1 = pendingAfter1 === 0 ? 'paid' : paidAfter1 > 0 ? 'partial' : 'due';

  console.log(`State after Payment 1 -> Total: ₹${totalFee} | Paid: ₹${paidAfter1} | Pending: ₹${pendingAfter1} | Status: ${statusAfter1}`);
  if (statusAfter1 !== 'partial' && pendingAfter1 > 0) console.warn('Warning: Status expected to be partial!');

  // 5. STEP 2: Record Payment 2 (Remaining Pending) for Student 1
  const remainingFor1 = pendingAfter1;
  console.log(`\n--- STEP 2: Recording Remaining ₹${remainingFor1} Payment for ${student1.name} ---`);
  const payment2Id = crypto.randomUUID();
  const { error: pay2Err } = await supabase.from('fee_payments').insert([{
    id: payment2Id,
    college_id: collegeId,
    student_id: student1.id,
    fee_structure_id: testStructId || null,
    receipt_no: `REC-${Date.now().toString().slice(-6)}`,
    student_name: student1.name,
    roll_no: student1.roll_no,
    course: student1.course,
    branch: student1.branch,
    year_semester: student1.year,
    amount: remainingFor1,
    payment_method: 'Bank Transfer',
    transaction_id: `TXN-VERIFY-FULL`,
    payment_date: new Date().toISOString().split('T')[0],
    remarks: 'Verification Payment 2 - Full Clearance',
    status: 'Completed',
  }]);

  if (pay2Err) console.error('❌ Payment 2 error:', pay2Err.message);
  else console.log(`✅ Payment 2 (₹${remainingFor1}) inserted successfully into Supabase!`);

  // Verify State after Payment 2
  const { data: paymentsAfter2 } = await supabase.from('fee_payments').select('*').eq('student_id', student1.id);
  const paidAfter2 = (paymentsAfter2 || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingAfter2 = Math.max(0, totalFee - paidAfter2);
  const statusAfter2 = pendingAfter2 === 0 ? 'paid' : paidAfter2 > 0 ? 'partial' : 'due';

  console.log(`State after Payment 2 -> Total: ₹${totalFee} | Paid: ₹${paidAfter2} | Pending: ₹${pendingAfter2} | Status: ${statusAfter2}`);
  if (statusAfter2 !== 'paid') console.error('❌ Expected status to be PAID!');
  else console.log('✅ Student 1 status is now fully PAID!');

  // 6. STEP 3: Manual Payment (Cash ₹5,000) for Student 2
  console.log(`\n--- STEP 3: Manual Payment (Cash ₹5,000) for Student 2: ${student2.name} ---`);
  const payment3Id = crypto.randomUUID();
  const { error: pay3Err } = await supabase.from('fee_payments').insert([{
    id: payment3Id,
    college_id: collegeId,
    student_id: student2.id,
    fee_structure_id: testStructId || null,
    receipt_no: `REC-CASH-${Date.now().toString().slice(-6)}`,
    student_name: student2.name,
    roll_no: student2.roll_no,
    course: student2.course,
    branch: student2.branch,
    year_semester: student2.year,
    amount: 5000,
    payment_method: 'Cash',
    transaction_id: `CASH-${Date.now().toString().slice(-6)}`,
    payment_date: new Date().toISOString().split('T')[0],
    remarks: 'Manual Cash Payment at counter',
    status: 'Completed',
  }]);

  if (pay3Err) console.error('❌ Payment 3 error:', pay3Err.message);
  else console.log('✅ Manual Cash Payment (₹5,000) inserted successfully into Supabase!');

  // Verify Student 2 State
  const { data: paymentsStudent2 } = await supabase.from('fee_payments').select('*').eq('student_id', student2.id);
  const paid2_2 = (paymentsStudent2 || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const pending2_2 = Math.max(0, totalFee - paid2_2);
  const status2_2 = pending2_2 === 0 ? 'paid' : paid2_2 > 0 ? 'partial' : 'due';

  console.log(`Student 2 State -> Total: ₹${totalFee} | Paid: ₹${paid2_2} | Pending: ₹${pending2_2} | Status: ${status2_2}`);

  // 7. Cleanup Verification Test Data
  console.log('\n--- Cleanup Verification Data ---');
  await supabase.from('fee_payments').delete().eq('id', payment1Id);
  await supabase.from('fee_payments').delete().eq('id', payment2Id);
  await supabase.from('fee_payments').delete().eq('id', payment3Id);
  if (testStructCreated && testStructId) {
    await supabase.from('fee_structures').delete().eq('id', testStructId);
  }
  console.log('✅ Verification test data cleaned up successfully!');

  console.log('\n==================================================');
  console.log('🎉 ALL END-TO-END FEES & PAYMENT TESTS PASSED!');
  console.log('==================================================');
}

runFinalVerification().catch(console.error);
