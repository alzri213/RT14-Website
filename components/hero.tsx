"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowDown, Users, Home, Heart } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const fullText = "Selamat Datang di RT 14"
  const [displayed, setDisplayed] = useState("")
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let typingSpeed = 100

    if (!isDeleting && index === fullText.length) {
      typingSpeed = 3000
      setTimeout(() => setIsDeleting(true), typingSpeed)
      return
    }

    if (isDeleting && index === 0) {
      setIsDeleting(false)
    }

    const timeout = setTimeout(() => {
      const newIndex = isDeleting ? index - 1 : index + 1
      setIndex(newIndex)
      setDisplayed(fullText.substring(0, newIndex))
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [index, isDeleting, fullText])

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-foreground"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="absolute inset-0 bg-[url('/indonesian-batik-pattern-subtle.jpg')] opacity-5"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200/30 dark:bg-emerald-800/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-teal-200/30 dark:bg-teal-800/30 rounded-full animate-bounce delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-emerald-300/30 dark:bg-emerald-900/30 rounded-full animate-bounce"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-balance mt-16 sm:mt-20 md:mt-0">
            {displayed.split("RT 14").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-emerald-600">RT 14</span>}
              </span>
            ))}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Membangun komunitas yang harmonis, gotong royong, dan sejahtera bersama warga RT 14
          </p>

          {/* Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg backdrop-blur-sm">
              <Users className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">150+</p>
                <p className="text-sm text-muted-foreground">Kepala Keluarga</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg backdrop-blur-sm">
              <Home className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">75</p>
                <p className="text-sm text-muted-foreground">Rumah</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg backdrop-blur-sm">
              <Heart className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">25+</p>
                <p className="text-sm text-muted-foreground">Kegiatan/Tahun</p>
              </div>
            </div>
          </div>

          {/* Tombol + Scroll Indicator */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative">
            <Link href="/#galeri" passHref>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Lihat Galeri Kegiatan
              </Button>
            </Link>

            <Link href="/#kontak" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900 bg-transparent"
              >
                Hubungi Pengurus
              </Button>
            </Link>

            {/* Scroll Indicator */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Gradasi bawah */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-emerald-50 dark:to-gray-900"></div>
    </section>
  )
}
