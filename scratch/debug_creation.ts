process.env.VITE_SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

import crypto from 'crypto';

async function debugCreation() {
  const { AuthService } = await import('../src/services/authService');
  const teacherEmail = `debug_tch_${Date.now()}@rrimt.edu`;
  console.log(`Testing creation for ${teacherEmail}...`);

  const res = await AuthService.createTeacherAccount({
    name: 'Debug Teacher',
    email: teacherEmail,
    password: 'TeacherPass123!',
    teacher_id: 'TCH-DEBUG-01',
    college_id: 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f',
    department: 'ECE'
  });

  console.log('Account creation result:', res);
}

debugCreation().catch(console.error);
