import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const sampleTeachers = [
  { email: 'teacher07bt24ece00101@gmail.com', pass: '07bt24ece00101', name: 'Payal Rastogi' },
  { email: 'teacher07bt24ece00102@gmail.com', pass: '07bt24ece00102', name: 'Ritu Kannaujiya' },
  { email: 'teacher07bt24ee00101@gmail.com', pass: '07bt24ee00101', name: 'Diya Yadav' },
  { email: 'teacher07bt24cse00101@gmail.com', pass: '07bt24cse00101', name: 'Deepak Mishra' },
  { email: 'teacher07dp24civ00101@gmail.com', pass: '07dp24civ00101', name: 'Sara Kannojia' },
  { email: 'teacher07mb24fin00101@gmail.com', pass: '07mb24fin00101', name: 'Ruchi Prasad' },
];

async function testAllTeachersRLS() {
  console.log('Testing RLS student fetching for sample teachers...\n');

  for (const t of sampleTeachers) {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    const { data: auth, error: authErr } = await client.auth.signInWithPassword({
      email: t.email,
      password: t.pass
    });

    if (authErr) {
      console.error(`Login error for ${t.name}:`, authErr.message);
      continue;
    }

    const { data: teacherRec } = await client.from('teachers').select('*').eq('id', auth.user.id).single();

    const { data: dbStudents, error: studErr } = await client.from('students').select('*');

    console.log(`Teacher ${t.name} (${t.email}):`);
    console.log(`  Assigned classes in DB:`, teacherRec?.assigned_classes);
    console.log(`  Supabase students returned count: ${dbStudents?.length}, Error: ${studErr ? studErr.message : 'NONE'}`);
    if (dbStudents && dbStudents.length > 0) {
      console.log(`  Sample student: ${dbStudents[0].name} (${dbStudents[0].course} ${dbStudents[0].branch} ${dbStudents[0].year} ${dbStudents[0].section})`);
    }
    console.log('---');
  }
}

testAllTeachersRLS().catch(console.error);
