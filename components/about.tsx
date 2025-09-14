"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, MapPin, Calendar, Award } from "lucide-react"

export function About() {
  const features = [
    {
      icon: Users,
      title: "Gotong Royong",
      description: "Membangun semangat kebersamaan dan saling membantu antar warga RT 14",
    },
    {
      icon: MapPin,
      title: "Lokasi Strategis",
      description: "Terletak di area yang mudah diakses dengan fasilitas lengkap",
    },
    {
      icon: Calendar,
      title: "Kegiatan Rutin",
      description: "Mengadakan berbagai kegiatan komunitas secara berkala",
    },
    {
      icon: Award,
      title: "Prestasi Terbaik",
      description: "Meraih berbagai penghargaan sebagai RT terbaik di kelurahan",
    },
  ]

  return (
    <section
      id="tentang"
      className="
        relative 
        py-20 
        bg-gradient-to-b 
        from-emerald-50 
        via-white 
        to-emerald-50/30 
        dark:from-gray-900 
        dark:via-gray-900 
        dark:to-gray-800
      "
    >
      {/* Pattern */}
      <div className="absolute inset-0 bg-[url('/indonesian-batik-pattern-subtle.jpg')] opacity-5 pointer-events-none"></div>

      {/* Gradient at top to blend with previous section */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-t from-transparent to-emerald-50 dark:to-gray-900"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-6">
            Tentang RT 14
          </h2>
          <p className="text-xl text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto">
            RT 14 adalah komunitas yang terdiri dari warga yang peduli dan aktif dalam membangun lingkungan yang nyaman,
            aman, dan sejahtera untuk semua keluarga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800"
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                  <feature.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pengurus Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
          <h3 className="text-3xl font-bold text-center text-foreground dark:text-white mb-8">
            Pengurus RT 14
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">KR</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground dark:text-white">Ketua RT</h4>
              <p className="text-muted-foreground dark:text-gray-300">BPK Asep Muhamad Iyas</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">Memimpin dan mengkoordinasi kegiatan RT</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">SR</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground dark:text-white">Sekretaris</h4>
              <p className="text-muted-foreground dark:text-gray-300">BPK Ardi Utama</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">Mengelola administrasi dan dokumentasi</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">BR</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground dark:text-white">Bendahara</h4>
              <p className="text-muted-foreground dark:text-gray-300">BPK Hasan S.</p>
              <p className="text-muted-foreground dark:text-gray-300">BPK Widi A.</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">Mengelola keuangan dan kas RT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient at bottom to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-emerald-50 dark:to-gray-900"></div>
    </section>
  )
}
