"use client"

import { useEffect } from "react"

export function DebugEnv() {
  useEffect(() => {
    console.log('🔍 Environment Check:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
        ? 'EXISTS (' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ' chars)'
        : 'MISSING'
    )
  }, [])

  return null
}