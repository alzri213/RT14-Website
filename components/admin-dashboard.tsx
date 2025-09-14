"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { usePhotos } from "@/hooks/use-photos"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  LogOut,
  Upload,
  ImageIcon,
  MessageSquare,
  BarChart3,
  Settings,
  Trash2,
  Edit,
  Eye,
  Moon,
  Sun,
  Users,
  Calendar,
} from "lucide-react"
import { PhotoUploadModal } from "@/components/photo-upload-modal"

interface Comment {
  id: string
  name: string
  message: string
  created_at: string
}

interface Message {
  id: number
  name: string
  phone: string
  subject: string
  message: string
  created_at: string
}

interface Visit {
  id: string
  page: string
  timestamp: string
  user_agent: string
}

export function AdminDashboard() {
  const router = useRouter()
  const { logout, isLoggedIn } = useAdminAuth()
  const { photos, addPhoto, deletePhoto, editPhoto } = usePhotos()
  const [activeTab, setActiveTab] = useState("overview")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  
  // State untuk data pengunjung
  const [visits, setVisits] = useState<Visit[]>([])
  const [loadingVisits, setLoadingVisits] = useState(false)

  // Proteksi halaman
  useEffect(() => {
    if (!isLoggedIn()) router.push("/admin/login")
  }, [router, isLoggedIn])

  // Dark mode
  useEffect(() => {
    const html = document.documentElement
    if (darkMode) html.classList.add("dark")
    else html.classList.remove("dark")
  }, [darkMode])

  // Komentar realtime
  useEffect(() => {
    fetchComments()
    const subscription = supabase
      .channel("public:comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => setComments((prev) => [payload.new as Comment, ...prev])
      )
      .subscribe()
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  // Data pengunjung
  useEffect(() => {
    fetchVisits()
    const subscription = supabase
      .channel("public:visits")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "visits" },
        (payload) => setVisits((prev) => [payload.new as Visit, ...prev])
      )
      .subscribe()
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const fetchVisits = async () => {
    setLoadingVisits(true)
    const { data, error } = await supabase
      .from("visits")
      .select("*")
      .order("timestamp", { ascending: false })
    if (!error && data) setVisits(data as Visit[])
    setLoadingVisits(false)
  }

  const fetchComments = async () => {
    setLoadingComments(true)
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) setComments(data as Comment[])
    setLoadingComments(false)
  }

  // Pesan realtime
  useEffect(() => {
    fetchMessages()
    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => setMessages((prev) => [payload.new as Message, ...prev])
      )
      .subscribe()
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const fetchMessages = async () => {
    setLoadingMessages(true)
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) setMessages(data as Message[])
    setLoadingMessages(false)
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm("Hapus komentar ini?")) return
    const { error } = await supabase.from("comments").delete().eq("id", id)
    if (!error) setComments((prev) => prev.filter((c) => c.id !== id))
  }

  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Hapus pesan ini?")) return
    const { error } = await supabase.from("messages").delete().eq("id", id)
    if (!error) setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  // Upload foto → base64
  const handlePhotoUpload = async (uploadData: any) => {
    const processedPhotos = await Promise.all(
      uploadData.files.map(
        (file: File) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.readAsDataURL(file)
          })
      )
    )
    for (let i = 0; i < processedPhotos.length; i++) {
      const imageDataUrl = processedPhotos[i]
      const photoTitle =
        uploadData.files.length > 1
          ? `${uploadData.title} (${i + 1})`
          : uploadData.title
      await addPhoto({
        title: photoTitle,
        category: uploadData.category,
        image: imageDataUrl, // base64 dikirim ke hook usePhotos
        date: uploadData.date,
        description: uploadData.description,
      })
    }
    setIsUploadModalOpen(false)
  }

  const handleDeletePhoto = (id: string) => {
    if (!confirm("Hapus foto ini?")) return
    deletePhoto(id)
  }

  const handleEditPhoto = (photo: any) => setEditingPhoto(photo)

  const handleSaveEdit = () => {
    if (editingPhoto) {
      editPhoto(editingPhoto.id, {
        title: editingPhoto.title,
        category: editingPhoto.category,
        description: editingPhoto.description,
      })
      setEditingPhoto(null)
    }
  }

  // Ambil URL publik jika image = path storage
  const getPhotoUrl = (photo: any) => {
    if (!photo.image) return null
    if (photo.image.startsWith("data:image")) return photo.image
    return supabase.storage.from("photos").getPublicUrl(photo.image).data.publicUrl
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "photos", label: "Kelola Foto", icon: ImageIcon },
    { id: "comments", label: "Komentar", icon: MessageSquare },
    { id: "messages", label: "Pesan Cepat", icon: MessageSquare },
    { id: "visitors", label: "Pengunjung", icon: Users },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  // Hitung statistik pengunjung
  const totalVisits = visits.length
  const uniqueVisitors = new Set(visits.map(v => 
    new Date(v.timestamp).toLocaleDateString('id-ID')
  )).size

  const todayVisits = visits.filter(v => 
    new Date(v.timestamp).toLocaleDateString('id-ID') === new Date().toLocaleDateString('id-ID')
  ).length

  const stats = {
    totalPhotos: photos.length,
    totalComments: comments.length,
    totalVisitors: uniqueVisitors,
    totalVisits: totalVisits,
    todayVisits: todayVisits,
    totalMessages: messages.length,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
              Admin Dashboard RT 14
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-center space-x-2 dark:text-white dark:border-gray-400 w-full sm:w-auto"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("/", "_blank")}
                className="flex items-center justify-center space-x-2 dark:text-white dark:border-gray-400 w-full sm:w-auto"
              >
                <Eye className="h-4 w-4" />
                <span>Lihat Website</span>
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center justify-center space-x-2 dark:text-white dark:border-gray-400 w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === tab.id
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4 mr-3" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6 flex items-center">
                    <ImageIcon className="h-8 w-8 text-emerald-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Foto</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPhotos}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6 flex items-center">
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Komentar</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalComments}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6 flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pengunjung Unik</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalVisitors}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stats.totalVisits} total kunjungan</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6 flex items-center">
                    <Calendar className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Kunjungan Hari Ini</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayVisits}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Kunjungan Terbaru */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Data Kunjungan Terbaru</h3>
                {loadingVisits ? (
                  <p className="text-gray-600 dark:text-gray-300">Memuat data kunjungan...</p>
                ) : visits.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">Belum ada data kunjungan.</p>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Halaman</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Waktu</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Perangkat</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {visits.slice(0, 5).map((visit) => (
                          <tr key={visit.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{visit.page}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {new Date(visit.timestamp).toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {visit.user_agent?.substring(0, 50)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Kelola Foto */}
          {activeTab === "photos" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Kelola Foto</h2>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" /> Tambah Foto
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <Card key={photo.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg">{photo.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      {getPhotoUrl(photo) ? (
                        <img
                          src={getPhotoUrl(photo)}
                          alt={photo.title || "Foto"}
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500">
                          Tidak ada gambar
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePhoto(photo.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Hapus
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditPhoto(photo)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </div>
                      {editingPhoto?.id === photo.id && (
                        <div className="mt-2 space-y-2">
                          <Input
                            value={editingPhoto.title}
                            onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                            placeholder="Judul"
                          />
                          <Input
                            value={editingPhoto.category}
                            onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                            placeholder="Kategori"
                          />
                          <Input
                            value={editingPhoto.description}
                            onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                            placeholder="Deskripsi"
                          />
                          <div className="flex space-x-2">
                            <Button onClick={handleSaveEdit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                              Simpan
                            </Button>
                            <Button onClick={() => setEditingPhoto(null)} variant="outline">
                              Batal
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Komentar */}
          {activeTab === "comments" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Komentar Warga</h2>
              {loadingComments ? (
                <p>Memuat komentar...</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent>
                        <div className="flex justify-between">
                          <h4 className="font-semibold">{comment.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(comment.created_at).toLocaleString("id-ID")}
                            </span>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pesan Cepat */}
          {activeTab === "messages" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pesan Cepat</h2>
              {loadingMessages ? (
                <p>Memuat pesan...</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <Card key={msg.id}>
                      <CardContent className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{msg.name} ({msg.phone})</h4>
                          <p className="text-sm text-muted-foreground mb-1">Subjek: {msg.subject}</p>
                          <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleString("id-ID")}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Data Pengunjung Detail */}
          {activeTab === "visitors" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Data Pengunjung</h2>
              {loadingVisits ? (
                <p className="text-gray-600 dark:text-gray-300">Memuat data pengunjung...</p>
              ) : visits.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">Belum ada data pengunjung.</p>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Halaman</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Waktu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Perangkat</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {visits.map((visit) => (
                        <tr key={visit.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{visit.page}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(visit.timestamp).toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {visit.user_agent}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Pengaturan */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pengaturan</h2>
              <p className="text-gray-700 dark:text-gray-300">Fitur pengaturan akan datang...</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Upload Foto */}
      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handlePhotoUpload}
      />
    </div>
  )
}