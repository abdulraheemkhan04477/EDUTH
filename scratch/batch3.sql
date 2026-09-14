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