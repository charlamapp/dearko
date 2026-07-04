"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/ui/ProductCard"

type Product = {
  id: string; name: string; category: string; price: number; image: string
  origin?: string; roast?: string; brand?: string; weight?: string
}

const tabs = [
  { id: "all",       label: "Tüm Ürünler" },
  { id: "coffee",    label: "Kahve Çekirdekleri" },
  { id: "equipment", label: "Ekipmanlar" },
]

const sortOptions = [
  { id: "default",    label: "Önerilen" },
  { id: "price-asc",  label: "Fiyat: Düşükten Yükseğe" },
  { id: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
  { id: "name",       label: "İsme Göre (A-Z)" },
]

export default function MagazinPage() {
  const [active, setActive]     = useState("all")
  const [sort, setSort]         = useState("default")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { setProducts(d); setLoading(false) })
  }, [])

  const filtered = products
    .filter((p) => active === "all" || p.category === active)
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price
      if (sort === "price-desc") return b.price - a.price
      if (sort === "name")       return a.name.localeCompare(b.name, "tr")
      return 0
    })

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "6.25rem" }}>

      {/* Sayfa başlığı */}
      <section className="pt-12 pb-0" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="label mb-3">Mağaza</p>
              <h1 className="heading-xl">Kahveler</h1>
            </div>
            {!loading && (
              <p className="hidden sm:block body-sm">{filtered.length} ürün</p>
            )}
          </div>

          {/* Tabs + Sort */}
          <div className="flex items-center justify-between overflow-x-auto">
            <div className="flex flex-shrink-0">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setActive(t.id)}
                  style={{
                    fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 600,
                    letterSpacing: "0.04em", textTransform: "uppercase",
                    padding: "1rem 1.1rem",
                    color: active === t.id ? "#2C2B2B" : "#8A8A8A",
                    background: "transparent", border: "none",
                    borderBottom: active === t.id ? "2px solid #2C2B2B" : "2px solid transparent",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 ml-4 flex-shrink-0">
              <span style={{ fontSize: "0.75rem", color: "#A0A0A0", fontFamily: "var(--font-inter)" }}>Sırala:</span>
              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", fontWeight: 500, color: "#2C2B2B", background: "transparent", border: "1px solid #E8E8E8", padding: "0.4rem 1.8rem 0.4rem 0.75rem", appearance: "none", cursor: "pointer", outline: "none" }}>
                  {sortOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="#8A8A8A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ürünler */}
      <section className="py-12 lg:py-16">
        <div className="wrap">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-square mb-4 animate-pulse" style={{ background: "#F0F0F0" }} />
                  <div className="h-2.5 w-14 mb-2.5 animate-pulse" style={{ background: "#F0F0F0" }} />
                  <div className="h-4 w-40 mb-2 animate-pulse" style={{ background: "#F0F0F0" }} />
                  <div className="h-3.5 w-16 animate-pulse" style={{ background: "#F0F0F0" }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p style={{ fontSize: "0.9rem", color: "#8A8A8A", marginBottom: "1.5rem" }}>Bu kategoride henüz ürün yok.</p>
              <button onClick={() => setActive("all")} className="btn-outline">Tüm Ürünleri Gör</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
                {filtered.map((p) => <ProductCard key={p.id} {...p} />)}
              </div>
              <p className="text-center mt-12 body-sm">{filtered.length} ürün gösteriliyor</p>
            </>
          )}
        </div>
      </section>

    </div>
  )
}
