import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const adminEmail = `admin_${Date.now()}@college.edu`;
  const adminPassword = 'AdminPassword123!';
  const collegeCode = `C${Math.floor(1000 + Math.random() * 9000)}`;

  console.log(`1. Creating college ${collegeCode} with admin ${adminEmail}...`);
  const rpcRes = await supabase.rpc('create_college_with_admin', {
    p_college_code: collegeCode,
    p_college_name: 'Debug College',
    p_official_email: adminEmail,
    p_official_phone: '9999999999',
    p_address: 'Debug Address',
    p_city: 'Debug City',
    p_state: 'Debug State',
    p_country: 'India',
    p_admin_name: 'Debug Admin',
    p_admin_email: adminEmail,
    p_admin_password: adminPassword,
    p_admin_phone: '9999999999'
  });

  console.log('RPC result:', JSON.stringify(rpcRes, null, 2));

  if (rpcRes.error) {
    console.error('RPC Error:', rpcRes.error);
    return;
  }

  const { college_id, admin_user_id } = rpcRes.data;
  console.log(`Created College ID: ${college_id}, Admin User ID: ${admin_user_id}`);

  console.log(`\n2. Attempting signInWithPassword for ${adminEmail}...`);
  const signInRes = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  });

  console.log('signInWithPassword result:', JSON.stringify(signInRes, null, 2));
}

run().catch(console.error);
