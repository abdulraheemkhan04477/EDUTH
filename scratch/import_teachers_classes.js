import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const college_id = '13695a78-0105-4bde-bc85-d664bb66637e';

const classesData = [
  // B.Tech 36 Classes
  { id: 1, course: 'B.Tech', branch: 'ECE', year: '1st Year', semester: 'Semester 1', t1: 'Payal Rastogi', t1_qual: 'M.Tech', t2: 'Ritu Kannaujiya', t2_qual: 'M.Tech' },
  { id: 2, course: 'B.Tech', branch: 'EE', year: '1st Year', semester: 'Semester 1', t1: 'Diya Yadav', t1_qual: 'M.E.', t2: 'Ira Srivastava', t2_qual: 'M.Tech (Pursuing Ph.D)' },
  { id: 3, course: 'B.Tech', branch: 'ME', year: '1st Year', semester: 'Semester 1', t1: 'Reyansh Awasthi', t1_qual: 'M.Tech (Pursuing Ph.D)', t2: 'Isha Srivastava', t2_qual: 'Ph.D' },
  { id: 4, course: 'B.Tech', branch: 'Civil', year: '1st Year', semester: 'Semester 1', t1: 'Riya Mishra', t1_qual: 'M.Tech', t2: 'Abhishek Kannaujiya', t2_qual: 'M.Tech (Pursuing Ph.D)' },
  { id: 5, course: 'B.Tech', branch: 'Biotech', year: '1st Year', semester: 'Semester 1', t1: 'Meera Maurya', t1_qual: 'M.E.', t2: 'Ayaan Rajput', t2_qual: 'Ph.D' },
  { id: 6, course: 'B.Tech', branch: 'CSE', year: '1st Year', semester: 'Semester 1', t1: 'Deepak Mishra', t1_qual: 'M.Tech, Ph.D', t2: 'Anika Sharma', t2_qual: 'Ph.D' },
  { id: 7, course: 'B.Tech', branch: 'IT', year: '1st Year', semester: 'Semester 1', t1: 'Kiara Dwivedi', t1_qual: 'M.E.', t2: 'Manish Chaudhary', t2_qual: 'Ph.D' },
  { id: 8, course: 'B.Tech', branch: 'AIML', year: '1st Year', semester: 'Semester 1', t1: 'Krishna Nigam', t1_qual: 'M.Tech', t2: 'Abhishek Dwivedi', t2_qual: 'Ph.D' },
  { id: 9, course: 'B.Tech', branch: 'CSD', year: '1st Year', semester: 'Semester 1', t1: 'Anika Rajput', t1_qual: 'M.E.', t2: 'Ravi Yadav', t2_qual: 'M.E.' },
  { id: 10, course: 'B.Tech', branch: 'ECE', year: '2nd Year', semester: 'Semester 3', t1: 'Ruchi Jaiswal', t1_qual: 'Ph.D', t2: 'Ananya Jaiswal', t2_qual: 'M.Tech' },
  { id: 11, course: 'B.Tech', branch: 'EE', year: '2nd Year', semester: 'Semester 3', t1: 'Ruchi Agarwal', t1_qual: 'M.Tech (Pursuing Ph.D)', t2: 'Ravi Gupta', t2_qual: 'Ph.D' },
  { id: 12, course: 'B.Tech', branch: 'ME', year: '2nd Year', semester: 'Semester 3', t1: 'Rahul Bharti', t1_qual: 'M.Tech (Pursuing Ph.D)', t2: 'Isha Shukla', t2_qual: 'M.E.' },
  { id: 13, course: 'B.Tech', branch: 'Civil', year: '2nd Year', semester: 'Semester 3', t1: 'Shalini Nigam', t1_qual: 'Ph.D', t2: 'Swati Kannaujiya', t2_qual: 'M.Tech, Ph.D' },
  { id: 14, course: 'B.Tech', branch: 'Biotech', year: '2nd Year', semester: 'Semester 3', t1: 'Kiara Singh', t1_qual: 'M.E.', t2: 'Manisha Bajpai', t2_qual: 'M.Tech, Ph.D' },
  { id: 15, course: 'B.Tech', branch: 'CSE', year: '2nd Year', semester: 'Semester 3', t1: 'Rajesh Prasad', t1_qual: 'M.Tech (Pursuing Ph.D)', t2: 'Nisha Nigam', t2_qual: 'Ph.D' },
  { id: 16, course: 'B.Tech', branch: 'IT', year: '2nd Year', semester: 'Semester 3', t1: 'Harsh Srivastava', t1_qual: 'M.Tech, Ph.D', t2: 'Vikram Srivastava', t2_qual: 'M.E.' },
  { id: 17, course: 'B.Tech', branch: 'AIML', year: '2nd Year', semester: 'Semester 3', t1: 'Kritika Dubey', t1_qual: 'M.Tech', t2: 'Yash Yadav', t2_qual: 'M.Tech' },
  { id: 18, course: 'B.Tech', branch: 'CSD', year: '2nd Year', semester: 'Semester 3', t1: 'Aditi Sharma', t1_qual: 'M.Tech', t2: 'Arun Rajput', t2_qual: 'Ph.D' },
  { id: 19, course: 'B.Tech', branch: 'ECE', year: '3rd Year', semester: 'Semester 5', t1: 'Kavita Singh', t1_qual: 'M.Tech', t2: 'Neha Rajput', t2_qual: 'M.Tech (Pursuing Ph.D)' },
  { id: 20, course: 'B.Tech', branch: 'EE', year: '3rd Year', semester: 'Semester 5', t1: 'Vikram Dwivedi', t1_qual: 'Ph.D', t2: 'Naveen Bajpai', t2_qual: 'M.Tech (Pursuing Ph.D)' },
  { id: 21, course: 'B.Tech', branch: 'ME', year: '3rd Year', semester: 'Semester 5', t1: 'Mohit Pandey', t1_qual: 'Ph.D', t2: 'Myra Nigam', t2_qual: 'M.E.' },
  { id: 22, course: 'B.Tech', branch: 'Civil', year: '3rd Year', semester: 'Semester 5', t1: 'Preeti Awasthi', t1_qual: 'M.Tech, Ph.D', t2: 'Aarav Kannojia', t2_qual: 'M.Tech, Ph.D' },
  { id: 23, course: 'B.Tech', branch: 'Biotech', year: '3rd Year', semester: 'Semester 5', t1: 'Naveen Bajpai', t1_qual: 'M.E.', t2: 'Amit Rajput', t2_qual: 'M.Tech (Pursuing Ph.D)' },
  { id: 24, course: 'B.Tech', branch: 'CSE', year: '3rd Year', semester: 'Semester 5', t1: 'Rajesh Dubey', t1_qual: 'M.E.', t2: 'Arjun Gupta', t2_qual: 'Ph.D' },
  { id: 25, course: 'B.Tech', branch: 'IT', year: '3rd Year', semester: 'Semester 5', t1: 'Rahul Sharma', t1_qual: 'M.E.', t2: 'Manisha Saroj', t2_qual: 'Ph.D' },
  { id: 26, course: 'B.Tech', branch: 'AIML', year: '3rd Year', semester: 'Semester 5', t1: 'Ravi Bajpai', t1_qual: 'M.Tech, Ph.D', t2: 'Deepak Rastogi', t2_qual: 'Ph.D' },
  { id: 27, course: 'B.Tech', branch: 'CSD', year: '3rd Year', semester: 'Semester 5', t1: 'Rohan Nigam', t1_qual: 'M.Tech, Ph.D', t2: 'Naveen Dwivedi', t2_qual: 'M.Tech, Ph.D' },
  { id: 28, course: 'B.Tech', branch: 'ECE', year: '4th Year', semester: 'Semester 7', t1: 'Payal Srivastava', t1_qual: 'M.Tech, Ph.D', t2: 'Aadesh Jaiswal', t2_qual: 'Ph.D' },
  { id: 29, course: 'B.Tech', branch: 'EE', year: '4th Year', semester: 'Semester 7', t1: 'Yash Verma', t1_qual: 'M.Tech (Pursuing Ph.D)', t2: 'Gaurav Srivastava', t2_qual: 'M.Tech (Pursuing Ph.D)' },
  { id: 30, course: 'B.Tech', branch: 'ME', year: '4th Year', semester: 'Semester 7', t1: 'Pari Mishra', t1_qual: 'Ph.D', t2: 'Deepak Kannaujiya', t2_qual: 'M.Tech, Ph.D' },
  { id: 31, course: 'B.Tech', branch: 'Civil', year: '4th Year', semester: 'Semester 7', t1: 'Neha Rajput', t1_qual: 'M.Tech (Pursuing Ph.D)', t2: 'Manisha Dwivedi', t2_qual: 'M.Tech' },
  { id: 32, course: 'B.Tech', branch: 'Biotech', year: '4th Year', semester: 'Semester 7', t1: 'Vikram Rastogi', t1_qual: 'Ph.D', t2: 'Aditya Bharti', t2_qual: 'M.Tech, Ph.D' },
  { id: 33, course: 'B.Tech', branch: 'CSE', year: '4th Year', semester: 'Semester 7', t1: 'Navya Pandey', t1_qual: 'M.Tech, Ph.D', t2: 'Diya Nigam', t2_qual: 'M.Tech (Pursuing Ph.D)' },
  { id: 34, course: 'B.Tech', branch: 'IT', year: '4th Year', semester: 'Semester 7', t1: 'Isha Awasthi', t1_qual: 'M.Tech (Pursuing Ph.D)', t2: 'Tanvi Sharma', t2_qual: 'M.Tech, Ph.D' },
  { id: 35, course: 'B.Tech', branch: 'AIML', year: '4th Year', semester: 'Semester 7', t1: 'Aadesh Jaiswal', t1_qual: 'M.Tech', t2: 'Anil Rajput', t2_qual: 'M.Tech (Pursuing Ph.D)' },
  { id: 36, course: 'B.Tech', branch: 'CSD', year: '4th Year', semester: 'Semester 7', t1: 'Arjun Prasad', t1_qual: 'Ph.D', t2: 'Anika Prasad', t2_qual: 'M.Tech (Pursuing Ph.D)' },

  // Diploma 18 Classes
  { id: 37, course: 'Diploma', branch: 'Civil', year: '1st Year', semester: 'Semester 1', t1: 'Sara Kannojia', t1_qual: 'B.Tech, M.Tech', t2: 'Abhishek Maurya', t2_qual: 'M.E.' },
  { id: 38, course: 'Diploma', branch: 'ME', year: '1st Year', semester: 'Semester 1', t1: 'Reyansh Verma', t1_qual: 'M.Tech', t2: 'Manish Srivastava', t2_qual: 'M.Tech' },
  { id: 39, course: 'Diploma', branch: 'IT', year: '1st Year', semester: 'Semester 1', t1: 'Manish Tiwari', t1_qual: 'Diploma, B.Tech, M.Tech', t2: 'Swati Tiwari', t2_qual: 'M.E.' },
  { id: 40, course: 'Diploma', branch: 'CS', year: '1st Year', semester: 'Semester 1', t1: 'Rahul Bharti', t1_qual: 'M.Tech', t2: 'Naveen Verma', t2_qual: 'M.Tech' },
  { id: 41, course: 'Diploma', branch: 'EE', year: '1st Year', semester: 'Semester 1', t1: 'Vikram Nigam', t1_qual: 'M.Tech', t2: 'Anjali Chaudhary', t2_qual: 'M.Tech' },
  { id: 42, course: 'Diploma', branch: 'EC', year: '1st Year', semester: 'Semester 1', t1: 'Ritu Pandey', t1_qual: 'Diploma, B.Tech, M.Tech', t2: 'Kunal Gupta', t2_qual: 'B.Tech, M.Tech' },
  { id: 43, course: 'Diploma', branch: 'Civil', year: '2nd Year', semester: 'Semester 3', t1: 'Saurabh Awasthi', t1_qual: 'M.E.', t2: 'Aadarsh Bharti', t2_qual: 'M.E.' },
  { id: 44, course: 'Diploma', branch: 'ME', year: '2nd Year', semester: 'Semester 3', t1: 'Mohit Bajpai', t1_qual: 'B.Tech, M.Tech', t2: 'Aditya Kumar', t2_qual: 'Diploma, B.Tech, M.Tech' },
  { id: 45, course: 'Diploma', branch: 'IT', year: '2nd Year', semester: 'Semester 3', t1: 'Aadarsh Prasad', t1_qual: 'M.E.', t2: 'Gaurav Shukla', t2_qual: 'B.Tech, M.Tech' },
  { id: 46, course: 'Diploma', branch: 'CS', year: '2nd Year', semester: 'Semester 3', t1: 'Sandeep Chauhan', t1_qual: 'M.E.', t2: 'Krishna Gupta', t2_qual: 'M.Tech' },
  { id: 47, course: 'Diploma', branch: 'EE', year: '2nd Year', semester: 'Semester 3', t1: 'Manisha Verma', t1_qual: 'M.E.', t2: 'Manish Yadav', t2_qual: 'B.Tech, M.Tech' },
  { id: 48, course: 'Diploma', branch: 'EC', year: '2nd Year', semester: 'Semester 3', t1: 'Riya Mishra', t1_qual: 'B.Tech, M.Tech', t2: 'Ayaan Dubey', t2_qual: 'M.Tech' },
  { id: 49, course: 'Diploma', branch: 'Civil', year: '3rd Year', semester: 'Semester 5', t1: 'Aadesh Agarwal', t1_qual: 'Diploma, B.Tech, M.Tech', t2: 'Vandana Bharti', t2_qual: 'M.E.' },
  { id: 50, course: 'Diploma', branch: 'ME', year: '3rd Year', semester: 'Semester 5', t1: 'Ankit Tripathi', t1_qual: 'M.E.', t2: 'Komal Gupta', t2_qual: 'M.Tech' },
  { id: 51, course: 'Diploma', branch: 'IT', year: '3rd Year', semester: 'Semester 5', t1: 'Sneha Awasthi', t1_qual: 'B.Tech, M.Tech', t2: 'Rekha Dwivedi', t2_qual: 'M.E.' },
  { id: 52, course: 'Diploma', branch: 'CS', year: '3rd Year', semester: 'Semester 5', t1: 'Deepak Shukla', t1_qual: 'Diploma, B.Tech, M.Tech', t2: 'Ritu Mishra', t2_qual: 'M.E.' },
  { id: 53, course: 'Diploma', branch: 'EE', year: '3rd Year', semester: 'Semester 5', t1: 'Manisha Yadav', t1_qual: 'B.Tech, M.Tech', t2: 'Arun Bajpai', t2_qual: 'B.Tech, M.Tech' },
  { id: 54, course: 'Diploma', branch: 'EC', year: '3rd Year', semester: 'Semester 5', t1: 'Manish Kannojia', t1_qual: 'M.Tech', t2: 'Vivaan Bajpai', t2_qual: 'M.Tech' },

  // MBA 10 Classes
  { id: 55, course: 'MBA', branch: 'Finance', year: '1st Year', semester: 'Semester 1', t1: 'Ruchi Prasad', t1_qual: 'MBA, Ph.D', t2: 'Kritika Shukla', t2_qual: 'M.Com, Ph.D' },
  { id: 56, course: 'MBA', branch: 'Marketing', year: '1st Year', semester: 'Semester 1', t1: 'Aditi Mishra', t1_qual: 'MBA, UGC-NET', t2: 'Ravi Kannojia', t2_qual: 'Ph.D (Management)' },
  { id: 57, course: 'MBA', branch: 'HR', year: '1st Year', semester: 'Semester 1', t1: 'Abhishek Jaiswal', t1_qual: 'M.Com, Ph.D', t2: 'Saurabh Mishra', t2_qual: 'M.Com, Ph.D' },
  { id: 58, course: 'MBA', branch: 'International Business', year: '1st Year', semester: 'Semester 1', t1: 'Nilesh Bajpai', t1_qual: 'M.Com, Ph.D', t2: 'Harsh Singh', t2_qual: 'MBA, UGC-NET' },
  { id: 59, course: 'MBA', branch: 'Business Analytics', year: '1st Year', semester: 'Semester 1', t1: 'Sandeep Tripathi', t1_qual: 'M.Com, Ph.D', t2: 'Kunal Mishra', t2_qual: 'MBA, Ph.D' },
  { id: 60, course: 'MBA', branch: 'Finance', year: '2nd Year', semester: 'Semester 3', t1: 'Nikhil Chauhan', t1_qual: 'MBA, Ph.D', t2: 'Meera Chauhan', t2_qual: 'MBA, Ph.D' },
  { id: 61, course: 'MBA', branch: 'Marketing', year: '2nd Year', semester: 'Semester 3', t1: 'Yash Nigam', t1_qual: 'Ph.D (Management)', t2: 'Simran Nigam', t2_qual: 'MBA, UGC-NET' },
  { id: 62, course: 'MBA', branch: 'HR', year: '2nd Year', semester: 'Semester 3', t1: 'Aditya Rawat', t1_qual: 'Ph.D (Management)', t2: 'Yash Rawat', t2_qual: 'Ph.D (Management)' },
  { id: 63, course: 'MBA', branch: 'International Business', year: '2nd Year', semester: 'Semester 3', t1: 'Ruchi Srivastava', t1_qual: 'M.Com, Ph.D', t2: 'Rahul Rawat', t2_qual: 'MBA, UGC-NET' },
  { id: 64, course: 'MBA', branch: 'Business Analytics', year: '2nd Year', semester: 'Semester 3', t1: 'Ruchi Rawat', t1_qual: 'MBA, Ph.D', t2: 'Divya Nigam', t2_qual: 'M.Com, MBA' }
];

