import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAllLogins() {
  const teacherLog = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });
  if (teacherLog.error) throw teacherLog.error;

  const { data: profiles } = await supabase.from('profiles').select('email, role, college_id');
  console.log(`Found ${profiles?.length || 0} profiles in Supabase.`);

  const samplePasses = ['07bt24ece00101', '123456', 'admin123', 'student123', 'parent123', 'password'];

  for (const p of profiles || []) {
    for (const pass of samplePasses) {
      const res = await supabase.auth.signInWithPassword({ email: p.email, password: pass });
      if (!res.error) {
        console.log(`SUCCESS: Role=${p.email} | Role=${p.role} | Password='${pass}'`);
        break;
      }
    }
  }
}

testAllLogins().catch(console.error);
