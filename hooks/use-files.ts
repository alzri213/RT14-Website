"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface FileItem {
  id: string
  title: string
  description: string
  file_data: string
  file_name: string
  file_type: string
  file_size: number
  category: string
  created_at: string
  updated_at: string
  file: string
}

export interface FileInput {
  title: string
  description: string
  category: string
  file: string // base64 data URL
  fileName: string
  fileType: string
  fileSize: number
}

export function useFiles() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load semua file
  const loadFiles = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error

      // transform data Supabase ke FileItem
      const transformed = (data || []).map((file: any) => ({
        ...file,
        file: file.file_data, // inilah yang dipakai di komponen
      }))
      setFiles(transformed)
    } catch (error) {
      console.error("Error loading files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Tambah file baru
  const addFile = async (fileInput: FileInput) => {
    try {
      const { data, error } = await supabase
        .from("files")
        .insert({
          title: fileInput.title,
          description: fileInput.description,
          category: fileInput.category,
          file_data: fileInput.file,
          file_name: fileInput.fileName,
          file_type: fileInput.fileType,
          file_size: fileInput.fileSize,
        })
        .select()
        .single()
      if (error) throw error

      const newFile: FileItem = {
        ...data,
        file: data.file_data,
      }
      setFiles((prev) => [newFile, ...prev])
    } catch (error) {
      console.error("Error adding file:", error)
    }
  }

  // Edit file
  const editFile = async (id: string, updates: Partial<FileInput>) => {
    try {
      // ubah file_data kalau updates.file ada
      const updatePayload: any = {
        title: updates.title,
        description: updates.description,
        category: updates.category,
      }
      if (updates.file) {
        updatePayload.file_data = updates.file
        updatePayload.file_name = updates.fileName
        updatePayload.file_type = updates.fileType
        updatePayload.file_size = updates.fileSize
      }

      const { data, error } = await supabase
        .from("files")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, ...data, file: data.file_data } : f
        )
      )
    } catch (error) {
      console.error("Error editing file:", error)
    }
  }

  // Hapus file
  const deleteFile = async (id: string) => {
    try {
      const { error } = await supabase.from("files").delete().eq("id", id)
      if (error) throw error
      setFiles((prev) => prev.filter((f) => f.id !== id))
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  return {
    files,
    isLoading,
    addFile,
    editFile,
    deleteFile,
    refreshFiles: loadFiles,
  }
}
