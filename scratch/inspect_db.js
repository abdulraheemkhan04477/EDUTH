import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing Supabase queries...');

  const tables = ['profiles', 'colleges', 'classes', 'teachers', 'students', 'attendance', 'fee_structures', 'fee_payments', 'admins', 'users'];

  for (const table of tables) {
    const res = await supabase.from(table).select('*');
    if (res.error) {
      console.log(`Table '${table}' query ERROR:`, res.error.message, res.error.code, res.error.details, res.error.hint);
    } else {
      console.log(`Table '${table}' OK, count:`, res.data.length, 'sample:', res.data[0]);
    }
  }
}

test().catch(console.error);
