"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/ui/ProductCard"

type Product = { id: string; name: string; category: string; price: number; image: string; origin?: string; roast?: string; brand?: string; weight?: string }

const tabs = [
  { id: "all",       label: "Tüm Ürünler" },
  { id: "coffee",    label: "Kahve Çekirdekleri" },
  { id: "equipment", label: "Ekipmanlar" },
]

export default function MagazinPage() {
  const [active,   setActive]   = useState("all")
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts)
  }, [])

  const filtered = products.filter((p) => active === "all" || p.category === active)

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "4rem" }}>

      <section className="pt-14 pb-0" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <h1 className="heading-xl mb-10">Kahveler</h1>
          <div className="flex">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.8125rem", fontWeight: 600,
                  letterSpacing: "0.04em", textTransform: "uppercase",
                  padding: "1rem 1.25rem",
                  color: active === t.id ? "#2C2B2B" : "#6B6868",
                  background: "transparent", border: "none",
                  borderBottom: active === t.id ? "2px solid #2C2B2B" : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="wrap">
          {products.length === 0 ? (
            <div className="py-24 text-center">
              <div className="inline-block w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin mb-4" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p style={{ fontSize: "0.875rem", color: "#6B6868" }}>Bu kategoride ürün bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
              {filtered.map((p) => <ProductCard key={p.id} {...p} />)}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
