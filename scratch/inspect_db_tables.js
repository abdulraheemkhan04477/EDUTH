import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log('--- TABLES CHECK ---');
  const tables = ['notices', 'attendance', 'students', 'teachers', 'parents', 'colleges', 'courses', 'branches', 'exams', 'results', 'fee_structures', 'fee_payments', 'profiles', 'announcements', 'notifications'];
  
  for (const table of tables) {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Table '${table}': ERROR - ${error.message} (${error.code})`);
    } else {
      console.log(`Table '${table}': EXISTS, count=${count}`);
      // get 1 sample row to see columns
      const { data: sample } = await supabase.from(table).select('*').limit(1);
      if (sample && sample.length > 0) {
        console.log(`  Columns in '${table}':`, Object.keys(sample[0]));
      }
    }
  }
}

inspect();
