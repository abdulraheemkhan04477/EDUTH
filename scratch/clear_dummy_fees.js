import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function clearDummyFees() {
  console.log('Inspecting fee_payments...')
  const { data: payments, error: pErr } = await supabase.from('fee_payments').select('*')
  if (pErr) console.error('Error fetching payments:', pErr)
  else console.log(`Found ${payments?.length || 0} fee payments.`)

  console.log('Inspecting fee_structures...')
  const { data: structs, error: sErr } = await supabase.from('fee_structures').select('*')
  if (sErr) console.error('Error fetching structures:', sErr)
  else console.log(`Found ${structs?.length || 0} fee structures.`)

  console.log('Clearing fee_payments and fee_structures from Supabase...')
  const { error: delP } = await supabase.from('fee_payments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (delP) console.error('Error deleting fee_payments:', delP)
  else console.log('Successfully cleared fee_payments!')

  const { error: delS } = await supabase.from('fee_structures').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (delS) console.error('Error deleting fee_structures:', delS)
  else console.log('Successfully cleared fee_structures!')
}

clearDummyFees()
