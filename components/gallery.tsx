"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Calendar, Users, Plus, Shield, Download, X, ChevronDown } from "lucide-react"
import { PhotoUploadModal } from "@/components/photo-upload-modal"
import { usePhotos } from "@/hooks/use-photos"

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<"all" | "katar" | "kegiatan">("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { photos, isLoading, addPhoto } = usePhotos()

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState<{ image: string; title: string } | null>(null)

  const [visibleCount, setVisibleCount] = useState(6)
  const [showAll, setShowAll] = useState(false) // ✅ State baru untuk muat semua
  const [overlayVisibleId, setOverlayVisibleId] = useState<string | null>(null)

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("rt14_admin_logged_in") === "true"
    setIsAdmin(adminLoggedIn)
  }, [])

  const handlePhotoUpload = async (uploadData: any) => {
    const processedPhotos = await Promise.all(
      uploadData.files.map(
        (file: File) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.readAsDataURL(file)
          }),
      ),
    )

    for (let i = 0; i < processedPhotos.length; i++) {
      const imageDataUrl = processedPhotos[i]
      const photoTitle =
        uploadData.files.length > 1 ? `${uploadData.title} (${i + 1})` : uploadData.title

      await addPhoto({
        title: photoTitle,
        category: uploadData.category,
        image: imageDataUrl,
        date: uploadData.date,
        description: uploadData.description,
      })
    }

    setIsUploadModalOpen(false)
  }

  const filteredItems = photos.filter((item) => activeCategory === "all" || item.category === activeCategory)
  
  // ✅ Tentukan items yang akan ditampilkan
  const visibleItems = showAll 
    ? filteredItems // Tampilkan semua jika showAll true
    : filteredItems.slice(0, visibleCount) // Tampilkan sebagian jika showAll false

  const categories = [
    { id: "all", label: "Semua", icon: Camera },
    { id: "katar", label: "Katar RT", icon: Calendar },
    { id: "kegiatan", label: "Kegiatan Warga", icon: Users },
  ]

  // Animation styles for gallery photos
  const photoAnimation = {
    initial: { opacity: 0, transform: "translateZ(-100px) scale(0.9)" },
    animate: { opacity: 1, transform: "translateZ(0) scale(1)" },
    transition: { duration: 0.8, ease: "easeOut" },
  }

  if (isLoading) {
    return (
      <section id="galeri" className="py-20 relative bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          <div className="absolute inset-0 bg-[url('/indonesian-batik-pattern-subtle.jpg')] opacity-5"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat galeri...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="galeri" className="py-20 relative">
      {/* GRADIENT ATAS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-t from-transparent to-emerald-50 dark:to-gray-900"></div>
        <div className="absolute inset-0 bg-[url('/indonesian-batik-pattern-subtle.jpg')] opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent mb-8 text-balance animate-fade-in-up">
              Galeri RT 14
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-8"></div>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed animate-fade-in-up animation-delay-200">
            Dokumentasi kegiatan dan informasi terkini dari RT 14
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {categories.map((category, index) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => {
                setActiveCategory(category.id as any)
                setVisibleCount(6)
                setShowAll(false) // ✅ Reset showAll saat ganti kategori
              }}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/30 group ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/50"
                  : "border-2 border-emerald-200 dark:border-gray-600 text-foreground dark:text-white hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-gray-700 dark:hover:to-gray-600 bg-white dark:bg-gray-800 hover:border-emerald-400 dark:hover:border-gray-400"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <category.icon className={`h-5 w-5 transition-transform duration-300 group-hover:rotate-12 ${activeCategory === category.id ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
              <span className="font-semibold">{category.label}</span>
            </Button>
          ))}
        </div>

        {/* Upload Button */}
        {isAdmin && (
          <div className="flex justify-center mb-12">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center space-x-2"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
              <span>Upload Foto Baru</span>
            </Button>
          </div>
        )}

        {/* Admin Login */}
        {!isAdmin && (
          <div className="flex justify-center mb-12">
            <div className="text-center p-6 bg-muted rounded-lg border border-border dark:border-white">
              <Shield className="h-8 w-8 text-primary dark:text-white mx-auto mb-3" />
              <p className="text-foreground dark:text-white font-medium mb-2">
                Hanya Admin yang dapat mengunggah foto
              </p>
              <p className="text-muted-foreground dark:text-gray-300 text-sm mb-4">
                Masuk sebagai admin untuk mengelola galeri
              </p>
              <Button
                variant="outline"
                className="border-border text-foreground dark:border-white dark:text-white hover:bg-primary/10 bg-transparent"
                onClick={() => window.open("/admin", "_blank")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Login Admin
              </Button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="mb-8">
          {/* Mobile horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto md:hidden pb-4 scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-transparent">
            {visibleItems.map((item, index) => (
              <Card
                key={item.id}
                className="min-w-[260px] flex-shrink-0 relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-500/15 transition-all duration-400 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div
                  className="relative"
                  onClick={() =>
                    setOverlayVisibleId(
                      overlayVisibleId === item.id ? null : item.id
                    )
                  }
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-all duration-600 group-hover:scale-105 group-hover:brightness-105 group-hover:saturate-110"
                  />

                  {overlayVisibleId === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center pb-3 transition-all duration-400">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-white/95 text-black px-3 py-1.5 rounded-lg hover:bg-white transition-all duration-200 hover:scale-102"
                          onClick={() => {
                            setCurrentPhoto({
                              image: item.image,
                              title: item.title,
                            })
                            setLightboxOpen(true)
                          }}
                        >
                          Show
                        </Button>
                        <a
                          href={item.image || "/placeholder.svg"}
                          download={item.title}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/95 text-black rounded-lg hover:bg-white transition-all duration-200 hover:scale-102"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={item.category === "kegiatan" ? "default" : "secondary"}
                      className={`px-2 py-0.5 rounded-md font-medium text-xs ${
                        item.category === "kegiatan"
                          ? "bg-emerald-500 text-white"
                          : "bg-teal-500 text-white"
                      }`}
                    >
                      {item.category === "kegiatan" ? "Kegiatan" : "Katar"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-base font-semibold text-foreground dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground dark:text-gray-300 mb-1 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="text-xs text-muted-foreground font-medium">{item.date}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 perspective-1000">
            {visibleItems.map((item, index) => (
              <Card
                key={item.id}
                className="group overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-700 hover:-translate-y-4 hover:scale-[1.05] hover:rotate-0 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-gray-700/30 border-0"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative overflow-hidden group rounded-t-3xl">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-1000 cursor-pointer filter group-hover:contrast-110"
                    onClick={() => {
                      setCurrentPhoto({ image: item.image, title: item.title })
                      setLightboxOpen(true)
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                    <div className="flex gap-4 transform translate-z-0 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <Button
                        size="sm"
                        className="bg-white/95 backdrop-blur-md text-black px-5 py-2 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                        onClick={() => {
                          setCurrentPhoto({ image: item.image, title: item.title })
                          setLightboxOpen(true)
                        }}
                      >
                        Show
                      </Button>
                      <a
                        href={item.image || "/placeholder.svg"}
                        download={item.title}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-white/95 backdrop-blur-md text-black rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  </div>
                  <div className="absolute top-6 left-6">
                    <Badge
                      variant={item.category === "kegiatan" ? "default" : "secondary"}
                      className={`px-4 py-2 rounded-full font-bold shadow-xl backdrop-blur-sm ${
                        item.category === "kegiatan"
                          ? "bg-emerald-500/90 text-white"
                          : "bg-teal-500/90 text-white"
                      }`}
                    >
                      {item.category === "kegiatan" ? "Kegiatan" : "Katar"}
                    </Badge>
                  </div>
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">+</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-4 text-balance group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-300 text-pretty mb-4 leading-relaxed">{item.description}</p>
                  <span className="text-sm text-muted-foreground font-semibold bg-emerald-100 dark:bg-gray-700 px-3 py-1 rounded-full">{item.date}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Load More - MOBILE */}
        {visibleCount < filteredItems.length && (
          <div className="text-center mt-4 md:hidden">
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground dark:border-white dark:text-white hover:bg-primary/10 bg-background"
              onClick={() => setVisibleCount((prev) => prev + 6)}
            >
              Muat Lebih Banyak
            </Button>
          </div>
        )}

        {/* ✅ Load More / Show All - DESKTOP ONLY */}
        <div className="hidden md:flex justify-center mt-8">
          {!showAll && filteredItems.length > 6 && (
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground dark:border-white dark:text-white hover:bg-primary/10 bg-background flex items-center gap-2"
              onClick={() => setShowAll(true)}
            >
              <ChevronDown className="h-5 w-5" />
              Muat Semua ({filteredItems.length} foto)
            </Button>
          )}
          {showAll && filteredItems.length > 6 && (
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground dark:border-white dark:text-white hover:bg-primary/10 bg-background"
              onClick={() => setShowAll(false)}
            >
              Tampilkan Sedikit
            </Button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-3xl w-full">
            <img
              src={currentPhoto.image}
              alt={currentPhoto.title}
              className="w-full max-h-[80vh] object-contain mx-auto rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <a
              href={currentPhoto.image}
              download={currentPhoto.title}
              className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 text-black px-3 py-1 rounded hover:bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-4 h-4" /> Download
            </a>
          </div>
        </div>
      )}

      {isAdmin && (
        <PhotoUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handlePhotoUpload}
        />
      )}

      {/* GRADIENT BAWAH */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-emerald-50 dark:to-gray-900"></div>
    </section>
  )
}