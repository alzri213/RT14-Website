"use client"

import { useState, useEffect } from "react"
import { AdminDashboard } from "@/components/admin-dashboard"
import { supabase } from "@/lib/supabase"

// Buat wrapper component untuk menambahkan fitur tracking pengunjung
function VisitorTracker() {
  useEffect(() => {
    const recordVisit = async () => {
      try {
        await supabase
          .from('visits')
          .insert({ 
            page: window.location.pathname,
            user_agent: navigator.userAgent,
          })
      } catch (error) {
        console.error('Error recording visit:', error)
      }
    }
    
    // Hanya rekam kunjungan jika di halaman utama (bukan admin)
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      recordVisit()
    }
  }, [])
  
  return null
}

// Buat component terpisah untuk menangani data pengunjung
function DashboardWithVisitorData() {
  const [visits, setVisits] = useState<any[]>([])
  const [loadingVisits, setLoadingVisits] = useState(false)

  // Effect untuk mengambil data pengunjung
  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    setLoadingVisits(true)
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .order('timestamp', { ascending: false })
    
    if (!error && data) setVisits(data)
    setLoadingVisits(false)
  }

  // Hitung total pengunjung unik (berdasarkan hari)
  const totalVisitors = new Set(visits.map(v => 
    new Date(v.timestamp).toLocaleDateString('id-ID')
  )).size

  // Kirim data pengunjung ke AdminDashboard melalui props
  return (
    <>
      <VisitorTracker />
      <AdminDashboard 
        visitorStats={{
          totalVisitors,
          totalVisits: visits.length,
          recentVisits: visits.slice(0, 5)
        }}
        loadingVisits={loadingVisits}
      />
    </>
  )
}

export default function DashboardPage() {
  return <DashboardWithVisitorData />
}