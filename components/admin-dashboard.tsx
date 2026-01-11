"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { usePhotos } from "@/hooks/use-photos"
import { useVideos } from "@/hooks/use-videos"
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
  Activity,
  Video,
} from "lucide-react"
import { PhotoUploadModal } from "@/components/photo-upload-modal"
import { VideoUploadModal } from "@/components/video-upload-modal"
import { FileUploadModal } from "@/components/file-upload-modal"
import { useFiles } from "@/hooks/use-files"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Menu, X } from "lucide-react"

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
  session_id: string
}

interface Activity {
  id: string
  type: 'comment' | 'message' | 'visit' | 'photo' | 'video' | 'file'
  timestamp: string
  description: string
}

interface Photo {
  id: string
  title: string
  category: "kabar" | "kegiatan"
  image: string
  date: string
  description: string
}

interface Video {
  id: string
  title: string
  category: "kabar" | "kegiatan"
  video_data: string
  duration: number
  date: string
  description: string
}



// ----- AdminDashboard -----
export function AdminDashboard() {
  const router = useRouter()
  const { logout, isLoggedIn } = useAdminAuth()
  const { photos, addPhoto, deletePhoto, editPhoto } = usePhotos()
  const { videos, addVideo, deleteVideo, editVideo } = useVideos()
  const { files, addFile, deleteFile } = useFiles()
  const [activeTab, setActiveTab] = useState("overview")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isVideoUploadModalOpen, setIsVideoUploadModalOpen] = useState(false)
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isEditPhotoModalOpen, setIsEditPhotoModalOpen] = useState(false)
  const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [visits, setVisits] = useState<Visit[]>([])
  const [loadingVisits, setLoadingVisits] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) router.push("/admin/login")
  }, [router, isLoggedIn])

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) html.classList.add("dark")
    else html.classList.remove("dark")
  }, [darkMode])

  // --- Realtime supabase subscriptions ---
  useEffect(() => {
    let sub: any
    const fetchAndSubscribeComments = async () => {
      await fetchComments()
      sub = supabase.channel("public:comments").on("postgres_changes", { event: "INSERT", schema: "public", table: "comments" }, (payload) => {
        setComments((prev) => [payload.new as Comment, ...prev])
      }).subscribe()
    }
    fetchAndSubscribeComments()
    return () => {
      if (sub) supabase.removeChannel(sub)
    }
  }, [])

  useEffect(() => {
    let sub: any
    const fetchAndSubscribeVisits = async () => {
      await fetchVisits()
      sub = supabase.channel("public:visits").on("postgres_changes", { event: "INSERT", schema: "public", table: "visits" }, (payload) => {
        setVisits((prev) => [payload.new as Visit, ...prev])
      }).subscribe()
    }
    fetchAndSubscribeVisits()
    return () => {
      if (sub) supabase.removeChannel(sub)
    }
  }, [])

  useEffect(() => {
    let sub: any
    const fetchAndSubscribeMessages = async () => {
      await fetchMessages()
      sub = supabase.channel("public:messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => [payload.new as Message, ...prev])
      }).subscribe()
    }
    fetchAndSubscribeMessages()
    return () => {
      if (sub) supabase.removeChannel(sub)
    }
  }, [])

  const fetchComments = async () => {
    setLoadingComments(true)
    const { data, error } = await supabase.from("comments").select("*").order("created_at", { ascending: false })
    if (!error && data) setComments(data as Comment[])
    setLoadingComments(false)
  }

  const fetchMessages = async () => {
    setLoadingMessages(true)
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })
    if (!error && data) setMessages(data as Message[])
    setLoadingMessages(false)
  }

  const fetchVisits = async () => {
    setLoadingVisits(true)
    const { data, error } = await supabase.from("visits").select("*").order("timestamp", { ascending: false })
    if (!error && data) setVisits(data as Visit[])
    setLoadingVisits(false)
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

  // ----- Photo Upload -----
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
      const photoTitle = uploadData.files.length > 1 ? `${uploadData.title} (${i + 1})` : uploadData.title
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

  // ----- Video Upload -----
  const handleVideoUpload = async (uploadData: any) => {
    for (let i = 0; i < uploadData.base64Videos.length; i++) {
      const videoDataUrl = uploadData.base64Videos[i]
      const duration = uploadData.durations[i]
      const videoTitle = uploadData.files.length > 1 ? `${uploadData.title} (${i + 1})` : uploadData.title

      await addVideo({
        title: videoTitle,
        category: uploadData.category,
        video: videoDataUrl,
        duration: Math.floor(duration),
        date: uploadData.date,
        description: uploadData.description,
      })
    }
    setIsVideoUploadModalOpen(false)
  }

  // ----- File Upload -----
  const handleFileUpload = async (uploadData: any) => {
    const processedFiles = await Promise.all(
      uploadData.files.map(
        (file: File) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.readAsDataURL(file)
          })
      )
    )

    for (let i = 0; i < processedFiles.length; i++) {
      const fileDataUrl = processedFiles[i]
      const originalFile = uploadData.files[i]
      const fileTitle = uploadData.files.length > 1 ? `${uploadData.title} (${i + 1})` : uploadData.title

      await addFile({
        title: fileTitle,
        category: uploadData.category,
        file: fileDataUrl,
        fileName: originalFile.name,
        fileType: originalFile.type,
        fileSize: originalFile.size,
        description: uploadData.description,
      })
    }

    setIsFileUploadModalOpen(false)
  }

  const handleDeletePhoto = (id: string) => {
    if (!confirm("Hapus foto ini?")) return
    deletePhoto(id)
  }

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo)
    setIsEditPhotoModalOpen(true)
  }
  const handleSaveEditPhoto = () => {
    if (editingPhoto) {
      editPhoto(editingPhoto.id, { title: editingPhoto.title, category: editingPhoto.category, description: editingPhoto.description })
      setEditingPhoto(null)
      setIsEditPhotoModalOpen(false)
    }
  }

  const handleSaveEditVideo = () => {
    if (editingVideo) {
      editVideo(editingVideo.id, { title: editingVideo.title, category: editingVideo.category, description: editingVideo.description })
      setEditingVideo(null)
      setIsEditVideoModalOpen(false)
    }
  }

  const getPhotoUrl = (photo: any) => {
    if (!photo.image) return null
    if (photo.image.startsWith("data:image")) return photo.image
    return supabase.storage.from("photos").getPublicUrl(photo.image).data.publicUrl
  }

  const getVideoUrl = (video: any) => {
    if (!video.video_data) return null
    if (video.video_data.startsWith("data:video")) return video.video_data
    return supabase.storage.from("videos").getPublicUrl(video.video_data).data.publicUrl
  }

  // --- Tabs ---
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "photos", label: "Kelola Foto", icon: ImageIcon },
    { id: "videos", label: "Kelola Video", icon: Video },
    { id: "files", label: "Kelola File", icon: Upload },
    { id: "comments", label: "Komentar", icon: MessageSquare },
    { id: "messages", label: "Pesan Cepat", icon: MessageSquare },
    { id: "visitors", label: "Pengunjung", icon: Users },
    { id: "activities", label: "Aktivitas", icon: Activity },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  const totalVisits = visits.length
  const uniqueVisitors = new Set(visits.map(v => v.session_id)).size
  const todayUTC = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()))
  const todayVisits = visits.filter(v => {
    const visitDate = new Date(v.timestamp)
    const visitUTC = new Date(Date.UTC(visitDate.getUTCFullYear(), visitDate.getUTCMonth(), visitDate.getUTCDate()))
    return visitUTC.getTime() === todayUTC.getTime()
  }).length

  const stats = {
    totalPhotos: photos.length,
    totalComments: comments.length,
    totalVisitors: uniqueVisitors,
    totalVisits,
    todayVisits,
    totalMessages: messages.length,
  }

  const activities = useMemo(() => {
    const acts: Activity[] = []
    comments.slice(0,10).forEach(c => acts.push({ id: c.id, type: 'comment', timestamp: c.created_at, description: `💬 New comment by ${c.name}: "${c.message.slice(0, 50)}${c.message.length > 50 ? '...' : ''}"` }))
    messages.slice(0,10).forEach(m => acts.push({ id: m.id.toString(), type: 'message', timestamp: m.created_at, description: `📧 New message from ${m.name}: "${m.subject}"` }))
    visits.slice(0,10).forEach(v => acts.push({ id: v.id, type: 'visit', timestamp: v.timestamp, description: `👁️ Page visit: ${v.page}` }))
    photos.slice(0,10).forEach(p => acts.push({ id: p.id, type: 'photo', timestamp: p.created_at, description: `📸 Uploaded photo: "${p.title}"` }))
    videos.slice(0,10).forEach(v => acts.push({ id: v.id, type: 'video', timestamp: v.created_at, description: `🎥 Uploaded video: "${v.title}"` }))
    return acts.sort((a,b)=> new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [comments, messages, visits, photos, videos])

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsSidebarOpen(true)} size="sm" variant="outline" className="sm:hidden">
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setDarkMode(!darkMode)} size="sm">{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
          <Button onClick={logout} size="sm"><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <Button key={tab.id} onClick={() => setActiveTab(tab.id)} variant={activeTab===tab.id ? "default" : "outline"} size="sm" className="flex-1 sm:flex-none">
            <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
          </Button>
        ))}
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className={`fixed left-0 top-0 h-full w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button onClick={() => setIsSidebarOpen(false)} size="sm" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {tabs.map(tab => (
                <Button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-4">
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="text-center"><CardHeader className="pb-2"><CardTitle className="text-sm">Total Photos</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{stats.totalPhotos}</div></CardContent></Card>
            <Card className="text-center"><CardHeader className="pb-2"><CardTitle className="text-sm">Total Comments</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{stats.totalComments}</div></CardContent></Card>
            <Card className="text-center"><CardHeader className="pb-2"><CardTitle className="text-sm">Unique Visitors</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{stats.totalVisitors}</div></CardContent></Card>
            <Card className="text-center"><CardHeader className="pb-2"><CardTitle className="text-sm">Total Visits</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{stats.totalVisits}</div></CardContent></Card>
            <Card className="text-center"><CardHeader className="pb-2"><CardTitle className="text-sm">Today's Visits</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{stats.todayVisits}</div></CardContent></Card>
            <Card className="text-center"><CardHeader className="pb-2"><CardTitle className="text-sm">Total Messages</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{stats.totalMessages}</div></CardContent></Card>
          </div>
        )}

        {activeTab === "photos" && (
          <div>
            <Button onClick={() => setIsUploadModalOpen(true)} className="mb-4 w-full sm:w-auto"><Upload className="h-4 w-4 mr-2" /> Upload Foto</Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map(photo => (
                <Card key={photo.id} className="overflow-hidden">
                  <CardHeader className="pb-2"><CardTitle className="text-sm truncate">{photo.title}</CardTitle></CardHeader>
                  <CardContent className="p-4">
                    <img src={getPhotoUrl(photo) || ""} alt={photo.title} className="w-full h-32 sm:h-48 object-cover rounded mb-2"/>
                    <div className="flex space-x-2">
                      <Button onClick={()=>handleEditPhoto(photo)} size="sm" className="flex-1"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                      <Button onClick={()=>handleDeletePhoto(photo.id)} variant="destructive" size="sm" className="flex-1"><Trash2 className="h-4 w-4 mr-1" /> Hapus</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "videos" && (
          <div>
            <Button onClick={() => setIsVideoUploadModalOpen(true)} className="mb-4 w-full sm:w-auto"><Upload className="h-4 w-4 mr-2" /> Upload Video</Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map(video => (
                <Card key={video.id} className="overflow-hidden">
                  <CardHeader className="pb-2"><CardTitle className="text-sm truncate">{video.title}</CardTitle></CardHeader>
                  <CardContent className="p-4">
                    <video src={getVideoUrl(video) || ""} controls className="w-full h-32 sm:h-48 object-cover rounded mb-2"/>
                    <p className="text-xs text-gray-600 mb-2">Duration: {video.duration}s</p>
                    <div className="flex space-x-2">
                      <Button onClick={() => { setEditingVideo(video); setIsEditVideoModalOpen(true); }} size="sm" className="flex-1"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                      <Button onClick={() => deleteVideo(video.id)} variant="destructive" size="sm" className="flex-1"><Trash2 className="h-4 w-4 mr-1" /> Hapus</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div>
            <Button onClick={() => setIsFileUploadModalOpen(true)} className="mb-4 w-full sm:w-auto"><Upload className="h-4 w-4 mr-2" /> Upload File</Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {files.map(file => (
                <Card key={file.id} className="overflow-hidden">
                  <CardHeader className="pb-2"><CardTitle className="text-sm truncate">{file.title}</CardTitle></CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Upload className="h-6 w-6 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600 truncate">{file.file_name}</p>
                        <p className="text-xs text-gray-500">{(file.file_size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => window.open(file.file, '_blank')} size="sm" className="flex-1"><Eye className="h-4 w-4 mr-1" /> Lihat</Button>
                      <Button onClick={() => {
                        const link = document.createElement('a');
                        link.href = file.file;
                        link.download = file.file_name;
                        link.click();
                      }} size="sm" className="flex-1">Download</Button>
                      <Button onClick={() => deleteFile(file.id)} variant="destructive" size="sm" className="flex-1"><Trash2 className="h-4 w-4 mr-1" /> Hapus</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-4">
            {loadingComments ? <p className="text-center">Loading...</p> : comments.map(c => (
              <Card key={c.id}>
                <CardHeader><CardTitle className="text-lg">{c.name}</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-2">{c.message}</p>
                  <p className="text-sm text-gray-500 mb-2">{new Date(c.created_at).toLocaleString()}</p>
                  <Button onClick={()=>handleDeleteComment(c.id)} variant="destructive" className="w-full sm:w-auto"><Trash2 className="h-4 w-4 mr-2" /> Hapus</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            {loadingMessages ? <p className="text-center">Loading...</p> : messages.map(m => (
              <Card key={m.id}>
                <CardHeader><CardTitle className="text-lg">{m.name}</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-2">{m.message}</p>
                  <p className="text-sm text-gray-500 mb-2">{new Date(m.created_at).toLocaleString()}</p>
                  <Button onClick={()=>handleDeleteMessage(m.id)} variant="destructive" className="w-full sm:w-auto"><Trash2 className="h-4 w-4 mr-2" /> Hapus</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "visitors" && (
          <div className="space-y-4">
            {loadingVisits ? <p className="text-center">Loading...</p> : visits.map(v => (
              <Card key={v.id}>
                <CardContent className="space-y-1">
                  <p className="font-medium">Page: {v.page}</p>
                  <p className="text-sm text-gray-600">UA: {v.user_agent}</p>
                  <p className="text-sm text-gray-600">Time: {new Date(v.timestamp).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Session: {v.session_id}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "activities" && (
          <div className="space-y-4">
            {activities.map(a => (
              <Card key={a.id}>
                <CardContent>
                  <p className="mb-1">{a.description}</p>
                  <p className="text-sm text-gray-500">{new Date(a.timestamp).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-md">
            <Button onClick={logout} variant="destructive" className="w-full sm:w-auto"><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
          </div>
        )}
      </div>

      {isEditPhotoModalOpen && editingPhoto && (
        <Dialog open={isEditPhotoModalOpen} onOpenChange={setIsEditPhotoModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Foto</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              value={editingPhoto.title}
              onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
              placeholder="Judul"
              className="mb-2"
            />
            <Input
              type="text"
              value={editingPhoto.category}
              onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value as "kabar" | "kegiatan" })}
              placeholder="Kategori"
              className="mb-2"
            />
            <Textarea
              value={editingPhoto.description}
              onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
              placeholder="Deskripsi"
              className="mb-2"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditPhotoModalOpen(false)}>Batal</Button>
              <Button onClick={handleSaveEditPhoto}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isEditVideoModalOpen && editingVideo && (
        <Dialog open={isEditVideoModalOpen} onOpenChange={setIsEditVideoModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Video</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              value={editingVideo.title}
              onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
              placeholder="Judul"
              className="mb-2"
            />
            <Input
              type="text"
              value={editingVideo.category}
              onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value as "kabar" | "kegiatan" })}
              placeholder="Kategori"
              className="mb-2"
            />
            <Textarea
              value={editingVideo.description}
              onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
              placeholder="Deskripsi"
              className="mb-2"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditVideoModalOpen(false)}>Batal</Button>
              <Button onClick={handleSaveEditVideo}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isUploadModalOpen && <PhotoUploadModal isOpen={isUploadModalOpen} onClose={()=>setIsUploadModalOpen(false)} onUpload={handlePhotoUpload} />}
      {isVideoUploadModalOpen && <VideoUploadModal isOpen={isVideoUploadModalOpen} onClose={()=>setIsVideoUploadModalOpen(false)} onUpload={handleVideoUpload} />}
      {isFileUploadModalOpen && <FileUploadModal isOpen={isFileUploadModalOpen} onClose={()=>setIsFileUploadModalOpen(false)} onUpload={handleFileUpload} />}
    </div>
  )
}
