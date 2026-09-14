import json

# Branch abbreviation to official name map
BRANCH_MAP = {
    'BT': 'Biotechnology',
    'CE': 'Civil Engineering',
    'CSE': 'Computer Science & Engineering',
    'CSD': 'Computer Science & Design',
    'CSE(AIML)': 'CSE (AI/ML)',
    'IT': 'Information Technology',
    'EC': 'Electronics & Communication Engineering',
    'EE': 'Electrical Engineering',
    'ME': 'Mechanical Engineering',
}

# ALL B.Tech branches list
ALL_BTECH_BRANCHES = ['BT', 'CE', 'CSE', 'CSD', 'CSE(AIML)', 'IT', 'EC', 'EE', 'ME']

raw_subjects_data = [
    # B.TECH 1st SEMESTER
    {"course": "B.Tech", "semester": "1st Semester", "code": "ACS101", "name": "Programming Languages", "branches": ["BT", "CE", "CSE", "CSD", "IT", "EC", "EE", "ME"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAI101", "name": "Introduction to AI & Prompt Engineering", "branches": ["BT", "CE", "IT", "EC", "EE", "ME"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS105", "name": "Professional Communication and Technical Writing", "branches": ["BT", "CE", "CSD", "EC"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS103F", "name": "Calculus and Linear Algebra", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS103A", "name": "Differential Calculus and Linear Algebra", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS103D", "name": "Calculus and Linear Algebra", "branches": ["CSE", "CSE(AIML)", "CSD", "IT"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS103C", "name": "Differential Calculus and Linear Algebra", "branches": ["EC", "EE"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS103B", "name": "Differential Calculus and Linear Algebra", "branches": ["ME"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS101F", "name": "Physics of Materials and Biomaterials", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS101A", "name": "Physics for Sustainable Structural Systems", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS102D", "name": "Applied Chemistry for Smart Systems", "branches": ["CSE", "IT"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS101E", "name": "Quantum Physics and Applications", "branches": ["CSD"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS101C", "name": "Quantum Physics and Electronic Sensors", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS101D", "name": "Physics of Electrical Engineering Materials", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS101B", "name": "Physics of Materials", "branches": ["ME"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AEC101C", "name": "Fundamentals of Electronics Engineering", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AEC101B", "name": "Fundamentals of Electronics Engineering", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AEE101A", "name": "Fundamentals of Electrical Engineering", "branches": ["CSE", "CSD"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AEC101A", "name": "Fundamentals of Electronics Engineering", "branches": ["IT", "EC", "EE", "ME"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AME101A", "name": "Fundamentals of Mechanical Engineering", "branches": ["CSE", "CSD"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAC101", "name": "Environment & Sustainability", "branches": ["BT", "CE", "CSD"], "is_common": True},
    {"course": "B.Tech", "semester": "1st Semester", "code": "AAS104", "name": "Introduction to Indian Knowledge System", "branches": ["CSE", "IT"], "is_common": True},

    # B.TECH 3rd SEMESTER
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BCC301", "name": "Cyber Security", "branches": ["BT", "CE", "CSE", "CSE(AIML)", "CSD", "IT", "EC", "EE", "ME"], "is_common": True},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BVE301", "name": "Universal Human Values", "branches": ["BT", "CE", "CSD", "IT", "EC", "EE", "ME"], "is_common": True},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BBT301", "name": "Techniques in Biotechnology", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BCE301", "name": "Engg. Mechanics", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BCS301", "name": "Data Structure", "branches": ["CSE", "CSE(AIML)", "CSD"], "is_common": True},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BEC301", "name": "Electronic Devices", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BEE301", "name": "Electromagnetic Field Theory", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BME301", "name": "Thermodynamics", "branches": ["ME"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BBT302", "name": "Microbiology and Immunology", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BCE302", "name": "Surveying and Geomatics", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BCS302", "name": "Computer Organization and Architecture", "branches": ["CSE", "CSE(AIML)", "CSD"], "is_common": True},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BEC302", "name": "Digital System Design", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BEE302", "name": "Electrical Measurements & Instrumentation", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BME302", "name": "Fluid Mechanics & Fluid Machines", "branches": ["ME"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BAS301", "name": "Technical Communication", "branches": ["CSE", "CSE(AIML)"], "is_common": True},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BAS304", "name": "Maths V", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BOE304", "name": "Energy Science and Engineering", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BOE303", "name": "Material Science", "branches": ["CSE", "CSE(AIML)", "CSD", "IT"], "is_common": True},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BAS303", "name": "Mathematics-IV", "branches": ["EE", "ME"], "is_common": True},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BBT303", "name": "Biochemistry", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BCE303", "name": "Fluid Mechanics", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BCS303", "name": "Discrete Structures & Theory of Logic", "branches": ["CSE", "CSE(AIML)", "CSD"], "is_common": True},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BEC303", "name": "Network Analysis & Synthesis", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BEE303", "name": "Basic Signals & Systems", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "3rd Semester", "code": "BME303", "name": "Material Engineering", "branches": ["ME"], "is_common": False},

    # B.TECH 5th SEMESTER
    {"course": "B.Tech", "semester": "5th Semester", "code": "BNC501", "name": "Constitution of India, Law and Engineering", "branches": ["BT", "CE", "CSD", "CSE(AIML)", "CSE", "IT", "EC", "EE", "ME"], "is_common": True},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BBT501", "name": "Genetic Engineering", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCE501", "name": "Geotechnical Engineering", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCS501", "name": "Database Management System", "branches": ["CSD", "CSE(AIML)", "CSE", "IT"], "is_common": True},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEC501", "name": "Integrated Circuits", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEE501", "name": "Power System - I", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BME501", "name": "Heat & Mass Transfer", "branches": ["ME"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BBT502", "name": "Fermentation Biotechnology", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCE502", "name": "Structural Analysis", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCS502", "name": "Web Technology", "branches": ["CSD", "CSE", "IT"], "is_common": True},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCAI501", "name": "Artificial Intelligence", "branches": ["CSE(AIML)"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEC502", "name": "Microprocessor & Microcontroller", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEE502", "name": "Control System", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BME502", "name": "Machine Design", "branches": ["ME"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BBT055", "name": "Biofuel & Alcohol Technology", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCE051", "name": "Concrete Technology", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCS054", "name": "Object Oriented System Design with C++", "branches": ["CSD", "CSE(AIML)", "CSE", "IT"], "is_common": True},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEC054", "name": "VLSI Technology", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEE052", "name": "Sensors and Transducers", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BME054", "name": "Mechatronic Systems", "branches": ["ME"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BBT503", "name": "Bioinformatic I", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCE503", "name": "Quantity Estimation and Construction Management", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCS503", "name": "Design and Analysis of Algorithm", "branches": ["CSD", "CSE(AIML)", "CSE", "IT"], "is_common": True},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEC503", "name": "Digital Signal Processing", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEE503", "name": "Electrical Machines-II", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BME503", "name": "Industrial Engineering", "branches": ["ME"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BBT052", "name": "Nano Biotechnology", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCE055", "name": "Engineering Hydrology", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCS058", "name": "Data Warehousing & Data Mining", "branches": ["CSD"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BCS056", "name": "Application of Soft Computing", "branches": ["CSE(AIML)", "CSE"], "is_common": True},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEC057", "name": "Optical Communication", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BEE058", "name": "Analog & Digital Communication", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "5th Semester", "code": "BME052", "name": "I.C. Engine Fuel and Lubrication", "branches": ["ME"], "is_common": False},

    # B.TECH 7th SEMESTER
    {"course": "B.Tech", "semester": "7th Semester", "code": "BOE074", "name": "Renewable Energy Resources", "branches": ["BT", "CE", "CSE(AIML)", "CSD", "CSE", "IT", "EC", "EE", "ME"], "is_common": True},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BBT701", "name": "Environmental Biotechnology", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BCE701", "name": "Advanced Structural Design", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BAI701", "name": "Deep Learning", "branches": ["CSE(AIML)"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BCS701", "name": "Artificial Intelligence", "branches": ["CSD", "CSE", "IT"], "is_common": True},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BEC701", "name": "VLSI Design", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BEE701", "name": "Power System Protection", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BME701", "name": "Measurement & Metrology", "branches": ["ME"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BBT074", "name": "Industrial Biotechnology", "branches": ["BT"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BCE070", "name": "Railway, Airway, and Waterway Infrastructure Systems", "branches": ["CE"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BCS070", "name": "Internet of Things", "branches": ["CSE(AIML)", "CSD", "CSE", "IT"], "is_common": True},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BEC076", "name": "Wireless & Mobile Communication", "branches": ["EC"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BEE073", "name": "Power Quality and FACTS", "branches": ["EE"], "is_common": False},
    {"course": "B.Tech", "semester": "7th Semester", "code": "BME072", "name": "Power Plant Engineering", "branches": ["ME"], "is_common": False},

    # MBA 1st SEMESTER
    {"course": "MBA", "semester": "1st Semester", "code": "BMB101", "name": "Management Concepts", "branches": [], "is_common": True},
    {"course": "MBA", "semester": "1st Semester", "code": "BMB102", "name": "Managerial Economics", "branches": [], "is_common": True},
    {"course": "MBA", "semester": "1st Semester", "code": "BMB103", "name": "Financial Accounting & Analysis", "branches": [], "is_common": True},
    {"course": "MBA", "semester": "1st Semester", "code": "BMB104", "name": "Business Statistics & Analytics", "branches": [], "is_common": True},
    {"course": "MBA", "semester": "1st Semester", "code": "BMB105", "name": "Marketing Management", "branches": [], "is_common": True},
    {"course": "MBA", "semester": "1st Semester", "code": "BMB106", "name": "Creativity, Innovation & Entrepreneurship", "branches": [], "is_common": True},
    {"course": "MBA", "semester": "1st Semester", "code": "BMB107", "name": "Business Communication", "branches": [], "is_common": True},

    # MBA 3rd SEMESTER
    {"course": "MBA", "semester": "3rd Semester", "code": "BMB301", "name": "Strategic Management", "branches": [], "is_common": True},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBHR01", "name": "Talent Acquisition Management", "branches": [], "is_common": False, "type": "Elective", "description": "HR Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBIB01", "name": "International Business Management", "branches": [], "is_common": False, "type": "Elective", "description": "IB Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBHR02", "name": "Employees Relations and Labour Laws", "branches": [], "is_common": False, "type": "Elective", "description": "HR Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBIB02", "name": "Export Import Documentation", "branches": [], "is_common": False, "type": "Elective", "description": "IB Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBHR03", "name": "Performance and Reward Management", "branches": [], "is_common": False, "type": "Elective", "description": "HR Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBIB03", "name": "Trade & Geo-Politics", "branches": [], "is_common": False, "type": "Elective", "description": "IB Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBMK01", "name": "Consumer Behaviour and Neuro Marketing", "branches": [], "is_common": False, "type": "Elective", "description": "Marketing Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBIT01", "name": "Software Engineering and Management", "branches": [], "is_common": False, "type": "Elective", "description": "IT Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBMK02", "name": "Marketing & Web Analytics", "branches": [], "is_common": False, "type": "Elective", "description": "Marketing Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBMK03", "name": "Sales & Distribution Management", "branches": [], "is_common": False, "type": "Elective", "description": "Marketing Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBIT02", "name": "Emerging Technologies for Business", "branches": [], "is_common": False, "type": "Elective", "description": "IT Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBFM01", "name": "Investment Analysis And Portfolio Management", "branches": [], "is_common": False, "type": "Elective", "description": "Finance Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBFM02", "name": "Financial Planning and Tax Management", "branches": [], "is_common": False, "type": "Elective", "description": "Finance Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBIT03", "name": "Data Base Management System", "branches": [], "is_common": False, "type": "Elective", "description": "IT Elective"},
    {"course": "MBA", "semester": "3rd Semester", "code": "BMBFM03", "name": "Financial and Credit Risk Analysis", "branches": [], "is_common": False, "type": "Elective", "description": "Finance Elective"},
]

sql_statements = []

# Generate SQL to insert into subjects & subject_branches for colleges
colleges = ["13695a78-0105-4bde-bc85-d664bb66637e", "ea318ebf-893e-410c-a925-ac1d4dc986eb"]

for col_id in colleges:
    for idx, item in enumerate(raw_subjects_data):
        course = item["course"]
        semester = item["semester"]
        code = item["code"]
        name = item["name"].replace("'", "''")
        is_common = item["is_common"]
        branches = item["branches"]
        sub_type = item.get("type", "Theory")
        desc = item.get("description", "").replace("'", "''")
        
        # Primary branch text representation
        if is_common or len(branches) > 1 or len(branches) == 0:
            branch_text = "Common Subject (All Branches)"
            subject_kind = "common"
        else:
            branch_code = branches[0]
            branch_text = BRANCH_MAP.get(branch_code, branch_code)
            subject_kind = "branch_specific"

        # Unique ID for subject
        sub_id = f"sub_{col_id[:6]}_{code.lower()}_{semester.replace(' ', '_').lower()}"
        
        # Convert branches list to SQL Array literal
        branches_sql = "ARRAY[" + ", ".join([f"'{b}'" for b in branches]) + "]" if branches else "ARRAY[]::text[]"
        
        insert_sub_sql = f"""
INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES ('{sub_id}', '{col_id}', '{course}', '{branch_text}', '{semester}', '{name}', '{code}', '{desc}', {str(is_common).lower()}, '{subject_kind}', {branches_sql}, '{sub_type}', 4, 'active')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;
"""
        sql_statements.append(insert_sub_sql)

        # Insert into subject_branches junction table
        for b_code in branches:
            b_name = BRANCH_MAP.get(b_code, b_code).replace("'", "''")
            sb_id = f"sb_{sub_id}_{b_code.lower()}"
            insert_sb_sql = f"""
INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES ('{sb_id}', '{sub_id}', '{b_code}', '{b_name}', '{col_id}')
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;
"""
            sql_statements.append(insert_sb_sql)

with open("scratch/seed_subjects.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print(f"Generated {len(sql_statements)} SQL statements.")
