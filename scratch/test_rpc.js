import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRpc() {
  console.log('Testing RPC calls...');
  
  // Try calling create_college_with_admin with dummy data to see response/error
  const res = await supabase.rpc('create_college_with_admin', {
    p_college_code: 'TEST01',
    p_college_name: 'Test College',
    p_official_email: 'testcollege@example.com',
    p_official_phone: '1234567890',
    p_address: '123 Test St',
    p_city: 'Test City',
    p_state: 'TS',
    p_country: 'USA',
    p_admin_name: 'Test Admin',
    p_admin_email: 'testadmin_' + Date.now() + '@example.com',
    p_admin_password: 'Password123!',
    p_admin_phone: '1234567890'
  });

  console.log('create_college_with_admin result:', JSON.stringify(res, null, 2));
}

testRpc().catch(console.error);
