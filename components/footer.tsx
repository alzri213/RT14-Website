"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Heart, Star } from "lucide-react"
import Image from "next/image"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5 dark:from-gray-900 dark:via-gray-950 dark:to-primary/10 text-foreground">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent/10 rounded-full blur-lg"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-16 right-16 text-primary/20"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Heart className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-16 text-secondary/20"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Star className="w-6 h-6" />
      </motion.div>

      <div className="relative container mx-auto px-4 py-16 md:py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Logo & Description */}
          <motion.div
            className="space-y-6 p-6 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg border border-border/50"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/logo-rt14.jpg"
                  alt="Logo RT 14"
                  width={56}
                  height={56}
                  className="object-cover rounded-lg"
                />
              </motion.div>
              <div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  RT 14
                </h3>
                <p className="text-muted-foreground text-sm font-medium">Rukun Tetangga</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Membangun komunitas yang harmonis, gotong royong, dan sejahtera bersama warga RT 14 Kelurahan Sukamaju.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-6 p-6 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg border border-border/50"
            variants={itemVariants}
          >
            <h4 className="font-semibold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Menu Utama
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#beranda", label: "Beranda" },
                { href: "#tentang", label: "Tentang RT 14" },
                { href: "#galeri", label: "Galeri" },
                { href: "#kontak", label: "Kontak" },
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm font-medium flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6 p-6 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg border border-border/50"
            variants={itemVariants}
          >
            <h4 className="font-semibold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kontak
            </h4>
            <div className="space-y-4">
              <motion.div
                className="flex items-start space-x-3 group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                </motion.div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Jl. Mawar RT 14/RW 16
                  <br />
                  Bekasi, Tambun Selatan
                </p>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                </motion.div>
                <p className="text-muted-foreground text-sm">+62 819-0886-9218</p>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                </motion.div>
                <p className="text-muted-foreground text-sm">alfanalifa2008@gmail.com</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            className="space-y-6 p-6 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg border border-border/50"
            variants={itemVariants}
          >
            <h4 className="font-semibold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ikuti Kami
            </h4>
            <div className="flex flex-wrap gap-3">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
              ].map(({ Icon, label }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary hover:text-background bg-transparent shadow-md hover:shadow-lg transition-all duration-300 w-12 h-12 p-0 rounded-xl"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Dapatkan update terbaru tentang kegiatan dan informasi RT 14
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm font-medium">
            © 2025 RT 14 Mawar. Semua hak cipta dilindungi.
          </p>
          <motion.p
            className="text-muted-foreground text-sm font-medium flex items-center space-x-1"
            whileHover={{ scale: 1.05 }}
          >
            <span>Dibuat dengan</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ❤️
            </motion.span>
            <span>untuk warga RT 14</span>
          </motion.p>
        </motion.div>
      </div>
    </footer>
  )
}
