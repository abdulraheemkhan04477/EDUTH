-- Migration: Rebuild Subject & Semester Architecture for Eduth Management System

-- 1. Create Semesters Table
CREATE TABLE IF NOT EXISTS public.semesters (
  id text PRIMARY KEY,
  college_id text NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  course text NOT NULL,
  name text NOT NULL,
  term text DEFAULT 'Odd',
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create Subject Branches Junction Table for Normalized Branch Mappings
CREATE TABLE IF NOT EXISTS public.subject_branches (
  id text PRIMARY KEY,
  subject_id text NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  branch_code text NOT NULL,
  branch_name text NOT NULL,
  college_id text NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Upgrade Subjects Table Columns
ALTER TABLE public.subjects
  ADD COLUMN IF NOT EXISTS subject_type text DEFAULT 'branch_specific',
  ADD COLUMN IF NOT EXISTS applicable_branches text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS type text DEFAULT 'Theory',
  ADD COLUMN IF NOT EXISTS credits numeric DEFAULT 4,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- 4. Enable RLS and Add Permissive Policies for Authenticated Users / Admins
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_branches ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'semesters_read_all') THEN
    CREATE POLICY semesters_read_all ON public.semesters FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'semesters_admin_manage') THEN
    CREATE POLICY semesters_admin_manage ON public.semesters FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'subject_branches_read_all') THEN
    CREATE POLICY subject_branches_read_all ON public.subject_branches FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'subject_branches_admin_manage') THEN
    CREATE POLICY subject_branches_admin_manage ON public.subject_branches FOR ALL USING (true);
  END IF;
END $$;

-- 5. Delete Old B.Tech and MBA Subjects
DELETE FROM public.subjects WHERE course IN ('B.Tech', 'MBA') OR course_name IN ('B.Tech', 'MBA');

-- 6. Insert Semesters for B.Tech & MBA across Colleges
INSERT INTO public.semesters (id, college_id, course, name, term, status)
SELECT c.id || '_btech_sem_' || num, c.id, 'B.Tech', s.name, s.term, 'active'
FROM public.colleges c
CROSS JOIN (
  VALUES 
    (1, '1st Semester', 'Odd'),
    (2, '2nd Semester', 'Even'),
    (3, '3rd Semester', 'Odd'),
    (4, '4th Semester', 'Even'),
    (5, '5th Semester', 'Odd'),
    (6, '6th Semester', 'Even'),
    (7, '7th Semester', 'Odd'),
    (8, '8th Semester', 'Even')
) AS s(num, name, term)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, term = EXCLUDED.term;

INSERT INTO public.semesters (id, college_id, course, name, term, status)
SELECT c.id || '_mba_sem_' || num, c.id, 'MBA', s.name, s.term, 'active'
FROM public.colleges c
CROSS JOIN (
  VALUES 
    (1, '1st Semester', 'Odd'),
    (2, '2nd Semester', 'Even'),
    (3, '3rd Semester', 'Odd'),
    (4, '4th Semester', 'Even')
) AS s(num, name, term)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, term = EXCLUDED.term;
