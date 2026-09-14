-- ============================================================
-- FEES MODULE — Supabase Migration Script
-- Run this in the Supabase Dashboard SQL Editor
-- ============================================================

-- ============================================================
-- 1. ENSURE fee_structures TABLE EXISTS WITH CORRECT SCHEMA
-- ============================================================
CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  title TEXT NOT NULL,
  course TEXT NOT NULL DEFAULT 'B.Tech',
  branch TEXT NOT NULL DEFAULT 'ECE',
  year_semester TEXT NOT NULL DEFAULT '1st Year',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  installments JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add columns if they don't exist (safe for existing tables)
DO $$ BEGIN
  ALTER TABLE fee_structures ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
  ALTER TABLE fee_structures ADD COLUMN IF NOT EXISTS created_by UUID;
  ALTER TABLE fee_structures ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================================
-- 2. CREATE student_fees TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS student_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  student_id UUID NOT NULL,
  fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL DEFAULT '',
  roll_no TEXT NOT NULL DEFAULT '',
  course TEXT NOT NULL DEFAULT 'B.Tech',
  branch TEXT NOT NULL DEFAULT 'ECE',
  year_semester TEXT NOT NULL DEFAULT '1st Year',
  section TEXT NOT NULL DEFAULT 'Section A',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  due_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'due' CHECK (status IN ('paid', 'partial', 'due')),
  installments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT student_fees_unique UNIQUE (student_id, fee_structure_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_student_fees_college ON student_fees(college_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_student ON student_fees(student_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_structure ON student_fees(fee_structure_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_status ON student_fees(status);

-- ============================================================
-- 3. ENSURE fee_payments TABLE EXISTS WITH CORRECT SCHEMA
-- ============================================================
CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL,
  student_id UUID NOT NULL,
  student_fee_id UUID REFERENCES student_fees(id) ON DELETE SET NULL,
  fee_structure_id UUID REFERENCES fee_structures(id) ON DELETE SET NULL,
  receipt_no TEXT NOT NULL DEFAULT '',
  student_name TEXT NOT NULL DEFAULT '',
  roll_no TEXT NOT NULL DEFAULT '',
  course TEXT NOT NULL DEFAULT 'B.Tech',
  branch TEXT NOT NULL DEFAULT 'ECE',
  year_semester TEXT NOT NULL DEFAULT '1st Year',
  installment_id TEXT,
  installment_name TEXT,
  amount NUMERIC NOT NULL DEFAULT 0 CHECK (amount > 0),
  payment_method TEXT NOT NULL DEFAULT 'Cash',
  transaction_id TEXT NOT NULL DEFAULT '',
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  remarks TEXT,
  status TEXT NOT NULL DEFAULT 'Completed',
  received_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add columns if they don't exist (safe for existing tables)
DO $$ BEGIN
  ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS student_fee_id UUID REFERENCES student_fees(id) ON DELETE SET NULL;
  ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS received_by UUID;
  ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_fee_payments_college ON fee_payments(college_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_fee ON fee_payments(student_fee_id);

-- ============================================================
-- 3.5 ENFORCE PAYMENT CEILING TRIGGER FUNCTION
-- Prevents payments that cause total paid > student fee structure amount
-- ============================================================
CREATE OR REPLACE FUNCTION check_fee_payment_ceiling()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_fee NUMERIC := 0;
  v_existing_paid NUMERIC := 0;
BEGIN
  -- 1. Try resolving total_amount from student_fees table
  SELECT sf.total_amount INTO v_total_fee
  FROM student_fees sf
  WHERE sf.id = NEW.student_fee_id OR sf.student_id = NEW.student_id
  LIMIT 1;

  -- 2. Fallback to fee_structures table
  IF v_total_fee IS NULL OR v_total_fee = 0 THEN
    SELECT fs.total_amount INTO v_total_fee
    FROM fee_structures fs
    WHERE fs.id = NEW.fee_structure_id
    LIMIT 1;
  END IF;

  -- Default structure fallback if unassigned
  IF v_total_fee IS NULL OR v_total_fee = 0 THEN
    v_total_fee := 80000;
  END IF;

  -- Sum existing completed payments for this student (excluding NEW.id if updating)
  SELECT COALESCE(SUM(amount), 0) INTO v_existing_paid
  FROM fee_payments
  WHERE student_id = NEW.student_id
    AND status = 'Completed'
    AND (NEW.id IS NULL OR id != NEW.id);

  IF (v_existing_paid + NEW.amount) > v_total_fee THEN
    RAISE EXCEPTION 'Payment amount % exceeds maximum allowed payment % (Total Fee: %, Paid: %)',
      NEW.amount, (v_total_fee - v_existing_paid), v_total_fee, v_existing_paid;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_check_fee_payment_ceiling ON fee_payments;
CREATE TRIGGER trigger_check_fee_payment_ceiling
  BEFORE INSERT OR UPDATE ON fee_payments
  FOR EACH ROW
  EXECUTE FUNCTION check_fee_payment_ceiling();

-- ============================================================
-- 4. RECALCULATE STUDENT FEE RPC FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION recalculate_student_fee(p_student_fee_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total NUMERIC;
  v_paid NUMERIC;
  v_due NUMERIC;
  v_status TEXT;
BEGIN
  -- Get total amount
  SELECT total_amount INTO v_total
  FROM student_fees
  WHERE id = p_student_fee_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Sum all completed payments for this student_fee
  SELECT COALESCE(SUM(amount), 0) INTO v_paid
  FROM fee_payments
  WHERE student_fee_id = p_student_fee_id
    AND status = 'Completed';

  -- Calculate due (never negative)
  v_due := GREATEST(0, v_total - v_paid);

  -- Determine status
  IF v_paid >= v_total AND v_total > 0 THEN
    v_status := 'paid';
  ELSIF v_paid > 0 THEN
    v_status := 'partial';
  ELSE
    v_status := 'due';
  END IF;

  -- Update the student_fees record
  UPDATE student_fees
  SET paid_amount = v_paid,
      due_amount = v_due,
      status = v_status,
      updated_at = now()
  WHERE id = p_student_fee_id;
END;
$$;

-- ============================================================
-- 5. BATCH RECALCULATE FOR A STUDENT (useful after payment)
-- ============================================================
CREATE OR REPLACE FUNCTION recalculate_student_fees_by_student(p_student_id UUID, p_fee_structure_id UUID DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT id FROM student_fees
    WHERE student_id = p_student_id
      AND (p_fee_structure_id IS NULL OR fee_structure_id = p_fee_structure_id)
  LOOP
    PERFORM recalculate_student_fee(rec.id);
  END LOOP;
END;
$$;

-- ============================================================
-- 6. GENERATE STUDENT FEES FOR A FEE STRUCTURE
-- Creates student_fees records for all matching students
-- ============================================================
CREATE OR REPLACE FUNCTION generate_student_fees_for_structure(p_fee_structure_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_structure RECORD;
  v_count INTEGER := 0;
BEGIN
  -- Get fee structure details
  SELECT * INTO v_structure
  FROM fee_structures
  WHERE id = p_fee_structure_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Insert student_fees for all matching students who don't already have one
  INSERT INTO student_fees (
    college_id, student_id, fee_structure_id,
    student_name, roll_no, course, branch, year_semester, section,
    total_amount, paid_amount, due_amount, status, installments
  )
  SELECT
    s.college_id,
    s.id,
    v_structure.id,
    s.name,
    s.roll_no,
    s.course,
    s.branch,
    s.year,
    s.section,
    v_structure.total_amount,
    0,
    v_structure.total_amount,
    'due',
    v_structure.installments
  FROM students s
  WHERE s.college_id = v_structure.college_id
    AND s.course = v_structure.course
    AND s.branch = v_structure.branch
    AND s.year = v_structure.year_semester
  ON CONFLICT (student_id, fee_structure_id) DO NOTHING;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- ============================================================
-- 7. ENABLE RLS ON ALL FEE TABLES
-- ============================================================
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 8. RLS POLICIES — fee_structures
-- ============================================================
DROP POLICY IF EXISTS "fee_structures_select_own_college" ON fee_structures;
DROP POLICY IF EXISTS "fee_structures_insert_admin" ON fee_structures;
DROP POLICY IF EXISTS "fee_structures_update_admin" ON fee_structures;
DROP POLICY IF EXISTS "fee_structures_delete_admin" ON fee_structures;
DROP POLICY IF EXISTS "fee_structures_all_authenticated" ON fee_structures;

CREATE POLICY "fee_structures_select_own_college"
  ON fee_structures FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "fee_structures_insert_admin"
  ON fee_structures FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "fee_structures_update_admin"
  ON fee_structures FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "fee_structures_delete_admin"
  ON fee_structures FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 9. RLS POLICIES — student_fees
-- ============================================================
DROP POLICY IF EXISTS "student_fees_select" ON student_fees;
DROP POLICY IF EXISTS "student_fees_insert" ON student_fees;
DROP POLICY IF EXISTS "student_fees_update" ON student_fees;
DROP POLICY IF EXISTS "student_fees_delete" ON student_fees;
DROP POLICY IF EXISTS "student_fees_all_authenticated" ON student_fees;

CREATE POLICY "student_fees_select"
  ON student_fees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "student_fees_insert"
  ON student_fees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "student_fees_update"
  ON student_fees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "student_fees_delete"
  ON student_fees FOR DELETE
  TO authenticated
  USING (true);

-- Add recorded_by column if not exists
DO $$ BEGIN
  ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS recorded_by TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================================
-- 10. SECURITY DEFINER FUNCTION FOR TEACHER ASSIGNED CLASS RESTRICTION
-- ============================================================
CREATE OR REPLACE FUNCTION is_teacher_assigned_to_student(p_auth_uid UUID, p_student_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_role TEXT;
  v_college_id TEXT;
  v_teacher RECORD;
  v_student RECORD;
  v_assigned JSONB;
  ac TEXT;
  ac_elem JSONB;
  norm_ac TEXT;
BEGIN
  -- 1. Check user role and college_id from profiles
  SELECT role, college_id INTO v_role, v_college_id
  FROM profiles
  WHERE id = p_auth_uid;

  -- Super admin and Admin have full access
  IF v_role IN ('super_admin', 'admin') THEN
    RETURN TRUE;
  END IF;

  -- Non-teachers (students, parents) don't get teacher assignment access
  IF v_role <> 'teacher' THEN
    RETURN FALSE;
  END IF;

  -- 2. Fetch student
  SELECT * INTO v_student
  FROM students
  WHERE id = p_student_id OR student_id = p_student_id;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- College isolation check
  IF v_student.college_id IS DISTINCT FROM v_college_id AND v_college_id IS NOT NULL THEN
    RETURN FALSE;
  END IF;

  -- 3. Fetch teacher record for this auth user
  SELECT * INTO v_teacher
  FROM teachers
  WHERE profile_id = p_auth_uid OR email = (SELECT email FROM profiles WHERE id = p_auth_uid);

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- 4. Check direct class assignment via classes table
  IF EXISTS (
    SELECT 1 FROM classes c
    WHERE (c.teacher_id = v_teacher.teacher_id OR c.teacher_id = v_teacher.id OR c.teacher_id = v_teacher.email)
      AND c.course = v_student.course
      AND c.branch = v_student.branch
      AND c.year = v_student.year
      AND (c.section IS NULL OR c.section = 'All Sections' OR c.section = v_student.section)
  ) THEN
    RETURN TRUE;
  END IF;

  -- 5. Check assigned_classes JSONB array on teacher record
  v_assigned := v_teacher.assigned_classes;
  IF v_assigned IS NOT NULL AND jsonb_array_length(v_assigned) > 0 THEN
    FOR ac_elem IN SELECT * FROM jsonb_array_elements(v_assigned) LOOP
      ac := ac_elem->>0;
      IF ac IS NULL THEN ac := ac_elem::text; END IF;
      ac := trim(both '"' from ac);
      norm_ac := lower(ac);

      -- Check exact match with student class_name or id
      IF ac = v_student.class_name OR ac = v_student.id THEN
        RETURN TRUE;
      END IF;

      -- Check substring / components match
      IF norm_ac LIKE '%' || lower(v_student.course) || '%'
         AND norm_ac LIKE '%' || lower(v_student.branch) || '%'
         AND norm_ac LIKE '%' || lower(v_student.year) || '%' THEN
        RETURN TRUE;
      END IF;
    END LOOP;
  END IF;

  RETURN FALSE;
END;
$$;

-- ============================================================
-- 11. RLS POLICIES — fee_payments
-- ============================================================
DROP POLICY IF EXISTS "fee_payments_select" ON fee_payments;
DROP POLICY IF EXISTS "fee_payments_insert" ON fee_payments;
DROP POLICY IF EXISTS "fee_payments_update" ON fee_payments;
DROP POLICY IF EXISTS "fee_payments_delete" ON fee_payments;
DROP POLICY IF EXISTS "fee_payments_all_authenticated" ON fee_payments;

CREATE POLICY "fee_payments_select"
  ON fee_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND (p.role IN ('super_admin', 'admin') OR p.college_id = fee_payments.college_id)
    )
    OR
    EXISTS (
      SELECT 1 FROM students s
      WHERE (s.profile_id = auth.uid() OR s.email = (SELECT email FROM profiles WHERE id = auth.uid()))
        AND s.id = fee_payments.student_id
    )
    OR
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.parent_email = (SELECT email FROM profiles WHERE id = auth.uid())
        AND s.id = fee_payments.student_id
    )
    OR
    is_teacher_assigned_to_student(auth.uid(), fee_payments.student_id)
  );

CREATE POLICY "fee_payments_insert"
  ON fee_payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "fee_payments_update"
  ON fee_payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "fee_payments_delete"
  ON fee_payments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin')
    )
  );

-- ============================================================
-- DONE! All fee tables and functions are ready.
-- ============================================================
