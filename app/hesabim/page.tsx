"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Package, LogOut, ChevronRight, Clock, User, Check } from "lucide-react"

type Order = {
  id: string; status: string; total: number
  items: { name: string; qty: number; image: string }[]
  tracking_number: string | null; created_at: string
}

type Profile = {
  full_name: string; email: string; phone: string
  address: string; city: string; postal_code: string
  default_grind: string; newsletter: boolean
}

const statusLabel: Record<string, { label: string; color: string }> = {
  pending:   { label: "Beklemede",     color: "#F59E0B" },
  paid:      { label: "Ödendi",        color: "#5CADD4" },
  preparing: { label: "Hazırlanıyor",  color: "#8B5CF6" },
  shipped:   { label: "Kargoda",       color: "#3B82F6" },
  delivered: { label: "Teslim Edildi", color: "#1A7A3F" },
  cancelled: { label: "İptal Edildi",  color: "#e53e3e" },
}

const grindLabels: Record<string, string> = {
  cekirdek: "Çekirdek (Öğütülmemiş)", v60: "V60 / Pour-Over",
  "french-press": "French Press", espresso: "Espresso", moka: "Moka Pot",
}

export default function HesabimPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"orders" | "profile">("orders")
  const [userId, setUserId] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [profile, setProfile] = useState<Profile>({
    full_name: "", email: "", phone: "", address: "", city: "", postal_code: "", default_grind: "cekirdek", newsletter: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/giris"); return }
      setUserId(user.id)

      const [{ data: prof }, { data: ords }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ])

      if (prof) setProfile({
        full_name: prof.full_name ?? "", email: prof.email ?? user.email ?? "",
        phone: prof.phone ?? "", address: prof.address ?? "",
        city: prof.city ?? "", postal_code: prof.postal_code ?? "",
        default_grind: prof.default_grind ?? "cekirdek", newsletter: prof.newsletter ?? false,
      })
      setOrders(ords ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/"); router.refresh()
  }

  async function saveProfile() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("profiles").upsert({ id: userId, ...profile })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const set = (k: keyof Profile, v: string | boolean) =>
    setProfile((p) => ({ ...p, [k]: v }))

  if (loading) return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "5.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "5.5rem" }}>

      <section className="pt-14 pb-0" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="label mb-2">Hesabım</p>
              <h1 className="heading-lg">{profile.full_name || profile.email}</h1>
              {profile.full_name && <p style={{ fontSize: "0.875rem", color: "#6B6868", marginTop: "0.2rem" }}>{profile.email}</p>}
            </div>
            <button onClick={logout} className="flex items-center gap-2 mt-2"
              style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#6B6868", background: "none", border: "none", cursor: "pointer" }}>
              <LogOut size={14} /> Çıkış
            </button>
          </div>

          {/* Tabs */}
          <div className="flex">
            {([["orders", "Siparişlerim", Package], ["profile", "Profilim", User]] as const).map(([id, label, Icon]) => (
              <button key={id} onClick={() => setTab(id)}
                className="flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600,
                  letterSpacing: "0.04em", textTransform: "uppercase", padding: "0.875rem 1.25rem",
                  background: "transparent", border: "none",
                  borderBottom: tab === id ? "2px solid #2C2B2B" : "2px solid transparent",
                  color: tab === id ? "#2C2B2B" : "#6B6868", cursor: "pointer",
                }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap-narrow">

          {/* SİPARİŞLER */}
          {tab === "orders" && (
            orders.length === 0 ? (
              <div className="py-20 text-center" style={{ border: "1px solid #E8E8E8" }}>
                <Package size={32} style={{ color: "#E8E8E8", margin: "0 auto 1rem" }} />
                <p style={{ fontSize: "0.875rem", color: "#6B6868", marginBottom: "1.5rem" }}>Henüz siparişiniz bulunmuyor.</p>
                <Link href="/magazin" className="btn-dark">Alışverişe Başla</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const st = statusLabel[order.status] ?? { label: order.status, color: "#6B6868" }
                  return (
                    <Link key={order.id} href={`/hesabim/siparis/${order.id}`}
                      style={{ display: "block", textDecoration: "none", border: "1px solid #E8E8E8", background: "#fff", padding: "1.25rem 1.5rem" }}
                      className="hover:border-[#2C2B2B] transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 flex-shrink-0 overflow-hidden" style={{ background: "#F5F5F5" }}>
                            <img src={order.items[0]?.image ?? ""} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#2C2B2B", marginBottom: "0.2rem" }}>
                              {order.items.map((i) => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ""}`).join(", ")}
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: st.color }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.color, display: "inline-block" }} />
                                {st.label}
                              </span>
                              <span style={{ fontSize: "0.75rem", color: "#6B6868", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                <Clock size={11} />
                                {new Date(order.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "1rem", color: "#2C2B2B" }}>
                            ₺{(order.total / 100).toLocaleString("tr-TR")}
                          </span>
                          <ChevronRight size={16} style={{ color: "#6B6868" }} />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )
          )}

          {/* PROFİL */}
          {tab === "profile" && (
            <div style={{ maxWidth: "520px" }}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-ink block mb-2">Ad Soyad</label>
                    <input value={profile.full_name} onChange={(e) => set("full_name", e.target.value)} className="input" placeholder="Adınız Soyadınız" />
                  </div>
                  <div>
                    <label className="label-ink block mb-2">Telefon</label>
                    <input value={profile.phone} onChange={(e) => set("phone", e.target.value)} className="input" placeholder="+90 5XX XXX XX XX" />
                  </div>
                </div>
                <div>
                  <label className="label-ink block mb-2">E-posta</label>
                  <input value={profile.email} disabled className="input" style={{ opacity: 0.5, cursor: "not-allowed" }} />
                </div>
                <div>
                  <label className="label-ink block mb-2">Adres</label>
                  <input value={profile.address} onChange={(e) => set("address", e.target.value)} className="input" placeholder="Mahalle, Cadde, Sokak, No, Daire" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-ink block mb-2">Şehir</label>
                    <input value={profile.city} onChange={(e) => set("city", e.target.value)} className="input" placeholder="İstanbul" />
                  </div>
                  <div>
                    <label className="label-ink block mb-2">Posta Kodu</label>
                    <input value={profile.postal_code} onChange={(e) => set("postal_code", e.target.value)} className="input" placeholder="34000" />
                  </div>
                </div>
                <div>
                  <label className="label-ink block mb-2">Varsayılan Öğütme</label>
                  <div className="relative">
                    <select value={profile.default_grind} onChange={(e) => set("default_grind", e.target.value)} className="select">
                      {Object.entries(grindLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1L6 6L11 1" stroke="#6B6868" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Bülten */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <div onClick={() => set("newsletter", !profile.newsletter)}
                    style={{ width: 18, height: 18, flexShrink: 0, marginTop: "0.1rem", border: `2px solid ${profile.newsletter ? "#2C2B2B" : "#E8E8E8"}`, background: profile.newsletter ? "#2C2B2B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    {profile.newsletter && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: "0.8125rem", color: "#6B6868", lineHeight: 1.5 }}>
                    Yeni ürünler ve indirimler için bülten almak istiyorum.
                  </span>
                </label>

                <div className="flex items-center gap-4 pt-2">
                  <button onClick={saveProfile} disabled={saving} className="btn-dark flex items-center gap-2"
                    style={{ opacity: saving ? 0.6 : 1, background: saved ? "#1A7A3F" : undefined }}>
                    {saved ? <><Check size={14} /> Kaydedildi</> : saving ? "Kaydediliyor…" : "Kaydet"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
