
INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_acs101_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Programming Languages', 'ACS101', '', true, 'common', ARRAY['BT', 'CE', 'CSE', 'CSD', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_acs101_1st_semester_bt', 'sub_13695a_acs101_1st_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_acs101_1st_semester_ce', 'sub_13695a_acs101_1st_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_acs101_1st_semester_cse', 'sub_13695a_acs101_1st_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_acs101_1st_semester_csd', 'sub_13695a_acs101_1st_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_acs101_1st_semester_it', 'sub_13695a_acs101_1st_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_acs101_1st_semester_ec', 'sub_13695a_acs101_1st_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_acs101_1st_semester_ee', 'sub_13695a_acs101_1st_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_acs101_1st_semester_me', 'sub_13695a_acs101_1st_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aai101_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Introduction to AI & Prompt Engineering', 'AAI101', '', true, 'common', ARRAY['BT', 'CE', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aai101_1st_semester_bt', 'sub_13695a_aai101_1st_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aai101_1st_semester_ce', 'sub_13695a_aai101_1st_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aai101_1st_semester_it', 'sub_13695a_aai101_1st_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aai101_1st_semester_ec', 'sub_13695a_aai101_1st_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aai101_1st_semester_ee', 'sub_13695a_aai101_1st_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aai101_1st_semester_me', 'sub_13695a_aai101_1st_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas105_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Professional Communication and Technical Writing', 'AAS105', '', true, 'common', ARRAY['BT', 'CE', 'CSD', 'EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas105_1st_semester_bt', 'sub_13695a_aas105_1st_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas105_1st_semester_ce', 'sub_13695a_aas105_1st_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas105_1st_semester_csd', 'sub_13695a_aas105_1st_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas105_1st_semester_ec', 'sub_13695a_aas105_1st_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas103f_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '1st Semester', 'Calculus and Linear Algebra', 'AAS103F', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas103f_1st_semester_bt', 'sub_13695a_aas103f_1st_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas103a_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '1st Semester', 'Differential Calculus and Linear Algebra', 'AAS103A', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas103a_1st_semester_ce', 'sub_13695a_aas103a_1st_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas103d_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Calculus and Linear Algebra', 'AAS103D', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas103d_1st_semester_cse', 'sub_13695a_aas103d_1st_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas103d_1st_semester_cseaiml', 'sub_13695a_aas103d_1st_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas103d_1st_semester_csd', 'sub_13695a_aas103d_1st_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas103d_1st_semester_it', 'sub_13695a_aas103d_1st_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas103c_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Differential Calculus and Linear Algebra', 'AAS103C', '', true, 'common', ARRAY['EC', 'EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas103c_1st_semester_ec', 'sub_13695a_aas103c_1st_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas103c_1st_semester_ee', 'sub_13695a_aas103c_1st_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas103b_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '1st Semester', 'Differential Calculus and Linear Algebra', 'AAS103B', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas103b_1st_semester_me', 'sub_13695a_aas103b_1st_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas101f_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '1st Semester', 'Physics of Materials and Biomaterials', 'AAS101F', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas101f_1st_semester_bt', 'sub_13695a_aas101f_1st_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas101a_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '1st Semester', 'Physics for Sustainable Structural Systems', 'AAS101A', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas101a_1st_semester_ce', 'sub_13695a_aas101a_1st_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas102d_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Applied Chemistry for Smart Systems', 'AAS102D', '', true, 'common', ARRAY['CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas102d_1st_semester_cse', 'sub_13695a_aas102d_1st_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas102d_1st_semester_it', 'sub_13695a_aas102d_1st_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas101e_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Computer Science & Design', '1st Semester', 'Quantum Physics and Applications', 'AAS101E', '', false, 'branch_specific', ARRAY['CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas101e_1st_semester_csd', 'sub_13695a_aas101e_1st_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas101c_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '1st Semester', 'Quantum Physics and Electronic Sensors', 'AAS101C', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas101c_1st_semester_ec', 'sub_13695a_aas101c_1st_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas101d_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '1st Semester', 'Physics of Electrical Engineering Materials', 'AAS101D', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas101d_1st_semester_ee', 'sub_13695a_aas101d_1st_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas101b_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '1st Semester', 'Physics of Materials', 'AAS101B', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas101b_1st_semester_me', 'sub_13695a_aas101b_1st_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aec101c_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '1st Semester', 'Fundamentals of Electronics Engineering', 'AEC101C', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aec101c_1st_semester_bt', 'sub_13695a_aec101c_1st_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aec101b_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '1st Semester', 'Fundamentals of Electronics Engineering', 'AEC101B', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aec101b_1st_semester_ce', 'sub_13695a_aec101b_1st_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aee101a_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Fundamentals of Electrical Engineering', 'AEE101A', '', true, 'common', ARRAY['CSE', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aee101a_1st_semester_cse', 'sub_13695a_aee101a_1st_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aee101a_1st_semester_csd', 'sub_13695a_aee101a_1st_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aec101a_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Fundamentals of Electronics Engineering', 'AEC101A', '', true, 'common', ARRAY['IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aec101a_1st_semester_it', 'sub_13695a_aec101a_1st_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aec101a_1st_semester_ec', 'sub_13695a_aec101a_1st_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aec101a_1st_semester_ee', 'sub_13695a_aec101a_1st_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aec101a_1st_semester_me', 'sub_13695a_aec101a_1st_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_ame101a_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Fundamentals of Mechanical Engineering', 'AME101A', '', true, 'common', ARRAY['CSE', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_ame101a_1st_semester_cse', 'sub_13695a_ame101a_1st_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_ame101a_1st_semester_csd', 'sub_13695a_ame101a_1st_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aac101_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Environment & Sustainability', 'AAC101', '', true, 'common', ARRAY['BT', 'CE', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aac101_1st_semester_bt', 'sub_13695a_aac101_1st_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aac101_1st_semester_ce', 'sub_13695a_aac101_1st_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aac101_1st_semester_csd', 'sub_13695a_aac101_1st_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_aas104_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Introduction to Indian Knowledge System', 'AAS104', '', true, 'common', ARRAY['CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas104_1st_semester_cse', 'sub_13695a_aas104_1st_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_aas104_1st_semester_it', 'sub_13695a_aas104_1st_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcc301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Cyber Security', 'BCC301', '', true, 'common', ARRAY['BT', 'CE', 'CSE', 'CSE(AIML)', 'CSD', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcc301_3rd_semester_bt', 'sub_13695a_bcc301_3rd_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcc301_3rd_semester_ce', 'sub_13695a_bcc301_3rd_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcc301_3rd_semester_cse', 'sub_13695a_bcc301_3rd_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcc301_3rd_semester_cseaiml', 'sub_13695a_bcc301_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcc301_3rd_semester_csd', 'sub_13695a_bcc301_3rd_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcc301_3rd_semester_it', 'sub_13695a_bcc301_3rd_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcc301_3rd_semester_ec', 'sub_13695a_bcc301_3rd_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcc301_3rd_semester_ee', 'sub_13695a_bcc301_3rd_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcc301_3rd_semester_me', 'sub_13695a_bcc301_3rd_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bve301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Universal Human Values', 'BVE301', '', true, 'common', ARRAY['BT', 'CE', 'CSD', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bve301_3rd_semester_bt', 'sub_13695a_bve301_3rd_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bve301_3rd_semester_ce', 'sub_13695a_bve301_3rd_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bve301_3rd_semester_csd', 'sub_13695a_bve301_3rd_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bve301_3rd_semester_it', 'sub_13695a_bve301_3rd_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bve301_3rd_semester_ec', 'sub_13695a_bve301_3rd_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bve301_3rd_semester_ee', 'sub_13695a_bve301_3rd_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bve301_3rd_semester_me', 'sub_13695a_bve301_3rd_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '3rd Semester', 'Techniques in Biotechnology', 'BBT301', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt301_3rd_semester_bt', 'sub_13695a_bbt301_3rd_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '3rd Semester', 'Engg. Mechanics', 'BCE301', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce301_3rd_semester_ce', 'sub_13695a_bce301_3rd_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Data Structure', 'BCS301', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs301_3rd_semester_cse', 'sub_13695a_bcs301_3rd_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs301_3rd_semester_cseaiml', 'sub_13695a_bcs301_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs301_3rd_semester_csd', 'sub_13695a_bcs301_3rd_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '3rd Semester', 'Electronic Devices', 'BEC301', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec301_3rd_semester_ec', 'sub_13695a_bec301_3rd_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '3rd Semester', 'Electromagnetic Field Theory', 'BEE301', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee301_3rd_semester_ee', 'sub_13695a_bee301_3rd_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '3rd Semester', 'Thermodynamics', 'BME301', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme301_3rd_semester_me', 'sub_13695a_bme301_3rd_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt302_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '3rd Semester', 'Microbiology and Immunology', 'BBT302', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt302_3rd_semester_bt', 'sub_13695a_bbt302_3rd_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce302_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '3rd Semester', 'Surveying and Geomatics', 'BCE302', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce302_3rd_semester_ce', 'sub_13695a_bce302_3rd_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs302_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Computer Organization and Architecture', 'BCS302', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs302_3rd_semester_cse', 'sub_13695a_bcs302_3rd_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs302_3rd_semester_cseaiml', 'sub_13695a_bcs302_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs302_3rd_semester_csd', 'sub_13695a_bcs302_3rd_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec302_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '3rd Semester', 'Digital System Design', 'BEC302', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec302_3rd_semester_ec', 'sub_13695a_bec302_3rd_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee302_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '3rd Semester', 'Electrical Measurements & Instrumentation', 'BEE302', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee302_3rd_semester_ee', 'sub_13695a_bee302_3rd_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme302_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '3rd Semester', 'Fluid Mechanics & Fluid Machines', 'BME302', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme302_3rd_semester_me', 'sub_13695a_bme302_3rd_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bas301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Technical Communication', 'BAS301', '', true, 'common', ARRAY['CSE', 'CSE(AIML)'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bas301_3rd_semester_cse', 'sub_13695a_bas301_3rd_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bas301_3rd_semester_cseaiml', 'sub_13695a_bas301_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bas304_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '3rd Semester', 'Maths V', 'BAS304', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bas304_3rd_semester_bt', 'sub_13695a_bas304_3rd_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_boe304_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '3rd Semester', 'Energy Science and Engineering', 'BOE304', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe304_3rd_semester_ce', 'sub_13695a_boe304_3rd_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_boe303_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Material Science', 'BOE303', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe303_3rd_semester_cse', 'sub_13695a_boe303_3rd_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe303_3rd_semester_cseaiml', 'sub_13695a_boe303_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe303_3rd_semester_csd', 'sub_13695a_boe303_3rd_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe303_3rd_semester_it', 'sub_13695a_boe303_3rd_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bas303_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Mathematics-IV', 'BAS303', '', true, 'common', ARRAY['EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bas303_3rd_semester_ee', 'sub_13695a_bas303_3rd_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bas303_3rd_semester_me', 'sub_13695a_bas303_3rd_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt303_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '3rd Semester', 'Biochemistry', 'BBT303', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt303_3rd_semester_bt', 'sub_13695a_bbt303_3rd_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce303_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '3rd Semester', 'Fluid Mechanics', 'BCE303', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce303_3rd_semester_ce', 'sub_13695a_bce303_3rd_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs303_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Discrete Structures & Theory of Logic', 'BCS303', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs303_3rd_semester_cse', 'sub_13695a_bcs303_3rd_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs303_3rd_semester_cseaiml', 'sub_13695a_bcs303_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs303_3rd_semester_csd', 'sub_13695a_bcs303_3rd_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec303_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '3rd Semester', 'Network Analysis & Synthesis', 'BEC303', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec303_3rd_semester_ec', 'sub_13695a_bec303_3rd_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee303_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '3rd Semester', 'Basic Signals & Systems', 'BEE303', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee303_3rd_semester_ee', 'sub_13695a_bee303_3rd_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme303_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '3rd Semester', 'Material Engineering', 'BME303', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme303_3rd_semester_me', 'sub_13695a_bme303_3rd_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bnc501_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Constitution of India, Law and Engineering', 'BNC501', '', true, 'common', ARRAY['BT', 'CE', 'CSD', 'CSE(AIML)', 'CSE', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bnc501_5th_semester_bt', 'sub_13695a_bnc501_5th_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bnc501_5th_semester_ce', 'sub_13695a_bnc501_5th_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bnc501_5th_semester_csd', 'sub_13695a_bnc501_5th_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bnc501_5th_semester_cseaiml', 'sub_13695a_bnc501_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bnc501_5th_semester_cse', 'sub_13695a_bnc501_5th_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bnc501_5th_semester_it', 'sub_13695a_bnc501_5th_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bnc501_5th_semester_ec', 'sub_13695a_bnc501_5th_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bnc501_5th_semester_ee', 'sub_13695a_bnc501_5th_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bnc501_5th_semester_me', 'sub_13695a_bnc501_5th_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt501_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '5th Semester', 'Genetic Engineering', 'BBT501', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt501_5th_semester_bt', 'sub_13695a_bbt501_5th_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce501_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '5th Semester', 'Geotechnical Engineering', 'BCE501', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce501_5th_semester_ce', 'sub_13695a_bce501_5th_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs501_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Database Management System', 'BCS501', '', true, 'common', ARRAY['CSD', 'CSE(AIML)', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs501_5th_semester_csd', 'sub_13695a_bcs501_5th_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs501_5th_semester_cseaiml', 'sub_13695a_bcs501_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs501_5th_semester_cse', 'sub_13695a_bcs501_5th_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs501_5th_semester_it', 'sub_13695a_bcs501_5th_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec501_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'Integrated Circuits', 'BEC501', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec501_5th_semester_ec', 'sub_13695a_bec501_5th_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee501_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Power System - I', 'BEE501', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee501_5th_semester_ee', 'sub_13695a_bee501_5th_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme501_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'Heat & Mass Transfer', 'BME501', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme501_5th_semester_me', 'sub_13695a_bme501_5th_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt502_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '5th Semester', 'Fermentation Biotechnology', 'BBT502', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt502_5th_semester_bt', 'sub_13695a_bbt502_5th_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce502_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '5th Semester', 'Structural Analysis', 'BCE502', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce502_5th_semester_ce', 'sub_13695a_bce502_5th_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs502_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Web Technology', 'BCS502', '', true, 'common', ARRAY['CSD', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs502_5th_semester_csd', 'sub_13695a_bcs502_5th_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs502_5th_semester_cse', 'sub_13695a_bcs502_5th_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs502_5th_semester_it', 'sub_13695a_bcs502_5th_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcai501_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'CSE (AI/ML)', '5th Semester', 'Artificial Intelligence', 'BCAI501', '', false, 'branch_specific', ARRAY['CSE(AIML)'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcai501_5th_semester_cseaiml', 'sub_13695a_bcai501_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec502_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'Microprocessor & Microcontroller', 'BEC502', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec502_5th_semester_ec', 'sub_13695a_bec502_5th_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee502_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Control System', 'BEE502', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee502_5th_semester_ee', 'sub_13695a_bee502_5th_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme502_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'Machine Design', 'BME502', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme502_5th_semester_me', 'sub_13695a_bme502_5th_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt055_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '5th Semester', 'Biofuel & Alcohol Technology', 'BBT055', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt055_5th_semester_bt', 'sub_13695a_bbt055_5th_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce051_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '5th Semester', 'Concrete Technology', 'BCE051', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce051_5th_semester_ce', 'sub_13695a_bce051_5th_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs054_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Object Oriented System Design with C++', 'BCS054', '', true, 'common', ARRAY['CSD', 'CSE(AIML)', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs054_5th_semester_csd', 'sub_13695a_bcs054_5th_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs054_5th_semester_cseaiml', 'sub_13695a_bcs054_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs054_5th_semester_cse', 'sub_13695a_bcs054_5th_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs054_5th_semester_it', 'sub_13695a_bcs054_5th_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec054_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'VLSI Technology', 'BEC054', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec054_5th_semester_ec', 'sub_13695a_bec054_5th_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee052_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Sensors and Transducers', 'BEE052', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee052_5th_semester_ee', 'sub_13695a_bee052_5th_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme054_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'Mechatronic Systems', 'BME054', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme054_5th_semester_me', 'sub_13695a_bme054_5th_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt503_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '5th Semester', 'Bioinformatic I', 'BBT503', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt503_5th_semester_bt', 'sub_13695a_bbt503_5th_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce503_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '5th Semester', 'Quantity Estimation and Construction Management', 'BCE503', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce503_5th_semester_ce', 'sub_13695a_bce503_5th_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs503_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Design and Analysis of Algorithm', 'BCS503', '', true, 'common', ARRAY['CSD', 'CSE(AIML)', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs503_5th_semester_csd', 'sub_13695a_bcs503_5th_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs503_5th_semester_cseaiml', 'sub_13695a_bcs503_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs503_5th_semester_cse', 'sub_13695a_bcs503_5th_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs503_5th_semester_it', 'sub_13695a_bcs503_5th_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec503_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'Digital Signal Processing', 'BEC503', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec503_5th_semester_ec', 'sub_13695a_bec503_5th_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee503_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Electrical Machines-II', 'BEE503', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee503_5th_semester_ee', 'sub_13695a_bee503_5th_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme503_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'Industrial Engineering', 'BME503', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme503_5th_semester_me', 'sub_13695a_bme503_5th_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt052_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '5th Semester', 'Nano Biotechnology', 'BBT052', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt052_5th_semester_bt', 'sub_13695a_bbt052_5th_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce055_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '5th Semester', 'Engineering Hydrology', 'BCE055', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce055_5th_semester_ce', 'sub_13695a_bce055_5th_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs058_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Computer Science & Design', '5th Semester', 'Data Warehousing & Data Mining', 'BCS058', '', false, 'branch_specific', ARRAY['CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs058_5th_semester_csd', 'sub_13695a_bcs058_5th_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs056_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Application of Soft Computing', 'BCS056', '', true, 'common', ARRAY['CSE(AIML)', 'CSE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs056_5th_semester_cseaiml', 'sub_13695a_bcs056_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs056_5th_semester_cse', 'sub_13695a_bcs056_5th_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec057_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'Optical Communication', 'BEC057', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec057_5th_semester_ec', 'sub_13695a_bec057_5th_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee058_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Analog & Digital Communication', 'BEE058', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee058_5th_semester_ee', 'sub_13695a_bee058_5th_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme052_5th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'I.C. Engine Fuel and Lubrication', 'BME052', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme052_5th_semester_me', 'sub_13695a_bme052_5th_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_boe074_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '7th Semester', 'Renewable Energy Resources', 'BOE074', '', true, 'common', ARRAY['BT', 'CE', 'CSE(AIML)', 'CSD', 'CSE', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe074_7th_semester_bt', 'sub_13695a_boe074_7th_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe074_7th_semester_ce', 'sub_13695a_boe074_7th_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe074_7th_semester_cseaiml', 'sub_13695a_boe074_7th_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe074_7th_semester_csd', 'sub_13695a_boe074_7th_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe074_7th_semester_cse', 'sub_13695a_boe074_7th_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe074_7th_semester_it', 'sub_13695a_boe074_7th_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe074_7th_semester_ec', 'sub_13695a_boe074_7th_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe074_7th_semester_ee', 'sub_13695a_boe074_7th_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_boe074_7th_semester_me', 'sub_13695a_boe074_7th_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt701_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '7th Semester', 'Environmental Biotechnology', 'BBT701', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt701_7th_semester_bt', 'sub_13695a_bbt701_7th_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce701_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '7th Semester', 'Advanced Structural Design', 'BCE701', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce701_7th_semester_ce', 'sub_13695a_bce701_7th_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bai701_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'CSE (AI/ML)', '7th Semester', 'Deep Learning', 'BAI701', '', false, 'branch_specific', ARRAY['CSE(AIML)'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bai701_7th_semester_cseaiml', 'sub_13695a_bai701_7th_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs701_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '7th Semester', 'Artificial Intelligence', 'BCS701', '', true, 'common', ARRAY['CSD', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs701_7th_semester_csd', 'sub_13695a_bcs701_7th_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs701_7th_semester_cse', 'sub_13695a_bcs701_7th_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs701_7th_semester_it', 'sub_13695a_bcs701_7th_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec701_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '7th Semester', 'VLSI Design', 'BEC701', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec701_7th_semester_ec', 'sub_13695a_bec701_7th_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee701_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '7th Semester', 'Power System Protection', 'BEE701', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee701_7th_semester_ee', 'sub_13695a_bee701_7th_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme701_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '7th Semester', 'Measurement & Metrology', 'BME701', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme701_7th_semester_me', 'sub_13695a_bme701_7th_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bbt074_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Biotechnology', '7th Semester', 'Industrial Biotechnology', 'BBT074', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bbt074_7th_semester_bt', 'sub_13695a_bbt074_7th_semester', 'BT', 'Biotechnology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bce070_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Civil Engineering', '7th Semester', 'Railway, Airway, and Waterway Infrastructure Systems', 'BCE070', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bce070_7th_semester_ce', 'sub_13695a_bce070_7th_semester', 'CE', 'Civil Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bcs070_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Common Subject (All Branches)', '7th Semester', 'Internet of Things', 'BCS070', '', true, 'common', ARRAY['CSE(AIML)', 'CSD', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs070_7th_semester_cseaiml', 'sub_13695a_bcs070_7th_semester', 'CSE(AIML)', 'CSE (AI/ML)', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs070_7th_semester_csd', 'sub_13695a_bcs070_7th_semester', 'CSD', 'Computer Science & Design', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs070_7th_semester_cse', 'sub_13695a_bcs070_7th_semester', 'CSE', 'Computer Science & Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bcs070_7th_semester_it', 'sub_13695a_bcs070_7th_semester', 'IT', 'Information Technology', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bec076_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electronics & Communication Engineering', '7th Semester', 'Wireless & Mobile Communication', 'BEC076', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bec076_7th_semester_ec', 'sub_13695a_bec076_7th_semester', 'EC', 'Electronics & Communication Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bee073_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Electrical Engineering', '7th Semester', 'Power Quality and FACTS', 'BEE073', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bee073_7th_semester_ee', 'sub_13695a_bee073_7th_semester', 'EE', 'Electrical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bme072_7th_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'B.Tech', 'Mechanical Engineering', '7th Semester', 'Power Plant Engineering', 'BME072', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_13695a_bme072_7th_semester_me', 'sub_13695a_bme072_7th_semester', 'ME', 'Mechanical Engineering', '13695a78-0105-4bde-bc85-d664bb66637e')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmb101_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Management Concepts', 'BMB101', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmb102_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Managerial Economics', 'BMB102', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmb103_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Financial Accounting & Analysis', 'BMB103', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmb104_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Business Statistics & Analytics', 'BMB104', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmb105_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Marketing Management', 'BMB105', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmb106_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Creativity, Innovation & Entrepreneurship', 'BMB106', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmb107_1st_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Business Communication', 'BMB107', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmb301_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Strategic Management', 'BMB301', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbhr01_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Talent Acquisition Management', 'BMBHR01', 'HR Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbib01_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'International Business Management', 'BMBIB01', 'IB Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbhr02_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Employees Relations and Labour Laws', 'BMBHR02', 'HR Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbib02_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Export Import Documentation', 'BMBIB02', 'IB Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbhr03_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Performance and Reward Management', 'BMBHR03', 'HR Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbib03_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Trade & Geo-Politics', 'BMBIB03', 'IB Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbmk01_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Consumer Behaviour and Neuro Marketing', 'BMBMK01', 'Marketing Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbit01_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Software Engineering and Management', 'BMBIT01', 'IT Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbmk02_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Marketing & Web Analytics', 'BMBMK02', 'Marketing Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbmk03_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Sales & Distribution Management', 'BMBMK03', 'Marketing Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbit02_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Emerging Technologies for Business', 'BMBIT02', 'IT Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbfm01_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Investment Analysis And Portfolio Management', 'BMBFM01', 'Finance Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbfm02_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Financial Planning and Tax Management', 'BMBFM02', 'Finance Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbit03_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Data Base Management System', 'BMBIT03', 'IT Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_13695a_bmbfm03_3rd_semester', '13695a78-0105-4bde-bc85-d664bb66637e', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Financial and Credit Risk Analysis', 'BMBFM03', 'Finance Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_acs101_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Programming Languages', 'ACS101', '', true, 'common', ARRAY['BT', 'CE', 'CSE', 'CSD', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_acs101_1st_semester_bt', 'sub_ea318e_acs101_1st_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_acs101_1st_semester_ce', 'sub_ea318e_acs101_1st_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_acs101_1st_semester_cse', 'sub_ea318e_acs101_1st_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_acs101_1st_semester_csd', 'sub_ea318e_acs101_1st_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_acs101_1st_semester_it', 'sub_ea318e_acs101_1st_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_acs101_1st_semester_ec', 'sub_ea318e_acs101_1st_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_acs101_1st_semester_ee', 'sub_ea318e_acs101_1st_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_acs101_1st_semester_me', 'sub_ea318e_acs101_1st_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aai101_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Introduction to AI & Prompt Engineering', 'AAI101', '', true, 'common', ARRAY['BT', 'CE', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aai101_1st_semester_bt', 'sub_ea318e_aai101_1st_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aai101_1st_semester_ce', 'sub_ea318e_aai101_1st_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aai101_1st_semester_it', 'sub_ea318e_aai101_1st_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aai101_1st_semester_ec', 'sub_ea318e_aai101_1st_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aai101_1st_semester_ee', 'sub_ea318e_aai101_1st_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aai101_1st_semester_me', 'sub_ea318e_aai101_1st_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas105_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Professional Communication and Technical Writing', 'AAS105', '', true, 'common', ARRAY['BT', 'CE', 'CSD', 'EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas105_1st_semester_bt', 'sub_ea318e_aas105_1st_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas105_1st_semester_ce', 'sub_ea318e_aas105_1st_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas105_1st_semester_csd', 'sub_ea318e_aas105_1st_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas105_1st_semester_ec', 'sub_ea318e_aas105_1st_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas103f_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '1st Semester', 'Calculus and Linear Algebra', 'AAS103F', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas103f_1st_semester_bt', 'sub_ea318e_aas103f_1st_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas103a_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '1st Semester', 'Differential Calculus and Linear Algebra', 'AAS103A', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas103a_1st_semester_ce', 'sub_ea318e_aas103a_1st_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas103d_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Calculus and Linear Algebra', 'AAS103D', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas103d_1st_semester_cse', 'sub_ea318e_aas103d_1st_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas103d_1st_semester_cseaiml', 'sub_ea318e_aas103d_1st_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas103d_1st_semester_csd', 'sub_ea318e_aas103d_1st_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas103d_1st_semester_it', 'sub_ea318e_aas103d_1st_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas103c_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Differential Calculus and Linear Algebra', 'AAS103C', '', true, 'common', ARRAY['EC', 'EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas103c_1st_semester_ec', 'sub_ea318e_aas103c_1st_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas103c_1st_semester_ee', 'sub_ea318e_aas103c_1st_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas103b_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '1st Semester', 'Differential Calculus and Linear Algebra', 'AAS103B', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas103b_1st_semester_me', 'sub_ea318e_aas103b_1st_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas101f_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '1st Semester', 'Physics of Materials and Biomaterials', 'AAS101F', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas101f_1st_semester_bt', 'sub_ea318e_aas101f_1st_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas101a_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '1st Semester', 'Physics for Sustainable Structural Systems', 'AAS101A', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas101a_1st_semester_ce', 'sub_ea318e_aas101a_1st_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas102d_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Applied Chemistry for Smart Systems', 'AAS102D', '', true, 'common', ARRAY['CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas102d_1st_semester_cse', 'sub_ea318e_aas102d_1st_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas102d_1st_semester_it', 'sub_ea318e_aas102d_1st_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas101e_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Computer Science & Design', '1st Semester', 'Quantum Physics and Applications', 'AAS101E', '', false, 'branch_specific', ARRAY['CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas101e_1st_semester_csd', 'sub_ea318e_aas101e_1st_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas101c_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '1st Semester', 'Quantum Physics and Electronic Sensors', 'AAS101C', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas101c_1st_semester_ec', 'sub_ea318e_aas101c_1st_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas101d_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '1st Semester', 'Physics of Electrical Engineering Materials', 'AAS101D', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas101d_1st_semester_ee', 'sub_ea318e_aas101d_1st_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas101b_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '1st Semester', 'Physics of Materials', 'AAS101B', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas101b_1st_semester_me', 'sub_ea318e_aas101b_1st_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aec101c_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '1st Semester', 'Fundamentals of Electronics Engineering', 'AEC101C', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aec101c_1st_semester_bt', 'sub_ea318e_aec101c_1st_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aec101b_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '1st Semester', 'Fundamentals of Electronics Engineering', 'AEC101B', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aec101b_1st_semester_ce', 'sub_ea318e_aec101b_1st_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aee101a_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Fundamentals of Electrical Engineering', 'AEE101A', '', true, 'common', ARRAY['CSE', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aee101a_1st_semester_cse', 'sub_ea318e_aee101a_1st_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aee101a_1st_semester_csd', 'sub_ea318e_aee101a_1st_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aec101a_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Fundamentals of Electronics Engineering', 'AEC101A', '', true, 'common', ARRAY['IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aec101a_1st_semester_it', 'sub_ea318e_aec101a_1st_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aec101a_1st_semester_ec', 'sub_ea318e_aec101a_1st_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aec101a_1st_semester_ee', 'sub_ea318e_aec101a_1st_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aec101a_1st_semester_me', 'sub_ea318e_aec101a_1st_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_ame101a_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Fundamentals of Mechanical Engineering', 'AME101A', '', true, 'common', ARRAY['CSE', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_ame101a_1st_semester_cse', 'sub_ea318e_ame101a_1st_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_ame101a_1st_semester_csd', 'sub_ea318e_ame101a_1st_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aac101_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Environment & Sustainability', 'AAC101', '', true, 'common', ARRAY['BT', 'CE', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aac101_1st_semester_bt', 'sub_ea318e_aac101_1st_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aac101_1st_semester_ce', 'sub_ea318e_aac101_1st_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aac101_1st_semester_csd', 'sub_ea318e_aac101_1st_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_aas104_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '1st Semester', 'Introduction to Indian Knowledge System', 'AAS104', '', true, 'common', ARRAY['CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas104_1st_semester_cse', 'sub_ea318e_aas104_1st_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_aas104_1st_semester_it', 'sub_ea318e_aas104_1st_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcc301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Cyber Security', 'BCC301', '', true, 'common', ARRAY['BT', 'CE', 'CSE', 'CSE(AIML)', 'CSD', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcc301_3rd_semester_bt', 'sub_ea318e_bcc301_3rd_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcc301_3rd_semester_ce', 'sub_ea318e_bcc301_3rd_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcc301_3rd_semester_cse', 'sub_ea318e_bcc301_3rd_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcc301_3rd_semester_cseaiml', 'sub_ea318e_bcc301_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcc301_3rd_semester_csd', 'sub_ea318e_bcc301_3rd_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcc301_3rd_semester_it', 'sub_ea318e_bcc301_3rd_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcc301_3rd_semester_ec', 'sub_ea318e_bcc301_3rd_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcc301_3rd_semester_ee', 'sub_ea318e_bcc301_3rd_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcc301_3rd_semester_me', 'sub_ea318e_bcc301_3rd_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bve301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Universal Human Values', 'BVE301', '', true, 'common', ARRAY['BT', 'CE', 'CSD', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bve301_3rd_semester_bt', 'sub_ea318e_bve301_3rd_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bve301_3rd_semester_ce', 'sub_ea318e_bve301_3rd_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bve301_3rd_semester_csd', 'sub_ea318e_bve301_3rd_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bve301_3rd_semester_it', 'sub_ea318e_bve301_3rd_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bve301_3rd_semester_ec', 'sub_ea318e_bve301_3rd_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bve301_3rd_semester_ee', 'sub_ea318e_bve301_3rd_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bve301_3rd_semester_me', 'sub_ea318e_bve301_3rd_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '3rd Semester', 'Techniques in Biotechnology', 'BBT301', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt301_3rd_semester_bt', 'sub_ea318e_bbt301_3rd_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '3rd Semester', 'Engg. Mechanics', 'BCE301', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce301_3rd_semester_ce', 'sub_ea318e_bce301_3rd_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Data Structure', 'BCS301', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs301_3rd_semester_cse', 'sub_ea318e_bcs301_3rd_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs301_3rd_semester_cseaiml', 'sub_ea318e_bcs301_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs301_3rd_semester_csd', 'sub_ea318e_bcs301_3rd_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '3rd Semester', 'Electronic Devices', 'BEC301', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec301_3rd_semester_ec', 'sub_ea318e_bec301_3rd_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '3rd Semester', 'Electromagnetic Field Theory', 'BEE301', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee301_3rd_semester_ee', 'sub_ea318e_bee301_3rd_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '3rd Semester', 'Thermodynamics', 'BME301', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme301_3rd_semester_me', 'sub_ea318e_bme301_3rd_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt302_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '3rd Semester', 'Microbiology and Immunology', 'BBT302', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt302_3rd_semester_bt', 'sub_ea318e_bbt302_3rd_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce302_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '3rd Semester', 'Surveying and Geomatics', 'BCE302', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce302_3rd_semester_ce', 'sub_ea318e_bce302_3rd_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs302_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Computer Organization and Architecture', 'BCS302', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs302_3rd_semester_cse', 'sub_ea318e_bcs302_3rd_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs302_3rd_semester_cseaiml', 'sub_ea318e_bcs302_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs302_3rd_semester_csd', 'sub_ea318e_bcs302_3rd_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec302_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '3rd Semester', 'Digital System Design', 'BEC302', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec302_3rd_semester_ec', 'sub_ea318e_bec302_3rd_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee302_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '3rd Semester', 'Electrical Measurements & Instrumentation', 'BEE302', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee302_3rd_semester_ee', 'sub_ea318e_bee302_3rd_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme302_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '3rd Semester', 'Fluid Mechanics & Fluid Machines', 'BME302', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme302_3rd_semester_me', 'sub_ea318e_bme302_3rd_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bas301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Technical Communication', 'BAS301', '', true, 'common', ARRAY['CSE', 'CSE(AIML)'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bas301_3rd_semester_cse', 'sub_ea318e_bas301_3rd_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bas301_3rd_semester_cseaiml', 'sub_ea318e_bas301_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bas304_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '3rd Semester', 'Maths V', 'BAS304', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bas304_3rd_semester_bt', 'sub_ea318e_bas304_3rd_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_boe304_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '3rd Semester', 'Energy Science and Engineering', 'BOE304', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe304_3rd_semester_ce', 'sub_ea318e_boe304_3rd_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_boe303_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Material Science', 'BOE303', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe303_3rd_semester_cse', 'sub_ea318e_boe303_3rd_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe303_3rd_semester_cseaiml', 'sub_ea318e_boe303_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe303_3rd_semester_csd', 'sub_ea318e_boe303_3rd_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe303_3rd_semester_it', 'sub_ea318e_boe303_3rd_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bas303_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Mathematics-IV', 'BAS303', '', true, 'common', ARRAY['EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bas303_3rd_semester_ee', 'sub_ea318e_bas303_3rd_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bas303_3rd_semester_me', 'sub_ea318e_bas303_3rd_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt303_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '3rd Semester', 'Biochemistry', 'BBT303', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt303_3rd_semester_bt', 'sub_ea318e_bbt303_3rd_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce303_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '3rd Semester', 'Fluid Mechanics', 'BCE303', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce303_3rd_semester_ce', 'sub_ea318e_bce303_3rd_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs303_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '3rd Semester', 'Discrete Structures & Theory of Logic', 'BCS303', '', true, 'common', ARRAY['CSE', 'CSE(AIML)', 'CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs303_3rd_semester_cse', 'sub_ea318e_bcs303_3rd_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs303_3rd_semester_cseaiml', 'sub_ea318e_bcs303_3rd_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs303_3rd_semester_csd', 'sub_ea318e_bcs303_3rd_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec303_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '3rd Semester', 'Network Analysis & Synthesis', 'BEC303', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec303_3rd_semester_ec', 'sub_ea318e_bec303_3rd_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee303_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '3rd Semester', 'Basic Signals & Systems', 'BEE303', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee303_3rd_semester_ee', 'sub_ea318e_bee303_3rd_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme303_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '3rd Semester', 'Material Engineering', 'BME303', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme303_3rd_semester_me', 'sub_ea318e_bme303_3rd_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bnc501_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Constitution of India, Law and Engineering', 'BNC501', '', true, 'common', ARRAY['BT', 'CE', 'CSD', 'CSE(AIML)', 'CSE', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bnc501_5th_semester_bt', 'sub_ea318e_bnc501_5th_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bnc501_5th_semester_ce', 'sub_ea318e_bnc501_5th_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bnc501_5th_semester_csd', 'sub_ea318e_bnc501_5th_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bnc501_5th_semester_cseaiml', 'sub_ea318e_bnc501_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bnc501_5th_semester_cse', 'sub_ea318e_bnc501_5th_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bnc501_5th_semester_it', 'sub_ea318e_bnc501_5th_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bnc501_5th_semester_ec', 'sub_ea318e_bnc501_5th_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bnc501_5th_semester_ee', 'sub_ea318e_bnc501_5th_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bnc501_5th_semester_me', 'sub_ea318e_bnc501_5th_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt501_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '5th Semester', 'Genetic Engineering', 'BBT501', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt501_5th_semester_bt', 'sub_ea318e_bbt501_5th_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce501_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '5th Semester', 'Geotechnical Engineering', 'BCE501', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce501_5th_semester_ce', 'sub_ea318e_bce501_5th_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs501_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Database Management System', 'BCS501', '', true, 'common', ARRAY['CSD', 'CSE(AIML)', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs501_5th_semester_csd', 'sub_ea318e_bcs501_5th_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs501_5th_semester_cseaiml', 'sub_ea318e_bcs501_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs501_5th_semester_cse', 'sub_ea318e_bcs501_5th_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs501_5th_semester_it', 'sub_ea318e_bcs501_5th_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec501_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'Integrated Circuits', 'BEC501', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec501_5th_semester_ec', 'sub_ea318e_bec501_5th_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee501_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Power System - I', 'BEE501', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee501_5th_semester_ee', 'sub_ea318e_bee501_5th_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme501_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'Heat & Mass Transfer', 'BME501', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme501_5th_semester_me', 'sub_ea318e_bme501_5th_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt502_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '5th Semester', 'Fermentation Biotechnology', 'BBT502', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt502_5th_semester_bt', 'sub_ea318e_bbt502_5th_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce502_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '5th Semester', 'Structural Analysis', 'BCE502', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce502_5th_semester_ce', 'sub_ea318e_bce502_5th_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs502_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Web Technology', 'BCS502', '', true, 'common', ARRAY['CSD', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs502_5th_semester_csd', 'sub_ea318e_bcs502_5th_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs502_5th_semester_cse', 'sub_ea318e_bcs502_5th_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs502_5th_semester_it', 'sub_ea318e_bcs502_5th_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcai501_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'CSE (AI/ML)', '5th Semester', 'Artificial Intelligence', 'BCAI501', '', false, 'branch_specific', ARRAY['CSE(AIML)'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcai501_5th_semester_cseaiml', 'sub_ea318e_bcai501_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec502_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'Microprocessor & Microcontroller', 'BEC502', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec502_5th_semester_ec', 'sub_ea318e_bec502_5th_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee502_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Control System', 'BEE502', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee502_5th_semester_ee', 'sub_ea318e_bee502_5th_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme502_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'Machine Design', 'BME502', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme502_5th_semester_me', 'sub_ea318e_bme502_5th_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt055_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '5th Semester', 'Biofuel & Alcohol Technology', 'BBT055', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt055_5th_semester_bt', 'sub_ea318e_bbt055_5th_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce051_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '5th Semester', 'Concrete Technology', 'BCE051', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce051_5th_semester_ce', 'sub_ea318e_bce051_5th_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs054_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Object Oriented System Design with C++', 'BCS054', '', true, 'common', ARRAY['CSD', 'CSE(AIML)', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs054_5th_semester_csd', 'sub_ea318e_bcs054_5th_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs054_5th_semester_cseaiml', 'sub_ea318e_bcs054_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs054_5th_semester_cse', 'sub_ea318e_bcs054_5th_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs054_5th_semester_it', 'sub_ea318e_bcs054_5th_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec054_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'VLSI Technology', 'BEC054', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec054_5th_semester_ec', 'sub_ea318e_bec054_5th_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee052_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Sensors and Transducers', 'BEE052', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee052_5th_semester_ee', 'sub_ea318e_bee052_5th_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme054_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'Mechatronic Systems', 'BME054', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme054_5th_semester_me', 'sub_ea318e_bme054_5th_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt503_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '5th Semester', 'Bioinformatic I', 'BBT503', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt503_5th_semester_bt', 'sub_ea318e_bbt503_5th_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce503_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '5th Semester', 'Quantity Estimation and Construction Management', 'BCE503', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce503_5th_semester_ce', 'sub_ea318e_bce503_5th_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs503_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Design and Analysis of Algorithm', 'BCS503', '', true, 'common', ARRAY['CSD', 'CSE(AIML)', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs503_5th_semester_csd', 'sub_ea318e_bcs503_5th_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs503_5th_semester_cseaiml', 'sub_ea318e_bcs503_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs503_5th_semester_cse', 'sub_ea318e_bcs503_5th_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs503_5th_semester_it', 'sub_ea318e_bcs503_5th_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec503_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'Digital Signal Processing', 'BEC503', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec503_5th_semester_ec', 'sub_ea318e_bec503_5th_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee503_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Electrical Machines-II', 'BEE503', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee503_5th_semester_ee', 'sub_ea318e_bee503_5th_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme503_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'Industrial Engineering', 'BME503', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme503_5th_semester_me', 'sub_ea318e_bme503_5th_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt052_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '5th Semester', 'Nano Biotechnology', 'BBT052', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt052_5th_semester_bt', 'sub_ea318e_bbt052_5th_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce055_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '5th Semester', 'Engineering Hydrology', 'BCE055', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce055_5th_semester_ce', 'sub_ea318e_bce055_5th_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs058_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Computer Science & Design', '5th Semester', 'Data Warehousing & Data Mining', 'BCS058', '', false, 'branch_specific', ARRAY['CSD'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs058_5th_semester_csd', 'sub_ea318e_bcs058_5th_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs056_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '5th Semester', 'Application of Soft Computing', 'BCS056', '', true, 'common', ARRAY['CSE(AIML)', 'CSE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs056_5th_semester_cseaiml', 'sub_ea318e_bcs056_5th_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs056_5th_semester_cse', 'sub_ea318e_bcs056_5th_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec057_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '5th Semester', 'Optical Communication', 'BEC057', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec057_5th_semester_ec', 'sub_ea318e_bec057_5th_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee058_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '5th Semester', 'Analog & Digital Communication', 'BEE058', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee058_5th_semester_ee', 'sub_ea318e_bee058_5th_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme052_5th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '5th Semester', 'I.C. Engine Fuel and Lubrication', 'BME052', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme052_5th_semester_me', 'sub_ea318e_bme052_5th_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_boe074_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '7th Semester', 'Renewable Energy Resources', 'BOE074', '', true, 'common', ARRAY['BT', 'CE', 'CSE(AIML)', 'CSD', 'CSE', 'IT', 'EC', 'EE', 'ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe074_7th_semester_bt', 'sub_ea318e_boe074_7th_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe074_7th_semester_ce', 'sub_ea318e_boe074_7th_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe074_7th_semester_cseaiml', 'sub_ea318e_boe074_7th_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe074_7th_semester_csd', 'sub_ea318e_boe074_7th_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe074_7th_semester_cse', 'sub_ea318e_boe074_7th_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe074_7th_semester_it', 'sub_ea318e_boe074_7th_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe074_7th_semester_ec', 'sub_ea318e_boe074_7th_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe074_7th_semester_ee', 'sub_ea318e_boe074_7th_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_boe074_7th_semester_me', 'sub_ea318e_boe074_7th_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt701_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '7th Semester', 'Environmental Biotechnology', 'BBT701', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt701_7th_semester_bt', 'sub_ea318e_bbt701_7th_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce701_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '7th Semester', 'Advanced Structural Design', 'BCE701', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce701_7th_semester_ce', 'sub_ea318e_bce701_7th_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bai701_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'CSE (AI/ML)', '7th Semester', 'Deep Learning', 'BAI701', '', false, 'branch_specific', ARRAY['CSE(AIML)'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bai701_7th_semester_cseaiml', 'sub_ea318e_bai701_7th_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs701_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '7th Semester', 'Artificial Intelligence', 'BCS701', '', true, 'common', ARRAY['CSD', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs701_7th_semester_csd', 'sub_ea318e_bcs701_7th_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs701_7th_semester_cse', 'sub_ea318e_bcs701_7th_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs701_7th_semester_it', 'sub_ea318e_bcs701_7th_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec701_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '7th Semester', 'VLSI Design', 'BEC701', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec701_7th_semester_ec', 'sub_ea318e_bec701_7th_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee701_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '7th Semester', 'Power System Protection', 'BEE701', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee701_7th_semester_ee', 'sub_ea318e_bee701_7th_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme701_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '7th Semester', 'Measurement & Metrology', 'BME701', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme701_7th_semester_me', 'sub_ea318e_bme701_7th_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bbt074_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Biotechnology', '7th Semester', 'Industrial Biotechnology', 'BBT074', '', false, 'branch_specific', ARRAY['BT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bbt074_7th_semester_bt', 'sub_ea318e_bbt074_7th_semester', 'BT', 'Biotechnology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bce070_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Civil Engineering', '7th Semester', 'Railway, Airway, and Waterway Infrastructure Systems', 'BCE070', '', false, 'branch_specific', ARRAY['CE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bce070_7th_semester_ce', 'sub_ea318e_bce070_7th_semester', 'CE', 'Civil Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bcs070_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Common Subject (All Branches)', '7th Semester', 'Internet of Things', 'BCS070', '', true, 'common', ARRAY['CSE(AIML)', 'CSD', 'CSE', 'IT'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs070_7th_semester_cseaiml', 'sub_ea318e_bcs070_7th_semester', 'CSE(AIML)', 'CSE (AI/ML)', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs070_7th_semester_csd', 'sub_ea318e_bcs070_7th_semester', 'CSD', 'Computer Science & Design', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs070_7th_semester_cse', 'sub_ea318e_bcs070_7th_semester', 'CSE', 'Computer Science & Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bcs070_7th_semester_it', 'sub_ea318e_bcs070_7th_semester', 'IT', 'Information Technology', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bec076_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electronics & Communication Engineering', '7th Semester', 'Wireless & Mobile Communication', 'BEC076', '', false, 'branch_specific', ARRAY['EC'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bec076_7th_semester_ec', 'sub_ea318e_bec076_7th_semester', 'EC', 'Electronics & Communication Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bee073_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Electrical Engineering', '7th Semester', 'Power Quality and FACTS', 'BEE073', '', false, 'branch_specific', ARRAY['EE'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bee073_7th_semester_ee', 'sub_ea318e_bee073_7th_semester', 'EE', 'Electrical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bme072_7th_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'B.Tech', 'Mechanical Engineering', '7th Semester', 'Power Plant Engineering', 'BME072', '', false, 'branch_specific', ARRAY['ME'], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('sb_sub_ea318e_bme072_7th_semester_me', 'sub_ea318e_bme072_7th_semester', 'ME', 'Mechanical Engineering', 'ea318ebf-893e-410c-a925-ac1d4dc986eb')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmb101_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Management Concepts', 'BMB101', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmb102_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Managerial Economics', 'BMB102', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmb103_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Financial Accounting & Analysis', 'BMB103', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmb104_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Business Statistics & Analytics', 'BMB104', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmb105_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Marketing Management', 'BMB105', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmb106_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Creativity, Innovation & Entrepreneurship', 'BMB106', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmb107_1st_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '1st Semester', 'Business Communication', 'BMB107', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmb301_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Strategic Management', 'BMB301', '', true, 'common', ARRAY[]::text[], 'Theory', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbhr01_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Talent Acquisition Management', 'BMBHR01', 'HR Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbib01_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'International Business Management', 'BMBIB01', 'IB Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbhr02_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Employees Relations and Labour Laws', 'BMBHR02', 'HR Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbib02_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Export Import Documentation', 'BMBIB02', 'IB Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbhr03_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Performance and Reward Management', 'BMBHR03', 'HR Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbib03_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Trade & Geo-Politics', 'BMBIB03', 'IB Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbmk01_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Consumer Behaviour and Neuro Marketing', 'BMBMK01', 'Marketing Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbit01_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Software Engineering and Management', 'BMBIT01', 'IT Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbmk02_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Marketing & Web Analytics', 'BMBMK02', 'Marketing Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbmk03_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Sales & Distribution Management', 'BMBMK03', 'Marketing Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbit02_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Emerging Technologies for Business', 'BMBIT02', 'IT Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbfm01_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Investment Analysis And Portfolio Management', 'BMBFM01', 'Finance Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbfm02_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Financial Planning and Tax Management', 'BMBFM02', 'Finance Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbit03_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Data Base Management System', 'BMBIT03', 'IT Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;


INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('sub_ea318e_bmbfm03_3rd_semester', 'ea318ebf-893e-410c-a925-ac1d4dc986eb', 'MBA', 'Common Subject (All Branches)', '3rd Semester', 'Financial and Credit Risk Analysis', 'BMBFM03', 'Finance Elective', false, 'common', ARRAY[]::text[], 'Elective', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;
