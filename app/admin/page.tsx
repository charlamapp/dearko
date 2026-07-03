"use client"

import { useState, useEffect, useRef } from "react"
import {
  Plus, Pencil, Trash2, X, Check, Upload, LogOut,
  Coffee, Package, Image as ImageIcon, Info, Phone, Building2, Truck, Users, ShoppingBag, CalendarCheck, BarChart2,
} from "lucide-react"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

function adminSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const ADMIN_PASSWORD = "dearko2024"

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  id: string; name: string; category: "coffee" | "equipment"; price: number; image: string; description: string
  origin?: string; region?: string; process?: string; roast?: string; flavor?: string[]; weight?: string; brand?: string
}

type HeroSlide = { id: string; image: string; headline: string; sub: string; cta: string; href: string }

type Milestone = { year: string; event: string }

type PriceRow = { label: string; price: string }

type Content = {
  hero: HeroSlide[]
  hakkimizda: { heroHeadline: string; storyImage: string; story1: string; story2: string; milestones: Milestone[] }
  iletisim: { email: string; rezervasyon: string; telefon: string; whatsapp: string; adres: string; saatler: string; aciklama: string }
  kurumsal: { heroImage: string; heroHeadline: string; introText: string }
  mobilArac: { heroImage: string; heroHeadline: string; baseFiyat: string; pricing: PriceRow[]; gallery: string[] }
}

const emptyProduct: Omit<Product, "id"> = {
  name: "", category: "coffee", price: 0, image: "", description: "",
  origin: "", region: "", process: "", roast: "", flavor: [], weight: "250g", brand: "",
}

const sidebarItems = [
  { id: "analitik",      label: "Analitik",       icon: BarChart2 },
  { id: "products",      label: "Ürünler",        icon: Coffee },
  { id: "siparisler",    label: "Siparişler",     icon: ShoppingBag },
  { id: "rezervasyonlar", label: "Rezervasyonlar", icon: CalendarCheck },
  { id: "hero",          label: "Hero Slider",    icon: ImageIcon },
  { id: "hakkimizda",    label: "Hakkımızda",     icon: Info },
  { id: "iletisim",      label: "İletişim",       icon: Phone },
  { id: "kurumsal",      label: "Kurumsal",       icon: Building2 },
  { id: "mobilArac",     label: "Mobil Araç",     icon: Truck },
  { id: "musteriler",    label: "Müşteriler",     icon: Users },
] as const

type Section = typeof sidebarItems[number]["id"]

type Customer = {
  id: string; full_name: string | null; email: string | null; phone: string | null
  city: string | null; newsletter: boolean; default_grind: string | null
  notes: string | null; created_at: string; order_count: number; total_spent: number
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw]         = useState("")
  const [pwError, setPwError] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("dk-admin") === "1") setAuthed(true)
  }, [])

  function login() {
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("dk-admin", "1"); setAuthed(true) }
    else { setPwError(true); setTimeout(() => setPwError(false), 1500) }
  }

  if (!authed) return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "360px", padding: "2rem" }}>
        <div className="flex flex-col items-center mb-10">
          <svg width="32" height="44" viewBox="0 0 28 38" fill="none" className="mb-3">
            <path d="M14 0C8 0 3 5 3 12C3 16 4.5 19.5 7 22L4 34C4 36 6 38 8 38H20C22 38 24 36 24 34L21 22C23.5 19.5 25 16 25 12C25 5 20 0 14 0Z" fill="#5CADD4" />
            <ellipse cx="14" cy="12" rx="6" ry="8" fill="#FFFFFF" />
          </svg>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: "#2C2B2B" }}>DEARKO ADMIN</span>
        </div>
        <p className="label-ink mb-8 text-center">Yönetim Paneli</p>
        <div className="space-y-4">
          <input
            type="password" placeholder="Şifre" value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="input text-center"
            style={{ borderColor: pwError ? "#e53e3e" : undefined }}
            autoFocus
          />
          {pwError && <p style={{ fontSize: "0.8rem", color: "#e53e3e", textAlign: "center" }}>Şifre hatalı</p>}
          <button onClick={login} className="btn-dark w-full justify-center">Giriş Yap</button>
        </div>
        <p style={{ fontSize: "0.72rem", color: "#6B6868", textAlign: "center", marginTop: "2rem" }}>
          Varsayılan şifre: dearko2024
        </p>
      </div>
    </div>
  )

  return <AdminPanel onLogout={() => { sessionStorage.removeItem("dk-admin"); setAuthed(false); setPw("") }} />
}

// ─── Panel ────────────────────────────────────────────────────────────────────

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>("analitik")
  const [toast, setToast]     = useState("")

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500) }

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "4rem", display: "flex" }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-3"
          style={{ background: "#2C2B2B", color: "#fff", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 500 }}>
          <Check size={13} style={{ color: "#5CADD4" }} /> {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ width: "220px", flexShrink: 0, background: "#F5F5F5", borderRight: "1px solid #E8E8E8", position: "sticky", top: "4rem", height: "calc(100vh - 4rem)", overflowY: "auto" }}>
        <div className="p-5">
          <p className="label mb-6" style={{ paddingTop: "0.5rem" }}>Yönetim Paneli</p>
          <nav className="space-y-1">
            {sidebarItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setSection(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
                style={{
                  fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600,
                  letterSpacing: "0.03em", background: section === id ? "#FFFFFF" : "transparent",
                  border: "none", cursor: "pointer",
                  color: section === id ? "#2C2B2B" : "#6B6868",
                  borderLeft: section === id ? "2px solid #2C2B2B" : "2px solid transparent",
                }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </nav>
          <div style={{ borderTop: "1px solid #E8E8E8", marginTop: "2rem", paddingTop: "1.25rem" }} className="space-y-2">
            <a href="/" target="_blank" className="w-full flex items-center gap-2 px-3 py-2"
              style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B6868", textDecoration: "none" }}>
              ↗ Siteyi Gör
            </a>
            <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2"
              style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B6868", background: "none", border: "none", cursor: "pointer" }}>
              <LogOut size={13} /> Çıkış
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, padding: "2.5rem 2rem 4rem" }}>
        {section === "analitik"       && <AnalitikSection      onToast={showToast} />}
        {section === "products"       && <ProductsSection      onToast={showToast} />}
        {section === "siparisler"    && <SiparislerSection    onToast={showToast} />}
        {section === "rezervasyonlar" && <RezervasyonlarSection onToast={showToast} />}
        {section === "hero"           && <HeroSection          onToast={showToast} />}
        {section === "hakkimizda" && <HakkimizdaSection onToast={showToast} />}
        {section === "iletisim"   && <IletisimSection  onToast={showToast} />}
        {section === "kurumsal"   && <KurumsalSection  onToast={showToast} />}
        {section === "mobilArac"  && <MobilAracSection onToast={showToast} />}
        {section === "musteriler" && <MusterilerSection onToast={showToast} />}
      </main>
    </div>
  )
}

// ─── Analytics Section ────────────────────────────────────────────────────────

type AnalyticsCountry = { code: string; name: string; count: number; lat: number; lng: number }
type AnalyticsVisit   = { country: string; country_name: string; city: string; page: string; created_at: string }
type AnalyticsData    = { total30d: number; activeNow: number; countries: AnalyticsCountry[]; recent: AnalyticsVisit[]; hourly: number[] }

// Simplified continent detection via bounding boxes
function isLand(lat: number, lng: number): boolean {
  while (lng > 180) lng -= 360
  while (lng < -180) lng += 360
  if (lat < -65) return true                                                          // Antarctica
  if (lat > 25 && lat < 73 && lng > -140 && lng < -60) return true                  // North America
  if (lat > 55 && lat < 73 && lng > -168 && lng < -140) return true                 // Alaska
  if (lat > 15 && lat < 28 && lng > -118 && lng < -86) return true                  // Mexico
  if (lat > 60 && lat < 84 && lng > -57 && lng < -18) return true                   // Greenland
  if (lat > -56 && lat < 12 && lng > -82 && lng < -34) return true                  // South America
  if (lat > 36 && lat < 71 && lng > -10 && lng < 32) return true                    // Europe
  if (lat > 36 && lat < 42 && lng > 26 && lng < 45) return true                     // Turkey
  if (lat > -36 && lat < 37 && lng > -18 && lng < 52) return true                   // Africa
  if (lat > 50 && lat < 78 && lng > 32 && lng < 180) return true                    // Russia / N Asia
  if (lat > 35 && lat < 50 && lng > 45 && lng < 140) return true                    // Central & E Asia
  if (lat > 12 && lat < 37 && lng > 35 && lng < 62) return true                     // Arabian Peninsula
  if (lat > 8 && lat < 35 && lng > 62 && lng < 92) return true                      // India
  if (lat > 1 && lat < 28 && lng > 92 && lng < 112) return true                     // SE Asia mainland
  if (lat > -10 && lat < 22 && lng > 95 && lng < 128) return true                   // Indonesia / Philippines
  if (lat > 30 && lat < 46 && lng > 128 && lng < 146) return true                   // Japan / Korea
  if (lat > -44 && lat < -10 && lng > 113 && lng < 155) return true                 // Australia
  if (lat > -47 && lat < -34 && lng > 165 && lng < 178) return true                 // New Zealand
  return false
}

