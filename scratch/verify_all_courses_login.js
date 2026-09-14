import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testUsers = [
  // B.Tech
  { role: 'student', email: 'studentbt24ece002@gmail.com', pass: 'bt24ece002', label: 'B.Tech ECE Sem 1 Student' },
  { role: 'parent',  email: 'father01bt24ece002@gmail.com', pass: '01bt24ece002', label: 'B.Tech ECE Sem 1 Parent' },
  { role: 'student', email: 'studentbt22cse001@gmail.com', pass: 'bt22cse001', label: 'B.Tech CSE Sem 5 Student' },
  { role: 'parent',  email: 'father01bt22cse001@gmail.com', pass: '01bt22cse001', label: 'B.Tech CSE Sem 5 Parent' },

  // Diploma
  { role: 'student', email: 'studentdp24me001@gmail.com', pass: 'dp24me001', label: 'Diploma ME Sem 1 Student' },
  { role: 'parent',  email: 'father01dp24me001@gmail.com', pass: '01dp24me001', label: 'Diploma ME Sem 1 Parent' },

  // MBA
  { role: 'student', email: 'studentmb24fin001@gmail.com', pass: 'mb24fin001', label: 'MBA Finance Sem 1 Student' },
  { role: 'parent',  email: 'father01mb24fin001@gmail.com', pass: '01mb24fin001', label: 'MBA Finance Sem 1 Parent' },
];

async function verifyLogins() {
  console.log('Verifying Auth Sign In across B.Tech, Diploma, and MBA...');

  for (const u of testUsers) {
    const res = await supabase.auth.signInWithPassword({
      email: u.email,
      password: u.pass,
    });

    if (res.error) {
      console.error(`FAILED: ${u.label} (${u.email}) ->`, res.error.message);
    } else {
      console.log(`SUCCESS: ${u.label} (${u.email}) -> User ID: ${res.data.user.id}`);
    }
  }
}

verifyLogins().catch(console.error);
