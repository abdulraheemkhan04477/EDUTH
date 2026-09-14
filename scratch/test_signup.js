import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignUp() {
  const testEmail = `testuser_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';

  console.log(`1. Attempting supabase.auth.signUp for ${testEmail}...`);
  const signUpRes = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: 'Test SignUp User',
        role: 'admin'
      }
    }
  });

  console.log('signUp result:', JSON.stringify(signUpRes, null, 2));

  if (signUpRes.data?.user) {
    console.log(`\n2. Attempting signInWithPassword for ${testEmail}...`);
    const signInRes = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    console.log('signInWithPassword result:', JSON.stringify(signInRes, null, 2));

    if (signInRes.data?.session) {
      console.log('\n3. Testing profile query for signed in user...');
      const profileRes = await supabase.from('profiles').select('*').eq('id', signInRes.data.user.id);
      console.log('Profile query:', JSON.stringify(profileRes, null, 2));
    }
  }
}

testSignUp().catch(console.error);
