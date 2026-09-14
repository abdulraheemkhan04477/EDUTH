import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPolicies() {
  const { data: auth } = await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  // Try querying pg_policies via rpc if sql exec available or test queries
  const { data, error } = await supabase.rpc('get_user_role');
  console.log('get_user_role RPC output:', data, error);

  // Let's test what student records teacher can query directly with filters
  const { data: eceStudents, error: eceErr } = await supabase
    .from('students')
    .select('*')
    .eq('course', 'B.Tech')
    .eq('branch', 'ECE')
    .eq('year', '1st Year');
  console.log('ECE 1st year students query count:', eceStudents?.length, eceErr);

  const { data: cseStudents, error: cseErr } = await supabase
    .from('students')
    .select('*')
    .eq('course', 'B.Tech')
    .eq('branch', 'CSE')
    .eq('year', '1st Year');
  console.log('CSE 1st year students query count:', cseStudents?.length, cseErr);
}

checkPolicies().catch(console.error);
