"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import ProductCard from "@/components/ui/ProductCard"

type Product = { id: string; name: string; category: string; price: number; image: string; origin?: string; roast?: string; brand?: string; weight?: string }

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const } },
}

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

        <motion.div
          className="flex items-end justify-between mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <div>
            <p className="label mb-3">Öne Çıkanlar</p>
            <h2 className="heading-lg">Taze Kavrumlar</h2>
          </div>
          <Link href="/magazin"
            className="hidden sm:inline-flex items-center gap-2 group"
            style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#2C2B2B", textDecoration: "none" }}>
            Tümünü Gör
            <span style={{ transition: "transform 0.2s" }} className="group-hover:translate-x-1 inline-block">→</span>
          </Link>
        </motion.div>

        {products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-7">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="aspect-square mb-4 animate-pulse" style={{ background: "#F0F0F0" }} />
                <div className="h-2.5 w-12 mb-2.5 animate-pulse rounded" style={{ background: "#F0F0F0" }} />
                <div className="h-4 w-36 mb-2 animate-pulse rounded" style={{ background: "#F0F0F0" }} />
                <div className="h-3.5 w-16 animate-pulse rounded" style={{ background: "#F0F0F0" }} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-8"
          >
            {products.map((p) => (
              <motion.div key={p.id} variants={item}>
                <ProductCard {...p} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-10 sm:hidden text-center">
          <Link href="/magazin" className="btn-outline">Tüm Kahveleri Gör</Link>
        </div>

      </div>
    </section>
  )
}
