import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  console.log('--- 1. Fetching unauthenticated (anon) ---');
  const { data: anonData, error: anonError } = await supabase.from('teachers').select('*');
  console.log('Anon teachers count:', anonData ? anonData.length : 0, 'Error:', anonError);

  console.log('--- 2. Signing in as Admin zuneydkhan04477@gmail.com ---');
  // Note: let's test signing in if password is known, or check session
  // Let's test with password 'password123' or '12345678'
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'zuneydkhan04477@gmail.com',
    password: 'password123' // let's see if this works
  });

  if (authError) {
    console.log('Sign in error:', authError.message);
  } else {
    console.log('Signed in successfully! User id:', authData.user.id);
    const { data: adminTeachers, error: teacherError } = await supabase.from('teachers').select('*');
    console.log('Authenticated Admin teachers count:', adminTeachers ? adminTeachers.length : 0, 'Error:', teacherError);
    if (adminTeachers && adminTeachers.length > 0) {
      console.log('Sample teacher:', adminTeachers[0].name, adminTeachers[0].college_id);
    }
  }
}

testFetch().catch(console.error);
