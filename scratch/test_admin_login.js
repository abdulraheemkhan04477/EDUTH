import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdmin() {
  const passwordsToTry = ['123456', 'admin123', 'Admin@123', '12345678', 'password', 'zuneyd123'];
  const email = 'zuneydkhan04477@gmail.com';

  console.log(`Trying sign in for ${email}...`);
  for (const password of passwordsToTry) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.session) {
      console.log(`SUCCESS login with password '${password}'! User ID: ${data.session.user.id}`);
      
      // Now test the exact queries AuthService runs during login:
      console.log('\n--- 1. Querying profiles by ID ---');
      const profileQuery = await supabase.from('profiles').select('*').eq('id', data.session.user.id).maybeSingle();
      console.log('Result of profiles by id:', JSON.stringify(profileQuery, null, 2));

      console.log('\n--- 2. Querying profiles by email ---');
      const profileEmailQuery = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
      console.log('Result of profiles by email:', JSON.stringify(profileEmailQuery, null, 2));

      console.log('\n--- 3. Querying colleges by id/code ---');
      const collegeQuery = await supabase.from('colleges').select('*').or(`id.eq.${profileQuery.data?.college_id},code.eq.${profileQuery.data?.college_id}`).maybeSingle();
      console.log('Result of colleges by id:', JSON.stringify(collegeQuery, null, 2));

      console.log('\n--- 4. Querying classes ---');
      const classesQuery = await supabase.from('classes').select('*');
      console.log('Result of classes:', JSON.stringify(classesQuery, null, 2));

      console.log('\n--- 5. Querying teachers ---');
      const teachersQuery = await supabase.from('teachers').select('*');
      console.log('Result of teachers:', JSON.stringify(teachersQuery, null, 2));

      console.log('\n--- 6. Querying students ---');
      const studentsQuery = await supabase.from('students').select('*');
      console.log('Result of students:', JSON.stringify(studentsQuery, null, 2));

      console.log('\n--- 7. Querying fee_structures ---');
      const feeStructQuery = await supabase.from('fee_structures').select('*');
      console.log('Result of fee_structures:', JSON.stringify(feeStructQuery, null, 2));

      return;
    } else {
      console.log(`Failed password '${password}':`, error?.message);
    }
  }
}

testAdmin().catch(console.error);
