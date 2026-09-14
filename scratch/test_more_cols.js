import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMoreCols() {
  const cols = ['installment_id', 'installment_name', 'received_by'];
  for (const col of cols) {
    const res = await supabase.from('fee_payments').select(col).limit(1);
    console.log(`Column '${col}':`, res.error ? `❌ ${res.error.message}` : '✅ EXISTS');
  }
}

checkMoreCols().catch(console.error);
