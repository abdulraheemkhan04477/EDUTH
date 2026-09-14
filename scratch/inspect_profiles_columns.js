import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumns() {
  const candidateColumns = [
    'id', 'user_id', 'college_id', 'school_id', 'role', 'name', 'email',
    'phone', 'status', 'created_at', 'updated_at', 'teacher_id', 'student_id',
    'parent_id', 'child_student_id', 'avatar_url'
  ];

  console.log('Testing column existence on public.profiles...');
  for (const col of candidateColumns) {
    const res = await supabase.from('profiles').select(col).limit(1);
    if (res.error) {
      console.log(`Column '${col}': DOES NOT EXIST (error: ${res.error.message})`);
    } else {
      console.log(`Column '${col}': EXISTS`);
    }
  }
}

checkColumns().catch(console.error);
