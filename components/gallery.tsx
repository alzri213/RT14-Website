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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Galeri RT 14</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Dokumentasi kegiatan dan informasi terkini dari RT 14
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => {
                setActiveCategory(category.id as any)
                setVisibleCount(6)
                setShowAll(false) // ✅ Reset showAll saat ganti kategori
              }}
              className={`flex items-center space-x-2 ${activeCategory === category.id
                ? "bg-primary hover:bg-primary/90 text-background"
                : "border-border text-foreground hover:bg-primary/10 bg-background dark:text-white dark:border-white"
                }`}
            >
              <category.icon className="h-4 w-4" />
              <span>{category.label}</span>
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
            {visibleItems.map((item) => (
              <Card
                key={item.id}
                className="min-w-[250px] flex-shrink-0 relative group overflow-hidden"
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
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {overlayVisibleId === item.id && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-white text-black px-3 py-1"
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
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white text-black rounded hover:bg-gray-200"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <Badge
                      variant={item.category === "kegiatan" ? "default" : "secondary"}
                      className={
                        item.category === "kegiatan"
                          ? "bg-primary text-background"
                          : "bg-teal-600 text-background"
                      }
                    >
                      {item.category === "kegiatan" ? "Kegiatan" : "Katar"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    {item.description}
                  </p>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleItems.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden group">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => {
                      setCurrentPhoto({ image: item.image, title: item.title })
                      setLightboxOpen(true)
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      className="bg-white text-black px-3 py-1"
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
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white text-black rounded hover:bg-gray-200"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant={item.category === "kegiatan" ? "default" : "secondary"}
                      className={
                        item.category === "kegiatan"
                          ? "bg-primary text-background"
                          : "bg-teal-600 text-background"
                      }
                    >
                      {item.category === "kegiatan" ? "Kegiatan" : "Katar"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-3 text-balance group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-300 text-pretty">{item.description}</p>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
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