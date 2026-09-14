import { btechStudents } from './data_btech.js';
import { diplomaStudents } from './data_diploma.js';
import { mbaStudents } from './data_mba.js';

const allStudents = [
  ...btechStudents.map(s => ({ ...s, src: 'btech' })),
  ...diplomaStudents.map(s => ({ ...s, src: 'diploma' })),
  ...mbaStudents.map(s => ({ ...s, src: 'mba' }))
];

const rollMap = new Map();
const emailMap = new Map();

allStudents.forEach((s, idx) => {
  const r = s.roll_no.toLowerCase();
  const e = s.email.toLowerCase();
  if (rollMap.has(r)) {
    console.log(`Duplicate Roll: ${r}`, rollMap.get(r), { idx, s });
  } else {
    rollMap.set(r, { idx, s });
  }
  if (emailMap.has(e)) {
    console.log(`Duplicate Email: ${e}`, emailMap.get(e), { idx, s });
  } else {
    emailMap.set(e, { idx, s });
  }
});
