"use client"

import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const { isAdmin, isLoading, login } = useAdminAuth()

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-300">Memuat...</p>
        </div>
      </div>
    )
  }

  // Jika belum login tampilkan halaman login
  if (!isAdmin) {
    return <AdminLogin onLogin={login} />
  }

  // Jika sudah login tampilkan dashboard
  return <AdminDashboard />
}
