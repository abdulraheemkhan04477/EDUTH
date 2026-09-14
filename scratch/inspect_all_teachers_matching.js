import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAllTeachers() {
  // Sign in as admin to see all teachers & classes & students
  const { data: adminAuth } = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const { data: teachers } = await supabase.from('teachers').select('*');
  const { data: classes } = await supabase.from('classes').select('*');

  console.log(`Total teachers: ${teachers?.length}, Total classes: ${classes?.length}`);

  let zeroMatchTeachers = 0;

  for (const t of teachers || []) {
    const userEmailLower = t.email?.toLowerCase().trim();
    const directClasses = classes?.filter(
      (c) =>
        c.teacher_id === t.teacher_id ||
        (userEmailLower && c.teacher_id?.toLowerCase().trim() === userEmailLower) ||
        (t.name && c.teacher_name?.includes(t.name)) ||
        (t.assigned_classes || []).some(
          (ac) =>
            ac.includes(c.name) ||
            c.name.includes(ac) ||
            (ac.toLowerCase().includes(c.course.toLowerCase()) &&
              ac.toLowerCase().includes(c.branch.toLowerCase()) &&
              ac.toLowerCase().includes(c.year.toLowerCase()))
        )
    );

    if (!directClasses || directClasses.length === 0) {
      console.log(`Teacher ${t.name} (${t.email}) has ZERO matched classes! assigned_classes:`, t.assigned_classes, 'dept:', t.department, 'course:', t.course);
      zeroMatchTeachers++;
    }
  }

  console.log(`Zero match teachers count: ${zeroMatchTeachers}`);
}

checkAllTeachers().catch(console.error);
