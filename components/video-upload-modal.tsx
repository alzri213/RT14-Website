import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface VideoUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (data: {
    files: File[]
    base64Videos: string[]
    durations: number[]
    title: string
    category: string
    date: string
    description: string
  }) => void
}

export function VideoUploadModal({ isOpen, onClose, onUpload }: VideoUploadModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [progress, setProgress] = useState<number[]>([])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : []
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg"]
    const filteredFiles = selectedFiles.filter((f) => allowedTypes.includes(f.type))
    setFiles(filteredFiles)

    const filePreviews: string[] = []
    filteredFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      filePreviews.push(url)
    })
    setPreviews(filePreviews)
  }

  const handleUpload = async () => {
    const base64Videos: string[] = []
    const durations: number[] = []
    setProgress(Array(files.length).fill(0))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()

      const filePromise = new Promise<void>((resolve) => {
        reader.onload = async (e) => {
          const result = e.target?.result as string
          base64Videos.push(result)

          const videoEl = document.createElement("video")
          videoEl.src = result
          videoEl.onloadedmetadata = () => {
            durations.push(videoEl.duration)
            setProgress((prev) => {
              const newProg = [...prev]
              newProg[i] = 100
              return newProg
            })
            resolve()
          }
        }
      })

      reader.readAsDataURL(file)
      await filePromise
    }

    onUpload({ files, base64Videos, durations, title, category, date, description })

    // reset state
    setFiles([])
    setPreviews([])
    setTitle("")
    setCategory("")
    setDescription("")
    setDate(new Date().toISOString().slice(0, 10))
    setProgress([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Upload Video</h2>
        <Input type="text" placeholder="Judul" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-2"/>
        <Input type="text" placeholder="Kategori" value={category} onChange={(e) => setCategory(e.target.value)} className="mb-2"/>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-2"/>
        <Input type="text" placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="mb-2"/>
        <Input type="file" multiple accept="video/*" onChange={handleFileChange} className="mb-4"/>
        <div className="space-y-2 mb-4">
          {previews.map((src, idx) => (
            <div key={idx}>
              <video src={src} controls className="w-full h-48 object-cover mb-1" />
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-emerald-600 h-2 rounded" style={{ width: `${progress[idx] || 0}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">Batal</Button>
          <Button onClick={handleUpload} className="bg-emerald-600 hover:bg-emerald-700 text-white">Upload</Button>
        </div>
      </div>
    </div>
  )
}
