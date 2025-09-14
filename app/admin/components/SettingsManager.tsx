"use client"

import { useState } from "react"

export default function SettingsManager() {
  const [siteTitle, setSiteTitle] = useState("")
  const [logo, setLogo] = useState("")

  const saveSettings = () => {
    // simpan ke Supabase atau API sesuai kebutuhan
    console.log({ siteTitle, logo })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Pengaturan Website</h2>

      <div>
        <label className="block text-sm font-medium">Judul Website</label>
        <input
          type="text"
          value={siteTitle}
          onChange={e => setSiteTitle(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Logo (URL/Base64)</label>
        <input
          type="text"
          value={logo}
          onChange={e => setLogo(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <button
        onClick={saveSettings}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        Simpan Pengaturan
      </button>
    </div>
  )
}
