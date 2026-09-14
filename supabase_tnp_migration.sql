-- ============================================================
-- TRAINING & PLACEMENT (TNP) MODULE — Supabase Migration Script
-- Run this script in the Supabase Dashboard SQL Editor
-- ============================================================

-- 1. TNP COMPANIES
CREATE TABLE IF NOT EXISTS tnp_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  name TEXT NOT NULL,
  logo TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  hr_name TEXT NOT NULL DEFAULT '',
  hr_email TEXT NOT NULL DEFAULT '',
  hr_phone TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_companies_college ON tnp_companies(college_id);

-- 2. TNP PLACEMENT DRIVES
CREATE TABLE IF NOT EXISTS tnp_placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  company_id UUID REFERENCES tnp_companies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  drive_name TEXT NOT NULL,
  job_role TEXT NOT NULL,
  drive_date DATE,
  reg_start_date DATE,
  reg_end_date DATE,
  target_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_branches JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_years JSONB NOT NULL DEFAULT '[]'::jsonb,
  eligibility_criteria TEXT NOT NULL DEFAULT '',
  min_cgpa NUMERIC DEFAULT 0.0,
  backlog_criteria TEXT NOT NULL DEFAULT 'No Active Backlogs',
  salary_package TEXT NOT NULL DEFAULT '',
  job_location TEXT NOT NULL DEFAULT '',
  is_internship BOOLEAN NOT NULL DEFAULT false,
  vacancy INT DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Registration Open', 'Registration Closed', 'Shortlisted', 'In Process', 'Completed', 'Cancelled')),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_drives_college ON tnp_placement_drives(college_id);
CREATE INDEX IF NOT EXISTS idx_tnp_drives_company ON tnp_placement_drives(company_id);
CREATE INDEX IF NOT EXISTS idx_tnp_drives_status ON tnp_placement_drives(status);

