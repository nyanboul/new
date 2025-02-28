import { useEffect } from 'react'
import { AuthWrapper } from '../components/AuthWrapper'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("SUPABASE KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }, [])
  
  return (
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>
  )
}

export default MyApp 
