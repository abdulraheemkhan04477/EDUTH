import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

async function debugTeacher() {
  const teacherSupabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: auth, error: loginErr } = await teacherSupabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  if (loginErr) {
    console.error('Login error:', loginErr);
    return;
  }

  console.log('Logged in user ID:', auth.user.id);

  // 1. Fetch teacher record
  const { data: teacher, error: teachErr } = await teacherSupabase
    .from('teachers')
    .select('*')
    .eq('id', auth.user.id)
    .single();

  console.log('Teacher record:', teacher, teachErr);

  // 2. Fetch classes
  const { data: classes, error: classErr } = await teacherSupabase.from('classes').select('*');
  console.log('Classes count:', classes?.length, classErr);

  // Direct classes matching logic
  const userEmailLower = teacher?.email?.toLowerCase().trim();
  const directClasses = classes?.filter(
    (c) =>
      c.teacher_id === teacher?.teacher_id ||
      (userEmailLower && c.teacher_id?.toLowerCase().trim() === userEmailLower) ||
      (teacher?.name && c.teacher_name?.includes(teacher.name)) ||
      (teacher?.assigned_classes || []).some(
        (ac) =>
          ac.includes(c.name) ||
          c.name.includes(ac) ||
          (ac.toLowerCase().includes(c.course.toLowerCase()) &&
            ac.toLowerCase().includes(c.branch.toLowerCase()) &&
            ac.toLowerCase().includes(c.year.toLowerCase()))
      )
  );

  console.log('Direct classes matched count:', directClasses?.length);
  if (directClasses && directClasses.length > 0) {
    console.log('Direct class 0:', directClasses[0]);
  }

  // 3. Fetch students
  const { data: dbStudents, error: studErr } = await teacherSupabase.from('students').select('*');
  console.log('DB students fetched count:', dbStudents?.length, studErr);

  if (dbStudents && dbStudents.length > 0) {
    console.log('Sample db student:', dbStudents[0]);
  }

  // Filter students against directClasses
  const permittedStudents = (dbStudents || []).filter((s) =>
    (directClasses || []).some(
      (c) =>
        s.course === c.course &&
        s.branch === c.branch &&
        s.year === c.year &&
        (!c.section || c.section === 'All Sections' || s.section === c.section || c.name.includes(s.section))
    )
  );

  console.log('Permitted students count:', permittedStudents.length);
  if (permittedStudents.length > 0) {
    console.log('Sample permitted student:', permittedStudents[0].name, permittedStudents[0].course, permittedStudents[0].branch, permittedStudents[0].year, permittedStudents[0].section);
  } else if (dbStudents && dbStudents.length > 0 && directClasses && directClasses.length > 0) {
    console.log('COMPARE:');
    console.log('Class:', directClasses[0].course, directClasses[0].branch, directClasses[0].year, directClasses[0].section);
    console.log('Student 0:', dbStudents[0].course, dbStudents[0].branch, dbStudents[0].year, dbStudents[0].section);
  }
}

debugTeacher().catch(console.error);
