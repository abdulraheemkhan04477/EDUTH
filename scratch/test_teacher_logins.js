import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sampleTestAccounts = [
  { email: 'teacher07bt24ece00101@gmail.com', pass: '07bt24ece00101', name: 'Payal Rastogi' },
  { email: 'teacher07bt24ece00102@gmail.com', pass: '07bt24ece00102', name: 'Ritu Kannaujiya' },
  { email: 'teacher07bt23ece00101@gmail.com', pass: '07bt23ece00101', name: 'Ruchi Jaiswal' },
  { email: 'teacher07dp24civ00101@gmail.com', pass: '07dp24civ00101', name: 'Sara Kannojia' },
  { email: 'teacher07mb24fin00101@gmail.com', pass: '07mb24fin00101', name: 'Ruchi Prasad' },
];

async function testLogins() {
  console.log('Testing Sample Teacher Logins...\n');
  let passCount = 0;

  for (const acc of sampleTestAccounts) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: acc.email,
      password: acc.pass
    });

    if (error) {
      console.error(`FAILED login for ${acc.name} (${acc.email}):`, error.message);
    } else {
      console.log(`SUCCESS: Logged in ${acc.name} (${acc.email}) -> User ID: ${data.user.id}`);
      passCount++;
    }
  }

  console.log(`\nLogin Verification: ${passCount} / ${sampleTestAccounts.length} passed.`);
}

testLogins().catch(console.error);
