import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const COLLEGE_ID = '13695a78-0105-4bde-bc85-d664bb66637e';

async function importAllStudents() {
  const fileContent = fs.readFileSync('./scratch/all_800_students.json', 'utf-8');
  const students = JSON.parse(fileContent);

  console.log(`Starting bulk import of ${students.length} students & parent accounts for RRIMT...`);

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  const batchSize = 10;
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (s) => {
        const rollLower = s.roll_no.toLowerCase().trim();
        const studentId = `STU-${s.roll_no.toUpperCase()}`;
        const studentEmail = s.email.toLowerCase().trim();
        const studentPass = rollLower;

        const parentEmail = `father01${rollLower}@gmail.com`;
        const parentPass = `01${rollLower}`;
        const parentName = s.parent_name || s.father || 'Parent/Guardian';

        try {
          // 1. Create Student
          const stuRes = await supabase.rpc('create_app_user', {
            p_email: studentEmail,
            p_password: studentPass,
            p_role: 'student',
            p_college_id: COLLEGE_ID,
            p_name: s.name,
            p_phone: s.phone || null,
            p_extra_data: {
              student_id: studentId,
              roll_no: s.roll_no,
              dob: s.dob,
              gender: s.gender || 'Female',
              blood_group: s.blood_group || 'A+',
              address: s.address || 'Lucknow',
              parent_name: parentName,
              parent_phone: s.parent_phone || null,
              parent_email: parentEmail,
              course: s.course,
              branch: s.branch,
              year: s.year,
              semester: s.semester,
              section: s.section || 'Section A',
              class_name: s.class_name || `${s.course} ${s.branch} - ${s.year}`
            }
          });

          // 2. Create Parent
          const parRes = await supabase.rpc('create_app_user', {
            p_email: parentEmail,
            p_password: parentPass,
            p_role: 'parent',
            p_college_id: COLLEGE_ID,
            p_name: parentName,
            p_phone: s.parent_phone || null,
            p_extra_data: {
              child_student_id: studentId,
              student_roll_no: s.roll_no,
              student_name: s.name
            }
          });

          if (stuRes.data || stuRes.error?.message?.includes('already registered') || stuRes.error?.message?.includes('duplicate')) {
            successCount++;
          } else {
            console.error(`Error importing student ${s.roll_no}:`, stuRes.error);
            errorCount++;
          }
        } catch (err) {
          console.error(`Exception importing ${s.roll_no}:`, err);
          errorCount++;
        }
      })
    );

    if ((i + batchSize) % 50 === 0 || i + batchSize >= students.length) {
      console.log(`Processed ${Math.min(i + batchSize, students.length)} / ${students.length} (Success: ${successCount}, Errors: ${errorCount})`);
    }
  }

  console.log(`\nImport complete! Total processed: ${students.length}, Success: ${successCount}, Errors: ${errorCount}`);
}

importAllStudents().catch(console.error);
