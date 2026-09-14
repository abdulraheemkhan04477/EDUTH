import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function inspectFeeRecords() {
  console.log('--- Inspection of Supabase Tables ---')
  const { data: students, error: sErr } = await supabase.from('students').select('*')
  console.log(`students count: ${students?.length || 0}`)
  if (students && students.length > 0) {
    console.log('Students sample:', students.map(s => ({ id: s.id, name: s.name, roll_no: s.roll_no, email: s.email })))
  }

  const { data: sf, error: sfErr } = await supabase.from('student_fees').select('*')
  console.log(`student_fees count: ${sf?.length || 0}`)
  if (sf && sf.length > 0) {
    console.log('student_fees sample:', sf)
  }

  const { data: fp, error: fpErr } = await supabase.from('fee_payments').select('*')
  console.log(`fee_payments count: ${fp?.length || 0}`)
  if (fp && fp.length > 0) {
    console.log('fee_payments sample:', fp)
  }

  const { data: fs, error: fsErr } = await supabase.from('fee_structures').select('*')
  console.log(`fee_structures count: ${fs?.length || 0}`)
  if (fs && fs.length > 0) {
    console.log('fee_structures sample:', fs)
  }
}

inspectFeeRecords()
