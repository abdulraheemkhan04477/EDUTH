import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFullUpsertBatch() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const realStudentId = '18f6f70d-b44e-4cbf-b6d1-65302f6a7ea8';
  const realExamId = '43be29d3-6e05-4e70-818c-e7b543595fa1';

  const batch = [
    {
      id: 'res_test_batch_1',
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
      obtained_marks: 96,
      passing_marks: 40,
      percentage: 96,
      grade: 'A+',
      grade_point: 4.0,
      status: 'Pass',
      is_published: false,
      updated_at: new Date().toISOString()
    }
  ];

  console.log('--- Testing upsert with onConflict: "college_id, exam_id, student_id, subject" ---');
  const { data, error } = await supabase.from('results').upsert(batch, {
    onConflict: 'college_id, exam_id, student_id, subject',
    ignoreDuplicates: false
  });

  if (error) {
    console.error('ERROR during upsert:', error);
  } else {
    console.log('SUCCESS! Batch upserted with zero errors!');
  }
}

testFullUpsertBatch();
