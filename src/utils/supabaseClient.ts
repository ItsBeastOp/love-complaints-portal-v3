import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
'https://fugsnzkpdkrkrtkhtaou.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1Z3NuemtwZGtya3J0a2h0YW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDg3NjUsImV4cCI6MjA2MzMyNDc2NX0.WC0GAf3ppZmGb1_IFpRF2TQqoBCs-ehaBlN4WyWloqk'
export const supabase = createClient(supabaseUrl, supabaseKey)
