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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:rotate-1 dark:bg-gray-800 border-0 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-emerald-200 group-hover:to-emerald-300 dark:group-hover:from-emerald-800 dark:group-hover:to-emerald-700 transition-all duration-300 shadow-lg">
                  <feature.icon className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pengurus Section */}
        <div className="bg-gradient-to-br from-white via-emerald-50/30 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-3xl p-10 shadow-xl border border-emerald-100/50 dark:border-gray-600/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400"></div>
          <h3 className="text-3xl font-bold text-center text-foreground dark:text-white mb-12">
            Pengurus RT 14
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-white dark:border-gray-700">
                <span className="text-white text-3xl font-bold">KR</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground dark:text-white mb-2">Ketua RT</h4>
              <p className="text-muted-foreground dark:text-gray-300 font-medium">BPK Asep Muhamad Iyas</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-3 leading-relaxed">Memimpin dan mengkoordinasi kegiatan RT</p>
            </div>
            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-white dark:border-gray-700">
                <span className="text-white text-3xl font-bold">SR</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground dark:text-white mb-2">Sekretaris</h4>
              <p className="text-muted-foreground dark:text-gray-300 font-medium">BPK Ardi Utama</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-3 leading-relaxed">Mengelola administrasi dan dokumentasi</p>
            </div>
            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-white dark:border-gray-700">
                <span className="text-white text-3xl font-bold">BR</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground dark:text-white mb-2">Bendahara</h4>
              <p className="text-muted-foreground dark:text-gray-300 font-medium">BPK Hasan S.</p>
              <p className="text-muted-foreground dark:text-gray-300 font-medium">BPK Widi A.</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-3 leading-relaxed">Mengelola keuangan dan kas RT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient at bottom to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-emerald-50 dark:to-gray-900"></div>
    </section>
  )
}
