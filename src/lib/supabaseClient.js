// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// 아래 두 줄은 .env.local 에서 값을 불러옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)