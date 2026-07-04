"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, X, ShieldCheck } from "lucide-react"
import { useCart } from "@/lib/cart"
import { createClient } from "@/lib/supabase/client"

export default function SepetPage() {
  const { items, update, remove, total, clear } = useCart()
  const router = useRouter()
  const [coupon, setCoupon] = useState("")
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(false)

  const discount = applied ? Math.round(total * 0.1) : 0
  const shipping  = total >= 500 ? 0 : 49
  const grandTotal = total - discount + shipping

  async function handleCheckout() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/giris?redirect=/sepet"); setLoading(false); return }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
    const { url, error } = await res.json()
    if (error) { alert(error); setLoading(false); return }
    window.location.href = url
  }

  if (!items.length) return (
    <div style={{ background: "#FFFFFF", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "6.25rem" }}>
      <p className="label-muted mb-5">Sepet</p>
      <h2 className="heading-md mb-6">Sepetiniz boş.</h2>
      <Link href="/magazin" className="btn-dark">Alışverişe Başla</Link>
    </div>
  )

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "6.25rem" }}>

      <div className="pt-14 pb-10" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <h1 className="heading-xl">Sepetim</h1>
          <p style={{ fontSize: "0.875rem", color: "#6B6868", marginTop: "0.5rem" }}>{items.length} ürün</p>
        </div>
      </div>

      <div className="wrap py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Ürünler */}
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-5 py-6" style={{ borderBottom: "1px solid #E8E8E8" }}>
                <div className="w-20 h-20 overflow-hidden flex-shrink-0" style={{ background: "#F5F5F5" }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3 mb-1">
                    <div>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B" }}>{item.name}</p>
                      {item.weight && <p style={{ fontSize: "0.75rem", color: "#6B6868", marginTop: "0.2rem" }}>{item.weight}</p>}
                      {item.grind && item.grind !== "cekirdek" && (
                        <p style={{ fontSize: "0.72rem", color: "#6B6868" }}>Öğütme: {item.grind}</p>
                      )}
                    </div>
                    <button onClick={() => remove(item.id)} style={{ color: "#6B6868" }} className="hover:opacity-60">
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center" style={{ border: "1px solid #E8E8E8" }}>
                      <button onClick={() => update(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F5]" style={{ color: "#6B6868", borderRight: "1px solid #E8E8E8" }}>
                        <Minus size={11} />
                      </button>
                      <span className="w-8 text-center" style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#2C2B2B" }}>{item.qty}</span>
                      <button onClick={() => update(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F5]" style={{ color: "#6B6868", borderLeft: "1px solid #E8E8E8" }}>
                        <Plus size={11} />
                      </button>
                    </div>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B" }}>
                      ₺{(item.price * item.qty).toLocaleString("tr-TR")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/magazin" style={{ fontSize: "0.8125rem", color: "#6B6868", textDecoration: "underline", textUnderlineOffset: "3px", display: "inline-block", marginTop: "1.5rem" }}>
              ← Alışverişe devam et
            </Link>
          </div>

          {/* Özet */}
          <div>
            <div className="sticky top-24">
              <p className="label-ink mb-6">Sipariş Özeti</p>

              <div className="flex mb-6">
                <input
                  type="text" placeholder="İndirim kodu" value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  className="input flex-1" style={{ fontSize: "0.8125rem" }}
                />
                <button
                  onClick={() => { if (coupon === "DEARKO20") setApplied(true) }}
                  style={{ background: "#3D3B38", color: "#fff", border: "none", padding: "0 1rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer", flexShrink: 0 }}>
                  Uygula
                </button>
              </div>
              {applied && (
                <p style={{ fontSize: "0.75rem", color: "#5CADD4", marginBottom: "1rem" }}>✓ DEARKO20 uygulandı — %10 indirim</p>
              )}

              <div className="space-y-3 mb-5" style={{ fontSize: "0.8125rem" }}>
                <div className="flex justify-between" style={{ color: "#6B6868" }}>
                  <span>Ara Toplam</span><span>₺{total.toLocaleString("tr-TR")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between" style={{ color: "#6B6868" }}>
                    <span>İndirim</span><span>−₺{discount.toLocaleString("tr-TR")}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ color: "#6B6868" }}>
                  <span>Kargo</span><span>{shipping === 0 ? "Ücretsiz" : `₺${shipping}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 mb-6" style={{ borderTop: "1px solid #2C2B2B", borderBottom: "1px solid #E8E8E8" }}>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B" }}>Toplam</span>
                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 800, fontSize: "1.75rem", color: "#2C2B2B", lineHeight: 1 }}>
                  ₺{grandTotal.toLocaleString("tr-TR")}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-dark w-full justify-center"
                style={{ opacity: loading ? 0.6 : 1 }}>
                {loading ? "Yönlendiriliyor…" : "Ödemeye Geç"}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <ShieldCheck size={13} style={{ color: "#6B6868" }} />
                <p style={{ fontSize: "0.72rem", color: "#6B6868" }}>SSL şifreli güvenli ödeme</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
