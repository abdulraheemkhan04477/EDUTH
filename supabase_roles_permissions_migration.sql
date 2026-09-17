-- ========================================================
-- EDUTH — ROLE & PERMISSION + TEACHER CLASS-SCOPED PERMISSIONS MIGRATION
-- Multi-Tenant Isolation (college_id) + Strictly 3 Roles (Admin, Teacher, Student)
-- NO USING(true), NO RLS disabling
-- ========================================================

-- 1. Create permission_overrides table for per-user / per-teacher permission overrides
CREATE TABLE IF NOT EXISTS public.permission_overrides (
  id TEXT PRIMARY KEY,
  college_id UUID NOT NULL,
  teacher_id TEXT NOT NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  allowed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unq_perm_override UNIQUE (college_id, teacher_id, module, action)
);

CREATE INDEX IF NOT EXISTS idx_perm_overrides_college_teacher ON public.permission_overrides(college_id, teacher_id);

-- Enable RLS on permission_overrides
ALTER TABLE public.permission_overrides ENABLE ROW LEVEL SECURITY;

-- Helper functions for Auth context
CREATE OR REPLACE FUNCTION auth_user_college_id() RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'college_id')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth_user_role() RETURNS TEXT AS $$
  SELECT COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', 'student');
$$ LANGUAGE sql STABLE;

-- RLS Policies for permission_overrides
DROP POLICY IF EXISTS "Admin manages permission overrides" ON public.permission_overrides;
CREATE POLICY "Admin manages permission overrides" ON public.permission_overrides
  FOR ALL
  USING (
    auth_user_role() IN ('admin', 'super_admin')
    AND (college_id = auth_user_college_id() OR auth_user_role() = 'super_admin')
  )
  WITH CHECK (
    auth_user_role() IN ('admin', 'super_admin')
    AND (college_id = auth_user_college_id() OR auth_user_role() = 'super_admin')
  );

DROP POLICY IF EXISTS "Teacher reads own permission overrides" ON public.permission_overrides;
CREATE POLICY "Teacher reads own permission overrides" ON public.permission_overrides
  FOR SELECT
  USING (
    auth_user_role() = 'teacher'
    AND college_id = auth_user_college_id()
    AND (teacher_id = auth.uid()::text OR teacher_id = (auth.jwt() -> 'user_metadata' ->> 'teacher_id'))
  );

-- ========================================================
-- 2. TEACHER ASSIGNED CLASS HELPER FUNCTION
-- Checks if a teacher is assigned to a target class_id
-- ========================================================
CREATE OR REPLACE FUNCTION is_teacher_assigned_to_class(p_teacher_profile_id text, p_class_id text)
RETURNS boolean AS $$
DECLARE
  v_assigned boolean := false;
  v_teacher_record RECORD;
BEGIN
  -- Get teacher record
  SELECT id, teacher_id, email, assigned_classes INTO v_teacher_record
  FROM public.teachers
  WHERE profile_id::text = p_teacher_profile_id OR id::text = p_teacher_profile_id OR teacher_id = p_teacher_profile_id;

  IF v_teacher_record IS NULL THEN
    RETURN false;
  END IF;

  -- 1. Check direct class teacher on public.classes
  IF EXISTS (
    SELECT 1 FROM public.classes
    WHERE id::text = p_class_id
    AND (
      teacher_id = v_teacher_record.teacher_id
      OR teacher_id = v_teacher_record.id::text
      OR teacher_id = v_teacher_record.email
    )
  ) THEN
    RETURN true;
  END IF;

  -- 2. Check class subjects assignment
  IF EXISTS (
    SELECT 1 FROM public.class_subjects
    WHERE class_id::text = p_class_id
    AND (
      teacher_id = v_teacher_record.teacher_id
      OR teacher_id = v_teacher_record.id::text
      OR teacher_id = v_teacher_record.email
    )
  ) THEN
    RETURN true;
  END IF;

  -- 3. Check assigned_classes JSONB array on teacher record
  IF v_teacher_record.assigned_classes IS NOT NULL AND jsonb_typeof(v_teacher_record.assigned_classes) = 'array' THEN
    IF v_teacher_record.assigned_classes @> jsonb_build_array(p_class_id) THEN
      RETURN true;
    END IF;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ========================================================
-- 3. RLS POLICIES FOR STUDENTS TABLE (ADMIN / TEACHER / STUDENT)
-- ========================================================
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin college student access" ON public.students;
CREATE POLICY "Admin college student access" ON public.students
  FOR ALL
  USING (
    auth_user_role() IN ('admin', 'super_admin')
    AND (college_id = auth_user_college_id() OR school_id = auth_user_college_id() OR auth_user_role() = 'super_admin')
  )
  WITH CHECK (
    auth_user_role() IN ('admin', 'super_admin')
    AND (college_id = auth_user_college_id() OR school_id = auth_user_college_id() OR auth_user_role() = 'super_admin')
  );

DROP POLICY IF EXISTS "Teacher assigned class student access" ON public.students;
CREATE POLICY "Teacher assigned class student access" ON public.students
  FOR ALL
  USING (
    auth_user_role() = 'teacher'
    AND (college_id = auth_user_college_id() OR school_id = auth_user_college_id())
    AND is_teacher_assigned_to_class(auth.uid()::text, class_id::text)
  )
  WITH CHECK (
    auth_user_role() = 'teacher'
    AND (college_id = auth_user_college_id() OR school_id = auth_user_college_id())
    AND is_teacher_assigned_to_class(auth.uid()::text, class_id::text)
  );

DROP POLICY IF EXISTS "Student own data access" ON public.students;
CREATE POLICY "Student own data access" ON public.students
  FOR SELECT
  USING (
    auth_user_role() = 'student'
    AND (profile_id = auth.uid() OR id::text = auth.uid()::text OR student_id = (auth.jwt() -> 'user_metadata' ->> 'student_id'))
  );

-- ========================================================
-- 4. SUMMARY OF MIGRATION
-- - NO USING(true)
-- - NO RLS disabling
-- - Single source of truth in Supabase
-- ========================================================
