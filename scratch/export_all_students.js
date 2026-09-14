import { btechStudents } from './data_btech.js';
import { diplomaStudents } from './data_diploma.js';
import { mbaStudents } from './data_mba.js';
import fs from 'fs';

// Fix MBA missing fields (rows 174 to 200)
// Ensure every student has roll_no, name, parent_name, parent_email, dob, course, branch, year, semester, section, class_name
const fixedMba = mbaStudents.map(s => {
  const roll_lower = s.roll_no.toLowerCase();
  const parent_name = s.father || s.parent_name || 'Parent/Guardian';
  const parent_email = `father01${roll_lower}@gmail.com`;
  const section = s.section || 'Section A';
  const class_name = `${s.course} ${s.branch} - ${s.year} (${s.semester} - ${section})`;
  return {
    ...s,
    parent_name,
    parent_email,
    section,
    class_name
  };
});

const fixedDiploma = diplomaStudents.map(s => {
  const roll_lower = s.roll_no.toLowerCase();
  const parent_name = s.father || s.parent_name || 'Parent/Guardian';
  const parent_email = `father01${roll_lower}@gmail.com`;
  const section = s.section || 'Section A';
  const class_name = `${s.course} ${s.branch} - ${s.year} (${s.semester} - ${section})`;
  return {
    ...s,
    parent_name,
    parent_email,
    section,
    class_name
  };
});

// For BTech, fix row 27 roll_no/email if needed (e.g. BT24ME004B or similar) and ensure rows 245-280 match PDF
const fixedBtech = btechStudents.map((s, idx) => {
  let roll_no = s.roll_no;
  let email = s.email;
  
  // Row 27 in PDF had duplicate BT24ME004
  if (s.s_no === 27 && s.roll_no === 'BT24ME004') {
    roll_no = 'BT24ME004B';
    email = 'studentbt24me004b@gmail.com';
  }
  
  const roll_lower = roll_no.toLowerCase();
  const parent_name = s.father || s.parent_name || 'Parent/Guardian';
  const parent_email = `father01${roll_lower}@gmail.com`;
  const section = s.section || 'Section A';
  const class_name = `${s.course} ${s.branch} - ${s.year} (${s.semester} - ${section})`;
  
  return {
    ...s,
    roll_no,
    email,
    parent_name,
    parent_email,
    section,
    class_name
  };
});

console.log('Fixed BTech count:', fixedBtech.length);
console.log('Fixed Diploma count:', fixedDiploma.length);
console.log('Fixed MBA count:', fixedMba.length);

const all = [...fixedBtech, ...fixedDiploma, ...fixedMba];
console.log('Total combined:', all.length);

// Check uniqueness
const rolls = new Set();
const emails = new Set();
let dupRoll = 0, dupEmail = 0;
all.forEach(s => {
  if (rolls.has(s.roll_no.toLowerCase())) {
    console.log('Dup roll:', s.roll_no, s.s_no, s.course);
    dupRoll++;
  } else {
    rolls.add(s.roll_no.toLowerCase());
  }
  if (emails.has(s.email.toLowerCase())) {
    console.log('Dup email:', s.email, s.s_no, s.course);
    dupEmail++;
  } else {
    emails.add(s.email.toLowerCase());
  }
});

console.log('Duplicate rolls count:', dupRoll);
console.log('Duplicate emails count:', dupEmail);

fs.writeFileSync('./scratch/all_800_students.json', JSON.stringify(all, null, 2));
console.log('Successfully written scratch/all_800_students.json');
