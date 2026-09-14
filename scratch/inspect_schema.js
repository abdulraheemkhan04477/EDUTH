import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectSchema() {
  console.log('Inspecting schema info...');

  // Check what tables are exposed in public
  const tablesToTest = ['profiles', 'colleges', 'teachers', 'students', 'classes', 'attendance', 'fee_structures', 'fee_payments', 'parents'];
  for (const t of tablesToTest) {
    const res = await supabase.from(t).select('*').limit(1);
    console.log(`Table ${t}: status=${res.status}, error=${res.error ? res.error.message : 'NONE'}`);
    if (res.data && res.data.length > 0) {
      console.log(`  Columns for ${t}:`, Object.keys(res.data[0]));
    }
  }
}

inspectSchema().catch(console.error);
