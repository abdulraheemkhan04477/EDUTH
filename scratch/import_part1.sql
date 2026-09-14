
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

  -- Class 1: B.Tech ECE 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'ECE'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'ECE'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech ECE - 1st Year - Section A';
  v_class_id   := 'class_1_btech_ece_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'ECE', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Payal Rastogi, Ritu Kannaujiya', v_t1_email, 'Room ' || 101, 60, now()
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
      'Payal Rastogi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ECE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Payal Rastogi',
      qualification = 'M.Tech',
      course = 'B.Tech',
      department = 'ECE',
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
      'Ritu Kannaujiya',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ECE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ritu Kannaujiya',
      qualification = 'M.Tech',
      course = 'B.Tech',
      department = 'ECE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 2: B.Tech EE 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'EE'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'EE'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech EE - 1st Year - Section A';
  v_class_id   := 'class_2_btech_ee_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'EE', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Diya Yadav, Ira Srivastava', v_t1_email, 'Room ' || 102, 60, now()
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
      'Diya Yadav',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'EE',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Diya Yadav',
      qualification = 'M.E.',
      course = 'B.Tech',
      department = 'EE',
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
      'Ira Srivastava',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'EE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ira Srivastava',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'EE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 3: B.Tech ME 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'ME'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'ME'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech ME - 1st Year - Section A';
  v_class_id   := 'class_3_btech_me_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'ME', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Reyansh Awasthi, Isha Srivastava', v_t1_email, 'Room ' || 103, 60, now()
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
      'Reyansh Awasthi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ME',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Reyansh Awasthi',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'ME',
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
      'Isha Srivastava',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ME',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Isha Srivastava',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'ME',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 4: B.Tech Civil 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'Civil'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'Civil'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech Civil - 1st Year - Section A';
  v_class_id   := 'class_4_btech_civil_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'Civil', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Riya Mishra, Abhishek Kannaujiya', v_t1_email, 'Room ' || 104, 60, now()
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
      'Riya Mishra',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'Civil',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Riya Mishra',
      qualification = 'M.Tech',
      course = 'B.Tech',
      department = 'Civil',
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
      'Abhishek Kannaujiya',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'Civil',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Abhishek Kannaujiya',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'Civil',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 5: B.Tech Biotech 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'Biotech'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'Biotech'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech Biotech - 1st Year - Section A';
  v_class_id   := 'class_5_btech_biotech_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'Biotech', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Meera Maurya, Ayaan Rajput', v_t1_email, 'Room ' || 105, 60, now()
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
      'Meera Maurya',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'Biotech',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Meera Maurya',
      qualification = 'M.E.',
      course = 'B.Tech',
      department = 'Biotech',
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
      'Ayaan Rajput',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'Biotech',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ayaan Rajput',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'Biotech',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 6: B.Tech CSE 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'CSE'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'CSE'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech CSE - 1st Year - Section A';
  v_class_id   := 'class_6_btech_cse_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'CSE', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Deepak Mishra, Anika Sharma', v_t1_email, 'Room ' || 106, 60, now()
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
      'Deepak Mishra',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Deepak Mishra',
      qualification = 'M.Tech, Ph.D',
      course = 'B.Tech',
      department = 'CSE',
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
      'Anika Sharma',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSE',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Anika Sharma',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'CSE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 7: B.Tech IT 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'IT'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'IT'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech IT - 1st Year - Section A';
  v_class_id   := 'class_7_btech_it_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'IT', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Kiara Dwivedi, Manish Chaudhary', v_t1_email, 'Room ' || 107, 60, now()
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
      'Kiara Dwivedi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'IT',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Kiara Dwivedi',
      qualification = 'M.E.',
      course = 'B.Tech',
      department = 'IT',
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
      'Manish Chaudhary',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'IT',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Manish Chaudhary',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'IT',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 8: B.Tech AIML 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'AIML'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'AIML'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech AIML - 1st Year - Section A';
  v_class_id   := 'class_8_btech_aiml_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'AIML', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Krishna Nigam, Abhishek Dwivedi', v_t1_email, 'Room ' || 108, 60, now()
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
      'Krishna Nigam',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'AIML',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Krishna Nigam',
      qualification = 'M.Tech',
      course = 'B.Tech',
      department = 'AIML',
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
      'Abhishek Dwivedi',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'AIML',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Abhishek Dwivedi',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'AIML',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 9: B.Tech CSD 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'CSD'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'CSD'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech CSD - 1st Year - Section A';
  v_class_id   := 'class_9_btech_csd_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'CSD', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Anika Rajput, Ravi Yadav', v_t1_email, 'Room ' || 109, 60, now()
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
      'Anika Rajput',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSD',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Anika Rajput',
      qualification = 'M.E.',
      course = 'B.Tech',
      department = 'CSD',
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
      'Ravi Yadav',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSD',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ravi Yadav',
      qualification = 'M.E.',
      course = 'B.Tech',
      department = 'CSD',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 10: B.Tech ECE 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'ECE'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'ECE'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech ECE - 2nd Year - Section A';
  v_class_id   := 'class_10_btech_ece_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'ECE', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Ruchi Jaiswal, Ananya Jaiswal', v_t1_email, 'Room ' || 110, 60, now()
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
      'Ruchi Jaiswal',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ECE',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ruchi Jaiswal',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'ECE',
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
      'Ananya Jaiswal',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ECE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ananya Jaiswal',
      qualification = 'M.Tech',
      course = 'B.Tech',
      department = 'ECE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 11: B.Tech EE 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'EE'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'EE'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech EE - 2nd Year - Section A';
  v_class_id   := 'class_11_btech_ee_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'EE', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Ruchi Agarwal, Ravi Gupta', v_t1_email, 'Room ' || 111, 60, now()
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
      'Ruchi Agarwal',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'EE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ruchi Agarwal',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'EE',
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
      'Ravi Gupta',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'EE',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ravi Gupta',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'EE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 12: B.Tech ME 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'ME'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'ME'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech ME - 2nd Year - Section A';
  v_class_id   := 'class_12_btech_me_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'ME', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Rahul Bharti, Isha Shukla', v_t1_email, 'Room ' || 112, 60, now()
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
      'Rahul Bharti',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ME',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Rahul Bharti',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'ME',
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
      'Isha Shukla',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ME',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Isha Shukla',
      qualification = 'M.E.',
      course = 'B.Tech',
      department = 'ME',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 13: B.Tech Civil 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'Civil'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'Civil'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech Civil - 2nd Year - Section A';
  v_class_id   := 'class_13_btech_civil_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'Civil', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Shalini Nigam, Swati Kannaujiya', v_t1_email, 'Room ' || 113, 60, now()
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
      'Shalini Nigam',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'Civil',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Shalini Nigam',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'Civil',
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
      'Swati Kannaujiya',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'Civil',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Swati Kannaujiya',
      qualification = 'M.Tech, Ph.D',
      course = 'B.Tech',
      department = 'Civil',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 14: B.Tech Biotech 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'Biotech'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'Biotech'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech Biotech - 2nd Year - Section A';
  v_class_id   := 'class_14_btech_biotech_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'Biotech', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Kiara Singh, Manisha Bajpai', v_t1_email, 'Room ' || 114, 60, now()
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
      'Kiara Singh',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'Biotech',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Kiara Singh',
      qualification = 'M.E.',
      course = 'B.Tech',
      department = 'Biotech',
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
      'Manisha Bajpai',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'Biotech',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Manisha Bajpai',
      qualification = 'M.Tech, Ph.D',
      course = 'B.Tech',
      department = 'Biotech',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 15: B.Tech CSE 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'CSE'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'CSE'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech CSE - 2nd Year - Section A';
  v_class_id   := 'class_15_btech_cse_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'CSE', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Rajesh Prasad, Nisha Nigam', v_t1_email, 'Room ' || 115, 60, now()
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
      'Rajesh Prasad',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Rajesh Prasad',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'CSE',
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
      'Nisha Nigam',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSE',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Nisha Nigam',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'CSE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 16: B.Tech IT 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'IT'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'IT'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech IT - 2nd Year - Section A';
  v_class_id   := 'class_16_btech_it_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'IT', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Harsh Srivastava, Vikram Srivastava', v_t1_email, 'Room ' || 116, 60, now()
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
      'Harsh Srivastava',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'IT',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Harsh Srivastava',
      qualification = 'M.Tech, Ph.D',
      course = 'B.Tech',
      department = 'IT',
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
      'Vikram Srivastava',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'IT',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Vikram Srivastava',
      qualification = 'M.E.',
      course = 'B.Tech',
      department = 'IT',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


END $$;
