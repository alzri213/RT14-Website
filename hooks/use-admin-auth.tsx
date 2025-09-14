"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // aman: hanya jalan di client
    const loggedIn = localStorage.getItem("rt14_admin_logged_in") === "true";
    setIsAdmin(loggedIn);
    setIsLoading(false);
  }, []);

  const login = useCallback(() => {
    localStorage.setItem("rt14_admin_logged_in", "true");
    setIsAdmin(true);
    router.push("/admin/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("rt14_admin_logged_in");
    setIsAdmin(false);
    router.push("/admin/login");
  }, [router]);

  // ✅ gunakan state supaya aman di server
  const isLoggedIn = useCallback(() => {
    return isAdmin;
  }, [isAdmin]);

  return { isAdmin, isLoading, login, logout, isLoggedIn };
}
