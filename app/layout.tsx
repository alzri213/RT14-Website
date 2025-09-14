import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { VisitorTracker } from "@/components/visitor-tracker"
import { DebugEnv } from "@/components/debug-env" // ✅ Import DebugEnv

export const metadata: Metadata = {
  title: "RT 14 - Rukun Tetangga",
  description:
    "Website resmi RT 14 Kelurahan RW 16 - Membangun komunitas yang harmonis, gotong royong, dan sejahtera",
  keywords: "RT 14, Rukun Tetangga, Bekasi, Tambun Selatan, Komunitas, Gotong Royong",
  authors: [{ name: "RT 14 / RW 16" }],
  openGraph: {
    title: "RT 14 - Rukun Tetangga",
    description:
      "Website resmi RT 14 Kelurahan RW 16 - Membangun komunitas yang harmonis, gotong royong, dan sejahtera",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`font-sans antialiased`}>
        <VisitorTracker />
        <DebugEnv /> {/* ✅ Tambahkan DebugEnv di sini */}
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}