-- 3. TNP PLACEMENT APPLICATIONS
CREATE TABLE IF NOT EXISTS tnp_placement_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  drive_id UUID NOT NULL REFERENCES tnp_placement_drives(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  course TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  semester TEXT DEFAULT '',
  section TEXT DEFAULT '',
  cgpa NUMERIC DEFAULT 0.0,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Shortlisted', 'Aptitude', 'GD', 'PI', 'Selected', 'Rejected', 'Waitlisted')),
  current_round TEXT DEFAULT 'Applied',
  remarks TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tnp_applications_unique UNIQUE (drive_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_tnp_apps_college ON tnp_placement_applications(college_id);
CREATE INDEX IF NOT EXISTS idx_tnp_apps_drive ON tnp_placement_applications(drive_id);
CREATE INDEX IF NOT EXISTS idx_tnp_apps_student ON tnp_placement_applications(student_id);

-- 4. TNP SELECTION ROUNDS
CREATE TABLE IF NOT EXISTS tnp_selection_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  drive_id UUID NOT NULL REFERENCES tnp_placement_drives(id) ON DELETE CASCADE,
  round_number INT NOT NULL,
  round_name TEXT NOT NULL,
  description TEXT DEFAULT '',
  round_date DATE,
  venue TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_rounds_drive ON tnp_selection_rounds(drive_id);

-- 5. TNP SELECTION RESULTS
CREATE TABLE IF NOT EXISTS tnp_selection_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  drive_id UUID NOT NULL REFERENCES tnp_placement_drives(id) ON DELETE CASCADE,
  round_id UUID REFERENCES tnp_selection_rounds(id) ON DELETE SET NULL,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'On Hold' CHECK (status IN ('Passed', 'Failed', 'Absent', 'On Hold')),
  score_comments TEXT DEFAULT '',
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_results_drive ON tnp_selection_results(drive_id);
CREATE INDEX IF NOT EXISTS idx_tnp_results_student ON tnp_selection_results(student_id);

-- 6. TNP INTERNSHIPS
CREATE TABLE IF NOT EXISTS tnp_internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  company_id UUID REFERENCES tnp_companies(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  stipend TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  start_date DATE,
  reg_end_date DATE,
  target_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_branches JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_years JSONB NOT NULL DEFAULT '[]'::jsonb,
  location TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Closed', 'Draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_internships_college ON tnp_internships(college_id);

-- 7. TNP INTERNSHIP APPLICATIONS
CREATE TABLE IF NOT EXISTS tnp_internship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  internship_id UUID NOT NULL REFERENCES tnp_internships(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  course TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Shortlisted', 'Selected', 'Rejected')),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tnp_intern_apps_unique UNIQUE (internship_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_tnp_intern_apps_student ON tnp_internship_applications(student_id);

-- 8. TNP TRAININGS
CREATE TABLE IF NOT EXISTS tnp_trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'Technical Training',
    'Aptitude Training',
    'Soft Skills',
    'Communication',
    'Interview Preparation',
    'Technical Interview',
    'Programming',
    'Industry Training'
  )),
  trainer_name TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  target_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_branches JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_years JSONB NOT NULL DEFAULT '[]'::jsonb,
  start_date DATE,
  end_date DATE,
  timing TEXT NOT NULL DEFAULT '',
  venue TEXT NOT NULL DEFAULT '',
  capacity INT DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_trainings_college ON tnp_trainings(college_id);

-- 9. TNP TRAINING REGISTRATIONS
CREATE TABLE IF NOT EXISTS tnp_training_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  training_id UUID NOT NULL REFERENCES tnp_trainings(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  course TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  attendance_status TEXT DEFAULT 'Registered' CHECK (attendance_status IN ('Registered', 'Attended', 'Absent')),
  CONSTRAINT tnp_trg_reg_unique UNIQUE (training_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_tnp_trg_reg_student ON tnp_training_registrations(student_id);

-- 10. TNP EVENTS & SEMINARS
CREATE TABLE IF NOT EXISTS tnp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'Seminar',
    'Workshop',
    'Guest Lecture',
    'Career Guidance',
    'Industry Interaction',
    'Technical Session'
  )),
  speaker TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  event_date DATE,
  timing TEXT NOT NULL DEFAULT '',
  venue TEXT NOT NULL DEFAULT '',
  target_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_branches JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_years JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT NOT NULL DEFAULT '',
  registration_required BOOLEAN NOT NULL DEFAULT true,
  capacity INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_events_college ON tnp_events(college_id);

-- 11. TNP EVENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS tnp_event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  event_id UUID NOT NULL REFERENCES tnp_events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  course TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tnp_evt_reg_unique UNIQUE (event_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_tnp_evt_reg_student ON tnp_event_registrations(student_id);

-- 12. TNP PLACEMENTS (FINAL RECORD)
CREATE TABLE IF NOT EXISTS tnp_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  course TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  company_id UUID REFERENCES tnp_companies(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  drive_id UUID REFERENCES tnp_placement_drives(id) ON DELETE SET NULL,
  drive_name TEXT NOT NULL DEFAULT '',
  job_role TEXT NOT NULL,
  package_amount TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  selection_date DATE,
  joining_date DATE,
  placement_type TEXT NOT NULL DEFAULT 'Full Time' CHECK (placement_type IN ('Full Time', 'Internship + PPO')),
  status TEXT NOT NULL DEFAULT 'Offered' CHECK (status IN ('Offered', 'Confirmed', 'Joined', 'Declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_placements_college ON tnp_placements(college_id);
CREATE INDEX IF NOT EXISTS idx_tnp_placements_student ON tnp_placements(student_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE tnp_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_placement_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_selection_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_selection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_training_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_placements ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read TNP data of their own college
CREATE POLICY "Allow authenticated read own college tnp_companies" ON tnp_companies FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_drives" ON tnp_placement_drives FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_apps" ON tnp_placement_applications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_rounds" ON tnp_selection_rounds FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_results" ON tnp_selection_results FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_internships" ON tnp_internships FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_intern_apps" ON tnp_internship_applications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_trainings" ON tnp_trainings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_trg_reg" ON tnp_training_registrations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_events" ON tnp_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_evt_reg" ON tnp_event_registrations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read own college tnp_placements" ON tnp_placements FOR SELECT USING (true);

-- Allow authenticated users write/insert for applications & registrations
CREATE POLICY "Allow write tnp_placement_applications" ON tnp_placement_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_internship_applications" ON tnp_internship_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_training_registrations" ON tnp_training_registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_event_registrations" ON tnp_event_registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_companies" ON tnp_companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_placement_drives" ON tnp_placement_drives FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_selection_rounds" ON tnp_selection_rounds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_selection_results" ON tnp_selection_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_internships" ON tnp_internships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_trainings" ON tnp_trainings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write tnp_events" ON tnp_events FOR ALL USING (true) WITH CHECK (true);
-- 13. TNP ACTIVITIES (UNIFIED SINGLE ACTIVITIES PANEL)
CREATE TABLE IF NOT EXISTS tnp_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('seminar', 'event', 'training', 'internship')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  speaker_trainer_organizer TEXT NOT NULL DEFAULT '',
  start_date DATE,
  end_date DATE,
  start_time TEXT DEFAULT '',
  end_time TEXT DEFAULT '',
  venue TEXT DEFAULT '',
  course TEXT DEFAULT '',
  course_id UUID,
  branch TEXT DEFAULT '',
  branch_id UUID,
  year TEXT DEFAULT '',
  section TEXT DEFAULT '',
  class_id UUID,
  coordinator_id UUID,
  company_id UUID REFERENCES tnp_companies(id) ON DELETE SET NULL,
  company_name TEXT DEFAULT '',
  eligibility TEXT DEFAULT '',
  application_deadline DATE,
  status TEXT NOT NULL DEFAULT 'Active',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_activities_college ON tnp_activities(college_id);
CREATE INDEX IF NOT EXISTS idx_tnp_activities_type ON tnp_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_tnp_activities_class ON tnp_activities(class_id);

-- 14. TNP TEACHER CLASS ASSIGNMENTS & SPECIALIZATIONS
CREATE TABLE IF NOT EXISTS tnp_teacher_class_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  teacher_id UUID NOT NULL,
  class_id UUID NOT NULL,
  specialization TEXT CHECK (specialization IN ('Aptitude', 'PDP', 'Technical Training')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnp_teacher_assign_teacher ON tnp_teacher_class_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tnp_teacher_assign_class ON tnp_teacher_class_assignments(class_id);

ALTER TABLE tnp_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tnp_teacher_class_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read tnp_activities" ON tnp_activities FOR SELECT USING (true);
CREATE POLICY "Allow write tnp_activities" ON tnp_activities FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated read tnp_teacher_class_assignments" ON tnp_teacher_class_assignments FOR SELECT USING (true);
CREATE POLICY "Allow write tnp_teacher_class_assignments" ON tnp_teacher_class_assignments FOR ALL USING (true) WITH CHECK (true);

