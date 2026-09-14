import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCols() {
  const possibleCols = ['id', 'college_id', 'title', 'description', 'content', 'priority', 'author', 'author_name', 'date', 'course', 'branch', 'year', 'semester', 'publish_status', 'created_at', 'updated_at', 'target_audience'];
  
  for (const col of possibleCols) {
    const { error } = await supabase.from('notices').select(col).limit(1);
    if (error) {
      console.log(`Column '${col}': MISSING (${error.message})`);
    } else {
      console.log(`Column '${col}': EXISTS`);
    }
  }
}

checkCols();
