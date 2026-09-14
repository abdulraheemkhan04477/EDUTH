import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

async function testFrontendSimulation() {
  const teacherSupabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: auth } = await teacherSupabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const normCollegeId = '13695a78-0105-4bde-bc85-d664bb66637e';

  // Sync logic from academicStore.ts
  const [
    { data: dbClasses },
    { data: dbTeachers },
    { data: dbStudents },
  ] = await Promise.all([
    teacherSupabase.from('classes').select('*').eq('college_id', normCollegeId),
    teacherSupabase.from('teachers').select('*').eq('college_id', normCollegeId),
    teacherSupabase.from('students').select('*').eq('college_id', normCollegeId),
  ]);

  console.log(`dbClasses count: ${dbClasses?.length}, dbTeachers count: ${dbTeachers?.length}, dbStudents count: ${dbStudents?.length}`);

  // Simulating getTeacherForUser
  const user = {
    id: auth.user.id,
    email: auth.user.email,
    role: 'teacher',
    college_id: normCollegeId,
    name: 'Payal Rastogi'
  };

  const list = dbTeachers || [];
  const userEmailLower = user.email.toLowerCase().trim();
  const currentTeacher = list.find(
    (t) =>
      (userEmailLower && t.email?.toLowerCase().trim() === userEmailLower) ||
      (user.teacher_id && t.teacher_id === user.teacher_id) ||
      (user.id && t.id === user.id)
  );

  console.log('\nResolved currentTeacher:', currentTeacher?.name, 'assigned_classes:', currentTeacher?.assigned_classes);

  // Simulating TeacherDashboard assignedClasses
  const directClasses = (dbClasses || []).filter(
    (c) =>
      c.teacher_id === currentTeacher?.teacher_id ||
      (userEmailLower && c.teacher_id?.toLowerCase().trim() === userEmailLower) ||
      (currentTeacher?.name && c.teacher_name?.includes(currentTeacher.name)) ||
      (currentTeacher?.assigned_classes || []).some(
        (ac) =>
          ac.includes(c.name) ||
          c.name.includes(ac) ||
          (ac.toLowerCase().includes(c.course.toLowerCase()) &&
            ac.toLowerCase().includes(c.branch.toLowerCase()) &&
            ac.toLowerCase().includes(c.year.toLowerCase()))
      )
  );

  console.log('\nResolved directClasses count:', directClasses.length);
  if (directClasses.length > 0) {
    console.log('directClass 0:', directClasses[0].name, 'course:', directClasses[0].course, 'branch:', directClasses[0].branch, 'year:', directClasses[0].year, 'section:', directClasses[0].section);
  }

  // Simulating TeacherDashboard assignedStudents
  const assignedStudents = (dbStudents || []).filter((s) =>
    directClasses.some(
      (c) =>
        s.course === c.course &&
        s.branch === c.branch &&
        s.year === c.year &&
        (!c.section || c.section === 'All Sections' || s.section === c.section || c.name.includes(s.section))
    )
  );

  console.log('\nResolved assignedStudents count:', assignedStudents.length);
  if (assignedStudents.length > 0) {
    console.log('assignedStudent 0:', assignedStudents[0].name, assignedStudents[0].roll_no, assignedStudents[0].course, assignedStudents[0].branch, assignedStudents[0].year, assignedStudents[0].section);
  } else if (dbStudents && dbStudents.length > 0) {
    console.log('\nWhy 0 assignedStudents? Checking comparison:');
    console.log('DB Student 0 course:', dbStudents[0].course, 'branch:', dbStudents[0].branch, 'year:', dbStudents[0].year, 'section:', dbStudents[0].section);
    console.log('DirectClass 0 course:', directClasses[0]?.course, 'branch:', directClasses[0]?.branch, 'year:', directClasses[0]?.year, 'section:', directClasses[0]?.section);
  }
}

testFrontendSimulation().catch(console.error);
