"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload, Camera, ImageIcon } from "lucide-react"

interface PhotoUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: any) => void
}

export function PhotoUploadModal({ isOpen, onClose, onUpload }: PhotoUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"katar" | "kegiatan">("kegiatan")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFiles.length === 0 || !title.trim()) return

    const uploadData = {
      files: selectedFiles,
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
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold text-foreground">Upload Foto Baru</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Area Upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-border hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">Drag & drop foto di sini</p>
                  <p className="text-muted-foreground">atau klik untuk memilih file</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Pilih Foto
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Foto yang dipilih ({selectedFiles.length})
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Judul *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul foto/kegiatan"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Deskripsi
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan tentang foto atau kegiatan ini..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
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
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Kegiatan Warga
                  </Button>
                  <Button
                    type="button"
                    variant={category === "katar" ? "default" : "outline"}
                    onClick={() => setCategory("katar")}
                    className={
                      category === "katar"
                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                        : "border-teal-600 text-teal-600 hover:bg-teal-50"
                    }
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Katar RT
                  </Button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Batal
              </Button>
              <Button
                type="submit"
                disabled={selectedFiles.length === 0 || !title.trim()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Upload Foto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
