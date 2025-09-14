export interface GalleryItem {
  id: string
  title: string
  category: "kabar" | "kegiatan"
  image: string
  date: string
  description: string
  likes: number
  uploadedBy: string
  uploadDate: string
}

const STORAGE_KEY = "rt14_gallery_photos"

// Default photos data
const defaultPhotos: GalleryItem[] = [
  {
    id: "1",
    title: "Gotong Royong Membersihkan Lingkungan",
    category: "kegiatan",
    image: "/community-cleaning-activity-indonesia.jpg",
    date: "15 Januari 2024",
    description: "Kegiatan gotong royong rutin bulanan untuk menjaga kebersihan lingkungan RT 14",
    likes: 24,
    uploadedBy: "admin",
    uploadDate: "2024-01-15",
  },
  {
    id: "2",
    title: "Pengumuman Iuran Bulanan",
    category: "kabar",
    image: "/community-announcement-board-indonesia.jpg",
    date: "10 Januari 2024",
    description: "Informasi terkait iuran bulanan dan penggunaan dana kas RT",
    likes: 12,
    uploadedBy: "admin",
    uploadDate: "2024-01-10",
  },
  {
    id: "3",
    title: "Perayaan 17 Agustus",
    category: "kegiatan",
    image: "/indonesian-independence-day-celebration-community.jpg",
    date: "17 Agustus 2023",
    description: "Perayaan kemerdekaan Indonesia dengan berbagai lomba dan kegiatan seru",
    likes: 45,
    uploadedBy: "admin",
    uploadDate: "2023-08-17",
  },
  {
    id: "4",
    title: "Jadwal Ronda Malam",
    category: "kabar",
    image: "/night-patrol-schedule-community-board.jpg",
    date: "5 Januari 2024",
    description: "Jadwal ronda malam untuk menjaga keamanan lingkungan RT 14",
    likes: 18,
    uploadedBy: "admin",
    uploadDate: "2024-01-05",
  },
  {
    id: "5",
    title: "Arisan RT Bulanan",
    category: "kegiatan",
    image: "/community-gathering-arisan-indonesia.jpg",
    date: "20 Desember 2023",
    description: "Kegiatan arisan bulanan yang mempererat silaturahmi antar warga",
    likes: 32,
    uploadedBy: "admin",
    uploadDate: "2023-12-20",
  },
  {
    id: "6",
    title: "Info Vaksinasi COVID-19",
    category: "kabar",
    image: "/covid-vaccination-announcement-indonesia.jpg",
    date: "28 Desember 2023",
    description: "Informasi jadwal vaksinasi COVID-19 untuk warga RT 14",
    likes: 28,
    uploadedBy: "admin",
    uploadDate: "2023-12-28",
  },
]

export class PhotoStorage {
  static getPhotos(): GalleryItem[] {
    if (typeof window === "undefined") return defaultPhotos

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("Error loading photos from storage:", error)
    }

    // Initialize with default photos if none exist
    this.setPhotos(defaultPhotos)
    return defaultPhotos
  }

  static setPhotos(photos: GalleryItem[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))
      // Dispatch custom event to notify components of changes
      window.dispatchEvent(new CustomEvent("photosUpdated", { detail: photos }))
    } catch (error) {
      console.error("Error saving photos to storage:", error)
    }
  }

  static addPhoto(photo: Omit<GalleryItem, "id" | "uploadDate" | "uploadedBy">): GalleryItem {
    const newPhoto: GalleryItem = {
      ...photo,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split("T")[0],
      uploadedBy: "admin",
      likes: 0,
    }

    const photos = this.getPhotos()
    const updatedPhotos = [newPhoto, ...photos]
    this.setPhotos(updatedPhotos)

    return newPhoto
  }

  static deletePhoto(id: string): void {
    const photos = this.getPhotos()
    const updatedPhotos = photos.filter((photo) => photo.id !== id)
    this.setPhotos(updatedPhotos)
  }

  static updatePhoto(id: string, updates: Partial<GalleryItem>): void {
    const photos = this.getPhotos()
    const updatedPhotos = photos.map((photo) => (photo.id === id ? { ...photo, ...updates } : photo))
    this.setPhotos(updatedPhotos)
  }

  static likePhoto(id: string): void {
    const photos = this.getPhotos()
    const updatedPhotos = photos.map((photo) => (photo.id === id ? { ...photo, likes: photo.likes + 1 } : photo))
    this.setPhotos(updatedPhotos)
  }
}
