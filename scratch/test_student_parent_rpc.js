import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthLogin() {
  const studentEmail = 'studentbt24ece001@gmail.com';
  const studentPass = 'bt24ece001';

  const parentEmail = 'father01bt24ece001@gmail.com';
  const parentPass = '01bt24ece001';

  console.log('\n--- Student Sign In ---');
  const stuLogin = await supabase.auth.signInWithPassword({
    email: studentEmail,
    password: studentPass
  });
  console.log('Student Sign In Error:', stuLogin.error);
  console.log('Student User ID:', stuLogin.data?.user?.id);
  console.log('Student User Metadata:', stuLogin.data?.user?.user_metadata);

  if (stuLogin.data?.session) {
    const authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${stuLogin.data.session.access_token}` } }
    });
    const profileRes = await authenticatedClient.from('profiles').select('*');
    console.log('Student Profile query count:', profileRes.data?.length, profileRes.data);
    const stuRes = await authenticatedClient.from('students').select('*');
    console.log('Student Students query count:', stuRes.data?.length, stuRes.data);
  }

  console.log('\n--- Parent Sign In ---');
  const parLogin = await supabase.auth.signInWithPassword({
    email: parentEmail,
    password: parentPass
  });
  console.log('Parent Sign In Error:', parLogin.error);
  console.log('Parent User ID:', parLogin.data?.user?.id);
  console.log('Parent User Metadata:', parLogin.data?.user?.user_metadata);

  if (parLogin.data?.session) {
    const authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${parLogin.data.session.access_token}` } }
    });
    const profileRes = await authenticatedClient.from('profiles').select('*');
    console.log('Parent Profile query count:', profileRes.data?.length, profileRes.data);
  }
}

testAuthLogin().catch(console.error);
