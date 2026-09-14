
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

  -- Class 17: B.Tech AIML 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'AIML'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'AIML'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech AIML - 2nd Year - Section A';
  v_class_id   := 'class_17_btech_aiml_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'AIML', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Kritika Dubey, Yash Yadav', v_t1_email, 'Room ' || 117, 60, now()
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
      'Kritika Dubey',
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
      name = 'Kritika Dubey',
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
      'Yash Yadav',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
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
      name = 'Yash Yadav',
      qualification = 'M.Tech',
      course = 'B.Tech',
      department = 'AIML',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 18: B.Tech CSD 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'CSD'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'CSD'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech CSD - 2nd Year - Section A';
  v_class_id   := 'class_18_btech_csd_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'CSD', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Aditi Sharma, Arun Rajput', v_t1_email, 'Room ' || 118, 60, now()
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
      'Aditi Sharma',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSD',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Aditi Sharma',
      qualification = 'M.Tech',
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
      'Arun Rajput',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSD',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Arun Rajput',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'CSD',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 19: B.Tech ECE 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'ECE'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'ECE'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech ECE - 3rd Year - Section A';
  v_class_id   := 'class_19_btech_ece_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'ECE', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Kavita Singh, Neha Rajput', v_t1_email, 'Room ' || 119, 60, now()
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
      'Kavita Singh',
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
      name = 'Kavita Singh',
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
      'Neha Rajput',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ECE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Neha Rajput',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'ECE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 20: B.Tech EE 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'EE'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'EE'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech EE - 3rd Year - Section A';
  v_class_id   := 'class_20_btech_ee_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'EE', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Vikram Dwivedi, Naveen Bajpai', v_t1_email, 'Room ' || 120, 60, now()
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
      'Vikram Dwivedi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Vikram Dwivedi',
      qualification = 'Ph.D',
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
      'Naveen Bajpai',
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
      name = 'Naveen Bajpai',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'EE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 21: B.Tech ME 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'ME'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'ME'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech ME - 3rd Year - Section A';
  v_class_id   := 'class_21_btech_me_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'ME', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Mohit Pandey, Myra Nigam', v_t1_email, 'Room ' || 121, 60, now()
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
      'Mohit Pandey',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Mohit Pandey',
      qualification = 'Ph.D',
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
      'Myra Nigam',
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
      name = 'Myra Nigam',
      qualification = 'M.E.',
      course = 'B.Tech',
      department = 'ME',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 22: B.Tech Civil 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'Civil'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'Civil'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech Civil - 3rd Year - Section A';
  v_class_id   := 'class_22_btech_civil_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'Civil', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Preeti Awasthi, Aarav Kannojia', v_t1_email, 'Room ' || 122, 60, now()
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
      'Preeti Awasthi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Preeti Awasthi',
      qualification = 'M.Tech, Ph.D',
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
      'Aarav Kannojia',
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
      name = 'Aarav Kannojia',
      qualification = 'M.Tech, Ph.D',
      course = 'B.Tech',
      department = 'Civil',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 23: B.Tech Biotech 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'Biotech'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'Biotech'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech Biotech - 3rd Year - Section A';
  v_class_id   := 'class_23_btech_biotech_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'Biotech', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Naveen Bajpai, Amit Rajput', v_t1_email, 'Room ' || 123, 60, now()
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
      'Naveen Bajpai',
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
      name = 'Naveen Bajpai',
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
      'Amit Rajput',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'Biotech',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Amit Rajput',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'Biotech',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 24: B.Tech CSE 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'CSE'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'CSE'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech CSE - 3rd Year - Section A';
  v_class_id   := 'class_24_btech_cse_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'CSE', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Rajesh Dubey, Arjun Gupta', v_t1_email, 'Room ' || 124, 60, now()
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
      'Rajesh Dubey',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSE',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Rajesh Dubey',
      qualification = 'M.E.',
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
      'Arjun Gupta',
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
      name = 'Arjun Gupta',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'CSE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 25: B.Tech IT 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'IT'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'IT'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech IT - 3rd Year - Section A';
  v_class_id   := 'class_25_btech_it_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'IT', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Rahul Sharma, Manisha Saroj', v_t1_email, 'Room ' || 125, 60, now()
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
      'Rahul Sharma',
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
      name = 'Rahul Sharma',
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
      'Manisha Saroj',
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
      name = 'Manisha Saroj',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'IT',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 26: B.Tech AIML 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'AIML'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'AIML'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech AIML - 3rd Year - Section A';
  v_class_id   := 'class_26_btech_aiml_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'AIML', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Ravi Bajpai, Deepak Rastogi', v_t1_email, 'Room ' || 126, 60, now()
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
      'Ravi Bajpai',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'AIML',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ravi Bajpai',
      qualification = 'M.Tech, Ph.D',
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
      'Deepak Rastogi',
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
      name = 'Deepak Rastogi',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'AIML',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 27: B.Tech CSD 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'CSD'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'CSD'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech CSD - 3rd Year - Section A';
  v_class_id   := 'class_27_btech_csd_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'CSD', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Rohan Nigam, Naveen Dwivedi', v_t1_email, 'Room ' || 127, 60, now()
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
      'Rohan Nigam',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSD',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Rohan Nigam',
      qualification = 'M.Tech, Ph.D',
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
      'Naveen Dwivedi',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSD',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Naveen Dwivedi',
      qualification = 'M.Tech, Ph.D',
      course = 'B.Tech',
      department = 'CSD',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 28: B.Tech ECE 4th Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'ECE'
    AND year = '4th Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'ECE'
      AND year = '4th Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech ECE - 4th Year - Section A';
  v_class_id   := 'class_28_btech_ece_4thyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'ECE', '4th Year', 'Semester 7', 'Section A', v_class_name, 'Payal Srivastava, Aadesh Jaiswal', v_t1_email, 'Room ' || 128, 60, now()
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
      'Payal Srivastava',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ECE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Payal Srivastava',
      qualification = 'M.Tech, Ph.D',
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
      'Aadesh Jaiswal',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
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
      name = 'Aadesh Jaiswal',
      qualification = 'Ph.D',
      course = 'B.Tech',
      department = 'ECE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 29: B.Tech EE 4th Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'EE'
    AND year = '4th Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'EE'
      AND year = '4th Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech EE - 4th Year - Section A';
  v_class_id   := 'class_29_btech_ee_4thyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'EE', '4th Year', 'Semester 7', 'Section A', v_class_name, 'Yash Verma, Gaurav Srivastava', v_t1_email, 'Room ' || 129, 60, now()
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
      'Yash Verma',
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
      name = 'Yash Verma',
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
      'Gaurav Srivastava',
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
      name = 'Gaurav Srivastava',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'EE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 30: B.Tech ME 4th Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'ME'
    AND year = '4th Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'ME'
      AND year = '4th Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech ME - 4th Year - Section A';
  v_class_id   := 'class_30_btech_me_4thyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'ME', '4th Year', 'Semester 7', 'Section A', v_class_name, 'Pari Mishra, Deepak Kannaujiya', v_t1_email, 'Room ' || 130, 60, now()
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
      'Pari Mishra',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Pari Mishra',
      qualification = 'Ph.D',
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
      'Deepak Kannaujiya',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'ME',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Deepak Kannaujiya',
      qualification = 'M.Tech, Ph.D',
      course = 'B.Tech',
      department = 'ME',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 31: B.Tech Civil 4th Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'Civil'
    AND year = '4th Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'Civil'
      AND year = '4th Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech Civil - 4th Year - Section A';
  v_class_id   := 'class_31_btech_civil_4thyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'Civil', '4th Year', 'Semester 7', 'Section A', v_class_name, 'Neha Rajput, Manisha Dwivedi', v_t1_email, 'Room ' || 131, 60, now()
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
      'Neha Rajput',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Neha Rajput',
      qualification = 'M.Tech (Pursuing Ph.D)',
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
      'Manisha Dwivedi',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
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
      name = 'Manisha Dwivedi',
      qualification = 'M.Tech',
      course = 'B.Tech',
      department = 'Civil',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 32: B.Tech Biotech 4th Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'Biotech'
    AND year = '4th Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'Biotech'
      AND year = '4th Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech Biotech - 4th Year - Section A';
  v_class_id   := 'class_32_btech_biotech_4thyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'Biotech', '4th Year', 'Semester 7', 'Section A', v_class_name, 'Vikram Rastogi, Aditya Bharti', v_t1_email, 'Room ' || 132, 60, now()
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
      'Vikram Rastogi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Vikram Rastogi',
      qualification = 'Ph.D',
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
      'Aditya Bharti',
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
      name = 'Aditya Bharti',
      qualification = 'M.Tech, Ph.D',
      course = 'B.Tech',
      department = 'Biotech',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


END $$;
