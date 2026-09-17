-- ====================================================================
-- SUPABASE RLS MIGRATION FOR TIMETABLE MODULE
-- Enforces Role-Based Access (Admin, Teacher, Student) & College Isolation
-- ====================================================================

-- 1. Ensure Table Structure Exists
CREATE TABLE IF NOT EXISTS public.timetable_entries (
  id TEXT PRIMARY KEY,
  college_id TEXT,
  class_id TEXT,
  day TEXT NOT NULL,
  period TEXT NOT NULL,
  start_period TEXT,
  end_period TEXT,
  start_period_num INT DEFAULT 1,
  end_period_num INT DEFAULT 1,
  start_time TEXT,
  end_time TEXT,
  subject TEXT NOT NULL,
  subject_name TEXT,
  subject_code TEXT,
  teacher_id TEXT,
  teacher_name TEXT,
  room_no TEXT,
  course TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  semester TEXT,
  section TEXT NOT NULL,
  entry_type TEXT DEFAULT 'Lecture',
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE,
  is_combined BOOLEAN DEFAULT FALSE,
  combined_sections JSONB DEFAULT '[]'::jsonb,
  coordinator_id TEXT,
  coordinator_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.timetable_configs (
  id TEXT PRIMARY KEY,
  college_id TEXT NOT NULL,
  course TEXT NOT NULL,
  year TEXT NOT NULL,
  periods_json JSONB DEFAULT '[]'::jsonb,
  days_json JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add missing columns safely if table already existed with older schema
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS class_id TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS start_period TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS end_period TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS start_period_num INT DEFAULT 1;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS end_period_num INT DEFAULT 1;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS end_time TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS subject_name TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS subject_code TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS teacher_id TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS teacher_name TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS room_no TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS semester TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'Lecture';
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS effective_from DATE;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS effective_to DATE;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS is_combined BOOLEAN DEFAULT FALSE;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS combined_sections JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS coordinator_id TEXT;
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS coordinator_name TEXT;

-- 3. Enable RLS on timetable tables
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_configs ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to ensure clean state
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
    AND LOWER(profiles.role) IN ('admin', 'super_admin')
    AND (
      profiles.college_id = timetable_entries.college_id
      OR timetable_entries.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
      OR profiles.role = 'super_admin'
    )
  )
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND LOWER(profiles.role) IN ('admin', 'super_admin')
    AND (
      profiles.college_id = timetable_entries.college_id
      OR timetable_entries.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
      OR profiles.role = 'super_admin'
    )
  )
);

