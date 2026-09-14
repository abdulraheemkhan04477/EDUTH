
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

  -- Class 33: B.Tech CSE 4th Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'CSE'
    AND year = '4th Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'CSE'
      AND year = '4th Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech CSE - 4th Year - Section A';
  v_class_id   := 'class_33_btech_cse_4thyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'CSE', '4th Year', 'Semester 7', 'Section A', v_class_name, 'Navya Pandey, Diya Nigam', v_t1_email, 'Room ' || 133, 60, now()
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
      'Navya Pandey',
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
      name = 'Navya Pandey',
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
      'Diya Nigam',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
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
      name = 'Diya Nigam',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'CSE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 34: B.Tech IT 4th Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'IT'
    AND year = '4th Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'IT'
      AND year = '4th Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech IT - 4th Year - Section A';
  v_class_id   := 'class_34_btech_it_4thyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'IT', '4th Year', 'Semester 7', 'Section A', v_class_name, 'Isha Awasthi, Tanvi Sharma', v_t1_email, 'Room ' || 134, 60, now()
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
      'Isha Awasthi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'IT',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Isha Awasthi',
      qualification = 'M.Tech (Pursuing Ph.D)',
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
      'Tanvi Sharma',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
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
      name = 'Tanvi Sharma',
      qualification = 'M.Tech, Ph.D',
      course = 'B.Tech',
      department = 'IT',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 35: B.Tech AIML 4th Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'AIML'
    AND year = '4th Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'AIML'
      AND year = '4th Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech AIML - 4th Year - Section A';
  v_class_id   := 'class_35_btech_aiml_4thyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'AIML', '4th Year', 'Semester 7', 'Section A', v_class_name, 'Aadesh Jaiswal, Anil Rajput', v_t1_email, 'Room ' || 135, 60, now()
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
      'Aadesh Jaiswal',
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
      name = 'Aadesh Jaiswal',
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
      'Anil Rajput',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'AIML',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Anil Rajput',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'AIML',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 36: B.Tech CSD 4th Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'B.Tech'
    AND branch = 'CSD'
    AND year = '4th Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'B.Tech'
      AND branch = 'CSD'
      AND year = '4th Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'B.Tech CSD - 4th Year - Section A';
  v_class_id   := 'class_36_btech_csd_4thyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'B.Tech', 'CSD', '4th Year', 'Semester 7', 'Section A', v_class_name, 'Arjun Prasad, Anika Prasad', v_t1_email, 'Room ' || 136, 60, now()
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
      'Arjun Prasad',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Arjun Prasad',
      qualification = 'Ph.D',
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
      'Anika Prasad',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'B.Tech',
        'department', 'CSD',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech (Pursuing Ph.D)',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Anika Prasad',
      qualification = 'M.Tech (Pursuing Ph.D)',
      course = 'B.Tech',
      department = 'CSD',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 37: Diploma Civil 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'Civil'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma Civil - 1st Year - Section A';
  v_class_id   := 'class_37_diploma_civil_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'Civil', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Sara Kannojia, Abhishek Maurya', v_t1_email, 'Room ' || 137, 60, now()
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
      'Sara Kannojia',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'Civil',
        'position', 'Assistant Professor',
        'qualification', 'B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Sara Kannojia',
      qualification = 'B.Tech, M.Tech',
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
      'Abhishek Maurya',
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
      name = 'Abhishek Maurya',
      qualification = 'M.E.',
      course = 'Diploma',
      department = 'Civil',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 38: Diploma ME 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'ME'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma ME - 1st Year - Section A';
  v_class_id   := 'class_38_diploma_me_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'ME', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Reyansh Verma, Manish Srivastava', v_t1_email, 'Room ' || 138, 60, now()
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
      'Reyansh Verma',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Reyansh Verma',
      qualification = 'M.Tech',
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
      'Manish Srivastava',
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
      name = 'Manish Srivastava',
      qualification = 'M.Tech',
      course = 'Diploma',
      department = 'ME',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 39: Diploma IT 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'IT'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma IT - 1st Year - Section A';
  v_class_id   := 'class_39_diploma_it_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'IT', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Manish Tiwari, Swati Tiwari', v_t1_email, 'Room ' || 139, 60, now()
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
      'Manish Tiwari',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'IT',
        'position', 'Assistant Professor',
        'qualification', 'Diploma, B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Manish Tiwari',
      qualification = 'Diploma, B.Tech, M.Tech',
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
      'Swati Tiwari',
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
      name = 'Swati Tiwari',
      qualification = 'M.E.',
      course = 'Diploma',
      department = 'IT',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 40: Diploma CS 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'CS'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
      AND branch = 'CS'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'Diploma CS - 1st Year - Section A';
  v_class_id   := 'class_40_diploma_cs_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'CS', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Rahul Bharti, Naveen Verma', v_t1_email, 'Room ' || 140, 60, now()
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
        'course', 'Diploma',
        'department', 'CS',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Rahul Bharti',
      qualification = 'M.Tech',
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
      'Naveen Verma',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'CS',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Naveen Verma',
      qualification = 'M.Tech',
      course = 'Diploma',
      department = 'CS',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 41: Diploma EE 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'EE'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma EE - 1st Year - Section A';
  v_class_id   := 'class_41_diploma_ee_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'EE', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Vikram Nigam, Anjali Chaudhary', v_t1_email, 'Room ' || 141, 60, now()
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
      'Vikram Nigam',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'EE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Vikram Nigam',
      qualification = 'M.Tech',
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
      'Anjali Chaudhary',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'EE',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Anjali Chaudhary',
      qualification = 'M.Tech',
      course = 'Diploma',
      department = 'EE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 42: Diploma EC 1st Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'EC'
    AND year = '1st Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
      AND branch = 'EC'
      AND year = '1st Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'Diploma EC - 1st Year - Section A';
  v_class_id   := 'class_42_diploma_ec_1styear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'EC', '1st Year', 'Semester 1', 'Section A', v_class_name, 'Ritu Pandey, Kunal Gupta', v_t1_email, 'Room ' || 142, 60, now()
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
      'Ritu Pandey',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'EC',
        'position', 'Assistant Professor',
        'qualification', 'Diploma, B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Ritu Pandey',
      qualification = 'Diploma, B.Tech, M.Tech',
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
      'Kunal Gupta',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'EC',
        'position', 'Assistant Professor',
        'qualification', 'B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Kunal Gupta',
      qualification = 'B.Tech, M.Tech',
      course = 'Diploma',
      department = 'EC',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 43: Diploma Civil 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'Civil'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma Civil - 2nd Year - Section A';
  v_class_id   := 'class_43_diploma_civil_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'Civil', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Saurabh Awasthi, Aadarsh Bharti', v_t1_email, 'Room ' || 143, 60, now()
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
      'Saurabh Awasthi',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Saurabh Awasthi',
      qualification = 'M.E.',
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
      'Aadarsh Bharti',
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
      name = 'Aadarsh Bharti',
      qualification = 'M.E.',
      course = 'Diploma',
      department = 'Civil',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 44: Diploma ME 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'ME'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma ME - 2nd Year - Section A';
  v_class_id   := 'class_44_diploma_me_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'ME', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Mohit Bajpai, Aditya Kumar', v_t1_email, 'Room ' || 144, 60, now()
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
      'Mohit Bajpai',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'ME',
        'position', 'Assistant Professor',
        'qualification', 'B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Mohit Bajpai',
      qualification = 'B.Tech, M.Tech',
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
      'Aditya Kumar',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'ME',
        'position', 'Assistant Professor',
        'qualification', 'Diploma, B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Aditya Kumar',
      qualification = 'Diploma, B.Tech, M.Tech',
      course = 'Diploma',
      department = 'ME',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 45: Diploma IT 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'IT'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma IT - 2nd Year - Section A';
  v_class_id   := 'class_45_diploma_it_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'IT', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Aadarsh Prasad, Gaurav Shukla', v_t1_email, 'Room ' || 145, 60, now()
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
      'Aadarsh Prasad',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Aadarsh Prasad',
      qualification = 'M.E.',
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
      'Gaurav Shukla',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
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
      name = 'Gaurav Shukla',
      qualification = 'B.Tech, M.Tech',
      course = 'Diploma',
      department = 'IT',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 46: Diploma CS 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'CS'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
      AND branch = 'CS'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'Diploma CS - 2nd Year - Section A';
  v_class_id   := 'class_46_diploma_cs_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'CS', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Sandeep Chauhan, Krishna Gupta', v_t1_email, 'Room ' || 146, 60, now()
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
      'Sandeep Chauhan',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
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
      name = 'Sandeep Chauhan',
      qualification = 'M.E.',
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
      'Krishna Gupta',
      '',
      'TCH-' || upper(replace(v_t2_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'CS',
        'position', 'Assistant Professor',
        'qualification', 'M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Krishna Gupta',
      qualification = 'M.Tech',
      course = 'Diploma',
      department = 'CS',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 47: Diploma EE 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'EE'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
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
  v_class_name := 'Diploma EE - 2nd Year - Section A';
  v_class_id   := 'class_47_diploma_ee_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'EE', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Manisha Verma, Manish Yadav', v_t1_email, 'Room ' || 147, 60, now()
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
      'Manisha Verma',
      '',
      'TCH-' || upper(replace(v_t1_email, '@gmail.com', '')),
      NULL, NULL, NULL,
      jsonb_build_object(
        'course', 'Diploma',
        'department', 'EE',
        'position', 'Assistant Professor',
        'qualification', 'M.E.',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Manisha Verma',
      qualification = 'M.E.',
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
      'Manish Yadav',
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
      name = 'Manish Yadav',
      qualification = 'B.Tech, M.Tech',
      course = 'Diploma',
      department = 'EE',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


  -- Class 48: Diploma EC 2nd Year
  SELECT roll_no INTO v_first_roll
  FROM public.students
  WHERE college_id = v_college_id
    AND course = 'Diploma'
    AND branch = 'EC'
    AND year = '2nd Year'
    AND (roll_no ~* '^(BT|DP|MB)')
  ORDER BY roll_no ASC
  LIMIT 1;

  IF v_first_roll IS NULL THEN
    SELECT roll_no INTO v_first_roll
    FROM public.students
    WHERE college_id = v_college_id
      AND course = 'Diploma'
      AND branch = 'EC'
      AND year = '2nd Year'
    ORDER BY roll_no ASC
    LIMIT 1;
  END IF;

  v_first_roll := lower(trim(v_first_roll));
  v_t1_email := 'teacher07' || v_first_roll || '01@gmail.com';
  v_t1_pass  := '07' || v_first_roll || '01';
  v_t2_email := 'teacher07' || v_first_roll || '02@gmail.com';
  v_t2_pass  := '07' || v_first_roll || '02';
  v_class_name := 'Diploma EC - 2nd Year - Section A';
  v_class_id   := 'class_48_diploma_ec_2ndyear';

  -- Upsert Class
  INSERT INTO public.classes (
    id, college_id, course, branch, year, semester, section, name, teacher_name, teacher_id, room_no, capacity, created_at
  ) VALUES (
    v_class_id, v_college_id, 'Diploma', 'EC', '2nd Year', 'Semester 3', 'Section A', v_class_name, 'Riya Mishra, Ayaan Dubey', v_t1_email, 'Room ' || 148, 60, now()
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
        'course', 'Diploma',
        'department', 'EC',
        'position', 'Assistant Professor',
        'qualification', 'B.Tech, M.Tech',
        'assigned_classes', jsonb_build_array(v_class_name)
      )
    );
  ELSE
    UPDATE public.teachers SET
      name = 'Riya Mishra',
      qualification = 'B.Tech, M.Tech',
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
      'Ayaan Dubey',
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
      name = 'Ayaan Dubey',
      qualification = 'M.Tech',
      course = 'Diploma',
      department = 'EC',
      assigned_classes = jsonb_build_array(v_class_name)
    WHERE lower(email) = v_t2_email;
  END IF;


END $$;
