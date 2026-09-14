import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFix() {
  const adminEmail = 'admin_1788255320989@college.edu';
  const adminPass = 'AdminPassword123!';

  console.log(`1. Attempting signInWithPassword for ${adminEmail}...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPass
  });

  console.log('signInWithPassword error:', error?.message);

  if (error && (error.message.includes('schema') || error.status === 500)) {
    console.log('\n2. Triggering fallback lookup for RPC-created admin user...');
    // Query profile by email
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .maybeSingle();

    console.log('Profile fallback result:', JSON.stringify(profile, null, 2), 'pErr:', pErr?.message);

    if (profile) {
      console.log(`\nSUCCESSFULLY RESOLVED ADMIN PROFILE! Role: ${profile.role}, College ID: ${profile.college_id}`);
    }
  }
}

testFix().catch(console.error);
