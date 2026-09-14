import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnon() {
  const adminEmail = 'zuneydkhan04477@gmail.com';
  console.log(`Testing anon queries for ${adminEmail}...`);

  // 1. Query colleges table by email
  const colRes = await supabase.from('colleges').select('*').eq('email', adminEmail).maybeSingle();
  console.log('1. colleges by email:', JSON.stringify(colRes, null, 2));

  // 2. Query profiles table by email
  const profRes = await supabase.from('profiles').select('*').eq('email', adminEmail).maybeSingle();
  console.log('2. profiles by email:', JSON.stringify(profRes, null, 2));

  // 3. Query teachers by email
  const tRes = await supabase.from('teachers').select('*').eq('email', adminEmail).maybeSingle();
  console.log('3. teachers by email:', JSON.stringify(tRes, null, 2));

  // 4. Query students by email
  const sRes = await supabase.from('students').select('*').eq('email', adminEmail).maybeSingle();
  console.log('4. students by email:', JSON.stringify(sRes, null, 2));
}

testAnon().catch(console.error);
