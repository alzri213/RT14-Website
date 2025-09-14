"use client"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const { isAdmin } = useAdminAuth()

  // Jika belum login, tampilkan halaman login
  if (!isAdmin) {
    return <AdminLogin />
  }

  // Jika sudah login, tampilkan dashboard
  return <AdminDashboard />
}
