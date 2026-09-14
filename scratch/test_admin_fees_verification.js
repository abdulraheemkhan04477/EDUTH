import { createClient } from '@supabase/supabase-js';
import { AuthService } from '../src/services/authService.js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminFlow() {
  console.log('Testing Admin Sign In...');
  const res = await AuthService.signIn('zuneydkhan04477@gmail.com', 'admin123', 'admin');
  console.log('Admin SignIn Result:', res.user ? `SUCCESS: ${res.user.name}` : `ERROR: ${res.error}`);

  // Test fetching student fees via feeStore logic
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('college_id', '13695a78-0105-4bde-bc85-d664bb66637e')
    .order('roll_no', { ascending: true });

  console.log(`Fetched ${students?.length || 0} students from Supabase.`);
  if (students && students.length > 0) {
    console.log('First student:', students[0].name, 'Course:', students[0].course, 'Branch:', students[0].branch);
  }
}

testAdminFlow().catch(console.error);
