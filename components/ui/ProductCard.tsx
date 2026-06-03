"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { useCart } from "@/lib/cart"

type Props = {
  id: string
  name: string
  price: number
  image: string
  origin?: string
  roast?: string
  brand?: string
  weight?: string
  [key: string]: unknown
}

export default function ProductCard({ id, name, price, image, origin, roast, brand, weight }: Props) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const meta = origin ? `${origin}${roast ? " · " + roast : ""}` : brand ?? ""

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    add({ id, name, price, image, weight })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link href={`/urun/${id}`} className="group block no-underline">
      <div className="aspect-square overflow-hidden mb-3 relative" style={{ background: "#F5F5F5" }}>
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <button
          onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 py-2.5 flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
          style={{ background: added ? "#1A7A3F" : "rgba(44,43,43,0.92)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
          {added ? <><Check size={11} /> Eklendi</> : "+ Sepete Ekle"}
        </button>
      </div>
      {meta && <p className="label-muted mb-1">{meta}</p>}
      <h3 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B", marginBottom: "0.25rem", lineHeight: 1.35 }}>
        {name}
      </h3>
      <p style={{ fontSize: "0.8125rem", color: "#6B6868" }}>
        ₺{price}{weight ? ` / ${weight}` : ""}
      </p>
    </Link>
  )
}
