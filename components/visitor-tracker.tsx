"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const recordVisit = async () => {
      if (!pathname || pathname.startsWith('/admin')) return

      try {
        // Generate or get session ID
        let sessionId = localStorage.getItem('visitor_session_id')
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem('visitor_session_id', sessionId)
        }

        const visitData = {
          page: pathname,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          session_id: sessionId,
        }

        console.log('📝 Recording visit:', visitData)

        const response = await fetch('/api/visits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData),
        })

        if (!response.ok) {
          console.error('Failed to record visit:', response.statusText)
        } else {
          console.log('✅ Visit recorded successfully')
        }
      } catch (error) {
        console.error('❌ Error recording visit:', error)
      }
    }

    recordVisit()
  }, [pathname])

  return null
}
