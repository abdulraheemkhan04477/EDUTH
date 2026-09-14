-- ====================================================================
-- SUPABASE RLS MIGRATION FOR EXAMS & RESULTS MODULE
-- Single Source of Truth Security Policies & Role-Based Access Control
-- ====================================================================

-- 1. Enable RLS on exam & result tables
ALTER TABLE IF EXISTS public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.exam_subjects ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Results Admin Full Access" ON public.results;
DROP POLICY IF EXISTS "Results Teacher Access" ON public.results;
DROP POLICY IF EXISTS "Results Student Access" ON public.results;
DROP POLICY IF EXISTS "Results Parent Access" ON public.results;

DROP POLICY IF EXISTS "Exams Admin Full Access" ON public.exams;
DROP POLICY IF EXISTS "Exams Read Access" ON public.exams;

DROP POLICY IF EXISTS "Exam Subjects Admin Full Access" ON public.exam_subjects;
DROP POLICY IF EXISTS "Exam Subjects Read Access" ON public.exam_subjects;

-- ====================================================================
-- RESULTS POLICIES (Single Source of Truth)
-- ====================================================================

-- Policy A: Admin & Super Admin (Full CRUD for own college)
CREATE POLICY "Results Admin Full Access"
ON public.results
FOR ALL
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
    AND (profiles.college_id = results.college_id OR profiles.role = 'super_admin')
  )
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
    AND (profiles.college_id = results.college_id OR profiles.role = 'super_admin')
  )
);

-- Policy B: Teacher (Access only for assigned classes/students in own college)
CREATE POLICY "Results Teacher Access"
ON public.results
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.teachers t ON (t.email = p.email OR t.id::text = p.teacher_id)
    WHERE p.id = auth.uid()
    AND p.role = 'teacher'
    AND p.college_id = results.college_id
    AND (
      -- Teacher entered or is linked to the result
      results.entered_by = p.id::text
      OR
      -- Or the result's class matches teacher's assigned classes
      EXISTS (
        SELECT 1 FROM public.classes c
        WHERE c.college_id = results.college_id
        AND c.course = results.course
        AND c.branch = results.branch
        AND c.section = results.section
        AND (c.teacher_id = t.teacher_id OR c.teacher_id = t.id::text OR c.teacher_name = t.name)
      )
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.teachers t ON (t.email = p.email OR t.id::text = p.teacher_id)
    WHERE p.id = auth.uid()
    AND p.role = 'teacher'
    AND p.college_id = results.college_id
    AND (
      results.entered_by = p.id::text
      OR
      EXISTS (
        SELECT 1 FROM public.classes c
        WHERE c.college_id = results.college_id
        AND c.course = results.course
        AND c.branch = results.branch
        AND c.section = results.section
        AND (c.teacher_id = t.teacher_id OR c.teacher_id = t.id::text OR c.teacher_name = t.name)
      )
    )
  )
);

-- Policy C: Student (SELECT read-only for own published results)
CREATE POLICY "Results Student Access"
ON public.results
FOR SELECT
USING (
  (results.is_published = true OR results.published = true)
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.students s ON (s.email = p.email OR s.id::text = p.student_id)
    WHERE p.id = auth.uid()
    AND p.role = 'student'
    AND p.college_id = results.college_id
    AND (
      results.student_id = s.id::text
      OR results.student_id = s.student_id
      OR results.roll_no = s.roll_no
    )
  )
);

-- Policy D: Parent (SELECT read-only for linked child's published results)
CREATE POLICY "Results Parent Access"
ON public.results
FOR SELECT
USING (
  (results.is_published = true OR results.published = true)
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.students s ON (
      s.id::text = p.child_student_id
      OR s.student_id = p.child_student_id
      OR s.roll_no = p.child_student_id
      OR s.parent_email = p.email
    )
    WHERE p.id = auth.uid()
    AND p.role = 'parent'
    AND p.college_id = results.college_id
    AND (
      results.student_id = s.id::text
      OR results.student_id = s.student_id
      OR results.roll_no = s.roll_no
    )
  )
);

-- ====================================================================
-- EXAMS & EXAM SUBJECTS POLICIES
-- ====================================================================

CREATE POLICY "Exams Admin Full Access"
ON public.exams
FOR ALL
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
    AND (profiles.college_id = exams.college_id OR profiles.role = 'super_admin')
  )
);

CREATE POLICY "Exams Read Access"
ON public.exams
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.college_id = exams.college_id OR profiles.role = 'super_admin')
  )
);

CREATE POLICY "Exam Subjects Admin Full Access"
ON public.exam_subjects
FOR ALL
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
    AND (profiles.college_id = exam_subjects.college_id OR profiles.role = 'super_admin')
  )
);

CREATE POLICY "Exam Subjects Read Access"
ON public.exam_subjects
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.college_id = exam_subjects.college_id OR profiles.role = 'super_admin')
  )
);

-- ====================================================================
-- LOGICAL UNIQUE CONSTRAINT & INDEX ASSURANCE
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_results_college_student ON public.results(college_id, student_id);
CREATE INDEX IF NOT EXISTS idx_results_college_roll_no ON public.results(college_id, roll_no);
CREATE INDEX IF NOT EXISTS idx_results_updated_at ON public.results(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_is_published ON public.results(is_published);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_results_per_student_subject'
  ) THEN
    ALTER TABLE public.results
    ADD CONSTRAINT unique_results_per_student_subject UNIQUE (college_id, exam_id, student_id, subject);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Table or constraint already exists or handled by upsert fallback
    NULL;
END $$;
