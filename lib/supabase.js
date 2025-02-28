import { createClient } from '@supabase/supabase-js'

// デバッグ用ログ
console.log("Init Supabase with URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// 実際のSupabaseのAPIキーを入力（Supabaseダッシュボードから取得）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rndmoyifjwtuxlvspevo.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// オプションを追加
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) 
