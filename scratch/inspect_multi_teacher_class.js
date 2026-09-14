import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectMultiTeacher() {
  // Sign in as Payal Rastogi to view classes
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const { data: classes } = await supabase.from('classes').select('*');
  const { data: teachers } = await supabase.from('teachers').select('*');

  console.log('Class 1 sample:', classes ? classes[0] : null);

  console.log('\nTeachers assigned to Class 1 (B.Tech ECE - 1st Year - Section A):');
  const class1Teachers = teachers?.filter((t) => {
    const assigned = t.assigned_classes || [];
    return (
      assigned.some((ac) => ac.includes('B.Tech ECE - 1st Year')) ||
      (t.course === 'B.Tech' && t.department === 'ECE')
    );
  });

  class1Teachers?.forEach((t) => {
    console.log(`  Teacher: ${t.name} (${t.email}), teacher_id: ${t.teacher_id}, assigned_classes:`, t.assigned_classes);
  });
}

inspectMultiTeacher().catch(console.error);
