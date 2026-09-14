import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jgadivbsvztsppdnzctp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function inspect() {
  const { data: students, error: errS } = await supabase.from('students').select('*').limit(5)
  if (errS) console.error('Error fetching students:', errS)
  else {
    console.log('Sample student columns:', Object.keys(students?.[0] || {}))
    console.log('Sample student:', students?.[0])
  }

  const { data: allStudents, error: errAll } = await supabase.from('students').select('id, name, course, branch, year, section, class_name')
  if (!errAll) {
    console.log('Total students:', allStudents.length)
    const counts = {}
    allStudents.forEach(s => {
      const key = `${s.course} ${s.branch} - ${s.year} - ${s.section}`
      counts[key] = (counts[key] || 0) + 1
    })
    console.log('Student counts per class:', JSON.stringify(counts, null, 2))
  }
}

inspect()
