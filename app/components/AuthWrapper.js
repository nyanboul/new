import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export function AuthWrapper({ children }) {
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event)
      console.log("Session exists:", !!session)
      
      // 必要に応じてリダイレクト処理
      if (event === 'SIGNED_IN' && router.pathname === '/login') {
        router.push('/')
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  return <>{children}</>
} 
