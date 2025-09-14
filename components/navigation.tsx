"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield, Moon, Sun, Home, Info, Image, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Toggle dark mode di html
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  }, [theme])

  // Reset selected item after animation
  useEffect(() => {
    if (selectedItem) {
      const timer = setTimeout(() => setSelectedItem(null), 300)
      return () => clearTimeout(timer)
    }
  }, [selectedItem])

  const navItems = [
    { href: "#beranda", label: "Beranda", icon: Home },
    { href: "#tentang", label: "Tentang RT 14", icon: Info },
    { href: "#galeri", label: "Galeri", icon: Image },
    { href: "#kontak", label: "Kontak", icon: Mail },
  ]

  const hoverEffect =
    "hover:text-emerald-600 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-emerald-100/50 dark:border-gray-700/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo pakai foto */}
          <div className={`flex items-center space-x-3 group cursor-pointer ${hoverEffect}`}>
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:shadow-emerald-500/30 transition-all duration-300 border-2 border-emerald-100 dark:border-gray-600">
              <img
                src="/logo-rt14.jpg" // taruh file di public/logo-rt14.png
                alt="Logo RT 14"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">RT 14</h1>
              <p className="text-xs text-muted-foreground dark:text-gray-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors duration-300">Rukun Tetangga</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative text-foreground dark:text-gray-200 font-medium py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-800 transition-all duration-300 group ${hoverEffect.replace('hover:scale-105', '')}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </a>
            ))}

            {/* Tombol ganti tema */}
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-300 ${hoverEffect.replace('hover:scale-105', '')}`}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <div className="relative">
                <Moon className={`h-4 w-4 absolute transition-all duration-500 ${theme === "light" ? "rotate-0 opacity-100" : "rotate-180 opacity-0"}`} />
                <Sun className={`h-4 w-4 transition-all duration-500 ${theme === "light" ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}`} />
              </div>
              <span className="text-sm font-medium">{theme === "light" ? "Dark" : "Light"}</span>
            </Button>

            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 p-2 rounded-lg border-emerald-200 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-gray-400 bg-gradient-to-r from-transparent to-emerald-50/50 dark:from-transparent dark:to-gray-700/50 hover:from-emerald-100/50 dark:hover:to-gray-600/50 transition-all duration-300 ${hoverEffect.replace('hover:scale-105', '')}`}
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
            className={`p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-300 md:hidden ${hoverEffect.replace('hover:scale-105', '')}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative w-5 h-5">
              <Menu className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}`} />
              <X className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"}`} />
            </div>
          </Button>
        </div>

        {/* Mobile Navigation Sidebar with blur & smooth effect */}
        <div
          className={`fixed top-0 left-0 h-full w-64 sm:w-56 bg-black/70 dark:bg-gray-900/70 backdrop-blur-2xl shadow-xl border-r border-emerald-100 dark:border-gray-700 rounded-tr-2xl rounded-br-2xl z-50 transform transition-transform duration-500 ease-in-out md:hidden ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-5 border-b border-emerald-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shadow-md">
                <img
                  src="/logo-rt14.jpg"
                  alt="Logo RT 14"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-bold text-base text-foreground dark:text-white">RT 14</h2>
                <p className="text-xs text-muted-foreground dark:text-gray-300">Menu</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col p-5 space-y-3 overflow-y-auto">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setIsOpen(false)
                  setSelectedItem(item.href)
                }}
                className={`flex items-center space-x-3 text-foreground dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-all duration-300 group ${
                  selectedItem === item.href
                    ? "bg-emerald-100 dark:bg-emerald-700 scale-105 shadow-lg shadow-emerald-400/50"
                    : "hover:bg-emerald-50 dark:hover:bg-gray-700"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="relative">
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            ))}

            <Separator className="my-4" />

            {/* Tombol tema mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`flex items-center gap-3 justify-start py-3 px-4 rounded-lg hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-300 ${hoverEffect.replace(
                "hover:scale-105",
                ""
              )}`}
            >
              <div className="relative">
                <Moon
                  className={`h-4 w-4 absolute transition-all duration-500 ${
                    theme === "light" ? "rotate-0 opacity-100" : "rotate-180 opacity-0"
                  }`}
                />
                <Sun
                  className={`h-4 w-4 transition-all duration-500 ${
                    theme === "light" ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                  }`}
                />
              </div>
              {theme === "light" ? "Dark" : "Light"}
            </Button>

            <Link href="/admin" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-3 w-full justify-start py-3 px-4 rounded-lg border-emerald-200 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-gray-400 bg-gradient-to-r from-transparent to-emerald-50/50 dark:from-transparent dark:to-gray-700/50 hover:from-emerald-100/50 dark:hover:to-gray-600/50 transition-all duration-300 ${hoverEffect.replace(
                  "hover:scale-105",
                  ""
                )}`}
              >
                <Shield className="h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 md:hidden ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
        />
      </div>
    </nav>
  )
}
