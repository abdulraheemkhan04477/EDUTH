import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function inspectStudents() {
  const { data, error } = await supabase.from('students').select('*')
  if (error) console.error('Error fetching students:', error)
  else {
    console.log(`Total students in Supabase: ${data.length}`)
    console.log(data.slice(0, 10))
  }
}

inspectStudents()
