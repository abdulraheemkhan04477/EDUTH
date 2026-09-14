import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function countStudents() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const { data: students, error } = await supabase
    .from('students')
    .select('id, name, roll_no, course, branch, year, semester, college_id')
    .order('roll_no', { ascending: true });

  console.log('Total students found in Supabase:', students?.length, 'Error:', error?.message);
  if (students && students.length > 0) {
    console.log('Courses & Branches distribution:');
    const dist = {};
    students.forEach((s) => {
      const key = `${s.course} | ${s.branch} | ${s.year} | ${s.semester}`;
      dist[key] = (dist[key] || 0) + 1;
    });
    console.log(JSON.stringify(dist, null, 2));
    console.log('First 5 students:', students.slice(0, 5));
  }
}

countStudents().catch(console.error);
