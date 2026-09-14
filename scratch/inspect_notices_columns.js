import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectNotices() {
  console.log('--- Inspecting notices table ---');
  const { data, error } = await supabase.from('notices').select('*').limit(1);
  console.log('Error:', error?.message);
  console.log('Sample row:', data);

  // We can insert a test row to see allowed columns
  const testRow = {
    title: 'Test Notice',
    description: 'Test Description',
    priority: 'high',
    author: 'Admin',
    date: '2026-09-07',
    course: 'B.Tech',
    branch: 'ECE',
    year: '3rd Year',
    semester: 'Semester 5',
    publish_status: 'published',
  };

  const insertRes = await supabase.from('notices').insert([testRow]).select();
  console.log('Insert test result:', insertRes.data, 'Error:', insertRes.error?.message);

  if (insertRes.data?.[0]?.id) {
    await supabase.from('notices').delete().eq('id', insertRes.data[0].id);
    console.log('Test notice cleaned up.');
  }
}

inspectNotices();
