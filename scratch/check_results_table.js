import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectResults() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const { data: results, error } = await supabase.from('results').select('*').limit(5);
  console.log('Results sample:', JSON.stringify(results, null, 2));

  const { data: students } = await supabase.from('students').select('id, name, roll_no, student_id, course, branch, year').limit(5);
  console.log('\nStudents sample:', JSON.stringify(students, null, 2));

  const { data: exams } = await supabase.from('exams').select('id, title, course, branch').limit(5);
  console.log('\nExams sample:', JSON.stringify(exams, null, 2));
}

inspectResults();
