"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function KayitPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    password: "", confirm: "", newsletter: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (form.password !== form.confirm) { setError("Şifreler eşleşmiyor."); return }
    if (form.password.length < 6) { setError("Şifre en az 6 karakter olmalı."); return }
    setLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    // Profili telefon ve bülten ile güncelle
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone || null,
        newsletter: form.newsletter,
      })
    }

    setLoading(false)
    router.push("/hesabim")
    router.refresh()
  }

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "5.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "2rem" }}>

        <div className="mb-10">
          <p className="label mb-3">Hesabınız</p>
          <h1 className="heading-lg">Üye Ol</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-ink block mb-2">Ad Soyad *</label>
            <input type="text" required value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              className="input" placeholder="Adınız Soyadınız" />
          </div>
          <div>
            <label className="label-ink block mb-2">E-posta *</label>
            <input type="email" required value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="input" placeholder="ornek@mail.com" />
          </div>
          <div>
            <label className="label-ink block mb-2">Telefon</label>
            <input type="tel" value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="input" placeholder="+90 5XX XXX XX XX" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-ink block mb-2">Şifre *</label>
              <input type="password" required value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="input" placeholder="En az 6 karakter" />
            </div>
            <div>
              <label className="label-ink block mb-2">Şifre Tekrar *</label>
              <input type="password" required value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                className="input" placeholder="••••••••" />
            </div>
          </div>

          {/* Bülten */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => set("newsletter", !form.newsletter)}
              style={{
                width: 18, height: 18, flexShrink: 0, marginTop: "0.1rem",
                border: `2px solid ${form.newsletter ? "#2C2B2B" : "#E8E8E8"}`,
                background: form.newsletter ? "#2C2B2B" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
              {form.newsletter && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: "0.8125rem", color: "#6B6868", lineHeight: 1.5 }}>
              Yeni ürünler, indirimler ve kahve haberleri için bülten almak istiyorum.
            </span>
          </label>

          {error && <p style={{ fontSize: "0.8125rem", color: "#e53e3e" }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn-dark w-full justify-center"
            style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? "Hesap oluşturuluyor…" : "Üye Ol"}
          </button>
        </form>

        <p style={{ fontSize: "0.8125rem", color: "#6B6868", textAlign: "center", marginTop: "2rem" }}>
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" style={{ color: "#2C2B2B", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Giriş Yap
          </Link>
        </p>

      </div>
    </div>
  )
}
