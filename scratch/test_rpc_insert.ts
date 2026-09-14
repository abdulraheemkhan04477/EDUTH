process.env.VITE_SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

async function testRpcInsert() {
  const { supabase } = await import('../src/lib/supabase');
  const email = `tch_rpc_${Date.now()}@rrimt.edu`;
  const collegeId = 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f';

  console.log(`1. Calling create_app_user for ${email}...`);
  const rpcRes = await supabase.rpc('create_app_user', {
    p_email: email,
    p_password: 'TeacherPass123!',
    p_role: 'teacher',
    p_college_id: collegeId,
    p_name: 'RPC Teacher',
    p_phone: '9999999999',
    p_teacher_id: 'TCH-RPC-01',
    p_extra_data: { department: 'CSE' }
  });

  console.log('RPC Result:', JSON.stringify(rpcRes, null, 2));

  console.log('\n2. Querying profiles table for created email...');
  const profRes = await supabase.from('profiles').select('*').eq('email', email);
  console.log('Profiles query result:', JSON.stringify(profRes, null, 2));

  console.log('\n3. Querying teachers table for created email...');
  const tchRes = await supabase.from('teachers').select('*').eq('email', email);
  console.log('Teachers query result:', JSON.stringify(tchRes, null, 2));
}

testRpcInsert().catch(console.error);
