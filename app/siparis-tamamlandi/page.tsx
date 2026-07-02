"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { useCart } from "@/lib/cart"

export default function SiparisTamamlandiPage() {
  const { clear } = useCart()

  useEffect(() => { clear() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "5.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "480px", width: "100%", padding: "2rem", textAlign: "center" }}>

        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-8" style={{ background: "#5CADD4" }}>
          <Check size={28} color="white" strokeWidth={2.5} />
        </div>

        <p className="label mb-3">Teşekkürler</p>
        <h1 className="heading-lg mb-4">Siparişiniz alındı.</h1>
        <p className="body-lg mb-10" style={{ color: "#6B6868" }}>
          Siparişiniz onaylandı. Hazırlandıktan sonra kargo bilgilerinizi hesabınızdan takip edebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/hesabim" className="btn-dark">Siparişlerimi Gör</Link>
          <Link href="/magazin" className="btn-outline">Alışverişe Devam</Link>
        </div>

      </div>
    </div>
  )
}
