import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addCols() {
  console.log('Testing RPC or alter table...');
  // Let's check available RPCs
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: "ALTER TABLE notices ADD COLUMN IF NOT EXISTS year VARCHAR(50) DEFAULT 'all', ADD COLUMN IF NOT EXISTS semester VARCHAR(50) DEFAULT 'all';" });
  console.log('RPC exec_sql result:', data, 'Error:', error?.message);
}

addCols();
