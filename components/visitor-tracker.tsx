"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { usePathname } from "next/navigation"

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    console.log('🔍 VisitorTracker: Debugging Supabase...')
    
    const testSupabase = async () => {
      try {
        console.log('Testing Supabase connection...')
        
        // Test select query
        const { data, error } = await supabase
          .from('visits')
          .select('count')
          .limit(1)

        if (error) {
          console.error('❌ SUPABASE ERROR:', error)
          console.error('Message:', error.message)
          console.error('Details:', error.details)
          console.error('Hint:', error.hint)
        } else {
          console.log('✅ Supabase connected successfully:', data)
        }
      } catch (error) {
        console.error('❌ UNEXPECTED ERROR:', error)
      }
    }

    testSupabase()

    // ... kode tracking visitor yang asli
    if (pathname && !pathname.startsWith('/admin')) {
      console.log('📝 Recording visit to:', pathname)
      // ... kode insert visit
    }
  }, [pathname])

  return null
}