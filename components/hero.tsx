"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowDown, Users, Home, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

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
      {/* Background Pattern with Parallax */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-teal-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div
          className="absolute inset-0 bg-[url('/indonesian-batik-pattern-subtle.jpg')] opacity-10"
          style={{ transform: 'translateY(var(--scroll-y, 0))' }}
        ></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-4 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-emerald-200/40 dark:bg-emerald-800/40 rounded-full shadow-lg"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "loop", delay: 1 }}
      />
      <motion.div
        className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 bg-teal-200/40 dark:bg-teal-800/40 rounded-full shadow-lg"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "loop", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-40 left-4 sm:left-20 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-300/40 dark:bg-emerald-900/40 rounded-full shadow-lg"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-balance mt-16 sm:mt-20 md:mt-0 glow">
            {displayed.split("RT 14").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-emerald-600">RT 14</span>}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto"
          >
            Membangun komunitas yang harmonis, gotong royong, dan sejahtera bersama warga RT 14
          </motion.p>

          {/* Statistik */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 max-w-2xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
              className="flex items-center justify-center space-x-3 p-4 sm:p-6 bg-card/80 rounded-xl backdrop-blur-md shadow-xl border border-emerald-200/20 dark:border-emerald-800/20 transition-all duration-300"
            >
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold">150+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Kepala Keluarga</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
              className="flex items-center justify-center space-x-3 p-4 sm:p-6 bg-card/80 rounded-xl backdrop-blur-md shadow-xl border border-emerald-200/20 dark:border-emerald-800/20 transition-all duration-300"
            >
              <Home className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold">75</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Rumah</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
              className="flex items-center justify-center space-x-3 p-4 sm:p-6 bg-card/80 rounded-xl backdrop-blur-md shadow-xl border border-emerald-200/20 dark:border-emerald-800/20 transition-all duration-300"
            >
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold">25+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Kegiatan/Tahun</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Tombol + Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center relative"
          >
            <Link href="/#galeri" passHref>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] sm:min-w-0">
                Lihat Galeri Kegiatan
              </Button>
            </Link>

            <Link href="/#kontak" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900 bg-transparent shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] sm:min-w-0"
              >
                Hubungi Pengurus
              </Button>
            </Link>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Gradasi bawah */}
      <div className="absolute bottom-0 left-0 w-full h-32 sm:h-48 bg-gradient-to-b from-transparent to-emerald-100 dark:to-gray-900"></div>
    </section>
  )
}
