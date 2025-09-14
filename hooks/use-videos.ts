"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Video {
  id: string
  title: string
  description: string
  video_data: string
  category: "kabar" | "kegiatan"
  duration: number
  created_at: string
  updated_at: string
  date: string
}

export interface VideoInput {
  title: string
  description: string
  category: "kabar" | "kegiatan"
  video: string // base64 data URL
  duration: number
  date?: string
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load semua video
  const loadVideos = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error

      // transform data Supabase ke Video
      const transformed = (data || []).map((video: any) => ({
        ...video,
        date: new Date(video.created_at).toLocaleDateString("id-ID"),
      }))
      setVideos(transformed)
    } catch (error) {
      console.error("Error loading videos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Tambah video baru
  const addVideo = async (videoInput: VideoInput) => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .insert({
          title: videoInput.title,
          description: videoInput.description,
          category: videoInput.category,
          video_data: videoInput.video,
          duration: videoInput.duration,
        })
        .select()
        .single()
      if (error) throw error

      const newVideo: Video = {
        ...data,
        date: new Date(data.created_at).toLocaleDateString("id-ID"),
      }
      setVideos((prev) => [newVideo, ...prev])
    } catch (error) {
      console.error("Error adding video:", error)
    }
  }

  // Edit video
  const editVideo = async (id: string, updates: Partial<VideoInput>) => {
    try {
      // ubah video_data kalau updates.video ada
      const updatePayload: any = {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        duration: updates.duration,
      }
      if (updates.video) {
        updatePayload.video_data = updates.video
      }

      const { data, error } = await supabase
        .from("videos")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error

      setVideos((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, ...data, video_data: data.video_data } : v
        )
      )
    } catch (error) {
      console.error("Error editing video:", error)
    }
  }

  // Hapus video
  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase.from("videos").delete().eq("id", id)
      if (error) throw error
      setVideos((prev) => prev.filter((v) => v.id !== id))
    } catch (error) {
      console.error("Error deleting video:", error)
    }
  }

  useEffect(() => {
    loadVideos()
  }, [])

  return {
    videos,
    isLoading,
    addVideo,
    editVideo,
    deleteVideo,
    refreshVideos: loadVideos,
  }
}
