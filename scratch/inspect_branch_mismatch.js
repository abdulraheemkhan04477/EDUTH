import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectBranches() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const collegeId = '13695a78-0105-4bde-bc85-d664bb66637e';

  // 1. Check all Fee Structures
  const { data: structures } = await supabase
    .from('fee_structures')
    .select('id, title, course, branch, year_semester, total_amount, college_id')
    .eq('college_id', collegeId);

  console.log('--- ALL FEE STRUCTURES IN SUPABASE ---');
  console.log(JSON.stringify(structures, null, 2));

  // 2. Check Students course & branch in Supabase
  const { data: students } = await supabase
    .from('students')
    .select('id, name, roll_no, course, branch, year, semester, college_id')
    .eq('college_id', collegeId);

  console.log(`\n--- TOTAL STUDENTS: ${students?.length} ---`);
  const branchCounts = {};
  students?.forEach(s => {
    const key = `Course: "${s.course}" | Branch: "${s.branch}" | Year: "${s.year}"`;
    branchCounts[key] = (branchCounts[key] || 0) + 1;
  });
  console.log('Students distribution in DB:');
  console.log(JSON.stringify(branchCounts, null, 2));
}

inspectBranches().catch(console.error);
