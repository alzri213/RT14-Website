"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload, Video } from "lucide-react"

interface VideoUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: any) => void
}

export function VideoUploadModal({ isOpen, onClose, onUpload }: VideoUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"kabar" | "kegiatan">("kegiatan")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("video/"))
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) => file.type.startsWith("video/"))
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const validateDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url)
        resolve(video.duration)
      }
      video.onerror = () => {
        reject(new Error("Failed to load video metadata"))
      }
      video.src = url
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (selectedFiles.length === 0 || !title.trim()) return

    // Validate duration for all selected files
    for (const file of selectedFiles) {
      try {
        const duration = await validateDuration(file)
        if (duration < 60 || duration > 1200) {
          setError("Durasi video harus antara 1 sampai 20 menit.")
          return
        }
      } catch {
        setError("Gagal memvalidasi durasi video.")
        return
      }
    }

    // Convert files to base64
    const processedVideos = await Promise.all(
      selectedFiles.map(
        (file: File) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.readAsDataURL(file)
          })
      )
    )

    const uploadData = {
      files: selectedFiles,
      base64Videos: processedVideos,
      title: title.trim(),
      description: description.trim(),
      category,
      date: new Date().toLocaleDateString("id-ID"),
    }

    onUpload(uploadData)

    setSelectedFiles([])
    setTitle("")
    setDescription("")
    setCategory("kegiatan")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Upload Video</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
            <div
              className={`border-2 border-dashed rounded-md p-6 mb-4 text-center cursor-pointer ${
                dragActive ? "border-emerald-600 bg-emerald-50" : "border-gray-300"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
              <p className="text-sm text-gray-600">Drag & drop video files here, or click to select files</p>
              <p className="text-xs text-gray-500">Durasi video harus antara 1 sampai 20 menit</p>
              <input
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </div>

            {error && <p className="text-red-600 mb-2">{error}</p>}

            {selectedFiles.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Selected Videos</h4>
                <ul className="list-disc list-inside max-h-40 overflow-auto">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{file.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <Label htmlFor="title" className="text-base font-medium">
                Judul *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul video"
                required
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="description" className="text-base font-medium">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan tentang video ini..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="mt-4">
              <Label className="text-base font-medium">Kategori *</Label>
              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  variant={category === "kegiatan" ? "default" : "outline"}
                  onClick={() => setCategory("kegiatan")}
                  className={
                    category === "kegiatan"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  }
                >
                  <Video className="h-4 w-4 mr-2" />
                  Kegiatan Warga
                </Button>
                <Button
                  type="button"
                  variant={category === "kabar" ? "default" : "outline"}
                  onClick={() => setCategory("kabar")}
                  className={
                    category === "kabar"
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "border-teal-600 text-teal-600 hover:bg-teal-50"
                  }
                >
                  <Video className="h-4 w-4 mr-2" />
                  Kabar RT
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Batal
              </Button>
              <Button
                type="submit"
                disabled={selectedFiles.length === 0 || !title.trim()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Upload Video
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
