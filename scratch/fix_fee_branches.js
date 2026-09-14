import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixBranchNames() {
  await supabase.auth.signInWithPassword({
    email: 'teacher07bt24ece00101@gmail.com',
    password: '07bt24ece00101'
  });

  const collegeId = '13695a78-0105-4bde-bc85-d664bb66637e';

  // 1. Fix "B.Tech ECE annual fees structure" branch to "ECE"
  const res1 = await supabase
    .from('fee_structures')
    .update({ branch: 'ECE' })
    .eq('id', '8244daa5-2cdd-4626-ae65-425a1ed69b36');

  console.log('Update B.Tech ECE structure:', res1.error ? res1.error.message : 'SUCCESS');

  // 2. Fix "MBA Finance annual fees structure" branch to "Finance"
  const res2 = await supabase
    .from('fee_structures')
    .update({ branch: 'Finance' })
    .eq('id', '86b8c8e4-0c9f-487a-81b9-e9f092a9a01a');

  console.log('Update MBA Finance structure:', res2.error ? res2.error.message : 'SUCCESS');

  // 3. Verify
  const { data: updated } = await supabase
    .from('fee_structures')
    .select('id, title, course, branch, year_semester, total_amount')
    .in('id', ['8244daa5-2cdd-4626-ae65-425a1ed69b36', '86b8c8e4-0c9f-487a-81b9-e9f092a9a01a']);

  console.log('Updated structures:', updated);
}

fixBranchNames().catch(console.error);
