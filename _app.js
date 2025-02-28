import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("SUPABASE KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 5) + "...")
  }, [])
  
  return <Component {...pageProps} />
}

export default MyApp 
