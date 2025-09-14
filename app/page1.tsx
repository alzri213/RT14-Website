// Di bagian atas file, tambahkan import
'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Di dalam komponen utama, tambahkan effect untuk mencatat kunjungan
useEffect(() => {
  const recordVisit = async () => {
    try {
      await supabase
        .from('visits')
        .insert({ 
          page: window.location.pathname,
          user_agent: navigator.userAgent,
          // Catatan: mendapatkan IP address membutuhkan API khusus
        })
    } catch (error) {
      console.error('Error recording visit:', error)
    }
  }
  
  recordVisit()
}, [])