import { createClient } from '@supabase/supabase-js'

// 環境変数をログに出力（デバッグ用）
console.log("Init Supabase with URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("Key starts with:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 5))

// デフォルト値を設定（本番環境でundefinedの場合に使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rndmoyifjwtuxlvspevo.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-from-supabase-dashboard'

export const supabase = createClient(supabaseUrl, supabaseKey) 
