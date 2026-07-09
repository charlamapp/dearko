"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"

type ContactData = {
  email: string; rezervasyon: string; telefon: string; whatsapp: string
  adres: string; saatler: string; aciklama: string
}

export default function IletisimPage() {
  const [contact, setContact] = useState<ContactData | null>(null)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c) => setContact(c.iletisim))
  }, [])

  const info: [string, string][] = contact ? [
    ["E-posta", contact.email],
    ["Rezervasyon", contact.rezervasyon],
    ["Telefon", contact.telefon],
    ["WhatsApp", contact.whatsapp],
    ["Adres", contact.adres],
    ["Çalışma Saatleri", contact.saatler],
  ] : []

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "6.25rem" }}>

      <section className="pt-14 pb-12" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <p className="label mb-4">İletişim</p>
          <h1 className="heading-xl">Merhaba deyin.</h1>
        </div>
      </section>

      <section className="section" style={{ background: "#FFFFFF" }}>
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          <div>
            <p className="body-lg mb-10">
              {contact?.aciklama ?? "Abonelik, kurumsal teklif veya mobil araç rezervasyonu için bize ulaşın. 24 saat içinde geri döneceğiz."}
            </p>
            <div className="space-y-5">
              {info.map(([label, value]) => (
                <div key={label} className="flex gap-8" style={{ fontSize: "0.875rem" }}>
                  <span className="label-muted w-28 flex-shrink-0 pt-0.5">{label}</span>
                  <span style={{ color: "#2C2B2B" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {sent ? (
            <div className="flex flex-col justify-center">
              <div className="w-10 h-10 flex items-center justify-center mb-6" style={{ background: "#6C8145" }}>
                <Check size={16} color="white" />
              </div>
              <h3 className="heading-md mb-2">Mesajınız ulaştı.</h3>
              <p style={{ fontSize: "0.875rem", color: "#6B6868" }}>En geç 24 saat içinde döneceğiz.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label-ink block mb-3">Ad Soyad</label>
                  <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className="input" placeholder="Adınız" />
                </div>
                <div>
                  <label className="label-ink block mb-3">E-posta</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="input" placeholder="e-posta" />
                </div>
              </div>
              <div>
                <label className="label-ink block mb-3">Konu</label>
                <div className="relative">
                  <select value={form.subject} onChange={(e) => set("subject", e.target.value)} className="select">
                    <option value="">Seçiniz</option>
                    {["Abonelik", "Kurumsal Teklif", "Mobil Araç Rezervasyonu", "Sipariş", "Diğer"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="#6B6868" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="label-ink block mb-3">Mesaj</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  className="input resize-none"
                  placeholder="Mesajınızı yazın…"
                  style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
                />
              </div>
              <button
                onClick={() => { if (form.name && form.email && form.message) setSent(true) }}
                className="btn-dark"
              >
                Gönder
              </button>
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
