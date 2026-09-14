import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSpaceVsNoSpace() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const realStudentId = '18f6f70d-b44e-4cbf-b6d1-65302f6a7ea8';
  const realExamId = '43be29d3-6e05-4e70-818c-e7b543595fa1';

  const batchWithId = [
    {
      id: 'res_test_space_' + Date.now(),
      college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
      exam_id: realExamId,
      student_id: realStudentId,
      student_name: 'Amina Khan',
      roll_no: 'BT24ECE005',
      course: 'B.Tech',
      branch: 'ECE',
      year: '1st Year',
      semester: 'Semester 1',
      section: 'Section A',
      subject: 'Engineering Mathematics-I',
      max_marks: 100,
      obtained_marks: 99,
      passing_marks: 40,
      percentage: 99,
      grade: 'A+',
      grade_point: 4.0,
      status: 'Pass',
      is_published: false,
      updated_at: new Date().toISOString()
    }
  ];

  console.log('--- Test 1: WITH SPACES: "college_id, exam_id, student_id, subject" ---');
  const { error: err1 } = await supabase.from('results').upsert(batchWithId, {
    onConflict: 'college_id, exam_id, student_id, subject'
  });
  console.log('Result with spaces:', err1 ? `${err1.status || ''} ${err1.code} : ${err1.message}` : 'SUCCESS');

  console.log('\n--- Test 2: WITHOUT SPACES: "college_id,exam_id,student_id,subject" ---');
  const { error: err2 } = await supabase.from('results').upsert(batchWithId, {
    onConflict: 'college_id,exam_id,student_id,subject'
  });
  console.log('Result without spaces:', err2 ? `${err2.status || ''} ${err2.code} : ${err2.message}` : 'SUCCESS');

  console.log('\n--- Test 3: What if we query existing results and upsert by ID or update existing record? ---');
  // Let's test upserting without id field or with existing id
  const { data: existing } = await supabase.from('results').select('id')
    .eq('exam_id', realExamId)
    .eq('student_id', realStudentId)
    .eq('subject', 'Engineering Mathematics-I');
  
  if (existing && existing.length > 0) {
    const payloadExistingId = {
      ...batchWithId[0],
      id: existing[0].id
    };
    const { error: err3 } = await supabase.from('results').upsert([payloadExistingId], {
      onConflict: 'id'
    });
    console.log('Result with matching ID onConflict id:', err3 ? `${err3.code} : ${err3.message}` : 'SUCCESS');
  }
}

testSpaceVsNoSpace();
