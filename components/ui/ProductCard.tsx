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
      <div className="relative overflow-hidden mb-3 sm:mb-4" style={{ aspectRatio: "1/1", background: "#F5F5F5" }}>
        <img
          src={image} alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        {/* Mobil: her zaman görünür | Desktop: hover'da çıkar */}
        <div className="absolute inset-x-0 bottom-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2"
            style={{
              background: added ? "#1A7A3F" : "#2C2B2B",
              color: "#fff", border: "none", cursor: "pointer",
              fontFamily: "var(--font-inter)", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "background 0.2s",
              padding: "0.85rem",
              minHeight: 44,
            }}>
            {added ? <><Check size={11} strokeWidth={2.5} /> Eklendi</> : "+ Sepete Ekle"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        {meta && <p className="label mb-1">{meta}</p>}
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", fontWeight: 700, color: "#1A1919", marginBottom: "0.4rem", lineHeight: 1.3 }}>
          {name}
        </p>
        <div className="flex items-baseline gap-2">
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "1.05rem", fontWeight: 800, color: "#1A1919" }}>
            ₺{price}
          </span>
          {weight && <span style={{ fontSize: "0.78rem", color: "#9A9898" }}>/ {weight}</span>}
        </div>
      </div>
    </Link>
  )
}
