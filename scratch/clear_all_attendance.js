import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function clearAttendance() {
  console.log('Fetching existing attendance records...')
  const { data, count, error: fetchErr } = await supabase.from('attendance').select('*', { count: 'exact' })
  if (fetchErr) {
    console.error('Error fetching attendance:', fetchErr)
  } else {
    console.log(`Found ${data?.length || count} attendance records.`)
  }

  console.log('Deleting all attendance records from Supabase...')
  const { data: delData, error: delErr } = await supabase
    .from('attendance')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all rows

  if (delErr) {
    console.error('Error deleting attendance:', delErr)
  } else {
    console.log('Successfully deleted all attendance records from Supabase!')
  }
}

clearAttendance()
