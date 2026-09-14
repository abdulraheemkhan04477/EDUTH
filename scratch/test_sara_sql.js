import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

async function testSara() {
  const client = createClient(supabaseUrl, supabaseAnonKey);
  await client.auth.signInWithPassword({
    email: 'teacher07dp24civ00101@gmail.com',
    password: '07dp24civ00101'
  });

  const { data: teacher } = await client.from('teachers').select('*').single();
  console.log('Sara teacher record:', teacher);

  const { data: students } = await client.from('students').select('course, branch, year, section, name');
  console.log('Students returned for Sara count:', students?.length);

  const branchCounts = {};
  students?.forEach((s) => {
    const key = `${s.course} ${s.branch} ${s.year}`;
    branchCounts[key] = (branchCounts[key] || 0) + 1;
  });
  console.log('Branch breakdown of returned students:', branchCounts);
}

testSara().catch(console.error);
