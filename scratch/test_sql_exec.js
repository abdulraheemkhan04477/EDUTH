import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSql() {
  console.log('Testing RPC exec...');
  const rpcNames = ['exec_sql', 'exec', 'execute_sql', 'run_sql', 'sql'];
  for (const name of rpcNames) {
    const res = await supabase.rpc(name, { query: 'SELECT 1' });
    console.log(`RPC ${name}:`, res.error ? res.error.message : 'SUCCESS');
  }
}

testSql().catch(console.error);
