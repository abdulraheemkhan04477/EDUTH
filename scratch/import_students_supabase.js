// scratch/import_students_supabase.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jgadivbsvztsppdnzctp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRpdmJzdnp0c3BwZG56Y3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDc2NDgsImV4cCI6MjEwMzcyMzY0OH0.fm9X51_tVvdDTweIUs1_jV3GSElOA6x7mQQUYa0e8dA'
const COLLEGE_ID = '13695a78-0105-4bde-bc85-d664bb66637e'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
console.log('Supabase client initialized for RRIMT:', COLLEGE_ID)
