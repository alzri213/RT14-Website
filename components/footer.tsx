"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-background to-background/90 dark:from-gray-900 dark:to-gray-950 text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* Ganti text RT jadi gambar */}
              <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-primary/10 dark:bg-primary/20">
                <Image
                  src="/logo-rt14.jpg" // ganti sesuai nama file gambar kamu
                  alt="Logo RT 14"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground">RT 14</h3>
                <p className="text-muted-foreground text-sm">Rukun Tetangga</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Membangun komunitas yang harmonis, gotong royong, dan sejahtera bersama warga RT 14 Kelurahan Sukamaju.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground">Menu Utama</h4>
            <ul className="space-y-2">
              {[
                { href: "#beranda", label: "Beranda" },
                { href: "#tentang", label: "Tentang RT 14" },
                { href: "#galeri", label: "Galeri" },
                { href: "#kontak", label: "Kontak" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground text-sm">
                  Jl. Mawar RT 14/RW 16
                  <br />
                  Bekasi, Tambun Selatan
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-sm">+62 819-0886-9218</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-sm">alfanalifa2008@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-foreground">Ikuti Kami</h4>
            <div className="flex space-x-3">
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-background bg-transparent"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-background bg-transparent"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-background bg-transparent"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Dapatkan update terbaru tentang kegiatan dan informasi RT 14
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2025 RT 14 Mawar. Semua hak cipta dilindungi.</p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">Dibuat dengan ❤️ untuk warga RT 14</p>
        </div>
      </div>
    </footer>
  )
}