// ── 3D Globe (Canvas, orthographic projection) ────────────────────────────────
function GlobeCanvas({ visitors }: { visitors: AnalyticsCountry[] }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const lngRef      = useRef(30)          // current center longitude (rotates)
  const rafRef      = useRef<number>(0)
  const lastRef     = useRef(0)
  const visitorsRef = useRef(visitors)
  useEffect(() => { visitorsRef.current = visitors }, [visitors])

  useEffect(() => {
    function draw() {
      const cv = canvasRef.current
      if (!cv) return
      const ctx = cv.getContext("2d")!
      const S = cv.width
      const cx = S / 2, cy = S / 2
      const R = S / 2 - 6

      ctx.clearRect(0, 0, S, S)

      // ── Sphere background ──────────────────────────────────────────────────
      const bg = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.25, 0, cx, cy, R)
      bg.addColorStop(0,   "#eef8fd")
      bg.addColorStop(0.7, "#d2ebf7")
      bg.addColorStop(1,   "#b8dff0")
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill()

      // ── Hex dot grid via inverse orthographic projection ───────────────────
      const PHI1  = 18 * Math.PI / 180   // center latitude (slight north tilt)
      const LAM0  = lngRef.current * Math.PI / 180
      const sp    = Math.max(4.5, R / 36) // dot grid spacing

      const rows = Math.ceil(R / sp) + 2
      for (let ri = -rows; ri <= rows; ri++) {
        const yr = ri * sp
        const cols = Math.ceil(R / sp) + 2
        for (let ci = -cols; ci <= cols; ci++) {
          const xr = ci * sp + (((ri % 2) + 2) % 2 === 0 ? 0 : sp * 0.5)
          const d2 = xr * xr + yr * yr
          if (d2 >= R * R) continue
          const d    = Math.sqrt(d2)
          const norm = d / R
          const c    = Math.asin(norm)
          let phi: number, lam: number
          if (d < 1e-4) { phi = PHI1; lam = LAM0 }
          else {
            const cosC = Math.cos(c), sinC = Math.sin(c)
            phi = Math.asin(Math.min(1, Math.max(-1,
              cosC * Math.sin(PHI1) + (-yr / d) * sinC * Math.cos(PHI1))))
            lam = LAM0 + Math.atan2(xr * sinC,
              d * Math.cos(PHI1) * cosC + yr * Math.sin(PHI1) * sinC)
          }
          const lat = phi * 180 / Math.PI
          let  lng  = lam * 180 / Math.PI
          while (lng >  180) lng -= 360
          while (lng < -180) lng += 360

          const ef = Math.sqrt(1 - norm * norm)     // edge falloff
          const dr = sp * 0.38 * ef
          if (dr < 0.28) continue

          const land = isLand(lat, lng)
          ctx.beginPath()
          ctx.arc(cx + xr, cy + yr, dr, 0, Math.PI * 2)
          ctx.fillStyle = land
            ? `rgba(92,173,212,${(0.55 + 0.35 * ef).toFixed(2)})`
            : `rgba(175,218,240,${(0.10 + 0.12 * ef).toFixed(2)})`
          ctx.fill()
        }
      }

      // ── Visitor pins ───────────────────────────────────────────────────────
      const PHI1_V = 18 * Math.PI / 180
      for (const v of visitorsRef.current) {
        const phi = v.lat * Math.PI / 180
        const lam = v.lng * Math.PI / 180
        const cosC = Math.sin(PHI1_V) * Math.sin(phi) + Math.cos(PHI1_V) * Math.cos(phi) * Math.cos(lam - LAM0)
        if (cosC <= 0.06) continue   // on the back hemisphere

        const px = R * Math.cos(phi) * Math.sin(lam - LAM0)
        const py = R * (Math.cos(PHI1_V) * Math.sin(phi) - Math.sin(PHI1_V) * Math.cos(phi) * Math.cos(lam - LAM0))
        const sx = cx + px, sy = cy - py

        const pr = Math.min(11, 5 + Math.log2(Math.max(1, v.count)) * 1.6)

        // outer glow
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, pr * 3.5)
        grd.addColorStop(0, "rgba(44,126,192,0.5)")
        grd.addColorStop(1, "rgba(44,126,192,0)")
        ctx.beginPath(); ctx.arc(sx, sy, pr * 3.5, 0, Math.PI * 2)
        ctx.fillStyle = grd; ctx.fill()

        // dot
        ctx.beginPath(); ctx.arc(sx, sy, pr, 0, Math.PI * 2)
        ctx.fillStyle = "#2C7EC0"; ctx.fill()

        // white center
        ctx.beginPath(); ctx.arc(sx, sy, pr * 0.38, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"; ctx.fill()
      }

      // ── Sphere glass highlight ─────────────────────────────────────────────
      const hl = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.32, 0, cx, cy, R)
      hl.addColorStop(0,   "rgba(255,255,255,0.48)")
      hl.addColorStop(0.5, "rgba(255,255,255,0.06)")
      hl.addColorStop(1,   "rgba(255,255,255,0)")
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = hl; ctx.fill()

      // ── Edge shadow ────────────────────────────────────────────────────────
      const es = ctx.createRadialGradient(cx, cy, R * 0.78, cx, cy, R)
      es.addColorStop(0, "rgba(10,60,110,0)")
      es.addColorStop(1, "rgba(10,60,110,0.20)")
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = es; ctx.fill()
    }

    function animate(now: number) {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0
      lastRef.current = now
      lngRef.current  = (lngRef.current - dt * 4) % 360
      draw()
      rafRef.current  = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])   // runs once; reads visitors via ref

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}
    />
  )
}

