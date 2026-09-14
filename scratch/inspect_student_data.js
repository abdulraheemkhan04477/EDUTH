import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const COLLEGE_ID = '13695a78-0105-4bde-bc85-d664bb66637e';

async function main() {
  // First discover columns
  console.log('=== DISCOVERING STUDENT TABLE COLUMNS ===');
  const { data: sample, error: sampleErr } = await supabase
    .from('students')
    .select('*')
    .eq('college_id', COLLEGE_ID)
    .limit(1);

  if (sampleErr) {
    console.error('Error:', sampleErr.message);
    return;
  }

  if (sample && sample.length > 0) {
    console.log('Columns:', Object.keys(sample[0]));
    console.log('\nSample student:', JSON.stringify(sample[0], null, 2));
  }

  // Now fetch all students with just the columns we know exist
  const { data: allStudents, error: sErr } = await supabase
    .from('students')
    .select('*')
    .eq('college_id', COLLEGE_ID);

  if (sErr) {
    console.error('Error fetching students:', sErr.message);
    return;
  }

  console.log(`\n=== TOTAL STUDENTS: ${allStudents.length} ===\n`);

  // Distribution by course
  const byCourse = {};
  for (const s of allStudents) {
    byCourse[s.course] = (byCourse[s.course] || 0) + 1;
  }
  console.log('BY COURSE:', JSON.stringify(byCourse, null, 2));

  // Distribution by course + branch
  const byBranch = {};
  for (const s of allStudents) {
    const key = `${s.course} > ${s.branch}`;
    byBranch[key] = (byBranch[key] || 0) + 1;
  }
  console.log('\nBY COURSE > BRANCH:', JSON.stringify(byBranch, null, 2));

  // Distribution by course + branch + year
  const byYear = {};
  for (const s of allStudents) {
    const key = `${s.course} > ${s.branch} > ${s.year}`;
    byYear[key] = (byYear[key] || 0) + 1;
  }
  console.log('\nBY COURSE > BRANCH > YEAR:', JSON.stringify(byYear, null, 2));

  // Sample roll numbers
  console.log('\n=== SAMPLE ROLL NUMBERS ===');
  const sampleByBranch = {};
  for (const s of allStudents) {
    const key = `${s.course} > ${s.branch}`;
    if (!sampleByBranch[key]) sampleByBranch[key] = [];
    if (sampleByBranch[key].length < 3) sampleByBranch[key].push(s.roll_no);
  }
  console.log(JSON.stringify(sampleByBranch, null, 2));

  // Check profiles for students
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, role, college_id, email')
    .eq('college_id', COLLEGE_ID)
    .eq('role', 'student');

  if (pErr) {
    console.log('\nProfiles student query error:', pErr.message);
  } else {
    console.log(`\n=== STUDENT PROFILES: ${profiles.length} ===`);
  }

  // Check parent profiles
  const { data: parentProfiles, error: ppErr } = await supabase
    .from('profiles')
    .select('id, role, college_id, email')
    .eq('college_id', COLLEGE_ID)
    .eq('role', 'parent');

  if (ppErr) {
    console.log('\nParent profiles query error:', ppErr.message);
  } else {
    console.log(`\n=== PARENT PROFILES: ${parentProfiles.length} ===`);
  }

  // Check parents table
  const { data: parents, error: parErr } = await supabase
    .from('parents')
    .select('*')
    .eq('college_id', COLLEGE_ID)
    .limit(3);

  if (parErr) {
    console.log('\nParents table error:', parErr.message);
  } else {
    console.log(`\n=== PARENTS TABLE SAMPLE ===`);
    if (parents && parents.length > 0) {
      console.log('Parents columns:', Object.keys(parents[0]));
      console.log('Sample:', JSON.stringify(parents[0], null, 2));
    } else {
      console.log('No parents found');
    }
  }

  // Check all profiles (to see admin, teacher counts too)
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('college_id', COLLEGE_ID);

  if (allProfiles) {
    const roleCount = {};
    for (const p of allProfiles) {
      roleCount[p.role] = (roleCount[p.role] || 0) + 1;
    }
    console.log(`\n=== ALL PROFILES BY ROLE: ${allProfiles.length} total ===`);
    console.log(JSON.stringify(roleCount, null, 2));
  }

  // Check if student has profile_id column
  if (sample && sample.length > 0) {
    const hasProfileId = 'profile_id' in sample[0];
    console.log(`\nStudent has profile_id column: ${hasProfileId}`);
    if (hasProfileId) console.log('profile_id value:', sample[0].profile_id);
  }
}

main().catch(console.error);
