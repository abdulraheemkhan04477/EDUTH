import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log('--- TNP TABLES CHECK ---');
  const tnpTables = [
    'tnp_companies',
    'tnp_placement_drives',
    'tnp_placement_applications',
    'tnp_selection_rounds',
    'tnp_selection_results',
    'tnp_internships',
    'tnp_internship_applications',
    'tnp_trainings',
    'tnp_training_registrations',
    'tnp_events',
    'tnp_event_registrations',
    'tnp_placements'
  ];
  
  for (const table of tnpTables) {
    const res = await supabase.from(table).select('*');
    if (res.error) {
      console.log(`Table '${table}': ERROR - ${res.error.message} (${res.error.code})`);
    } else {
      console.log(`Table '${table}': EXISTS, row count: ${res.data.length}`);
    }
  }
}

inspect();
