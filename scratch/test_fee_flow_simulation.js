import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFeeFlow() {
  console.log('Logging in...');
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });
  if (authErr) {
    console.error('Auth error:', authErr.message);
    return;
  }
  const collegeId = '13695a78-0105-4bde-bc85-d664bb66637e';
  console.log('User logged in. College ID:', collegeId);

  // 1. Fetch Students
  const { data: students, error: stdErr } = await supabase
    .from('students')
    .select('*')
    .eq('college_id', collegeId)
    .order('roll_no', { ascending: true });

  console.log(`Fetched ${students?.length || 0} students from Supabase (Err: ${stdErr?.message})`);

  // 2. Fetch Fee Structures
  const { data: structures, error: structErr } = await supabase
    .from('fee_structures')
    .select('*')
    .eq('college_id', collegeId);

  console.log(`Fetched ${structures?.length || 0} fee_structures from Supabase (Err: ${structErr?.message})`);

  // 3. Fetch Payments
  const { data: payments, error: payErr } = await supabase
    .from('fee_payments')
    .select('*')
    .eq('college_id', collegeId);

  console.log(`Fetched ${payments?.length || 0} fee_payments from Supabase (Err: ${payErr?.message})`);

  // 4. Match Students to Fee Structures and Payments
  if (students && students.length > 0) {
    console.log('\n--- Student Fee Calculation Test ---');
    const studentFeeRecords = students.map((std) => {
      // Find matching fee structure by course, branch, year/semester
      const matchStruct = (structures || []).find(
        (st) =>
          st.course.toLowerCase() === std.course.toLowerCase() &&
          (st.branch.toLowerCase() === std.branch.toLowerCase() || st.branch === 'All') &&
          (st.year_semester.toLowerCase() === std.year.toLowerCase() || st.year_semester === 'All Years' || st.year_semester === std.semester)
      );

      const studentPayments = (payments || []).filter((p) => p.student_id === std.id && p.status === 'Completed');
      const paidSum = studentPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const totalFee = matchStruct ? Number(matchStruct.total_amount) || 0 : 0;
      const pending = Math.max(0, totalFee - paidSum);

      let status = 'due';
      if (totalFee > 0 && paidSum >= totalFee) {
        status = 'paid';
      } else if (paidSum > 0) {
        status = 'partial';
      } else {
        status = 'due';
      }

      return {
        student_id: std.id,
        student_name: std.name,
        roll_no: std.roll_no,
        course: std.course,
        branch: std.branch,
        year: std.year,
        semester: std.semester,
        fee_structure_id: matchStruct?.id || null,
        fee_structure_title: matchStruct?.title || 'No Fee Structure',
        total_fee: totalFee,
        paid: paidSum,
        pending: pending,
        status: status,
      };
    });

    console.log('Sample derived student fees (first 3):');
    console.log(JSON.stringify(studentFeeRecords.slice(0, 3), null, 2));
  }
}

testFeeFlow().catch(console.error);
