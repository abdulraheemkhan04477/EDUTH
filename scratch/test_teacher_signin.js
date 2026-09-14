import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignIn() {
  const teacherEmail = 'teacher_1788255450664@college.edu';
  const teacherPass = 'TeacherPass123!';

  console.log(`Attempting signInWithPassword for ${teacherEmail}...`);
  const signInRes = await supabase.auth.signInWithPassword({
    email: teacherEmail,
    password: teacherPass
  });
  console.log('signInWithPassword result:', JSON.stringify(signInRes, null, 2));
}

testSignIn().catch(console.error);
