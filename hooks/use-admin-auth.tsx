"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("admins")
      .select("id, email, password_hash")
      .eq("email", email)
      .single()

    if (error || !data) {
      setIsAdmin(false)
      setIsLoading(false)
      return { success: false, message: "Email tidak ditemukan" }
    }

    const isValid = await bcrypt.compare(password, data.password_hash)
    if (isValid) {
      setIsAdmin(true)
      setIsLoading(false)
      return { success: true }
    } else {
      setIsAdmin(false)
      setIsLoading(false)
      return { success: false, message: "Password salah" }
    }
  }, [])

  const logout = useCallback(() => {
    setIsAdmin(false)
  }, [])

  const isLoggedIn = useCallback(() => isAdmin, [isAdmin])

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return { isAdmin, isLoading, login, logout, isLoggedIn }
}
