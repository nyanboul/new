// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rndmoyifjwtuxlvspevo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZG1veWlmand0dXhsdnNwZXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NjA2NTIsImV4cCI6MjA1NjAzNjY1Mn0.gQ8BtNCKSciJ3Z2MAJ3A4Oo7KhbkVYKx-W-v_Y0qOO0' // Supabaseダッシュボードの「Project Settings > API」から取得
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase