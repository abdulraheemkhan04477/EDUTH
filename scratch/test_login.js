import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('Testing Super Admin login...');
  const superRes = await supabase.auth.signInWithPassword({
    email: 'superadmin@example.com',
    password: 'superadmin123'
  });
  console.log('Super Admin login result:', {
    user: superRes.data?.user ? { id: superRes.data.user.id, email: superRes.data.user.email, meta: superRes.data.user.user_metadata } : null,
    error: superRes.error
  });

  if (superRes.data?.session) {
    const profileRes = await supabase.from('profiles').select('*').eq('id', superRes.data.user.id);
    console.log('Super Admin profile query:', profileRes);
    
    // Also try selecting all profiles as Super Admin authenticated user!
    const allProfilesRes = await supabase.from('profiles').select('*');
    console.log('All profiles as Super Admin auth user:', allProfilesRes);
  }
}

testAuth().catch(console.error);
