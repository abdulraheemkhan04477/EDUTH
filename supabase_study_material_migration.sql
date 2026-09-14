-- Migration: Study Material Module Schema, Storage Bucket, and RLS Policies
-- Date: 2026-09-08

-- 1. Ensure columns exist on study_materials
ALTER TABLE public.study_materials ADD COLUMN IF NOT EXISTS year text;
ALTER TABLE public.study_materials ADD COLUMN IF NOT EXISTS section text DEFAULT 'All';
ALTER TABLE public.study_materials ADD COLUMN IF NOT EXISTS uploaded_by_role text;

-- 2. Create storage bucket for study materials if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-materials',
  'study-materials',
  true,
  52428800,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Enable RLS on study_materials
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "study_materials_manage" ON public.study_materials;
DROP POLICY IF EXISTS "study_materials_select" ON public.study_materials;
DROP POLICY IF EXISTS "study_materials_super_admin" ON public.study_materials;
DROP POLICY IF EXISTS "study_materials_admin" ON public.study_materials;
DROP POLICY IF EXISTS "study_materials_teacher_all" ON public.study_materials;
DROP POLICY IF EXISTS "study_materials_student_select" ON public.study_materials;
DROP POLICY IF EXISTS "study_materials_parent_select" ON public.study_materials;

-- Super Admin Policy
CREATE POLICY "study_materials_super_admin" ON public.study_materials
FOR ALL TO authenticated
USING (auth_user_role() = 'super_admin')
WITH CHECK (auth_user_role() = 'super_admin');

-- Admin Policy
CREATE POLICY "study_materials_admin" ON public.study_materials
FOR ALL TO authenticated
USING (auth_user_role() = 'admin' AND college_id = auth_user_college_id())
WITH CHECK (auth_user_role() = 'admin' AND college_id = auth_user_college_id());

-- Teacher Policy (Select all in college, create in college, update/delete own)
CREATE POLICY "study_materials_teacher_select" ON public.study_materials
FOR SELECT TO authenticated
USING (auth_user_role() = 'teacher' AND college_id = auth_user_college_id());

CREATE POLICY "study_materials_teacher_insert" ON public.study_materials
FOR INSERT TO authenticated
WITH CHECK (auth_user_role() = 'teacher' AND college_id = auth_user_college_id());

CREATE POLICY "study_materials_teacher_update_delete" ON public.study_materials
FOR ALL TO authenticated
USING (
  auth_user_role() = 'teacher' 
  AND college_id = auth_user_college_id() 
  AND (uploaded_by = auth.uid()::text OR uploader = (SELECT name FROM public.profiles WHERE id = auth.uid() LIMIT 1))
);

-- Student Policy (Select in college)
CREATE POLICY "study_materials_student_select" ON public.study_materials
FOR SELECT TO authenticated
USING (auth_user_role() = 'student' AND college_id = auth_user_college_id());

-- Parent Policy (Select in college)
CREATE POLICY "study_materials_parent_select" ON public.study_materials
FOR SELECT TO authenticated
USING (auth_user_role() = 'parent' AND college_id = auth_user_college_id());

-- 4. Storage Objects RLS Policies for study-materials bucket
DROP POLICY IF EXISTS "Allow authenticated download study materials" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin/teacher upload study materials" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin/teacher update/delete study materials" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read study materials" ON storage.objects;

CREATE POLICY "Allow public read study materials" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'study-materials');

CREATE POLICY "Allow admin/teacher upload study materials" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'study-materials'
  AND (auth_user_role() IN ('admin', 'teacher', 'super_admin'))
);

CREATE POLICY "Allow admin/teacher update/delete study materials" ON storage.objects
FOR ALL TO authenticated
USING (
  bucket_id = 'study-materials'
  AND (auth_user_role() IN ('admin', 'teacher', 'super_admin'))
);
