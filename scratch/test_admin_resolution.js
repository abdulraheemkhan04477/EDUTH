import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testResolution() {
  const adminEmail = 'zuneydkhan04477@gmail.com';
  console.log(`Resolving profile for ${adminEmail}...`);

  // 1. Check colleges by email
  const { data: college } = await supabase.from('colleges').select('*').eq('email', adminEmail).maybeSingle();
  
  if (college) {
    const adminProfile = {
      id: `admin_${college.id}`,
      college_id: college.id,
      school_id: college.id,
      role: 'admin',
      name: `${college.name} Administrator`,
      email: adminEmail,
      phone: college.phone || '',
      status: college.status || 'active',
      created_at: college.created_at || new Date().toISOString(),
    };
    console.log('SUCCESSFULLY RESOLVED ADMIN PROFILE FROM COLLEGE RECORD:', JSON.stringify(adminProfile, null, 2));
  } else {
    console.log('No college found for email');
  }
}

testResolution().catch(console.error);
