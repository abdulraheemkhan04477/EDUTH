import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findAdmins() {
  const teacherLog = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });
  console.log('Teacher login:', teacherLog.error ? teacherLog.error.message : 'OK');

  const { data: profiles } = await supabase.from('profiles').select('*').eq('role', 'admin');
  console.log('Admin profiles in DB:', profiles);

  const passwords = ['123456', 'admin123', 'Admin@123', '12345678', 'password', 'superadmin123', '07bt24ece00101'];
  if (profiles) {
    for (const p of profiles) {
      console.log('Testing passwords for admin email:', p.email);
      for (const pass of passwords) {
        const res = await supabase.auth.signInWithPassword({ email: p.email, password: pass });
        if (!res.error) {
          console.log(`>>> SUCCESS! Email: ${p.email}, Password: ${pass}`);
          return;
        }
      }
    }
  }
}

findAdmins().catch(console.error);
