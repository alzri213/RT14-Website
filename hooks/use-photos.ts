"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Photo {
  id: string
  title: string
  description: string
  image_data: string
  category: "kabar" | "kegiatan"
  created_at: string
  updated_at: string
  likes: number
  image: string
  date: string
}

export interface PhotoInput {
  title: string
  description: string
  category: "kabar" | "kegiatan"
  image: string // base64 data URL
  date?: string
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load semua foto
  const loadPhotos = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error

      // transform data Supabase ke Photo
      const transformed = (data || []).map((photo: any) => ({
        ...photo,
        likes: photo.likes || 0,
        image: photo.image_data, // inilah yang dipakai di komponen
        date: new Date(photo.created_at).toLocaleDateString("id-ID"),
      }))
      setPhotos(transformed)
    } catch (error) {
      console.error("Error loading photos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Tambah foto baru
  const addPhoto = async (photoInput: PhotoInput) => {
    try {
      const { data, error } = await supabase
        .from("photos")
        .insert({
          title: photoInput.title,
          description: photoInput.description,
          category: photoInput.category,
          image_data: photoInput.image,
        })
        .select()
        .single()
      if (error) throw error

      const newPhoto: Photo = {
        ...data,
        likes: data.likes || 0,
        image: data.image_data,
        date: new Date(data.created_at).toLocaleDateString("id-ID"),
      }
      setPhotos((prev) => [newPhoto, ...prev])
    } catch (error) {
      console.error("Error adding photo:", error)
    }
  }

  // Edit foto
  const editPhoto = async (id: string, updates: Partial<PhotoInput>) => {
    try {
      // ubah image_data kalau updates.image ada
      const updatePayload: any = {
        title: updates.title,
        description: updates.description,
        category: updates.category,
      }
      if (updates.image) {
        updatePayload.image_data = updates.image
      }

      const { data, error } = await supabase
        .from("photos")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...data, image: data.image_data } : p
        )
      )
    } catch (error) {
      console.error("Error editing photo:", error)
    }
  }

  // Hapus foto
  const deletePhoto = async (id: string) => {
    try {
      const { error } = await supabase.from("photos").delete().eq("id", id)
      if (error) throw error
      setPhotos((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting photo:", error)
    }
  }

  useEffect(() => {
    loadPhotos()
  }, [])

  return {
    photos,
    isLoading,
    addPhoto,
    editPhoto,
    deletePhoto,
    refreshPhotos: loadPhotos,
  }
}
