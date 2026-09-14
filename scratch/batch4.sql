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
