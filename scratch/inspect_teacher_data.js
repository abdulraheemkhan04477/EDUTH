import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTeacherData() {
  const { data: auth, error: loginErr } = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  if (loginErr) {
    console.error('Login failed:', loginErr);
    return;
  }

  console.log('Logged in user ID:', auth.user.id);
  console.log('User metadata:', auth.user.user_metadata);

  const { data: teacher, error: teachErr } = await supabase.from('teachers').select('*').eq('id', auth.user.id).single();
  console.log('Teacher record:', teacher, teachErr);

  const { data: allTeachers, error: allTeachErr } = await supabase.from('teachers').select('*');
  console.log('All teachers visible count:', allTeachers?.length, allTeachErr);

  const { data: classes, error: classErr } = await supabase.from('classes').select('*');
  console.log('Classes visible count:', classes?.length, classErr);
  if (classes && classes.length > 0) {
    console.log('Sample class:', classes[0]);
  }

  const { data: students, error: studErr } = await supabase.from('students').select('*');
  console.log('Students visible count:', students?.length, studErr);
  if (students && students.length > 0) {
    console.log('Sample student:', students[0]);
  }
}

inspectTeacherData().catch(console.error);
