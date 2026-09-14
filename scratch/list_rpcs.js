import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listRpcs() {
  console.log('Testing known RPCs...');
  const rpcs = [
    'create_app_user',
    'create_college_with_admin',
    'update_college_and_admin',
    'delete_college_cascade'
  ];

  for (const rpc of rpcs) {
    const res = await supabase.rpc(rpc, {});
    console.log(`RPC ${rpc} error:`, res.error?.message);
  }
}

listRpcs().catch(console.error);
