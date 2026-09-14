import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findPass() {
  const passes = ['123456', 'admin123', 'Admin@123', '12345678', 'password', 'zuneyd123', 'admin', '07bt24ece00101', 'Zuneyd@123', 'Zuneyd123'];
  const email = 'zuneydkhan04477@gmail.com';

  for (const p of passes) {
    const res = await supabase.auth.signInWithPassword({ email, password: p });
    if (!res.error) {
      console.log(`FOUND ADMIN PASSWORD: '${p}' for ${email}`);
      return;
    }
  }
  console.log('No password matched for admin email.');
}

findPass().catch(console.error);
