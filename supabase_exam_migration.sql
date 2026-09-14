-- ============================================================
-- EDUTH COLLEGE MANAGEMENT SYSTEM
-- TEST & EXAM MODULE MIGRATION & RLS SECURITY FIXES
-- Target Supabase Database: jgadivbsvztsppdnzctp
-- ============================================================

-- 1. ENHANCE 'exams' TABLE
ALTER TABLE public.exams 
  ADD COLUMN IF NOT EXISTS academic_session TEXT DEFAULT '2026-2027',
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. ENHANCE 'exam_subjects' TABLE
ALTER TABLE public.exam_subjects 
  ADD COLUMN IF NOT EXISTS start_time TEXT DEFAULT '09:30 AM',
  ADD COLUMN IF NOT EXISTS end_time TEXT DEFAULT '12:30 PM',
  ADD COLUMN IF NOT EXISTS room_number TEXT,
  ADD COLUMN IF NOT EXISTS passing_marks NUMERIC DEFAULT 40,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. ENHANCE 'results' TABLE
ALTER TABLE public.results 
  ADD COLUMN IF NOT EXISTS grade_point NUMERIC,
  ADD COLUMN IF NOT EXISTS remarks TEXT,
  ADD COLUMN IF NOT EXISTS percentage NUMERIC,
  ADD COLUMN IF NOT EXISTS entered_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES auth.users(id);

-- Add unique constraint on results to prevent duplicate mark entries per (college, exam, student, subject)
DO $$
BEGIN
  ALTER TABLE public.results DROP CONSTRAINT IF EXISTS unique_student_exam_subject;
  ALTER TABLE public.results DROP CONSTRAINT IF EXISTS unique_results_per_student_subject;

  ALTER TABLE public.results 
    ADD CONSTRAINT unique_student_exam_subject UNIQUE (college_id, exam_id, student_id, subject);
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- 4. CREATE PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_exams_college_course ON public.exams (college_id, course, branch, year, semester);
CREATE INDEX IF NOT EXISTS idx_exam_subjects_exam ON public.exam_subjects (exam_id);
CREATE INDEX IF NOT EXISTS idx_results_lookup ON public.results (college_id, exam_id, student_id, is_published);
CREATE INDEX IF NOT EXISTS idx_results_student ON public.results (student_id);

-- 5. FIX RLS SECURITY VULNERABILITIES FOR EXAMS, EXAM_SUBJECTS, AND RESULTS

-- Enable RLS explicitly
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Drop insecure/outdated policies on results
DROP POLICY IF EXISTS "results_select" ON public.results;
DROP POLICY IF EXISTS "results_manage" ON public.results;
DROP POLICY IF EXISTS "results_admin_manage" ON public.results;
DROP POLICY IF EXISTS "results_teacher_manage" ON public.results;
DROP POLICY IF EXISTS "results_student_select" ON public.results;
DROP POLICY IF EXISTS "results_parent_select" ON public.results;
DROP POLICY IF EXISTS "Results Admin Full Access" ON public.results;
DROP POLICY IF EXISTS "Results Teacher Access" ON public.results;
DROP POLICY IF EXISTS "Results Student Access" ON public.results;
DROP POLICY IF EXISTS "Results Parent Access" ON public.results;

-- Create robust results policies
-- (a) Admin & Super Admin full access
CREATE POLICY "results_admin_manage" ON public.results
  FOR ALL
  TO authenticated
  USING (
    (auth_user_role() = 'super_admin') 
    OR ((auth_user_role() = 'admin') AND (college_id = auth_user_college_id() OR auth_is_user_college(college_id)))
  )
  WITH CHECK (
    (auth_user_role() = 'super_admin') 
    OR ((auth_user_role() = 'admin') AND (college_id = auth_user_college_id() OR auth_is_user_college(college_id)))
  );

-- (b) Teacher access for entering marks & managing results in assigned college
CREATE POLICY "results_teacher_manage" ON public.results
  FOR ALL
  TO authenticated
  USING (
    (auth_user_role() = 'teacher')
    AND (college_id = auth_user_college_id() OR auth_is_user_college(college_id))
    AND (
      entered_by::text = auth.uid()::text
      OR ((course IS NULL OR course = '' OR course = 'all') OR auth_is_teacher_assigned_student(course, branch, year, section, college_id))
    )
  )
  WITH CHECK (
    (auth_user_role() = 'teacher')
    AND (college_id = auth_user_college_id() OR auth_is_user_college(college_id))
  );