// ── AnalitikSection ────────────────────────────────────────────────────────────
function AnalitikSection({ onToast: _ }: { onToast: (m: string) => void }) {
  const [data,       setData]       = useState<AnalyticsData | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  async function load() {
    try {
      const r = await fetch("/api/admin/analytics", { headers: { "x-admin-pw": ADMIN_PASSWORD } })
      if (r.ok) { setData(await r.json()); setLastUpdate(new Date()) }
    } finally { setLoading(false) }
  }
  useEffect(() => { load(); const t = setInterval(load, 30_000); return () => clearInterval(t) }, [])

  const maxCount = data?.countries?.[0]?.count ?? 1

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-8 pb-6" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-inter)", fontSize: "1.4rem", fontWeight: 800, textTransform: "uppercase", color: "#2C2B2B" }}>Analitik</h1>
          <p style={{ fontSize: "0.8125rem", color: "#6B6868", marginTop: "0.35rem" }}>Gerçek zamanlı ziyaretçi haritası — 30 saniyede güncellenir.</p>
        </div>
        {lastUpdate && (
          <p style={{ fontSize: "0.7rem", color: "#A0A0A0", fontFamily: "var(--font-inter)" }}>
            Güncellendi: {lastUpdate.toLocaleTimeString("tr-TR")}
          </p>
        )}
      </div>

      {/* Two-column layout — Shopify style */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start" }}>

        {/* ── LEFT: stats + tables ────────────────────────────────────────── */}
        <div style={{ flex: "0 0 42%", minWidth: 0 }}>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1.75rem" }}>

            {/* Active now — full width */}
            <div style={{ gridColumn: "1 / -1", border: "1px solid #E8E8E8", padding: "1.1rem 1.35rem", background: "#FAFAFA" }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.7)", display: "inline-block" }} />
                <p className="label">Şu Anki Ziyaretçiler</p>
              </div>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "2.4rem", fontWeight: 900, color: "#2C2B2B", lineHeight: 1 }}>
                {loading ? "—" : (data?.activeNow ?? 0)}
              </p>
              <p style={{ fontSize: "0.72rem", color: "#8A8A8A", marginTop: "0.3rem" }}>son 5 dakika içinde</p>
            </div>

            {[
              { label: "Bu Ay", value: loading ? "—" : (data?.total30d ?? 0).toLocaleString("tr-TR"), sub: "son 30 gün" },
              { label: "Ülke",  value: loading ? "—" : (data?.countries?.length ?? 0),                 sub: "farklı kaynak" },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ border: "1px solid #E8E8E8", padding: "1rem 1.2rem" }}>
                <p className="label mb-1.5">{label}</p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.75rem", fontWeight: 800, color: "#2C2B2B", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "0.7rem", color: "#8A8A8A", marginTop: "0.25rem" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Top countries */}
          <p className="label mb-4">Konuma Göre Oturumlar</p>
          {loading ? (
            <div className="space-y-2.5">{[...Array(6)].map((_, i) => <div key={i} className="h-7 animate-pulse" style={{ background: "#F0F0F0" }} />)}</div>
          ) : data?.countries?.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "#8A8A8A" }}>Henüz veri yok — ziyaretçiler gelince burada görünecek.</p>
          ) : (
            <div className="space-y-2">
              {data?.countries?.slice(0, 8).map((c, i) => {
                const pct = Math.round((c.count / maxCount) * 100)
                return (
                  <div key={c.code}>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", fontWeight: 700, color: "#A0A0A0", width: 14, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: "0.8rem", color: "#2C2B2B", flex: 1 }}>{c.name}</span>
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 700, color: "#5CADD4", flexShrink: 0 }}>{c.count}</span>
                    </div>
                    <div style={{ marginLeft: 22, height: 2.5, background: "#EEF0F2", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#5CADD4", borderRadius: 2, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Recent visits */}
          {(data?.recent?.length ?? 0) > 0 && (
            <>
              <p className="label mt-7 mb-4">Son Ziyaretler</p>
              <div style={{ border: "1px solid #E8E8E8" }}>
                {data!.recent.slice(0, 10).map((v, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2"
                    style={{ borderBottom: i < 9 ? "1px solid #F5F5F5" : "none" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "#5CADD4", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.page}</span>
                    <span style={{ fontSize: "0.72rem", color: "#6B6868", flexShrink: 0 }}>{v.city ? `${v.city}, ` : ""}{v.country_name ?? v.country}</span>
                    <span style={{ fontSize: "0.65rem", color: "#B0B0B0", fontFamily: "var(--font-inter)", flexShrink: 0 }}>
                      {new Date(v.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT: 3D Globe ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
          {/* Live badge */}
          <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.85)", padding: "4px 11px", backdropFilter: "blur(8px)", border: "1px solid rgba(92,173,212,0.25)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 7px rgba(34,197,94,0.8)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 700, color: "#2C2B2B", letterSpacing: "0.1em" }}>CANLI</span>
          </div>
          <GlobeCanvas visitors={data?.countries ?? []} />
          <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#C0C0C0", fontFamily: "var(--font-inter)", marginTop: "0.5rem" }}>
            Dönen küre — ziyaretçi konumları mavi nokta olarak görünür
          </p>
        </div>

      </div>
    </div>
  )
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 pb-6" style={{ borderBottom: "1px solid #E8E8E8" }}>
      <h1 style={{ fontFamily: "var(--font-inter)", fontSize: "1.4rem", fontWeight: 800, textTransform: "uppercase", color: "#2C2B2B" }}>{title}</h1>
      {subtitle && <p style={{ fontSize: "0.8125rem", color: "#6B6868", marginTop: "0.35rem" }}>{subtitle}</p>}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-ink block mb-2">{label}</label>
      {children}
    </div>
  )
}

function SaveBtn({ saving, onClick, disabled }: { saving: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={saving || disabled} className="btn-dark"
      style={{ opacity: saving || disabled ? 0.45 : 1 }}>
      {saving ? "Kaydediliyor…" : "Kaydet"}
    </button>
  )
}

// ─── Products Section ─────────────────────────────────────────────────────────

function ProductsSection({ onToast }: { onToast: (m: string) => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [tab, setTab]           = useState<"coffee" | "equipment">("coffee")
  const [modal, setModal]       = useState<"add" | "edit" | null>(null)
  const [form, setForm]         = useState<Omit<Product, "id">>(emptyProduct)
  const [editId, setEditId]     = useState<string | null>(null)
  const [delId, setDelId]       = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [flavorInput, setFlavorInput] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function load() { const r = await fetch("/api/products"); setProducts(await r.json()) }
  useEffect(() => { load() }, [])

  async function handleUpload(file: File) {
    setUploading(true)
    const fd = new FormData(); fd.append("file", file)
    const { url } = await (await fetch("/api/upload", { method: "POST", body: fd })).json()
    setForm((f) => ({ ...f, image: url })); setUploading(false)
  }

  async function save() {
    if (!form.name || !form.price || !form.image) return
    setSaving(true)
    const payload = { ...form, price: Number(form.price), flavor: form.category === "coffee" ? (form.flavor ?? []) : undefined }
    if (modal === "add") {
      await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      onToast("Ürün eklendi ✓")
    } else if (editId) {
      await fetch(`/api/products/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      onToast("Ürün güncellendi ✓")
    }
    setSaving(false); setModal(null); load()
  }

  async function confirmDelete() {
    if (!delId) return
    await fetch(`/api/products/${delId}`, { method: "DELETE" })
    setDelId(null); onToast("Ürün silindi"); load()
  }

  const filtered = products.filter((p) => p.category === tab)

  return (
    <div>
      <SectionHeader title="Ürünler" subtitle="Kahve çekirdekleri ve ekipmanları yönetin." />

      <div className="flex items-center justify-between mb-6">
        <div className="flex">
          {([["coffee", "Kahveler", Coffee], ["equipment", "Ekipmanlar", Package]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className="flex items-center gap-2"
              style={{
                fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
                padding: "0.75rem 1.25rem", border: "none",
                borderBottom: tab === id ? "2px solid #2C2B2B" : "2px solid transparent",
                color: tab === id ? "#2C2B2B" : "#6B6868", background: "transparent", cursor: "pointer",
              }}>
              <Icon size={14} /> {label} ({products.filter((p) => p.category === id).length})
            </button>
          ))}
        </div>
        <button onClick={() => { setForm({ ...emptyProduct, category: tab }); setFlavorInput(""); setModal("add") }} className="btn-dark flex items-center gap-2">
          <Plus size={14} /> Yeni Ürün
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p style={{ fontSize: "0.875rem", color: "#6B6868" }}>Henüz ürün yok. "Yeni Ürün" butonuyla ekleyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <div key={p.id} style={{ border: "1px solid #E8E8E8", background: "#fff" }}>
              <div className="aspect-square overflow-hidden" style={{ background: "#F5F5F5" }}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="label-muted mb-1">{p.category === "coffee" ? `${p.origin} · ${p.roast}` : p.brand}</p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B", marginBottom: "0.25rem" }}>{p.name}</p>
                <p style={{ fontSize: "0.8125rem", color: "#6B6868", marginBottom: "0.75rem" }}>₺{p.price}{p.weight ? ` / ${p.weight}` : ""}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setForm({ ...p }); setFlavorInput((p.flavor ?? []).join(", ")); setEditId(p.id); setModal("edit") }}
                    className="flex items-center gap-1.5 flex-1 justify-center py-2"
                    style={{ border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#2C2B2B", background: "transparent", cursor: "pointer" }}>
                    <Pencil size={12} /> Düzenle
                  </button>
                  <button onClick={() => setDelId(p.id)}
                    className="flex items-center gap-1.5 px-3 py-2"
                    style={{ border: "1px solid #E8E8E8", color: "#e53e3e", background: "transparent", cursor: "pointer" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-10 px-4" style={{ background: "rgba(0,0,0,0.35)" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "640px", padding: "2.5rem", position: "relative" }}>
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ fontFamily: "var(--font-inter)", fontSize: "1.1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2C2B2B" }}>
                {modal === "add" ? "Yeni Ürün Ekle" : "Ürünü Düzenle"}
              </h2>
              <button onClick={() => setModal(null)} style={{ color: "#6B6868", background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div className="space-y-5">
              <Field label="Kategori">
                <div className="flex gap-3">
                  {(["coffee", "equipment"] as const).map((c) => (
                    <button key={c} onClick={() => setForm((f) => ({ ...f, category: c }))}
                      style={{ flex: 1, padding: "0.625rem", fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", border: "1px solid", borderColor: form.category === c ? "#2C2B2B" : "#E8E8E8", background: form.category === c ? "#2C2B2B" : "transparent", color: form.category === c ? "#fff" : "#6B6868", cursor: "pointer" }}>
                      {c === "coffee" ? "☕ Kahve" : "📦 Ekipman"}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Ürün Adı *">
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" placeholder="Etiyopya Yirgacheffe" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Fiyat (₺) *">
                  <input type="number" value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="input" placeholder="320" />
                </Field>
                <Field label={form.category === "coffee" ? "Ağırlık" : "Marka"}>
                  {form.category === "coffee" ? (
                    <input value={form.weight ?? ""} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} className="input" placeholder="250g" />
                  ) : (
                    <input value={form.brand ?? ""} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="input" placeholder="Hario" />
                  )}
                </Field>
              </div>
              {form.category === "coffee" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Origin (Ülke)">
                      <input value={form.origin ?? ""} onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))} className="input" placeholder="Etiyopya" />
                    </Field>
                    <Field label="Bölge">
                      <input value={form.region ?? ""} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} className="input" placeholder="Yirgacheffe" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="İşlem">
                      <div className="relative">
                        <select value={form.process ?? ""} onChange={(e) => setForm((f) => ({ ...f, process: e.target.value }))} className="select">
                          <option value="">Seçin</option>
                          {["Yıkama", "Doğal", "Bal", "Anaerobic"].map((o) => <option key={o}>{o}</option>)}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="#6B6868" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </div>
                    </Field>
                    <Field label="Kavrum">
                      <div className="relative">
                        <select value={form.roast ?? ""} onChange={(e) => setForm((f) => ({ ...f, roast: e.target.value }))} className="select">
                          <option value="">Seçin</option>
                          {["Açık Kavrum", "Açık-Orta", "Orta Kavrum", "Orta-Koyu", "Koyu Kavrum"].map((o) => <option key={o}>{o}</option>)}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="#6B6868" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </div>
                    </Field>
                  </div>
                  <Field label="Tat Notları (virgülle ayırın)">
                    <input value={flavorInput}
                      onChange={(e) => { setFlavorInput(e.target.value); setForm((f) => ({ ...f, flavor: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })) }}
                      className="input" placeholder="Bergamot, Şeftali, Çiçeksi" />
                    {(form.flavor ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(form.flavor ?? []).map((t) => (
                          <span key={t} style={{ border: "1px solid #E8E8E8", fontSize: "0.7rem", color: "#6B6868", padding: "0.15rem 0.5rem", fontFamily: "var(--font-inter)" }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </Field>
                </>
              )}
              <Field label="Görsel *">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleUpload(f) }}>
                  {form.image ? (
                    <div className="relative">
                      <div className="w-full aspect-video overflow-hidden" style={{ background: "#F5F5F5" }}>
                        <img src={form.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <button onClick={() => setForm((f) => ({ ...f, image: "" }))}
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center"
                        style={{ background: "rgba(44,43,43,0.8)", color: "#fff", border: "none", cursor: "pointer" }}>
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => fileRef.current?.click()}
                      className="w-full py-10 flex flex-col items-center justify-center cursor-pointer hover:opacity-80"
                      style={{ border: "1.5px dashed #E8E8E8", background: "#F5F5F5" }}>
                      {uploading ? <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Yükleniyor…</p> : (
                        <>
                          <Upload size={22} style={{ color: "#6B6868", marginBottom: "0.5rem" }} />
                          <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Tıkla veya sürükle bırak</p>
                        </>
                      )}
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
                </div>
                {!form.image && (
                  <>
                    <div className="flex items-center gap-2 my-2">
                      <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
                      <span style={{ fontSize: "0.7rem", color: "#6B6868" }}>ya da URL yapıştır</span>
                      <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
                    </div>
                    <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="input" placeholder="https://images.unsplash.com/…" />
                  </>
                )}
              </Field>
              <Field label="Açıklama">
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input resize-none" placeholder="Ürün açıklaması…" style={{ paddingTop: "0.75rem" }} />
              </Field>
            </div>
            <div className="flex gap-3 mt-8 pt-6" style={{ borderTop: "1px solid #E8E8E8" }}>
              <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">İptal</button>
              <button onClick={save} disabled={saving || !form.name || !form.price || !form.image} className="btn-dark flex-1 justify-center"
                style={{ opacity: saving || !form.name || !form.price || !form.image ? 0.4 : 1 }}>
                {saving ? "Kaydediliyor…" : modal === "add" ? "Ürünü Ekle" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.35)" }}>
          <div style={{ background: "#FFFFFF", padding: "2rem", maxWidth: "360px", width: "100%" }}>
            <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", color: "#2C2B2B", marginBottom: "0.75rem" }}>Ürünü Sil?</h3>
            <p style={{ fontSize: "0.875rem", color: "#6B6868", marginBottom: "1.5rem" }}>Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="btn-outline flex-1 justify-center">İptal</button>
              <button onClick={confirmDelete} className="btn-dark flex-1 justify-center" style={{ background: "#e53e3e" }}>Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ onToast }: { onToast: (m: string) => void }) {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c: Content) => setSlides(c.hero))
  }, [])

  async function uploadImg(file: File) {
    setUploading(true)
    const fd = new FormData(); fd.append("file", file)
    const { url } = await (await fetch("/api/upload", { method: "POST", body: fd })).json()
    updateSlide(activeIdx, "image", url); setUploading(false)
  }

  function updateSlide(idx: number, key: keyof HeroSlide, val: string) {
    setSlides((s) => s.map((slide, i) => i === idx ? { ...slide, [key]: val } : slide))
  }

  async function saveSlides() {
    setSaving(true)
    await fetch("/api/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "hero", data: slides }) })
    setSaving(false); onToast("Hero slider kaydedildi ✓")
  }

  if (!slides.length) return <div className="py-20 text-center"><div className="inline-block w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" /></div>

  const s = slides[activeIdx]

  return (
    <div>
      <SectionHeader title="Hero Slider" subtitle="Ana sayfadaki slider slaytlarını düzenleyin." />

      {/* Slide tabs */}
      <div className="flex gap-2 mb-6">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setActiveIdx(i)}
            style={{ padding: "0.5rem 1rem", fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", background: activeIdx === i ? "#2C2B2B" : "transparent", color: activeIdx === i ? "#fff" : "#6B6868", border: "1px solid", borderColor: activeIdx === i ? "#2C2B2B" : "#E8E8E8", cursor: "pointer" }}>
            Slayt {i + 1}
          </button>
        ))}
      </div>

      <div className="space-y-5" style={{ maxWidth: "640px" }}>
        <Field label="Görsel">
          <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadImg(f) }}>
            {s.image ? (
              <div className="relative">
                <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9", background: "#F5F5F5" }}>
                  <img src={s.image} alt="" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => updateSlide(activeIdx, "image", "")}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center"
                  style={{ background: "rgba(44,43,43,0.8)", color: "#fff", border: "none", cursor: "pointer" }}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()}
                className="w-full py-10 flex flex-col items-center justify-center cursor-pointer hover:opacity-80"
                style={{ border: "1.5px dashed #E8E8E8", background: "#F5F5F5" }}>
                {uploading ? <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Yükleniyor…</p> : (
                  <>
                    <Upload size={20} style={{ color: "#6B6868", marginBottom: "0.4rem" }} />
                    <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Tıkla veya sürükle bırak</p>
                  </>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImg(f) }} />
          </div>
          {!s.image && (
            <>
              <div className="flex items-center gap-2 my-2">
                <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
                <span style={{ fontSize: "0.7rem", color: "#6B6868" }}>ya da URL yapıştır</span>
                <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
              </div>
              <input value={s.image} onChange={(e) => updateSlide(activeIdx, "image", e.target.value)} className="input" placeholder="https://…" />
            </>
          )}
        </Field>
        <Field label="Başlık (yeni satır için \\n kullanın)">
          <input value={s.headline} onChange={(e) => updateSlide(activeIdx, "headline", e.target.value)} className="input" placeholder="Yeni Sezon\nÇekirdekleri Geldi" />
        </Field>
        <Field label="Alt Metin">
          <textarea rows={2} value={s.sub} onChange={(e) => updateSlide(activeIdx, "sub", e.target.value)} className="input resize-none" style={{ paddingTop: "0.75rem" }} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Buton Yazısı">
            <input value={s.cta} onChange={(e) => updateSlide(activeIdx, "cta", e.target.value)} className="input" placeholder="Hemen Keşfet" />
          </Field>
          <Field label="Buton Linki">
            <input value={s.href} onChange={(e) => updateSlide(activeIdx, "href", e.target.value)} className="input" placeholder="/magazin" />
          </Field>
        </div>
        <div className="pt-2">
          <SaveBtn saving={saving} onClick={saveSlides} />
        </div>
      </div>
    </div>
  )
}

// ─── Hakkımızda Section ───────────────────────────────────────────────────────

function HakkimizdaSection({ onToast }: { onToast: (m: string) => void }) {
  type D = Content["hakkimizda"]
  const [data, setData] = useState<D | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c: Content) => setData(c.hakkimizda))
  }, [])

  async function uploadImg(file: File) {
    setUploading(true)
    const fd = new FormData(); fd.append("file", file)
    const { url } = await (await fetch("/api/upload", { method: "POST", body: fd })).json()
    setData((d) => d ? { ...d, storyImage: url } : d); setUploading(false)
  }

  async function save() {
    if (!data) return
    setSaving(true)
    await fetch("/api/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "hakkimizda", data }) })
    setSaving(false); onToast("Hakkımızda kaydedildi ✓")
  }

  function updateMilestone(i: number, key: "year" | "event", val: string) {
    setData((d) => d ? { ...d, milestones: d.milestones.map((m, idx) => idx === i ? { ...m, [key]: val } : m) } : d)
  }

  function addMilestone() {
    setData((d) => d ? { ...d, milestones: [...d.milestones, { year: "", event: "" }] } : d)
  }

  function removeMilestone(i: number) {
    setData((d) => d ? { ...d, milestones: d.milestones.filter((_, idx) => idx !== i) } : d)
  }

  if (!data) return <div className="py-20 text-center"><div className="inline-block w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <SectionHeader title="Hakkımızda" subtitle="Hakkımızda sayfasının içeriğini düzenleyin." />
      <div className="space-y-5" style={{ maxWidth: "640px" }}>
        <Field label="Hero Başlık">
          <input value={data.heroHeadline} onChange={(e) => setData((d) => d ? { ...d, heroHeadline: e.target.value } : d)} className="input" />
        </Field>
        <Field label="Hikaye Görseli">
          <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadImg(f) }}>
            {data.storyImage ? (
              <div className="relative">
                <div className="w-full overflow-hidden" style={{ aspectRatio: "4/5", background: "#F5F5F5", maxHeight: "200px" }}>
                  <img src={data.storyImage} alt="" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => setData((d) => d ? { ...d, storyImage: "" } : d)}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center"
                  style={{ background: "rgba(44,43,43,0.8)", color: "#fff", border: "none", cursor: "pointer" }}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()}
                className="w-full py-8 flex flex-col items-center justify-center cursor-pointer hover:opacity-80"
                style={{ border: "1.5px dashed #E8E8E8", background: "#F5F5F5" }}>
                {uploading ? <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Yükleniyor…</p> : (
                  <>
                    <Upload size={20} style={{ color: "#6B6868", marginBottom: "0.4rem" }} />
                    <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Tıkla veya sürükle bırak</p>
                  </>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImg(f) }} />
          </div>
          {!data.storyImage && (
            <>
              <div className="flex items-center gap-2 my-2">
                <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
                <span style={{ fontSize: "0.7rem", color: "#6B6868" }}>ya da URL yapıştır</span>
                <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
              </div>
              <input value={data.storyImage} onChange={(e) => setData((d) => d ? { ...d, storyImage: e.target.value } : d)} className="input" placeholder="https://…" />
            </>
          )}
        </Field>
        <Field label="Hikaye Paragraf 1">
          <textarea rows={4} value={data.story1} onChange={(e) => setData((d) => d ? { ...d, story1: e.target.value } : d)} className="input resize-none" style={{ paddingTop: "0.75rem" }} />
        </Field>
        <Field label="Hikaye Paragraf 2">
          <textarea rows={4} value={data.story2} onChange={(e) => setData((d) => d ? { ...d, story2: e.target.value } : d)} className="input resize-none" style={{ paddingTop: "0.75rem" }} />
        </Field>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label-ink">Kilometre Taşları</label>
            <button onClick={addMilestone}
              style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "#5CADD4", background: "none", border: "none", cursor: "pointer" }}>
              + Ekle
            </button>
          </div>
          <div className="space-y-3">
            {data.milestones.map((m, i) => (
              <div key={i} className="flex gap-3 items-start">
                <input value={m.year} onChange={(e) => updateMilestone(i, "year", e.target.value)} className="input" style={{ width: "80px", flexShrink: 0 }} placeholder="2019" />
                <input value={m.event} onChange={(e) => updateMilestone(i, "event", e.target.value)} className="input flex-1" placeholder="Olay açıklaması…" />
                <button onClick={() => removeMilestone(i)} style={{ color: "#e53e3e", background: "none", border: "none", cursor: "pointer", padding: "0.65rem 0.5rem", flexShrink: 0 }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <SaveBtn saving={saving} onClick={save} />
        </div>
      </div>
    </div>
  )
}

// ─── İletişim Section ─────────────────────────────────────────────────────────

function IletisimSection({ onToast }: { onToast: (m: string) => void }) {
  type D = Content["iletisim"]
  const [data, setData] = useState<D | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c: Content) => setData(c.iletisim))
  }, [])

  function set(k: keyof D, v: string) { setData((d) => d ? { ...d, [k]: v } : d) }

  async function save() {
    if (!data) return
    setSaving(true)
    await fetch("/api/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "iletisim", data }) })
    setSaving(false); onToast("İletişim bilgileri kaydedildi ✓")
  }

  if (!data) return <div className="py-20 text-center"><div className="inline-block w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <SectionHeader title="İletişim" subtitle="İletişim sayfasındaki bilgileri düzenleyin." />
      <div className="space-y-5" style={{ maxWidth: "560px" }}>
        <Field label="Açıklama Metni">
          <textarea rows={3} value={data.aciklama} onChange={(e) => set("aciklama", e.target.value)} className="input resize-none" style={{ paddingTop: "0.75rem" }} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="E-posta">
            <input value={data.email} onChange={(e) => set("email", e.target.value)} className="input" placeholder="merhaba@dearko.com.tr" />
          </Field>
          <Field label="Rezervasyon E-postası">
            <input value={data.rezervasyon} onChange={(e) => set("rezervasyon", e.target.value)} className="input" placeholder="rezervasyon@dearko.com.tr" />
          </Field>
          <Field label="Telefon">
            <input value={data.telefon} onChange={(e) => set("telefon", e.target.value)} className="input" placeholder="+90 (212) 000 00 00" />
          </Field>
          <Field label="WhatsApp">
            <input value={data.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="input" placeholder="+90 (532) 000 00 00" />
          </Field>
        </div>
        <Field label="Adres">
          <input value={data.adres} onChange={(e) => set("adres", e.target.value)} className="input" placeholder="Moda Cad. No:12, Kadıköy, İstanbul" />
        </Field>
        <Field label="Çalışma Saatleri">
          <input value={data.saatler} onChange={(e) => set("saatler", e.target.value)} className="input" placeholder="Pzt–Cum 09:00–18:00" />
        </Field>
        <div className="pt-2">
          <SaveBtn saving={saving} onClick={save} />
        </div>
      </div>
    </div>
  )
}

// ─── Kurumsal Section ─────────────────────────────────────────────────────────

function KurumsalSection({ onToast }: { onToast: (m: string) => void }) {
  type D = Content["kurumsal"]
  const [data, setData] = useState<D | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c: Content) => setData(c.kurumsal))
  }, [])

  async function uploadImg(file: File) {
    setUploading(true)
    const fd = new FormData(); fd.append("file", file)
    const { url } = await (await fetch("/api/upload", { method: "POST", body: fd })).json()
    setData((d) => d ? { ...d, heroImage: url } : d); setUploading(false)
  }

  function set(k: keyof D, v: string) { setData((d) => d ? { ...d, [k]: v } : d) }

  async function save() {
    if (!data) return
    setSaving(true)
    await fetch("/api/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "kurumsal", data }) })
    setSaving(false); onToast("Kurumsal içerik kaydedildi ✓")
  }

  if (!data) return <div className="py-20 text-center"><div className="inline-block w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <SectionHeader title="Kurumsal" subtitle="Kurumsal sayfasının görsel ve metinlerini düzenleyin." />
      <div className="space-y-5" style={{ maxWidth: "640px" }}>
        <Field label="Hero Görseli">
          <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadImg(f) }}>
            {data.heroImage ? (
              <div className="relative">
                <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9", background: "#F5F5F5" }}>
                  <img src={data.heroImage} alt="" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => set("heroImage", "")}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center"
                  style={{ background: "rgba(44,43,43,0.8)", color: "#fff", border: "none", cursor: "pointer" }}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()}
                className="w-full py-8 flex flex-col items-center justify-center cursor-pointer hover:opacity-80"
                style={{ border: "1.5px dashed #E8E8E8", background: "#F5F5F5" }}>
                {uploading ? <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Yükleniyor…</p> : (
                  <><Upload size={20} style={{ color: "#6B6868", marginBottom: "0.4rem" }} /><p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Tıkla veya sürükle bırak</p></>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImg(f) }} />
          </div>
          {!data.heroImage && (
            <>
              <div className="flex items-center gap-2 my-2">
                <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
                <span style={{ fontSize: "0.7rem", color: "#6B6868" }}>ya da URL yapıştır</span>
                <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
              </div>
              <input value={data.heroImage} onChange={(e) => set("heroImage", e.target.value)} className="input" placeholder="https://…" />
            </>
          )}
        </Field>
        <Field label="Hero Başlık">
          <input value={data.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} className="input" />
        </Field>
        <Field label="Giriş Metni">
          <textarea rows={4} value={data.introText} onChange={(e) => set("introText", e.target.value)} className="input resize-none" style={{ paddingTop: "0.75rem" }} />
        </Field>
        <div className="pt-2">
          <SaveBtn saving={saving} onClick={save} />
        </div>
      </div>
    </div>
  )
}

// ─── Mobil Araç Section ───────────────────────────────────────────────────────

function MobilAracSection({ onToast }: { onToast: (m: string) => void }) {
  type D = Content["mobilArac"]
  const [data, setData] = useState<D | null>(null)
  const [saving, setSaving] = useState(false)
  const heroRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<"hero" | number | null>(null)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c: Content) => setData(c.mobilArac))
  }, [])

  async function uploadHero(file: File) {
    setUploading("hero")
    const fd = new FormData(); fd.append("file", file)
    const { url } = await (await fetch("/api/upload", { method: "POST", body: fd })).json()
    setData((d) => d ? { ...d, heroImage: url } : d); setUploading(null)
  }

  async function uploadGallery(file: File) {
    setUploading(-1)
    const fd = new FormData(); fd.append("file", file)
    const { url } = await (await fetch("/api/upload", { method: "POST", body: fd })).json()
    setData((d) => d ? { ...d, gallery: [...d.gallery, url] } : d); setUploading(null)
  }

  function set(k: keyof D, v: string) { setData((d) => d ? { ...d, [k]: v } : d) }

  function updatePricing(i: number, key: "label" | "price", val: string) {
    setData((d) => d ? { ...d, pricing: d.pricing.map((r, idx) => idx === i ? { ...r, [key]: val } : r) } : d)
  }

  function addPriceRow() {
    setData((d) => d ? { ...d, pricing: [...d.pricing, { label: "", price: "" }] } : d)
  }

  function removePriceRow(i: number) {
    setData((d) => d ? { ...d, pricing: d.pricing.filter((_, idx) => idx !== i) } : d)
  }

  function removeGalleryImg(i: number) {
    setData((d) => d ? { ...d, gallery: d.gallery.filter((_, idx) => idx !== i) } : d)
  }

  async function save() {
    if (!data) return
    setSaving(true)
    await fetch("/api/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: "mobilArac", data }) })
    setSaving(false); onToast("Mobil araç içeriği kaydedildi ✓")
  }

  if (!data) return <div className="py-20 text-center"><div className="inline-block w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <SectionHeader title="Mobil Araç" subtitle="Mobil kahve aracı sayfasını düzenleyin." />
      <div className="space-y-6" style={{ maxWidth: "640px" }}>

        <Field label="Hero Görseli">
          <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadHero(f) }}>
            {data.heroImage ? (
              <div className="relative">
                <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9", background: "#F5F5F5" }}>
                  <img src={data.heroImage} alt="" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => set("heroImage", "")}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center"
                  style={{ background: "rgba(44,43,43,0.8)", color: "#fff", border: "none", cursor: "pointer" }}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div onClick={() => heroRef.current?.click()}
                className="w-full py-8 flex flex-col items-center justify-center cursor-pointer hover:opacity-80"
                style={{ border: "1.5px dashed #E8E8E8", background: "#F5F5F5" }}>
                {uploading === "hero" ? <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Yükleniyor…</p> : (
                  <><Upload size={20} style={{ color: "#6B6868", marginBottom: "0.4rem" }} /><p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Tıkla veya sürükle bırak</p></>
                )}
              </div>
            )}
            <input ref={heroRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadHero(f) }} />
          </div>
          {!data.heroImage && (
            <>
              <div className="flex items-center gap-2 my-2">
                <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
                <span style={{ fontSize: "0.7rem", color: "#6B6868" }}>ya da URL yapıştır</span>
                <div style={{ height: "1px", flex: 1, background: "#E8E8E8" }} />
              </div>
              <input value={data.heroImage} onChange={(e) => set("heroImage", e.target.value)} className="input" placeholder="https://…" />
            </>
          )}
        </Field>

        <Field label="Hero Başlık">
          <input value={data.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} className="input" />
        </Field>

        <Field label="Başlangıç Fiyatı">
          <input value={data.baseFiyat} onChange={(e) => set("baseFiyat", e.target.value)} className="input" placeholder="₺2.500 / 2 saat" />
        </Field>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label-ink">Fiyatlandırma Tablosu</label>
            <button onClick={addPriceRow}
              style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "#5CADD4", background: "none", border: "none", cursor: "pointer" }}>
              + Satır Ekle
            </button>
          </div>
          <div className="space-y-2">
            {data.pricing.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input value={row.label} onChange={(e) => updatePricing(i, "label", e.target.value)} className="input flex-1" placeholder="Espresso Bar (2 saat)" />
                <input value={row.price} onChange={(e) => updatePricing(i, "price", e.target.value)} className="input" style={{ width: "130px" }} placeholder="₺2.500" />
                <button onClick={() => removePriceRow(i)} style={{ color: "#e53e3e", background: "none", border: "none", cursor: "pointer", padding: "0 0.5rem", flexShrink: 0 }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label-ink">Galeri Görselleri</label>
            <button onClick={() => galleryRef.current?.click()}
              style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "#5CADD4", background: "none", border: "none", cursor: "pointer" }}>
              + Görsel Ekle
            </button>
          </div>
          <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadGallery(f) }} />
          {data.gallery.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {data.gallery.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden" style={{ background: "#F5F5F5" }}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeGalleryImg(i)}
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center"
                    style={{ background: "rgba(44,43,43,0.75)", color: "#fff", border: "none", cursor: "pointer" }}>
                    <X size={10} />
                  </button>
                </div>
              ))}
              {uploading === -1 && (
                <div className="aspect-square flex items-center justify-center" style={{ background: "#F5F5F5" }}>
                  <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>Henüz görsel yok.</p>
          )}
          <p style={{ fontSize: "0.72rem", color: "#6B6868", marginTop: "0.5rem" }}>Her görseli kaldırmak için üzerindeki ✕ butonuna tıklayın.</p>
        </div>

        <div className="pt-2">
          <SaveBtn saving={saving} onClick={save} />
        </div>
      </div>
    </div>
  )
}

// ─── Siparişler Section ───────────────────────────────────────────────────────

type AdminOrder = {
  id: string; status: string; total: number; tracking_number: string | null
  created_at: string; user_id: string
  items: { name: string; qty: number; image: string; price: number }[]
  profiles: { full_name: string | null; email: string | null; phone: string | null } | null
}

const orderStatuses = [
  { id: "pending",   label: "Beklemede",     color: "#F59E0B" },
  { id: "paid",      label: "Ödendi",        color: "#5CADD4" },
  { id: "preparing", label: "Hazırlanıyor",  color: "#8B5CF6" },
  { id: "shipped",   label: "Kargoda",       color: "#3B82F6" },
  { id: "delivered", label: "Teslim Edildi", color: "#1A7A3F" },
  { id: "cancelled", label: "İptal Edildi",  color: "#e53e3e" },
]

function SiparislerSection({ onToast }: { onToast: (m: string) => void }) {
  const [orders, setOrders]   = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState("all")
  const [selected, setSelected] = useState<AdminOrder | null>(null)
  const [editStatus, setEditStatus]   = useState("")
  const [editTracking, setEditTracking] = useState("")
  const [saving, setSaving]   = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-pw": "dearko2024" } })
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  function openOrder(o: AdminOrder) {
    setSelected(o); setEditStatus(o.status); setEditTracking(o.tracking_number ?? "")
  }

  async function saveOrder() {
    if (!selected) return
    setSaving(true)
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-pw": "dearko2024" },
      body: JSON.stringify({ id: selected.id, status: editStatus, tracking_number: editTracking || null }),
    })
    setSaving(false)
    onToast("Sipariş güncellendi ✓")
    setSelected(null)
    load()
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  const statusMap = Object.fromEntries(orderStatuses.map((s) => [s.id, s]))

  return (
    <div>
      <SectionHeader title="Siparişler" subtitle={`${orders.length} toplam sipariş`} />

      {/* Filtre */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter("all")}
          style={{ padding: "0.4rem 0.875rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", border: "1px solid", borderColor: filter === "all" ? "#2C2B2B" : "#E8E8E8", background: filter === "all" ? "#2C2B2B" : "transparent", color: filter === "all" ? "#fff" : "#6B6868", cursor: "pointer" }}>
          Tümü ({orders.length})
        </button>
        {orderStatuses.map((s) => {
          const count = orders.filter((o) => o.status === s.id).length
          return (
            <button key={s.id} onClick={() => setFilter(s.id)}
              style={{ padding: "0.4rem 0.875rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", border: "1px solid", borderColor: filter === s.id ? s.color : "#E8E8E8", background: filter === s.id ? s.color : "transparent", color: filter === s.id ? "#fff" : "#6B6868", cursor: "pointer" }}>
              {s.label} ({count})
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="py-20 text-center"><div className="inline-block w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p style={{ fontSize: "0.875rem", color: "#6B6868" }}>Sipariş bulunamadı.</p>
      ) : (
        <div style={{ border: "1px solid #E8E8E8", background: "#fff" }}>
          <div className="hidden md:grid px-4 py-3"
            style={{ gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1fr 0.5fr", borderBottom: "1px solid #E8E8E8", background: "#F5F5F5" }}>
            {["Tarih", "Müşteri", "Ürünler", "Tutar", "Durum", ""].map((h) => (
              <span key={h} style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6868" }}>{h}</span>
            ))}
          </div>
          {filtered.map((o, i) => {
            const st = statusMap[o.status] ?? { label: o.status, color: "#6B6868" }
            return (
              <div key={o.id} className="flex md:grid items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                style={{ gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1fr 0.5fr", borderBottom: i < filtered.length - 1 ? "1px solid #E8E8E8" : undefined }}
                onClick={() => openOrder(o)}>
                <p style={{ fontSize: "0.8rem", color: "#6B6868" }}>
                  {new Date(o.created_at).toLocaleDateString("tr-TR")}
                </p>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#2C2B2B" }}>
                    {o.profiles?.full_name ?? "—"}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#6B6868" }}>{o.profiles?.email ?? "—"}</p>
                </div>
                <p className="hidden md:block" style={{ fontSize: "0.8rem", color: "#6B6868" }}>
                  {o.items?.map((it) => `${it.name}${it.qty > 1 ? ` x${it.qty}` : ""}`).join(", ") ?? "—"}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#2C2B2B" }}>
                  ₺{(o.total / 100).toLocaleString("tr-TR")}
                </p>
                <div className="hidden md:flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-inter)", fontWeight: 600, color: st.color }}>{st.label}</span>
                </div>
                <button style={{ fontSize: "0.72rem", fontFamily: "var(--font-inter)", fontWeight: 600, color: "#5CADD4", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  Detay
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Detay Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-10 px-4" style={{ background: "rgba(0,0,0,0.35)" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "560px", padding: "2rem", position: "relative" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", color: "#2C2B2B" }}>
                  Sipariş Detayı
                </h2>
                <p style={{ fontSize: "0.72rem", color: "#6B6868", marginTop: "0.15rem" }}>
                  #{selected.id.slice(0, 8).toUpperCase()} · {new Date(selected.created_at).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: "#6B6868", background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Müşteri */}
            <div className="mb-5 p-3" style={{ background: "#F5F5F5" }}>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#2C2B2B" }}>
                {selected.profiles?.full_name ?? "—"}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#6B6868" }}>{selected.profiles?.email ?? "—"}</p>
              {selected.profiles?.phone && <p style={{ fontSize: "0.8rem", color: "#6B6868" }}>{selected.profiles.phone}</p>}
            </div>

            {/* Ürünler */}
            <div className="mb-5" style={{ borderTop: "1px solid #E8E8E8", paddingTop: "1.25rem" }}>
              <p className="label-ink mb-3">Ürünler</p>
              <div className="space-y-3">
                {selected.items?.map((it, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden flex-shrink-0" style={{ background: "#F5F5F5" }}>
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "0.8125rem", fontFamily: "var(--font-inter)", fontWeight: 500, color: "#2C2B2B" }}>{it.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B6868" }}>x{it.qty}</p>
                    </div>
                    <p style={{ fontSize: "0.8125rem", fontFamily: "var(--font-inter)", fontWeight: 600, color: "#2C2B2B", flexShrink: 0 }}>
                      ₺{((it.price * it.qty) / 100).toLocaleString("tr-TR")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 mt-3" style={{ borderTop: "1px solid #E8E8E8" }}>
                <span style={{ fontSize: "0.8rem", color: "#6B6868" }}>Toplam</span>
                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "1.1rem", color: "#2C2B2B" }}>
                  ₺{(selected.total / 100).toLocaleString("tr-TR")}
                </span>
              </div>
            </div>

            {/* Durum & Kargo */}
            <div className="space-y-4" style={{ borderTop: "1px solid #E8E8E8", paddingTop: "1.25rem" }}>
              <div>
                <label className="label-ink block mb-2">Sipariş Durumu</label>
                <div className="relative">
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="select">
                    {orderStatuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="#6B6868" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
              </div>
              <div>
                <label className="label-ink block mb-2">Kargo Takip Numarası</label>
                <input value={editTracking} onChange={(e) => setEditTracking(e.target.value)}
                  className="input" placeholder="Örn: 1234567890" />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-5" style={{ borderTop: "1px solid #E8E8E8" }}>
              <button onClick={() => setSelected(null)} className="btn-outline flex-1 justify-center">İptal</button>
              <button onClick={saveOrder} disabled={saving} className="btn-dark flex-1 justify-center"
                style={{ opacity: saving ? 0.6 : 1 }}>
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Müşteriler Section ───────────────────────────────────────────────────────

function MusterilerSection({ onToast }: { onToast: (m: string) => void }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Customer | null>(null)
  const [notes, setNotes] = useState("")
  const [savingNote, setSavingNote] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const supabase = adminSupabase()
    const { data } = await supabase
      .from("customer_summary")
      .select("*")
      .order("created_at", { ascending: false })
    setCustomers(data ?? [])
    setLoading(false)
  }

  async function saveNote() {
    if (!selected) return
    setSavingNote(true)
    const supabase = adminSupabase()
    await supabase.from("profiles").update({ notes }).eq("id", selected.id)
    setSavingNote(false)
    setSelected((c) => c ? { ...c, notes } : c)
    onToast("Not kaydedildi ✓")
    load()
  }

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return !q || (c.full_name ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").includes(q) || (c.city ?? "").toLowerCase().includes(q)
  })

  const grindLabels: Record<string, string> = {
    cekirdek: "Çekirdek", v60: "V60", "french-press": "French Press",
    espresso: "Espresso", moka: "Moka Pot",
  }

  return (
    <div>
      <SectionHeader title="Müşteriler" subtitle={`${customers.length} kayıtlı üye`} />

      <div className="mb-6" style={{ maxWidth: "360px" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          className="input" placeholder="İsim, e-posta, telefon, şehir ara…" />
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p style={{ fontSize: "0.875rem", color: "#6B6868" }}>Müşteri bulunamadı.</p>
      ) : (
        <div style={{ border: "1px solid #E8E8E8", background: "#fff" }}>
          <div className="hidden md:grid px-4 py-3"
            style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 0.5fr", borderBottom: "1px solid #E8E8E8", background: "#F5F5F5" }}>
            {["Ad Soyad", "E-posta", "Telefon", "Şehir", "Sipariş / Harcama", ""].map((h) => (
              <span key={h} style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6868" }}>{h}</span>
            ))}
          </div>
          {filtered.map((c, i) => (
            <div key={c.id} className="flex md:grid items-center px-4 py-3 cursor-pointer hover:bg-[#FFFFFF] transition-colors"
              style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 0.5fr", borderBottom: i < filtered.length - 1 ? "1px solid #E8E8E8" : undefined }}
              onClick={() => { setSelected(c); setNotes(c.notes ?? "") }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#2C2B2B" }}>
                  {c.full_name ?? "—"}
                  {c.newsletter && <span style={{ marginLeft: "0.4rem", fontSize: "0.65rem", background: "#5CADD4", color: "#fff", padding: "0.1rem 0.35rem", fontFamily: "var(--font-inter)", fontWeight: 700 }}>BÜL</span>}
                </p>
                <p className="md:hidden" style={{ fontSize: "0.72rem", color: "#6B6868" }}>{c.email}</p>
              </div>
              <p className="hidden md:block" style={{ fontSize: "0.8rem", color: "#6B6868" }}>{c.email ?? "—"}</p>
              <p className="hidden md:block" style={{ fontSize: "0.8rem", color: "#6B6868" }}>{c.phone ?? "—"}</p>
              <p className="hidden md:block" style={{ fontSize: "0.8rem", color: "#6B6868" }}>{c.city ?? "—"}</p>
              <div className="hidden md:block">
                <p style={{ fontSize: "0.8rem", color: "#6B6868" }}>{c.order_count} sipariş</p>
                {c.total_spent > 0 && <p style={{ fontSize: "0.72rem", color: "#5CADD4", fontWeight: 600 }}>₺{(c.total_spent / 100).toLocaleString("tr-TR")}</p>}
              </div>
              <button style={{ fontSize: "0.72rem", fontFamily: "var(--font-inter)", fontWeight: 600, color: "#5CADD4", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                Detay
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-10 px-4" style={{ background: "rgba(0,0,0,0.35)" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "560px", padding: "2rem", position: "relative" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: "var(--font-inter)", fontSize: "1.1rem", fontWeight: 700, textTransform: "uppercase", color: "#2C2B2B" }}>
                {selected.full_name ?? "Müşteri"}
              </h2>
              <button onClick={() => setSelected(null)} style={{ color: "#6B6868", background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
              {[
                ["E-posta",          selected.email ?? "—"],
                ["Telefon",          selected.phone ?? "—"],
                ["Şehir",            selected.city ?? "—"],
                ["Öğütme Tercihi",   grindLabels[selected.default_grind ?? ""] ?? "—"],
                ["Bülten",           selected.newsletter ? "✓ Evet" : "Hayır"],
                ["Üyelik Tarihi",    new Date(selected.created_at).toLocaleDateString("tr-TR")],
                ["Sipariş Sayısı",   String(selected.order_count)],
                ["Toplam Harcama",   selected.total_spent > 0 ? `₺${(selected.total_spent / 100).toLocaleString("tr-TR")}` : "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: "0.7rem", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6868", marginBottom: "0.2rem" }}>{k}</p>
                  <p style={{ fontSize: "0.875rem", color: "#2C2B2B" }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #E8E8E8", paddingTop: "1.25rem" }}>
              <label className="label-ink block mb-2">Admin Notu</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                className="input resize-none mb-3" placeholder="Bu müşteri hakkında not ekle…"
                style={{ paddingTop: "0.75rem" }} />
              <button onClick={saveNote} disabled={savingNote} className="btn-dark"
                style={{ opacity: savingNote ? 0.6 : 1 }}>
                {savingNote ? "Kaydediliyor…" : "Notu Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Rezervasyonlar Section ───────────────────────────────────────────────────

type Reservation = {
  id: string; date: string; start_time: string; duration: number
  service: string; event_type: string; location: string; guest_count: string
  notes: string | null; name: string; email: string; phone: string
  company: string | null; status: string; admin_notes: string | null
  estimated_price: number | null; created_at: string
}

const rezervasyonStatuses = [
  { id: "new",       label: "Yeni",          color: "#5CADD4" },
  { id: "contacted", label: "İletişime Geçildi", color: "#8B5CF6" },
  { id: "confirmed", label: "Onaylandı",     color: "#1A7A3F" },
  { id: "cancelled", label: "İptal Edildi",  color: "#e53e3e" },
]

const serviceNames: Record<string, string> = {
  "espresso-bar":    "Espresso Bar",
  "filter-station":  "Filter İstasyonu",
  "cold-brew":       "Cold Brew",
  "full-menu":       "Tam Menü",
}

function RezervasyonlarSection({ onToast }: { onToast: (m: string) => void }) {
  const [list, setList]         = useState<Reservation[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState("all")
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [editStatus, setEditStatus]       = useState("")
  const [editAdminNotes, setEditAdminNotes] = useState("")
  const [saving, setSaving]     = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/rezervasyonlar", { headers: { "x-admin-pw": "dearko2024" } })
    const data = await res.json()
    setList(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  function openItem(r: Reservation) {
    setSelected(r); setEditStatus(r.status); setEditAdminNotes(r.admin_notes ?? "")
  }

  async function saveItem() {
    if (!selected) return
    setSaving(true)
    await fetch("/api/admin/rezervasyonlar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-pw": "dearko2024" },
      body: JSON.stringify({ id: selected.id, status: editStatus, admin_notes: editAdminNotes || null }),
    })
    setSaving(false); onToast("Rezervasyon güncellendi ✓")
    setSelected(null); load()
  }

  const filtered = filter === "all" ? list : list.filter((r) => r.status === filter)
  const statusMap = Object.fromEntries(rezervasyonStatuses.map((s) => [s.id, s]))

  return (
    <div>
      <SectionHeader title="Rezervasyonlar" subtitle={`${list.length} toplam rezervasyon`} />

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter("all")}
          style={{ padding: "0.4rem 0.875rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", border: "1px solid", borderColor: filter === "all" ? "#2C2B2B" : "#E8E8E8", background: filter === "all" ? "#2C2B2B" : "transparent", color: filter === "all" ? "#fff" : "#6B6868", cursor: "pointer" }}>
          Tümü ({list.length})
        </button>
        {rezervasyonStatuses.map((s) => {
          const count = list.filter((r) => r.status === s.id).length
          return (
            <button key={s.id} onClick={() => setFilter(s.id)}
              style={{ padding: "0.4rem 0.875rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", border: "1px solid", borderColor: filter === s.id ? s.color : "#E8E8E8", background: filter === s.id ? s.color : "transparent", color: filter === s.id ? "#fff" : "#6B6868", cursor: "pointer" }}>
              {s.label} ({count})
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="py-20 text-center"><div className="inline-block w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p style={{ fontSize: "0.875rem", color: "#6B6868" }}>Rezervasyon bulunamadı.</p>
      ) : (
        <div style={{ border: "1px solid #E8E8E8", background: "#fff" }}>
          <div className="hidden md:grid px-4 py-3"
            style={{ gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr 1fr 0.5fr", borderBottom: "1px solid #E8E8E8", background: "#F5F5F5" }}>
            {["Tarih", "Ad / E-posta", "Hizmet / Konum", "Misafir", "Durum", ""].map((h) => (
              <span key={h} style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6868" }}>{h}</span>
            ))}
          </div>
          {filtered.map((r, i) => {
            const st = statusMap[r.status] ?? { label: r.status, color: "#6B6868" }
            return (
              <div key={r.id} className="flex md:grid items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                style={{ gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr 1fr 0.5fr", borderBottom: i < filtered.length - 1 ? "1px solid #E8E8E8" : undefined }}
                onClick={() => openItem(r)}>
                <div>
                  <p style={{ fontSize: "0.8rem", color: "#2C2B2B", fontFamily: "var(--font-inter)", fontWeight: 500 }}>{r.date}</p>
                  <p style={{ fontSize: "0.72rem", color: "#6B6868" }}>{r.start_time} · {r.duration}s</p>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#2C2B2B" }}>{r.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "#6B6868" }}>{r.email}</p>
                </div>
                <div className="hidden md:block" style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "0.8rem", color: "#2C2B2B" }}>{serviceNames[r.service] ?? r.service}</p>
                  <p style={{ fontSize: "0.72rem", color: "#6B6868", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.location}</p>
                </div>
                <p className="hidden md:block" style={{ fontSize: "0.8rem", color: "#6B6868" }}>{r.guest_count}</p>
                <div className="hidden md:flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-inter)", fontWeight: 600, color: st.color }}>{st.label}</span>
                </div>
                <button style={{ fontSize: "0.72rem", fontFamily: "var(--font-inter)", fontWeight: 600, color: "#5CADD4", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  Detay
                </button>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-10 px-4" style={{ background: "rgba(0,0,0,0.35)" }}>
          <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "560px", padding: "2rem", position: "relative" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", color: "#2C2B2B" }}>Rezervasyon Detayı</h2>
                <p style={{ fontSize: "0.72rem", color: "#6B6868", marginTop: "0.15rem" }}>
                  {selected.date} · {selected.start_time} · {selected.duration} saat
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: "#6B6868", background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
              {[
                ["Ad Soyad",   selected.name],
                ["E-posta",    selected.email],
                ["Telefon",    selected.phone],
                ["Şirket",     selected.company ?? "—"],
                ["Hizmet",     serviceNames[selected.service] ?? selected.service],
                ["Etkinlik",   selected.event_type],
                ["Konum",      selected.location],
                ["Misafir",    selected.guest_count],
                ["Tahmini",    selected.estimated_price ? `₺${selected.estimated_price.toLocaleString("tr-TR")}` : "—"],
                ["Kayıt",      new Date(selected.created_at).toLocaleDateString("tr-TR")],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: "0.7rem", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6868", marginBottom: "0.15rem" }}>{k}</p>
                  <p style={{ fontSize: "0.875rem", color: "#2C2B2B" }}>{v}</p>
                </div>
              ))}
            </div>

            {selected.notes && (
              <div className="mb-5 p-3" style={{ background: "#F5F5F5" }}>
                <p style={{ fontSize: "0.7rem", fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6868", marginBottom: "0.3rem" }}>Müşteri Notu</p>
                <p style={{ fontSize: "0.875rem", color: "#2C2B2B" }}>{selected.notes}</p>
              </div>
            )}

            <div className="space-y-4" style={{ borderTop: "1px solid #E8E8E8", paddingTop: "1.25rem" }}>
              <div>
                <label className="label-ink block mb-2">Durum</label>
                <div className="relative">
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="select">
                    {rezervasyonStatuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="#6B6868" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
              </div>
              <div>
                <label className="label-ink block mb-2">Admin Notu</label>
                <textarea rows={3} value={editAdminNotes} onChange={(e) => setEditAdminNotes(e.target.value)}
                  className="input resize-none" placeholder="İç not, fiyat bilgisi, vb."
                  style={{ paddingTop: "0.75rem" }} />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-5" style={{ borderTop: "1px solid #E8E8E8" }}>
              <button onClick={() => setSelected(null)} className="btn-outline flex-1 justify-center">İptal</button>
              <button onClick={saveItem} disabled={saving} className="btn-dark flex-1 justify-center"
                style={{ opacity: saving ? 0.6 : 1 }}>
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
