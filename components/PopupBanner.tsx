"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

type Settings = {
  enabled: boolean
  headline: string
  description: string
  discount_code: string
  discount_amount: string
  button_text: string
  delay_seconds: number
}

const STORAGE_KEY = "dk-popup-ts"
const COOLDOWN_DAYS = 7

export default function PopupBanner() {
  const [s, setS]           = useState<Settings | null>(null)
  const [open, setOpen]     = useState(false)
  const [email, setEmail]   = useState("")
  const [busy, setBusy]     = useState(false)
  const [done, setDone]     = useState(false)
  const [error, setError]   = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Already dismissed recently?
    const ts = localStorage.getItem(STORAGE_KEY)
    if (ts && (Date.now() - +ts) < COOLDOWN_DAYS * 86_400_000) return

    fetch("/api/popup")
      .then((r) => r.json())
      .then((data: Settings) => {
        if (!data?.enabled) return
        setS(data)
        const t = setTimeout(() => setOpen(true), (data.delay_seconds ?? 4) * 1000)
        return () => clearTimeout(t)
      })
      .catch(() => {})
  }, [])

  function dismiss() {
    setOpen(false)
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!s) return
    setBusy(true); setError("")
    const res = await fetch("/api/popup/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, discount_code: s.discount_code }),
    })
    setBusy(false)
    if (res.ok) {
      setDone(true)
      localStorage.setItem(STORAGE_KEY, Date.now().toString())
    } else {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }

  function copyCode() {
    if (!s) return
    navigator.clipboard.writeText(s.discount_code).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!open || !s) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        className="fixed inset-0 z-[600]"
        style={{ background: "rgba(20,20,30,0.55)", backdropFilter: "blur(3px)" }}
      />

      {/* Modal */}
      <div
        className="fixed z-[601] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "min(480px, 92vw)", animation: "fadeUp 0.32s ease" }}
      >
        <div style={{ background: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>

          {/* Top accent bar */}
          <div style={{ height: 4, background: "linear-gradient(90deg, #5CADD4 0%, #3a9ac7 100%)" }} />

          {/* Close */}
          <button
            onClick={dismiss}
            aria-label="Kapat"
            style={{
              position: "absolute", top: 14, right: 14, zIndex: 1,
              width: 30, height: 30, borderRadius: "50%", border: "1px solid #E8E8E8",
              background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={13} color="#6B6868" />
          </button>

          <div style={{ padding: "2rem 2.25rem 2.25rem" }}>

            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <svg width="28" height="38" viewBox="0 0 28 38" fill="none">
                  <path d="M14 0C8 0 3 5 3 12C3 16 4.5 19.5 7 22L4 34C4 36 6 38 8 38H20C22 38 24 36 24 34L21 22C23.5 19.5 25 16 25 12C25 5 20 0 14 0Z" fill="#5CADD4" />
                  <ellipse cx="14" cy="12" rx="6" ry="8" fill="#FFFFFF" />
                </svg>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.3em", color: "#2C2B2B", textTransform: "uppercase" }}>DEARKO</span>
              </div>
            </div>

            {!done ? (
              <>
                {/* Headline */}
                <h2 style={{
                  fontFamily: "var(--font-inter)", textAlign: "center",
                  fontSize: "clamp(1.6rem, 7vw, 2.1rem)", fontWeight: 900,
                  color: "#2C2B2B", letterSpacing: "-0.025em", lineHeight: 1.12,
                  marginBottom: "0.9rem",
                }}>
                  {s.headline}
                </h2>

                <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#6B6868", lineHeight: 1.65, marginBottom: "1.75rem" }}>
                  {s.description}
                </p>

                {/* Form */}
                <form onSubmit={submit}>
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input"
                    style={{ textAlign: "center", marginBottom: "0.75rem" }}
                  />
                  {error && <p style={{ fontSize: "0.78rem", color: "#e53e3e", textAlign: "center", marginBottom: "0.5rem" }}>{error}</p>}
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-dark"
                    style={{ width: "100%", justifyContent: "center", opacity: busy ? 0.6 : 1, fontSize: "0.9rem", letterSpacing: "0.04em" }}
                  >
                    {busy ? "Kaydediliyor…" : s.button_text}
                  </button>
                </form>

                <button
                  onClick={dismiss}
                  style={{ display: "block", width: "100%", textAlign: "center", marginTop: "1rem", fontSize: "0.78rem", color: "#A0A0A0", background: "none", border: "none", cursor: "pointer", lineHeight: 1.5 }}
                >
                  Hayır, tam fiyattan almak istiyorum
                </button>

                {/* Decorative bottom */}
                <div style={{ marginTop: "1.75rem", borderTop: "1px solid #F0F0F0", paddingTop: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
                  {["☕ Ücretsiz Kargo", "🌱 Tek Köken", "✓ İstediğin Zaman İptal"].map((item) => (
                    <span key={item} style={{ fontSize: "0.7rem", color: "#A0A0A0", fontFamily: "var(--font-inter)", fontWeight: 600 }}>{item}</span>
                  ))}
                </div>
              </>
            ) : (
              /* Success state */
              <div style={{ textAlign: "center", padding: "0.5rem 0 1rem" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(92,173,212,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>✓</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "1.35rem", fontWeight: 800, color: "#2C2B2B", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
                  Kuponunuz Hazır!
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#6B6868", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                  İlk siparişinizde aşağıdaki kodu kullanın:
                </p>

                {/* Coupon code */}
                <button
                  onClick={copyCode}
                  style={{
                    width: "100%", background: "#F0F8FC", border: "2px dashed #5CADD4",
                    padding: "1.1rem 1.5rem", cursor: "pointer",
                    fontFamily: "var(--font-inter)", fontSize: "1.6rem", fontWeight: 900,
                    letterSpacing: "0.12em", color: "#2C2B2B",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                    transition: "background 0.2s",
                  }}
                >
                  {s.discount_code}
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#5CADD4", letterSpacing: "0.05em", background: "rgba(92,173,212,0.12)", padding: "3px 8px" }}>
                    {copied ? "KOPYALANDI ✓" : "KOPYALA"}
                  </span>
                </button>

                <p style={{ fontSize: "0.73rem", color: "#A0A0A0", marginTop: "0.75rem", marginBottom: "1.5rem" }}>
                  Kodu kopyalayıp sepette kullanın
                </p>

                <button onClick={dismiss} className="btn-blue" style={{ width: "100%", justifyContent: "center" }}>
                  Alışverişe Başla →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
