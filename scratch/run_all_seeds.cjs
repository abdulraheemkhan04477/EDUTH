const fs = require('fs');

const BRANCH_MAP = {
  'BT': 'Biotechnology',
  'CE': 'Civil Engineering',
  'CSE': 'Computer Science & Engineering',
  'CSD': 'Computer Science & Design',
  'CSE(AIML)': 'CSE (AI/ML)',
  'IT': 'Information Technology',
  'EC': 'Electronics & Communication Engineering',
  'EE': 'Electrical Engineering',
  'ME': 'Mechanical Engineering',
};

const rawSubjectsData = [
  // B.TECH 1st SEMESTER
  { course: "B.Tech", semester: "1st Semester", code: "ACS101", name: "Programming Languages", branches: ["BT", "CE", "CSE", "CSD", "IT", "EC", "EE", "ME"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AAI101", name: "Introduction to AI & Prompt Engineering", branches: ["BT", "CE", "IT", "EC", "EE", "ME"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AAS105", name: "Professional Communication and Technical Writing", branches: ["BT", "CE", "CSD", "EC"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AAS103F", name: "Calculus and Linear Algebra", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AAS103A", name: "Differential Calculus and Linear Algebra", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AAS103D", name: "Calculus and Linear Algebra", branches: ["CSE", "CSE(AIML)", "CSD", "IT"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AAS103C", name: "Differential Calculus and Linear Algebra", branches: ["EC", "EE"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AAS103B", name: "Differential Calculus and Linear Algebra", branches: ["ME"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AAS101F", name: "Physics of Materials and Biomaterials", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AAS101A", name: "Physics for Sustainable Structural Systems", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AAS102D", name: "Applied Chemistry for Smart Systems", branches: ["CSE", "IT"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AAS101E", name: "Quantum Physics and Applications", branches: ["CSD"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AAS101C", name: "Quantum Physics and Electronic Sensors", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AAS101D", name: "Physics of Electrical Engineering Materials", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AAS101B", name: "Physics of Materials", branches: ["ME"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AEC101C", name: "Fundamentals of Electronics Engineering", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AEC101B", name: "Fundamentals of Electronics Engineering", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "1st Semester", code: "AEE101A", name: "Fundamentals of Electrical Engineering", branches: ["CSE", "CSD"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AEC101A", name: "Fundamentals of Electronics Engineering", branches: ["IT", "EC", "EE", "ME"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AME101A", name: "Fundamentals of Mechanical Engineering", branches: ["CSE", "CSD"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AAC101", name: "Environment & Sustainability", branches: ["BT", "CE", "CSD"], is_common: true },
  { course: "B.Tech", semester: "1st Semester", code: "AAS104", name: "Introduction to Indian Knowledge System", branches: ["CSE", "IT"], is_common: true },

  // B.TECH 3rd SEMESTER
  { course: "B.Tech", semester: "3rd Semester", code: "BCC301", name: "Cyber Security", branches: ["BT", "CE", "CSE", "CSE(AIML)", "CSD", "IT", "EC", "EE", "ME"], is_common: true },
  { course: "B.Tech", semester: "3rd Semester", code: "BVE301", name: "Universal Human Values", branches: ["BT", "CE", "CSD", "IT", "EC", "EE", "ME"], is_common: true },
  { course: "B.Tech", semester: "3rd Semester", code: "BBT301", name: "Techniques in Biotechnology", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BCE301", name: "Engg. Mechanics", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BCS301", name: "Data Structure", branches: ["CSE", "CSE(AIML)", "CSD"], is_common: true },
  { course: "B.Tech", semester: "3rd Semester", code: "BEC301", name: "Electronic Devices", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BEE301", name: "Electromagnetic Field Theory", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BME301", name: "Thermodynamics", branches: ["ME"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BBT302", name: "Microbiology and Immunology", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BCE302", name: "Surveying and Geomatics", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BCS302", name: "Computer Organization and Architecture", branches: ["CSE", "CSE(AIML)", "CSD"], is_common: true },
  { course: "B.Tech", semester: "3rd Semester", code: "BEC302", name: "Digital System Design", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BEE302", name: "Electrical Measurements & Instrumentation", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BME302", name: "Fluid Mechanics & Fluid Machines", branches: ["ME"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BAS301", name: "Technical Communication", branches: ["CSE", "CSE(AIML)"], is_common: true },
  { course: "B.Tech", semester: "3rd Semester", code: "BAS304", name: "Maths V", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BOE304", name: "Energy Science and Engineering", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BOE303", name: "Material Science", branches: ["CSE", "CSE(AIML)", "CSD", "IT"], is_common: true },
  { course: "B.Tech", semester: "3rd Semester", code: "BAS303", name: "Mathematics-IV", branches: ["EE", "ME"], is_common: true },
  { course: "B.Tech", semester: "3rd Semester", code: "BBT303", name: "Biochemistry", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BCE303", name: "Fluid Mechanics", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BCS303", name: "Discrete Structures & Theory of Logic", branches: ["CSE", "CSE(AIML)", "CSD"], is_common: true },
  { course: "B.Tech", semester: "3rd Semester", code: "BEC303", name: "Network Analysis & Synthesis", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BEE303", name: "Basic Signals & Systems", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "3rd Semester", code: "BME303", name: "Material Engineering", branches: ["ME"], is_common: false },

  // B.TECH 5th SEMESTER
  { course: "B.Tech", semester: "5th Semester", code: "BNC501", name: "Constitution of India, Law and Engineering", branches: ["BT", "CE", "CSD", "CSE(AIML)", "CSE", "IT", "EC", "EE", "ME"], is_common: true },
  { course: "B.Tech", semester: "5th Semester", code: "BBT501", name: "Genetic Engineering", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCE501", name: "Geotechnical Engineering", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCS501", name: "Database Management System", branches: ["CSD", "CSE(AIML)", "CSE", "IT"], is_common: true },
  { course: "B.Tech", semester: "5th Semester", code: "BEC501", name: "Integrated Circuits", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BEE501", name: "Power System - I", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BME501", name: "Heat & Mass Transfer", branches: ["ME"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BBT502", name: "Fermentation Biotechnology", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCE502", name: "Structural Analysis", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCS502", name: "Web Technology", branches: ["CSD", "CSE", "IT"], is_common: true },
  { course: "B.Tech", semester: "5th Semester", code: "BCAI501", name: "Artificial Intelligence", branches: ["CSE(AIML)"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BEC502", name: "Microprocessor & Microcontroller", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BEE502", name: "Control System", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BME502", name: "Machine Design", branches: ["ME"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BBT055", name: "Biofuel & Alcohol Technology", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCE051", name: "Concrete Technology", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCS054", name: "Object Oriented System Design with C++", branches: ["CSD", "CSE(AIML)", "CSE", "IT"], is_common: true },
  { course: "B.Tech", semester: "5th Semester", code: "BEC054", name: "VLSI Technology", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BEE052", name: "Sensors and Transducers", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BME054", name: "Mechatronic Systems", branches: ["ME"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BBT503", name: "Bioinformatic I", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCE503", name: "Quantity Estimation and Construction Management", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCS503", name: "Design and Analysis of Algorithm", branches: ["CSD", "CSE(AIML)", "CSE", "IT"], is_common: true },
  { course: "B.Tech", semester: "5th Semester", code: "BEC503", name: "Digital Signal Processing", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BEE503", name: "Electrical Machines-II", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BME503", name: "Industrial Engineering", branches: ["ME"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BBT052", name: "Nano Biotechnology", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCE055", name: "Engineering Hydrology", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCS058", name: "Data Warehousing & Data Mining", branches: ["CSD"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BCS056", name: "Application of Soft Computing", branches: ["CSE(AIML)", "CSE"], is_common: true },
  { course: "B.Tech", semester: "5th Semester", code: "BEC057", name: "Optical Communication", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BEE058", name: "Analog & Digital Communication", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "5th Semester", code: "BME052", name: "I.C. Engine Fuel and Lubrication", branches: ["ME"], is_common: false },

  // B.TECH 7th SEMESTER
  { course: "B.Tech", semester: "7th Semester", code: "BOE074", name: "Renewable Energy Resources", branches: ["BT", "CE", "CSE(AIML)", "CSD", "CSE", "IT", "EC", "EE", "ME"], is_common: true },
  { course: "B.Tech", semester: "7th Semester", code: "BBT701", name: "Environmental Biotechnology", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BCE701", name: "Advanced Structural Design", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BAI701", name: "Deep Learning", branches: ["CSE(AIML)"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BCS701", name: "Artificial Intelligence", branches: ["CSD", "CSE", "IT"], is_common: true },
  { course: "B.Tech", semester: "7th Semester", code: "BEC701", name: "VLSI Design", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BEE701", name: "Power System Protection", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BME701", name: "Measurement & Metrology", branches: ["ME"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BBT074", name: "Industrial Biotechnology", branches: ["BT"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BCE070", name: "Railway, Airway, and Waterway Infrastructure Systems", branches: ["CE"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BCS070", name: "Internet of Things", branches: ["CSE(AIML)", "CSD", "CSE", "IT"], is_common: true },
  { course: "B.Tech", semester: "7th Semester", code: "BEC076", name: "Wireless & Mobile Communication", branches: ["EC"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BEE073", name: "Power Quality and FACTS", branches: ["EE"], is_common: false },
  { course: "B.Tech", semester: "7th Semester", code: "BME072", name: "Power Plant Engineering", branches: ["ME"], is_common: false },

  // MBA 1st SEMESTER
  { course: "MBA", semester: "1st Semester", code: "BMB101", name: "Management Concepts", branches: [], is_common: true },
  { course: "MBA", semester: "1st Semester", code: "BMB102", name: "Managerial Economics", branches: [], is_common: true },
  { course: "MBA", semester: "1st Semester", code: "BMB103", name: "Financial Accounting & Analysis", branches: [], is_common: true },
  { course: "MBA", semester: "1st Semester", code: "BMB104", name: "Business Statistics & Analytics", branches: [], is_common: true },
  { course: "MBA", semester: "1st Semester", code: "BMB105", name: "Marketing Management", branches: [], is_common: true },
  { course: "MBA", semester: "1st Semester", code: "BMB106", name: "Creativity, Innovation & Entrepreneurship", branches: [], is_common: true },
  { course: "MBA", semester: "1st Semester", code: "BMB107", name: "Business Communication", branches: [], is_common: true },

  // MBA 3rd SEMESTER
  { course: "MBA", semester: "3rd Semester", code: "BMB301", name: "Strategic Management", branches: [], is_common: true },
  { course: "MBA", semester: "3rd Semester", code: "BMBHR01", name: "Talent Acquisition Management", branches: [], is_common: false, type: "Elective", description: "HR Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBIB01", name: "International Business Management", branches: [], is_common: false, type: "Elective", description: "IB Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBHR02", name: "Employees Relations and Labour Laws", branches: [], is_common: false, type: "Elective", description: "HR Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBIB02", name: "Export Import Documentation", branches: [], is_common: false, type: "Elective", description: "IB Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBHR03", name: "Performance and Reward Management", branches: [], is_common: false, type: "Elective", description: "HR Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBIB03", name: "Trade & Geo-Politics", branches: [], is_common: false, type: "Elective", description: "IB Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBMK01", name: "Consumer Behaviour and Neuro Marketing", branches: [], is_common: false, type: "Elective", description: "Marketing Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBIT01", name: "Software Engineering and Management", branches: [], is_common: false, type: "Elective", description: "IT Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBMK02", name: "Marketing & Web Analytics", branches: [], is_common: false, type: "Elective", description: "Marketing Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBMK03", name: "Sales & Distribution Management", branches: [], is_common: false, type: "Elective", description: "Marketing Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBIT02", name: "Emerging Technologies for Business", branches: [], is_common: false, type: "Elective", description: "IT Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBFM01", name: "Investment Analysis And Portfolio Management", branches: [], is_common: false, type: "Elective", description: "Finance Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBFM02", name: "Financial Planning and Tax Management", branches: [], is_common: false, type: "Elective", description: "Finance Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBIT03", name: "Data Base Management System", branches: [], is_common: false, type: "Elective", description: "IT Elective" },
  { course: "MBA", semester: "3rd Semester", code: "BMBFM03", name: "Financial and Credit Risk Analysis", branches: [], is_common: false, type: "Elective", description: "Finance Elective" },
];

const colleges = ["13695a78-0105-4bde-bc85-d664bb66637e", "ea318ebf-893e-410c-a925-ac1d4dc986eb"];

// Build Multi-row SQL Insert statements
let subjectsValueTuples = [];
let branchesValueTuples = [];

for (const col_id of colleges) {
  for (const item of rawSubjectsData) {
    const course = item.course;
    const semester = item.semester;
    const code = item.code;
    const name = item.name.replace(/'/g, "''");
    const is_common = item.is_common;
    const branches = item.branches;
    const sub_type = item.type || "Theory";
    const desc = (item.description || "").replace(/'/g, "''");

    let branch_text;
    let subject_kind;

    if (is_common || branches.length > 1 || branches.length === 0) {
      branch_text = "Common Subject (All Branches)";
      subject_kind = "common";
    } else {
      const branch_code = branches[0];
      branch_text = BRANCH_MAP[branch_code] || branch_code;
      subject_kind = "branch_specific";
    }

    const sub_id = `sub_${col_id.substring(0, 6)}_${code.toLowerCase()}_${semester.replace(/\s+/g, "_").toLowerCase()}`;
    const branches_sql = branches.length > 0 ? `ARRAY[${branches.map(b => `'${b}'`).join(", ")}]` : "ARRAY[]::text[]";

    subjectsValueTuples.push(`('${sub_id}', '${col_id}', '${course}', '${branch_text}', '${semester}', '${name}', '${code}', '${desc}', ${is_common}, '${subject_kind}', ${branches_sql}, '${sub_type}', 4, 'active')`);

    for (const b_code of branches) {
      const b_name = (BRANCH_MAP[b_code] || b_code).replace(/'/g, "''");
      const sb_id = `sb_${sub_id}_${b_code.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      branchesValueTuples.push(`('${sb_id}', '${sub_id}', '${b_code}', '${b_name}', '${col_id}')`);
    }
  }
}

const subjectsQuery = `
INSERT INTO public.subjects (id, college_id, course, branch, semester, name, code, description, is_common, subject_type, applicable_branches, type, credits, status)
VALUES
${subjectsValueTuples.join(',\n')}
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  code = EXCLUDED.code, 
  branch = EXCLUDED.branch, 
  is_common = EXCLUDED.is_common, 
  subject_type = EXCLUDED.subject_type, 
  applicable_branches = EXCLUDED.applicable_branches;
`;

const branchesQuery = `
INSERT INTO public.subject_branches (id, subject_id, branch_code, branch_name, college_id)
VALUES
${branchesValueTuples.join(',\n')}
ON CONFLICT (id) DO UPDATE SET branch_name = EXCLUDED.branch_name;
`;

fs.writeFileSync('scratch/query_subjects.sql', subjectsQuery, 'utf-8');
fs.writeFileSync('scratch/query_branches.sql', branchesQuery, 'utf-8');
console.log(`Subjects Query size: ${subjectsQuery.length} bytes, Branches Query size: ${branchesQuery.length} bytes.`);
