import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPg() {
  console.log('Testing reading system tables or functions...');
  
  // Try querying pg_proc or information_schema if exposed
  const res1 = await supabase.from('pg_proc').select('*').limit(1);
  console.log('pg_proc:', res1.status, res1.error?.message);

  // Try calling a dummy rpc to see error format
  const res2 = await supabase.rpc('get_schema_info');
  console.log('get_schema_info:', res2.status, res2.error?.message);
}

testPg().catch(console.error);
