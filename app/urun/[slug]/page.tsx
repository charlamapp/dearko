"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"
import ProductCard from "@/components/ui/ProductCard"
import { useCart } from "@/lib/cart"

type Product = {
  id: string; name: string; category: string; price: number; image: string; description: string
  origin?: string; process?: string; roast?: string; flavor?: string[]; weight?: string; brand?: string
  images?: string[]; video?: string
}

const grindOptions = [
  { id: "cekirdek",     label: "Çekirdek (Öğütülmemiş)" },
  { id: "v60",          label: "V60 / Pour-Over" },
  { id: "french-press", label: "French Press" },
  { id: "espresso",     label: "Espresso" },
  { id: "moka",         label: "Moka Pot" },
]

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const { add } = useCart()
  const [qty,        setQty]        = useState(1)
  const [grind,      setGrind]      = useState("cekirdek")
  const [added,      setAdded]      = useState(false)
  const [activeImg,  setActiveImg]  = useState(0)
  const [showVideo,  setShowVideo]  = useState(false)

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts)
  }, [])

  const p       = products.find((x) => x.id === slug)
  const related = products.filter((x) => x.id !== slug && x.category === p?.category).slice(0, 4)

  if (products.length > 0 && !p) notFound()

  if (!p) return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "6.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const handleAdd = () => {
    add({ id: p.id, name: p.name, price: p.price, image: p.image, weight: p.weight, grind, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  // Galeri: images varsa kullan, yoksa tek image
  const gallery = p.images && p.images.length > 0 ? p.images : [p.image]
  const hasVideo = Boolean(p.video)

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "6.25rem", paddingBottom: "0" }}>

      {/* Breadcrumb */}
      <div className="py-4" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap flex gap-2 items-center" style={{ fontSize: "0.75rem", color: "#6B6868" }}>
          <Link href="/" style={{ color: "#6B6868", textDecoration: "none" }} className="hover:opacity-60">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/magazin" style={{ color: "#6B6868", textDecoration: "none" }} className="hover:opacity-60">
            {p.category === "equipment" ? "Ekipmanlar" : "Kahveler"}
          </Link>
          <span>/</span>
          <span style={{ color: "#2C2B2B", fontWeight: 500 }}>{p.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="wrap py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Sol — Görsel / Video */}
          <div>
            {/* Ana görsel veya video */}
            <div className="aspect-square overflow-hidden mb-3" style={{ background: "#F5F5F5" }}>
              {showVideo && hasVideo ? (
                <video
                  src={p.video} autoPlay loop muted playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={gallery[activeImg]} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Küçük resimler + video butonu */}
            {(gallery.length > 1 || hasVideo) && (
              <div className="flex gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImg(i); setShowVideo(false) }}
                    className="overflow-hidden flex-shrink-0"
                    style={{
                      width: 64, height: 64, background: "#F5F5F5",
                      border: !showVideo && activeImg === i ? "2px solid #2C2B2B" : "2px solid transparent",
                      padding: 0, cursor: "pointer",
                    }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {hasVideo && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 64, height: 64, background: "#F5F5F5",
                      border: showVideo ? "2px solid #2C2B2B" : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="#6B6868" strokeWidth="1.5" />
                      <path d="M8 7L14 10L8 13V7Z" fill="#6B6868" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sağ — Bilgiler */}
          <div className="py-2">
            {p.category === "coffee" && p.origin && (
              <p className="label mb-4">{p.origin}{p.process ? ` · ${p.process}` : ""}{p.roast ? ` · ${p.roast}` : ""}</p>
            )}
            {p.category === "equipment" && p.brand && (
              <p className="label mb-4">{p.brand}</p>
            )}

            <h1 className="heading-xl mb-5">{p.name}</h1>

            {Array.isArray(p.flavor) && p.flavor.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {p.flavor.map((f) => (
                  <span key={f} style={{ border: "1px solid #E8E8E8", fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B6868", padding: "0.2rem 0.6rem" }}>{f}</span>
                ))}
              </div>
            )}

            <p className="body-md mb-8">{p.description}</p>

            <div className="flex items-baseline gap-2 mb-8 pb-8" style={{ borderBottom: "1px solid #E8E8E8" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "2.75rem", color: "#2C2B2B", lineHeight: 1 }}>₺{p.price}</span>
              {p.weight && <span style={{ fontSize: "0.8rem", color: "#6B6868" }}>/ {p.weight}</span>}
            </div>

            {p.category === "coffee" && (
              <div className="mb-6">
                <label className="label-ink block mb-3">Öğütme Derecesi</label>
                <div className="relative">
                  <select value={grind} onChange={(e) => setGrind(e.target.value)} className="select">
                    {grindOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="#6B6868" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center" style={{ border: "1px solid #E8E8E8" }}>
                <button onClick={() => qty > 1 && setQty((q) => q - 1)} className="w-11 h-11 flex items-center justify-center hover:bg-[#F5F5F5]" style={{ color: "#6B6868", borderRight: "1px solid #E8E8E8" }}>−</button>
                <span className="w-10 text-center" style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", fontWeight: 600, color: "#2C2B2B" }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-[#F5F5F5]" style={{ color: "#6B6868", borderLeft: "1px solid #E8E8E8" }}>+</button>
              </div>
              <button onClick={handleAdd} className="btn-dark flex-1" style={added ? { background: "#1A7A3F" } : {}}>
                {added ? <><Check size={14} /> Eklendi</> : "Sepete Ekle"}
              </button>
            </div>

            <div className="space-y-2.5 pt-6" style={{ borderTop: "1px solid #E8E8E8" }}>
              {(p.category === "coffee"
                ? ["Siparişten sonra taze kavrum", "48 saat içinde kargoya verilir", "500₺ üzeri ücretsiz kargo"]
                : ["Orijinal ürün garantisi", "Hızlı kargo", "500₺ üzeri ücretsiz kargo"]
              ).map((item) => (
                <p key={item} className="flex items-center gap-2" style={{ fontSize: "0.8rem", color: "#6B6868" }}>
                  <Check size={12} style={{ color: "#5CADD4", flexShrink: 0 }} />{item}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>

      {related.length > 0 && (
        <section className="section-sm" style={{ borderTop: "1px solid #E8E8E8", background: "#F5F5F5" }}>
          <div className="wrap">
            <p className="label-ink mb-10">Bunları da beğenebilirsiniz</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7">
              {related.map((r) => <ProductCard key={r.id} {...r} />)}
            </div>
          </div>
        </section>
      )}

      {/* Mobil sticky sepet çubuğu */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{ background: "#fff", borderTop: "1px solid #E8E8E8", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6868", marginBottom: "0.15rem" }}>
            {p.name}
          </p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.1rem", fontWeight: 800, color: "#2C2B2B", lineHeight: 1 }}>
            ₺{p.price}
          </p>
        </div>
        <button
          onClick={handleAdd}
          style={{
            flexShrink: 0,
            background: added ? "#1A7A3F" : "#2C2B2B",
            color: "#fff", border: "none", cursor: "pointer",
            fontFamily: "var(--font-inter)", fontSize: "0.78rem", fontWeight: 700,
            letterSpacing: "0.07em", textTransform: "uppercase",
            padding: "0.9rem 1.5rem",
            minHeight: 52,
            display: "flex", alignItems: "center", gap: "0.5rem",
            transition: "background 0.2s",
          }}>
          {added ? <><Check size={13} strokeWidth={2.5} /> Eklendi</> : "Sepete Ekle"}
        </button>
      </div>

      {/* Sticky bar için yer aç */}
      <div className="lg:hidden h-20" />

    </div>
  )
}
