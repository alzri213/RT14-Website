"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react"

interface Comment {
  id: number
  name: string
  message: string
  created_at: string
}

export function Contact() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState({ name: "", message: "" })
  const [quickMessage, setQuickMessage] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loadingComments, setLoadingComments] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageError, setMessageError] = useState("")

  // Load comments saat pertama kali render
  useEffect(() => {
    fetchComments()

    // Subscribe realtime ke Supabase
    const subscription = supabase
      .channel("public:comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        payload => {
          setComments(prev => [payload.new as Comment, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const fetchComments = async () => {
    setLoadingComments(true)
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) setComments(data)
    setLoadingComments(false)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.name.trim() || !newComment.message.trim()) return

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          name: newComment.name.trim(),
          message: newComment.message.trim(),
        },
      ])
      .select()

    if (!error && data) {
      setNewComment({ name: "", message: "" })
    }
  }

  const handleSendQuickMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessageError("")
    if (
      !quickMessage.name.trim() ||
      !quickMessage.phone.trim() ||
      !quickMessage.subject.trim() ||
      !quickMessage.message.trim()
    ) {
      setMessageError("Semua field harus diisi.")
      return
    }

    setSendingMessage(true)
    const { data, error } = await supabase
      .from("messages")
      .insert([{
        name: quickMessage.name.trim(),
        phone: quickMessage.phone.trim(),
        subject: quickMessage.subject.trim(),
        message: quickMessage.message.trim(),
      }])
      .select()

    setSendingMessage(false)

    if (error) {
      console.error("Supabase insert error:", error)
      setMessageError("Terjadi kesalahan saat mengirim pesan: " + error.message)
      return
    }

    // Jika sukses
    setQuickMessage({ name: "", phone: "", subject: "", message: "" })
    alert("Pesan berhasil dikirim!")
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <section id="kontak" className="py-20 relative text-foreground">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900">
        <div className="absolute inset-0 bg-[url('/indonesian-batik-pattern-subtle.jpg')] opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Hubungi Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Sampaikan pertanyaan, saran, atau keluhan Anda kepada pengurus RT 14
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information & Form */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Alamat</h3>
                    <p className="text-muted-foreground">
                      TPC. Jl. Mawar RT14/RW16
                      <br />
                      Kelurahan RW 16
                      <br />
                      Kecamatan Tambun Selatan
                      <br />
                      Kota Bekasi, Jawa Barat
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telepon</h3>
                    <p className="text-muted-foreground">
                      Ketua RT: +62 819-0886-9218
                      <br />
                      Sekretaris: 0813-4567-8901
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">alfanalifa2008@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
              <CardHeader>
                <CardTitle className="text-xl">Kirim Pesan Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSendQuickMessage}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quick-name">Nama</Label>
                      <Input
                        id="quick-name"
                        value={quickMessage.name}
                        onChange={e => setQuickMessage(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nama lengkap Anda"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quick-phone">No. Telepon</Label>
                      <Input
                        id="quick-phone"
                        value={quickMessage.phone}
                        onChange={e => setQuickMessage(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="08xx-xxxx-xxxx"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="quick-subject">Subjek</Label>
                    <Input
                      id="quick-subject"
                      value={quickMessage.subject}
                      onChange={e => setQuickMessage(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Perihal pesan Anda"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quick-message">Pesan</Label>
                    <Textarea
                      id="quick-message"
                      value={quickMessage.message}
                      onChange={e => setQuickMessage(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tulis pesan Anda di sini..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  {messageError && (
                    <p className="text-red-600 text-sm">{messageError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={sendingMessage}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendingMessage ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Komentar Warga</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form
                  onSubmit={handleSubmitComment}
                  className="space-y-4 p-4 bg-card rounded-lg"
                >
                  <div>
                    <Label htmlFor="comment-name">Nama</Label>
                    <Input
                      id="comment-name"
                      value={newComment.name}
                      onChange={e =>
                        setNewComment(prev => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Nama Anda"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="comment-message">Komentar</Label>
                    <Textarea
                      id="comment-message"
                      value={newComment.message}
                      onChange={e =>
                        setNewComment(prev => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="Tulis komentar atau saran Anda..."
                      className="min-h-[80px]"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!newComment.name.trim() || !newComment.message.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Kirim Komentar
                  </Button>
                </form>

                {loadingComments ? (
                  <p className="text-center text-muted-foreground">Memuat komentar...</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div
                        key={comment.id}
                        className="p-4 border border-border rounded-lg hover:bg-card/80 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-600 text-white font-semibold">
                              {getInitials(comment.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{comment.name}</h4>
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.created_at).toLocaleString("id-ID")}
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-3 text-pretty">
                              {comment.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
