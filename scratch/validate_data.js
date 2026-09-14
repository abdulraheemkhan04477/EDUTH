import { btechStudents } from './data_btech.js';
import { diplomaStudents } from './data_diploma.js';
import { mbaStudents } from './data_mba.js';

console.log('BTech count:', btechStudents.length);
console.log('Diploma count:', diplomaStudents.length);
console.log('MBA count:', mbaStudents.length);

const allStudents = [...btechStudents, ...diplomaStudents, ...mbaStudents];
console.log('Total students:', allStudents.length);

// Validate unique emails and roll numbers
const rollNos = new Set();
const emails = new Set();
const duplicateRolls = [];
const duplicateEmails = [];

allStudents.forEach((s, idx) => {
  if (!s.roll_no || !s.name || !s.email || !s.dob || !s.parent_name || !s.course || !s.branch || !s.year || !s.semester || !s.section) {
    console.error(`Row ${idx} missing fields:`, s);
  }
  const r = s.roll_no.toLowerCase();
  const e = s.email.toLowerCase();
  if (rollNos.has(r)) duplicateRolls.push(r);
  else rollNos.add(r);
  
  if (emails.has(e)) duplicateEmails.push(e);
  else emails.add(e);
});

console.log('Duplicate roll numbers:', duplicateRolls.length);
console.log('Duplicate emails:', duplicateEmails.length);

// Sample records
console.log('Sample BTech:', btechStudents[0]);
console.log('Sample Diploma:', diplomaStudents[0]);
console.log('Sample MBA:', mbaStudents[0]);
