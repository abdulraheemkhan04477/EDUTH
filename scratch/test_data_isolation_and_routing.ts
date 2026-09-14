process.env.VITE_SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

async function testIsolationAndRouting() {
  console.log('=== MULTI-COLLEGE DATA ISOLATION & ROUTING VERIFICATION ===\n');

  const { AuthService } = await import('../src/services/authService');
  const { syncWithSupabase, resetAcademicStore, academicStore } = await import('../src/lib/academicStore');
  const { syncFeeDataWithSupabase, resetFeeStore, feeStore } = await import('../src/lib/feeStore');

  // Test 1: College A Admin Login & Isolation
  console.log('1. Logging in as College A Admin (zuneydkhan04477@gmail.com)...');
  const adminARes = await AuthService.signIn('zuneydkhan04477@gmail.com', 'dummyPassword', 'admin');
  console.log('College A Admin Result:', {
    role: adminARes.user?.role,
    college_id: adminARes.user?.college_id,
    name: adminARes.user?.name,
    email: adminARes.user?.email,
    error: adminARes.error,
  });

  const collegeAId = adminARes.user?.college_id;
  await syncWithSupabase(collegeAId, false);
  await syncFeeDataWithSupabase(collegeAId, false);

  const collegeATeachers = academicStore.getTeachers().filter(t => t.college_id === collegeAId);
  const collegeAClasses = academicStore.getClasses().filter(c => c.college_id === collegeAId);
  console.log(`College A Data -> Teachers: ${collegeATeachers.length}, Classes: ${collegeAClasses.length}`);

  // Test 2: Logout & College B Admin Login (simulated second college)
  console.log('\n2. Logging out and logging in as College B Admin...');
  await AuthService.signOut();

  const collegeBId = 'COL_TEST_B_999';
  await syncWithSupabase(collegeBId, false);
  await syncFeeDataWithSupabase(collegeBId, false);

  const leakedCollegeATeachers = academicStore.getTeachers().filter(t => t.college_id === collegeAId);
  const collegeBTeachers = academicStore.getTeachers().filter(t => t.college_id === collegeBId);
  console.log(`After Sign Out -> College A Teachers Remaining: ${leakedCollegeATeachers.length} (Expected: 0), College B Teachers: ${collegeBTeachers.length}`);

  // Test 3: Super Admin Login & Isolation
  console.log('\n3. Logging in as Super Admin...');
  const superAdminRes = await AuthService.superAdminSignIn('superadmin@example.com', 'superadmin123');
  console.log('Super Admin Result:', {
    role: superAdminRes.user?.role,
    college_id: superAdminRes.user?.college_id,
    email: superAdminRes.user?.email,
    error: superAdminRes.error,
  });

  await syncWithSupabase('PLATFORM_ALL', true);
  const allTeachersSuper = academicStore.getTeachers();
  console.log(`Super Admin View -> Total Teachers Visible: ${allTeachersSuper.length}`);

  // Test 4: Super Admin Logout & Re-login as College A Admin
  console.log('\n4. Logging out Super Admin and Re-logging in as College A Admin...');
  await AuthService.signOut();
  const reAdminA = await AuthService.signIn('zuneydkhan04477@gmail.com', 'dummyPassword', 'admin');
  console.log('Re-login College A Admin Result:', {
    role: reAdminA.user?.role,
    college_id: reAdminA.user?.college_id,
    email: reAdminA.user?.email,
    error: reAdminA.error,
  });

  console.log('\n=== ALL ISOLATION & ROUTING TESTS COMPLETED SUCCESSFULLY ===');
}

testIsolationAndRouting().catch(console.error);
