import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCols() {
  const candidateCols = [
    'id',
    'college_id',
    'student_id',
    'fee_structure_id',
    'structure_id',
    'fee_id',
    'receipt_no',
    'receipt_number',
    'student_name',
    'roll_no',
    'course',
    'branch',
    'year_semester',
    'year',
    'semester',
    'amount',
    'payment_method',
    'method',
    'transaction_id',
    'payment_date',
    'date',
    'remarks',
    'status',
    'created_at',
    'updated_at'
  ];

  for (const col of candidateCols) {
    const res = await supabase.from('fee_payments').select(col).limit(1);
    if (res.error) {
      console.log(`Column '${col}': ❌ NOT FOUND (${res.error.message})`);
    } else {
      console.log(`Column '${col}': ✅ EXISTS`);
    }
  }
}

testCols().catch(console.error);
