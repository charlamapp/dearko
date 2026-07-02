"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { useCart } from "@/lib/cart"

type Props = {
  id: string; name: string; price: number; image: string
  weight?: string; origin?: string; roast?: string; brand?: string; category?: string
}

export default function ProductCard({ id, name, price, image, weight, origin, roast, brand, category }: Props) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    add({ id, name, price, image, weight })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const meta = category === "equipment" ? brand : origin ? `${origin}${roast ? ` · ${roast}` : ""}` : null

  return (
    <Link href={`/urun/${id}`} className="group block no-underline">
      {/* Görsel */}
      <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "1/1", background: "#F5F5F5" }}>
        <img
          src={image} alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAdd}
            className="w-full py-3 flex items-center justify-center gap-2"
            style={{
              background: added ? "#1A7A3F" : "#2C2B2B",
              color: "#fff", border: "none", cursor: "pointer",
              fontFamily: "var(--font-inter)", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "background 0.2s",
            }}>
            {added ? <><Check size={11} strokeWidth={2.5} /> Eklendi</> : "+ Sepete Ekle"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        {meta && (
          <p className="label mb-1.5">{meta}</p>
        )}
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", fontWeight: 600, color: "#2C2B2B", marginBottom: "0.4rem", lineHeight: 1.35 }}>
          {name}
        </p>
        <div className="flex items-baseline gap-2">
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 800, color: "#2C2B2B" }}>
            ₺{price}
          </span>
          {weight && <span style={{ fontSize: "0.75rem", color: "#B0B0B0" }}>/ {weight}</span>}
        </div>
      </div>
    </Link>
  )
}
