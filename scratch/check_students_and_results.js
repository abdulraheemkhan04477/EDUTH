import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStudentsTable() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const { data: students, error } = await supabase.from('students').select('*');
  console.log('Students count:', students ? students.length : 0);
  if (students && students.length > 0) {
    console.log('Sample student 0:', students[0]);
    console.log('\nAll student IDs and Roll Nos:');
    students.forEach((s, idx) => {
      console.log(`[${idx}] id: ${s.id} | name: ${s.name} | roll_no: ${s.roll_no} | course: ${s.course} | branch: ${s.branch} | year: ${s.year} | sem: ${s.semester} | sec: ${s.section}`);
    });
  } else if (error) {
    console.error('Error:', error.message);
  }
}

checkStudentsTable();
