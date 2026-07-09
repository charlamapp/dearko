"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Check, Clock } from "lucide-react"
import { useCart } from "@/lib/cart"

type Summary = {
  paid: boolean
  total: number // kuruş
  email: string | null
  name: string | null
  items: { name: string; qty: number; amount: number }[]
}

function Confirmation() {
  const { clear } = useCart()
  const params = useSearchParams()
  const sessionId = params.get("session_id")
  const [state, setState] = useState<"loading" | "paid" | "pending" | "error">("loading")
  const [summary, setSummary] = useState<Summary | null>(null)

  useEffect(() => {
    if (!sessionId) { setState("error"); return }
    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data: Summary & { error?: string }) => {
        if (data.error) { setState("error"); return }
        setSummary(data)
        if (data.paid) {
          clear() // sepet yalnızca ödeme doğrulanınca temizlenir
          setState("paid")
        } else {
          setState("pending")
        }
      })
      .catch(() => setState("error"))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  if (state === "loading") return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (state === "error") return (
    <div style={{ maxWidth: "480px", width: "100%", padding: "2rem", textAlign: "center", margin: "0 auto" }}>
      <p className="label mb-3">Bir sorun oluştu</p>
      <h1 className="heading-lg mb-4">Siparişinizi doğrulayamadık.</h1>
      <p className="body-lg mb-10" style={{ color: "#6B6868" }}>
        Ödemeniz alındıysa siparişiniz hesabınızda görünecektir. Görünmüyorsa bizimle iletişime geçin.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/hesabim" className="btn-dark">Siparişlerimi Gör</Link>
        <Link href="/iletisim" className="btn-outline">İletişim</Link>
      </div>
    </div>
  )

  if (state === "pending") return (
    <div style={{ maxWidth: "480px", width: "100%", padding: "2rem", textAlign: "center", margin: "0 auto" }}>
      <div className="w-16 h-16 flex items-center justify-center mx-auto mb-8" style={{ background: "#F5F5F5" }}>
        <Clock size={26} style={{ color: "#6B6868" }} />
      </div>
      <p className="label mb-3">Ödeme bekleniyor</p>
      <h1 className="heading-lg mb-4">Ödemeniz henüz tamamlanmadı.</h1>
      <p className="body-lg mb-10" style={{ color: "#6B6868" }}>
        Ödeme işlemi tamamlanmadıysa sepetinizden tekrar deneyebilirsiniz.
      </p>
      <Link href="/sepet" className="btn-dark">Sepete Dön</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: "520px", width: "100%", padding: "2rem", margin: "0 auto" }}>
      <div className="text-center">
        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-8" style={{ background: "#6C8145" }}>
          <Check size={28} color="white" strokeWidth={2.5} />
        </div>
        <p className="label mb-3">Teşekkürler{summary?.name ? `, ${summary.name.split(" ")[0]}` : ""}</p>
        <h1 className="heading-lg mb-4">Siparişiniz alındı.</h1>
        <p className="body-lg mb-8" style={{ color: "#6B6868" }}>
          {summary?.email ? `Onay e-postanız ${summary.email} adresine gönderilecek. ` : ""}
          Kargo bilgilerinizi hesabınızdan takip edebilirsiniz.
        </p>
      </div>

      {summary && summary.items.length > 0 && (
        <div className="mb-10 text-left" style={{ border: "1px solid #E8E8E8" }}>
          {summary.items.map((it, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-4 py-3"
              style={{ borderBottom: "1px solid #F0F0F0" }}>
              <p style={{ fontSize: "0.8125rem", color: "#2C2B2B", fontFamily: "var(--font-inter)", fontWeight: 500 }}>
                {it.name}{it.qty > 1 ? ` ×${it.qty}` : ""}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "#6B6868", flexShrink: 0 }}>
                ₺{(it.amount / 100).toLocaleString("tr-TR")}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3" style={{ background: "#FAFAFA" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 700, color: "#2C2B2B" }}>Toplam</p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 800, color: "#2C2B2B" }}>
              ₺{(summary.total / 100).toLocaleString("tr-TR")}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/hesabim" className="btn-dark">Siparişlerimi Gör</Link>
        <Link href="/magazin" className="btn-outline">Alışverişe Devam</Link>
      </div>
    </div>
  )
}

export default function SiparisTamamlandiPage() {
  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: "6.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Suspense fallback={
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Confirmation />
      </Suspense>
    </div>
  )
}
