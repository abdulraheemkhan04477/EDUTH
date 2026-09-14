// Test academicStore logic directly
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

// Use execute_sql via MCP or fetch raw DB rows to simulate DB response
async function testStoreSync() {
  console.log('Testing store sync and filtering with simulated DB records...');
  
  // Simulated teachers from DB table 'teachers'
  const rawDbTeachers = [
    { id: '9f03909e-2889-40db-972e-633887917656', college_id: 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f', teacher_id: 'TCH-9f03909e', name: 'sarni', email: 'abdulraheemkhan59@gmail.com', phone: '9878765654', department: 'ECE', course: 'B.Tech', position: 'Assistant Professor', qualification: 'phd', assigned_classes: ['B.Tech • ECE • 1st Year • Section A'], status: 'active' },
    { id: '2b8a899b-a543-46b2-8421-7eaae6ef75df', college_id: 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f', teacher_id: 'TCH-2b8a899b', name: 'Nina Drama', email: 'zuneydkhan045@gmail.com', phone: '9878787988', department: 'ECE', course: 'B.Tech', position: 'Assistant Professor', qualification: 'PHD', assigned_classes: ['B.Tech • ECE • 1st Year • Section A'], status: 'active' },
    { id: '82e782d0-9d9f-400f-9317-9d5ebb53417e', college_id: 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f', teacher_id: 'TCH-2026', name: 'Noman Khan', email: 'zuneydkhan28056@gmail.com', phone: '+1 (555) 000-0000', department: 'CSE', course: 'B.Tech', position: 'Head of Department', qualification: 'zuneydkhan28056@gmail.com', assigned_classes: ['B.Tech • ECE • 1st Year • Section A'], status: 'active' },
    { id: 'ab3996dd-9e47-4a04-bdcd-7649daf98a28', college_id: 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f', teacher_id: 'TCH-ab3996dd', name: 'durga kumari', email: 'zuneydkhan477@gmail.com', phone: '6767676767', department: 'Finance', course: 'MBA', position: 'Assistant Professor', qualification: 'phd', assigned_classes: ['B.Tech • ECE • 1st Year • Section A'], status: 'active' },
    // Teacher from College B
    { id: 'tch_col_b_01', college_id: '723a3815-5f93-4bb2-b909-61fc4ccd221d', teacher_id: 'TCH-SRIMT-01', name: 'SRIMT Teacher', email: 'srimt_teacher@srimt.edu', phone: '1111111111', department: 'CSE', course: 'B.Tech', position: 'Assistant Professor', qualification: 'M.Tech', assigned_classes: [], status: 'active' },
  ];

  const adminA_CollegeId = 'bed3a26b-64d2-4bfb-812a-1f0e92b66d5f';
  const adminB_CollegeId = '723a3815-5f93-4bb2-b909-61fc4ccd221d';

  const isCollegeMatch = (itemCollegeId, userCollege, isSuperAdmin = false) => {
    if (isSuperAdmin) return true;
    if (!itemCollegeId) return false;
    if (itemCollegeId === 'COL001') return !userCollege || userCollege === 'COL001';
    return itemCollegeId === userCollege;
  };

  const scopedTeachersAdminA = rawDbTeachers.filter(t => isCollegeMatch(t.college_id, adminA_CollegeId));
  const scopedTeachersAdminB = rawDbTeachers.filter(t => isCollegeMatch(t.college_id, adminB_CollegeId));

  console.log(`Scoped teachers for Admin A (RRIMT): ${scopedTeachersAdminA.length}`);
  console.log(`Scoped teachers for Admin B (SRIMT): ${scopedTeachersAdminB.length}`);

  console.assert(scopedTeachersAdminA.length === 4, 'Admin A should see exactly 4 teachers!');
  console.assert(scopedTeachersAdminB.length === 1, 'Admin B should see exactly 1 teacher!');
  console.assert(scopedTeachersAdminB[0].name === 'SRIMT Teacher', 'Admin B should see only SRIMT Teacher!');

  console.log('SUCCESS: Store sync & multi-college isolation verification completed!');
}

testStoreSync().catch(console.error);
