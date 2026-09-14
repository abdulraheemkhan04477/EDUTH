import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function matchFeeStructure(structures, student) {
  const sCourse = (student.course || '').trim().toLowerCase();
  const sBranch = (student.branch || '').trim().toLowerCase();
  const sYear = (student.year || '').trim().toLowerCase();
  const sSem = (student.semester || '').trim().toLowerCase();

  // Find structure matching course
  return structures.find((st) => {
    const stCourse = (st.course || '').trim().toLowerCase();
    const stBranch = (st.branch || '').trim().toLowerCase();
    const stTitle = (st.title || '').trim().toLowerCase();
    const stYearSem = (st.year_semester || '').trim().toLowerCase();

    // 1. Course must match
    if (stCourse !== sCourse) return false;

    // 2. Branch matching:
    // exact branch match, or "All", or title explicitly mentions branch keyword (e.g. "ece", "finance")
    const isBranchMatch =
      stBranch === sBranch ||
      stBranch === 'all' ||
      (sBranch && stTitle.includes(sBranch));

    if (!isBranchMatch) return false;

    // 3. Year/Semester matching:
    const isYearMatch =
      !stYearSem ||
      stYearSem === 'all years' ||
      stYearSem === 'all' ||
      stYearSem === sYear ||
      stYearSem === sSem;

    return isYearMatch;
  });
}

async function testMatching() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const collegeId = '13695a78-0105-4bde-bc85-d664bb66637e';

  const { data: structures } = await supabase.from('fee_structures').select('*').eq('college_id', collegeId);
  const { data: students } = await supabase.from('students').select('*').eq('college_id', collegeId);
  const { data: payments } = await supabase.from('fee_payments').select('*').eq('college_id', collegeId);

  console.log(`Fetched ${structures?.length} structures and ${students?.length} students.`);

  const studentFees = students.map((std) => {
    const match = matchFeeStructure(structures || [], std);
    const stdPayments = (payments || []).filter(p => p.student_id === std.id && p.status === 'Completed');
    const paid = stdPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const total = match ? Number(match.total_amount) : 0;
    const pending = Math.max(0, total - paid);
    const status = total > 0 && paid >= total ? 'paid' : paid > 0 ? 'partial' : 'due';

    return {
      student_id: std.id,
      name: std.name,
      roll_no: std.roll_no,
      course: std.course,
      branch: std.branch,
      year: std.year,
      matched_structure: match ? match.title : 'NONE',
      total_fee: total,
      paid: paid,
      pending: pending,
      status: status,
    };
  });

  console.log('\n--- SAMPLE MATCHED STUDENTS ---');
  console.log(JSON.stringify(studentFees.slice(0, 10), null, 2));

  console.log('\n--- SUMMARY STATS ---');
  const matchedCount = studentFees.filter(s => s.total_fee > 0).length;
  const pendingCount = studentFees.filter(s => s.status === 'due').length;
  console.log(`Matched with Fee: ${matchedCount} / ${studentFees.length}`);
  console.log(`Status Due / Pending Fee: ${pendingCount} / ${studentFees.length}`);
}

testMatching().catch(console.error);
