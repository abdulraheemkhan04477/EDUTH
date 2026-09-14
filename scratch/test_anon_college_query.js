import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonCollegeQuery() {
  const collegeId = 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f';
  console.log(`Querying teachers with .eq('college_id', '${collegeId}')...`);
  const { data, error } = await supabase.from('teachers').select('*').eq('college_id', collegeId);
  console.log('Result count:', data ? data.length : 0, 'Error:', error);
}

testAnonCollegeQuery().catch(console.error);
