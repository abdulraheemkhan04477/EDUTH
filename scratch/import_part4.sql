
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

  -- Class 49: Diploma Civil 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'Civil'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma Civil - 3rd Year - Section A';
  v_class_id   := 'class_49_diploma_civil_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'Civil', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Aadesh Agarwal, Vandana Bharti', v_t1_email, 'Room ' || 149, 60, now()
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
      'Aadesh Agarwal',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'Civil',
        'position', 'Assistant Professor',
        'qualification', 'Diploma, B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Aadesh Agarwal',
      qualification = 'Diploma, B.Tech, M.Tech',
      course = 'Diploma',
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
      'Vandana Bharti',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'Civil',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Vandana Bharti',
      qualification = 'M.E.',
      course = 'Diploma',
      department = 'Civil',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 50: Diploma ME 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'ME'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma ME - 3rd Year - Section A';
  v_class_id   := 'class_50_diploma_me_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'ME', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Ankit Tripathi, Komal Gupta', v_t1_email, 'Room ' || 150, 60, now()
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
      'Ankit Tripathi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'ME',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ankit Tripathi',
      qualification = 'M.E.',
      course = 'Diploma',
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
      'Komal Gupta',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'ME',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Komal Gupta',
      qualification = 'M.Tech',
      course = 'Diploma',
      department = 'ME',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 51: Diploma IT 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'IT'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma IT - 3rd Year - Section A';
  v_class_id   := 'class_51_diploma_it_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'IT', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Sneha Awasthi, Rekha Dwivedi', v_t1_email, 'Room ' || 151, 60, now()
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
      'Sneha Awasthi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'IT',
        'position', 'Assistant Professor',
        'qualification', 'B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Sneha Awasthi',
      qualification = 'B.Tech, M.Tech',
      course = 'Diploma',
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
      'Rekha Dwivedi',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'IT',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Rekha Dwivedi',
      qualification = 'M.E.',
      course = 'Diploma',
      department = 'IT',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 52: Diploma CS 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'CS'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
      AND branch = 'CS'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'Diploma CS - 3rd Year - Section A';
  v_class_id   := 'class_52_diploma_cs_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'CS', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Deepak Shukla, Ritu Mishra', v_t1_email, 'Room ' || 152, 60, now()
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
      'Deepak Shukla',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'CS',
        'position', 'Assistant Professor',
        'qualification', 'Diploma, B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Deepak Shukla',
      qualification = 'Diploma, B.Tech, M.Tech',
      course = 'Diploma',
      department = 'CS',
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
      'Ritu Mishra',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'CS',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ritu Mishra',
      qualification = 'M.E.',
      course = 'Diploma',
      department = 'CS',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 53: Diploma EE 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'EE'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma EE - 3rd Year - Section A';
  v_class_id   := 'class_53_diploma_ee_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'EE', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Manisha Yadav, Arun Bajpai', v_t1_email, 'Room ' || 153, 60, now()
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
      'Manisha Yadav',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'EE',
        'position', 'Assistant Professor',
        'qualification', 'B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Manisha Yadav',
      qualification = 'B.Tech, M.Tech',
      course = 'Diploma',
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
      'Arun Bajpai',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'EE',
        'position', 'Assistant Professor',
        'qualification', 'B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Arun Bajpai',
      qualification = 'B.Tech, M.Tech',
      course = 'Diploma',
      department = 'EE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 54: Diploma EC 3rd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'EC'
    AND year = '3rd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
      AND branch = 'EC'
      AND year = '3rd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'Diploma EC - 3rd Year - Section A';
  v_class_id   := 'class_54_diploma_ec_3rdyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'EC', '3rd Year', 'Semester 5', 'Section A', v_class_name, 'Manish Kannojia, Vivaan Bajpai', v_t1_email, 'Room ' || 154, 60, now()
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
      'Manish Kannojia',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'EC',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Manish Kannojia',
      qualification = 'M.Tech',
      course = 'Diploma',
      department = 'EC',
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
      'Vivaan Bajpai',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'EC',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Vivaan Bajpai',
      qualification = 'M.Tech',
      course = 'Diploma',
      department = 'EC',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 55: MBA Finance 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'Finance'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'Finance'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA Finance - 1st Year - Section A';
  v_class_id   := 'class_55_mba_finance_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'Finance', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Ruchi Prasad, Kritika Shukla', v_t1_email, 'Room ' || 155, 60, now()
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
      'Ruchi Prasad',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Finance',
        'position', 'Assistant Professor',
        'qualification', 'MBA, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ruchi Prasad',
      qualification = 'MBA, Ph.D',
      course = 'MBA',
      department = 'Finance',
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
      'Kritika Shukla',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Finance',
        'position', 'Assistant Professor',
        'qualification', 'M.Com, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Kritika Shukla',
      qualification = 'M.Com, Ph.D',
      course = 'MBA',
      department = 'Finance',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 56: MBA Marketing 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'Marketing'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'Marketing'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA Marketing - 1st Year - Section A';
  v_class_id   := 'class_56_mba_marketing_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'Marketing', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Aditi Mishra, Ravi Kannojia', v_t1_email, 'Room ' || 156, 60, now()
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
      'Aditi Mishra',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Marketing',
        'position', 'Assistant Professor',
        'qualification', 'MBA, UGC-NET',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Aditi Mishra',
      qualification = 'MBA, UGC-NET',
      course = 'MBA',
      department = 'Marketing',
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
      'Ravi Kannojia',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Marketing',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D (Management)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ravi Kannojia',
      qualification = 'Ph.D (Management)',
      course = 'MBA',
      department = 'Marketing',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 57: MBA HR 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'HR'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'HR'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA HR - 1st Year - Section A';
  v_class_id   := 'class_57_mba_hr_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'HR', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Abhishek Jaiswal, Saurabh Mishra', v_t1_email, 'Room ' || 157, 60, now()
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
      'Abhishek Jaiswal',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'HR',
        'position', 'Assistant Professor',
        'qualification', 'M.Com, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Abhishek Jaiswal',
      qualification = 'M.Com, Ph.D',
      course = 'MBA',
      department = 'HR',
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
      'Saurabh Mishra',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'HR',
        'position', 'Assistant Professor',
        'qualification', 'M.Com, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Saurabh Mishra',
      qualification = 'M.Com, Ph.D',
      course = 'MBA',
      department = 'HR',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 58: MBA International Business 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'International Business'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'International Business'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA International Business - 1st Year - Section A';
  v_class_id   := 'class_58_mba_internationalbusiness_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'International Business', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Nilesh Bajpai, Harsh Singh', v_t1_email, 'Room ' || 158, 60, now()
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
      'Nilesh Bajpai',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'International Business',
        'position', 'Assistant Professor',
        'qualification', 'M.Com, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Nilesh Bajpai',
      qualification = 'M.Com, Ph.D',
      course = 'MBA',
      department = 'International Business',
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
      'Harsh Singh',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'International Business',
        'position', 'Assistant Professor',
        'qualification', 'MBA, UGC-NET',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Harsh Singh',
      qualification = 'MBA, UGC-NET',
      course = 'MBA',
      department = 'International Business',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 59: MBA Business Analytics 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'Business Analytics'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'Business Analytics'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA Business Analytics - 1st Year - Section A';
  v_class_id   := 'class_59_mba_businessanalytics_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'Business Analytics', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Sandeep Tripathi, Kunal Mishra', v_t1_email, 'Room ' || 159, 60, now()
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
      'Sandeep Tripathi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Business Analytics',
        'position', 'Assistant Professor',
        'qualification', 'M.Com, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Sandeep Tripathi',
      qualification = 'M.Com, Ph.D',
      course = 'MBA',
      department = 'Business Analytics',
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
      'Kunal Mishra',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Business Analytics',
        'position', 'Assistant Professor',
        'qualification', 'MBA, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Kunal Mishra',
      qualification = 'MBA, Ph.D',
      course = 'MBA',
      department = 'Business Analytics',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 60: MBA Finance 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'Finance'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'Finance'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA Finance - 2nd Year - Section A';
  v_class_id   := 'class_60_mba_finance_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'Finance', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Nikhil Chauhan, Meera Chauhan', v_t1_email, 'Room ' || 160, 60, now()
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
      'Nikhil Chauhan',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Finance',
        'position', 'Assistant Professor',
        'qualification', 'MBA, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Nikhil Chauhan',
      qualification = 'MBA, Ph.D',
      course = 'MBA',
      department = 'Finance',
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
      'Meera Chauhan',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Finance',
        'position', 'Assistant Professor',
        'qualification', 'MBA, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Meera Chauhan',
      qualification = 'MBA, Ph.D',
      course = 'MBA',
      department = 'Finance',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 61: MBA Marketing 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'Marketing'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'Marketing'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA Marketing - 2nd Year - Section A';
  v_class_id   := 'class_61_mba_marketing_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'Marketing', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Yash Nigam, Simran Nigam', v_t1_email, 'Room ' || 161, 60, now()
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
      'Yash Nigam',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Marketing',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D (Management)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Yash Nigam',
      qualification = 'Ph.D (Management)',
      course = 'MBA',
      department = 'Marketing',
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
      'Simran Nigam',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Marketing',
        'position', 'Assistant Professor',
        'qualification', 'MBA, UGC-NET',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Simran Nigam',
      qualification = 'MBA, UGC-NET',
      course = 'MBA',
      department = 'Marketing',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 62: MBA HR 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'HR'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'HR'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA HR - 2nd Year - Section A';
  v_class_id   := 'class_62_mba_hr_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'HR', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Aditya Rawat, Yash Rawat', v_t1_email, 'Room ' || 162, 60, now()
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
      'Aditya Rawat',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'HR',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D (Management)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Aditya Rawat',
      qualification = 'Ph.D (Management)',
      course = 'MBA',
      department = 'HR',
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
      'Yash Rawat',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'HR',
        'position', 'Assistant Professor',
        'qualification', 'Ph.D (Management)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Yash Rawat',
      qualification = 'Ph.D (Management)',
      course = 'MBA',
      department = 'HR',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 63: MBA International Business 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'International Business'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'International Business'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA International Business - 2nd Year - Section A';
  v_class_id   := 'class_63_mba_internationalbusiness_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'International Business', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Ruchi Srivastava, Rahul Rawat', v_t1_email, 'Room ' || 163, 60, now()
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
      'Ruchi Srivastava',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'International Business',
        'position', 'Assistant Professor',
        'qualification', 'M.Com, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ruchi Srivastava',
      qualification = 'M.Com, Ph.D',
      course = 'MBA',
      department = 'International Business',
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
      'Rahul Rawat',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'International Business',
        'position', 'Assistant Professor',
        'qualification', 'MBA, UGC-NET',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Rahul Rawat',
      qualification = 'MBA, UGC-NET',
      course = 'MBA',
      department = 'International Business',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 64: MBA Business Analytics 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'MBA'
    AND branch = 'Business Analytics'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'MBA'
      AND branch = 'Business Analytics'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'MBA Business Analytics - 2nd Year - Section A';
  v_class_id   := 'class_64_mba_businessanalytics_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'MBA', 'Business Analytics', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Ruchi Rawat, Divya Nigam', v_t1_email, 'Room ' || 164, 60, now()
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
      'Ruchi Rawat',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Business Analytics',
        'position', 'Assistant Professor',
        'qualification', 'MBA, Ph.D',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ruchi Rawat',
      qualification = 'MBA, Ph.D',
      course = 'MBA',
      department = 'Business Analytics',
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
      'Divya Nigam',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'MBA',
        'department', 'Business Analytics',
        'position', 'Assistant Professor',
        'qualification', 'M.Com, MBA',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Divya Nigam',
      qualification = 'M.Com, MBA',
      course = 'MBA',
      department = 'Business Analytics',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


END $$;
