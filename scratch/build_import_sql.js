import fs from 'fs';

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

function sqlStr(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function generatePartSql(startIdx, endIdx) {
  let sql = `
DO $$
DECLARE
  v_college_id TEXT := '13695a78-0105-4bde-bc85-d664bb66637e';
  v_first_roll TEXT;
  v_t1_email TEXT;
  v_t1_pass TEXT;
  v_t2_email TEXT;
  v_t2_pass TEXT;
  v_class_id TEXT;
  v_class_name TEXT;
  v_dummy_id UUID;
BEGIN
`;

  for (let i = startIdx; i <= endIdx; i++) {
    const cls = classesData[i - 1];
    const classId = `class_${cls.id}_${cls.course.toLowerCase().replace(/[^a-z0-9]/g,'')}_${cls.branch.toLowerCase().replace(/[^a-z0-9]/g,'')}_${cls.year.toLowerCase().replace(/[^a-z0-9]/g,'')}`;
    const className = `${cls.course} ${cls.branch} - ${cls.year} - Section A`;

    sql += `
  -- Class ${cls.id}: ${cls.course} ${cls.branch} ${cls.year}
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = ${sqlStr(cls.course)}
    AND branch = ${sqlStr(cls.branch)}
    AND year = ${sqlStr(cls.year)}
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = ${sqlStr(cls.course)}
      AND branch = ${sqlStr(cls.branch)}
      AND year = ${sqlStr(cls.year)}
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := ${sqlStr(className)};
  v_class_id   := ${sqlStr(classId)};

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, ${sqlStr(cls.course)}, ${sqlStr(cls.branch)}, ${sqlStr(cls.year)}, ${sqlStr(cls.semester)}, 'Section A', v_class_name, ${sqlStr(cls.t1 + ', ' + cls.t2)}, v_t1_email, 'Room ' || ${100 + cls.id}, 60, now()
  ) ON CONFLICT (id) DO UPDATE SET
    college_id = EXCLUDED.college_id,
    course = EXCLUDED.course,
    branch = EXCLUDED.branch,
    year = EXCLUDED.year,
    semester = EXCLUDED.semester,
    section = EXCLUDED.section,
    name = EXCLUDED.name,
    teacher_name = EXCLUDED.teacher_name,
    teacher_id = EXCLUDED.teacher_id;

  -- Create Teacher 1
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = v_t1_email) THEN
    PERFORM public.create_app_user(
      v_t1_email,
      v_t1_pass,
      'teacher',
      v_college_id,
      ${sqlStr(cls.t1)},
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', ${sqlStr(cls.course)},
        'department', ${sqlStr(cls.branch)},
        'position', 'Assistant Professor',
        'qualification', ${sqlStr(cls.t1_qual)},
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = ${sqlStr(cls.t1)},
      qualification = ${sqlStr(cls.t1_qual)},
      course = ${sqlStr(cls.course)},
      department = ${sqlStr(cls.branch)},
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t1_email;
  END IF;

  -- Create Teacher 2
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = v_t2_email) THEN
    PERFORM public.create_app_user(
      v_t2_email,
      v_t2_pass,
      'teacher',
      v_college_id,
      ${sqlStr(cls.t2)},
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', ${sqlStr(cls.course)},
        'department', ${sqlStr(cls.branch)},
        'position', 'Assistant Professor',
        'qualification', ${sqlStr(cls.t2_qual)},
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = ${sqlStr(cls.t2)},
      qualification = ${sqlStr(cls.t2_qual)},
      course = ${sqlStr(cls.course)},
      department = ${sqlStr(cls.branch)},
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;

`;
  }

  sql += `
END $$;
`;
  return sql;
}

fs.writeFileSync('scratch/import_part1.sql', generatePartSql(1, 16));
fs.writeFileSync('scratch/import_part2.sql', generatePartSql(17, 32));
fs.writeFileSync('scratch/import_part3.sql', generatePartSql(33, 48));
fs.writeFileSync('scratch/import_part4.sql', generatePartSql(49, 64));
console.log('Generated 4 SQL part files successfully!');


