"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

interface AdminAuthContextType {
  isAdmin: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoggedIn: () => boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loggedIn = localStorage.getItem("rt14_admin_logged_in") === "true"
    setIsAdmin(loggedIn)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true)
    if (username === "admin" && password === "rt14admin") {
      localStorage.setItem("rt14_admin_logged_in", "true")
      setIsAdmin(true)
      setIsLoading(false)
      return { success: true }
    } else {
      setIsLoading(false)
      return { success: false, message: "Username atau password salah" }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("rt14_admin_logged_in")
    setIsAdmin(false)
  }, [])

  const isLoggedIn = useCallback(() => isAdmin, [isAdmin])

  return (
    <AdminAuthContext.Provider value={{ isAdmin, isLoading, login, logout, isLoggedIn }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