async function runImport() {
  console.log('Starting Teacher & Class Import for RRIMT...');

  // 1. Fetch all students for RRIMT to get first student roll number per class
  const { data: students, error: studErr } = await supabase
    .from('students')
    .select('course, branch, year, semester, roll_no')
    .eq('college_id', college_id)
    .order('roll_no', { ascending: true });

  if (studErr) {
    console.error('Error fetching students:', studErr);
    return;
  }

  console.log(`Fetched ${students.length} students from Supabase.`);

  let createdClassesCount = 0;
  let createdTeachersCount = 0;
  let createdAuthCount = 0;

  for (const cls of classesData) {
    // Find students belonging to this class (course, branch, year)
    const classStudents = students.filter(s =>
      s.course === cls.course &&
      s.branch === cls.branch &&
      s.year === cls.year
    );

    if (classStudents.length === 0) {
      console.warn(`WARNING: No students found for class ${cls.course} ${cls.branch} ${cls.year}!`);
      continue;
    }

    // Pick first student's roll number sorted by roll_no ASC (prefer standard format like BT..., DP..., MB... if present)
    const stdStudents = classStudents.filter(s => /^(BT|DP|MB)/i.test(s.roll_no));
    const firstStudent = stdStudents.length > 0 ? stdStudents[0] : classStudents[0];
    const firstRoll = firstStudent.roll_no.toLowerCase().trim();

    console.log(`Class ${cls.id}: ${cls.course} ${cls.branch} ${cls.year} -> First student roll: ${firstRoll.toUpperCase()}`);

    const section = 'Section A';
    const className = `${cls.course} ${cls.branch} - ${cls.year} - ${section}`;

    // Teacher 1 credentials
    const t1_email = `teacher07${firstRoll}01@gmail.com`;
    const t1_pass = `07${firstRoll}01`;

    // Teacher 2 credentials
    const t2_email = `teacher07${firstRoll}02@gmail.com`;
    const t2_pass = `07${firstRoll}02`;

    // Upsert class into `classes` table
    const classId = `class_${cls.id}_${cls.course.toLowerCase().replace(/[^a-z0-9]/g,'')}_${cls.branch.toLowerCase().replace(/[^a-z0-9]/g,'')}_${cls.year.toLowerCase().replace(/[^a-z0-9]/g,'')}`;
    const { error: clsUpsertErr } = await supabase.from('classes').upsert({
      id: classId,
      college_id: college_id,
      course: cls.course,
      branch: cls.branch,
      year: cls.year,
      semester: cls.semester,
      section: section,
      name: className,
      teacher_name: `${cls.t1}, ${cls.t2}`,
      teacher_id: t1_email,
      room_no: `Room ${100 + cls.id}`,
      capacity: 60,
      created_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (clsUpsertErr) {
      console.error(`Error upserting class ${className}:`, clsUpsertErr);
    } else {
      createdClassesCount++;
    }

    // Create Teacher 1
    const t1_res = await createOrUpdateTeacher({
      name: cls.t1,
      qualification: cls.t1_qual,
      email: t1_email,
      password: t1_pass,
      course: cls.course,
      branch: cls.branch,
      assigned_classes: [className]
    });
    if (t1_res.success) createdTeachersCount++;
    if (t1_res.authCreated) createdAuthCount++;

    // Create Teacher 2
    const t2_res = await createOrUpdateTeacher({
      name: cls.t2,
      qualification: cls.t2_qual,
      email: t2_email,
      password: t2_pass,
      course: cls.course,
      branch: cls.branch,
      assigned_classes: [className]
    });
    if (t2_res.success) createdTeachersCount++;
    if (t2_res.authCreated) createdAuthCount++;
  }

  console.log('\n--- IMPORT SUMMARY ---');
  console.log(`Classes Created/Updated: ${createdClassesCount} / 64`);
  console.log(`Teachers Created/Updated: ${createdTeachersCount} / 128`);
  console.log(`Auth Accounts Created: ${createdAuthCount}`);
}

async function createOrUpdateTeacher({ name, qualification, email, password, course, branch, assigned_classes }) {
  try {
    // Call create_app_user RPC
    const rpcRes = await supabase.rpc('create_app_user', {
      p_email: email,
      p_password: password,
      p_role: 'teacher',
      p_college_id: college_id,
      p_name: name,
      p_phone: '',
      p_teacher_id: `TCH-${email.replace('@gmail.com','').toUpperCase()}`,
      p_extra_data: {
        course: course,
        department: branch,
        position: 'Assistant Professor',
        qualification: qualification,
        assigned_classes: assigned_classes
      }
    });

    if (rpcRes.error) {
      // If user already exists, update profile and teacher record directly
      if (rpcRes.error.message.includes('already exists')) {
        const { data: prof } = await supabase.from('profiles').select('id').eq('email', email).single();
        if (prof) {
          await supabase.from('teachers').upsert({
            id: prof.id,
            profile_id: prof.id,
            college_id: college_id,
            teacher_id: `TCH-${email.replace('@gmail.com','').toUpperCase()}`,
            name: name,
            email: email,
            course: course,
            department: branch,
            position: 'Assistant Professor',
            qualification: qualification,
            assigned_classes: assigned_classes,
            status: 'active'
          }, { onConflict: 'id' });
          return { success: true, authCreated: false };
        }
      }
      console.error(`RPC error for ${email}:`, rpcRes.error.message);
      return { success: false, authCreated: false };
    }

    return { success: true, authCreated: true };
  } catch (e) {
    console.error(`Exception creating teacher ${email}:`, e);
    return { success: false, authCreated: false };
  }
}

runImport().catch(console.error);
