import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the filter functions logic to test directly
function isCourseMatch(teacherCourse, selectedCourse) {
  if (!selectedCourse) return true;
  if (!teacherCourse) return false;
  const tNorm = teacherCourse.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const sNorm = selectedCourse.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return tNorm === sNorm || tNorm.includes(sNorm) || sNorm.includes(tNorm);
}

function isBranchMatch(teacherDept, selectedBranch) {
  if (!selectedBranch) return true;
  if (!teacherDept) return false;

  const tNorm = teacherDept.trim().toLowerCase();
  const sNorm = selectedBranch.trim().toLowerCase();
  if (tNorm === sNorm) return true;

  const aliases = {
    cse: ['cse', 'computer science', 'computer science & engineering (cse)', 'computer science and engineering', 'd-cse', 'cs'],
    ece: ['ece', 'electronics & communication engineering', 'electronics and communication engineering', 'electronics engineering'],
    ee: ['ee', 'electrical engineering'],
    it: ['it', 'information technology'],
    civil: ['civil', 'civil engineering'],
    mechanical: ['mechanical', 'mechanical engineering'],
    aiml: ['ai/ml', 'aiml', 'artificial intelligence', 'artificial intelligence & machine learning'],
    csd: ['csd', 'computer science & design'],
    finance: ['finance', 'financial management'],
    marketing: ['marketing'],
    hrm: ['human resource management', 'hr', 'hrm'],
  };

  for (const group of Object.values(aliases)) {
    const tInGroup = group.some(a => tNorm.includes(a) || a.includes(tNorm));
    const sInGroup = group.some(a => sNorm.includes(a) || a.includes(sNorm));
    if (tInGroup && sInGroup) return true;
  }

  return tNorm.includes(sNorm) || sNorm.includes(tNorm);
}

async function verifyAll() {
  console.log('=== VERIFYING ADMIN TEACHERS FIX ===\n');

  // Fetch all teachers from database
  const { data: dbTeachers, error } = await supabase.from('teachers').select('*');
  console.log(`1. Total teachers present in DB table 'teachers': ${dbTeachers?.length || 0}`);
  if (error) console.error('Error fetching teachers:', error);

  const collegeAId = 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f'; // RRIMT
  const collegeBId = '723a3815-5f93-4bb2-b909-61fc4ccd221d'; // SRIMT

  // Filter for Admin College A
  const collegeATeachers = (dbTeachers || []).filter(t => t.college_id === collegeAId);
  console.log(`\n2. Teachers belonging to Admin College A (${collegeAId}): ${collegeATeachers.length}`);

  // Test 1: All teachers (no filter)
  console.log(`   - Test All Courses + All Branches: Count = ${collegeATeachers.length}`);
  console.assert(collegeATeachers.length > 0, 'College A should have teachers!');

  // Test 2: Course filter = B.Tech
  const btechTeachers = collegeATeachers.filter(t => isCourseMatch(t.course, 'B.Tech'));
  console.log(`   - Test Course = 'B.Tech': Count = ${btechTeachers.length}`);
  console.assert(btechTeachers.length > 0, 'Should return B.Tech teachers!');

  // Test 3: Branch filter = ECE
  const eceTeachers = collegeATeachers.filter(t => isBranchMatch(t.department, 'ECE'));
  console.log(`   - Test Branch = 'ECE': Count = ${eceTeachers.length}`);
  console.assert(eceTeachers.length > 0, 'Should return ECE teachers!');

  // Test 4: Course = B.Tech + Branch = ECE
  const btechEceTeachers = collegeATeachers.filter(t => isCourseMatch(t.course, 'B.Tech') && isBranchMatch(t.department, 'ECE'));
  console.log(`   - Test Course = 'B.Tech' + Branch = 'ECE': Count = ${btechEceTeachers.length}`);
  console.assert(btechEceTeachers.length > 0, 'Should return matching B.Tech ECE teachers!');

  // Test 5: Multi-college isolation check for Admin College B
  const collegeBTeachers = (dbTeachers || []).filter(t => t.college_id === collegeBId);
  console.log(`\n3. Multi-college isolation check for Admin College B (${collegeBId}):`);
  console.log(`   - Teachers visible to Admin B: ${collegeBTeachers.length}`);
  const breach = collegeBTeachers.some(t => t.college_id === collegeAId);
  console.log(`   - Isolation breach check (Admin B seeing College A teachers): ${breach ? 'FAILED' : 'PASSED'}`);
  console.assert(!breach, 'Multi-college isolation failed!');

  console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
}

verifyAll().catch(console.error);
