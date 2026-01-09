import { createClient } from '@supabase/supabase-js'

// 服务端 Supabase 客户端（使用 Service Role Key，绕过 RLS）
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    // 在开发环境中提供更详细的错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Missing Supabase environment variables!')
      console.error('Please check your .env.local file and ensure the following variables are set:')
      console.error('  - NEXT_PUBLIC_SUPABASE_URL')
      console.error('  - SUPABASE_SERVICE_ROLE_KEY')
      console.error('\nSee docs/supabase-setup.md for setup instructions.')
    }
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// 客户端 Supabase 客户端（使用 Anon Key，受 RLS 保护）
export function createClientClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Missing Supabase environment variables!')
      console.error('Please check your .env.local file and ensure the following variables are set:')
      console.error('  - NEXT_PUBLIC_SUPABASE_URL')
      console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
      console.error('\nSee docs/supabase-setup.md for setup instructions.')
    }
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