-- Policy B: Teacher (Full CRUD access for assigned classes in own college)
CREATE POLICY "Timetable Entries Teacher Access"
ON public.timetable_entries
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.teachers t ON (
      t.profile_id = p.id
      OR LOWER(t.email) = LOWER(p.email)
      OR t.id::text = p.id::text
    )
    WHERE p.id = auth.uid()
    AND (LOWER(p.role) = 'teacher' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'teacher')
    AND (
      p.college_id = timetable_entries.college_id
      OR timetable_entries.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
      OR p.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
    )
    AND (
      -- 1. Direct period teacher assignment
      timetable_entries.teacher_id = t.id::text
      OR timetable_entries.teacher_id = p.id::text
      OR timetable_entries.teacher_name = t.name
      OR timetable_entries.teacher_name = p.name
      OR LOWER(timetable_entries.teacher_name) = LOWER(p.name)
      OR
      -- 2. Teacher is primary class teacher in public.classes
      EXISTS (
        SELECT 1 FROM public.classes c
        WHERE (c.college_id = timetable_entries.college_id OR c.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001'))
        AND (
          (timetable_entries.class_id IS NOT NULL AND c.id = timetable_entries.class_id)
          OR
          (
            c.course = timetable_entries.course
            AND c.branch = timetable_entries.branch
            AND (c.year = timetable_entries.year OR c.semester = timetable_entries.semester)
            AND c.section = timetable_entries.section
          )
        )
        AND (
          c.teacher_id = t.id::text
          OR c.teacher_id = p.id::text
          OR c.teacher_name = t.name
          OR c.teacher_name = p.name
        )
      )
      OR
      -- 3. Class matches teacher's assigned_classes on public.teachers
      EXISTS (
        SELECT 1 FROM public.classes c
        WHERE (c.college_id = timetable_entries.college_id OR c.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001'))
        AND (
          (timetable_entries.class_id IS NOT NULL AND c.id = timetable_entries.class_id)
          OR
          (
            c.course = timetable_entries.course
            AND c.branch = timetable_entries.branch
            AND (c.year = timetable_entries.year OR c.semester = timetable_entries.semester)
            AND c.section = timetable_entries.section
          )
        )
        AND (
          (t.assigned_classes IS NOT NULL AND (
            to_jsonb(t.assigned_classes) @> jsonb_build_array(c.id::text) OR
            to_jsonb(t.assigned_classes) @> jsonb_build_array(c.name::text) OR
            t.assigned_classes::text LIKE '%' || c.name || '%'
          ))
        )
      )
      OR
      -- 4. Fallback if teacher record has department or course matching
      (t.department = timetable_entries.branch OR t.course = timetable_entries.course)
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    LEFT JOIN public.teachers t ON (
      t.profile_id = p.id
      OR LOWER(t.email) = LOWER(p.email)
      OR t.id::text = p.id::text
    )
    WHERE p.id = auth.uid()
    AND (LOWER(p.role) = 'teacher' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'teacher')
    AND (
      p.college_id = timetable_entries.college_id
      OR timetable_entries.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
      OR p.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
    )
    AND (
      timetable_entries.teacher_id = t.id::text
      OR timetable_entries.teacher_id = p.id::text
      OR timetable_entries.teacher_name = t.name
      OR timetable_entries.teacher_name = p.name
      OR LOWER(timetable_entries.teacher_name) = LOWER(p.name)
      OR
      EXISTS (
        SELECT 1 FROM public.classes c
        WHERE (c.college_id = timetable_entries.college_id OR c.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001'))
        AND (
          (timetable_entries.class_id IS NOT NULL AND c.id = timetable_entries.class_id)
          OR
          (
            c.course = timetable_entries.course
            AND c.branch = timetable_entries.branch
            AND (c.year = timetable_entries.year OR c.semester = timetable_entries.semester)
            AND c.section = timetable_entries.section
          )
        )
        AND (
          c.teacher_id = t.id::text
          OR c.teacher_id = p.id::text
          OR c.teacher_name = t.name
          OR c.teacher_name = p.name
          OR (t.assigned_classes IS NOT NULL AND (
            to_jsonb(t.assigned_classes) @> jsonb_build_array(c.id::text) OR
            to_jsonb(t.assigned_classes) @> jsonb_build_array(c.name::text) OR
            t.assigned_classes::text LIKE '%' || c.name || '%'
          ))
        )
      )
      OR
      (t.department = timetable_entries.branch OR t.course = timetable_entries.course)
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
    LEFT JOIN public.students s ON (s.email = p.email OR s.id::text = p.id::text OR s.profile_id = p.id)
    WHERE p.id = auth.uid()
    AND (LOWER(p.role) = 'student' OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'student')
    AND (
      p.college_id = timetable_entries.college_id
      OR timetable_entries.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
      OR p.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
    )
    AND (
      (s.course = timetable_entries.course AND s.branch = timetable_entries.branch AND (s.semester = timetable_entries.semester OR s.year = timetable_entries.year) AND s.section = timetable_entries.section)
      OR
      (timetable_entries.class_id IS NOT NULL AND s.class_id = timetable_entries.class_id)
    )
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
    AND LOWER(profiles.role) IN ('admin', 'super_admin')
    AND (
      profiles.college_id = timetable_configs.college_id
      OR timetable_configs.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
      OR profiles.role = 'super_admin'
    )
  )
);

CREATE POLICY "Timetable Configs Read Access"
ON public.timetable_configs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND (
      profiles.college_id = timetable_configs.college_id
      OR timetable_configs.college_id IN ('13695a78-0105-4bde-bc85-d664bb66637e', 'COL001')
    )
  )
);

