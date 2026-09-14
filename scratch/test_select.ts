process.env.VITE_SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

async function testSelect() {
  const { supabase } = await import('../src/lib/supabase');
  console.log('Testing classes upsert...');

  const upsertRes = await supabase.from('classes').upsert([{
    id: 'c_test_' + Date.now(),
    college_id: 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f',
    course: 'B.Tech',
    branch: 'ECE',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'Section A',
    name: 'B.Tech ECE - 1st Year - Section A',
    teacher_name: 'Professor Vikram',
    teacher_id: 'TCH-RRIMT-001',
    room_no: 'Room 301',
    capacity: 60
  }]);

  console.log('Upsert result:', JSON.stringify(upsertRes, null, 2));

  const cRes = await supabase.from('classes').select('*');
  console.log('classes count:', cRes.data?.length, 'data:', cRes.data, 'error:', cRes.error?.message);

  const pRes = await supabase.from('profiles').select('*');
  console.log('profiles count:', pRes.data?.length, 'error:', pRes.error?.message);

  const tRes = await supabase.from('teachers').select('*');
  console.log('teachers count:', tRes.data?.length, 'error:', tRes.error?.message);

  const sRes = await supabase.from('students').select('*');
  console.log('students count:', sRes.data?.length, 'error:', sRes.error?.message);

  const parRes = await supabase.from('parents').select('*');
  console.log('parents count:', parRes.data?.length, 'error:', parRes.error?.message);
}

testSelect().catch(console.error);
