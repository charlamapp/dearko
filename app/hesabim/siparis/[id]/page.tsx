"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Check, Package, Truck, ChevronLeft } from "lucide-react"

type Order = {
  id: string
  status: string
  total: number
  items: { id: string; name: string; price: number; qty: number; image: string; weight?: string }[]
  tracking_number: string | null
  tracking_carrier: string | null
  shipping_address: { name: string; email: string; phone?: string; address: string; city: string } | null
  created_at: string
}

const steps = [
  { key: "paid",      label: "Sipariş Alındı" },
  { key: "preparing", label: "Hazırlanıyor" },
  { key: "shipped",   label: "Kargoya Verildi" },
  { key: "delivered", label: "Teslim Edildi" },
]

const stepIndex: Record<string, number> = {
  pending: -1, paid: 0, preparing: 1, shipped: 2, delivered: 3,
}

export default function SiparisDetay() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/giris"); return }
      const { data } = await supabase.from("orders").select("*").eq("id", id).eq("user_id", user.id).single()
      setOrder(data)
      setLoading(false)
    }
    load()
  }, [id, router])

  if (loading) return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "5.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!order) return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "5.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="text-center">
        <p style={{ fontSize: "0.875rem", color: "#6B6868", marginBottom: "1rem" }}>Sipariş bulunamadı.</p>
        <Link href="/hesabim" className="btn-dark">Hesabıma Dön</Link>
      </div>
    </div>
  )

  const currentStep = stepIndex[order.status] ?? -1
  const isShipped = currentStep >= 2

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "5.5rem" }}>

      <section className="pt-10 pb-8" style={{ borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <Link href="/hesabim" className="flex items-center gap-1.5 mb-6"
            style={{ fontSize: "0.8125rem", color: "#6B6868", textDecoration: "none" }}>
            <ChevronLeft size={14} /> Siparişlerime Dön
          </Link>
          <p className="label mb-2">Sipariş Detayı</p>
          <h1 className="heading-lg">#{order.id.slice(0, 8).toUpperCase()}</h1>
          <p style={{ fontSize: "0.8125rem", color: "#6B6868", marginTop: "0.3rem" }}>
            {new Date(order.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Sol — Kargo takip + ürünler */}
          <div className="lg:col-span-2 space-y-8">

            {/* Adım göstergesi */}
            {order.status !== "cancelled" && order.status !== "pending" && (
              <div style={{ border: "1px solid #E8E8E8", background: "#fff", padding: "1.5rem 2rem" }}>
                <p className="label-ink mb-6">Sipariş Durumu</p>
                <div className="flex items-start gap-0">
                  {steps.map((step, i) => {
                    const done = i <= currentStep
                    const active = i === currentStep
                    return (
                      <div key={step.key} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center w-full">
                            {i > 0 && (
                              <div style={{ flex: 1, height: "2px", background: i <= currentStep ? "#5CADD4" : "#E8E8E8" }} />
                            )}
                            <div style={{
                              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                              background: done ? "#5CADD4" : "#FFFFFF",
                              border: `2px solid ${done ? "#5CADD4" : "#E8E8E8"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {done && <Check size={13} color="white" strokeWidth={3} />}
                            </div>
                            {i < steps.length - 1 && (
                              <div style={{ flex: 1, height: "2px", background: i < currentStep ? "#5CADD4" : "#E8E8E8" }} />
                            )}
                          </div>
                          <p style={{
                            fontSize: "0.7rem", fontFamily: "var(--font-inter)", fontWeight: active ? 700 : 500,
                            color: done ? "#2C2B2B" : "#6B6868", textAlign: "center", marginTop: "0.5rem",
                            letterSpacing: "0.03em",
                          }}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Kargo takip */}
            {isShipped && order.tracking_number && (
              <div style={{ border: "1px solid #5CADD4", background: "#EFF8FE", padding: "1.25rem 1.5rem" }}>
                <div className="flex items-start gap-3">
                  <Truck size={18} style={{ color: "#5CADD4", flexShrink: 0, marginTop: "0.1rem" }} />
                  <div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#2C2B2B", marginBottom: "0.25rem" }}>
                      {order.tracking_carrier ?? "Kargo"}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#2C2B2B" }}>
                      Takip No:{" "}
                      <span style={{ fontFamily: "var(--font-inter)", fontWeight: 700, letterSpacing: "0.05em" }}>
                        {order.tracking_number}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ürünler */}
            <div style={{ border: "1px solid #E8E8E8", background: "#fff" }}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid #E8E8E8" }}>
                <p className="label-ink">Ürünler</p>
              </div>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4" style={{ borderBottom: i < order.items.length - 1 ? "1px solid #E8E8E8" : undefined }}>
                  <div className="w-14 h-14 flex-shrink-0 overflow-hidden" style={{ background: "#F5F5F5" }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B" }}>{item.name}</p>
                    {item.weight && <p style={{ fontSize: "0.75rem", color: "#6B6868" }}>{item.weight}</p>}
                  </div>
                  <div className="text-right">
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#2C2B2B" }}>₺{item.price}</p>
                    <p style={{ fontSize: "0.75rem", color: "#6B6868" }}>x{item.qty}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Sağ — Özet */}
          <div className="space-y-5">
            <div style={{ border: "1px solid #E8E8E8", background: "#fff", padding: "1.5rem" }}>
              <p className="label-ink mb-5">Sipariş Özeti</p>
              <div className="space-y-3 pb-4" style={{ borderBottom: "1px solid #E8E8E8" }}>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between" style={{ fontSize: "0.8125rem" }}>
                    <span style={{ color: "#6B6868" }}>{item.name} x{item.qty}</span>
                    <span style={{ color: "#2C2B2B", fontWeight: 500 }}>₺{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#2C2B2B" }}>Toplam</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "1.1rem", fontWeight: 800, color: "#2C2B2B" }}>₺{(order.total / 100).toLocaleString("tr-TR")}</span>
              </div>
            </div>

            {order.shipping_address && (
              <div style={{ border: "1px solid #E8E8E8", background: "#fff", padding: "1.5rem" }}>
                <p className="label-ink mb-4">Teslimat Adresi</p>
                <div style={{ fontSize: "0.8125rem", color: "#6B6868", lineHeight: 1.7 }}>
                  <p style={{ color: "#2C2B2B", fontWeight: 600 }}>{order.shipping_address.name}</p>
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.city}</p>
                  <p>{order.shipping_address.email}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
