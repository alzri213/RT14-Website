"use client"

import { useState } from "react"
import GalleryManager from "./GalleryManager" // komponen kelola foto
import SettingsManager from "./SettingsManager" // komponen pengaturan

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"gallery" | "settings">("gallery")

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* tombol tab */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-4 py-2 rounded ${
            activeTab === "gallery" ? "bg-emerald-600 text-white" : "bg-gray-200"
          }`}
        >
          Kelola Foto
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded ${
            activeTab === "settings" ? "bg-emerald-600 text-white" : "bg-gray-200"
          }`}
        >
          Pengaturan
        </button>
      </div>

      {/* konten tab */}
      {activeTab === "gallery" && <GalleryManager />}
      {activeTab === "settings" && <SettingsManager />}
    </div>
  )
}
