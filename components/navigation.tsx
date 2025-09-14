"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield, Moon, Sun } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Toggle dark mode di html
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  }, [theme])

  const navItems = [
    { href: "#beranda", label: "Beranda" },
    { href: "#tentang", label: "Tentang RT 14" },
    { href: "#galeri", label: "Galeri" },
    { href: "#kontak", label: "Kontak" },
  ]

  const hoverEffect =
    "hover:text-emerald-600 hover:scale-105 hover:shadow-md transition-all duration-200"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo pakai foto */}
          <div className={`flex items-center space-x-2 ${hoverEffect}`}>
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
              <img
                src="/logo-rt14.jpg" // taruh file di public/logo-rt14.png
                alt="Logo RT 14"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground dark:text-white">RT 14</h1>
              <p className="text-xs text-muted-foreground dark:text-gray-300">Rukun Tetangga</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-foreground dark:text-gray-200 font-medium ${hoverEffect}`}
              >
                {item.label}
              </a>
            ))}

            {/* Tombol ganti tema */}
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${hoverEffect}`}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === "light" ? "Dark" : "Light"}
            </Button>

            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 bg-transparent text-foreground dark:text-gray-200 ${hoverEffect}`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className={hoverEffect + " md:hidden"}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation dengan animasi smooth */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100 py-4 border-t border-border" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-foreground dark:text-gray-200 font-medium py-2 ${hoverEffect}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}

            {/* Tombol tema mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`flex items-center gap-2 justify-start ${hoverEffect}`}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === "light" ? "Dark" : "Light"}
            </Button>

            <Link href="/admin" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 w-full justify-start bg-transparent text-foreground dark:text-gray-200 ${hoverEffect}`}
              >
                <Shield className="h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
