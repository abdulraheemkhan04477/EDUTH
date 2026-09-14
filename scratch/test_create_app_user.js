import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCreateAppUser() {
  const teacherEmail = `teacher_${Date.now()}@college.edu`;
  const teacherPass = 'TeacherPass123!';
  const validCollegeUuid = '13695a78-0105-4bde-bc85-d664bb66637e'; // RRIMT UUID in database

  console.log(`1. Calling create_app_user for ${teacherEmail} with college_id ${validCollegeUuid}...`);
  const rpcRes = await supabase.rpc('create_app_user', {
    p_email: teacherEmail,
    p_password: teacherPass,
    p_role: 'teacher',
    p_college_id: validCollegeUuid,
    p_name: 'Test Teacher',
    p_phone: '8888888888',
    p_teacher_id: 'TCH-TEST-01',
    p_extra_data: { department: 'ECE' }
  });

  console.log('create_app_user result:', JSON.stringify(rpcRes, null, 2));

  if (rpcRes.data) {
    console.log(`\n2. Attempting signInWithPassword for ${teacherEmail}...`);
    const signInRes = await supabase.auth.signInWithPassword({
      email: teacherEmail,
      password: teacherPass
    });
    console.log('signInWithPassword result:', JSON.stringify(signInRes, null, 2));
  }
}

testCreateAppUser().catch(console.error);