-- (c) Student access: ONLY row matching student's ID/roll_no AND ONLY IF published
CREATE POLICY "results_student_select" ON public.results
  FOR SELECT
  TO authenticated
  USING (
    (auth_user_role() = 'student')
    AND (college_id = auth_user_college_id() OR auth_is_user_college(college_id))
    AND (is_published = true OR published = true)
    AND (
      student_id = auth_user_student_id() 
      OR roll_no = auth_user_student_id()
      OR ('STU-' || roll_no) = auth_user_student_id()
      OR student_id::text = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM public.students s
        WHERE (s.profile_id = auth.uid() OR s.id::text = auth.uid()::text OR lower(s.email) = (SELECT lower(p.email) FROM public.profiles p WHERE p.id = auth.uid()))
          AND (
            s.id::text = results.student_id 
            OR s.roll_no = results.student_id 
            OR s.roll_no = results.roll_no 
            OR ('STU-' || s.roll_no) = results.student_id
            OR ('STU-' || s.roll_no) = results.roll_no
          )
      )
    )
  );

-- (d) Parent access: ONLY row matching linked child student's ID/roll_no AND ONLY IF published
CREATE POLICY "results_parent_select" ON public.results
  FOR SELECT
  TO authenticated
  USING (
    (auth_user_role() = 'parent')
    AND (college_id = auth_user_college_id() OR auth_is_user_college(college_id))
    AND (is_published = true OR published = true)
    AND (
      student_id = auth_user_student_id() 
      OR roll_no = auth_user_student_id()
      OR ('STU-' || roll_no) = auth_user_student_id()
      OR EXISTS (
        SELECT 1 FROM public.students s
        JOIN public.profiles p ON (
          s.id::text = p.child_student_id
          OR s.roll_no = p.child_student_id
          OR lower(s.parent_email) = lower(p.email)
        )
        WHERE p.id = auth.uid()
          AND (
            s.id::text = results.student_id 
            OR s.roll_no = results.student_id 
            OR s.roll_no = results.roll_no 
            OR ('STU-' || s.roll_no) = results.student_id
            OR ('STU-' || s.roll_no) = results.roll_no
          )
      )
    )
  );

-- Drop insecure/outdated policies on exams
DROP POLICY IF EXISTS "exams_select" ON public.exams;
DROP POLICY IF EXISTS "exams_manage" ON public.exams;
DROP POLICY IF EXISTS "exams_admin_manage" ON public.exams;
DROP POLICY IF EXISTS "exams_read_all" ON public.exams;

CREATE POLICY "exams_admin_manage" ON public.exams
  FOR ALL
  TO authenticated
  USING (
    (auth_user_role() = 'super_admin') 
    OR ((auth_user_role() = 'admin') AND auth_is_user_college(college_id))
    OR ((auth_user_role() = 'teacher') AND auth_is_user_college(college_id))
  )
  WITH CHECK (
    (auth_user_role() = 'super_admin') 
    OR ((auth_user_role() = 'admin') AND auth_is_user_college(college_id))
    OR ((auth_user_role() = 'teacher') AND auth_is_user_college(college_id))
  );

CREATE POLICY "exams_read_all" ON public.exams
  FOR SELECT
  TO authenticated
  USING (
    (auth_user_role() = 'super_admin') 
    OR auth_is_user_college(college_id)
  );

-- Drop insecure/outdated policies on exam_subjects
DROP POLICY IF EXISTS "exam_subjects_select" ON public.exam_subjects;
DROP POLICY IF EXISTS "exam_subjects_manage" ON public.exam_subjects;
DROP POLICY IF EXISTS "exam_subjects_admin_manage" ON public.exam_subjects;
DROP POLICY IF EXISTS "exam_subjects_read_all" ON public.exam_subjects;

CREATE POLICY "exam_subjects_admin_manage" ON public.exam_subjects
  FOR ALL
  TO authenticated
  USING (
    (auth_user_role() = 'super_admin') 
    OR ((auth_user_role() = 'admin') AND auth_is_user_college(college_id))
    OR ((auth_user_role() = 'teacher') AND auth_is_user_college(college_id))
  );

CREATE POLICY "exam_subjects_read_all" ON public.exam_subjects
  FOR SELECT
  TO authenticated
  USING (
    (auth_user_role() = 'super_admin') 
    OR auth_is_user_college(college_id)
  );
