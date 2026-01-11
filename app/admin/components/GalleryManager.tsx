"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, File, Plus, Trash2, Download, Eye } from "lucide-react"
import { PhotoUploadModal } from "@/components/photo-upload-modal"
import { FileUploadModal } from "@/components/file-upload-modal"
import { usePhotos } from "@/hooks/use-photos"
import { useFiles } from "@/hooks/use-files"
import SettingsManager from "./SettingsManager" // komponen pengaturan

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"gallery" | "files" | "settings">("gallery")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false)

  const { photos, isLoading: photosLoading, addPhoto, deletePhoto } = usePhotos()
  const { files, isLoading: filesLoading, addFile, deleteFile } = useFiles()

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

  const handleFileUpload = async (uploadData: any) => {
    const processedFiles = await Promise.all(
      uploadData.files.map(
        (file: File) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.readAsDataURL(file)
          }),
      ),
    )

    for (let i = 0; i < processedFiles.length; i++) {
      const fileDataUrl = processedFiles[i]
      const originalFile = uploadData.files[i]
      const fileTitle =
        uploadData.files.length > 1 ? `${uploadData.title} (${i + 1})` : uploadData.title

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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FileText className="h-6 w-6 text-red-600" />
    return <File className="h-6 w-6 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* tombol tab */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "gallery" ? "default" : "outline"}
          onClick={() => setActiveTab("gallery")}
        >
          Kelola Foto
        </Button>
        <Button
          variant={activeTab === "files" ? "default" : "outline"}
          onClick={() => setActiveTab("files")}
        >
          Kelola File
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "outline"}
          onClick={() => setActiveTab("settings")}
        >
          Pengaturan
        </Button>
      </div>

      {/* konten tab */}
      {activeTab === "gallery" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Kelola Galeri Foto</h2>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Foto
            </Button>
          </div>

          {photosLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Memuat foto...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <CardContent className="p-4">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h3 className="font-medium">{photo.title}</h3>
                    <p className="text-sm text-muted-foreground">{photo.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary">{photo.category}</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePhoto(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "files" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Kelola File</h2>
            <Button onClick={() => setIsFileUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>

          {filesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Memuat file...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <Card key={file.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.fileType)}
                      <div className="flex-1">
                        <h3 className="font-medium">{file.title}</h3>
                        <p className="text-sm text-muted-foreground">{file.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>{file.fileName}</span>
                          <span>{formatFileSize(file.fileSize)}</span>
                          <span>{file.category}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={file.file} download={file.fileName}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={file.file} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "settings" && <SettingsManager />}

      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handlePhotoUpload}
      />

      <FileUploadModal
        isOpen={isFileUploadModalOpen}
        onClose={() => setIsFileUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  )
}
