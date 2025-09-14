"use client"

import type React from "react"
import { useState } from "react"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { easeInOut } from "framer-motion"

export function AdminLogin() {
  const { login } = useAdminAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(username, password)
    if (!result.success) {
      setError(result.message || "Login gagal")
    }

    setIsLoading(false)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeInOut } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: easeInOut },
    }),
  }

  const iconVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: { repeat: Infinity, duration: 2, ease: easeInOut },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-950 p-4">
      <motion.div
        className="w-full max-w-md bg-background dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-lg"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <CardHeader className="text-center">
          <motion.div
            className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4"
            variants={iconVariants}
            animate="animate"
          >
            <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
          </motion.div>
          <motion.div custom={0} variants={itemVariants}>
            <CardTitle className="text-2xl font-bold text-foreground dark:text-white">Admin RT 14</CardTitle>
          </motion.div>
          <motion.div custom={1} variants={itemVariants}>
            <p className="text-muted-foreground dark:text-gray-300">Masuk untuk mengelola website</p>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div custom={2} variants={itemVariants}>
              <Label htmlFor="username" className="dark:text-gray-200">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </motion.div>

            <motion.div custom={3} variants={itemVariants}>
              <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
                  )}
                </Button>
              </div>
            </motion.div>

            {error && (
              <motion.div custom={4} variants={itemVariants}>
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-md">
                  {error}
                </div>
              </motion.div>
            )}

            <motion.div custom={5} variants={itemVariants}>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </motion.div>
    </div>
  )
}
