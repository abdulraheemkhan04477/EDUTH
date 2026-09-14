import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

async function deepDebug() {
  console.log('==================================================');
  console.log('STEP 1 & 2: IDENTIFY LOGGED-IN TEACHER & ASSIGNED CLASS');
  console.log('==================================================');

  // Teacher Payal Rastogi login
  const teacherClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: teacherAuth, error: tAuthErr } = await teacherClient.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  if (tAuthErr) {
    console.error('Teacher Auth Error:', tAuthErr);
    return;
  }

  const teacherUid = teacherAuth.user.id;
  console.log('auth.uid():', teacherUid);
  console.log('auth.user.email:', teacherAuth.user.email);
  console.log('auth.user.user_metadata:', teacherAuth.user.user_metadata);

  // Profile record
  const { data: profileRec, error: profErr } = await teacherClient
    .from('profiles')
    .select('*')
    .eq('id', teacherUid)
    .single();

  console.log('\n--- Profile Record ---', profileRec, profErr);

  // Teacher record
  const { data: teacherRec, error: teachErr } = await teacherClient
    .from('teachers')
    .select('*')
    .eq('id', teacherUid)
    .single();

  console.log('\n--- Teacher Record ---', teacherRec, teachErr);

  // Classes record
  const { data: classesRec, error: classErr } = await teacherClient
    .from('classes')
    .select('*');

  console.log('\n--- All Classes (Count as Teacher) ---:', classesRec?.length, classErr);
  if (classesRec) {
    classesRec.forEach((c) => {
      if (c.teacher_id?.toLowerCase().includes('teacher07bt24ece00101') || c.name?.includes('ECE')) {
        console.log('  Matching class:', c);
      }
    });
  }

  console.log('\n==================================================');
  console.log('STEP 3 & 4: INSPECT STUDENT RECORDS & LINKAGE');
  console.log('==================================================');

  const { data: teacherStudents, error: tStudErr } = await teacherClient
    .from('students')
    .select('*');

  console.log('\n--- Students Query as Teacher ---');
  console.log('Count:', teacherStudents?.length, 'Error:', tStudErr);
  if (teacherStudents && teacherStudents.length > 0) {
    console.log('Sample student 0:', teacherStudents[0]);
  }

  console.log('\n==================================================');
  console.log('STEP 5: TEST RLS SEPARATELY (ADMIN vs TEACHER)');
  console.log('==================================================');

  // Let's test with Service Role Key / SQL query to see ALL student records in DB for comparison
  const adminClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: adminAuth, error: aAuthErr } = await adminClient.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com', // let's see admin login or query
    password: '07bt24ece00101'
  });

  // Let's check columns on `students` table to see if `class_id` is populated or NULL
  if (teacherStudents && teacherStudents.length > 0) {
    const classIdCount = teacherStudents.filter((s) => s.class_id !== null).length;
    const nullClassIdCount = teacherStudents.filter((s) => s.class_id === null).length;
    console.log(`Students with class_id populated: ${classIdCount}, with class_id NULL: ${nullClassIdCount}`);
  }
}

deepDebug().catch(console.error);
