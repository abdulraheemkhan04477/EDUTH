import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStudentsRLS() {
  console.log('Testing login as teacher07bt24ece00101@gmail.com...');
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });
  
  if (authErr) {
    console.log('Teacher auth failed:', authErr.message);
  } else {
    console.log('Teacher logged in! ID:', authData.user.id);
    const { data: stds, error: sErr } = await supabase.from('students').select('*').limit(10);
    console.log('Teacher queried students count:', stds?.length, 'Err:', sErr?.message);
    if (stds && stds.length > 0) {
      console.log('Sample student:', stds[0]);
    }
  }

  // Let's check profiles table to see what users exist
  console.log('\nQuerying profiles...');
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, email, role, college_id').limit(10);
  console.log('Profiles count:', profiles?.length, 'Err:', pErr?.message);
  if (profiles) {
    console.log('Sample profiles:', profiles);
  }
}

checkStudentsRLS().catch(console.error);
