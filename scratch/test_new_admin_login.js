import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNewAdmin() {
  const email = process.argv[2];
  const password = process.argv[3] || 'Password123!';
  const userId = process.argv[4];

  console.log(`Testing signInWithPassword for newly created admin: ${email}...`);
  const signInRes = await supabase.auth.signInWithPassword({ email, password });
  console.log('signInWithPassword result:', JSON.stringify({
    data: signInRes.data,
    error: signInRes.error
  }, null, 2));

  if (signInRes.error) {
    console.log('\nError details:', {
      message: signInRes.error.message,
      status: signInRes.error.status,
      name: signInRes.error.name,
      code: signInRes.error.code
    });
  } else if (signInRes.data?.session) {
    console.log('\nLogged in successfully! User ID:', signInRes.data.user.id);
    
    console.log('Querying profile for logged in user...');
    const profileRes = await supabase.from('profiles').select('*').eq('id', signInRes.data.user.id);
    console.log('Profile query result:', JSON.stringify(profileRes, null, 2));
  }
}

testNewAdmin().catch(console.error);
