"use client"

import { useState } from "react"
import { Check, ChevronRight } from "lucide-react"
import { timeSlots, vehicleServices } from "@/lib/data"

const steps = ["Tarih & Saat", "Hizmet", "Detaylar", "İletişim", "Özet"]

function getDays() {
  const days = []
  const today = new Date()
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      dateStr: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" }),
      disabled: d.getDay() === 0,
    })
  }
  return days
}

export default function Rezervasyon() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [form, setForm] = useState({
    date: "", startTime: "", duration: 2,
    service: "", eventType: "", location: "",
    guestCount: "", notes: "",
    name: "", email: "", phone: "", company: "",
  })

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }))
  const ok = () => {
    if (step === 0) return !!(form.date && form.startTime)
    if (step === 1) return !!form.service
    if (step === 2) return !!(form.location && form.guestCount && form.eventType)
    if (step === 3) return !!(form.name && form.email && form.phone)
    return true
  }
  const price = () => {
    const base: Record<string, number> = { "espresso-bar": 2500, "filter-station": 2000, "cold-brew": 1800, "full-menu": 3500 }
    return (base[form.service] || 2500) + Math.max(0, form.duration - 2) * 800
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError("")
    const res = await fetch("/api/rezervasyon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, estimatedPrice: price() }),
    })
    const json = await res.json()
    setSubmitting(false)
    if (json.error) { setSubmitError("Bir hata oluştu, lütfen tekrar deneyin."); return }
    setDone(true)
  }

  if (done) return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", paddingTop: "5.5rem" }}>
      <div style={{ width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", background: "#5CADD4", marginBottom: "2rem" }}>
        <Check size={20} color="white" />
      </div>
      <h2 className="heading-md text-center mb-3">Rezervasyonunuz alındı.</h2>
      <p style={{ fontSize: "0.875rem", color: "#6B6868", textAlign: "center", marginBottom: "0.5rem" }}>{form.email} adresine onay gönderdik.</p>
      <p style={{ fontSize: "0.875rem", color: "#6B6868", textAlign: "center", marginBottom: "2.5rem" }}>24 saat içinde geri döneceğiz.</p>
      <a href="/" className="btn-dark">Ana Sayfaya Dön</a>
    </div>
  )

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "5.5rem" }}>

      <div className="pt-14 pb-12" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <p className="label mb-4">Mobil Araç</p>
          <h1 className="heading-xl">Rezervasyon</h1>
        </div>
      </div>

      <div className="wrap py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-3 py-1.5">
                  <div style={{
                    width: "1.25rem", height: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    background: i < step ? "#5CADD4" : i === step ? "#2C2B2B" : "transparent",
                    border: i < step || i === step ? "none" : "1px solid #E8E8E8",
                    fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 700,
                    color: i < step || i === step ? "#fff" : "#6B6868",
                  }}>
                    {i < step ? <Check size={10} /> : i + 1}
                  </div>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: i === step ? "#2C2B2B" : "#6B6868", fontWeight: i === step ? 600 : 400 }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">

            {/* Mobile progress */}
            <div className="flex gap-1.5 mb-10 lg:hidden">
              {steps.map((_, i) => (
                <div key={i} className="h-0.5 flex-1 transition-colors" style={{ background: i <= step ? "#5CADD4" : "#E8E8E8" }} />
              ))}
            </div>

            <h2 className="heading-md mb-10">{steps[step]}</h2>

            {/* Step 0 */}
            {step === 0 && (
              <div className="space-y-10">
                <div>
                  <p className="label-ink mb-5">Tarih</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {getDays().map(({ dateStr, label, disabled }) => (
                      <button
                        key={dateStr}
                        disabled={disabled}
                        onClick={() => set("date", dateStr)}
                        style={{
                          flexShrink: 0, padding: "0.5rem 0.75rem",
                          fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 500,
                          border: "1px solid", borderRadius: 0,
                          borderColor: form.date === dateStr ? "#5CADD4" : "#E8E8E8",
                          background: form.date === dateStr ? "#5CADD4" : "transparent",
                          color: form.date === dateStr ? "#fff" : disabled ? "#E8E8E8" : "#6B6868",
                          opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label-ink mb-5">Başlangıç Saati</p>
                  <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => set("startTime", t)}
                        style={{
                          padding: "0.625rem", fontFamily: "var(--font-inter)", fontSize: "0.8rem",
                          border: "1px solid", borderRadius: 0,
                          borderColor: form.startTime === t ? "#5CADD4" : "#E8E8E8",
                          background: form.startTime === t ? "#5CADD4" : "transparent",
                          color: form.startTime === t ? "#fff" : "#6B6868", cursor: "pointer",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label-ink mb-5">Süre (min. 2 saat)</p>
                  <div className="flex items-center gap-5">
                    <button onClick={() => form.duration > 2 && set("duration", form.duration - 1)} style={{ width: "2.5rem", height: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E8E8E8", color: "#6B6868", background: "transparent", cursor: "pointer", fontSize: "1.2rem" }}>−</button>
                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "2.5rem", color: "#2C2B2B", lineHeight: 1 }}>{form.duration}h</span>
                    <button onClick={() => set("duration", form.duration + 1)} style={{ width: "2.5rem", height: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E8E8E8", color: "#6B6868", background: "transparent", cursor: "pointer", fontSize: "1.2rem" }}>+</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicleServices.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => set("service", svc.id)}
                    className="text-left p-6"
                    style={{
                      border: "1px solid", borderRadius: 0,
                      borderColor: form.service === svc.id ? "#5CADD4" : "#E8E8E8",
                      background: form.service === svc.id ? "#EBF4FB" : "#FFFFFF",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{svc.icon}</div>
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#2C2B2B", marginBottom: "0.3rem" }}>{svc.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6B6868" }}>{svc.desc}</div>
                    {form.service === svc.id && (
                      <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "#5CADD4" }}>
                        <Check size={11} /> Seçildi
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <label className="label-ink block mb-3">Etkinlik Yeri / Adresi</label>
                  <input type="text" placeholder="Küçükçekmece Fuar Merkezi, İstanbul" value={form.location} onChange={(e) => set("location", e.target.value)} className="input" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label-ink block mb-3">Misafir Sayısı</label>
                    <div className="relative">
                      <select value={form.guestCount} onChange={(e) => set("guestCount", e.target.value)} className="select">
                        <option value="">Seçiniz</option>
                        {["50'den az", "50–150", "150–300", "300–500", "500+"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="#6B6868" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </div>
                  </div>
                  <div>
                    <label className="label-ink block mb-3">Etkinlik Türü</label>
                    <div className="relative">
                      <select value={form.eventType} onChange={(e) => set("eventType", e.target.value)} className="select">
                        <option value="">Seçiniz</option>
                        {["Festival", "Kurumsal Etkinlik", "Düğün / Nişan", "Özel Davet", "Spor Etkinliği", "Diğer"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="#6B6868" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label-ink block mb-3">Notlar (isteğe bağlı)</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} className="input resize-none" placeholder="Özel istekler…" style={{ paddingTop: "0.75rem" }} />
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label-ink block mb-3">Ad Soyad</label>
                    <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className="input" placeholder="Adınız Soyadınız" />
                  </div>
                  <div>
                    <label className="label-ink block mb-3">Şirket</label>
                    <input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} className="input" placeholder="İsteğe bağlı" />
                  </div>
                </div>
                <div>
                  <label className="label-ink block mb-3">E-posta</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="input" placeholder="ornek@sirket.com" />
                </div>
                <div>
                  <label className="label-ink block mb-3">Telefon</label>
                  <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input" placeholder="+90 5xx xxx xx xx" />
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div>
                <div style={{ borderTop: "1px solid #E8E8E8" }}>
                  {[
                    ["Tarih", form.date],
                    ["Başlangıç", form.startTime],
                    ["Süre", `${form.duration} saat`],
                    ["Hizmet", vehicleServices.find((s) => s.id === form.service)?.name || ""],
                    ["Konum", form.location],
                    ["Misafir", form.guestCount],
                    ["Ad Soyad", form.name],
                    ["E-posta", form.email],
                    ["Telefon", form.phone],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-4" style={{ borderBottom: "1px solid #E8E8E8" }}>
                      <span className="label-muted">{label}</span>
                      <span style={{ fontSize: "0.875rem", color: "#2C2B2B" }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-baseline py-5 mt-4 mb-2" style={{ borderTop: "2px solid #2C2B2B" }}>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B" }}>Tahmini Toplam</span>
                  <span style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "2rem", color: "#2C2B2B", lineHeight: 1 }}>₺{price().toLocaleString("tr-TR")}</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#6B6868", marginBottom: "2rem" }}>Kesin fiyat onay aşamasında iletilir. %30 ön ödeme talep edilir.</p>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex justify-between mt-12 pt-8" style={{ borderTop: "1px solid #E8E8E8" }}>
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                style={{ fontSize: "0.8125rem", color: step === 0 ? "#E8E8E8" : "#6B6868", background: "transparent", border: "none", cursor: step === 0 ? "default" : "pointer", textDecoration: "underline", textUnderlineOffset: "3px", fontFamily: "var(--font-inter)" }}
              >
                ← Geri
              </button>
              {step < steps.length - 1 ? (
                <button
                  onClick={() => ok() && setStep((s) => s + 1)}
                  disabled={!ok()}
                  className="btn-dark flex items-center gap-2"
                  style={{ opacity: ok() ? 1 : 0.3, cursor: ok() ? "pointer" : "not-allowed" }}
                >
                  İleri <ChevronRight size={14} />
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {submitError && <p style={{ fontSize: "0.8rem", color: "#e53e3e" }}>{submitError}</p>}
                  <button onClick={handleSubmit} disabled={submitting} className="btn-dark flex items-center gap-2"
                    style={{ opacity: submitting ? 0.6 : 1 }}>
                    {submitting ? "Gönderiliyor…" : <><Check size={14} /> Gönder</>}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
