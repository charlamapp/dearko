"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProductCard from "@/components/ui/ProductCard"

type Product = { id: string; name: string; category: string; price: number; image: string; origin?: string; roast?: string; brand?: string; weight?: string }

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((all: Product[]) => setProducts(all.filter((p) => p.category === "coffee").slice(0, 4)))
  }, [])

  return (
    <section className="section" style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
      <div className="wrap">

        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="label mb-3">Öne Çıkanlar</p>
            <h2 className="heading-lg">Taze Kavrumlar</h2>
          </div>
          <Link href="/magazin" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#6B6868", textDecoration: "underline", textUnderlineOffset: "3px" }} className="hidden sm:block">
            Tümünü Gör
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-7">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="aspect-square mb-3 animate-pulse" style={{ background: "#F5F5F5" }} />
                <div className="h-3 w-16 mb-2 animate-pulse" style={{ background: "#F5F5F5" }} />
                <div className="h-4 w-32 mb-1 animate-pulse" style={{ background: "#F5F5F5" }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-7">
            {products.map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        )}

      </div>
    </section>
  )
}
