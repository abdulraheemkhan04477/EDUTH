import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const isValidUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

async function testBatchWithMixedStudents() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const realStudentId = '18f6f70d-b44e-4cbf-b6d1-65302f6a7ea8';
  const realExamId = '43be29d3-6e05-4e70-818c-e7b543595fa1';
  const dummyStudentId = 'st_demo_1';

  const rawBatch = [
    {
      id: 'res_real_' + Date.now(),
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
      obtained_marks: 95,
      passing_marks: 40,
      percentage: 95,
      grade: 'A+',
      grade_point: 4.0,
      status: 'Pass',
      is_published: false
    },
    {
      id: 'res_dummy_' + Date.now(),
      college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
      exam_id: realExamId,
      student_id: dummyStudentId,
      student_name: 'Aarav Sharma',
      roll_no: '202601',
      course: 'B.Tech',
      branch: 'ECE',
      year: '1st Year',
      semester: 'Semester 1',
      section: 'Section A',
      subject: 'Engineering Mathematics-I',
      max_marks: 100,
      obtained_marks: 80,
      passing_marks: 40,
      percentage: 80,
      grade: 'A',
      grade_point: 3.7,
      status: 'Pass',
      is_published: false
    }
  ];

  // Filter dbPayload to valid UUID student_id only for Supabase
  const dbPayload = rawBatch.filter(item => isValidUUID(item.student_id));
  console.log(`Total batch items: ${rawBatch.length}, DB valid UUID items: ${dbPayload.length}`);

  if (dbPayload.length > 0) {
    const { error } = await supabase.from('results').upsert(dbPayload, {
      onConflict: 'college_id,exam_id,student_id,subject',
      ignoreDuplicates: false
    });
    console.log('Upsert result for valid UUIDs:', error ? error.message : 'SUCCESS! Zero errors!');
  }
}

testBatchWithMixedStudents();
