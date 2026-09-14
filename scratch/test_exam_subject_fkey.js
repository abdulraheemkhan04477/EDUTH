import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const isValidUUID = (str) => Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

async function testFullFix() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const students = [
    { id: '18f6f70d-b44e-4cbf-b6d1-65302f6a7ea8', name: 'Amina Khan', roll_no: 'BT24ECE005' },
    { id: '4a70154b-dc88-49e7-a106-83f5c26ad773', name: 'Vivaan Kannojia', roll_no: 'BT24ECE001' }
  ];

  const examId = '43be29d3-6e05-4e70-818c-e7b543595fa1';
  const dummySubjectId = 'def_m1';
  const subjectName = 'Engineering Mathematics-I';

  const dbPayload = students.map((st) => ({
    id: `res_${examId}_${st.id}_${dummySubjectId}`,
    college_id: '13695a78-0105-4bde-bc85-d664bb66637e',
    exam_id: examId,
    exam_subject_id: isValidUUID(dummySubjectId) ? dummySubjectId : null,
    student_id: st.id,
    student_name: st.name,
    roll_no: st.roll_no,
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    subject: subjectName,
    max_marks: 100,
    obtained_marks: 92,
    passing_marks: 40,
    percentage: 92,
    grade: 'A+',
    grade_point: 4.0,
    status: 'Pass',
    is_published: false,
    updated_at: new Date().toISOString()
  }));

  const validDbPayload = dbPayload.filter((item) => isValidUUID(item.student_id));
  console.log('Sending valid payload count:', validDbPayload.length);

  const { data, error } = await supabase.from('results').upsert(validDbPayload, {
    onConflict: 'college_id,exam_id,student_id,subject',
    ignoreDuplicates: false
  });

  if (error) {
    console.error('FAILED:', error);
  } else {
    console.log('SUCCESS! Real marks saved directly into Supabase results table!');

    // Verify by querying results table
    const { data: savedResults } = await supabase.from('results')
      .select('*')
      .eq('exam_id', examId)
      .eq('subject', subjectName);

    console.log('Saved results count in DB:', savedResults ? savedResults.length : 0);
    console.log('Sample saved result:', savedResults ? savedResults[0] : null);
  }
}

testFullFix();
