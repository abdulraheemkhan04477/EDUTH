-- ====================================================================
-- SUPABASE RLS MIGRATION FOR TIMETABLE MODULE
-- Enforces Role-Based Access (Admin, Teacher, Student) & College Isolation
-- ====================================================================

-- 1. Enable RLS on timetable tables
ALTER TABLE IF EXISTS public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.timetable_configs ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Timetable Entries Admin Full Access" ON public.timetable_entries;
DROP POLICY IF EXISTS "Timetable Entries Teacher Access" ON public.timetable_entries;
DROP POLICY IF EXISTS "Timetable Entries Student Access" ON public.timetable_entries;
DROP POLICY IF EXISTS "Timetable Configs Admin Full Access" ON public.timetable_configs;
DROP POLICY IF EXISTS "Timetable Configs Read Access" ON public.timetable_configs;

-- ====================================================================
-- TIMETABLE ENTRIES POLICIES
-- ====================================================================

-- Policy A: Admin & Super Admin (Full CRUD for entries in own college)
CREATE POLICY "Timetable Entries Admin Full Access"
ON public.timetable_entries
FOR ALL
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
    AND (profiles.college_id = timetable_entries.college_id OR profiles.role = 'super_admin')
  )
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
    AND (profiles.college_id = timetable_entries.college_id OR profiles.role = 'super_admin')
  )
);

-- Policy B: Teacher (Access only for assigned classes in own college)
CREATE POLICY "Timetable Entries Teacher Access"
ON public.timetable_entries
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.teachers t ON (t.email = p.email OR t.id::text = p.teacher_id)
    WHERE p.id = auth.uid()
    AND p.role = 'teacher'
    AND p.college_id = timetable_entries.college_id
    AND (
      -- Teacher is directly assigned to this timetable entry
      timetable_entries.teacher_id = t.teacher_id
      OR timetable_entries.teacher_id = t.id::text
      OR timetable_entries.teacher_name = t.name
      OR
      -- Or the class matches teacher's assigned_classes
      EXISTS (
        SELECT 1 FROM public.classes c
        WHERE c.college_id = timetable_entries.college_id
        AND c.course = timetable_entries.course
        AND c.branch = timetable_entries.branch
        AND c.semester = timetable_entries.semester
        AND c.section = timetable_entries.section
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
    AND p.college_id = timetable_entries.college_id
    AND (
      timetable_entries.teacher_id = t.teacher_id
      OR timetable_entries.teacher_id = t.id::text
      OR timetable_entries.teacher_name = t.name
      OR
      EXISTS (
        SELECT 1 FROM public.classes c
        WHERE c.college_id = timetable_entries.college_id
        AND c.course = timetable_entries.course
        AND c.branch = timetable_entries.branch
        AND c.semester = timetable_entries.semester
        AND c.section = timetable_entries.section
        AND (c.teacher_id = t.teacher_id OR c.teacher_id = t.id::text OR c.teacher_name = t.name)
      )
    )
  )
);

-- Policy C: Student (SELECT read-only access for own enrolled class)
CREATE POLICY "Timetable Entries Student Access"
ON public.timetable_entries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.students s ON (s.email = p.email OR s.id::text = p.student_id)
    WHERE p.id = auth.uid()
    AND p.role = 'student'
    AND p.college_id = timetable_entries.college_id
    AND s.course = timetable_entries.course
    AND s.branch = timetable_entries.branch
    AND (s.semester = timetable_entries.semester OR s.year = timetable_entries.year)
    AND s.section = timetable_entries.section
  )
);

-- ====================================================================
-- TIMETABLE CONFIGS POLICIES
-- ====================================================================

CREATE POLICY "Timetable Configs Admin Full Access"
ON public.timetable_configs
FOR ALL
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin')
    AND (profiles.college_id = timetable_configs.college_id OR profiles.role = 'super_admin')
  )
);

CREATE POLICY "Timetable Configs Read Access"
ON public.timetable_configs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.college_id = timetable_configs.college_id
  )
);
