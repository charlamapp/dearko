"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function GirisPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(""); setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    setLoading(false)
    if (error) { setError("E-posta veya şifre hatalı."); return }
    router.push("/hesabim")
    router.refresh()
  }

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>

        <div className="mb-10">
          <p className="label mb-3">Hesabınız</p>
          <h1 className="heading-lg">Giriş Yap</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-ink block mb-2">E-posta</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="input" placeholder="ornek@mail.com"
            />
          </div>
          <div>
            <label className="label-ink block mb-2">Şifre</label>
            <input
              type="password" required value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className="input" placeholder="••••••••"
            />
          </div>

          {error && (
            <p style={{ fontSize: "0.8125rem", color: "#e53e3e" }}>{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-dark w-full justify-center"
            style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <p style={{ fontSize: "0.8125rem", color: "#6B6868", textAlign: "center", marginTop: "2rem" }}>
          Hesabınız yok mu?{" "}
          <Link href="/kayit" style={{ color: "#2C2B2B", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Üye Ol
          </Link>
        </p>

      </div>
    </div>
  )
}
